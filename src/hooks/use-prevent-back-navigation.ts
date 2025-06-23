// Hook personalizado para prevenir navegación hacia atrás después del logout

import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const usePreventBackNavigation = (shouldPrevent: boolean = false) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (!shouldPrevent) return;

    const preventBackNavigation = () => {
      // Reemplazar el estado actual del historial
      window.history.pushState(null, "", window.location.href);
      window.history.pushState(null, "", window.location.href);

      // Manejar el evento popstate (botón atrás del navegador)
      const handlePopState = (event: PopStateEvent) => {
        event.preventDefault();
        // Forzar navegación al login
        navigate("/login", { replace: true });
        return false;
      };

      window.addEventListener("popstate", handlePopState);

      return () => {
        window.removeEventListener("popstate", handlePopState);
      };
    };

    const cleanup = preventBackNavigation();

    return cleanup;
  }, [shouldPrevent, navigate]);
};

// Hook específico para páginas de autenticación
export const useAuthPageProtection = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Prevenir navegación hacia atrás en páginas de auth
    const handlePopState = () => {
      // Si el usuario intenta navegar hacia atrás, mantenerlo en login
      if (
        window.location.pathname === "/login" ||
        window.location.pathname === "/"
      ) {
        window.history.pushState(null, "", "/login");
      }
    };

    window.addEventListener("popstate", handlePopState);

    // Limpiar historial al cargar página de auth
    window.history.replaceState(null, "", window.location.href);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [navigate]);
};
