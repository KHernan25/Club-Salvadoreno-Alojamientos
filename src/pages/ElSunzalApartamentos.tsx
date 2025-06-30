import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import {
  Menu,
  Globe,
  User,
  ChevronDown,
  Bed,
  Bath,
  Users,
  Building,
} from "lucide-react";
import Navbar from "@/components/Navbar";

const ElSunzalApartamentos = () => {
  const navigate = useNavigate();

  const apartamentos = [
    {
      id: "1A",
      name: "Apartamento 1A",
      image: "/DSC_5212.jpg",
      description: "Moderno apartamento con vista al mar",
      beds: 2,
      baths: 1,
      guests: 4,
      pricing: { weekday: 110, weekend: 230, daily: 140 },
    },
    {
      id: "1B",
      name: "Apartamento 1B",
      image: "/DSC_5214.jpg",
      description: "Cómodo apartamento con balcón privado",
      beds: 1,
      baths: 1,
      guests: 2,
      pricing: { weekday: 95, weekend: 210, daily: 125 },
    },
    {
      id: "2A",
      name: "Apartamento 2A",
      image: "/DSC_5238.jpg",
      description: "Espacioso apartamento en segundo piso",
      beds: 2,
      baths: 2,
      guests: 6,
      pricing: { weekday: 120, weekend: 250, daily: 150 },
    },
    {
      id: "2B",
      name: "Apartamento 2B",
      image: "/DSC_5244.jpg",
      description: "Apartamento familiar con terraza",
      beds: 3,
      baths: 2,
      guests: 6,
      pricing: { weekday: 130, weekend: 280, daily: 165 },
    },
    {
      id: "3A",
      name: "Apartamento 3A",
      image: "/DSC_5346.jpg",
      description: "Penthouse con vista panorámica",
      beds: 2,
      baths: 2,
      guests: 4,
      pricing: { weekday: 150, weekend: 320, daily: 185 },
    },
    {
      id: "3B",
      name: "Apartamento 3B",
      image: "/DSC_5363.jpg",
      description: "Apartamento premium con amenidades",
      beds: 3,
      baths: 2,
      guests: 8,
      pricing: { weekday: 160, weekend: 350, daily: 200 },
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <Navbar />

      {/* Header */}
      <section className="relative h-96 bg-gradient-to-b from-blue-900 to-blue-800">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `linear-gradient(rgba(2, 22, 71, 0.69), rgba(2, 21, 71, 0.85)), url('/apartamentos.gif')`,
          }}
        />
        <div className="relative z-10 container mx-auto px-4 h-full flex items-center justify-center text-center">
          <div className="text-white max-w-2xl">
            <h1 className="text-6xl font-bold mb-4">
              Apartamentos en El Sunzal
            </h1>
            <p className="text-xl">
              Descubre nuestros 6 modernos apartamentos con vista al mar,
              perfectos para una estadía cómoda
            </p>
          </div>
        </div>
      </section>

      {/* Apartments Grid */}
      <section className="py-8 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
            {apartamentos.map((apt, index) => (
              <Card
                key={apt.id}
                className="group hover:shadow-xl transition-all duration-300"
              >
                <div className="relative h-48 overflow-hidden rounded-t-lg">
                  <img
                    src={apt.image}
                    alt={apt.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-4 left-4 bg-blue-600 text-white px-3 py-1 rounded">
                    <span className="font-semibold text-sm">
                      APT {index + 1}
                    </span>
                  </div>
                </div>
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold text-slate-900 mb-2">
                    {apt.name}
                  </h3>
                  <p className="text-slate-600 mb-4 text-sm">
                    {apt.description}
                  </p>

                  <div className="grid grid-cols-3 gap-3 mb-4">
                    <div className="flex items-center gap-2 text-xs text-slate-600">
                      <Bed className="h-4 w-4 text-blue-600" />
                      <span>{apt.beds} hab.</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-600">
                      <Bath className="h-4 w-4 text-blue-600" />
                      <span>
                        {apt.baths} baño{apt.baths > 1 ? "s" : ""}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-600">
                      <Users className="h-4 w-4 text-blue-600" />
                      <span>{apt.guests} huésp.</span>
                    </div>
                  </div>

                  <div className="border-t border-slate-200 pt-4 mb-4">
                    <div className="grid grid-cols-3 gap-2 text-center text-xs">
                      <div>
                        <div className="text-slate-500">Semana</div>
                        <div className="font-semibold">
                          ${apt.pricing.weekday}
                        </div>
                      </div>
                      <div>
                        <div className="text-slate-500">Fin Semana</div>
                        <div className="font-semibold">
                          ${apt.pricing.weekend}
                        </div>
                      </div>
                      <div>
                        <div className="text-slate-500">Feriado</div>
                        <div className="font-semibold">
                          ${apt.pricing.daily}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      className="flex-1 bg-blue-900 hover:bg-blue-800"
                      size="sm"
                      onClick={() => navigate(`/apartamento/${apt.id}`)}
                    >
                      Ver Detalles
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        navigate(
                          `/reservas?accommodation=apartamento&id=${apt.id}&name=${encodeURIComponent(apt.name)}`,
                        )
                      }
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
      <section className="py-16 text-blue-900">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            ¿Listo para tu estadía perfecta?
          </h2>
          <p className="text-blue-900 mb-8 max-w-2xl mx-auto">
            Reserva ahora tu apartamento ideal en El Sunzal
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              variant="outline"
              onClick={() =>
                navigate(
                  "/reservas?accommodation=apartamento&location=el-sunzal",
                )
              }
              className="bg-blue-900 text-white hover:bg-white/10"
            >
              Hacer Reserva
            </Button>
            <Button
              variant="outline"
              className="bg-blue-900 text-white hover:bg-white/10"
              onClick={() => navigate("/el-sunzal")}
            >
              Volver a El Sunzal
            </Button>
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
            <p className="text-slate-400">
              © 2025 Club Salvadoreño. Todos los derechos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ElSunzalApartamentos;
