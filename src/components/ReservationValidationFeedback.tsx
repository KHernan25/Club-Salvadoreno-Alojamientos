import React from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import {
  AlertTriangle,
  CheckCircle,
  XCircle,
  Info,
  Clock,
  CreditCard,
} from "lucide-react";

interface ValidationError {
  type: "error" | "warning" | "info";
  message: string;
  code?: string;
}

interface PaymentInfo {
  paymentRequired: boolean;
  timeLimit: number;
  exemptReason?: string;
}

interface BusinessRulesInfo {
  checkInTime: string;
  checkOutTime: string;
  userType: string;
}

interface ReservationValidationFeedbackProps {
  validationErrors: ValidationError[];
  paymentInfo?: PaymentInfo;
  businessRulesInfo?: BusinessRulesInfo;
  isValidating?: boolean;
  className?: string;
}

const ReservationValidationFeedback: React.FC<
  ReservationValidationFeedbackProps
> = ({
  validationErrors = [],
  paymentInfo,
  businessRulesInfo,
  isValidating = false,
  className = "",
}) => {
  const errors = validationErrors.filter((v) => v.type === "error");
  const warnings = validationErrors.filter((v) => v.type === "warning");
  const info = validationErrors.filter((v) => v.type === "info");

  const getAlertIcon = (type: string) => {
    switch (type) {
      case "error":
        return <XCircle className="h-4 w-4" />;
      case "warning":
        return <AlertTriangle className="h-4 w-4" />;
      case "info":
        return <Info className="h-4 w-4" />;
      default:
        return <CheckCircle className="h-4 w-4" />;
    }
  };

  const getAlertVariant = (type: string) => {
    switch (type) {
      case "error":
        return "destructive";
      case "warning":
        return "default";
      case "info":
        return "default";
      default:
        return "default";
    }
  };

  const getUserTypeColor = (userType: string) => {
    switch (userType.toLowerCase()) {
      case "miembro":
        return "bg-blue-100 text-blue-800";
      case "viuda":
        return "bg-purple-100 text-purple-800";
      case "visitador_especial":
      case "visitador_transeunte":
        return "bg-green-100 text-green-800";
      case "visitador_juvenil":
        return "bg-yellow-100 text-yellow-800";
      case "director_jcd":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (isValidating) {
    return (
      <div className={`space-y-4 ${className}`}>
        <Alert>
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
          <AlertDescription className="ml-2">
            Validando reglas de negocio...
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (
    errors.length === 0 &&
    warnings.length === 0 &&
    info.length === 0 &&
    !paymentInfo &&
    !businessRulesInfo
  ) {
    return null;
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Success Message - No Errors */}
      {errors.length === 0 && (
        <Alert className="border-green-200 bg-green-50">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            ��� Las fechas seleccionadas cumplen con todas las reglas de negocio
          </AlertDescription>
        </Alert>
      )}

      {/* Business Rules Information */}
      {businessRulesInfo && (
        <Alert className="border-blue-200 bg-blue-50">
          <Info className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-800">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span>Tipo de usuario:</span>
              <Badge className={getUserTypeColor(businessRulesInfo.userType)}>
                {businessRulesInfo.userType}
              </Badge>
            </div>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                <span>
                  Check-in: {businessRulesInfo.checkInTime} | Check-out:{" "}
                  {businessRulesInfo.checkOutTime}
                </span>
              </div>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Payment Information */}
      {paymentInfo && (
        <Alert
          className={
            paymentInfo.paymentRequired
              ? "border-orange-200 bg-orange-50"
              : "border-green-200 bg-green-50"
          }
        >
          <CreditCard
            className={`h-4 w-4 ${
              paymentInfo.paymentRequired ? "text-orange-600" : "text-green-600"
            }`}
          />
          <AlertDescription
            className={
              paymentInfo.paymentRequired ? "text-orange-800" : "text-green-800"
            }
          >
            {paymentInfo.paymentRequired ? (
              <>
                💳 <strong>Pago requerido</strong> - Debes completar el pago en
                un máximo de <strong>{paymentInfo.timeLimit} horas</strong>{" "}
                después de confirmar la reserva.
              </>
            ) : (
              <>
                ✅ <strong>Exento de pago</strong>
                {paymentInfo.exemptReason && ` - ${paymentInfo.exemptReason}`}
              </>
            )}
          </AlertDescription>
        </Alert>
      )}

      {/* Errors */}
      {errors.map((error, index) => (
        <Alert
          key={`error-${index}`}
          variant={getAlertVariant(error.type)}
          className="border-red-200 bg-red-50"
        >
          {getAlertIcon(error.type)}
          <AlertDescription className="text-red-800">
            <strong>Error:</strong> {error.message}
          </AlertDescription>
        </Alert>
      ))}

      {/* Warnings */}
      {warnings.map((warning, index) => (
        <Alert
          key={`warning-${index}`}
          className="border-yellow-200 bg-yellow-50"
        >
          {getAlertIcon(warning.type)}
          <AlertDescription className="text-yellow-800">
            <strong>Advertencia:</strong> {warning.message}
          </AlertDescription>
        </Alert>
      ))}

      {/* Info Messages */}
      {info.map((infoItem, index) => (
        <Alert key={`info-${index}`} className="border-blue-200 bg-blue-50">
          {getAlertIcon(infoItem.type)}
          <AlertDescription className="text-blue-800">
            <strong>Información:</strong> {infoItem.message}
          </AlertDescription>
        </Alert>
      ))}

      {/* Special Rules Summary */}
      {errors.length === 0 && businessRulesInfo && (
        <Alert className="border-slate-200 bg-slate-50">
          <Info className="h-4 w-4 text-slate-600" />
          <AlertDescription className="text-slate-700">
            <div className="space-y-1 text-sm">
              <p>
                <strong>Recordatorios importantes:</strong>
              </p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>Las reservas no son transferibles entre miembros</li>
                <li>
                  Solo se entregan llaves al miembro titular o familiar
                  autorizado por escrito
                </li>
                <li>
                  Las modificaciones requieren 72 horas de anticipación (excepto
                  emergencias)
                </li>
                {businessRulesInfo.userType === "director_jcd" && (
                  <li>Notifica cancelaciones con al menos 72 horas</li>
                )}
              </ul>
            </div>
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default ReservationValidationFeedback;
