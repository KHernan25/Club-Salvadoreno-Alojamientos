import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate, useLocation } from "react-router-dom";
import { Eye, EyeOff, User, Loader2, AlertCircle, Shield } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { authenticateUser, getCurrentSession } from "@/lib/auth-service";
import { useAuthPageProtection } from "@/hooks/use-prevent-back-navigation";

const BackofficeLogin = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  // Prevenir navegación hacia atrás en página de login
  useAuthPageProtection();

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Check for existing session on mount
  useEffect(() => {
    const session = getCurrentSession();
    if (session) {
      // Si es admin/staff, va al dashboard admin, sino va al sitio principal
      if (
        session.user.role === "super_admin" ||
        session.user.role === "atencion_miembro" ||
        session.user.role === "anfitrion" ||
        session.user.role === "monitor" ||
        session.user.role === "mercadeo" ||
        session.user.role === "recepcion" ||
        session.user.role === "porteria"
      ) {
        navigate("/admin/dashboard", { replace: true });
      } else {
        navigate("/dashboard", { replace: true });
      }
    }
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      console.log(
        "🔐 Iniciando autenticación backoffice para:",
        formData.username,
      );

      const result = await authenticateUser({
        username: formData.username,
        password: formData.password,
        rememberMe: false,
      });

      console.log("🔐 Resultado de autenticación:", {
        success: result.success,
        hasUser: !!result.user,
        userRole: result.user?.role,
        error: result.error,
      });

      if (result.success && result.user) {
        // Verificar que el usuario tenga permisos de backoffice
        const isBackofficeUser = [
          "super_admin",
          "atencion_miembro",
          "anfitrion",
          "monitor",
          "mercadeo",
          "recepcion",
          "porteria",
        ].includes(result.user.role);

        console.log("🔐 Verificando permisos backoffice:", {
          userRole: result.user.role,
          isBackofficeUser,
        });

        if (!isBackofficeUser) {
          console.log("❌ Usuario sin permisos de backoffice");
          setError("Este usuario no tiene permisos para acceder al backoffice");
          toast({
            title: "Acceso denegado",
            description:
              "Tu cuenta no tiene permisos para acceder al sistema administrativo",
            variant: "destructive",
          });
          return;
        }

        console.log("✅ Login exitoso, redirigiendo a dashboard admin");

        toast({
          title: "Acceso autorizado",
          description: `Bienvenido al backoffice, ${result.user.fullName}`,
        });

        // Forzar navegación con un pequeño delay para asegurar que el toast se muestre
        setTimeout(() => {
          if (result.user.role === "porteria") {
            console.log("🔄 Navegando a /admin/porteria");
            navigate("/admin/porteria", { replace: true });
          } else {
            console.log("🔄 Navegando a /admin/dashboard");
            navigate("/admin/dashboard", { replace: true });
          }
        }, 100);
      } else {
        console.log("❌ Login fallido:", result.error);
        setError(result.error || "Error desconocido al iniciar sesión");
        toast({
          title: "Error de autenticación",
          description: result.error || "Credenciales inválidas",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("❌ Login error:", error);
      setError("Error de conexión. Por favor intenta nuevamente.");
      toast({
        title: "Error de conexión",
        description: "No se pudo procesar tu solicitud. Intenta nuevamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    // Clear error when user starts typing
    if (error) {
      setError("");
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Pattern */}
      <div
        className="absolute inset-0 bg-center bg-no-repeat"
        style={{
          backgroundImage: `linear-gradient(rgba(2, 21, 71, 0.85), rgba(2, 21, 71, 0.85)), url('/collage_club.png')`,
          backgroundSize: "1920px 1000px",
          backgroundPosition: "center center",
        }}
      />

      {/* Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="text-center mb-8">
            <img
              src="/logo.png"
              alt="Logo Club Salvadoreño"
              className="max-w-[300px] mx-auto object-contain mb-4"
              onError={(e) => {
                console.error("Primary logo failed to load, trying fallback");
                // Try fallback logo
                const target = e.currentTarget as HTMLImageElement;
                if (target.src.includes("logo.png")) {
                  target.src = "/logo_azul.png";
                } else if (target.src.includes("logo_azul.png")) {
                  target.src = "/logo_menu.png";
                } else {
                  // All logos failed, hide the image
                  target.style.display = "none";
                }
              }}
              style={{ display: "block" }}
            />
            <h1 className="text-white text-3xl tracking-wider mb-2">
              Backoffice
            </h1>
            <p className="text-blue-200 text-lg">Sistema de Administración</p>
          </div>

          {/* Login Form */}
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-8 shadow-2xl border border-white/20">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Error Message */}
              {error && (
                <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-4 flex items-center gap-3">
                  <AlertCircle className="h-5 w-5 text-red-400 flex-shrink-0" />
                  <p className="text-red-100 text-sm">{error}</p>
                </div>
              )}

              {/* Usuario */}
              <div>
                <Label
                  htmlFor="username"
                  className="text-white font-medium mb-2 block"
                >
                  Usuario o Correo
                </Label>
                <div className="relative">
                  <Input
                    id="username"
                    type="text"
                    placeholder="Ingrese su usuario o correo"
                    value={formData.username}
                    onChange={(e) =>
                      handleInputChange("username", e.target.value)
                    }
                    className="bg-white/90 border-white/30 text-slate-900 placeholder:text-slate-500 pr-10"
                    required
                  />
                  <User className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-500" />
                </div>
              </div>

              {/* Contraseña */}
              <div>
                <Label
                  htmlFor="password"
                  className="text-white font-medium mb-2 block"
                >
                  Contraseña
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Ingrese su contraseña"
                    value={formData.password}
                    onChange={(e) =>
                      handleInputChange("password", e.target.value)
                    }
                    className="bg-white/90 border-white/30 text-slate-900 placeholder:text-slate-500 pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-500 hover:text-slate-700"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Login Button */}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white py-3 text-lg font-medium"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Verificando acceso...
                  </>
                ) : (
                  "Acceder al Sistema"
                )}
              </Button>
            </form>

            {/* Info */}
            <div className="mt-6 text-center space-y-2">
              <p className="text-blue-100 text-sm">
                Solo personal autorizado puede acceder
              </p>

              {/* Credenciales de desarrollo */}
              <div className="bg-blue-900/30 border border-blue-700/50 rounded-lg p-3 text-xs">
                <p className="text-blue-200 font-semibold mb-1">
                  🔧 Desarrollo - Credenciales de prueba:
                </p>
                <div className="text-blue-100 space-y-1">
                  <div>superadmin / SuperAdmin123</div>
                  <div>atencion / Atencion123</div>
                  <div>mercadeo / Mercadeo123</div>
                </div>
              </div>

              <button
                onClick={() => navigate("/login")}
                className="text-blue-200 hover:text-white text-sm underline mt-2"
              >
                ¿Eres huésped? Ir al sitio principal
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BackofficeLogin;
