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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "@/hooks/use-toast";
import {
  Search,
  Filter,
  UserPlus,
  Check,
  X,
  Edit,
  Users,
  Star,
  Crown,
  Heart,
  Award,
  Shield,
  Mail,
  Phone,
  Calendar,
  RefreshCw,
  Download,
  Eye,
} from "lucide-react";
import AdminLayout from "@/components/AdminLayout";
import {
  apiGetUsers,
  apiActivateUser,
  apiDeactivateUser,
  apiUpdateUser,
  type User,
} from "@/lib/api-service";
import {
  getCurrentUser,
  isSuperAdmin,
  hasPermission,
  requireAuth,
} from "@/lib/auth-service";
import { useLocation, useNavigate } from "react-router-dom";

// Tipos de membresía
const MEMBERSHIP_TYPES = {
  fundador: {
    label: "Fundador",
    icon: Crown,
    color: "text-yellow-600 border-yellow-600 bg-yellow-50",
    description: "Miembro fundador del club",
  },
  contribuyente: {
    label: "Contribuyente",
    icon: Star,
    color: "text-blue-600 border-blue-600 bg-blue-50",
    description: "Miembro contribuyente activo",
  },
  honorario: {
    label: "Honorario",
    icon: Award,
    color: "text-purple-600 border-purple-600 bg-purple-50",
    description: "Miembro con reconocimiento especial",
  },
  benefactor: {
    label: "Benefactor",
    icon: Heart,
    color: "text-green-600 border-green-600 bg-green-50",
    description: "Miembro benefactor del club",
  },
};

const MembersModule = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [members, setMembers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedMember, setSelectedMember] = useState<User | null>(null);
  const [showDetailDialog, setShowDetailDialog] = useState(false);
  const [activeTab, setActiveTab] = useState("todos");

  const currentUser = getCurrentUser();

  useEffect(() => {
    if (!requireAuth()) {
      console.log(
        "MembersModule: Not authenticated, redirecting to backoffice login",
      );
      navigate("/backoffice/login");
      return;
    }

    loadMembers();
  }, []); // Vacío para ejecutar solo una vez al montar

  // Verificación de superadmin por separado para evitar loops
  useEffect(() => {
    if (currentUser && currentUser.role === "super_admin") {
      navigate("/admin/users");
    }
  }, [currentUser, navigate]);

  const loadMembers = async () => {
    try {
      setLoading(true);
      // Intentar cargar desde API real
      const response = await apiGetUsers();

      // Filtrar solo miembros (no usuarios de backoffice)
      const membersOnly = response.filter((user) => user.role === "miembro");
      setMembers(membersOnly);
    } catch (error) {
      console.error("Error loading members:", error);
      // Cargar datos mock si la API no está disponible
      setMembers(getMockMembers());
    } finally {
      setLoading(false);
    }
  };

  const getMockMembers = (): User[] => [
    {
      id: "6",
      firstName: "María José",
      lastName: "González",
      email: "usuario1@email.com",
      username: "usuario1",
      phone: "+503 7234-5678",
      fullName: "María José González",
      role: "miembro",
      isActive: true,
      status: "approved",
      memberStatus: "activo",
      membershipType: "Contribuyente",
      createdAt: new Date("2024-02-01"),
    },
    {
      id: "7",
      firstName: "Carlos",
      lastName: "Rivera",
      email: "carlos.rivera@email.com",
      username: "carlos.rivera",
      phone: "+503 7234-5679",
      fullName: "Carlos Rivera",
      role: "miembro",
      isActive: true,
      status: "approved",
      memberStatus: "activo",
      membershipType: "Fundador",
      createdAt: new Date("2024-02-10"),
    },
    {
      id: "8",
      firstName: "Ana",
      lastName: "Martínez",
      email: "ana.martinez@email.com",
      username: "ana.martinez",
      phone: "+503 7234-5680",
      fullName: "Ana Martínez",
      role: "miembro",
      isActive: true,
      status: "approved",
      memberStatus: "en_mora",
      membershipType: "Honorario",
      createdAt: new Date("2024-02-15"),
    },
    {
      id: "9",
      firstName: "Juan",
      lastName: "Pérez",
      email: "juan.perez@email.com",
      username: "jperez",
      phone: "+503 7234-5681",
      fullName: "Juan Pérez",
      role: "miembro",
      isActive: false,
      status: "approved",
      memberStatus: "inactivo",
      membershipType: "Honorario",
      createdAt: new Date("2024-01-20"),
    },
    {
      id: "10",
      firstName: "Sofia",
      lastName: "López",
      email: "sofia.lopez@email.com",
      username: "sofia.lopez",
      phone: "+503 7234-5682",
      fullName: "Sofia López",
      role: "miembro",
      isActive: true,
      status: "pending",
      memberStatus: "activo",
      membershipType: "Contribuyente",
      createdAt: new Date("2024-03-01"),
    },
  ];

  // Filtrar miembros según la pestaña activa y búsqueda
  const filteredMembers = members.filter((member) => {
    const matchesSearch =
      member.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.phone?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || member.status === statusFilter;

    // Filtrar por pestaña
    let matchesTab = true;
    if (activeTab !== "todos") {
      matchesTab = member.membershipType === activeTab;
    }

    return matchesSearch && matchesStatus && matchesTab;
  });

  // Contadores para las pestañas
  const tabCounts = {
    todos: members.length,
    fundador: members.filter((m) => m.membershipType === "Fundador").length,
    contribuyente: members.filter((m) => m.membershipType === "Contribuyente")
      .length,
    honorario: members.filter((m) => m.membershipType === "Honorario").length,
    benefactor: members.filter((m) => m.membershipType === "Honorario").length,
  };

  const handleViewDetails = (member: User) => {
    setSelectedMember(member);
    setShowDetailDialog(true);
  };

  const getMembershipBadge = (membershipType: string) => {
    const type =
      MEMBERSHIP_TYPES[membershipType as keyof typeof MEMBERSHIP_TYPES];
    if (!type) return null;

    const Icon = type.icon;
    return (
      <Badge variant="outline" className={type.color}>
        <Icon className="w-3 h-3 mr-1" />
        {type.label}
      </Badge>
    );
  };

  const getStatusBadge = (member: User) => {
    if (member.status === "pending") {
      return (
        <Badge variant="outline" className="text-yellow-600 border-yellow-600">
          Pendiente
        </Badge>
      );
    }

    if (member.status === "approved") {
      if (member.memberStatus === "activo") {
        return (
          <Badge variant="default" className="bg-green-600">
            Activo
          </Badge>
        );
      } else if (member.memberStatus === "en_mora") {
        return (
          <Badge
            variant="outline"
            className="text-orange-600 border-orange-600"
          >
            En Mora
          </Badge>
        );
      } else if (member.memberStatus === "inactivo") {
        return (
          <Badge variant="outline" className="text-gray-600 border-gray-600">
            Inactivo
          </Badge>
        );
      }
    }

    return <Badge variant="destructive">Rechazado</Badge>;
  };

  if (!currentUser) {
    return null;
  }

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Cargando miembros...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-white/20 rounded-lg backdrop-blur-sm">
                <Users className="h-8 w-8" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">Gestión de Miembros</h1>
                <p className="text-blue-100 mt-1">
                  Administra miembros del Club Salvadoreño
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Button
                onClick={loadMembers}
                variant="secondary"
                size="sm"
                className="bg-white/10 hover:bg-white/20 text-white border-white/20"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Actualizar
              </Button>
              <Badge variant="secondary" className="text-gray-800">
                <Users className="w-3 h-3 mr-1" />
                Total: {members.length}
              </Badge>
            </div>
          </div>
        </div>

        {/* Filtros */}
        <Card className="border-0 shadow-lg">
          <CardHeader className="bg-gray-50">
            <CardTitle className="flex items-center">
              <Filter className="w-5 h-5 mr-2 text-blue-600" />
              Filtros de Búsqueda
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="search">Buscar Miembro</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <Input
                    id="search"
                    placeholder="Nombre, email, teléfono..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="status-filter">Estado</Label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Todos los estados" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos los estados</SelectItem>
                    <SelectItem value="approved">Aprobados</SelectItem>
                    <SelectItem value="pending">Pendientes</SelectItem>
                    <SelectItem value="rejected">Rechazados</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-end">
                <Button
                  onClick={() => {
                    setSearchTerm("");
                    setStatusFilter("all");
                    setActiveTab("todos");
                  }}
                  variant="outline"
                  className="w-full"
                >
                  <Filter className="w-4 h-4 mr-2" />
                  Limpiar Filtros
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Pestañas por Tipo de Membresía */}
        <Card className="border-0 shadow-lg">
          <CardContent className="p-0">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-5 h-auto p-1">
                <TabsTrigger
                  value="todos"
                  className="flex flex-col space-y-1 h-16"
                >
                  <Users className="w-5 h-5" />
                  <span className="text-sm">Todos ({tabCounts.todos})</span>
                </TabsTrigger>
                <TabsTrigger
                  value="fundador"
                  className="flex flex-col space-y-1 h-16"
                >
                  <Crown className="w-5 h-5" />
                  <span className="text-sm">
                    Fundador ({tabCounts.fundador})
                  </span>
                </TabsTrigger>
                <TabsTrigger
                  value="contribuyente"
                  className="flex flex-col space-y-1 h-16"
                >
                  <Star className="w-5 h-5" />
                  <span className="text-sm">
                    Contribuyente ({tabCounts.contribuyente})
                  </span>
                </TabsTrigger>
                <TabsTrigger
                  value="honorario"
                  className="flex flex-col space-y-1 h-16"
                >
                  <Award className="w-5 h-5" />
                  <span className="text-sm">
                    Honorario ({tabCounts.honorario})
                  </span>
                </TabsTrigger>
                <TabsTrigger
                  value="benefactor"
                  className="flex flex-col space-y-1 h-16"
                >
                  <Heart className="w-5 h-5" />
                  <span className="text-sm">
                    Benefactor ({tabCounts.benefactor})
                  </span>
                </TabsTrigger>
              </TabsList>

              {/* Contenido de todas las pestañas */}
              {[
                "todos",
                "fundador",
                "contribuyente",
                "honorario",
                "benefactor",
              ].map((tabValue) => (
                <TabsContent key={tabValue} value={tabValue} className="mt-6">
                  <div className="space-y-4">
                    {/* Descripción de la pestaña */}
                    {tabValue !== "todos" && (
                      <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg p-4">
                        <div className="flex items-center space-x-3">
                          {MEMBERSHIP_TYPES[
                            tabValue as keyof typeof MEMBERSHIP_TYPES
                          ] &&
                            (() => {
                              const Icon =
                                MEMBERSHIP_TYPES[
                                  tabValue as keyof typeof MEMBERSHIP_TYPES
                                ].icon;
                              return <Icon className="w-6 h-6 text-gray-600" />;
                            })()}
                          <div>
                            <h3 className="font-semibold text-gray-900">
                              Miembros{" "}
                              {
                                MEMBERSHIP_TYPES[
                                  tabValue as keyof typeof MEMBERSHIP_TYPES
                                ]?.label
                              }
                            </h3>
                            <p className="text-sm text-gray-600">
                              {
                                MEMBERSHIP_TYPES[
                                  tabValue as keyof typeof MEMBERSHIP_TYPES
                                ]?.description
                              }
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Tabla de miembros */}
                    {filteredMembers.length === 0 ? (
                      <div className="text-center py-12">
                        <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                          No se encontraron miembros
                        </h3>
                        <p className="text-gray-600">
                          {searchTerm || statusFilter !== "all"
                            ? "Ajusta los filtros para ver más resultados"
                            : `No hay miembros ${tabValue !== "todos" ? `de tipo ${MEMBERSHIP_TYPES[tabValue as keyof typeof MEMBERSHIP_TYPES]?.label}` : ""} registrados`}
                        </p>
                      </div>
                    ) : (
                      <div className="overflow-x-auto">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Miembro</TableHead>
                              <TableHead>Contacto</TableHead>
                              <TableHead>Tipo de Membresía</TableHead>
                              <TableHead>Estado</TableHead>
                              <TableHead>Fecha de Registro</TableHead>
                              <TableHead className="text-right">
                                Acciones
                              </TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {filteredMembers.map((member) => (
                              <TableRow
                                key={member.id}
                                className="hover:bg-gray-50"
                              >
                                <TableCell>
                                  <div className="flex items-center space-x-3">
                                    <Avatar className="h-10 w-10">
                                      <AvatarImage
                                        src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${member.email}`}
                                      />
                                      <AvatarFallback>
                                        {member.firstName[0]}
                                        {member.lastName[0]}
                                      </AvatarFallback>
                                    </Avatar>
                                    <div>
                                      <p className="font-medium">
                                        {member.firstName} {member.lastName}
                                      </p>
                                      <p className="text-sm text-gray-500">
                                        @{member.username}
                                      </p>
                                    </div>
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <div className="space-y-1">
                                    <div className="flex items-center text-sm">
                                      <Mail className="w-3 h-3 mr-1 text-gray-400" />
                                      {member.email}
                                    </div>
                                    {member.phone && (
                                      <div className="flex items-center text-sm text-gray-500">
                                        <Phone className="w-3 h-3 mr-1 text-gray-400" />
                                        {member.phone}
                                      </div>
                                    )}
                                  </div>
                                </TableCell>
                                <TableCell>
                                  {getMembershipBadge(
                                    member.membershipType || "contribuyente",
                                  )}
                                </TableCell>
                                <TableCell>{getStatusBadge(member)}</TableCell>
                                <TableCell>
                                  <div className="flex items-center text-sm text-gray-600">
                                    <Calendar className="w-3 h-3 mr-1" />
                                    {member.createdAt?.toLocaleDateString()}
                                  </div>
                                </TableCell>
                                <TableCell className="text-right">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleViewDetails(member)}
                                  >
                                    <Eye className="w-4 h-4 mr-1" />
                                    Ver Detalles
                                  </Button>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    )}
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </CardContent>
        </Card>

        {/* Dialog de Detalles del Miembro */}
        <Dialog open={showDetailDialog} onOpenChange={setShowDetailDialog}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center">
                <Users className="w-5 h-5 mr-2" />
                Detalles del Miembro
              </DialogTitle>
              <DialogDescription>
                Información completa del miembro seleccionado
              </DialogDescription>
            </DialogHeader>

            {selectedMember && (
              <div className="space-y-6">
                {/* Información Personal */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center space-x-4 mb-4">
                    <Avatar className="h-16 w-16">
                      <AvatarImage
                        src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${selectedMember.email}`}
                      />
                      <AvatarFallback className="text-lg">
                        {selectedMember.firstName[0]}
                        {selectedMember.lastName[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold">
                        {selectedMember.firstName} {selectedMember.lastName}
                      </h3>
                      <p className="text-gray-600">
                        @{selectedMember.username}
                      </p>
                      <div className="flex items-center space-x-2 mt-2">
                        {getMembershipBadge(
                          selectedMember.membershipType || "contribuyente",
                        )}
                        {getStatusBadge(selectedMember)}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Información de Contacto */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-700">
                      Email
                    </Label>
                    <div className="flex items-center mt-1">
                      <Mail className="w-4 h-4 mr-2 text-gray-400" />
                      <span className="text-sm">{selectedMember.email}</span>
                    </div>
                  </div>
                  {selectedMember.phone && (
                    <div>
                      <Label className="text-sm font-medium text-gray-700">
                        Teléfono
                      </Label>
                      <div className="flex items-center mt-1">
                        <Phone className="w-4 h-4 mr-2 text-gray-400" />
                        <span className="text-sm">{selectedMember.phone}</span>
                      </div>
                    </div>
                  )}
                  <div>
                    <Label className="text-sm font-medium text-gray-700">
                      Fecha de Registro
                    </Label>
                    <div className="flex items-center mt-1">
                      <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                      <span className="text-sm">
                        {selectedMember.createdAt?.toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-700">
                      Estado de Membresía
                    </Label>
                    <div className="mt-1">
                      <span className="text-sm capitalize">
                        {selectedMember.memberStatus || "Activo"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Información de Membresía */}
                <div className="bg-blue-50 rounded-lg p-4">
                  <h4 className="font-medium text-blue-900 mb-2">
                    Información de Membresía
                  </h4>
                  <div className="text-sm text-blue-800">
                    <p>
                      <strong>Tipo:</strong>{" "}
                      {MEMBERSHIP_TYPES[
                        selectedMember.membershipType as keyof typeof MEMBERSHIP_TYPES
                      ]?.label || "Contribuyente"}
                    </p>
                    <p className="mt-1">
                      <strong>Descripción:</strong>{" "}
                      {MEMBERSHIP_TYPES[
                        selectedMember.membershipType as keyof typeof MEMBERSHIP_TYPES
                      ]?.description || "Miembro regular del club"}
                    </p>
                  </div>
                </div>
              </div>
            )}

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setShowDetailDialog(false)}
              >
                Cerrar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default MembersModule;
