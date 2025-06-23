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

    // Si intenta acceder a rutas protegidas sin autenticación
    if (!isPublicRoute) {
      if (!requireAuth()) {
        console.log(
          "Access denied: No valid authentication for protected route",
        );
        navigate("/login", { replace: true });
        return;
      }
    }

    // Si está autenticado y trata de acceder al login, redirigir al dashboard
    if (
      (location.pathname === "/" || location.pathname === "/login") &&
      isAuthenticated()
    ) {
      navigate("/dashboard", { replace: true });
    }

    setAuthChecked(true);
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

  return <>{children}</>;
};

export default RouteGuard;
