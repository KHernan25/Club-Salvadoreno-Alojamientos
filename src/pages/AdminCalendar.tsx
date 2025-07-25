import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import { toast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  CalendarDays,
  Plus,
  Edit,
  Trash2,
  AlertTriangle,
  Check,
  X,
  Filter,
  Building2,
  MapPin,
  User,
  Mail,
  Phone,
  Users,
} from "lucide-react";
import AdminLayout from "@/components/AdminLayout";
import MiniCalendar from "@/components/MiniCalendar";
import { apiGetAccommodations, apiGetReservations } from "@/lib/api-service";

interface BlockedDate {
  id: string;
  accommodationId: string;
  startDate: string;
  endDate: string;
  reason: string;
  type: "maintenance" | "personal" | "other";
  notes?: string;
  createdBy: string;
  createdAt: string;
}

interface CalendarReservation {
  id: string;
  accommodationId: string;
  checkIn: string;
  checkOut: string;
  status: "confirmed" | "pending" | "cancelled" | "completed";
  guestName: string;
  guestEmail?: string;
  guestPhone?: string;
  totalAmount?: number;
  guests?: number;
  notes?: string;
}

const AdminCalendar = () => {
  const [accommodations, setAccommodations] = useState<any[]>([]);
  const [reservations, setReservations] = useState<CalendarReservation[]>([]);
  const [blockedDates, setBlockedDates] = useState<BlockedDate[]>([]);
  const [selectedAccommodation, setSelectedAccommodation] = useState("all");
  const [selectedLocation, setSelectedLocation] = useState<string>("el-sunzal");
  const [selectedAccommodationType, setSelectedAccommodationType] =
    useState<string>("apartamento");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [selectedDateRange, setSelectedDateRange] = useState<
    { from: Date; to: Date } | undefined
  >();

  const [isBlockDialogOpen, setIsBlockDialogOpen] = useState(false);
  const [selectedReservation, setSelectedReservation] =
    useState<CalendarReservation | null>(null);
  const [isReservationDialogOpen, setIsReservationDialogOpen] = useState(false);
  const [blockForm, setBlockForm] = useState<{
    accommodationId: string;
    startDate: string;
    endDate: string;
    reason: string;
    type: "maintenance" | "personal" | "other";
    notes: string;
  }>({
    accommodationId: "",
    startDate: "",
    endDate: "",
    reason: "",
    type: "maintenance",
    notes: "",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  // Force refresh data on component mount to ensure latest mock data
  useEffect(() => {
    console.log("Loading accommodations:", getMockAccommodations());
    console.log("Loading reservations:", getMockReservations());
    setAccommodations(getMockAccommodations());
    setReservations(getMockReservations());
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [accommodationsData, reservationsData] = await Promise.all([
        apiGetAccommodations(),
        apiGetReservations(true), // Admin view to get all reservations
      ]);

      setAccommodations(accommodationsData);
      setReservations(getMockReservations()); // Using mock for now

      // Cargar fechas bloqueadas mock
      setBlockedDates(getMockBlockedDates());
    } catch (error) {
      console.error("Error loading data:", error);
      setAccommodations(getMockAccommodations());
      setReservations(getMockReservations());
      setBlockedDates(getMockBlockedDates());
    } finally {
      setLoading(false);
    }
  };

  const getMockAccommodations = () => [
    // El Sunzal - Apartamentos
    { id: "1A", name: "Apartamento 1A", location: "el-sunzal" },
    { id: "2A", name: "Apartamento 2A", location: "el-sunzal" },
    { id: "3A", name: "Apartamento 3A", location: "el-sunzal" },
    { id: "4A", name: "Apartamento 4A", location: "el-sunzal" },
    // El Sunzal - Suites
    { id: "suite1", name: "Suite 1", location: "el-sunzal" },
    { id: "suite2", name: "Suite 2", location: "el-sunzal" },
    { id: "suite3", name: "Suite Premium", location: "el-sunzal" },
    // El Sunzal - Casas
    { id: "casa1", name: "Casa Surf Paradise", location: "el-sunzal" },
    { id: "casa2", name: "Casa Oceanview", location: "el-sunzal" },
    { id: "casa3", name: "Casa Beachfront", location: "el-sunzal" },
    // Corinto - Solo Casas
    { id: "corinto-casa-1", name: "Casa del Lago", location: "corinto" },
    { id: "corinto-casa-2", name: "Casa Vista al Lago", location: "corinto" },
    {
      id: "corinto-casa-3",
      name: "Casa Familiar Corinto",
      location: "corinto",
    },
    { id: "corinto-casa-4", name: "Casa Ribereña", location: "corinto" },
  ];

  const getMockReservations = (): CalendarReservation[] => {
    const today = new Date();
    const formatDate = (date: Date) => date.toISOString().split("T")[0];

    return [
      // Confirmadas - próximos días
      {
        id: "res-1",
        accommodationId: "1A",
        checkIn: formatDate(
          new Date(today.getTime() + 2 * 24 * 60 * 60 * 1000),
        ),
        checkOut: formatDate(
          new Date(today.getTime() + 4 * 24 * 60 * 60 * 1000),
        ),
        status: "confirmed",
        guestName: "María González",
        guestEmail: "maria.gonzalez@email.com",
        guestPhone: "+503 7777-8888",
        totalAmount: 120.0,
        guests: 2,
        notes: "Llegada tardía confirmada",
      },
      {
        id: "res-2",
        accommodationId: "2A",
        checkIn: formatDate(
          new Date(today.getTime() + 5 * 24 * 60 * 60 * 1000),
        ),
        checkOut: formatDate(
          new Date(today.getTime() + 8 * 24 * 60 * 60 * 1000),
        ),
        status: "confirmed",
        guestName: "Roberto Silva",
        guestEmail: "roberto.silva@email.com",
        guestPhone: "+503 8888-9999",
        totalAmount: 180.0,
        guests: 3,
        notes: "Cliente VIP - preparar amenities especiales",
      },

      // Pendientes - próxima semana
      {
        id: "res-3",
        accommodationId: "suite1",
        checkIn: formatDate(
          new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000),
        ),
        checkOut: formatDate(
          new Date(today.getTime() + 10 * 24 * 60 * 60 * 1000),
        ),
        status: "pending",
        guestName: "Carlos Rodríguez",
        guestEmail: "carlos.rodriguez@email.com",
        guestPhone: "+503 6666-7777",
        totalAmount: 240.0,
        guests: 3,
        notes: "Esperando confirmación de pago",
      },
      {
        id: "res-4",
        accommodationId: "corinto-casa-1",
        checkIn: formatDate(
          new Date(today.getTime() + 12 * 24 * 60 * 60 * 1000),
        ),
        checkOut: formatDate(
          new Date(today.getTime() + 14 * 24 * 60 * 60 * 1000),
        ),
        status: "pending",
        guestName: "Carmen López",
        guestEmail: "carmen.lopez@email.com",
        guestPhone: "+503 3333-4444",
        totalAmount: 140.0,
        guests: 2,
        notes: "Primera reserva - requiere verificación adicional",
      },

      // Canceladas - mes actual
      {
        id: "res-5",
        accommodationId: "casa1",
        checkIn: formatDate(
          new Date(today.getTime() + 15 * 24 * 60 * 60 * 1000),
        ),
        checkOut: formatDate(
          new Date(today.getTime() + 18 * 24 * 60 * 60 * 1000),
        ),
        status: "cancelled",
        guestName: "Ana Martínez",
        guestEmail: "ana.martinez@email.com",
        guestPhone: "+503 5555-6666",
        totalAmount: 240.0,
        guests: 4,
        notes: "Cancelado por motivos personales - reembolso procesado",
      },

      // Completadas - fechas pasadas
      {
        id: "res-6",
        accommodationId: "corinto-casa-1",
        checkIn: formatDate(
          new Date(today.getTime() - 5 * 24 * 60 * 60 * 1000),
        ),
        checkOut: formatDate(
          new Date(today.getTime() - 2 * 24 * 60 * 60 * 1000),
        ),
        status: "completed",
        guestName: "Luis García",
        guestEmail: "luis.garcia@email.com",
        guestPhone: "+503 4444-5555",
        totalAmount: 210.0,
        guests: 5,
        notes: "Estadía completada - excelente review recibida",
      },
      {
        id: "res-7",
        accommodationId: "1A",
        checkIn: formatDate(
          new Date(today.getTime() - 10 * 24 * 60 * 60 * 1000),
        ),
        checkOut: formatDate(
          new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000),
        ),
        status: "completed",
        guestName: "Sandra Morales",
        guestEmail: "sandra.morales@email.com",
        guestPhone: "+503 2222-3333",
        totalAmount: 160.0,
        guests: 2,
        notes: "Estadía completada - cliente frecuente",
      },

      // Más reservas confirmadas
      {
        id: "res-8",
        accommodationId: "suite1",
        checkIn: formatDate(
          new Date(today.getTime() + 20 * 24 * 60 * 60 * 1000),
        ),
        checkOut: formatDate(
          new Date(today.getTime() + 25 * 24 * 60 * 60 * 1000),
        ),
        status: "confirmed",
        guestName: "Diego Ramírez",
        guestEmail: "diego.ramirez@email.com",
        guestPhone: "+503 9999-0000",
        totalAmount: 300.0,
        guests: 4,
        notes: "Grupo corporativo - facturación empresarial requerida",
      },
      {
        id: "res-9",
        accommodationId: "corinto-casa-1",
        checkIn: formatDate(
          new Date(today.getTime() + 28 * 24 * 60 * 60 * 1000),
        ),
        checkOut: formatDate(
          new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000),
        ),
        status: "confirmed",
        guestName: "Patricia Herrera",
        guestEmail: "patricia.herrera@email.com",
        guestPhone: "+503 1111-2222",
        totalAmount: 150.0,
        guests: 3,
        notes: "Celebración de aniversario - preparar decoración especial",
      },
    ];
  };

  const getMockBlockedDates = (): BlockedDate[] => {
    const today = new Date();
    const formatDate = (date: Date) => date.toISOString().split("T")[0];

    return [
      // Mantenimientos programados
      {
        id: "block-1",
        accommodationId: "1A",
        startDate: formatDate(
          new Date(today.getTime() + 6 * 24 * 60 * 60 * 1000),
        ),
        endDate: formatDate(
          new Date(today.getTime() + 8 * 24 * 60 * 60 * 1000),
        ),
        reason: "Mantenimiento de aire acondicionado",
        type: "maintenance",
        notes: "Reemplazo de unidad - técnico programado 9:00 AM",
        createdBy: "admin",
        createdAt: new Date(
          today.getTime() - 2 * 24 * 60 * 60 * 1000,
        ).toISOString(),
      },
      {
        id: "block-2",
        accommodationId: "2A",
        startDate: formatDate(
          new Date(today.getTime() + 13 * 24 * 60 * 60 * 1000),
        ),
        endDate: formatDate(
          new Date(today.getTime() + 13 * 24 * 60 * 60 * 1000),
        ),
        reason: "Inspección de fontanería",
        type: "maintenance",
        notes: "Revisión rutinaria de tuberías y grifos",
        createdBy: "admin",
        createdAt: new Date().toISOString(),
      },
      {
        id: "block-3",
        accommodationId: "casa1",
        startDate: formatDate(
          new Date(today.getTime() + 21 * 24 * 60 * 60 * 1000),
        ),
        endDate: formatDate(
          new Date(today.getTime() + 23 * 24 * 60 * 60 * 1000),
        ),
        reason: "Renovación de pintura exterior",
        type: "maintenance",
        notes: "Pintura exterior completa - contratista externo",
        createdBy: "staff",
        createdAt: new Date(
          today.getTime() - 5 * 24 * 60 * 60 * 1000,
        ).toISOString(),
      },

      // Eventos especiales del club
      {
        id: "block-4",
        accommodationId: "suite1",
        startDate: formatDate(
          new Date(today.getTime() + 16 * 24 * 60 * 60 * 1000),
        ),
        endDate: formatDate(
          new Date(today.getTime() + 16 * 24 * 60 * 60 * 1000),
        ),
        reason: "Evento privado del club - Gala Anual",
        type: "personal",
        notes: "Reservado para miembros VIP del club",
        createdBy: "admin",
        createdAt: new Date(
          today.getTime() - 7 * 24 * 60 * 60 * 1000,
        ).toISOString(),
      },
      {
        id: "block-5",
        accommodationId: "corinto-casa-1",
        startDate: formatDate(
          new Date(today.getTime() + 35 * 24 * 60 * 60 * 1000),
        ),
        endDate: formatDate(
          new Date(today.getTime() + 37 * 24 * 60 * 60 * 1000),
        ),
        reason: "Sesión fotográfica promocional",
        type: "personal",
        notes: "Equipo de marketing - actualización de fotos para web",
        createdBy: "mercadeo",
        createdAt: new Date().toISOString(),
      },

      // Otros bloqueos
      {
        id: "block-6",
        accommodationId: "corinto-casa-1",
        startDate: formatDate(
          new Date(today.getTime() + 40 * 24 * 60 * 60 * 1000),
        ),
        endDate: formatDate(
          new Date(today.getTime() + 42 * 24 * 60 * 60 * 1000),
        ),
        reason: "Fumigación programada",
        type: "other",
        notes:
          "Tratamiento preventivo contra plagas - requiere ventilación 24h",
        createdBy: "admin",
        createdAt: new Date(
          today.getTime() - 1 * 24 * 60 * 60 * 1000,
        ).toISOString(),
      },
    ];
  };

  const handleCreateBlock = async () => {
    try {
      const newBlock: BlockedDate = {
        id: `block-${Date.now()}`,
        ...blockForm,
        createdBy: "current-user",
        createdAt: new Date().toISOString(),
      };

      setBlockedDates([...blockedDates, newBlock]);

      toast({
        title: "Fechas bloqueadas",
        description: "Las fechas han sido bloqueadas exitosamente.",
      });

      setIsBlockDialogOpen(false);
      setBlockForm({
        accommodationId: "",
        startDate: "",
        endDate: "",
        reason: "",
        type: "maintenance",
        notes: "",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudieron bloquear las fechas.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteBlock = async (blockId: string) => {
    try {
      setBlockedDates(
        (blockedDates || []).filter((block) => block.id !== blockId),
      );

      toast({
        title: "Bloqueo eliminado",
        description: "El bloqueo de fechas ha sido eliminado.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo eliminar el bloqueo.",
        variant: "destructive",
      });
    }
  };

  const getFilteredBlockedDates = () => {
    let filtered = blockedDates || [];

    if (selectedAccommodation !== "all") {
      filtered = filtered.filter(
        (block) => block.accommodationId === selectedAccommodation,
      );
    }

    if (selectedLocation !== "all") {
      const locationAccommodations = accommodations.filter(
        (acc) => acc.location === selectedLocation,
      );
      const locationAccommodationIds = locationAccommodations.map(
        (acc) => acc.id,
      );
      filtered = filtered.filter((block) =>
        locationAccommodationIds.includes(block.accommodationId),
      );
    }

    return filtered;
  };

  const getFilteredReservations = () => {
    let filtered = reservations || [];

    if (selectedAccommodation !== "all") {
      filtered = filtered.filter(
        (res) => res.accommodationId === selectedAccommodation,
      );
    }

    if (selectedLocation !== "all") {
      const locationAccommodations = accommodations.filter(
        (acc) => acc.location === selectedLocation,
      );
      const locationAccommodationIds = locationAccommodations.map(
        (acc) => acc.id,
      );
      filtered = filtered.filter((res) =>
        locationAccommodationIds.includes(res.accommodationId),
      );
    }

    return filtered;
  };

  const getAccommodationName = (accommodationId: string) => {
    const accommodation = (accommodations || []).find(
      (a) => a.id === accommodationId,
    );
    return accommodation ? accommodation.name : "Alojamiento no encontrado";
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "maintenance":
        return "bg-orange-100 text-orange-800";
      case "personal":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "maintenance":
        return "Mantenimiento";
      case "personal":
        return "Personal";
      default:
        return "Otro";
    }
  };

  // Crear fechas con estilos según su estado
  const getDateModifiers = () => {
    const modifiers: { [key: string]: Date[] } = {
      confirmed: [],
      pending: [],
      cancelled: [],
      completed: [],
      blocked: [],
      // Location-specific modifiers
      confirmedSunzal: [],
      confirmedCorinto: [],
      pendingSunzal: [],
      pendingCorinto: [],
      completedSunzal: [],
      completedCorinto: [],
      blockedSunzal: [],
      blockedCorinto: [],
      cancelledAvailable: [], // Nuevo estado: cancelada pero disponible
    };

    const filteredReservations = getFilteredReservations();
    const filteredBlocked = getFilteredBlockedDates();

    // Fechas reservadas - separar por estado y ubicación
    filteredReservations.forEach((reservation) => {
      const start = new Date(reservation.checkIn);
      const end = new Date(reservation.checkOut);

      // Obtener la ubicación del alojamiento
      const accommodation = accommodations.find(
        (acc) => acc.id === reservation.accommodationId,
      );
      const location = accommodation?.location || "";

      for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
        const date = new Date(d);

        if (reservation.status === "cancelled") {
          modifiers.cancelledAvailable.push(date);
        } else {
          // Solo usar modificadores específicos de ubicación en vista "all"
          if (selectedLocation === "all" && location) {
            const locationKey = `${reservation.status}${location === "el-sunzal" ? "Sunzal" : "Corinto"}`;
            if (locationKey in modifiers) {
              modifiers[locationKey].push(date);
            } else {
              // Fallback al modificador base
              if (reservation.status in modifiers) {
                modifiers[reservation.status].push(date);
              }
            }
          } else {
            // En vistas específicas de ubicación, usar modificadores base
            if (reservation.status in modifiers) {
              modifiers[reservation.status].push(date);
            }
          }
        }
      }
    });

    // Fechas bloqueadas por mantenimiento/eventos
    filteredBlocked.forEach((block) => {
      const start = new Date(block.startDate);
      const end = new Date(block.endDate);

      // Obtener la ubicación del alojamiento bloqueado
      const accommodation = accommodations.find(
        (acc) => acc.id === block.accommodationId,
      );
      const location = accommodation?.location || "";

      for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
        const date = new Date(d);

        // Solo usar modificadores específicos de ubicación en vista "all"
        if (selectedLocation === "all" && location) {
          const locationKey = `blocked${location === "el-sunzal" ? "Sunzal" : "Corinto"}`;
          if (locationKey in modifiers) {
            modifiers[locationKey].push(date);
          } else {
            modifiers.blocked.push(date);
          }
        } else {
          modifiers.blocked.push(date);
        }
      }
    });

    return modifiers;
  };

  const getModifiersClassNames = () => {
    return {
      // Reservas confirmadas
      confirmedSunzal:
        "bg-red-200 text-red-800 font-semibold border-red-300 border-2 border-l-4 border-l-blue-500", // Rojo con borde azul - El Sunzal
      confirmedCorinto:
        "bg-red-200 text-red-800 font-semibold border-red-300 border-2 border-l-4 border-l-green-500", // Rojo con borde verde - Corinto
      confirmed:
        "bg-red-200 text-red-800 font-semibold border-red-300 border-2", // Rojo - confirmado (fallback)

      // Reservas pendientes
      pendingSunzal:
        "bg-yellow-200 text-yellow-800 font-semibold border-yellow-300 border-2 border-l-4 border-l-blue-500", // Amarillo con borde azul - El Sunzal
      pendingCorinto:
        "bg-yellow-200 text-yellow-800 font-semibold border-yellow-300 border-2 border-l-4 border-l-green-500", // Amarillo con borde verde - Corinto
      pending:
        "bg-yellow-200 text-yellow-800 font-semibold border-yellow-300 border-2", // Amarillo - en espera (fallback)

      // Reservas completadas
      completedSunzal:
        "bg-gray-300 text-gray-600 font-medium border-gray-400 border-2 border-l-4 border-l-blue-500", // Gris con borde azul - El Sunzal
      completedCorinto:
        "bg-gray-300 text-gray-600 font-medium border-gray-400 border-2 border-l-4 border-l-green-500", // Gris con borde verde - Corinto
      completed:
        "bg-gray-300 text-gray-600 font-medium border-gray-400 border-2", // Gris claro - completado (fallback)

      // Fechas bloqueadas
      blockedSunzal:
        "bg-orange-200 text-orange-800 font-medium border-orange-300 border-2 border-l-4 border-l-blue-500", // Naranja con borde azul - El Sunzal
      blockedCorinto:
        "bg-orange-200 text-orange-800 font-medium border-orange-300 border-2 border-l-4 border-l-green-500", // Naranja con borde verde - Corinto
      blocked:
        "bg-orange-200 text-orange-800 font-medium border-orange-300 border-2", // Naranja - bloqueado (fallback)

      cancelledAvailable:
        "bg-white text-gray-700 font-medium border-2 border-dashed border-gray-400 hover:bg-gray-50", // Blanco con borde punteado para mostrar historial
    };
  };

  // Fechas completamente deshabilitadas (no se puede reservar)
  const getDisabledDates = () => {
    const disabled: Date[] = [];
    const filteredReservations = getFilteredReservations();
    const filteredBlocked = getFilteredBlockedDates();

    // Solo agregar fechas de reservas CONFIRMADAS (no canceladas ni pendientes)
    filteredReservations
      .filter((res) => res.status === "confirmed")
      .forEach((reservation) => {
        const start = new Date(reservation.checkIn);
        const end = new Date(reservation.checkOut);

        for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
          disabled.push(new Date(d));
        }
      });

    // Agregar fechas bloqueadas por mantenimiento o eventos
    filteredBlocked.forEach((block) => {
      const start = new Date(block.startDate);
      const end = new Date(block.endDate);

      for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
        disabled.push(new Date(d));
      }
    });

    return disabled;
  };

  // Fechas con reservas canceladas (disponibles para nueva reserva pero con historial)
  const getCancelledAvailableDates = () => {
    const cancelledAvailable: Date[] = [];
    const filteredReservations = getFilteredReservations();

    // Buscar fechas con reservas canceladas que están disponibles
    filteredReservations
      .filter((res) => res.status === "cancelled")
      .forEach((reservation) => {
        const start = new Date(reservation.checkIn);
        const end = new Date(reservation.checkOut);

        for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
          cancelledAvailable.push(new Date(d));
        }
      });

    return cancelledAvailable;
  };

  const handleDateClick = (date: Date) => {
    const clickedDateStr = date.toISOString().split("T")[0];
    const filteredReservations = getFilteredReservations();

    console.log("Clicked date:", clickedDateStr);
    console.log("Available reservations:", filteredReservations);

    // Buscar reserva para esta fecha
    const reservation = filteredReservations.find((res) => {
      const startDateStr = res.checkIn;
      const endDateStr = res.checkOut;

      console.log(
        `Checking reservation ${res.id}: ${startDateStr} to ${endDateStr}`,
      );
      console.log(
        `Date comparison: ${clickedDateStr} >= ${startDateStr} && ${clickedDateStr} <= ${endDateStr}`,
      );

      // Incluir tanto el día de check-in como el día de check-out
      const isInRange =
        clickedDateStr >= startDateStr && clickedDateStr <= endDateStr;
      console.log(`Is in range: ${isInRange}`);

      return isInRange;
    });

    console.log("Found reservation:", reservation);

    if (reservation) {
      setSelectedReservation(reservation);
      setIsReservationDialogOpen(true);
    } else {
      // También buscar en fechas bloqueadas para mostrar información
      const filteredBlocked = getFilteredBlockedDates();
      const blockedDate = filteredBlocked.find((blocked) => {
        const startDateStr = blocked.startDate;
        const endDateStr = blocked.endDate;
        return clickedDateStr >= startDateStr && clickedDateStr <= endDateStr;
      });

      if (blockedDate) {
        console.log("Fecha bloqueada:", blockedDate);
      } else {
        console.log(
          "No reservation or blocked date found for:",
          clickedDateStr,
        );
      }
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Calendario y Bloqueos</h1>
            <p className="text-gray-600">
              Administra fechas bloqueadas y disponibilidad de alojamientos
            </p>
          </div>
          <Button onClick={() => setIsBlockDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Bloquear Fechas
          </Button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                Total Bloqueos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {blockedDates?.length || 0}
              </div>
              <p className="text-xs text-muted-foreground">
                Fechas bloqueadas activas
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                Mantenimiento
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">
                {
                  (blockedDates || []).filter((b) => b.type === "maintenance")
                    .length
                }
              </div>
              <p className="text-xs text-muted-foreground">Por mantenimiento</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Eventos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {
                  (blockedDates || []).filter((b) => b.type === "personal")
                    .length
                }
              </div>
              <p className="text-xs text-muted-foreground">
                Por eventos especiales
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Este Mes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-emerald-600">
                {
                  (blockedDates || []).filter((b) => {
                    const blockDate = new Date(b.startDate);
                    const now = new Date();
                    return (
                      blockDate.getMonth() === now.getMonth() &&
                      blockDate.getFullYear() === now.getFullYear()
                    );
                  }).length
                }
              </div>
              <p className="text-xs text-muted-foreground">Bloqueos este mes</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Calendar Section with Tabs */}
        <Card>
          <CardHeader>
            <CardTitle>Calendario de Reservas</CardTitle>
            <CardDescription>
              Vista de disponibilidad por ubicación y estado de reservas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs
              value={selectedLocation}
              onValueChange={setSelectedLocation}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="el-sunzal">
                  <MapPin className="h-4 w-4 mr-1" />
                  El Sunzal
                </TabsTrigger>
                <TabsTrigger value="corinto">
                  <MapPin className="h-4 w-4 mr-1" />
                  Corinto
                </TabsTrigger>
              </TabsList>

              {/* El Sunzal Tab Content - Multiple mini calendars */}
              <TabsContent value="el-sunzal" className="mt-6">
                <div className="space-y-6">
                  <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-5 w-5 text-blue-600" />
                      <span className="text-lg text-blue-800 font-semibold">
                        El Sunzal - Calendarios por Tipo de Alojamiento
                      </span>
                    </div>
                    <p className="text-sm text-blue-600 mt-1">
                      Vista separada para Apartamentos, Suites y Casas
                    </p>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Apartamentos Calendar */}
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="flex items-center text-lg">
                          <Building2 className="mr-2 h-5 w-5 text-blue-600" />
                          🏠 Apartamentos
                        </CardTitle>
                        <CardDescription>
                          Vista de disponibilidad para apartamentos en El Sunzal
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="flex items-center space-x-2 mb-3">
                            <Filter className="h-4 w-4" />
                            <Select
                              value={selectedAccommodation}
                              onValueChange={setSelectedAccommodation}
                            >
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Todos los apartamentos" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="all">
                                  Todos los apartamentos
                                </SelectItem>
                                <SelectItem value="apt-101">
                                  Apartamento 101
                                </SelectItem>
                                <SelectItem value="apt-102">
                                  Apartamento 102
                                </SelectItem>
                                <SelectItem value="apt-201">
                                  Apartamento 201
                                </SelectItem>
                                <SelectItem value="apt-202">
                                  Apartamento 202
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <Calendar
                            mode="default"
                            onDayClick={handleDateClick}
                            disabled={getDisabledDates()}
                            className="rounded-md border w-full"
                            classNames={{
                              months: "flex flex-col space-y-4 w-full",
                              month: "space-y-4 w-full",
                              table: "w-full border-collapse space-y-1",
                              head_row: "flex w-full",
                              head_cell:
                                "text-muted-foreground rounded-md w-8 h-8 font-normal text-xs flex items-center justify-center",
                              row: "flex w-full mt-1",
                              cell: "h-8 w-8 text-center text-xs p-0 relative",
                              day: "h-8 w-8 p-0 font-normal aria-selected:opacity-100 hover:bg-accent hover:text-accent-foreground cursor-pointer transition-colors text-xs",
                            }}
                            modifiers={getDateModifiers()}
                            modifiersClassNames={getModifiersClassNames()}
                          />
                        </div>
                      </CardContent>
                    </Card>

                    {/* Suites Calendar */}
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="flex items-center text-lg">
                          <Building2 className="mr-2 h-5 w-5 text-purple-600" />
                          🏨 Suites
                        </CardTitle>
                        <CardDescription>
                          Vista de disponibilidad para suites en El Sunzal
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="flex items-center space-x-2 mb-3">
                            <Filter className="h-4 w-4" />
                            <Select
                              value={selectedAccommodation}
                              onValueChange={setSelectedAccommodation}
                            >
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Todas las suites" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="all">
                                  Todas las suites
                                </SelectItem>
                                <SelectItem value="suite-ocean">
                                  Suite Ocean View
                                </SelectItem>
                                <SelectItem value="suite-sunset">
                                  Suite Sunset
                                </SelectItem>
                                <SelectItem value="suite-family">
                                  Suite Familiar
                                </SelectItem>
                                <SelectItem value="suite-deluxe">
                                  Suite Deluxe
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <Calendar
                            mode="default"
                            onDayClick={handleDateClick}
                            disabled={getDisabledDates()}
                            className="rounded-md border w-full"
                            classNames={{
                              months: "flex flex-col space-y-4 w-full",
                              month: "space-y-4 w-full",
                              table: "w-full border-collapse space-y-1",
                              head_row: "flex w-full",
                              head_cell:
                                "text-muted-foreground rounded-md w-8 h-8 font-normal text-xs flex items-center justify-center",
                              row: "flex w-full mt-1",
                              cell: "h-8 w-8 text-center text-xs p-0 relative",
                              day: "h-8 w-8 p-0 font-normal aria-selected:opacity-100 hover:bg-accent hover:text-accent-foreground cursor-pointer transition-colors text-xs",
                            }}
                            modifiers={getDateModifiers()}
                            modifiersClassNames={getModifiersClassNames()}
                          />
                        </div>
                      </CardContent>
                    </Card>

                    {/* Casas Calendar */}
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="flex items-center text-lg">
                          <Building2 className="mr-2 h-5 w-5 text-green-600" />
                          🏡 Casas
                        </CardTitle>
                        <CardDescription>
                          Vista de disponibilidad para casas en El Sunzal
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="flex items-center space-x-2 mb-3">
                            <Filter className="h-4 w-4" />
                            <Select
                              value={selectedAccommodation}
                              onValueChange={setSelectedAccommodation}
                            >
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Todas las casas" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="all">
                                  Todas las casas
                                </SelectItem>
                                <SelectItem value="casa-playa">
                                  Casa Frente a la Playa
                                </SelectItem>
                                <SelectItem value="casa-jardin">
                                  Casa con Jardín
                                </SelectItem>
                                <SelectItem value="casa-family">
                                  Casa Familiar
                                </SelectItem>
                                <SelectItem value="casa-luxury">
                                  Casa de Lujo
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <Calendar
                            mode="default"
                            onDayClick={handleDateClick}
                            disabled={getDisabledDates()}
                            className="rounded-md border w-full"
                            classNames={{
                              months: "flex flex-col space-y-4 w-full",
                              month: "space-y-4 w-full",
                              table: "w-full border-collapse space-y-1",
                              head_row: "flex w-full",
                              head_cell:
                                "text-muted-foreground rounded-md w-8 h-8 font-normal text-xs flex items-center justify-center",
                              row: "flex w-full mt-1",
                              cell: "h-8 w-8 text-center text-xs p-0 relative",
                              day: "h-8 w-8 p-0 font-normal aria-selected:opacity-100 hover:bg-accent hover:text-accent-foreground cursor-pointer transition-colors text-xs",
                            }}
                            modifiers={getDateModifiers()}
                            modifiersClassNames={getModifiersClassNames()}
                          />
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </TabsContent>

              {/* Corinto Tab Content */}
              <TabsContent value="corinto" className="mt-6">
                <div className="space-y-6">
                  <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-5 w-5 text-green-600" />
                      <span className="text-lg text-green-800 font-semibold">
                        Corinto - Casas Frente al Lago
                      </span>
                    </div>
                    <p className="text-sm text-green-600 mt-1">
                      Vista de disponibilidad para todas las propiedades en
                      Corinto
                    </p>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    {/* Corinto Main Calendar */}
                    <Card className="lg:col-span-3">
                      <CardHeader>
                        <CardTitle className="flex items-center">
                          <Building2 className="mr-2 h-5 w-5 text-green-600" />
                          Calendario Corinto
                        </CardTitle>
                        <CardDescription>
                          Vista principal de reservas para casas en Corinto
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="flex items-center space-x-2 mb-4">
                            <Filter className="h-4 w-4" />
                            <Select
                              value={selectedAccommodation}
                              onValueChange={setSelectedAccommodation}
                            >
                              <SelectTrigger className="w-64">
                                <SelectValue placeholder="Todas las casas" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="all">
                                  Todas las casas
                                </SelectItem>
                                <SelectItem value="casa-lago-1">
                                  Casa Lago Vista 1
                                </SelectItem>
                                <SelectItem value="casa-lago-2">
                                  Casa Lago Vista 2
                                </SelectItem>
                                <SelectItem value="casa-lago-3">
                                  Casa Lago Vista 3
                                </SelectItem>
                                <SelectItem value="casa-lago-premium">
                                  Casa Premium Lago
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <Calendar
                            mode="default"
                            onDayClick={handleDateClick}
                            disabled={getDisabledDates()}
                            className="rounded-md border w-full max-w-none"
                            classNames={{
                              months:
                                "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0 w-full justify-center",
                              month:
                                "space-y-4 w-full max-w-md mx-auto sm:max-w-none",
                              table: "w-full border-collapse space-y-1",
                              head_row: "flex w-full",
                              head_cell:
                                "text-muted-foreground rounded-md w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 font-normal text-xs sm:text-sm flex items-center justify-center",
                              row: "flex w-full mt-2",
                              cell: "h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 text-center text-xs sm:text-sm p-0 relative",
                              day: "h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 p-0 font-normal aria-selected:opacity-100 hover:bg-accent hover:text-accent-foreground cursor-pointer transition-colors text-xs sm:text-sm",
                            }}
                            modifiers={getDateModifiers()}
                            modifiersClassNames={getModifiersClassNames()}
                          />
                        </div>
                      </CardContent>
                    </Card>

                    {/* Corinto Filters and Mini Calendar */}
                    <div className="lg:col-span-1 space-y-6">
                      <MiniCalendar
                        selectedDate={selectedDate}
                        onDateSelect={setSelectedDate}
                        selectedAccommodationType={selectedAccommodationType}
                        onAccommodationTypeChange={setSelectedAccommodationType}
                        selectedDateRange={selectedDateRange}
                        onDateRangeChange={setSelectedDateRange}
                        availableDates={[
                          new Date(2024, 2, 18),
                          new Date(2024, 2, 19),
                          new Date(2024, 2, 25),
                          new Date(2024, 3, 2),
                          new Date(2024, 3, 10),
                        ]}
                        bookedDates={[
                          new Date(2024, 2, 12),
                          new Date(2024, 2, 13),
                          new Date(2024, 2, 20),
                          new Date(2024, 3, 5),
                          new Date(2024, 3, 16),
                        ]}
                        className="w-full"
                      />
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Calendar Legend */}
        <Card>
          <CardHeader>
            <CardTitle>Leyenda del Calendario</CardTitle>
            <CardDescription>
              Significado de los colores y estados en todos los calendarios
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 text-xs">
              <div className="flex items-center space-x-2 p-2 bg-white rounded border">
                <div className="w-4 h-4 bg-white border-2 border-gray-300 rounded"></div>
                <span className="text-gray-700 font-medium">Disponible</span>
              </div>
              <div className="flex items-center space-x-2 p-2 bg-white rounded border">
                <div className="w-4 h-4 bg-yellow-200 border-2 border-yellow-300 rounded"></div>
                <span className="text-yellow-800 font-medium">En espera</span>
              </div>
              <div className="flex items-center space-x-2 p-2 bg-white rounded border">
                <div className="w-4 h-4 bg-red-200 border-2 border-red-300 rounded"></div>
                <span className="text-red-800 font-medium">Reservado</span>
              </div>
              <div className="flex items-center space-x-2 p-2 bg-white rounded border">
                <div className="w-4 h-4 bg-gray-300 border-2 border-gray-400 rounded"></div>
                <span className="text-gray-600 font-medium">Completado</span>
              </div>
              <div className="flex items-center space-x-2 p-2 bg-white rounded border">
                <div className="w-4 h-4 bg-white border-2 border-dashed border-gray-400 rounded"></div>
                <span className="text-gray-800 font-medium">Disponible*</span>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="flex items-center space-x-2 p-2 bg-orange-50 rounded border border-orange-200">
                <div className="w-4 h-4 bg-orange-200 border-2 border-orange-300 rounded"></div>
                <span className="text-orange-800 font-medium">
                  Mantenimiento
                </span>
              </div>
              <div className="flex items-center space-x-2 p-2 bg-blue-50 rounded border border-blue-200">
                <div className="w-4 h-4 bg-blue-200 border-2 border-blue-300 rounded"></div>
                <span className="text-blue-800 font-medium">
                  Evento especial
                </span>
              </div>
              <div className="flex items-center space-x-2 p-2 bg-purple-50 rounded border border-purple-200">
                <div className="w-4 h-4 bg-purple-200 border-2 border-purple-300 rounded"></div>
                <span className="text-purple-800 font-medium">
                  Otro bloqueo
                </span>
              </div>
            </div>
            <div className="mt-3 space-y-2 text-xs text-gray-600">
              <div className="p-2 bg-blue-50 border border-blue-200 rounded text-blue-700">
                <span className="font-medium">🏠 El Sunzal:</span> Tres
                calendarios separados para Apartamentos, Suites y Casas
              </div>
              <div className="p-2 bg-green-50 border border-green-200 rounded text-green-700">
                <span className="font-medium">🏡 Corinto:</span> Un calendario
                principal para todas las casas frente al lago
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Blocked Dates Section - Moved to bottom for more space */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center">
              <CalendarDays className="mr-2 h-5 w-5 text-orange-600" />
              Bloqueos Activos
            </CardTitle>
            <CardDescription>
              Lista de fechas bloqueadas organizadas por alojamiento y tipo
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {(getFilteredBlockedDates() || []).map((block) => (
                <div
                  key={block.id}
                  className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1 flex-1">
                        <p className="font-medium text-sm">
                          {getAccommodationName(block.accommodationId)}
                        </p>
                        <p className="text-xs text-gray-600">
                          {new Date(block.startDate).toLocaleDateString()} -{" "}
                          {new Date(block.endDate).toLocaleDateString()}
                        </p>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDeleteBlock(block.id)}
                        className="shrink-0"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                    <Badge
                      className={`text-xs w-fit ${getTypeColor(block.type)}`}
                    >
                      {getTypeLabel(block.type)}
                    </Badge>
                    <p className="text-xs text-gray-700 line-clamp-2">
                      {block.reason}
                    </p>
                    {block.notes && (
                      <p className="text-xs text-gray-500 line-clamp-1">
                        {block.notes}
                      </p>
                    )}
                  </div>
                </div>
              ))}

              {/* Example blocked dates for demonstration */}
              <div className="border rounded-lg p-4 hover:shadow-md transition-shadow bg-orange-50 border-orange-200">
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1 flex-1">
                      <p className="font-medium text-sm">Suite El Sunzal 101</p>
                      <p className="text-xs text-orange-600">
                        15/03/2024 - 20/03/2024
                      </p>
                    </div>
                    <Button size="sm" variant="ghost" className="shrink-0">
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                  <Badge className="text-xs w-fit bg-orange-200 text-orange-800">
                    Mantenimiento
                  </Badge>
                  <p className="text-xs text-gray-700 line-clamp-2">
                    Reparación del aire acondicionado
                  </p>
                  <p className="text-xs text-gray-500 line-clamp-1">
                    Técnico confirmado para el martes
                  </p>
                </div>
              </div>

              <div className="border rounded-lg p-4 hover:shadow-md transition-shadow bg-blue-50 border-blue-200">
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1 flex-1">
                      <p className="font-medium text-sm">
                        Casa Corinto Vista Lago
                      </p>
                      <p className="text-xs text-blue-600">
                        25/03/2024 - 28/03/2024
                      </p>
                    </div>
                    <Button size="sm" variant="ghost" className="shrink-0">
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                  <Badge className="text-xs w-fit bg-blue-200 text-blue-800">
                    Evento especial
                  </Badge>
                  <p className="text-xs text-gray-700 line-clamp-2">
                    Uso personal para evento familiar
                  </p>
                  <p className="text-xs text-gray-500 line-clamp-1">
                    Cumpleaños de la abuela
                  </p>
                </div>
              </div>

              <div className="border rounded-lg p-4 hover:shadow-md transition-shadow bg-purple-50 border-purple-200">
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1 flex-1">
                      <p className="font-medium text-sm">
                        Apartamento El Sunzal 205
                      </p>
                      <p className="text-xs text-purple-600">
                        10/04/2024 - 12/04/2024
                      </p>
                    </div>
                    <Button size="sm" variant="ghost" className="shrink-0">
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                  <Badge className="text-xs w-fit bg-purple-200 text-purple-800">
                    Otro bloqueo
                  </Badge>
                  <p className="text-xs text-gray-700 line-clamp-2">
                    Fotografías profesionales para marketing
                  </p>
                  <p className="text-xs text-gray-500 line-clamp-1">
                    Sesión con fotógrafo especializado
                  </p>
                </div>
              </div>

              {getFilteredBlockedDates().length === 0 && (
                <div className="col-span-full text-center py-8 text-gray-500">
                  <CalendarDays className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p className="text-sm">
                    No hay fechas bloqueadas actualmente
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    Los bloqueos aparecerán aquí cuando se agreguen
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Block Dates Dialog */}
        <Dialog open={isBlockDialogOpen} onOpenChange={setIsBlockDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Bloquear Fechas</DialogTitle>
              <DialogDescription>
                Selecciona las fechas y el motivo del bloqueo
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="accommodation-select">Alojamiento</Label>
                <Select
                  value={blockForm.accommodationId}
                  onValueChange={(value) =>
                    setBlockForm({ ...blockForm, accommodationId: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar alojamiento" />
                  </SelectTrigger>
                  <SelectContent>
                    {(accommodations || []).map((accommodation) => (
                      <SelectItem
                        key={accommodation.id}
                        value={accommodation.id}
                      >
                        {accommodation.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="start-date">Fecha Inicio</Label>
                  <Input
                    id="start-date"
                    type="date"
                    value={blockForm.startDate}
                    onChange={(e) =>
                      setBlockForm({ ...blockForm, startDate: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="end-date">Fecha Fin</Label>
                  <Input
                    id="end-date"
                    type="date"
                    value={blockForm.endDate}
                    onChange={(e) =>
                      setBlockForm({ ...blockForm, endDate: e.target.value })
                    }
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="type-select">Tipo de Bloqueo</Label>
                <Select
                  value={blockForm.type}
                  onValueChange={(
                    value: "maintenance" | "personal" | "other",
                  ) => setBlockForm({ ...blockForm, type: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="maintenance">Mantenimiento</SelectItem>
                    <SelectItem value="personal">Evento Personal</SelectItem>
                    <SelectItem value="other">Otro</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="reason">Motivo</Label>
                <Input
                  id="reason"
                  placeholder="Describe el motivo del bloqueo"
                  value={blockForm.reason}
                  onChange={(e) =>
                    setBlockForm({ ...blockForm, reason: e.target.value })
                  }
                />
              </div>
              <div>
                <Label htmlFor="notes">Notas Adicionales (Opcional)</Label>
                <Textarea
                  id="notes"
                  rows={3}
                  placeholder="Información adicional..."
                  value={blockForm.notes}
                  onChange={(e) =>
                    setBlockForm({ ...blockForm, notes: e.target.value })
                  }
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsBlockDialogOpen(false)}
              >
                Cancelar
              </Button>
              <Button onClick={handleCreateBlock}>Bloquear Fechas</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Reservation Details Dialog */}
        <Dialog
          open={isReservationDialogOpen}
          onOpenChange={setIsReservationDialogOpen}
        >
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Detalles de la Reserva</DialogTitle>
              <DialogDescription>
                Informaci��n completa de la reserva seleccionada
              </DialogDescription>
            </DialogHeader>
            {selectedReservation && (
              <div className="space-y-6">
                {/* Status Badge */}
                <div className="flex items-center justify-between">
                  <Badge
                    className={`${
                      selectedReservation.status === "confirmed"
                        ? "bg-green-100 text-green-800"
                        : selectedReservation.status === "pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : selectedReservation.status === "cancelled"
                            ? "bg-red-100 text-red-800"
                            : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {selectedReservation.status === "confirmed" && "Confirmada"}
                    {selectedReservation.status === "pending" && "Pendiente"}
                    {selectedReservation.status === "cancelled" && "Cancelada"}
                    {selectedReservation.status === "completed" && "Completada"}
                  </Badge>
                  <span className="text-sm text-gray-500">
                    ID: {selectedReservation.id}
                  </span>
                </div>

                {/* Guest Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm font-medium">
                        Información del Huésped
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div>
                        <Label className="text-xs text-gray-500">Nombre</Label>
                        <p className="font-medium">
                          {selectedReservation.guestName}
                        </p>
                      </div>
                      {selectedReservation.guestEmail && (
                        <div>
                          <Label className="text-xs text-gray-500">Email</Label>
                          <p className="text-sm">
                            {selectedReservation.guestEmail}
                          </p>
                        </div>
                      )}
                      {selectedReservation.guestPhone && (
                        <div>
                          <Label className="text-xs text-gray-500">
                            Teléfono
                          </Label>
                          <p className="text-sm">
                            {selectedReservation.guestPhone}
                          </p>
                        </div>
                      )}
                      {selectedReservation.guests && (
                        <div>
                          <Label className="text-xs text-gray-500">
                            Huéspedes
                          </Label>
                          <p className="text-sm">
                            {selectedReservation.guests} persona
                            {selectedReservation.guests > 1 ? "s" : ""}
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm font-medium">
                        Detalles de la Reserva
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div>
                        <Label className="text-xs text-gray-500">
                          Alojamiento
                        </Label>
                        <p className="font-medium">
                          {getAccommodationName(
                            selectedReservation.accommodationId,
                          )}
                        </p>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <Label className="text-xs text-gray-500">
                            Check-in
                          </Label>
                          <p className="text-sm">
                            {new Date(
                              selectedReservation.checkIn,
                            ).toLocaleDateString()}
                          </p>
                        </div>
                        <div>
                          <Label className="text-xs text-gray-500">
                            Check-out
                          </Label>
                          <p className="text-sm">
                            {new Date(
                              selectedReservation.checkOut,
                            ).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      {selectedReservation.totalAmount && (
                        <div>
                          <Label className="text-xs text-gray-500">Total</Label>
                          <p className="font-semibold text-lg">
                            ${selectedReservation.totalAmount.toFixed(2)}
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>

                {/* Notes */}
                {selectedReservation.notes && (
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm font-medium">
                        Notas
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-700">
                        {selectedReservation.notes}
                      </p>
                    </CardContent>
                  </Card>
                )}

                {/* Duration */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">
                      Duración de la estadía:
                    </span>
                    <span className="font-medium">
                      {Math.ceil(
                        (new Date(selectedReservation.checkOut).getTime() -
                          new Date(selectedReservation.checkIn).getTime()) /
                          (1000 * 60 * 60 * 24),
                      )}{" "}
                      noche
                      {Math.ceil(
                        (new Date(selectedReservation.checkOut).getTime() -
                          new Date(selectedReservation.checkIn).getTime()) /
                          (1000 * 60 * 60 * 24),
                      ) > 1
                        ? "s"
                        : ""}
                    </span>
                  </div>
                </div>
              </div>
            )}
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsReservationDialogOpen(false)}
              >
                Cerrar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default AdminCalendar;
