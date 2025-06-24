import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getCurrentUser, requireAuth, hasRole } from "@/lib/auth-service";

interface AdminProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?:
    | "super_admin"
    | "atencion_miembro"
    | "anfitrion"
    | "monitor"
    | "mercadeo";
}

const AdminProtectedRoute = ({
  children,
  requiredRole = "mercadeo",
}: AdminProtectedRouteProps) => {
  const navigate = useNavigate();

  useEffect(() => {
    // Verificar autenticación
    if (!requireAuth()) {
      navigate("/login");
      return;
    }

    // Verificar permisos de rol
    if (!hasRole(requiredRole)) {
      const currentUser = getCurrentUser();

      // Si es usuario regular, redirigir al dashboard público
      if (currentUser?.role === "user") {
        navigate("/dashboard");
        return;
      }

      // Si no tiene permisos suficientes
      navigate("/dashboard");
      return;
    }
  }, [navigate, requiredRole]);

  const currentUser = getCurrentUser();

  // Renderizar solo si está autenticado y tiene permisos
  if (!requireAuth() || !hasRole(requiredRole)) {
    return null;
  }

  return <>{children}</>;
};

export default AdminProtectedRoute;
