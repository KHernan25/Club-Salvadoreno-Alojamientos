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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import {
  Calendar,
  Search,
  Plus,
  Edit,
  Trash2,
  Eye,
  Users,
  DollarSign,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  MapPin,
  Filter,
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import AdminLayout from "@/components/AdminLayout";
import {
  apiGetReservations,
  apiCreateReservation,
  apiUpdateReservation,
  apiCancelReservation,
  apiGetUsers,
  apiGetAccommodations,
  getAuthToken,
  Reservation,
  Accommodation,
} from "@/lib/api-service";
import { getCurrentUser } from "@/lib/auth-service";

const AdminReservations = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [accommodations, setAccommodations] = useState<Accommodation[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [locationFilter, setLocationFilter] = useState("all");
  const [selectedReservation, setSelectedReservation] =
    useState<Reservation | null>(null);
  const [isNewReservationDialogOpen, setIsNewReservationDialogOpen] =
    useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [newReservationForm, setNewReservationForm] = useState({
    userId: "",
    accommodationId: "",
    checkIn: "",
    checkOut: "",
    guests: 1,
    specialRequests: "",
    paymentMethod: "",
    paymentHandledBy: "guest", // guest, staff
    paymentDeadline: "",
  });

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    // Auto-open new reservation dialog if URL is /admin/reservations/new
    if (location.pathname === "/admin/reservations/new") {
      setIsNewReservationDialogOpen(true);
    }

    // Handle viewing specific reservation from URL hash
    if (location.hash) {
      const reservationId = location.hash.substring(1);
      const reservation = reservations.find((r) => r.id === reservationId);
      if (reservation) {
        setSelectedReservation(reservation);
        setIsEditDialogOpen(true);
      }
    }
  }, [location.pathname, location.hash, reservations]);

  useEffect(() => {
    // Load initial data when component mounts
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      console.log("🔄 Iniciando carga de datos...");

      // Verificar autenticación antes de hacer llamadas a la API
      const currentUser = getCurrentUser();
      const token = getAuthToken();
      console.log("🔐 Estado de autenticación:", {
        user: currentUser?.firstName || "No autenticado",
        hasToken: !!token,
        token: token ? `${token.substring(0, 10)}...` : "No token",
      });

      const [reservationsData, usersData, accommodationsData] =
        await Promise.all([
          apiGetReservations(true), // Pass true for admin to get all reservations
          apiGetUsers(),
          apiGetAccommodations(),
        ]);

      console.log("✅ Datos cargados desde API:", {
        reservations: reservationsData?.length || 0,
        users: usersData?.length || 0,
        accommodations: accommodationsData?.length || 0,
      });

      setReservations(Array.isArray(reservationsData) ? reservationsData : []);
      setUsers(Array.isArray(usersData) ? usersData : []);
      setAccommodations(
        Array.isArray(accommodationsData) ? accommodationsData : [],
      );
    } catch (error) {
      console.error("❌ Error loading data:", error);
      console.log("📋 Loading fallback mock data...");
      // Use fallback mock data - api-service already handles mock data when API fails
      setReservations([]);
      setUsers(getMockUsers());
      setAccommodations(getMockAccommodations());
    } finally {
      setLoading(false);
    }
  };

  const getMockUsers = () => [
    {
      id: "7",
      firstName: "Carlos",
      lastName: "Rivera",
      email: "carlos.rivera@email.com",
      role: "miembro",
      isActive: true,
      fullName: "Carlos Rivera",
    },
    {
      id: "8",
      firstName: "Ana",
      lastName: "Martínez",
      email: "ana.martinez@email.com",
      role: "miembro",
      isActive: true,
      fullName: "Ana Martínez",
    },
    {
      id: "9",
      firstName: "Juan",
      lastName: "Pérez",
      email: "juan.perez@email.com",
      role: "miembro",
      isActive: false,
      fullName: "Juan Pérez",
    },
    {
      id: "10",
      firstName: "Demo",
      lastName: "Usuario",
      email: "demo@clubsalvadoreno.com",
      role: "miembro",
      isActive: true,
      fullName: "Usuario de Demostración",
    },
  ];

  const getMockAccommodations = (): Accommodation[] => [
    {
      id: "1A",
      name: "Apartamento 1A",
      type: "apartamento",
      location: "el-sunzal",
      capacity: 2,
      price: 230,
      status: "available",
      description: "Cómodo apartamento con vista al mar",
      amenities: ["Wi-Fi", "Aire acondicionado", "TV"],
      pricing: { weekday: 110, weekend: 230, holiday: 280 },
    },
    {
      id: "2A",
      name: "Apartamento 2A",
      type: "apartamento",
      location: "el-sunzal",
      capacity: 2,
      price: 250,
      status: "available",
      description: "Apartamento familiar con vista al mar",
      amenities: ["Wi-Fi", "Aire acondicionado", "TV"],
      pricing: { weekday: 120, weekend: 250, holiday: 300 },
    },
    {
      id: "3A",
      name: "Apartamento 3A",
      type: "apartamento",
      location: "el-sunzal",
      capacity: 2,
      price: 350,
      status: "available",
      description: "Penthouse de lujo",
      amenities: ["Wi-Fi", "Aire acondicionado", "TV", "Jacuzzi"],
      pricing: { weekday: 180, weekend: 350, holiday: 450 },
    },
    {
      id: "suite1",
      name: "Suite 1",
      type: "suite",
      location: "el-sunzal",
      capacity: 2,
      price: 320,
      status: "available",
      description: "Suite de lujo con servicios premium",
      amenities: ["Wi-Fi", "Aire acondicionado", "TV Premium", "Minibar"],
      pricing: { weekday: 180, weekend: 320, holiday: 420 },
    },
    {
      id: "suite2",
      name: "Suite 2",
      type: "suite",
      location: "el-sunzal",
      capacity: 2,
      price: 335,
      status: "available",
      description: "Suite de lujo con servicios premium",
      amenities: ["Wi-Fi", "Aire acondicionado", "TV Premium", "Minibar"],
      pricing: { weekday: 190, weekend: 335, holiday: 435 },
    },
    {
      id: "casa1",
      name: "Casa Surf Paradise",
      type: "casa",
      location: "el-sunzal",
      capacity: 6,
      price: 450,
      status: "available",
      description: "Casa amplia para familias",
      amenities: ["Wi-Fi", "Aire acondicionado", "Cocina completa", "Terraza"],
      pricing: { weekday: 250, weekend: 450, holiday: 550 },
    },
    {
      id: "casa2",
      name: "Casa Familiar Deluxe",
      type: "casa",
      location: "el-sunzal",
      capacity: 6,
      price: 500,
      status: "available",
      description: "Casa con vista panorámica",
      amenities: ["Wi-Fi", "Aire acondicionado", "Cocina completa", "Jacuzzi"],
      pricing: { weekday: 280, weekend: 500, holiday: 600 },
    },
    // Corinto accommodations
    {
      id: "corinto1A",
      name: "Apartamento Corinto 1A",
      type: "apartamento",
      location: "corinto",
      capacity: 2,
      price: 180,
      status: "available",
      description: "Apartamento con vista al lago",
      amenities: ["Wi-Fi", "Aire acondicionado", "TV"],
      pricing: { weekday: 85, weekend: 180, holiday: 220 },
    },
    {
      id: "corinto2A",
      name: "Apartamento Corinto 2A",
      type: "apartamento",
      location: "corinto",
      capacity: 4,
      price: 200,
      status: "available",
      description: "Apartamento familiar en Corinto",
      amenities: ["Wi-Fi", "Aire acondicionado", "TV", "Balcón"],
      pricing: { weekday: 95, weekend: 200, holiday: 250 },
    },
    {
      id: "corinto-casa-1",
      name: "Casa del Lago",
      type: "casa",
      location: "corinto",
      capacity: 6,
      price: 280,
      status: "available",
      description: "Casa con vista directa al lago",
      amenities: ["Wi-Fi", "Aire acondicionado", "Cocina equipada", "Jardín"],
      pricing: { weekday: 140, weekend: 280, holiday: 350 },
    },
    {
      id: "corinto-casa-2",
      name: "Casa Ejecutiva Premium",
      type: "casa",
      location: "corinto",
      capacity: 8,
      price: 305,
      status: "available",
      description: "Casa estilo corporativo",
      amenities: ["Wi-Fi", "Aire acondicionado", "Cocina equipada", "Terraza"],
      pricing: { weekday: 155, weekend: 305, holiday: 380 },
    },
  ];

  const handleCreateReservation = async () => {
    try {
      await apiCreateReservation(newReservationForm);
      toast({
        title: "Reserva creada",
        description: "La reserva ha sido creada exitosamente.",
      });
      setIsNewReservationDialogOpen(false);
      setNewReservationForm({
        userId: "",
        accommodationId: "",
        checkIn: "",
        checkOut: "",
        guests: 1,
        specialRequests: "",
        paymentMethod: "",
        paymentHandledBy: "guest",
        paymentDeadline: "",
      });
      // Navigate back to main reservations page if came from /new route
      if (location.pathname === "/admin/reservations/new") {
        navigate("/admin/reservations");
      }
      loadData();
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo crear la reserva.",
        variant: "destructive",
      });
    }
  };

  const handleUpdateReservation = async (
    reservationId: string,
    updates: Partial<Reservation>,
  ) => {
    try {
      await apiUpdateReservation(reservationId, updates);
      toast({
        title: "Reserva actualizada",
        description: "Los cambios han sido guardados exitosamente.",
      });
      setIsEditDialogOpen(false);
      setSelectedReservation(null);
      loadData();
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo actualizar la reserva.",
        variant: "destructive",
      });
    }
  };

  const handleCancelReservation = async (reservationId: string) => {
    try {
      await apiCancelReservation(reservationId);
      toast({
        title: "Reserva cancelada",
        description: "La reserva ha sido cancelada exitosamente.",
      });
      loadData();
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo cancelar la reserva.",
        variant: "destructive",
      });
    }
  };

  const filteredReservations = (
    Array.isArray(reservations) ? reservations : []
  ).filter((reservation) => {
    const user = (users || []).find((u) => u.id === reservation.userId);
    const accommodationsList = Array.isArray(accommodations)
      ? accommodations
      : [];
    const accommodation = accommodationsList.find(
      (a) => a.id === reservation.accommodationId,
    );

    const matchesSearch =
      (reservation.confirmationCode || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      (user?.firstName || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      (user?.lastName || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (accommodation?.name || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || reservation.status === statusFilter;

    const matchesLocation =
      locationFilter === "all" || accommodation?.location === locationFilter;

    return matchesSearch && matchesStatus && matchesLocation;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "confirmed":
        return <Badge variant="default">Confirmada</Badge>;
      case "pending":
        return <Badge variant="outline">Pendiente</Badge>;
      case "cancelled":
        return <Badge variant="destructive">Cancelada</Badge>;
      case "completed":
        return <Badge variant="secondary">Completada</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getPaymentStatusBadge = (status: string) => {
    switch (status) {
      case "paid":
        return (
          <Badge variant="default" className="bg-green-500">
            Pagado
          </Badge>
        );
      case "pending":
        return <Badge variant="outline">Pendiente</Badge>;
      case "refunded":
        return <Badge variant="secondary">Reembolsado</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getUserName = (userId: string) => {
    const user = (users || []).find((u) => u.id === userId);
    return user
      ? user.fullName || `${user.firstName} ${user.lastName}`
      : "Usuario no encontrado";
  };

  const getAccommodationName = (accommodationId: string) => {
    const accommodation = (accommodations || []).find(
      (a) => a.id === accommodationId,
    );
    return accommodation ? accommodation.name : "Alojamiento no encontrado";
  };

  const getAccommodationLocation = (accommodationId: string) => {
    const accommodation = (accommodations || []).find(
      (a) => a.id === accommodationId,
    );
    return accommodation?.location === "el-sunzal" ? "El Sunzal" : "Corinto";
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Gestión de Reservas</h1>
            <p className="text-gray-600">
              Crea, modifica y administra las reservas del sistema
            </p>
            {/* Debug info */}
            <div className="text-xs text-gray-500 mt-1">
              👤 {getCurrentUser()?.firstName || "No autenticado"} | 🔑{" "}
              {getAuthToken() ? "Token OK" : "Sin token"} | 👥 {users.length}{" "}
              usuarios cargados
            </div>
          </div>
          <Button onClick={() => setIsNewReservationDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Nueva Reserva
          </Button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                Total Reservas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {reservations?.length || 0}
              </div>
              <p className="text-xs text-muted-foreground">
                Todas las reservas
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Confirmadas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {
                  (reservations || []).filter((r) => r.status === "confirmed")
                    .length
                }
              </div>
              <p className="text-xs text-muted-foreground">Reservas activas</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Pendientes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">
                {
                  (reservations || []).filter((r) => r.status === "pending")
                    .length
                }
              </div>
              <p className="text-xs text-muted-foreground">
                Requieren atención
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Ingresos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-emerald-600">
                $
                {(reservations || [])
                  .filter((r) => r.paymentStatus === "paid")
                  .reduce((sum, r) => sum + r.totalPrice, 0)
                  .toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">Pagos confirmados</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Filtros y Búsqueda</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <Label htmlFor="search">Buscar reservas</Label>
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="search"
                    placeholder="Buscar por código, huésped o alojamiento..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="location-filter">Ubicación</Label>
                <Select
                  value={locationFilter}
                  onValueChange={setLocationFilter}
                >
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Todas las ubicaciones" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas las ubicaciones</SelectItem>
                    <SelectItem value="el-sunzal">
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-4 w-4 text-blue-600" />
                        <span>El Sunzal</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="corinto">
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-4 w-4 text-blue-600" />
                        <span>Corinto</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="status-filter">Estado</Label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Todos los estados" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos los estados</SelectItem>
                    <SelectItem value="pending">Pendiente</SelectItem>
                    <SelectItem value="confirmed">Confirmada</SelectItem>
                    <SelectItem value="cancelled">Cancelada</SelectItem>
                    <SelectItem value="completed">Completada</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Reservations Table */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              Lista de Reservas ({filteredReservations.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">Cargando reservas...</div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Código/Huésped</TableHead>
                    <TableHead>Alojamiento</TableHead>
                    <TableHead>Fechas</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Pago</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {(filteredReservations || []).map((reservation) => (
                    <TableRow key={reservation.id}>
                      <TableCell>
                        <div className="space-y-1">
                          <p className="font-mono text-sm font-medium">
                            {reservation.confirmationCode}
                          </p>
                          <p className="text-sm text-gray-600">
                            {getUserName(reservation.userId)}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <p className="font-medium">
                            {getAccommodationName(reservation.accommodationId)}
                          </p>
                          <div className="flex items-center space-x-3 text-sm text-gray-500">
                            <div className="flex items-center space-x-1">
                              <MapPin className="h-3 w-3 text-blue-600" />
                              <span>
                                {getAccommodationLocation(
                                  reservation.accommodationId,
                                )}
                              </span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Users className="h-3 w-3" />
                              <span>{reservation.guests} huésped(es)</span>
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1 text-sm">
                          <p>
                            {new Date(reservation.checkIn).toLocaleDateString()}
                          </p>
                          <p className="text-gray-500">
                            {new Date(
                              reservation.checkOut,
                            ).toLocaleDateString()}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(reservation.status)}
                      </TableCell>
                      <TableCell>
                        {getPaymentStatusBadge(reservation.paymentStatus)}
                      </TableCell>
                      <TableCell>
                        <p className="font-medium">
                          ${reservation.totalPrice.toLocaleString()}
                        </p>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setSelectedReservation(reservation);
                              setIsEditDialogOpen(true);
                            }}
                          >
                            <Edit className="h-3 w-3 mr-1" />
                            Editar
                          </Button>
                          {reservation.status !== "cancelled" && (
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button size="sm" variant="destructive">
                                  <Trash2 className="h-3 w-3 mr-1" />
                                  Cancelar
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>
                                    Cancelar Reserva
                                  </AlertDialogTitle>
                                  <AlertDialogDescription>
                                    ¿Estás seguro de que deseas cancelar la
                                    reserva {reservation.confirmationCode}? Esta
                                    acci��n no se puede deshacer.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>
                                    Cancelar
                                  </AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() =>
                                      handleCancelReservation(reservation.id)
                                    }
                                  >
                                    Confirmar Cancelación
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* New Reservation Dialog */}
        <Dialog
          open={isNewReservationDialogOpen}
          onOpenChange={setIsNewReservationDialogOpen}
        >
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Nueva Reserva</DialogTitle>
              <DialogDescription>
                Crea una nueva reserva en nombre de un usuario y configura las
                opciones de pago
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-6">
              {/* Guest Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Información del Huésped</h3>
                <div>
                  <Label htmlFor="user-select">Usuario</Label>
                  <Select
                    value={newReservationForm.userId}
                    onValueChange={(value) =>
                      setNewReservationForm({
                        ...newReservationForm,
                        userId: value,
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue
                        placeholder={
                          users.length === 0
                            ? "No hay usuarios disponibles..."
                            : "Seleccionar usuario"
                        }
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {users.length === 0 ? (
                        <SelectItem value="no-users-available" disabled>
                          No hay usuarios disponibles
                        </SelectItem>
                      ) : (
                        users.map((user) => (
                          <SelectItem key={user.id} value={user.id}>
                            {user.firstName} {user.lastName} - {user.email}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                  {users.length === 0 && (
                    <p className="text-sm text-orange-600 mt-1">
                      ⚠️ No se encontraron usuarios. Verifica la conexión con el
                      servidor.
                    </p>
                  )}
                </div>
              </div>

              {/* Accommodation Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">
                  Detalles del Alojamiento
                </h3>
                <div>
                  <Label htmlFor="accommodation-select">Alojamiento</Label>
                  <Select
                    value={newReservationForm.accommodationId}
                    onValueChange={(value) =>
                      setNewReservationForm({
                        ...newReservationForm,
                        accommodationId: value,
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar alojamiento" />
                    </SelectTrigger>
                    <SelectContent>
                      {(Array.isArray(accommodations)
                        ? accommodations
                        : []
                      ).map((accommodation) => (
                        <SelectItem
                          key={accommodation.id}
                          value={accommodation.id}
                        >
                          <div className="flex items-center space-x-2">
                            <MapPin className="h-3 w-3 text-blue-600" />
                            <span>
                              {accommodation.name} -{" "}
                              {accommodation.location === "el-sunzal"
                                ? "El Sunzal"
                                : "Corinto"}
                              (Cap: {accommodation.capacity})
                            </span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="check-in">Fecha de Entrada</Label>
                    <Input
                      id="check-in"
                      type="date"
                      value={newReservationForm.checkIn}
                      onChange={(e) =>
                        setNewReservationForm({
                          ...newReservationForm,
                          checkIn: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="check-out">Fecha de Salida</Label>
                    <Input
                      id="check-out"
                      type="date"
                      value={newReservationForm.checkOut}
                      onChange={(e) =>
                        setNewReservationForm({
                          ...newReservationForm,
                          checkOut: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="guests">Número de Huéspedes</Label>
                  <Input
                    id="guests"
                    type="number"
                    min="1"
                    max="10"
                    value={newReservationForm.guests}
                    onChange={(e) =>
                      setNewReservationForm({
                        ...newReservationForm,
                        guests: parseInt(e.target.value),
                      })
                    }
                  />
                </div>
              </div>

              {/* Payment Options */}
              <div className="space-y-4 border-t pt-4">
                <h3 className="text-lg font-medium">Opciones de Pago</h3>
                <div>
                  <Label htmlFor="payment-handled-by">
                    ¿Quién maneja el pago?
                  </Label>
                  <Select
                    value={newReservationForm.paymentHandledBy}
                    onValueChange={(value) =>
                      setNewReservationForm({
                        ...newReservationForm,
                        paymentHandledBy: value,
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="guest">
                        El huésped pagará directamente
                      </SelectItem>
                      <SelectItem value="staff">
                        El personal procesará el pago
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {newReservationForm.paymentHandledBy === "staff" && (
                  <div className="space-y-4 bg-blue-50 p-4 rounded-lg">
                    <div>
                      <Label htmlFor="payment-method">Método de Pago</Label>
                      <Select
                        value={newReservationForm.paymentMethod}
                        onValueChange={(value) =>
                          setNewReservationForm({
                            ...newReservationForm,
                            paymentMethod: value,
                          })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar método de pago" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="credit_card">
                            Tarjeta de Crédito
                          </SelectItem>
                          <SelectItem value="debit_card">
                            Tarjeta de Débito
                          </SelectItem>
                          <SelectItem value="payment_link">
                            Link de Pago
                          </SelectItem>
                          <SelectItem value="bank_transfer">
                            Transferencia Bancaria
                          </SelectItem>
                          <SelectItem value="pay_later">
                            Pagar en 72 horas
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {newReservationForm.paymentMethod === "pay_later" && (
                      <div>
                        <Label htmlFor="payment-deadline">
                          Fecha límite de pago
                        </Label>
                        <Input
                          id="payment-deadline"
                          type="date"
                          value={newReservationForm.paymentDeadline}
                          onChange={(e) =>
                            setNewReservationForm({
                              ...newReservationForm,
                              paymentDeadline: e.target.value,
                            })
                          }
                          min={
                            new Date(Date.now() + 24 * 60 * 60 * 1000)
                              .toISOString()
                              .split("T")[0]
                          }
                          max={
                            new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)
                              .toISOString()
                              .split("T")[0]
                          }
                        />
                        <p className="text-sm text-gray-600 mt-1">
                          Máximo 72 horas a partir de hoy
                        </p>
                      </div>
                    )}

                    <div className="bg-yellow-50 border border-yellow-200 rounded p-3">
                      <p className="text-sm text-yellow-800">
                        <strong>Nota:</strong> El personal se encargará de
                        procesar el pago con el método seleccionado.
                        {newReservationForm.paymentMethod === "pay_later" &&
                          " El huésped tiene hasta 72 horas para completar el pago."}
                      </p>
                    </div>
                  </div>
                )}

                {newReservationForm.paymentHandledBy === "guest" && (
                  <div className="bg-green-50 border border-green-200 rounded p-3">
                    <p className="text-sm text-green-800">
                      <strong>Nota:</strong> Se enviará al huésped un link de
                      pago para que complete la transacción directamente.
                    </p>
                  </div>
                )}
              </div>

              {/* Special Requests */}
              <div className="space-y-4">
                <div>
                  <Label htmlFor="special-requests">
                    Solicitudes Especiales
                  </Label>
                  <Textarea
                    id="special-requests"
                    rows={3}
                    placeholder="Solicitudes especiales del huésped..."
                    value={newReservationForm.specialRequests}
                    onChange={(e) =>
                      setNewReservationForm({
                        ...newReservationForm,
                        specialRequests: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setIsNewReservationDialogOpen(false);
                  // Navigate back if came from /new route
                  if (location.pathname === "/admin/reservations/new") {
                    navigate("/admin/reservations");
                  }
                }}
              >
                Cancelar
              </Button>
              <Button onClick={handleCreateReservation}>Crear Reserva</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Reservation Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Editar Reserva</DialogTitle>
              <DialogDescription>
                Modifica los detalles de la reserva
              </DialogDescription>
            </DialogHeader>
            {selectedReservation && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="edit-status">Estado</Label>
                  <Select defaultValue={selectedReservation.status}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pendiente</SelectItem>
                      <SelectItem value="confirmed">Confirmada</SelectItem>
                      <SelectItem value="cancelled">Cancelada</SelectItem>
                      <SelectItem value="completed">Completada</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="edit-payment-status">Estado de Pago</Label>
                  <Select defaultValue={selectedReservation.paymentStatus}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pendiente</SelectItem>
                      <SelectItem value="paid">Pagado</SelectItem>
                      <SelectItem value="refunded">Reembolsado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="edit-special-requests">
                    Solicitudes Especiales
                  </Label>
                  <Textarea
                    id="edit-special-requests"
                    rows={3}
                    defaultValue={selectedReservation.specialRequests}
                  />
                </div>
              </div>
            )}
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsEditDialogOpen(false)}
              >
                Cancelar
              </Button>
              <Button
                onClick={() =>
                  handleUpdateReservation(selectedReservation!.id, {})
                }
              >
                Guardar Cambios
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default AdminReservations;
