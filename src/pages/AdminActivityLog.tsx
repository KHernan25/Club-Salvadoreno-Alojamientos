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
  DialogTrigger,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "@/hooks/use-toast";
import {
  Plus,
  FileText,
  Calendar,
  User,
  Trash2,
  AlertCircle,
  Clock,
} from "lucide-react";
import AdminLayout from "@/components/AdminLayout";
import { getCurrentUser, isSuperAdmin } from "@/lib/auth-service";
import {
  getActivityLogs,
  createActivityLogEntry,
  deleteActivityLogEntry,
  formatActivityLogDate,
  getRoleDisplayName,
  validateActivityContent,
  type ActivityLogEntry,
} from "@/lib/activity-log-service";

const AdminActivityLog = () => {
  const [activityLogs, setActivityLogs] = useState<ActivityLogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newActivityContent, setNewActivityContent] = useState("");
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const currentUser = getCurrentUser();
  const isSuper = isSuperAdmin();

  useEffect(() => {
    loadActivityLogs();
  }, []);

  const loadActivityLogs = async () => {
    try {
      setLoading(true);
      const logs = await getActivityLogs();
      setActivityLogs(logs);
    } catch (error) {
      console.error("Error loading activity logs:", error);
      toast({
        title: "Error",
        description: "No se pudieron cargar las entradas de actividad",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateActivity = async () => {
    const validationError = validateActivityContent(newActivityContent);
    if (validationError) {
      toast({
        title: "Error de validación",
        description: validationError,
        variant: "destructive",
      });
      return;
    }

    try {
      setSubmitting(true);
      const newEntry = await createActivityLogEntry({
        contenido: newActivityContent,
      });

      setActivityLogs((prev) => [newEntry, ...prev]);
      setNewActivityContent("");
      setIsAddDialogOpen(false);

      toast({
        title: "¡Actividad agregada!",
        description: "La entrada de actividad se ha creado exitosamente",
      });
    } catch (error) {
      console.error("Error creating activity:", error);
      toast({
        title: "Error",
        description: "No se pudo crear la entrada de actividad",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteActivity = async (id: string) => {
    try {
      await deleteActivityLogEntry(id);
      setActivityLogs((prev) => prev.filter((log) => log.id !== id));
      setDeleteConfirmId(null);

      toast({
        title: "Entrada eliminada",
        description: "La entrada de actividad se ha eliminado exitosamente",
      });
    } catch (error) {
      console.error("Error deleting activity:", error);
      toast({
        title: "Error",
        description: "No se pudo eliminar la entrada de actividad",
        variant: "destructive",
      });
    }
  };

  const groupLogsByDate = (logs: ActivityLogEntry[]) => {
    const groups: { [key: string]: ActivityLogEntry[] } = {};

    logs.forEach((log) => {
      const date = new Date(log.fecha);
      const dateKey = date.toDateString();

      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(log);
    });

    return Object.entries(groups).sort(
      ([a], [b]) => new Date(b).getTime() - new Date(a).getTime(),
    );
  };

  const formatGroupDate = (dateString: string): string => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return "Hoy";
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Ayer";
    } else {
      return date.toLocaleDateString("es-ES", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
            <p className="text-slate-600 text-sm">
              Cargando bitácora de actividades...
            </p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  const groupedLogs = groupLogsByDate(activityLogs);

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Bitácora del Día
            </h1>
            <p className="text-gray-600">
              Registro de actividades diarias del equipo
            </p>
          </div>

          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="mr-2 h-4 w-4" />
                Agregar Actividad
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[525px]">
              <DialogHeader>
                <DialogTitle>Nueva Entrada de Actividad</DialogTitle>
                <DialogDescription>
                  Agrega una nota sobre las actividades realizadas hoy.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="content">Descripción de la actividad</Label>
                  <Textarea
                    id="content"
                    placeholder="Describe las actividades realizadas, tareas completadas, eventos importantes del día..."
                    value={newActivityContent}
                    onChange={(e) => setNewActivityContent(e.target.value)}
                    className="min-h-[120px]"
                    maxLength={1000}
                  />
                  <div className="text-xs text-gray-500 text-right">
                    {newActivityContent.length}/1000 caracteres
                  </div>
                </div>

                <div className="bg-blue-50 p-3 rounded-lg">
                  <div className="flex items-start space-x-2">
                    <Calendar className="h-4 w-4 text-blue-600 mt-0.5" />
                    <div className="text-sm">
                      <p className="font-medium text-blue-900">
                        Fecha: {new Date().toLocaleDateString("es-ES")}
                      </p>
                      <p className="text-blue-700">
                        Usuario: {currentUser?.firstName}{" "}
                        {currentUser?.lastName}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsAddDialogOpen(false)}
                  disabled={submitting}
                >
                  Cancelar
                </Button>
                <Button
                  onClick={handleCreateActivity}
                  disabled={submitting || !newActivityContent.trim()}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {submitting ? "Guardando..." : "Guardar Actividad"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Entradas
              </CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activityLogs.length}</div>
              <p className="text-xs text-muted-foreground">
                {isSuper ? "Todas las entradas" : "Tus entradas"}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Hoy</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {
                  activityLogs.filter((log) => {
                    const logDate = new Date(log.fecha);
                    const today = new Date();
                    return logDate.toDateString() === today.toDateString();
                  }).length
                }
              </div>
              <p className="text-xs text-muted-foreground">
                Actividades registradas
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {isSuper ? "Colaboradores" : "Mi Perfil"}
              </CardTitle>
              <User className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {isSuper
                  ? new Set(activityLogs.map((log) => log.usuarioId)).size
                  : 1}
              </div>
              <p className="text-xs text-muted-foreground">
                {isSuper
                  ? "Usuarios activos"
                  : getRoleDisplayName(currentUser?.role || "")}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Activity Logs */}
        <div className="space-y-6">
          {groupedLogs.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <FileText className="h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No hay actividades registradas
                </h3>
                <p className="text-gray-600 text-center mb-4">
                  Comienza agregando una nueva entrada de actividad para el día
                  de hoy.
                </p>
                <Button
                  onClick={() => setIsAddDialogOpen(true)}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Agregar Primera Actividad
                </Button>
              </CardContent>
            </Card>
          ) : (
            groupedLogs.map(([dateKey, logs]) => (
              <div key={dateKey} className="space-y-4">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                  <Calendar className="mr-2 h-5 w-5 text-blue-600" />
                  {formatGroupDate(dateKey)}
                  <Badge variant="secondary" className="ml-2">
                    {logs.length} {logs.length === 1 ? "entrada" : "entradas"}
                  </Badge>
                </h2>

                <div className="space-y-3">
                  {logs.map((log) => (
                    <Card key={log.id} className="border-l-4 border-l-blue-500">
                      <CardContent className="pt-4">
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex items-center space-x-3">
                            <Avatar className="h-8 w-8">
                              <AvatarImage
                                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${log.usuario?.email || log.usuarioId}`}
                              />
                              <AvatarFallback>
                                {log.usuario?.firstName?.[0] || "U"}
                                {log.usuario?.lastName?.[0] || ""}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium text-gray-900">
                                {log.usuario
                                  ? `${log.usuario.firstName} ${log.usuario.lastName}`
                                  : `Usuario ${log.usuarioId}`}
                              </p>
                              <div className="flex items-center space-x-2 text-sm text-gray-600">
                                <Badge variant="outline" className="text-xs">
                                  {getRoleDisplayName(log.usuario?.role || "")}
                                </Badge>
                                <span>•</span>
                                <span>{formatActivityLogDate(log.fecha)}</span>
                              </div>
                            </div>
                          </div>

                          {isSuper && (
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                  onClick={() => setDeleteConfirmId(log.id)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle className="flex items-center">
                                    <AlertCircle className="mr-2 h-5 w-5 text-red-600" />
                                    Confirmar Eliminación
                                  </DialogTitle>
                                  <DialogDescription>
                                    ¿Estás seguro de que quieres eliminar esta
                                    entrada de actividad? Esta acción no se
                                    puede deshacer.
                                  </DialogDescription>
                                </DialogHeader>
                                <DialogFooter>
                                  <Button
                                    variant="outline"
                                    onClick={() => setDeleteConfirmId(null)}
                                  >
                                    Cancelar
                                  </Button>
                                  <Button
                                    variant="destructive"
                                    onClick={() => handleDeleteActivity(log.id)}
                                  >
                                    Eliminar
                                  </Button>
                                </DialogFooter>
                              </DialogContent>
                            </Dialog>
                          )}
                        </div>

                        <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                          {log.contenido}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminActivityLog;
