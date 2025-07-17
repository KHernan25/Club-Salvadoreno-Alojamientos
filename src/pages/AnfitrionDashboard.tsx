import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
  DollarSign,
  Users,
  Clock,
  CheckCircle,
  AlertTriangle,
  Calendar,
} from "lucide-react";
import AdminLayout from "@/components/AdminLayout";
import CompanionBillingManager from "@/components/CompanionBillingManager";
import CheckInManager from "@/components/CheckInManager";
import CheckOutManager from "@/components/CheckOutManager";
import ReservationManager from "@/components/ReservationManager";
import { getCurrentUser, requireAuth, hasPermission } from "@/lib/auth-service";
import { companionBillingService } from "@/lib/companion-billing-service";
import { reservationService } from "@/lib/reservation-service";
import { toast } from "@/hooks/use-toast";

const AnfitrionDashboard = () => {
  const navigate = useNavigate();
  const currentUser = getCurrentUser();
  const [dashboardStats, setDashboardStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!requireAuth()) {
      navigate("/backoffice");
      return;
    }

    if (!hasPermission("canManageReservations")) {
      toast({
        title: "Acceso Denegado",
        description: "No tienes permisos para acceder al sistema de anfitrión",
        variant: "destructive",
      });
      navigate("/admin");
      return;
    }

    loadDashboardData();
  }, [navigate]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);

      // Cargar estadísticas de facturación
      const billingStats = companionBillingService.getBillingStats();

      // Cargar estadísticas de reservas
      const reservationStats = reservationService.getReservationStats();

      // Combinar todas las estadísticas
      const combinedStats = {
        occupancyRate: 78, // Simulado
        ...billingStats,
        ...reservationStats,
      };

      setDashboardStats(combinedStats);

      console.log("✅ Anfitrión dashboard data loaded:", combinedStats);
    } catch (error) {
      console.error("❌ Error loading dashboard data:", error);
      toast({
        title: "Error",
        description: "Error al cargar los datos del dashboard",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!currentUser) {
    return null;
  }

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Cargando dashboard de anfitrión...</p>
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
          <div className="flex items-center space-x-3">
            <Users className="h-8 w-8 text-blue-600" />
            <div>
              <h1 className="text-2xl font-bold">Dashboard de Anfitrión</h1>
              <p className="text-gray-600">
                Gestión de huéspedes y facturación de acompañantes
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Button
              onClick={() => navigate("/admin/check-in-out")}
              className="bg-green-600 hover:bg-green-700"
              size="sm"
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Check-in/Check-out
            </Button>
            <Badge variant="outline" className="text-blue-600 border-blue-600">
              <Users className="w-3 h-3 mr-1" />
              Anfitrión: {currentUser.firstName}
            </Badge>
          </div>
        </div>

        {/* Stats Cards */}
        {dashboardStats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Reservas Activas
                </CardTitle>
                <Calendar className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {dashboardStats.activeReservations}
                </div>
                <p className="text-xs text-muted-foreground">
                  huéspedes actuales
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Cobros Pendientes
                </CardTitle>
                <AlertTriangle className="h-4 w-4 text-orange-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {dashboardStats.pendingCount}
                </div>
                <p className="text-xs text-muted-foreground">
                  ${dashboardStats.pendingAmount.toFixed(2)} por cobrar
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Facturado Hoy
                </CardTitle>
                <DollarSign className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  ${dashboardStats.totalToday.toFixed(2)}
                </div>
                <p className="text-xs text-muted-foreground">
                  {dashboardStats.processedToday} cobros procesados
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Check-ins Hoy
                </CardTitle>
                <CheckCircle className="h-4 w-4 text-purple-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {dashboardStats.todayCheckIns}
                </div>
                <p className="text-xs text-muted-foreground">
                  {dashboardStats.todayCheckOuts} check-outs
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card
            className="border-green-200 bg-green-50 hover:bg-green-100 transition-colors cursor-pointer"
            onClick={() => navigate("/admin/check-in-out")}
          >
            <CardContent className="pt-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-green-600 rounded-lg">
                  <CheckCircle className="h-8 w-8 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-green-800 text-lg">
                    Check-in de Huéspedes
                  </h3>
                  <p className="text-green-700 text-sm">
                    Buscar por código de reserva y registrar llegada
                  </p>
                </div>
                <div className="text-green-600">
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card
            className="border-orange-200 bg-orange-50 hover:bg-orange-100 transition-colors cursor-pointer"
            onClick={() => navigate("/admin/check-in-out")}
          >
            <CardContent className="pt-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-orange-600 rounded-lg">
                  <Clock className="h-8 w-8 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-orange-800 text-lg">
                    Check-out de Huéspedes
                  </h3>
                  <p className="text-orange-700 text-sm">
                    Procesar salidas y inspeccionar alojamientos
                  </p>
                </div>
                <div className="text-orange-600">
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Alert for Pending Billings */}
        {dashboardStats && dashboardStats.pendingCount > 0 && (
          <Card className="border-orange-200 bg-orange-50">
            <CardContent className="pt-6">
              <div className="flex items-center space-x-3">
                <AlertTriangle className="h-6 w-6 text-orange-600" />
                <div className="flex-1">
                  <h3 className="font-semibold text-orange-800">
                    Nuevos Registros de Portería
                  </h3>
                  <p className="text-orange-700">
                    Tienes {dashboardStats.pendingCount} cobro
                    {dashboardStats.pendingCount > 1 ? "s" : ""} pendiente
                    {dashboardStats.pendingCount > 1 ? "s" : ""} por procesar
                    por un total de ${dashboardStats.pendingAmount.toFixed(2)}.
                    Revisa la pestaña "Facturación de Acompañantes".
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Main Content Tabs */}
        <Tabs defaultValue="checkin" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger
              value="checkin"
              className="flex items-center space-x-2"
            >
              <CheckCircle className="w-4 h-4" />
              <span>Check-in</span>
            </TabsTrigger>
            <TabsTrigger
              value="checkout"
              className="flex items-center space-x-2"
            >
              <Clock className="w-4 h-4" />
              <span>Check-out</span>
            </TabsTrigger>
            <TabsTrigger
              value="billing"
              className="flex items-center space-x-2"
            >
              <DollarSign className="w-4 h-4" />
              <span>Acompañantes</span>
            </TabsTrigger>
            <TabsTrigger
              value="reservations"
              className="flex items-center space-x-2"
            >
              <Calendar className="w-4 h-4" />
              <span>Reservas</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="checkin" className="space-y-4">
            <CheckInManager />
          </TabsContent>

          <TabsContent value="checkout" className="space-y-4">
            <CheckOutManager />
          </TabsContent>

          <TabsContent value="billing" className="space-y-4">
            <CompanionBillingManager />
          </TabsContent>

          <TabsContent value="reservations" className="space-y-4">
            <ReservationManager />
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default AnfitrionDashboard;
