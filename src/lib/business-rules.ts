// Reglas de Negocio para el Sistema de Reservas del Club Salvadoreño
// Business Rules for Club Salvadoreño Reservation System

export interface UserType {
  id: string;
  type:
    | "miembro"
    | "viuda"
    | "visitador_especial"
    | "visitador_transeunte"
    | "visitador_juvenil"
    | "director_jcd";
  name: string;
  privileges?: string[];
}

export interface ReservationBusinessRules {
  // Límites de reserva
  maxConsecutiveDays: number;
  maxReservationsPerMember: number;

  // Horarios
  checkInTime: string;
  checkOutTime: string;

  // Políticas de pago
  paymentTimeLimit: number; // en horas

  // Políticas de modificación
  modificationNoticePeriod: number; // en horas

  // Días permitidos para reservar
  allowedDays: (
    | "monday"
    | "tuesday"
    | "wednesday"
    | "thursday"
    | "friday"
    | "saturday"
    | "sunday"
  )[];

  // Restricciones de fin de semana
  weekendReservationAdvanceNotice?: number; // en días
}

export interface DirectorBusinessRules extends ReservationBusinessRules {
  maxReservationsPerMonth: number;
  maxDaysPerReservation: number;
  freeReservationPeriods: string[]; // períodos exentos de pago
  exemptFromPayment: boolean;
}

// Configuración de reglas por tipo de usuario
export const businessRulesByUserType: Record<
  string,
  ReservationBusinessRules | DirectorBusinessRules
> = {
  // Reglas para miembros regulares
  miembro: {
    maxConsecutiveDays: 7,
    maxReservationsPerMember: 1, // solo una reserva por fin de semana
    checkInTime: "15:00",
    checkOutTime: "12:00",
    paymentTimeLimit: 72,
    modificationNoticePeriod: 72,
    allowedDays: [
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday",
      "sunday",
    ],
  },

  // Reglas para viudas
  viuda: {
    maxConsecutiveDays: 7,
    maxReservationsPerMember: 1,
    checkInTime: "15:00",
    checkOutTime: "12:00",
    paymentTimeLimit: 72,
    modificationNoticePeriod: 72,
    allowedDays: ["monday", "tuesday", "wednesday", "thursday", "friday"], // solo entre semana
    weekendReservationAdvanceNotice: 3, // pueden reservar fin de semana con 3 días de anticipación
  },

  // Reglas para visitadores especiales/transeúntes
  visitador_especial: {
    maxConsecutiveDays: 7,
    maxReservationsPerMember: 1,
    checkInTime: "15:00",
    checkOutTime: "12:00",
    paymentTimeLimit: 72,
    modificationNoticePeriod: 72,
    allowedDays: ["monday", "tuesday", "wednesday", "thursday", "friday"], // solo entre semana
    weekendReservationAdvanceNotice: 3, // pueden reservar fin de semana con 3 días de anticipación
  },

  visitador_transeunte: {
    maxConsecutiveDays: 7,
    maxReservationsPerMember: 1,
    checkInTime: "15:00",
    checkOutTime: "12:00",
    paymentTimeLimit: 72,
    modificationNoticePeriod: 72,
    allowedDays: ["monday", "tuesday", "wednesday", "thursday", "friday"], // solo entre semana
    weekendReservationAdvanceNotice: 3, // pueden reservar fin de semana con 3 días de anticipación
  },

  // Reglas para directores de JCD
  director_jcd: {
    maxConsecutiveDays: 3,
    maxReservationsPerMember: 3, // una por cada lugar por mes
    maxReservationsPerMonth: 3, // una por cada lugar: Corinto, El Sunzal, Apartamentos
    maxDaysPerReservation: 3,
    checkInTime: "15:00",
    checkOutTime: "12:00",
    paymentTimeLimit: 72,
    modificationNoticePeriod: 72,
    allowedDays: [
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday",
      "sunday",
    ],
    freeReservationPeriods: ["non_holiday", "non_vacation"], // exento de pago excepto feriados y vacaciones
    exemptFromPayment: false, // depende del período
  },
};

// Tipos de alojamiento y disponibilidad para directores
export const directorAccommodationLimits = {
  corinto_casas: 1, // máximo 1 director
  el_sunzal_casas: 1, // máximo 1 director
  apartamentos: 1, // máximo 1 director
};

export interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

export interface ReservationRequest {
  userId: string;
  userType: string;
  accommodationType:
    | "corinto_casas"
    | "el_sunzal_casas"
    | "apartamentos"
    | "suites";
  checkIn: string;
  checkOut: string;
  isWeekend: boolean;
  existingReservations?: any[];
}

// Función principal de validación de reglas de negocio
export const validateBusinessRules = (
  request: ReservationRequest,
): ValidationResult => {
  const result: ValidationResult = {
    valid: true,
    errors: [],
    warnings: [],
  };

  const rules = businessRulesByUserType[request.userType];

  if (!rules) {
    result.valid = false;
    result.errors.push("Tipo de usuario no válido");
    return result;
  }

  // Validar duración máxima de estadía
  const checkInDate = new Date(request.checkIn);
  const checkOutDate = new Date(request.checkOut);
  const diffTime = checkOutDate.getTime() - checkInDate.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays > rules.maxConsecutiveDays) {
    result.valid = false;
    result.errors.push(
      `La estadía no puede exceder ${rules.maxConsecutiveDays} días consecutivos`,
    );
  }

  // Validar días permitidos para reservar
  const checkInDayOfWeek = checkInDate.getDay();
  const dayNames = [
    "sunday",
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
  ];
  const checkInDayName = dayNames[checkInDayOfWeek] as any;

  if (!rules.allowedDays.includes(checkInDayName)) {
    // Si es viuda o visitador, verificar si puede reservar fin de semana con anticipación
    if (
      (request.userType === "viuda" ||
        request.userType === "visitador_especial" ||
        request.userType === "visitador_transeunte") &&
      request.isWeekend &&
      rules.weekendReservationAdvanceNotice
    ) {
      const today = new Date();
      const advanceDays = Math.ceil(
        (checkInDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
      );

      if (advanceDays < rules.weekendReservationAdvanceNotice) {
        result.valid = false;
        result.errors.push(
          `Las reservas de fin de semana requieren al menos ${rules.weekendReservationAdvanceNotice} días de anticipación`,
        );
      } else {
        result.warnings.push(
          "Reserva de fin de semana autorizada por anticipación suficiente",
        );
      }
    } else {
      result.valid = false;
      if (
        request.userType === "viuda" ||
        request.userType === "visitador_especial" ||
        request.userType === "visitador_transeunte"
      ) {
        result.errors.push(
          "Solo puede reservar entre semana (lunes a viernes). En fines de semana solo con al menos 3 días de anticipación.",
        );
      }
    }
  }

  // Validar reglas específicas para directores
  if (request.userType === "director_jcd") {
    const directorRules = rules as DirectorBusinessRules;

    if (diffDays > directorRules.maxDaysPerReservation) {
      result.valid = false;
      result.errors.push(
        `Los directores pueden reservar máximo ${directorRules.maxDaysPerReservation} días por reserva`,
      );
    }

    // Verificar límite de disponibilidad por ubicación
    const accommodationLimit =
      directorAccommodationLimits[request.accommodationType];
    if (accommodationLimit && request.existingReservations) {
      const existingDirectorReservations = request.existingReservations.filter(
        (res) =>
          res.userType === "director_jcd" &&
          res.accommodationType === request.accommodationType &&
          res.status === "confirmed",
      );

      if (existingDirectorReservations.length >= accommodationLimit) {
        result.valid = false;
        result.errors.push(
          `Solo se permite ${accommodationLimit} director en ${request.accommodationType.replace("_", " ")} por temporada`,
        );
      }
    }
  }

  return result;
};

// Función para validar si un usuario puede ser titular de la reserva
export const validateReservationOwnership = (
  requesterType: string,
  ownerType: string,
): ValidationResult => {
  const result: ValidationResult = {
    valid: true,
    errors: [],
    warnings: [],
  };

  // Los visitadores juveniles no pueden reservar
  if (requesterType === "visitador_juvenil") {
    result.valid = false;
    result.errors.push(
      "Los visitadores juveniles no pueden reservar, solamente el miembro titular (mamá o papá)",
    );
  }

  return result;
};

// Función para validar entrega de llaves
export const validateKeyDelivery = (
  reservationOwnerId: string,
  recipientId: string,
  authorizationLetter?: boolean,
): ValidationResult => {
  const result: ValidationResult = {
    valid: true,
    errors: [],
    warnings: [],
  };

  // Solo se entrega al miembro titular
  if (reservationOwnerId !== recipientId && !authorizationLetter) {
    result.valid = false;
    result.errors.push(
      "Las llaves solo se entregan al Miembro Titular. Si no puede, debe autorizar por escrito a su esposa, madre o hijos.",
    );
  }

  if (authorizationLetter) {
    result.warnings.push(
      "Autorización escrita requerida para entrega de llaves a familiar",
    );
  }

  return result;
};

// Función para validar transferencia de reservas
export const validateReservationTransfer = (
  fromUserId: string,
  toUserId: string,
): ValidationResult => {
  const result: ValidationResult = {
    valid: false,
    errors: [
      "Las reservas no son transferibles entre miembros bajo ninguna circunstancia",
    ],
    warnings: [],
  };

  return result;
};

// Función para validar modificación de fechas
export const validateDateModification = (
  reservationDate: Date,
  modificationDate: Date,
  userType: string,
  isEmergency: boolean = false,
  emergencyProof?: boolean,
): ValidationResult => {
  const result: ValidationResult = {
    valid: true,
    errors: [],
    warnings: [],
  };

  const rules = businessRulesByUserType[userType];
  if (!rules) {
    result.valid = false;
    result.errors.push("Tipo de usuario no válido");
    return result;
  }

  const hoursUntilReservation =
    (reservationDate.getTime() - modificationDate.getTime()) / (1000 * 60 * 60);

  if (hoursUntilReservation < rules.modificationNoticePeriod) {
    if (isEmergency && emergencyProof) {
      result.warnings.push(
        "Modificación de emergencia (enfermedad, duelo o emergencia comprobada) - requiere aprobación del Gerente General",
      );
    } else {
      result.valid = false;
      result.errors.push(
        `Se requieren al menos ${rules.modificationNoticePeriod} horas de anticipación para reprogramar`,
      );
    }
  }

  return result;
};

// Función para validar cancelación de reserva
export const validateReservationCancellation = (
  reservationDate: Date,
  cancellationDate: Date,
  userType: string,
): ValidationResult => {
  const result: ValidationResult = {
    valid: true,
    errors: [],
    warnings: [],
  };

  const rules = businessRulesByUserType[userType];
  if (!rules) {
    result.valid = false;
    result.errors.push("Tipo de usuario no válido");
    return result;
  }

  const hoursUntilReservation =
    (reservationDate.getTime() - cancellationDate.getTime()) / (1000 * 60 * 60);

  if (userType === "director_jcd" && hoursUntilReservation < 72) {
    result.warnings.push(
      "Los directores deben notificar cancelaciones con al menos 72 horas de anticipación",
    );
  }

  return result;
};

// Función para verificar si un director puede hacer reserva sin pago
export const isDirectorExemptFromPayment = (
  checkInDate: Date,
  userType: string,
): { exempt: boolean; reason?: string } => {
  if (userType !== "director_jcd") {
    return { exempt: false };
  }

  // Verificar si es feriado o temporada especial
  const dateString = checkInDate.toISOString().split("T")[0];
  const isHoliday = [
    "2025-01-01",
    "2025-03-28",
    "2025-03-29",
    "2025-03-30",
    "2025-05-01",
    "2025-05-10",
    "2025-06-17",
    "2025-08-06",
    "2025-09-15",
    "2025-11-02",
    "2025-12-25",
  ].includes(dateString);

  // En temporadas especiales y feriados sí pagan
  if (isHoliday) {
    return {
      exempt: false,
      reason: "Los directores pagan en feriados y temporadas especiales",
    };
  }

  // El resto de fechas están exentas
  return { exempt: true, reason: "Exento de pago en fechas regulares" };
};

// Función para obtener el tiempo límite de pago
export const getPaymentTimeLimit = (userType: string): number => {
  const rules = businessRulesByUserType[userType];
  return rules?.paymentTimeLimit || 72;
};

// Función para obtener horarios de check-in/check-out
export const getCheckInOutTimes = (
  userType: string,
  accommodationType?: string,
) => {
  const rules = businessRulesByUserType[userType];

  // Horarios especiales para suites
  if (accommodationType === "suites") {
    return {
      checkIn: "14:00", // 2:00 PM
      checkOut: "13:00", // 1:00 PM
    };
  }

  return {
    checkIn: rules?.checkInTime || "15:00",
    checkOut: rules?.checkOutTime || "12:00",
  };
};

export default {
  businessRulesByUserType,
  directorAccommodationLimits,
  validateBusinessRules,
  validateReservationOwnership,
  validateKeyDelivery,
  validateReservationTransfer,
  validateDateModification,
  validateReservationCancellation,
  isDirectorExemptFromPayment,
  getPaymentTimeLimit,
  getCheckInOutTimes,
};
