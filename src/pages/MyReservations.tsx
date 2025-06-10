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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import {
  Menu,
  Globe,
  User,
  ChevronDown,
  Calendar,
  Clock,
  MapPin,
  Search,
  Filter,
  Eye,
  X,
  Download,
  MoreHorizontal,
  CheckCircle,
  XCircle,
  AlertCircle,
  Bed,
  Users,
  ArrowRight,
} from "lucide-react";

const MyReservations = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("todas");

  // Simulated reservations data
  const reservations = [
    {
      id: "8STM347L8",
      apartment: "Apartamento 1A",
      image: "/placeholder.svg",
      status: "confirmada",
      dates: {
        checkIn: "2025-06-07",
        checkOut: "2025-06-08",
        checkInTime: "3:00 PM",
        checkOutTime: "12:00 MD",
      },
      guests: 2,
      nights: 1,
      total: 230,
      bookingDate: "2025-01-15",
      isPast: false,
      isCurrent: false,
      isFuture: true,
    },
    {
      id: "9ABC123X4",
      apartment: "Suite Ejecutiva",
      image: "/placeholder.svg",
      status: "completada",
      dates: {
        checkIn: "2025-01-10",
        checkOut: "2025-01-12",
        checkInTime: "3:00 PM",
        checkOutTime: "12:00 MD",
      },
      guests: 2,
      nights: 2,
      total: 760,
      bookingDate: "2024-12-20",
      isPast: true,
      isCurrent: false,
      isFuture: false,
    },
    {
      id: "7DEF456Y7",
      apartment: "Casa Familiar",
      image: "/placeholder.svg",
      status: "cancelada",
      dates: {
        checkIn: "2024-12-25",
        checkOut: "2024-12-27",
        checkInTime: "3:00 PM",
        checkOutTime: "12:00 MD",
      },
      guests: 4,
      nights: 2,
      total: 500,
      bookingDate: "2024-11-15",
      isPast: true,
      isCurrent: false,
      isFuture: false,
    },
    {
      id: "5GHI789Z2",
      apartment: "Apartamento 2A",
      image: "/placeholder.svg",
      status: "confirmada",
      dates: {
        checkIn: "2025-03-15",
        checkOut: "2025-03-17",
        checkInTime: "3:00 PM",
        checkOutTime: "12:00 MD",
      },
      guests: 3,
      nights: 2,
      total: 480,
      bookingDate: "2025-01-20",
      isPast: false,
      isCurrent: false,
      isFuture: true,
    },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "confirmada":
        return (
          <Badge className="bg-green-100 text-green-800">
            <CheckCircle className="h-3 w-3 mr-1" />
            Confirmada
          </Badge>
        );
      case "completada":
        return (
          <Badge className="bg-blue-100 text-blue-800">
            <CheckCircle className="h-3 w-3 mr-1" />
            Completada
          </Badge>
        );
      case "cancelada":
        return (
          <Badge className="bg-red-100 text-red-800">
            <XCircle className="h-3 w-3 mr-1" />
            Cancelada
          </Badge>
        );
      case "pendiente":
        return (
          <Badge className="bg-yellow-100 text-yellow-800">
            <AlertCircle className="h-3 w-3 mr-1" />
            Pendiente
          </Badge>
        );
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const filteredReservations = reservations.filter((reservation) => {
    const matchesSearch =
      reservation.apartment.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reservation.id.toLowerCase().includes(searchTerm.toLowerCase());

    if (filterStatus === "todas") return matchesSearch;
    return matchesSearch && reservation.status === filterStatus;
  });

  const getReservationsByCategory = (category: string) => {
    switch (category) {
      case "actuales":
        return filteredReservations.filter((r) => r.isCurrent);
      case "futuras":
        return filteredReservations.filter((r) => r.isFuture);
      case "pasadas":
        return filteredReservations.filter((r) => r.isPast);
      default:
        return filteredReservations;
    }
  };

  const ReservationCard = ({ reservation }: { reservation: any }) => (
    <Card className="hover:shadow-lg transition-shadow">
      <CardContent className="p-6">
        <div className="flex gap-4">
          <img
            src={reservation.image}
            alt={reservation.apartment}
            className="w-24 h-24 object-cover rounded-lg"
          />

          <div className="flex-1">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  {reservation.apartment}
                </h3>
                <p className="text-sm text-slate-600">
                  Código: {reservation.id}
                </p>
              </div>
              {getStatusBadge(reservation.status)}
            </div>

            <div className="grid md:grid-cols-3 gap-4 mb-4">
              <div>
                <div className="flex items-center gap-2 text-slate-600 mb-1">
                  <Calendar className="h-4 w-4" />
                  <span className="text-sm">Check-in</span>
                </div>
                <div className="font-medium">
                  {formatDate(reservation.dates.checkIn)}
                </div>
                <div className="text-xs text-slate-500">
                  {reservation.dates.checkInTime}
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2 text-slate-600 mb-1">
                  <Clock className="h-4 w-4" />
                  <span className="text-sm">Check-out</span>
                </div>
                <div className="font-medium">
                  {formatDate(reservation.dates.checkOut)}
                </div>
                <div className="text-xs text-slate-500">
                  {reservation.dates.checkOutTime}
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2 text-slate-600 mb-1">
                  <Users className="h-4 w-4" />
                  <span className="text-sm">Detalles</span>
                </div>
                <div className="font-medium">
                  {reservation.guests} huéspedes
                </div>
                <div className="text-xs text-slate-500">
                  {reservation.nights} noche{reservation.nights > 1 ? "s" : ""}
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <div>
                <span className="text-2xl font-bold text-slate-900">
                  ${reservation.total}
                </span>
                <span className="text-sm text-slate-600 ml-2">total</span>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate(`/confirmacion/${reservation.id}`)}
                >
                  <Eye className="h-4 w-4 mr-1" />
                  Ver Detalles
                </Button>

                {reservation.status === "confirmada" &&
                  reservation.isFuture && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-red-600 border-red-200 hover:bg-red-50"
                    >
                      <X className="h-4 w-4 mr-1" />
                      Cancelar
                    </Button>
                  )}

                <Button variant="ghost" size="sm">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

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
              <div
                className="flex items-center gap-3 cursor-pointer"
                onClick={() => navigate('/dashboard')}
              >
              >
                <User className="h-4 w-4" />
                Mi Perfil
              </Button>
              <Button variant="ghost">
                <Menu className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            Mis Reservas
          </h1>
          <p className="text-lg text-slate-600">
            Gestiona todas tus reservas en el Club Salvadoreño
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Buscar por apartamento o código de reserva..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="flex gap-2">
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-48">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filtrar por estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todas">Todas las reservas</SelectItem>
                <SelectItem value="confirmada">Confirmadas</SelectItem>
                <SelectItem value="completada">Completadas</SelectItem>
                <SelectItem value="cancelada">Canceladas</SelectItem>
                <SelectItem value="pendiente">Pendientes</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline" className="gap-2">
              <Download className="h-4 w-4" />
              Exportar
            </Button>
          </div>
        </div>

        {/* Reservations Tabs */}
        <Tabs defaultValue="todas" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="todas">
              Todas ({filteredReservations.length})
            </TabsTrigger>
            <TabsTrigger value="futuras">
              Próximas ({getReservationsByCategory("futuras").length})
            </TabsTrigger>
            <TabsTrigger value="actuales">
              Actuales ({getReservationsByCategory("actuales").length})
            </TabsTrigger>
            <TabsTrigger value="pasadas">
              Pasadas ({getReservationsByCategory("pasadas").length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="todas" className="space-y-4">
            {filteredReservations.length > 0 ? (
              filteredReservations.map((reservation) => (
                <ReservationCard
                  key={reservation.id}
                  reservation={reservation}
                />
              ))
            ) : (
              <Card>
                <CardContent className="p-12 text-center">
                  <Calendar className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-slate-900 mb-2">
                    No hay reservas
                  </h3>
                  <p className="text-slate-600 mb-6">
                    {searchTerm || filterStatus !== "todas"
                      ? "No se encontraron reservas que coincidan con tu búsqueda."
                      : "Aún no tienes reservas realizadas."}
                  </p>
                  <Button
                    className="bg-blue-900 hover:bg-blue-800"
                    onClick={() => navigate("/alojamientos")}
                  >
                    Hacer Nueva Reserva
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="futuras" className="space-y-4">
            {getReservationsByCategory("futuras").map((reservation) => (
              <ReservationCard key={reservation.id} reservation={reservation} />
            ))}
          </TabsContent>

          <TabsContent value="actuales" className="space-y-4">
            {getReservationsByCategory("actuales").length > 0 ? (
              getReservationsByCategory("actuales").map((reservation) => (
                <ReservationCard
                  key={reservation.id}
                  reservation={reservation}
                />
              ))
            ) : (
              <Card>
                <CardContent className="p-12 text-center">
                  <Bed className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-slate-900 mb-2">
                    No hay estadías actuales
                  </h3>
                  <p className="text-slate-600">
                    No tienes reservas activas en este momento.
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="pasadas" className="space-y-4">
            {getReservationsByCategory("pasadas").map((reservation) => (
              <ReservationCard key={reservation.id} reservation={reservation} />
            ))}
          </TabsContent>
        </Tabs>

        {/* Quick Actions */}
        <div className="mt-12 grid md:grid-cols-3 gap-6">
          <Card
            className="cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => navigate("/alojamientos")}
          >
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="font-bold text-slate-900 mb-2">Nueva Reserva</h3>
              <p className="text-sm text-slate-600">
                Explora nuestros alojamientos disponibles
              </p>
            </CardContent>
          </Card>

          <Card
            className="cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => navigate("/perfil")}
          >
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="font-bold text-slate-900 mb-2">Mi Perfil</h3>
              <p className="text-sm text-slate-600">
                Gestiona tu información personal
              </p>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg transition-shadow">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Download className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="font-bold text-slate-900 mb-2">Historial</h3>
              <p className="text-sm text-slate-600">
                Descarga el historial completo
              </p>
            </CardContent>
          </Card>
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

export default MyReservations;