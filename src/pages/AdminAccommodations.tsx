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
} from "lucide-react";
import AdminLayout from "@/components/AdminLayout";
import {
  apiGetAccommodations,
  apiUpdateAccommodation,
  Accommodation,
} from "@/lib/api-service";

const AdminAccommodations = () => {
  const [accommodations, setAccommodations] = useState<Accommodation[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [locationFilter, setLocationFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [selectedAccommodation, setSelectedAccommodation] =
    useState<Accommodation | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editForm, setEditForm] = useState<Partial<Accommodation>>({});

  useEffect(() => {
    loadAccommodations();
  }, []);

  const loadAccommodations = async () => {
    try {
      setLoading(true);
      const response = await apiGetAccommodations();
      setAccommodations(response.accommodations);
    } catch (error) {
      console.error("Error loading accommodations:", error);
      setAccommodations(getMockAccommodations());
    } finally {
      setLoading(false);
    }
  };

  const getMockAccommodations = (): Accommodation[] => [
    {
      id: "1A",
      name: "Apartamento 1A",
      type: "apartamento",
      location: "el-sunzal",
      capacity: 2,
      description:
        "Acogedor apartamento con vista parcial al mar. Ubicado en el primer piso con fácil acceso.",
      amenities: ["Wi-Fi", "Aire acondicionado", "TV", "Cocina equipada"],
      pricing: {
        weekday: 110,
        weekend: 230,
        holiday: 280,
      },
      images: [
        "/images/apartamentos/1a-1.jpg",
        "/images/apartamentos/1a-2.jpg",
      ],
      available: true,
    },
    {
      id: "suite-1",
      name: "Suite Premium 1",
      type: "suite",
      location: "el-sunzal",
      capacity: 2,
      description:
        "Suite de lujo con vista panorámica al océano Pacífico. Decoración elegante y servicios premium.",
      amenities: [
        "Wi-Fi",
        "Aire acondicionado",
        "TV",
        "Minibar",
        "Balcón privado",
        "Servicio de limpieza",
      ],
      pricing: {
        weekday: 180,
        weekend: 320,
        holiday: 420,
      },
      images: ["/images/suites/suite-1-1.jpg", "/images/suites/suite-1-2.jpg"],
      available: true,
    },
    {
      id: "casa-1",
      name: "Casa Familiar 1",
      type: "casa",
      location: "el-sunzal",
      capacity: 6,
      description:
        "Espaciosa casa familiar con amplio jardín y área de BBQ. Perfecta para grupos grandes.",
      amenities: [
        "Wi-Fi",
        "Aire acondicionado",
        "TV",
        "Cocina completa",
        "Jardín",
        "BBQ",
        "Estacionamiento",
      ],
      pricing: {
        weekday: 250,
        weekend: 450,
        holiday: 550,
      },
      images: ["/images/casas/casa-1-1.jpg", "/images/casas/casa-1-2.jpg"],
      available: true,
    },
    {
      id: "corinto-casa-1",
      name: "Casa Corinto 1",
      type: "casa",
      location: "corinto",
      capacity: 4,
      description:
        "Casa moderna en Corinto con vista al lago. Ambiente tranquilo y relajante.",
      amenities: [
        "Wi-Fi",
        "Aire acondicionado",
        "TV",
        "Cocina equipada",
        "Terraza",
      ],
      pricing: {
        weekday: 140,
        weekend: 280,
        holiday: 350,
      },
      images: ["/images/corinto/casa-1-1.jpg", "/images/corinto/casa-1-2.jpg"],
      available: false,
    },
  ];

  const handleUpdateAccommodation = async () => {
    if (!selectedAccommodation) return;

    try {
      await apiUpdateAccommodation(selectedAccommodation.id, editForm);
      toast({
        title: "Alojamiento actualizado",
        description: "Los cambios han sido guardados exitosamente.",
      });
      setIsEditDialogOpen(false);
      setSelectedAccommodation(null);
      setEditForm({});
      loadAccommodations();
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo actualizar el alojamiento.",
        variant: "destructive",
      });
    }
  };

  const filteredAccommodations = (accommodations || []).filter(
    (accommodation) => {
      const matchesSearch = accommodation.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesLocation =
        locationFilter === "all" || accommodation.location === locationFilter;
      const matchesType =
        typeFilter === "all" || accommodation.type === typeFilter;

      return matchesSearch && matchesLocation && matchesType;
    },
  );

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

  const amenityIcons: Record<string, any> = {
    "Wi-Fi": Wifi,
    "Aire acondicionado": Wind,
    TV: Tv,
    Estacionamiento: Car,
    Cocina: Coffee,
  };

  const openEditDialog = (accommodation: Accommodation) => {
    setSelectedAccommodation(accommodation);
    setEditForm({
      name: accommodation.name,
      description: accommodation.description,
      capacity: accommodation.capacity,
      pricing: { ...accommodation.pricing },
      amenities: [...accommodation.amenities],
      available: accommodation.available,
    });
    setIsEditDialogOpen(true);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Gestión de Alojamientos</h1>
            <p className="text-gray-600">
              Administra información, precios e imágenes de los alojamientos
            </p>
          </div>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Nuevo Alojamiento
          </Button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                Total Alojamientos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {accommodations?.length || 0}
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
              <div className="text-2xl font-bold text-blue-600">
                {
                  (accommodations || []).filter(
                    (a) => a.location === "el-sunzal",
                  ).length
                }
              </div>
              <p className="text-xs text-muted-foreground">
                Apartamentos, casas y suites
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Corinto</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {
                  (accommodations || []).filter((a) => a.location === "corinto")
                    .length
                }
              </div>
              <p className="text-xs text-muted-foreground">
                Casas y apartamentos
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Disponibles</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-emerald-600">
                {(accommodations || []).filter((a) => a.available).length}
              </div>
              <p className="text-xs text-muted-foreground">
                Listos para reservar
              </p>
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
                    placeholder="Buscar por nombre..."
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
                    <SelectValue placeholder="Todas las ubicaciones" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas las ubicaciones</SelectItem>
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

        {/* Accommodations Table */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              Lista de Alojamientos ({filteredAccommodations.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">Cargando alojamientos...</div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Alojamiento</TableHead>
                    <TableHead>Ubicación/Tipo</TableHead>
                    <TableHead>Capacidad</TableHead>
                    <TableHead>Precios</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAccommodations.map((accommodation) => (
                    <TableRow key={accommodation.id}>
                      <TableCell>
                        <div className="space-y-1">
                          <p className="font-medium">{accommodation.name}</p>
                          <p className="text-sm text-gray-500 line-clamp-2">
                            {accommodation.description}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <p className="text-sm">
                            {getLocationName(accommodation.location)}
                          </p>
                          <Badge variant="outline">
                            {getTypeName(accommodation.type)}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-1">
                          <Users className="h-4 w-4 text-gray-500" />
                          <span>{accommodation.capacity}</span>
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
                            accommodation.available ? "default" : "destructive"
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
                            onClick={() => openEditDialog(accommodation)}
                          >
                            <Edit className="h-3 w-3 mr-1" />
                            Editar
                          </Button>
                          <Button size="sm" variant="outline">
                            <Eye className="h-3 w-3 mr-1" />
                            Ver
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Edit Accommodation Dialog */}
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
                  <TabsTrigger value="images">Imágenes</TabsTrigger>
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
                    />
                  </div>
                  <div>
                    <Label htmlFor="capacity">Capacidad</Label>
                    <Input
                      id="capacity"
                      type="number"
                      min="1"
                      max="10"
                      value={editForm.capacity || 1}
                      onChange={(e) =>
                        setEditForm({
                          ...editForm,
                          capacity: parseInt(e.target.value),
                        })
                      }
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="available"
                      checked={editForm.available || false}
                      onCheckedChange={(checked) =>
                        setEditForm({ ...editForm, available: checked })
                      }
                    />
                    <Label htmlFor="available">Disponible para reservas</Label>
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
                      <Label htmlFor="holiday-price">Precio Festivo ($)</Label>
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
                      <div>
                        <p className="text-gray-600">Lun - Jue</p>
                        <p className="font-bold">
                          ${editForm.pricing?.weekday || 0}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-600">Vie - Dom</p>
                        <p className="font-bold">
                          ${editForm.pricing?.weekend || 0}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-600">Festivos</p>
                        <p className="font-bold">
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
                        "Cocina equipada",
                        "Minibar",
                        "Balcón privado",
                        "Jardín",
                        "BBQ",
                        "Estacionamiento",
                        "Servicio de limpieza",
                        "Vista al mar",
                        "Terraza",
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
                          />
                          <Label htmlFor={amenity} className="text-sm">
                            {amenity}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                </TabsContent>

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
                    <Label htmlFor="new-images">Subir Nuevas Imágenes</Label>
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
                        Seleccionar Archivos
                      </Button>
                    </div>
                  </div>
                </TabsContent>
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
                Guardar Cambios
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default AdminAccommodations;
