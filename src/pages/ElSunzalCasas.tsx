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

  // Complete 6 houses data for El Sunzal with personalized descriptions
  const casas = [
    {
      id: "casa1",
      name: "Casa Surf Paradise",
      image: "/DSC_5197.jpg",
      description:
        "Casa frente al mar diseñada específicamente para surfistas, con almacenamiento especializado para tablas y ducha exterior para después de las sesiones. Ubicada en primera línea de playa con acceso directo al break más famoso de El Sunzal.",
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
      id: "casa2",
      name: "Casa Tropical Family",
      image: "/DSC_5191.jpg",
      description:
        "Amplia casa familiar con jardín tropical exuberante y área de juegos diseñada especialmente para niños. Perfecta para familias que buscan espacios seguros y cómodos sin renunciar al lujo tropical. Incluye piscina infantil privada y zona de parrilla para reuniones familiares.",
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
      id: "casa3",
      name: "Casa Vista Panorámica",
      image: "/DSC_5201.jpg",
      description:
        "Casa estratégicamente construida en una elevación privilegiada que ofrece vistas panorámicas de 360° al océano Pacífico desde todas las habitaciones. Ideal para quienes buscan una conexión total con el mar y disfrutar de amaneceres y atardeceres espectaculares desde la comodidad de su hogar temporal.",
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
            backgroundImage: `linear-gradient(rgba(2, 22, 71, 0.69), rgba(2, 21, 71, 0.85)), url('/DSC_5201.jpg')`,
          }}
        />
        <div className="relative z-10 container mx-auto px-4 h-full flex items-center justify-center text-center">
          <div className="text-white max-w-2xl">
            <h1 className="text-7xl font-bold mb-4">Casas en El Sunzal</h1>
            <p className="text-xl">
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
                      onClick={() =>
                        navigate(
                          `/reservas?accommodation=casa&id=${casa.id}&name=${encodeURIComponent(casa.name)}`,
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
            ¿Listo para tu aventura en el mar?
          </h2>
          <p className="text-blue-900 mb-8 max-w-2xl mx-auto">
            Reserva ahora tu casa ideal en El Sunzal y disfruta del mejor surf y
            playas de El Salvador
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              variant="outline"
              onClick={() =>
                navigate("/reservas?accommodation=casa&location=el-sunzal")
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

export default ElSunzalCasas;
