import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  History,
  Search,
  Download,
  Calendar,
  Filter,
  QrCode,
  CreditCard,
  Camera,
  User,
  Users,
  Clock,
  CheckCircle,
  RefreshCw,
} from "lucide-react";
import {
  AccessRecord,
  accessControlService,
} from "@/lib/access-control-service";

const AccessHistory = () => {
  const [accessHistory, setAccessHistory] = useState<AccessRecord[]>([]);
  const [filteredHistory, setFilteredHistory] = useState<AccessRecord[]>([]);
  const [loading, setLoading] = useState(true);

  // Filtros
  const [searchTerm, setSearchTerm] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [methodFilter, setMethodFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    loadHistory();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [accessHistory, searchTerm, dateFilter, methodFilter, statusFilter]);

  const loadHistory = () => {
    setLoading(true);
    try {
      const history = accessControlService.getAccessHistory(100);
      setAccessHistory(history);
    } catch (error) {
      console.error("Error loading access history:", error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...accessHistory];

    // Filtro de búsqueda por nombre o código
    if (searchTerm.trim()) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (record) =>
          record.memberName.toLowerCase().includes(search) ||
          record.memberCode.toLowerCase().includes(search),
      );
    }

    // Filtro por fecha
    if (dateFilter) {
      const targetDate = new Date(dateFilter);
      filtered = filtered.filter((record) => {
        const recordDate = new Date(record.accessTime);
        return recordDate.toDateString() === targetDate.toDateString();
      });
    }

    // Filtro por método de detección
    if (methodFilter !== "all") {
      filtered = filtered.filter(
        (record) => record.detectionMethod === methodFilter,
      );
    }

    // Filtro por estado
    if (statusFilter !== "all") {
      filtered = filtered.filter((record) => record.status === statusFilter);
    }

    setFilteredHistory(filtered);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setDateFilter("");
    setMethodFilter("all");
    setStatusFilter("all");
  };

  const exportData = () => {
    // Simular exportación de datos
    const data = filteredHistory.map((record) => ({
      Fecha: record.accessTime.toLocaleDateString(),
      Hora: record.accessTime.toLocaleTimeString(),
      Miembro: record.memberName,
      Código: record.memberCode,
      Acompañantes: record.companionsCount,
      Método: record.detectionMethod,
      Estado: record.status,
      Portero: record.gateKeeperName,
      Ubicación: record.location,
      Notas: record.notes || "",
    }));

    console.log("Exporting data:", data);
    // En una implementación real, aquí se generaría y descargaría un archivo CSV/Excel
    alert("Funcionalidad de exportación simulada. Ver consola para datos.");
  };

  const getMethodIcon = (method: string) => {
    switch (method) {
      case "qr":
        return <QrCode className="w-4 h-4" />;
      case "card":
        return <CreditCard className="w-4 h-4" />;
      case "camera":
        return <Camera className="w-4 h-4" />;
      case "manual":
        return <User className="w-4 h-4" />;
      default:
        return <User className="w-4 h-4" />;
    }
  };

  const getMethodName = (method: string) => {
    switch (method) {
      case "qr":
        return "QR";
      case "card":
        return "Tarjeta";
      case "camera":
        return "Cámara";
      case "manual":
        return "Manual";
      default:
        return method;
    }
  };

  const getStatusBadge = (status: string) => {
    if (status === "completed") {
      return (
        <Badge className="bg-green-100 text-green-800">
          <CheckCircle className="w-3 h-3 mr-1" />
          Completado
        </Badge>
      );
    }
    return (
      <Badge variant="outline" className="text-orange-600 border-orange-600">
        <Clock className="w-3 h-3 mr-1" />
        Activo
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Filter className="w-5 h-5" />
            <span>Filtros de Búsqueda</span>
          </CardTitle>
          <CardDescription>
            Filtra el historial de accesos por diferentes criterios
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="space-y-2">
              <Label htmlFor="search">Buscar</Label>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                <Input
                  id="search"
                  placeholder="Nombre o código..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>

            {/* Date */}
            <div className="space-y-2">
              <Label htmlFor="date">Fecha</Label>
              <Input
                id="date"
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
              />
            </div>

            {/* Method */}
            <div className="space-y-2">
              <Label>Método de Detección</Label>
              <Select value={methodFilter} onValueChange={setMethodFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos los métodos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los métodos</SelectItem>
                  <SelectItem value="qr">Código QR</SelectItem>
                  <SelectItem value="card">Tarjeta</SelectItem>
                  <SelectItem value="camera">Cámara</SelectItem>
                  <SelectItem value="manual">Manual</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Status */}
            <div className="space-y-2">
              <Label>Estado</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos los estados" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los estados</SelectItem>
                  <SelectItem value="active">Activo</SelectItem>
                  <SelectItem value="completed">Completado</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-between items-center mt-4">
            <Button variant="outline" onClick={clearFilters}>
              Limpiar Filtros
            </Button>
            <div className="flex space-x-2">
              <Button variant="outline" onClick={loadHistory}>
                <RefreshCw className="w-4 h-4 mr-2" />
                Actualizar
              </Button>
              <Button variant="outline" onClick={exportData}>
                <Download className="w-4 h-4 mr-2" />
                Exportar
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <History className="w-5 h-5" />
              <span>Historial de Accesos</span>
            </div>
            <Badge variant="outline">{filteredHistory.length} registros</Badge>
          </CardTitle>
          <CardDescription>
            {filteredHistory.length === accessHistory.length
              ? "Mostrando todos los registros"
              : `Mostrando ${filteredHistory.length} de ${accessHistory.length} registros`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Cargando historial...</p>
            </div>
          ) : filteredHistory.length === 0 ? (
            <div className="text-center py-8">
              <History className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No se encontraron registros
              </h3>
              <p className="text-gray-600">
                Intenta ajustar los filtros de búsqueda
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Miembro</TableHead>
                    <TableHead>Fecha/Hora</TableHead>
                    <TableHead>Método</TableHead>
                    <TableHead>Acompañantes</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Portero</TableHead>
                    <TableHead>Notas</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredHistory.map((record) => (
                    <TableRow key={record.id}>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          {record.memberPhoto && (
                            <img
                              src={record.memberPhoto}
                              alt={record.memberName}
                              className="w-8 h-8 rounded-full object-cover"
                            />
                          )}
                          <div>
                            <div className="font-medium">
                              {record.memberName}
                            </div>
                            <div className="text-sm text-gray-500">
                              {record.memberCode} • {record.membershipType}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">
                            {record.accessTime.toLocaleDateString()}
                          </div>
                          <div className="text-sm text-gray-500">
                            {record.accessTime.toLocaleTimeString()}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="flex items-center">
                          {getMethodIcon(record.detectionMethod)}
                          <span className="ml-1">
                            {getMethodName(record.detectionMethod)}
                          </span>
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-1">
                          <Users className="w-4 h-4 text-gray-400" />
                          <span>{record.companionsCount}</span>
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(record.status)}</TableCell>
                      <TableCell>
                        <div className="text-sm">{record.gateKeeperName}</div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm text-gray-600 max-w-xs truncate">
                          {record.notes || "-"}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AccessHistory;
