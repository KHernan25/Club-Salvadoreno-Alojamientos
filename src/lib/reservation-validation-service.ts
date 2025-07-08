// Servicio de Validación de Reservas con Reglas de Negocio
// Reservation Validation Service with Business Rules

import {
  validateBusinessRules,
  validateReservationOwnership,
  validateKeyDelivery,
  validateReservationTransfer,
  validateDateModification,
  validateReservationCancellation,
  isDirectorExemptFromPayment,
  getPaymentTimeLimit,
  getCheckInOutTimes,
  ValidationResult,
  ReservationRequest,
} from "./business-rules";

import { validateReservationDates } from "./pricing-system";

export interface User {
  id: string;
  type:
    | "miembro"
    | "viuda"
    | "visitador_especial"
    | "visitador_transeunte"
    | "visitador_juvenil"
    | "director_jcd";
  name: string;
  email: string;
  isActive: boolean;
  familyMembers?: string[]; // IDs de familiares autorizados para llaves
}

export interface Reservation {
  id: string;
  userId: string;
  userType: string;
  accommodationId: string;
  accommodationType:
    | "corinto_casas"
    | "el_sunzal_casas"
    | "apartamentos"
    | "suites";
  checkIn: string;
  checkOut: string;
  status: "pending" | "confirmed" | "cancelled" | "completed";
  paymentStatus: "pending" | "paid" | "refunded" | "exempt";
  createdAt: Date;
  updatedAt: Date;
  specialRequests?: string;
  emergencyModification?: boolean;
  emergencyProof?: boolean;
}

export interface ReservationValidationOptions {
  skipPaymentValidation?: boolean;
  skipBusinessRulesValidation?: boolean;
  isEmergencyModification?: boolean;
  emergencyProof?: boolean;
}

export class ReservationValidationService {
  private existingReservations: Reservation[] = [];
  private users: User[] = [];

  constructor(existingReservations: Reservation[] = [], users: User[] = []) {
    this.existingReservations = existingReservations;
    this.users = users;
  }

  // Método principal para validar una nueva reserva
  public validateNewReservation(
    userId: string,
    accommodationId: string,
    accommodationType:
      | "corinto_casas"
      | "el_sunzal_casas"
      | "apartamentos"
      | "suites",
    checkIn: string,
    checkOut: string,
    options: ReservationValidationOptions = {},
  ): ValidationResult {
    const result: ValidationResult = {
      valid: true,
      errors: [],
      warnings: [],
    };

    // Obtener información del usuario
    const user = this.users.find((u) => u.id === userId);
    if (!user) {
      result.valid = false;
      result.errors.push("Usuario no encontrado");
      return result;
    }

    if (!user.isActive) {
      result.valid = false;
      result.errors.push("Usuario inactivo");
      return result;
    }

    // Validar que el usuario puede ser titular de reserva
    const ownershipValidation = validateReservationOwnership(
      user.type,
      user.type,
    );
    if (!ownershipValidation.valid) {
      result.valid = false;
      result.errors.push(...ownershipValidation.errors);
      return result;
    }

    // Validar fechas básicas (sistema existente)
    const basicDateValidation = validateReservationDates(checkIn, checkOut);
    if (!basicDateValidation.valid) {
      result.valid = false;
      result.errors.push(basicDateValidation.error!);
      return result;
    }

    // Validar disponibilidad del alojamiento
    const availabilityValidation = this.validateAccommodationAvailability(
      accommodationId,
      checkIn,
      checkOut,
    );
    if (!availabilityValidation.valid) {
      result.valid = false;
      result.errors.push(...availabilityValidation.errors);
    }

    // Validar límites de reservas por usuario
    const userLimitsValidation = this.validateUserReservationLimits(
      userId,
      user.type,
      checkIn,
      checkOut,
      accommodationType,
    );
    if (!userLimitsValidation.valid) {
      result.valid = false;
      result.errors.push(...userLimitsValidation.errors);
    }
    result.warnings.push(...userLimitsValidation.warnings);

    // Validar reglas de negocio específicas
    if (!options.skipBusinessRulesValidation) {
      const isWeekend = this.isWeekendDate(checkIn);
      const businessRulesRequest: ReservationRequest = {
        userId,
        userType: user.type,
        accommodationType,
        checkIn,
        checkOut,
        isWeekend,
        existingReservations: this.existingReservations,
      };

      const businessRulesValidation =
        validateBusinessRules(businessRulesRequest);
      if (!businessRulesValidation.valid) {
        result.valid = false;
        result.errors.push(...businessRulesValidation.errors);
      }
      result.warnings.push(...businessRulesValidation.warnings);
    }

    // Validar conflictos con reservas existentes del usuario
    const conflictValidation = this.validateUserReservationConflicts(
      userId,
      checkIn,
      checkOut,
    );
    if (!conflictValidation.valid) {
      result.valid = false;
      result.errors.push(...conflictValidation.errors);
    }

    return result;
  }

  // Validar disponibilidad del alojamiento
  private validateAccommodationAvailability(
    accommodationId: string,
    checkIn: string,
    checkOut: string,
  ): ValidationResult {
    const result: ValidationResult = {
      valid: true,
      errors: [],
      warnings: [],
    };

    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);

    const conflictingReservation = this.existingReservations.find(
      (reservation) => {
        if (
          reservation.accommodationId !== accommodationId ||
          reservation.status === "cancelled"
        ) {
          return false;
        }

        const resCheckIn = new Date(reservation.checkIn);
        const resCheckOut = new Date(reservation.checkOut);

        return (
          (checkInDate >= resCheckIn && checkInDate < resCheckOut) ||
          (checkOutDate > resCheckIn && checkOutDate <= resCheckOut) ||
          (checkInDate <= resCheckIn && checkOutDate >= resCheckOut)
        );
      },
    );

    if (conflictingReservation) {
      result.valid = false;
      result.errors.push(
        `El alojamiento ${accommodationId} no está disponible en las fechas seleccionadas`,
      );
    }

    return result;
  }

  // Validar límites de reservas por usuario
  private validateUserReservationLimits(
    userId: string,
    userType: string,
    checkIn: string,
    checkOut: string,
    accommodationType: string,
  ): ValidationResult {
    const result: ValidationResult = {
      valid: true,
      errors: [],
      warnings: [],
    };

    const checkInDate = new Date(checkIn);
    const isWeekend = this.isWeekendDate(checkIn);

    // Para miembros regulares: solo una reserva por fin de semana
    if (userType === "miembro" && isWeekend) {
      const weekendReservations = this.existingReservations.filter(
        (res) =>
          res.userId === userId &&
          res.status !== "cancelled" &&
          this.isWeekendDate(res.checkIn) &&
          new Date(res.checkIn) >= new Date(), // reservas futuras
      );

      if (weekendReservations.length >= 1) {
        result.valid = false;
        result.errors.push(
          "Solo se puede reservar una casa/apartamento por miembro durante los fines de semana",
        );
      }
    }

    // Para directores: validar límites mensuales
    if (userType === "director_jcd") {
      const currentMonth = checkInDate.getMonth();
      const currentYear = checkInDate.getFullYear();

      const monthlyReservations = this.existingReservations.filter((res) => {
        const resDate = new Date(res.checkIn);
        return (
          res.userId === userId &&
          res.status !== "cancelled" &&
          resDate.getMonth() === currentMonth &&
          resDate.getFullYear() === currentYear
        );
      });

      // Máximo 3 reservas por mes (una por cada lugar)
      if (monthlyReservations.length >= 3) {
        result.valid = false;
        result.errors.push(
          "Los directores pueden hacer máximo 3 reservas mensuales (una por cada lugar)",
        );
      }

      // Verificar si ya tiene reserva en este tipo de alojamiento este mes
      const accommodationTypeReservations = monthlyReservations.filter(
        (res) => res.accommodationType === accommodationType,
      );

      if (accommodationTypeReservations.length >= 1) {
        result.valid = false;
        result.errors.push(
          `Ya tiene una reserva en ${accommodationType.replace("_", " ")} para este mes`,
        );
      }
    }

    return result;
  }

  // Validar conflictos con reservas existentes del usuario
  private validateUserReservationConflicts(
    userId: string,
    checkIn: string,
    checkOut: string,
  ): ValidationResult {
    const result: ValidationResult = {
      valid: true,
      errors: [],
      warnings: [],
    };

    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);

    const userReservations = this.existingReservations.filter(
      (res) => res.userId === userId && res.status !== "cancelled",
    );

    const conflictingReservation = userReservations.find((reservation) => {
      const resCheckIn = new Date(reservation.checkIn);
      const resCheckOut = new Date(reservation.checkOut);

      return (
        (checkInDate >= resCheckIn && checkInDate < resCheckOut) ||
        (checkOutDate > resCheckIn && checkOutDate <= resCheckOut) ||
        (checkInDate <= resCheckIn && checkOutDate >= resCheckOut)
      );
    });

    if (conflictingReservation) {
      result.valid = false;
      result.errors.push(
        "Ya tiene una reserva confirmada que se superpone con estas fechas",
      );
    }

    return result;
  }

  // Validar modificación de reserva existente
  public validateReservationModification(
    reservationId: string,
    newCheckIn?: string,
    newCheckOut?: string,
    options: ReservationValidationOptions = {},
  ): ValidationResult {
    const result: ValidationResult = {
      valid: true,
      errors: [],
      warnings: [],
    };

    const reservation = this.existingReservations.find(
      (r) => r.id === reservationId,
    );
    if (!reservation) {
      result.valid = false;
      result.errors.push("Reserva no encontrada");
      return result;
    }

    const user = this.users.find((u) => u.id === reservation.userId);
    if (!user) {
      result.valid = false;
      result.errors.push("Usuario no encontrado");
      return result;
    }

    // Solo se pueden modificar reservas pendientes o confirmadas
    if (
      reservation.status === "cancelled" ||
      reservation.status === "completed"
    ) {
      result.valid = false;
      result.errors.push(
        "No se puede modificar una reserva cancelada o completada",
      );
      return result;
    }

    // Validar período de notificación
    const modificationDate = new Date();
    const reservationDate = new Date(reservation.checkIn);

    const dateModificationValidation = validateDateModification(
      reservationDate,
      modificationDate,
      user.type,
      options.isEmergencyModification,
      options.emergencyProof,
    );

    if (!dateModificationValidation.valid) {
      if (options.isEmergencyModification && options.emergencyProof) {
        result.warnings.push(...dateModificationValidation.warnings);
        result.warnings.push(
          "Modificación de emergencia - requiere aprobación del Gerente General",
        );
      } else {
        result.valid = false;
        result.errors.push(...dateModificationValidation.errors);
      }
    }

    // Si se cambian las fechas, validar las nuevas fechas
    if (newCheckIn || newCheckOut) {
      const finalCheckIn = newCheckIn || reservation.checkIn;
      const finalCheckOut = newCheckOut || reservation.checkOut;

      const newReservationValidation = this.validateNewReservation(
        reservation.userId,
        reservation.accommodationId,
        reservation.accommodationType,
        finalCheckIn,
        finalCheckOut,
        options,
      );

      if (!newReservationValidation.valid) {
        result.valid = false;
        result.errors.push(...newReservationValidation.errors);
      }
      result.warnings.push(...newReservationValidation.warnings);
    }

    return result;
  }

  // Validar cancelación de reserva
  public validateReservationCancellation(
    reservationId: string,
    cancellationReason?: string,
  ): ValidationResult {
    const result: ValidationResult = {
      valid: true,
      errors: [],
      warnings: [],
    };

    const reservation = this.existingReservations.find(
      (r) => r.id === reservationId,
    );
    if (!reservation) {
      result.valid = false;
      result.errors.push("Reserva no encontrada");
      return result;
    }

    const user = this.users.find((u) => u.id === reservation.userId);
    if (!user) {
      result.valid = false;
      result.errors.push("Usuario no encontrado");
      return result;
    }

    // No se puede cancelar si ya está completada o cancelada
    if (reservation.status === "completed") {
      result.valid = false;
      result.errors.push("No se puede cancelar una reserva completada");
      return result;
    }

    if (reservation.status === "cancelled") {
      result.valid = false;
      result.errors.push("La reserva ya está cancelada");
      return result;
    }

    // Validar período de notificación para cancelación
    const cancellationDate = new Date();
    const reservationDate = new Date(reservation.checkIn);

    const cancellationValidation = validateReservationCancellation(
      reservationDate,
      cancellationDate,
      user.type,
    );

    result.warnings.push(...cancellationValidation.warnings);

    return result;
  }

  // Validar entrega de llaves
  public validateKeyHandover(
    reservationId: string,
    recipientId: string,
    authorizationLetter: boolean = false,
  ): ValidationResult {
    const reservation = this.existingReservations.find(
      (r) => r.id === reservationId,
    );
    if (!reservation) {
      return {
        valid: false,
        errors: ["Reserva no encontrada"],
        warnings: [],
      };
    }

    return validateKeyDelivery(
      reservation.userId,
      recipientId,
      authorizationLetter,
    );
  }

  // Validar transferencia de reserva
  public validateReservationTransferRequest(
    reservationId: string,
    fromUserId: string,
    toUserId: string,
  ): ValidationResult {
    // Las transferencias están prohibidas según las reglas de negocio
    return validateReservationTransfer(fromUserId, toUserId);
  }

  // Calcular información de pago según reglas de negocio
  public calculatePaymentInfo(
    userId: string,
    checkIn: string,
    totalPrice: number,
  ): {
    paymentRequired: boolean;
    timeLimit: number;
    exemptReason?: string;
  } {
    const user = this.users.find((u) => u.id === userId);
    if (!user) {
      return {
        paymentRequired: true,
        timeLimit: 72,
      };
    }

    const checkInDate = new Date(checkIn);
    const paymentTimeLimit = getPaymentTimeLimit(user.type);

    // Verificar si el director está exento de pago
    if (user.type === "director_jcd") {
      const exemptionInfo = isDirectorExemptFromPayment(checkInDate, user.type);
      return {
        paymentRequired: !exemptionInfo.exempt,
        timeLimit: paymentTimeLimit,
        exemptReason: exemptionInfo.reason,
      };
    }

    return {
      paymentRequired: true,
      timeLimit: paymentTimeLimit,
    };
  }

  // Obtener horarios de check-in/check-out
  public getCheckInOutInfo(
    userId: string,
    accommodationType?: string,
  ): { checkIn: string; checkOut: string } {
    const user = this.users.find((u) => u.id === userId);
    const userType = user?.type || "miembro";

    return getCheckInOutTimes(userType, accommodationType);
  }

  // Método auxiliar para determinar si una fecha es fin de semana
  private isWeekendDate(dateString: string): boolean {
    const date = new Date(dateString);
    const dayOfWeek = date.getDay();
    return dayOfWeek === 0 || dayOfWeek === 6; // Domingo o Sábado
  }

  // Obtener resumen de reglas aplicables para un usuario
  public getUserBusinessRulesSummary(userId: string): {
    userType: string;
    maxDays: number;
    allowedDays: string[];
    paymentTimeLimit: number;
    checkInTime: string;
    checkOutTime: string;
    specialRules: string[];
  } {
    const user = this.users.find((u) => u.id === userId);
    const userType = user?.type || "miembro";

    const checkInOutTimes = getCheckInOutTimes(userType);
    const paymentTimeLimit = getPaymentTimeLimit(userType);

    const specialRules: string[] = [];

    if (
      userType === "viuda" ||
      userType === "visitador_especial" ||
      userType === "visitador_transeunte"
    ) {
      specialRules.push(
        "Solo puede reservar entre semana, fines de semana con 3 días de anticipación",
      );
    }

    if (userType === "visitador_juvenil") {
      specialRules.push(
        "No puede reservar directamente, solo el miembro titular",
      );
    }

    if (userType === "director_jcd") {
      specialRules.push("Máximo 3 días por reserva, 3 reservas mensuales");
      specialRules.push("Exento de pago excepto en feriados y vacaciones");
    }

    specialRules.push("Reservas no transferibles");
    specialRules.push("Máximo 7 días consecutivos");

    return {
      userType,
      maxDays: userType === "director_jcd" ? 3 : 7,
      allowedDays:
        userType === "viuda" ||
        userType === "visitador_especial" ||
        userType === "visitador_transeunte"
          ? ["Lunes a Viernes (fin de semana con anticipación)"]
          : ["Todos los días"],
      paymentTimeLimit,
      checkInTime: checkInOutTimes.checkIn,
      checkOutTime: checkInOutTimes.checkOut,
      specialRules,
    };
  }
}

export default ReservationValidationService;
