import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { isAuthenticated, requireAuth } from "@/lib/auth-service";

interface RouteGuardProps {
  children: React.ReactNode;
}

const RouteGuard = ({ children }: RouteGuardProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [authChecked, setAuthChecked] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false);

  // Función para validar autenticación
  const validateAuth = () => {
    const publicRoutes = [
      "/",
      "/login",
      "/register",
      "/validar-identidad",
      "/forgot-password",
      "/reset-password",
      "/demo",
    ];

    const isPublicRoute = publicRoutes.some(
      (route) =>
        location.pathname === route || location.pathname.startsWith(route),
    );

    console.log(
      "RouteGuard: Validating auth for",
      location.pathname,
      "isPublic:",
      isPublicRoute,
    );

    // Si intenta acceder a rutas protegidas
    if (!isPublicRoute) {
      if (!requireAuth()) {
        console.log(
          "Access denied: No valid authentication for protected route:",
          location.pathname,
        );
        setIsAuthorized(false);
        setAuthChecked(true);
        navigate("/login", { replace: true });
        return false;
      } else {
        console.log(
          "Access granted: Valid authentication for protected route:",
          location.pathname,
        );
        setIsAuthorized(true);
      }
    } else {
      // Es ruta pública
      setIsAuthorized(true);
    }

    // Si está autenticado y trata de acceder al login, redirigir al dashboard
    if (
      (location.pathname === "/" || location.pathname === "/login") &&
      isAuthenticated()
    ) {
      navigate("/dashboard", { replace: true });
    }

    setAuthChecked(true);
    return true;
  };

  // Validar autenticación en cada cambio de ruta
  useEffect(() => {
    validateAuth();
  }, [location.pathname, navigate]);

  // Escuchar eventos de logout
  useEffect(() => {
    const handleLogout = () => {
      console.log("Logout event detected, redirecting to login");
      setAuthChecked(false);
      navigate("/login", { replace: true });
    };

    // Escuchar evento personalizado de logout
    window.addEventListener("userLoggedOut", handleLogout);

    // Validar autenticación cada vez que la ventana obtiene el foco
    const handleFocus = () => {
      validateAuth();
    };

    window.addEventListener("focus", handleFocus);

    // Validar autenticación en eventos de navegación del navegador
    const handlePopState = () => {
      setTimeout(validateAuth, 100); // Pequeño delay para que la ruta se actualice
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("userLoggedOut", handleLogout);
      window.removeEventListener("focus", handleFocus);
      window.removeEventListener("popstate", handlePopState);
    };
  }, [navigate]);

  // No renderizar hasta que se haya validado la autenticación
  if (!authChecked) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Verificando autenticación...</p>
        </div>
      </div>
    );
  }

  // Si no está autorizado, NO renderizar contenido protegido
  if (!isAuthorized) {
    const publicRoutes = [
      "/",
      "/login",
      "/register",
      "/validar-identidad",
      "/forgot-password",
      "/reset-password",
      "/demo",
    ];

    const isPublicRoute = publicRoutes.some(
      (route) =>
        location.pathname === route || location.pathname.startsWith(route),
    );

    // Si es ruta protegida y no autorizado, mostrar mensaje de acceso denegado
    if (!isPublicRoute) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-white">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-slate-900 mb-2">
              Acceso Denegado
            </h2>
            <p className="text-slate-600 mb-4">
              Tu sesión ha expirado o no tienes permisos para acceder a esta
              página.
            </p>
            <button
              onClick={() => navigate("/login", { replace: true })}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Ir al Login
            </button>
          </div>
        </div>
      );
    }
  }

  return <>{children}</>;
};

export default RouteGuard;
