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
  Mountain,
} from "lucide-react";

const CorintoApartamentos = () => {
  const navigate = useNavigate();

  // Complete apartment data for Corinto
  const apartamentos = [
    {
      id: "corinto1A",
      name: "Apartamento 1A Lago",
      image: "/placeholder.svg",
      description:
        "Apartamento en primera planta con vista directa al Lago de Ilopango, ideal para parejas que buscan tranquilidad lakeside.",
      features: [
        { icon: Bed, text: "2 camas full" },
        { icon: Bath, text: "1 baño" },
        { icon: Users, text: "4 huéspedes" },
        { icon: Mountain, text: "Vista al lago" },
      ],
      pricing: { weekday: 100, weekend: 210, daily: 260 },
      amenities: [
        "Wi-Fi alta velocidad",
        "Estacionamiento",
        "Cocina equipada",
        "Terraza vista lago",
      ],
      fullDescription:
        "Ubicado en primera planta con acceso directo sin escaleras, este apartamento ofrece vistas panorámicas del Lago de Ilopango. Perfecto para huéspedes que buscan tranquilidad y conexión con la naturaleza lacustre.",
    },
    {
      id: "corinto1B",
      name: "Apartamento 1B Jardín",
      image: "/placeholder.svg",
      description:
        "Apartamento en primera planta rodeado de jardines tropicales, con ambiente natural y privacidad total.",
      features: [
        { icon: Bed, text: "2 camas full" },
        { icon: Bath, text: "1 baño" },
        { icon: Users, text: "4 huéspedes" },
        { icon: Trees, text: "Jardín privado" },
      ],
      pricing: { weekday: 85, weekend: 190, daily: 230 },
      amenities: [
        "Wi-Fi",
        "Estacionamiento",
        "Cocina completa",
        "Jardín privado",
      ],
      fullDescription:
        "Rodeado de exuberantes jardines tropicales, este apartamento ofrece máxima privacidad y conexión con la naturaleza. Ideal para huéspedes que buscan tranquilidad en un ambiente natural privilegiado.",
    },
    {
      id: "corinto2A",
      name: "Apartamento 2A Premium",
      image: "/placeholder.svg",
      description:
        "Apartamento en segunda planta con vistas elevadas del lago y acabados premium para una experiencia superior.",
      features: [
        { icon: Bed, text: "2 camas queen" },
        { icon: Bath, text: "1 baño premium" },
        { icon: Users, text: "4 huéspedes" },
        { icon: Mountain, text: "Vista elevada" },
      ],
      pricing: { weekday: 110, weekend: 230, daily: 280 },
      amenities: [
        "Wi-Fi fibra óptica",
        "Estacionamiento",
        "Cocina gourmet",
        "Balcón premium",
      ],
      fullDescription:
        "En segunda planta con vistas elevadas del lago, este apartamento premium ofrece acabados superiores y comodidades mejoradas. Perfecto para huéspedes que buscan lujo discreto con vistas espectaculares.",
    },
    {
      id: "corinto2B",
      name: "Apartamento 2B Familiar",
      image: "/placeholder.svg",
      description:
        "Apartamento familiar en segunda planta con espacios amplios y distribución óptima para familias.",
      features: [
        { icon: Bed, text: "2 camas + sofá cama" },
        { icon: Bath, text: "1 baño familiar" },
        { icon: Users, text: "6 huéspedes" },
        { icon: Home, text: "Espacios amplios" },
      ],
      pricing: { weekday: 105, weekend: 220, daily: 270 },
      amenities: [
        "Wi-Fi",
        "Estacionamiento",
        "Cocina extendida",
        "Área de juegos",
      ],
      fullDescription:
        "Diseñado especialmente para familias, este apartamento ofrece espacios amplios y distribución funcional. Con área de juegos para niños y comodidades familiares en un ambiente seguro.",
    },
    {
      id: "corinto3A",
      name: "Apartamento 3A Penthouse",
      image: "/placeholder.svg",
      description:
        "Apartamento penthouse en tercera planta con las mejores vistas panorámicas del Lago de Ilopango.",
      features: [
        { icon: Bed, text: "2 camas king" },
        { icon: Bath, text: "1 baño de lujo" },
        { icon: Users, text: "4 huéspedes" },
        { icon: Mountain, text: "Vista 360°" },
      ],
      pricing: { weekday: 130, weekend: 260, daily: 320 },
      amenities: [
        "Wi-Fi premium",
        "Estacionamiento VIP",
        "Cocina de lujo",
        "Terraza panorámica",
      ],
      fullDescription:
        "El apartamento más exclusivo de Corinto, ubicado en la tercera planta con vistas panorámicas de 360 grados. Acabados de lujo y la experiencia de alojamiento más premium disponible.",
    },
    {
      id: "corinto3B",
      name: "Apartamento 3B Vista Total",
      image: "/placeholder.svg",
      description:
        "Apartamento premium en tercera planta con vistas totales del lago y montañas circundantes.",
      features: [
        { icon: Bed, text: "2 camas king" },
        { icon: Bath, text: "1 baño spa" },
        { icon: Users, text: "4 huéspedes" },
        { icon: Mountain, text: "Vista total lago" },
      ],
      pricing: { weekday: 125, weekend: 250, daily: 310 },
      amenities: [
        "Wi-Fi de alta velocidad",
        "Estacionamiento premium",
        "Cocina completamente equipada",
        "Terraza vista total",
      ],
      fullDescription:
        "Con vistas totales del lago y las montañas, este apartamento premium ofrece una experiencia visual incomparable. Ideal para huéspedes que buscan las mejores vistas en un ambiente de lujo discreto.",
    },
  ];

  const formatPrice = (price: number) => {
    return `$${price}`;
  };

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
              <Button variant="ghost">
                <Menu className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative h-72 bg-gradient-to-b from-green-900 to-green-800">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `linear-gradient(rgba(5, 46, 22, 0.7), rgba(5, 46, 22, 0.8)), url('/placeholder.svg')`,
          }}
        />
        <div className="relative z-10 container mx-auto px-4 h-full flex items-center justify-center text-center">
          <div className="text-white max-w-2xl">
            <h1 className="text-5xl font-bold mb-4">Apartamentos Corinto</h1>
            <p className="text-lg">
              Experimenta la tranquilidad lakeside en nuestros apartamentos con
              vista al Lago de Ilopango. Cada apartamento está diseñado para
              maximizar las vistas y brindar comodidad en un entorno natural
              único.
            </p>
          </div>
        </div>
      </section>

      {/* Breadcrumb */}
      <div className="bg-slate-50 py-4">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <span
              className="cursor-pointer hover:text-blue-600"
              onClick={() => navigate("/dashboard")}
            >
              Inicio
            </span>
            <ArrowRight className="h-4 w-4" />
            <span
              className="cursor-pointer hover:text-blue-600"
              onClick={() => navigate("/corinto")}
            >
              Corinto
            </span>
            <ArrowRight className="h-4 w-4" />
            <span className="text-slate-900 font-medium">Apartamentos</span>
          </div>
        </div>
      </div>

      {/* Apartments Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              Nuestros Apartamentos en Corinto
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Desde primera planta con acceso directo hasta penthouses con
              vistas panorámicas, cada apartamento ofrece una experiencia única
              frente al Lago de Ilopango.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {apartamentos.map((apartamento) => (
              <Card
                key={apartamento.id}
                className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => navigate(`/apartamento/${apartamento.id}`)}
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={apartamento.image}
                    alt={apartamento.name}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-green-600 text-white">
                      Vista Lago
                    </Badge>
                  </div>
                  <div className="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-1 rounded">
                    <span className="text-sm">
                      Desde {formatPrice(apartamento.pricing.weekday)}/noche
                    </span>
                  </div>
                </div>

                <CardHeader>
                  <CardTitle className="text-xl">{apartamento.name}</CardTitle>
                  <CardDescription className="text-slate-600">
                    {apartamento.description}
                  </CardDescription>
                </CardHeader>

                <CardContent>
                  {/* Features */}
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    {apartamento.features.map((feature, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <feature.icon className="h-4 w-4 text-green-600" />
                        <span className="text-sm text-slate-600">
                          {feature.text}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Amenities */}
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-slate-900 mb-2">
                      Amenidades incluidas:
                    </h4>
                    <div className="flex flex-wrap gap-1">
                      {apartamento.amenities.map((amenity, index) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="text-xs"
                        >
                          {amenity}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Pricing */}
                  <div className="border-t pt-4">
                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div>
                        <div className="text-xs text-slate-500">Lun-Jue</div>
                        <div className="font-bold text-green-600">
                          {formatPrice(apartamento.pricing.weekday)}
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-slate-500">Vie-Dom</div>
                        <div className="font-bold text-blue-600">
                          {formatPrice(apartamento.pricing.weekend)}
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-slate-500">Feriado</div>
                        <div className="font-bold text-red-600">
                          {formatPrice(apartamento.pricing.daily)}
                        </div>
                      </div>
                    </div>
                  </div>

                  <Button className="w-full mt-4 bg-green-600 hover:bg-green-700">
                    Ver Detalles
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-green-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">
            ¿Listo para tu estadía lakeside?
          </h2>
          <p className="text-lg text-slate-600 mb-8 max-w-2xl mx-auto">
            Todos nuestros apartamentos en Corinto incluyen acceso completo a
            las instalaciones del club, vistas al lago y la tranquilidad que
            solo un entorno lacustre puede ofrecer.
          </p>
          <div className="flex gap-4 justify-center">
            <Button
              size="lg"
              className="bg-green-600 hover:bg-green-700"
              onClick={() => navigate("/reservas")}
            >
              Hacer Reserva
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => navigate("/corinto")}
            >
              Ver Corinto
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

export default CorintoApartamentos;
