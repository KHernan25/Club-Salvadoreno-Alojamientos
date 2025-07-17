import { useState } from "react";
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
  LogIn,
  LogOut,
  User,
  Clock,
  Calendar,
  Key,
  Shield,
  Home,
} from "lucide-react";
import CheckInManager from "@/components/CheckInManager";
import CheckOutManager from "@/components/CheckOutManager";
import { getCurrentUser, requireAuth, hasPermission } from "@/lib/auth-service";
import { toast } from "@/hooks/use-toast";

const HostCheckInOut = () => {
  const navigate = useNavigate();
  const currentUser = getCurrentUser();
  const [activeTab, setActiveTab] = useState("checkin");

  // Verificar autenticación
  if (!requireAuth()) {
    navigate("/backoffice");
    return null;
  }

  if (!hasPermission("canManageReservations")) {
    toast({
      title: "Acceso Denegado",
      description:
        "No tienes permisos para acceder al sistema de check-in/check-out",
      variant: "destructive",
    });
    navigate("/backoffice");
    return null;
  }

  if (!currentUser) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-white/20 rounded-lg">
                  <Key className="h-8 w-8" />
                </div>
                <div>
                  <CardTitle className="text-2xl">
                    Sistema de Check-in / Check-out
                  </CardTitle>
                  <CardDescription className="text-blue-100">
                    Gestión de llegadas y salidas de huéspedes
                  </CardDescription>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <Badge variant="secondary" className="text-gray-800">
                  <User className="w-3 h-3 mr-1" />
                  {currentUser.firstName} {currentUser.lastName}
                </Badge>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate("/admin/anfitrion")}
                  className="text-white hover:bg-white/20"
                >
                  <Home className="w-4 h-4 mr-2" />
                  Dashboard
                </Button>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="border-green-200 bg-green-50">
            <CardContent className="pt-6">
              <div className="flex items-center space-x-3">
                <LogIn className="h-8 w-8 text-green-600" />
                <div>
                  <h3 className="font-semibold text-green-800">Check-in</h3>
                  <p className="text-sm text-green-600">
                    Registra la llegada de huéspedes
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-orange-200 bg-orange-50">
            <CardContent className="pt-6">
              <div className="flex items-center space-x-3">
                <LogOut className="h-8 w-8 text-orange-600" />
                <div>
                  <h3 className="font-semibold text-orange-800">Check-out</h3>
                  <p className="text-sm text-orange-600">
                    Procesa la salida de huéspedes
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-blue-200 bg-blue-50">
            <CardContent className="pt-6">
              <div className="flex items-center space-x-3">
                <Clock className="h-8 w-8 text-blue-600" />
                <div>
                  <h3 className="font-semibold text-blue-800">Tiempo Real</h3>
                  <p className="text-sm text-blue-600">
                    {new Date().toLocaleTimeString("es-ES", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Instructions Card */}
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="flex items-center text-blue-800">
              <Shield className="w-5 h-5 mr-2" />
              Instrucciones de Uso
            </CardTitle>
          </CardHeader>
          <CardContent className="text-blue-700">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium mb-2">📝 Para Check-in:</h4>
                <ul className="text-sm space-y-1">
                  <li>• Solicita el código de reserva al huésped</li>
                  <li>• Verifica documentos de identidad</li>
                  <li>• Confirma número de huéspedes</li>
                  <li>• Entrega las llaves del alojamiento</li>
                  <li>• Registra la hora real de llegada</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2">📋 Para Check-out:</h4>
                <ul className="text-sm space-y-1">
                  <li>• Revisa las reservas del día</li>
                  <li>• Inspecciona el estado del alojamiento</li>
                  <li>• Recibe las llaves del huésped</li>
                  <li>• Registra cualquier daño o incidencia</li>
                  <li>• Completa el proceso de salida</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Content */}
        <Card>
          <CardContent className="p-6">
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="space-y-6"
            >
              <TabsList className="grid w-full grid-cols-2 h-12">
                <TabsTrigger
                  value="checkin"
                  className="flex items-center space-x-2 text-lg"
                >
                  <LogIn className="w-5 h-5" />
                  <span>Check-in de Huéspedes</span>
                </TabsTrigger>
                <TabsTrigger
                  value="checkout"
                  className="flex items-center space-x-2 text-lg"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Check-out de Huéspedes</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="checkin" className="space-y-4">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                  <div className="flex items-center space-x-2">
                    <LogIn className="w-5 h-5 text-green-600" />
                    <h3 className="font-semibold text-green-800">
                      Proceso de Check-in
                    </h3>
                  </div>
                  <p className="text-green-700 mt-2">
                    Busca la reserva por código e ingresa los detalles de
                    llegada del huésped.
                  </p>
                </div>
                <CheckInManager />
              </TabsContent>

              <TabsContent value="checkout" className="space-y-4">
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6">
                  <div className="flex items-center space-x-2">
                    <LogOut className="w-5 h-5 text-orange-600" />
                    <h3 className="font-semibold text-orange-800">
                      Proceso de Check-out
                    </h3>
                  </div>
                  <p className="text-orange-700 mt-2">
                    Revisa las salidas programadas para hoy y completa el
                    proceso de check-out.
                  </p>
                </div>
                <CheckOutManager />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Footer */}
        <Card className="bg-gray-100">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between text-sm text-gray-600">
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4" />
                <span>
                  {new Date().toLocaleDateString("es-ES", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </div>
              <div>Sistema de Gestión de Huéspedes - Casa Sunzal</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default HostCheckInOut;
