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
import Navbar from "@/components/Navbar";
import { useTranslations } from "@/contexts/LanguageContext";

const Corinto = () => {
  const navigate = useNavigate();
  const t = useTranslations();

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <Navbar />

      {/* Hero Section */}
      <section className="relative h-96 bg-gradient-to-b from-blue-900 to-blue-800">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `linear-gradient(rgba(2, 22, 71, 0.69), rgba(2, 21, 71, 0.85)), url('/DSC_3912.jpg')`,
          }}
        />
        <div className="relative z-10 container mx-auto px-4 h-full flex items-center justify-center text-center">
          <div className="text-white max-w-2xl">
            <h1 className="text-7xl font-bold mb-4">Corinto</h1>
            <p className="text-xl">
              A orillas del majestuoso Lago de Ilopango, 
              la sede Corinto es ideal para quienes buscan tranquilidad con una vista espectacular. 
              Perfecta para escapadas en pareja o en familia, combina naturaleza, 
              brisa fresca y la belleza de un entorno lacustre.
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
                  src="/DSC_5545.jpg"
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
                      3-4 habitaciones
                    </span>
                  </div>
                  <div className="flex flex-col items-center">
                    <Bath className="h-8 w-8 text-blue-600 mb-2" />
                    <span className="text-sm text-slate-600">2-3 baños</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <Users className="h-8 w-8 text-blue-600 mb-2" />
                    <span className="text-sm text-slate-600">7-9 personas</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <Trees className="h-8 w-8 text-blue-600 mb-2" />
                    <span className="text-sm text-slate-600">
                      Jardín
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
                src="/DSC_5485.jpg"
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

export default Corinto;
