// Página de demostración para mostrar las funcionalidades del navbar responsivo e i18n

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Smartphone, 
  Monitor, 
  Tablet, 
  Globe, 
  User, 
  Menu,
  Check,
  Star,
  Target,
  Zap
} from "lucide-react";
import { useLanguage, useTranslations } from "@/contexts/LanguageContext";
import { availableLanguages } from "@/lib/i18n";
import { getCurrentUser } from "@/lib/auth-service";
import Navbar from "@/components/Navbar";

const NavigationDemo = () => {
  const { language, setLanguage } = useLanguage();
  const t = useTranslations();
  const currentUser = getCurrentUser();
  const [selectedDevice, setSelectedDevice] = useState<"mobile" | "tablet" | "desktop">("desktop");

  const features = [
    {
      icon: Globe,
      title: "Internacionalización",
      description: "Sistema completo de idiomas con persistencia",
      items: [
        "Cambio en tiempo real",
        "3 idiomas disponibles",
        "Persistencia en localStorage",
        "Context API para gestión global"
      ]
    },
    {
      icon: Smartphone,
      title: "Diseño Responsivo",
      description: "Navbar que se adapta a cualquier dispositivo",
      items: [
        "Menú hamburguesa en móvil",
        "Información compacta en tablet",
        "Vista completa en desktop",
        "Touch-friendly interactions"
      ]
    },
    {
      icon: User,
      title: "Información del Usuario",
      description: "Datos del usuario siempre visibles",
      items: [
        "Avatar con iniciales",
        "Nombre completo",
        "Badge de rol (Admin)",
        "Username en móvil"
      ]
    },
    {
      icon: Menu,
      title: "Navegación Consistente",
      description: "Mismo menú en todas las páginas",
      items: [
        "Mi Perfil",
        "Selector de idioma",
        "Cerrar sesión",
        "Dashboard (logo)"
      ]
    }
  ];

  const deviceSpecs = {
    mobile: {
      icon: Smartphone,
      name: "Móvil",
      width: "375px",
      features: ["Menú hamburguesa", "Panel lateral", "Touch-friendly"]
    },
    tablet: {
      icon: Tablet,
      name: "Tablet",
      width: "768px",
      features: ["Navbar compacto", "Iconos prominentes", "Textos reducidos"]
    },
    desktop: {
      icon: Monitor,
      name: "Desktop",
      width: "1024px+",
      features: ["Vista completa", "Todos los elementos", "Hover effects"]
    }
  };

  const handleQuickLanguageChange = (lang: string) => {
    setLanguage(lang as any);
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">
            {t.nav.language} & {t.dashboard.welcome} 
          </h1>
          <p className="text-xl text-slate-600 mb-6">
            Sistema de navegación responsiva con internacionalización completa
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Badge variant="secondary" className="gap-2">
              <Globe className="h-3 w-3" />
              {availableLanguages.length} idiomas
            </Badge>
            <Badge variant="secondary" className="gap-2">
              <Smartphone className="h-3 w-3" />
              100% Responsivo
            </Badge>
            <Badge variant="secondary" className="gap-2">
              <Zap className="h-3 w-3" />
              Tiempo real
            </Badge>
          </div>
        </div>

        {/* Current User Info */}
        {currentUser && (
          <Card className="mb-8 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-blue-600" />
                Usuario Actual
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-slate-600">Nombre</p>
                  <p className="font-medium">{currentUser.fullName}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-600">Username</p>
                  <p className="font-medium">@{currentUser.username}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-600">Rol</p>
                  <Badge variant={currentUser.role === 'admin' ? 'default' : 'secondary'}>
                    {currentUser.role}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-slate-600">Email</p>
                  <p className="font-medium">{currentUser.email}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Language Switcher Demo */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-green-600" />
              Demo de Cambio de Idioma
            </CardTitle>
            <CardDescription>
              Prueba cambiar el idioma y observa cómo toda la página se actualiza instantáneamente
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              {availableLanguages.map((lang) => (
                <Button
                  key={lang.code}
                  variant={language === lang.code ? "default" : "outline"}
                  onClick={() => handleQuickLanguageChange(lang.code)}
                  className="h-16 flex flex-col gap-1"
                >
                  <span className="text-2xl">{lang.flag}</span>
                  <span className="text-sm">{lang.name}</span>
                  {language === lang.code && (
                    <Check className="h-3 w-3 mt-1" />
                  )}
                </Button>
              ))}
            </div>
            
            <div className="bg-slate-50 rounded-lg p-4">
              <h4 className="font-medium mb-2">Textos de ejemplo:</h4>
              <div className="grid md:grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-slate-600">{t.nav.myProfile}:</span>
                  <span className="ml-2 font-medium">{t.nav.myProfile}</span>
                </div>
                <div>
                  <span className="text-slate-600">{t.nav.logout}:</span>
                  <span className="ml-2 font-medium">{t.nav.logout}</span>
                </div>
                <div>
                  <span className="text-slate-600">{t.dashboard.accommodations}:</span>
                  <span className="ml-2 font-medium">{t.dashboard.accommodations}</span>
                </div>
                <div>
                  <span className="text-slate-600">{t.common.save}:</span>
                  <span className="ml-2 font-medium">{t.common.save}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Features Grid */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          {features.map((feature, index) => (
            <Card key={index} className="h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <feature.icon className="h-5 w-5 text-blue-600" />
                  </div>
                  {feature.title}
                </CardTitle>
                <CardDescription>{feature.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {feature.items.map((item, itemIndex) => (
                    <li key={itemIndex} className="flex items-center gap-2 text-sm">
                      <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Responsive Design Demo */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Monitor className="h-5 w-5 text-purple-600" />
              Demostración Responsiva
            </CardTitle>
            <CardDescription>
              Observa cómo el navbar se adapta a diferentes dispositivos
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Device Selector */}
            <div className="flex flex-wrap gap-3 mb-6">
              {Object.entries(deviceSpecs).map(([key, spec]) => (
                <Button
                  key={key}
                  variant={selectedDevice === key ? "default" : "outline"}
                  onClick={() => setSelectedDevice(key as any)}
                  className="gap-2"
                >
                  <spec.icon className="h-4 w-4" />
                  {spec.name}
                </Button>
              ))}
            </div>

            {/* Device Info */}
            <div className="bg-slate-50 rounded-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <deviceSpecs[selectedDevice].icon className="h-6 w-6 text-slate-600" />
                <div>
                  <h4 className="font-medium">{deviceSpecs[selectedDevice].name}</h4>
                  <p className="text-sm text-slate-600">{deviceSpecs[selectedDevice].width}</p>
                </div>
              </div>
              
              <h5 className="font-medium mb-2">Características:</h5>
              <ul className="space-y-1">
                {deviceSpecs[selectedDevice].features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-2 text-sm text-slate-700">
                    <Star className="h-3 w-3 text-yellow-500" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Instructions */}
        <Card className="mt-8 border-green-200 bg-green-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-800">
              <Target className="h-5 w-5" />
              Cómo Probar
            </CardTitle>
          </CardHeader>
          <CardContent className="text-green-700">
            <ol className="list-decimal list-inside space-y-2 text-sm">
              <li>Cambia el idioma usando los botones de arriba o el selector del navbar</li>
              <li>Observa cómo todos los textos se actualizan instantáneamente</li>
              <li>Redimensiona la ventana para ver el comportamiento responsivo</li>
              <li>En móvil, prueba el menú hamburguesa</li>
              <li>Recarga la página para verificar que el idioma se mantiene</li>
              <li>Navega a otras páginas para ver la consistencia</li>
            </ol>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default NavigationDemo;