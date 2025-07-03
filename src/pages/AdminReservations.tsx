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
} from "@/lib/api-service";
import { getCurrentUser } from "@/lib/auth-service";

const AdminReservations = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [accommodations, setAccommodations] = useState<any[]>([]);
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
  });

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    // Auto-open new reservation dialog if URL is /admin/reservations/new
    if (location.pathname === "/admin/reservations/new") {
      setIsNewReservationDialogOpen(true);
    }
  }, [location.pathname]);

  useEffect(() => {
    // Load initial data when component mounts
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      console.log("🔄 Iniciando carga de datos...");

      const [reservationsData, usersData, accommodationsData] =
        await Promise.all([
          apiGetReservations(),
          apiGetUsers(),
          apiGetAccommodations(),
        ]);

      console.log("✅ Datos cargados desde API:", {
        reservations: reservationsData?.length || 0,
        users: usersData?.length || 0,
        accommodations: accommodationsData?.length || 0,
      });

      setReservations(reservationsData);
      setUsers(usersData);
      setAccommodations(accommodationsData);
    } catch (error) {
      console.error("❌ Error loading data:", error);
      // Cargar datos mock si la API no está disponible
      const mockReservations = getMockReservations();
      const mockUsers = getMockUsers();
      const mockAccommodations = getMockAccommodations();

      console.log("📋 Loading mock data:", {
        reservations: mockReservations.length,
        users: mockUsers.length,
        accommodations: mockAccommodations.length,
      });

      setReservations(mockReservations);
      setUsers(mockUsers);
      setAccommodations(mockAccommodations);
    } finally {
      setLoading(false);
    }
  };

  const getMockReservations = (): Reservation[] => [
    {
      id: "res-1",
      userId: "2",
      accommodationId: "1A",
      checkIn: "2024-01-15",
      checkOut: "2024-01-17",
      guests: 2,
      status: "confirmed",
      totalPrice: 460,
      paymentStatus: "paid",
      specialRequests: "Llegada tardía",
      confirmationCode: "ABC123",
      createdAt: "2024-01-10T10:00:00Z",
      updatedAt: "2024-01-10T10:00:00Z",
    },
    {
      id: "res-2",
      userId: "3",
      accommodationId: "suite-1",
      checkIn: "2024-01-20",
      checkOut: "2024-01-22",
      guests: 2,
      status: "pending",
      totalPrice: 640,
      paymentStatus: "pending",
      confirmationCode: "DEF456",
      createdAt: "2024-01-12T15:30:00Z",
      updatedAt: "2024-01-12T15:30:00Z",
    },
    {
      id: "res-3",
      userId: "4",
      accommodationId: "casa-1",
      checkIn: "2024-01-25",
      checkOut: "2024-01-28",
      guests: 4,
      status: "cancelled",
      totalPrice: 1350,
      paymentStatus: "refunded",
      specialRequests: "Cancelación por motivos familiares",
      confirmationCode: "GHI789",
      createdAt: "2024-01-08T09:15:00Z",
      updatedAt: "2024-01-14T11:20:00Z",
    },
  ];

  const getMockUsers = () => [
    {
      id: "1",
      firstName: "Juan",
      lastName: "Pérez",
      email: "juan.perez@email.com",
      role: "user",
      isActive: true,
      fullName: "Juan Pérez",
    },
    {
      id: "2",
      firstName: "María",
      lastName: "González",
      email: "maria.gonzalez@email.com",
      role: "user",
      isActive: true,
      fullName: "María González",
    },
    {
      id: "3",
      firstName: "Carlos",
      lastName: "Rodríguez",
      email: "carlos.rodriguez@email.com",
      role: "user",
      isActive: true,
      fullName: "Carlos Rodríguez",
    },
    {
      id: "4",
      firstName: "Ana",
      lastName: "Martínez",
      email: "ana.martinez@email.com",
      role: "user",
      isActive: true,
      fullName: "Ana Martínez",
    },
    {
      id: "5",
      firstName: "Luis",
      lastName: "García",
      email: "luis.garcia@email.com",
      role: "user",
      isActive: true,
      fullName: "Luis García",
    },
    {
      id: "6",
      firstName: "Carmen",
      lastName: "López",
      email: "carmen.lopez@email.com",
      role: "user",
      isActive: true,
      fullName: "Carmen López",
    },
  ];

  const getMockAccommodations = () => [
    { id: "1A", name: "Apartamento 1A", location: "el-sunzal", capacity: 2 },
    { id: "2A", name: "Apartamento 2A", location: "el-sunzal", capacity: 2 },
    { id: "3A", name: "Apartamento 3A", location: "el-sunzal", capacity: 2 },
    {
      id: "suite-1",
      name: "Suite Premium 1",
      location: "el-sunzal",
      capacity: 2,
    },
    {
      id: "suite-2",
      name: "Suite Premium 2",
      location: "el-sunzal",
      capacity: 2,
    },
    {
      id: "casa-1",
      name: "Casa Familiar 1",
      location: "el-sunzal",
      capacity: 6,
    },
    {
      id: "casa-2",
      name: "Casa Familiar 2",
      location: "el-sunzal",
      capacity: 6,
    },
    // Corinto accommodations
    {
      id: "corinto-apto-1",
      name: "Apartamento Corinto 1",
      location: "corinto",
      capacity: 4,
    },
    {
      id: "corinto-apto-2",
      name: "Apartamento Corinto 2",
      location: "corinto",
      capacity: 4,
    },
    {
      id: "corinto-casa-1",
      name: "Casa Corinto 1",
      location: "corinto",
      capacity: 8,
    },
    {
      id: "corinto-casa-2",
      name: "Casa Corinto 2",
      location: "corinto",
      capacity: 8,
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

  const filteredReservations = (reservations || []).filter((reservation) => {
    const user = users.find((u) => u.id === reservation.userId);
    const accommodation = accommodations.find(
      (a) => a.id === reservation.accommodationId,
    );

    const matchesSearch =
      reservation.confirmationCode
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      user?.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user?.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      accommodation?.name.toLowerCase().includes(searchTerm.toLowerCase());

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
    const user = users.find((u) => u.id === userId);
    return user
      ? user.fullName || `${user.firstName} ${user.lastName}`
      : "Usuario no encontrado";
  };

  const getAccommodationName = (accommodationId: string) => {
    const accommodation = accommodations.find((a) => a.id === accommodationId);
    return accommodation ? accommodation.name : "Alojamiento no encontrado";
  };

  const getAccommodationLocation = (accommodationId: string) => {
    const accommodation = accommodations.find((a) => a.id === accommodationId);
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
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Nueva Reserva</DialogTitle>
              <DialogDescription>
                Crea una nueva reserva en nombre de un usuario
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
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
                      <SelectItem value="" disabled>
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
                    {(accommodations || []).map((accommodation) => (
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
              <div>
                <Label htmlFor="special-requests">Solicitudes Especiales</Label>
                <Textarea
                  id="special-requests"
                  rows={3}
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
