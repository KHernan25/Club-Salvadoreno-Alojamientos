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
    // List of public routes that don't require "authentication"
    const publicRoutes = [
      "/",
      "/login",
      "/register",
      "/validar-identidad",
      "/forgot-password",
      "/reset-password",
      "/demo",
    ];

    // If the current route is not public and we're not "authenticated"
    // In a real app, you'd check actual authentication state
    // For demo purposes, we'll just ensure the flow starts with login
    const isPublicRoute = publicRoutes.some(
      (route) =>
        location.pathname === route || location.pathname.startsWith(route),
    );

    // If user tries to access protected routes directly, redirect to login
    if (!isPublicRoute) {
      const hasVisitedLogin = sessionStorage.getItem("visitedLogin");
      if (!hasVisitedLogin) {
        navigate("/", { replace: true });
      }
    }

    // Mark that user has visited login page
    if (location.pathname === "/" || location.pathname === "/login") {
      sessionStorage.setItem("visitedLogin", "true");
    }
  }, [location.pathname, navigate]);

  return <>{children}</>;
};

export default RouteGuard;
