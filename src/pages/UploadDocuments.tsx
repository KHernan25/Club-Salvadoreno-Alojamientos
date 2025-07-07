import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Upload,
  CheckCircle,
  AlertCircle,
  FileImage,
  User,
  CreditCard,
  IdCard,
  Loader2,
  Eye,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { getCurrentSession } from "@/lib/auth-service";

interface DocumentFiles {
  idDocument: File | null;
  memberCard: File | null;
  facePhoto: File | null;
}

const UploadDocuments = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  const [files, setFiles] = useState<DocumentFiles>({
    idDocument: null,
    memberCard: null,
    facePhoto: null,
  });

  const [previews, setPreviews] = useState<{
    idDocument: string | null;
    memberCard: string | null;
    facePhoto: string | null;
  }>({
    idDocument: null,
    memberCard: null,
    facePhoto: null,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [newUser, setNewUser] = useState<any>(null);

  // Get new user data from navigation state
  useEffect(() => {
    const state = location.state;
    if (state?.newUser) {
      setNewUser(state.newUser);
    } else {
      // If no state, redirect to register
      navigate("/register", { replace: true });
    }
  }, [location.state, navigate]);

  // Check for existing session - if logged in, redirect
  useEffect(() => {
    const session = getCurrentSession();
    if (session) {
      navigate("/dashboard", { replace: true });
    }
  }, [navigate]);

  const handleFileChange = (
    documentType: keyof DocumentFiles,
    file: File | null,
  ) => {
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        toast({
          title: "Archivo inválido",
          description: "Solo se permiten archivos de imagen (JPG, PNG, etc.)",
          variant: "destructive",
        });
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "Archivo muy grande",
          description: "El archivo no debe ser mayor a 5MB",
          variant: "destructive",
        });
        return;
      }

      // Update files
      setFiles((prev) => ({
        ...prev,
        [documentType]: file,
      }));

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviews((prev) => ({
          ...prev,
          [documentType]: e.target?.result as string,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const removeFile = (documentType: keyof DocumentFiles) => {
    setFiles((prev) => ({
      ...prev,
      [documentType]: null,
    }));
    setPreviews((prev) => ({
      ...prev,
      [documentType]: null,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validate all files are uploaded
    if (!files.idDocument || !files.memberCard || !files.facePhoto) {
      setError("Debe subir todos los documentos requeridos");
      toast({
        title: "Documentos faltantes",
        description: "Por favor suba todos los documentos requeridos",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      // In a real application, you would upload files to a server/cloud storage
      // For now, we'll simulate the upload process

      // Simulate upload delay
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Mock upload success
      toast({
        title: "¡Documentos enviados!",
        description:
          "Tus documentos han sido enviados para revisión. Te notificaremos cuando tu cuenta sea aprobada.",
      });

      // Redirect to login with success message
      navigate("/login", {
        replace: true,
        state: {
          message:
            "Documentos enviados exitosamente. Tu cuenta está pendiente de aprobación.",
          showDocumentSuccess: true,
        },
      });
    } catch (error) {
      console.error("Upload error:", error);
      setError("Error al subir documentos. Por favor intenta nuevamente.");
      toast({
        title: "Error de carga",
        description: "No se pudieron subir los documentos. Intenta nuevamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const documentTypes = [
    {
      key: "idDocument" as keyof DocumentFiles,
      title: "Documento de Identidad",
      description: "Foto clara de tu DUI, pasaporte o cédula",
      icon: IdCard,
      placeholder: "Seleccionar foto del documento",
    },
    {
      key: "memberCard" as keyof DocumentFiles,
      title: "Carnet de Miembro",
      description: "Foto de tu carnet de miembro del club",
      icon: CreditCard,
      placeholder: "Seleccionar foto del carnet",
    },
    {
      key: "facePhoto" as keyof DocumentFiles,
      title: "Foto de Rostro",
      description: "Selfie o foto clara de tu rostro",
      icon: User,
      placeholder: "Seleccionar foto de rostro",
    },
  ];

  const allFilesUploaded =
    files.idDocument && files.memberCard && files.facePhoto;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <img
            src="/logo.png"
            alt="Logo Club Salvadoreño"
            className="max-w-[200px] mx-auto object-contain mb-4"
          />
          <h1 className="text-3xl font-bold text-white mb-2">
            Subir Documentos
          </h1>
          {newUser && (
            <p className="text-blue-200 text-lg">
              Hola {newUser.fullName}, por favor sube los siguientes documentos
            </p>
          )}
        </div>

        {/* Progress indicator */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="flex items-center justify-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-white" />
              </div>
              <span className="text-white text-sm">Registro Completado</span>
            </div>
            <div className="w-16 h-0.5 bg-white/30"></div>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <Upload className="w-5 h-5 text-white" />
              </div>
              <span className="text-white text-sm font-semibold">
                Subir Documentos
              </span>
            </div>
            <div className="w-16 h-0.5 bg-white/30"></div>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-white/30 rounded-full flex items-center justify-center">
                <Eye className="w-5 h-5 text-white/50" />
              </div>
              <span className="text-white/50 text-sm">Revisión</span>
            </div>
          </div>
        </div>

        {/* Main form */}
        <div className="max-w-4xl mx-auto">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Error message */}
            {error && (
              <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-4 flex items-center gap-3">
                <AlertCircle className="h-5 w-5 text-red-400 flex-shrink-0" />
                <p className="text-red-100 text-sm">{error}</p>
              </div>
            )}

            {/* Instructions */}
            <Card className="bg-white/10 border-white/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <FileImage className="w-5 h-5" />
                  Instrucciones Importantes
                </CardTitle>
              </CardHeader>
              <CardContent className="text-white/90">
                <ul className="space-y-2 text-sm">
                  <li>• Asegúrate de que las fotos sean claras y legibles</li>
                  <li>
                    • Los archivos deben ser en formato JPG, PNG o similar
                  </li>
                  <li>• Tamaño máximo por archivo: 5MB</li>
                  <li>
                    • Las fotos serán revisadas por nuestro equipo
                    administrativo
                  </li>
                  <li>
                    • Recibirás una notificación cuando tu cuenta sea aprobada
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Document upload cards */}
            <div className="grid md:grid-cols-3 gap-6">
              {documentTypes.map((docType) => {
                const file = files[docType.key];
                const preview = previews[docType.key];
                const Icon = docType.icon;

                return (
                  <Card
                    key={docType.key}
                    className="bg-white/10 border-white/20"
                  >
                    <CardHeader>
                      <CardTitle className="text-white flex items-center gap-2 text-lg">
                        <Icon className="w-5 h-5" />
                        {docType.title}
                      </CardTitle>
                      <CardDescription className="text-white/70">
                        {docType.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* File input */}
                      <div>
                        <Label
                          htmlFor={docType.key}
                          className="text-white text-sm"
                        >
                          Seleccionar archivo
                        </Label>
                        <Input
                          id={docType.key}
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0] || null;
                            handleFileChange(docType.key, file);
                          }}
                          className="bg-white/90 border-white/30 text-slate-900 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-blue-600 file:text-white file:hover:bg-blue-700"
                        />
                      </div>

                      {/* Preview */}
                      {preview && (
                        <div className="space-y-2">
                          <div className="relative">
                            <img
                              src={preview}
                              alt={`Preview ${docType.title}`}
                              className="w-full h-32 object-cover rounded-lg border border-white/20"
                            />
                            <Button
                              type="button"
                              variant="destructive"
                              size="sm"
                              className="absolute top-2 right-2"
                              onClick={() => removeFile(docType.key)}
                            >
                              ×
                            </Button>
                          </div>
                          <p className="text-green-300 text-xs flex items-center gap-1">
                            <CheckCircle className="w-3 h-3" />
                            Archivo cargado: {file?.name}
                          </p>
                        </div>
                      )}

                      {/* Upload status */}
                      {!file && (
                        <div className="border-2 border-dashed border-white/30 rounded-lg p-6 text-center">
                          <Upload className="w-8 h-8 text-white/50 mx-auto mb-2" />
                          <p className="text-white/70 text-sm">
                            {docType.placeholder}
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Submit button */}
            <div className="text-center pt-6">
              <Button
                type="submit"
                disabled={!allFilesUploaded || isLoading}
                className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-8 py-3 text-lg font-medium"
                size="lg"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Enviando documentos...
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 h-5 w-5" />
                    Enviar Documentos para Aprobación
                  </>
                )}
              </Button>

              {!allFilesUploaded && (
                <p className="text-white/70 text-sm mt-2">
                  Debes subir todos los documentos para continuar
                </p>
              )}
            </div>
          </form>

          {/* Back to register link */}
          <div className="text-center mt-6">
            <Button
              variant="link"
              onClick={() => navigate("/register")}
              className="text-blue-200 hover:text-white"
            >
              ← Volver al registro
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadDocuments;
