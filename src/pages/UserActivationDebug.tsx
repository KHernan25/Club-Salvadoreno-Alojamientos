import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  activateUserByIdentifier,
  activateAllInactiveUsers,
  getUserStatusReport,
} from "@/utils/activate-user-helper";
import { useToast } from "@/hooks/use-toast";
import {
  UserCheck,
  UserX,
  Shield,
  Mail,
  User,
  Users,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
} from "lucide-react";

const UserActivationDebug = () => {
  const { toast } = useToast();
  const [emailToActivate, setEmailToActivate] = useState("");
  const [statusReport, setStatusReport] = useState(getUserStatusReport());
  const [loading, setLoading] = useState(false);

  const handleRefreshReport = () => {
    setStatusReport(getUserStatusReport());
    toast({
      title: "Reporte actualizado",
      description: "La información de usuarios ha sido actualizada",
    });
  };

  const handleActivateSpecificUser = async () => {
    if (!emailToActivate.trim()) {
      toast({
        title: "Error",
        description: "Por favor ingresa un email o username",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const result = activateUserByIdentifier(emailToActivate.trim());

      if (result.success) {
        toast({
          title: "Usuario activado",
          description: result.message,
        });
        setEmailToActivate("");
        handleRefreshReport();
      } else {
        toast({
          title: "Error",
          description: result.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Error al activar usuario",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleActivateAllUsers = async () => {
    setLoading(true);

    try {
      const result = activateAllInactiveUsers();

      if (result.success) {
        toast({
          title: "Usuarios activados",
          description: `${result.activatedCount} usuarios han sido activados`,
        });
        handleRefreshReport();
      } else {
        toast({
          title: "Información",
          description: result.message,
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Error al activar usuarios",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "super_admin":
        return "bg-red-100 text-red-800";
      case "atencion_miembro":
        return "bg-blue-100 text-blue-800";
      case "anfitrion":
        return "bg-green-100 text-green-800";
      case "monitor":
        return "bg-yellow-100 text-yellow-800";
      case "mercadeo":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            🔧 User Activation Debug Tool
          </h1>
          <p className="text-gray-600">
            Herramienta de desarrollo para activar usuarios desactivados
          </p>
        </div>

        {/* Warning Alert */}
        <Alert className="border-orange-200 bg-orange-50">
          <AlertTriangle className="h-4 w-4 text-orange-600" />
          <AlertDescription className="text-orange-800">
            <strong>Solo para desarrollo:</strong> Esta herramienta es solo para
            uso en desarrollo. En producción, usa el panel de administración.
          </AlertDescription>
        </Alert>

        {/* Status Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Resumen de Estado de Usuarios
              <Button
                onClick={handleRefreshReport}
                variant="outline"
                size="sm"
                className="ml-auto"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Actualizar
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">
                  {statusReport.summary.total}
                </div>
                <div className="text-sm text-blue-600">Total Usuarios</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {statusReport.summary.active}
                </div>
                <div className="text-sm text-green-600">Activos</div>
              </div>
              <div className="text-center p-4 bg-red-50 rounded-lg">
                <div className="text-2xl font-bold text-red-600">
                  {statusReport.summary.inactive}
                </div>
                <div className="text-sm text-red-600">Inactivos</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Cards */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Activate Specific User */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserCheck className="h-5 w-5" />
                Activar Usuario Específico
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email o Username</Label>
                <Input
                  id="email"
                  type="text"
                  placeholder="ejemplo@email.com o username"
                  value={emailToActivate}
                  onChange={(e) => setEmailToActivate(e.target.value)}
                />
              </div>
              <Button
                onClick={handleActivateSpecificUser}
                disabled={loading || !emailToActivate.trim()}
                className="w-full"
              >
                <UserCheck className="h-4 w-4 mr-2" />
                Activar Usuario
              </Button>
            </CardContent>
          </Card>

          {/* Activate All Users */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Activar Todos los Usuarios
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-gray-600">
                Activa automáticamente todos los usuarios inactivos en el
                sistema.
              </p>
              <Button
                onClick={handleActivateAllUsers}
                disabled={loading || statusReport.summary.inactive === 0}
                variant="secondary"
                className="w-full"
              >
                <Users className="h-4 w-4 mr-2" />
                Activar Todos ({statusReport.summary.inactive})
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Inactive Users Table */}
        {statusReport.inactiveUsers.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserX className="h-5 w-5 text-red-600" />
                Usuarios Inactivos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Username</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Rol</TableHead>
                    <TableHead>Acción</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {statusReport.inactiveUsers.map((user) => (
                    <TableRow key={user.username}>
                      <TableCell className="font-medium">
                        {user.fullName}
                      </TableCell>
                      <TableCell>{user.username}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-gray-400" />
                          {user.email}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getRoleBadgeColor(user.role)}>
                          {user.role}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button
                          onClick={() => {
                            setEmailToActivate(user.email);
                          }}
                          variant="outline"
                          size="sm"
                        >
                          Seleccionar
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}

        {/* Active Users Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              Usuarios Activos - Credenciales Disponibles
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Username</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Rol</TableHead>
                  <TableHead>Estado</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {statusReport.activeUsers.map((user) => (
                  <TableRow key={user.username}>
                    <TableCell className="font-medium">
                      {user.fullName}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-gray-400" />
                        <code className="bg-gray-100 px-2 py-1 rounded text-sm">
                          {user.username}
                        </code>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-gray-400" />
                        {user.email}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getRoleBadgeColor(user.role)}>
                        {user.role}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className="bg-green-100 text-green-800">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Activo
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Instructions */}
        <Card>
          <CardHeader>
            <CardTitle>💡 Instrucciones</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <p>
              <strong>Para activar un usuario específico:</strong> Ingresa su
              email o username en el campo superior y haz clic en "Activar
              Usuario".
            </p>
            <p>
              <strong>Para activar todos los usuarios:</strong> Haz clic en
              "Activar Todos" para activar todos los usuarios inactivos de una
              vez.
            </p>
            <p>
              <strong>Usuarios de prueba disponibles:</strong> Todos los
              usuarios mostrados en la tabla "Activos" están disponibles para
              login. Las contraseñas están definidas en el código.
            </p>
            <p className="text-orange-600">
              <strong>Nota:</strong> Esta herramienta solo funciona en modo
              desarrollo. En producción, usa el panel de administración.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UserActivationDebug;
