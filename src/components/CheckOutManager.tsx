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
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
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
  LogOut,
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
  Star,
  MessageSquare,
} from "lucide-react";
import { reservationService, Reservation } from "@/lib/reservation-service";
import { toast } from "@/hooks/use-toast";
import { getCurrentUser } from "@/lib/auth-service";

const CheckOutManager = () => {
  const currentUser = getCurrentUser();
  const [todayCheckOuts, setTodayCheckOuts] = useState<Reservation[]>([]);
  const [selectedReservation, setSelectedReservation] =
    useState<Reservation | null>(null);
  const [showCheckOutDialog, setShowCheckOutDialog] = useState(false);
  const [loading, setLoading] = useState(false);

  // Check-out form data
  const [actualDepartureTime, setActualDepartureTime] = useState("");
  const [roomCondition, setRoomCondition] = useState<
    "excellent" | "good" | "fair" | "poor"
  >("good");
  const [damagesReported, setDamagesReported] = useState(false);
  const [damageDescription, setDamageDescription] = useState("");
  const [cleaningRequired, setCleaningRequired] = useState(false);
  const [keyReturned, setKeyReturned] = useState(false);
  const [additionalCharges, setAdditionalCharges] = useState("");
  const [guestComments, setGuestComments] = useState("");
  const [hostComments, setHostComments] = useState("");

  useEffect(() => {
    loadTodayCheckOuts();
  }, []);

  const loadTodayCheckOuts = () => {
    try {
      const checkOuts = reservationService.getTodayCheckOuts();
      setTodayCheckOuts(checkOuts);
      console.log("✅ Today check-outs loaded:", checkOuts.length);
    } catch (error) {
      console.error("Error loading check-outs:", error);
      toast({
        title: "Error",
        description: "Error al cargar los check-outs del día",
        variant: "destructive",
      });
    }
  };

  const handleSelectReservation = (reservation: Reservation) => {
    setSelectedReservation(reservation);
    // Pre-llenar algunos campos
    setActualDepartureTime(new Date().toISOString().slice(0, 16));
    setRoomCondition("good");
    setDamagesReported(false);
    setDamageDescription("");
    setCleaningRequired(true); // Por defecto requiere limpieza
    setKeyReturned(false);
    setAdditionalCharges("");
    setGuestComments("");
    setHostComments("");
    setShowCheckOutDialog(true);
  };

  const handlePerformCheckOut = async () => {
    if (!selectedReservation || !currentUser) return;

    if (!actualDepartureTime) {
      toast({
        title: "Error",
        description: "La hora de salida es requerida",
        variant: "destructive",
      });
      return;
    }

    if (!keyReturned) {
      toast({
        title: "Advertencia",
        description: "Asegúrate de que las llaves hayan sido devueltas",
        variant: "destructive",
      });
      return;
    }

    if (damagesReported && !damageDescription.trim()) {
      toast({
        title: "Error",
        description:
          "Debe describir los daños reportados si los marca como existentes",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      await reservationService.performCheckOut(selectedReservation.id, {
        checkedOutBy: currentUser.fullName,
        actualDepartureTime: new Date(actualDepartureTime),
        roomCondition,
        damagesReported,
        damageDescription: damagesReported
          ? damageDescription.trim()
          : undefined,
        cleaningRequired,
        keyReturned,
        additionalCharges: additionalCharges
          ? parseFloat(additionalCharges)
          : undefined,
        guestComments: guestComments.trim() || undefined,
        hostComments: hostComments.trim() || undefined,
      });

      toast({
        title: "Check-out completado",
        description: `Check-out exitoso para ${selectedReservation.guestName}`,
      });

      // Limpiar formulario y recargar
      setSelectedReservation(null);
      setShowCheckOutDialog(false);
      loadTodayCheckOuts();
    } catch (error: any) {
      console.error("Error performing check-out:", error);
      toast({
        title: "Error",
        description: error.message || "Error al realizar check-out",
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

  const getRoomConditionColor = (condition: string) => {
    switch (condition) {
      case "excellent":
        return "text-green-600";
      case "good":
        return "text-blue-600";
      case "fair":
        return "text-yellow-600";
      case "poor":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  const getRoomConditionText = (condition: string) => {
    switch (condition) {
      case "excellent":
        return "Excelente";
      case "good":
        return "Bueno";
      case "fair":
        return "Regular";
      case "poor":
        return "Malo";
      default:
        return condition;
    }
  };

  return (
    <div className="space-y-6">
      {/* Today's Check-outs */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <LogOut className="h-5 w-5 text-orange-600" />
            <span>Check-outs de Hoy</span>
          </CardTitle>
          <CardDescription>
            Reservas programadas para check-out hoy
          </CardDescription>
        </CardHeader>
        <CardContent>
          {todayCheckOuts.length === 0 ? (
            <div className="text-center py-8">
              <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No hay check-outs programados
              </h3>
              <p className="text-gray-600">
                No hay huéspedes programados para salir hoy
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {todayCheckOuts.map((reservation) => (
                <div
                  key={reservation.id}
                  className="border rounded-lg p-4 bg-orange-50 border-orange-200"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 space-y-3">
                      {/* Guest Info */}
                      <div className="flex items-center space-x-4">
                        <div>
                          <h4 className="font-semibold text-lg">
                            {reservation.guestName}
                          </h4>
                          <div className="flex items-center space-x-2 mt-1">
                            <Badge variant="outline">
                              {reservation.reservationCode}
                            </Badge>
                            <Badge
                              className={getLocationBadgeColor(
                                reservation.location,
                              )}
                            >
                              <MapPin className="w-3 h-3 mr-1" />
                              {reservation.location}
                            </Badge>
                            <Badge
                              variant="secondary"
                              className="bg-orange-100"
                            >
                              Check-out Hoy
                            </Badge>
                          </div>
                        </div>
                      </div>

                      {/* Accommodation & Details */}
                      <div className="flex items-center space-x-6 text-sm text-gray-600">
                        <div>
                          <strong>Alojamiento:</strong>{" "}
                          {reservation.accommodationName}
                        </div>
                        <div className="flex items-center space-x-1">
                          <Users className="w-4 h-4" />
                          <span>{reservation.numberOfGuests} huéspedes</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-4 h-4" />
                          <span>
                            Salida:{" "}
                            {reservation.checkOutDate.toLocaleDateString()}
                          </span>
                        </div>
                      </div>

                      {/* Check-in Info */}
                      {reservation.checkInDetails && (
                        <div className="bg-white rounded border p-3">
                          <h5 className="font-medium mb-1">
                            Información de Check-in:
                          </h5>
                          <div className="text-sm text-gray-600 space-y-1">
                            <p>
                              Llegada:{" "}
                              {reservation.checkInDetails.actualArrivalTime.toLocaleString()}
                            </p>
                            <p>
                              Huéspedes presentes:{" "}
                              {reservation.checkInDetails.guestsPresent}
                            </p>
                            <p>
                              Procesado por:{" "}
                              {reservation.checkInDetails.checkedInBy}
                            </p>
                            {reservation.checkInDetails.notes && (
                              <p>
                                <strong>Notas:</strong>{" "}
                                {reservation.checkInDetails.notes}
                              </p>
                            )}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Action Button */}
                    <div className="flex flex-col space-y-2 ml-4">
                      <Button
                        onClick={() => handleSelectReservation(reservation)}
                        className="bg-orange-600 hover:bg-orange-700"
                      >
                        <LogOut className="w-4 h-4 mr-2" />
                        Realizar Check-out
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Check-out Dialog */}
      <Dialog open={showCheckOutDialog} onOpenChange={setShowCheckOutDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Realizar Check-out</DialogTitle>
            <DialogDescription>
              Completa la información del check-out para{" "}
              {selectedReservation?.guestName}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {/* Guest Summary */}
            {selectedReservation && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold">
                  {selectedReservation.guestName}
                </h4>
                <p className="text-sm text-gray-600">
                  {selectedReservation.accommodationName} •{" "}
                  {selectedReservation.location}
                </p>
                <p className="text-sm text-gray-600">
                  Código: {selectedReservation.reservationCode} • Total: $
                  {selectedReservation.totalAmount.toFixed(2)}
                </p>
              </div>
            )}

            {/* Check-out Form */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column */}
              <div className="space-y-4">
                <div>
                  <Label htmlFor="departure-time">Hora de Salida Real *</Label>
                  <Input
                    id="departure-time"
                    type="datetime-local"
                    value={actualDepartureTime}
                    onChange={(e) => setActualDepartureTime(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="room-condition">
                    Condición del Alojamiento *
                  </Label>
                  <Select
                    value={roomCondition}
                    onValueChange={(value: any) => setRoomCondition(value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar condición" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="excellent">
                        <div className="flex items-center">
                          <Star className="w-4 h-4 text-green-600 mr-2" />
                          Excelente
                        </div>
                      </SelectItem>
                      <SelectItem value="good">
                        <div className="flex items-center">
                          <CheckCircle className="w-4 h-4 text-blue-600 mr-2" />
                          Bueno
                        </div>
                      </SelectItem>
                      <SelectItem value="fair">
                        <div className="flex items-center">
                          <AlertTriangle className="w-4 h-4 text-yellow-600 mr-2" />
                          Regular
                        </div>
                      </SelectItem>
                      <SelectItem value="poor">
                        <div className="flex items-center">
                          <AlertTriangle className="w-4 h-4 text-red-600 mr-2" />
                          Malo
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="additional-charges">
                    Cargos Adicionales (USD)
                  </Label>
                  <Input
                    id="additional-charges"
                    type="number"
                    step="0.01"
                    min="0"
                    value={additionalCharges}
                    onChange={(e) => setAdditionalCharges(e.target.value)}
                    placeholder="0.00"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Minibar, daños, servicios extra, etc.
                  </p>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-4">
                {/* Checkboxes */}
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="damages-reported"
                      checked={damagesReported}
                      onCheckedChange={(checked) =>
                        setDamagesReported(checked as boolean)
                      }
                    />
                    <Label htmlFor="damages-reported">
                      Daños reportados en el alojamiento
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="cleaning-required"
                      checked={cleaningRequired}
                      onCheckedChange={(checked) =>
                        setCleaningRequired(checked as boolean)
                      }
                    />
                    <Label htmlFor="cleaning-required">
                      Requiere limpieza profunda
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="key-returned"
                      checked={keyReturned}
                      onCheckedChange={(checked) =>
                        setKeyReturned(checked as boolean)
                      }
                    />
                    <Label
                      htmlFor="key-returned"
                      className="flex items-center space-x-2"
                    >
                      <Key className="w-4 h-4" />
                      <span>Llaves devueltas</span>
                    </Label>
                  </div>
                </div>

                {/* Damage Description */}
                {damagesReported && (
                  <div>
                    <Label htmlFor="damage-description">
                      Descripción de Daños *
                    </Label>
                    <Textarea
                      id="damage-description"
                      value={damageDescription}
                      onChange={(e) => setDamageDescription(e.target.value)}
                      placeholder="Describe detalladamente los daños encontrados..."
                      rows={3}
                      required
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Comments Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="guest-comments">Comentarios del Huésped</Label>
                <Textarea
                  id="guest-comments"
                  value={guestComments}
                  onChange={(e) => setGuestComments(e.target.value)}
                  placeholder="Opiniones y comentarios del huésped sobre su estadía..."
                  rows={4}
                />
              </div>

              <div>
                <Label htmlFor="host-comments">Notas del Anfitrión</Label>
                <Textarea
                  id="host-comments"
                  value={hostComments}
                  onChange={(e) => setHostComments(e.target.value)}
                  placeholder="Observaciones internas, incidencias, recomendaciones..."
                  rows={4}
                />
              </div>
            </div>

            {/* Validation Warnings */}
            <div className="space-y-2">
              {!keyReturned && (
                <div className="flex items-center space-x-2 p-3 bg-red-50 border border-red-200 rounded">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                  <p className="text-sm text-red-700">
                    <strong>Importante:</strong> Asegúrate de recibir todas las
                    llaves antes de completar el check-out
                  </p>
                </div>
              )}

              {roomCondition === "poor" && (
                <div className="flex items-center space-x-2 p-3 bg-yellow-50 border border-yellow-200 rounded">
                  <AlertTriangle className="w-5 h-5 text-yellow-600" />
                  <p className="text-sm text-yellow-700">
                    <strong>Atención:</strong> La condición "Malo" requiere
                    revisión adicional del supervisor
                  </p>
                </div>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowCheckOutDialog(false)}
            >
              Cancelar
            </Button>
            <Button
              onClick={handlePerformCheckOut}
              disabled={
                loading ||
                !actualDepartureTime ||
                !keyReturned ||
                (damagesReported && !damageDescription.trim())
              }
              className="bg-orange-600 hover:bg-orange-700"
            >
              {loading ? "Procesando..." : "Completar Check-out"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CheckOutManager;
