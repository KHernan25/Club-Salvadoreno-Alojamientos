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

const Reservations = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const [selectedMonth, setSelectedMonth] = useState(5); // June (0-based)
  const [selectedYear, setSelectedYear] = useState(2025);
  const [guests, setGuests] = useState(2);

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

  // Generate unique reservation code
  const generateReservationCode = () => {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    const letters = Math.random().toString(36).substring(2, 4).toUpperCase();
    return `${letters}${timestamp.toString().slice(-4)}${random.slice(0, 4)}`;
  };

  const [reservationCode, setReservationCode] = useState(() =>
    generateReservationCode(),
  );

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
      return;
    }

    const rates = getAccommodationRates(accommodationId);

    if (!rates) {
      setPriceCalculation(null);
      return;
    }

    const calculation = calculateStayPrice(
      new Date(selectedDates.checkIn),
      new Date(selectedDates.checkOut),
      rates,
    );

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
    if ([15, 16, 23, 24].includes(day)) return "reserved"; // Reserved
    if (date.getMonth() !== selectedMonth) return "other-month";
    if (dateStr < today) return "past"; // Past dates

    return "available";
  };

  const getDayClass = (status: string) => {
    switch (status) {
      case "check-in":
        return "bg-green-500 text-white font-bold";
      case "check-out":
        return "bg-red-500 text-white font-bold";
      case "selected-range":
        return "bg-blue-200 text-blue-800";
      case "reserved":
        return "bg-gray-400 text-white";
      case "other-month":
        return "text-gray-300";
      case "past":
        return "text-gray-400 cursor-not-allowed";
      default:
        return "hover:bg-blue-100 cursor-pointer";
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
      <nav className="bg-white/10 backdrop-blur-sm border-b border-white/20">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div
                className="flex items-center gap-3 cursor-pointer"
                onClick={() => navigate("/dashboard")}
              >
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                  <span className="text-blue-900 font-bold text-sm">CS</span>
                </div>
                <span className="text-xl font-semibold text-white">
                  Club Salvadoreño
                </span>
              </div>
            </div>

            <div className="flex items-center gap-6">
              <Button
                variant="ghost"
                className="gap-2 text-white hover:bg-white/10"
              >
                <Globe className="h-4 w-4" />
                ES
                <ChevronDown className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                className="gap-2 text-white hover:bg-white/10"
              >
                <User className="h-4 w-4" />
                EN
              </Button>
              <Button variant="ghost" className="text-white hover:bg-white/10">
                <Menu className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold text-white mb-4">Reservas</h1>
          <p className="text-xl text-blue-100 mb-2">
            Explora nuestras opciones de alojamiento, elige tu sede favorita y
            asegura tu lugar con solo unos clics.
          </p>
          <p className="text-lg text-blue-200">Tu descanso comienza aquí.</p>
          <Button
            className="mt-8 bg-blue-700 hover:bg-blue-600 text-white px-8 py-3"
            onClick={() => navigate("/mis-reservas")}
          >
            Ver tus reservas
          </Button>
        </div>
      </section>

      {/* Desktop indicator */}
      <div className="bg-white/10 py-2 px-4">
        <div className="container mx-auto px-4">
          <span className="text-sm text-blue-100">Desktop - 13</span>
        </div>
      </div>

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
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-green-500 rounded"></div>
                        <span className="text-sm text-slate-600">Entrada</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-red-500 rounded"></div>
                        <span className="text-sm text-slate-600">Salida</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-blue-200 rounded"></div>
                        <span className="text-sm text-slate-600">Estadía</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-gray-400 rounded"></div>
                        <span className="text-sm text-slate-600">
                          Reservado
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
                        Mínimo 1 noche de estadía
                      </p>
                    </div>
                  </div>

                  {/* Price Calculation Display */}
                  {priceCalculation && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
                      <h4 className="font-semibold text-blue-800 mb-3">
                        Desglose de Precios
                      </h4>
                      <div className="space-y-2 text-sm">
                        {priceCalculation.weekdayDays > 0 && (
                          <div className="flex justify-between">
                            <span>
                              {priceCalculation.weekdayDays} noche(s) entre
                              semana
                            </span>
                            <span className="font-medium">
                              {formatPrice(priceCalculation.weekdayTotal)}
                            </span>
                          </div>
                        )}
                        {priceCalculation.weekendDays > 0 && (
                          <div className="flex justify-between">
                            <span>
                              {priceCalculation.weekendDays} noche(s) fin de
                              semana
                            </span>
                            <span className="font-medium">
                              {formatPrice(priceCalculation.weekendTotal)}
                            </span>
                          </div>
                        )}
                        {priceCalculation.holidayDays > 0 && (
                          <div className="flex justify-between">
                            <span>
                              {priceCalculation.holidayDays} noche(s) feriado
                            </span>
                            <span className="font-medium text-red-600">
                              {formatPrice(priceCalculation.holidayTotal)}
                            </span>
                          </div>
                        )}
                        <div className="border-t border-blue-300 pt-2 flex justify-between font-bold text-blue-800 text-base">
                          <span>
                            Total ({priceCalculation.totalDays} noches)
                          </span>
                          <span>
                            {formatPrice(priceCalculation.totalPrice)}
                          </span>
                        </div>
                      </div>

                      {/* Price breakdown details */}
                      <div className="mt-3 pt-3 border-t border-blue-200">
                        <p className="text-xs text-blue-600 mb-2">
                          Detalles por día:
                        </p>
                        <div className="grid grid-cols-1 gap-1 text-xs">
                          {priceCalculation.breakdown.map((day, index) => (
                            <div
                              key={index}
                              className="flex justify-between items-center"
                            >
                              <span className="flex items-center gap-2">
                                {formatDateSpanish(day.date)}
                                <Badge
                                  variant={
                                    day.dayType === "holiday"
                                      ? "destructive"
                                      : day.dayType === "weekend"
                                        ? "secondary"
                                        : "outline"
                                  }
                                  className="text-xs px-1 py-0"
                                >
                                  {day.dayType === "holiday"
                                    ? "Feriado"
                                    : day.dayType === "weekend"
                                      ? "Fin de semana"
                                      : "Entre semana"}
                                </Badge>
                              </span>
                              <span className="font-medium">
                                {formatPrice(day.price)}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
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
                        src="/placeholder.svg"
                        alt={accommodationName}
                        className="w-full h-24 object-cover rounded mb-2"
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
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-slate-600">
                        {isWeekend ? "Fin de semana" : "Día de semana"}
                      </span>
                      <span className="font-medium">${currentPrice}.00</span>
                    </div>
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-2xl font-bold text-slate-900">
                        Total: ${currentPrice}
                      </span>
                      <Button
                        className="bg-blue-900 hover:bg-blue-800"
                        onClick={() =>
                          navigate(
                            `/confirmacion/${reservationCode}?checkIn=${selectedDates.checkIn}&checkOut=${selectedDates.checkOut}&accommodation=${accommodationType}&id=${accommodationId}&name=${encodeURIComponent(accommodationName)}&guests=${guests}&price=${currentPrice}`,
                          )
                        }
                      >
                        PAGAR RESERVA
                      </Button>
                    </div>
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

export default Reservations;
