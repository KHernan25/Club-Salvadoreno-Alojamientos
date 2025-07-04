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
        session.user.role === "mercadeo"
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
      const result = await authenticateUser({
        username: formData.username,
        password: formData.password,
        rememberMe: false,
      });

      if (result.success && result.user) {
        // Verificar que el usuario tenga permisos de backoffice
        const isBackofficeUser = [
          "super_admin",
          "atencion_miembro",
          "anfitrion",
          "monitor",
          "mercadeo",
        ].includes(result.user.role);

        if (!isBackofficeUser) {
          setError("Este usuario no tiene permisos para acceder al backoffice");
          toast({
            title: "Acceso denegado",
            description:
              "Tu cuenta no tiene permisos para acceder al sistema administrativo",
            variant: "destructive",
          });
          return;
        }

        toast({
          title: "Acceso autorizado",
          description: `Bienvenido al backoffice, ${result.user.fullName}`,
        });

        navigate("/admin/dashboard", { replace: true });
      } else {
        setError(result.error || "Error desconocido al iniciar sesión");
        toast({
          title: "Error de autenticación",
          description: result.error || "Credenciales inválidas",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Login error:", error);
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('/placeholder.svg')] bg-cover bg-center opacity-10"></div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          {/* Logo y Título */}
          <div className="text-center mb-8">
            <div className="mx-auto w-20 h-20 bg-white rounded-full flex items-center justify-center mb-6 shadow-lg">
              <Shield className="h-10 w-10 text-blue-900" />
            </div>
            <h1 className="text-white text-3xl font-bold mb-2">Backoffice</h1>
            <p className="text-blue-200 text-lg">Sistema de Administración</p>
            <p className="text-blue-300 text-sm mt-2">Club Salvadoreño</p>
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
            <div className="mt-6 text-center">
              <p className="text-blue-100 text-sm">
                Solo personal autorizado puede acceder
              </p>
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
