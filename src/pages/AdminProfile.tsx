import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  User,
  Settings,
  Activity,
  Edit3,
  Save,
  X,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Award,
  Shield,
  Clock,
  Eye,
  Edit,
  Key,
  Bell,
  Globe,
  Users,
  Building2,
  MessageSquare,
  BarChart3,
  Camera,
  Upload,
  Trash2,
} from "lucide-react";
import { getCurrentUser, isSuperAdmin } from "@/lib/auth-service";
import { getRolePermissions } from "@/lib/user-database";
import AdminLayout from "@/components/AdminLayout";
import { toast } from "@/hooks/use-toast";

const AdminProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");
  const [profileImage, setProfileImage] = useState<string>("");
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    smsNotifications: false,
    reservationAlerts: true,
    userRegistrations: true,
    systemUpdates: false,
  });

  const currentUser = getCurrentUser();
  const userPermissions = currentUser
    ? getRolePermissions(currentUser.role)
    : null;

  if (!currentUser) {
    return null;
  }

  const [profileData, setProfileData] = useState({
    firstName: currentUser.firstName,
    lastName: currentUser.lastName,
    email: currentUser.email,
    phone: currentUser.phone,
    timezone: "America/El_Salvador",
    language: "es",
  });

  const handleSave = () => {
    setIsEditing(false);
    toast({
      title: "Perfil actualizado",
      description: "Los cambios han sido guardados exitosamente.",
    });
  };

  const handleCancel = () => {
    setIsEditing(false);
    setProfileData({
      firstName: currentUser.firstName,
      lastName: currentUser.lastName,
      email: currentUser.email,
      phone: currentUser.phone,
      timezone: "America/El_Salvador",
      language: "es",
    });
  };

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validar tipo de archivo
    if (!file.type.startsWith("image/")) {
      toast({
        title: "Error",
        description: "Por favor selecciona solo archivos de imagen.",
        variant: "destructive",
      });
      return;
    }

    // Validar tamaño (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "Error",
        description: "La imagen debe ser menor a 5MB.",
        variant: "destructive",
      });
      return;
    }

    setIsUploadingImage(true);

    try {
      // Simular subida de imagen
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setProfileImage(result);

        toast({
          title: "Imagen actualizada",
          description: "Tu foto de perfil ha sido actualizada exitosamente.",
        });

        setIsUploadingImage(false);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo subir la imagen. Intenta nuevamente.",
        variant: "destructive",
      });
      setIsUploadingImage(false);
    }
  };

  const removeProfileImage = () => {
    setProfileImage("");
    toast({
      title: "Imagen eliminada",
      description: "Tu foto de perfil ha sido eliminada.",
    });
  };

  const handlePasswordChange = () => {
    // Validaciones
    if (
      !passwordForm.currentPassword ||
      !passwordForm.newPassword ||
      !passwordForm.confirmPassword
    ) {
      toast({
        title: "Error",
        description: "Todos los campos son obligatorios.",
        variant: "destructive",
      });
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast({
        title: "Error",
        description: "Las contraseñas nuevas no coinciden.",
        variant: "destructive",
      });
      return;
    }

    if (passwordForm.newPassword.length < 8) {
      toast({
        title: "Error",
        description: "La nueva contraseña debe tener al menos 8 caracteres.",
        variant: "destructive",
      });
      return;
    }

    // Simular cambio de contraseña (aquí iría la llamada a la API)
    toast({
      title: "Contraseña actualizada",
      description: "Tu contraseña ha sido cambiada exitosamente.",
    });

    // Limpiar formulario y cerrar modal
    setPasswordForm({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
    setIsPasswordDialogOpen(false);
  };

  const handlePasswordCancel = () => {
    setPasswordForm({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
    setIsPasswordDialogOpen(false);
  };

  const getCurrentProfileImage = () => {
    if (profileImage) return profileImage;
    if (currentUser.profileImage) return currentUser.profileImage;
    return `https://api.dicebear.com/7.x/avataaars/svg?seed=${currentUser.email}`;
  };

  const getRoleName = (role: string) => {
    switch (role) {
      case "super_admin":
        return "Super Administrador";
      case "atencion_miembro":
        return "Atención al Miembro";
      case "anfitrion":
        return "Anfitrión";
      case "monitor":
        return "Monitor";
      case "mercadeo":
        return "Mercadeo";
      default:
        return "Usuario";
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "super_admin":
        return "bg-blue-600 hover:bg-blue-700";
      case "atencion_miembro":
        return "bg-green-600 hover:bg-green-700";
      case "anfitrion":
        return "bg-purple-600 hover:bg-purple-700";
      case "monitor":
        return "bg-orange-600 hover:bg-orange-700";
      case "mercadeo":
        return "bg-pink-600 hover:bg-pink-700";
      default:
        return "bg-gray-600 hover:bg-gray-700";
    }
  };

  const getPermissionsList = () => {
    if (!userPermissions) return [];

    const permissions = [];
    if (userPermissions.canManageUsers) permissions.push("Gestión de Usuarios");
    if (userPermissions.canManageAccommodations)
      permissions.push("Gestión de Alojamientos");
    if (userPermissions.canManageReservations)
      permissions.push("Gestión de Reservas");
    if (userPermissions.canManageCalendar)
      permissions.push("Gestión de Calendario");
    if (userPermissions.canManagePricing)
      permissions.push("Gestión de Precios");
    if (userPermissions.canManageMessages)
      permissions.push("Gestión de Mensajes");
    if (userPermissions.canManageSettings)
      permissions.push("Configuración del Sistema");
    if (userPermissions.canEditSiteContent)
      permissions.push("Edición de Contenido Web");
    if (userPermissions.canManageImages)
      permissions.push("Gestión de Imágenes");
    if (userPermissions.canCreateUsers)
      permissions.push("Creación de Usuarios");
    if (userPermissions.canAccessAllLocations)
      permissions.push("Acceso a Todas las Ubicaciones");

    return permissions;
  };

  const recentActivities = [
    {
      action: "Actualización de alojamiento",
      details: "Suite 3 - Modificó descripción y precios",
      timestamp: "Hace 2 horas",
      type: "accommodation",
    },
    {
      action: "Nueva reserva procesada",
      details: "Reserva #1234 - Apartamento 2A",
      timestamp: "Hace 4 horas",
      type: "reservation",
    },
    {
      action: "Usuario aprobado",
      details: "Carlos Rivera - Registro aprobado",
      timestamp: "Hace 1 día",
      type: "user",
    },
    {
      action: "Configuración actualizada",
      details: "Precios de temporada alta modificados",
      timestamp: "Hace 2 días",
      type: "setting",
    },
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "accommodation":
        return Building2;
      case "reservation":
        return Calendar;
      case "user":
        return Users;
      case "setting":
        return Settings;
      default:
        return Activity;
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Mi Perfil Administrativo</h1>
            <p className="text-gray-600">
              Gestiona tu información personal y configuraciones del sistema
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Badge className={`${getRoleColor(currentUser.role)} text-white`}>
              <Shield className="w-3 h-3 mr-1" />
              {getRoleName(currentUser.role)}
            </Badge>
          </div>
        </div>

        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="profile">Perfil</TabsTrigger>
            <TabsTrigger value="security">Seguridad</TabsTrigger>
            <TabsTrigger value="permissions">Permisos</TabsTrigger>
            <TabsTrigger value="activity">Actividad</TabsTrigger>
            <TabsTrigger value="settings">Configuración</TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Profile Info Card */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Información Personal</CardTitle>
                      <CardDescription>
                        Actualiza tu información de perfil administrativo
                      </CardDescription>
                    </div>
                    {!isEditing && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setIsEditing(true)}
                      >
                        <Edit3 className="w-4 h-4 mr-2" />
                        Editar
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <Avatar className="w-20 h-20">
                        <AvatarImage src={getCurrentProfileImage()} />
                        <AvatarFallback className="text-xl">
                          {currentUser.firstName[0]}
                          {currentUser.lastName[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div className="absolute -bottom-2 -right-2 flex space-x-1">
                        <div className="relative">
                          <input
                            type="file"
                            id="profile-image"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="hidden"
                          />
                          <Button
                            size="sm"
                            variant="outline"
                            className="w-8 h-8 rounded-full p-0 bg-white shadow-md"
                            onClick={() =>
                              document.getElementById("profile-image")?.click()
                            }
                            disabled={isUploadingImage}
                          >
                            {isUploadingImage ? (
                              <div className="w-3 h-3 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                            ) : (
                              <Camera className="w-3 h-3" />
                            )}
                          </Button>
                        </div>
                        {(profileImage || currentUser.profileImage) && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="w-8 h-8 rounded-full p-0 bg-white shadow-md text-red-600 hover:text-red-700"
                            onClick={removeProfileImage}
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        )}
                      </div>
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-lg font-semibold">
                        {currentUser.firstName} {currentUser.lastName}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {currentUser.email}
                      </p>
                      <Badge variant="outline">
                        {getRoleName(currentUser.role)}
                      </Badge>
                      <p className="text-xs text-gray-500">
                        Haz clic en <Camera className="w-3 h-3 inline mx-1" />{" "}
                        para cambiar tu foto
                      </p>
                    </div>
                  </div>

                  <Separator />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  </div>

                  {isEditing && (
                    <div className="flex space-x-2 pt-4">
                      <Button onClick={handleSave}>
                        <Save className="w-4 h-4 mr-2" />
                        Guardar Cambios
                      </Button>
                      <Button variant="outline" onClick={handleCancel}>
                        <X className="w-4 h-4 mr-2" />
                        Cancelar
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Admin Stats Card */}
              <Card>
                <CardHeader>
                  <CardTitle>Estadísticas del Admin</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4 text-gray-500" />
                      <span className="text-sm">Último acceso</span>
                    </div>
                    <span className="text-sm font-medium">Hace 5 min</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      <span className="text-sm">Cuenta creada</span>
                    </div>
                    <span className="text-sm font-medium">
                      {new Date(currentUser.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Activity className="w-4 h-4 text-gray-500" />
                      <span className="text-sm">Sesiones hoy</span>
                    </div>
                    <span className="text-sm font-medium">3</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Award className="w-4 h-4 text-gray-500" />
                      <span className="text-sm">Nivel de acceso</span>
                    </div>
                    <Badge variant="secondary">
                      {isSuperAdmin() ? "Completo" : "Limitado"}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Configuración de Seguridad</CardTitle>
                <CardDescription>
                  Gestiona la seguridad de tu cuenta administrativa
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Key className="w-5 h-5 text-gray-500" />
                      <div>
                        <h4 className="font-medium">Cambiar Contraseña</h4>
                        <p className="text-sm text-gray-600">
                          Actualiza tu contraseña de acceso al sistema
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      onClick={() => setIsPasswordDialogOpen(true)}
                    >
                      Cambiar
                    </Button>
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Shield className="w-5 h-5 text-gray-500" />
                      <div>
                        <h4 className="font-medium">
                          Autenticación de Dos Factores
                        </h4>
                        <p className="text-sm text-gray-600">
                          Agrega una capa extra de seguridad a tu cuenta
                        </p>
                      </div>
                    </div>
                    <Switch />
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Eye className="w-5 h-5 text-gray-500" />
                      <div>
                        <h4 className="font-medium">Auditoría de Acceso</h4>
                        <p className="text-sm text-gray-600">
                          Ver historial de accesos a tu cuenta
                        </p>
                      </div>
                    </div>
                    <Button variant="outline">Ver Historial</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Permissions Tab */}
          <TabsContent value="permissions" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Permisos y Accesos</CardTitle>
                <CardDescription>
                  Revisa los permisos asignados a tu rol administrativo
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {getPermissionsList().map((permission, index) => (
                    <div
                      key={index}
                      className="flex items-center space-x-3 p-3 bg-green-50 border border-green-200 rounded-lg"
                    >
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm font-medium text-green-800">
                        {permission}
                      </span>
                    </div>
                  ))}
                </div>

                {isSuperAdmin() && (
                  <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <Shield className="w-5 h-5 text-blue-600" />
                      <h4 className="font-medium text-blue-800">
                        Super Administrador
                      </h4>
                    </div>
                    <p className="text-sm text-blue-700">
                      Tienes acceso completo a todas las funciones del sistema,
                      incluyendo la gestión de usuarios, roles y configuraciones
                      críticas.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Activity Tab */}
          <TabsContent value="activity" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Actividad Reciente</CardTitle>
                <CardDescription>
                  Historial de acciones realizadas en el sistema
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivities.map((activity, index) => {
                    const Icon = getActivityIcon(activity.type);
                    return (
                      <div
                        key={index}
                        className="flex items-start space-x-4 p-4 border rounded-lg hover:bg-gray-50"
                      >
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <Icon className="w-4 h-4 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium">{activity.action}</h4>
                          <p className="text-sm text-gray-600">
                            {activity.details}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {activity.timestamp}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Configuración Personal</CardTitle>
                <CardDescription>
                  Personaliza tu experiencia en el sistema administrativo
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h4 className="font-medium">Notificaciones</h4>
                  {Object.entries(notificationSettings).map(([key, value]) => (
                    <div
                      key={key}
                      className="flex items-center justify-between"
                    >
                      <div>
                        <Label htmlFor={key} className="font-normal">
                          {key === "emailNotifications" &&
                            "Notificaciones por Email"}
                          {key === "smsNotifications" &&
                            "Notificaciones por SMS"}
                          {key === "reservationAlerts" && "Alertas de Reservas"}
                          {key === "userRegistrations" &&
                            "Registros de Usuarios"}
                          {key === "systemUpdates" &&
                            "Actualizaciones del Sistema"}
                        </Label>
                      </div>
                      <Switch
                        id={key}
                        checked={value}
                        onCheckedChange={(checked) =>
                          setNotificationSettings({
                            ...notificationSettings,
                            [key]: checked,
                          })
                        }
                      />
                    </div>
                  ))}
                </div>

                <Separator />

                <div className="space-y-4">
                  <h4 className="font-medium">Preferencias</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="timezone">Zona Horaria</Label>
                      <select
                        id="timezone"
                        className="w-full p-2 border rounded-md"
                        value={profileData.timezone}
                        onChange={(e) =>
                          setProfileData({
                            ...profileData,
                            timezone: e.target.value,
                          })
                        }
                      >
                        <option value="America/El_Salvador">
                          América/El Salvador
                        </option>
                        <option value="America/Guatemala">
                          América/Guatemala
                        </option>
                        <option value="America/Honduras">
                          América/Honduras
                        </option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="language">Idioma</Label>
                      <select
                        id="language"
                        className="w-full p-2 border rounded-md"
                        value={profileData.language}
                        onChange={(e) =>
                          setProfileData({
                            ...profileData,
                            language: e.target.value,
                          })
                        }
                      >
                        <option value="es">Español</option>
                        <option value="en">English</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="pt-4">
                  <Button onClick={handleSave}>
                    <Save className="w-4 h-4 mr-2" />
                    Guardar Configuración
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Password Change Dialog */}
      <Dialog
        open={isPasswordDialogOpen}
        onOpenChange={setIsPasswordDialogOpen}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Cambiar Contraseña</DialogTitle>
            <DialogDescription>
              Ingresa tu contraseña actual y la nueva contraseña para actualizar
              tu acceso.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="currentPassword">Contraseña Actual</Label>
              <Input
                id="currentPassword"
                type="password"
                value={passwordForm.currentPassword}
                onChange={(e) =>
                  setPasswordForm({
                    ...passwordForm,
                    currentPassword: e.target.value,
                  })
                }
                placeholder="Ingresa tu contraseña actual"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="newPassword">Nueva Contraseña</Label>
              <Input
                id="newPassword"
                type="password"
                value={passwordForm.newPassword}
                onChange={(e) =>
                  setPasswordForm({
                    ...passwordForm,
                    newPassword: e.target.value,
                  })
                }
                placeholder="Mínimo 8 caracteres"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">
                Confirmar Nueva Contraseña
              </Label>
              <Input
                id="confirmPassword"
                type="password"
                value={passwordForm.confirmPassword}
                onChange={(e) =>
                  setPasswordForm({
                    ...passwordForm,
                    confirmPassword: e.target.value,
                  })
                }
                placeholder="Repite la nueva contraseña"
              />
            </div>
          </div>
          <DialogFooter className="flex space-x-2">
            <Button variant="outline" onClick={handlePasswordCancel}>
              Cancelar
            </Button>
            <Button onClick={handlePasswordChange}>Cambiar Contraseña</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default AdminProfile;
