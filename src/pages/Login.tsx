import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Eye,
  EyeOff,
  User,
  Loader2,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { authenticateUser, getCurrentSession } from "@/lib/auth-service";
import { useAuthPageProtection } from "@/hooks/use-prevent-back-navigation";

const Login = () => {
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
  const [rememberMe, setRememberMe] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Carousel images for authentication pages
  const carouselImages = [
    {
      url: "/sunzal.gif",
      title: "El Sunzal",
      description: "Disfruta de las mejores olas y playas de El Salvador",
    },
    {
      url: "/corinto.jpg",
      title: "Corinto",
      description: "Tranquilidad y serenidad junto al lago",
    },
    {
      url: "/country.jpg",
      title: "Country Club",
      description: "Deportes y entretenimiento en la ciudad",
    },
  ];

  // Check for existing session on mount
  useEffect(() => {
    const session = getCurrentSession();
    if (session) {
      navigate("/dashboard", { replace: true });
    }
  }, [navigate]);

  // Handle registration success message and prefill username
  useEffect(() => {
    if (location.state?.message && location.state?.newUser) {
      setSuccessMessage(location.state.message);
      setFormData((prev) => ({
        ...prev,
        username: location.state.newUser.username,
      }));

      toast({
        title: "¡Bienvenido!",
        description: `${location.state.newUser.fullName}, tu cuenta fue creada exitosamente. Inicia sesión con tu nuevo usuario: ${location.state.newUser.username}`,
      });

      // Clear the state to prevent showing the message again
      window.history.replaceState({}, document.title);
    }
  }, [location.state, toast]);

  // Auto-advance carousel every 4 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % carouselImages.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [carouselImages.length]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const result = await authenticateUser({
        username: formData.username,
        password: formData.password,
        rememberMe,
      });

      if (result.success && result.user) {
        toast({
          title: "Bienvenido",
          description: `Hola ${result.user.fullName}, has iniciado sesión exitosamente`,
        });

        // Redirect based on user role
        if (result.user.role === "admin" || result.user.role === "staff") {
          navigate("/admin/dashboard", { replace: true });
        } else {
          navigate("/dashboard", { replace: true });
        }
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
    // Clear messages when user starts typing
    if (error) {
      setError("");
    }
    if (successMessage) {
      setSuccessMessage("");
    }
  };

  const currentImage = carouselImages[currentImageIndex];

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Carousel with Overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-1000 ease-in-out"
        style={{
          backgroundImage: `linear-gradient(rgba(2, 21, 71, 0.85), rgba(2, 21, 71, 0.85)), url('${currentImage.url}')`,
        }}
      />

      {/* Carousel Indicators */}
      <div className="absolute top-8 left-1/2 transform -translate-x-1/2 z-20 flex space-x-2">
        {carouselImages.map((_, index) => (
          <div
            key={index}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              index === currentImageIndex ? "bg-white" : "bg-white/40"
            }`}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="text-center mb-8">
            <img
              src="/logo.png"
              alt="Logo Club Salvadoreño"
              className="max-w-[300px] mx-auto object-contain mb-6"
            />
            <h1 className="text-white text-3xl tracking-wider ">
              Reservas de Alojamientos
              <br />
            </h1>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Success Message */}
            {successMessage && (
              <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-4 flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-green-400 flex-shrink-0" />
                <p className="text-green-100 text-sm">{successMessage}</p>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-4 flex items-center gap-3">
                <AlertCircle className="h-5 w-5 text-red-400 flex-shrink-0" />
                <p className="text-red-100 text-sm">{error}</p>
              </div>
            )}
            {/* Correo */}
            <div>
              <Label
                htmlFor="username"
                className="text-white font-medium mb-2 block"
              >
                Correo
              </Label>
              <div className="relative">
                <Input
                  id="username"
                  type="text"
                  placeholder="Correo o Usuario"
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

            {/* Remember Me and Forgot Password */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="remember"
                  checked={rememberMe}
                  onCheckedChange={(checked) =>
                    setRememberMe(checked as boolean)
                  }
                  className="bg-white/90 border-white/30"
                />
                <Label htmlFor="remember" className="text-white text-sm">
                  Recordarme
                </Label>
              </div>

              <button
                type="button"
                onClick={() => navigate("/forgot-password")}
                className="text-blue-200 hover:text-white text-sm underline"
              >
                ¿Olvidaste tu contraseña?
              </button>
            </div>

            {/* Login Button */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-700 hover:bg-blue-800 disabled:opacity-50 text-white py-3 text-lg font-medium"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Iniciando sesión...
                </>
              ) : (
                "Iniciar Sesión"
              )}
            </Button>
          </form>

          {/* Register Link */}
          <div className="text-center mt-6">
            <p className="text-white">
              ¿Aún no tienes una cuenta?{" "}
              <button
                onClick={() => navigate("/register")}
                className="text-blue-200 hover:text-white underline font-medium"
              >
                Regístrate
              </button>
            </p>
          </div>

          {/* Development Credentials Helper */}
          {process.env.NODE_ENV === "development" && (
            <div className="mt-8 bg-yellow-500/20 border border-yellow-500/30 rounded-lg p-4">
              <details className="text-white">
                <summary className="cursor-pointer text-yellow-200 font-medium mb-2">
                  🔧 Credenciales de Desarrollo
                </summary>
                <div className="space-y-2 text-xs">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <p className="font-medium text-yellow-200">
                        Administrador:
                      </p>
                      <p>
                        Usuario:{" "}
                        <code className="bg-black/20 px-1 rounded">admin</code>
                      </p>
                      <p>
                        Email:{" "}
                        <code className="bg-black/20 px-1 rounded">
                          admin@clubsalvadoreno.com
                        </code>
                      </p>
                      <p>
                        Contraseña:{" "}
                        <code className="bg-black/20 px-1 rounded">
                          Admin123
                        </code>
                      </p>
                    </div>
                    <div>
                      <p className="font-medium text-yellow-200">
                        Usuario Demo:
                      </p>
                      <p>
                        Usuario:{" "}
                        <code className="bg-black/20 px-1 rounded">demo</code>
                      </p>
                      <p>
                        Email:{" "}
                        <code className="bg-black/20 px-1 rounded">
                          demo@clubsalvadoreno.com
                        </code>
                      </p>
                      <p>
                        Contraseña:{" "}
                        <code className="bg-black/20 px-1 rounded">
                          demo123
                        </code>
                      </p>
                    </div>
                  </div>
                  <div className="border-t border-yellow-500/30 pt-2">
                    <p className="font-medium text-yellow-200">
                      Puedes usar usuario o email para iniciar sesión:
                    </p>
                    <p>
                      <code className="bg-black/20 px-1 rounded">usuario1</code>{" "}
                      o{" "}
                      <code className="bg-black/20 px-1 rounded">
                        usuario1@email.com
                      </code>
                    </p>
                    <p>
                      Contraseña:{" "}
                      <code className="bg-black/20 px-1 rounded">
                        Usuario123
                      </code>
                    </p>
                  </div>
                </div>
              </details>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
