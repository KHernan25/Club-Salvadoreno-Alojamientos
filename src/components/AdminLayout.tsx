import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  Users,
  Building2,
  Calendar,
  DollarSign,
  Settings,
  BarChart3,
  MessageSquare,
  LogOut,
  Menu,
  User,
  Shield,
  Home,
  UserPlus,
  MapPin,
  Globe,
  UserCheck,
  FileText,
} from "lucide-react";
import {
  getCurrentUser,
  logout,
  hasPermission,
  isSuperAdmin,
} from "@/lib/auth-service";
import { getRolePermissions } from "@/lib/user-database";
import { NotificationDropdownSafe } from "@/components/NotificationDropdownSafe";

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const currentUser = getCurrentUser();

  const handleLogout = async () => {
    // Navegar inmediatamente al backoffice
    navigate("/backoffice");
    // Limpiar sesión en segundo plano
    await logout();
  };

  const userPermissions = currentUser
    ? getRolePermissions(currentUser.role)
    : null;

  const menuItems = [
    {
      label: "Dashboard",
      href: "/admin/dashboard",
      icon: BarChart3,
      permission: "canViewDashboard",
    },
    {
      label: "Bitácora del Día",
      href: "/admin/activity-log",
      icon: FileText,
      permission: "canViewDashboard", // All roles can access activity log
    },
    {
      label: "Usuarios",
      href: "/admin/users",
      icon: Users,
      permission: "canManageUsers",
    },
    {
      label: "Solicitudes de Registro",
      href: "/admin/registration-requests",
      icon: UserCheck,
      permission: "canManageUsers",
      badge: "4", // Pending registrations
    },
    {
      label: "Alojamientos",
      href: "/admin/accommodations",
      icon: Building2,
      permission: "canManageAccommodations",
    },
    {
      label: "Reservas",
      href: "/admin/reservations",
      icon: Calendar,
      permission: "canManageReservations",
    },
    {
      label: "Calendario",
      href: "/admin/calendar",
      icon: Calendar,
      permission: "canManageCalendar",
    },
    {
      label: "Precios",
      href: "/admin/pricing",
      icon: DollarSign,
      permission: "canManagePricing",
    },
    {
      label: "Mensajes",
      href: "/admin/messages",
      icon: MessageSquare,
      permission: "canManageMessages",
      badge: "2", // Unread messages
    },
    {
      label: "Contenido del Sitio",
      href: "/admin/site-content",
      icon: Globe,
      permission: "canEditSiteContent",
    },
    {
      label: "Configuración",
      href: "/admin/settings",
      icon: Settings,
      permission: "canManageSettings",
    },
    {
      label: "Portería",
      href: "/admin/porteria",
      icon: Shield,
      permission: "canManageAccessControl",
    },
  ];

  const filteredMenuItems = menuItems.filter((item) =>
    userPermissions
      ? userPermissions[item.permission as keyof typeof userPermissions]
      : false,
  );

  const Sidebar = ({ mobile = false }) => (
    <div className={`${mobile ? "p-4" : "p-6"} space-y-6`}>
      {/* Logo */}
      <div className="flex items-center space-x-2">
        <div className="flex items-center gap-3 cursor-pointer">
          <div className="w-10 h-10 bg-blue-900 rounded-full flex items-center justify-center">
            <img
              src="/logo_menu.png"
              alt="Logo Club Salvadoreño"
              className="max-w-[35px] mx-auto object-contain"
            />
          </div>
          <span className="text-xl font-semibold text-slate-900 hidden sm:block">
            Club Salvadoreño
          </span>
        </div>
      </div>

      {/* User Info */}
      <div className="bg-gray-50 rounded-lg p-4">
        <div className="flex items-center space-x-3">
          <Avatar className="h-10 w-10">
            <AvatarImage
              src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${currentUser?.email}`}
            />
            <AvatarFallback>
              {currentUser?.firstName?.[0]}
              {currentUser?.lastName?.[0]}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              {currentUser?.firstName} {currentUser?.lastName}
            </p>
            <div className="flex items-center space-x-2">
              <Badge
                variant={isSuperAdmin() ? "default" : "secondary"}
                className={`text-xs ${isSuperAdmin() ? "bg-blue-600 hover:bg-blue-700" : ""}`}
              >
                {currentUser?.role === "super_admin"
                  ? "Super Admin"
                  : currentUser?.role === "atencion_miembro"
                    ? "Atención"
                    : currentUser?.role === "anfitrion"
                      ? "Anfitrión"
                      : currentUser?.role === "monitor"
                        ? "Monitor"
                        : currentUser?.role === "mercadeo"
                          ? "Mercadeo"
                          : currentUser?.role === "recepcion"
                            ? "Recepción"
                            : "Usuario"}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="space-y-1">
        {filteredMenuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.href;

          return (
            <Link
              key={item.href}
              to={item.href}
              onClick={() => mobile && setIsSidebarOpen(false)}
              className={`
                flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors
                ${
                  isActive
                    ? "bg-blue-600 text-white"
                    : "text-gray-700 hover:bg-blue-50"
                }
              `}
            >
              <div className="flex items-center space-x-3">
                <Icon className="h-5 w-5" />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <Badge variant="destructive" className="text-xs">
                  {item.badge}
                </Badge>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Quick Actions */}
      <div className="border-t pt-4">
        <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
          Acciones Rápidas
        </p>
        <div className="space-y-1">
          {hasPermission("canManageReservations") && (
            <Link
              to="/admin/reservations/new"
              className="flex items-center space-x-3 px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-blue-50"
            >
              <Calendar className="h-4 w-4" />
              <span>Nueva Reserva</span>
            </Link>
          )}
          {isSuperAdmin() && hasPermission("canCreateUsers") && (
            <Link
              to="/admin/users/new"
              className="flex items-center space-x-3 px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-blue-50"
            >
              <UserPlus className="h-4 w-4" />
              <span>Crear Usuario</span>
            </Link>
          )}
          <a
            href="/dashboard"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-3 px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-blue-50"
          >
            <Home className="h-4 w-4" />
            <span>Ver Sitio (Nueva Pestaña)</span>
          </a>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0">
        <div className="flex-1 flex flex-col bg-white border-r border-gray-200">
          <Sidebar />
        </div>
      </div>

      {/* Mobile Sidebar */}
      <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
        <SheetContent side="left" className="w-64 p-0">
          <div className="bg-white h-full">
            <Sidebar mobile />
          </div>
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <div className="lg:pl-64">
        {/* Top Header */}
        <div className="sticky top-0 z-40 bg-white border-b border-gray-200">
          <div className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center space-x-4">
              {/* Mobile Menu Button */}
              <Sheet>
                <SheetTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="lg:hidden"
                    onClick={() => setIsSidebarOpen(true)}
                  >
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
              </Sheet>

              {/* Page Title */}
              <div>
                <h1 className="text-xl font-semibold text-gray-900">
                  {location.pathname === "/admin/dashboard" && "Dashboard"}
                  {location.pathname === "/admin/activity-log" &&
                    "Bitácora del Día"}
                  {location.pathname === "/admin/users" &&
                    "Gestión de Usuarios"}
                  {location.pathname === "/admin/registration-requests" &&
                    "Solicitudes de Registro"}
                  {location.pathname === "/admin/accommodations" &&
                    "Gestión de Alojamientos"}
                  {location.pathname === "/admin/reservations" &&
                    "Gestión de Reservas"}
                  {location.pathname === "/admin/calendar" &&
                    "Calendario y Bloqueos"}
                  {location.pathname === "/admin/pricing" &&
                    "Gestión de Precios"}
                  {location.pathname === "/admin/messages" &&
                    "Mensajes de Contacto"}
                  {location.pathname === "/admin/site-content" &&
                    "Gestión de Contenido"}
                  {location.pathname === "/admin/settings" && "Configuración"}
                </h1>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* Notifications */}
              <NotificationDropdownSafe />

              {/* User Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-8 w-8 rounded-full"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${currentUser?.email}`}
                      />
                      <AvatarFallback>
                        {currentUser?.firstName?.[0]}
                        {currentUser?.lastName?.[0]}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {currentUser?.firstName} {currentUser?.lastName}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {currentUser?.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/admin/profile" className="cursor-pointer">
                      <User className="mr-2 h-4 w-4" />
                      <span>Mi Perfil</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/admin/settings" className="cursor-pointer">
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Configuración</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="cursor-pointer"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Cerrar Sesión</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>

        {/* Page Content */}
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
};

export default AdminLayout;
