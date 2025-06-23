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
  Wind,
} from "lucide-react";
import Navbar from "@/components/Navbar";

const ElSunzalCasas = () => {
  const navigate = useNavigate();

  // Simulated 6 houses data for El Sunzal
  const casas = [
    {
      id: "sunzal-casa-1",
      name: "Casa Surf Paradise",
      image: "/placeholder.svg",
      description:
        "Casa frente al mar diseñada para surfistas, con almacenamiento para tablas.",
      features: [
        { icon: Bed, text: "3 habitaciones" },
        { icon: Bath, text: "2 baños" },
        { icon: Users, text: "6 huéspedes" },
        { icon: Waves, text: "Frente al mar" },
      ],
      pricing: { weekday: 320, weekend: 420, daily: 370 },
      amenities: [
        "Almacén de tablas",
        "Ducha exterior",
        "Wi-Fi",
        "Terraza surf",
      ],
    },
    {
      id: "sunzal-casa-2",
      name: "Casa Tropical Family",
      image: "/placeholder.svg",
      description:
        "Amplia casa familiar con jardín tropical y área de juegos para niños.",
      features: [
        { icon: Bed, text: "4 habitaciones" },
        { icon: Bath, text: "3 baños" },
        { icon: Users, text: "8 huéspedes" },
        { icon: Trees, text: "Jardín tropical" },
      ],
      pricing: { weekday: 380, weekend: 480, daily: 430 },
      amenities: ["Área de juegos", "Piscina infantil", "Parrilla", "Hamacas"],
    },
    {
      id: "sunzal-casa-3",
      name: "Casa Vista Océano",
      image: "/placeholder.svg",
      description:
        "Casa con vista panorámica al océano desde todas las habitaciones.",
      features: [
        { icon: Bed, text: "3 habitaciones" },
        { icon: Bath, text: "2 baños" },
        { icon: Users, text: "6 huéspedes" },
        { icon: Wind, text: "Vista 360°" },
      ],
      pricing: { weekday: 350, weekend: 450, daily: 400 },
      amenities: [
        "Terraza panorámica",
        "Telescopio",
        "Área yoga",
        "Sunset deck",
      ],
    },
    {
      id: "sunzal-casa-4",
      name: "Casa Beach Club",
      image: "/placeholder.svg",
      description:
        "Casa con acceso directo a la playa y área de entretenimiento.",
      features: [
        { icon: Bed, text: "4 habitaciones" },
        { icon: Bath, text: "3 baños" },
        { icon: Users, text: "10 huéspedes" },
        { icon: Waves, text: "Acceso playa" },
      ],
      pricing: { weekday: 450, weekend: 600, daily: 525 },
      amenities: [
        "Bar exterior",
        "Mesa de ping pong",
        "Equipo snorkel",
        "Kayaks",
      ],
    },
    {
      id: "sunzal-casa-5",
      name: "Casa Bohemia",
      image: "/placeholder.svg",
      description:
        "Casa de estilo bohemio con decoración artística y ambiente relajado.",
      features: [
        { icon: Bed, text: "2 habitaciones" },
        { icon: Bath, text: "2 baños" },
        { icon: Users, text: "4 huéspedes" },
        { icon: Trees, text: "Jardín zen" },
      ],
      pricing: { weekday: 280, weekend: 380, daily: 330 },
      amenities: ["Área arte", "Biblioteca", "Yoga mat", "Música ambiente"],
    },
    {
      id: "sunzal-casa-6",
      name: "Casa Premium Oceanfront",
      image: "/placeholder.svg",
      description:
        "La casa más exclusiva con todas las comodidades de lujo frente al mar.",
      features: [
        { icon: Bed, text: "5 habitaciones" },
        { icon: Bath, text: "4 baños" },
        { icon: Users, text: "12 huéspedes" },
        { icon: Car, text: "3 autos" },
      ],
      pricing: { weekday: 550, weekend: 750, daily: 650 },
      amenities: [
        "Jacuzzi exterior",
        "Chef privado",
        "Mayordomo",
        "Spa privado",
      ],
    },
  ];

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
            <span className="text-slate-900 font-medium">Casas</span>
          </div>
        </div>
      </div>

      {/* Header */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-slate-900 mb-4">
              Casas en El Sunzal
            </h1>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Descubre nuestras 6 exclusivas casas frente al mar, perfectas para
              una experiencia tropical inolvidable
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
                  <div className="absolute top-4 right-4 bg-blue-600 text-white px-2 py-1 rounded text-xs">
                    Frente al Mar
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
                        <feature.icon className="h-4 w-4 text-blue-600" />
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
            ¿Listo para tu aventura en el mar?
          </h2>
          <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
            Reserva ahora tu casa ideal en El Sunzal y disfruta del mejor surf y
            playas de El Salvador
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

export default ElSunzalCasas;
