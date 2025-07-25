import { useState, useEffect } from "react";
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
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/hooks/use-toast";
import {
  Building2,
  Edit,
  Eye,
  Search,
  Filter,
  Plus,
  Upload,
  DollarSign,
  Users,
  MapPin,
  Wifi,
  Car,
  Coffee,
  Tv,
  Wind,
  Home,
  Camera,
  X,
  Save,
  Star,
  Bath,
  Bed,
  Crown,
} from "lucide-react";
import AdminLayout from "@/components/AdminLayout";
import {
  apiGetAccommodations,
  apiUpdateAccommodation,
  Accommodation,
} from "@/lib/api-service";
import { hasPermission, getCurrentUser } from "@/lib/auth-service";
import {
  useUnifiedData,
  UnifiedAccommodation,
} from "@/lib/unified-data-service";

const AdminAccommodations = () => {
  const {
    accommodations,
    stats,
    updateAccommodation,
    searchAccommodations,
    getFilteredAccommodations,
  } = useUnifiedData();
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [locationFilter, setLocationFilter] = useState("el-sunzal");
  const [typeFilter, setTypeFilter] = useState("all");
  const [selectedAccommodation, setSelectedAccommodation] =
    useState<UnifiedAccommodation | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isNewAccommodationDialogOpen, setIsNewAccommodationDialogOpen] =
    useState(false);
  const [editForm, setEditForm] = useState<Partial<UnifiedAccommodation>>({});

  const currentUser = getCurrentUser();

  // Permisos del usuario actual
  const canEditContent = hasPermission("canEditSiteContent");
  const canManageImages = hasPermission("canManageImages");
  const canManageAccommodations = hasPermission("canManageAccommodations");

  // Los datos ya están disponibles a través del hook useUnifiedData
  // No necesitamos cargar datos por separado

  // Lista completa de alojamientos basada en la estructura real del sistema
  const getCompleteAccommodationsList = (): Accommodation[] => [
    // El Sunzal - Apartamentos
    {
      id: "1A",
      name: "Apartamento 1A",
      type: "apartamento",
      location: "el-sunzal",
      capacity: 2,
      price: 230,
      status: "available",
      description:
        "Cómodo apartamento con vista directa al mar, perfecto para parejas. Ubicado en el primer piso con fácil acceso y todas las comodidades necesarias.",
      amenities: ["Wi-Fi", "Aire acondicionado", "TV", "Kitchenette"],
      pricing: { weekday: 110, weekend: 230, holiday: 280 },
      images: [
        "/images/apartamentos/1a-1.jpg",
        "/images/apartamentos/1a-2.jpg",
      ],
      available: true,
      view: "Vista al mar",
    },
    {
      id: "1B",
      name: "Apartamento 1B",
      type: "apartamento",
      location: "el-sunzal",
      capacity: 2,
      price: 210,
      status: "available",
      description:
        "Apartamento acogedor con vista parcial al mar. Ideal para una estancia romántica con todas las comodidades modernas.",
      amenities: ["Wi-Fi", "Aire acondicionado", "TV", "Kitchenette"],
      pricing: { weekday: 95, weekend: 210, holiday: 260 },
      images: [
        "/images/apartamentos/1b-1.jpg",
        "/images/apartamentos/1b-2.jpg",
      ],
      available: true,
      view: "Vista parcial",
    },
    {
      id: "2A",
      name: "Apartamento 2A",
      type: "apartamento",
      location: "el-sunzal",
      capacity: 4,
      price: 250,
      status: "available",
      description:
        "Espacioso apartamento para familias con vista premium al mar. Segundo piso con balcón privado y cocina completa.",
      amenities: [
        "Wi-Fi",
        "Aire acondicionado",
        "TV",
        "Cocina completa",
        "Balcón",
      ],
      pricing: { weekday: 120, weekend: 250, holiday: 300 },
      images: [
        "/images/apartamentos/2a-1.jpg",
        "/images/apartamentos/2a-2.jpg",
      ],
      available: true,
      view: "Vista al mar premium",
    },
    {
      id: "2B",
      name: "Apartamento 2B",
      type: "apartamento",
      location: "el-sunzal",
      capacity: 4,
      price: 225,
      status: "available",
      description:
        "Apartamento familiar con vista al jardín tropical. Perfecto para familias que buscan tranquilidad y confort.",
      amenities: ["Wi-Fi", "Aire acondicionado", "TV", "Cocina completa"],
      pricing: { weekday: 105, weekend: 225, holiday: 275 },
      images: [
        "/images/apartamentos/2b-1.jpg",
        "/images/apartamentos/2b-2.jpg",
      ],
      available: true,
      view: "Vista jardín",
    },
    {
      id: "3A",
      name: "Apartamento 3A",
      type: "apartamento",
      location: "el-sunzal",
      capacity: 6,
      price: 350,
      status: "available",
      description:
        "Penthouse de lujo con todas las comodidades para grupos grandes. Vista panorámica espectacular y terraza privada con jacuzzi.",
      amenities: [
        "Wi-Fi",
        "Aire acondicionado",
        "TV",
        "Cocina gourmet",
        "Terraza",
        "Jacuzzi",
      ],
      pricing: { weekday: 180, weekend: 350, holiday: 450 },
      images: [
        "/images/apartamentos/3a-1.jpg",
        "/images/apartamentos/3a-2.jpg",
      ],
      available: true,
      view: "Penthouse",
    },
    {
      id: "3B",
      name: "Apartamento 3B",
      type: "apartamento",
      location: "el-sunzal",
      capacity: 6,
      price: 320,
      status: "available",
      description:
        "Amplio apartamento con vista lateral al mar. Excelente para grupos grandes con terraza amplia y múltiples comodidades.",
      amenities: [
        "Wi-Fi",
        "Aire acondicionado",
        "TV",
        "Cocina completa",
        "Terraza",
      ],
      pricing: { weekday: 160, weekend: 320, holiday: 400 },
      images: [
        "/images/apartamentos/3b-1.jpg",
        "/images/apartamentos/3b-2.jpg",
      ],
      available: true,
      view: "Vista lateral",
    },

    // El Sunzal - Casas
    {
      id: "casa1",
      name: "Casa Surf Paradise",
      type: "casa",
      location: "el-sunzal",
      capacity: 6,
      price: 450,
      status: "available",
      description:
        "Casa diseñada especialmente para surfistas con acceso directo al break. Incluye almacenamiento para tablas y ducha exterior.",
      amenities: [
        "Wi-Fi",
        "Aire acondicionado",
        "Cocina completa",
        "Terraza",
        "Almacenamiento para tablas",
        "Ducha exterior",
      ],
      pricing: { weekday: 250, weekend: 450, holiday: 550 },
      images: ["/images/casas/casa1-1.jpg", "/images/casas/casa1-2.jpg"],
      available: true,
      view: "Frente al mar",
    },
    {
      id: "casa2",
      name: "Casa Familiar Deluxe",
      type: "casa",
      location: "el-sunzal",
      capacity: 8,
      price: 550,
      status: "available",
      description:
        "Casa amplia y familiar con todas las comodidades para grupos grandes. Jardín privado, BBQ y sala de juegos incluidos.",
      amenities: [
        "Wi-Fi",
        "Aire acondicionado",
        "Cocina gourmet",
        "Jardín privado",
        "BBQ",
        "Sala de juegos",
      ],
      pricing: { weekday: 300, weekend: 550, holiday: 650 },
      images: ["/images/casas/casa2-1.jpg", "/images/casas/casa2-2.jpg"],
      available: true,
      view: "Amplia vista",
    },
    {
      id: "casa3",
      name: "Casa Vista Panorámica",
      type: "casa",
      location: "el-sunzal",
      capacity: 6,
      price: 500,
      status: "available",
      description:
        "Casa elevada con vista panorámica espectacular del océano. Jacuzzi exterior, terraza multinivel y hamacas.",
      amenities: [
        "Wi-Fi",
        "Aire acondicionado",
        "Cocina completa",
        "Jacuzzi exterior",
        "Terraza multinivel",
        "Hamacas",
      ],
      pricing: { weekday: 280, weekend: 500, holiday: 600 },
      images: ["/images/casas/casa3-1.jpg", "/images/casas/casa3-2.jpg"],
      available: true,
      view: "Panorámica elevada",
    },

    // El Sunzal - Suites (16 suites)
    ...Array.from({ length: 16 }, (_, i) => ({
      id: `suite${i + 1}`,
      name: `Suite Premium ${i + 1}`,
      type: "suite" as const,
      location: "el-sunzal" as const,
      capacity: 2 + Math.floor(i / 4),
      price: 320 + i * 15,
      status: "available" as const,
      description: `Suite de lujo número ${i + 1} con servicios premium incluidos. Diseño elegante con vista panorámica al océano Pacífico.`,
      amenities: [
        "Wi-Fi",
        "Aire acondicionado",
        "TV Premium",
        "Minibar",
        "Room service",
        "Jacuzzi",
        "Balcón privado",
        "Servicio de limpieza",
      ],
      pricing: {
        weekday: 180 + i * 10,
        weekend: 320 + i * 15,
        holiday: 420 + i * 20,
      },
      images: [
        `/images/suites/suite-${i + 1}-1.jpg`,
        `/images/suites/suite-${i + 1}-2.jpg`,
      ],
      available: true,
      view: "Premium",
    })),

    // Corinto - Casas
    ...Array.from({ length: 6 }, (_, i) => ({
      id: `corinto-casa-${i + 1}`,
      name: `Casa Corinto ${i + 1}`,
      type: "casa" as const,
      location: "corinto" as const,
      capacity: 4 + Math.floor(i / 2),
      price: 280 + i * 25,
      status: i !== 3 ? "available" : "maintenance",
      description: `Casa moderna ${i + 1} en Corinto con vista al lago. Ambiente tranquilo y relajante perfecto para desconectarse de la rutina.`,
      amenities: [
        "Wi-Fi",
        "Aire acondicionado",
        "TV",
        "Cocina equipada",
        "Terraza",
        "Jardín",
        "BBQ",
      ],
      pricing: {
        weekday: 140 + i * 15,
        weekend: 280 + i * 25,
        holiday: 350 + i * 30,
      },
      images: [
        `/images/corinto/casa-${i + 1}-1.jpg`,
        `/images/corinto/casa-${i + 1}-2.jpg`,
      ],
      available: i !== 3, // Casa 4 no disponible para simular variedad
      view: "Vista lago",
    })),
  ];

  const handleUpdateAccommodation = async () => {
    if (!selectedAccommodation || !currentUser) return;

    try {
      const success = updateAccommodation(
        selectedAccommodation.id,
        editForm,
        `${currentUser.firstName} ${currentUser.lastName}`,
      );

      if (success) {
        toast({
          title: "Alojamiento actualizado",
          description:
            "Los cambios han sido guardados y sincronizados con el sitio principal.",
        });
        setIsEditDialogOpen(false);
        setSelectedAccommodation(null);
        setEditForm({});
      } else {
        throw new Error("No se pudo actualizar");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo actualizar el alojamiento.",
        variant: "destructive",
      });
    }
  };

  const filteredAccommodations = searchTerm
    ? searchAccommodations(searchTerm).filter((acc) => {
        const matchesLocation =
          locationFilter === "all" || acc.location === locationFilter;
        const matchesType = typeFilter === "all" || acc.type === typeFilter;
        return matchesLocation && matchesType;
      })
    : getFilteredAccommodations({
        location: locationFilter === "all" ? undefined : locationFilter,
        type: typeFilter === "all" ? undefined : typeFilter,
      });

  const getLocationName = (location: string) => {
    return location === "el-sunzal" ? "El Sunzal" : "Corinto";
  };

  const getTypeName = (type: string) => {
    return type === "apartamento"
      ? "Apartamento"
      : type === "casa"
        ? "Casa"
        : "Suite";
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "apartamento":
        return Building2;
      case "casa":
        return Home;
      case "suite":
        return Crown;
      default:
        return Building2;
    }
  };

  const amenityIcons: Record<string, any> = {
    "Wi-Fi": Wifi,
    "Aire acondicionado": Wind,
    TV: Tv,
    "TV Premium": Tv,
    Estacionamiento: Car,
    "Cocina equipada": Coffee,
    "Cocina completa": Coffee,
    "Cocina gourmet": Coffee,
    Kitchenette: Coffee,
    Balcón: Home,
    Terraza: Home,
    Jardín: Home,
    BBQ: Coffee,
    Jacuzzi: Bath,
    "Jacuzzi exterior": Bath,
    Minibar: Coffee,
    "Room service": Crown,
    "Servicio de limpieza": Crown,
    "Balcón privado": Home,
  };

  const openEditDialog = (accommodation: UnifiedAccommodation) => {
    setSelectedAccommodation(accommodation);
    setEditForm({
      name: accommodation.name,
      description: accommodation.description,
      capacity: accommodation.capacity,
      pricing: { ...accommodation.pricing },
      amenities: [...accommodation.amenities],
      available: accommodation.available,
      view: accommodation.view || "",
    });
    setIsEditDialogOpen(true);
  };

  const openViewDialog = (accommodation: UnifiedAccommodation) => {
    setSelectedAccommodation(accommodation);
    setIsViewDialogOpen(true);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Gestión de Alojamientos</h1>
            <p className="text-gray-600">
              Administra información, precios e imágenes de los alojamientos del
              sistema
            </p>
          </div>
          {canManageAccommodations && (
            <Button onClick={() => setIsNewAccommodationDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Nuevo Alojamiento
            </Button>
          )}
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                Total Alojamientos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {stats.total}
              </div>
              <p className="text-xs text-muted-foreground">
                En ambas ubicaciones
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">El Sunzal</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {stats.elSunzal}
              </div>
              <p className="text-xs text-muted-foreground">
                Apt, casas y suites
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Corinto</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">
                {stats.corinto}
              </div>
              <p className="text-xs text-muted-foreground">
                Solo casas familiares
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Disponibles</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-emerald-600">
                {stats.available}
              </div>
              <p className="text-xs text-muted-foreground">
                Listos para reservar
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                Precio Promedio
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">
                ${stats.avgPrice}
              </div>
              <p className="text-xs text-muted-foreground">Fin de semana</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Filtros y Búsqueda</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <Label htmlFor="search">Buscar alojamientos</Label>
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="search"
                    placeholder="Buscar por nombre o descripción..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="location-filter">Ubicación</Label>
                <Select
                  value={locationFilter}
                  onValueChange={setLocationFilter}
                >
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Seleccionar ubicación" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="el-sunzal">El Sunzal</SelectItem>
                    <SelectItem value="corinto">Corinto</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="type-filter">Tipo</Label>
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Todos los tipos" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos los tipos</SelectItem>
                    <SelectItem value="apartamento">Apartamento</SelectItem>
                    <SelectItem value="casa">Casa</SelectItem>
                    <SelectItem value="suite">Suite</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Accommodations by Location - Tabs */}
        <Tabs defaultValue="el-sunzal" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger
              value="el-sunzal"
              className="flex items-center space-x-2"
            >
              <span>🏄‍♂️</span>
              <span>
                El Sunzal (
                {
                  accommodations.filter((acc) => acc.location === "el-sunzal")
                    .length
                }
                )
              </span>
            </TabsTrigger>
            <TabsTrigger
              value="corinto"
              className="flex items-center space-x-2"
            >
              <span>🏞️</span>
              <span>
                Corinto (
                {
                  accommodations.filter((acc) => acc.location === "corinto")
                    .length
                }
                )
              </span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="el-sunzal" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center space-x-2">
                  <span>🏄‍♂️</span>
                  <span>Alojamientos en El Sunzal</span>
                  <Badge variant="secondary">
                    {
                      filteredAccommodations.filter(
                        (acc) => acc.location === "el-sunzal",
                      ).length
                    }
                  </Badge>
                </CardTitle>
                <CardDescription>
                  Apartamentos, casas y suites frente al mar
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="text-center py-8">
                    Cargando alojamientos...
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Alojamiento</TableHead>
                        <TableHead>Tipo</TableHead>
                        <TableHead>Capacidad</TableHead>
                        <TableHead>Vista</TableHead>
                        <TableHead>Precios</TableHead>
                        <TableHead>Estado</TableHead>
                        <TableHead>Acciones</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredAccommodations
                        .filter((acc) => acc.location === "el-sunzal")
                        .map((accommodation) => {
                          const TypeIcon = getTypeIcon(accommodation.type);
                          return (
                            <TableRow key={accommodation.id}>
                              <TableCell>
                                <div className="space-y-1">
                                  <div className="flex items-center space-x-2">
                                    <TypeIcon className="h-4 w-4 text-gray-500" />
                                    <p className="font-medium">
                                      {accommodation.name}
                                    </p>
                                  </div>
                                  <p className="text-sm text-gray-500 line-clamp-1">
                                    {accommodation.description}
                                  </p>
                                </div>
                              </TableCell>
                              <TableCell>
                                <Badge variant="outline">
                                  {getTypeName(accommodation.type)}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center space-x-1">
                                  <Users className="h-4 w-4 text-gray-500" />
                                  <span>{accommodation.capacity}</span>
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center space-x-1">
                                  <Eye className="h-3 w-3 text-gray-500" />
                                  <span className="text-sm">
                                    {accommodation.view || "No especificada"}
                                  </span>
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="space-y-1 text-sm">
                                  <p>
                                    Sem: ${accommodation.pricing.weekday} • $
                                    {accommodation.pricing.weekend}
                                  </p>
                                  <p className="text-gray-500">
                                    Fest: ${accommodation.pricing.holiday}
                                  </p>
                                </div>
                              </TableCell>
                              <TableCell>
                                <Badge
                                  variant={
                                    accommodation.available
                                      ? "default"
                                      : "destructive"
                                  }
                                >
                                  {accommodation.available
                                    ? "Disponible"
                                    : "No disponible"}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center space-x-2">
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() =>
                                      openViewDialog(accommodation)
                                    }
                                  >
                                    <Eye className="h-3 w-3 mr-1" />
                                    Ver
                                  </Button>
                                  {canManageAccommodations && (
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() =>
                                        openEditDialog(accommodation)
                                      }
                                    >
                                      <Edit className="h-3 w-3 mr-1" />
                                      Editar
                                    </Button>
                                  )}
                                </div>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="corinto" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center space-x-2">
                  <span>🏞️</span>
                  <span>Alojamientos en Corinto</span>
                  <Badge variant="secondary">
                    {
                      filteredAccommodations.filter(
                        (acc) => acc.location === "corinto",
                      ).length
                    }
                  </Badge>
                </CardTitle>
                <CardDescription>
                  Casas familiares junto al lago de Ilopango
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="text-center py-8">
                    Cargando alojamientos...
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Alojamiento</TableHead>
                        <TableHead>Tipo</TableHead>
                        <TableHead>Capacidad</TableHead>
                        <TableHead>Vista</TableHead>
                        <TableHead>Precios</TableHead>
                        <TableHead>Estado</TableHead>
                        <TableHead>Acciones</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredAccommodations
                        .filter((acc) => acc.location === "corinto")
                        .map((accommodation) => {
                          const TypeIcon = getTypeIcon(accommodation.type);
                          return (
                            <TableRow key={accommodation.id}>
                              <TableCell>
                                <div className="space-y-1">
                                  <div className="flex items-center space-x-2">
                                    <TypeIcon className="h-4 w-4 text-gray-500" />
                                    <p className="font-medium">
                                      {accommodation.name}
                                    </p>
                                  </div>
                                  <p className="text-sm text-gray-500 line-clamp-1">
                                    {accommodation.description}
                                  </p>
                                </div>
                              </TableCell>
                              <TableCell>
                                <Badge variant="outline">
                                  {getTypeName(accommodation.type)}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center space-x-1">
                                  <Users className="h-4 w-4 text-gray-500" />
                                  <span>{accommodation.capacity}</span>
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center space-x-1">
                                  <Eye className="h-3 w-3 text-gray-500" />
                                  <span className="text-sm">
                                    {accommodation.view || "No especificada"}
                                  </span>
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="space-y-1 text-sm">
                                  <p>
                                    Sem: ${accommodation.pricing.weekday} • $
                                    {accommodation.pricing.weekend}
                                  </p>
                                  <p className="text-gray-500">
                                    Fest: ${accommodation.pricing.holiday}
                                  </p>
                                </div>
                              </TableCell>
                              <TableCell>
                                <Badge
                                  variant={
                                    accommodation.available
                                      ? "default"
                                      : "destructive"
                                  }
                                >
                                  {accommodation.available
                                    ? "Disponible"
                                    : "No disponible"}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center space-x-2">
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() =>
                                      openViewDialog(accommodation)
                                    }
                                  >
                                    <Eye className="h-3 w-3 mr-1" />
                                    Ver
                                  </Button>
                                  {canManageAccommodations && (
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() =>
                                        openEditDialog(accommodation)
                                      }
                                    >
                                      <Edit className="h-3 w-3 mr-1" />
                                      Editar
                                    </Button>
                                  )}
                                </div>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* View Accommodation Dialog */}
        <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center space-x-2">
                {selectedAccommodation && (
                  <>
                    {(() => {
                      const TypeIcon = getTypeIcon(selectedAccommodation.type);
                      return <TypeIcon className="h-5 w-5" />;
                    })()}
                    <span>{selectedAccommodation.name}</span>
                    <Badge variant="outline">
                      {getLocationName(selectedAccommodation.location)}
                    </Badge>
                  </>
                )}
              </DialogTitle>
              <DialogDescription>
                Información completa del alojamiento
              </DialogDescription>
            </DialogHeader>
            {selectedAccommodation && (
              <div className="space-y-6">
                {/* Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label className="text-sm font-medium text-gray-500">
                        Descripción
                      </Label>
                      <p className="text-sm mt-1">
                        {selectedAccommodation.description}
                      </p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm font-medium text-gray-500">
                          Capacidad
                        </Label>
                        <div className="flex items-center space-x-1 mt-1">
                          <Users className="h-4 w-4 text-gray-500" />
                          <span>{selectedAccommodation.capacity} personas</span>
                        </div>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-500">
                          Vista
                        </Label>
                        <div className="flex items-center space-x-1 mt-1">
                          <Eye className="h-4 w-4 text-gray-500" />
                          <span>
                            {selectedAccommodation.view || "No especificada"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Pricing */}
                  <div className="space-y-4">
                    <Label className="text-sm font-medium text-gray-500">
                      Precios por Noche
                    </Label>
                    <div className="grid grid-cols-3 gap-3">
                      <div className="bg-blue-50 p-3 rounded-lg text-center">
                        <p className="text-xs text-gray-600">Lun - Jue</p>
                        <p className="text-lg font-bold text-blue-600">
                          ${selectedAccommodation.pricing.weekday}
                        </p>
                      </div>
                      <div className="bg-green-50 p-3 rounded-lg text-center">
                        <p className="text-xs text-gray-600">Vie - Dom</p>
                        <p className="text-lg font-bold text-green-600">
                          ${selectedAccommodation.pricing.weekend}
                        </p>
                      </div>
                      <div className="bg-orange-50 p-3 rounded-lg text-center">
                        <p className="text-xs text-gray-600">Festivos</p>
                        <p className="text-lg font-bold text-orange-600">
                          ${selectedAccommodation.pricing.holiday}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Amenities */}
                <div>
                  <Label className="text-sm font-medium text-gray-500">
                    Amenidades
                  </Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-2">
                    {selectedAccommodation.amenities.map((amenity, index) => {
                      const Icon = amenityIcons[amenity] || Star;
                      return (
                        <div
                          key={index}
                          className="flex items-center space-x-2 p-2 bg-gray-50 rounded-lg"
                        >
                          <Icon className="h-4 w-4 text-gray-600" />
                          <span className="text-sm">{amenity}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Images */}
                <div>
                  <Label className="text-sm font-medium text-gray-500">
                    Imágenes
                  </Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-2">
                    {selectedAccommodation.images?.map((image, index) => (
                      <div key={index} className="relative">
                        <img
                          src={image}
                          alt={`${selectedAccommodation.name} ${index + 1}`}
                          className="w-full h-32 object-cover rounded-lg border"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src =
                              "/placeholder.svg";
                          }}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Edit Accommodation Dialog */}
        {canManageAccommodations && (
          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Editar Alojamiento</DialogTitle>
                <DialogDescription>
                  Actualiza la información, precios e imágenes del alojamiento
                </DialogDescription>
              </DialogHeader>
              {selectedAccommodation && (
                <Tabs defaultValue="general" className="w-full">
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="general">General</TabsTrigger>
                    <TabsTrigger value="pricing">Precios</TabsTrigger>
                    <TabsTrigger value="amenities">Amenidades</TabsTrigger>
                    {canManageImages && (
                      <TabsTrigger value="images">Imágenes</TabsTrigger>
                    )}
                  </TabsList>

                  <TabsContent value="general" className="space-y-4">
                    <div>
                      <Label htmlFor="name">Nombre</Label>
                      <Input
                        id="name"
                        value={editForm.name || ""}
                        onChange={(e) =>
                          setEditForm({ ...editForm, name: e.target.value })
                        }
                        disabled={!canEditContent}
                      />
                    </div>
                    <div>
                      <Label htmlFor="description">Descripción</Label>
                      <Textarea
                        id="description"
                        rows={4}
                        value={editForm.description || ""}
                        onChange={(e) =>
                          setEditForm({
                            ...editForm,
                            description: e.target.value,
                          })
                        }
                        disabled={!canEditContent}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="capacity">Capacidad</Label>
                        <Input
                          id="capacity"
                          type="number"
                          min="1"
                          max="12"
                          value={editForm.capacity || 1}
                          onChange={(e) =>
                            setEditForm({
                              ...editForm,
                              capacity: parseInt(e.target.value),
                            })
                          }
                        />
                      </div>
                      <div>
                        <Label htmlFor="view">Vista</Label>
                        <Input
                          id="view"
                          value={editForm.view || ""}
                          onChange={(e) =>
                            setEditForm({ ...editForm, view: e.target.value })
                          }
                          placeholder="Ej: Vista al mar, Vista lago..."
                          disabled={!canEditContent}
                        />
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="available"
                        checked={editForm.available || false}
                        onCheckedChange={(checked) =>
                          setEditForm({ ...editForm, available: checked })
                        }
                      />
                      <Label htmlFor="available">
                        Disponible para reservas
                      </Label>
                    </div>
                  </TabsContent>

                  <TabsContent value="pricing" className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="weekday-price">
                          Precio Entre Semana ($)
                        </Label>
                        <Input
                          id="weekday-price"
                          type="number"
                          value={editForm.pricing?.weekday || 0}
                          onChange={(e) =>
                            setEditForm({
                              ...editForm,
                              pricing: {
                                ...editForm.pricing!,
                                weekday: parseFloat(e.target.value),
                              },
                            })
                          }
                        />
                      </div>
                      <div>
                        <Label htmlFor="weekend-price">
                          Precio Fin de Semana ($)
                        </Label>
                        <Input
                          id="weekend-price"
                          type="number"
                          value={editForm.pricing?.weekend || 0}
                          onChange={(e) =>
                            setEditForm({
                              ...editForm,
                              pricing: {
                                ...editForm.pricing!,
                                weekend: parseFloat(e.target.value),
                              },
                            })
                          }
                        />
                      </div>
                      <div>
                        <Label htmlFor="holiday-price">
                          Precio Festivo ($)
                        </Label>
                        <Input
                          id="holiday-price"
                          type="number"
                          value={editForm.pricing?.holiday || 0}
                          onChange={(e) =>
                            setEditForm({
                              ...editForm,
                              pricing: {
                                ...editForm.pricing!,
                                holiday: parseFloat(e.target.value),
                              },
                            })
                          }
                        />
                      </div>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-medium mb-2">
                        Vista Previa de Precios
                      </h4>
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div className="text-center">
                          <p className="text-gray-600">Lun - Jue</p>
                          <p className="font-bold text-blue-600">
                            ${editForm.pricing?.weekday || 0}
                          </p>
                        </div>
                        <div className="text-center">
                          <p className="text-gray-600">Vie - Dom</p>
                          <p className="font-bold text-green-600">
                            ${editForm.pricing?.weekend || 0}
                          </p>
                        </div>
                        <div className="text-center">
                          <p className="text-gray-600">Festivos</p>
                          <p className="font-bold text-orange-600">
                            ${editForm.pricing?.holiday || 0}
                          </p>
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="amenities" className="space-y-4">
                    <div>
                      <Label>Amenidades Disponibles</Label>
                      <div className="grid grid-cols-2 gap-2 mt-2">
                        {[
                          "Wi-Fi",
                          "Aire acondicionado",
                          "TV",
                          "TV Premium",
                          "Cocina equipada",
                          "Cocina completa",
                          "Cocina gourmet",
                          "Kitchenette",
                          "Minibar",
                          "Balcón",
                          "Balcón privado",
                          "Terraza",
                          "Jardín",
                          "Jardín privado",
                          "BBQ",
                          "Estacionamiento",
                          "Servicio de limpieza",
                          "Room service",
                          "Vista al mar",
                          "Jacuzzi",
                          "Jacuzzi exterior",
                          "Ducha exterior",
                          "Almacenamiento para tablas",
                          "Sala de juegos",
                          "Hamacas",
                          "Terraza multinivel",
                        ].map((amenity) => (
                          <div
                            key={amenity}
                            className="flex items-center space-x-2"
                          >
                            <input
                              type="checkbox"
                              id={amenity}
                              checked={editForm.amenities?.includes(amenity)}
                              onChange={(e) => {
                                const amenities = editForm.amenities || [];
                                if (e.target.checked) {
                                  setEditForm({
                                    ...editForm,
                                    amenities: [...amenities, amenity],
                                  });
                                } else {
                                  setEditForm({
                                    ...editForm,
                                    amenities: amenities.filter(
                                      (a) => a !== amenity,
                                    ),
                                  });
                                }
                              }}
                              className="rounded"
                              disabled={!canEditContent}
                            />
                            <Label htmlFor={amenity} className="text-sm">
                              {amenity}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </TabsContent>

                  {canManageImages && (
                    <TabsContent value="images" className="space-y-4">
                      <div>
                        <Label>Imágenes Actuales</Label>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-2">
                          {selectedAccommodation.images?.map((image, index) => (
                            <div key={index} className="relative">
                              <img
                                src={image}
                                alt={`${selectedAccommodation.name} ${index + 1}`}
                                className="w-full h-32 object-cover rounded-lg border"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src =
                                    "/placeholder.svg";
                                }}
                              />
                              <Button
                                size="sm"
                                variant="destructive"
                                className="absolute top-2 right-2"
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="new-images">
                          Subir Nuevas Imágenes
                        </Label>
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                          <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                          <p className="text-sm text-gray-600">
                            Arrastra imágenes aquí o haz clic para seleccionar
                          </p>
                          <Input
                            id="new-images"
                            type="file"
                            multiple
                            accept="image/*"
                            className="hidden"
                          />
                          <Button variant="outline" className="mt-2">
                            <Camera className="mr-2 h-4 w-4" />
                            Seleccionar Archivos
                          </Button>
                        </div>
                      </div>
                    </TabsContent>
                  )}
                </Tabs>
              )}
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsEditDialogOpen(false)}
                >
                  Cancelar
                </Button>
                <Button onClick={handleUpdateAccommodation}>
                  <Save className="w-4 h-4 mr-2" />
                  Guardar Cambios
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}

        {/* New Accommodation Dialog */}
        {canManageAccommodations && (
          <Dialog
            open={isNewAccommodationDialogOpen}
            onOpenChange={setIsNewAccommodationDialogOpen}
          >
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Nuevo Alojamiento</DialogTitle>
                <DialogDescription>
                  Crear un nuevo alojamiento en el sistema
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="new-name">Nombre del Alojamiento</Label>
                    <Input id="new-name" placeholder="Ej: Apartamento 4A" />
                  </div>
                  <div>
                    <Label htmlFor="new-location">Ubicación</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona ubicación" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="el-sunzal">El Sunzal</SelectItem>
                        <SelectItem value="corinto">Corinto</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="new-type">Tipo</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="apartamento">Apartamento</SelectItem>
                        <SelectItem value="casa">Casa</SelectItem>
                        <SelectItem value="suite">Suite</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="new-capacity">Capacidad</Label>
                    <Input
                      id="new-capacity"
                      type="number"
                      placeholder="Número de personas"
                      min="1"
                      max="12"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="new-description">Descripción</Label>
                  <Textarea
                    id="new-description"
                    placeholder="Describe las características del alojamiento..."
                    rows={3}
                  />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="new-weekday-price">
                      Precio Entre Semana ($)
                    </Label>
                    <Input
                      id="new-weekday-price"
                      type="number"
                      placeholder="100"
                    />
                  </div>
                  <div>
                    <Label htmlFor="new-weekend-price">
                      Precio Fin de Semana ($)
                    </Label>
                    <Input
                      id="new-weekend-price"
                      type="number"
                      placeholder="200"
                    />
                  </div>
                  <div>
                    <Label htmlFor="new-holiday-price">
                      Precio Festivo ($)
                    </Label>
                    <Input
                      id="new-holiday-price"
                      type="number"
                      placeholder="250"
                    />
                  </div>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-blue-700">
                    <strong>Nota:</strong> Una vez creado el alojamiento, podrás
                    añadir amenidades e imágenes desde la opción "Editar".
                  </p>
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsNewAccommodationDialogOpen(false)}
                >
                  Cancelar
                </Button>
                <Button
                  onClick={() => {
                    toast({
                      title: "Alojamiento creado",
                      description:
                        "El nuevo alojamiento ha sido agregado al sistema.",
                    });
                    setIsNewAccommodationDialogOpen(false);
                  }}
                >
                  <Save className="w-4 h-4 mr-2" />
                  Crear Alojamiento
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminAccommodations;
