import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Info,
  Clock,
  Calendar,
  Users,
  CreditCard,
  Key,
  AlertTriangle,
  CheckCircle,
  XCircle,
} from "lucide-react";

interface BusinessRulesData {
  userType: string;
  maxDays: number;
  allowedDays: string[];
  paymentTimeLimit: number;
  checkInTime: string;
  checkOutTime: string;
  specialRules: string[];
}

interface BusinessRulesInfoProps {
  userId?: string;
  className?: string;
  trigger?: React.ReactNode;
}

const BusinessRulesInfo: React.FC<BusinessRulesInfoProps> = ({
  userId,
  className = "",
  trigger,
}) => {
  const [businessRules, setBusinessRules] = useState<BusinessRulesData | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Mock data for demonstration - in real implementation, this would come from API
  const mockBusinessRules: Record<string, BusinessRulesData> = {
    miembro: {
      userType: "Miembro Regular",
      maxDays: 7,
      allowedDays: ["Todos los días"],
      paymentTimeLimit: 72,
      checkInTime: "15:00",
      checkOutTime: "12:00",
      specialRules: [
        "Solo una reserva por fin de semana",
        "Máximo 7 días consecutivos",
        "Reservas no transferibles",
        "Pago requerido en 72 horas",
      ],
    },
    viuda: {
      userType: "Viuda",
      maxDays: 7,
      allowedDays: [
        "Lunes a Viernes (fin de semana con 3 días de anticipación)",
      ],
      paymentTimeLimit: 72,
      checkInTime: "15:00",
      checkOutTime: "12:00",
      specialRules: [
        "Solo puede reservar entre semana",
        "Fines de semana con 3 días de anticipación mínimo",
        "Máximo 7 días consecutivos",
        "Reservas no transferibles",
        "Pago requerido en 72 horas",
      ],
    },
    visitador_especial: {
      userType: "Visitador Especial",
      maxDays: 7,
      allowedDays: [
        "Lunes a Viernes (fin de semana con 3 días de anticipación)",
      ],
      paymentTimeLimit: 72,
      checkInTime: "15:00",
      checkOutTime: "12:00",
      specialRules: [
        "Solo puede reservar entre semana",
        "Fines de semana con 3 días de anticipación mínimo",
        "Máximo 7 días consecutivos",
        "Reservas no transferibles",
        "Pago requerido en 72 horas",
      ],
    },
    visitador_transeunte: {
      userType: "Visitador Transeúnte",
      maxDays: 7,
      allowedDays: [
        "Lunes a Viernes (fin de semana con 3 días de anticipación)",
      ],
      paymentTimeLimit: 72,
      checkInTime: "15:00",
      checkOutTime: "12:00",
      specialRules: [
        "Solo puede reservar entre semana",
        "Fines de semana con 3 días de anticipación mínimo",
        "Máximo 7 días consecutivos",
        "Reservas no transferibles",
        "Pago requerido en 72 horas",
      ],
    },
    visitador_juvenil: {
      userType: "Visitador Juvenil",
      maxDays: 0,
      allowedDays: ["No permitido"],
      paymentTimeLimit: 0,
      checkInTime: "N/A",
      checkOutTime: "N/A",
      specialRules: [
        "No puede reservar directamente",
        "Solo el miembro titular (padre/madre) puede reservar",
        "Debe estar acompañado por el miembro titular",
      ],
    },
    director_jcd: {
      userType: "Director JCD",
      maxDays: 3,
      allowedDays: ["Todos los días"],
      paymentTimeLimit: 72,
      checkInTime: "15:00",
      checkOutTime: "12:00",
      specialRules: [
        "Máximo 3 días por reserva",
        "Máximo 3 reservas mensuales (una por ubicación)",
        "Exento de pago excepto feriados y vacaciones",
        "Cancelación con 72 horas de anticipación",
        "Reservas no transferibles",
        "Solo 1 director por ubicación por temporada",
      ],
    },
  };

  useEffect(() => {
    if (userId) {
      fetchBusinessRules();
    } else {
      // Default to member rules if no user ID
      setBusinessRules(mockBusinessRules.miembro);
    }
  }, [userId]);

  const fetchBusinessRules = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // In real implementation, this would be an API call
      // const response = await fetch(`/api/reservations/business-rules`);
      // const data = await response.json();

      // For now, simulate API delay and use mock data
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Mock user type determination
      const mockUserType = "miembro"; // This would come from authentication context
      setBusinessRules(mockBusinessRules[mockUserType]);
    } catch (err) {
      setError("Error al cargar las reglas de negocio");
      console.error("Error fetching business rules:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const getUserTypeColor = (userType: string) => {
    switch (userType.toLowerCase()) {
      case "miembro regular":
        return "bg-blue-100 text-blue-800";
      case "viuda":
        return "bg-purple-100 text-purple-800";
      case "visitador especial":
      case "visitador transeúnte":
        return "bg-green-100 text-green-800";
      case "visitador juvenil":
        return "bg-yellow-100 text-yellow-800";
      case "director jcd":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const renderBusinessRulesContent = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-gray-600">Cargando reglas...</span>
        </div>
      );
    }

    if (error) {
      return (
        <div className="p-8 text-center">
          <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-600">{error}</p>
          <Button
            onClick={fetchBusinessRules}
            variant="outline"
            className="mt-4"
          >
            Reintentar
          </Button>
        </div>
      );
    }

    if (!businessRules) {
      return null;
    }

    return (
      <div className="space-y-6">
        {/* User Type Badge */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">
              Tipo de Usuario
            </h3>
            <Badge
              className={`mt-1 ${getUserTypeColor(businessRules.userType)}`}
            >
              {businessRules.userType}
            </Badge>
          </div>
          <Info className="h-5 w-5 text-slate-400" />
        </div>

        {/* Quick Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <Calendar className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="text-sm text-slate-600">Duración Máxima</p>
                  <p className="font-semibold">
                    {businessRules.maxDays === 0
                      ? "No permitido"
                      : `${businessRules.maxDays} días`}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <Clock className="h-5 w-5 text-green-600" />
                <div>
                  <p className="text-sm text-slate-600">Horarios</p>
                  <p className="font-semibold">
                    {businessRules.checkInTime === "N/A"
                      ? "N/A"
                      : `${businessRules.checkInTime} - ${businessRules.checkOutTime}`}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <CreditCard className="h-5 w-5 text-orange-600" />
                <div>
                  <p className="text-sm text-slate-600">Tiempo de Pago</p>
                  <p className="font-semibold">
                    {businessRules.paymentTimeLimit === 0
                      ? "N/A"
                      : `${businessRules.paymentTimeLimit} horas`}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <Users className="h-5 w-5 text-purple-600" />
                <div>
                  <p className="text-sm text-slate-600">Días Permitidos</p>
                  <p className="font-semibold text-xs">
                    {businessRules.allowedDays.join(", ")}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Rules */}
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="detailed-rules">
            <AccordionTrigger className="text-left">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="h-5 w-5 text-yellow-600" />
                <span>
                  Reglas Específicas ({businessRules.specialRules.length})
                </span>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-3 pt-4">
                {businessRules.specialRules.map((rule, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-slate-700">{rule}</p>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="key-policies">
            <AccordionTrigger className="text-left">
              <div className="flex items-center space-x-2">
                <Key className="h-5 w-5 text-blue-600" />
                <span>Políticas de Entrega de Llaves</span>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-3 pt-4">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-slate-700">
                    Solo se entregan al Miembro Titular
                  </p>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-slate-700">
                    Si no puede recogerlas, debe autorizar por escrito a su
                    esposa, madre o hijos
                  </p>
                </div>
                <div className="flex items-start space-x-3">
                  <XCircle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-slate-700">
                    No se entregan a terceros sin autorización escrita
                  </p>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="modification-policies">
            <AccordionTrigger className="text-left">
              <div className="flex items-center space-x-2">
                <Calendar className="h-5 w-5 text-orange-600" />
                <span>Políticas de Modificación y Cancelación</span>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-3 pt-4">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-slate-700">
                    Modificaciones permitidas con 72 horas de anticipación
                  </p>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-slate-700">
                    En casos de emergencia (enfermedad, duelo), el Gerente
                    General decidirá
                  </p>
                </div>
                <div className="flex items-start space-x-3">
                  <XCircle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-slate-700">
                    Las reservas no son transferibles entre miembros
                  </p>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    );
  };

  const defaultTrigger = (
    <Button variant="outline" size="sm" className={className}>
      <Info className="h-4 w-4 mr-2" />
      Reglas de Reserva
    </Button>
  );

  return (
    <Dialog>
      <DialogTrigger asChild>{trigger || defaultTrigger}</DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Info className="h-5 w-5 text-blue-600" />
            <span>Reglas de Negocio - Sistema de Reservas</span>
          </DialogTitle>
          <DialogDescription>
            Información importante sobre las políticas y reglas que se aplican a
            tu tipo de usuario para realizar reservas en el Club Salvadoreño.
          </DialogDescription>
        </DialogHeader>
        {renderBusinessRulesContent()}
      </DialogContent>
    </Dialog>
  );
};

export default BusinessRulesInfo;
