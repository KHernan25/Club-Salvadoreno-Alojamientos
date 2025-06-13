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
import { useNavigate } from "react-router-dom";
import { Mail, ArrowLeft, Smartphone } from "lucide-react";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [contactMethod, setContactMethod] = useState("email");
  const [contactValue, setContactValue] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
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
                {contactMethod === "email" ? (
                  <Mail className="h-8 w-8 text-white" />
                ) : (
                  <Smartphone className="h-8 w-8 text-white" />
                )}
              </div>

              <h2 className="text-white text-xl font-bold mb-4">
                {contactMethod === "email" ? "Correo Enviado" : "SMS Enviado"}
              </h2>

              <p className="text-blue-100 mb-6 leading-relaxed">
                Hemos enviado las instrucciones para restablecer tu contraseña
                {contactMethod === "email"
                  ? " a tu correo:"
                  : " a tu teléfono:"}
                <br />
                <span className="font-medium text-white">{contactValue}</span>
              </p>

              <p className="text-blue-100 text-sm mb-8">
                {contactMethod === "email"
                  ? "Revisa tu bandeja de entrada y sigue las instrucciones. Si no recibes el correo en unos minutos, revisa tu carpeta de spam."
                  : "Recibirás un mensaje de texto con el código de verificación en unos momentos. Asegúrate de que tu teléfono esté disponible."}
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
                  {contactMethod === "email"
                    ? "Intentar con otro correo"
                    : "Intentar con otro número"}
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

          {/* Forgot Password Form */}
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8 border border-white/20">
            <div className="text-center mb-6">
              <h2 className="text-white text-xl font-bold mb-2">
                Recuperar Contraseña
              </h2>
              <p className="text-blue-100 text-sm leading-relaxed">
                Elige cómo quieres recibir las instrucciones para restablecer tu
                contraseña.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Contact Method Selection */}
              <div>
                <Label
                  htmlFor="contactMethod"
                  className="text-white font-medium mb-2 block"
                >
                  Método de Contacto
                </Label>
                <Select
                  value={contactMethod}
                  onValueChange={(value) => {
                    setContactMethod(value);
                    setContactValue(""); // Clear input when method changes
                  }}
                >
                  <SelectTrigger className="bg-white/90 border-white/30 text-slate-900">
                    <SelectValue placeholder="Selecciona cómo recibir el código" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="email">
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        Correo Electrónico
                      </div>
                    </SelectItem>
                    <SelectItem value="sms">
                      <div className="flex items-center gap-2">
                        <Smartphone className="h-4 w-4" />
                        Mensaje de Texto (SMS)
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Dynamic Input Field */}
              <div>
                <Label
                  htmlFor="contactValue"
                  className="text-white font-medium mb-2 block"
                >
                  {contactMethod === "email"
                    ? "Correo Electrónico"
                    : "Número de Teléfono"}
                </Label>
                <div className="relative">
                  <Input
                    id="contactValue"
                    type={contactMethod === "email" ? "email" : "tel"}
                    placeholder={
                      contactMethod === "email"
                        ? "Ingrese su correo electrónico"
                        : "Ingrese su número de teléfono"
                    }
                    value={contactValue}
                    onChange={(e) => setContactValue(e.target.value)}
                    className="bg-white/90 border-white/30 text-slate-900 placeholder:text-slate-500 pr-10"
                    required
                  />
                  {contactMethod === "email" ? (
                    <Mail className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-500" />
                  ) : (
                    <Smartphone className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-500" />
                  )}
                </div>
                {contactMethod === "sms" && (
                  <p className="text-blue-200 text-xs mt-2">
                    Formato: +503 1234-5678 o 1234-5678
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full bg-blue-700 hover:bg-blue-800 text-white py-3 text-lg font-medium"
              >
                {contactMethod === "email" ? "Enviar al Correo" : "Enviar SMS"}
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
