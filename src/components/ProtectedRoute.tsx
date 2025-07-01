// Componente de alto nivel para proteger páginas que requieren autenticación

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  isAuthenticated,
  requireAuth,
  getCurrentUser,
} from "@/lib/auth-service";

interface ProtectedRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
}

const ProtectedRoute = ({
  children,
  redirectTo = "/login",
}: ProtectedRouteProps) => {
  const navigate = useNavigate();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      console.log("ProtectedRoute: Checking authentication...");

      // Triple verificación de seguridad
      try {
        // 1. Verificar autenticación básica
        if (!isAuthenticated()) {
          console.log("ProtectedRoute: Not authenticated");
          navigate(redirectTo, { replace: true });
          return;
        }

        // 2. Verificar con requireAuth (más estricto)
        if (!requireAuth()) {
          console.log("ProtectedRoute: requireAuth failed");
          navigate(redirectTo, { replace: true });
          return;
        }

        // 3. Verificar usuario actual
        const user = getCurrentUser();
        if (!user) {
          console.log("ProtectedRoute: No current user");
          navigate(redirectTo, { replace: true });
          return;
        }

        // 4. Verificar que el usuario esté activo
        if (!user.isActive) {
          console.log("ProtectedRoute: User is not active");
          navigate(redirectTo, { replace: true });
          return;
        }

        console.log(
          "ProtectedRoute: Authentication successful for:",
          user.username,
        );
        setIsAuthorized(true);
      } catch (error) {
        console.error(
          "ProtectedRoute: Error during authentication check:",
          error,
        );
        navigate(redirectTo, { replace: true });
      } finally {
        setIsChecking(false);
      }
    };

    checkAuth();

    // Verificar autenticación cuando la ventana obtiene foco
    const handleFocus = () => {
      checkAuth();
    };

    // Escuchar evento de logout
    const handleLogout = () => {
      console.log("ProtectedRoute: Logout detected, redirecting");
      setIsAuthorized(false);
      setIsChecking(false); // Evitar pantalla de loading
      navigate(redirectTo, { replace: true });
    };

    window.addEventListener("focus", handleFocus);
    window.addEventListener("userLoggedOut", handleLogout);

    return () => {
      window.removeEventListener("focus", handleFocus);
      window.removeEventListener("userLoggedOut", handleLogout);
    };
  }, [navigate, redirectTo]);

  // Mostrar loading mientras se verifica
  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
          <p className="text-slate-600 text-sm">Cargando...</p>
        </div>
      </div>
    );
  }

  // Si no está autorizado, no mostrar nada (redirección en curso)
  if (!isAuthorized) {
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
            No tienes permisos para acceder a esta página.
          </p>
          <button
            onClick={() => navigate(redirectTo, { replace: true })}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Ir al Login
          </button>
        </div>
      </div>
    );
  }

  // Solo renderizar el contenido si está completamente autorizado
  return <>{children}</>;
};

export default ProtectedRoute;
