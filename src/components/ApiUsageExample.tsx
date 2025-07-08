import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Loader2, CheckCircle, XCircle, Info } from "lucide-react";

// Import all the API hooks
import {
  useUsers,
  useAccommodations,
  useReservations,
  useNotifications,
  useContactMessages,
  useRegistrationRequests,
  useUserStats,
  useReservationStats,
  useContactStats,
  useCreateReservation,
  useUpdateUser,
  useApproveRegistrationRequest,
  useSendContactMessage,
} from "@/hooks/use-api";

// Import individual API functions for manual calls
import { apiService } from "@/lib/api-service";

/**
 * Componente de ejemplo que demuestra cómo usar todas las APIs disponibles
 * Este componente NO debe usarse en producción - es solo para demostración
 */
export const ApiUsageExample: React.FC = () => {
  const [manualResults, setManualResults] = useState<Record<string, any>>({});

  // Usar hooks de datos (se ejecutan automáticamente)
  const { data: users, loading: usersLoading, error: usersError } = useUsers();
  const {
    data: accommodations,
    loading: accommodationsLoading,
    error: accommodationsError,
  } = useAccommodations();
  const {
    data: reservations,
    loading: reservationsLoading,
    error: reservationsError,
  } = useReservations(true);
  const {
    data: notifications,
    loading: notificationsLoading,
    error: notificationsError,
  } = useNotifications();
  const {
    data: userStats,
    loading: userStatsLoading,
    error: userStatsError,
  } = useUserStats();

  // Usar hooks de mutación (se ejecutan manualmente)
  const { mutate: createReservation, loading: createReservationLoading } =
    useCreateReservation();
  const { mutate: updateUser, loading: updateUserLoading } = useUpdateUser();
  const { mutate: approveRequest, loading: approveRequestLoading } =
    useApproveRegistrationRequest();
  const { mutate: sendMessage, loading: sendMessageLoading } =
    useSendContactMessage();

  // Funciones para llamadas manuales a APIs
  const handleManualApiCall = async (apiName: string, apiCall: () => any) => {
    try {
      const result = await apiCall();
      setManualResults((prev) => ({
        ...prev,
        [apiName]: { success: true, data: result },
      }));
    } catch (error) {
      setManualResults((prev) => ({
        ...prev,
        [apiName]: { success: false, error: error.message },
      }));
    }
  };

  const renderApiStatus = (
    loading: boolean,
    error: string | null,
    data: any,
  ) => {
    if (loading)
      return (
        <Badge variant="secondary">
          <Loader2 className="w-3 h-3 mr-1 animate-spin" />
          Cargando...
        </Badge>
      );
    if (error)
      return (
        <Badge variant="destructive">
          <XCircle className="w-3 h-3 mr-1" />
          Error
        </Badge>
      );
    if (data)
      return (
        <Badge variant="default">
          <CheckCircle className="w-3 h-3 mr-1" />
          Conectado
        </Badge>
      );
    return (
      <Badge variant="outline">
        <Info className="w-3 h-3 mr-1" />
        Sin datos
      </Badge>
    );
  };

  return (
    <div className="space-y-6 p-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">
          Demostración de Integración API Completa
        </h1>
        <p className="text-muted-foreground">
          Este componente demuestra cómo usar todas las APIs conectadas del
          sistema
        </p>
      </div>

      {/* APIs que se cargan automáticamente */}
      <Card>
        <CardHeader>
          <CardTitle>APIs con Carga Automática</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="flex items-center justify-between p-3 border rounded">
              <span>Usuarios</span>
              {renderApiStatus(usersLoading, usersError, users)}
            </div>
            <div className="flex items-center justify-between p-3 border rounded">
              <span>Alojamientos</span>
              {renderApiStatus(
                accommodationsLoading,
                accommodationsError,
                accommodations,
              )}
            </div>
            <div className="flex items-center justify-between p-3 border rounded">
              <span>Reservas</span>
              {renderApiStatus(
                reservationsLoading,
                reservationsError,
                reservations,
              )}
            </div>
            <div className="flex items-center justify-between p-3 border rounded">
              <span>Notificaciones</span>
              {renderApiStatus(
                notificationsLoading,
                notificationsError,
                notifications,
              )}
            </div>
            <div className="flex items-center justify-between p-3 border rounded">
              <span>Estadísticas</span>
              {renderApiStatus(userStatsLoading, userStatsError, userStats)}
            </div>
          </div>

          {/* Mostrar datos de ejemplo */}
          {users && (
            <div className="p-3 bg-gray-50 rounded">
              <h4 className="font-medium mb-2">Usuarios cargados:</h4>
              <p className="text-sm text-muted-foreground">
                {Array.isArray(users) ? users.length : 0} usuarios encontrados
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* APIs de mutación */}
      <Card>
        <CardHeader>
          <CardTitle>APIs de Mutación (Crear/Actualizar/Eliminar)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button
              onClick={() =>
                createReservation({
                  accommodationId: "demo-001",
                  checkIn: "2024-02-01",
                  checkOut: "2024-02-03",
                  guests: 2,
                })
              }
              disabled={createReservationLoading}
            >
              {createReservationLoading && (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              )}
              Crear Reserva Demo
            </Button>

            <Button
              onClick={() =>
                updateUser({
                  id: "demo-user",
                  data: { firstName: "Usuario", lastName: "Demo" },
                })
              }
              disabled={updateUserLoading}
            >
              {updateUserLoading && (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              )}
              Actualizar Usuario Demo
            </Button>

            <Button
              onClick={() =>
                approveRequest({
                  id: "demo-request",
                  notes: "Aprobado automáticamente",
                })
              }
              disabled={approveRequestLoading}
            >
              {approveRequestLoading && (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              )}
              Aprobar Solicitud Demo
            </Button>

            <Button
              onClick={() =>
                sendMessage({
                  name: "Usuario Demo",
                  email: "demo@test.com",
                  subject: "Mensaje de prueba",
                  message: "Este es un mensaje de demostración",
                })
              }
              disabled={sendMessageLoading}
            >
              {sendMessageLoading && (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              )}
              Enviar Mensaje Demo
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* APIs manuales */}
      <Card>
        <CardHeader>
          <CardTitle>Llamadas API Manuales</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Button
              variant="outline"
              onClick={() =>
                handleManualApiCall("pricing", () =>
                  apiService.calculatePricing(
                    "demo-001",
                    "2024-02-01",
                    "2024-02-03",
                    2,
                  ),
                )
              }
            >
              Calcular Precios
            </Button>

            <Button
              variant="outline"
              onClick={() =>
                handleManualApiCall("accommodation", () =>
                  apiService.getAccommodationById("demo-001"),
                )
              }
            >
              Obtener Alojamiento
            </Button>

            <Button
              variant="outline"
              onClick={() =>
                handleManualApiCall("currentUser", () =>
                  apiService.getCurrentUser(),
                )
              }
            >
              Usuario Actual
            </Button>

            <Button
              variant="outline"
              onClick={() =>
                handleManualApiCall("contactStats", () =>
                  apiService.getContactStats(),
                )
              }
            >
              Estadísticas Contacto
            </Button>

            <Button
              variant="outline"
              onClick={() =>
                handleManualApiCall("pricingRates", () =>
                  apiService.getPricingRates(),
                )
              }
            >
              Tarifas de Precios
            </Button>

            <Button
              variant="outline"
              onClick={() =>
                handleManualApiCall("dayTypes", () => apiService.getDayTypes())
              }
            >
              Tipos de Día
            </Button>
          </div>

          {/* Mostrar resultados de llamadas manuales */}
          {Object.keys(manualResults).length > 0 && (
            <div className="space-y-2">
              <Separator />
              <h4 className="font-medium">Resultados de Llamadas Manuales:</h4>
              {Object.entries(manualResults).map(([apiName, result]) => (
                <div
                  key={apiName}
                  className="p-2 border rounded text-sm space-y-1"
                >
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{apiName}:</span>
                    {result.success ? (
                      <Badge variant="default">Éxito</Badge>
                    ) : (
                      <Badge variant="destructive">Error</Badge>
                    )}
                  </div>
                  {result.error && (
                    <p className="text-red-600 text-xs">{result.error}</p>
                  )}
                  {result.data && (
                    <pre className="text-xs bg-gray-100 p-2 rounded overflow-x-auto">
                      {JSON.stringify(result.data, null, 2).substring(0, 200)}
                      ...
                    </pre>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Información del estado de integración */}
      <Card>
        <CardHeader>
          <CardTitle>Estado de Integración API</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span>
                ✅ Todas las APIs del backend están conectadas al frontend
              </span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span>✅ Hooks personalizados disponibles para uso fácil</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span>
                ✅ Manejo automático de loading, errores y notificaciones
              </span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span>✅ TypeScript tipado para todas las APIs</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span>✅ Sistema de autenticación JWT integrado</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ApiUsageExample;
