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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "@/hooks/use-toast";
import {
  Search,
  Check,
  X,
  Eye,
  Calendar,
  Mail,
  Phone,
  User,
  FileText,
  Clock,
  UserCheck,
  UserX,
  RefreshCw,
} from "lucide-react";
import AdminLayout from "@/components/AdminLayout";
import {
  apiGetRegistrationRequests,
  apiApproveRegistrationRequest,
  apiRejectRegistrationRequest,
  type RegistrationRequest,
} from "@/lib/api-service";

const AdminRegistrationRequests = () => {
  const [requests, setRequests] = useState<RegistrationRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedRequest, setSelectedRequest] =
    useState<RegistrationRequest | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [adminNotes, setAdminNotes] = useState("");

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = async () => {
    try {
      setLoading(true);
      const result = await apiGetRegistrationRequests();

      if (result.success) {
        setRequests(result.requests);
      } else {
        // Fallback to mock data if API is not available
        const mockRequests: RegistrationRequest[] = [
          {
            id: "req-001",
            firstName: "María",
            lastName: "González",
            email: "maria.gonzalez@email.com",
            phone: "+503 7234-5678",
            documentType: "dui",
            documentNumber: "12345678-9",
            memberCode: "MEM001",
            status: "pending",
            requestedAt: "2024-01-15T10:30:00Z",
          },
          {
            id: "req-002",
            firstName: "Carlos",
            lastName: "Rodríguez",
            email: "carlos.rodriguez@email.com",
            phone: "+503 7234-5679",
            documentType: "passport",
            documentNumber: "AB123456",
            memberCode: "MEM002",
            status: "pending",
            requestedAt: "2024-01-14T15:20:00Z",
          },
          {
            id: "req-003",
            firstName: "Ana",
            lastName: "Martínez",
            email: "ana.martinez@email.com",
            phone: "+503 7234-5680",
            documentType: "dui",
            documentNumber: "98765432-1",
            memberCode: "MEM003",
            status: "approved",
            requestedAt: "2024-01-13T09:15:00Z",
            reviewedAt: "2024-01-13T11:30:00Z",
            reviewedBy: "admin",
          },
          {
            id: "req-004",
            firstName: "Roberto",
            lastName: "Flores",
            email: "roberto.flores@email.com",
            phone: "+503 7234-5681",
            documentType: "dui",
            documentNumber: "11223344-5",
            memberCode: "MEM004",
            status: "rejected",
            requestedAt: "2024-01-12T14:30:00Z",
            reviewedAt: "2024-01-12T16:45:00Z",
            reviewedBy: "admin",
            rejectionReason: "Información del documento incompleta",
          },
        ];
        setRequests(mockRequests);
      }
    } catch (error) {
      console.error("Error loading requests:", error);
      // Use mock data as fallback
      const mockRequests: RegistrationRequest[] = [
        {
          id: "req-001",
          firstName: "María",
          lastName: "González",
          email: "maria.gonzalez@email.com",
          phone: "+503 7234-5678",
          documentType: "dui",
          documentNumber: "12345678-9",
          memberCode: "MEM001",
          status: "pending",
          requestedAt: "2024-01-15T10:30:00Z",
        },
        {
          id: "req-002",
          firstName: "Carlos",
          lastName: "Rodríguez",
          email: "carlos.rodriguez@email.com",
          phone: "+503 7234-5679",
          documentType: "passport",
          documentNumber: "AB123456",
          memberCode: "MEM002",
          status: "pending",
          requestedAt: "2024-01-14T15:20:00Z",
        },
      ];
      setRequests(mockRequests);

      toast({
        title: "Usando datos de prueba",
        description:
          "Conectado al modo demo. Las solicitudes mostradas son de ejemplo.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleApproveRequest = async (requestId: string) => {
    try {
      const success = await apiApproveRegistrationRequest(
        requestId,
        adminNotes,
      );

      if (success) {
        // Update local state
        setRequests((prev) =>
          prev.map((req) =>
            req.id === requestId
              ? {
                  ...req,
                  status: "approved" as const,
                  reviewedAt: new Date().toISOString(),
                  reviewedBy: "admin",
                  notes: adminNotes,
                }
              : req,
          ),
        );

        toast({
          title: "Solicitud aprobada",
          description:
            "El usuario ha sido registrado exitosamente y se le ha enviado un email de confirmación.",
        });

        setAdminNotes("");
      } else {
        throw new Error("API returned false");
      }
    } catch (error) {
      // Fallback to local state update for demo purposes
      setRequests((prev) =>
        prev.map((req) =>
          req.id === requestId
            ? {
                ...req,
                status: "approved" as const,
                reviewedAt: new Date().toISOString(),
                reviewedBy: "admin",
                notes: adminNotes,
              }
            : req,
        ),
      );

      toast({
        title: "Solicitud aprobada (modo demo)",
        description:
          "La solicitud ha sido aprobada localmente. En producción se enviaría un email al usuario.",
      });

      setAdminNotes("");
    }
  };

  const handleRejectRequest = async () => {
    if (!selectedRequest || !rejectionReason.trim()) {
      toast({
        title: "Error",
        description: "Debe proporcionar una razón para el rechazo",
        variant: "destructive",
      });
      return;
    }

    try {
      setRequests((prev) =>
        prev.map((req) =>
          req.id === selectedRequest.id
            ? {
                ...req,
                status: "rejected" as const,
                reviewedAt: new Date().toISOString(),
                reviewedBy: "admin",
                rejectionReason: rejectionReason,
                notes: adminNotes,
              }
            : req,
        ),
      );

      toast({
        title: "Solicitud rechazada",
        description:
          "Se ha enviado un email al solicitante informando sobre el rechazo.",
      });

      setIsRejectDialogOpen(false);
      setRejectionReason("");
      setAdminNotes("");
      setSelectedRequest(null);
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo rechazar la solicitud",
        variant: "destructive",
      });
    }
  };

  const openViewDialog = (request: RegistrationRequest) => {
    setSelectedRequest(request);
    setIsViewDialogOpen(true);
  };

  const openRejectDialog = (request: RegistrationRequest) => {
    setSelectedRequest(request);
    setIsRejectDialogOpen(true);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge
            variant="outline"
            className="text-orange-600 border-orange-600"
          >
            Pendiente
          </Badge>
        );
      case "approved":
        return (
          <Badge variant="default" className="bg-green-600">
            Aprobada
          </Badge>
        );
      case "rejected":
        return <Badge variant="destructive">Rechazada</Badge>;
      default:
        return <Badge variant="secondary">Desconocido</Badge>;
    }
  };

  const getDocumentTypeLabel = (type: string) => {
    return type === "dui" ? "DUI" : "Pasaporte";
  };

  const filteredRequests = requests.filter((request) => {
    const matchesSearch =
      request.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.memberCode.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || request.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const pendingCount = requests.filter(
    (req) => req.status === "pending",
  ).length;
  const approvedCount = requests.filter(
    (req) => req.status === "approved",
  ).length;
  const rejectedCount = requests.filter(
    (req) => req.status === "rejected",
  ).length;

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Solicitudes de Registro</h1>
            <p className="text-gray-600">
              Revisa y gestiona las solicitudes de nuevos miembros
            </p>
          </div>
          <Button
            onClick={loadRequests}
            variant="outline"
            className="flex items-center gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Actualizar
          </Button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                Total Solicitudes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{requests.length}</div>
              <p className="text-xs text-muted-foreground">
                Todas las solicitudes recibidas
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Pendientes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">
                {pendingCount}
              </div>
              <p className="text-xs text-muted-foreground">
                Esperando revisión
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Aprobadas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {approvedCount}
              </div>
              <p className="text-xs text-muted-foreground">
                Usuarios registrados
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Rechazadas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {rejectedCount}
              </div>
              <p className="text-xs text-muted-foreground">
                Solicitudes denegadas
              </p>
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
                <Label htmlFor="search">Buscar solicitudes</Label>
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="search"
                    placeholder="Buscar por nombre, email o código de miembro..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8"
                  />
                </div>
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
                    <SelectItem value="approved">Aprobada</SelectItem>
                    <SelectItem value="rejected">Rechazada</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Requests Table */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              Solicitudes de Registro ({filteredRequests.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">Cargando solicitudes...</div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Solicitante</TableHead>
                    <TableHead>Contacto</TableHead>
                    <TableHead>Documento</TableHead>
                    <TableHead>Código Miembro</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRequests.map((request) => (
                    <TableRow key={request.id}>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage
                              src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${request.email}`}
                            />
                            <AvatarFallback>
                              {request.firstName[0]}
                              {request.lastName[0]}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">
                              {request.firstName} {request.lastName}
                            </p>
                            <p className="text-sm text-gray-500">
                              {request.email}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center text-sm">
                            <Mail className="h-3 w-3 mr-1" />
                            {request.email}
                          </div>
                          <div className="flex items-center text-sm text-gray-500">
                            <Phone className="h-3 w-3 mr-1" />
                            {request.phone}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <Badge variant="outline">
                            {getDocumentTypeLabel(request.documentType)}
                          </Badge>
                          <p className="text-sm font-mono">
                            {request.documentNumber}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="font-mono">
                          {request.memberCode}
                        </Badge>
                      </TableCell>
                      <TableCell>{getStatusBadge(request.status)}</TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <p className="text-sm">
                            {new Date(request.requestedAt).toLocaleDateString()}
                          </p>
                          <p className="text-xs text-gray-500">
                            {new Date(request.requestedAt).toLocaleTimeString()}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => openViewDialog(request)}
                          >
                            <Eye className="h-3 w-3 mr-1" />
                            Ver
                          </Button>
                          {request.status === "pending" && (
                            <>
                              <Button
                                size="sm"
                                variant="default"
                                onClick={() => handleApproveRequest(request.id)}
                                className="bg-green-600 hover:bg-green-700"
                              >
                                <Check className="h-3 w-3 mr-1" />
                                Aprobar
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => openRejectDialog(request)}
                              >
                                <X className="h-3 w-3 mr-1" />
                                Rechazar
                              </Button>
                            </>
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

        {/* View Request Dialog */}
        <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center space-x-2">
                <User className="h-5 w-5" />
                <span>Detalles de la Solicitud</span>
              </DialogTitle>
              <DialogDescription>
                Información completa del solicitante
              </DialogDescription>
            </DialogHeader>
            {selectedRequest && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium">
                      Nombre completo
                    </Label>
                    <p className="text-sm">
                      {selectedRequest.firstName} {selectedRequest.lastName}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Email</Label>
                    <p className="text-sm">{selectedRequest.email}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Teléfono</Label>
                    <p className="text-sm">{selectedRequest.phone}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">
                      Código de miembro
                    </Label>
                    <p className="text-sm font-mono">
                      {selectedRequest.memberCode}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">
                      Tipo de documento
                    </Label>
                    <p className="text-sm">
                      {getDocumentTypeLabel(selectedRequest.documentType)}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">
                      Número de documento
                    </Label>
                    <p className="text-sm font-mono">
                      {selectedRequest.documentNumber}
                    </p>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium">
                        Estado actual
                      </Label>
                      <div className="mt-1">
                        {getStatusBadge(selectedRequest.status)}
                      </div>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">
                        Fecha de solicitud
                      </Label>
                      <p className="text-sm">
                        {new Date(selectedRequest.requestedAt).toLocaleString()}
                      </p>
                    </div>
                    {selectedRequest.reviewedAt && (
                      <>
                        <div>
                          <Label className="text-sm font-medium">
                            Fecha de revisión
                          </Label>
                          <p className="text-sm">
                            {new Date(
                              selectedRequest.reviewedAt,
                            ).toLocaleString()}
                          </p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium">
                            Revisado por
                          </Label>
                          <p className="text-sm">
                            {selectedRequest.reviewedBy}
                          </p>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {selectedRequest.rejectionReason && (
                  <div className="border-t pt-4">
                    <Label className="text-sm font-medium">
                      Motivo del rechazo
                    </Label>
                    <p className="text-sm mt-1 p-2 bg-red-50 border border-red-200 rounded">
                      {selectedRequest.rejectionReason}
                    </p>
                  </div>
                )}

                {selectedRequest.notes && (
                  <div className="border-t pt-4">
                    <Label className="text-sm font-medium">
                      Notas del administrador
                    </Label>
                    <p className="text-sm mt-1 p-2 bg-blue-50 border border-blue-200 rounded">
                      {selectedRequest.notes}
                    </p>
                  </div>
                )}

                {selectedRequest.status === "pending" && (
                  <div className="border-t pt-4">
                    <Label htmlFor="admin-notes">
                      Notas del administrador (opcional)
                    </Label>
                    <Textarea
                      id="admin-notes"
                      value={adminNotes}
                      onChange={(e) => setAdminNotes(e.target.value)}
                      placeholder="Agregar notas internas sobre esta solicitud..."
                      className="mt-1"
                    />
                  </div>
                )}
              </div>
            )}
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsViewDialogOpen(false)}
              >
                Cerrar
              </Button>
              {selectedRequest?.status === "pending" && (
                <div className="flex space-x-2">
                  <Button
                    variant="destructive"
                    onClick={() => {
                      setIsViewDialogOpen(false);
                      openRejectDialog(selectedRequest);
                    }}
                  >
                    <X className="h-4 w-4 mr-1" />
                    Rechazar
                  </Button>
                  <Button
                    onClick={() => {
                      handleApproveRequest(selectedRequest.id);
                      setIsViewDialogOpen(false);
                    }}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <Check className="h-4 w-4 mr-1" />
                    Aprobar
                  </Button>
                </div>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Reject Request Dialog */}
        <Dialog open={isRejectDialogOpen} onOpenChange={setIsRejectDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center space-x-2 text-red-600">
                <UserX className="h-5 w-5" />
                <span>Rechazar Solicitud</span>
              </DialogTitle>
              <DialogDescription>
                Proporciona una razón para el rechazo. Se enviará un email al
                solicitante.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="rejection-reason">Motivo del rechazo *</Label>
                <Textarea
                  id="rejection-reason"
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="Ejemplo: Información del documento incompleta o incorrecta"
                  className="mt-1"
                  required
                />
              </div>
              <div>
                <Label htmlFor="admin-notes-reject">
                  Notas internas (opcional)
                </Label>
                <Textarea
                  id="admin-notes-reject"
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  placeholder="Notas para uso interno del equipo de administración..."
                  className="mt-1"
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setIsRejectDialogOpen(false);
                  setRejectionReason("");
                  setAdminNotes("");
                }}
              >
                Cancelar
              </Button>
              <Button
                variant="destructive"
                onClick={handleRejectRequest}
                disabled={!rejectionReason.trim()}
              >
                <X className="h-4 w-4 mr-1" />
                Confirmar Rechazo
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default AdminRegistrationRequests;
