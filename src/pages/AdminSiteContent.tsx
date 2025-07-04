import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import {
  Globe,
  Image,
  Edit,
  Save,
  Upload,
  Camera,
  Type,
  Palette,
  Layout,
  FileText,
  Languages,
  Eye,
  ExternalLink,
  Smartphone,
  Monitor,
  Tablet,
  Star,
  MapPin,
  Phone,
  Mail,
  Facebook,
  Instagram,
  X,
  Building2,
} from "lucide-react";
import AdminLayout from "@/components/AdminLayout";

const AdminSiteContent = () => {
  const [activeTab, setActiveTab] = useState("homepage");
  const [isEditing, setIsEditing] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [imageDialogOpen, setImageDialogOpen] = useState(false);

  // Estado del contenido del sitio
  const [siteContent, setSiteContent] = useState({
    homepage: {
      hero: {
        title: "CLUB SALVADOREÑO",
        subtitle: "Tu escape perfecto a la costa salvadoreña",
        description:
          "Descubre nuestras opciones de alojamiento en El Sunzal y Corinto. Apartamentos, casas y suites con vista al mar y al lago.",
        backgroundImage: "/images/hero/beach-hero.jpg",
        ctaText: "Explorar Alojamientos",
      },
      features: {
        title: "¿Por qué elegir Club Salvadoreño?",
        items: [
          {
            title: "Ubicaciones Únicas",
            description: "El Sunzal y Corinto, dos destinos espectaculares",
            icon: "MapPin",
          },
          {
            title: "Variedad de Opciones",
            description: "Apartamentos, casas y suites para todos los gustos",
            icon: "Star",
          },
          {
            title: "Atención Personalizada",
            description: "Servicio de calidad y atención las 24 horas",
            icon: "Phone",
          },
        ],
      },
      testimonials: {
        title: "Lo que dicen nuestros huéspedes",
        items: [
          {
            name: "María González",
            text: "Una experiencia increíble. La vista al mar desde el apartamento era espectacular.",
            rating: 5,
          },
          {
            name: "Carlos Rivera",
            text: "Excelente atención y las instalaciones súper limpias. Volveremos pronto.",
            rating: 5,
          },
        ],
      },
    },
    accommodations: {
      title: "Nuestros Alojamientos",
      subtitle: "Encuentra el lugar perfecto para tu estancia",
      categories: {
        apartamentos: {
          title: "APARTAMENTOS",
          description:
            "Ideales para estancias cómodas con todas las comodidades. Modernos, funcionales y con vistas espectaculares al océano.",
          features: [
            "1-2 habitaciones",
            "Kitchenette",
            "Balcón",
            "Vista al mar",
          ],
        },
        casas: {
          title: "CASAS",
          description:
            "Perfectas para grupos y familias que buscan privacidad, amplitud y comodidad. Disfruta de espacios equipados.",
          features: [
            "2-4 habitaciones",
            "Cocina completa",
            "Sala de estar",
            "Terraza privada",
          ],
        },
        suites: {
          title: "SUITES",
          description:
            "Pensadas para una estadía íntima, elegante y llena de confort. Cada suite ofrece un refugio exclusivo.",
          features: [
            "Suite ejecutiva",
            "Jacuzzi privado",
            "Servicio premium",
            "Vista panorámica",
          ],
        },
      },
    },
    locations: {
      elSunzal: {
        title: "El Sunzal",
        description:
          "Conocido por sus olas perfectas para el surf y sus increíbles atardeceres. Un destino ideal para relajarse frente al océano Pacífico.",
        highlights: [
          "Playa de surf",
          "Atardeceres espectaculares",
          "Vida nocturna",
        ],
        accommodationTypes: ["Apartamentos", "Casas", "Suites"],
      },
      corinto: {
        title: "Corinto",
        description:
          "Un refugio tranquilo junto al lago, perfecto para desconectarse y disfrutar de la naturaleza en su máximo esplendor.",
        highlights: ["Vista al lago", "Tranquilidad", "Naturaleza"],
        accommodationTypes: ["Apartamentos", "Casas"],
      },
    },
    contact: {
      title: "Contáctanos",
      subtitle: "Estamos aquí para ayudarte a planear tu estadía perfecta",
      phone: "+503 2345-6789",
      email: "info@clubsalvadoreno.com",
      address: "El Sunzal, La Libertad, El Salvador",
      socialMedia: {
        facebook: "https://facebook.com/clubsalvadoreno",
        instagram: "https://instagram.com/clubsalvadoreno",
      },
      hours: "24/7 - Atención disponible todo el tiempo",
    },
    seo: {
      title: "Club Salvadoreño - Alojamientos en El Salvador",
      description:
        "Descubre los mejores alojamientos en El Sunzal y Corinto. Apartamentos, casas y suites con vista al mar y lago.",
      keywords: [
        "alojamientos El Salvador",
        "El Sunzal",
        "Corinto",
        "apartamentos playa",
        "casas vacaciones",
        "suites El Salvador",
      ],
    },
  });

  const handleSave = () => {
    setIsEditing(false);
    toast({
      title: "Contenido actualizado",
      description: "Los cambios han sido guardados exitosamente.",
    });
  };

  const handleImageUpload = (field: string) => {
    // Simular upload de imagen
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        // En un caso real, aquí se subiría la imagen al servidor
        const imageUrl = URL.createObjectURL(file);
        setSiteContent((prev) => ({
          ...prev,
          homepage: {
            ...prev.homepage,
            hero: {
              ...prev.homepage.hero,
              backgroundImage: imageUrl,
            },
          },
        }));
        toast({
          title: "Imagen subida",
          description: "La imagen ha sido actualizada exitosamente.",
        });
      }
    };
    input.click();
  };

  const previewImages = [
    "/images/hero/beach-hero.jpg",
    "/images/hero/sunset-hero.jpg",
    "/images/hero/accommodation-hero.jpg",
    "/images/locations/el-sunzal-main.jpg",
    "/images/locations/corinto-main.jpg",
    "/placeholder.svg",
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">
              Gestión de Contenido del Sitio
            </h1>
            <p className="text-gray-600">
              Administra el contenido, imágenes y textos del sitio web
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">
              <Eye className="mr-2 h-4 w-4" />
              Vista Previa
            </Button>
            <Button
              onClick={isEditing ? handleSave : () => setIsEditing(true)}
              className={isEditing ? "bg-green-600 hover:bg-green-700" : ""}
            >
              {isEditing ? (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Guardar Cambios
                </>
              ) : (
                <>
                  <Edit className="mr-2 h-4 w-4" />
                  Editar Contenido
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                Páginas Principales
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">6</div>
              <p className="text-xs text-muted-foreground">
                Inicio, Alojamientos, Ubicaciones
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Imágenes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">24</div>
              <p className="text-xs text-muted-foreground">
                Hero, galerías, iconos
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                Último Cambio
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">Hoy</div>
              <p className="text-xs text-muted-foreground">
                Actualización hero
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Estado</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm font-medium">Publicado</span>
              </div>
              <p className="text-xs text-muted-foreground">Todo actualizado</p>
            </CardContent>
          </Card>
        </div>

        {/* Content Management Tabs */}
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="homepage">Página Inicio</TabsTrigger>
            <TabsTrigger value="accommodations">Alojamientos</TabsTrigger>
            <TabsTrigger value="locations">Ubicaciones</TabsTrigger>
            <TabsTrigger value="contact">Contacto</TabsTrigger>
            <TabsTrigger value="images">Imágenes</TabsTrigger>
            <TabsTrigger value="seo">SEO</TabsTrigger>
          </TabsList>

          {/* Homepage Content */}
          <TabsContent value="homepage" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Layout className="h-5 w-5" />
                  <span>Sección Hero</span>
                </CardTitle>
                <CardDescription>
                  Gestiona el contenido principal de la página de inicio
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="hero-title">Título Principal</Label>
                      <Input
                        id="hero-title"
                        value={siteContent.homepage.hero.title}
                        onChange={(e) =>
                          setSiteContent((prev) => ({
                            ...prev,
                            homepage: {
                              ...prev.homepage,
                              hero: {
                                ...prev.homepage.hero,
                                title: e.target.value,
                              },
                            },
                          }))
                        }
                        disabled={!isEditing}
                        className="font-bold text-lg"
                      />
                    </div>
                    <div>
                      <Label htmlFor="hero-subtitle">Subtítulo</Label>
                      <Input
                        id="hero-subtitle"
                        value={siteContent.homepage.hero.subtitle}
                        onChange={(e) =>
                          setSiteContent((prev) => ({
                            ...prev,
                            homepage: {
                              ...prev.homepage,
                              hero: {
                                ...prev.homepage.hero,
                                subtitle: e.target.value,
                              },
                            },
                          }))
                        }
                        disabled={!isEditing}
                      />
                    </div>
                    <div>
                      <Label htmlFor="hero-description">Descripción</Label>
                      <Textarea
                        id="hero-description"
                        value={siteContent.homepage.hero.description}
                        onChange={(e) =>
                          setSiteContent((prev) => ({
                            ...prev,
                            homepage: {
                              ...prev.homepage,
                              hero: {
                                ...prev.homepage.hero,
                                description: e.target.value,
                              },
                            },
                          }))
                        }
                        disabled={!isEditing}
                        rows={4}
                      />
                    </div>
                    <div>
                      <Label htmlFor="hero-cta">Texto del Botón</Label>
                      <Input
                        id="hero-cta"
                        value={siteContent.homepage.hero.ctaText}
                        onChange={(e) =>
                          setSiteContent((prev) => ({
                            ...prev,
                            homepage: {
                              ...prev.homepage,
                              hero: {
                                ...prev.homepage.hero,
                                ctaText: e.target.value,
                              },
                            },
                          }))
                        }
                        disabled={!isEditing}
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <Label>Imagen de Fondo</Label>
                      <div className="relative">
                        <img
                          src={siteContent.homepage.hero.backgroundImage}
                          alt="Hero background"
                          className="w-full h-48 object-cover rounded-lg border"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src =
                              "/placeholder.svg";
                          }}
                        />
                        {isEditing && (
                          <Button
                            size="sm"
                            className="absolute top-2 right-2"
                            onClick={() => handleImageUpload("hero")}
                          >
                            <Camera className="h-4 w-4 mr-1" />
                            Cambiar
                          </Button>
                        )}
                      </div>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-medium mb-2">Vista Previa</h4>
                      <div className="text-sm space-y-1">
                        <p className="font-bold">
                          {siteContent.homepage.hero.title}
                        </p>
                        <p className="text-gray-600">
                          {siteContent.homepage.hero.subtitle}
                        </p>
                        <p className="text-xs text-gray-500">
                          {siteContent.homepage.hero.description.substring(
                            0,
                            100,
                          )}
                          ...
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Features Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Star className="h-5 w-5" />
                  <span>Sección Características</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="features-title">Título de la Sección</Label>
                  <Input
                    id="features-title"
                    value={siteContent.homepage.features.title}
                    onChange={(e) =>
                      setSiteContent((prev) => ({
                        ...prev,
                        homepage: {
                          ...prev.homepage,
                          features: {
                            ...prev.homepage.features,
                            title: e.target.value,
                          },
                        },
                      }))
                    }
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-3">
                  {siteContent.homepage.features.items.map((item, index) => (
                    <div
                      key={index}
                      className="border rounded-lg p-4 space-y-2"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor={`feature-title-${index}`}>
                            Título
                          </Label>
                          <Input
                            id={`feature-title-${index}`}
                            value={item.title}
                            onChange={(e) => {
                              const newItems = [
                                ...siteContent.homepage.features.items,
                              ];
                              newItems[index] = {
                                ...newItems[index],
                                title: e.target.value,
                              };
                              setSiteContent((prev) => ({
                                ...prev,
                                homepage: {
                                  ...prev.homepage,
                                  features: {
                                    ...prev.homepage.features,
                                    items: newItems,
                                  },
                                },
                              }));
                            }}
                            disabled={!isEditing}
                          />
                        </div>
                        <div>
                          <Label htmlFor={`feature-desc-${index}`}>
                            Descripción
                          </Label>
                          <Input
                            id={`feature-desc-${index}`}
                            value={item.description}
                            onChange={(e) => {
                              const newItems = [
                                ...siteContent.homepage.features.items,
                              ];
                              newItems[index] = {
                                ...newItems[index],
                                description: e.target.value,
                              };
                              setSiteContent((prev) => ({
                                ...prev,
                                homepage: {
                                  ...prev.homepage,
                                  features: {
                                    ...prev.homepage.features,
                                    items: newItems,
                                  },
                                },
                              }));
                            }}
                            disabled={!isEditing}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Accommodations Content */}
          <TabsContent value="accommodations" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Building2 className="h-5 w-5" />
                  <span>Página de Alojamientos</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="acc-title">Título Principal</Label>
                    <Input
                      id="acc-title"
                      value={siteContent.accommodations.title}
                      onChange={(e) =>
                        setSiteContent((prev) => ({
                          ...prev,
                          accommodations: {
                            ...prev.accommodations,
                            title: e.target.value,
                          },
                        }))
                      }
                      disabled={!isEditing}
                    />
                  </div>
                  <div>
                    <Label htmlFor="acc-subtitle">Subtítulo</Label>
                    <Input
                      id="acc-subtitle"
                      value={siteContent.accommodations.subtitle}
                      onChange={(e) =>
                        setSiteContent((prev) => ({
                          ...prev,
                          accommodations: {
                            ...prev.accommodations,
                            subtitle: e.target.value,
                          },
                        }))
                      }
                      disabled={!isEditing}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium">Categorías de Alojamientos</h4>
                  {Object.entries(siteContent.accommodations.categories).map(
                    ([key, category]) => (
                      <div
                        key={key}
                        className="border rounded-lg p-4 space-y-3"
                      >
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline" className="capitalize">
                            {key}
                          </Badge>
                          <h5 className="font-medium">{category.title}</h5>
                        </div>
                        <div>
                          <Label htmlFor={`${key}-description`}>
                            Descripción
                          </Label>
                          <Textarea
                            id={`${key}-description`}
                            value={category.description}
                            onChange={(e) =>
                              setSiteContent((prev) => ({
                                ...prev,
                                accommodations: {
                                  ...prev.accommodations,
                                  categories: {
                                    ...prev.accommodations.categories,
                                    [key]: {
                                      ...prev.accommodations.categories[
                                        key as keyof typeof prev.accommodations.categories
                                      ],
                                      description: e.target.value,
                                    },
                                  },
                                },
                              }))
                            }
                            disabled={!isEditing}
                            rows={3}
                          />
                        </div>
                        <div>
                          <Label>Características</Label>
                          <div className="flex flex-wrap gap-2 mt-1">
                            {category.features.map((feature, index) => (
                              <Badge key={index} variant="secondary">
                                {feature}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    ),
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Locations Content */}
          <TabsContent value="locations" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Object.entries(siteContent.locations).map(([key, location]) => (
                <Card key={key}>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <MapPin className="h-5 w-5" />
                      <span>{location.title}</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor={`${key}-title`}>Título</Label>
                      <Input
                        id={`${key}-title`}
                        value={location.title}
                        onChange={(e) =>
                          setSiteContent((prev) => ({
                            ...prev,
                            locations: {
                              ...prev.locations,
                              [key]: {
                                ...prev.locations[
                                  key as keyof typeof prev.locations
                                ],
                                title: e.target.value,
                              },
                            },
                          }))
                        }
                        disabled={!isEditing}
                      />
                    </div>
                    <div>
                      <Label htmlFor={`${key}-description`}>Descripción</Label>
                      <Textarea
                        id={`${key}-description`}
                        value={location.description}
                        onChange={(e) =>
                          setSiteContent((prev) => ({
                            ...prev,
                            locations: {
                              ...prev.locations,
                              [key]: {
                                ...prev.locations[
                                  key as keyof typeof prev.locations
                                ],
                                description: e.target.value,
                              },
                            },
                          }))
                        }
                        disabled={!isEditing}
                        rows={4}
                      />
                    </div>
                    <div>
                      <Label>Puntos Destacados</Label>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {location.highlights.map((highlight, index) => (
                          <Badge key={index} variant="outline">
                            {highlight}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <Label>Tipos de Alojamiento</Label>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {location.accommodationTypes.map((type, index) => (
                          <Badge key={index} variant="secondary">
                            {type}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Contact Content */}
          <TabsContent value="contact" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Phone className="h-5 w-5" />
                  <span>Información de Contacto</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="contact-title">Título</Label>
                    <Input
                      id="contact-title"
                      value={siteContent.contact.title}
                      onChange={(e) =>
                        setSiteContent((prev) => ({
                          ...prev,
                          contact: {
                            ...prev.contact,
                            title: e.target.value,
                          },
                        }))
                      }
                      disabled={!isEditing}
                    />
                  </div>
                  <div>
                    <Label htmlFor="contact-subtitle">Subtítulo</Label>
                    <Input
                      id="contact-subtitle"
                      value={siteContent.contact.subtitle}
                      onChange={(e) =>
                        setSiteContent((prev) => ({
                          ...prev,
                          contact: {
                            ...prev.contact,
                            subtitle: e.target.value,
                          },
                        }))
                      }
                      disabled={!isEditing}
                    />
                  </div>
                  <div>
                    <Label htmlFor="contact-phone">Teléfono</Label>
                    <Input
                      id="contact-phone"
                      value={siteContent.contact.phone}
                      onChange={(e) =>
                        setSiteContent((prev) => ({
                          ...prev,
                          contact: {
                            ...prev.contact,
                            phone: e.target.value,
                          },
                        }))
                      }
                      disabled={!isEditing}
                    />
                  </div>
                  <div>
                    <Label htmlFor="contact-email">Email</Label>
                    <Input
                      id="contact-email"
                      value={siteContent.contact.email}
                      onChange={(e) =>
                        setSiteContent((prev) => ({
                          ...prev,
                          contact: {
                            ...prev.contact,
                            email: e.target.value,
                          },
                        }))
                      }
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="contact-address">Dirección</Label>
                    <Input
                      id="contact-address"
                      value={siteContent.contact.address}
                      onChange={(e) =>
                        setSiteContent((prev) => ({
                          ...prev,
                          contact: {
                            ...prev.contact,
                            address: e.target.value,
                          },
                        }))
                      }
                      disabled={!isEditing}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Images Management */}
          <TabsContent value="images" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Image className="h-5 w-5" />
                  <span>Gestión de Imágenes</span>
                </CardTitle>
                <CardDescription>
                  Administra las imágenes utilizadas en el sitio web
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {previewImages.map((image, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={image}
                        alt={`Imagen ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg border cursor-pointer hover:opacity-80 transition-opacity"
                        onClick={() => {
                          setSelectedImage(image);
                          setImageDialogOpen(true);
                        }}
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            "/placeholder.svg";
                        }}
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all rounded-lg flex items-center justify-center">
                        <Eye className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4">
                  <Button
                    onClick={() => {
                      const input = document.createElement("input");
                      input.type = "file";
                      input.accept = "image/*";
                      input.multiple = true;
                      input.click();
                    }}
                    variant="outline"
                    className="w-full"
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    Subir Nuevas Imágenes
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* SEO Settings */}
          <TabsContent value="seo" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Globe className="h-5 w-5" />
                  <span>Configuración SEO</span>
                </CardTitle>
                <CardDescription>
                  Optimiza el posicionamiento del sitio en buscadores
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="seo-title">Título SEO</Label>
                  <Input
                    id="seo-title"
                    value={siteContent.seo.title}
                    onChange={(e) =>
                      setSiteContent((prev) => ({
                        ...prev,
                        seo: {
                          ...prev.seo,
                          title: e.target.value,
                        },
                      }))
                    }
                    disabled={!isEditing}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Máximo 60 caracteres
                  </p>
                </div>
                <div>
                  <Label htmlFor="seo-description">Meta Descripción</Label>
                  <Textarea
                    id="seo-description"
                    value={siteContent.seo.description}
                    onChange={(e) =>
                      setSiteContent((prev) => ({
                        ...prev,
                        seo: {
                          ...prev.seo,
                          description: e.target.value,
                        },
                      }))
                    }
                    disabled={!isEditing}
                    rows={3}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Máximo 160 caracteres
                  </p>
                </div>
                <div>
                  <Label>Palabras Clave</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {siteContent.seo.keywords.map((keyword, index) => (
                      <Badge key={index} variant="outline">
                        {keyword}
                        {isEditing && (
                          <button
                            className="ml-1 text-red-500 hover:text-red-700"
                            onClick={() => {
                              const newKeywords =
                                siteContent.seo.keywords.filter(
                                  (_, i) => i !== index,
                                );
                              setSiteContent((prev) => ({
                                ...prev,
                                seo: {
                                  ...prev.seo,
                                  keywords: newKeywords,
                                },
                              }));
                            }}
                          >
                            <X className="h-3 w-3" />
                          </button>
                        )}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Image Preview Dialog */}
        <Dialog open={imageDialogOpen} onOpenChange={setImageDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Vista Previa de Imagen</DialogTitle>
            </DialogHeader>
            {selectedImage && (
              <div className="space-y-4">
                <img
                  src={selectedImage}
                  alt="Vista previa"
                  className="w-full h-96 object-cover rounded-lg"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "/placeholder.svg";
                  }}
                />
                <div className="flex space-x-2">
                  <Button variant="outline" className="flex-1">
                    <Edit className="mr-2 h-4 w-4" />
                    Editar
                  </Button>
                  <Button variant="outline" className="flex-1">
                    <Upload className="mr-2 h-4 w-4" />
                    Reemplazar
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default AdminSiteContent;
