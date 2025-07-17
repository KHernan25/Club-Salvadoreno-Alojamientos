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
  Shield,
  QrCode,
  CreditCard,
  Camera,
  Users,
  Clock,
  CheckCircle,
  AlertTriangle,
  History,
  Scan,
  UserPlus,
} from "lucide-react";
import AdminLayout from "@/components/AdminLayout";
import { getCurrentUser, requireAuth, hasPermission } from "@/lib/auth-service";
import {
  accessControlService,
  AccessRecord,
} from "@/lib/access-control-service";
import { toast } from "@/hooks/use-toast";
import MemberDetection from "@/components/MemberDetection";
import CompanionEntry from "@/components/CompanionEntry";
import AccessHistory from "@/components/AccessHistory";

const PorteriaDashboard = () => {
  const navigate = useNavigate();
  const currentUser = getCurrentUser();
  const [activeAccesses, setActiveAccesses] = useState<AccessRecord[]>([]);
  const [dailyStats, setDailyStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("detection");

  useEffect(() => {
    if (!requireAuth()) {
      navigate("/backoffice");
      return;
    }

    if (!hasPermission("canManageAccessControl")) {
      toast({
        title: "Acceso Denegado",
        description: "No tienes permisos para acceder al sistema de portería",
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

      // Cargar accesos activos
      const active = accessControlService.getActiveAccesses();
      setActiveAccesses(active);

      // Cargar estadísticas del día
      const stats = accessControlService.getDailyStats();
      setDailyStats(stats);

      console.log("✅ Dashboard data loaded:", {
        active: active.length,
        stats,
      });
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

  const handleAccessRegistered = () => {
    // Recargar datos cuando se registra un nuevo acceso
    loadDashboardData();
    setActiveTab("companions"); // Cambiar a la pestaña de acompañantes
  };

  const handleCompanionsRegistered = () => {
    // Recargar datos cuando se registran acompañantes
    loadDashboardData();
    toast({
      title: "Éxito",
      description: "Acompañantes registrados correctamente",
    });
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
            <p className="text-gray-600">Cargando sistema de portería...</p>
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
            <Shield className="h-8 w-8 text-blue-600" />
            <div>
              <h1 className="text-2xl font-bold">Sistema de Portería</h1>
              <p className="text-gray-600">
                Control de acceso y gestión de visitantes
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="text-blue-600 border-blue-600">
              <Shield className="w-3 h-3 mr-1" />
              Portero: {currentUser.firstName}
            </Badge>
          </div>
        </div>

        {/* Stats Cards */}
        {dailyStats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Accesos Hoy
                </CardTitle>
                <CheckCircle className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {dailyStats.totalAccesses}
                </div>
                <p className="text-xs text-muted-foreground">
                  miembros registrados
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Acompañantes
                </CardTitle>
                <Users className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {dailyStats.totalCompanions}
                </div>
                <p className="text-xs text-muted-foreground">registrados hoy</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Accesos Activos
                </CardTitle>
                <Clock className="h-4 w-4 text-orange-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {dailyStats.activeAccesses}
                </div>
                <p className="text-xs text-muted-foreground">
                  pendientes completar
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Método Principal
                </CardTitle>
                <Scan className="h-4 w-4 text-purple-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {Object.entries(dailyStats.detectionMethods)
                    .sort(
                      ([, a], [, b]) => (Number(b) || 0) - (Number(a) || 0),
                    )[0]?.[0]
                    ?.toUpperCase() || "N/A"}
                </div>
                <p className="text-xs text-muted-foreground">
                  detección más usada
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Main Content */}
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-4"
        >
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger
              value="detection"
              className="flex items-center space-x-2"
            >
              <QrCode className="w-4 h-4" />
              <span>Detección</span>
            </TabsTrigger>
            <TabsTrigger
              value="companions"
              className="flex items-center space-x-2"
            >
              <UserPlus className="w-4 h-4" />
              <span>Acompañantes</span>
            </TabsTrigger>
            <TabsTrigger value="active" className="flex items-center space-x-2">
              <Clock className="w-4 h-4" />
              <span>Activos ({activeAccesses.length})</span>
            </TabsTrigger>
            <TabsTrigger
              value="history"
              className="flex items-center space-x-2"
            >
              <History className="w-4 h-4" />
              <span>Historial</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="detection" className="space-y-4">
            <MemberDetection
              onAccessRegistered={handleAccessRegistered}
              currentUser={currentUser}
            />
          </TabsContent>

          <TabsContent value="companions" className="space-y-4">
            <CompanionEntry
              activeAccesses={activeAccesses}
              onCompanionsRegistered={handleCompanionsRegistered}
            />
          </TabsContent>

          <TabsContent value="active" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Clock className="h-5 w-5 text-orange-600" />
                  <span>Accesos Activos</span>
                </CardTitle>
                <CardDescription>
                  Miembros que han ingresado pero no han completado el registro
                  de acompañantes
                </CardDescription>
              </CardHeader>
              <CardContent>
                {activeAccesses.length === 0 ? (
                  <div className="text-center py-8">
                    <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      Todos los accesos completados
                    </h3>
                    <p className="text-gray-600">
                      No hay registros pendientes de completar
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {activeAccesses.map((access) => (
                      <div
                        key={access.id}
                        className="flex items-center space-x-4 p-4 border rounded-lg bg-orange-50 border-orange-200"
                      >
                        {access.memberPhoto && (
                          <img
                            src={access.memberPhoto}
                            alt={access.memberName}
                            className="w-12 h-12 rounded-full object-cover"
                          />
                        )}
                        <div className="flex-1">
                          <h4 className="font-medium">{access.memberName}</h4>
                          <p className="text-sm text-gray-600">
                            Código: {access.memberCode} •{" "}
                            {access.membershipType}
                          </p>
                          <p className="text-sm text-gray-500">
                            Ingreso: {access.accessTime.toLocaleTimeString()}
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
                          <Button
                            size="sm"
                            onClick={() => setActiveTab("companions")}
                          >
                            Completar
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history" className="space-y-4">
            <AccessHistory />
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default PorteriaDashboard;
