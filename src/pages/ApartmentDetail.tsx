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
import { useToast } from "@/hooks/use-toast";
import {
  getMinimumDate,
  getNextAvailableCheckOut,
  validateReservationDates,
  calculateStayPrice,
  getAccommodationRates,
  formatPrice,
  formatDateSpanish,
} from "@/lib/pricing-system";
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
  const { toast } = useToast();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Fechas iniciales: mañana para check-in, pasado mañana para check-out
  const minDate = getMinimumDate();
  const [checkInDate, setCheckInDate] = useState(minDate);
  const [checkOutDate, setCheckOutDate] = useState(
    getNextAvailableCheckOut(minDate),
  );
  const [priceCalculation, setPriceCalculation] = useState(null);
  const [isCalculating, setIsCalculating] = useState(false);

  useEffect(() => {
    // Asegurar que check-out sea siempre después de check-in
    if (checkInDate >= checkOutDate) {
      const nextDay = getNextAvailableCheckOut(checkInDate);
      setCheckOutDate(nextDay);
    }
  }, [checkInDate]);

  // Función para calcular disponibilidad y precios
  const handleCheckAvailability = () => {
    // Validar fechas
    const validation = validateReservationDates(checkInDate, checkOutDate);

    if (!validation.valid) {
      toast({
        title: "Error en las fechas",
        description: validation.error,
        variant: "destructive",
      });
      return;
    }

    setIsCalculating(true);

    // Simular carga de datos
    setTimeout(() => {
      const rates = getAccommodationRates(id || "1A");

      if (!rates) {
        toast({
          title: "Error",
          description:
            "No se pudieron obtener las tarifas para este alojamiento",
          variant: "destructive",
        });
        setIsCalculating(false);
        return;
      }

      const calculation = calculateStayPrice(
        new Date(checkInDate),
        new Date(checkOutDate),
        rates,
      );

      setPriceCalculation(calculation);
      setIsCalculating(false);

      toast({
        title: "Disponibilidad verificada",
        description: `Total: ${formatPrice(calculation.totalPrice)} por ${calculation.totalDays} ${calculation.totalDays === 1 ? "noche" : "noches"}`,
      });
    }, 1000);
  };

  // Complete apartment data for all El Sunzal apartments
  const apartmentData = {
    "1A": {
      name: "Apartamento 1A",
      images: ["/placeholder.svg", "/placeholder.svg", "/placeholder.svg"],
      description:
        "El apartamento 1A está diseñado para brindarle una experiencia de descanso y comodidad en un entorno natural privilegiado, ubicado en la primera planta con fácil acceso.",
      fullDescription:
        "Este apartamento de primera planta combina comodidad y accesibilidad. Con una distribución funcional y vistas parciales al mar, es perfecto para parejas o familias pequeñas que buscan un refugio tranquilo.",
      additionalInfo:
        "Ubicado estratégicamente en el primer nivel, ofrece acceso directo sin escaleras y proximidad a las áreas comunes. La distribución incluye sala-comedor integrada, kitchenette equipada y dormitorio principal con baño privado.",
      note: "El apartamento 1A cuenta con terraza privada orientada hacia la piscina y jardines, ideal para relajarse mientras disfruta del clima tropical. Incluye estacionamiento designado.",
      finalNote:
        "Apartamento 1A: comodidad accesible en primera planta, donde la funcionalidad se encuentra con la tranquilidad a pasos del océano Pacífico.",
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
          price: 280,
        },
      },
      checkIn: "3:00 pm",
      checkOut: "12:00 md",
    },
    "1B": {
      name: "Apartamento 1B",
      images: ["/placeholder.svg", "/placeholder.svg", "/placeholder.svg"],
      description:
        "El apartamento 1B ofrece una experiencia renovada en primera planta, con acabados modernos y una terraza ampliada que maximiza las vistas al jardín tropical.",
      fullDescription:
        "Recientemente renovado, este apartamento destaca por sus acabados contemporáneos y distribución optimizada. La terraza ampliada se convierte en una extensión natural del espacio interior, perfecta para el descanso al aire libre.",
      additionalInfo:
        "Con una cocina actualizada y baño remodelado, el 1B ofrece todas las comodidades modernas. La terraza cuenta con mobiliario nuevo y vista directa a los jardines de palmas y la zona de piscina.",
      note: "Este apartamento ha sido especialmente diseñado para huéspedes que valoran los detalles modernos sin sacrificar la esencia tropical del resort. Incluye upgrade en amenidades.",
      finalNote:
        "Apartamento 1B: modernidad tropical en primera planta, donde el confort contemporáneo abraza la belleza natural del Club Salvadoreño.",
      features: [
        { icon: Bed, text: "2 camas full renovadas", included: true },
        { icon: Tv, text: 'Smart TV 55" con streaming', included: true },
        {
          icon: Wifi,
          text: "Internet Wi-Fi de alta velocidad",
          included: true,
        },
        { icon: Bath, text: "1 Baño remodelado", included: true },
        { icon: Utensils, text: "Cocina equipada modernizada", included: true },
        { icon: Users, text: "Caja Fuerte digital", included: true },
        { icon: Wind, text: "Cafetera premium", included: true },
        { icon: Home, text: "Toallas de algodón egipcio", included: true },
        { icon: Tv, text: "Electrodomésticos actualizados", included: true },
        { icon: Wind, text: "Aire Acondicionado silencioso", included: true },
        { icon: Crown, text: "Netflix y Amazon Prime", included: true },
        {
          icon: Users,
          text: "Terraza ampliada con mobiliario nuevo",
          included: true,
        },
      ],
      pricing: {
        weekday: {
          label: "Día de Semana",
          sublabel: "(Precio por noche)",
          price: 95,
        },
        weekend: {
          label: "Fin de Semana",
          sublabel: "(Precio por noche)",
          price: 210,
        },
        daily: {
          label: "Asueto (Día)",
          sublabel: "(Precio por noche)",
          price: 250,
        },
      },
      checkIn: "3:00 pm",
      checkOut: "12:00 md",
    },
    "2A": {
      name: "Apartamento 2A",
      images: ["/placeholder.svg", "/placeholder.svg", "/placeholder.svg"],
      description:
        "El apartamento 2A en segunda planta ofrece vistas elevadas al océano Pacífico, combinando altura perfecta con panorámicas espectaculares del atardecer.",
      fullDescription:
        "Ubicado en el segundo nivel, este apartamento ofrece la elevación ideal para disfrutar vistas panorámicas sin estar demasiado alto. Las ventanas amplias capturan la brisa marina y los colores del atardecer pacífico.",
      additionalInfo:
        "La altura del segundo piso proporciona privacidad adicional y vistas superiores de la costa. El apartamento cuenta con balcón privado orientado al oeste, perfecto para contemplar los atardeceres dorados sobre el océano.",
      note: "El apartamento 2A es especialmente popular entre parejas y huéspedes que buscan romance, gracias a sus vistas privilegiadas y ambiente íntimo en la altura perfecta.",
      finalNote:
        "Apartamento 2A: romance en las alturas, donde cada atardecer se convierte en un espectáculo privado desde tu balcón frente al Pacífico.",
      features: [
        { icon: Bed, text: "2 camas full con vista", included: true },
        { icon: Tv, text: "Smart TV con canales premium", included: true },
        { icon: Wifi, text: "Internet Wi-Fi fibra óptica", included: true },
        { icon: Bath, text: "1 Baño con ventana al exterior", included: true },
        {
          icon: Utensils,
          text: "Cocina con barra desayunador",
          included: true,
        },
        { icon: Users, text: "Caja Fuerte", included: true },
        { icon: Wind, text: "Cafetera", included: true },
        { icon: Home, text: "Ropa de cama premium", included: true },
        { icon: Tv, text: "Microondas y refrigeradora", included: true },
        { icon: Wind, text: "Aire Acondicionado inverter", included: true },
        {
          icon: Crown,
          text: "Balcón privado con vista al mar",
          included: true,
        },
        {
          icon: Users,
          text: "Mobiliario de balcón para atardeceres",
          included: true,
        },
      ],
      pricing: {
        weekday: {
          label: "Día de Semana",
          sublabel: "(Precio por noche)",
          price: 120,
        },
        weekend: {
          label: "Fin de Semana",
          sublabel: "(Precio por noche)",
          price: 250,
        },
        daily: {
          label: "Asueto (Día)",
          sublabel: "(Precio por noche)",
          price: 300,
        },
      },
      checkIn: "3:00 pm",
      checkOut: "12:00 md",
    },
    "2B": {
      name: "Apartamento 2B",
      images: ["/placeholder.svg", "/placeholder.svg", "/placeholder.svg"],
      description:
        "El apartamento 2B combina las ventajas de la segunda planta con una distribución espaciosa, ideal para familias que buscan comodidad y vistas panorámicas.",
      fullDescription:
        "Este apartamento familiar en segunda planta maximiza el espacio disponible con una distribución inteligente. Perfecto para familias, ofrece áreas separadas para adultos y niños, manteniendo la privacidad y comodidad para todos.",
      additionalInfo:
        "Con un dormitorio principal amplio y área de estar extendida, el 2B acomoda cómodamente hasta 4 personas. Las ventanas panorámicas en ambas habitaciones aseguran que todos disfruten de las vistas y la brisa marina.",
      note: "Popular entre familias por su distribución práctica y segura para niños, con balcón protegido y proximidad a las escaleras principales para fácil acceso a la piscina.",
      finalNote:
        "Apartamento 2B: comodidad familiar en segunda planta, donde cada miembro de la familia encuentra su espacio perfecto con vista al paraíso.",
      features: [
        { icon: Bed, text: "2 camas full + sofá cama", included: true },
        { icon: Tv, text: "2 Smart TVs (sala y dormitorio)", included: true },
        {
          icon: Wifi,
          text: "Internet Wi-Fi de alta velocidad",
          included: true,
        },
        { icon: Bath, text: "1 Baño amplio familiar", included: true },
        {
          icon: Utensils,
          text: "Cocina extendida con comedor",
          included: true,
        },
        { icon: Users, text: "Caja Fuerte familiar", included: true },
        { icon: Wind, text: "Cafetera y tetera", included: true },
        { icon: Home, text: "Toallas para toda la familia", included: true },
        { icon: Tv, text: "Consola de videojuegos", included: true },
        { icon: Wind, text: "AC en todas las áreas", included: true },
        {
          icon: Crown,
          text: "Balcón protegido family-friendly",
          included: true,
        },
        { icon: Users, text: "Espacio de juegos para niños", included: true },
      ],
      pricing: {
        weekday: {
          label: "Día de Semana",
          sublabel: "(Precio por noche)",
          price: 115,
        },
        weekend: {
          label: "Fin de Semana",
          sublabel: "(Precio por noche)",
          price: 240,
        },
        daily: {
          label: "Asueto (Día)",
          sublabel: "(Precio por noche)",
          price: 290,
        },
      },
      checkIn: "3:00 pm",
      checkOut: "12:00 md",
    },
    "3A": {
      name: "Apartamento 3A",
      images: ["/placeholder.svg", "/placeholder.svg", "/placeholder.svg"],
      description:
        "El apartamento 3A en la planta más alta ofrece vistas sin obstáculos del océano Pacífico, siendo el refugio perfecto para quienes buscan panorámicas espectaculares.",
      fullDescription:
        "Ubicado en el tercer y último piso, este apartamento premium ofrece las mejores vistas del complejo. Sin obstáculos visuales, las panorámicas de 180 grados del océano crean una experiencia visual inigualable.",
      additionalInfo:
        "La altura máxima proporciona privacidad total y vistas que abarcan desde las montañas hasta el horizonte marino. El apartamento cuenta con ventanas del piso al techo y una terraza que se siente como un mirador privado.",
      note: "Considerado el apartamento premium de El Sunzal, el 3A es perfecto para ocasiones especiales, lunas de miel o huéspedes que buscan la experiencia de alojamiento más exclusiva.",
      finalNote:
        "Apartamento 3A: la cima del lujo con vistas, donde el cielo se encuentra con el mar en tu terraza privada en las alturas del paraíso.",
      features: [
        { icon: Bed, text: "2 camas queen premium", included: true },
        { icon: Tv, text: 'Smart TV 65" con sistema surround', included: true },
        { icon: Wifi, text: "Internet Wi-Fi premium dedicado", included: true },
        {
          icon: Bath,
          text: "Baño de lujo con ventanas panorámicas",
          included: true,
        },
        {
          icon: Utensils,
          text: "Cocina premium totalmente equipada",
          included: true,
        },
        { icon: Users, text: "Caja Fuerte digital premium", included: true },
        { icon: Wind, text: "Cafetera espresso automática", included: true },
        { icon: Home, text: "Amenidades de lujo incluidas", included: true },
        {
          icon: Tv,
          text: "Centro de entretenimiento completo",
          included: true,
        },
        { icon: Wind, text: "Climatización dual premium", included: true },
        {
          icon: Crown,
          text: "Terraza panorámica sin obstáculos",
          included: true,
        },
        { icon: Users, text: "Mobiliario de terraza de lujo", included: true },
      ],
      pricing: {
        weekday: {
          label: "Día de Semana",
          sublabel: "(Precio por noche)",
          price: 140,
        },
        weekend: {
          label: "Fin de Semana",
          sublabel: "(Precio por noche)",
          price: 280,
        },
        daily: {
          label: "Asueto (Día)",
          sublabel: "(Precio por noche)",
          price: 350,
        },
      },
      checkIn: "3:00 pm",
      checkOut: "12:00 md",
    },
    "3B": {
      name: "Apartamento 3B",
      images: ["/placeholder.svg", "/placeholder.svg", "/placeholder.svg"],
      description:
        "El apartamento 3B en la planta superior combina vistas espectaculares con espacio adicional, ofreciendo una experiencia de penthouse familiar.",
      fullDescription:
        "Este apartamento tipo penthouse familiar en el último piso ofrece el máximo espacio disponible con las mejores vistas. Ideal para familias que desean lujo y comodidad sin comprometer el espacio para todos.",
      additionalInfo:
        "Con la distribución más amplia del edificio y acceso a una terraza extendida, el 3B ofrece áreas separadas para relajación y entretenimiento. Las vistas abarcan tanto el océano como los volcanes en el horizonte.",
      note: "El apartamento 3B es único por combinar el lujo de las vistas del tercer piso con la funcionalidad familiar, incluyendo área de juegos en la terraza y espacios para toda la familia.",
      finalNote:
        "Apartamento 3B: penthouse familiar en las alturas, donde el lujo espacioso se encuentra con vistas panorámicas para crear recuerdos familiares únicos.",
      features: [
        { icon: Bed, text: "2 camas queen + área de descanso", included: true },
        { icon: Tv, text: "3 Smart TVs distribuidas", included: true },
        {
          icon: Wifi,
          text: "Internet Wi-Fi de máxima velocidad",
          included: true,
        },
        { icon: Bath, text: "Baño master con bañera y vista", included: true },
        {
          icon: Utensils,
          text: "Cocina gourmet con isla central",
          included: true,
        },
        { icon: Users, text: "Sistema de seguridad premium", included: true },
        { icon: Wind, text: "Estación de café y té premium", included: true },
        { icon: Home, text: "Amenidades VIP incluidas", included: true },
        {
          icon: Tv,
          text: "Sistema de entretenimiento integral",
          included: true,
        },
        { icon: Wind, text: "Climatización inteligente", included: true },
        { icon: Crown, text: "Terraza penthouse extendida", included: true },
        {
          icon: Users,
          text: "Área de entretenimiento familiar",
          included: true,
        },
      ],
      pricing: {
        weekday: {
          label: "Día de Semana",
          sublabel: "(Precio por noche)",
          price: 135,
        },
        weekend: {
          label: "Fin de Semana",
          sublabel: "(Precio por noche)",
          price: 270,
        },
        daily: {
          label: "Asueto (Día)",
          sublabel: "(Precio por noche)",
          price: 340,
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
                        min={getMinimumDate()}
                        value={checkInDate}
                        onChange={(e) => setCheckInDate(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <p className="text-xs text-slate-500 mt-1">
                      Selecciona a partir de mañana
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Salida
                    </label>
                    <div className="relative">
                      <input
                        type="date"
                        min={getNextAvailableCheckOut(checkInDate)}
                        value={checkOutDate}
                        onChange={(e) => setCheckOutDate(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <p className="text-xs text-slate-500 mt-1">
                      Mínimo 1 noche de estadía
                    </p>
                  </div>
                </div>

                {/* Price Calculation Display */}
                {priceCalculation && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 mt-4">
                    <h4 className="font-semibold text-green-800 mb-2">
                      Cálculo de Precios
                    </h4>
                    <div className="space-y-2 text-sm">
                      {priceCalculation.weekdayDays > 0 && (
                        <div className="flex justify-between">
                          <span>
                            {priceCalculation.weekdayDays} noche(s) entre semana
                          </span>
                          <span className="font-medium">
                            {formatPrice(priceCalculation.weekdayTotal)}
                          </span>
                        </div>
                      )}
                      {priceCalculation.weekendDays > 0 && (
                        <div className="flex justify-between">
                          <span>
                            {priceCalculation.weekendDays} noche(s) fin de
                            semana
                          </span>
                          <span className="font-medium">
                            {formatPrice(priceCalculation.weekendTotal)}
                          </span>
                        </div>
                      )}
                      {priceCalculation.holidayDays > 0 && (
                        <div className="flex justify-between">
                          <span>
                            {priceCalculation.holidayDays} noche(s) feriado
                          </span>
                          <span className="font-medium">
                            {formatPrice(priceCalculation.holidayTotal)}
                          </span>
                        </div>
                      )}
                      <div className="border-t border-green-300 pt-2 flex justify-between font-bold text-green-800">
                        <span>Total ({priceCalculation.totalDays} noches)</span>
                        <span>{formatPrice(priceCalculation.totalPrice)}</span>
                      </div>
                    </div>
                  </div>
                )}

                <Button
                  className="w-full bg-blue-900 hover:bg-blue-800 py-3 mt-4"
                  onClick={handleCheckAvailability}
                  disabled={isCalculating}
                >
                  {isCalculating ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Calculando...
                    </>
                  ) : (
                    "Ver disponibilidad y precios"
                  )}
                </Button>

                {priceCalculation && (
                  <Button
                    className="w-full bg-green-600 hover:bg-green-700 py-3 mt-2"
                    onClick={() =>
                      navigate(
                        `/reservas?checkIn=${checkInDate}&checkOut=${checkOutDate}&accommodation=apartamento&id=${id}&name=${encodeURIComponent(apartment.name)}&totalPrice=${priceCalculation.totalPrice}`,
                      )
                    }
                  >
                    Reservar ahora - {formatPrice(priceCalculation.totalPrice)}
                  </Button>
                )}
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
