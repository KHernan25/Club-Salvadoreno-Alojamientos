import { useState } from "react";
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
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Search,
  User,
  Calendar,
  MapPin,
  Users,
  DollarSign,
  Key,
  FileCheck,
  Clock,
  CheckCircle,
  AlertTriangle,
} from "lucide-react";
import { reservationService, Reservation } from "@/lib/reservation-service";
import { toast } from "@/hooks/use-toast";
import { getCurrentUser } from "@/lib/auth-service";

const CheckInManager = () => {
  const currentUser = getCurrentUser();
  const [searchCode, setSearchCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [foundReservation, setFoundReservation] = useState<Reservation | null>(
    null,
  );
  const [showCheckInDialog, setShowCheckInDialog] = useState(false);

  // Check-in form data
  const [actualArrivalTime, setActualArrivalTime] = useState("");
  const [guestsPresent, setGuestsPresent] = useState("");
  const [documentsVerified, setDocumentsVerified] = useState(false);
  const [keyProvided, setKeyProvided] = useState(false);
  const [checkInNotes, setCheckInNotes] = useState("");

  const handleSearchReservation = async () => {
    if (!searchCode.trim()) {
      toast({
        title: "Error",
        description: "Por favor ingresa un código de reserva",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const reservation = await reservationService.findByReservationCode(
        searchCode.trim(),
      );

      if (reservation) {
        if (reservation.status === "checked_in") {
          toast({
            title: "Reserva ya procesada",
            description: "Esta reserva ya tiene check-in realizado",
            variant: "destructive",
          });
          setFoundReservation(null);
        } else if (reservation.status === "checked_out") {
          toast({
            title: "Reserva finalizada",
            description: "Esta reserva ya fue completada",
            variant: "destructive",
          });
          setFoundReservation(null);
        } else if (reservation.status === "cancelled") {
          toast({
            title: "Reserva cancelada",
            description: "Esta reserva fue cancelada",
            variant: "destructive",
          });
          setFoundReservation(null);
        } else {
          setFoundReservation(reservation);
          // Pre-llenar algunos campos
          setActualArrivalTime(new Date().toISOString().slice(0, 16));
          setGuestsPresent(reservation.numberOfGuests.toString());
          toast({
            title: "Reserva encontrada",
            description: `Reserva de ${reservation.guestName} lista para check-in`,
          });
        }
      } else {
        setFoundReservation(null);
        toast({
          title: "Reserva no encontrada",
          description: "No se encontró una reserva con ese código",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      console.error("Error searching reservation:", error);
      toast({
        title: "Error",
        description: "Error al buscar la reserva",
        variant: "destructive",
      });
      setFoundReservation(null);
    } finally {
      setLoading(false);
    }
  };

  const handlePerformCheckIn = async () => {
    if (!foundReservation || !currentUser) return;

    if (!actualArrivalTime) {
      toast({
        title: "Error",
        description: "La hora de llegada es requerida",
        variant: "destructive",
      });
      return;
    }

    if (!guestsPresent || parseInt(guestsPresent) <= 0) {
      toast({
        title: "Error",
        description: "Número de huéspedes presente es requerido",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      await reservationService.performCheckIn(foundReservation.id, {
        checkedInBy: currentUser.fullName,
        actualArrivalTime: new Date(actualArrivalTime),
        guestsPresent: parseInt(guestsPresent),
        documentsVerified,
        keyProvided,
        notes: checkInNotes.trim() || undefined,
      });

      toast({
        title: "Check-in completado",
        description: `Check-in exitoso para ${foundReservation.guestName}`,
      });

      // Limpiar formulario
      setFoundReservation(null);
      setSearchCode("");
      setShowCheckInDialog(false);
      setActualArrivalTime("");
      setGuestsPresent("");
      setDocumentsVerified(false);
      setKeyProvided(false);
      setCheckInNotes("");
    } catch (error: any) {
      console.error("Error performing check-in:", error);
      toast({
        title: "Error",
        description: error.message || "Error al realizar check-in",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getLocationBadgeColor = (location: string) => {
    switch (location) {
      case "El Sunzal":
        return "bg-blue-100 text-blue-800";
      case "Corinto":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  return (
    <div className="space-y-6">
      {/* Search Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Search className="h-5 w-5 text-blue-600" />
            <span>Buscar Reserva para Check-in</span>
          </CardTitle>
          <CardDescription>
            Ingresa el código de reserva para realizar el check-in
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-4">
            <div className="flex-1">
              <Label htmlFor="search-code">Código de Reserva</Label>
              <Input
                id="search-code"
                placeholder="Ej: CS2024001"
                value={searchCode}
                onChange={(e) => setSearchCode(e.target.value.toUpperCase())}
                onKeyPress={(e) =>
                  e.key === "Enter" && handleSearchReservation()
                }
              />
            </div>
            <div className="flex items-end">
              <Button onClick={handleSearchReservation} disabled={loading}>
                {loading ? (
                  <div className="w-4 h-4 animate-spin rounded-full border-2 border-white border-t-transparent mr-2"></div>
                ) : (
                  <Search className="w-4 h-4 mr-2" />
                )}
                Buscar
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Found Reservation */}
      {foundReservation && (
        <Card className="border-green-200 bg-green-50">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-green-800">
              <CheckCircle className="h-5 w-5" />
              <span>Reserva Encontrada</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Guest Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-white rounded-lg border">
              <div>
                <h3 className="text-lg font-semibold flex items-center space-x-2">
                  <User className="w-5 h-5 text-gray-600" />
                  <span>{foundReservation.guestName}</span>
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  {foundReservation.guestEmail}
                </p>
                <p className="text-sm text-gray-600">
                  {foundReservation.guestPhone}
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Badge variant="outline">
                    {foundReservation.reservationCode}
                  </Badge>
                  <Badge
                    className={getLocationBadgeColor(foundReservation.location)}
                  >
                    <MapPin className="w-3 h-3 mr-1" />
                    {foundReservation.location}
                  </Badge>
                </div>

                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <div className="flex items-center space-x-1">
                    <Users className="w-4 h-4" />
                    <span>{foundReservation.numberOfGuests} huéspedes</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <DollarSign className="w-4 h-4" />
                    <span>${foundReservation.totalAmount.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Accommodation Info */}
            <div className="p-4 bg-white rounded-lg border">
              <h4 className="font-medium mb-2">
                {foundReservation.accommodationName}
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                <div className="flex items-center space-x-1">
                  <Calendar className="w-4 h-4" />
                  <span>
                    Check-in:{" "}
                    {foundReservation.checkInDate.toLocaleDateString()}
                    {isToday(foundReservation.checkInDate) && (
                      <Badge
                        variant="outline"
                        className="ml-2 text-green-600 border-green-600"
                      >
                        HOY
                      </Badge>
                    )}
                  </span>
                </div>
                <div className="flex items-center space-x-1">
                  <Calendar className="w-4 h-4" />
                  <span>
                    Check-out:{" "}
                    {foundReservation.checkOutDate.toLocaleDateString()}
                  </span>
                </div>
              </div>

              {foundReservation.specialRequests && (
                <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded">
                  <h5 className="font-medium text-yellow-800 mb-1">
                    Solicitudes Especiales:
                  </h5>
                  <p className="text-sm text-yellow-700">
                    {foundReservation.specialRequests}
                  </p>
                </div>
              )}
            </div>

            {/* Action Button */}
            <div className="flex justify-end pt-4">
              <Button
                onClick={() => setShowCheckInDialog(true)}
                className="bg-green-600 hover:bg-green-700"
                size="lg"
              >
                <Key className="w-4 h-4 mr-2" />
                Realizar Check-in
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Check-in Dialog */}
      <Dialog open={showCheckInDialog} onOpenChange={setShowCheckInDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Realizar Check-in</DialogTitle>
            <DialogDescription>
              Completa la información del check-in para{" "}
              {foundReservation?.guestName}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {/* Guest Summary */}
            {foundReservation && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold">{foundReservation.guestName}</h4>
                <p className="text-sm text-gray-600">
                  {foundReservation.accommodationName} •{" "}
                  {foundReservation.location}
                </p>
              </div>
            )}

            {/* Check-in Form */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="arrival-time">Hora de Llegada Real *</Label>
                <Input
                  id="arrival-time"
                  type="datetime-local"
                  value={actualArrivalTime}
                  onChange={(e) => setActualArrivalTime(e.target.value)}
                  required
                />
              </div>

              <div>
                <Label htmlFor="guests-present">Huéspedes Presentes *</Label>
                <Input
                  id="guests-present"
                  type="number"
                  min="1"
                  max={foundReservation?.numberOfGuests || 10}
                  value={guestsPresent}
                  onChange={(e) => setGuestsPresent(e.target.value)}
                  placeholder="Número de huéspedes"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  Reservado para {foundReservation?.numberOfGuests} huéspedes
                </p>
              </div>
            </div>

            {/* Checkboxes */}
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="documents-verified"
                  checked={documentsVerified}
                  onCheckedChange={(checked) =>
                    setDocumentsVerified(checked as boolean)
                  }
                />
                <Label
                  htmlFor="documents-verified"
                  className="flex items-center space-x-2"
                >
                  <FileCheck className="w-4 h-4" />
                  <span>Documentos de identidad verificados</span>
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="key-provided"
                  checked={keyProvided}
                  onCheckedChange={(checked) =>
                    setKeyProvided(checked as boolean)
                  }
                />
                <Label
                  htmlFor="key-provided"
                  className="flex items-center space-x-2"
                >
                  <Key className="w-4 h-4" />
                  <span>Llaves entregadas al huésped</span>
                </Label>
              </div>
            </div>

            {/* Notes */}
            <div>
              <Label htmlFor="checkin-notes">Notas del Check-in</Label>
              <Textarea
                id="checkin-notes"
                value={checkInNotes}
                onChange={(e) => setCheckInNotes(e.target.value)}
                placeholder="Observaciones del check-in, condiciones especiales, etc..."
                rows={3}
              />
            </div>

            {/* Validation Warning */}
            {(!documentsVerified || !keyProvided) && (
              <div className="flex items-center space-x-2 p-3 bg-yellow-50 border border-yellow-200 rounded">
                <AlertTriangle className="w-5 h-5 text-yellow-600" />
                <p className="text-sm text-yellow-700">
                  Asegúrate de verificar los documentos y entregar las llaves
                  antes de completar el check-in
                </p>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowCheckInDialog(false)}
            >
              Cancelar
            </Button>
            <Button
              onClick={handlePerformCheckIn}
              disabled={loading || !actualArrivalTime || !guestsPresent}
              className="bg-green-600 hover:bg-green-700"
            >
              {loading ? "Procesando..." : "Completar Check-in"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CheckInManager;
