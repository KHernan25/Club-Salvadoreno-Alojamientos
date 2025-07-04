import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import {
  User,
  UserPlus,
  Shield,
  Key,
  ArrowRight,
  Home,
  Clock,
} from "lucide-react";
import {
  getRecentlyRegisteredUsers,
  getAvailableCredentials,
} from "@/lib/user-database";

const AuthDemo = () => {
  const navigate = useNavigate();

  const authPages = [
    {
      title: "Registro",
      description: "Crear una nueva cuenta en el Club Salvadoreño",
      path: "/register",
      icon: UserPlus,
      color: "bg-blue-500",
    },
    {
      title: "Validar Identidad",
      description: "Verificación de identidad después del registro",
      path: "/validar-identidad",
      icon: Shield,
      color: "bg-green-500",
    },
    {
      title: "Iniciar Sesión",
      description: "Acceder a tu cuenta existente",
      path: "/login",
      icon: User,
      color: "bg-purple-500",
    },
    {
      title: "Olvidé mi Contraseña",
      description: "Recuperar acceso a tu cuenta",
      path: "/forgot-password",
      icon: Key,
      color: "bg-orange-500",
    },
  ];

  const mainPages = [
    {
      title: "Dashboard",
      description: "Página principal del Club Salvadoreño",
      path: "/dashboard",
      icon: Home,
      color: "bg-slate-600",
    },
    {
      title: "Alojamientos",
      description: "Ver casas, apartamentos y suites disponibles",
      path: "/alojamientos",
      icon: Home,
      color: "bg-teal-500",
    },
    {
      title: "Mis Reservas",
      description: "Gestionar todas tus reservas",
      path: "/mis-reservas",
      icon: User,
      color: "bg-indigo-500",
    },
    {
      title: "Mi Perfil",
      description: "Configuración de perfil de usuario",
      path: "/perfil",
      icon: User,
      color: "bg-pink-500",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            Demo de Páginas - Club Salvadoreño
          </h1>
          <p className="text-lg text-slate-600">
            Navega por todas las páginas de la aplicación
          </p>
        </div>

        <div className="space-y-8">
          {/* Authentication Pages */}
          <div>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">
              Páginas de Autenticación
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {authPages.map((page, index) => (
                <Card
                  key={index}
                  className="hover:shadow-lg transition-shadow cursor-pointer group"
                >
                  <CardContent
                    className="p-6"
                    onClick={() => navigate(page.path)}
                  >
                    <div
                      className={`w-12 h-12 ${page.color} rounded-lg flex items-center justify-center mb-4`}
                    >
                      <page.icon className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="font-bold text-slate-900 mb-2">
                      {page.title}
                    </h3>
                    <p className="text-sm text-slate-600 mb-4">
                      {page.description}
                    </p>
                    <div className="flex items-center text-blue-600 group-hover:text-blue-700">
                      <span className="text-sm font-medium">Ver página</span>
                      <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Main Application Pages */}
          <div>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">
              Páginas Principales
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {mainPages.map((page, index) => (
                <Card
                  key={index}
                  className="hover:shadow-lg transition-shadow cursor-pointer group"
                >
                  <CardContent
                    className="p-6"
                    onClick={() => navigate(page.path)}
                  >
                    <div
                      className={`w-12 h-12 ${page.color} rounded-lg flex items-center justify-center mb-4`}
                    >
                      <page.icon className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="font-bold text-slate-900 mb-2">
                      {page.title}
                    </h3>
                    <p className="text-sm text-slate-600 mb-4">
                      {page.description}
                    </p>
                    <div className="flex items-center text-blue-600 group-hover:text-blue-700">
                      <span className="text-sm font-medium">Ver página</span>
                      <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Quick Navigation */}
          <Card>
            <CardHeader>
              <CardTitle>Navegación Rápida</CardTitle>
              <CardDescription>
                URLs directas para acceder a cada página
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div>
                  <h4 className="font-medium mb-2">Autenticación:</h4>
                  <ul className="space-y-1 text-slate-600">
                    <li>
                      • <code>/register</code> - Registro
                    </li>
                    <li>
                      • <code>/validar-identidad</code> - Validar Identidad
                    </li>
                    <li>
                      • <code>/login</code> - Iniciar Sesión
                    </li>
                    <li>
                      • <code>/forgot-password</code> - Recuperar Contraseña
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Aplicación:</h4>
                  <ul className="space-y-1 text-slate-600">
                    <li>
                      • <code>/</code> - Login (Página de Inicio)
                    </li>
                    <li>
                      • <code>/dashboard</code> - Dashboard Principal
                    </li>
                    <li>
                      • <code>/alojamientos</code> - Alojamientos
                    </li>
                    <li>
                      • <code>/apartamento/1A</code> - Detalle Apartamento
                    </li>
                    <li>
                      • <code>/reservas</code> - Hacer Reserva
                    </li>
                    <li>
                      • <code>/confirmacion/8STM347L8</code> - Confirmación
                    </li>
                    <li>
                      • <code>/mis-reservas</code> - Mis Reservas
                    </li>
                    <li>
                      • <code>/perfil</code> - Mi Perfil
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recently Registered Users */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-blue-600" />
                Usuarios Recién Registrados
              </CardTitle>
              <CardDescription>
                Usuarios registrados en la última hora
              </CardDescription>
            </CardHeader>
            <CardContent>
              <RecentUsersDisplay />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

// Componente para mostrar usuarios recientes
const RecentUsersDisplay = () => {
  const recentUsers = getRecentlyRegisteredUsers();
  const allCredentials = getAvailableCredentials();

  if (recentUsers.length === 0) {
    return (
      <div className="text-center py-4">
        <p className="text-slate-500">
          No hay usuarios registrados recientemente
        </p>
        <p className="text-sm text-slate-400 mt-2">
          Registra un nuevo usuario para verlo aparecer aquí
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-3">
        {recentUsers.map((user) => (
          <div
            key={user.id}
            className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg"
          >
            <div>
              <p className="font-medium text-green-800">{user.fullName}</p>
              <p className="text-sm text-green-600">
                Usuario:{" "}
                <code className="bg-green-100 px-1 rounded">
                  {user.username}
                </code>
              </p>
              <p className="text-sm text-green-600">Email: {user.email}</p>
            </div>
            <div className="text-right">
              <Badge variant="secondary" className="mb-1">
                {user.role}
              </Badge>
              <p className="text-xs text-green-600">
                {user.createdAt?.toLocaleTimeString()}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-slate-50 rounded-lg">
        <h4 className="font-medium text-slate-700 mb-3">
          Todos los usuarios disponibles:
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
          {allCredentials.map((cred, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-2 bg-white rounded border"
            >
              <div>
                <span className="font-medium">{cred.fullName}</span>
                <div className="text-slate-600">
                  <code className="bg-slate-100 px-1 rounded text-xs">
                    {cred.username}
                  </code>
                </div>
              </div>
              <Badge
                variant={
                  cred.role === "super_admin"
                    ? "default"
                    : cred.role === "atencion_miembro"
                      ? "secondary"
                      : "outline"
                }
                className="text-xs"
              >
                {cred.role}
              </Badge>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AuthDemo;
