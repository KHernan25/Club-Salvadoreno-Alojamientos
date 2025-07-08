import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "@/hooks/use-toast";
import {
  Bell,
  Search,
  Filter,
  MoreVertical,
  Eye,
  Trash2,
  Archive,
  Download,
  CheckCheck,
  Mail,
  Smartphone,
  MessageSquare,
  Calendar,
  AlertTriangle,
  Info,
  CheckCircle,
} from "lucide-react";
import Layout from "@/components/Layout";
import { alertService, type AlertData } from "@/lib/alert-service";
import { cn } from "@/lib/utils";

const NotificationHistory = () => {
  const [notifications, setNotifications] = useState<AlertData[]>([]);
  const [filteredNotifications, setFilteredNotifications] = useState<
    AlertData[]
  >([]);
  const [selectedNotification, setSelectedNotification] =
    useState<AlertData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [severityFilter, setSeverityFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateRange, setDateRange] = useState("all");
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);

  const currentUserId = "user-123"; // Would come from auth context

  useEffect(() => {
    loadNotifications();
  }, []);

  useEffect(() => {
    filterNotifications();
  }, [
    notifications,
    searchTerm,
    typeFilter,
    severityFilter,
    statusFilter,
    dateRange,
  ]);

  const loadNotifications = async () => {
    try {
      setIsLoading(true);
      const alerts = await alertService.getAlerts(currentUserId, 100);
      setNotifications(alerts);
    } catch (error) {
      console.error("Error loading notifications:", error);
      toast({
        title: "Error",
        description: "No se pudieron cargar las notificaciones",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const filterNotifications = () => {
    let filtered = [...notifications];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (notification) =>
          notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          notification.message
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          notification.data.reservationId
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()),
      );
    }

    // Type filter
    if (typeFilter !== "all") {
      filtered = filtered.filter(
        (notification) => notification.type === typeFilter,
      );
    }

    // Severity filter
    if (severityFilter !== "all") {
      filtered = filtered.filter(
        (notification) => notification.severity === severityFilter,
      );
    }

    // Status filter
    if (statusFilter !== "all") {
      const isRead = statusFilter === "read";
      filtered = filtered.filter(
        (notification) => notification.read === isRead,
      );
    }

    // Date range filter
    if (dateRange !== "all") {
      const now = new Date();
      let cutoffDate: Date;

      switch (dateRange) {
        case "today":
          cutoffDate = new Date(
            now.getFullYear(),
            now.getMonth(),
            now.getDate(),
          );
          break;
        case "week":
          cutoffDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case "month":
          cutoffDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          break;
        default:
          cutoffDate = new Date(0);
      }

      filtered = filtered.filter(
        (notification) => new Date(notification.timestamp) >= cutoffDate,
      );
    }

    setFilteredNotifications(filtered);
  };

  const markAsRead = async (notificationId: string) => {
    try {
      const success = await alertService.markAlertAsRead(notificationId);
      if (success) {
        setNotifications((prev) =>
          prev.map((notification) =>
            notification.id === notificationId
              ? { ...notification, read: true }
              : notification,
          ),
        );
        toast({
          title: "Notificación marcada como leída",
          description: "La notificación ha sido marcada como leída",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo marcar la notificación como leída",
        variant: "destructive",
      });
    }
  };

  const markAllAsRead = async () => {
    try {
      const unreadNotifications = filteredNotifications.filter((n) => !n.read);

      for (const notification of unreadNotifications) {
        await alertService.markAlertAsRead(notification.id);
      }

      setNotifications((prev) =>
        prev.map((notification) => ({ ...notification, read: true })),
      );

      toast({
        title: "Todas las notificaciones marcadas como leídas",
        description: `${unreadNotifications.length} notificaciones marcadas como leídas`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudieron marcar las notificaciones como leídas",
        variant: "destructive",
      });
    }
  };

  const deleteNotification = async (notificationId: string) => {
    try {
      // In real implementation, this would call an API
      setNotifications((prev) =>
        prev.filter((notification) => notification.id !== notificationId),
      );
      toast({
        title: "Notificación eliminada",
        description: "La notificación ha sido eliminada",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo eliminar la notificación",
        variant: "destructive",
      });
    }
  };

  const exportNotifications = () => {
    try {
      const exportData = filteredNotifications.map((notification) => ({
        id: notification.id,
        tipo: getTypeLabel(notification.type),
        titulo: notification.title,
        mensaje: notification.message,
        severidad: getSeverityLabel(notification.severity),
        fecha: new Date(notification.timestamp).toLocaleString("es-ES"),
        leida: notification.read ? "Sí" : "No",
        reserva: notification.data.reservationId || "",
        alojamiento: notification.data.accommodationName || "",
      }));

      const csvContent = [
        Object.keys(exportData[0]).join(","),
        ...exportData.map((row) => Object.values(row).join(",")),
      ].join("\n");

      const blob = new Blob([csvContent], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `notificaciones-${new Date().toISOString().split("T")[0]}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);

      toast({
        title: "Exportación exitosa",
        description: "Las notificaciones han sido exportadas",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudieron exportar las notificaciones",
        variant: "destructive",
      });
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "critical":
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case "high":
        return <AlertTriangle className="h-4 w-4 text-orange-500" />;
      case "medium":
        return <Info className="h-4 w-4 text-blue-500" />;
      case "low":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      default:
        return <Bell className="h-4 w-4" />;
    }
  };

  const getSeverityLabel = (severity: string) => {
    const labels = {
      critical: "Crítico",
      high: "Alto",
      medium: "Medio",
      low: "Bajo",
    };
    return labels[severity as keyof typeof labels] || severity;
  };

  const getTypeLabel = (type: string) => {
    const labels = {
      reservation_cancelled: "Reserva Cancelada",
      reservation_modified: "Reserva Modificada",
      payment_failed: "Pago Fallido",
      payment_overdue: "Pago Vencido",
      payment_successful: "Pago Exitoso",
      booking_confirmed: "Reserva Confirmada",
      check_in_reminder: "Recordatorio Check-in",
      check_out_reminder: "Recordatorio Check-out",
      host_unavailable: "Anfitrión No Disponible",
      system_maintenance: "Mantenimiento del Sistema",
    };
    return labels[type as keyof typeof labels] || type;
  };

  const getChannelIcons = (channels: string[]) => {
    return channels.map((channel) => {
      switch (channel) {
        case "email":
          return <Mail key={channel} className="h-3 w-3" />;
        case "push":
          return <Smartphone key={channel} className="h-3 w-3" />;
        case "sms":
          return <MessageSquare key={channel} className="h-3 w-3" />;
        default:
          return <Bell key={channel} className="h-3 w-3" />;
      }
    });
  };

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMinutes = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60),
    );

    if (diffInMinutes < 60) {
      return `${diffInMinutes}min`;
    } else if (diffInMinutes < 1440) {
      return `${Math.floor(diffInMinutes / 60)}h`;
    } else {
      return date.toLocaleDateString("es-ES", {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    }
  };

  const unreadCount = filteredNotifications.filter((n) => !n.read).length;

  return (
    <Layout>
      <div className="container mx-auto p-6">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">
                Historial de Notificaciones
              </h1>
              <p className="text-muted-foreground">
                Gestiona y revisa todas tus notificaciones
              </p>
            </div>
            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <Button variant="outline" onClick={markAllAsRead}>
                  <CheckCheck className="h-4 w-4 mr-2" />
                  Marcar todas como leídas ({unreadCount})
                </Button>
              )}
              <Button variant="outline" onClick={exportNotifications}>
                <Download className="h-4 w-4 mr-2" />
                Exportar
              </Button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{notifications.length}</div>
                <p className="text-xs text-muted-foreground">
                  Todas las notificaciones
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Sin Leer</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">
                  {notifications.filter((n) => !n.read).length}
                </div>
                <p className="text-xs text-muted-foreground">
                  Requieren atención
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  Esta Semana
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">
                  {
                    notifications.filter(
                      (n) =>
                        new Date(n.timestamp) >
                        new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
                    ).length
                  }
                </div>
                <p className="text-xs text-muted-foreground">Últimos 7 días</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Críticas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-600">
                  {
                    notifications.filter((n) => n.severity === "critical")
                      .length
                  }
                </div>
                <p className="text-xs text-muted-foreground">Alta prioridad</p>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Filter className="h-5 w-5" />
                Filtros
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar notificaciones..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8"
                  />
                </div>
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos los tipos</SelectItem>
                    <SelectItem value="reservation_cancelled">
                      Reserva Cancelada
                    </SelectItem>
                    <SelectItem value="payment_failed">Pago Fallido</SelectItem>
                    <SelectItem value="booking_confirmed">
                      Reserva Confirmada
                    </SelectItem>
                    <SelectItem value="check_in_reminder">
                      Recordatorio Check-in
                    </SelectItem>
                  </SelectContent>
                </Select>
                <Select
                  value={severityFilter}
                  onValueChange={setSeverityFilter}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Severidad" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas las severidades</SelectItem>
                    <SelectItem value="critical">Crítico</SelectItem>
                    <SelectItem value="high">Alto</SelectItem>
                    <SelectItem value="medium">Medio</SelectItem>
                    <SelectItem value="low">Bajo</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Estado" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos los estados</SelectItem>
                    <SelectItem value="unread">Sin leer</SelectItem>
                    <SelectItem value="read">Leídas</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={dateRange} onValueChange={setDateRange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Fecha" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas las fechas</SelectItem>
                    <SelectItem value="today">Hoy</SelectItem>
                    <SelectItem value="week">Esta semana</SelectItem>
                    <SelectItem value="month">Este mes</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Notifications Table */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">
                Notificaciones ({filteredNotifications.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="text-center py-8">
                  <Bell className="h-8 w-8 mx-auto text-muted-foreground animate-pulse" />
                  <p className="text-muted-foreground mt-2">
                    Cargando notificaciones...
                  </p>
                </div>
              ) : filteredNotifications.length === 0 ? (
                <div className="text-center py-8">
                  <Bell className="h-8 w-8 mx-auto text-muted-foreground" />
                  <p className="text-muted-foreground mt-2">
                    No hay notificaciones que coincidan con los filtros
                  </p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Estado</TableHead>
                      <TableHead>Tipo / Severidad</TableHead>
                      <TableHead>Mensaje</TableHead>
                      <TableHead>Canales</TableHead>
                      <TableHead>Fecha</TableHead>
                      <TableHead>Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredNotifications.map((notification) => (
                      <TableRow
                        key={notification.id}
                        className={cn(
                          !notification.read && "bg-accent/50",
                          "cursor-pointer",
                        )}
                        onClick={() => {
                          setSelectedNotification(notification);
                          setIsDetailDialogOpen(true);
                          if (!notification.read) {
                            markAsRead(notification.id);
                          }
                        }}
                      >
                        <TableCell>
                          {notification.read ? (
                            <CheckCheck className="h-4 w-4 text-green-500" />
                          ) : (
                            <Bell className="h-4 w-4 text-orange-500" />
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="flex items-center gap-1">
                              {getSeverityIcon(notification.severity)}
                              <Badge
                                variant={
                                  notification.severity === "critical"
                                    ? "destructive"
                                    : "outline"
                                }
                              >
                                {getSeverityLabel(notification.severity)}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {getTypeLabel(notification.type)}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="max-w-md">
                            <p className="font-medium">{notification.title}</p>
                            <p className="text-sm text-muted-foreground line-clamp-2">
                              {notification.message}
                            </p>
                            {notification.data.reservationId && (
                              <Badge variant="outline" className="mt-1">
                                {notification.data.reservationId}
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            {getChannelIcons(notification.channels)}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            {formatDate(notification.timestamp)}
                          </div>
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedNotification(notification);
                                  setIsDetailDialogOpen(true);
                                }}
                              >
                                <Eye className="h-4 w-4 mr-2" />
                                Ver detalles
                              </DropdownMenuItem>
                              {!notification.read && (
                                <DropdownMenuItem
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    markAsRead(notification.id);
                                  }}
                                >
                                  <CheckCheck className="h-4 w-4 mr-2" />
                                  Marcar como leída
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={(e) => {
                                  e.stopPropagation();
                                  deleteNotification(notification.id);
                                }}
                                className="text-red-600"
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Eliminar
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Notification Detail Dialog */}
        <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                {selectedNotification &&
                  getSeverityIcon(selectedNotification.severity)}
                Detalles de la Notificación
              </DialogTitle>
              <DialogDescription>
                {selectedNotification &&
                  getTypeLabel(selectedNotification.type)}
              </DialogDescription>
            </DialogHeader>
            {selectedNotification && (
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Mensaje</h4>
                  <div className="bg-muted p-3 rounded-lg">
                    <p className="font-medium">{selectedNotification.title}</p>
                    <p className="text-sm mt-1">
                      {selectedNotification.message}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium mb-2">Fecha</h4>
                    <p className="text-sm">
                      {new Date(selectedNotification.timestamp).toLocaleString(
                        "es-ES",
                      )}
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Estado</h4>
                    <Badge
                      variant={
                        selectedNotification.read ? "outline" : "default"
                      }
                    >
                      {selectedNotification.read ? "Leída" : "Sin leer"}
                    </Badge>
                  </div>
                </div>

                {selectedNotification.data.actions &&
                  selectedNotification.data.actions.length > 0 && (
                    <div>
                      <h4 className="font-medium mb-2">Acciones</h4>
                      <div className="flex gap-2">
                        {selectedNotification.data.actions.map(
                          (action, index) => (
                            <Button
                              key={index}
                              variant={
                                action.type === "primary"
                                  ? "default"
                                  : "outline"
                              }
                              size="sm"
                              onClick={() => {
                                window.open(action.url, "_blank");
                              }}
                            >
                              {action.label}
                            </Button>
                          ),
                        )}
                      </div>
                    </div>
                  )}

                <div>
                  <h4 className="font-medium mb-2">Canales de Envío</h4>
                  <div className="flex gap-2">
                    {selectedNotification.channels.map((channel) => (
                      <Badge key={channel} variant="outline">
                        {channel.charAt(0).toUpperCase() + channel.slice(1)}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
};

export default NotificationHistory;
