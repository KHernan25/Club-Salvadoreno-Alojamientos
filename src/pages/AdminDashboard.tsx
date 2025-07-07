import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Users,
  Building2,
  Calendar,
  DollarSign,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  CheckCircle,
  Clock,
  Eye,
} from "lucide-react";
import { Link } from "react-router-dom";
import AdminLayout from "@/components/AdminLayout";
import {
  apiGetUserStats,
  apiGetReservationStats,
  isApiAvailable,
} from "@/lib/api-service";

const AdminDashboard = () => {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [apiConnected, setApiConnected] = useState(false);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        // Temporalmente usar solo datos mock para evitar problemas de proxy
        // TODO: Restaurar API una vez que el proxy esté funcionando
        const USE_API = false;

        if (USE_API) {
          // Verificar conexión API
          const connected = await isApiAvailable();
          setApiConnected(connected);

          if (connected) {
            // Cargar estadísticas reales
            const [userStats, reservationStats] = await Promise.all([
              apiGetUserStats(),
              apiGetReservationStats(),
            ]);

            setStats({
              users: userStats,
              reservations: reservationStats,
            });
          } else {
            // Datos mock para desarrollo
            setStats(getMockStats());
          }
        } else {
          // Usar datos mock directamente
          setApiConnected(false);
          setStats(getMockStats());
        }
      } catch (error) {
        console.error("Error loading dashboard data:", error);
        setStats(getMockStats());
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  const getMockStats = () => ({
    users: {
      total: 156,
      pending: 3,
      active: 142,
      inactive: 11,
      newThisMonth: 12,
      growthRate: 8.5,
    },
    reservations: {
      total: 89,
      pending: 5,
      confirmed: 67,
      cancelled: 17,
      thisMonth: 23,
      revenue: 12450,
      occupancyRate: 72,
    },
  });

  const quickStats = [
    {
      title: "Usuarios Totales",
      value: stats?.users?.total || 0,
      change: `+${stats?.users?.newThisMonth || 0} este mes`,
      trend: "up",
      icon: Users,
      color: "blue",
    },
    {
      title: "Reservas Activas",
      value: stats?.reservations?.confirmed || 0,
      change: `${stats?.reservations?.occupancyRate || 0}% ocupación`,
      trend: "up",
      icon: Calendar,
      color: "green",
    },
    {
      title: "Ingresos del Mes",
      value: `$${stats?.reservations?.revenue?.toLocaleString() || 0}`,
      change: "+12.5% vs mes anterior",
      trend: "up",
      icon: DollarSign,
      color: "emerald",
    },
    {
      title: "Pendientes",
      value: (stats?.users?.pending || 0) + (stats?.reservations?.pending || 0),
      change: "Requieren atención",
      trend: "warning",
      icon: AlertCircle,
      color: "orange",
    },
  ];

  const recentActivities = [
    {
      id: 1,
      type: "user_registered",
      message: "Nuevo usuario registrado: María González",
      time: "Hace 15 minutos",
      status: "pending",
    },
    {
      id: 2,
      type: "reservation_created",
      message: "Nueva reserva: Suite 3 - El Sunzal",
      time: "Hace 1 hora",
      status: "confirmed",
    },
    {
      id: 3,
      type: "payment_received",
      message: "Pago recibido: $450 - Reserva #1234",
      time: "Hace 2 horas",
      status: "completed",
    },
    {
      id: 4,
      type: "user_approved",
      message: "Usuario aprobado: Carlos Méndez",
      time: "Hace 3 horas",
      status: "completed",
    },
    {
      id: 5,
      type: "reservation_cancelled",
      message: "Reserva cancelada: Casa 2 - Corinto",
      time: "Hace 4 horas",
      status: "cancelled",
    },
  ];

  const upcomingReservations = [
    {
      id: "1",
      guest: "Ana Rodríguez",
      accommodation: "Apartamento 1A - El Sunzal",
      checkIn: "2024-01-15",
      checkOut: "2024-01-17",
      guests: 2,
      status: "confirmed",
    },
    {
      id: "2",
      guest: "José Martínez",
      accommodation: "Casa 1 - Corinto",
      checkIn: "2024-01-16",
      checkOut: "2024-01-19",
      guests: 4,
      status: "pending",
    },
    {
      id: "3",
      guest: "María López",
      accommodation: "Suite Premium - El Sunzal",
      checkIn: "2024-01-18",
      checkOut: "2024-01-20",
      guests: 2,
      status: "confirmed",
    },
  ];

  if (loading) {
    return (
      <AdminLayout>
        <div className="space-y-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Connection Status */}
        {!apiConnected && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <AlertCircle className="h-5 w-5 text-yellow-600" />
              <span className="text-yellow-800">
                Conectando con API en modo desarrollo. Mostrando datos de
                ejemplo.
              </span>
            </div>
          </div>
        )}

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {quickStats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {stat.title}
                  </CardTitle>
                  <Icon className={`h-4 w-4 text-${stat.color}-600`} />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                    {stat.trend === "up" && (
                      <TrendingUp className="h-3 w-3 text-green-500" />
                    )}
                    {stat.trend === "down" && (
                      <TrendingDown className="h-3 w-3 text-red-500" />
                    )}
                    {stat.trend === "warning" && (
                      <AlertCircle className="h-3 w-3 text-orange-500" />
                    )}
                    <span>{stat.change}</span>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Activities */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Actividad Reciente</CardTitle>
              <CardDescription>
                Últimas actividades en el sistema
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivities.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-center space-x-4"
                  >
                    <div className="flex-shrink-0">
                      {activity.status === "pending" && (
                        <Clock className="h-5 w-5 text-orange-500" />
                      )}
                      {activity.status === "confirmed" && (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      )}
                      {activity.status === "completed" && (
                        <CheckCircle className="h-5 w-5 text-blue-500" />
                      )}
                      {activity.status === "cancelled" && (
                        <AlertCircle className="h-5 w-5 text-red-500" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">
                        {activity.message}
                      </p>
                      <p className="text-sm text-gray-500">{activity.time}</p>
                    </div>
                    <Badge
                      variant={
                        activity.status === "pending"
                          ? "outline"
                          : activity.status === "confirmed"
                            ? "default"
                            : activity.status === "completed"
                              ? "secondary"
                              : "destructive"
                      }
                    >
                      {activity.status === "pending" && "Pendiente"}
                      {activity.status === "confirmed" && "Confirmado"}
                      {activity.status === "completed" && "Completado"}
                      {activity.status === "cancelled" && "Cancelado"}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Acciones Rápidas</CardTitle>
              <CardDescription>Tareas comunes del sistema</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button asChild className="w-full" variant="default">
                <Link to="/admin/reservations/new">
                  <Calendar className="mr-2 h-4 w-4" />
                  Nueva Reserva
                </Link>
              </Button>
              <Button asChild className="w-full" variant="outline">
                <Link to="/admin/users">
                  <Users className="mr-2 h-4 w-4" />
                  Gestionar Usuarios
                </Link>
              </Button>
              <Button asChild className="w-full" variant="outline">
                <Link to="/admin/accommodations">
                  <Building2 className="mr-2 h-4 w-4" />
                  Gestionar Alojamientos
                </Link>
              </Button>
              <Button asChild className="w-full" variant="outline">
                <Link to="/admin/calendar">
                  <Calendar className="mr-2 h-4 w-4" />
                  Ver Calendario
                </Link>
              </Button>
              <Button asChild className="w-full" variant="outline">
                <Link to="/dashboard">
                  <Eye className="mr-2 h-4 w-4" />
                  Ver Sitio Público
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Upcoming Reservations */}
        <Card>
          <CardHeader>
            <CardTitle>Próximas Llegadas</CardTitle>
            <CardDescription>
              Reservas confirmadas para los próximos días
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingReservations.map((reservation) => (
                <div
                  key={reservation.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="space-y-1">
                    <p className="font-medium">{reservation.guest}</p>
                    <p className="text-sm text-gray-600">
                      {reservation.accommodation}
                    </p>
                    <p className="text-sm text-gray-500">
                      {reservation.checkIn} - {reservation.checkOut} •{" "}
                      {reservation.guests} huésped(es)
                    </p>
                  </div>
                  <div className="text-right space-y-2">
                    <Badge
                      variant={
                        reservation.status === "confirmed"
                          ? "default"
                          : "outline"
                      }
                    >
                      {reservation.status === "confirmed"
                        ? "Confirmada"
                        : "Pendiente"}
                    </Badge>
                    <div>
                      <Button variant="outline" size="sm" asChild>
                        <Link to={`/admin/reservations/${reservation.id}`}>
                          Ver Detalles
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
