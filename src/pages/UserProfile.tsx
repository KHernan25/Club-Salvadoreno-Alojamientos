import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import { useNavigate } from "react-router-dom";
import { useTranslations } from "@/contexts/LanguageContext";
import Layout from "@/components/Layout";
import {
  Menu,
  Globe,
  User,
  ChevronDown,
  Edit3,
  Save,
  X,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Shield,
  CreditCard,
  Bell,
  Settings,
  Camera,
  Award,
  Star,
  Clock,
  Bed,
  CheckCircle,
  AlertCircle,
  Plus,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import { getCurrentUser } from "@/lib/auth-service";

const UserProfile = () => {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    birthDate: "",
    nationality: "",
    document: "",
    memberSince: "",
    preferredLanguage: "es",
    currency: "USD",
  });

  // Load user data from session
  useEffect(() => {
    const currentUser = getCurrentUser();
    if (currentUser) {
      setProfileData({
        firstName: currentUser.firstName || "",
        lastName: currentUser.lastName || "",
        email: currentUser.email || "",
        phone: currentUser.phone || "",
        address: currentUser.address || "San Salvador, El Salvador",
        birthDate: currentUser.birthDate || "",
        nationality: currentUser.nationality || "Salvadoreña",
        document: currentUser.documentNumber || "",
        memberSince: currentUser.createdAt || "2023-01-15",
        preferredLanguage: currentUser.preferredLanguage || "es",
        currency: "USD",
      });
    } else {
      // Redirect to login if no user session
      navigate("/login", { replace: true });
    }
  }, [navigate]);

  const [notifications, setNotifications] = useState({
    email: true,
    sms: false,
    push: true,
    marketing: false,
    booking: true,
    reminder: true,
  });

  const [privacy, setPrivacy] = useState({
    profileVisible: true,
    shareActivity: false,
    allowReviews: true,
  });

  // Simulated user stats
  const userStats = {
    totalReservations: 12,
    completedStays: 8,
    cancelledReservations: 1,
    totalSpent: 2340,
    memberLevel: "Gold",
    points: 1250,
    nextLevelPoints: 500,
    favoriteAccommodation: "Apartamento 1A",
    averageRating: 4.8,
  };

  // Simulated recent activity
  const recentActivity = [
    {
      type: "reservation",
      title: "Nueva reserva confirmada",
      description: "Apartamento 1A - Junio 7-8, 2025",
      date: "2025-01-15",
      icon: CheckCircle,
      color: "text-green-600",
    },
    {
      type: "review",
      title: "Reseña enviada",
      description: "Suite Ejecutiva - 5 estrellas",
      date: "2025-01-12",
      icon: Star,
      color: "text-yellow-600",
    },
    {
      type: "profile",
      title: "Perfil actualizado",
      description: "Información de contacto modificada",
      date: "2025-01-10",
      icon: User,
      color: "text-blue-600",
    },
  ];

  // Simulated saved payment methods
  const paymentMethods = [
    {
      id: 1,
      type: "visa",
      lastFour: "4532",
      expiryMonth: "12",
      expiryYear: "2027",
      isDefault: true,
    },
    {
      id: 2,
      type: "mastercard",
      lastFour: "8765",
      expiryMonth: "08",
      expiryYear: "2026",
      isDefault: false,
    },
  ];

  const handleSave = () => {
    setIsEditing(false);
    // Here would be API call to save data
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Here would reset data to original values
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Navigation */}
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        {/* Profile Header */}
        <div className="mb-8">
          <Card className="bg-gradient-to-r from-blue-900 to-blue-800 text-white border-0">
            <CardContent className="p-8">
              <div className="flex items-start gap-6">
                <div className="relative">
                  <Avatar className="h-24 w-24 border-4 border-white/20">
                    <AvatarImage
                      src="/placeholder.svg"
                      alt={`${profileData.firstName} ${profileData.lastName}`}
                    />
                    <AvatarFallback className="text-blue-600 text-xl font-semibold bg-white">
                      {profileData.firstName[0]}
                      {profileData.lastName[0]}
                    </AvatarFallback>
                  </Avatar>
                  <Button
                    size="sm"
                    className="absolute -bottom-2 -right-2 rounded-full h-8 w-8 p-0 bg-white text-blue-900 hover:bg-slate-100"
                  >
                    <Camera className="h-4 w-4" />
                  </Button>
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-2xl font-bold">
                      {profileData.firstName} {profileData.lastName}
                    </h1>
                    <Badge className="bg-yellow-500 text-yellow-900 border-0">
                      <Award className="h-3 w-3 mr-1" />
                      {userStats.memberLevel}
                    </Badge>
                  </div>

                  <div className="flex flex-wrap gap-4 text-sm text-blue-100 mb-4">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      {profileData.email}
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      {profileData.address}
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      Miembro desde {formatDate(profileData.memberSince)}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold">
                        {userStats.totalReservations}
                      </div>
                      <div className="text-xs text-blue-200">
                        Reservas Totales
                      </div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold">
                        {userStats.completedStays}
                      </div>
                      <div className="text-xs text-blue-200">
                        Estadías Completadas
                      </div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold">
                        ${userStats.totalSpent}
                      </div>
                      <div className="text-xs text-blue-200">Total Gastado</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold flex items-center justify-center gap-1">
                        {userStats.averageRating}{" "}
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      </div>
                      <div className="text-xs text-blue-200">
                        Calificación Promedio
                      </div>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  {isEditing ? (
                    <div className="flex gap-2">
                      <Button
                        onClick={handleSave}
                        size="sm"
                        className="bg-green-600 hover:bg-green-700 gap-2"
                      >
                        <Save className="h-4 w-4" />
                        Guardar
                      </Button>
                      <Button
                        onClick={handleCancel}
                        variant="outline"
                        size="sm"
                        className="gap-2 border-white/20 text-white hover:bg-white/10"
                      >
                        <X className="h-4 w-4" />
                        Cancelar
                      </Button>
                    </div>
                  ) : (
                    <Button
                      onClick={() => setIsEditing(true)}
                      variant="outline"
                      size="sm"
                      className="gap-2 border-white/20 text-white hover:bg-white/10"
                    >
                      <Edit3 className="h-4 w-4" />
                      Editar Perfil
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="personal" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="personal">Información Personal</TabsTrigger>
            <TabsTrigger value="preferences">Preferencias</TabsTrigger>
            <TabsTrigger value="payments">Métodos de Pago</TabsTrigger>
            <TabsTrigger value="activity">Actividad</TabsTrigger>
            <TabsTrigger value="security">Seguridad</TabsTrigger>
          </TabsList>

          {/* Personal Information */}
          <TabsContent value="personal" className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Información Básica</CardTitle>
                  <CardDescription>
                    Datos personales y de contacto
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">Nombre</Label>
                      <Input
                        id="firstName"
                        value={profileData.firstName}
                        onChange={(e) =>
                          setProfileData({
                            ...profileData,
                            firstName: e.target.value,
                          })
                        }
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Apellido</Label>
                      <Input
                        id="lastName"
                        value={profileData.lastName}
                        onChange={(e) =>
                          setProfileData({
                            ...profileData,
                            lastName: e.target.value,
                          })
                        }
                        disabled={!isEditing}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Correo Electrónico</Label>
                    <Input
                      id="email"
                      type="email"
                      value={profileData.email}
                      onChange={(e) =>
                        setProfileData({
                          ...profileData,
                          email: e.target.value,
                        })
                      }
                      disabled={!isEditing}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Teléfono</Label>
                    <Input
                      id="phone"
                      value={profileData.phone}
                      onChange={(e) =>
                        setProfileData({
                          ...profileData,
                          phone: e.target.value,
                        })
                      }
                      disabled={!isEditing}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address">Dirección</Label>
                    <Input
                      id="address"
                      value={profileData.address}
                      onChange={(e) =>
                        setProfileData({
                          ...profileData,
                          address: e.target.value,
                        })
                      }
                      disabled={!isEditing}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Información Adicional</CardTitle>
                  <CardDescription>Datos complementarios</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="birthDate">Fecha de Nacimiento</Label>
                    <Input
                      id="birthDate"
                      type="date"
                      value={profileData.birthDate}
                      onChange={(e) =>
                        setProfileData({
                          ...profileData,
                          birthDate: e.target.value,
                        })
                      }
                      disabled={!isEditing}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="nationality">Nacionalidad</Label>
                    <Input
                      id="nationality"
                      value={profileData.nationality}
                      onChange={(e) =>
                        setProfileData({
                          ...profileData,
                          nationality: e.target.value,
                        })
                      }
                      disabled={!isEditing}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="document">Documento de Identidad</Label>
                    <Input
                      id="document"
                      value={profileData.document}
                      onChange={(e) =>
                        setProfileData({
                          ...profileData,
                          document: e.target.value,
                        })
                      }
                      disabled={!isEditing}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="language">Idioma Preferido</Label>
                    <Select
                      value={profileData.preferredLanguage}
                      onValueChange={(value) =>
                        setProfileData({
                          ...profileData,
                          preferredLanguage: value,
                        })
                      }
                      disabled={!isEditing}
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
                </CardContent>
              </Card>
            </div>

            {/* Membership Status */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  Estado de Membresía
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-yellow-600 mb-2">
                      {userStats.memberLevel}
                    </div>
                    <div className="text-sm text-slate-600">Nivel Actual</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600 mb-2">
                      {userStats.points}
                    </div>
                    <div className="text-sm text-slate-600">
                      Puntos Acumulados
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600 mb-2">
                      {userStats.nextLevelPoints}
                    </div>
                    <div className="text-sm text-slate-600">
                      Para Siguiente Nivel
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <div className="flex justify-between text-sm mb-2">
                    <span>Progreso a Platinum</span>
                    <span>
                      {userStats.points} /{" "}
                      {userStats.points + userStats.nextLevelPoints}
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full"
                      style={{
                        width: `${(userStats.points / (userStats.points + userStats.nextLevelPoints)) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Preferences */}
          <TabsContent value="preferences" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Preferencias de Notificación
                </CardTitle>
                <CardDescription>
                  Configura cómo quieres recibir notificaciones
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {Object.entries({
                  email: "Notificaciones por correo electrónico",
                  sms: "Notificaciones por SMS",
                  push: "Notificaciones push",
                  marketing: "Ofertas y promociones",
                  booking: "Confirmaciones de reserva",
                  reminder: "Recordatorios de check-in",
                }).map(([key, label]) => (
                  <div key={key} className="flex items-center justify-between">
                    <div>
                      <Label className="font-medium">{label}</Label>
                      <p className="text-sm text-slate-600">
                        {key === "email" &&
                          "Recibe actualizaciones importantes por email"}
                        {key === "sms" &&
                          "Mensajes de texto para confirmaciones urgentes"}
                        {key === "push" &&
                          "Notificaciones instantáneas en tu dispositivo"}
                        {key === "marketing" &&
                          "Promociones especiales y descuentos"}
                        {key === "booking" &&
                          "Confirmaciones y cambios en tus reservas"}
                        {key === "reminder" &&
                          "Recordatorios antes de tu llegada"}
                      </p>
                    </div>
                    <Switch
                      checked={notifications[key as keyof typeof notifications]}
                      onCheckedChange={(checked) =>
                        setNotifications({ ...notifications, [key]: checked })
                      }
                    />
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Privacidad
                </CardTitle>
                <CardDescription>
                  Controla la visibilidad de tu información
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {Object.entries({
                  profileVisible: "Perfil público visible",
                  shareActivity: "Compartir actividad de reservas",
                  allowReviews: "Permitir reseñas públicas",
                }).map(([key, label]) => (
                  <div key={key} className="flex items-center justify-between">
                    <div>
                      <Label className="font-medium">{label}</Label>
                      <p className="text-sm text-slate-600">
                        {key === "profileVisible" &&
                          "Otros usuarios pueden ver tu perfil básico"}
                        {key === "shareActivity" &&
                          "Mostrar tus estadías completadas"}
                        {key === "allowReviews" &&
                          "Recibir y mostrar reseñas de otros huéspedes"}
                      </p>
                    </div>
                    <Switch
                      checked={privacy[key as keyof typeof privacy]}
                      onCheckedChange={(checked) =>
                        setPrivacy({ ...privacy, [key]: checked })
                      }
                    />
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Payment Methods */}
          <TabsContent value="payments" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <CreditCard className="h-5 w-5" />
                      Métodos de Pago
                    </CardTitle>
                    <CardDescription>
                      Gestiona tus tarjetas guardadas
                    </CardDescription>
                  </div>
                  <Button className="gap-2">
                    <Plus className="h-4 w-4" />
                    Agregar Tarjeta
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {paymentMethods.map((method) => (
                  <div
                    key={method.id}
                    className="flex items-center justify-between p-4 border border-slate-200 rounded-lg"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-8 bg-slate-100 rounded flex items-center justify-center">
                        {method.type === "visa" ? (
                          <span className="text-xs font-bold text-blue-600">
                            VISA
                          </span>
                        ) : (
                          <span className="text-xs font-bold text-red-600">
                            MC
                          </span>
                        )}
                      </div>
                      <div>
                        <div className="font-medium">
                          •••• •••• •••• {method.lastFour}
                        </div>
                        <div className="text-sm text-slate-600">
                          Expira {method.expiryMonth}/{method.expiryYear}
                        </div>
                      </div>
                      {method.isDefault && (
                        <Badge variant="secondary">Por defecto</Badge>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        Editar
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-600"
                      >
                        Eliminar
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Activity */}
          <TabsContent value="activity" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Actividad Reciente
                </CardTitle>
                <CardDescription>
                  Tu historial de acciones en la plataforma
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.map((activity, index) => (
                    <div
                      key={index}
                      className="flex gap-4 p-4 bg-slate-50 rounded-lg"
                    >
                      <div className={`p-2 rounded-full bg-slate-100`}>
                        <activity.icon
                          className={`h-4 w-4 ${activity.color}`}
                        />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-slate-900">
                          {activity.title}
                        </h4>
                        <p className="text-sm text-slate-600">
                          {activity.description}
                        </p>
                        <p className="text-xs text-slate-500 mt-1">
                          {formatDate(activity.date)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="text-center mt-6">
                  <Button
                    variant="outline"
                    onClick={() => navigate("/mis-reservas")}
                  >
                    Ver Historial Completo
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Estadísticas de Usuario</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <Bed className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-blue-600">
                      {userStats.completedStays}
                    </div>
                    <div className="text-sm text-slate-600">Estadías</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <Star className="h-8 w-8 text-green-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-green-600">
                      {userStats.averageRating}
                    </div>
                    <div className="text-sm text-slate-600">Calificación</div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <Award className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-purple-600">
                      {userStats.points}
                    </div>
                    <div className="text-sm text-slate-600">Puntos</div>
                  </div>
                  <div className="text-center p-4 bg-yellow-50 rounded-lg">
                    <CheckCircle className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-yellow-600">
                      {userStats.totalReservations}
                    </div>
                    <div className="text-sm text-slate-600">Reservas</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security */}
          <TabsContent value="security" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Seguridad de la Cuenta
                </CardTitle>
                <CardDescription>
                  Configuraciones de seguridad y acceso
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <Label className="font-medium">Contraseña</Label>
                    <p className="text-sm text-slate-600 mb-2">
                      Última actualización: Hace 3 meses
                    </p>
                    <Button variant="outline">Cambiar Contraseña</Button>
                  </div>

                  <Separator />

                  <div>
                    <Label className="font-medium">
                      Verificación en Dos Pasos
                    </Label>
                    <p className="text-sm text-slate-600 mb-2">
                      Agrega una capa extra de seguridad a tu cuenta
                    </p>
                    <Button variant="outline">Configurar 2FA</Button>
                  </div>

                  <Separator />

                  <div>
                    <Label className="font-medium">Sesiones Activas</Label>
                    <p className="text-sm text-slate-600 mb-2">
                      Gestiona los dispositivos conectados a tu cuenta
                    </p>
                    <Button variant="outline">Ver Sesiones</Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-red-600">Zona de Peligro</CardTitle>
                <CardDescription>
                  Acciones irreversibles en tu cuenta
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 border border-red-200 rounded-lg bg-red-50">
                  <div className="flex items-center gap-2 text-red-800 mb-2">
                    <AlertCircle className="h-4 w-4" />
                    <span className="font-medium">Eliminar Cuenta</span>
                  </div>
                  <p className="text-sm text-red-700 mb-4">
                    Esta acción eliminará permanentemente tu cuenta y todos los
                    datos asociados. No se puede deshacer.
                  </p>
                  <Button variant="destructive" size="sm">
                    Eliminar Cuenta
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Footer */}
      <footer className="bg-blue-900 text-white py-8 mt-16">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                <span className="text-blue-900 font-bold text-sm">CS</span>
              </div>
              <span className="text-xl font-semibold">Club Salvadoreño</span>
            </div>
            <p className="text-blue-100">
              © 2025 Club Salvadoreño. Todos los derechos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default UserProfile;
