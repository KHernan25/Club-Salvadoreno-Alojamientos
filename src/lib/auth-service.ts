// Servicio de autenticación para manejo de login y sesiones

import { User, isValidUser, updateLastLogin } from "./user-database";

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
  // Simular delay de red/validación
  await new Promise((resolve) => setTimeout(resolve, 800));

  const { username, password, rememberMe = false } = credentials;

  // Validar que no estén vacíos
  if (!username.trim() || !password.trim()) {
    return {
      success: false,
      error: "Por favor ingresa tu correo/usuario y contraseña",
    };
  }

  // Verificar credenciales
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
export const logout = (): void => {
  // Limpiar todos los datos de sesión
  sessionStorage.removeItem(SESSION_KEY);
  localStorage.removeItem(REMEMBER_KEY);

  // Limpiar cualquier otro dato relacionado con la sesión
  sessionStorage.clear();

  // Disparar evento personalizado para notificar el logout
  window.dispatchEvent(new CustomEvent("userLoggedOut"));

  // Limpiar historial para prevenir navegación hacia atrás
  if (window.history.replaceState) {
    window.history.replaceState(null, "", "/login");
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
    // Verificar autenticación básica
    if (!isAuthenticated()) {
      console.log("requireAuth: Not authenticated");
      logout(); // Limpiar cualquier sesión corrupta
      return false;
    }

    // Verificar validez de sesión
    if (!isSessionValid()) {
      console.log("requireAuth: Session invalid");
      logout(); // Limpiar sesión inválida
      return false;
    }

    // Verificar que el usuario actual exista
    const currentUser = getCurrentUser();
    if (!currentUser) {
      console.log("requireAuth: No current user");
      logout(); // Limpiar sesión sin usuario
      return false;
    }

    // Verificar que el usuario esté activo
    if (!currentUser.isActive) {
      console.log("requireAuth: User is not active");
      logout(); // Limpiar sesión de usuario inactivo
      return false;
    }

    return true;
  } catch (error) {
    console.error("requireAuth: Error validating session", error);
    logout(); // Limpiar en caso de error
    return false;
  }
};

// Verificar permisos por rol
export const hasRole = (requiredRole: User["role"]): boolean => {
  const user = getCurrentUser();
  if (!user) return false;

  const roleHierarchy = {
    admin: 3,
    staff: 2,
    user: 1,
  };

  const userLevel = roleHierarchy[user.role] || 0;
  const requiredLevel = roleHierarchy[requiredRole] || 0;

  return userLevel >= requiredLevel;
};

// Función para desarrollo - obtener credenciales de prueba
export const getTestCredentials = () => {
  const { getAvailableCredentials } = require("./user-database");
  return getAvailableCredentials();
};
