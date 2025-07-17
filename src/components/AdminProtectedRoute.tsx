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
  allowedRoles?: string[]; // Para permitir múltiples roles
}

const AdminProtectedRoute = ({
  children,
  requiredRole = "mercadeo",
  allowedRoles,
}: AdminProtectedRouteProps) => {
  const navigate = useNavigate();

  useEffect(() => {
    console.log(
      "🛡️ AdminProtectedRoute: Verificando acceso para rol:",
      requiredRole,
    );

    // Verificar autenticación
    const isAuth = requireAuth();
    console.log("🛡️ AdminProtectedRoute: requireAuth() =", isAuth);

    if (!isAuth) {
      console.log(
        "❌ AdminProtectedRoute: No autenticado, redirigiendo a backoffice login",
      );
      navigate("/backoffice/login");
      return;
    }

    const currentUser = getCurrentUser();
    console.log("🛡️ AdminProtectedRoute: Usuario actual:", {
      id: currentUser?.id,
      role: currentUser?.role,
      fullName: currentUser?.fullName,
    });

    // Verificar permisos de rol
    let hasRequiredRole: boolean;

    if (allowedRoles && allowedRoles.length > 0) {
      // Si se especifican roles permitidos, verificar si el usuario tiene alguno de ellos
      hasRequiredRole = allowedRoles.some((role) => hasRole(role));
      console.log(
        "🛡️ AdminProtectedRoute: Verificando roles permitidos:",
        allowedRoles,
        "Resultado:",
        hasRequiredRole,
      );
    } else {
      // Verificación tradicional con un solo rol requerido
      hasRequiredRole = hasRole(requiredRole);
      console.log(
        "🛡️ AdminProtectedRoute: hasRole(" + requiredRole + ") =",
        hasRequiredRole,
      );
    }

    if (!hasRequiredRole) {
      console.log("❌ AdminProtectedRoute: Usuario sin permisos suficientes");

      // Si es miembro regular, redirigir al dashboard público
      if (currentUser?.role === "miembro") {
        console.log(
          "↪️ AdminProtectedRoute: Miembro regular, redirigiendo a dashboard público",
        );
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
        console.log(
          "↪️ AdminProtectedRoute: Staff sin permisos para esta sección, redirigiendo a dashboard admin",
        );
        navigate("/admin/dashboard");
        return;
      }

      // Si no es staff, redirigir al login del backoffice
      console.log(
        "↪️ AdminProtectedRoute: Usuario sin permisos de staff, redirigiendo a backoffice login",
      );
      navigate("/backoffice/login");
      return;
    }

    console.log("✅ AdminProtectedRoute: Acceso autorizado");
  }, [navigate, requiredRole]);

  const currentUser = getCurrentUser();

  // Renderizar solo si está autenticado y tiene permisos
  const hasAccess =
    allowedRoles && allowedRoles.length > 0
      ? allowedRoles.some((role) => hasRole(role))
      : hasRole(requiredRole);

  if (!requireAuth() || !hasAccess) {
    return null;
  }

  return <>{children}</>;
};

export default AdminProtectedRoute;
