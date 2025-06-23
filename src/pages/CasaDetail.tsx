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
import { getMinimumDate, getNextAvailableCheckOut } from "@/lib/pricing-system";
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
import Navbar from "@/components/Navbar";

const CasaDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Initialize dates with getMinimumDate (tomorrow) for check-in and day after for check-out
  const minDate = getMinimumDate();
  const [checkInDate, setCheckInDate] = useState(minDate);
  const [checkOutDate, setCheckOutDate] = useState(
    getNextAvailableCheckOut(minDate),
  );

  useEffect(() => {
    // Ensure check-out is always after check-in
    if (checkInDate >= checkOutDate) {
      const nextDay = new Date(checkInDate);
      nextDay.setDate(nextDay.getDate() + 1);
      setCheckOutDate(nextDay.toISOString().split("T")[0]);
    }
  }, [checkInDate, checkOutDate]);

  // Complete casa data for all houses - El Sunzal and Corinto
  const casaData = {
    // Corinto Houses
    "corinto-casa-1": {
      name: "Casa del Lago",
      images: ["/placeholder.svg", "/placeholder.svg", "/placeholder.svg"],
      description:
        "Casa ideal para familias que buscan comodidad y tranquilidad junto al agua. Ubicada en una posición estratégica con vista directa al lago, ofrece espacios amplios y un jardín privado perfecto para relajarse mientras disfrutan de la brisa lacustre.",
      fullDescription:
        "Esta acogedora casa familiar se encuentra en la ubicación perfecta a orillas del Lago de Ilopango. Con vistas espectaculares y un jardín privado bien cuidado, es el lugar ideal para familias que buscan un escape tranquilo de la rutina diaria.",
      additionalInfo:
        "La Casa del Lago cuenta con tres habitaciones cómodas, una cocina completamente equipada y áreas comunes espaciosas que se abren hacia el jardín y la vista del lago. El jardín privado incluye área de barbacoa y zona de relajación perfecta para el atardecer.",
      note: "Incluye acceso directo al lago para actividades acuáticas, estacionamiento privado y Wi-Fi de alta velocidad. Ideal para familias con niños que disfrutan de la naturaleza y la tranquilidad.",
      finalNote:
        "Casa del Lago: donde la comodidad familiar se encuentra con la serenidad del lago para crear vacaciones perfectas.",
      features: [
        { icon: Bed, text: "3 habitaciones con camas queen", included: true },
        { icon: Bath, text: "2 baños completos", included: true },
        { icon: Utensils, text: "Cocina completa equipada", included: true },
        { icon: Car, text: "Estacionamiento privado", included: true },
        { icon: Tv, text: "Smart TV en sala principal", included: true },
        {
          icon: Wifi,
          text: "Internet Wi-Fi de alta velocidad",
          included: true,
        },
        {
          icon: Wind,
          text: "Ventilación natural y aire acondicionado",
          included: true,
        },
        {
          icon: Trees,
          text: "Jardín privado con vista al lago",
          included: true,
        },
        { icon: Crown, text: "Servicio de limpieza diario", included: true },
        { icon: Waves, text: "Acceso directo al lago", included: true },
        { icon: Users, text: "Capacidad para 6 huéspedes", included: true },
        { icon: Home, text: "Área de barbacoa y terraza", included: true },
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
          price: 380,
        },
        daily: {
          label: "Asueto (Día)",
          sublabel: "(Precio por noche)",
          price: 320,
        },
      },
      checkIn: "3:00 pm",
      checkOut: "12:00 md",
      maxGuests: 6,
    },
    "corinto-casa-2": {
      name: "Casa Familiar Vista Lago",
      images: ["/placeholder.svg", "/placeholder.svg", "/placeholder.svg"],
      description:
        "Diseñada especialmente para familias numerosas, esta casa combina amplitud y confort con vistas panorámicas al Lago de Ilopango. Con capacidad para 8 personas, incluye muelle privado y espacios de entretenimiento ideales para reuniones familiares memorables.",
      fullDescription:
        "La Casa Familiar Vista Lago es perfecta para familias grandes que buscan espacios amplios sin sacrificar la intimidad. Con cuatro habitaciones bien distribuidas y múltiples áreas comunes, cada miembro de la familia encontrará su espacio perfecto.",
      additionalInfo:
        "Esta casa destaca por su muelle privado que permite actividades acuáticas directamente desde la propiedad. La cocina amplia y el comedor para 8 personas facilitan las comidas familiares, mientras que la terraza ofrece vistas panorámicas espectaculares del lago.",
      note: "El muelle privado incluye acceso a kayaks y equipo básico de pesca. La casa cuenta con estacionamiento para dos vehículos y parrilla exterior para barbacoas familiares junto al lago.",
      finalNote:
        "Casa Familiar Vista Lago: el espacio perfecto donde las familias grandes crean recuerdos inolvidables con las mejores vistas del lago.",
      features: [
        {
          icon: Bed,
          text: "4 habitaciones amplias con camas queen",
          included: true,
        },
        { icon: Bath, text: "3 baños completos", included: true },
        {
          icon: Utensils,
          text: "Cocina amplia con isla central",
          included: true,
        },
        { icon: Car, text: "Estacionamiento doble cubierto", included: true },
        {
          icon: Tv,
          text: "Smart TV en sala y dormitorio principal",
          included: true,
        },
        { icon: Wifi, text: "Internet Wi-Fi dedicado", included: true },
        {
          icon: Wind,
          text: "Aire acondicionado en todas las habitaciones",
          included: true,
        },
        {
          icon: Trees,
          text: "Terraza panorámica con vista al lago",
          included: true,
        },
        { icon: Crown, text: "Servicio de limpieza diario", included: true },
        { icon: Waves, text: "Muelle privado con kayaks", included: true },
        { icon: Users, text: "Capacidad para 8 huéspedes", included: true },
        { icon: Home, text: "Parrilla y comedor exterior", included: true },
      ],
      pricing: {
        weekday: {
          label: "Día de Semana",
          sublabel: "(Precio por noche)",
          price: 350,
        },
        weekend: {
          label: "Fin de Semana",
          sublabel: "(Precio por noche)",
          price: 450,
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
    "corinto-casa-3": {
      name: "Casa Tranquilidad",
      images: ["/placeholder.svg", "/placeholder.svg", "/placeholder.svg"],
      description:
        "Refugio perfecto para parejas o familias pequeñas que buscan paz absoluta. Esta casa íntima cuenta con un jardín zen único, espacios de meditación y un ambiente sereno que invita al descanso y la contemplación junto al lago.",
      fullDescription:
        "Casa Tranquilidad ha sido especialmente diseñada para quienes buscan un retiro pacífico y reparador. Su jardín zen cuidadosamente diseñado y sus espacios de meditación crean un ambiente único de serenidad junto al lago.",
      additionalInfo:
        "Esta casa íntima incluye dos habitaciones acogedoras, un jardín zen con senderos de piedra, área de meditación con cojines especiales y hamacas estratégicamente ubicadas para disfrutar del atardecer sobre el lago. El diseño interior enfatiza la calma y la armonía.",
      note: "Incluye sesiones de yoga matutino opcionales, biblioteca con libros de relajación y meditación, y acceso a senderos naturales privados alrededor de la propiedad. Perfecto para luna de miel o retiros espirituales.",
      finalNote:
        "Casa Tranquilidad: donde el alma encuentra su centro y la mente descubre la paz verdadera junto a las aguas serenas del lago.",
      features: [
        {
          icon: Bed,
          text: "2 habitaciones con decoración zen",
          included: true,
        },
        { icon: Bath, text: "2 baños con elementos naturales", included: true },
        { icon: Utensils, text: "Cocina minimalista equipada", included: true },
        { icon: Car, text: "Estacionamiento privado discreto", included: true },
        {
          icon: Tv,
          text: "Smart TV (uso opcional para retiro digital)",
          included: true,
        },
        {
          icon: Wifi,
          text: "Wi-Fi disponible (desconectable)",
          included: true,
        },
        {
          icon: Wind,
          text: "Ventilación natural privilegiada",
          included: true,
        },
        {
          icon: Trees,
          text: "Jardín zen con senderos de piedra",
          included: true,
        },
        {
          icon: Crown,
          text: "Servicio de limpieza silencioso",
          included: true,
        },
        {
          icon: Waves,
          text: "Acceso al lago para contemplación",
          included: true,
        },
        { icon: Users, text: "Capacidad para 4 huéspedes", included: true },
        { icon: Home, text: "Área de meditación y hamacas", included: true },
      ],
      pricing: {
        weekday: {
          label: "Día de Semana",
          sublabel: "(Precio por noche)",
          price: 220,
        },
        weekend: {
          label: "Fin de Semana",
          sublabel: "(Precio por noche)",
          price: 320,
        },
        daily: {
          label: "Asueto (Día)",
          sublabel: "(Precio por noche)",
          price: 270,
        },
      },
      checkIn: "3:00 pm",
      checkOut: "12:00 md",
      maxGuests: 4,
    },
    "corinto-casa-4": {
      name: "Casa Pescador",
      images: ["/placeholder.svg", "/placeholder.svg", "/placeholder.svg"],
      description:
        "Casa temática diseñada para los amantes de la pesca deportiva y actividades acuáticas. Incluye equipo especializado, acceso directo al lago, y facilidades para limpiar y preparar las capturas del día en un ambiente auténticamente lacustre.",
      fullDescription:
        "La Casa Pescador es un paraíso para los entusiastas de la pesca deportiva. Equipada con todo lo necesario para una experiencia de pesca completa, desde el equipo hasta las facilidades para preparar las capturas del día.",
      additionalInfo:
        "Esta casa incluye estación de limpieza de pescado, nevera especializada para conservar las capturas, kayaks para explorar el lago, y zona de preparación de carnada. El muelle privado tiene acceso directo a las mejores zonas de pesca del lago, conocidas por la abundancia de guapote y tilapia.",
      note: "El paquete incluye equipo básico de pesca, red de aterrizaje, caja de aparejos y guía local disponible bajo solicitud. También hay ahumador para preparar pescado y área exterior para cocinar las capturas junto al lago.",
      finalNote:
        "Casa Pescador: donde la pasión por la pesca se vive intensamente en el entorno natural perfecto del Lago de Ilopango.",
      features: [
        {
          icon: Bed,
          text: "3 habitaciones con decoración náutica",
          included: true,
        },
        { icon: Bath, text: "2 baños + estación de limpieza", included: true },
        {
          icon: Utensils,
          text: "Cocina + área de preparación de pescado",
          included: true,
        },
        { icon: Car, text: "Estacionamiento con remolque", included: true },
        { icon: Tv, text: "Smart TV con canales de pesca", included: true },
        {
          icon: Wifi,
          text: "Wi-Fi para consultar pronósticos",
          included: true,
        },
        {
          icon: Wind,
          text: "Ventilación especializada para pescado",
          included: true,
        },
        {
          icon: Trees,
          text: "Muelle privado con zona de pesca",
          included: true,
        },
        {
          icon: Crown,
          text: "Equipo de pesca básico incluido",
          included: true,
        },
        {
          icon: Waves,
          text: "Kayaks y acceso directo al lago",
          included: true,
        },
        { icon: Users, text: "Capacidad para 6 pescadores", included: true },
        { icon: Home, text: "Nevera de pesca y ahumador", included: true },
      ],
      pricing: {
        weekday: {
          label: "Día de Semana",
          sublabel: "(Precio por noche)",
          price: 300,
        },
        weekend: {
          label: "Fin de Semana",
          sublabel: "(Precio por noche)",
          price: 400,
        },
        daily: {
          label: "Asueto (Día)",
          sublabel: "(Precio por noche)",
          price: 350,
        },
      },
      checkIn: "3:00 pm",
      checkOut: "12:00 md",
      maxGuests: 6,
    },
    "corinto-casa-5": {
      name: "Casa Reuniones",
      images: ["/placeholder.svg", "/placeholder.svg", "/placeholder.svg"],
      description:
        "Casa especialmente equipada para eventos familiares, reuniones corporativas o celebraciones especiales. Con capacidad para 10 personas, incluye cocina industrial, sistema de sonido y espacios amplios diseñados para grupos que buscan compartir experiencias únicas.",
      fullDescription:
        "Casa Reuniones está diseñada para ser el centro perfecto de cualquier celebración o evento especial. Sus espacios amplios y equipamiento profesional la convierten en la opción ideal para reuniones familiares grandes, eventos corporativos o celebraciones memorables.",
      additionalInfo:
        "La casa cuenta con una cocina industrial totalmente equipada, sistema de sonido profesional, proyector para presentaciones, mesa de comedor para 12 personas y múltiples áreas de estar. El espacio exterior incluye una parrilla grande, área de entretenimiento y terrazas amplias con vista al lago.",
      note: "Incluye servicio de configuración para eventos, equipo audiovisual profesional, sistema de sonido interior y exterior, y coordinación con proveedores de catering locales. Perfect para bodas pequeñas, aniversarios, retiros corporativos y reuniones familiares especiales.",
      finalNote:
        "Casa Reuniones: donde los momentos especiales se transforman en memorias extraordinarias junto a la majestuosidad del lago.",
      features: [
        {
          icon: Bed,
          text: "4 habitaciones amplias para grupos",
          included: true,
        },
        { icon: Bath, text: "3 baños + medio baño social", included: true },
        {
          icon: Utensils,
          text: "Cocina industrial con equipamiento profesional",
          included: true,
        },
        {
          icon: Car,
          text: "Estacionamiento para eventos (8 autos)",
          included: true,
        },
        { icon: Tv, text: "Proyector y sistema audiovisual", included: true },
        {
          icon: Wifi,
          text: "Wi-Fi de alta capacidad para grupos",
          included: true,
        },
        { icon: Wind, text: "Climatización por zonas", included: true },
        {
          icon: Trees,
          text: "Terraza de eventos con vista al lago",
          included: true,
        },
        {
          icon: Crown,
          text: "Coordinación de eventos incluida",
          included: true,
        },
        {
          icon: Waves,
          text: "Acceso al lago para actividades grupales",
          included: true,
        },
        {
          icon: Users,
          text: "Capacidad para 10 huéspedes + eventos",
          included: true,
        },
        {
          icon: Home,
          text: "Sistema de sonido y parrilla grande",
          included: true,
        },
      ],
      pricing: {
        weekday: {
          label: "Día de Semana",
          sublabel: "(Precio por noche)",
          price: 400,
        },
        weekend: {
          label: "Fin de Semana",
          sublabel: "(Precio por noche)",
          price: 550,
        },
        daily: {
          label: "Asueto (Día)",
          sublabel: "(Precio por noche)",
          price: 475,
        },
      },
      checkIn: "3:00 pm",
      checkOut: "12:00 md",
      maxGuests: 10,
    },
    "corinto-casa-6": {
      name: "Casa Premium Lago",
      images: ["/placeholder.svg", "/placeholder.svg", "/placeholder.svg"],
      description:
        "La experiencia más exclusiva en Corinto. Casa de lujo con capacidad para 12 huéspedes que incluye jacuzzi, lancha privada y servicios premium. Perfecta para ocasiones especiales, luna de miel o grupos que buscan el máximo nivel de comodidad y exclusividad.",
      fullDescription:
        "Casa Premium Lago representa la cúspide del lujo en el Lago de Ilopango. Esta propiedad exclusiva combina amenidades de clase mundial con vistas espectaculares y servicios personalizados para crear una experiencia verdaderamente extraordinaria.",
      additionalInfo:
        "La casa incluye cinco habitaciones de lujo, cada una con baño privado y vista al lago. El jacuzzi exterior ofrece vistas panorámicas del lago, mientras que la lancha privada permite explorar las aguas en completa privacidad. Los servicios incluyen chef privado, mayordomía y concierge personal.",
      note: "Los servicios premium incluyen chef privado disponible las 24 horas, servicio de limpieza dos veces al día, mayordomía personal, traslados en lancha privada y coordinación de experiencias exclusivas como cenas privadas en el lago y tours personalizados.",
      finalNote:
        "Casa Premium Lago: donde el lujo absoluto y la exclusividad se encuentran para crear la experiencia más extraordinaria del Lago de Ilopango.",
      features: [
        {
          icon: Bed,
          text: "5 suites de lujo con vista al lago",
          included: true,
        },
        {
          icon: Bath,
          text: "4 baños de mármol + jacuzzi exterior",
          included: true,
        },
        {
          icon: Utensils,
          text: "Cocina gourmet + chef privado disponible",
          included: true,
        },
        { icon: Car, text: "Estacionamiento VIP para 3 autos", included: true },
        {
          icon: Tv,
          text: "Smart TVs premium en todas las habitaciones",
          included: true,
        },
        {
          icon: Wifi,
          text: "Internet de fibra óptica dedicado",
          included: true,
        },
        {
          icon: Wind,
          text: "Climatización inteligente premium",
          included: true,
        },
        { icon: Trees, text: "Jardines privados con jacuzzi", included: true },
        { icon: Crown, text: "Servicio de mayordomía 24/7", included: true },
        {
          icon: Waves,
          text: "Lancha privada y muelle exclusivo",
          included: true,
        },
        {
          icon: Users,
          text: "Capacidad para 12 huéspedes VIP",
          included: true,
        },
        {
          icon: Home,
          text: "Servicio de concierge y experiencias exclusivas",
          included: true,
        },
      ],
      pricing: {
        weekday: {
          label: "Día de Semana",
          sublabel: "(Precio por noche)",
          price: 500,
        },
        weekend: {
          label: "Fin de Semana",
          sublabel: "(Precio por noche)",
          price: 700,
        },
        daily: {
          label: "Asueto (Día)",
          sublabel: "(Precio por noche)",
          price: 600,
        },
      },
      checkIn: "3:00 pm",
      checkOut: "12:00 md",
      maxGuests: 12,
    },
    // El Sunzal Houses (existing)
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
        "Casa Familiar Premium: el refugio perfecto para crear memorias familiares inolvidables en el para��so tropical del Club Salvadoreño.",
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

  // Determine which tabs to show based on current house type
  const isCorintoHouse = id?.startsWith("corinto-casa-");

  const casaTabs = isCorintoHouse
    ? [
        { id: "corinto-casa-1", label: "Casa del Lago" },
        { id: "corinto-casa-2", label: "Casa Familiar Vista" },
        { id: "corinto-casa-3", label: "Casa Tranquilidad" },
        { id: "corinto-casa-4", label: "Casa Pescador" },
        { id: "corinto-casa-5", label: "Casa Reuniones" },
        { id: "corinto-casa-6", label: "Casa Premium" },
      ]
    : [
        { id: "casa1", label: "Casa Familiar" },
        { id: "casa2", label: "Casa Premium" },
        { id: "casa3", label: "Casa Deluxe" },
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
            {isCorintoHouse ? (
              <>
                <button
                  onClick={() => navigate("/corinto")}
                  className="hover:text-blue-600"
                >
                  Corinto
                </button>
                <span>›</span>
                <button
                  onClick={() => navigate("/corinto/casas")}
                  className="hover:text-blue-600"
                >
                  Casas
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => navigate("/sunzal")}
                  className="hover:text-blue-600"
                >
                  El Sunzal
                </button>
                <span>›</span>
                <button
                  onClick={() => navigate("/alojamientos")}
                  className="hover:text-blue-600"
                >
                  Casas
                </button>
              </>
            )}
            <span>›</span>
            <span className="text-slate-900 font-medium">{casa.name}</span>
          </div>
        </div>
      </div>

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
                        min={getMinimumDate()}
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
                  Ver disponibilidad y precios
                </Button>
              </CardContent>
            </Card>

            {/* Additional Options */}
            <div className="grid grid-cols-2 gap-4">
              {isCorintoHouse ? (
                <>
                  <Card className="cursor-pointer hover:shadow-lg transition-shadow">
                    <div className="relative h-32 overflow-hidden rounded-t-lg">
                      <img
                        src="/placeholder.svg"
                        alt="APARTAMENTOS CORINTO"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute bottom-2 left-2 bg-green-600 text-white px-2 py-1 rounded text-sm">
                        APARTAMENTOS
                      </div>
                    </div>
                    <CardContent className="p-3">
                      <p className="text-xs text-slate-600 leading-tight">
                        Apartamentos modernos en Corinto con vista al lago.
                      </p>
                      <Button
                        size="sm"
                        variant="outline"
                        className="w-full mt-2 text-xs"
                        onClick={() => navigate("/corinto/apartamentos")}
                      >
                        Ver Apartamentos
                      </Button>
                    </CardContent>
                  </Card>

                  <Card className="cursor-pointer hover:shadow-lg transition-shadow">
                    <div className="relative h-32 overflow-hidden rounded-t-lg">
                      <img
                        src="/placeholder.svg"
                        alt="EL SUNZAL"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute bottom-2 left-2 bg-blue-600 text-white px-2 py-1 rounded text-sm">
                        EL SUNZAL
                      </div>
                    </div>
                    <CardContent className="p-3">
                      <p className="text-xs text-slate-600 leading-tight">
                        Casas frente al mar en El Sunzal para experiencias
                        únicas.
                      </p>
                      <Button
                        size="sm"
                        variant="outline"
                        className="w-full mt-2 text-xs"
                        onClick={() => navigate("/el-sunzal/casas")}
                      >
                        Ver Casas El Sunzal
                      </Button>
                    </CardContent>
                  </Card>
                </>
              ) : (
                <>
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
                        onClick={() => navigate("/el-sunzal/apartamentos")}
                      >
                        Ver Apartamentos
                      </Button>
                    </CardContent>
                  </Card>

                  <Card className="cursor-pointer hover:shadow-lg transition-shadow">
                    <div className="relative h-32 overflow-hidden rounded-t-lg">
                      <img
                        src="/placeholder.svg"
                        alt="CORINTO"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute bottom-2 left-2 bg-blue-600 text-white px-2 py-1 rounded text-sm">
                        CORINTO
                      </div>
                    </div>
                    <CardContent className="p-3">
                      <p className="text-xs text-slate-600 leading-tight">
                        Casas junto al lago en Corinto para escapadas
                        tranquilas.
                      </p>
                      <Button
                        size="sm"
                        variant="outline"
                        className="w-full mt-2 text-xs"
                        onClick={() => navigate("/corinto/casas")}
                      >
                        Ver Casas Corinto
                      </Button>
                    </CardContent>
                  </Card>
                </>
              )}
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
