import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Home, ArrowLeft } from "lucide-react";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname,
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen relative">
      {/* Background with Club Salvadoreño styling */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900 to-blue-800"></div>

      <div className="relative z-10 min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          {/* Logo */}
          <div className="mb-8">
            <div className="w-20 h-20 mx-auto mb-4 bg-white/20 rounded-full flex items-center justify-center">
              <div className="text-white text-2xl font-bold">CS</div>
            </div>
            <h2 className="text-white text-2xl font-bold tracking-wider">
              CLUB SALVADOREÑO
            </h2>
          </div>

          {/* 404 Content */}
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8 border border-white/20 max-w-md mx-auto">
            <h1 className="text-6xl font-bold text-white mb-4">404</h1>
            <h3 className="text-xl font-semibold text-white mb-2">
              Página no encontrada
            </h3>
            <p className="text-blue-100 mb-6">
              Lo sentimos, la página que buscas no existe o ha sido movida.
            </p>

            <div className="space-y-3">
              <Button
                onClick={() => navigate("/")}
                className="w-full bg-blue-700 hover:bg-blue-800 text-white gap-2"
              >
                <Home className="h-4 w-4" />
                Ir al Inicio
              </Button>

              <Button
                onClick={() => navigate(-1)}
                variant="ghost"
                className="w-full text-white hover:bg-white/10 gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Volver
              </Button>
            </div>
          </div>

          <p className="text-blue-200 text-sm mt-6">
            Si crees que esto es un error, contacta al soporte técnico.
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
