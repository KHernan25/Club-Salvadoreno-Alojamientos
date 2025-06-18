import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Eye, EyeOff, ArrowLeft, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const ResetPassword = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

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

  // Auto-advance carousel every 4 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % carouselImages.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [carouselImages.length]);

  // Redirect if no token
  useEffect(() => {
    if (!token) {
      toast({
        title: "Token inválido",
        description: "El enlace de recuperación no es válido o ha expirado",
        variant: "destructive",
      });
      navigate("/forgot-password");
    }
  }, [token, navigate, toast]);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const validatePassword = (password: string): string | null => {
    if (password.length < 8) {
      return "La contraseña debe tener al menos 8 caracteres";
    }
    if (!/(?=.*[a-z])/.test(password)) {
      return "La contraseña debe contener al menos una letra minúscula";
    }
    if (!/(?=.*[A-Z])/.test(password)) {
      return "La contraseña debe contener al menos una letra mayúscula";
    }
    if (!/(?=.*\d)/.test(password)) {
      return "La contraseña debe contener al menos un número";
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.password || !formData.confirmPassword) {
      toast({
        title: "Error",
        description: "Por favor completa todos los campos",
        variant: "destructive",
      });
      return;
    }

    const passwordError = validatePassword(formData.password);
    if (passwordError) {
      toast({
        title: "Error",
        description: passwordError,
        variant: "destructive",
      });
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Error",
        description: "Las contraseñas no coinciden",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      // In a real implementation, you would call your API here
      const response = await fetch("/api/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token,
          password: formData.password,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to reset password");
      }

      setIsSuccess(true);
      toast({
        title: "Contraseña actualizada",
        description: "Tu contraseña ha sido actualizada exitosamente",
      });
    } catch (error) {
      console.error("Error resetting password:", error);

      // For development, simulate success
      if (process.env.NODE_ENV === "development") {
        setIsSuccess(true);
        toast({
          title: "Contraseña actualizada",
          description:
            "Tu contraseña ha sido actualizada exitosamente (modo desarrollo)",
        });
      } else {
        toast({
          title: "Error",
          description:
            "No se pudo actualizar la contraseña. Por favor intenta nuevamente.",
          variant: "destructive",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const currentImage = carouselImages[currentImageIndex];

  if (isSuccess) {
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
            </div>

            {/* Success Message */}
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8 border border-white/20 text-center">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="h-8 w-8 text-white" />
              </div>

              <h2 className="text-white text-xl font-bold mb-4">
                ¡Contraseña Actualizada!
              </h2>

              <p className="text-blue-100 mb-8 leading-relaxed">
                Tu contraseña ha sido actualizada exitosamente. Ya puedes
                iniciar sesión con tu nueva contraseña.
              </p>

              <Button
                onClick={() => navigate("/")}
                className="w-full bg-blue-700 hover:bg-blue-800 text-white py-3"
              >
                Ir al Inicio de Sesión
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
          </div>

          {/* Reset Password Form */}
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8 border border-white/20">
            <div className="text-center mb-6">
              <h2 className="text-white text-xl font-bold mb-2">
                Nueva Contraseña
              </h2>
              <p className="text-blue-100 text-sm leading-relaxed">
                Ingresa tu nueva contraseña para completar el proceso de
                recuperación.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* New Password */}
              <div>
                <Label
                  htmlFor="password"
                  className="text-white font-medium mb-2 block"
                >
                  Nueva Contraseña
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Ingrese su nueva contraseña"
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

              {/* Confirm Password */}
              <div>
                <Label
                  htmlFor="confirmPassword"
                  className="text-white font-medium mb-2 block"
                >
                  Confirmar Contraseña
                </Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirme su nueva contraseña"
                    value={formData.confirmPassword}
                    onChange={(e) =>
                      handleInputChange("confirmPassword", e.target.value)
                    }
                    className="bg-white/90 border-white/30 text-slate-900 placeholder:text-slate-500 pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-500 hover:text-slate-700"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Password Requirements */}
              <div className="text-blue-200 text-xs space-y-1">
                <p>La contraseña debe contener:</p>
                <ul className="list-disc list-inside ml-2 space-y-1">
                  <li>Al menos 8 caracteres</li>
                  <li>Una letra minúscula</li>
                  <li>Una letra mayúscula</li>
                  <li>Un número</li>
                </ul>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-700 hover:bg-blue-800 disabled:opacity-50 text-white py-3 text-lg font-medium"
              >
                {isLoading ? "Actualizando..." : "Actualizar Contraseña"}
              </Button>
            </form>

            {/* Back to Login */}
            <div className="text-center mt-6">
              <button
                onClick={() => navigate("/")}
                className="flex items-center gap-2 text-blue-200 hover:text-white mx-auto group"
              >
                <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                Volver al Inicio de Sesión
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
