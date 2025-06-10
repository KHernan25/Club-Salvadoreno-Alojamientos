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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate, useParams } from "react-router-dom";
import {
  Menu,
  Globe,
  User,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Star,
  Bed,
  Bath,
  Wifi,
  Car,
  Utensils,
  Tv,
  Wind,
  Crown,
  Users,
  Home,
  Calendar,
  Check,
  X,
} from "lucide-react";

const ApartmentDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Simulated apartment data - in real app this would come from API
  const apartmentData = {
    "1A": {
      name: "Apartamento 1A",
      images: ["/placeholder.svg", "/placeholder.svg", "/placeholder.svg"],
      description:
        "El apartamento 1A está diseñado para brindarle una experiencia de descanso y comodidad en un entorno natural privilegiado, justo en el corazón de la Costa Brava de la costa salvadoreña.",
      fullDescription:
        "Es un espacio íntimo, funcional y encantador, donde cada detalle está diseñado para que usted descanse reparador después de un día de piscina en la terraza privada en su centro perfecto para activar su manera privada de vivir el momento.",
      additionalInfo:
        "El centro, funciones específicas en cualquier momento de sus aventuras que le serán y le permiten disfrutar del tiempo cómodo y fresco para contemplar de tranquilidad necesario en toda actividad para la aventura que alentara para la serenidad y vivir al momento.",
      note: "Todo esto sitio permitido únicamente con un ambiente cálido, limpio y bien cuidado, donde la privacidad es amistoso para la costa o la aventura. las áreas comunes del centro viven, compartidas como un restaurant, piscina y otros eventos, considerando una experiencia inolvidable.",
      finalNote:
        "Apartamento 1A un espacio íntimo, funcional y encantador, donde cada detalle está diseñado para que usted vea el descanso que merece, a solo unos pasos de las olas del Pacífico.",
      features: [
        { icon: Bed, text: "2 camas full", included: true },
        { icon: Tv, text: "LCD Smart TV Pantalla Plana", included: true },
        { icon: Wifi, text: "Internet Wi-Fi", included: true },
        { icon: Bath, text: "1 Baño", included: true },
        {
          icon: Utensils,
          text: "Vajilla y Utensilios de cocina",
          included: true,
        },
        { icon: Users, text: "Caja Fuerte", included: true },
        { icon: Wind, text: "Cafetera", included: true },
        { icon: Home, text: "Toallas", included: true },
        { icon: Tv, text: "Tostador", included: true },
        { icon: Wind, text: "Aire Acondicionado", included: true },
        { icon: Crown, text: "Plataformas de Streaming", included: true },
        {
          icon: Users,
          text: "Acceso para personas con capacidades especiales",
          included: true,
        },
      ],
      pricing: {
        weekday: {
          label: "Día de Semana",
          sublabel: "(Precio por noche)",
          price: 110,
        },
        weekend: {
          label: "Fin de Semana",
          sublabel: "(Precio por noche)",
          price: 230,
        },
        daily: {
          label: "Asueto (Día)",
          sublabel: "(Precio por noche)",
          price: 140,
        },
      },
      checkIn: "3:00 pm",
      checkOut: "12:00 md",
    },
  };

  const apartment =
    apartmentData[id as keyof typeof apartmentData] || apartmentData["1A"];

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % apartment.images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex(
      (prev) => (prev - 1 + apartment.images.length) % apartment.images.length,
    );
  };

  const apartmentTabs = [
    { id: "1A", label: "Apartamento 1A" },
    { id: "1B", label: "Apartamento 1B" },
    { id: "2A", label: "Apartamento 2A" },
    { id: "2B", label: "Apartamento 2B" },
    { id: "3A", label: "Apartamento 3A" },
    { id: "3B", label: "Apartamento 3B" },
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
                onClick={() => navigate("/")}
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

      {/* Apartment Tabs */}
      <div className="bg-slate-50 border-b border-slate-200">
        <div className="container mx-auto px-4">
          <div className="flex overflow-x-auto">
            {apartmentTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => navigate(`/apartamento/${tab.id}`)}
                className={`px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 ${
                  tab.id === id
                    ? "border-blue-500 text-blue-600 bg-white"
                    : "border-transparent text-slate-600 hover:text-slate-900"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Left Column - Images and Description */}
          <div>
            {/* Image Gallery */}
            <div className="relative mb-8">
              <div className="relative h-96 overflow-hidden rounded-lg">
                <img
                  src={apartment.images[currentImageIndex]}
                  alt={apartment.name}
                  className="w-full h-full object-cover"
                />

                {/* Navigation Arrows */}
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>

                {/* Image Indicators */}
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                  {apartment.images.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`w-2 h-2 rounded-full ${
                        index === currentImageIndex ? "bg-white" : "bg-white/50"
                      }`}
                    />
                  ))}
                </div>

                {/* Badge overlays */}
                <div className="absolute top-4 left-4 space-y-2">
                  <Badge className="bg-blue-900 text-white">FOTOS</Badge>
                  <Badge className="bg-blue-600 text-white">VIDEO</Badge>
                  <Badge className="bg-purple-600 text-white">360°</Badge>
                </div>
              </div>
            </div>

            {/* Apartment Description */}
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold text-slate-900 mb-4">
                  {apartment.name}
                </h1>
                <p className="text-slate-700 leading-relaxed mb-4">
                  {apartment.description}
                </p>
                <p className="text-slate-700 leading-relaxed mb-4">
                  {apartment.fullDescription}
                </p>
                <p className="text-slate-700 leading-relaxed mb-4">
                  {apartment.additionalInfo}
                </p>
                <p className="text-slate-600 italic mb-4">{apartment.note}</p>
                <p className="text-slate-700 font-medium">
                  {apartment.finalNote}
                </p>
              </div>
            </div>
          </div>

          {/* Right Column - Features and Booking */}
          <div className="space-y-8">
            {/* Features */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl font-bold text-slate-900">
                  {apartment.name} Incluye:
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {apartment.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <feature.icon className="h-5 w-5 text-blue-600" />
                      <span className="text-slate-700">{feature.text}</span>
                      {feature.included && (
                        <Check className="h-4 w-4 text-green-600 ml-auto" />
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Pricing */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl font-bold text-slate-900">
                  Tarifa
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(apartment.pricing).map(([key, pricing]) => (
                    <div
                      key={key}
                      className="flex justify-between items-center p-4 bg-slate-50 rounded-lg"
                    >
                      <div>
                        <div className="font-medium text-slate-900">
                          {pricing.label}
                        </div>
                        <div className="text-sm text-slate-600">
                          {pricing.sublabel}
                        </div>
                      </div>
                      <div className="text-2xl font-bold text-slate-900">
                        ${pricing.price}.00
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <div className="flex justify-between text-sm">
                    <span>Hora de entrada (Check in) {apartment.checkIn}</span>
                    <span>Hora de salida (Check out) {apartment.checkOut}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Booking Section */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl font-bold text-slate-900">
                  Reservar
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Entrada
                    </label>
                    <div className="relative">
                      <input
                        type="date"
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        defaultValue="2025-06-07"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Salida
                    </label>
                    <div className="relative">
                      <input
                        type="date"
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        defaultValue="2025-06-08"
                      />
                    </div>
                  </div>
              <div
                className="flex items-center gap-3 cursor-pointer"
                onClick={() => navigate('/dashboard')}
              >
                >
                  Ver disponibilidad
                </Button>
              </CardContent>
            </Card>

            {/* Additional Images */}
            <div className="grid grid-cols-2 gap-4">
              <Card className="cursor-pointer hover:shadow-lg transition-shadow">
                <div className="relative h-32 overflow-hidden rounded-t-lg">
                  <img
                    src="/placeholder.svg"
                    alt="CASAS"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-2 left-2 bg-green-600 text-white px-2 py-1 rounded text-sm">
                    CASAS
                  </div>
                </div>
                <CardContent className="p-3">
                  <p className="text-xs text-slate-600 leading-tight">
                    Perfectas para grupos y familias que buscan privacidad,
                    amplitud y comodidad.
                  </p>
                  <Button
                    size="sm"
                    variant="outline"
                    className="w-full mt-2 text-xs"
                    onClick={() => navigate("/alojamientos")}
                  >
                    Ver Detalles
                  </Button>
                </CardContent>
              </Card>

              <Card className="cursor-pointer hover:shadow-lg transition-shadow">
                <div className="relative h-32 overflow-hidden rounded-t-lg">
                  <img
                    src="/placeholder.svg"
                    alt="SUITES"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-2 left-2 bg-green-600 text-white px-2 py-1 rounded text-sm">
                    SUITES
                  </div>
                </div>
                <CardContent className="p-3">
                  <p className="text-xs text-slate-600 leading-tight">
                    Pensadas para una estadía íntima, elegante y llena de
                    confort.
                  </p>
                  <Button
                    size="sm"
                    variant="outline"
                    className="w-full mt-2 text-xs"
                    onClick={() => navigate("/alojamientos")}
                  >
                    Ver Detalles
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-blue-900 text-white py-8 mt-16">
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

export default ApartmentDetail;