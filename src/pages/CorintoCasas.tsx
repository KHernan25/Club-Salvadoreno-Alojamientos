import { useState } from "react";
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
  ArrowRight,
  Home,
  Users,
  Bed,
  Bath,
  Wifi,
  Car,
  Utensils,
  Trees,
  Waves,
} from "lucide-react";

const CorintoCasas = () => {
  const navigate = useNavigate();

  // Simulated 6 houses data for Corinto
  const casas = [
    {
      id: "corinto-casa-1",
      name: "Casa del Lago",
      image: "/placeholder.svg",
      description:
        "Hermosa casa frente al lago con amplia terraza y jardín privado.",
      features: [
        { icon: Bed, text: "3 habitaciones" },
        { icon: Bath, text: "2 baños" },
        { icon: Users, text: "6 huéspedes" },
        { icon: Trees, text: "Jardín privado" },
      ],
      pricing: { weekday: 280, weekend: 380, daily: 320 },
      amenities: [
        "Wi-Fi",
        "Estacionamiento",
        "Cocina completa",
        "Acceso al lago",
      ],
    },
    {
      id: "corinto-casa-2",
      name: "Casa Familiar Vista Lago",
      image: "/placeholder.svg",
      description:
        "Espaciosa casa ideal para reuniones familiares con vista panorámica al lago.",
      features: [
        { icon: Bed, text: "4 habitaciones" },
        { icon: Bath, text: "3 baños" },
        { icon: Users, text: "8 huéspedes" },
        { icon: Car, text: "2 autos" },
      ],
      pricing: { weekday: 350, weekend: 450, daily: 400 },
      amenities: [
        "Wi-Fi",
        "Estacionamiento doble",
        "Parrilla",
        "Muelle privado",
      ],
    },
    {
      id: "corinto-casa-3",
      name: "Casa Tranquilidad",
      image: "/placeholder.svg",
      description:
        "Refugio perfecto para descansar en un ambiente natural y silencioso.",
      features: [
        { icon: Bed, text: "2 habitaciones" },
        { icon: Bath, text: "2 baños" },
        { icon: Users, text: "4 huéspedes" },
        { icon: Trees, text: "Jardín zen" },
      ],
      pricing: { weekday: 220, weekend: 320, daily: 270 },
      amenities: ["Wi-Fi", "Estacionamiento", "Hammock", "Área de meditación"],
    },
    {
      id: "corinto-casa-4",
      name: "Casa Pescador",
      image: "/placeholder.svg",
      description:
        "Casa temática para amantes de la pesca con equipo incluido.",
      features: [
        { icon: Bed, text: "3 habitaciones" },
        { icon: Bath, text: "2 baños" },
        { icon: Users, text: "6 huéspedes" },
        { icon: Waves, text: "Acceso directo" },
      ],
      pricing: { weekday: 300, weekend: 400, daily: 350 },
      amenities: [
        "Equipo de pesca",
        "Kayaks",
        "Nevera de pesca",
        "Limpieza pescado",
      ],
    },
    {
      id: "corinto-casa-5",
      name: "Casa Reuniones",
      image: "/placeholder.svg",
      description:
        "Perfecta para eventos familiares con amplio salón y comedor.",
      features: [
        { icon: Bed, text: "4 habitaciones" },
        { icon: Bath, text: "3 baños" },
        { icon: Users, text: "10 huéspedes" },
        { icon: Utensils, text: "Cocina industrial" },
      ],
      pricing: { weekday: 400, weekend: 550, daily: 475 },
      amenities: ["Sonido", "Proyector", "Mesa para 12", "Parrilla grande"],
    },
    {
      id: "corinto-casa-6",
      name: "Casa Premium Lago",
      image: "/placeholder.svg",
      description:
        "La casa más exclusiva con todas las comodidades y vista espectacular.",
      features: [
        { icon: Bed, text: "5 habitaciones" },
        { icon: Bath, text: "4 baños" },
        { icon: Users, text: "12 huéspedes" },
        { icon: Car, text: "3 autos" },
      ],
      pricing: { weekday: 500, weekend: 700, daily: 600 },
      amenities: [
        "Jacuzzi",
        "Muelle privado",
        "Lancha incluida",
        "Servicio de limpieza",
      ],
    },
  ];

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
              onClick={() => navigate("/corinto")}
              className="hover:text-blue-600"
            >
              Corinto
            </button>
            <span>›</span>
            <span className="text-slate-900 font-medium">Casas</span>
          </div>
        </div>
      </div>

      {/* Header */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-slate-900 mb-4">
              Casas en Corinto
            </h1>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Descubre nuestras 6 hermosas casas junto al lago, perfectas para
              una experiencia familiar inolvidable
            </p>
          </div>
        </div>
      </section>

      {/* Houses Grid */}
      <section className="py-8 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
            {casas.map((casa, index) => (
              <Card
                key={casa.id}
                className="group hover:shadow-xl transition-all duration-300"
              >
                <div className="relative h-48 overflow-hidden rounded-t-lg">
                  <img
                    src={casa.image}
                    alt={casa.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-4 left-4 bg-green-600 text-white px-3 py-1 rounded">
                    <span className="font-semibold text-sm">
                      CASA {index + 1}
                    </span>
                  </div>
                </div>

                <CardContent className="p-6">
                  <h3 className="text-xl font-bold text-slate-900 mb-2">
                    {casa.name}
                  </h3>
                  <p className="text-slate-600 mb-4 text-sm">
                    {casa.description}
                  </p>

                  {/* Features Grid */}
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    {casa.features.map((feature, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 text-xs text-slate-600"
                      >
                        <feature.icon className="h-4 w-4 text-green-600" />
                        <span>{feature.text}</span>
                      </div>
                    ))}
                  </div>

                  {/* Amenities */}
                  <div className="mb-4">
                    <div className="flex flex-wrap gap-1">
                      {casa.amenities.slice(0, 3).map((amenity, index) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="text-xs"
                        >
                          {amenity}
                        </Badge>
                      ))}
                      {casa.amenities.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{casa.amenities.length - 3} más
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Pricing */}
                  <div className="border-t border-slate-200 pt-4 mb-4">
                    <div className="grid grid-cols-3 gap-2 text-center text-xs">
                      <div>
                        <div className="text-slate-500">Semana</div>
                        <div className="font-semibold">
                          ${casa.pricing.weekday}
                        </div>
                      </div>
                      <div>
                        <div className="text-slate-500">Fin Semana</div>
                        <div className="font-semibold">
                          ${casa.pricing.weekend}
                        </div>
                      </div>
                      <div>
                        <div className="text-slate-500">Feriado</div>
                        <div className="font-semibold">
                          ${casa.pricing.daily}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      className="flex-1 bg-blue-900 hover:bg-blue-800"
                      size="sm"
                      onClick={() => navigate(`/casa/${casa.id}`)}
                    >
                      Ver Detalles
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
      <section className="py-16 bg-blue-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            ¿Listo para tu escapada al lago?
          </h2>
          <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
            Reserva ahora tu casa ideal en Corinto y disfruta de la tranquilidad
            del lago
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => navigate("/reservas")}
              className="bg-white text-blue-900 hover:bg-slate-100"
            >
              Hacer Reserva
            </Button>
            <Button
              variant="outline"
              className="border-white text-white hover:bg-white/10"
              onClick={() => navigate("/corinto")}
            >
              Volver a Corinto
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

export default CorintoCasas;
