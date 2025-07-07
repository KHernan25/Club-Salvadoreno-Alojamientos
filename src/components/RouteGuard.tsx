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

  // Lista de rutas públicas que no requieren autenticación
  const publicRoutes = [
    "/",
    "/login",
    "/register",
    "/validar-identidad",
    "/forgot-password",
    "/reset-password",
    "/demo",
    "/navigation-demo",
    "/translation-test",
    "/country-club",
    "/alojamientos",
    "/apartamento",
    "/casa",
    "/suite",
    "/corinto",
    "/el-sunzal",
    "/backoffice",
    "/backoffice/login",
  ];

  // Función para verificar si es ruta pública
  const isPublicRoute = (pathname: string) => {
    return publicRoutes.some(
      (route) => pathname === route || pathname.startsWith(route + "/"),
    );
  };

  // Validar autenticación solo para rutas protegidas
  useEffect(() => {
    const currentPath = location.pathname;

    console.log("RouteGuard: Checking", currentPath);

    // Si es ruta pública, permitir acceso inmediatamente
    if (isPublicRoute(currentPath)) {
      console.log("RouteGuard: Public route, allowing access");
      setAuthChecked(true);
      return;
    }

    // Si es ruta protegida, verificar autenticación
    if (!requireAuth()) {
      // Detectar si estamos en contexto de backoffice
      const isBackofficeContext =
        currentPath.startsWith("/admin") ||
        currentPath.startsWith("/backoffice");

      const loginPath = isBackofficeContext ? "/backoffice/login" : "/login";
      console.log(
        `RouteGuard: Protected route, auth failed, redirecting to ${loginPath} (context: ${isBackofficeContext ? "backoffice" : "main"})`,
      );
      navigate(loginPath, { replace: true });
      return;
    }

    console.log("RouteGuard: Protected route, auth success");
    setAuthChecked(true);
  }, [location.pathname, navigate]);

  // Escuchar eventos de logout
  useEffect(() => {
    const handleLogout = () => {
      console.log("RouteGuard: Logout detected, redirecting to login");
      setAuthChecked(false);

      // Detectar si estamos en contexto de backoffice
      const isBackofficeContext =
        location.pathname.startsWith("/admin") ||
        location.pathname.startsWith("/backoffice");

      const loginPath = isBackofficeContext ? "/backoffice/login" : "/login";
      console.log(
        `RouteGuard: Redirecting to ${loginPath} (context: ${isBackofficeContext ? "backoffice" : "main"})`,
      );

      navigate(loginPath, { replace: true });
    };

    window.addEventListener("userLoggedOut", handleLogout);

    return () => {
      window.removeEventListener("userLoggedOut", handleLogout);
    };
  }, [navigate, location.pathname]);

  // Mostrar loading solo para rutas protegidas mientras se valida
  if (!authChecked && !isPublicRoute(location.pathname)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
          <p className="text-slate-600 text-sm">Verificando acceso...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default RouteGuard;
