// Página de prueba para verificar todas las traducciones del dashboard

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Globe, Check, AlertCircle } from "lucide-react";
import { useLanguage, useTranslations } from "@/contexts/LanguageContext";
import { availableLanguages } from "@/lib/i18n";
import Navbar from "@/components/Navbar";

const TranslationTest = () => {
  const { language, setLanguage } = useLanguage();
  const t = useTranslations();

  const testSections = [
    {
      title: "Hero Carousel",
      items: [
        { key: "Corinto Hero", value: t.dashboard.corintoHeroDescription },
        { key: "El Sunzal Hero", value: t.dashboard.elSunzalHeroDescription },
        {
          key: "Country Club Hero",
          value: t.dashboard.countryClubHeroDescription,
        },
        { key: "Learn More Button", value: t.dashboard.learnMore },
      ],
    },
    {
      title: "Welcome Section",
      items: [
        { key: "Welcome Title", value: t.dashboard.welcome },
        { key: "Welcome Description", value: t.dashboard.welcomeDescription },
        { key: "Welcome Subtitle", value: t.dashboard.welcomeSubtitle },
      ],
    },
    {
      title: "Activities Section",
      items: [
        { key: "Surf", value: t.dashboard.surf },
        { key: "Surf Description", value: t.dashboard.surfDescription },
        { key: "Golf", value: t.dashboard.golf },
        { key: "Golf Description", value: t.dashboard.golfDescription },
        { key: "Tennis", value: t.dashboard.tennis },
        { key: "Tennis Description", value: t.dashboard.tennisDescription },
        { key: "Sailing", value: t.dashboard.sailing },
        { key: "Sailing Description", value: t.dashboard.sailingDescription },
      ],
    },
    {
      title: "Dependencies Section",
      items: [
        { key: "Dependencies Title", value: t.dashboard.dependenciesTitle },
        { key: "See Details Button", value: t.dashboard.seeDetails },
        { key: "Corinto Subtitle", value: t.dashboard.corintoSubtitle },
        { key: "Corinto Description", value: t.dashboard.corintoDescription },
        { key: "El Sunzal Subtitle", value: t.dashboard.elSunzalSubtitle },
        {
          key: "El Sunzal Description",
          value: t.dashboard.elSunzalDescription,
        },
        {
          key: "Country Club Subtitle",
          value: t.dashboard.countryClubSubtitle,
        },
        {
          key: "Country Club Description",
          value: t.dashboard.countryClubDescription,
        },
      ],
    },
    {
      title: "Locations",
      items: [
        { key: "Corinto", value: t.locations.corinto },
        { key: "El Sunzal", value: t.locations.elSunzal },
        { key: "Country Club", value: t.locations.countryClub },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">
            Verificación de Traducciones del Dashboard
          </h1>
          <p className="text-xl text-slate-600 mb-6">
            Verifica que todas las secciones del dashboard estén traducidas
            correctamente
          </p>

          {/* Current Language */}
          <div className="inline-flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-lg">
            <Globe className="h-4 w-4 text-blue-600" />
            <span className="text-blue-800 font-medium">
              Idioma actual:{" "}
              {availableLanguages.find((lang) => lang.code === language)?.name}
            </span>
          </div>
        </div>

        {/* Language Switcher */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Cambiar Idioma</CardTitle>
            <CardDescription>
              Selecciona un idioma para verificar las traducciones
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {availableLanguages.map((lang) => (
                <Button
                  key={lang.code}
                  variant={language === lang.code ? "default" : "outline"}
                  onClick={() => setLanguage(lang.code)}
                  className="h-16 flex flex-col gap-1"
                >
                  <span className="text-2xl">{lang.flag}</span>
                  <span className="text-sm">{lang.name}</span>
                  {language === lang.code && <Check className="h-3 w-3 mt-1" />}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Translation Sections */}
        <div className="grid gap-6">
          {testSections.map((section, sectionIndex) => (
            <Card key={sectionIndex}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-green-600" />
                  {section.title}
                </CardTitle>
                <CardDescription>
                  {section.items.length} elementos traducidos
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3">
                  {section.items.map((item, itemIndex) => (
                    <div
                      key={itemIndex}
                      className="flex flex-col sm:flex-row sm:items-center gap-2 p-3 bg-slate-50 rounded-lg"
                    >
                      <div className="flex items-center gap-2 min-w-0 sm:w-48">
                        <Badge
                          variant="outline"
                          className="text-xs flex-shrink-0"
                        >
                          {item.key}
                        </Badge>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-slate-700 break-words">
                          {item.value}
                        </p>
                      </div>
                      <div className="flex-shrink-0">
                        {item.value && item.value.trim() !== "" ? (
                          <Check className="h-4 w-4 text-green-500" />
                        ) : (
                          <AlertCircle className="h-4 w-4 text-red-500" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Instructions */}
        <Card className="mt-8 border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="text-blue-800">
              Instrucciones de Prueba
            </CardTitle>
          </CardHeader>
          <CardContent className="text-blue-700">
            <ol className="list-decimal list-inside space-y-2 text-sm">
              <li>
                Cambia entre los diferentes idiomas usando los botones de arriba
              </li>
              <li>Verifica que cada texto cambie correctamente</li>
              <li>
                Ve al{" "}
                <a href="/dashboard" className="underline font-medium">
                  Dashboard principal
                </a>{" "}
                para ver las traducciones en contexto
              </li>
              <li>Revisa que todos los elementos tengan el icono verde ✓</li>
              <li>
                Si hay elementos con ⚠️, significa que falta la traducción
              </li>
            </ol>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TranslationTest;
