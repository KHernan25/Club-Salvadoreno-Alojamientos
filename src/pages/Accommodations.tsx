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
import { useTranslations } from "@/contexts/LanguageContext";
import Navbar from "@/components/Navbar";
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
  Bed,
  Bath,
  Wifi,
  Car,
  Utensils,
  Tv,
  Wind,
} from "lucide-react";

const Accommodations = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState("apartamentos");

  const accommodationTypes = [
    {
      id: "casas",
      title: "CASAS",
      description:
        "Perfectas para grupos y familias que buscan privacidad, amplitud y comodidad. Disfruta de espacios equipados, rodeados de naturaleza y con acceso directo a la playa.",
      image: "/placeholder.svg",
      features: [
        "2-4 habitaciones",
        "Cocina completa",
        "Sala de estar",
        "Terraza privada",
      ],
    },
    {
      id: "apartamentos",
      title: "APARTAMENTOS",
      description:
        "Ideales para estancias cómodas con todas las comodidades. Modernos, funcionales y con vistas espectaculares al océano y la naturaleza tropical.",
      image: "/placeholder.svg",
      features: ["1-2 habitaciones", "Kitchenette", "Balcón", "Vista al mar"],
    },
    {
      id: "suites",
      title: "SUITES",
      description:
        "Pensadas para una estadia íntima, elegante y llena de confort. Cada suite ofrece un refugio exclusivo donde relajarse frente al majestuoso Pacífico salvadoreño.",
      image: "/placeholder.svg",
      features: [
        "Suite ejecutiva",
        "Jacuzzi privado",
        "Servicio premium",
        "Vista panorámica",
      ],
    },
  ];

  const apartmentDetails = [
    {
      id: "1A",
      name: "Apartamento 1A",
      category: "apartamentos",
      image: "/placeholder.svg",
      description:
        "Apartamento amplio con vista al océano, perfecto para parejas o familias pequeñas.",
      features: [
        { icon: Bed, text: "2 camas full" },
        { icon: Tv, text: "LCD Smart TV Pantalla Plana" },
        { icon: Wifi, text: "Internet Wi-Fi" },
        { icon: Bath, text: "1 Baño" },
        { icon: Utensils, text: "Vajilla y Utensilios de cocina" },
        { icon: Users, text: "Caja Fuerte" },
        { icon: Wind, text: "Cafetera" },
        { icon: Home, text: "Toallas" },
        { icon: Tv, text: "Tostador" },
        { icon: Wind, text: "Aire Acondicionado" },
        { icon: Crown, text: "Plataformas de Streaming" },
        {
          icon: Users,
          text: "Acceso para personas con capacidades especiales",
        },
      ],
      pricing: {
        weekday: 110,
        weekend: 230,
        daily: 140,
      },
    },
    {
      id: "1B",
      name: "Apartamento 1B",
      category: "apartamentos",
      image: "/placeholder.svg",
      description:
        "Moderno apartamento con todas las comodidades para una estancia perfecta.",
      features: [
        { icon: Bed, text: "1 cama queen" },
        { icon: Tv, text: "Smart TV" },
        { icon: Wifi, text: "Internet Wi-Fi" },
        { icon: Bath, text: "1 Baño completo" },
      ],
      pricing: {
        weekday: 95,
        weekend: 210,
        daily: 125,
      },
    },
    {
      id: "2A",
      name: "Apartamento 2A",
      category: "apartamentos",
      image: "/placeholder.svg",
      description:
        "Espacioso apartamento en el segundo piso con vistas espectaculares.",
      features: [
        { icon: Bed, text: "2 camas full" },
        { icon: Tv, text: "LCD Smart TV" },
        { icon: Wifi, text: "Internet Wi-Fi" },
        { icon: Bath, text: "2 Baños" },
      ],
      pricing: {
        weekday: 120,
        weekend: 250,
        daily: 150,
      },
    },
  ];

  const casas = [
    {
      id: "casa1",
      name: "Casa Familiar",
      category: "casas",
      image: "/placeholder.svg",
      description:
        "Amplia casa con 3 habitaciones, ideal para familias grandes.",
      features: [
        { icon: Bed, text: "3 habitaciones" },
        { icon: Bath, text: "2 baños completos" },
        { icon: Utensils, text: "Cocina completa" },
        { icon: Car, text: "Estacionamiento privado" },
      ],
      pricing: {
        weekday: 200,
        weekend: 350,
        daily: 250,
      },
    },
  ];

  const suites = [
    {
      id: "suite1",
      name: "Suite Ejecutiva",
      category: "suites",
      image: "/placeholder.svg",
      description: "Elegante suite con jacuzzi y vista panorámica al océano.",
      features: [
        { icon: Crown, text: "Suite de lujo" },
        { icon: Bath, text: "Jacuzzi privado" },
        { icon: Tv, text: "TV premium" },
        { icon: Wind, text: "Clima centralizado" },
      ],
      pricing: {
        weekday: 300,
        weekend: 450,
        daily: 380,
      },
    },
  ];

  const getAllAccommodations = () => {
    switch (selectedCategory) {
      case "casas":
        return casas;
      case "suites":
        return suites;
      default:
        return apartmentDetails;
    }
  };

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
            backgroundImage: `linear-gradient(rgba(30, 58, 138, 0.8), rgba(30, 58, 138, 0.8)), url('/placeholder.svg')`,
          }}
        />
        <div className="relative z-10 container mx-auto px-4 h-full flex items-center">
          <div className="text-white">
            <h1 className="text-5xl font-bold mb-4">
              {t.accommodations.title.toUpperCase()}
            </h1>
            <p className="text-xl">
              Explora nuestras opciones de alojamiento, elige tu sede favorita y
              asegura tu lugar con solo unos clics.
            </p>
            <p className="text-lg mt-2 text-blue-100">
              Tu descanso comienza aquí.
            </p>
          </div>
        </div>
      </section>

      {/* Desktop indicator */}
      <div className="bg-slate-100 py-2 px-4">
        <span className="text-sm text-slate-600">Desktop - 7</span>
      </div>

      {/* Accommodation Categories */}
      <section className="py-16 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {accommodationTypes.map((type) => (
              <Card
                key={type.id}
                className={`cursor-pointer transition-all duration-300 hover:shadow-lg ${
                  selectedCategory === type.id
                    ? "ring-2 ring-blue-500 shadow-lg"
                    : ""
                }`}
                onClick={() => setSelectedCategory(type.id)}
              >
                <div className="relative h-48 overflow-hidden rounded-t-lg">
                  <img
                    src={type.image}
                    alt={type.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-4 left-4 bg-green-600 text-white px-4 py-2 rounded">
                    <span className="font-bold">{type.title}</span>
                  </div>
                </div>
                <CardContent className="p-6">
                  <p className="text-slate-700 mb-4 leading-relaxed text-sm">
                    {type.description}
                  </p>
                  <div className="space-y-1">
                    {type.features.map((feature, index) => (
                      <div key={index} className="text-xs text-slate-600">
                        • {feature}
                      </div>
                    ))}
                  </div>
                  <Button
                    className="w-full mt-4 bg-blue-900 hover:bg-blue-800"
                    size="sm"
                  >
                    Ver Detalles
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Accommodation Listings */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 lg:grid-cols-2 xl:grid-cols-3">
            {getAllAccommodations().map((accommodation) => (
              <Card
                key={accommodation.id}
                className="group hover:shadow-xl transition-all duration-300"
              >
                <div className="relative h-64 overflow-hidden rounded-t-lg">
                  <img
                    src={accommodation.image}
                    alt={accommodation.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-4 left-4 bg-blue-900 text-white px-3 py-1 rounded">
                    <span className="font-semibold">{accommodation.name}</span>
                  </div>
                </div>

                <CardContent className="p-6">
                  <h3 className="text-xl font-bold text-slate-900 mb-2">
                    {accommodation.name}
                  </h3>
                  <p className="text-slate-600 mb-4 text-sm">
                    {accommodation.description}
                  </p>

                  {/* Features Grid */}
                  <div className="grid grid-cols-2 gap-2 mb-6">
                    {accommodation.features
                      .slice(0, 6)
                      .map((feature, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-2 text-xs text-slate-600"
                        >
                          <feature.icon className="h-3 w-3" />
                          <span>{feature.text}</span>
                        </div>
                      ))}
                  </div>

                  {/* Pricing */}
                  <div className="border-t border-slate-200 pt-4 mb-4">
                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div>
                        <div className="text-xs text-slate-500">
                          Día de Semana
                        </div>
                        <div className="text-sm font-semibold">
                          ${accommodation.pricing.weekday}
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-slate-500">
                          Fin de Semana
                        </div>
                        <div className="text-sm font-semibold">
                          ${accommodation.pricing.weekend}
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-slate-500">
                          Asueto (Día)
                        </div>
                        <div className="text-sm font-semibold">
                          ${accommodation.pricing.daily}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      className="flex-1 bg-blue-900 hover:bg-blue-800"
                      size="sm"
                      onClick={() => {
                        if (accommodation.category === "casas") {
                          navigate(`/casa/${accommodation.id}`);
                        } else if (accommodation.category === "suites") {
                          navigate(`/suite/${accommodation.id}`);
                        } else {
                          navigate(`/apartamento/${accommodation.id}`);
                        }
                      }}
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

      {/* Contact Section */}
      <section className="py-16 bg-slate-100">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-slate-900 mb-8">
            Contáctenos
          </h2>
          <p className="text-lg text-slate-600 mb-8">
            ¿Necesitas más información? Estamos aquí para ayudarte
          </p>

          <div className="grid md:grid-cols-2 gap-4 max-w-md mx-auto">
            <Button variant="outline" className="gap-2">
              <User className="h-4 w-4" />
              Información
            </Button>
            <Button className="bg-blue-900 hover:bg-blue-800 gap-2">
              <ArrowRight className="h-4 w-4" />
              Reservar Ahora
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

export default Accommodations;
