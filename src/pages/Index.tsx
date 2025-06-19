import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { getCurrentUser } from "@/lib/auth-service";
import { useTranslations } from "@/contexts/LanguageContext";
import Navbar from "@/components/Navbar";
import {
  User,
  Settings,
  Activity,
  ArrowRight,
  Star,
  Target,
  Award,
  Calendar,
  TrendingUp,
  Globe,
  ChevronDown,
  Menu,
  Waves,
  Mountain,
  Palmtree,
  Car,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useRef } from "react";

const Index = () => {
  const navigate = useNavigate();
  const t = useTranslations();
  const [currentHeroIndex, setCurrentHeroIndex] = useState(0);
  const [currentUser, setCurrentUser] = useState(getCurrentUser());

  // Hero carousel data
  const heroSlides = [
    {
      title: "Corinto",
      description:
        "Descubre la tranquilidad del lago en nuestro refugio natural, donde la serenidad se encuentra con la aventura.",
      buttonText: "Conoce más",
      buttonColor: "bg-green-600 hover:bg-green-700",
      backgroundImage: "/DSC_5547.jpg",
      route: "/corinto",
    },
    {
      title: "El Sunzal",
      description:
        "El conjunto ideal del alojamiento, Sol, mar y vida nocturna en un ambiente. Disfruta sus mejores playas, preciosas paisajes de vaste y la diversión de El Salvador.",
      buttonText: "Conoce más",
      buttonColor: "bg-blue-600 hover:bg-blue-700",
      backgroundImage: "/DSC_5259.jpg",
      route: "/el-sunzal",
    },
    {
      title: "Country Club",
      description:
        "Un espacio exclusivo en la ciudad para disfrutar deportes y entretenimiento. Donde las familias se reúnen para disfrutar de excelencia.",
      buttonText: "Conoce más",
      buttonColor: "bg-teal-500 hover:bg-teal-600",
      backgroundImage: "/DSC_5078.jpg",
      route: "/country-club",
    },
  ];

  // Auto-advance carousel every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentHeroIndex((prev) => (prev + 1) % heroSlides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [heroSlides.length]);

  const nextSlide = () => {
    setCurrentHeroIndex((prev) => (prev + 1) % heroSlides.length);
  };

  const prevSlide = () => {
    setCurrentHeroIndex(
      (prev) => (prev - 1 + heroSlides.length) % heroSlides.length,
    );
  };

  const currentSlide = heroSlides[currentHeroIndex];

  const activities = [
    {
      title: "Surf",
      image: "/_DSC4735-2.jpg",
      description: "Disfruta de las mejores olas en las playas de El Salvador",
    },
    {
      title: "Golf",
      image: "/DSC_3895.jpg",
      description: "Campo de golf profesional con vistas espectaculares",
    },
    {
      title: "Tenis",
      image: "/DSC_5168.jpg",
      description: "Canchas de tenis de clase mundial para tu entretenimiento",
    },
    {
      title: "Vela",
      image: "/Vela.jpeg",
      description: "Navega por las cristalinas aguas del Lago de Ilopango",
    },
  ];

  const accommodations = [
    {
      title: "CORINTO",
      subtitle:
        "Relájate de la velocidad del lago al tiempo de recreo, donde el",
      description:
        "mundo más tranquilo es disponible para descanso entre los habitantes acuáticos y disfruta tu",
      buttonText: "Ver Detalles",
      image: "/DSC_5451.jpg",
    },
    {
      title: "EL SUNZAL",
      subtitle: "Escápate del surf oceanográfico. El Sunzal te espera con sus",
      description:
        "perfectos rompientes, ambiente y la experiencia perfecta para familia amantes.",
      buttonText: "Ver Detalles",
      image: "/DSC_5408.jpg",
    },
    {
      title: "COUNTRY CLUB",
      subtitle: "Un espacio exclusivo en la ciudad para disfrutar deportes y",
      description:
        "entretenimiento. Donde las familias se reúnen para disfrutar de excelencia y entretenimiento.",
      buttonText: "Ver Detalles",
      image: "/DSC_5096.jpg",
    },
  ];

  const bienvenidoRef = useRef<HTMLDivElement>(null);

  const scrollToBienvenido = () => {
    if (bienvenidoRef.current) {
      bienvenidoRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <Navbar />

      {/* Hero Carousel Section */}
      <section className="relative h-screen bg-gradient-to-b from-blue-900 to-blue-800 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-1000 ease-in-out"
          style={{
            backgroundImage: `linear-gradient(rgba(30, 58, 138, 0.7), rgba(30, 58, 138, 0.7)), url('${currentSlide.backgroundImage}')`,
          }}
        />

        {/* Navigation Arrows */}
        <button
          onClick={prevSlide}
          className="absolute left-8 top-1/2 transform -translate-y-1/2 z-20 bg-black/30 hover:bg-black/50 text-white p-3 rounded-full transition-all duration-300"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-8 top-1/2 transform -translate-y-1/2 z-20 bg-black/30 hover:bg-black/50 text-white p-3 rounded-full transition-all duration-300"
        >
          <ChevronRight className="h-6 w-6" />
        </button>

        {/* Content */}
        <div className="relative z-10 container mx-auto px-4 h-full flex items-center">
          <div className="max-w-2xl text-white">
            <h1 className="text-6xl font-bold mb-6 transition-all duration-500">
              {currentSlide.title}
            </h1>
            <p className="text-xl mb-8 leading-relaxed transition-all duration-500">
              {currentSlide.description}
            </p>
            <Button
              size="lg"
              className={`${currentSlide.buttonColor} text-white px-8 py-3 text-lg transition-all duration-300`}
              onClick={() => navigate(currentSlide.route)}
            >
              {currentSlide.buttonText}
            </Button>
          </div>
        </div>

        {/* Carousel Indicators */}
        <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 z-20 flex space-x-3">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentHeroIndex(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentHeroIndex
                  ? "bg-white"
                  : "bg-white/50 hover:bg-white/75"
              }`}
            />
          ))}
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-50">
          <button onClick={scrollToBienvenido}>
            <ChevronDown className="h-8 w-8 text-white animate-bounce" />
          </button>
        </div>
      </section>

      {/* Welcome Section */}
      <section ref={bienvenidoRef} className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-slate-900 mb-6">
                BIENVENIDO
              </h2>
              <p className="text-lg text-slate-700 leading-relaxed mb-8">
                En el Club Salvadoreño celebramos nuestro hogar, nuestra
                tradición para la artesanía tradicional, eventos sociales,
                deportes y actividades. Ubicado en zonas para disfrute de los
                miembros salvadoreños desde donde se puede disfrutar de la
                riqueza cultural que nos caracteriza en forma de ubicación.
              </p>
              <p className="text-slate-600 italic">
                Te damos la bienvenida a tu Club, tu hogar de descanso.
              </p>
            </div>
            <div className="relative">
              <img
                src="/DSC_5551.jpg"
                alt="Club Salvadoreño"
                className="w-full h-96 object-cover rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Activities Section */}
      <section className="py-16 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {activities.map((activity, index) => (
              <Card
                key={index}
                className="group hover:shadow-lg transition-shadow cursor-pointer"
              >
                <div className="relative h-48 overflow-hidden rounded-t-lg">
                  <img
                    src={activity.image}
                    alt={activity.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute bottom-4 left-4 bg-blue-900 text-white px-3 py-1 rounded">
                    <span className="font-semibold">{activity.title}</span>
                  </div>
                </div>
                <CardContent className="p-4">
                  <p className="text-sm text-slate-600">
                    {activity.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Dependencies Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center text-slate-900 mb-12">
            DEPENDENCIAS
          </h2>

          <div className="grid gap-8 lg:grid-cols-3">
            {accommodations.map((item, index) => (
              <Card
                key={index}
                className="group hover:shadow-xl transition-all duration-300"
              >
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute bottom-4 left-4 bg-green-600 text-white px-4 py-2 rounded">
                    <span className="font-bold">{item.title}</span>
                  </div>
                </div>
                <CardContent className="p-6">
                  <p className="text-slate-700 mb-4 leading-relaxed">
                    {item.subtitle} {item.description}
                  </p>
                  <Button
                    className="w-full bg-blue-900 hover:bg-blue-800"
                    onClick={() => {
                      if (item.title === "CORINTO") {
                        navigate("/corinto");
                      } else if (item.title === "EL SUNZAL") {
                        navigate("/el-sunzal");
                      } else if (item.title === "COUNTRY CLUB") {
                        navigate("/country-club");
                      } else {
                        navigate("/alojamientos");
                      }
                    }}
                  >
                    {item.buttonText}
                    <ChevronDown className="ml-2 h-4 w-4 rotate-270" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-blue-900 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                <img
                  src="/logo_azul.png"
                  alt="Logo Club Salvadoreño"
                  className="max-w-[30px] mx-auto object-contain"
                />
              </div>
              <span className="text-xl font-semibold">Club Salvadoreño</span>
            </div>
            <p className="text-blue-100">
              © 2025 Club Salvadoreño. Todos los derechos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
