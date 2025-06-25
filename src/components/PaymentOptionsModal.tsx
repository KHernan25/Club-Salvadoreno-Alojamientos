import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import {
  CreditCard,
  Clock,
  Upload,
  Banknote,
  Link,
  AlertCircle,
  CheckCircle,
  Calendar,
} from "lucide-react";
import { formatPrice } from "@/lib/pricing-system";

interface PaymentOptionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  reservationData: {
    code: string;
    checkIn: string;
    checkOut: string;
    accommodation: string;
    accommodationId: string;
    accommodationName: string;
    guests: number;
    totalPrice: number;
  };
}

export const PaymentOptionsModal = ({
  isOpen,
  onClose,
  reservationData,
}: PaymentOptionsModalProps) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [selectedMainOption, setSelectedMainOption] = useState<string | null>(
    null,
  );
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<
    string | null
  >(null);
  const [transferFile, setTransferFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePaymentMethodSelect = (method: string) => {
    setSelectedPaymentMethod(method);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      const allowedTypes = [
        "image/jpeg",
        "image/png",
        "image/jpg",
        "application/pdf",
      ];
      if (allowedTypes.includes(file.type)) {
        setTransferFile(file);
        toast({
          title: "Archivo cargado",
          description: `${file.name} ha sido cargado exitosamente`,
        });
      } else {
        toast({
          title: "Tipo de archivo no válido",
          description: "Por favor sube una imagen (JPG, PNG) o PDF",
          variant: "destructive",
        });
      }
    }
  };

  const handleConfirmPayment = async () => {
    if (!selectedPaymentMethod) {
      toast({
        title: "Selecciona un método de pago",
        description: "Por favor elige cómo deseas realizar el pago",
        variant: "destructive",
      });
      return;
    }

    if (selectedPaymentMethod === "transfer" && !transferFile) {
      toast({
        title: "Voucher requerido",
        description: "Por favor sube el comprobante de transferencia",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);

    // Simulate processing time
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const {
      code,
      checkIn,
      checkOut,
      accommodation,
      accommodationId,
      accommodationName,
      guests,
      totalPrice,
    } = reservationData;

    try {
      if (selectedPaymentMethod === "immediate") {
        // Redirect to immediate payment (existing flow)
        navigate(
          `/pago?code=${code}&checkIn=${checkIn}&checkOut=${checkOut}&accommodation=${accommodation}&id=${accommodationId}&name=${encodeURIComponent(accommodationName)}&guests=${guests}&price=${totalPrice}`,
        );
      } else if (selectedPaymentMethod === "payment_link") {
        // Simulate payment link generation
        toast({
          title: "Link de pago generado",
          description: "Se ha enviado un link de pago a tu correo electrónico",
        });
        navigate(
          `/confirmacion/${code}?checkIn=${checkIn}&checkOut=${checkOut}&accommodation=${accommodation}&id=${accommodationId}&name=${encodeURIComponent(accommodationName)}&guests=${guests}&price=${totalPrice}&paymentMethod=payment_link&status=pending`,
        );
      } else if (selectedPaymentMethod === "transfer") {
        // Handle transfer with voucher
        toast({
          title: "Transferencia registrada",
          description: "Tu comprobante ha sido enviado para verificación",
        });
        navigate(
          `/confirmacion/${code}?checkIn=${checkIn}&checkOut=${checkOut}&accommodation=${accommodation}&id=${accommodationId}&name=${encodeURIComponent(accommodationName)}&guests=${guests}&price=${totalPrice}&paymentMethod=transfer&status=pending`,
        );
      } else if (selectedPaymentMethod === "credit") {
        // Handle credit payment
        toast({
          title: "Pago con crédito registrado",
          description: "Tu reserva ha sido registrada para pago con crédito",
        });
        navigate(
          `/confirmacion/${code}?checkIn=${checkIn}&checkOut=${checkOut}&accommodation=${accommodation}&id=${accommodationId}&name=${encodeURIComponent(accommodationName)}&guests=${guests}&price=${totalPrice}&paymentMethod=credit&status=confirmed`,
        );
      } else if (selectedPaymentMethod === "pay_later") {
        // Handle pay later (72 hours)
        toast({
          title: "Reserva confirmada - Pago pendiente",
          description: "Tienes 72 horas para completar el pago",
        });
        navigate(
          `/confirmacion/${code}?checkIn=${checkIn}&checkOut=${checkOut}&accommodation=${accommodation}&id=${accommodationId}&name=${encodeURIComponent(accommodationName)}&guests=${guests}&price=${totalPrice}&paymentMethod=pay_later&status=pending&deadline=72`,
        );
      }

      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: "Hubo un problema procesando tu solicitud",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const paymentMethods = [
    {
      id: "immediate",
      title: "Pagar Inmediatamente",
      description: "Tarjeta de crédito o débito",
      icon: <CreditCard className="h-6 w-6" />,
      color: "bg-blue-500",
      badge: "Recomendado",
      badgeColor: "bg-blue-100 text-blue-700",
    },
    {
      id: "payment_link",
      title: "Link de Pago",
      description: "Recibe un enlace por correo",
      icon: <Link className="h-6 w-6" />,
      color: "bg-purple-500",
    },
    {
      id: "transfer",
      title: "Transferencia Bancaria",
      description: "Sube el comprobante de pago",
      icon: <Upload className="h-6 w-6" />,
      color: "bg-green-500",
    },
    {
      id: "credit",
      title: "Pago con Crédito",
      description: "Usar crédito disponible",
      icon: <Banknote className="h-6 w-6" />,
      color: "bg-yellow-500",
    },
    {
      id: "pay_later",
      title: "Pagar Después",
      description: "72 horas para completar el pago",
      icon: <Clock className="h-6 w-6" />,
      color: "bg-orange-500",
      badge: "72 horas",
      badgeColor: "bg-orange-100 text-orange-700",
    },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">
            Opciones de Pago
          </DialogTitle>
          <DialogDescription className="text-center">
            Elige cómo deseas realizar el pago de tu reserva
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Reservation Summary */}
          <div className="bg-slate-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-2">Resumen de Reserva</h3>
            <div className="text-sm space-y-1">
              <div>📍 {reservationData.accommodationName}</div>
              <div>
                📅 {reservationData.checkIn} - {reservationData.checkOut}
              </div>
              <div>
                👥 {reservationData.guests} huésped
                {reservationData.guests > 1 ? "es" : ""}
              </div>
              <div className="font-bold text-lg text-blue-600">
                💰 Total: {formatPrice(reservationData.totalPrice)}
              </div>
            </div>
          </div>

          {/* Payment Methods */}
          <div className="grid gap-4">
            {paymentMethods.map((method) => (
              <Card
                key={method.id}
                className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                  selectedPaymentMethod === method.id
                    ? "ring-2 ring-blue-500 shadow-lg"
                    : "hover:ring-1 hover:ring-gray-300"
                }`}
                onClick={() => handlePaymentMethodSelect(method.id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div
                        className={`${method.color} p-3 rounded-full text-white`}
                      >
                        {method.icon}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold">{method.title}</h3>
                          {method.badge && (
                            <Badge className={method.badgeColor}>
                              {method.badge}
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-600">
                          {method.description}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      {selectedPaymentMethod === method.id && (
                        <CheckCircle className="h-6 w-6 text-blue-500" />
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Transfer File Upload */}
          {selectedPaymentMethod === "transfer" && (
            <div className="space-y-4 p-4 bg-green-50 border border-green-200 rounded-lg">
              <h4 className="font-semibold text-green-800">
                Datos para Transferencia
              </h4>
              <div className="text-sm space-y-2 text-green-700">
                <div>
                  <strong>Banco:</strong> Banco Agrícola
                </div>
                <div>
                  <strong>Cuenta:</strong> 1234-5678-9012-3456
                </div>
                <div>
                  <strong>Titular:</strong> Club Salvadoreño S.A. de C.V.
                </div>
                <div>
                  <strong>Monto:</strong>{" "}
                  {formatPrice(reservationData.totalPrice)}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="voucher-upload">
                  Subir Comprobante de Transferencia
                </Label>
                <Input
                  id="voucher-upload"
                  type="file"
                  accept="image/*,.pdf"
                  onChange={handleFileUpload}
                  className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
                />
                {transferFile && (
                  <div className="flex items-center gap-2 text-sm text-green-600">
                    <CheckCircle className="h-4 w-4" />
                    <span>{transferFile.name} cargado exitosamente</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Pay Later Warning */}
          {selectedPaymentMethod === "pay_later" && (
            <div className="bg-orange-50 border border-orange-200 p-4 rounded-lg">
              <div className="flex gap-3">
                <AlertCircle className="h-5 w-5 text-orange-500 flex-shrink-0 mt-0.5" />
                <div className="text-sm">
                  <h4 className="font-semibold text-orange-800 mb-1">
                    Importante: Plazo de 72 horas
                  </h4>
                  <ul className="space-y-1 text-orange-700">
                    <li>• Tienes 72 horas para completar el pago</li>
                    <li>
                      • Las fechas quedarán bloqueadas durante este tiempo
                    </li>
                    <li>
                      • Si no pagas en el plazo, la reserva se cancelará
                      automáticamente
                    </li>
                    <li>• Recibirás recordatorios por correo electrónico</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1"
              disabled={isProcessing}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleConfirmPayment}
              className="flex-1 bg-blue-600 hover:bg-blue-700"
              disabled={isProcessing || !selectedPaymentMethod}
            >
              {isProcessing ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Procesando...
                </>
              ) : (
                "Confirmar Método de Pago"
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
