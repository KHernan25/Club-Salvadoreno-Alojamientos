import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import {
  Menu,
  Globe,
  User,
  ChevronDown,
  Crown,
  Users,
  Sparkles,
} from "lucide-react";
import Navbar from "@/components/Navbar";

const ElSunzalSuites = () => {
  const navigate = useNavigate();

  const suites = [
    {
      id: "suite-1",
      name: "Suite Ejecutiva",
      level: "Ejecutiva",
      guests: 2,
      pricing: { weekday: 650, weekend: 850, daily: 750 },
    },
    {
      id: "suite-2",
      name: "Suite Presidencial",
      level: "Presidencial",
      guests: 2,
      pricing: { weekday: 750, weekend: 950, daily: 850 },
    },
    {
      id: "suite-3",
      name: "Suite Royal",
      level: "Royal",
      guests: 4,
      pricing: { weekday: 850, weekend: 1150, daily: 950 },
    },
    {
      id: "suite-4",
      name: "Suite Oceanfront",
      level: "Ejecutiva",
      guests: 2,
      pricing: { weekday: 680, weekend: 880, daily: 780 },
    },
    {
      id: "suite-5",
      name: "Suite Paradise",
      level: "Presidencial",
      guests: 3,
      pricing: { weekday: 780, weekend: 980, daily: 880 },
    },
    {
      id: "suite-6",
      name: "Suite Imperial",
      level: "Royal",
      guests: 4,
      pricing: { weekday: 900, weekend: 1200, daily: 1000 },
    },
    {
      id: "suite-7",
      name: "Suite Tropical",
      level: "Ejecutiva",
      guests: 2,
      pricing: { weekday: 670, weekend: 870, daily: 770 },
    },
    {
      id: "suite-8",
      name: "Suite Deluxe",
      level: "Presidencial",
      guests: 3,
      pricing: { weekday: 800, weekend: 1000, daily: 900 },
    },
    {
      id: "suite-9",
      name: "Suite Supreme",
      level: "Royal",
      guests: 4,
      pricing: { weekday: 920, weekend: 1250, daily: 1020 },
    },
    {
      id: "suite-10",
      name: "Suite Premium",
      level: "Ejecutiva",
      guests: 2,
      pricing: { weekday: 690, weekend: 890, daily: 790 },
    },
    {
      id: "suite-11",
      name: "Suite Elite",
      level: "Presidencial",
      guests: 3,
      pricing: { weekday: 820, weekend: 1020, daily: 920 },
    },
    {
      id: "suite-12",
      name: "Suite Majestic",
      level: "Royal",
      guests: 4,
      pricing: { weekday: 950, weekend: 1300, daily: 1050 },
    },
    {
      id: "suite-13",
      name: "Suite Exclusive",
      level: "Ejecutiva",
      guests: 2,
      pricing: { weekday: 700, weekend: 900, daily: 800 },
    },
    {
      id: "suite-14",
      name: "Suite Platinum",
      level: "Presidencial",
      guests: 3,
      pricing: { weekday: 840, weekend: 1040, daily: 940 },
    },
    {
      id: "suite-15",
      name: "Suite Diamond",
      level: "Royal",
      guests: 4,
      pricing: { weekday: 980, weekend: 1350, daily: 1080 },
    },
    {
      id: "suite-16",
      name: "Suite Ultimate",
      level: "Royal",
      guests: 6,
      pricing: { weekday: 1200, weekend: 1600, daily: 1300 },
    },
  ];

  const getLevelColor = (level: string) => {
    switch (level) {
      case "Ejecutiva":
        return "bg-blue-600";
      case "Presidencial":
        return "bg-purple-600";
      case "Royal":
        return "bg-yellow-600";
      default:
        return "bg-slate-600";
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <Navbar />

      {/* Breadcrumb */}
      <div className="bg-slate-50 py-4">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <button
              onClick={() => navigate("/dashboard")}
              className="hover:text-blue-600"
            >
              Inicio
            </button>
            <span>›</span>
            <button
              onClick={() => navigate("/el-sunzal")}
              className="hover:text-blue-600"
            >
              El Sunzal
            </button>
            <span>›</span>
            <span className="text-slate-900 font-medium">Suites</span>
          </div>
        </div>
      </div>

      {/* Header */}
      <section className="py-12 bg-gradient-to-r from-purple-900 to-blue-900 text-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4 flex items-center justify-center gap-3">
              <Crown className="h-10 w-10" />
              Suites VIP en El Sunzal
            </h1>
            <p className="text-xl text-purple-100 max-w-2xl mx-auto">
              Descubre nuestras 16 exclusivas suites de lujo, cada una diseñada
              para una experiencia inolvidable
            </p>
          </div>
        </div>
      </section>

      {/* Suites Grid */}
      <section className="py-8 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {suites.map((suite, index) => (
              <Card
                key={suite.id}
                className="group hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                <div className="relative h-40 overflow-hidden rounded-t-lg">
                  <img
                    src="/placeholder.svg"
                    alt={suite.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div
                    className={`absolute top-3 left-3 ${getLevelColor(suite.level)} text-white px-2 py-1 rounded text-xs font-bold`}
                  >
                    {suite.level.toUpperCase()}
                  </div>
                  <div className="absolute top-3 right-3 bg-white/90 text-slate-900 px-2 py-1 rounded text-xs">
                    #{index + 1}
                  </div>
                </div>
                <CardContent className="p-4">
                  <h3 className="text-lg font-bold text-slate-900 mb-1 flex items-center gap-2">
                    <Crown className="h-4 w-4 text-yellow-600" />
                    {suite.name}
                  </h3>

                  <div className="flex items-center gap-2 mb-3 text-xs text-slate-600">
                    <Users className="h-3 w-3" />
                    <span>{suite.guests} huéspedes</span>
                    <Sparkles className="h-3 w-3 ml-2" />
                    <span>Servicio VIP</span>
                  </div>

                  <div className="border-t border-slate-200 pt-3 mb-3">
                    <div className="grid grid-cols-3 gap-1 text-center text-xs">
                      <div>
                        <div className="text-slate-500">Sem</div>
                        <div className="font-semibold">
                          ${suite.pricing.weekday}
                        </div>
                      </div>
                      <div>
                        <div className="text-slate-500">FinSem</div>
                        <div className="font-semibold">
                          ${suite.pricing.weekend}
                        </div>
                      </div>
                      <div>
                        <div className="text-slate-500">Fer</div>
                        <div className="font-semibold">
                          ${suite.pricing.daily}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-1">
                    <Button
                      className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                      size="sm"
                      onClick={() => navigate(`/suite/${suite.id}`)}
                    >
                      Ver
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate("/reservas")}
                    >
                      Reservar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gradient-to-r from-purple-900 to-blue-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4 flex items-center justify-center gap-3">
            <Sparkles className="h-8 w-8" />
            Experiencia VIP Inolvidable
          </h2>
          <p className="text-purple-100 mb-8 max-w-2xl mx-auto">
            Reserva ahora tu suite de lujo en El Sunzal y disfruta del servicio
            más exclusivo
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => navigate("/reservas")}
              className="bg-white text-purple-900 hover:bg-slate-100"
            >
              Reservar Suite VIP
            </Button>
            <Button
              variant="outline"
              className="border-white text-white hover:bg-white/10"
              onClick={() => navigate("/el-sunzal")}
            >
              Volver a El Sunzal
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                <span className="text-slate-900 font-bold text-sm">CS</span>
              </div>
              <span className="text-xl font-semibold">Club Salvadoreño</span>
            </div>
            <p className="text-slate-400">
              © 2025 Club Salvadoreño. Todos los derechos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ElSunzalSuites;
