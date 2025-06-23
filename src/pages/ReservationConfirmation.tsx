import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import {
  getAccommodationRates,
  calculateStayPrice,
  formatPrice,
  formatDateSpanish,
} from "@/lib/pricing-system";
import { getAuthenticatedUser } from "@/lib/auth-service";
import {
  Menu,
  Globe,
  User,
  ChevronDown,
  Check,
  Calendar,
  Clock,
  MapPin,
  Phone,
  Mail,
  Download,
  Share2,
  PrinterIcon,
  QrCode,
  Car,
  Wifi,
  Users,
  Utensils,
  CheckCircle,
  Home,
  CreditCard,
  Copy,
} from "lucide-react";

const ReservationConfirmation = () => {
  const navigate = useNavigate();
  const { reservationCode } = useParams();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();

  // Get URL parameters
  const checkIn = searchParams.get("checkIn") || "";
  const checkOut = searchParams.get("checkOut") || "";
  const accommodation = searchParams.get("accommodation") || "apartamento";
  const accommodationId = searchParams.get("id") || "1A";
  const accommodationName = decodeURIComponent(
    searchParams.get("name") || "Apartamento 1A",
  );
  const guests = parseInt(searchParams.get("guests") || "2");
  const totalPrice = parseFloat(searchParams.get("price") || "0");

  // Get authenticated user
  const currentUser = getAuthenticatedUser();

  // State for price breakdown
  const [priceBreakdown, setPriceBreakdown] = useState(null);

  // Calculate detailed price breakdown
  useEffect(() => {
    if (checkIn && checkOut && accommodationId) {
      const rates = getAccommodationRates(accommodationId);
      if (rates) {
        const checkInParts = checkIn.split("-");
        const checkOutParts = checkOut.split("-");

        const checkInDate = new Date(
          parseInt(checkInParts[0]),
          parseInt(checkInParts[1]) - 1,
          parseInt(checkInParts[2]),
        );

        const checkOutDate = new Date(
          parseInt(checkOutParts[0]),
          parseInt(checkOutParts[1]) - 1,
          parseInt(checkOutParts[2]),
        );

        const calculation = calculateStayPrice(
          checkInDate,
          checkOutDate,
          rates,
        );
        setPriceBreakdown(calculation);
      }
    }
  }, [checkIn, checkOut, accommodationId]);

  // Get accommodation type info
  const getAccommodationInfo = () => {
    switch (accommodation) {
      case "casa":
        return {
          location: "Casas Familiares",
          checkInTime: "3:00 PM",
          checkOutTime: "12:00 MD",
          description: "Casa familiar con todas las comodidades",
        };
      case "suite":
        return {
          location: "Suites Premium",
          checkInTime: "2:00 PM",
          checkOutTime: "1:00 PM",
          description: "Suite de lujo con servicios premium",
        };
      default:
        return {
          location: "El Sunzal Apartamentos",
          checkInTime: "3:00 PM",
          checkOutTime: "12:00 MD",
          description: "Apartamento cómodo frente al mar",
        };
    }
  };

  const accommodationInfo = getAccommodationInfo();

  // Calculate number of nights
  const calculateNights = () => {
    if (!checkIn || !checkOut) return 1;
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    const diffTime = checkOutDate.getTime() - checkInDate.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const nights = calculateNights();

  // Format dates for display
  const formatDate = (dateStr: string) => {
    if (!dateStr) return "";
    const dateParts = dateStr.split("-");
    const date = new Date(
      parseInt(dateParts[0]),
      parseInt(dateParts[1]) - 1,
      parseInt(dateParts[2]),
    );
    return formatDateSpanish(date);
  };

  // Get amenities based on accommodation type
  const getAmenities = () => {
    const baseAmenities = [
      "Internet Wi-Fi",
      "Aire Acondicionado",
      "Caja Fuerte",
      "Cafetera",
    ];

    switch (accommodation) {
      case "casa":
        return [
          ...baseAmenities,
          "3-4 habitaciones",
          "Cocina completa",
          "Sala de estar amplia",
          "Terraza privada",
          "Parrilla BBQ",
          "Hasta 8 huéspedes",
        ];
      case "suite":
        return [
          ...baseAmenities,
          "Suite master con vista al mar",
          "Jacuzzi privado",
          "Minibar incluido",
          "Servicio de limpieza diario",
          "Desayuno incluido",
          "Hasta 4 huéspedes",
        ];
      default:
        return [
          ...baseAmenities,
          "2 camas full",
          "LCD Smart TV Pantalla Plana",
          "1 Baño",
          "Vajilla y Utensilios de cocina",
          "Hasta 4 huéspedes",
        ];
    }
  };

  // PDF Download function
  const downloadPDF = () => {
    try {
      const printContent = document.getElementById("reservation-content");
      if (!printContent) return;

      const newWindow = window.open("", "_blank");
      if (!newWindow) return;

      newWindow.document.write(`
        <html>
          <head>
            <title>Confirmación de Reserva - ${reservationCode}</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 20px; }
              .header { text-align: center; margin-bottom: 30px; }
              .code { font-family: monospace; font-weight: bold; color: #1e40af; }
              .section { margin-bottom: 20px; }
              .grid { display: flex; gap: 20px; }
              .col { flex: 1; }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>Club Salvadoreño</h1>
              <h2>Confirmación de Reserva</h2>
              <p class="code">Código: ${reservationCode}</p>
            </div>
            ${printContent.innerHTML}
          </body>
        </html>
      `);

      newWindow.document.close();
      newWindow.print();
      newWindow.close();

      toast({
        title: "PDF generado",
        description:
          "Se ha abierto la ventana de impresión para descargar el PDF.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo generar el PDF. Intenta de nuevo.",
        variant: "destructive",
      });
    }
  };

  // Share function
  const shareReservation = async () => {
    const shareData = {
      title: `Reserva ${reservationCode} - Club Salvadoreño`,
      text: `Mi reserva en ${accommodationName} del ${checkIn} al ${checkOut}`,
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
        toast({
          title: "Compartido exitosamente",
          description: "La información de tu reserva ha sido compartida.",
        });
      } else {
        // Fallback: copy to clipboard
        await navigator.clipboard.writeText(
          `Reserva ${reservationCode} - Club Salvadoreño\n${accommodationName}\n${checkIn} al ${checkOut}\n${window.location.href}`,
        );
        toast({
          title: "Copiado al portapapeles",
          description:
            "La información de tu reserva ha sido copiada al portapapeles.",
        });
      }
    } catch (error) {
      toast({
        title: "Error al compartir",
        description: "No se pudo compartir la reserva. Intenta de nuevo.",
        variant: "destructive",
      });
    }
  };

  // Print function
  const printReservation = () => {
    try {
      window.print();
      toast({
        title: "Imprimiendo...",
        description: "Se ha abierto el diálogo de impresión.",
      });
    } catch (error) {
      toast({
        title: "Error de impresión",
        description: "No se pudo imprimir. Intenta de nuevo.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50 print:hidden">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div
                className="flex items-center gap-3 cursor-pointer"
                onClick={() => navigate("/")}
              >
                <div className="w-10 h-10 bg-blue-900 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">CS</span>
                </div>
                <span className="text-xl font-semibold text-slate-900">
                  Club Salvadoreño
                </span>
              </div>
            </div>

            <div className="flex items-center gap-6">
              <Button variant="ghost" className="gap-2">
                <Globe className="h-4 w-4" />
                ES
                <ChevronDown className="h-4 w-4" />
              </Button>
              <Button variant="ghost" className="gap-2">
                <User className="h-4 w-4" />
                {currentUser?.firstName || "Usuario"}
              </Button>
              <Button variant="ghost">
                <Menu className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        {/* Success Header */}
        <div className="text-center mb-8 print:mb-4">
          <div className="mb-6">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 print:hidden">
              <CheckCircle className="h-12 w-12 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2 print:text-2xl">
              ¡Reserva Confirmada!
            </h1>
            <p className="text-lg text-slate-600 print:text-base">
              Tu pago se procesó exitosamente. Hemos enviado los detalles a tu
              correo electrónico.
            </p>
          </div>

          <div className="flex justify-center gap-4 mb-8 print:hidden">
            <Button variant="outline" className="gap-2" onClick={downloadPDF}>
              <Download className="h-4 w-4" />
              Descargar PDF
            </Button>
            <Button
              variant="outline"
              className="gap-2"
              onClick={shareReservation}
            >
              <Share2 className="h-4 w-4" />
              Compartir
            </Button>
            <Button
              variant="outline"
              className="gap-2"
              onClick={printReservation}
            >
              <PrinterIcon className="h-4 w-4" />
              Imprimir
            </Button>
          </div>
        </div>

        <div id="reservation-content">
          <div className="grid lg:grid-cols-3 gap-8 print:grid-cols-1">
            {/* Main Reservation Details */}
            <div className="lg:col-span-2 space-y-6">
              {/* Reservation Summary */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-2xl font-bold text-slate-900">
                      Detalles de tu Reserva
                    </CardTitle>
                    <Badge className="bg-green-100 text-green-800 text-lg px-4 py-2">
                      Confirmada
                    </Badge>
                  </div>
                  <CardDescription>
                    Código de confirmación:{" "}
                    <span className="font-mono font-bold text-blue-900">
                      {reservationCode}
                    </span>
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Apartment Info */}
                  <div className="flex gap-4">
                    <img
                      src="/placeholder.svg"
                      alt={accommodationName}
                      className="w-24 h-24 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-slate-900 mb-1">
                        {accommodationName}
                      </h3>
                      <div className="flex items-center gap-2 text-slate-600 mb-2">
                        <MapPin className="h-4 w-4" />
                        <span className="text-sm">
                          Club Salvadoreño, {accommodationInfo.location}, El
                          Salvador
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-slate-600">
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          {guests} huéspedes
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {nights} noche{nights > 1 ? "s" : ""}
                        </div>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Dates and Times */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <div className="flex items-center gap-2 text-slate-600 mb-2">
                        <Calendar className="h-5 w-5 text-green-600" />
                        <span className="font-medium">Check-in</span>
                      </div>
                      <div className="text-lg font-bold text-slate-900">
                        {formatDate(checkIn)}
                      </div>
                      <div className="flex items-center gap-2 text-slate-600">
                        <Clock className="h-4 w-4" />
                        <span>
                          A partir de las {accommodationInfo.checkInTime}
                        </span>
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center gap-2 text-slate-600 mb-2">
                        <Calendar className="h-5 w-5 text-red-600" />
                        <span className="font-medium">Check-out</span>
                      </div>
                      <div className="text-lg font-bold text-slate-900">
                        {formatDate(checkOut)}
                      </div>
                      <div className="flex items-center gap-2 text-slate-600">
                        <Clock className="h-4 w-4" />
                        <span>Hasta las {accommodationInfo.checkOutTime}</span>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Guest Information */}
                  <div>
                    <h4 className="font-bold text-slate-900 mb-3">
                      Información del Huésped Principal
                    </h4>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <span className="text-sm text-slate-600">Nombre:</span>
                        <div className="font-medium">
                          {currentUser?.firstName} {currentUser?.lastName}
                        </div>
                      </div>
                      <div>
                        <span className="text-sm text-slate-600">Email:</span>
                        <div className="font-medium">{currentUser?.email}</div>
                      </div>
                      <div>
                        <span className="text-sm text-slate-600">
                          Teléfono:
                        </span>
                        <div className="font-medium">
                          {currentUser?.phone || "+503 ----"}
                        </div>
                      </div>
                      <div>
                        <span className="text-sm text-slate-600">
                          Huéspedes:
                        </span>
                        <div className="font-medium">
                          {guests} persona{guests > 1 ? "s" : ""}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Payment Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    Información de Pago
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-slate-600">
                            Método de pago:
                          </span>
                          <span className="font-medium">
                            Tarjeta de Crédito
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-600">Fecha de pago:</span>
                          <span className="font-medium">
                            {new Date().toLocaleDateString("es-ES")}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-600">
                            ID de transacción:
                          </span>
                          <span className="font-mono text-sm">
                            TXN{Date.now().toString().slice(-8)}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-slate-600 mb-1">
                        Total Pagado
                      </div>

                      {/* Price Breakdown Display */}
                      {priceBreakdown && (
                        <div className="text-sm text-slate-600 mb-2 space-y-1">
                          {priceBreakdown.weekdayDays > 0 && (
                            <div className="flex justify-between">
                              <span>
                                {priceBreakdown.weekdayDays} noche(s) entre
                                semana:
                              </span>
                              <span>
                                {formatPrice(priceBreakdown.weekdayTotal)}
                              </span>
                            </div>
                          )}
                          {priceBreakdown.weekendDays > 0 && (
                            <div className="flex justify-between">
                              <span>
                                {priceBreakdown.weekendDays} noche(s) fin de
                                semana:
                              </span>
                              <span>
                                {formatPrice(priceBreakdown.weekendTotal)}
                              </span>
                            </div>
                          )}
                          {priceBreakdown.holidayDays > 0 && (
                            <div className="flex justify-between">
                              <span>
                                {priceBreakdown.holidayDays} noche(s) feriado:
                              </span>
                              <span>
                                {formatPrice(priceBreakdown.holidayTotal)}
                              </span>
                            </div>
                          )}
                          <Separator className="my-2" />
                        </div>
                      )}

                      <div className="text-3xl font-bold text-green-600">
                        {formatPrice(totalPrice)}
                      </div>
                      <Badge className="bg-green-100 text-green-800 mt-2">
                        <Check className="h-3 w-3 mr-1" />
                        Pagado
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Amenities */}
              <Card>
                <CardHeader>
                  <CardTitle>Amenidades Incluidas</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-3">
                    {getAmenities().map((amenity, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-green-600" />
                        <span className="text-slate-700">{amenity}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6 print:hidden">
              {/* QR Code */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-center">Código QR</CardTitle>
                  <CardDescription className="text-center">
                    Presenta este código en recepción
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <div className="w-32 h-32 bg-slate-100 rounded-lg mx-auto mb-4 flex items-center justify-center">
                    <QrCode className="h-16 w-16 text-slate-400" />
                  </div>
                  <div className="font-mono text-sm text-slate-600">
                    {reservationCode}
                  </div>
                </CardContent>
              </Card>

              {/* Check-in Instructions */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Home className="h-5 w-5" />
                    Instrucciones de Check-in
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      "Presentarse en recepción del Club Salvadoreño a partir de las " +
                        accommodationInfo.checkInTime,
                      "Traer documento de identidad válido",
                      `Mostrar código de confirmación: ${reservationCode}`,
                      "El personal le entregará las llaves y orientaciones del alojamiento",
                    ].map((instruction, index) => (
                      <div key={index} className="flex gap-3">
                        <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold mt-0.5">
                          {index + 1}
                        </div>
                        <span className="text-sm text-slate-700 leading-relaxed">
                          {instruction}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Contact Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Información de Contacto</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Phone className="h-5 w-5 text-blue-600" />
                    <div>
                      <div className="font-medium">Recepción</div>
                      <div className="text-sm text-slate-600">
                        +503 2222-3333
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Phone className="h-5 w-5 text-red-600" />
                    <div>
                      <div className="font-medium">Emergencias</div>
                      <div className="text-sm text-slate-600">
                        +503 7777-8888
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-green-600" />
                    <div>
                      <div className="font-medium">Email</div>
                      <div className="text-sm text-slate-600">
                        reservas@clubsalvadoreno.com
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Policies */}
              <Card>
                <CardHeader>
                  <CardTitle>Políticas Importantes</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {[
                      `Check-in: ${accommodationInfo.checkInTime} - Check-out: ${accommodationInfo.checkOutTime}`,
                      "Política de cancelación: 48 horas antes",
                      "No se permiten mascotas",
                      "No fumar dentro del alojamiento",
                      `Máximo ${guests} huéspedes por reserva`,
                      "Presentar documento de identidad válido",
                    ].map((policy, index) => (
                      <div
                        key={index}
                        className="text-sm text-slate-600 leading-relaxed"
                      >
                        • {policy}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Actions */}
              <div className="space-y-3">
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => navigate("/mis-reservas")}
                >
                  Ver Mis Reservas
                </Button>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => navigate("/alojamientos")}
                >
                  Nueva Reserva
                </Button>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => navigate("/dashboard")}
                >
                  Volver al Inicio
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-blue-900 text-white py-8 mt-16 print:hidden">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                <span className="text-blue-900 font-bold text-sm">CS</span>
              </div>
              <span className="text-xl font-semibold">Club Salvadoreño</span>
            </div>
            <p className="text-blue-100">
              © 2025 Club Salvadoreño. Todos los derechos reservados.
            </p>
          </div>
        </div>
      </footer>

      <style jsx>{`
        @media print {
          body {
            margin: 0;
          }
          .print\\:hidden {
            display: none !important;
          }
          .print\\:mb-4 {
            margin-bottom: 1rem !important;
          }
          .print\\:text-2xl {
            font-size: 1.5rem !important;
          }
          .print\\:text-base {
            font-size: 1rem !important;
          }
          .print\\:grid-cols-1 {
            grid-template-columns: repeat(1, minmax(0, 1fr)) !important;
          }
        }
      `}</style>
    </div>
  );
};

export default ReservationConfirmation;
