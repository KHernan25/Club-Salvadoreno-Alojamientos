import { useState } from "react";
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
import { useNavigate, useParams } from "react-router-dom";
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
} from "lucide-react";
import Navbar from "@/components/Navbar";

const ReservationConfirmation = () => {
  const navigate = useNavigate();
  const { reservationCode } = useParams();

  // Simulated reservation data - in real app this would come from API
  const reservationData = {
    code: reservationCode || "8STM347L8",
    status: "Confirmada",
    apartment: {
      name: "Apartamento 1A",
      image: "/placeholder.svg",
      address: "Club Salvadoreño, El Sunzal, La Libertad, El Salvador",
    },
    dates: {
      checkIn: "2025-06-07",
      checkOut: "2025-06-08",
      checkInTime: "3:00 PM",
      checkOutTime: "12:00 MD",
      nights: 1,
    },
    guests: {
      adults: 2,
      total: 2,
    },
    payment: {
      total: 230,
      method: "Tarjeta de Crédito",
      lastFour: "****",
      date: "2025-01-31",
      transactionId: "TXN789456123",
    },
    guest: {
      name: "María González",
      email: "maria.gonzalez@email.com",
      phone: "+503 7888-9999",
    },
    amenities: [
      "2 camas full",
      "LCD Smart TV Pantalla Plana",
      "Internet Wi-Fi",
      "1 Baño",
      "Vajilla y Utensilios de cocina",
      "Caja Fuerte",
      "Cafetera",
      "Aire Acondicionado",
    ],
    instructions: {
      checkIn: [
        "Presentarse en recepción del Club Salvadoreño a partir de las 3:00 PM",
        "Traer documento de identidad válido",
        "Mostrar código de confirmación: 8STM347L8",
        "El personal le entregará las llaves y orientaciones del apartamento",
      ],
      policies: [
        "Check-in: 3:00 PM - Check-out: 12:00 MD",
        "Política de cancelación: 48 horas antes",
        "No se permiten mascotas",
        "No fumar dentro del apartamento",
        "Máximo 2 huéspedes por apartamento",
      ],
    },
    contact: {
      reception: "+503 2222-3333",
      emergency: "+503 7777-8888",
      email: "reservas@clubsalvadoreno.com",
    },
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("es-ES", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="mb-6">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-12 w-12 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">
              ¡Reserva Confirmada!
            </h1>
            <p className="text-lg text-slate-600">
              Tu pago se procesó exitosamente. Hemos enviado los detalles a tu
              correo electrónico.
            </p>
          </div>

          <div className="flex justify-center gap-4 mb-8">
            <Button variant="outline" className="gap-2">
              <Download className="h-4 w-4" />
              Descargar PDF
            </Button>
            <Button variant="outline" className="gap-2">
              <Share2 className="h-4 w-4" />
              Compartir
            </Button>
            <Button variant="outline" className="gap-2">
              <PrinterIcon className="h-4 w-4" />
              Imprimir
            </Button>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
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
                    {reservationData.status}
                  </Badge>
                </div>
                <CardDescription>
                  Código de confirmación:{" "}
                  <span className="font-mono font-bold text-blue-900">
                    {reservationData.code}
                  </span>
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Apartment Info */}
                <div className="flex gap-4">
                  <img
                    src={reservationData.apartment.image}
                    alt={reservationData.apartment.name}
                    className="w-24 h-24 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-slate-900 mb-1">
                      {reservationData.apartment.name}
                    </h3>
                    <div className="flex items-center gap-2 text-slate-600 mb-2">
                      <MapPin className="h-4 w-4" />
                      <span className="text-sm">
                        {reservationData.apartment.address}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-slate-600">
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        {reservationData.guests.total} huéspedes
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {reservationData.dates.nights} noche
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
                      {formatDate(reservationData.dates.checkIn)}
                    </div>
                    <div className="flex items-center gap-2 text-slate-600">
                      <Clock className="h-4 w-4" />
                      <span>
                        A partir de las {reservationData.dates.checkInTime}
                      </span>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 text-slate-600 mb-2">
                      <Calendar className="h-5 w-5 text-red-600" />
                      <span className="font-medium">Check-out</span>
                    </div>
                    <div className="text-lg font-bold text-slate-900">
                      {formatDate(reservationData.dates.checkOut)}
                    </div>
                    <div className="flex items-center gap-2 text-slate-600">
                      <Clock className="h-4 w-4" />
                      <span>
                        Hasta las {reservationData.dates.checkOutTime}
                      </span>
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
                        {reservationData.guest.name}
                      </div>
                    </div>
                    <div>
                      <span className="text-sm text-slate-600">Email:</span>
                      <div className="font-medium">
                        {reservationData.guest.email}
                      </div>
                    </div>
                    <div>
                      <span className="text-sm text-slate-600">Teléfono:</span>
                      <div className="font-medium">
                        {reservationData.guest.phone}
                      </div>
                    </div>
                    <div>
                      <span className="text-sm text-slate-600">Huéspedes:</span>
                      <div className="font-medium">
                        {reservationData.guests.total} personas
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
                        <span className="text-slate-600">Método de pago:</span>
                        <span className="font-medium">
                          {reservationData.payment.method}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Fecha de pago:</span>
                        <span className="font-medium">
                          {reservationData.payment.date}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">
                          ID de transacción:
                        </span>
                        <span className="font-mono text-sm">
                          {reservationData.payment.transactionId}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-slate-600 mb-1">
                      Total Pagado
                    </div>
                    <div className="text-3xl font-bold text-green-600">
                      ${reservationData.payment.total}
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
                  {reservationData.amenities.map((amenity, index) => (
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
          <div className="space-y-6">
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
                  {reservationData.code}
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
                  {reservationData.instructions.checkIn.map(
                    (instruction, index) => (
                      <div key={index} className="flex gap-3">
                        <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold mt-0.5">
                          {index + 1}
                        </div>
                        <span className="text-sm text-slate-700 leading-relaxed">
                          {instruction}
                        </span>
                      </div>
                    ),
                  )}
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
                      {reservationData.contact.reception}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-red-600" />
                  <div>
                    <div className="font-medium">Emergencias</div>
                    <div className="text-sm text-slate-600">
                      {reservationData.contact.emergency}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-green-600" />
                  <div>
                    <div className="font-medium">Email</div>
                    <div className="text-sm text-slate-600">
                      {reservationData.contact.email}
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
                  {reservationData.instructions.policies.map(
                    (policy, index) => (
                      <div
                        key={index}
                        className="text-sm text-slate-600 leading-relaxed"
                      >
                        • {policy}
                      </div>
                    ),
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <div className="space-y-3">
              <Button
                variant="outline"
                className="w-full"
                onClick={() => navigate("/dashboard")}
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

      {/* Footer */}
      <footer className="bg-blue-900 text-white py-8 mt-16">
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
    </div>
  );
};

export default ReservationConfirmation;
