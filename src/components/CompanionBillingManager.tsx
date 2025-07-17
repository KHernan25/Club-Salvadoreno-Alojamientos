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
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
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
  DollarSign,
  Clock,
  CheckCircle,
  XCircle,
  Users,
  MapPin,
  CreditCard,
  Eye,
  AlertTriangle,
} from "lucide-react";
import {
  companionBillingService,
  CompanionBillingRecord,
} from "@/lib/companion-billing-service";
import { toast } from "@/hooks/use-toast";
import { getCurrentUser } from "@/lib/auth-service";

const CompanionBillingManager = () => {
  const currentUser = getCurrentUser();
  const [pendingRecords, setPendingRecords] = useState<
    CompanionBillingRecord[]
  >([]);
  const [selectedRecord, setSelectedRecord] =
    useState<CompanionBillingRecord | null>(null);
  const [showProcessDialog, setShowProcessDialog] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [processNotes, setProcessNotes] = useState("");
  const [cancelReason, setCancelReason] = useState("");
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    loadBillingData();
    // Simular actualizaciones en tiempo real cada 30 segundos
    const interval = setInterval(loadBillingData, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadBillingData = () => {
    try {
      const pending = companionBillingService.getPendingBillingRecords();
      const billingStats = companionBillingService.getBillingStats();

      setPendingRecords(pending);
      setStats(billingStats);

      console.log("✅ Billing data loaded:", {
        pending: pending.length,
        stats: billingStats,
      });
    } catch (error) {
      console.error("Error loading billing data:", error);
      toast({
        title: "Error",
        description: "Error al cargar los registros de facturación",
        variant: "destructive",
      });
    }
  };

  const handleProcessBilling = async () => {
    if (!selectedRecord || !currentUser) return;

    setLoading(true);
    try {
      await companionBillingService.processBilling(
        selectedRecord.id,
        currentUser.fullName,
        processNotes.trim() || undefined,
      );

      toast({
        title: "Cobro Procesado",
        description: `Cobro por $${selectedRecord.totalAmount.toFixed(2)} procesado exitosamente`,
      });

      // Limpiar y recargar
      setSelectedRecord(null);
      setShowProcessDialog(false);
      setProcessNotes("");
      loadBillingData();
    } catch (error: any) {
      console.error("Error processing billing:", error);
      toast({
        title: "Error",
        description: error.message || "Error al procesar el cobro",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBilling = async () => {
    if (!selectedRecord || !currentUser) return;

    if (!cancelReason.trim()) {
      toast({
        title: "Error",
        description: "Debe proporcionar un motivo de cancelación",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      await companionBillingService.cancelBilling(
        selectedRecord.id,
        currentUser.fullName,
        cancelReason.trim(),
      );

      toast({
        title: "Cobro Cancelado",
        description: "El cobro ha sido cancelado exitosamente",
      });

      // Limpiar y recargar
      setSelectedRecord(null);
      setShowCancelDialog(false);
      setCancelReason("");
      loadBillingData();
    } catch (error: any) {
      console.error("Error cancelling billing:", error);
      toast({
        title: "Error",
        description: error.message || "Error al cancelar el cobro",
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
      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Cobros Pendientes
              </CardTitle>
              <Clock className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.pendingCount}</div>
              <p className="text-xs text-muted-foreground">por procesar</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Monto Pendiente
              </CardTitle>
              <DollarSign className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${stats.pendingAmount.toFixed(2)}
              </div>
              <p className="text-xs text-muted-foreground">total a cobrar</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Procesados Hoy
              </CardTitle>
              <CheckCircle className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.processedToday}</div>
              <p className="text-xs text-muted-foreground">
                cobros completados
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total del Día
              </CardTitle>
              <CreditCard className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${stats.totalToday.toFixed(2)}
              </div>
              <p className="text-xs text-muted-foreground">facturado hoy</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Pending Records */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <AlertTriangle className="h-5 w-5 text-orange-600" />
            <span>Registros de Portería - Cobros Pendientes</span>
          </CardTitle>
          <CardDescription>
            Registros automáticos enviados desde portería con acompañantes a
            cobrar
          </CardDescription>
        </CardHeader>
        <CardContent>
          {pendingRecords.length === 0 ? (
            <div className="text-center py-8">
              <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No hay cobros pendientes
              </h3>
              <p className="text-gray-600">
                Todos los registros de portería han sido procesados
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {pendingRecords.map((record) => (
                <div
                  key={record.id}
                  className="border rounded-lg p-4 bg-orange-50 border-orange-200"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 space-y-3">
                      {/* Member Info */}
                      <div className="flex items-center space-x-4">
                        <div>
                          <h4 className="font-semibold text-lg">
                            {record.memberName}
                          </h4>
                          <div className="flex items-center space-x-2 mt-1">
                            <Badge variant="outline">{record.memberCode}</Badge>
                            <Badge variant="secondary">
                              {record.membershipType}
                            </Badge>
                            <Badge
                              className={getLocationBadgeColor(record.location)}
                            >
                              <MapPin className="w-3 h-3 mr-1" />
                              {record.location}
                            </Badge>
                          </div>
                        </div>
                      </div>

                      {/* Access Info */}
                      <div className="flex items-center space-x-6 text-sm text-gray-600">
                        <div className="flex items-center space-x-1">
                          <Users className="w-4 h-4" />
                          <span>
                            {record.companionsCount} acompañante
                            {record.companionsCount !== 1 ? "s" : ""}
                          </span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="w-4 h-4" />
                          <span>{getTimeAgo(record.accessTime)}</span>
                        </div>
                        <div>
                          Registrado por:{" "}
                          <span className="font-medium">
                            {record.gateKeeperName}
                          </span>
                        </div>
                      </div>

                      {/* Billing Items */}
                      <div className="bg-white rounded border p-3">
                        <h5 className="font-medium mb-2">Detalle de Cobro:</h5>
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Concepto</TableHead>
                              <TableHead className="text-center">
                                Cantidad
                              </TableHead>
                              <TableHead className="text-right">
                                Precio Unit.
                              </TableHead>
                              <TableHead className="text-right">
                                Total
                              </TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {record.billingItems.map((item) => (
                              <TableRow key={item.id}>
                                <TableCell className="font-medium">
                                  {item.description}
                                </TableCell>
                                <TableCell className="text-center">
                                  {item.quantity}
                                </TableCell>
                                <TableCell className="text-right">
                                  ${item.unitPrice.toFixed(2)}
                                </TableCell>
                                <TableCell className="text-right font-semibold">
                                  ${item.total.toFixed(2)}
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                        <div className="border-t mt-2 pt-2 flex justify-between items-center">
                          <span className="font-semibold">Total a Cobrar:</span>
                          <span className="text-xl font-bold text-green-600">
                            ${record.totalAmount.toFixed(2)}
                          </span>
                        </div>
                      </div>

                      {/* Notes */}
                      {record.notes && (
                        <div className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
                          <strong>Notas:</strong> {record.notes}
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col space-y-2 ml-4">
                      <Button
                        onClick={() => {
                          setSelectedRecord(record);
                          setShowProcessDialog(true);
                        }}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Procesar Cobro
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setSelectedRecord(record);
                          setShowCancelDialog(true);
                        }}
                      >
                        <XCircle className="w-4 h-4 mr-2" />
                        Cancelar
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Process Billing Dialog */}
      <Dialog open={showProcessDialog} onOpenChange={setShowProcessDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Procesar Cobro</DialogTitle>
            <DialogDescription>
              Confirmar el procesamiento del cobro por acompañantes
            </DialogDescription>
          </DialogHeader>

          {selectedRecord && (
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold">{selectedRecord.memberName}</h4>
                <p className="text-sm text-gray-600">
                  {selectedRecord.companionsCount} acompañante
                  {selectedRecord.companionsCount !== 1 ? "s" : ""}•{" "}
                  {selectedRecord.location}
                </p>
                <p className="text-lg font-bold text-green-600 mt-2">
                  Total: ${selectedRecord.totalAmount.toFixed(2)}
                </p>
              </div>

              <div>
                <Label htmlFor="process-notes">
                  Notas del Proceso (Opcional)
                </Label>
                <Textarea
                  id="process-notes"
                  value={processNotes}
                  onChange={(e) => setProcessNotes(e.target.value)}
                  placeholder="Agregar observaciones sobre el cobro procesado..."
                  rows={3}
                />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowProcessDialog(false)}
            >
              Cancelar
            </Button>
            <Button onClick={handleProcessBilling} disabled={loading}>
              {loading ? "Procesando..." : "Confirmar Cobro"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Cancel Billing Dialog */}
      <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancelar Cobro</DialogTitle>
            <DialogDescription>
              Especifica el motivo de la cancelación
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {selectedRecord && (
              <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                <h4 className="font-semibold">{selectedRecord.memberName}</h4>
                <p className="text-sm text-gray-600">
                  Cobro por ${selectedRecord.totalAmount.toFixed(2)}
                </p>
              </div>
            )}

            <div>
              <Label htmlFor="cancel-reason">Motivo de Cancelación *</Label>
              <Textarea
                id="cancel-reason"
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                placeholder="Ej: Miembro exento, error en registro, acompañantes menores..."
                rows={3}
                required
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowCancelDialog(false)}
            >
              Volver
            </Button>
            <Button
              variant="destructive"
              onClick={handleCancelBilling}
              disabled={loading || !cancelReason.trim()}
            >
              {loading ? "Cancelando..." : "Confirmar Cancelación"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CompanionBillingManager;
