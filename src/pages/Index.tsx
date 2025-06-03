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
import { useNavigate } from "react-router-dom";
import {
  User,
  Settings,
  Activity,
  ArrowRight,
  Star,
  Target,
  Award,
  Calendar,
  TrendingUp,
} from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  const stats = [
    {
      label: "Proyectos Activos",
      value: "8",
      icon: Target,
      color: "text-blue-600",
    },
    { label: "Completados", value: "24", icon: Award, color: "text-green-600" },
    {
      label: "En Progreso",
      value: "3",
      icon: Activity,
      color: "text-orange-600",
    },
    {
      label: "Calificación",
      value: "4.9",
      icon: Star,
      color: "text-yellow-600",
    },
  ];

  const recentActivity = [
    {
      title: "E-commerce Dashboard",
      status: "Completado",
      date: "Hace 2 días",
      progress: 100,
    },
    {
      title: "Mobile App UI",
      status: "En progreso",
      date: "Actualizado hoy",
      progress: 75,
    },
    {
      title: "Landing Page",
      status: "En progreso",
      date: "Hace 1 día",
      progress: 45,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-sm border-b border-slate-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">P</span>
              </div>
              <span className="text-xl font-semibold text-slate-900">
                ProfileApp
              </span>
            </div>

            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                onClick={() => navigate("/profile")}
                className="gap-2"
              >
                <User className="h-4 w-4" />
                Mi Perfil
              </Button>
              <Avatar
                className="h-8 w-8 cursor-pointer"
                onClick={() => navigate("/profile")}
              >
                <AvatarImage src="/placeholder.svg" alt="Usuario" />
                <AvatarFallback className="bg-slate-200 text-slate-700">
                  MG
                </AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">
            ¡Bienvenida de vuelta, <span className="text-blue-600">María</span>!
          </h1>
          <p className="text-lg text-slate-600 mb-8">
            Gestiona tu perfil, revisa tu progreso y mantente al día con tus
            proyectos
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => navigate("/profile")}
              size="lg"
              className="gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              <User className="h-5 w-5" />
              Ver Mi Perfil
              <ArrowRight className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="lg" className="gap-2">
              <Settings className="h-5 w-5" />
              Configuración
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-full bg-slate-100`}>
                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-slate-900">
                      {stat.value}
                    </p>
                    <p className="text-sm text-slate-600">{stat.label}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Recent Activity */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Actividad Reciente
                </CardTitle>
                <CardDescription>
                  Tus proyectos más recientes y su estado actual
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {recentActivity.map((item, index) => (
                  <div
                    key={index}
                    className="p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-medium text-slate-900">
                        {item.title}
                      </h3>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant={
                            item.status === "Completado"
                              ? "default"
                              : "secondary"
                          }
                          className={
                            item.status === "Completado"
                              ? "bg-green-100 text-green-800"
                              : ""
                          }
                        >
                          {item.status}
                        </Badge>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm text-slate-600">
                        <span>{item.date}</span>
                        <span>{item.progress}%</span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${item.progress}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}

                <div className="pt-4 border-t border-slate-200">
                  <Button variant="ghost" className="w-full gap-2">
                    Ver Todos los Proyectos
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions & Profile Summary */}
          <div className="space-y-6">
            {/* Profile Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Tu Perfil
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src="/placeholder.svg" alt="María González" />
                    <AvatarFallback className="bg-blue-100 text-blue-600 font-semibold">
                      MG
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-medium text-slate-900">
                      María González
                    </h3>
                    <p className="text-sm text-slate-600">Frontend Developer</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Perfil completado</span>
                    <span className="font-medium">85%</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full w-[85%]" />
                  </div>
                </div>

                <Button
                  onClick={() => navigate("/profile")}
                  className="w-full gap-2"
                  variant="outline"
                >
                  Completar Perfil
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Estadísticas
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600">Este mes</span>
                  <Badge
                    variant="secondary"
                    className="bg-green-100 text-green-800"
                  >
                    +12%
                  </Badge>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-slate-600">
                      Proyectos completados
                    </span>
                    <span className="font-medium">6</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-slate-600">
                      Horas trabajadas
                    </span>
                    <span className="font-medium">142h</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-slate-600">
                      Calificación promedio
                    </span>
                    <span className="font-medium flex items-center gap-1">
                      4.9{" "}
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Acciones Rápidas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  variant="ghost"
                  className="w-full justify-start gap-2"
                  onClick={() => navigate("/profile")}
                >
                  <User className="h-4 w-4" />
                  Editar Perfil
                </Button>
                <Button variant="ghost" className="w-full justify-start gap-2">
                  <Settings className="h-4 w-4" />
                  Configuración
                </Button>
                <Button variant="ghost" className="w-full justify-start gap-2">
                  <Calendar className="h-4 w-4" />
                  Calendario
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
