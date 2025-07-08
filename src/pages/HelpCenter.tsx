import { useState } from "react";
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Search,
  HelpCircle,
  BookOpen,
  MessageCircle,
  Phone,
  Mail,
  Clock,
  User,
  CreditCard,
  MapPin,
  Calendar,
  Star,
  Shield,
  ChevronRight,
  Video,
  FileText,
  ExternalLink,
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { cn } from "@/lib/utils";

const HelpCenter = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const { t } = useLanguage();

  // FAQ data
  const faqCategories = [
    { id: "all", label: "Todas", icon: HelpCircle },
    { id: "reservations", label: "Reservas", icon: Calendar },
    { id: "payments", label: "Pagos", icon: CreditCard },
    { id: "locations", label: "Ubicaciones", icon: MapPin },
    { id: "account", label: "Mi Cuenta", icon: User },
    { id: "policies", label: "Políticas", icon: Shield },
  ];

  const faqs = [
    {
      id: "1",
      category: "reservations",
      question: "¿Cómo puedo hacer una reserva?",
      answer:
        "Para hacer una reserva, sigue estos pasos:\n1. Navega a la sección de alojamientos\n2. Selecciona tu ubicación preferida (Corinto o El Sunzal)\n3. Elige las fechas de entrada y salida\n4. Selecciona el tipo de alojamiento\n5. Completa la información de huéspedes\n6. Procede al pago\n\nRecibirás una confirmación por email una vez completada la reserva.",
      tags: ["reserva", "booking", "proceso"],
    },
    {
      id: "2",
      category: "reservations",
      question: "¿Puedo modificar o cancelar mi reserva?",
      answer:
        "Sí, puedes modificar o cancelar tu reserva:\n\n**Modificaciones:**\n- Disponibles hasta 48 horas antes del check-in\n- Sujetas a disponibilidad\n- Pueden aplicar diferencias de precio\n\n**Cancelaciones:**\n- Gratuitas hasta 7 días antes del check-in\n- Entre 7-2 días: cargo del 50%\n- Menos de 48 horas: cargo del 100%\n\nPuedes gestionar tu reserva desde 'Mis Reservas' en tu perfil.",
      tags: ["cancelar", "modificar", "cambios"],
    },
    {
      id: "3",
      category: "payments",
      question: "¿Qué métodos de pago aceptan?",
      answer:
        "Aceptamos los siguientes métodos de pago seguros:\n\n• **Tarjetas de crédito:** Visa, Mastercard, American Express\n• **Tarjetas de débito:** Con logo Visa o Mastercard\n• **Transferencias bancarias:** Para reservas con más de 30 días de anticipación\n• **PayPal:** Disponible para huéspedes internacionales\n\nTodos los pagos son procesados de forma segura con encriptación SSL.",
      tags: ["pago", "tarjeta", "paypal", "transferencia"],
    },
    {
      id: "4",
      category: "payments",
      question: "¿Cuándo se cobra el pago?",
      answer:
        "El proceso de pago es el siguiente:\n\n• **Reserva confirmada:** 30% al momento de la reserva\n• **Pago restante:** 7 días antes del check-in\n• **Depósito de seguridad:** $100 USD (reembolsable)\n\nPara estancias de más de 30 días, ofrecemos planes de pago especiales. El depósito de seguridad se reembolsa 3-5 días después del check-out, descontando cualquier daño o cargo adicional.",
      tags: ["cobro", "depósito", "cuando", "plazos"],
    },
    {
      id: "5",
      category: "locations",
      question: "¿Dónde están ubicadas las propiedades?",
      answer:
        "Tenemos propiedades en dos ubicaciones principales:\n\n**Corinto:**\n• Casas familiares y apartamentos\n• Cerca de la playa y restaurantes\n• Ideal para familias\n• Acceso a actividades acuáticas\n\n**El Sunzal:**\n• Apartamentos, casas y suites\n• Zona surfista reconocida mundialmente\n• Ambiente más juvenil y aventurero\n• Cerca de puntos de surf famosos\n\nAmbas ubicaciones ofrecen fácil acceso a servicios y atracciones locales.",
      tags: ["ubicación", "corinto", "el sunzal", "donde"],
    },
    {
      id: "6",
      category: "locations",
      question: "¿Qué servicios incluyen las propiedades?",
      answer:
        "Nuestras propiedades incluyen:\n\n**Servicios básicos incluidos:**\n• WiFi de alta velocidad\n• Aire acondicionado\n• Cocina completamente equipada\n• Ropa de cama y toallas\n• Productos de limpieza básicos\n• Acceso a áreas comunes\n\n**Servicios adicionales (según propiedad):**\n• Piscina privada o comunitaria\n• Jardín o terraza\n• Parrilla/BBQ\n• Estacionamiento\n• Servicio de limpieza\n• Lavandería",
      tags: ["servicios", "incluido", "wifi", "cocina"],
    },
    {
      id: "7",
      category: "account",
      question: "¿Cómo creo una cuenta?",
      answer:
        "Crear una cuenta es fácil y gratuito:\n\n1. Haz clic en 'Registrarse' en la página principal\n2. Completa la información requerida:\n   • Nombre completo\n   • Email válido\n   • Contraseña segura\n   • Número de teléfono\n3. Verifica tu email (revisa spam/promociones)\n4. Completa tu perfil con información adicional\n\n**Beneficios de tener cuenta:**\n• Reservas más rápidas\n• Historial de estadías\n• Ofertas exclusivas\n• Soporte prioritario",
      tags: ["cuenta", "registro", "crear", "perfil"],
    },
    {
      id: "8",
      category: "account",
      question: "¿Cómo actualizo mi información personal?",
      answer:
        "Para actualizar tu información:\n\n1. Inicia sesión en tu cuenta\n2. Ve a 'Mi Perfil' en el menú\n3. Haz clic en 'Editar información'\n4. Actualiza los campos necesarios\n5. Guarda los cambios\n\n**Información que puedes actualizar:**\n• Datos personales\n• Información de contacto\n• Preferencias de comunicación\n• Foto de perfil\n• Contraseña\n\nAlgunos cambios pueden requerir verificación adicional por seguridad.",
      tags: ["actualizar", "perfil", "información", "cambiar"],
    },
    {
      id: "9",
      category: "policies",
      question: "¿Cuál es la política de check-in y check-out?",
      answer:
        "**Horarios estándar:**\n• **Check-in:** 3:00 PM - 8:00 PM\n• **Check-out:** Hasta las 11:00 AM\n\n**Check-in tardío:**\n• 8:00 PM - 10:00 PM: Sin costo adicional (previa coordinación)\n• Después de 10:00 PM: Cargo de $25 USD\n\n**Check-out tardío:**\n• Hasta 1:00 PM: $20 USD (sujeto a disponibilidad)\n• Después de 1:00 PM: Se cobra noche adicional\n\n**Proceso de check-in:**\n1. Confirmación de identidad\n2. Registro de huéspedes\n3. Entrega de llaves/códigos\n4. Tour de la propiedad\n5. Información local",
      tags: ["check-in", "check-out", "horarios", "llegada"],
    },
    {
      id: "10",
      category: "policies",
      question: "¿Permiten mascotas?",
      answer:
        "**Política de mascotas:**\n\nAlgunas de nuestras propiedades permiten mascotas con las siguientes condiciones:\n\n• **Cargo adicional:** $25 USD por noche por mascota\n• **Máximo:** 2 mascotas por reserva\n• **Peso límite:** Hasta 25 kg por mascota\n• **Documentación requerida:** Vacunas al día\n• **Depósito adicional:** $100 USD (reembolsable)\n\n**Restricciones:**\n• No se permiten en camas o muebles\n• Deben estar supervisadas en todo momento\n• Limpieza de desechos es responsabilidad del huésped\n\n*Verifica la disponibilidad para mascotas al hacer tu reserva.*",
      tags: ["mascotas", "perros", "gatos", "política"],
    },
  ];

  // Tutorial data
  const tutorials = [
    {
      id: "1",
      title: "Cómo hacer tu primera reserva",
      description: "Aprende paso a paso cómo reservar tu alojamiento ideal",
      duration: "5 min",
      type: "video",
      difficulty: "Principiante",
      category: "Reservas",
      steps: [
        "Explora nuestras ubicaciones disponibles",
        "Selecciona fechas y número de huéspedes",
        "Compara opciones de alojamiento",
        "Revisa detalles y precios",
        "Completa información de huéspedes",
        "Procesa el pago de forma segura",
        "Recibe confirmación por email",
      ],
    },
    {
      id: "2",
      title: "Gestiona tus reservas",
      description: "Cómo ver, modificar y cancelar tus reservas existentes",
      duration: "3 min",
      type: "tutorial",
      difficulty: "Principiante",
      category: "Gestión",
      steps: [
        "Accede a 'Mis Reservas' desde tu perfil",
        "Revisa el estado de tus reservas",
        "Descarga confirmaciones y recibos",
        "Solicita modificaciones si es necesario",
        "Gestiona cancelaciones",
        "Contacta soporte si tienes dudas",
      ],
    },
    {
      id: "3",
      title: "Optimiza tu perfil de huésped",
      description: "Configura tu perfil para una mejor experiencia",
      duration: "4 min",
      type: "guide",
      difficulty: "Intermedio",
      category: "Perfil",
      steps: [
        "Completa toda tu información personal",
        "Agrega una foto de perfil",
        "Configura preferencias de comunicación",
        "Añade métodos de pago",
        "Habilita verificaciones de seguridad",
        "Personaliza configuraciones de privacidad",
      ],
    },
    {
      id: "4",
      title: "Guía de ubicaciones y servicios",
      description: "Conoce nuestras propiedades en Corinto y El Sunzal",
      duration: "8 min",
      type: "guide",
      difficulty: "Principiante",
      category: "Ubicaciones",
      steps: [
        "Descubre las características de Corinto",
        "Explora las opciones en El Sunzal",
        "Comprende los tipos de alojamiento",
        "Conoce los servicios incluidos",
        "Identifica servicios adicionales",
        "Aprende sobre actividades locales",
      ],
    },
  ];

  // Filter FAQs based on search and category
  const filteredFAQs = faqs.filter((faq) => {
    const matchesSearch =
      searchQuery === "" ||
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.tags.some((tag) =>
        tag.toLowerCase().includes(searchQuery.toLowerCase()),
      );

    const matchesCategory =
      activeCategory === "all" || faq.category === activeCategory;

    return matchesSearch && matchesCategory;
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "video":
        return Video;
      case "tutorial":
        return BookOpen;
      case "guide":
        return FileText;
      default:
        return BookOpen;
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Principiante":
        return "bg-green-100 text-green-800";
      case "Intermedio":
        return "bg-yellow-100 text-yellow-800";
      case "Avanzado":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
        {/* Header */}
        <div className="bg-white border-b border-slate-200">
          <div className="container mx-auto px-4 py-8">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                <HelpCircle className="w-8 h-8 text-blue-600" />
              </div>
              <h1 className="text-3xl font-bold text-slate-900 mb-2">
                Centro de Ayuda
              </h1>
              <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                Encuentra respuestas rápidas a tus preguntas o aprende cómo usar
                nuestra plataforma
              </p>
            </div>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto mt-8">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                <Input
                  type="text"
                  placeholder="Buscar en el centro de ayuda..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-3 text-lg"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="container mx-auto px-4 py-8">
          <Tabs defaultValue="faqs" className="w-full">
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8">
              <TabsTrigger value="faqs" className="flex items-center gap-2">
                <HelpCircle className="w-4 h-4" />
                Preguntas Frecuentes
              </TabsTrigger>
              <TabsTrigger
                value="tutorials"
                className="flex items-center gap-2"
              >
                <BookOpen className="w-4 h-4" />
                Tutoriales
              </TabsTrigger>
            </TabsList>

            {/* FAQs Tab */}
            <TabsContent value="faqs">
              <div className="grid lg:grid-cols-4 gap-8">
                {/* FAQ Categories */}
                <div className="lg:col-span-1">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Categorías</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                      <div className="space-y-1">
                        {faqCategories.map((category) => {
                          const Icon = category.icon;
                          const count =
                            category.id === "all"
                              ? faqs.length
                              : faqs.filter(
                                  (faq) => faq.category === category.id,
                                ).length;

                          return (
                            <button
                              key={category.id}
                              onClick={() => setActiveCategory(category.id)}
                              className={cn(
                                "w-full flex items-center justify-between p-3 text-left hover:bg-slate-50 transition-colors",
                                activeCategory === category.id &&
                                  "bg-blue-50 text-blue-700 border-r-2 border-blue-600",
                              )}
                            >
                              <div className="flex items-center gap-3">
                                <Icon className="w-4 h-4" />
                                <span className="font-medium">
                                  {category.label}
                                </span>
                              </div>
                              <Badge variant="outline" className="text-xs">
                                {count}
                              </Badge>
                            </button>
                          );
                        })}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* FAQ Content */}
                <div className="lg:col-span-3">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <span>
                          {activeCategory === "all"
                            ? "Todas las preguntas"
                            : faqCategories.find((c) => c.id === activeCategory)
                                ?.label}
                        </span>
                        <Badge variant="outline">
                          {filteredFAQs.length} resultado
                          {filteredFAQs.length !== 1 ? "s" : ""}
                        </Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {filteredFAQs.length === 0 ? (
                        <div className="text-center py-8">
                          <HelpCircle className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                          <p className="text-slate-600">
                            No se encontraron preguntas que coincidan con tu
                            búsqueda.
                          </p>
                          <Button
                            variant="outline"
                            onClick={() => {
                              setSearchQuery("");
                              setActiveCategory("all");
                            }}
                            className="mt-4"
                          >
                            Limpiar filtros
                          </Button>
                        </div>
                      ) : (
                        <Accordion type="single" collapsible className="w-full">
                          {filteredFAQs.map((faq) => (
                            <AccordionItem key={faq.id} value={faq.id}>
                              <AccordionTrigger className="text-left">
                                <span className="font-medium">
                                  {faq.question}
                                </span>
                              </AccordionTrigger>
                              <AccordionContent>
                                <div className="space-y-4">
                                  <div className="text-slate-700 whitespace-pre-line">
                                    {faq.answer}
                                  </div>
                                  <div className="flex flex-wrap gap-2">
                                    {faq.tags.map((tag, index) => (
                                      <Badge
                                        key={index}
                                        variant="secondary"
                                        className="text-xs"
                                      >
                                        {tag}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>
                              </AccordionContent>
                            </AccordionItem>
                          ))}
                        </Accordion>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            {/* Tutorials Tab */}
            <TabsContent value="tutorials">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {tutorials.map((tutorial) => {
                  const TypeIcon = getTypeIcon(tutorial.type);

                  return (
                    <Card
                      key={tutorial.id}
                      className="hover:shadow-lg transition-shadow cursor-pointer group"
                    >
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-100 rounded-lg">
                              <TypeIcon className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                              <Badge variant="outline" className="text-xs">
                                {tutorial.category}
                              </Badge>
                            </div>
                          </div>
                          <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-blue-600 transition-colors" />
                        </div>
                        <CardTitle className="text-lg group-hover:text-blue-600 transition-colors">
                          {tutorial.title}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-slate-600 mb-4">
                          {tutorial.description}
                        </p>

                        <div className="flex items-center gap-4 mb-4 text-sm text-slate-500">
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {tutorial.duration}
                          </div>
                          <Badge
                            className={getDifficultyColor(tutorial.difficulty)}
                          >
                            {tutorial.difficulty}
                          </Badge>
                        </div>

                        <div className="space-y-2">
                          <p className="text-sm font-medium text-slate-700">
                            Aprenderás:
                          </p>
                          <ul className="space-y-1 text-sm text-slate-600">
                            {tutorial.steps.slice(0, 3).map((step, index) => (
                              <li
                                key={index}
                                className="flex items-start gap-2"
                              >
                                <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0" />
                                {step}
                              </li>
                            ))}
                            {tutorial.steps.length > 3 && (
                              <li className="text-blue-600 text-xs">
                                +{tutorial.steps.length - 3} pasos más...
                              </li>
                            )}
                          </ul>
                        </div>

                        <Button className="w-full mt-4" variant="outline">
                          <ExternalLink className="w-4 h-4 mr-2" />
                          Ver tutorial
                        </Button>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </TabsContent>
          </Tabs>

          {/* Contact Support Section */}
          <Card className="mt-12">
            <CardContent className="p-8">
              <div className="text-center">
                <MessageCircle className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-slate-900 mb-2">
                  ¿No encuentras lo que buscas?
                </h3>
                <p className="text-slate-600 mb-6 max-w-2xl mx-auto">
                  Nuestro equipo de soporte está aquí para ayudarte. Ponte en
                  contacto con nosotros y resolveremos tu consulta.
                </p>

                <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <MessageCircle className="w-6 h-6 text-green-600" />
                    </div>
                    <h4 className="font-semibold text-slate-900 mb-1">
                      Chat en Vivo
                    </h4>
                    <p className="text-sm text-slate-600 mb-3">
                      Respuesta inmediata
                    </p>
                    <Button className="w-full">Iniciar Chat</Button>
                  </div>

                  <div className="text-center">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Mail className="w-6 h-6 text-blue-600" />
                    </div>
                    <h4 className="font-semibold text-slate-900 mb-1">Email</h4>
                    <p className="text-sm text-slate-600 mb-3">
                      Respuesta en 24 horas
                    </p>
                    <Button variant="outline" className="w-full">
                      Enviar Email
                    </Button>
                  </div>

                  <div className="text-center">
                    <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Phone className="w-6 h-6 text-amber-600" />
                    </div>
                    <h4 className="font-semibold text-slate-900 mb-1">
                      Teléfono
                    </h4>
                    <p className="text-sm text-slate-600 mb-3">
                      Lun-Vie 9:00-18:00
                    </p>
                    <Button variant="outline" className="w-full">
                      Llamar Ahora
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default HelpCenter;
