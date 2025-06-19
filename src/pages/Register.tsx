import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Loader2, AlertCircle, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { registerUser, RegistrationData } from "@/lib/registration-service";
import { getCurrentSession } from "@/lib/auth-service";

const Register = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    documentType: "",
    documentNumber: "",
    memberCode: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

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
      const registrationData: RegistrationData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        documentType: formData.documentType,
        documentNumber: formData.documentNumber,
        memberCode: formData.memberCode,
        phone: formData.phone,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        acceptTerms,
      };

      const result = await registerUser(registrationData);

      if (result.success && result.user) {
        setIsSuccess(true);
        toast({
          title: "¡Registro Exitoso!",
          description: `${result.user.fullName}, tu cuenta ha sido creada exitosamente. Ahora puedes iniciar sesión.`,
        });

        // Pequeño delay para mostrar el mensaje de éxito antes de redirigir al login
        setTimeout(() => {
          navigate("/login", {
            replace: true,
            state: {
              message: "Registro exitoso. Ya puedes iniciar sesión.",
              newUser: {
                username: result.user.username,
                fullName: result.user.fullName,
              },
            },
          });
        }, 2000);
      } else {
        setError(result.error || "Error desconocido al registrar usuario");
        toast({
          title: "Error de registro",
          description: result.error || "No se pudo crear la cuenta",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Registration error:", error);
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
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-4xl">
          {/* Logo */}
          <div className="text-center mb-16">
            <img
              src="/logo.png"
              alt="Logo Club Salvadoreño"
              className="max-w-[300px] mx-auto object-contain mb-6"
            />
          </div>

          {/* Success Message */}
          {isSuccess && (
            <div className="mb-8 bg-green-500/20 border border-green-500/30 rounded-lg p-4 flex items-center gap-3">
              <CheckCircle className="h-5 w-5 text-green-400 flex-shrink-0" />
              <p className="text-green-100 text-sm">
                ¡Cuenta creada exitosamente! Redirigiendo al dashboard...
              </p>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mb-8 bg-red-500/20 border border-red-500/30 rounded-lg p-4 flex items-center gap-3">
              <AlertCircle className="h-5 w-5 text-red-400 flex-shrink-0" />
              <p className="text-red-100 text-sm">{error}</p>
            </div>
          )}

          {/* Registration Form */}
          <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-4">
              {/* Nombre */}
              <div>
                <Label
                  htmlFor="firstName"
                  className="text-white font-medium mb-2 block"
                >
                  Nombre
                </Label>
                <Input
                  id="firstName"
                  type="text"
                  placeholder="Ingrese su nombre"
                  value={formData.firstName}
                  onChange={(e) =>
                    handleInputChange("firstName", e.target.value)
                  }
                  className="bg-white/90 border-white/30 text-slate-900 placeholder:text-slate-500"
                  required
                />
              </div>

              {/* Apellidos */}
              <div>
                <Label
                  htmlFor="lastName"
                  className="text-white font-medium mb-2 block"
                >
                  Apellidos
                </Label>
                <Input
                  id="lastName"
                  type="text"
                  placeholder="Ingrese sus apellidos"
                  value={formData.lastName}
                  onChange={(e) =>
                    handleInputChange("lastName", e.target.value)
                  }
                  className="bg-white/90 border-white/30 text-slate-900 placeholder:text-slate-500"
                  required
                />
              </div>

              {/* Correo electrónico */}
              <div>
                <Label
                  htmlFor="email"
                  className="text-white font-medium mb-2 block"
                >
                  Correo electrónico
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Ingrese su correo electrónico"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className="bg-white/90 border-white/30 text-slate-900 placeholder:text-slate-500"
                  required
                />
              </div>

              {/* Tipo de Documento */}
              <div>
                <Label
                  htmlFor="documentType"
                  className="text-white font-medium mb-2 block"
                >
                  Tipo de Documento
                </Label>
                <Select
                  value={formData.documentType}
                  onValueChange={(value) =>
                    handleInputChange("documentType", value)
                  }
                >
                  <SelectTrigger className="bg-white/90 border-white/30 text-slate-900">
                    <SelectValue placeholder="Seleccione el tipo de documento" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="dui">
                      DUI - Documento Único de Identidad
                    </SelectItem>
                    <SelectItem value="pasaporte">Pasaporte</SelectItem>
                    <SelectItem value="licencia">
                      Licencia de Conducir
                    </SelectItem>
                    <SelectItem value="cedula">Cédula de Identidad</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* No. de Documento */}
              <div>
                <Label
                  htmlFor="documentNumber"
                  className="text-white font-medium mb-2 block"
                >
                  No. de Documento
                </Label>
                <Input
                  id="documentNumber"
                  type="text"
                  placeholder="Ingrese su número de documento"
                  value={formData.documentNumber}
                  onChange={(e) =>
                    handleInputChange("documentNumber", e.target.value)
                  }
                  className="bg-white/90 border-white/30 text-slate-900 placeholder:text-slate-500"
                  required
                />
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-4">
              {/* Código de miembro */}
              <div>
                <Label
                  htmlFor="memberCode"
                  className="text-white font-medium mb-2 block"
                >
                  Código de miembro
                </Label>
                <Input
                  id="memberCode"
                  type="text"
                  placeholder="Ingrese su código de miembro"
                  value={formData.memberCode}
                  onChange={(e) =>
                    handleInputChange("memberCode", e.target.value)
                  }
                  className="bg-white/90 border-white/30 text-slate-900 placeholder:text-slate-500"
                  required
                />
              </div>

              {/* Teléfono */}
              <div>
                <Label
                  htmlFor="phone"
                  className="text-white font-medium mb-2 block"
                >
                  Teléfono
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="Ingrese su teléfono"
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  className="bg-white/90 border-white/30 text-slate-900 placeholder:text-slate-500"
                  required
                />
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
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Confirmar Contraseña */}
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
                    placeholder="Confirme su contraseña"
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
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Terms and Conditions */}
              <div className="flex items-start space-x-2 pt-2">
                <Checkbox
                  id="terms"
                  checked={acceptTerms}
                  onCheckedChange={(checked) =>
                    setAcceptTerms(checked as boolean)
                  }
                  className="bg-white/90 border-white/30 mt-1"
                />
                <Label
                  htmlFor="terms"
                  className="text-white text-sm leading-relaxed"
                >
                  Aceptar los términos y condiciones
                </Label>
              </div>

              {/* Register Button */}
              <div className="pt-4">
                <Button
                  type="submit"
                  disabled={!acceptTerms || isLoading}
                  className="w-full bg-blue-700 hover:bg-blue-800 disabled:opacity-50 text-white py-3 text-lg font-medium"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creando cuenta...
                    </>
                  ) : (
                    "Registrarse"
                  )}
                </Button>
              </div>
            </div>
          </form>

          {/* Login Link */}
          <div className="text-center mt-6">
            <p className="text-white">
              ¿Ya tienes una cuenta?{" "}
              <button
                onClick={() => navigate("/")}
                className="text-blue-200 hover:text-white underline font-medium"
              >
                Inicia Sesión
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
