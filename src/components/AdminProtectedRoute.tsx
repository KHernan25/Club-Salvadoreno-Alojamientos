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
      navigate("/backoffice/login");
      return;
    }

    // Verificar permisos de rol
    if (!hasRole(requiredRole)) {
      const currentUser = getCurrentUser();

      // Si es miembro regular, redirigir al dashboard público
      if (currentUser?.role === "miembro") {
        navigate("/dashboard");
        return;
      }

      // Si no tiene permisos suficientes pero es staff, mantener en backoffice
      if (
        currentUser &&
        [
          "super_admin",
          "atencion_miembro",
          "anfitrion",
          "monitor",
          "mercadeo",
          "recepcion",
        ].includes(currentUser.role)
      ) {
        navigate("/admin/dashboard");
        return;
      }

      // Si no es staff, redirigir al login del backoffice
      navigate("/backoffice/login");
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
