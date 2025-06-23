// Navbar responsivo con información del usuario, cambio de idioma y menú hamburguesa

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useNavigate } from "react-router-dom";
import {
  Menu,
  X,
  User,
  Settings,
  LogOut,
  Globe,
  ChevronDown,
  Home,
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { availableLanguages, Language } from "@/lib/i18n";
import { getCurrentUser, logout } from "@/lib/auth-service";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface NavbarProps {
  className?: string;
}

const Navbar = ({ className }: NavbarProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { language, setLanguage, t } = useLanguage();
  const [currentUser, setCurrentUser] = useState(getCurrentUser());
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  // Actualizar usuario actual cuando cambie la sesión
  useEffect(() => {
    setCurrentUser(getCurrentUser());
  }, []);

  // Cerrar menú móvil al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target as Node)
      ) {
        setIsMobileMenuOpen(false);
      }
    };

    if (isMobileMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMobileMenuOpen]);

  // Cerrar menú móvil al redimensionar la pantalla
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Manejar cambio de idioma
  const handleLanguageChange = (newLanguage: Language) => {
    setLanguage(newLanguage);
    setIsLanguageDropdownOpen(false);

    const languageName = availableLanguages.find(
      (lang) => lang.code === newLanguage,
    )?.name;

    toast({
      title: t.common.success,
      description: `${t.nav.language} ${languageName}`,
    });
  };

  // Manejar logout
  const handleLogout = () => {
    // Limpiar sesión completamente
    logout();
    setCurrentUser(null);

    // Mostrar notificación
    toast({
      title: t.common.success,
      description: t.nav.logout,
    });

    // Navegar al login y limpiar historial
    navigate("/login", { replace: true });

    // Asegurar que no se pueda navegar hacia atrás
    setTimeout(() => {
      window.history.pushState(null, "", "/login");
      window.history.pushState(null, "", "/login");
    }, 100);
  };

  // Navegar al perfil
  const handleProfileClick = () => {
    navigate("/perfil");
    setIsMobileMenuOpen(false);
  };

  // Navegar al dashboard
  const handleDashboardClick = () => {
    navigate("/dashboard");
    setIsMobileMenuOpen(false);
  };

  // Obtener iniciales del usuario para el avatar
  const getUserInitials = (fullName: string): string => {
    return fullName
      .split(" ")
      .map((name) => name.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  // Obtener idioma actual con metadatos
  const currentLanguage = availableLanguages.find(
    (lang) => lang.code === language,
  );

  if (!currentUser) {
    return null; // No mostrar navbar si no hay usuario logueado
  }

  return (
    <nav
      className={cn(
        "bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm",
        className,
      )}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo y Nombre del Club */}
          <div
            className="flex items-center gap-3 cursor-pointer"
            onClick={handleDashboardClick}
          >
            <div className="w-10 h-10 bg-blue-900 rounded-full flex items-center justify-center">
              <img
                src="/logo_menu.png"
                alt="Logo Club Salvadoreño"
                className="max-w-[35px] mx-auto object-contain"
              />
            </div>
            <span className="text-xl font-semibold text-slate-900 hidden sm:block">
              {t.dashboard.clubName}
            </span>
          </div>

          {/* Menú Desktop */}
          <div className="hidden md:flex items-center gap-4">
            {/* Información del Usuario */}
            <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-slate-50">
              <Avatar className="h-8 w-8">
                <AvatarImage src={`/avatars/${currentUser.username}.jpg`} />
                <AvatarFallback className="text-xs bg-blue-100 text-blue-700">
                  {getUserInitials(currentUser.fullName)}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span className="text-sm font-medium text-slate-900 leading-tight">
                  {currentUser.fullName}
                </span>
                {currentUser.role === "admin" && (
                  <Badge variant="secondary" className="text-xs w-fit">
                    Admin
                  </Badge>
                )}
              </div>
            </div>

            {/* Selector de Idioma */}
            <DropdownMenu
              open={isLanguageDropdownOpen}
              onOpenChange={setIsLanguageDropdownOpen}
            >
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="gap-2 h-9">
                  <Globe className="h-4 w-4" />
                  <span className="hidden lg:inline">
                    {currentLanguage?.flag} {currentLanguage?.name}
                  </span>
                  <span className="lg:hidden">{currentLanguage?.flag}</span>
                  <ChevronDown className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                {availableLanguages.map((lang) => (
                  <DropdownMenuItem
                    key={lang.code}
                    onClick={() => handleLanguageChange(lang.code)}
                    className={cn(
                      "flex items-center gap-3 cursor-pointer",
                      language === lang.code && "bg-blue-50 text-blue-700",
                    )}
                  >
                    <span className="text-lg">{lang.flag}</span>
                    <span>{lang.name}</span>
                    {language === lang.code && (
                      <Badge variant="outline" className="ml-auto text-xs">
                        {t.common.current || "Actual"}
                      </Badge>
                    )}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Mi Perfil */}
            <Button
              variant="ghost"
              onClick={handleProfileClick}
              className="gap-2 h-9"
            >
              <Settings className="h-4 w-4" />
              <span className="hidden lg:inline">{t.nav.myProfile}</span>
            </Button>

            {/* Cerrar Sesión */}
            <Button
              variant="ghost"
              onClick={handleLogout}
              className="gap-2 h-9 text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden lg:inline">{t.nav.logout}</span>
            </Button>
          </div>

          {/* Botón Menú Hamburguesa (Mobile) */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2"
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Menú Mobile */}
        {isMobileMenuOpen && (
          <div
            ref={mobileMenuRef}
            className="md:hidden border-t border-slate-200 bg-white"
          >
            <div className="py-4 space-y-3">
              {/* Información del Usuario */}
              <div className="flex items-center gap-3 px-4 py-3 bg-slate-50 rounded-lg mx-4">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={`/avatars/${currentUser.username}.jpg`} />
                  <AvatarFallback className="bg-blue-100 text-blue-700">
                    {getUserInitials(currentUser.fullName)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="font-medium text-slate-900">
                    {currentUser.fullName}
                  </p>
                  <p className="text-sm text-slate-600">
                    @{currentUser.username}
                  </p>
                  {currentUser.role === "admin" && (
                    <Badge variant="secondary" className="text-xs mt-1">
                      Administrador
                    </Badge>
                  )}
                </div>
              </div>

              {/* Dashboard */}
              <button
                onClick={handleDashboardClick}
                className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-slate-50 transition-colors"
              >
                <Home className="h-5 w-5 text-slate-600" />
                <span className="text-slate-900">{t.dashboard.welcome}</span>
              </button>

              {/* Selector de Idioma */}
              <div className="px-4">
                <p className="text-sm font-medium text-slate-700 mb-2">
                  {t.nav.language}
                </p>
                <div className="space-y-1">
                  {availableLanguages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => handleLanguageChange(lang.code)}
                      className={cn(
                        "w-full flex items-center gap-3 px-3 py-2 rounded-md text-left transition-colors",
                        language === lang.code
                          ? "bg-blue-50 text-blue-700"
                          : "hover:bg-slate-50",
                      )}
                    >
                      <span className="text-lg">{lang.flag}</span>
                      <span className="flex-1">{lang.name}</span>
                      {language === lang.code && (
                        <Badge variant="outline" className="text-xs">
                          ✓
                        </Badge>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Mi Perfil */}
              <button
                onClick={handleProfileClick}
                className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-slate-50 transition-colors"
              >
                <User className="h-5 w-5 text-slate-600" />
                <span className="text-slate-900">{t.nav.myProfile}</span>
              </button>

              {/* Cerrar Sesión */}
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-red-50 text-red-600 transition-colors"
              >
                <LogOut className="h-5 w-5" />
                <span>{t.nav.logout}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
