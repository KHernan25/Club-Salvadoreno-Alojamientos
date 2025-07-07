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
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "@/hooks/use-toast";
import {
  Search,
  Filter,
  UserPlus,
  Check,
  X,
  Edit,
  Trash2,
  MoreHorizontal,
  Shield,
  User as UserIcon,
  Clock,
  Mail,
  Phone,
  Crown,
  Settings,
} from "lucide-react";
import AdminLayout from "@/components/AdminLayout";
import {
  apiGetUsers,
  apiActivateUser,
  apiDeactivateUser,
  apiUpdateUser,
  type User,
} from "@/lib/api-service";

// Use the User type directly from api-service
import {
  getCurrentUser,
  isSuperAdmin,
  hasPermission,
} from "@/lib/auth-service";
import { getRolePermissions } from "@/lib/user-database";
import { useLocation, useNavigate } from "react-router-dom";

const AdminUsers = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isNewUserDialogOpen, setIsNewUserDialogOpen] = useState(false);
  const [newUserForm, setNewUserForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    username: "",
    phone: "",
    role: "user" as User["role"],
    password: "",
  });

  const currentUser = getCurrentUser();

  useEffect(() => {
    loadUsers();
  }, []);

  useEffect(() => {
    // Auto-open new user dialog if URL is /admin/users/new
    if (location.pathname === "/admin/users/new") {
      setIsNewUserDialogOpen(true);
    }
  }, [location.pathname]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      // Intentar cargar desde API real
      const response = await apiGetUsers();
      setUsers(response);
    } catch (error) {
      console.error("Error loading users:", error);
      // Cargar datos mock si la API no está disponible
      setUsers(getMockUsers());
    } finally {
      setLoading(false);
    }
  };

  const getMockUsers = (): User[] => [
    {
      id: "1",
      firstName: "Administrador",
      lastName: "Sistema",
      email: "admin@clubsalvadoreno.com",
      username: "admin",
      password: "admin123",
      fullName: "Administrador Sistema",
      role: "super_admin",
      isActive: true,
      phone: "+503 2345-6789",
      createdAt: new Date("2024-01-01T00:00:00Z"),
      lastLogin: new Date("2024-01-15T10:30:00Z"),
      status: "approved",
    },
    {
      id: "2",
      firstName: "María",
      lastName: "González",
      email: "maria.gonzalez@email.com",
      username: "maria_gonzalez",
      password: "maria123",
      fullName: "María González",
      role: "user",
      isActive: false,
      phone: "+503 7890-1234",
      createdAt: new Date("2024-01-14T15:20:00Z"),
      status: "pending",
    },
    {
      id: "3",
      firstName: "Carlos",
      lastName: "Méndez",
      email: "carlos.mendez@email.com",
      username: "carlos_mendez",
      password: "carlos123",
      fullName: "Carlos Méndez",
      role: "user",
      isActive: true,
      phone: "+503 6789-0123",
      createdAt: new Date("2024-01-13T09:15:00Z"),
      lastLogin: new Date("2024-01-15T08:45:00Z"),
      status: "approved",
    },
    {
      id: "4",
      firstName: "Ana",
      lastName: "Rodríguez",
      email: "ana.rodriguez@email.com",
      username: "ana_rodriguez",
      password: "ana123",
      fullName: "Ana Rodríguez",
      role: "user",
      isActive: false,
      phone: "+503 5678-9012",
      createdAt: new Date("2024-01-12T14:30:00Z"),
      status: "pending",
    },
    {
      id: "5",
      firstName: "Personal",
      lastName: "Recepción",
      email: "recepcion@clubsalvadoreno.com",
      username: "recepcion",
      password: "recepcion123",
      fullName: "Personal Recepción",
      role: "atencion_miembro",
      isActive: true,
      phone: "+503 2345-6789",
      createdAt: new Date("2024-01-01T00:00:00Z"),
      lastLogin: new Date("2024-01-15T07:00:00Z"),
      status: "approved",
    },
  ];

  const handleApproveUser = async (userId: string) => {
    try {
      await apiActivateUser(userId);
      toast({
        title: "Usuario aprobado",
        description: "El usuario ha sido activado exitosamente.",
      });
      loadUsers();
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo aprobar el usuario.",
        variant: "destructive",
      });
    }
  };

  const handleRejectUser = async (userId: string) => {
    try {
      await apiDeactivateUser(userId);
      toast({
        title: "Usuario rechazado",
        description: "El usuario ha sido desactivado.",
      });
      loadUsers();
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo rechazar el usuario.",
        variant: "destructive",
      });
    }
  };

  const handleUpdateUser = async (userData: Partial<User>) => {
    if (!selectedUser) return;

    try {
      await apiUpdateUser(selectedUser.id, userData);
      toast({
        title: "Usuario actualizado",
        description: "Los datos del usuario han sido actualizados.",
      });
      setIsEditDialogOpen(false);
      setSelectedUser(null);
      loadUsers();
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo actualizar el usuario.",
        variant: "destructive",
      });
    }
  };

  const handleCreateUser = async () => {
    // In a real app, this would call an API
    try {
      // Mock user creation
      const newUser: User = {
        id: ((users?.length || 0) + 1).toString(),
        ...newUserForm,
        fullName: `${newUserForm.firstName} ${newUserForm.lastName}`,
        isActive: true,
        createdAt: new Date(),
        status: "approved",
      };

      setUsers([...(users || []), newUser]);
      toast({
        title: "Usuario creado",
        description: "El nuevo usuario ha sido creado exitosamente.",
      });
      setIsNewUserDialogOpen(false);
      setNewUserForm({
        firstName: "",
        lastName: "",
        email: "",
        username: "",
        phone: "",
        role: "user",
        password: "",
      });
      // Navigate back to main users page if came from /new route
      if (location.pathname === "/admin/users/new") {
        navigate("/admin/users");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo crear el usuario.",
        variant: "destructive",
      });
    }
  };

  const getRoleDisplayName = (role: string) => {
    switch (role) {
      case "super_admin":
        return "Super Administrador";
      case "atencion_miembro":
        return "Atención al Miembro";
      case "anfitrion":
        return "Anfitrión";
      case "monitor":
        return "Monitor";
      case "mercadeo":
        return "Mercadeo";
      case "recepcion":
        return "Recepción";
      case "miembro":
        return "Miembro";
      default:
        return "Usuario";
    }
  };

  // Helper function to check if user is BackOffice staff
  const isBackOfficeUser = (role: string) => {
    return [
      "super_admin",
      "atencion_miembro",
      "anfitrion",
      "monitor",
      "mercadeo",
      "recepcion",
    ].includes(role);
  };

  const filteredUsers = (users || []).filter((user) => {
    const matchesSearch =
      user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.username.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRole = roleFilter === "all" || user.role === roleFilter;

    // For BackOffice users, filter by active status instead of approval status
    let matchesStatus = true;
    if (statusFilter !== "all") {
      if (isBackOfficeUser(user.role)) {
        // BackOffice users: active/inactive instead of approved/rejected
        matchesStatus =
          statusFilter === "active" ? user.isActive : !user.isActive;
      } else {
        // Members: keep using approval status
        matchesStatus = user.status === statusFilter;
      }
    }

    return matchesSearch && matchesRole && matchesStatus;
  });

  const pendingUsers = (users || []).filter(
    (user) => !isBackOfficeUser(user.role) && user.status === "pending",
  );
  const activeUsers = (users || []).filter((user) =>
    isBackOfficeUser(user.role) ? user.isActive : user.status === "approved",
  );
  const inactiveUsers = (users || []).filter((user) =>
    isBackOfficeUser(user.role) ? !user.isActive : user.status === "rejected",
  );

  const UserRow = ({ user }: { user: User }) => (
    <TableRow>
      <TableCell>
        <div className="flex items-center space-x-3">
          <Avatar className="h-8 w-8">
            <AvatarImage
              src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`}
            />
            <AvatarFallback>
              {user.firstName[0]}
              {user.lastName[0]}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">
              {user.firstName} {user.lastName}
            </p>
            <p className="text-sm text-gray-500">@{user.username}</p>
          </div>
        </div>
      </TableCell>
      <TableCell>
        <div className="space-y-1">
          <p className="text-sm">{user.email}</p>
          {user.phone && <p className="text-xs text-gray-500">{user.phone}</p>}
        </div>
      </TableCell>
      <TableCell>
        <div className="flex items-center space-x-2">
          <Badge
            variant={
              user.role === "super_admin"
                ? "default"
                : user.role === "atencion_miembro"
                  ? "default"
                  : "secondary"
            }
            className={
              user.role === "super_admin" ? "bg-blue-600 hover:bg-blue-700" : ""
            }
          >
            {user.role === "super_admin" && <Crown className="h-3 w-3 mr-1" />}
            {getRoleDisplayName(user.role)}
          </Badge>
        </div>
      </TableCell>
      <TableCell>
        {isBackOfficeUser(user.role) ? (
          <Badge variant={user.isActive ? "default" : "destructive"}>
            {user.isActive ? "Activo" : "Inactivo"}
          </Badge>
        ) : (
          <Badge
            variant={
              user.status === "approved"
                ? "default"
                : user.status === "pending"
                  ? "outline"
                  : "destructive"
            }
          >
            {user.status === "approved"
              ? "Aprobado"
              : user.status === "pending"
                ? "Pendiente"
                : "Rechazado"}
          </Badge>
        )}
      </TableCell>
      <TableCell>
        <p className="text-sm">
          {new Date(user.createdAt).toLocaleDateString()}
        </p>
        {user.lastLogin && (
          <p className="text-xs text-gray-500">
            Último acceso: {user.lastLogin.toLocaleDateString()}
          </p>
        )}
      </TableCell>
      <TableCell>
        <div className="flex items-center space-x-2">
          {isBackOfficeUser(user.role) ? (
            // BackOffice users: Just edit and activate/deactivate
            <>
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  setSelectedUser(user);
                  setIsEditDialogOpen(true);
                }}
                className="border-blue-600 text-blue-600 hover:bg-blue-50"
              >
                <Edit className="h-3 w-3 mr-1" />
                Editar
              </Button>
              {user.role !== "super_admin" && (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button size="sm" variant="outline">
                      <Trash2 className="h-3 w-3 mr-1" />
                      {user.isActive ? "Desactivar" : "Activar"}
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        {user.isActive ? "Desactivar" : "Activar"} usuario
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        ¿Estás seguro de que deseas{" "}
                        {user.isActive ? "desactivar" : "activar"} a{" "}
                        {user.firstName} {user.lastName}?
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() =>
                          user.isActive
                            ? handleRejectUser(user.id)
                            : handleApproveUser(user.id)
                        }
                      >
                        Confirmar
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}
            </>
          ) : (
            // Members: Keep approval/rejection flow
            <>
              {user.status === "pending" && (
                <>
                  <Button
                    size="sm"
                    variant="default"
                    onClick={() => handleApproveUser(user.id)}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <Check className="h-3 w-3 mr-1" />
                    Aprobar
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleRejectUser(user.id)}
                  >
                    <X className="h-3 w-3 mr-1" />
                    Rechazar
                  </Button>
                </>
              )}
              {user.status !== "pending" && (
                <>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setSelectedUser(user);
                      setIsEditDialogOpen(true);
                    }}
                    className="border-blue-600 text-blue-600 hover:bg-blue-50"
                  >
                    <Edit className="h-3 w-3 mr-1" />
                    Editar
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button size="sm" variant="outline">
                        <Trash2 className="h-3 w-3 mr-1" />
                        {user.isActive ? "Desactivar" : "Activar"}
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          {user.isActive ? "Desactivar" : "Activar"} usuario
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          ¿Estás seguro de que deseas{" "}
                          {user.isActive ? "desactivar" : "activar"} a{" "}
                          {user.firstName} {user.lastName}?
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() =>
                            user.isActive
                              ? handleRejectUser(user.id)
                              : handleApproveUser(user.id)
                          }
                        >
                          Confirmar
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </>
              )}
            </>
          )}
        </div>
      </TableCell>
    </TableRow>
  );

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Gestión de Usuarios</h1>
            <p className="text-gray-600">
              Administra usuarios y solicitudes de registro
            </p>
          </div>
          {hasPermission("canCreateUsers") && (
            <Button
              onClick={() => setIsNewUserDialogOpen(true)}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <UserPlus className="mr-2 h-4 w-4" />
              Nuevo Usuario
            </Button>
          )}
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                Total Usuarios
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{users?.length || 0}</div>
              <p className="text-xs text-muted-foreground">
                Todos los usuarios registrados
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">BackOffice</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {(users || []).filter((u) => isBackOfficeUser(u.role)).length}
              </div>
              <p className="text-xs text-muted-foreground">
                Personal administrativo
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Miembros</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {(users || []).filter((u) => u.role === "miembro").length}
              </div>
              <p className="text-xs text-muted-foreground">Usuarios miembros</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Pendientes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">
                {pendingUsers.length}
              </div>
              <p className="text-xs text-muted-foreground">
                Miembros por aprobar
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
                <Label htmlFor="search">Buscar usuarios</Label>
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="search"
                    placeholder="Buscar por nombre, email o usuario..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="role-filter">Rol</Label>
                <Select value={roleFilter} onValueChange={setRoleFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Todos los roles" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos los roles</SelectItem>
                    <SelectItem value="super_admin">
                      Super Administrador
                    </SelectItem>
                    <SelectItem value="atencion_miembro">
                      Atención al Miembro
                    </SelectItem>
                    <SelectItem value="anfitrion">Anfitrión</SelectItem>
                    <SelectItem value="monitor">Monitor</SelectItem>
                    <SelectItem value="mercadeo">Mercadeo</SelectItem>
                    <SelectItem value="recepcion">Recepción</SelectItem>
                    <SelectItem value="miembro">Miembro</SelectItem>
                    <SelectItem value="user">Usuario</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="status-filter">Estado</Label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Todos los estados" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos los estados</SelectItem>
                    <SelectItem value="pending">Pendiente</SelectItem>
                    <SelectItem value="approved">Aprobado</SelectItem>
                    <SelectItem value="rejected">Rechazado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Users Table */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              Lista de Usuarios ({filteredUsers.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">Cargando usuarios...</div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Usuario</TableHead>
                    <TableHead>Contacto</TableHead>
                    <TableHead>Rol</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Fechas</TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <UserRow key={user.id} user={user} />
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* New User Dialog */}
        <Dialog
          open={isNewUserDialogOpen}
          onOpenChange={setIsNewUserDialogOpen}
        >
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center space-x-2">
                <Crown className="h-5 w-5 text-blue-600" />
                <span>Crear Nuevo Usuario</span>
              </DialogTitle>
              <DialogDescription>
                Solo el Super Administrador puede crear nuevos usuarios con
                roles específicos
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="new-firstName">Nombre</Label>
                  <Input
                    id="new-firstName"
                    value={newUserForm.firstName}
                    onChange={(e) =>
                      setNewUserForm({
                        ...newUserForm,
                        firstName: e.target.value,
                      })
                    }
                    placeholder="Nombre"
                  />
                </div>
                <div>
                  <Label htmlFor="new-lastName">Apellido</Label>
                  <Input
                    id="new-lastName"
                    value={newUserForm.lastName}
                    onChange={(e) =>
                      setNewUserForm({
                        ...newUserForm,
                        lastName: e.target.value,
                      })
                    }
                    placeholder="Apellido"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="new-email">Email</Label>
                <Input
                  id="new-email"
                  type="email"
                  value={newUserForm.email}
                  onChange={(e) =>
                    setNewUserForm({ ...newUserForm, email: e.target.value })
                  }
                  placeholder="usuario@email.com"
                />
              </div>
              <div>
                <Label htmlFor="new-username">Nombre de Usuario</Label>
                <Input
                  id="new-username"
                  value={newUserForm.username}
                  onChange={(e) =>
                    setNewUserForm({ ...newUserForm, username: e.target.value })
                  }
                  placeholder="nombre_usuario"
                />
              </div>
              <div>
                <Label htmlFor="new-phone">Teléfono</Label>
                <Input
                  id="new-phone"
                  value={newUserForm.phone}
                  onChange={(e) =>
                    setNewUserForm({ ...newUserForm, phone: e.target.value })
                  }
                  placeholder="+503 XXXX-XXXX"
                />
              </div>
              <div>
                <Label htmlFor="new-password">Contraseña Temporal</Label>
                <Input
                  id="new-password"
                  type="password"
                  value={newUserForm.password}
                  onChange={(e) =>
                    setNewUserForm({ ...newUserForm, password: e.target.value })
                  }
                  placeholder="Contraseña temporal"
                />
              </div>
              <div>
                <Label htmlFor="new-role">Rol del Usuario</Label>
                <Select
                  value={newUserForm.role}
                  onValueChange={(value: User["role"]) =>
                    setNewUserForm({ ...newUserForm, role: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="user">Usuario Regular</SelectItem>
                    <SelectItem value="mercadeo">Mercadeo</SelectItem>
                    <SelectItem value="monitor">Monitor</SelectItem>
                    <SelectItem value="anfitrion">Anfitrión</SelectItem>
                    <SelectItem value="atencion_miembro">
                      Atención al Miembro
                    </SelectItem>
                    {isSuperAdmin() && (
                      <SelectItem value="super_admin">
                        <div className="flex items-center space-x-2">
                          <Crown className="h-4 w-4 text-blue-600" />
                          <span>Super Administrador</span>
                        </div>
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setIsNewUserDialogOpen(false);
                  // Navigate back if came from /new route
                  if (location.pathname === "/admin/users/new") {
                    navigate("/admin/users");
                  }
                }}
              >
                Cancelar
              </Button>
              <Button
                onClick={handleCreateUser}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Crear Usuario
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit User Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Editar Usuario</DialogTitle>
              <DialogDescription>
                Modifica la información del usuario
              </DialogDescription>
            </DialogHeader>
            {selectedUser && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="firstName">Nombre</Label>
                  <Input id="firstName" defaultValue={selectedUser.firstName} />
                </div>
                <div>
                  <Label htmlFor="lastName">Apellido</Label>
                  <Input id="lastName" defaultValue={selectedUser.lastName} />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    defaultValue={selectedUser.email}
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Teléfono</Label>
                  <Input id="phone" defaultValue={selectedUser.phone} />
                </div>
                <div>
                  <Label htmlFor="role">Rol</Label>
                  <Select defaultValue={selectedUser.role}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="user">Usuario Regular</SelectItem>
                      <SelectItem value="mercadeo">Mercadeo</SelectItem>
                      <SelectItem value="monitor">Monitor</SelectItem>
                      <SelectItem value="anfitrion">Anfitrión</SelectItem>
                      <SelectItem value="atencion_miembro">
                        Atención al Miembro
                      </SelectItem>
                      {isSuperAdmin() && (
                        <SelectItem value="super_admin">
                          <div className="flex items-center space-x-2">
                            <Crown className="h-4 w-4 text-blue-600" />
                            <span>Super Administrador</span>
                          </div>
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
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
                onClick={() => handleUpdateUser({})}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Guardar Cambios
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default AdminUsers;
