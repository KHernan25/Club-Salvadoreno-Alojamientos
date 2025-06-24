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
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import {
  Settings,
  Save,
  Globe,
  Mail,
  Bell,
  Shield,
  Database,
  Crown,
  Key,
  Palette,
  Clock,
  MapPin,
} from "lucide-react";
import AdminLayout from "@/components/AdminLayout";
import { isSuperAdmin, hasPermission } from "@/lib/auth-service";

interface SystemSettings {
  siteName: string;
  siteDescription: string;
  contactEmail: string;
  contactPhone: string;
  address: string;
  timezone: string;
  currency: string;
  language: string;
  emailNotifications: boolean;
  smsNotifications: boolean;
  maintenanceMode: boolean;
  allowRegistrations: boolean;
  requireApproval: boolean;
  maxReservationDays: number;
  cancellationDeadline: number;
  autoConfirmReservations: boolean;
}

const AdminSettings = () => {
  const [settings, setSettings] = useState<SystemSettings>({
    siteName: "Club Salvadoreño",
    siteDescription: "Sistema de reservas para alojamientos turísticos",
    contactEmail: "info@clubsalvadoreno.com",
    contactPhone: "+503 2345-6789",
    address: "El Salvador, Centroamérica",
    timezone: "America/El_Salvador",
    currency: "USD",
    language: "es",
    emailNotifications: true,
    smsNotifications: false,
    maintenanceMode: false,
    allowRegistrations: true,
    requireApproval: true,
    maxReservationDays: 365,
    cancellationDeadline: 48,
    autoConfirmReservations: false,
  });

  const [loading, setLoading] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  const handleSettingChange = (key: keyof SystemSettings, value: any) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
    setHasChanges(true);
  };

  const handleSaveSettings = async () => {
    try {
      setLoading(true);
      // In a real app, this would save to API
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast({
        title: "Configuración guardada",
        description: "Los cambios han sido aplicados exitosamente.",
      });
      setHasChanges(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudieron guardar los cambios.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResetSettings = () => {
    setSettings({
      siteName: "Club Salvadoreño",
      siteDescription: "Sistema de reservas para alojamientos turísticos",
      contactEmail: "info@clubsalvadoreno.com",
      contactPhone: "+503 2345-6789",
      address: "El Salvador, Centroamérica",
      timezone: "America/El_Salvador",
      currency: "USD",
      language: "es",
      emailNotifications: true,
      smsNotifications: false,
      maintenanceMode: false,
      allowRegistrations: true,
      requireApproval: true,
      maxReservationDays: 365,
      cancellationDeadline: 48,
      autoConfirmReservations: false,
    });
    setHasChanges(true);
  };

  if (!hasPermission("canManageSettings")) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <h2 className="text-xl font-semibold mb-2">Acceso Denegado</h2>
            <p className="text-gray-600">
              No tienes permisos para gestionar la configuración del sistema.
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
            <div className="flex items-center space-x-2">
              <h1 className="text-2xl font-bold">Configuración del Sistema</h1>
              {isSuperAdmin() && <Crown className="h-5 w-5 text-blue-600" />}
            </div>
            <p className="text-gray-600">
              Administra la configuración general del sistema
            </p>
          </div>
          <div className="flex items-center space-x-2">
            {hasChanges && (
              <Badge variant="outline" className="text-orange-600">
                Cambios sin guardar
              </Badge>
            )}
            <Button
              onClick={handleSaveSettings}
              disabled={!hasChanges || loading}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Save className="h-4 w-4 mr-2" />
              {loading ? "Guardando..." : "Guardar Cambios"}
            </Button>
          </div>
        </div>

        <Tabs defaultValue="general" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger
              value="general"
              className="flex items-center space-x-2"
            >
              <Globe className="h-4 w-4" />
              <span>General</span>
            </TabsTrigger>
            <TabsTrigger
              value="notifications"
              className="flex items-center space-x-2"
            >
              <Bell className="h-4 w-4" />
              <span>Notificaciones</span>
            </TabsTrigger>
            <TabsTrigger
              value="reservations"
              className="flex items-center space-x-2"
            >
              <Clock className="h-4 w-4" />
              <span>Reservas</span>
            </TabsTrigger>
            <TabsTrigger
              value="security"
              className="flex items-center space-x-2"
            >
              <Shield className="h-4 w-4" />
              <span>Seguridad</span>
            </TabsTrigger>
          </TabsList>

          {/* General Settings */}
          <TabsContent value="general" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Globe className="h-5 w-5 text-blue-600" />
                  <span>Información General</span>
                </CardTitle>
                <CardDescription>
                  Configuración básica del sitio web y contacto
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="siteName">Nombre del Sitio</Label>
                    <Input
                      id="siteName"
                      value={settings.siteName}
                      onChange={(e) =>
                        handleSettingChange("siteName", e.target.value)
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="language">Idioma</Label>
                    <Select
                      value={settings.language}
                      onValueChange={(value) =>
                        handleSettingChange("language", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="es">Español</SelectItem>
                        <SelectItem value="en">English</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="siteDescription">Descripción del Sitio</Label>
                  <Textarea
                    id="siteDescription"
                    value={settings.siteDescription}
                    onChange={(e) =>
                      handleSettingChange("siteDescription", e.target.value)
                    }
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="contactEmail">Email de Contacto</Label>
                    <Input
                      id="contactEmail"
                      type="email"
                      value={settings.contactEmail}
                      onChange={(e) =>
                        handleSettingChange("contactEmail", e.target.value)
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="contactPhone">Teléfono de Contacto</Label>
                    <Input
                      id="contactPhone"
                      value={settings.contactPhone}
                      onChange={(e) =>
                        handleSettingChange("contactPhone", e.target.value)
                      }
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="address">Dirección</Label>
                  <Input
                    id="address"
                    value={settings.address}
                    onChange={(e) =>
                      handleSettingChange("address", e.target.value)
                    }
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="timezone">Zona Horaria</Label>
                    <Select
                      value={settings.timezone}
                      onValueChange={(value) =>
                        handleSettingChange("timezone", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="America/El_Salvador">
                          El Salvador (CST)
                        </SelectItem>
                        <SelectItem value="America/Guatemala">
                          Guatemala (CST)
                        </SelectItem>
                        <SelectItem value="America/Managua">
                          Nicaragua (CST)
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="currency">Moneda</Label>
                    <Select
                      value={settings.currency}
                      onValueChange={(value) =>
                        handleSettingChange("currency", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="USD">USD ($)</SelectItem>
                        <SelectItem value="EUR">EUR (€)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center space-x-2 pt-6">
                    <Switch
                      id="maintenanceMode"
                      checked={settings.maintenanceMode}
                      onCheckedChange={(checked) =>
                        handleSettingChange("maintenanceMode", checked)
                      }
                    />
                    <Label htmlFor="maintenanceMode">Modo Mantenimiento</Label>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notifications Settings */}
          <TabsContent value="notifications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Bell className="h-5 w-5 text-blue-600" />
                  <span>Configuración de Notificaciones</span>
                </CardTitle>
                <CardDescription>
                  Administra cómo se envían las notificaciones del sistema
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Notificaciones por Email</Label>
                    <p className="text-sm text-gray-500">
                      Enviar confirmaciones y recordatorios por correo
                      electrónico
                    </p>
                  </div>
                  <Switch
                    checked={settings.emailNotifications}
                    onCheckedChange={(checked) =>
                      handleSettingChange("emailNotifications", checked)
                    }
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Notificaciones por SMS</Label>
                    <p className="text-sm text-gray-500">
                      Enviar notificaciones importantes por mensaje de texto
                    </p>
                  </div>
                  <Switch
                    checked={settings.smsNotifications}
                    onCheckedChange={(checked) =>
                      handleSettingChange("smsNotifications", checked)
                    }
                  />
                </div>

                <Separator />

                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex items-center space-x-2 text-blue-800">
                    <Mail className="h-5 w-5" />
                    <span className="font-medium">Configuración SMTP</span>
                  </div>
                  <p className="text-sm text-blue-700 mt-1">
                    Para configurar el servidor de correo, contacta al
                    administrador del sistema.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Reservations Settings */}
          <TabsContent value="reservations" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Clock className="h-5 w-5 text-blue-600" />
                  <span>Configuración de Reservas</span>
                </CardTitle>
                <CardDescription>
                  Políticas y límites para el sistema de reservas
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="maxReservationDays">
                      Máximo Días de Reserva Anticipada
                    </Label>
                    <Input
                      id="maxReservationDays"
                      type="number"
                      min="1"
                      max="730"
                      value={settings.maxReservationDays}
                      onChange={(e) =>
                        handleSettingChange(
                          "maxReservationDays",
                          parseInt(e.target.value),
                        )
                      }
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      Días máximos que se puede reservar con anticipación
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="cancellationDeadline">
                      Plazo de Cancelación (horas)
                    </Label>
                    <Input
                      id="cancellationDeadline"
                      type="number"
                      min="1"
                      max="168"
                      value={settings.cancellationDeadline}
                      onChange={(e) =>
                        handleSettingChange(
                          "cancellationDeadline",
                          parseInt(e.target.value),
                        )
                      }
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      Horas antes del check-in para cancelar sin penalización
                    </p>
                  </div>
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Confirmación Automática</Label>
                    <p className="text-sm text-gray-500">
                      Confirmar automáticamente las reservas al recibir el pago
                    </p>
                  </div>
                  <Switch
                    checked={settings.autoConfirmReservations}
                    onCheckedChange={(checked) =>
                      handleSettingChange("autoConfirmReservations", checked)
                    }
                  />
                </div>

                <Separator />

                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="flex items-center space-x-2 text-green-800">
                    <MapPin className="h-5 w-5" />
                    <span className="font-medium">Política de Reservas</span>
                  </div>
                  <p className="text-sm text-green-700 mt-1">
                    Las configuraciones actuales permiten reservas flexibles con
                    aprobación manual.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Settings */}
          <TabsContent value="security" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Shield className="h-5 w-5 text-blue-600" />
                  <span>Configuración de Seguridad</span>
                </CardTitle>
                <CardDescription>
                  Políticas de acceso y registro de usuarios
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Permitir Registros</Label>
                    <p className="text-sm text-gray-500">
                      Habilitar el registro de nuevos usuarios en el sitio
                    </p>
                  </div>
                  <Switch
                    checked={settings.allowRegistrations}
                    onCheckedChange={(checked) =>
                      handleSettingChange("allowRegistrations", checked)
                    }
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Requerir Aprobación</Label>
                    <p className="text-sm text-gray-500">
                      Los nuevos usuarios requieren aprobación manual del
                      administrador
                    </p>
                  </div>
                  <Switch
                    checked={settings.requireApproval}
                    onCheckedChange={(checked) =>
                      handleSettingChange("requireApproval", checked)
                    }
                  />
                </div>

                <Separator />

                <div className="bg-orange-50 p-4 rounded-lg">
                  <div className="flex items-center space-x-2 text-orange-800">
                    <Key className="h-5 w-5" />
                    <span className="font-medium">Configuración Avanzada</span>
                  </div>
                  <p className="text-sm text-orange-700 mt-1">
                    Para configuraciones de seguridad avanzadas, contacta al
                    desarrollador del sistema.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Footer Actions */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">
                  Los cambios en la configuración se aplicarán inmediatamente al
                  guardar.
                </p>
              </div>
              <div className="flex space-x-2">
                <Button variant="outline" onClick={handleResetSettings}>
                  Restaurar Valores por Defecto
                </Button>
                <Button
                  onClick={handleSaveSettings}
                  disabled={!hasChanges || loading}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {loading ? "Guardando..." : "Guardar Todo"}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminSettings;
