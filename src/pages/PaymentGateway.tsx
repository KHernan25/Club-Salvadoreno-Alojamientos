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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { getCurrentUser } from "@/lib/auth-service";
import {
  formatPrice,
  getAccommodationRates,
  calculateStayPrice,
} from "@/lib/pricing-system";
import {
  Menu,
  Globe,
  User,
  ChevronDown,
  CreditCard,
  Lock,
  CheckCircle,
  ArrowLeft,
  Calendar,
  Users,
  MapPin,
} from "lucide-react";

type PaymentState = "form" | "processing" | "success";

const PaymentGateway = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const currentUser = getCurrentUser();

  // Payment state management
  const [paymentState, setPaymentState] = useState<PaymentState>("form");

  // Get reservation details from URL
  const reservationCode = searchParams.get("code") || "";
  const checkIn = searchParams.get("checkIn") || "";
  const checkOut = searchParams.get("checkOut") || "";
  const accommodation = searchParams.get("accommodation") || "apartamento";
  const accommodationId = searchParams.get("id") || "1A";
  const accommodationName = decodeURIComponent(
    searchParams.get("name") || "Apartamento 1A",
  );
  const guests = parseInt(searchParams.get("guests") || "2");
  const totalPrice = parseFloat(searchParams.get("price") || "0");

  // Form data
  const [formData, setFormData] = useState({
    cardNumber: "",
    cardName: "",
    cardLastName: "",
    expiryMonth: "",
    expiryYear: "",
    cvv: "",
    email: currentUser?.email || "",
  });

  // Form validation
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Card and bank detection
  const detectCardType = (cardNumber: string) => {
    const number = cardNumber.replace(/\s/g, "");

    if (/^4/.test(number)) return "visa";
    if (/^5[1-5]/.test(number) || /^2[2-7]/.test(number)) return "mastercard";
    if (/^3[47]/.test(number)) return "amex";
    if (/^6/.test(number)) return "discover";
    return "unknown";
  };

  const detectBank = (cardNumber: string) => {
    const number = cardNumber.replace(/\s/g, "");
    const bin = number.substring(0, 6);

    // BIN ranges for Salvadoran banks
    const bankRanges = {
      "Banco Cuscatlán": ["423429", "423430", "423431", "545616", "545617"],
      "Banco Agrícola": ["434420", "434421", "434422", "511878", "511879"],
      "Banco de América Central": [
        "422803",
        "422804",
        "422805",
        "547739",
        "547740",
      ],
      "Banco Hipotecario": ["485925", "485926", "485927", "530990", "530991"],
      "Banco Promerica": ["411766", "411767", "411768", "516294", "516295"],
      Scotiabank: ["451416", "451417", "451418", "558158", "558159"],
      Citibank: ["424631", "424632", "424633", "520384", "520385"],
      "Banco Davivienda": ["456789", "456790", "456791", "512345", "512346"],
    };

    for (const [bank, ranges] of Object.entries(bankRanges)) {
      if (ranges.some((range) => bin.startsWith(range.substring(0, 4)))) {
        return bank;
      }
    }

    // Default detection by card type
    if (number.startsWith("4")) return "Banco Emisor Visa";
    if (number.startsWith("5")) return "Banco Emisor Mastercard";

    return "Banco Emisor";
  };

  const cardType = detectCardType(formData.cardNumber);
  const bankName = detectBank(formData.cardNumber);

  const getCardIcon = () => {
    switch (cardType) {
      case "visa":
        return (
          <div className="flex items-center justify-center w-12 h-8 bg-blue-600 text-white text-xs font-bold rounded">
            VISA
          </div>
        );
      case "mastercard":
        return (
          <div className="flex items-center justify-center w-12 h-8 bg-red-500 text-white text-xs font-bold rounded">
            MC
          </div>
        );
      case "amex":
        return (
          <div className="flex items-center justify-center w-12 h-8 bg-green-600 text-white text-xs font-bold rounded">
            AMEX
          </div>
        );
      case "discover":
        return (
          <div className="flex items-center justify-center w-12 h-8 bg-orange-500 text-white text-xs font-bold rounded">
            DISC
          </div>
        );
      default:
        return (
          <div className="flex items-center justify-center w-12 h-8 bg-gray-400 text-white text-xs font-bold rounded">
            CARD
          </div>
        );
    }
  };

  const getBankIcon = () => {
    const iconStyles =
      "w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-xs";

    switch (bankName) {
      case "Banco Cuscatlán":
        return <div className={`${iconStyles} bg-orange-500`}>BC</div>;
      case "Banco Agrícola":
        return <div className={`${iconStyles} bg-green-600`}>BA</div>;
      case "Banco de América Central":
        return <div className={`${iconStyles} bg-blue-600`}>BAC</div>;
      case "Banco Hipotecario":
        return <div className={`${iconStyles} bg-purple-600`}>BH</div>;
      case "Banco Promerica":
        return <div className={`${iconStyles} bg-red-600`}>BP</div>;
      case "Scotiabank":
        return <div className={`${iconStyles} bg-red-700`}>SB</div>;
      case "Citibank":
        return <div className={`${iconStyles} bg-blue-800`}>CB</div>;
      case "Banco Davivienda":
        return <div className={`${iconStyles} bg-pink-600`}>BD</div>;
      default:
        return <div className={`${iconStyles} bg-gray-500`}>🏦</div>;
    }
  };

  // Redirect if no reservation data
  useEffect(() => {
    if (!reservationCode || !checkIn || !checkOut) {
      toast({
        title: "Error",
        description: "No se encontraron datos de reserva válidos",
        variant: "destructive",
      });
      navigate("/reservas");
    }
  }, [reservationCode, checkIn, checkOut, navigate, toast]);

  const formatCardNumber = (value: string) => {
    // Remove all non-digits
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    // Add spaces every 4 digits
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || "";
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(" ");
    } else {
      return v;
    }
  };

  const handleInputChange = (field: string, value: string) => {
    if (field === "cardNumber") {
      value = formatCardNumber(value);
      if (value.replace(/\s/g, "").length > 16) return;
    }

    if (field === "cvv" && value.length > 4) return;
    if ((field === "expiryMonth" || field === "expiryYear") && value.length > 2)
      return;

    setFormData((prev) => ({ ...prev, [field]: value }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (
      !formData.cardNumber ||
      formData.cardNumber.replace(/\s/g, "").length < 16
    ) {
      newErrors.cardNumber = "Número de tarjeta debe tener 16 dígitos";
    }

    if (!formData.cardName.trim()) {
      newErrors.cardName = "Nombre es requerido";
    }

    if (!formData.cardLastName.trim()) {
      newErrors.cardLastName = "Apellido es requerido";
    }

    if (
      !formData.expiryMonth ||
      parseInt(formData.expiryMonth) < 1 ||
      parseInt(formData.expiryMonth) > 12
    ) {
      newErrors.expiryMonth = "Mes inválido";
    }

    if (!formData.expiryYear || parseInt(formData.expiryYear) < 25) {
      newErrors.expiryYear = "Año inválido";
    }

    if (!formData.cvv || formData.cvv.length < 3) {
      newErrors.cvv = "CVV debe tener al menos 3 dígitos";
    }

    if (!formData.email || !formData.email.includes("@")) {
      newErrors.email = "Email inválido";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePayment = async () => {
    if (!validateForm()) {
      toast({
        title: "Error en el formulario",
        description: "Por favor corrige los errores antes de continuar",
        variant: "destructive",
      });
      return;
    }

    // Start processing
    setPaymentState("processing");

    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 3000));

    // Show success
    setPaymentState("success");

    // Auto-redirect to confirmation after showing success
    setTimeout(() => {
      navigate(
        `/confirmacion/${reservationCode}?checkIn=${checkIn}&checkOut=${checkOut}&accommodation=${accommodation}&id=${accommodationId}&name=${encodeURIComponent(accommodationName)}&guests=${guests}&price=${totalPrice}`,
      );
    }, 2000);
  };

  const renderPaymentForm = () => (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            Finalizar Pago
          </h1>
          <p className="text-slate-600">
            Completa tu información de pago para confirmar tu reserva
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Payment Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Información de Pago
              </CardTitle>
              <CardDescription>
                Todos los pagos son seguros y encriptados
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 bg-gradient-to-br from-white to-slate-50">
              {/* Dynamic Bank Detection */}
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-slate-50 to-slate-100 rounded-lg border">
                <div className="flex items-center gap-3">
                  {getBankIcon()}
                  <div>
                    <div className="font-semibold text-slate-800">
                      {bankName}
                    </div>
                    <div className="text-sm text-slate-600">
                      {formData.cardNumber
                        ? "Banco detectado automáticamente"
                        : "Ingresa tu tarjeta para detectar el banco"}
                    </div>
                  </div>
                </div>
                {formData.cardNumber && (
                  <div className="text-green-600">
                    <CheckCircle className="h-5 w-5" />
                  </div>
                )}
              </div>

              {/* Card Number */}
              <div className="space-y-2">
                <Label htmlFor="cardNumber">Número de Tarjeta</Label>
                <div className="relative">
                  <Input
                    id="cardNumber"
                    placeholder="0000 0000 0000 0000"
                    value={formData.cardNumber}
                    onChange={(e) =>
                      handleInputChange("cardNumber", e.target.value)
                    }
                    className={`pr-16 ${errors.cardNumber ? "border-red-500" : formData.cardNumber ? "border-green-500" : ""}`}
                  />
                  <div className="absolute right-3 top-2.5">
                    {getCardIcon()}
                  </div>
                </div>
                {formData.cardNumber && (
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-green-600">
                      {cardType === "visa" && "Tarjeta Visa detectada"}
                      {cardType === "mastercard" &&
                        "Tarjeta Mastercard detectada"}
                      {cardType === "amex" &&
                        "Tarjeta American Express detectada"}
                      {cardType === "discover" && "Tarjeta Discover detectada"}
                      {cardType === "unknown" && "Tipo de tarjeta detectado"}
                    </span>
                  </div>
                )}
                {errors.cardNumber && (
                  <p className="text-sm text-red-500">{errors.cardNumber}</p>
                )}
              </div>

              {/* Name and Last Name */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="cardName">Nombre</Label>
                  <Input
                    id="cardName"
                    placeholder="Nombre en la tarjeta"
                    value={formData.cardName}
                    onChange={(e) =>
                      handleInputChange("cardName", e.target.value)
                    }
                    className={`${errors.cardName ? "border-red-500" : formData.cardName ? "border-green-500" : ""} focus:ring-2 focus:ring-blue-500`}
                  />
                  {errors.cardName && (
                    <p className="text-sm text-red-500">{errors.cardName}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cardLastName">Apellido</Label>
                  <Input
                    id="cardLastName"
                    placeholder="Apellido en la tarjeta"
                    value={formData.cardLastName}
                    onChange={(e) =>
                      handleInputChange("cardLastName", e.target.value)
                    }
                    className={`${errors.cardLastName ? "border-red-500" : formData.cardLastName ? "border-green-500" : ""} focus:ring-2 focus:ring-blue-500`}
                  />
                  {errors.cardLastName && (
                    <p className="text-sm text-red-500">
                      {errors.cardLastName}
                    </p>
                  )}
                </div>
              </div>

              {/* Expiry and CVV */}
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="expiryMonth">Mes</Label>
                  <Select
                    value={formData.expiryMonth}
                    onValueChange={(value) =>
                      handleInputChange("expiryMonth", value)
                    }
                  >
                    <SelectTrigger
                      className={errors.expiryMonth ? "border-red-500" : ""}
                    >
                      <SelectValue placeholder="MM" />
                    </SelectTrigger>
                    <SelectContent>
                      {[...Array(12)].map((_, i) => (
                        <SelectItem
                          key={i + 1}
                          value={String(i + 1).padStart(2, "0")}
                        >
                          {String(i + 1).padStart(2, "0")}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.expiryMonth && (
                    <p className="text-sm text-red-500">{errors.expiryMonth}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="expiryYear">Año</Label>
                  <Select
                    value={formData.expiryYear}
                    onValueChange={(value) =>
                      handleInputChange("expiryYear", value)
                    }
                  >
                    <SelectTrigger
                      className={errors.expiryYear ? "border-red-500" : ""}
                    >
                      <SelectValue placeholder="AA" />
                    </SelectTrigger>
                    <SelectContent>
                      {[...Array(10)].map((_, i) => (
                        <SelectItem key={i} value={String(25 + i)}>
                          {25 + i}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.expiryYear && (
                    <p className="text-sm text-red-500">{errors.expiryYear}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cvv">CVC</Label>
                  <Input
                    id="cvv"
                    placeholder="123"
                    value={formData.cvv}
                    onChange={(e) =>
                      handleInputChange(
                        "cvv",
                        e.target.value.replace(/\D/g, ""),
                      )
                    }
                    className={`${errors.cvv ? "border-red-500" : formData.cvv.length >= 3 ? "border-green-500" : ""} focus:ring-2 focus:ring-blue-500`}
                  />
                  {errors.cvv && (
                    <p className="text-sm text-red-500">{errors.cvv}</p>
                  )}
                </div>
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="tu@email.com"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className={`${errors.email ? "border-red-500" : formData.email.includes("@") ? "border-green-500" : ""} focus:ring-2 focus:ring-blue-500`}
                />
                {errors.email && (
                  <p className="text-sm text-red-500">{errors.email}</p>
                )}
              </div>

              {/* Security Notice */}
              <div className="flex items-center gap-2 p-4 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg">
                <Lock className="h-5 w-5 text-green-600" />
                <div>
                  <div className="text-sm font-medium text-green-800">
                    Pago 100% Seguro
                  </div>
                  <div className="text-xs text-green-600">
                    Tu información está protegida con encriptación SSL de 256
                    bits
                  </div>
                </div>
              </div>

              {/* Payment Button */}
              <Button
                onClick={handlePayment}
                className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white py-6 text-lg font-semibold shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200"
                size="lg"
                disabled={
                  !formData.cardNumber ||
                  !formData.cardName ||
                  !formData.cardLastName ||
                  !formData.cvv ||
                  !formData.email
                }
              >
                <Lock className="h-5 w-5 mr-2" />
                PAGAR {formatPrice(totalPrice)} - SEGURO
              </Button>
            </CardContent>
          </Card>

          {/* Reservation Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Resumen de Reserva</CardTitle>
              <CardDescription>
                Código:{" "}
                <span className="font-mono font-bold">{reservationCode}</span>
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Accommodation */}
              <div className="flex gap-3">
                <img
                  src="/placeholder.svg"
                  alt={accommodationName}
                  className="w-16 h-16 object-cover rounded"
                />
                <div className="flex-1">
                  <h3 className="font-semibold">{accommodationName}</h3>
                  <div className="flex items-center gap-1 text-sm text-slate-600">
                    <MapPin className="h-3 w-3" />
                    Club Salvadoreño
                  </div>
                </div>
              </div>

              {/* Dates */}
              <div className="grid grid-cols-2 gap-4 p-3 bg-slate-50 rounded-lg">
                <div>
                  <div className="flex items-center gap-1 text-sm text-slate-600 mb-1">
                    <Calendar className="h-3 w-3" />
                    Check-in
                  </div>
                  <div className="font-medium">{checkIn}</div>
                </div>
                <div>
                  <div className="flex items-center gap-1 text-sm text-slate-600 mb-1">
                    <Calendar className="h-3 w-3" />
                    Check-out
                  </div>
                  <div className="font-medium">{checkOut}</div>
                </div>
              </div>

              {/* Guests */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-slate-500" />
                  <span>Huéspedes:</span>
                </div>
                <span className="font-medium">
                  {guests} persona{guests > 1 ? "s" : ""}
                </span>
              </div>

              {/* Total */}
              <div className="border-t pt-4">
                <div className="flex items-center justify-between text-xl font-bold">
                  <span>Total a Pagar:</span>
                  <span className="text-blue-600">
                    {formatPrice(totalPrice)}
                  </span>
                </div>
              </div>

              {/* Guest Info */}
              <div className="border-t pt-4">
                <h4 className="font-medium mb-2">Huésped Principal</h4>
                <div className="text-sm text-slate-600">
                  <div>
                    {currentUser?.firstName} {currentUser?.lastName}
                  </div>
                  <div>{currentUser?.email}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );

  const renderProcessing = () => (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto text-center">
        <Card className="p-8">
          <CardContent className="space-y-6">
            {/* Loading Animation */}
            <div className="flex justify-center">
              <div className="relative">
                {/* Animated dots */}
                <div className="flex space-x-2">
                  <div className="w-4 h-4 bg-blue-600 rounded-full animate-bounce"></div>
                  <div
                    className="w-4 h-4 bg-blue-600 rounded-full animate-bounce"
                    style={{ animationDelay: "0.1s" }}
                  ></div>
                  <div
                    className="w-4 h-4 bg-blue-600 rounded-full animate-bounce"
                    style={{ animationDelay: "0.2s" }}
                  ></div>
                  <div
                    className="w-4 h-4 bg-blue-600 rounded-full animate-bounce"
                    style={{ animationDelay: "0.3s" }}
                  ></div>
                  <div
                    className="w-4 h-4 bg-blue-600 rounded-full animate-bounce"
                    style={{ animationDelay: "0.4s" }}
                  ></div>
                  <div
                    className="w-4 h-4 bg-blue-600 rounded-full animate-bounce"
                    style={{ animationDelay: "0.5s" }}
                  ></div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-blue-900">
                Estamos procesando tu pago
              </h2>
              <p className="text-slate-600">
                Por favor espera mientras verificamos tu información...
              </p>
            </div>

            {/* Club Logo */}
            <div className="flex items-center justify-between bg-slate-50 p-4 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-900 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">CS</span>
                </div>
                <span className="font-semibold">Club Salvadoreño</span>
              </div>
              <div className="font-bold text-xl">{formatPrice(totalPrice)}</div>
            </div>

            <p className="text-sm text-slate-500">
              No cierres esta ventana ni actualices la página
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderSuccess = () => (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto text-center">
        <Card className="p-8">
          <CardContent className="space-y-6">
            {/* Success Icon */}
            <div className="flex justify-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="h-12 w-12 text-green-600" />
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-green-900">
                Se realizó su pago exitosamente
              </h2>
              <p className="text-slate-600">
                Tu reserva ha sido confirmada. Te redirigiremos a los detalles
                de tu reserva.
              </p>
            </div>

            {/* Club Logo */}
            <div className="flex items-center justify-between bg-slate-50 p-4 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-900 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">CS</span>
                </div>
                <span className="font-semibold">Club Salvadoreño</span>
              </div>
              <div className="font-bold text-xl">{formatPrice(totalPrice)}</div>
            </div>

            <div className="text-sm text-slate-500">
              Redirigiendo a tu confirmación...
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div
                className="flex items-center gap-3 cursor-pointer"
                onClick={() => navigate("/dashboard")}
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
              {paymentState === "form" && (
                <Button
                  variant="ghost"
                  className="gap-2"
                  onClick={() => navigate(-1)}
                >
                  <ArrowLeft className="h-4 w-4" />
                  Volver
                </Button>
              )}
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

      {/* Main Content */}
      {paymentState === "form" && renderPaymentForm()}
      {paymentState === "processing" && renderProcessing()}
      {paymentState === "success" && renderSuccess()}

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

export default PaymentGateway;
