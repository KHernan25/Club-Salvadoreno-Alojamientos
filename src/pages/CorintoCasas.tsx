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
import Navbar from "@/components/Navbar";

const CorintoCasas = () => {
  const navigate = useNavigate();

  // Casas de Corinto con descripciones personalizadas únicas
  const casas = [
    {
      id: "corinto-casa-1",
      name: "Casa del Lago",
      image: "/DSC_5508.jpg",
      description:
        "Casa ideal para familias que buscan comodidad y tranquilidad junto al agua. Ubicada en una posición estratégica con vista directa al lago, ofrece espacios amplios y un jardín privado perfecto para relajarse mientras disfrutan de la brisa lacustre.",
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
      image: "/DSC_5515.jpg",
      description:
        "Diseñada especialmente para familias numerosas, esta casa combina amplitud y confort con vistas panorámicas al Lago de Ilopango. Con capacidad para 8 personas, incluye muelle privado y espacios de entretenimiento ideales para reuniones familiares memorables.",
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
      image: "/DSC_5525.jpg",
      description:
        "Refugio perfecto para parejas o familias pequeñas que buscan paz absoluta. Esta casa íntima cuenta con un jardín zen único, espacios de meditación y un ambiente sereno que invita al descanso y la contemplación junto al lago.",
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
      image: "/DSC_5529.jpg",
      description:
        "Casa temática diseñada para los amantes de la pesca deportiva y actividades acuáticas. Incluye equipo especializado, acceso directo al lago, y facilidades para limpiar y preparar las capturas del día en un ambiente auténticamente lacustre.",
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
      image: "/DSC_5517.jpg",
      description:
        "Casa especialmente equipada para eventos familiares, reuniones corporativas o celebraciones especiales. Con capacidad para 10 personas, incluye cocina industrial, sistema de sonido y espacios amplios diseñados para grupos que buscan compartir experiencias únicas.",
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
      image: "/DSC_5542.jpg",
      description:
        "La experiencia más exclusiva en Corinto. Casa de lujo con capacidad para 12 huéspedes que incluye jacuzzi, lancha privada y servicios premium. Perfecta para ocasiones especiales, luna de miel o grupos que buscan el máximo nivel de comodidad y exclusividad.",
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
      <Navbar />

      {/* Header */}
      <section className="relative h-96 bg-gradient-to-b from-blue-900 to-blue-800">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `linear-gradient(rgba(2, 22, 71, 0.69), rgba(2, 21, 71, 0.85)), url('/DSC_5508.jpg')`,
          }}
        />
        <div className="relative z-10 container mx-auto px-4 h-full flex items-center justify-center text-center">
          <div className="text-white max-w-2xl">
            <h1 className="text-7xl font-bold mb-4">
              Casas en Corinto
            </h1>
            <p className="text-xl">
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
                      onClick={() => navigate(`/casa/${casa.id}#precios`)}
                    >
                      Ver Precios
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
            ¿Listo para tu escapada al lago?
          </h2>
          <p className="text-blue-900 mb-8 max-w-2xl mx-auto">
            Reserva ahora tu casa ideal en Corinto y disfruta de la tranquilidad
            del lago
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              variant="outline"
              onClick={() => navigate("/reservas")}
              className="bg-blue-900 text-white hover:bg-white/10"
            >
              Hacer Reserva
            </Button>
            <Button
              variant="outline"
              className="bg-blue-900 text-white hover:bg-white/10"
              onClick={() => navigate("/corinto")}
            >
              Volver a Corinto
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

export default CorintoCasas;
