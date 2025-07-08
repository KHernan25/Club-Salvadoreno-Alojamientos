import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import {
  Bell,
  Mail,
  Smartphone,
  MessageSquare,
  CreditCard,
  Calendar,
  Home,
  AlertTriangle,
  Info,
  CheckCircle,
  Settings,
} from "lucide-react";
import { alertService, type AlertPreferences } from "@/lib/alert-service";
import { pushNotificationService } from "@/lib/push-notification-service";

interface NotificationPreferencesProps {
  userId: string;
  onSave?: () => void;
}

export const NotificationPreferences = ({
  userId,
  onSave,
}: NotificationPreferencesProps) => {
  const [preferences, setPreferences] = useState<AlertPreferences>({
    userId,
    emailNotifications: true,
    pushNotifications: true,
    smsNotifications: false,
    categories: {
      reservations: true,
      payments: true,
      reminders: true,
      marketing: false,
    },
    urgencyLevels: {
      low: true,
      medium: true,
      high: true,
      critical: true,
    },
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [pushSubscriptionStatus, setPushSubscriptionStatus] = useState<
    "unknown" | "granted" | "denied" | "default"
  >("unknown");

  useEffect(() => {
    loadPreferences();
    checkPushNotificationStatus();
  }, [userId]);

  const loadPreferences = async () => {
    try {
      setIsLoading(true);
      const userPrefs = alertService.getUserPreferences(userId);
      if (userPrefs) {
        setPreferences(userPrefs);
      }
    } catch (error) {
      console.error("Error loading preferences:", error);
      toast({
        title: "Error",
        description: "No se pudieron cargar las preferencias",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const checkPushNotificationStatus = async () => {
    if ("Notification" in window) {
      setPushSubscriptionStatus(Notification.permission);

      // Check if user is subscribed to push notifications
      const isSubscribed = await pushNotificationService.isSubscribed();
      if (isSubscribed && preferences.pushNotifications) {
        // Already subscribed and enabled
      } else if (!isSubscribed && preferences.pushNotifications) {
        // Should be subscribed but not - update preference
        setPreferences((prev) => ({ ...prev, pushNotifications: false }));
      }
    }
  };

  const savePreferences = async () => {
    try {
      setIsSaving(true);
      alertService.updateUserPreferences(userId, preferences);

      toast({
        title: "Preferencias guardadas",
        description: "Tus preferencias de notificación han sido actualizadas",
      });

      onSave?.();
    } catch (error) {
      console.error("Error saving preferences:", error);
      toast({
        title: "Error",
        description: "No se pudieron guardar las preferencias",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handlePushNotificationToggle = async (enabled: boolean) => {
    if (enabled) {
      // Request permission and subscribe
      const permission = await pushNotificationService.requestPermission();
      if (permission === "granted") {
        const subscription = await pushNotificationService.subscribeUser();
        if (subscription) {
          setPreferences((prev) => ({ ...prev, pushNotifications: true }));
          setPushSubscriptionStatus("granted");
          toast({
            title: "Notificaciones push activadas",
            description: "Recibirás notificaciones push en este dispositivo",
          });
        }
      } else {
        setPushSubscriptionStatus(permission);
        toast({
          title: "Permiso denegado",
          description: "No se pueden activar las notificaciones push",
          variant: "destructive",
        });
      }
    } else {
      // Unsubscribe
      const unsubscribed = await pushNotificationService.unsubscribeUser();
      if (unsubscribed) {
        setPreferences((prev) => ({ ...prev, pushNotifications: false }));
        toast({
          title: "Notificaciones push desactivadas",
          description: "Ya no recibirás notificaciones push",
        });
      }
    }
  };

  const updatePreference = (key: keyof AlertPreferences, value: any) => {
    setPreferences((prev) => ({ ...prev, [key]: value }));
  };

  const updateCategoryPreference = (
    category: keyof AlertPreferences["categories"],
    value: boolean,
  ) => {
    setPreferences((prev) => ({
      ...prev,
      categories: { ...prev.categories, [category]: value },
    }));
  };

  const updateUrgencyPreference = (
    level: keyof AlertPreferences["urgencyLevels"],
    value: boolean,
  ) => {
    setPreferences((prev) => ({
      ...prev,
      urgencyLevels: { ...prev.urgencyLevels, [level]: value },
    }));
  };

  const getUrgencyIcon = (level: string) => {
    switch (level) {
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

  const getUrgencyLabel = (level: string) => {
    const labels = {
      critical: "Crítico",
      high: "Alto",
      medium: "Medio",
      low: "Bajo",
    };
    return labels[level as keyof typeof labels] || level;
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "reservations":
        return <Home className="h-4 w-4" />;
      case "payments":
        return <CreditCard className="h-4 w-4" />;
      case "reminders":
        return <Calendar className="h-4 w-4" />;
      case "marketing":
        return <MessageSquare className="h-4 w-4" />;
      default:
        return <Bell className="h-4 w-4" />;
    }
  };

  const getCategoryLabel = (category: string) => {
    const labels = {
      reservations: "Reservas",
      payments: "Pagos",
      reminders: "Recordatorios",
      marketing: "Marketing",
    };
    return labels[category as keyof typeof labels] || category;
  };

  const getCategoryDescription = (category: string) => {
    const descriptions = {
      reservations:
        "Confirmaciones, cancelaciones y modificaciones de reservas",
      payments: "Estados de pago, recordatorios y errores de procesamiento",
      reminders: "Recordatorios de check-in, check-out y fechas importantes",
      marketing: "Ofertas especiales, promociones y newsletters",
    };
    return descriptions[category as keyof typeof descriptions] || "";
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="py-8">
          <div className="text-center">
            <Settings className="h-8 w-8 mx-auto text-muted-foreground animate-spin" />
            <p className="text-muted-foreground mt-2">
              Cargando preferencias...
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Main Notification Channels */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Canales de Notificación
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Email Notifications */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Mail className="h-5 w-5 text-blue-500" />
              <div>
                <Label className="text-sm font-medium">
                  Notificaciones por Email
                </Label>
                <p className="text-sm text-muted-foreground">
                  Recibe notificaciones detalladas en tu correo electrónico
                </p>
              </div>
            </div>
            <Switch
              checked={preferences.emailNotifications}
              onCheckedChange={(checked) =>
                updatePreference("emailNotifications", checked)
              }
            />
          </div>

          <Separator />

          {/* Push Notifications */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Smartphone className="h-5 w-5 text-green-500" />
              <div>
                <Label className="text-sm font-medium">
                  Notificaciones Push
                </Label>
                <p className="text-sm text-muted-foreground">
                  Notificaciones instantáneas en tu dispositivo
                </p>
                {pushSubscriptionStatus === "denied" && (
                  <Badge variant="destructive" className="mt-1">
                    Bloqueado por el navegador
                  </Badge>
                )}
              </div>
            </div>
            <Switch
              checked={preferences.pushNotifications}
              onCheckedChange={handlePushNotificationToggle}
              disabled={pushSubscriptionStatus === "denied"}
            />
          </div>

          <Separator />

          {/* SMS Notifications */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <MessageSquare className="h-5 w-5 text-purple-500" />
              <div>
                <Label className="text-sm font-medium">
                  Notificaciones por SMS
                </Label>
                <p className="text-sm text-muted-foreground">
                  Mensajes de texto para notificaciones urgentes
                </p>
              </div>
            </div>
            <Switch
              checked={preferences.smsNotifications}
              onCheckedChange={(checked) =>
                updatePreference("smsNotifications", checked)
              }
            />
          </div>
        </CardContent>
      </Card>

      {/* Notification Categories */}
      <Card>
        <CardHeader>
          <CardTitle>Categorías de Notificación</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {Object.entries(preferences.categories).map(([category, enabled]) => (
            <div key={category}>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {getCategoryIcon(category)}
                  <div className="flex-1">
                    <Label className="text-sm font-medium">
                      {getCategoryLabel(category)}
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      {getCategoryDescription(category)}
                    </p>
                  </div>
                </div>
                <Switch
                  checked={enabled}
                  onCheckedChange={(checked) =>
                    updateCategoryPreference(
                      category as keyof AlertPreferences["categories"],
                      checked,
                    )
                  }
                />
              </div>
              {category !== "marketing" && <Separator className="mt-4" />}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Urgency Levels */}
      <Card>
        <CardHeader>
          <CardTitle>Niveles de Urgencia</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {Object.entries(preferences.urgencyLevels).map(([level, enabled]) => (
            <div key={level} className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                {getUrgencyIcon(level)}
                <div>
                  <Label className="text-sm font-medium">
                    {getUrgencyLabel(level)}
                  </Label>
                  {level === "critical" && (
                    <p className="text-sm text-muted-foreground">
                      Alertas que requieren acción inmediata (siempre activado)
                    </p>
                  )}
                </div>
              </div>
              <Switch
                checked={enabled}
                onCheckedChange={(checked) =>
                  updateUrgencyPreference(
                    level as keyof AlertPreferences["urgencyLevels"],
                    checked,
                  )
                }
                disabled={level === "critical"} // Critical notifications always enabled
              />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Notification Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Resumen de Configuración</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-medium mb-2">Canales Activos:</h4>
              <div className="space-y-1">
                {preferences.emailNotifications && (
                  <Badge variant="outline">Email</Badge>
                )}
                {preferences.pushNotifications && (
                  <Badge variant="outline">Push</Badge>
                )}
                {preferences.smsNotifications && (
                  <Badge variant="outline">SMS</Badge>
                )}
              </div>
            </div>
            <div>
              <h4 className="font-medium mb-2">Categorías Activas:</h4>
              <div className="space-y-1">
                {Object.entries(preferences.categories).map(
                  ([category, enabled]) =>
                    enabled ? (
                      <Badge key={category} variant="outline">
                        {getCategoryLabel(category)}
                      </Badge>
                    ) : null,
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end space-x-2">
        <Button variant="outline" onClick={loadPreferences} disabled={isSaving}>
          Restablecer
        </Button>
        <Button onClick={savePreferences} disabled={isSaving}>
          {isSaving ? "Guardando..." : "Guardar Preferencias"}
        </Button>
      </div>
    </div>
  );
};
