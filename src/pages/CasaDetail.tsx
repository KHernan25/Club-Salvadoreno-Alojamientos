import { useState, useEffect } from "react";
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
  Trees,
  Waves,
} from "lucide-react";

const CasaDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [checkInDate, setCheckInDate] = useState("2025-06-07");
  const [checkOutDate, setCheckOutDate] = useState("2025-06-08");

  // Set minimum date to today
  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    // Ensure check-out is always after check-in
    if (checkInDate >= checkOutDate) {
      const nextDay = new Date(checkInDate);
      nextDay.setDate(nextDay.getDate() + 1);
      setCheckOutDate(nextDay.toISOString().split("T")[0]);
    }
  }, [checkInDate, checkOutDate]);

  // Complete casa data for all El Sunzal houses
  const casaData = {
    casa1: {
      name: "Casa Familiar Premium",
      images: ["/placeholder.svg", "/placeholder.svg", "/placeholder.svg"],
      description:
        "Amplia casa familiar diseñada para grupos grandes y familias que buscan privacidad, amplitud y comodidad en un entorno natural privilegiado frente al mar.",
      fullDescription:
        "Esta casa familiar ofrece el espacio perfecto para unas vacaciones inolvidables. Con amplias habitaciones, áreas comunes generosas y una terraza privada con vista al océano, es ideal para reuniones familiares o grupos de amigos.",
      additionalInfo:
        "La casa cuenta con cocina completamente equipada, sala de estar amplia, comedor para 8 personas y acceso directo a jardín privado. Ubicada en la zona más tranquila del resort, garantiza privacidad y tranquilidad.",
      note: "Todas las casas cuentan con servicio de limpieza diario, acceso a todas las instalaciones del club y estacionamiento privado para 2 vehículos.",
      finalNote:
        "Casa Familiar Premium: el refugio perfecto para crear memorias familiares inolvidables en el paraíso tropical del Club Salvadoreño.",
      features: [
        { icon: Bed, text: "4 habitaciones con camas queen", included: true },
        { icon: Bath, text: "3 baños completos", included: true },
        { icon: Utensils, text: "Cocina completa equipada", included: true },
        {
          icon: Car,
          text: "Estacionamiento privado para 2 autos",
          included: true,
        },
        { icon: Tv, text: "Smart TV en sala y habitaciones", included: true },
        {
          icon: Wifi,
          text: "Internet Wi-Fi de alta velocidad",
          included: true,
        },
        {
          icon: Wind,
          text: "Aire acondicionado en todas las áreas",
          included: true,
        },
        { icon: Trees, text: "Jardín privado con terraza", included: true },
        { icon: Crown, text: "Servicio de limpieza diario", included: true },
        { icon: Waves, text: "Acceso directo a la playa", included: true },
        { icon: Users, text: "Capacidad para 8 huéspedes", included: true },
        { icon: Home, text: "Sala de estar y comedor amplios", included: true },
      ],
      pricing: {
        weekday: {
          label: "Día de Semana",
          sublabel: "(Precio por noche)",
          price: 200,
        },
        weekend: {
          label: "Fin de Semana",
          sublabel: "(Precio por noche)",
          price: 350,
        },
        daily: {
          label: "Asueto (Día)",
          sublabel: "(Precio por noche)",
          price: 400,
        },
      },
      checkIn: "3:00 pm",
      checkOut: "12:00 md",
      maxGuests: 8,
    },
    casa2: {
      name: "Casa Premium Vista Mar",
      images: ["/placeholder.svg", "/placeholder.svg", "/placeholder.svg"],
      description:
        "Casa premium con vista directa al mar, diseñada para huéspedes que buscan el máximo lujo familiar en una ubicación privilegiada frente al océano Pacífico.",
      fullDescription:
        "Esta casa premium se distingue por su ubicación privilegiada en primera línea de playa y su diseño arquitectónico superior. Con acabados de lujo y espacios amplios, ofrece una experiencia de resort privado para grupos exclusivos.",
      additionalInfo:
        "La casa cuenta con terraza panorámica de 180 grados frente al mar, cocina gourmet con isla central, master suite con baño tipo spa y sala de entretenimiento con sistema de audio profesional. Ideal para celebraciones especiales y retiros familiares.",
      note: "Casa Premium incluye servicios VIP como chef privado bajo solicitud, servicio de limpieza dos veces al día, amenidades de lujo y acceso prioritario a todas las instalaciones del club.",
      finalNote:
        "Casa Premium Vista Mar: donde el lujo familiar se encuentra con las mejores vistas del Pacífico para crear experiencias extraordinarias.",
      features: [
        {
          icon: Bed,
          text: "5 habitaciones con camas king y queen",
          included: true,
        },
        { icon: Bath, text: "4 baños con acabados de mármol", included: true },
        {
          icon: Utensils,
          text: "Cocina gourmet con electrodomésticos premium",
          included: true,
        },
        {
          icon: Car,
          text: "Estacionamiento privado para 3 autos",
          included: true,
        },
        {
          icon: Tv,
          text: "Centro de entretenimiento en cada habitación",
          included: true,
        },
        {
          icon: Wifi,
          text: "Internet Wi-Fi dedicado de fibra óptica",
          included: true,
        },
        {
          icon: Wind,
          text: "Climatización inteligente por zonas",
          included: true,
        },
        {
          icon: Trees,
          text: "Terraza panorámica de 180° frente al mar",
          included: true,
        },
        {
          icon: Crown,
          text: "Servicio de limpieza premium dos veces al día",
          included: true,
        },
        {
          icon: Waves,
          text: "Acceso privado directo a la playa",
          included: true,
        },
        { icon: Users, text: "Capacidad para 10 huéspedes", included: true },
        {
          icon: Home,
          text: "Sala de entretenimiento con sistema de audio",
          included: true,
        },
      ],
      pricing: {
        weekday: {
          label: "Día de Semana",
          sublabel: "(Precio por noche)",
          price: 280,
        },
        weekend: {
          label: "Fin de Semana",
          sublabel: "(Precio por noche)",
          price: 420,
        },
        daily: {
          label: "Asueto (Día)",
          sublabel: "(Precio por noche)",
          price: 480,
        },
      },
      checkIn: "3:00 pm",
      checkOut: "12:00 md",
      maxGuests: 10,
    },
    casa3: {
      name: "Casa Deluxe Tropical",
      images: ["/placeholder.svg", "/placeholder.svg", "/placeholder.svg"],
      description:
        "Casa deluxe rodeada de jardines tropicales exuberantes, perfecta para grupos que buscan privacidad total en un ambiente natural paradisíaco.",
      fullDescription:
        "Esta casa deluxe está estratégicamente ubicada en el corazón de los jardines tropicales del resort, ofreciendo máxima privacidad y conexión con la naturaleza. Diseñada para grupos que valoran la tranquilidad y el ambiente tropical auténtico.",
      additionalInfo:
        "Rodeada de palmeras centenarias y jardines de especies nativas, la casa ofrece múltiples terrazas y áreas de descanso al aire libre. Incluye rancho privado con hamacas, zona de BBQ profesional y senderos privados hacia la playa.",
      note: "Casa Deluxe Tropical es ideal para retiros familiares, reuniones corporativas pequeñas y grupos que buscan desconectarse en un ambiente natural sin sacrificar comodidades modernas.",
      finalNote:
        "Casa Deluxe Tropical: un refugio natural donde la privacidad absoluta se combina con el lujo discreto en el corazón del paraíso tropical.",
      features: [
        {
          icon: Bed,
          text: "4 habitaciones amplias con camas king",
          included: true,
        },
        {
          icon: Bath,
          text: "3 baños completos + medio baño social",
          included: true,
        },
        {
          icon: Utensils,
          text: "Cocina completa con despensa grande",
          included: true,
        },
        { icon: Car, text: "Estacionamiento privado cubierto", included: true },
        { icon: Tv, text: "Smart TVs en áreas principales", included: true },
        {
          icon: Wifi,
          text: "Internet Wi-Fi de alta velocidad",
          included: true,
        },
        {
          icon: Wind,
          text: "Ventilación natural + aire acondicionado",
          included: true,
        },
        { icon: Trees, text: "Rancho privado con hamacas", included: true },
        { icon: Crown, text: "Servicio de jardinería privado", included: true },
        { icon: Waves, text: "Sendero privado a la playa", included: true },
        { icon: Users, text: "Capacidad para 8 huéspedes", included: true },
        { icon: Home, text: "Zona de BBQ y comedor exterior", included: true },
      ],
      pricing: {
        weekday: {
          label: "Día de Semana",
          sublabel: "(Precio por noche)",
          price: 240,
        },
        weekend: {
          label: "Fin de Semana",
          sublabel: "(Precio por noche)",
          price: 380,
        },
        daily: {
          label: "Asueto (Día)",
          sublabel: "(Precio por noche)",
          price: 450,
        },
      },
      checkIn: "3:00 pm",
      checkOut: "12:00 md",
      maxGuests: 8,
    },
  };

  const casa = casaData[id as keyof typeof casaData] || casaData["casa1"];

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % casa.images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex(
      (prev) => (prev - 1 + casa.images.length) % casa.images.length,
    );
  };

  const casaTabs = [
    { id: "casa1", label: "Casa Familiar" },
    { id: "casa2", label: "Casa Premium" },
    { id: "casa3", label: "Casa Deluxe" },
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

      {/* Casa Tabs */}
      <div className="bg-slate-50 border-b border-slate-200">
        <div className="container mx-auto px-4">
          <div className="flex overflow-x-auto">
            {casaTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => navigate(`/casa/${tab.id}`)}
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
                  src={casa.images[currentImageIndex]}
                  alt={casa.name}
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
                  {casa.images.map((_, index) => (
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

            {/* Casa Description */}
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold text-slate-900 mb-4">
                  {casa.name}
                </h1>
                <p className="text-slate-700 leading-relaxed mb-4">
                  {casa.description}
                </p>
                <p className="text-slate-700 leading-relaxed mb-4">
                  {casa.fullDescription}
                </p>
                <p className="text-slate-700 leading-relaxed mb-4">
                  {casa.additionalInfo}
                </p>
                <p className="text-slate-600 italic mb-4">{casa.note}</p>
                <p className="text-slate-700 font-medium">{casa.finalNote}</p>
              </div>
            </div>
          </div>

          {/* Right Column - Features and Booking */}
          <div className="space-y-8">
            {/* Features */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl font-bold text-slate-900">
                  {casa.name} Incluye:
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {casa.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <feature.icon className="h-5 w-5 text-green-600" />
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
                  {Object.entries(casa.pricing).map(([key, pricing]) => (
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
                  <div className="flex justify-between text-sm mb-2">
                    <span>Hora de entrada (Check in) {casa.checkIn}</span>
                    <span>Hora de salida (Check out) {casa.checkOut}</span>
                  </div>
                  <div className="text-center text-sm text-slate-600">
                    Capacidad máxima: {casa.maxGuests} huéspedes
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
                        min={today}
                        value={checkInDate}
                        onChange={(e) => setCheckInDate(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                        min={checkInDate}
                        value={checkOutDate}
                        onChange={(e) => setCheckOutDate(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>

                <Button
                  className="w-full bg-blue-900 hover:bg-blue-800 py-3"
                  onClick={() =>
                    navigate(
                      `/reservas?checkIn=${checkInDate}&checkOut=${checkOutDate}&accommodation=casa&id=${id}&name=${encodeURIComponent(casa.name)}`,
                    )
                  }
                >
                  Ver disponibilidad
                </Button>
              </CardContent>
            </Card>

            {/* Additional Options */}
            <div className="grid grid-cols-2 gap-4">
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
                    Ideales para estancias cómodas con todas las comodidades
                    modernas.
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
                    onClick={() => navigate("/suite/suite1")}
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

export default CasaDetail;
