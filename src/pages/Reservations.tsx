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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import {
  getMinimumDate,
  getNextAvailableCheckOut,
  validateReservationDates,
  calculateStayPrice,
  getAccommodationRates,
  formatPrice,
  formatDateSpanish,
} from "@/lib/pricing-system";
import {
  Menu,
  Globe,
  User,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Calendar,
  Users,
  Clock,
} from "lucide-react";
import { PaymentOptionsModal } from "@/components/PaymentOptionsModal";
import BusinessRulesInfo from "@/components/BusinessRulesInfo";
import Navbar from "@/components/Navbar";

const Reservations = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const [selectedMonth, setSelectedMonth] = useState(5); // June (0-based)
  const [selectedYear, setSelectedYear] = useState(2025);
  const [guests, setGuests] = useState(2);

  // Helper function to get accommodation image based on type and ID
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
      return "/DSC_5346.jpg"; // Use suite image
    }
    // Default to apartment images
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

  // Get dates from URL parameters or use defaults (minimum tomorrow)
  const minDate = getMinimumDate();
  const [selectedDates, setSelectedDates] = useState({
    checkIn: searchParams.get("checkIn") || minDate,
    checkOut: searchParams.get("checkOut") || getNextAvailableCheckOut(minDate),
  });

  // Get accommodation info from URL parameters
  const accommodationType = searchParams.get("accommodation") || "apartamento";
  const accommodationId = searchParams.get("id") || "1A";
  const accommodationName = searchParams.get("name") || "Apartamento 1A";
  const totalPrice = searchParams.get("totalPrice");

  // State for price calculation
  const [priceCalculation, setPriceCalculation] = useState(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [dateError, setDateError] = useState("");

  // Generate unique reservation code
  const generateReservationCode = () => {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    const letters = Math.random().toString(36).substring(2, 4).toUpperCase();
    return `${letters}${timestamp.toString().slice(-4)}${random.slice(0, 4)}`;
  };

  // Calculate maximum checkout date (7 days from checkin)
  const getMaxCheckOutDate = (checkInDate: string): string => {
    const checkIn = new Date(checkInDate);
    const maxCheckOut = new Date(checkIn);
    maxCheckOut.setDate(maxCheckOut.getDate() + 7);
    return maxCheckOut.toISOString().split("T")[0];
  };

  const [reservationCode, setReservationCode] = useState(() =>
    generateReservationCode(),
  );

  // Payment modal state
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  // Set minimum date to today
  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    // Ensure check-out is always after check-in
    if (selectedDates.checkIn >= selectedDates.checkOut) {
      const nextDay = getNextAvailableCheckOut(selectedDates.checkIn);
      setSelectedDates((prev) => ({
        ...prev,
        checkOut: nextDay,
      }));
    }
  }, [selectedDates.checkIn]);

  // Calculate prices when dates change
  useEffect(() => {
    if (selectedDates.checkIn && selectedDates.checkOut) {
      calculatePrices();
    }
  }, [selectedDates.checkIn, selectedDates.checkOut, accommodationId]);

  const calculatePrices = () => {
    const validation = validateReservationDates(
      selectedDates.checkIn,
      selectedDates.checkOut,
    );

    if (!validation.valid) {
      setPriceCalculation(null);
      setDateError(validation.error || "Error en las fechas seleccionadas");
      return;
    }

    // Clear any previous errors
    setDateError("");

    const rates = getAccommodationRates(accommodationId);

    if (!rates) {
      setPriceCalculation(null);
      return;
    }

    // Create dates in local timezone to avoid timezone shift issues
    const checkInParts = selectedDates.checkIn.split("-");
    const checkOutParts = selectedDates.checkOut.split("-");

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

    const calculation = calculateStayPrice(checkInDate, checkOutDate, rates);

    setPriceCalculation(calculation);
  };

  // Update calendar when dates change
  useEffect(() => {
    const checkInDate = new Date(selectedDates.checkIn);
    setSelectedMonth(checkInDate.getMonth());
    setSelectedYear(checkInDate.getFullYear());
  }, [selectedDates.checkIn]);

  const months = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ];

  const weekDays = [
    "DOMINGO",
    "LUNES",
    "MARTES",
    "MIÉRCOLES",
    "JUEVES",
    "VIERNES",
    "SÁBADO",
  ];

  // Generate calendar days for the selected month
  const generateCalendarDays = () => {
    const firstDay = new Date(selectedYear, selectedMonth, 1);
    const lastDay = new Date(selectedYear, selectedMonth + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());

    const days = [];
    const currentDate = new Date(startDate);

    // Generate 42 days (6 weeks) to fill the calendar grid
    for (let i = 0; i < 42; i++) {
      days.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return days;
  };

  const getDayStatus = (date: Date) => {
    const dateStr = date.toISOString().split("T")[0];
    const day = date.getDate();

    // Check if it's the selected check-in or check-out date
    if (dateStr === selectedDates.checkIn) return "check-in";
    if (dateStr === selectedDates.checkOut) return "check-out";

    // Check if it's between check-in and check-out
    if (dateStr > selectedDates.checkIn && dateStr < selectedDates.checkOut) {
      return "selected-range";
    }

    // Simulate availability - some days are available, some reserved, some blocked
    if ([15, 16, 23, 24].includes(day)) return "reserved"; // Reserved (rojo)
    if ([10, 11, 17, 18].includes(day)) return "blocked"; // Blocked (gris)
    if (date.getMonth() !== selectedMonth) return "other-month";
    if (dateStr < today) return "past"; // Past dates

    return "available"; // Available (blanco)
  };

  const getDayClass = (status: string) => {
    switch (status) {
      case "check-in":
        return "bg-green-500 text-white font-bold"; // Verde para fechas seleccionadas
      case "check-out":
        return "bg-green-500 text-white font-bold"; // Verde para fechas seleccionadas
      case "selected-range":
        return "bg-green-200 text-green-800 font-medium"; // Verde claro para rango seleccionado
      case "reserved":
        return "bg-red-500 text-white cursor-not-allowed"; // Rojo para fechas reservadas
      case "blocked":
        return "bg-gray-400 text-white cursor-not-allowed"; // Gris para fechas bloqueadas
      case "other-month":
        return "text-gray-300";
      case "past":
        return "text-gray-400 cursor-not-allowed";
      default:
        return "bg-white text-gray-900 hover:bg-gray-50 cursor-pointer border-gray-200"; // Blanco para fechas disponibles
    }
  };

  const previousMonth = () => {
    if (selectedMonth === 0) {
      setSelectedMonth(11);
      setSelectedYear(selectedYear - 1);
    } else {
      setSelectedMonth(selectedMonth - 1);
    }
  };

  const nextMonth = () => {
    if (selectedMonth === 11) {
      setSelectedMonth(0);
      setSelectedYear(selectedYear + 1);
    } else {
      setSelectedMonth(selectedMonth + 1);
    }
  };

  const handleViewAvailability = () => {
    // Generate new reservation code on each availability check
    setReservationCode(generateReservationCode());
    // Update the calendar display
    const checkInDate = new Date(selectedDates.checkIn);
    setSelectedMonth(checkInDate.getMonth());
    setSelectedYear(checkInDate.getFullYear());
  };

  // Calculate pricing based on accommodation type
  const getPricing = () => {
    switch (accommodationType) {
      case "casa":
        return { weekday: 350, weekend: 450, daily: 400 };
      case "suite":
        return { weekday: 650, weekend: 850, daily: 750 };
      default: // apartamento
        return { weekday: 110, weekend: 230, daily: 140 };
    }
  };

  const pricing = getPricing();
  const isWeekend =
    new Date(selectedDates.checkIn).getDay() === 6 ||
    new Date(selectedDates.checkIn).getDay() === 0;
  const currentPrice = isWeekend ? pricing.weekend : pricing.weekday;

  const calendarDays = generateCalendarDays();

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-900 to-blue-800">
      {/* Navigation */}
      <Navbar />

      {/* Hero Section */}
      <section className="relative h-96 bg-gradient-to-b from-blue-900 to-blue-800">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `linear-gradient(rgba(2, 22, 71, 0.69), rgba(2, 21, 71, 0.85)), url('/DSC_5266.jpg')`,
          }}
        />
        <div className="relative z-10 container mx-auto px-4 h-full flex items-center justify-center text-center">
          <div className="text-white">
            <h1 className="text-7xl font-bold mb-4">Reservas</h1>
            <p className="text-xl">
              Explora nuestras opciones de alojamiento, elige tu sede favorita y
              asegura tu lugar con solo unos clics.
            </p>
            <p className="text-xl">Tu descanso comienza aquí.</p>
            <Button
              className="mt-8 bg-blue-700 hover:bg-blue-600 text-white px-8 py-3"
              onClick={() => navigate("/mis-reservas")}
            >
              Ver tus reservas
            </Button>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="bg-white">
        <div className="container mx-auto px-4 py-8">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Calendar Section */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-2xl font-bold text-slate-900">
                      ¡Está Disponible!
                    </CardTitle>
                    <div className="flex items-center gap-4 flex-wrap">
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-white border border-gray-300 rounded"></div>
                        <span className="text-sm text-slate-600">
                          Disponible
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-green-500 rounded"></div>
                        <span className="text-sm text-slate-600">
                          Seleccionada
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-red-500 rounded"></div>
                        <span className="text-sm text-slate-600">
                          Reservada
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-gray-400 rounded"></div>
                        <span className="text-sm text-slate-600">
                          Bloqueada
                        </span>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {/* Calendar Header */}
                  <div className="flex items-center justify-between mb-6">
                    <Button variant="ghost" onClick={previousMonth}>
                      <ChevronLeft className="h-5 w-5" />
                    </Button>
                    <h3 className="text-xl font-bold text-slate-900">
                      {months[selectedMonth]} {selectedYear}
                    </h3>
                    <Button variant="ghost" onClick={nextMonth}>
                      <ChevronRight className="h-5 w-5" />
                    </Button>
                  </div>

                  {/* Calendar Grid */}
                  <div className="grid grid-cols-7 gap-1 mb-4">
                    {weekDays.map((day) => (
                      <div
                        key={day}
                        className="p-2 text-center text-sm font-medium text-slate-600"
                      >
                        {day}
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-7 gap-1">
                    {calendarDays.map((date, index) => {
                      const status = getDayStatus(date);
                      return (
                        <div
                          key={index}
                          className={`
                            p-3 text-center text-sm font-medium border border-slate-200
                            ${getDayClass(status)}
                            ${status === "available" ? "hover:bg-blue-50" : ""}
                          `}
                        >
                          {date.getDate()}
                        </div>
                      );
                    })}
                  </div>

                  <div className="mt-6 text-sm text-slate-600">
                    <p>
                      Puede modificar la fecha de acuerdo a los días
                      disponibles:
                    </p>
                  </div>

                  {/* Date Inputs */}
                  <div className="grid md:grid-cols-2 gap-4 mt-6">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Entrada
                      </label>
                      <input
                        type="date"
                        min={getMinimumDate()}
                        value={selectedDates.checkIn}
                        onChange={(e) =>
                          setSelectedDates({
                            ...selectedDates,
                            checkIn: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <p className="text-xs text-slate-500 mt-1">
                        Selecciona a partir de mañana
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Salida
                      </label>
                      <input
                        type="date"
                        min={getNextAvailableCheckOut(selectedDates.checkIn)}
                        max={getMaxCheckOutDate(selectedDates.checkIn)}
                        value={selectedDates.checkOut}
                        onChange={(e) =>
                          setSelectedDates({
                            ...selectedDates,
                            checkOut: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <p className="text-xs text-slate-500 mt-1">
                        Máximo 7 días consecutivos
                      </p>
                    </div>
                  </div>

                  {/* Error message for date validation */}
                  {dateError && (
                    <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                      <p className="text-sm text-red-600">{dateError}</p>
                    </div>
                  )}

                  <Button
                    className="w-full mt-6 bg-blue-900 hover:bg-blue-800 py-3"
                    onClick={handleViewAvailability}
                  >
                    Ver disponibilidad
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Booking Summary */}
            <div className="space-y-6">
              {/* Reservation Details */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl font-bold text-slate-900">
                    Código de la Reserva:
                  </CardTitle>
                  <Badge className="bg-blue-100 text-blue-800 text-lg font-mono w-fit">
                    {reservationCode}
                  </Badge>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex items-center gap-2 text-slate-600 mb-1">
                      <Calendar className="h-4 w-4" />
                      <span className="text-sm">
                        Ingreso{" "}
                        {accommodationType === "suite" ? "2:00 pm" : "3:00 pm"}:
                      </span>
                    </div>
                    <div className="font-medium">{selectedDates.checkIn}</div>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 text-slate-600 mb-1">
                      <Clock className="h-4 w-4" />
                      <span className="text-sm">
                        Salida{" "}
                        {accommodationType === "suite" ? "1:00 pm" : "12:00 md"}
                        :
                      </span>
                    </div>
                    <div className="font-medium">{selectedDates.checkOut}</div>
                  </div>

                  <div>
                    <div className="text-sm text-slate-600 mb-2">
                      Alojamiento:
                    </div>
                    <div className="bg-slate-100 rounded-lg p-3">
                      <img
                        src={getAccommodationImage(
                          accommodationType,
                          accommodationId,
                        )}
                        alt={accommodationName}
                        className="w-full h-24 object-cover rounded mb-2"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            "/placeholder.svg";
                        }}
                      />
                      <div className="font-medium">
                        {decodeURIComponent(accommodationName)}
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="text-sm text-slate-600 mb-2">Personas:</div>
                    <Select
                      value={guests.toString()}
                      onValueChange={(value) => setGuests(parseInt(value))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1 persona</SelectItem>
                        <SelectItem value="2">2 personas</SelectItem>
                        <SelectItem value="3">3 personas</SelectItem>
                        <SelectItem value="4">4 personas</SelectItem>
                        {accommodationType === "casa" && (
                          <>
                            <SelectItem value="5">5 personas</SelectItem>
                            <SelectItem value="6">6 personas</SelectItem>
                            <SelectItem value="7">7 personas</SelectItem>
                            <SelectItem value="8">8 personas</SelectItem>
                          </>
                        )}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="border-t border-slate-200 pt-4">
                    {/* Detailed Price Breakdown */}
                    {priceCalculation ? (
                      <div className="space-y-3 mb-4">
                        <h4 className="font-semibold text-slate-800 text-sm">
                          Desglose de Precios:
                        </h4>
                        <div className="space-y-2">
                          {priceCalculation.weekdayDays > 0 && (
                            <div className="flex justify-between items-center text-sm">
                              <span className="text-slate-600">
                                {priceCalculation.weekdayDays} noche(s) entre
                                semana
                              </span>
                              <span className="font-medium">
                                {formatPrice(priceCalculation.weekdayTotal)}
                              </span>
                            </div>
                          )}
                          {priceCalculation.weekendDays > 0 && (
                            <div className="flex justify-between items-center text-sm">
                              <span className="text-slate-600">
                                {priceCalculation.weekendDays} noche(s) fin de
                                semana
                              </span>
                              <span className="font-medium">
                                {formatPrice(priceCalculation.weekendTotal)}
                              </span>
                            </div>
                          )}
                          {priceCalculation.holidayDays > 0 && (
                            <div className="flex justify-between items-center text-sm">
                              <span className="text-slate-600">
                                {priceCalculation.holidayDays} noche(s) feriado
                              </span>
                              <span className="font-medium text-red-600">
                                {formatPrice(priceCalculation.holidayTotal)}
                              </span>
                            </div>
                          )}
                        </div>
                        <div className="border-t border-slate-200 pt-2">
                          <div className="flex justify-between items-center">
                            <span className="text-lg font-bold text-slate-900">
                              Total: {formatPrice(priceCalculation.totalPrice)}
                            </span>
                            <Button
                              className="bg-blue-900 hover:bg-blue-800"
                              onClick={() => setIsPaymentModalOpen(true)}
                            >
                              RESERVAR
                            </Button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      // Fallback si no hay cálculo de precios
                      <div className="space-y-2 mb-4">
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-slate-600">
                            {isWeekend ? "Fin de semana" : "Día de semana"}
                          </span>
                          <span className="font-medium">
                            ${currentPrice}.00
                          </span>
                        </div>
                        <div className="border-t border-slate-200 pt-2">
                          <div className="flex justify-between items-center">
                            <span className="text-lg font-bold text-slate-900">
                              Total: ${currentPrice}
                            </span>
                            <Button
                              className="bg-blue-900 hover:bg-blue-800"
                              onClick={() => setIsPaymentModalOpen(true)}
                            >
                              RESERVAR
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Additional Options */}
              <div className="grid grid-cols-2 gap-4">
                <Card className="cursor-pointer hover:shadow-lg transition-shadow">
                  <div className="relative h-24 overflow-hidden rounded-t-lg">
                    <img
                      src="/placeholder.svg"
                      alt="CASAS"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-1 left-1 bg-green-600 text-white px-2 py-1 rounded text-xs">
                      CASAS
                    </div>
                  </div>
                  <CardContent className="p-3">
                    <p className="text-xs text-slate-600 leading-tight mb-2">
                      Perfectas para grupos y familias que buscan privacidad,
                      amplitud y comodidad.
                    </p>
                    <Button
                      size="sm"
                      variant="outline"
                      className="w-full text-xs"
                      onClick={() => navigate("/casa/casa1")}
                    >
                      Ver Detalles
                    </Button>
                  </CardContent>
                </Card>

                <Card className="cursor-pointer hover:shadow-lg transition-shadow">
                  <div className="relative h-24 overflow-hidden rounded-t-lg">
                    <img
                      src="/placeholder.svg"
                      alt="SUITES"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-1 left-1 bg-green-600 text-white px-2 py-1 rounded text-xs">
                      SUITES
                    </div>
                  </div>
                  <CardContent className="p-3">
                    <p className="text-xs text-slate-600 leading-tight mb-2">
                      Pensadas para una estadía íntima, elegante y llena de
                      confort.
                    </p>
                    <Button
                      size="sm"
                      variant="outline"
                      className="w-full text-xs"
                      onClick={() => navigate("/suite/suite1")}
                    >
                      Ver Detalles
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-blue-900 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                <img
                  src="/logo_azul.png"
                  alt="Logo Club Salvadoreño"
                  className="max-w-[30px] mx-auto object-contain"
                />
              </div>
              <span className="text-xl font-semibold">Club Salvadoreño</span>
            </div>
            <p className="text-blue-100">
              © 2025 Club Salvadoreño. Todos los derechos reservados.
            </p>
          </div>
        </div>
      </footer>

      {/* Payment Options Modal */}
      <PaymentOptionsModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        reservationData={{
          code: reservationCode,
          checkIn: selectedDates.checkIn,
          checkOut: selectedDates.checkOut,
          accommodation: accommodationType,
          accommodationId,
          accommodationName,
          guests,
          totalPrice: priceCalculation?.totalPrice || 0,
        }}
      />
    </div>
  );
};

export default Reservations;
