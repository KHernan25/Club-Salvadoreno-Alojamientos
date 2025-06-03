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
import { Progress } from "@/components/ui/progress";
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
  Target,
  TrendingUp,
} from "lucide-react";

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: "María González",
    email: "maria.gonzalez@email.com",
    phone: "+34 666 777 888",
    location: "Madrid, España",
    bio: "Desarrolladora Frontend apasionada por crear experiencias de usuario excepcionales. Me encanta trabajar con React y diseño UI/UX.",
    joinDate: "Enero 2023",
    completedProjects: 24,
    skillLevel: 85,
  });

  const handleSave = () => {
    setIsEditing(false);
    // Aquí iría la lógica para guardar los datos
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Aquí iría la lógica para revertir cambios
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold text-slate-900">Mi Perfil</h1>
            <div className="flex gap-2">
              {isEditing ? (
                <>
                  <Button onClick={handleSave} size="sm" className="gap-2">
                    <Save className="h-4 w-4" />
                    Guardar
                  </Button>
                  <Button
                    onClick={handleCancel}
                    variant="outline"
                    size="sm"
                    className="gap-2"
                  >
                    <X className="h-4 w-4" />
                    Cancelar
                  </Button>
                </>
              ) : (
                <Button
                  onClick={() => setIsEditing(true)}
                  variant="outline"
                  size="sm"
                  className="gap-2"
                >
                  <Edit3 className="h-4 w-4" />
                  Editar Perfil
                </Button>
              )}
            </div>
          </div>

          {/* Profile Summary Card */}
          <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-start gap-6">
                <Avatar className="h-24 w-24 border-4 border-white/20">
                  <AvatarImage src="/placeholder.svg" alt={profileData.name} />
                  <AvatarFallback className="text-blue-600 text-xl font-semibold">
                    {profileData.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1">
                  <h2 className="text-2xl font-bold mb-2">
                    {profileData.name}
                  </h2>
                  <p className="text-blue-100 mb-4">{profileData.bio}</p>

                  <div className="flex flex-wrap gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      {profileData.email}
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      {profileData.location}
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      Miembro desde {profileData.joinDate}
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <Badge
                    variant="secondary"
                    className="bg-white/20 text-white border-0 mb-2"
                  >
                    Nivel Avanzado
                  </Badge>
                  <div className="text-sm text-blue-100">
                    {profileData.completedProjects} proyectos completados
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="personal" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="personal" className="gap-2">
              <User className="h-4 w-4" />
              Información Personal
            </TabsTrigger>
            <TabsTrigger value="activity" className="gap-2">
              <Activity className="h-4 w-4" />
              Actividad
            </TabsTrigger>
            <TabsTrigger value="settings" className="gap-2">
              <Settings className="h-4 w-4" />
              Configuración
            </TabsTrigger>
          </TabsList>

          {/* Personal Information Tab */}
          <TabsContent value="personal" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Información de Contacto</CardTitle>
                  <CardDescription>
                    Gestiona tu información personal y de contacto
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nombre completo</Label>
                    <Input
                      id="name"
                      value={profileData.name}
                      onChange={(e) =>
                        setProfileData({ ...profileData, name: e.target.value })
                      }
                      disabled={!isEditing}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Correo electrónico</Label>
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
                    <Label htmlFor="location">Ubicación</Label>
                    <Input
                      id="location"
                      value={profileData.location}
                      onChange={(e) =>
                        setProfileData({
                          ...profileData,
                          location: e.target.value,
                        })
                      }
                      disabled={!isEditing}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Biografía</CardTitle>
                  <CardDescription>Cuéntanos un poco sobre ti</CardDescription>
                </CardHeader>
                <CardContent>
                  <Textarea
                    value={profileData.bio}
                    onChange={(e) =>
                      setProfileData({ ...profileData, bio: e.target.value })
                    }
                    disabled={!isEditing}
                    className="min-h-32"
                    placeholder="Escribe una breve descripción sobre ti..."
                  />
                </CardContent>
              </Card>
            </div>

            {/* Skills and Progress */}
            <Card>
              <CardHeader>
                <CardTitle>Habilidades y Progreso</CardTitle>
                <CardDescription>
                  Tu nivel de experiencia y áreas de especialización
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <Label>Nivel de Habilidad General</Label>
                    <span className="text-sm font-medium">
                      {profileData.skillLevel}%
                    </span>
                  </div>
                  <Progress value={profileData.skillLevel} className="h-2" />
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                  <div className="space-y-2">
                    <Label>React</Label>
                    <Progress value={90} className="h-2" />
                    <span className="text-xs text-slate-600">Avanzado</span>
                  </div>
                  <div className="space-y-2">
                    <Label>TypeScript</Label>
                    <Progress value={75} className="h-2" />
                    <span className="text-xs text-slate-600">Intermedio</span>
                  </div>
                  <div className="space-y-2">
                    <Label>UI/UX Design</Label>
                    <Progress value={80} className="h-2" />
                    <span className="text-xs text-slate-600">
                      Intermedio-Avanzado
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Activity Tab */}
          <TabsContent value="activity" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-3">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-blue-100 rounded-full">
                      <Target className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">
                        {profileData.completedProjects}
                      </p>
                      <p className="text-sm text-slate-600">
                        Proyectos Completados
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-green-100 rounded-full">
                      <Award className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">12</p>
                      <p className="text-sm text-slate-600">Certificaciones</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-purple-100 rounded-full">
                      <TrendingUp className="h-6 w-6 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">8.5</p>
                      <p className="text-sm text-slate-600">Puntuación Media</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Actividad Reciente</CardTitle>
                <CardDescription>Tus últimas acciones y logros</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    {
                      action: "Completó el proyecto 'E-commerce Dashboard'",
                      time: "Hace 2 días",
                      type: "project",
                    },
                    {
                      action: "Obtuvo certificación en React Advanced",
                      time: "Hace 1 semana",
                      type: "achievement",
                    },
                    {
                      action: "Actualizó perfil profesional",
                      time: "Hace 2 semanas",
                      type: "profile",
                    },
                    {
                      action: "Participó en revisión de código",
                      time: "Hace 3 semanas",
                      type: "collaboration",
                    },
                  ].map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-4 p-3 bg-slate-50 rounded-lg"
                    >
                      <div
                        className={`p-2 rounded-full ${
                          item.type === "project"
                            ? "bg-blue-100"
                            : item.type === "achievement"
                              ? "bg-green-100"
                              : item.type === "profile"
                                ? "bg-purple-100"
                                : "bg-orange-100"
                        }`}
                      >
                        <Activity
                          className={`h-4 w-4 ${
                            item.type === "project"
                              ? "text-blue-600"
                              : item.type === "achievement"
                                ? "text-green-600"
                                : item.type === "profile"
                                  ? "text-purple-600"
                                  : "text-orange-600"
                          }`}
                        />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{item.action}</p>
                        <p className="text-sm text-slate-600">{item.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Preferencias de Notificación</CardTitle>
                <CardDescription>
                  Configura cómo y cuándo quieres recibir notificaciones
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Notificaciones por email</Label>
                    <p className="text-sm text-slate-600">
                      Recibe actualizaciones y alertas importantes por correo
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Notificaciones push</Label>
                    <p className="text-sm text-slate-600">
                      Recibe notificaciones instantáneas en tu dispositivo
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Actualizaciones de proyectos</Label>
                    <p className="text-sm text-slate-600">
                      Notificaciones sobre el progreso de tus proyectos
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Privacidad y Seguridad</CardTitle>
                <CardDescription>
                  Gestiona la visibilidad de tu perfil y configuración de
                  seguridad
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Perfil público</Label>
                    <p className="text-sm text-slate-600">
                      Permite que otros usuarios vean tu perfil
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Mostrar estadísticas</Label>
                    <p className="text-sm text-slate-600">
                      Comparte tus logros y estadísticas públicamente
                    </p>
                  </div>
                  <Switch />
                </div>

                <Separator />

                <div className="space-y-4">
                  <Label>Acciones de Cuenta</Label>
                  <div className="flex gap-2">
                    <Button variant="outline">Cambiar Contraseña</Button>
                    <Button variant="outline">Descargar Datos</Button>
                    <Button variant="destructive">Eliminar Cuenta</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Profile;
