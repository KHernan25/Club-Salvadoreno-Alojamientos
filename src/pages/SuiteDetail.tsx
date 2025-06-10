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
  Sparkles,
  Wine,
  Mountain,
} from "lucide-react";

const SuiteDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Simulated suite data
  const suiteData = {
    suite1: {
      name: "Suite Ejecutiva Presidencial",
      images: ["/placeholder.svg", "/placeholder.svg", "/placeholder.svg"],
      description:
        "Pensada para una estadía íntima, elegante y llena de confort. La Suite Ejecutiva ofrece un refugio exclusivo donde relajarse frente al majestuoso Pacífico salvadoreño.",
      fullDescription:
        "Esta suite premium combina lujo y funcionalidad en un ambiente sofisticado. Con acabados de primera calidad, amenidades exclusivas y vistas panorámicas, es perfecta para escapadas románticas o viajes de negocios de alto nivel.",
      additionalInfo:
        "La suite cuenta con sala de estar separada, dormitorio principal con cama king, vestidor amplio, baño de mármol con jacuzzi, terraza privada con vista al océano y servicio de mayordomo personalizado las 24 horas.",
      note: "Todas las suites incluyen servicio de conserje personalizado, acceso prioritario a restaurantes, spa privado y traslados en vehículo de lujo dentro del resort.",
      finalNote:
        "Suite Ejecutiva Presidencial: donde el lujo se encuentra con la naturaleza para crear una experiencia inolvidable en el paraíso del Club Salvadoreño.",
      features: [
        { icon: Crown, text: "Suite de lujo con cama king", included: true },
        {
          icon: Bath,
          text: "Baño de mármol con jacuzzi privado",
          included: true,
        },
        {
          icon: Mountain,
          text: "Terraza privada con vista panorámica",
          included: true,
        },
        { icon: Sparkles, text: "Servicio de mayordomo 24/7", included: true },
        { icon: Wine, text: "Minibar premium incluido", included: true },
        {
          icon: Tv,
          text: "Sistema de entretenimiento premium",
          included: true,
        },
        {
          icon: Wifi,
          text: "Internet Wi-Fi de alta velocidad",
          included: true,
        },
        { icon: Wind, text: "Climatización dual controlada", included: true },
        { icon: Car, text: "Servicio de traslados privados", included: true },
        {
          icon: Users,
          text: "Acceso VIP a todas las instalaciones",
          included: true,
        },
        {
          icon: Utensils,
          text: "Servicio de habitaciones 24 horas",
          included: true,
        },
        { icon: Crown, text: "Amenidades de lujo Hermès", included: true },
      ],
      pricing: {
        weekday: {
          label: "Día de Semana",
          sublabel: "(Precio por noche)",
          price: 650,
        },
        weekend: {
          label: "Fin de Semana",
          sublabel: "(Precio por noche)",
          price: 850,
        },
        daily: {
          label: "Asueto (Día)",
          sublabel: "(Precio por noche)",
          price: 750,
        },
      },
      checkIn: "2:00 pm",
      checkOut: "1:00 pm",
      maxGuests: 2,
    },
  };

  const suite = suiteData[id as keyof typeof suiteData] || suiteData["suite1"];

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % suite.images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex(
      (prev) => (prev - 1 + suite.images.length) % suite.images.length,
    );
  };

  const suiteTabs = [
    { id: "suite1", label: "Suite Ejecutiva" },
    { id: "suite2", label: "Suite Presidencial" },
    { id: "suite3", label: "Suite Royal" },
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
              <Button variant="ghost">
                <Menu className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Suite Tabs */}
      <div className="bg-slate-50 border-b border-slate-200">
        <div className="container mx-auto px-4">
          <div className="flex overflow-x-auto">
            {suiteTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => navigate(`/suite/${tab.id}`)}
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
                  src={suite.images[currentImageIndex]}
                  alt={suite.name}
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
                  {suite.images.map((_, index) => (
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
                  <Badge className="bg-purple-900 text-white">FOTOS</Badge>
                  <Badge className="bg-purple-600 text-white">VIDEO</Badge>
                  <Badge className="bg-gold-600 text-white">360°</Badge>
                  <Badge className="bg-yellow-600 text-white">VIP</Badge>
                </div>
              </div>
            </div>

            {/* Suite Description */}
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold text-slate-900 mb-4">
                  {suite.name}
                </h1>
                <p className="text-slate-700 leading-relaxed mb-4">
                  {suite.description}
                </p>
                <p className="text-slate-700 leading-relaxed mb-4">
                  {suite.fullDescription}
                </p>
                <p className="text-slate-700 leading-relaxed mb-4">
                  {suite.additionalInfo}
                </p>
                <p className="text-slate-600 italic mb-4">{suite.note}</p>
                <p className="text-slate-700 font-medium">{suite.finalNote}</p>
              </div>
            </div>
          </div>

          {/* Right Column - Features and Booking */}
          <div className="space-y-8">
            {/* Features */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  <Crown className="h-5 w-5 text-yellow-600" />
                  {suite.name} Incluye:
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {suite.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <feature.icon className="h-5 w-5 text-purple-600" />
                      <span className="text-slate-700">{feature.text}</span>
                      {feature.included && (
                        <Check className="h-4 w-4 text-purple-600 ml-auto" />
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
                  Tarifa Premium
                </CardTitle>
                <CardDescription>
                  Precios exclusivos para experiencia de lujo
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(suite.pricing).map(([key, pricing]) => (
                    <div
                      key={key}
                      className="flex justify-between items-center p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border border-purple-200"
                    >
                      <div>
                        <div className="font-medium text-slate-900">
                          {pricing.label}
                        </div>
                        <div className="text-sm text-slate-600">
                          {pricing.sublabel}
                        </div>
                      </div>
                      <div className="text-2xl font-bold text-purple-600">
                        ${pricing.price}.00
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 p-4 bg-purple-50 rounded-lg border border-purple-200">
                  <div className="flex justify-between text-sm mb-2">
                    <span>Check-in VIP: {suite.checkIn}</span>
                    <span>Check-out VIP: {suite.checkOut}</span>
                  </div>
                  <div className="text-center text-sm text-slate-600">
                    Experiencia exclusiva para {suite.maxGuests} huéspedes
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* VIP Services */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-yellow-500" />
                  Servicios VIP Incluidos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-600" />
                    <span>Traslado privado desde/hacia el aeropuerto</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-600" />
                    <span>Desayuno gourmet servido en suite</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-600" />
                    <span>Acceso privado a playa exclusiva</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-600" />
                    <span>Spa y masajes en suite</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Booking Section */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl font-bold text-slate-900">
                  Reservar Suite VIP
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
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
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
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        defaultValue="2025-06-08"
                      />
                    </div>
                  </div>
                </div>

                <Button
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 py-3 text-white"
                  onClick={() => navigate("/reservas")}
                >
                  <Crown className="h-4 w-4 mr-2" />
                  Reservar Experiencia VIP
                </Button>
              </CardContent>
            </Card>

            {/* Additional Options */}
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
                    Perfectas para grupos y familias que buscan privacidad y
                    amplitud.
                  </p>
                  <Button
                    size="sm"
                    variant="outline"
                    className="w-full mt-2 text-xs"
                    onClick={() => navigate("/casa/casa1")}
                  >
                    Ver Detalles
                  </Button>
                </CardContent>
              </Card>

              <Card className="cursor-pointer hover:shadow-lg transition-shadow">
                <div className="relative h-32 overflow-hidden rounded-t-lg">
                  <img
                    src="/placeholder.svg"
                    alt="APARTAMENTOS"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-2 left-2 bg-green-600 text-white px-2 py-1 rounded text-sm">
                    APARTAMENTOS
                  </div>
                </div>
                <CardContent className="p-3">
                  <p className="text-xs text-slate-600 leading-tight">
                    Ideales para estancias cómodas con todas las comodidades.
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

export default SuiteDetail;
