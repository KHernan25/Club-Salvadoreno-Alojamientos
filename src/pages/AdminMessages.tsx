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
import { toast } from "@/hooks/use-toast";
import {
  MessageSquare,
  Search,
  Eye,
  Reply,
  Trash2,
  Archive,
  Clock,
  Mail,
  Phone,
  User,
  Star,
} from "lucide-react";
import AdminLayout from "@/components/AdminLayout";
import { hasPermission } from "@/lib/auth-service";

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  status: "unread" | "read" | "replied" | "archived";
  priority: "low" | "medium" | "high";
  createdAt: string;
  repliedAt?: string;
  repliedBy?: string;
  replyMessage?: string;
}

const AdminMessages = () => {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(
    null,
  );
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isReplyDialogOpen, setIsReplyDialogOpen] = useState(false);
  const [replyMessage, setReplyMessage] = useState("");

  useEffect(() => {
    loadMessages();
  }, []);

  const loadMessages = async () => {
    try {
      setLoading(true);
      // Mock messages data - in real app would come from API
      setMessages(getMockMessages());
    } catch (error) {
      console.error("Error loading messages:", error);
    } finally {
      setLoading(false);
    }
  };

  const getMockMessages = (): ContactMessage[] => [
    {
      id: "1",
      name: "María González",
      email: "maria.gonzalez@email.com",
      phone: "+503 7890-1234",
      subject: "Consulta sobre disponibilidad",
      message:
        "Hola, me gustaría saber si tienen disponibilidad para 4 personas del 15 al 17 de febrero en El Sunzal. Muchas gracias.",
      status: "unread",
      priority: "medium",
      createdAt: "2024-01-15T14:30:00Z",
    },
    {
      id: "2",
      name: "Carlos Méndez",
      email: "carlos.mendez@email.com",
      phone: "+503 6789-0123",
      subject: "Problema con reserva",
      message:
        "Tengo un problema con mi reserva #ABC123. No recibí el correo de confirmación y necesito urgente el código.",
      status: "replied",
      priority: "high",
      createdAt: "2024-01-14T09:15:00Z",
      repliedAt: "2024-01-14T10:30:00Z",
      repliedBy: "Atención al Cliente",
      replyMessage:
        "Hola Carlos, hemos reenviado tu confirmación al correo registrado. Por favor revisa tu bandeja de entrada y spam.",
    },
    {
      id: "3",
      name: "Ana Rodríguez",
      email: "ana.rodriguez@email.com",
      phone: "+503 5678-9012",
      subject: "Solicitud de información",
      message:
        "¿Podrían enviarme información sobre los servicios incluidos en las suites premium? Estoy planeando una celebración especial.",
      status: "read",
      priority: "low",
      createdAt: "2024-01-13T16:45:00Z",
    },
    {
      id: "4",
      name: "Roberto Silva",
      email: "roberto.silva@email.com",
      phone: "+503 4567-8901",
      subject: "Cancelación de reserva",
      message:
        "Necesito cancelar mi reserva para el próximo fin de semana por motivos familiares. Código de reserva: DEF456",
      status: "unread",
      priority: "high",
      createdAt: "2024-01-15T11:20:00Z",
    },
    {
      id: "5",
      name: "Isabel Torres",
      email: "isabel.torres@email.com",
      phone: "+503 3456-7890",
      subject: "Felicitaciones",
      message:
        "Quería felicitarlos por el excelente servicio durante nuestra estadía en Corinto. Todo estuvo perfecto, gracias!",
      status: "archived",
      priority: "low",
      createdAt: "2024-01-12T18:00:00Z",
    },
  ];

  const handleMarkAsRead = async (messageId: string) => {
    try {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === messageId ? { ...msg, status: "read" } : msg,
        ),
      );
      toast({
        title: "Mensaje marcado como leído",
        description: "El estado del mensaje ha sido actualizado.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo actualizar el mensaje.",
        variant: "destructive",
      });
    }
  };

  const handleReply = async (messageId: string) => {
    try {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === messageId
            ? {
                ...msg,
                status: "replied",
                repliedAt: new Date().toISOString(),
                repliedBy: "Administrador",
                replyMessage: replyMessage,
              }
            : msg,
        ),
      );
      toast({
        title: "Respuesta enviada",
        description: "Tu respuesta ha sido enviada al cliente.",
      });
      setIsReplyDialogOpen(false);
      setSelectedMessage(null);
      setReplyMessage("");
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo enviar la respuesta.",
        variant: "destructive",
      });
    }
  };

  const handleArchive = async (messageId: string) => {
    try {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === messageId ? { ...msg, status: "archived" } : msg,
        ),
      );
      toast({
        title: "Mensaje archivado",
        description: "El mensaje ha sido movido al archivo.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo archivar el mensaje.",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (messageId: string) => {
    try {
      setMessages((prev) => prev.filter((msg) => msg.id !== messageId));
      toast({
        title: "Mensaje eliminado",
        description: "El mensaje ha sido eliminado permanentemente.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo eliminar el mensaje.",
        variant: "destructive",
      });
    }
  };

  const filteredMessages = (messages || []).filter((message) => {
    const matchesSearch =
      message.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.message.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || message.status === statusFilter;

    const matchesPriority =
      priorityFilter === "all" || message.priority === priorityFilter;

    return matchesSearch && matchesStatus && matchesPriority;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "unread":
        return <Badge variant="destructive">No leído</Badge>;
      case "read":
        return <Badge variant="outline">Leído</Badge>;
      case "replied":
        return (
          <Badge variant="default" className="bg-blue-600">
            Respondido
          </Badge>
        );
      case "archived":
        return <Badge variant="secondary">Archivado</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "high":
        return <Badge variant="destructive">Alta</Badge>;
      case "medium":
        return <Badge variant="outline">Media</Badge>;
      case "low":
        return <Badge variant="secondary">Baja</Badge>;
      default:
        return <Badge variant="outline">{priority}</Badge>;
    }
  };

  if (!hasPermission("canManageMessages")) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <h2 className="text-xl font-semibold mb-2">Acceso Denegado</h2>
            <p className="text-gray-600">
              No tienes permisos para gestionar mensajes.
            </p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Gestión de Mensajes</h1>
            <p className="text-gray-600">
              Administra mensajes de contacto y consultas de clientes
            </p>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                Total Mensajes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{messages?.length || 0}</div>
              <p className="text-xs text-muted-foreground">
                Todos los mensajes
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Sin Leer</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {(messages || []).filter((m) => m.status === "unread").length}
              </div>
              <p className="text-xs text-muted-foreground">
                Requieren atención
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Respondidos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {(messages || []).filter((m) => m.status === "replied").length}
              </div>
              <p className="text-xs text-muted-foreground">Este mes</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                Alta Prioridad
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">
                {(messages || []).filter((m) => m.priority === "high").length}
              </div>
              <p className="text-xs text-muted-foreground">Urgentes</p>
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
                <Label htmlFor="search">Buscar mensajes</Label>
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="search"
                    placeholder="Buscar por nombre, email, asunto o contenido..."
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
                    <SelectItem value="unread">Sin leer</SelectItem>
                    <SelectItem value="read">Leído</SelectItem>
                    <SelectItem value="replied">Respondido</SelectItem>
                    <SelectItem value="archived">Archivado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="priority-filter">Prioridad</Label>
                <Select
                  value={priorityFilter}
                  onValueChange={setPriorityFilter}
                >
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Todas las prioridades" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas las prioridades</SelectItem>
                    <SelectItem value="high">Alta</SelectItem>
                    <SelectItem value="medium">Media</SelectItem>
                    <SelectItem value="low">Baja</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Messages Table */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              Lista de Mensajes ({filteredMessages.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">Cargando mensajes...</div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Remitente</TableHead>
                    <TableHead>Asunto</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Prioridad</TableHead>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredMessages.map((message) => (
                    <TableRow key={message.id}>
                      <TableCell>
                        <div className="space-y-1">
                          <p className="font-medium">{message.name}</p>
                          <div className="flex items-center space-x-1 text-sm text-gray-500">
                            <Mail className="h-3 w-3" />
                            <span>{message.email}</span>
                          </div>
                          {message.phone && (
                            <div className="flex items-center space-x-1 text-sm text-gray-500">
                              <Phone className="h-3 w-3" />
                              <span>{message.phone}</span>
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <p className="font-medium">{message.subject}</p>
                          <p className="text-sm text-gray-500 line-clamp-2">
                            {message.message.substring(0, 100)}...
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(message.status)}</TableCell>
                      <TableCell>
                        {getPriorityBadge(message.priority)}
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1 text-sm">
                          <p>
                            {new Date(message.createdAt).toLocaleDateString()}
                          </p>
                          <p className="text-gray-500">
                            {new Date(message.createdAt).toLocaleTimeString()}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setSelectedMessage(message);
                              setIsViewDialogOpen(true);
                              if (message.status === "unread") {
                                handleMarkAsRead(message.id);
                              }
                            }}
                            className="border-blue-600 text-blue-600 hover:bg-blue-50"
                          >
                            <Eye className="h-3 w-3 mr-1" />
                            Ver
                          </Button>
                          {message.status !== "replied" && (
                            <Button
                              size="sm"
                              variant="default"
                              onClick={() => {
                                setSelectedMessage(message);
                                setIsReplyDialogOpen(true);
                              }}
                              className="bg-blue-600 hover:bg-blue-700"
                            >
                              <Reply className="h-3 w-3 mr-1" />
                              Responder
                            </Button>
                          )}
                          {message.status !== "archived" && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleArchive(message.id)}
                            >
                              <Archive className="h-3 w-3 mr-1" />
                              Archivar
                            </Button>
                          )}
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button size="sm" variant="destructive">
                                <Trash2 className="h-3 w-3 mr-1" />
                                Eliminar
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>
                                  Eliminar Mensaje
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  ¿Estás seguro de que deseas eliminar este
                                  mensaje? Esta acción no se puede deshacer.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDelete(message.id)}
                                >
                                  Eliminar
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* View Message Dialog */}
        <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center space-x-2">
                <MessageSquare className="h-5 w-5 text-blue-600" />
                <span>Detalles del Mensaje</span>
              </DialogTitle>
            </DialogHeader>
            {selectedMessage && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Remitente</Label>
                    <p className="font-medium">{selectedMessage.name}</p>
                  </div>
                  <div>
                    <Label>Email</Label>
                    <p>{selectedMessage.email}</p>
                  </div>
                  <div>
                    <Label>Teléfono</Label>
                    <p>{selectedMessage.phone}</p>
                  </div>
                  <div>
                    <Label>Fecha</Label>
                    <p>
                      {new Date(selectedMessage.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
                <div>
                  <Label>Asunto</Label>
                  <p className="font-medium">{selectedMessage.subject}</p>
                </div>
                <div>
                  <Label>Mensaje</Label>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="whitespace-pre-wrap">
                      {selectedMessage.message}
                    </p>
                  </div>
                </div>
                {selectedMessage.replyMessage && (
                  <div>
                    <Label>Respuesta Enviada</Label>
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <p className="whitespace-pre-wrap">
                        {selectedMessage.replyMessage}
                      </p>
                      <p className="text-sm text-gray-500 mt-2">
                        Respondido por {selectedMessage.repliedBy} el{" "}
                        {selectedMessage.repliedAt &&
                          new Date(selectedMessage.repliedAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Reply Dialog */}
        <Dialog open={isReplyDialogOpen} onOpenChange={setIsReplyDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center space-x-2">
                <Reply className="h-5 w-5 text-blue-600" />
                <span>Responder Mensaje</span>
              </DialogTitle>
              <DialogDescription>
                Enviando respuesta a {selectedMessage?.name}
              </DialogDescription>
            </DialogHeader>
            {selectedMessage && (
              <div className="space-y-4">
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-sm font-medium">Mensaje original:</p>
                  <p className="text-sm mt-1">{selectedMessage.message}</p>
                </div>
                <div>
                  <Label htmlFor="reply-message">Tu Respuesta</Label>
                  <Textarea
                    id="reply-message"
                    rows={6}
                    value={replyMessage}
                    onChange={(e) => setReplyMessage(e.target.value)}
                    placeholder="Escribe tu respuesta aquí..."
                  />
                </div>
              </div>
            )}
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsReplyDialogOpen(false)}
              >
                Cancelar
              </Button>
              <Button
                onClick={() =>
                  selectedMessage && handleReply(selectedMessage.id)
                }
                disabled={!replyMessage.trim()}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Reply className="h-4 w-4 mr-2" />
                Enviar Respuesta
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default AdminMessages;
