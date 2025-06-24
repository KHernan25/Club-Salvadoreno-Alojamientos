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
import { toast } from "@/hooks/use-toast";
import {
  DollarSign,
  Edit,
  Save,
  Search,
  TrendingUp,
  MapPin,
  Calendar,
  Crown,
} from "lucide-react";
import AdminLayout from "@/components/AdminLayout";
import { isSuperAdmin, hasPermission } from "@/lib/auth-service";

interface PricingRule {
  id: string;
  accommodationId: string;
  accommodationType: string;
  location: "el-sunzal" | "corinto";
  weekdayPrice: number;
  weekendPrice: number;
  holidayPrice: number;
  lastUpdated: string;
  updatedBy: string;
}

const AdminPricing = () => {
  const [pricingRules, setPricingRules] = useState<PricingRule[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [locationFilter, setLocationFilter] = useState("all");
  const [selectedRule, setSelectedRule] = useState<PricingRule | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  useEffect(() => {
    loadPricingData();
  }, []);

  const loadPricingData = async () => {
    try {
      setLoading(true);
      // Mock pricing data - in real app would come from API
      setPricingRules(getMockPricingRules());
    } catch (error) {
      console.error("Error loading pricing data:", error);
    } finally {
      setLoading(false);
    }
  };

  const getMockPricingRules = (): PricingRule[] => [
    {
      id: "1",
      accommodationId: "1A",
      accommodationType: "Apartamento",
      location: "el-sunzal",
      weekdayPrice: 150,
      weekendPrice: 230,
      holidayPrice: 280,
      lastUpdated: "2024-01-15T10:30:00Z",
      updatedBy: "Super Admin",
    },
    {
      id: "2",
      accommodationId: "suite-1",
      accommodationType: "Suite Premium",
      location: "el-sunzal",
      weekdayPrice: 180,
      weekendPrice: 320,
      holidayPrice: 400,
      lastUpdated: "2024-01-15T10:30:00Z",
      updatedBy: "Super Admin",
    },
    {
      id: "3",
      accommodationId: "casa-1",
      accommodationType: "Casa Familiar",
      location: "el-sunzal",
      weekdayPrice: 250,
      weekendPrice: 450,
      holidayPrice: 550,
      lastUpdated: "2024-01-15T10:30:00Z",
      updatedBy: "Super Admin",
    },
    {
      id: "4",
      accommodationId: "corinto-apto-1",
      accommodationType: "Apartamento",
      location: "corinto",
      weekdayPrice: 120,
      weekendPrice: 200,
      holidayPrice: 250,
      lastUpdated: "2024-01-15T10:30:00Z",
      updatedBy: "Super Admin",
    },
    {
      id: "5",
      accommodationId: "corinto-casa-1",
      accommodationType: "Casa",
      location: "corinto",
      weekdayPrice: 200,
      weekendPrice: 350,
      holidayPrice: 420,
      lastUpdated: "2024-01-15T10:30:00Z",
      updatedBy: "Super Admin",
    },
  ];

  const handleUpdatePricing = async (
    ruleId: string,
    updates: Partial<PricingRule>,
  ) => {
    try {
      setPricingRules((prev) =>
        prev.map((rule) =>
          rule.id === ruleId
            ? { ...rule, ...updates, lastUpdated: new Date().toISOString() }
            : rule,
        ),
      );
      toast({
        title: "Precios actualizados",
        description: "Los cambios han sido guardados exitosamente.",
      });
      setIsEditDialogOpen(false);
      setSelectedRule(null);
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudieron actualizar los precios.",
        variant: "destructive",
      });
    }
  };

  const filteredRules = (pricingRules || []).filter((rule) => {
    const matchesSearch =
      rule.accommodationType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rule.accommodationId.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesLocation =
      locationFilter === "all" || rule.location === locationFilter;

    return matchesSearch && matchesLocation;
  });

  const getLocationName = (location: string) => {
    return location === "el-sunzal" ? "El Sunzal" : "Corinto";
  };

  const calculateAveragePrice = (rules: PricingRule[]) => {
    if (rules.length === 0) return 0;
    const total = rules.reduce((sum, rule) => sum + rule.weekdayPrice, 0);
    return Math.round(total / rules.length);
  };

  if (!hasPermission("canManagePricing")) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <h2 className="text-xl font-semibold mb-2">Acceso Denegado</h2>
            <p className="text-gray-600">
              No tienes permisos para gestionar precios.
            </p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-2xl font-bold">Gestión de Precios</h1>
              {isSuperAdmin() && <Crown className="h-5 w-5 text-blue-600" />}
            </div>
            <p className="text-gray-600">
              Administra los precios de todos los alojamientos
            </p>
          </div>
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
                {pricingRules?.length || 0}
              </div>
              <p className="text-xs text-muted-foreground">
                Con precios configurados
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
                  (pricingRules || []).filter((r) => r.location === "el-sunzal")
                    .length
                }
              </div>
              <p className="text-xs text-muted-foreground">Alojamientos</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Corinto</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {
                  (pricingRules || []).filter((r) => r.location === "corinto")
                    .length
                }
              </div>
              <p className="text-xs text-muted-foreground">Alojamientos</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                Precio Promedio
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-emerald-600">
                ${calculateAveragePrice(pricingRules || [])}
              </div>
              <p className="text-xs text-muted-foreground">Entre semana</p>
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
                    placeholder="Buscar por tipo o ID de alojamiento..."
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
                    <SelectItem value="el-sunzal">
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-4 w-4 text-blue-600" />
                        <span>El Sunzal</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="corinto">
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-4 w-4 text-green-600" />
                        <span>Corinto</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Pricing Table */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              Tarifas por Alojamiento ({filteredRules.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">Cargando precios...</div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Alojamiento</TableHead>
                    <TableHead>Ubicación</TableHead>
                    <TableHead>Entre Semana</TableHead>
                    <TableHead>Fin de Semana</TableHead>
                    <TableHead>Días Festivos</TableHead>
                    <TableHead>Última Actualización</TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRules.map((rule) => (
                    <TableRow key={rule.id}>
                      <TableCell>
                        <div className="space-y-1">
                          <p className="font-medium">
                            {rule.accommodationType}
                          </p>
                          <p className="text-sm text-gray-500">
                            ID: {rule.accommodationId}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <MapPin
                            className={`h-4 w-4 ${rule.location === "el-sunzal" ? "text-blue-600" : "text-green-600"}`}
                          />
                          <span>{getLocationName(rule.location)}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">${rule.weekdayPrice}</div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium text-orange-600">
                          ${rule.weekendPrice}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium text-red-600">
                          ${rule.holidayPrice}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1 text-sm">
                          <p>
                            {new Date(rule.lastUpdated).toLocaleDateString()}
                          </p>
                          <p className="text-gray-500">por {rule.updatedBy}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setSelectedRule(rule);
                            setIsEditDialogOpen(true);
                          }}
                          className="border-blue-600 text-blue-600 hover:bg-blue-50"
                        >
                          <Edit className="h-3 w-3 mr-1" />
                          Editar
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Edit Pricing Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center space-x-2">
                <DollarSign className="h-5 w-5 text-blue-600" />
                <span>Editar Precios</span>
              </DialogTitle>
              <DialogDescription>
                Modifica las tarifas para {selectedRule?.accommodationType}
              </DialogDescription>
            </DialogHeader>
            {selectedRule && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="weekday-price">Precio Entre Semana ($)</Label>
                  <Input
                    id="weekday-price"
                    type="number"
                    defaultValue={selectedRule.weekdayPrice}
                    min="0"
                    step="5"
                  />
                </div>
                <div>
                  <Label htmlFor="weekend-price">
                    Precio Fin de Semana ($)
                  </Label>
                  <Input
                    id="weekend-price"
                    type="number"
                    defaultValue={selectedRule.weekendPrice}
                    min="0"
                    step="5"
                  />
                </div>
                <div>
                  <Label htmlFor="holiday-price">
                    Precio Días Festivos ($)
                  </Label>
                  <Input
                    id="holiday-price"
                    type="number"
                    defaultValue={selectedRule.holidayPrice}
                    min="0"
                    step="5"
                  />
                </div>
                <div className="bg-blue-50 p-3 rounded-lg">
                  <div className="flex items-center space-x-2 text-sm text-blue-800">
                    <TrendingUp className="h-4 w-4" />
                    <span>Los cambios se aplicarán a futuras reservas</span>
                  </div>
                </div>
              </div>
            )}
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsEditDialogOpen(false)}
              >
                Cancelar
              </Button>
              <Button
                onClick={() =>
                  selectedRule && handleUpdatePricing(selectedRule.id, {})
                }
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Save className="h-4 w-4 mr-2" />
                Guardar Cambios
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default AdminPricing;
