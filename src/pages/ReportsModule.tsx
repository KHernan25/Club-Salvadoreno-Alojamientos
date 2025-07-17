import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  TrendingUp,
  DollarSign,
  Users,
  Calendar,
  Building,
  FileBarChart,
  BarChart3,
  PieChart,
  Activity,
  Download,
  Printer,
  RefreshCw,
  UserCheck,
  MapPin,
  Clock,
  CheckCircle,
  AlertTriangle,
} from "lucide-react";
import AdminLayout from "@/components/AdminLayout";
import { getCurrentUser, requireAuth, hasPermission } from "@/lib/auth-service";
import { reservationService } from "@/lib/reservation-service";
import { companionBillingService } from "@/lib/companion-billing-service";
import { toast } from "@/hooks/use-toast";

const ReportsModule = () => {
  const navigate = useNavigate();
  const currentUser = getCurrentUser();
  const [loading, setLoading] = useState(true);
  const [reportData, setReportData] = useState<any>(null);
  const [dateRange, setDateRange] = useState("30d");

  useEffect(() => {
    if (!requireAuth()) {
      navigate("/backoffice");
      return;
    }

    // Verificar que el usuario tenga permisos para ver reportes
    if (
      !hasPermission("canViewReports") &&
      !hasPermission("canManageUsers") &&
      !hasPermission("canManageReservations")
    ) {
      toast({
        title: "Acceso Denegado",
        description: "No tienes permisos para acceder a los reportes",
        variant: "destructive",
      });
      navigate("/admin");
      return;
    }

    loadReportData();
  }, [navigate, dateRange]);

  const loadReportData = async () => {
    try {
      setLoading(true);

      // Cargar datos de reservas
      const reservations = reservationService.getAllReservations();
      const reservationStats = reservationService.getReservationStats();

      // Cargar datos de facturación
      const billingStats = companionBillingService.getBillingStats();

      // Calcular métricas adicionales
      const today = new Date();
      const startDate = new Date();
      startDate.setDate(
        today.getDate() -
          (dateRange === "7d" ? 7 : dateRange === "30d" ? 30 : 90),
      );

      const recentReservations = reservations.filter(
        (r) => r.createdAt >= startDate,
      );

      const revenueByLocation = reservations.reduce(
        (acc, reservation) => {
          if (
            reservation.status === "checked_out" &&
            reservation.createdAt >= startDate
          ) {
            acc[reservation.location] =
              (acc[reservation.location] || 0) + reservation.totalAmount;
          }
          return acc;
        },
        {} as Record<string, number>,
      );

      const occupancyByLocation = reservations.reduce(
        (acc, reservation) => {
          if (
            reservation.status === "checked_in" ||
            reservation.status === "checked_out"
          ) {
            acc[reservation.location] = (acc[reservation.location] || 0) + 1;
          }
          return acc;
        },
        {} as Record<string, number>,
      );

      const monthlyData = Array.from({ length: 12 }, (_, i) => {
        const month = new Date();
        month.setMonth(month.getMonth() - (11 - i));
        const monthReservations = reservations.filter(
          (r) =>
            r.createdAt.getMonth() === month.getMonth() &&
            r.createdAt.getFullYear() === month.getFullYear(),
        );
        return {
          month: month.toLocaleDateString("es-ES", { month: "short" }),
          reservations: monthReservations.length,
          revenue: monthReservations.reduce((sum, r) => sum + r.totalAmount, 0),
        };
      });

      setReportData({
        overview: {
          totalReservations: reservations.length,
          activeReservations: reservationStats.activeReservations,
          totalRevenue: reservations.reduce(
            (sum, r) =>
              r.status === "checked_out" ? sum + r.totalAmount : sum,
            0,
          ),
          averageOccupancy: Math.round(
            (reservationStats.activeReservations / 20) * 100, // Asumiendo 20 alojamientos total
          ),
          pendingBilling: billingStats.pendingAmount,
          processedBilling: billingStats.totalToday,
        },
        reservations: recentReservations,
        revenueByLocation,
        occupancyByLocation,
        monthlyData,
        reservationStats,
        billingStats,
      });

      console.log("✅ Report data loaded");
    } catch (error) {
      console.error("Error loading report data:", error);
      toast({
        title: "Error",
        description: "Error al cargar los datos de reportes",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const exportReport = (format: "pdf" | "excel") => {
    toast({
      title: "Exportando reporte",
      description: `Preparando archivo ${format.toUpperCase()}...`,
    });
    // Aquí iría la lógica real de exportación
  };

  const printReport = () => {
    window.print();
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
            <p className="text-gray-600">Cargando reportes...</p>
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
            <FileBarChart className="h-8 w-8 text-blue-600" />
            <div>
              <h1 className="text-2xl font-bold">Módulo de Reportes</h1>
              <p className="text-gray-600">
                Análisis y estadísticas del sistema
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Select value={dateRange} onValueChange={setDateRange}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Período" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">Últimos 7 días</SelectItem>
                <SelectItem value="30d">Últimos 30 días</SelectItem>
                <SelectItem value="90d">Últimos 90 días</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={loadReportData} variant="outline" size="sm">
              <RefreshCw className="w-4 h-4 mr-2" />
              Actualizar
            </Button>
            <Badge variant="outline" className="text-blue-600 border-blue-600">
              <Users className="w-3 h-3 mr-1" />
              {currentUser.firstName} - {currentUser.role}
            </Badge>
          </div>
        </div>

        {/* Resumen General */}
        {reportData && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Reservas
                </CardTitle>
                <Calendar className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {reportData.overview.totalReservations}
                </div>
                <p className="text-xs text-muted-foreground">
                  {reportData.overview.activeReservations} activas
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Ingresos Totales
                </CardTitle>
                <DollarSign className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  ${reportData.overview.totalRevenue.toFixed(2)}
                </div>
                <p className="text-xs text-muted-foreground">
                  Reservas completadas
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Ocupación Promedio
                </CardTitle>
                <Building className="h-4 w-4 text-purple-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {reportData.overview.averageOccupancy}%
                </div>
                <p className="text-xs text-muted-foreground">
                  Basado en alojamientos activos
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Facturación Pendiente
                </CardTitle>
                <AlertTriangle className="h-4 w-4 text-orange-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  ${reportData.overview.pendingBilling.toFixed(2)}
                </div>
                <p className="text-xs text-muted-foreground">
                  Acompañantes por cobrar
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Tabs de Reportes */}
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger
              value="overview"
              className="flex items-center space-x-2"
            >
              <BarChart3 className="w-4 h-4" />
              <span>Resumen</span>
            </TabsTrigger>
            <TabsTrigger
              value="reservations"
              className="flex items-center space-x-2"
            >
              <Calendar className="w-4 h-4" />
              <span>Reservas</span>
            </TabsTrigger>
            <TabsTrigger
              value="financial"
              className="flex items-center space-x-2"
            >
              <DollarSign className="w-4 h-4" />
              <span>Financiero</span>
            </TabsTrigger>
            <TabsTrigger
              value="occupancy"
              className="flex items-center space-x-2"
            >
              <Building className="w-4 h-4" />
              <span>Ocupación</span>
            </TabsTrigger>
          </TabsList>

          {/* Tab: Resumen */}
          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Ingresos por Ubicación */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <PieChart className="w-5 h-5 mr-2" />
                    Ingresos por Ubicación
                  </CardTitle>
                  <CardDescription>Últimos {dateRange}</CardDescription>
                </CardHeader>
                <CardContent>
                  {reportData && (
                    <div className="space-y-4">
                      {Object.entries(reportData.revenueByLocation).map(
                        ([location, revenue]) => (
                          <div
                            key={location}
                            className="flex items-center justify-between"
                          >
                            <div className="flex items-center space-x-2">
                              <MapPin className="w-4 h-4 text-gray-600" />
                              <span>{location}</span>
                            </div>
                            <div className="font-semibold text-green-600">
                              ${(revenue as number).toFixed(2)}
                            </div>
                          </div>
                        ),
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Ocupación por Ubicación */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Building className="w-5 h-5 mr-2" />
                    Ocupación por Ubicación
                  </CardTitle>
                  <CardDescription>Reservas activas</CardDescription>
                </CardHeader>
                <CardContent>
                  {reportData && (
                    <div className="space-y-4">
                      {Object.entries(reportData.occupancyByLocation).map(
                        ([location, count]) => (
                          <div
                            key={location}
                            className="flex items-center justify-between"
                          >
                            <div className="flex items-center space-x-2">
                              <MapPin className="w-4 h-4 text-gray-600" />
                              <span>{location}</span>
                            </div>
                            <div className="font-semibold text-blue-600">
                              {count as number} reservas
                            </div>
                          </div>
                        ),
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Tendencia Mensual */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2" />
                  Tendencia de Reservas (12 meses)
                </CardTitle>
              </CardHeader>
              <CardContent>
                {reportData && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-12 gap-2">
                      {reportData.monthlyData.map((month, index) => (
                        <div key={index} className="text-center">
                          <div className="text-xs text-gray-600 mb-1">
                            {month.month}
                          </div>
                          <div
                            className="bg-blue-200 rounded-t"
                            style={{
                              height: `${Math.max(month.reservations * 4, 8)}px`,
                              minHeight: "8px",
                            }}
                          ></div>
                          <div className="text-xs font-semibold mt-1">
                            {month.reservations}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab: Reservas */}
          <TabsContent value="reservations" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Reporte de Reservas</CardTitle>
                    <CardDescription>
                      Últimas {reportData?.reservations.length} reservas del
                      período seleccionado
                    </CardDescription>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      onClick={() => exportReport("excel")}
                      variant="outline"
                      size="sm"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Excel
                    </Button>
                    <Button onClick={printReport} variant="outline" size="sm">
                      <Printer className="w-4 h-4 mr-2" />
                      Imprimir
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {reportData && reportData.reservations.length > 0 ? (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Código</TableHead>
                          <TableHead>Huésped</TableHead>
                          <TableHead>Alojamiento</TableHead>
                          <TableHead>Check-in</TableHead>
                          <TableHead>Estado</TableHead>
                          <TableHead className="text-right">Total</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {reportData.reservations
                          .slice(0, 20)
                          .map((reservation) => (
                            <TableRow key={reservation.id}>
                              <TableCell className="font-medium">
                                {reservation.reservationCode}
                              </TableCell>
                              <TableCell>{reservation.guestName}</TableCell>
                              <TableCell>
                                <div>
                                  <div>{reservation.accommodationName}</div>
                                  <div className="text-sm text-gray-600">
                                    {reservation.location}
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell>
                                {reservation.checkInDate.toLocaleDateString()}
                              </TableCell>
                              <TableCell>
                                <Badge
                                  variant={
                                    reservation.status === "checked_out"
                                      ? "default"
                                      : "outline"
                                  }
                                  className={
                                    reservation.status === "confirmed"
                                      ? "text-blue-600 border-blue-600"
                                      : reservation.status === "checked_in"
                                        ? "text-green-600 border-green-600"
                                        : reservation.status === "checked_out"
                                          ? "text-gray-600"
                                          : "text-red-600 border-red-600"
                                  }
                                >
                                  {reservation.status === "confirmed" &&
                                    "Confirmada"}
                                  {reservation.status === "checked_in" &&
                                    "Activa"}
                                  {reservation.status === "checked_out" &&
                                    "Completada"}
                                  {reservation.status === "cancelled" &&
                                    "Cancelada"}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-right font-medium">
                                ${reservation.totalAmount.toFixed(2)}
                              </TableCell>
                            </TableRow>
                          ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      No hay reservas en este período
                    </h3>
                    <p className="text-gray-600">
                      Cambia el rango de fechas para ver más datos
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab: Financiero */}
          <TabsContent value="financial" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <DollarSign className="w-5 h-5 mr-2" />
                    Ingresos por Reservas
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span>Reservas completadas:</span>
                      <span className="font-semibold text-green-600">
                        ${reportData?.overview.totalRevenue.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Facturación procesada hoy:</span>
                      <span className="font-semibold text-blue-600">
                        ${reportData?.overview.processedBilling.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Pendiente por cobrar:</span>
                      <span className="font-semibold text-orange-600">
                        ${reportData?.overview.pendingBilling.toFixed(2)}
                      </span>
                    </div>
                    <hr />
                    <div className="flex justify-between text-lg">
                      <span className="font-semibold">Total estimado:</span>
                      <span className="font-bold text-green-600">
                        $
                        {(
                          reportData?.overview.totalRevenue +
                          reportData?.overview.pendingBilling
                        ).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Activity className="w-5 h-5 mr-2" />
                    Estadísticas de Facturación
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span>Cobros pendientes:</span>
                      <span className="font-semibold">
                        {reportData?.billingStats.pendingCount}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Procesados hoy:</span>
                      <span className="font-semibold">
                        {reportData?.billingStats.processedToday}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Total del día:</span>
                      <span className="font-semibold text-green-600">
                        ${reportData?.billingStats.totalToday.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Tab: Ocupación */}
          <TabsContent value="occupancy" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <CheckCircle className="w-5 h-5 mr-2" />
                    Estado Actual de Ocupación
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>Alojamientos ocupados:</span>
                      <span className="font-semibold text-green-600">
                        {reportData?.reservationStats.activeReservations}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Check-ins hoy:</span>
                      <span className="font-semibold text-blue-600">
                        {reportData?.reservationStats.todayCheckIns}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Check-outs hoy:</span>
                      <span className="font-semibold text-orange-600">
                        {reportData?.reservationStats.todayCheckOuts}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Ocupación promedio:</span>
                      <span className="font-semibold text-purple-600">
                        {reportData?.overview.averageOccupancy}%
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Clock className="w-5 h-5 mr-2" />
                    Actividad del Día
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-3 bg-green-50 rounded-lg">
                      <div className="flex items-center justify-between">
                        <span className="text-green-800 font-medium">
                          Check-ins programados
                        </span>
                        <span className="text-green-600 font-bold">
                          {reportData?.reservationStats.todayCheckIns}
                        </span>
                      </div>
                    </div>
                    <div className="p-3 bg-orange-50 rounded-lg">
                      <div className="flex items-center justify-between">
                        <span className="text-orange-800 font-medium">
                          Check-outs programados
                        </span>
                        <span className="text-orange-600 font-bold">
                          {reportData?.reservationStats.todayCheckOuts}
                        </span>
                      </div>
                    </div>
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <div className="flex items-center justify-between">
                        <span className="text-blue-800 font-medium">
                          Huéspedes activos
                        </span>
                        <span className="text-blue-600 font-bold">
                          {reportData?.reservationStats.activeReservations}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default ReportsModule;
