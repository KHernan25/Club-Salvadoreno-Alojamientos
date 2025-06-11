import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, User } from "lucide-react";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Carousel images for authentication pages
  const carouselImages = [
    {
      url: "/placeholder.svg",
      title: "El Sunzal",
      description: "Disfruta de las mejores olas y playas de El Salvador",
    },
    {
      url: "/placeholder.svg",
      title: "Corinto",
      description: "Tranquilidad y serenidad junto al lago",
    },
    {
      url: "/placeholder.svg",
      title: "Country Club",
      description: "Deportes y entretenimiento en la ciudad",
    },
    {
      url: "/placeholder.svg",
      title: "Golf",
      description: "Campo de golf profesional con vistas espectaculares",
    },
    {
      url: "/placeholder.svg",
      title: "Surf",
      description: "Las mejores olas del Pacífico salvadoreño",
    },
  ];

  // Auto-advance carousel every 4 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % carouselImages.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [carouselImages.length]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here would be login logic
    navigate("/dashboard");
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const currentImage = carouselImages[currentImageIndex];

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Carousel with Overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-1000 ease-in-out"
        style={{
          backgroundImage: `linear-gradient(rgba(30, 58, 138, 0.85), rgba(30, 58, 138, 0.85)), url('${currentImage.url}')`,
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

      {/* Image Title Overlay */}
      <div className="absolute top-20 left-1/2 transform -translate-x-1/2 z-20 text-center">
        <h3 className="text-white text-lg font-semibold opacity-90 transition-all duration-500">
          {currentImage.title}
        </h3>
        <p className="text-blue-100 text-sm opacity-75 transition-all duration-500 max-w-xs">
          {currentImage.description}
        </p>
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 mx-auto mb-4 bg-white/20 rounded-full flex items-center justify-center">
              <div className="text-white text-2xl font-bold">CS</div>
            </div>
            <h1 className="text-white text-3xl font-bold tracking-wider">
              CLUB
              <br />
              SALVADOREÑO
            </h1>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Usuario */}
            <div>
              <Label
                htmlFor="username"
                className="text-white font-medium mb-2 block"
              >
                Usuario
              </Label>
              <div className="relative">
                <Input
                  id="username"
                  type="text"
                  placeholder="Ingresar Usuario"
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
              className="w-full bg-blue-700 hover:bg-blue-800 text-white py-3 text-lg font-medium"
            >
              Iniciar Sesión
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
        </div>
      </div>
    </div>
  );
};

export default Login;
