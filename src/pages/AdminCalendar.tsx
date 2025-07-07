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
} from "lucide-react";
import AdminLayout from "@/components/AdminLayout";
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
  const [selectedLocation, setSelectedLocation] = useState<string>("all");
  const [selectedDates, setSelectedDates] = useState<Date[]>([]);
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
    { id: "1A", name: "Apartamento 1A", location: "el-sunzal" },
    { id: "suite-1", name: "Suite Premium 1", location: "el-sunzal" },
    { id: "casa-1", name: "Casa Familiar 1", location: "el-sunzal" },
    { id: "corinto-casa-1", name: "Casa Corinto 1", location: "corinto" },
    {
      id: "corinto-apto-1",
      name: "Apartamento Corinto 1",
      location: "corinto",
    },
    {
      id: "corinto-apto-2",
      name: "Apartamento Corinto 2",
      location: "corinto",
    },
  ];

  const getMockReservations = (): CalendarReservation[] => [
    {
      id: "res-1",
      accommodationId: "1A",
      checkIn: "2024-01-15",
      checkOut: "2024-01-17",
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
      accommodationId: "suite-1",
      checkIn: "2024-01-20",
      checkOut: "2024-01-22",
      status: "pending",
      guestName: "Carlos Rodríguez",
      guestEmail: "carlos.rodriguez@email.com",
      guestPhone: "+503 6666-7777",
      totalAmount: 180.0,
      guests: 3,
      notes: "Esperando confirmación de pago",
    },
    {
      id: "res-3",
      accommodationId: "casa-1",
      checkIn: "2024-01-25",
      checkOut: "2024-01-28",
      status: "cancelled",
      guestName: "Ana Martínez",
      guestEmail: "ana.martinez@email.com",
      guestPhone: "+503 5555-6666",
      totalAmount: 240.0,
      guests: 4,
      notes: "Cancelado por motivos personales",
    },
    {
      id: "res-4",
      accommodationId: "corinto-casa-1",
      checkIn: "2024-01-18",
      checkOut: "2024-01-21",
      status: "confirmed",
      guestName: "Luis García",
      guestEmail: "luis.garcia@email.com",
      guestPhone: "+503 4444-5555",
      totalAmount: 210.0,
      guests: 5,
      notes: "Familia con niños pequeños",
    },
    {
      id: "res-5",
      accommodationId: "corinto-apto-1",
      checkIn: "2024-01-22",
      checkOut: "2024-01-24",
      status: "pending",
      guestName: "Carmen López",
      guestEmail: "carmen.lopez@email.com",
      guestPhone: "+503 3333-4444",
      totalAmount: 140.0,
      guests: 2,
      notes: "Primera reserva",
    },
  ];

  const getMockBlockedDates = (): BlockedDate[] => [
    {
      id: "block-1",
      accommodationId: "1A",
      startDate: "2024-01-20",
      endDate: "2024-01-22",
      reason: "Mantenimiento de aire acondicionado",
      type: "maintenance",
      notes: "Reemplazo de unidad",
      createdBy: "admin",
      createdAt: "2024-01-15T10:00:00Z",
    },
    {
      id: "block-2",
      accommodationId: "suite-1",
      startDate: "2024-01-25",
      endDate: "2024-01-25",
      reason: "Evento privado del club",
      type: "personal",
      createdBy: "admin",
      createdAt: "2024-01-10T15:30:00Z",
    },
    {
      id: "block-3",
      accommodationId: "casa-1",
      startDate: "2024-02-01",
      endDate: "2024-02-03",
      reason: "Renovación de pintura",
      type: "maintenance",
      notes: "Pintura exterior e interior",
      createdBy: "staff",
      createdAt: "2024-01-18T09:00:00Z",
    },
  ];

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
  const getDateStyles = () => {
    const dateStyles: { [key: string]: string } = {};
    const filteredReservations = getFilteredReservations();
    const filteredBlocked = getFilteredBlockedDates();

    // Fechas reservadas (rojo)
    filteredReservations.forEach((reservation) => {
      const start = new Date(reservation.checkIn);
      const end = new Date(reservation.checkOut);

      for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
        const dateKey = d.toISOString().split("T")[0];

        switch (reservation.status) {
          case "confirmed":
            dateStyles[dateKey] = "bg-red-200 text-red-800 font-semibold"; // Rojo - reservado
            break;
          case "pending":
            dateStyles[dateKey] = "bg-yellow-200 text-yellow-800 font-semibold"; // Amarillo - en espera
            break;
          case "cancelled":
            dateStyles[dateKey] = "bg-gray-600 text-white"; // Gris oscuro - cancelado
            break;
          case "completed":
            dateStyles[dateKey] = "bg-gray-300 text-gray-600"; // Gris claro - completado
            break;
        }
      }
    });

    // Fechas bloqueadas (gris claro)
    filteredBlocked.forEach((block) => {
      const start = new Date(block.startDate);
      const end = new Date(block.endDate);

      for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
        const dateKey = d.toISOString().split("T")[0];
        dateStyles[dateKey] = "bg-gray-300 text-gray-600"; // Gris claro - bloqueado
      }
    });

    return dateStyles;
  };

  // Fechas deshabilitadas (solo para interacción)
  const getDisabledDates = () => {
    const disabled: Date[] = [];
    const filteredReservations = getFilteredReservations();
    const filteredBlocked = getFilteredBlockedDates();

    // Agregar fechas de reservas confirmadas
    filteredReservations
      .filter((res) => res.status === "confirmed")
      .forEach((reservation) => {
        const start = new Date(reservation.checkIn);
        const end = new Date(reservation.checkOut);

        for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
          disabled.push(new Date(d));
        }
      });

    // Agregar fechas bloqueadas
    filteredBlocked.forEach((block) => {
      const start = new Date(block.startDate);
      const end = new Date(block.endDate);

      for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
        disabled.push(new Date(d));
      }
    });

    return disabled;
  };

  const handleDateClick = (date: Date) => {
    const clickedDateStr = date.toISOString().split("T")[0];
    const filteredReservations = getFilteredReservations();

    // Buscar reserva para esta fecha
    const reservation = filteredReservations.find((res) => {
      const startDate = new Date(res.checkIn);
      const endDate = new Date(res.checkOut);
      const clickedDate = new Date(clickedDateStr);

      return clickedDate >= startDate && clickedDate <= endDate;
    });

    if (reservation) {
      setSelectedReservation(reservation);
      setIsReservationDialogOpen(true);
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Calendar View */}
          <Card className="lg:col-span-2">
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
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="all">Todas las Ubicaciones</TabsTrigger>
                  <TabsTrigger value="el-sunzal">
                    <MapPin className="h-4 w-4 mr-1" />
                    El Sunzal
                  </TabsTrigger>
                  <TabsTrigger value="corinto">
                    <MapPin className="h-4 w-4 mr-1" />
                    Corinto
                  </TabsTrigger>
                </TabsList>

                <div className="mt-4">
                  <div className="flex items-center space-x-2 mb-4">
                    <Filter className="h-4 w-4" />
                    <Select
                      value={selectedAccommodation}
                      onValueChange={setSelectedAccommodation}
                    >
                      <SelectTrigger className="w-64">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">
                          Todos los alojamientos
                        </SelectItem>
                        {(accommodations || [])
                          .filter(
                            (acc) =>
                              selectedLocation === "all" ||
                              acc.location === selectedLocation,
                          )
                          .map((accommodation) => (
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

                  <TabsContent value="all" className="mt-0">
                    <Calendar
                      mode="multiple"
                      selected={selectedDates}
                      onSelect={setSelectedDates}
                      onDayClick={handleDateClick}
                      disabled={getDisabledDates()}
                      className="rounded-md border w-full"
                      classNames={{
                        months:
                          "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0 w-full",
                        month: "space-y-4 w-full",
                        table: "w-full border-collapse space-y-1",
                        head_row: "flex w-full",
                        head_cell:
                          "text-muted-foreground rounded-md w-16 h-12 font-normal text-sm flex items-center justify-center",
                        row: "flex w-full mt-2",
                        cell: "h-16 w-16 text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
                        day: "h-16 w-16 p-0 font-normal aria-selected:opacity-100 hover:bg-accent hover:text-accent-foreground cursor-pointer transition-colors",
                      }}
                      modifiers={getDateStyles()}
                      modifiersClassNames={getDateStyles()}
                    />
                  </TabsContent>

                  <TabsContent value="el-sunzal" className="mt-0">
                    <div className="mb-2 text-sm text-blue-600 font-medium">
                      Mostrando reservas para El Sunzal
                    </div>
                    <Calendar
                      mode="multiple"
                      selected={selectedDates}
                      onSelect={setSelectedDates}
                      onDayClick={handleDateClick}
                      disabled={getDisabledDates()}
                      className="rounded-md border w-full"
                      classNames={{
                        months:
                          "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0 w-full",
                        month: "space-y-4 w-full",
                        table: "w-full border-collapse space-y-1",
                        head_row: "flex w-full",
                        head_cell:
                          "text-muted-foreground rounded-md w-16 h-12 font-normal text-sm flex items-center justify-center",
                        row: "flex w-full mt-2",
                        cell: "h-16 w-16 text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
                        day: "h-16 w-16 p-0 font-normal aria-selected:opacity-100 hover:bg-accent hover:text-accent-foreground cursor-pointer transition-colors",
                      }}
                      modifiers={getDateStyles()}
                      modifiersClassNames={getDateStyles()}
                    />
                  </TabsContent>

                  <TabsContent value="corinto" className="mt-0">
                    <div className="mb-2 text-sm text-blue-600 font-medium">
                      Mostrando reservas para Corinto
                    </div>
                    <Calendar
                      mode="multiple"
                      selected={selectedDates}
                      onSelect={setSelectedDates}
                      onDayClick={handleDateClick}
                      disabled={getDisabledDates()}
                      className="rounded-md border w-full"
                      classNames={{
                        months:
                          "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0 w-full",
                        month: "space-y-4 w-full",
                        table: "w-full border-collapse space-y-1",
                        head_row: "flex w-full",
                        head_cell:
                          "text-muted-foreground rounded-md w-16 h-12 font-normal text-sm flex items-center justify-center",
                        row: "flex w-full mt-2",
                        cell: "h-16 w-16 text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
                        day: "h-16 w-16 p-0 font-normal aria-selected:opacity-100 hover:bg-accent hover:text-accent-foreground cursor-pointer transition-colors",
                      }}
                      modifiers={getDateStyles()}
                      modifiersClassNames={getDateStyles()}
                    />
                  </TabsContent>
                </div>
              </Tabs>

              <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-white border border-gray-300 rounded"></div>
                  <span>Disponible</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-yellow-200 rounded"></div>
                  <span>En espera</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-red-200 rounded"></div>
                  <span>Reservado</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-gray-600 rounded"></div>
                  <span>Cancelado</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-gray-300 rounded"></div>
                  <span>Bloqueado</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Blocked Dates List */}
          <Card>
            <CardHeader>
              <CardTitle>Bloqueos Activos</CardTitle>
              <CardDescription>Lista de fechas bloqueadas</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {(getFilteredBlockedDates() || []).map((block) => (
                  <div key={block.id} className="border rounded-lg p-3">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <p className="font-medium text-sm">
                          {getAccommodationName(block.accommodationId)}
                        </p>
                        <p className="text-xs text-gray-600">
                          {new Date(block.startDate).toLocaleDateString()} -{" "}
                          {new Date(block.endDate).toLocaleDateString()}
                        </p>
                        <Badge
                          className={`text-xs ${getTypeColor(block.type)}`}
                        >
                          {getTypeLabel(block.type)}
                        </Badge>
                        <p className="text-xs text-gray-700">{block.reason}</p>
                        {block.notes && (
                          <p className="text-xs text-gray-500">{block.notes}</p>
                        )}
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDeleteBlock(block.id)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
                {getFilteredBlockedDates().length === 0 && (
                  <div className="text-center py-6 text-gray-500">
                    <CalendarDays className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No hay fechas bloqueadas</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

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
                Información completa de la reserva seleccionada
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
