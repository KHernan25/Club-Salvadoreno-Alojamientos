import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import {
  Menu,
  Globe,
  User,
  ChevronDown,
  ArrowRight,
  Home,
  Building,
  Crown,
  Users,
  Bath,
  Bed,
  Wifi,
  Car,
  Sparkles,
} from "lucide-react";
import Navbar from "@/components/Navbar";

const ElSunzal = () => {
  const navigate = useNavigate();

  const accommodationTypes = [
    {
      id: "casas",
      title: "CASAS",
      count: 6,
      description:
        "Perfectas para grupos y familias que buscan privacidad, amplitud y comodidad. Disfruta de espacios equipados, rodeados de naturaleza y con acceso directo a la playa.",
      image: "/DSC_5201.jpg",
      features: [
        "3 habitaciones",
        "Jardín privado",
        "Sala privada",
        "Vista al mar",
      ],
      icon: Home,
      color: "bg-green-600",
      route: "/el-sunzal/casas",
    },
    {
      id: "apartamentos",
      title: "APARTAMENTOS",
      count: 6,
      description:
        "Ideales para estancias cómodas con todas las comodidades. Modernos, funcionales y con vistas espectaculares al océano y la naturaleza tropical.",
      image: "/apartamentos.gif",
      features: [
        "1-2 habitaciones",
        "Balcón privado",
        "Kitchenette",
        "Vista panorámica",
      ],
      icon: Building,
      color: "bg-blue-600",
      route: "/el-sunzal/apartamentos",
    },
    {
      id: "suites",
      title: "SUITES",
      count: 16,
      description:
        "Pensadas para una estadía íntima, elegante y llena de confort. Cada suite ofrece un refugio exclusivo donde relajarse frente al majestuoso Pacífico salvadoreño.",
      image: "/DSC_5319.jpg",
      features: [
        "1-3 camas",
        "Terraza privada",
        "Servicio premium",
        "Vista océano",
      ],
      icon: Crown,
      color: "bg-purple-600",
      route: "/el-sunzal/suites",
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <Navbar />

      {/* Hero Section */}
      <section className="relative h-96 bg-gradient-to-b from-blue-900 to-blue-800">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `linear-gradient(rgba(2, 22, 71, 0.69), rgba(2, 21, 71, 0.85)), url('/DSC_5266.jpg')`,
          }}
        />
        <div className="relative z-10 container mx-auto px-4 h-full flex items-center justify-center text-center">
          <div className="text-white">
            <h1 className="text-7xl font-bold mb-4">El Sunzal</h1>
            <p className="text-xl">
              Ubicada frente a una de las playas más icónicas del país, 
              El Sunzal ofrece un entorno tropical perfecto para relajarse o practicar surf. 
              Sus instalaciones están pensadas para disfrutar del sol, 
              el mar y una experiencia costera exclusiva con todas las comodidades.
            </p>
          </div>
        </div>
      </section>

      {/* Accommodation Types */}
      <section className="py-16 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              Tipos de Alojamiento
            </h2>
            <p className="text-lg text-slate-600">
              Elige el tipo de alojamiento perfecto para tu estadía en El Sunzal
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-3">
            {accommodationTypes.map((type, index) => (
              <Card
                key={type.id}
                className="cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-105"
              >
                <div className="relative h-48 overflow-hidden rounded-t-lg">
                  <img
                    src={type.image}
                    alt={type.title}
                    className="w-full h-full object-cover"
                  />
                  <div
                    className={`absolute top-4 right-4 ${type.color} text-white px-3 py-1 rounded-full text-sm font-bold`}
                  >
                    {type.count} disponibles
                  </div>
                  <div className="absolute bottom-4 left-4 bg-white/90 text-slate-900 px-4 py-2 rounded backdrop-blur-sm">
                    <div className="flex items-center gap-2">
                      <type.icon className="h-5 w-5" />
                      <span className="font-bold">{type.title}</span>
                    </div>
                  </div>
                </div>

                <CardContent className="p-6">
                  <p className="text-slate-700 mb-4 leading-relaxed text-sm">
                    {type.description}
                  </p>

                  <div className="space-y-2 mb-6">
                    {type.features.map((feature, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 text-xs text-slate-600"
                      >
                        <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>

                  <Button
                    className="w-full bg-blue-900 hover:bg-blue-800"
                    onClick={() => navigate(type.route)}
                  >
                    Ver {type.count} {type.title}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              ¿Por qué elegir El Sunzal?
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              El destino perfecto para los amantes del surf, la playa y la vida
              tropical
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Sparkles className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="font-bold text-slate-900 mb-2">
                Surf de Clase Mundial
              </h3>
              <p className="text-sm text-slate-600">
                Las mejores olas del Pacífico te esperan
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="font-bold text-slate-900 mb-2">
                Para Toda la Familia
              </h3>
              <p className="text-sm text-slate-600">
                Actividades para todas las edades
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Crown className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="font-bold text-slate-900 mb-2">
                Experiencia Premium
              </h3>
              <p className="text-sm text-slate-600">
                Servicios de lujo frente al mar
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Car className="h-8 w-8 text-orange-600" />
              </div>
              <h3 className="font-bold text-slate-900 mb-2">Fácil Acceso</h3>
              <p className="text-sm text-slate-600">
                Ubicación conveniente y accesible
              </p>
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

export default ElSunzal;
