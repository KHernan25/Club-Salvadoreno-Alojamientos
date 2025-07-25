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

  // Helper function to get accommodation image
  const getAccommodationImage = (type: string, id: string) => {
    if (type === "casa") {
      const casaImages: { [key: string]: string } = {
        casa1: "/DSC_5197.jpg",
        "casa-1": "/DSC_5197.jpg",
        casa2: "/DSC_5191.jpg",
        "casa-2": "/DSC_5191.jpg",
        casa3: "/DSC_5201.jpg",
        "casa-3": "/DSC_5201.jpg",
        "corinto-casa-1": "/DSC_5508.jpg",
        "corinto-casa-2": "/DSC_5515.jpg",
        "corinto-casa-3": "/DSC_5525.jpg",
        "corinto-casa-4": "/DSC_5529.jpg",
        "corinto-casa-5": "/DSC_5517.jpg",
        "corinto-casa-6": "/DSC_5542.jpg",
      };
      return casaImages[id] || "/DSC_5197.jpg";
    }
    if (type === "suite") {
      return "/DSC_5346.jpg";
    }
    const apartmentImages: { [key: string]: string } = {
      "1A": "/DSC_5212.jpg",
      "1B": "/DSC_5214.jpg",
      "2A": "/DSC_5238.jpg",
      "2B": "/DSC_5244.jpg",
      "3A": "/DSC_5346.jpg",
      "3B": "/DSC_5363.jpg",
    };
    return apartmentImages[id] || "/DSC_5212.jpg";
  };

  const handleMainOptionSelect = (option: string) => {
    setSelectedMainOption(option);
    setSelectedPaymentMethod(null); // Reset payment method when changing main option
  };

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
    if (!selectedMainOption) {
      toast({
        title: "Selecciona una opción",
        description: "Por favor elige si deseas pagar inmediatamente o después",
        variant: "destructive",
      });
      return;
    }

    if (selectedMainOption === "immediate" && !selectedPaymentMethod) {
      toast({
        title: "Selecciona un método de pago",
        description: "Por favor elige cómo deseas realizar el pago inmediato",
        variant: "destructive",
      });
      return;
    }

    // CRITICAL: Enforce file upload requirement for payment_link and transfer methods
    if (
      selectedMainOption === "immediate" &&
      (selectedPaymentMethod === "transfer" ||
        selectedPaymentMethod === "payment_link") &&
      !transferFile
    ) {
      toast({
        title: "Comprobante requerido",
        description:
          selectedPaymentMethod === "transfer"
            ? "Debes subir el comprobante de transferencia antes de continuar"
            : "Debes subir el comprobante de pago del link antes de continuar",
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
      // Save reservation to user's history regardless of payment method
      const newReservation = {
        id: code,
        apartment: accommodationName,
        image: getAccommodationImage(accommodation, accommodationId),
        status: selectedMainOption === "pay_later" ? "pendiente" : "confirmada",
        dates: {
          checkIn,
          checkOut,
          checkInTime: accommodation === "suite" ? "2:00 PM" : "3:00 PM",
          checkOutTime: accommodation === "suite" ? "1:00 PM" : "12:00 MD",
        },
        guests,
        nights: Math.ceil(
          (new Date(checkOut).getTime() - new Date(checkIn).getTime()) /
            (1000 * 60 * 60 * 24),
        ),
        total: totalPrice,
        bookingDate: new Date().toISOString().split("T")[0],
        isPast: false,
        isCurrent: false,
        isFuture: true,
      };

      // Get existing reservations from localStorage
      const existingReservations = JSON.parse(
        localStorage.getItem("user_reservations") || "[]",
      );
      existingReservations.push(newReservation);
      localStorage.setItem(
        "user_reservations",
        JSON.stringify(existingReservations),
      );

      if (selectedMainOption === "pay_later") {
        // Handle pay later (72 hours)
        toast({
          title: "Reserva confirmada - Pago pendiente",
          description: "Tienes 72 horas para completar el pago",
        });
        navigate(
          `/confirmacion/${code}?checkIn=${checkIn}&checkOut=${checkOut}&accommodation=${accommodation}&id=${accommodationId}&name=${encodeURIComponent(accommodationName)}&guests=${guests}&price=${totalPrice}&paymentMethod=pay_later&status=pending&deadline=72`,
        );
      } else if (selectedMainOption === "immediate") {
        // Handle immediate payment options
        if (selectedPaymentMethod === "card") {
          // Redirect to card payment (existing flow)
          navigate(
            `/pago?code=${code}&checkIn=${checkIn}&checkOut=${checkOut}&accommodation=${accommodation}&id=${accommodationId}&name=${encodeURIComponent(accommodationName)}&guests=${guests}&price=${totalPrice}`,
          );
        } else if (selectedPaymentMethod === "payment_link") {
          // Handle payment link with voucher upload requirement
          if (!transferFile) {
            toast({
              title: "Comprobante requerido",
              description:
                "Por favor sube el comprobante de pago del link enviado",
              variant: "destructive",
            });
            return;
          }
          toast({
            title: "Pago con link registrado",
            description: "Tu comprobante ha sido enviado para verificación",
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
          // Handle credit payment - now pending status
          toast({
            title: "Pago con crédito registrado",
            description:
              "Se efectuará el cobro en el siguiente ciclo de facturación junto con tu membresía",
          });
          navigate(
            `/confirmacion/${code}?checkIn=${checkIn}&checkOut=${checkOut}&accommodation=${accommodation}&id=${accommodationId}&name=${encodeURIComponent(accommodationName)}&guests=${guests}&price=${totalPrice}&paymentMethod=credit&status=pending`,
          );
        }
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

  const mainOptions = [
    {
      id: "immediate",
      title: "Pagar Inmediatamente",
      description: "Procesar el pago ahora mismo",
      icon: <CreditCard className="h-6 w-6" />,
      color: "bg-blue-500",
      badge: "Recomendado",
      badgeColor: "bg-blue-100 text-blue-700",
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

  const immediatePaymentMethods = [
    {
      id: "card",
      title: "Tarjeta de Débito o Crédito",
      description: "Pago seguro con tarjeta",
      icon: <CreditCard className="h-5 w-5" />,
      color: "bg-blue-500",
    },
    {
      id: "payment_link",
      title: "Link de Pago",
      description: "Recibe un enlace por correo",
      icon: <Link className="h-5 w-5" />,
      color: "bg-purple-500",
    },
    {
      id: "transfer",
      title: "Transferencia Bancaria",
      description: "Sube el comprobante de pago",
      icon: <Upload className="h-5 w-5" />,
      color: "bg-green-500",
    },
    {
      id: "credit",
      title: "Pago con Crédito",
      description: "Cobro en siguiente facturación con membresía",
      icon: <Banknote className="h-5 w-5" />,
      color: "bg-yellow-500",
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

          {/* Main Options */}
          <div className="grid gap-4">
            {mainOptions.map((option) => (
              <Card
                key={option.id}
                className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                  selectedMainOption === option.id
                    ? "ring-2 ring-blue-500 shadow-lg"
                    : "hover:ring-1 hover:ring-gray-300"
                }`}
                onClick={() => handleMainOptionSelect(option.id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div
                        className={`${option.color} p-3 rounded-full text-white`}
                      >
                        {option.icon}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-lg">
                            {option.title}
                          </h3>
                          {option.badge && (
                            <Badge className={option.badgeColor}>
                              {option.badge}
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-600">
                          {option.description}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      {selectedMainOption === option.id && (
                        <CheckCircle className="h-6 w-6 text-blue-500" />
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Immediate Payment Sub-options */}
          {selectedMainOption === "immediate" && (
            <div className="space-y-4">
              <div className="border-t pt-4">
                <h3 className="text-lg font-semibold mb-4 text-center">
                  Selecciona tu método de pago inmediato
                </h3>
                <div className="grid gap-3">
                  {immediatePaymentMethods.map((method) => (
                    <Card
                      key={method.id}
                      className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                        selectedPaymentMethod === method.id
                          ? "ring-2 ring-green-500 shadow-lg bg-green-50"
                          : "hover:ring-1 hover:ring-gray-300"
                      }`}
                      onClick={() => handlePaymentMethodSelect(method.id)}
                    >
                      <CardContent className="p-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div
                              className={`${method.color} p-2 rounded-full text-white`}
                            >
                              {method.icon}
                            </div>
                            <div>
                              <h4 className="font-medium">{method.title}</h4>
                              <p className="text-sm text-gray-600">
                                {method.description}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center">
                            {selectedPaymentMethod === method.id && (
                              <CheckCircle className="h-5 w-5 text-green-500" />
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Payment Link File Upload */}
          {selectedMainOption === "immediate" &&
            selectedPaymentMethod === "payment_link" && (
              <div className="space-y-4 p-4 bg-purple-50 border border-purple-200 rounded-lg">
                <h4 className="font-semibold text-purple-800">
                  Información de Pago por Link
                </h4>
                <div className="text-sm space-y-2 text-purple-700">
                  <div>
                    <strong>Paso 1:</strong> Se enviará un link de pago seguro a
                    tu correo electrónico
                  </div>
                  <div>
                    <strong>Paso 2:</strong> Realiza el pago usando el link
                    enviado
                  </div>
                  <div>
                    <strong>Paso 3:</strong> Sube el comprobante de pago aquí
                  </div>
                  <div>
                    <strong>Monto:</strong>{" "}
                    {formatPrice(reservationData.totalPrice)}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="payment-link-upload">
                    Subir Comprobante de Pago del Link
                  </Label>
                  <Input
                    id="payment-link-upload"
                    type="file"
                    accept="image/*,.pdf"
                    onChange={handleFileUpload}
                    className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
                  />
                  {transferFile && (
                    <div className="flex items-center gap-2 text-sm text-purple-600">
                      <CheckCircle className="h-4 w-4" />
                      <span>{transferFile.name} cargado exitosamente</span>
                    </div>
                  )}
                </div>
              </div>
            )}

          {/* Transfer File Upload */}
          {selectedMainOption === "immediate" &&
            selectedPaymentMethod === "transfer" && (
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

          {/* Credit Payment Information */}
          {selectedMainOption === "immediate" &&
            selectedPaymentMethod === "credit" && (
              <div className="space-y-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <h4 className="font-semibold text-yellow-800">
                  Información de Pago con Crédito
                </h4>
                <div className="text-sm space-y-2 text-yellow-700">
                  <div>
                    <strong>Cobro automático:</strong> Se efectuará el cobro en
                    el siguiente ciclo de facturación
                  </div>
                  <div>
                    <strong>Incluirá:</strong> Esta reserva + pago de membresía
                    + otros pagos pendientes
                  </div>
                  <div>
                    <strong>Estado:</strong> La reserva quedará como pendiente
                    hasta la confirmación del cobro
                  </div>
                  <div>
                    <strong>Monto de esta reserva:</strong>{" "}
                    {formatPrice(reservationData.totalPrice)}
                  </div>
                </div>
                <div className="bg-yellow-100 p-3 rounded-lg border border-yellow-300">
                  <div className="flex gap-2">
                    <AlertCircle className="h-4 w-4 text-yellow-600 flex-shrink-0 mt-0.5" />
                    <div className="text-xs text-yellow-800">
                      <strong>Nota:</strong> La reserva se confirmará
                      automáticamente una vez procesado el cobro en tu siguiente
                      facturación. Recibirás notificaciones sobre el estado del
                      pago.
                    </div>
                  </div>
                </div>
              </div>
            )}

          {/* Pay Later Warning */}
          {selectedMainOption === "pay_later" && (
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
              disabled={
                isProcessing ||
                !selectedMainOption ||
                (selectedMainOption === "immediate" &&
                  !selectedPaymentMethod) ||
                (selectedMainOption === "immediate" &&
                  (selectedPaymentMethod === "transfer" ||
                    selectedPaymentMethod === "payment_link") &&
                  !transferFile)
              }
            >
              {isProcessing ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Procesando...
                </>
              ) : selectedMainOption === "pay_later" ? (
                "Confirmar Reserva - Pagar Después"
              ) : selectedMainOption === "immediate" &&
                selectedPaymentMethod ? (
                "Confirmar Método de Pago"
              ) : (
                "Seleccionar Opción"
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
