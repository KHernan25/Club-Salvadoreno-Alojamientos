import { useState } from "react";
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
  QrCode,
  CreditCard,
  Camera,
  Search,
  Loader2,
  CheckCircle,
  AlertTriangle,
  User,
  IdCard,
} from "lucide-react";
import {
  accessControlService,
  MemberDetectionResult,
} from "@/lib/access-control-service";
import { toast } from "@/hooks/use-toast";
import { User as UserType } from "@/lib/user-database";

interface MemberDetectionProps {
  onAccessRegistered: () => void;
  currentUser: UserType;
}

const MemberDetection = ({
  onAccessRegistered,
  currentUser,
}: MemberDetectionProps) => {
  const [detectionMethod, setDetectionMethod] = useState<
    "qr" | "card" | "camera" | "manual"
  >("qr");
  const [loading, setLoading] = useState(false);
  const [detectedMember, setDetectedMember] = useState<any>(null);
  const [manualSearch, setManualSearch] = useState("");

  // Estados para simulación de hardware
  const [qrInput, setQrInput] = useState("");
  const [cardInput, setCardInput] = useState("");
  const [cameraActive, setCameraActive] = useState(false);

  const handleDetection = async () => {
    if (loading) return;

    setLoading(true);
    setDetectedMember(null);

    try {
      let result: MemberDetectionResult;

      switch (detectionMethod) {
        case "qr":
          if (!qrInput.trim()) {
            toast({
              title: "Error",
              description: "Por favor escanea o ingresa un código QR",
              variant: "destructive",
            });
            setLoading(false);
            return;
          }
          result = await accessControlService.detectMemberByQR(qrInput);
          break;

        case "card":
          if (!cardInput.trim()) {
            toast({
              title: "Error",
              description: "Por favor presenta la tarjeta",
              variant: "destructive",
            });
            setLoading(false);
            return;
          }
          result = await accessControlService.detectMemberByCard(cardInput);
          break;

        case "camera":
          setCameraActive(true);
          result = await accessControlService.detectMemberByCamera();
          setCameraActive(false);
          break;

        case "manual":
          if (!manualSearch.trim()) {
            toast({
              title: "Error",
              description: "Por favor ingresa un código de miembro",
              variant: "destructive",
            });
            setLoading(false);
            return;
          }
          result = await accessControlService.searchMemberByCode(manualSearch);
          break;

        default:
          throw new Error("Método de detección no válido");
      }

      if (result.success && result.member) {
        setDetectedMember(result.member);
        toast({
          title: "Miembro Detectado",
          description: `${result.member.name} ha sido identificado correctamente`,
        });
      } else {
        toast({
          title: "Detección Fallida",
          description: result.error || "No se pudo detectar al miembro",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      console.error("Error en detección:", error);
      toast({
        title: "Error",
        description: error.message || "Error en el sistema de detección",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterAccess = async () => {
    if (!detectedMember) return;

    try {
      const recordId = await accessControlService.registerAccess(
        detectedMember.id,
        detectedMember.name,
        detectedMember.memberCode,
        detectionMethod,
        currentUser.id,
        currentUser.fullName,
        "Entrada Principal",
        detectedMember.photo,
        detectedMember.membershipType,
      );

      toast({
        title: "Acceso Registrado",
        description: `Acceso de ${detectedMember.name} registrado exitosamente`,
      });

      // Limpiar estado
      setDetectedMember(null);
      setQrInput("");
      setCardInput("");
      setManualSearch("");

      // Notificar al padre
      onAccessRegistered();
    } catch (error: any) {
      console.error("Error registrando acceso:", error);
      toast({
        title: "Error",
        description: "Error al registrar el acceso",
        variant: "destructive",
      });
    }
  };

  const getMethodIcon = (method: string) => {
    switch (method) {
      case "qr":
        return <QrCode className="w-5 h-5" />;
      case "card":
        return <CreditCard className="w-5 h-5" />;
      case "camera":
        return <Camera className="w-5 h-5" />;
      case "manual":
        return <Search className="w-5 h-5" />;
      default:
        return <User className="w-5 h-5" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "inactive":
        return "bg-red-100 text-red-800";
      case "suspended":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      {/* Method Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Método de Detección</CardTitle>
          <CardDescription>
            Selecciona el método para identificar al miembro
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button
              variant={detectionMethod === "qr" ? "default" : "outline"}
              onClick={() => setDetectionMethod("qr")}
              className="h-20 flex-col space-y-2"
            >
              <QrCode className="w-6 h-6" />
              <span>Código QR</span>
            </Button>
            <Button
              variant={detectionMethod === "card" ? "default" : "outline"}
              onClick={() => setDetectionMethod("card")}
              className="h-20 flex-col space-y-2"
            >
              <CreditCard className="w-6 h-6" />
              <span>Tarjeta</span>
            </Button>
            <Button
              variant={detectionMethod === "camera" ? "default" : "outline"}
              onClick={() => setDetectionMethod("camera")}
              className="h-20 flex-col space-y-2"
            >
              <Camera className="w-6 h-6" />
              <span>Cámara</span>
            </Button>
            <Button
              variant={detectionMethod === "manual" ? "default" : "outline"}
              onClick={() => setDetectionMethod("manual")}
              className="h-20 flex-col space-y-2"
            >
              <Search className="w-6 h-6" />
              <span>Manual</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Detection Interface */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            {getMethodIcon(detectionMethod)}
            <span>
              {detectionMethod === "qr" && "Escaneo de Código QR"}
              {detectionMethod === "card" && "Lectura de Tarjeta"}
              {detectionMethod === "camera" && "Reconocimiento Facial"}
              {detectionMethod === "manual" && "Búsqueda Manual"}
            </span>
          </CardTitle>
          <CardDescription>
            {detectionMethod === "qr" &&
              "Escanea el código QR del miembro o ingresa manualmente"}
            {detectionMethod === "card" &&
              "Presenta la tarjeta del miembro al lector"}
            {detectionMethod === "camera" &&
              "Posiciona al miembro frente a la cámara"}
            {detectionMethod === "manual" &&
              "Busca al miembro por código o nombre"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* QR Input */}
          {detectionMethod === "qr" && (
            <div className="space-y-2">
              <Label htmlFor="qr-input">Código QR</Label>
              <div className="flex space-x-2">
                <Input
                  id="qr-input"
                  placeholder="Escanea o ingresa el código QR..."
                  value={qrInput}
                  onChange={(e) => setQrInput(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleDetection()}
                />
                <Button onClick={handleDetection} disabled={loading}>
                  {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <QrCode className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </div>
          )}

          {/* Card Input */}
          {detectionMethod === "card" && (
            <div className="space-y-2">
              <Label htmlFor="card-input">Tarjeta de Miembro</Label>
              <div className="flex space-x-2">
                <Input
                  id="card-input"
                  placeholder="Presenta la tarjeta al lector..."
                  value={cardInput}
                  onChange={(e) => setCardInput(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleDetection()}
                />
                <Button onClick={handleDetection} disabled={loading}>
                  {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <CreditCard className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </div>
          )}

          {/* Camera Interface */}
          {detectionMethod === "camera" && (
            <div className="space-y-4">
              <div className="bg-gray-100 rounded-lg p-8 text-center">
                {cameraActive ? (
                  <div className="space-y-4">
                    <Camera className="w-16 h-16 mx-auto text-blue-600 animate-pulse" />
                    <p className="text-lg font-medium">Analizando rostro...</p>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-600 h-2 rounded-full animate-pulse w-3/4"></div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <Camera className="w-16 h-16 mx-auto text-gray-400" />
                    <p className="text-lg font-medium text-gray-600">
                      Cámara lista para reconocimiento
                    </p>
                    <p className="text-sm text-gray-500">
                      Haz clic en el botón para iniciar el reconocimiento facial
                    </p>
                  </div>
                )}
              </div>
              <Button
                onClick={handleDetection}
                disabled={loading}
                className="w-full"
                size="lg"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Analizando...
                  </>
                ) : (
                  <>
                    <Camera className="w-4 h-4 mr-2" />
                    Iniciar Reconocimiento
                  </>
                )}
              </Button>
            </div>
          )}

          {/* Manual Search */}
          {detectionMethod === "manual" && (
            <div className="space-y-2">
              <Label htmlFor="manual-search">Código de Miembro</Label>
              <div className="flex space-x-2">
                <Input
                  id="manual-search"
                  placeholder="Ingresa el código del miembro..."
                  value={manualSearch}
                  onChange={(e) => setManualSearch(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleDetection()}
                />
                <Button onClick={handleDetection} disabled={loading}>
                  {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Search className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Detected Member */}
      {detectedMember && (
        <Card className="border-green-200 bg-green-50">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-green-800">
              <CheckCircle className="w-5 h-5" />
              <span>Miembro Detectado</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4">
              {detectedMember.photo && (
                <img
                  src={detectedMember.photo}
                  alt={detectedMember.name}
                  className="w-16 h-16 rounded-full object-cover"
                />
              )}
              <div className="flex-1">
                <h3 className="text-lg font-semibold">{detectedMember.name}</h3>
                <div className="flex items-center space-x-2 mt-1">
                  <Badge variant="outline">
                    <IdCard className="w-3 h-3 mr-1" />
                    {detectedMember.memberCode}
                  </Badge>
                  <Badge className={getStatusColor(detectedMember.status)}>
                    {detectedMember.status}
                  </Badge>
                  <Badge variant="secondary">
                    {detectedMember.membershipType}
                  </Badge>
                </div>
                {detectedMember.lastAccess && (
                  <p className="text-sm text-gray-600 mt-1">
                    Último acceso:{" "}
                    {detectedMember.lastAccess.toLocaleDateString()}
                  </p>
                )}
              </div>
              <div className="space-x-2">
                <Button onClick={handleRegisterAccess} size="lg">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Registrar Acceso
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setDetectedMember(null)}
                >
                  Cancelar
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default MemberDetection;
