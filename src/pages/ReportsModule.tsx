import { useState, useEffect, useMemo } from "react";
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
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadialBarChart,
  RadialBar,
} from "recharts";
import {
  TrendingUp,
  DollarSign,
  Users,
  Calendar,
  Building,
  FileBarChart,
  BarChart3,
  PieChart as PieChartIcon,
  Activity,
  Download,
  Printer,
  RefreshCw,
  MapPin,
  Clock,
  CheckCircle,
  AlertTriangle,
  Filter,
  Eye,
  TrendingDown,
  Zap,
  Star,
  Target,
} from "lucide-react";
import AdminLayout from "@/components/AdminLayout";
import { getCurrentUser, requireAuth, hasPermission } from "@/lib/auth-service";
import { reservationService } from "@/lib/reservation-service";
import { companionBillingService } from "@/lib/companion-billing-service";
import { toast } from "@/hooks/use-toast";

// Colores para los gráficos
const CHART_COLORS = {
  primary: "#3B82F6",
  secondary: "#10B981",
  accent: "#F59E0B",
  danger: "#EF4444",
  purple: "#8B5CF6",
  teal: "#14B8A6",
  rose: "#F43F5E",
  indigo: "#6366F1",
};

const PIE_COLORS = [
  CHART_COLORS.primary,
  CHART_COLORS.secondary,
  CHART_COLORS.accent,
  CHART_COLORS.purple,
  CHART_COLORS.danger,
  CHART_COLORS.teal,
];

const ReportsModule = () => {
  const navigate = useNavigate();
  const currentUser = getCurrentUser();
  const [loading, setLoading] = useState(true);
  const [reportData, setReportData] = useState<any>(null);
  const [dateRange, setDateRange] = useState("30d");
  const [chartType, setChartType] = useState("area");
  const [selectedLocation, setSelectedLocation] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");

  useEffect(() => {
    if (!requireAuth()) {
      navigate("/backoffice");
      return;
    }

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

      // Calcular m��tricas adicionales
      const today = new Date();
      const startDate = new Date();
      startDate.setDate(
        today.getDate() -
          (dateRange === "7d" ? 7 : dateRange === "30d" ? 30 : 90),
      );

      const filteredReservations = reservations.filter(
        (r) => r.createdAt >= startDate,
      );

      // Datos para gráficos de línea mensual
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
          reservas: monthReservations.length,
          ingresos: monthReservations.reduce(
            (sum, r) => sum + r.totalAmount,
            0,
          ),
          completadas: monthReservations.filter(
            (r) => r.status === "checked_out",
          ).length,
          activas: monthReservations.filter((r) => r.status === "checked_in")
            .length,
        };
      });

      // Datos para gráfico de pie - Estados de reservas
      const statusData = [
        {
          name: "Confirmadas",
          value: reservations.filter((r) => r.status === "confirmed").length,
          color: CHART_COLORS.primary,
        },
        {
          name: "Activas",
          value: reservations.filter((r) => r.status === "checked_in").length,
          color: CHART_COLORS.secondary,
        },
        {
          name: "Completadas",
          value: reservations.filter((r) => r.status === "checked_out").length,
          color: CHART_COLORS.accent,
        },
        {
          name: "Canceladas",
          value: reservations.filter((r) => r.status === "cancelled").length,
          color: CHART_COLORS.danger,
        },
      ];

      // Datos para gráfico de barras - Ingresos por ubicación
      const locationData = [
        {
          location: "El Sunzal",
          ingresos: reservations
            .filter(
              (r) => r.location === "El Sunzal" && r.status === "checked_out",
            )
            .reduce((sum, r) => sum + r.totalAmount, 0),
          reservas: reservations.filter((r) => r.location === "El Sunzal")
            .length,
          ocupacion: Math.round(Math.random() * 40 + 60), // Mock data
        },
        {
          location: "Corinto",
          ingresos: reservations
            .filter(
              (r) => r.location === "Corinto" && r.status === "checked_out",
            )
            .reduce((sum, r) => sum + r.totalAmount, 0),
          reservas: reservations.filter((r) => r.location === "Corinto").length,
          ocupacion: Math.round(Math.random() * 40 + 60), // Mock data
        },
      ];

      // Datos para gráfico radial - Métricas de performance
      const performanceData = [
        {
          name: "Ocupación",
          value: Math.round((reservationStats.activeReservations / 20) * 100),
          fill: CHART_COLORS.secondary,
        },
        {
          name: "Satisfacción",
          value: 87, // Mock data
          fill: CHART_COLORS.purple,
        },
        {
          name: "Puntualidad",
          value: 94, // Mock data
          fill: CHART_COLORS.teal,
        },
      ];

      // Datos para tendencias semanales
      const weeklyData = Array.from({ length: 7 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - (6 - i));
        const dayReservations = reservations.filter((r) => {
          const rDate = new Date(r.createdAt);
          return rDate.toDateString() === date.toDateString();
        });
        return {
          day: date.toLocaleDateString("es-ES", { weekday: "short" }),
          checkIns: dayReservations.filter((r) => r.status === "checked_in")
            .length,
          checkOuts: dayReservations.filter((r) => r.status === "checked_out")
            .length,
          nuevas: dayReservations.filter((r) => r.status === "confirmed")
            .length,
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
            (reservationStats.activeReservations / 20) * 100,
          ),
          pendingBilling: billingStats.pendingAmount,
          processedBilling: billingStats.totalToday,
          growthRate: 12.5, // Mock data
          conversionRate: 78.2, // Mock data
        },
        monthlyData,
        statusData,
        locationData,
        performanceData,
        weeklyData,
        reservations: filteredReservations,
        reservationStats,
        billingStats,
      });

      console.log("✅ Enhanced report data loaded");
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

  // Filtrar datos según selecciones
  const filteredData = useMemo(() => {
    if (!reportData) return null;

    let filtered = [...reportData.reservations];

    if (selectedLocation !== "all") {
      filtered = filtered.filter((r) => r.location === selectedLocation);
    }

    if (selectedStatus !== "all") {
      filtered = filtered.filter((r) => r.status === selectedStatus);
    }

    return {
      ...reportData,
      reservations: filtered,
    };
  }, [reportData, selectedLocation, selectedStatus]);

  const exportReport = (format: "pdf" | "excel") => {
    toast({
      title: "Exportando reporte",
      description: `Preparando archivo ${format.toUpperCase()}...`,
    });
  };

  const printReport = () => {
    window.print();
  };

  // Componente personalizado para el tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }}>
              {entry.dataKey}: {entry.value}
              {entry.dataKey.includes("ingresos") && " USD"}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  if (!currentUser) {
    return null;
  }

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent mx-auto mb-4"></div>
            <p className="text-gray-600 text-lg">
              Cargando reportes avanzados...
            </p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header Mejorado */}
        <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-teal-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-white/20 rounded-lg backdrop-blur-sm">
                <BarChart3 className="h-8 w-8" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
                <p className="text-blue-100 mt-1">
                  Reportes interactivos y análisis en tiempo real
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Select value={dateRange} onValueChange={setDateRange}>
                <SelectTrigger className="w-[160px] bg-white/10 border-white/20 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7d">Últimos 7 días</SelectItem>
                  <SelectItem value="30d">Últimos 30 días</SelectItem>
                  <SelectItem value="90d">Últimos 90 días</SelectItem>
                </SelectContent>
              </Select>
              <Button
                onClick={loadReportData}
                variant="secondary"
                size="sm"
                className="bg-white/10 hover:bg-white/20 text-white border-white/20"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Actualizar
              </Button>
            </div>
          </div>
        </div>

        {/* KPIs Mejorados */}
        {reportData && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="relative overflow-hidden border-0 shadow-lg">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-blue-600"></div>
              <CardContent className="relative p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100 text-sm font-medium">
                      Total Reservas
                    </p>
                    <p className="text-3xl font-bold">
                      {reportData.overview.totalReservations}
                    </p>
                    <div className="flex items-center mt-2">
                      <TrendingUp className="w-4 h-4 mr-1" />
                      <span className="text-sm">
                        +{reportData.overview.growthRate}%
                      </span>
                    </div>
                  </div>
                  <Calendar className="h-8 w-8 text-blue-200" />
                </div>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden border-0 shadow-lg">
              <div className="absolute inset-0 bg-gradient-to-br from-green-500 to-green-600"></div>
              <CardContent className="relative p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-100 text-sm font-medium">
                      Ingresos Totales
                    </p>
                    <p className="text-3xl font-bold">
                      ${reportData.overview.totalRevenue.toFixed(0)}
                    </p>
                    <div className="flex items-center mt-2">
                      <DollarSign className="w-4 h-4 mr-1" />
                      <span className="text-sm">Este período</span>
                    </div>
                  </div>
                  <TrendingUp className="h-8 w-8 text-green-200" />
                </div>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden border-0 shadow-lg">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-purple-600"></div>
              <CardContent className="relative p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-100 text-sm font-medium">
                      Ocupación
                    </p>
                    <p className="text-3xl font-bold">
                      {reportData.overview.averageOccupancy}%
                    </p>
                    <div className="flex items-center mt-2">
                      <Building className="w-4 h-4 mr-1" />
                      <span className="text-sm">Promedio actual</span>
                    </div>
                  </div>
                  <Target className="h-8 w-8 text-purple-200" />
                </div>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden border-0 shadow-lg">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-500 to-orange-600"></div>
              <CardContent className="relative p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-orange-100 text-sm font-medium">
                      Conversión
                    </p>
                    <p className="text-3xl font-bold">
                      {reportData.overview.conversionRate}%
                    </p>
                    <div className="flex items-center mt-2">
                      <Zap className="w-4 h-4 mr-1" />
                      <span className="text-sm">Tasa de éxito</span>
                    </div>
                  </div>
                  <Star className="h-8 w-8 text-orange-200" />
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Filtros Avanzados */}
        <Card className="border-0 shadow-lg">
          <CardHeader className="bg-gray-50">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center">
                  <Filter className="w-5 h-5 mr-2 text-blue-600" />
                  Filtros Avanzados
                </CardTitle>
                <CardDescription>
                  Personaliza la visualización de datos
                </CardDescription>
              </div>
              <div className="flex items-center space-x-3">
                <Select value={chartType} onValueChange={setChartType}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="area">Área</SelectItem>
                    <SelectItem value="line">Línea</SelectItem>
                    <SelectItem value="bar">Barras</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Ubicación
                </label>
                <Select
                  value={selectedLocation}
                  onValueChange={setSelectedLocation}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas las ubicaciones</SelectItem>
                    <SelectItem value="El Sunzal">El Sunzal</SelectItem>
                    <SelectItem value="Corinto">Corinto</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Estado
                </label>
                <Select
                  value={selectedStatus}
                  onValueChange={setSelectedStatus}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos los estados</SelectItem>
                    <SelectItem value="confirmed">Confirmadas</SelectItem>
                    <SelectItem value="checked_in">Activas</SelectItem>
                    <SelectItem value="checked_out">Completadas</SelectItem>
                    <SelectItem value="cancelled">Canceladas</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-end space-x-2">
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
          </CardContent>
        </Card>

        {/* Gráficos Principales */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Gráfico de Tendencias */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="w-5 h-5 mr-2 text-blue-600" />
                Tendencias de Reservas (12 meses)
              </CardTitle>
              <CardDescription>
                Evolución temporal de reservas e ingresos
              </CardDescription>
            </CardHeader>
            <CardContent>
              {reportData && (
                <ResponsiveContainer width="100%" height={300}>
                  {chartType === "area" ? (
                    <AreaChart data={reportData.monthlyData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="month" stroke="#666" />
                      <YAxis stroke="#666" />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend />
                      <Area
                        type="monotone"
                        dataKey="reservas"
                        stackId="1"
                        stroke={CHART_COLORS.primary}
                        fill={CHART_COLORS.primary}
                        fillOpacity={0.6}
                        name="Reservas"
                      />
                      <Area
                        type="monotone"
                        dataKey="completadas"
                        stackId="1"
                        stroke={CHART_COLORS.secondary}
                        fill={CHART_COLORS.secondary}
                        fillOpacity={0.6}
                        name="Completadas"
                      />
                    </AreaChart>
                  ) : chartType === "line" ? (
                    <LineChart data={reportData.monthlyData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="month" stroke="#666" />
                      <YAxis stroke="#666" />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="reservas"
                        stroke={CHART_COLORS.primary}
                        strokeWidth={3}
                        name="Reservas"
                        dot={{
                          fill: CHART_COLORS.primary,
                          strokeWidth: 2,
                          r: 4,
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey="completadas"
                        stroke={CHART_COLORS.secondary}
                        strokeWidth={3}
                        name="Completadas"
                        dot={{
                          fill: CHART_COLORS.secondary,
                          strokeWidth: 2,
                          r: 4,
                        }}
                      />
                    </LineChart>
                  ) : (
                    <BarChart data={reportData.monthlyData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="month" stroke="#666" />
                      <YAxis stroke="#666" />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend />
                      <Bar
                        dataKey="reservas"
                        fill={CHART_COLORS.primary}
                        name="Reservas"
                      />
                      <Bar
                        dataKey="completadas"
                        fill={CHART_COLORS.secondary}
                        name="Completadas"
                      />
                    </BarChart>
                  )}
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>

          {/* Gráfico de Estados */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center">
                <PieChartIcon className="w-5 h-5 mr-2 text-purple-600" />
                Distribución por Estado
              </CardTitle>
              <CardDescription>
                Proporción de reservas por estado actual
              </CardDescription>
            </CardHeader>
            <CardContent>
              {reportData && (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={reportData.statusData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) =>
                        `${name} ${(percent * 100).toFixed(0)}%`
                      }
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {reportData.statusData.map(
                        (entry: any, index: number) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={PIE_COLORS[index % PIE_COLORS.length]}
                          />
                        ),
                      )}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Gráficos Secundarios */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Ingresos por Ubicación */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center">
                <MapPin className="w-5 h-5 mr-2 text-green-600" />
                Análisis por Ubicación
              </CardTitle>
              <CardDescription>
                Comparativa de ingresos y reservas
              </CardDescription>
            </CardHeader>
            <CardContent>
              {reportData && (
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={reportData.locationData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="location" stroke="#666" />
                    <YAxis stroke="#666" />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Bar
                      dataKey="ingresos"
                      fill={CHART_COLORS.secondary}
                      name="Ingresos (USD)"
                    />
                    <Bar
                      dataKey="reservas"
                      fill={CHART_COLORS.accent}
                      name="Reservas"
                    />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>

          {/* Métricas de Performance */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Activity className="w-5 h-5 mr-2 text-orange-600" />
                Métricas de Performance
              </CardTitle>
              <CardDescription>
                Indicadores clave de rendimiento
              </CardDescription>
            </CardHeader>
            <CardContent>
              {reportData && (
                <ResponsiveContainer width="100%" height={250}>
                  <RadialBarChart
                    cx="50%"
                    cy="50%"
                    innerRadius="10%"
                    outerRadius="80%"
                    data={reportData.performanceData}
                  >
                    <RadialBar
                      label={{ position: "insideStart", fill: "#fff" }}
                      background
                      clockWise
                      dataKey="value"
                    />
                    <Legend
                      iconSize={18}
                      layout="horizontal"
                      verticalAlign="bottom"
                    />
                    <Tooltip />
                  </RadialBarChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Actividad Semanal */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clock className="w-5 h-5 mr-2 text-indigo-600" />
              Actividad de la Semana
            </CardTitle>
            <CardDescription>
              Check-ins, check-outs y nuevas reservas por día
            </CardDescription>
          </CardHeader>
          <CardContent>
            {reportData && (
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={reportData.weeklyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="day" stroke="#666" />
                  <YAxis stroke="#666" />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="checkIns"
                    stackId="1"
                    stroke={CHART_COLORS.secondary}
                    fill={CHART_COLORS.secondary}
                    fillOpacity={0.6}
                    name="Check-ins"
                  />
                  <Area
                    type="monotone"
                    dataKey="checkOuts"
                    stackId="1"
                    stroke={CHART_COLORS.accent}
                    fill={CHART_COLORS.accent}
                    fillOpacity={0.6}
                    name="Check-outs"
                  />
                  <Area
                    type="monotone"
                    dataKey="nuevas"
                    stackId="1"
                    stroke={CHART_COLORS.primary}
                    fill={CHART_COLORS.primary}
                    fillOpacity={0.6}
                    name="Nuevas Reservas"
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Tabla de Reservas Filtradas */}
        {filteredData && filteredData.reservations.length > 0 && (
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Eye className="w-5 h-5 mr-2 text-gray-600" />
                Reservas Filtradas ({filteredData.reservations.length})
              </CardTitle>
              <CardDescription>
                Datos detallados según filtros aplicados
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Código</TableHead>
                      <TableHead>Huésped</TableHead>
                      <TableHead>Ubicación</TableHead>
                      <TableHead>Check-in</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead className="text-right">Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredData.reservations
                      .slice(0, 10)
                      .map((reservation) => (
                        <TableRow
                          key={reservation.id}
                          className="hover:bg-gray-50"
                        >
                          <TableCell className="font-medium text-blue-600">
                            {reservation.reservationCode}
                          </TableCell>
                          <TableCell>{reservation.guestName}</TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className={
                                reservation.location === "El Sunzal"
                                  ? "text-blue-600 border-blue-600"
                                  : "text-green-600 border-green-600"
                              }
                            >
                              <MapPin className="w-3 h-3 mr-1" />
                              {reservation.location}
                            </Badge>
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
                              {reservation.status === "confirmed" && (
                                <Clock className="w-3 h-3 mr-1" />
                              )}
                              {reservation.status === "checked_in" && (
                                <CheckCircle className="w-3 h-3 mr-1" />
                              )}
                              {reservation.status === "checked_out" && (
                                <CheckCircle className="w-3 h-3 mr-1" />
                              )}
                              {reservation.status === "cancelled" && (
                                <AlertTriangle className="w-3 h-3 mr-1" />
                              )}
                              {reservation.status === "confirmed" &&
                                "Confirmada"}
                              {reservation.status === "checked_in" && "Activa"}
                              {reservation.status === "checked_out" &&
                                "Completada"}
                              {reservation.status === "cancelled" &&
                                "Cancelada"}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right font-medium text-green-600">
                            ${reservation.totalAmount.toFixed(2)}
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </div>
              {filteredData.reservations.length > 10 && (
                <div className="mt-4 text-center">
                  <p className="text-sm text-gray-600">
                    Mostrando 10 de {filteredData.reservations.length} reservas
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </AdminLayout>
  );
};

export default ReportsModule;
