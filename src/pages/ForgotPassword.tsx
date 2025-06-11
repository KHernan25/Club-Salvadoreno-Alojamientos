import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { Mail, ArrowLeft } from "lucide-react";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Carousel images for authentication pages
  const carouselImages = [
    {
      url: "/placeholder.svg",
      title: "Recupera tu Acceso",
      description: "Te ayudamos a recuperar tu cuenta de forma segura",
    },
    {
      url: "/placeholder.svg",
      title: "Soporte 24/7",
      description: "Estamos aquí para ayudarte en todo momento",
    },
    {
      url: "/placeholder.svg",
      title: "Seguridad",
      description: "Tu información está protegida con nosotros",
    },
    {
      url: "/placeholder.svg",
      title: "Fácil Acceso",
      description: "Recupera tu contraseña en simples pasos",
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
    // Here would be password reset logic
    setIsSubmitted(true);
  };

  const currentImage = carouselImages[currentImageIndex];

  if (isSubmitted) {
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

            {/* Success Message */}
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8 border border-white/20 text-center">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <Mail className="h-8 w-8 text-white" />
              </div>

              <h2 className="text-white text-xl font-bold mb-4">
                Correo Enviado
              </h2>

              <p className="text-blue-100 mb-6 leading-relaxed">
                Hemos enviado las instrucciones para restablecer tu contraseña
                a:
                <br />
                <span className="font-medium text-white">{email}</span>
              </p>

              <p className="text-blue-100 text-sm mb-8">
                Revisa tu bandeja de entrada y sigue las instrucciones. Si no
                recibes el correo en unos minutos, revisa tu carpeta de spam.
              </p>

              <div className="space-y-3">
                <Button
                  onClick={() => navigate("/")}
                  className="w-full bg-blue-700 hover:bg-blue-800 text-white py-3"
                >
                  Volver al Inicio de Sesión
                </Button>

                <Button
                  onClick={() => setIsSubmitted(false)}
                  variant="ghost"
                  className="w-full text-white hover:bg-white/10 py-3"
                >
                  Intentar con otro correo
                </Button>
              </div>
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

          {/* Forgot Password Form */}
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8 border border-white/20">
            <div className="text-center mb-6">
              <h2 className="text-white text-xl font-bold mb-2">
                Recuperar Contraseña
              </h2>
              <p className="text-blue-100 text-sm leading-relaxed">
                Ingresa tu correo electrónico y te enviaremos las instrucciones
                para restablecer tu contraseña.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email */}
              <div>
                <Label
                  htmlFor="email"
                  className="text-white font-medium mb-2 block"
                >
                  Correo Electrónico
                </Label>
                <div className="relative">
                  <Input
                    id="email"
                    type="email"
                    placeholder="Ingrese su correo electrónico"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-white/90 border-white/30 text-slate-900 placeholder:text-slate-500 pr-10"
                    required
                  />
                  <Mail className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-500" />
                </div>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full bg-blue-700 hover:bg-blue-800 text-white py-3 text-lg font-medium"
              >
                Enviar Instrucciones
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

export default ForgotPassword;
