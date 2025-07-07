import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Camera,
  Upload,
  CheckCircle,
  AlertCircle,
  FileImage,
  User,
  CreditCard,
  IdCard,
  Loader2,
  X,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface DocumentState {
  file: File | null;
  preview: string | null;
  uploaded: boolean;
}

const DocumentUpload = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  // Get user data from registration
  const newUser = location.state?.newUser;

  const [documents, setDocuments] = useState({
    idDocument: { file: null, preview: null, uploaded: false } as DocumentState,
    memberCard: { file: null, preview: null, uploaded: false } as DocumentState,
    facePhoto: { file: null, preview: null, uploaded: false } as DocumentState,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [uploadStep, setUploadStep] = useState<"documents" | "complete">(
    "documents",
  );

  const idDocumentRef = useRef<HTMLInputElement>(null);
  const memberCardRef = useRef<HTMLInputElement>(null);
  const facePhotoRef = useRef<HTMLInputElement>(null);

  // Redirect if no user data
  if (!newUser) {
    navigate("/register");
    return null;
  }

  const handleFileSelect = (
    type: keyof typeof documents,
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast({
        title: "Archivo inválido",
        description: "Por favor selecciona una imagen válida",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "Archivo muy grande",
        description: "La imagen debe ser menor a 5MB",
        variant: "destructive",
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      setDocuments((prev) => ({
        ...prev,
        [type]: {
          file,
          preview: e.target?.result as string,
          uploaded: false,
        },
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveFile = (type: keyof typeof documents) => {
    setDocuments((prev) => ({
      ...prev,
      [type]: { file: null, preview: null, uploaded: false },
    }));
  };

  const handleSubmit = async () => {
    // Validate all documents are uploaded
    const requiredDocs = ["idDocument", "memberCard", "facePhoto"] as const;
    const missingDocs = requiredDocs.filter((doc) => !documents[doc].file);

    if (missingDocs.length > 0) {
      toast({
        title: "Documentos faltantes",
        description: "Por favor sube todos los documentos requeridos",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      // Simulate upload process
      await new Promise((resolve) => setTimeout(resolve, 3000));

      // Mark documents as uploaded
      setDocuments((prev) => {
        const updated = { ...prev };
        requiredDocs.forEach((doc) => {
          updated[doc] = { ...updated[doc], uploaded: true };
        });
        return updated;
      });

      setUploadStep("complete");

      toast({
        title: "¡Documentos enviados exitosamente!",
        description:
          "Tu cuenta será verificada y activada pronto. Te notificaremos por correo.",
      });
    } catch (error) {
      toast({
        title: "Error al subir documentos",
        description:
          "Hubo un problema al procesar tus documentos. Inténtalo de nuevo.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleContinueToLogin = () => {
    navigate("/login", {
      replace: true,
      state: {
        message: "Documentos enviados. Tu cuenta será verificada pronto.",
        newUser: {
          email: newUser.email,
          fullName: newUser.fullName,
        },
      },
    });
  };

  if (uploadStep === "complete") {
    return (
      <div className="min-h-screen relative overflow-hidden">
        {/* Background */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `linear-gradient(rgba(2, 21, 71, 0.85), rgba(2, 21, 71, 0.85)), url('/sunzal.gif')`,
          }}
        />

        {/* Content */}
        <div className="relative z-10 min-h-screen flex items-center justify-center px-4">
          <Card className="w-full max-w-md bg-white/95 backdrop-blur">
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <CardTitle className="text-2xl text-green-800">
                ¡Documentos Enviados!
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <p className="text-gray-600">
                Hola <strong>{newUser.fullName}</strong>, tus documentos han
                sido enviados exitosamente.
              </p>
              <p className="text-sm text-gray-500">
                Nuestro equipo verificará tu información y activará tu cuenta.
                Te notificaremos por correo electrónico cuando esté lista.
              </p>
              <div className="pt-4">
                <Button onClick={handleContinueToLogin} className="w-full">
                  Continuar al Inicio de Sesión
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `linear-gradient(rgba(2, 21, 71, 0.85), rgba(2, 21, 71, 0.85)), url('/sunzal.gif')`,
        }}
      />

      {/* Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-4xl">
          {/* Header */}
          <div className="text-center mb-8">
            <img
              src="/logo.png"
              alt="Logo Club Salvadoreño"
              className="max-w-[250px] mx-auto object-contain mb-6"
            />
            <h1 className="text-white text-3xl font-bold mb-2">
              Verificación de Identidad
            </h1>
            <p className="text-blue-200 text-lg">
              Para completar tu registro, necesitamos verificar tu identidad
            </p>
          </div>

          {/* Document Upload Cards */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {/* ID Document */}
            <Card className="bg-white/95 backdrop-blur">
              <CardHeader className="text-center">
                <IdCard className="mx-auto h-12 w-12 text-blue-600 mb-2" />
                <CardTitle className="text-lg">
                  Documento de Identidad
                </CardTitle>
                <p className="text-sm text-gray-600">
                  Foto clara de tu DUI, pasaporte o cédula
                </p>
              </CardHeader>
              <CardContent>
                {documents.idDocument.preview ? (
                  <div className="relative">
                    <img
                      src={documents.idDocument.preview}
                      alt="Documento de identidad"
                      className="w-full h-32 object-cover rounded-lg border"
                    />
                    <Button
                      size="sm"
                      variant="destructive"
                      className="absolute top-2 right-2"
                      onClick={() => handleRemoveFile("idDocument")}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                    {documents.idDocument.uploaded && (
                      <div className="absolute inset-0 bg-green-500/20 rounded-lg flex items-center justify-center">
                        <CheckCircle className="h-8 w-8 text-green-600" />
                      </div>
                    )}
                  </div>
                ) : (
                  <div
                    className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-blue-400 transition-colors"
                    onClick={() => idDocumentRef.current?.click()}
                  >
                    <Camera className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                    <p className="text-sm text-gray-600">
                      Toca para subir foto
                    </p>
                  </div>
                )}
                <input
                  ref={idDocumentRef}
                  type="file"
                  accept="image/*"
                  capture="environment"
                  className="hidden"
                  onChange={(e) => handleFileSelect("idDocument", e)}
                />
              </CardContent>
            </Card>

            {/* Member Card */}
            <Card className="bg-white/95 backdrop-blur">
              <CardHeader className="text-center">
                <CreditCard className="mx-auto h-12 w-12 text-green-600 mb-2" />
                <CardTitle className="text-lg">Carnet de Miembro</CardTitle>
                <p className="text-sm text-gray-600">
                  Foto de tu carnet del Club Salvadoreño
                </p>
              </CardHeader>
              <CardContent>
                {documents.memberCard.preview ? (
                  <div className="relative">
                    <img
                      src={documents.memberCard.preview}
                      alt="Carnet de miembro"
                      className="w-full h-32 object-cover rounded-lg border"
                    />
                    <Button
                      size="sm"
                      variant="destructive"
                      className="absolute top-2 right-2"
                      onClick={() => handleRemoveFile("memberCard")}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                    {documents.memberCard.uploaded && (
                      <div className="absolute inset-0 bg-green-500/20 rounded-lg flex items-center justify-center">
                        <CheckCircle className="h-8 w-8 text-green-600" />
                      </div>
                    )}
                  </div>
                ) : (
                  <div
                    className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-green-400 transition-colors"
                    onClick={() => memberCardRef.current?.click()}
                  >
                    <Camera className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                    <p className="text-sm text-gray-600">
                      Toca para subir foto
                    </p>
                  </div>
                )}
                <input
                  ref={memberCardRef}
                  type="file"
                  accept="image/*"
                  capture="environment"
                  className="hidden"
                  onChange={(e) => handleFileSelect("memberCard", e)}
                />
              </CardContent>
            </Card>

            {/* Face Photo */}
            <Card className="bg-white/95 backdrop-blur">
              <CardHeader className="text-center">
                <User className="mx-auto h-12 w-12 text-purple-600 mb-2" />
                <CardTitle className="text-lg">Foto de tu Rostro</CardTitle>
                <p className="text-sm text-gray-600">
                  Selfie clara mostrando tu rostro
                </p>
              </CardHeader>
              <CardContent>
                {documents.facePhoto.preview ? (
                  <div className="relative">
                    <img
                      src={documents.facePhoto.preview}
                      alt="Foto del rostro"
                      className="w-full h-32 object-cover rounded-lg border"
                    />
                    <Button
                      size="sm"
                      variant="destructive"
                      className="absolute top-2 right-2"
                      onClick={() => handleRemoveFile("facePhoto")}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                    {documents.facePhoto.uploaded && (
                      <div className="absolute inset-0 bg-green-500/20 rounded-lg flex items-center justify-center">
                        <CheckCircle className="h-8 w-8 text-green-600" />
                      </div>
                    )}
                  </div>
                ) : (
                  <div
                    className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-purple-400 transition-colors"
                    onClick={() => facePhotoRef.current?.click()}
                  >
                    <Camera className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                    <p className="text-sm text-gray-600">
                      Toca para tomar selfie
                    </p>
                  </div>
                )}
                <input
                  ref={facePhotoRef}
                  type="file"
                  accept="image/*"
                  capture="user"
                  className="hidden"
                  onChange={(e) => handleFileSelect("facePhoto", e)}
                />
              </CardContent>
            </Card>
          </div>

          {/* Instructions */}
          <Card className="bg-white/95 backdrop-blur mb-6">
            <CardContent className="p-6">
              <div className="flex items-start space-x-3">
                <AlertCircle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">
                    Instrucciones importantes:
                  </h3>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>
                      • Asegúrate de que las fotos estén bien iluminadas y sean
                      legibles
                    </li>
                    <li>
                      • El documento debe mostrarse completo y sin obstrucciones
                    </li>
                    <li>
                      • Tu rostro debe ser claramente visible en la selfie
                    </li>
                    <li>• Las imágenes deben ser menores a 5MB cada una</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="text-center">
            <Button
              onClick={handleSubmit}
              disabled={
                isLoading ||
                !documents.idDocument.file ||
                !documents.memberCard.file ||
                !documents.facePhoto.file
              }
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Enviando documentos...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-5 w-5" />
                  Enviar Documentos
                </>
              )}
            </Button>
            <p className="text-blue-200 text-sm mt-4">
              Al enviar estos documentos aceptas que serán utilizados únicamente
              para verificación
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentUpload;
