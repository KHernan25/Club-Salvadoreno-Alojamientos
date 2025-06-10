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
import {
  Menu,
  Globe,
  User,
  ChevronDown,
  MapPin,
  Calendar,
  Users,
  Waves,
  Mountain,
  Palmtree,
  Car,
} from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  const activities = [
    {
      title: "Surf",
      image: "/placeholder.svg", // Placeholder for surf image
      description: "Disfruta de las mejores olas en las playas de El Salvador",
    },
    {
      title: "Golf",
      image: "/placeholder.svg", // Placeholder for golf image
      description: "Campo de golf profesional con vistas espectaculares",
    },
    {
      title: "Tenis",
      image: "/placeholder.svg", // Placeholder for tennis image
      description: "Canchas de tenis de clase mundial para tu entretenimiento",
    },
    {
      title: "Vela",
      image: "/placeholder.svg", // Placeholder for sailing image
      description: "Navega por las cristalinas aguas del Pacífico",
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
      image: "/placeholder.svg",
    },
    {
      title: "EL SUNZAL",
      subtitle: "Escápate del surf oceanográfico. El Sunzal te espera con sus",
      description:
        "perfectos rompientes, ambiente y la experiencia perfecta para familia amantes.",
      buttonText: "Ver Detalles",
      image: "/placeholder.svg",
    },
    {
      title: "COUNTRY CLUB",
      subtitle: "Un espacio exclusivo en la ciudad para disfrutar deportes y",
      description:
        "entretenimiento. Donde las familias se reúnen para disfrutar de excelencia y entretenimiento.",
      buttonText: "Ver Detalles",
      image: "/placeholder.svg",
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-900 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">CS</span>
                </div>
                <span className="text-xl font-semibold text-slate-900">
                  Club Salvadoreño
                </span>
              <div
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                onClick={() => navigate('/')}
                className="gap-2"
              >
                <User className="h-4 w-4" />
                Iniciar Sesión
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate("/register")}
                className="gap-2"
              >
                Registrarse
              </Button>
              <Button
                variant="ghost"
                onClick={() => navigate("/perfil")}
                className="gap-2"
              >
                <User className="h-4 w-4" />
                Mi Perfil
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative h-screen bg-gradient-to-b from-blue-900 to-blue-800">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `linear-gradient(rgba(30, 58, 138, 0.7), rgba(30, 58, 138, 0.7)), url('/placeholder.svg')`,
          }}
        />
        <div className="relative z-10 container mx-auto px-4 h-full flex items-center">
          <div className="max-w-2xl text-white">
            <h1 className="text-6xl font-bold mb-6">El Sunzal</h1>
            <p className="text-xl mb-8 leading-relaxed">
              El conjunto ideal del alojamiento, Sol, mar y vida nocturna en un
              ambiente. Disfruta sus mejores playas, preciosas paisajes de vaste
              y la diversión de El Salvador.
            </p>
            <Button
              size="lg"
              className="bg-blue-700 hover:bg-blue-800 text-white px-8 py-3 text-lg"
              onClick={() => navigate("/alojamientos")}
            >
              Conoce más
            </Button>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
          <ChevronDown className="h-8 w-8 text-white animate-bounce" />
        </div>
      </section>

      {/* Desktop indicator */}
      <div className="bg-slate-100 py-2 px-4">
        <span className="text-sm text-slate-600">Desktop - 2</span>
      </div>

      {/* Welcome Section */}
      <section className="py-16 bg-white">
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
                src="/placeholder.svg"
                alt="Surf en El Salvador"
                className="w-full h-96 object-cover rounded-lg shadow-lg"
              />
              <div className="absolute bottom-4 left-4 bg-blue-900 text-white px-4 py-2 rounded">
                <span className="font-semibold">Surf</span>
              </div>
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
                    onClick={() => navigate("/alojamientos")}
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

      {/* Contact Section */}
      <section className="py-16 bg-slate-100">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 mb-8">
                Contactenos
              </h2>
              <form className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <input
                      type="text"
                      placeholder="Nombre"
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      placeholder="Apellido"
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
                <div>
                  <input
                    type="tel"
                    placeholder="Celular"
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <input
                    type="email"
                    placeholder="Correo electrónico"
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <textarea
                    placeholder="Escribe tu mensaje aquí"
                    rows={4}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <Button className="w-full bg-blue-900 hover:bg-blue-800 py-3">
                  ENVIAR
                </Button>
              </form>
            </div>

            <div className="relative h-96 lg:h-full">
              <div className="w-full h-full bg-slate-300 rounded-lg">
                {/* Map placeholder */}
                <div className="flex items-center justify-center h-full text-slate-500">
                  <div className="text-center">
                    <MapPin className="h-12 w-12 mx-auto mb-4" />
                    <p>Mapa de ubicación</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-blue-900 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                <span className="text-blue-900 font-bold text-sm">CS</span>
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