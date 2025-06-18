import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { isAuthenticated, requireAuth } from "@/lib/auth-service";

interface RouteGuardProps {
  children: React.ReactNode;
}

const RouteGuard = ({ children }: RouteGuardProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // List of public routes that don't require authentication
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

    // If user tries to access protected routes without authentication
    if (!isPublicRoute) {
      if (!requireAuth()) {
        navigate("/", { replace: true });
        return;
      }
    }

    // If user is authenticated and tries to access login page, redirect to dashboard
    if (
      (location.pathname === "/" || location.pathname === "/login") &&
      isAuthenticated()
    ) {
      navigate("/dashboard", { replace: true });
    }
  }, [location.pathname, navigate]);

  return <>{children}</>;
};

export default RouteGuard;
