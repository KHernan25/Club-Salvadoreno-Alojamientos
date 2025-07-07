// Servicio de autenticación para manejo de login y sesiones

import {
  User,
  isValidUser,
  updateLastLogin,
  getRolePermissions,
} from "./user-database";
import {
  apiLogin,
  apiLogout,
  isApiAvailable,
  clearAuthToken,
} from "./api-service";

export interface LoginCredentials {
  username: string;
  password: string;
  rememberMe?: boolean;
}

export interface AuthResult {
  success: boolean;
  user?: User;
  error?: string;
}

export interface SessionData {
  user: User;
  loginTime: Date;
  rememberMe: boolean;
}

// Clave para localStorage
const SESSION_KEY = "club_salvadoreno_session";
const REMEMBER_KEY = "club_salvadoreno_remember";

// Función principal de autenticación
export const authenticateUser = async (
  credentials: LoginCredentials,
): Promise<AuthResult> => {
  const { username, password, rememberMe = false } = credentials;

  // Validar que no estén vacíos
  if (!username.trim() || !password.trim()) {
    return {
      success: false,
      error: "Por favor ingresa tu correo/usuario y contraseña",
    };
  }

  // Usar API real cuando esté disponible
  const USE_API = true;

  if (USE_API) {
    try {
      console.log("🔍 Checking API availability...");
      const apiConnected = await isApiAvailable();
      console.log("🔍 API available:", apiConnected);

      if (apiConnected) {
        console.log("🔗 Usando autenticación con API real");
        const result = await apiLogin({
          username: username.trim(),
          password,
          rememberMe,
        });

        console.log("📤 API Login result:", {
          success: result.success,
          hasUser: !!result.user,
          hasToken: !!result.token,
        });

        if (result.success && result.user) {
          console.log(
            "✅ API Login successful:",
            result.user.email,
            result.user.role,
          );

          // Verificar estado de aprobación
          if (result.user.status === "pending") {
            return {
              success: false,
              error:
                "Tu cuenta está pendiente de aprobación. Contacta al administrador.",
            };
          }

          if (!result.user.isActive) {
            return {
              success: false,
              error: "Tu cuenta está desactivada. Contacta al administrador.",
            };
          }

          // Verificar que tenemos token antes de crear sesión
          if (!result.token) {
            console.error("❌ API Login success but no token received");
            return {
              success: false,
              error: "Error de autenticación: token no recibido",
            };
          }

          // Crear sesión local para mantener consistencia
          const sessionData: SessionData = {
            user: result.user,
            loginTime: new Date(),
            rememberMe,
          };

          // Guardar en localStorage
          if (rememberMe) {
            localStorage.setItem(REMEMBER_KEY, JSON.stringify(sessionData));
          }
          sessionStorage.setItem(SESSION_KEY, JSON.stringify(sessionData));

          // El token ya se guarda en api-service
          console.log("✅ Token saved, user session created");
          console.log("✅ Session data saved:", {
            userId: result.user.id,
            role: result.user.role,
            loginTime: sessionData.loginTime,
          });

          return {
            success: true,
            user: result.user,
          };
        }

        console.log("❌ API Login failed:", result.error);
        return {
          success: false,
          error: result.error || "Credenciales incorrectas",
        };
      }
    } catch (error) {
      console.warn("⚠️ API error, fallback to local auth:", error);
      // Forzar fallback a autenticación local
    }
  }

  // Fallback a autenticación local (modo desarrollo)
  console.log("🔄 Usando autenticación local de desarrollo");

  // Simular delay de red/validación
  await new Promise((resolve) => setTimeout(resolve, 800));

  // Verificar credenciales locales
  const user = isValidUser(username.trim(), password);

  if (!user) {
    // Verificar si el usuario existe pero la contraseña es incorrecta
    const { findUserByUsername, findUserByEmail } = await import(
      "./user-database"
    );
    const existingUserByUsername = findUserByUsername(username.trim());
    const existingUserByEmail = findUserByEmail(username.trim());
    const existingUser = existingUserByUsername || existingUserByEmail;

    if (existingUser && !existingUser.isActive) {
      return {
        success: false,
        error: "Tu cuenta está desactivada. Contacta al administrador.",
      };
    }

    if (existingUser) {
      return {
        success: false,
        error: "Contraseña incorrecta. Verifica tus credenciales.",
      };
    }

    return {
      success: false,
      error: "Usuario o correo no encontrado. Verifica tus datos.",
    };
  }

  // Autenticación exitosa
  console.log(
    "✅ Local auth successful for:",
    user.fullName,
    "Role:",
    user.role,
  );
  updateLastLogin(user.id);

  // Crear sesión
  const sessionData: SessionData = {
    user,
    loginTime: new Date(),
    rememberMe,
  };

  // Guardar en localStorage
  if (rememberMe) {
    localStorage.setItem(REMEMBER_KEY, JSON.stringify(sessionData));
  }
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(sessionData));

  console.log("✅ Local session created:", {
    userId: user.id,
    role: user.role,
    fullName: user.fullName,
    rememberMe,
    loginTime: sessionData.loginTime,
  });

  return {
    success: true,
    user,
  };
};

// Obtener sesión actual
export const getCurrentSession = (): SessionData | null => {
  try {
    // Primero verificar sessionStorage
    const sessionData = sessionStorage.getItem(SESSION_KEY);
    if (sessionData) {
      return JSON.parse(sessionData);
    }

    // Si no hay en sessionStorage, verificar localStorage (remember me)
    const rememberedData = localStorage.getItem(REMEMBER_KEY);
    if (rememberedData) {
      const data = JSON.parse(rememberedData);
      // Restaurar a sessionStorage
      sessionStorage.setItem(SESSION_KEY, rememberedData);
      return data;
    }

    return null;
  } catch (error) {
    console.error("Error reading session:", error);
    return null;
  }
};

// Verificar si el usuario está autenticado
export const isAuthenticated = (): boolean => {
  const session = getCurrentSession();
  return session !== null;
};

// Obtener usuario actual
export const getCurrentUser = (): User | null => {
  const session = getCurrentSession();
  return session?.user || null;
};

// Cerrar sesión
export const logout = async (): Promise<void> => {
  // Primero limpiar datos locales para prevenir loops
  sessionStorage.removeItem(SESSION_KEY);
  localStorage.removeItem(REMEMBER_KEY);
  sessionStorage.clear();
  clearAuthToken(); // Limpiar token de API

  // Disparar evento personalizado para notificar el logout INMEDIATAMENTE
  // Esto permite que los guards reaccionen rápido
  window.dispatchEvent(new CustomEvent("userLoggedOut"));

  // Realizar limpieza de API en segundo plano sin bloquear
  // No usar await para que sea no bloqueante
  try {
    // Intentar cerrar sesión con API real en segundo plano
    const apiConnected = await isApiAvailable();
    if (apiConnected) {
      console.log("🔗 Cerrando sesión con API real (en segundo plano)");
      // Timeout rápido para evitar demoras
      Promise.race([
        apiLogout(),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error("Timeout")), 2000),
        ),
      ]).catch((error) => {
        console.warn(
          "⚠️ API logout falló, pero sesión local ya está limpia:",
          error,
        );
      });
    }
  } catch (error) {
    console.warn(
      "⚠️ API logout falló, pero sesión local ya está limpia:",
      error,
    );
  }

  // Limpiar historial para prevenir navegación hacia atrás
  if (window.history.replaceState) {
    // Detectar si estamos en contexto de backoffice
    const isBackofficeContext =
      window.location.pathname.startsWith("/admin") ||
      window.location.pathname.startsWith("/backoffice");

    const loginPath = isBackofficeContext ? "/backoffice/login" : "/login";
    window.history.replaceState(null, "", loginPath);
  }
};

// Verificar si la sesión es válida (no expirada, etc.)
export const isSessionValid = (): boolean => {
  const session = getCurrentSession();
  if (!session) return false;

  // En una aplicación real, aquí verificarías:
  // - Tiempo de expiración
  // - Validez del token con el servidor
  // - Estado activo del usuario

  return true;
};

// Renovar sesión
export const renewSession = (): void => {
  const session = getCurrentSession();
  if (session) {
    session.loginTime = new Date();
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));

    if (session.rememberMe) {
      localStorage.setItem(REMEMBER_KEY, JSON.stringify(session));
    }
  }
};

// Función helper para proteger rutas
export const requireAuth = (): boolean => {
  try {
    console.log("🔐 requireAuth: Iniciando verificación de autenticación");

    // Verificar autenticación básica
    const authenticated = isAuthenticated();
    console.log("🔐 requireAuth: isAuthenticated() =", authenticated);

    if (!authenticated) {
      console.log("❌ requireAuth: No autenticado, limpiando sesión");
      logout(); // Limpiar cualquier sesión corrupta
      return false;
    }

    // Verificar validez de sesión
    const sessionValid = isSessionValid();
    console.log("🔐 requireAuth: isSessionValid() =", sessionValid);

    if (!sessionValid) {
      console.log("❌ requireAuth: Sesión inválida, limpiando");
      logout(); // Limpiar sesión inválida
      return false;
    }

    // Verificar que el usuario actual exista
    const currentUser = getCurrentUser();
    console.log("🔐 requireAuth: getCurrentUser() =", {
      exists: !!currentUser,
      id: currentUser?.id,
      role: currentUser?.role,
      isActive: currentUser?.isActive,
    });

    if (!currentUser) {
      console.log("❌ requireAuth: No hay usuario actual, limpiando sesión");
      logout(); // Limpiar sesión sin usuario
      return false;
    }

    // Verificar que el usuario esté activo
    if (!currentUser.isActive) {
      console.log("❌ requireAuth: Usuario inactivo, limpiando sesión");
      logout(); // Limpiar sesión de usuario inactivo
      return false;
    }

    // Verificar que tenemos token para API (importante para admin routes)
    const { getAuthToken } = require("./api-service");
    const token = getAuthToken();
    console.log(
      "🔐 requireAuth: getAuthToken() =",
      !!token ? "existe" : "no existe",
    );

    if (!token) {
      console.log(
        "⚠️ requireAuth: No hay token de API, pero permitiendo acceso local",
      );
      // No forzar logout por falta de token en modo desarrollo
      // return false;
    }

    console.log("✅ requireAuth: Autenticación exitosa");
    return true;
  } catch (error) {
    console.error("❌ requireAuth: Error validando sesión", error);
    logout(); // Limpiar en caso de error
    return false;
  }
};

// Verificar permisos por rol
export const hasRole = (requiredRole: User["role"]): boolean => {
  const user = getCurrentUser();
  if (!user) return false;

  const roleHierarchy = {
    super_admin: 5,
    atencion_miembro: 4,
    anfitrion: 3,
    monitor: 2,
    mercadeo: 2,
    user: 1,
  };

  const userLevel = roleHierarchy[user.role] || 0;
  const requiredLevel = roleHierarchy[requiredRole] || 0;

  return userLevel >= requiredLevel;
};

// Verificar permisos específicos
export const hasPermission = (permission: string): boolean => {
  const user = getCurrentUser();
  if (!user) return false;

  const permissions = getRolePermissions(user.role);

  return permissions[permission as keyof typeof permissions] || false;
};

// Verificar si el usuario es super admin
export const isSuperAdmin = (): boolean => {
  const user = getCurrentUser();
  return user?.role === "super_admin" || false;
};

// Función para desarrollo - obtener credenciales de prueba
export const getTestCredentials = () => {
  const { getAvailableCredentials } = require("./user-database");
  return getAvailableCredentials();
};
