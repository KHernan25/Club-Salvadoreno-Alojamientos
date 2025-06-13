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
  Trees,
  Users,
  Bath,
  Bed,
} from "lucide-react";

const Corinto = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div
                className="flex items-center gap-3 cursor-pointer"
                onClick={() => navigate("/dashboard")}
              >
                <div className="w-10 h-10 bg-blue-900 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">CS</span>
                </div>
                <span className="text-xl font-semibold text-slate-900">
                  Club Salvadoreño
                </span>
              </div>
            </div>

            <div className="flex items-center gap-6">
              <Button variant="ghost" className="gap-2">
                <Globe className="h-4 w-4" />
                ES
                <ChevronDown className="h-4 w-4" />
              </Button>
              <Button variant="ghost" className="gap-2">
                <User className="h-4 w-4" />
                EN
              </Button>
              <Button
                variant="ghost"
                onClick={() => navigate("/")}
                className="gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                Cerrar Sesión
              </Button>
              <Button variant="ghost">
                <Menu className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative h-96 bg-gradient-to-b from-blue-900 to-blue-800">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `linear-gradient(rgba(30, 58, 138, 0.8), rgba(30, 58, 138, 0.8)), url('/placeholder.svg')`,
          }}
        />
        <div className="relative z-10 container mx-auto px-4 h-full flex items-center">
          <div className="text-white">
            <h1 className="text-5xl font-bold mb-4">Corinto</h1>
            <p className="text-xl">
              Relájate de la velocidad del lago al tiempo de recreo, donde el
              mundo más tranquilo es disponible para descanso entre los
              habitantes acuáticos y disfruta tu estadía.
            </p>
          </div>
        </div>
      </section>

      {/* Accommodation Type - Houses Only */}
      <section className="py-16 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              Alojamientos Disponibles
            </h2>
            <p className="text-lg text-slate-600">
              En Corinto contamos con hermosas casas para tu estadía perfecta
            </p>
          </div>

          <div className="max-w-2xl mx-auto">
            <Card className="cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-105">
              <div className="relative h-64 overflow-hidden rounded-t-lg">
                <img
                  src="/placeholder.svg"
                  alt="Casas en Corinto"
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-4 left-4 bg-green-600 text-white px-4 py-2 rounded">
                  <span className="font-bold">CASAS</span>
                </div>
              </div>
              <CardContent className="p-8">
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-slate-900 mb-3">
                    Casas Familiares
                  </h3>
                  <p className="text-slate-700 leading-relaxed">
                    Perfectas para grupos y familias que buscan privacidad,
                    amplitud y comodidad. Disfruta de espacios equipados,
                    rodeados de naturaleza y con acceso directo a las tranquilas
                    aguas del lago.
                  </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 text-center">
                  <div className="flex flex-col items-center">
                    <Bed className="h-8 w-8 text-blue-600 mb-2" />
                    <span className="text-sm text-slate-600">
                      2-4 habitaciones
                    </span>
                  </div>
                  <div className="flex flex-col items-center">
                    <Bath className="h-8 w-8 text-blue-600 mb-2" />
                    <span className="text-sm text-slate-600">2-3 baños</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <Users className="h-8 w-8 text-blue-600 mb-2" />
                    <span className="text-sm text-slate-600">6-8 personas</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <Trees className="h-8 w-8 text-blue-600 mb-2" />
                    <span className="text-sm text-slate-600">
                      Jardín privado
                    </span>
                  </div>
                </div>

                <Button
                  className="w-full bg-blue-900 hover:bg-blue-800 text-lg py-6"
                  onClick={() => navigate("/corinto/casas")}
                >
                  <Home className="h-5 w-5 mr-2" />
                  Ver 6 Casas Disponibles
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Information Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 mb-6">
                ¿Por qué elegir Corinto?
              </h2>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                  <p className="text-slate-700">
                    Ambiente tranquilo y relajante junto al lago
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                  <p className="text-slate-700">
                    Casas espaciosas ideales para familias
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                  <p className="text-slate-700">
                    Actividades acuáticas y pesca deportiva
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                  <p className="text-slate-700">
                    Conexión directa con la naturaleza
                  </p>
                </div>
              </div>
            </div>
            <div className="relative">
              <img
                src="/placeholder.svg"
                alt="Lago en Corinto"
                className="w-full h-80 object-cover rounded-lg shadow-lg"
              />
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

export default Corinto;
