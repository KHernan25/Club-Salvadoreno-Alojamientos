import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
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
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Calendar,
  Search,
  Filter,
  User,
  MapPin,
  Users,
  DollarSign,
  Eye,
  Clock,
  CheckCircle,
  AlertTriangle,
  Phone,
  Mail,
  Home,
  RefreshCw,
} from "lucide-react";
import { reservationService, Reservation } from "@/lib/reservation-service";
import { toast } from "@/hooks/use-toast";

const ReservationManager = () => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [filteredReservations, setFilteredReservations] = useState<
    Reservation[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [locationFilter, setLocationFilter] = useState("all");
  const [selectedReservation, setSelectedReservation] =
    useState<Reservation | null>(null);
  const [showDetailDialog, setShowDetailDialog] = useState(false);

  useEffect(() => {
    loadReservations();
  }, []);

  useEffect(() => {
    filterReservations();
  }, [reservations, searchTerm, statusFilter, locationFilter]);

  const loadReservations = () => {
    try {
      setLoading(true);
      const allReservations = reservationService.getAllReservations();
      setReservations(allReservations);
      console.log("✅ Reservations loaded:", allReservations.length);
    } catch (error) {
      console.error("Error loading reservations:", error);
      toast({
        title: "Error",
        description: "Error al cargar las reservas",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filterReservations = () => {
    let filtered = [...reservations];

    // Filtro por término de búsqueda
    if (searchTerm.trim()) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (reservation) =>
          reservation.guestName.toLowerCase().includes(search) ||
          reservation.reservationCode.toLowerCase().includes(search) ||
          reservation.guestEmail.toLowerCase().includes(search) ||
          reservation.accommodationName.toLowerCase().includes(search),
      );
    }

    // Filtro por estado
    if (statusFilter !== "all") {
      filtered = filtered.filter(
        (reservation) => reservation.status === statusFilter,
      );
    }

    // Filtro por ubicación
    if (locationFilter !== "all") {
      filtered = filtered.filter(
        (reservation) => reservation.location === locationFilter,
      );
    }

    // Ordenar por fecha de check-in (más próximas primero)
    filtered.sort((a, b) => a.checkInDate.getTime() - b.checkInDate.getTime());

    setFilteredReservations(filtered);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "confirmed":
        return (
          <Badge variant="outline" className="text-blue-600 border-blue-600">
            <Calendar className="w-3 h-3 mr-1" />
            Confirmada
          </Badge>
        );
      case "checked_in":
        return (
          <Badge variant="outline" className="text-green-600 border-green-600">
            <CheckCircle className="w-3 h-3 mr-1" />
            Check-in
          </Badge>
        );
      case "checked_out":
        return (
          <Badge variant="outline" className="text-gray-600 border-gray-600">
            <Clock className="w-3 h-3 mr-1" />
            Completada
          </Badge>
        );
      case "cancelled":
        return (
          <Badge variant="outline" className="text-red-600 border-red-600">
            <AlertTriangle className="w-3 h-3 mr-1" />
            Cancelada
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getLocationBadge = (location: string) => {
    switch (location) {
      case "El Sunzal":
        return "bg-blue-100 text-blue-800";
      case "Corinto":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getUrgencyLevel = (reservation: Reservation) => {
    const today = new Date();
    const checkInDate = new Date(reservation.checkInDate);
    const checkOutDate = new Date(reservation.checkOutDate);
    const diffDays = Math.ceil(
      (checkInDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
    );

    if (reservation.status === "confirmed") {
      if (diffDays === 0)
        return {
          level: "high",
          message: "Check-in HOY",
          color: "text-red-600",
        };
      if (diffDays === 1)
        return {
          level: "medium",
          message: "Check-in Mañana",
          color: "text-orange-600",
        };
      if (diffDays <= 3)
        return {
          level: "low",
          message: `Check-in en ${diffDays} días`,
          color: "text-yellow-600",
        };
    }

    if (reservation.status === "checked_in") {
      const checkOutDiff = Math.ceil(
        (checkOutDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
      );
      if (checkOutDiff === 0)
        return {
          level: "high",
          message: "Check-out HOY",
          color: "text-red-600",
        };
      if (checkOutDiff === 1)
        return {
          level: "medium",
          message: "Check-out Mañana",
          color: "text-orange-600",
        };
    }

    return null;
  };

  const handleViewDetails = (reservation: Reservation) => {
    setSelectedReservation(reservation);
    setShowDetailDialog(true);
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando reservas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header y Filtros */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="h-5 w-5 text-blue-600" />
                <span>Gestión de Reservas</span>
              </CardTitle>
              <CardDescription>
                Administra y supervisa todas las reservas activas
              </CardDescription>
            </div>
            <Button onClick={loadReservations} variant="outline" size="sm">
              <RefreshCw className="w-4 h-4 mr-2" />
              Actualizar
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Filtros */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="search">Buscar</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input
                  id="search"
                  placeholder="Nombre, código, email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="status-filter">Estado</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos los estados" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los estados</SelectItem>
                  <SelectItem value="confirmed">Confirmadas</SelectItem>
                  <SelectItem value="checked_in">Con Check-in</SelectItem>
                  <SelectItem value="checked_out">Completadas</SelectItem>
                  <SelectItem value="cancelled">Canceladas</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="location-filter">Ubicación</Label>
              <Select value={locationFilter} onValueChange={setLocationFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Todas las ubicaciones" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas las ubicaciones</SelectItem>
                  <SelectItem value="El Sunzal">El Sunzal</SelectItem>
                  <SelectItem value="Corinto">Corinto</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end">
              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm("");
                  setStatusFilter("all");
                  setLocationFilter("all");
                }}
                className="w-full"
              >
                <Filter className="w-4 h-4 mr-2" />
                Limpiar
              </Button>
            </div>
          </div>

          {/* Resumen */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">
                {reservations.filter((r) => r.status === "confirmed").length}
              </p>
              <p className="text-sm text-gray-600">Confirmadas</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">
                {reservations.filter((r) => r.status === "checked_in").length}
              </p>
              <p className="text-sm text-gray-600">Activas</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-600">
                {reservations.filter((r) => r.status === "checked_out").length}
              </p>
              <p className="text-sm text-gray-600">Completadas</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-600">
                {filteredReservations.length}
              </p>
              <p className="text-sm text-gray-600">Mostrando</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Reservas */}
      <Card>
        <CardHeader>
          <CardTitle>Reservas ({filteredReservations.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredReservations.length === 0 ? (
            <div className="text-center py-8">
              <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No se encontraron reservas
              </h3>
              <p className="text-gray-600">
                Ajusta los filtros o términos de búsqueda
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Código</TableHead>
                    <TableHead>Huésped</TableHead>
                    <TableHead>Alojamiento</TableHead>
                    <TableHead>Fechas</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Urgencia</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredReservations.map((reservation) => {
                    const urgency = getUrgencyLevel(reservation);
                    return (
                      <TableRow key={reservation.id}>
                        <TableCell className="font-medium">
                          {reservation.reservationCode}
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">
                              {reservation.guestName}
                            </div>
                            <div className="text-sm text-gray-600 flex items-center">
                              <Users className="w-3 h-3 mr-1" />
                              {reservation.numberOfGuests} huéspedes
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">
                              {reservation.accommodationName}
                            </div>
                            <Badge
                              className={getLocationBadge(reservation.location)}
                            >
                              <MapPin className="w-3 h-3 mr-1" />
                              {reservation.location}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <div className="flex items-center">
                              <span>
                                Check-in:{" "}
                                {reservation.checkInDate.toLocaleDateString()}
                              </span>
                              {isToday(reservation.checkInDate) && (
                                <Badge
                                  variant="outline"
                                  className="ml-2 text-green-600 border-green-600"
                                >
                                  HOY
                                </Badge>
                              )}
                            </div>
                            <div className="flex items-center text-gray-600">
                              <span>
                                Check-out:{" "}
                                {reservation.checkOutDate.toLocaleDateString()}
                              </span>
                              {isToday(reservation.checkOutDate) && (
                                <Badge
                                  variant="outline"
                                  className="ml-2 text-orange-600 border-orange-600"
                                >
                                  HOY
                                </Badge>
                              )}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          {getStatusBadge(reservation.status)}
                        </TableCell>
                        <TableCell>
                          {urgency && (
                            <p
                              className={`text-sm font-medium ${urgency.color}`}
                            >
                              {urgency.message}
                            </p>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewDetails(reservation)}
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            Ver
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialog de Detalles */}
      <Dialog open={showDetailDialog} onOpenChange={setShowDetailDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Detalles de Reserva</DialogTitle>
            <DialogDescription>
              Información completa de la reserva{" "}
              {selectedReservation?.reservationCode}
            </DialogDescription>
          </DialogHeader>

          {selectedReservation && (
            <div className="space-y-6">
              {/* Información del Huésped */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <User className="w-5 h-5 mr-2" />
                    Información del Huésped
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Nombre completo</Label>
                      <p className="font-medium">
                        {selectedReservation.guestName}
                      </p>
                    </div>
                    <div>
                      <Label>Número de huéspedes</Label>
                      <p className="font-medium">
                        {selectedReservation.numberOfGuests}
                      </p>
                    </div>
                    <div>
                      <Label>Email</Label>
                      <p className="flex items-center text-blue-600">
                        <Mail className="w-4 h-4 mr-1" />
                        {selectedReservation.guestEmail}
                      </p>
                    </div>
                    <div>
                      <Label>Teléfono</Label>
                      <p className="flex items-center text-blue-600">
                        <Phone className="w-4 h-4 mr-1" />
                        {selectedReservation.guestPhone}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Información del Alojamiento */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <Home className="w-5 h-5 mr-2" />
                    Alojamiento
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Tipo</Label>
                      <p className="font-medium">
                        {selectedReservation.accommodationType}
                      </p>
                    </div>
                    <div>
                      <Label>Nombre</Label>
                      <p className="font-medium">
                        {selectedReservation.accommodationName}
                      </p>
                    </div>
                    <div>
                      <Label>Ubicación</Label>
                      <Badge
                        className={getLocationBadge(
                          selectedReservation.location,
                        )}
                      >
                        <MapPin className="w-3 h-3 mr-1" />
                        {selectedReservation.location}
                      </Badge>
                    </div>
                    <div>
                      <Label>Total a pagar</Label>
                      <p className="font-medium text-green-600 flex items-center">
                        <DollarSign className="w-4 h-4 mr-1" />$
                        {selectedReservation.totalAmount.toFixed(2)}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Fechas y Estado */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <Calendar className="w-5 h-5 mr-2" />
                    Fechas y Estado
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Check-in</Label>
                      <p className="font-medium">
                        {selectedReservation.checkInDate.toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <Label>Check-out</Label>
                      <p className="font-medium">
                        {selectedReservation.checkOutDate.toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <Label>Estado actual</Label>
                      {getStatusBadge(selectedReservation.status)}
                    </div>
                    <div>
                      <Label>Creada el</Label>
                      <p className="font-medium">
                        {selectedReservation.createdAt.toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Solicitudes Especiales */}
              {selectedReservation.specialRequests && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">
                      Solicitudes Especiales
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700">
                      {selectedReservation.specialRequests}
                    </p>
                  </CardContent>
                </Card>
              )}

              {/* Detalles de Check-in */}
              {selectedReservation.checkInDetails && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg text-green-600">
                      Detalles de Check-in
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <p>
                      <strong>Procesado por:</strong>{" "}
                      {selectedReservation.checkInDetails.checkedInBy}
                    </p>
                    <p>
                      <strong>Hora de llegada:</strong>{" "}
                      {selectedReservation.checkInDetails.actualArrivalTime.toLocaleString()}
                    </p>
                    <p>
                      <strong>Huéspedes presentes:</strong>{" "}
                      {selectedReservation.checkInDetails.guestsPresent}
                    </p>
                    <p>
                      <strong>Documentos verificados:</strong>{" "}
                      {selectedReservation.checkInDetails.documentsVerified
                        ? "Sí"
                        : "No"}
                    </p>
                    <p>
                      <strong>Llaves entregadas:</strong>{" "}
                      {selectedReservation.checkInDetails.keyProvided
                        ? "Sí"
                        : "No"}
                    </p>
                    {selectedReservation.checkInDetails.notes && (
                      <p>
                        <strong>Notas:</strong>{" "}
                        {selectedReservation.checkInDetails.notes}
                      </p>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Detalles de Check-out */}
              {selectedReservation.checkOutDetails && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg text-orange-600">
                      Detalles de Check-out
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <p>
                      <strong>Procesado por:</strong>{" "}
                      {selectedReservation.checkOutDetails.checkedOutBy}
                    </p>
                    <p>
                      <strong>Hora de salida:</strong>{" "}
                      {selectedReservation.checkOutDetails.actualDepartureTime.toLocaleString()}
                    </p>
                    <p>
                      <strong>Condición del alojamiento:</strong>{" "}
                      {selectedReservation.checkOutDetails.roomCondition}
                    </p>
                    <p>
                      <strong>Daños reportados:</strong>{" "}
                      {selectedReservation.checkOutDetails.damagesReported
                        ? "Sí"
                        : "No"}
                    </p>
                    <p>
                      <strong>Llaves devueltas:</strong>{" "}
                      {selectedReservation.checkOutDetails.keyReturned
                        ? "Sí"
                        : "No"}
                    </p>
                    {selectedReservation.checkOutDetails.additionalCharges && (
                      <p>
                        <strong>Cargos adicionales:</strong> $
                        {selectedReservation.checkOutDetails.additionalCharges.toFixed(
                          2,
                        )}
                      </p>
                    )}
                    {selectedReservation.checkOutDetails.hostComments && (
                      <p>
                        <strong>Notas del anfitrión:</strong>{" "}
                        {selectedReservation.checkOutDetails.hostComments}
                      </p>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDetailDialog(false)}
            >
              Cerrar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ReservationManager;
