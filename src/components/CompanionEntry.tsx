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
import { Badge } from "@/components/ui/badge";
import {
  UserPlus,
  Users,
  Clock,
  CheckCircle,
  AlertTriangle,
  Minus,
  Plus,
} from "lucide-react";
import {
  AccessRecord,
  accessControlService,
} from "@/lib/access-control-service";
import { toast } from "@/hooks/use-toast";

interface CompanionEntryProps {
  activeAccesses: AccessRecord[];
  onCompanionsRegistered: () => void;
}

const CompanionEntry = ({
  activeAccesses,
  onCompanionsRegistered,
}: CompanionEntryProps) => {
  const [selectedRecord, setSelectedRecord] = useState<AccessRecord | null>(
    null,
  );
  const [companionsCount, setCompanionsCount] = useState(0);
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegisterCompanions = async () => {
    if (!selectedRecord) return;

    setLoading(true);

    try {
      const success = await accessControlService.registerCompanions(
        selectedRecord.id,
        companionsCount,
        notes.trim() || undefined,
      );

      if (success) {
        toast({
          title: "Acompañantes Registrados",
          description: `Se registraron ${companionsCount} acompañantes para ${selectedRecord.memberName}`,
        });

        // Limpiar formulario
        setSelectedRecord(null);
        setCompanionsCount(0);
        setNotes("");

        // Notificar al padre
        onCompanionsRegistered();
      } else {
        toast({
          title: "Error",
          description: "No se pudo registrar a los acompañantes",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      console.error("Error registrando acompañantes:", error);
      toast({
        title: "Error",
        description: error.message || "Error al registrar acompañantes",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const adjustCount = (delta: number) => {
    const newCount = Math.max(0, Math.min(10, companionsCount + delta));
    setCompanionsCount(newCount);
  };

  const getTimeAgo = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 1) return "Hace menos de 1 minuto";
    if (diffMins < 60)
      return `Hace ${diffMins} minuto${diffMins > 1 ? "s" : ""}`;

    const diffHours = Math.floor(diffMins / 60);
    return `Hace ${diffHours} hora${diffHours > 1 ? "s" : ""}`;
  };

  return (
    <div className="space-y-6">
      {/* Active Access Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Clock className="w-5 h-5 text-orange-600" />
            <span>Seleccionar Acceso Activo</span>
          </CardTitle>
          <CardDescription>
            Selecciona el miembro para registrar sus acompañantes
          </CardDescription>
        </CardHeader>
        <CardContent>
          {activeAccesses.length === 0 ? (
            <div className="text-center py-8">
              <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No hay accesos activos
              </h3>
              <p className="text-gray-600">
                Todos los miembros han completado su registro de acompañantes
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {activeAccesses.map((access) => (
                <div
                  key={access.id}
                  className={`p-4 border rounded-lg cursor-pointer transition-all ${
                    selectedRecord?.id === access.id
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                  onClick={() => setSelectedRecord(access)}
                >
                  <div className="flex items-center space-x-4">
                    {access.memberPhoto && (
                      <img
                        src={access.memberPhoto}
                        alt={access.memberName}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    )}
                    <div className="flex-1">
                      <h4 className="font-medium">{access.memberName}</h4>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge variant="outline" className="text-xs">
                          {access.memberCode}
                        </Badge>
                        <Badge variant="secondary" className="text-xs">
                          {access.membershipType}
                        </Badge>
                        <Badge variant="outline" className="text-xs capitalize">
                          {access.detectionMethod}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">
                        Ingreso: {getTimeAgo(access.accessTime)}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge
                        variant="outline"
                        className="text-orange-600 border-orange-600"
                      >
                        <AlertTriangle className="w-3 h-3 mr-1" />
                        Pendiente
                      </Badge>
                      {selectedRecord?.id === access.id && (
                        <Badge className="bg-blue-600">Seleccionado</Badge>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Companion Registration Form */}
      {selectedRecord && (
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-blue-800">
              <UserPlus className="w-5 h-5" />
              <span>Registrar Acompañantes</span>
            </CardTitle>
            <CardDescription className="text-blue-700">
              Registra la cantidad de acompañantes para{" "}
              {selectedRecord.memberName}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Member Info */}
            <div className="flex items-center space-x-4 p-4 bg-white rounded-lg border">
              {selectedRecord.memberPhoto && (
                <img
                  src={selectedRecord.memberPhoto}
                  alt={selectedRecord.memberName}
                  className="w-16 h-16 rounded-full object-cover"
                />
              )}
              <div>
                <h3 className="text-lg font-semibold">
                  {selectedRecord.memberName}
                </h3>
                <div className="flex items-center space-x-2 mt-1">
                  <Badge variant="outline">{selectedRecord.memberCode}</Badge>
                  <Badge variant="secondary">
                    {selectedRecord.membershipType}
                  </Badge>
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  Ingreso: {selectedRecord.accessTime.toLocaleTimeString()} •{" "}
                  {selectedRecord.location}
                </p>
              </div>
            </div>

            {/* Companions Counter */}
            <div className="space-y-3">
              <Label className="text-base font-medium">
                Número de Acompañantes
              </Label>
              <div className="flex items-center space-x-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => adjustCount(-1)}
                  disabled={companionsCount === 0}
                >
                  <Minus className="w-4 h-4" />
                </Button>
                <div className="flex items-center space-x-3">
                  <Input
                    type="number"
                    min="0"
                    max="10"
                    value={companionsCount}
                    onChange={(e) =>
                      setCompanionsCount(
                        Math.max(
                          0,
                          Math.min(10, parseInt(e.target.value) || 0),
                        ),
                      )
                    }
                    className="w-20 text-center text-lg font-semibold"
                  />
                  <div className="flex items-center space-x-1 text-gray-600">
                    <Users className="w-4 h-4" />
                    <span>
                      {companionsCount === 0 && "Sin acompañantes"}
                      {companionsCount === 1 && "1 acompañante"}
                      {companionsCount > 1 && `${companionsCount} acompañantes`}
                    </span>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => adjustCount(1)}
                  disabled={companionsCount === 10}
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              <p className="text-sm text-gray-600">
                Máximo 10 acompañantes por miembro
              </p>
            </div>

            {/* Quick Number Buttons */}
            <div className="space-y-2">
              <Label className="text-sm">Selección Rápida</Label>
              <div className="flex space-x-2">
                {[0, 1, 2, 3, 4, 5].map((num) => (
                  <Button
                    key={num}
                    variant={companionsCount === num ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCompanionsCount(num)}
                    className="w-12"
                  >
                    {num}
                  </Button>
                ))}
              </div>
            </div>

            {/* Notes */}
            <div className="space-y-2">
              <Label htmlFor="notes">Notas Adicionales (Opcional)</Label>
              <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Observaciones especiales, tipo de evento, etc..."
                rows={3}
              />
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-3 pt-4">
              <Button
                onClick={handleRegisterCompanions}
                disabled={loading}
                className="flex-1"
                size="lg"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 mr-2 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                    Registrando...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Completar Registro
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setSelectedRecord(null);
                  setCompanionsCount(0);
                  setNotes("");
                }}
                disabled={loading}
              >
                Cancelar
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Instructions */}
      {!selectedRecord && activeAccesses.length > 0 && (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardContent className="pt-6">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
              <div>
                <h3 className="font-medium text-yellow-800 mb-1">
                  Instrucciones
                </h3>
                <p className="text-sm text-yellow-700">
                  1. Selecciona un miembro de la lista de accesos activos
                  <br />
                  2. Ingresa la cantidad de acompañantes que trae
                  <br />
                  3. Agrega notas adicionales si es necesario
                  <br />
                  4. Completa el registro para notificar al anfitrión
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CompanionEntry;
