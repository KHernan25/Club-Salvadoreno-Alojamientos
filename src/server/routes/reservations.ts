import { Router } from "express";
import { v4 as uuidv4 } from "uuid";
import {
  authenticateToken,
  requireRole,
  AuthenticatedRequest,
} from "../middleware/auth";
import {
  validateReservation,
  validateIdParam,
  validatePaginationQuery,
} from "../middleware/validators";
import {
  calculateStayPrice,
  getAccommodationRates,
  validateReservationDates,
} from "../../lib/pricing-system";
import { asyncHandler, createError } from "../middleware/errorHandler";
import ReservationValidationService from "../../lib/reservation-validation-service";

const router = Router();

// Simulación de BD de usuarios en memoria
const mockUsers = [
  {
    id: "7",
    type: "miembro",
    name: "Carlos Rivera",
    email: "carlos@example.com",
    isActive: true,
    familyMembers: ["spouse-1", "child-1", "child-2"],
  },
  {
    id: "8",
    type: "viuda",
    name: "Ana María Torres",
    email: "ana@example.com",
    isActive: true,
    familyMembers: ["child-3"],
  },
  {
    id: "9",
    type: "director_jcd",
    name: "José Pérez",
    email: "jose@example.com",
    isActive: true,
    familyMembers: ["spouse-2"],
  },
  {
    id: "10",
    type: "visitador_especial",
    name: "María González",
    email: "maria@example.com",
    isActive: true,
    familyMembers: [],
  },
  {
    id: "11",
    type: "visitador_juvenil",
    name: "Pedro Junior",
    email: "pedro@example.com",
    isActive: true,
    familyMembers: [],
  },
];

// Simulación de BD de reservas en memoria
const reservations: any[] = [
  {
    id: "res-001",
    userId: "7",
    accommodationId: "1A",
    checkIn: "2024-06-30",
    checkOut: "2024-07-02",
    guests: 2,
    status: "confirmed",
    totalPrice: 460,
    paymentStatus: "paid",
    confirmationCode: "CRV001",
    createdAt: new Date("2024-06-20T10:00:00Z"),
    updatedAt: new Date("2024-06-20T10:00:00Z"),
    specialRequests: "Vista al mar, llegada tardía",
  },
  {
    id: "res-002",
    userId: "8",
    accommodationId: "corinto-casa-1",
    checkIn: "2024-07-05",
    checkOut: "2024-07-07",
    guests: 4,
    status: "pending",
    totalPrice: 560,
    paymentStatus: "pending",
    confirmationCode: "AMT002",
    createdAt: new Date("2024-06-21T14:30:00Z"),
    updatedAt: new Date("2024-06-21T14:30:00Z"),
    specialRequests: "Llegada en la mañana",
  },
  {
    id: "res-003",
    userId: "10",
    accommodationId: "suite1",
    checkIn: "2024-07-10",
    checkOut: "2024-07-12",
    guests: 2,
    status: "confirmed",
    totalPrice: 640,
    paymentStatus: "paid",
    confirmationCode: "DEM003",
    createdAt: new Date("2024-06-22T09:15:00Z"),
    updatedAt: new Date("2024-06-22T09:15:00Z"),
    specialRequests: "Celebración de aniversario",
  },
  {
    id: "res-004",
    userId: "9",
    accommodationId: "casa1",
    checkIn: "2024-07-15",
    checkOut: "2024-07-18",
    guests: 6,
    status: "cancelled",
    totalPrice: 1350,
    paymentStatus: "refunded",
    confirmationCode: "JPZ004",
    createdAt: new Date("2024-06-23T11:45:00Z"),
    updatedAt: new Date("2024-06-25T16:20:00Z"),
    specialRequests: "Cancelación por emergencia familiar",
  },
  {
    id: "res-005",
    userId: "7",
    accommodationId: "corinto1A",
    checkIn: "2024-07-20",
    checkOut: "2024-07-22",
    guests: 2,
    status: "pending",
    totalPrice: 360,
    paymentStatus: "pending",
    confirmationCode: "CRV005",
    createdAt: new Date("2024-06-24T08:30:00Z"),
    updatedAt: new Date("2024-06-24T08:30:00Z"),
    specialRequests: "Cuna para bebé",
  },
];

interface Reservation {
  id: string;
  userId: string;
  accommodationId: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  specialRequests?: string;
  status: "pending" | "confirmed" | "cancelled" | "completed";
  totalPrice: number;
  priceBreakdown: any;
  createdAt: Date;
  updatedAt: Date;
  paymentStatus: "pending" | "paid" | "refunded";
  paymentMethod?: "pay_later" | "payment_link" | "transfer" | "credit" | "card";
  confirmationCode: string;
}

// POST /api/reservations - Crear nueva reserva
router.post(
  "/",
  authenticateToken,
  validateReservation,
  asyncHandler(async (req: AuthenticatedRequest, res) => {
    const { accommodationId, checkIn, checkOut, guests, specialRequests } =
      req.body;
    const user = req.user;

    // Inicializar servicio de validación con datos actuales
    const validationService = new ReservationValidationService(
      reservations,
      mockUsers,
    );

    // Determinar tipo de alojamiento basado en el ID
    let accommodationType:
      | "corinto_casas"
      | "el_sunzal_casas"
      | "apartamentos"
      | "suites";

    if (accommodationId.includes("corinto-casa")) {
      accommodationType = "corinto_casas";
    } else if (accommodationId.includes("casa")) {
      accommodationType = "el_sunzal_casas";
    } else if (accommodationId.includes("suite")) {
      accommodationType = "suites";
    } else {
      accommodationType = "apartamentos";
    }

    // Validar reglas de negocio
    const businessRulesValidation = validationService.validateNewReservation(
      user.id,
      accommodationId,
      accommodationType,
      checkIn,
      checkOut,
    );

    if (!businessRulesValidation.valid) {
      throw createError(
        `Violación de reglas de negocio: ${businessRulesValidation.errors.join(", ")}`,
        400,
      );
    }

    // Verificar que el alojamiento existe y obtener precios
    const rates = getAccommodationRates(accommodationId);
    if (!rates) {
      throw createError("Alojamiento no encontrado", 404);
    }

    // Calcular precio total
    const checkInDate = new Date(checkIn + "T00:00:00");
    const checkOutDate = new Date(checkOut + "T00:00:00");
    const priceCalculation = calculateStayPrice(
      checkInDate,
      checkOutDate,
      rates,
    );

    // Calcular información de pago según reglas de negocio
    const paymentInfo = validationService.calculatePaymentInfo(
      user.id,
      checkIn,
      priceCalculation.totalPrice,
    );

    // Obtener información de horarios
    const checkInOutTimes = validationService.getCheckInOutInfo(
      user.id,
      accommodationType,
    );

    // Crear reserva
    const reservation: Reservation = {
      id: uuidv4(),
      userId: user.id,
      userType: mockUsers.find((u) => u.id === user.id)?.type || "miembro",
      accommodationId,
      accommodationType,
      checkIn,
      checkOut,
      guests,
      specialRequests: specialRequests || "",
      status: "pending",
      totalPrice: priceCalculation.totalPrice,
      priceBreakdown: priceCalculation,
      createdAt: new Date(),
      updatedAt: new Date(),
      paymentStatus: paymentInfo.paymentRequired ? "pending" : "exempt",
      confirmationCode: Math.random()
        .toString(36)
        .substring(2, 8)
        .toUpperCase(),
    };

    reservations.push(reservation);

    // Preparar respuesta con información de reglas de negocio
    const responseData = {
      reservation: {
        id: reservation.id,
        accommodationId: reservation.accommodationId,
        accommodationType: reservation.accommodationType,
        checkIn: reservation.checkIn,
        checkOut: reservation.checkOut,
        guests: reservation.guests,
        specialRequests: reservation.specialRequests,
        status: reservation.status,
        totalPrice: reservation.totalPrice,
        priceBreakdown: reservation.priceBreakdown,
        confirmationCode: reservation.confirmationCode,
        paymentStatus: reservation.paymentStatus,
        createdAt: reservation.createdAt,
      },
      businessRules: {
        paymentRequired: paymentInfo.paymentRequired,
        paymentTimeLimit: paymentInfo.timeLimit,
        exemptReason: paymentInfo.exemptReason,
        checkInTime: checkInOutTimes.checkIn,
        checkOutTime: checkInOutTimes.checkOut,
        warnings: businessRulesValidation.warnings,
      },
    };

    res.status(201).json({
      success: true,
      message: "Reserva creada exitosamente",
      data: responseData,
    });
  }),
);

// GET /api/reservations - Obtener reservas del usuario actual
router.get(
  "/",
  authenticateToken,
  validatePaginationQuery,
  asyncHandler(async (req: AuthenticatedRequest, res) => {
    const user = req.user;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;
    const status = req.query.status as string;

    // Filtrar reservas del usuario
    let userReservations = reservations.filter((r) => r.userId === user.id);

    // Filtrar por estado si se especifica
    if (status) {
      userReservations = userReservations.filter((r) => r.status === status);
    }

    // Ordenar por fecha de creación (más recientes primero)
    userReservations.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );

    const total = userReservations.length;
    const paginatedReservations = userReservations.slice(skip, skip + limit);

    res.json({
      success: true,
      data: {
        reservations: paginatedReservations.map((r) => ({
          id: r.id,
          accommodationId: r.accommodationId,
          checkIn: r.checkIn,
          checkOut: r.checkOut,
          guests: r.guests,
          specialRequests: r.specialRequests,
          status: r.status,
          totalPrice: r.totalPrice,
          confirmationCode: r.confirmationCode,
          paymentStatus: r.paymentStatus,
          createdAt: r.createdAt,
        })),
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      },
    });
  }),
);

// GET /api/reservations/all - Obtener todas las reservas (admin/staff)
router.get(
  "/all",
  authenticateToken,
  requireRole(["admin", "staff"]),
  validatePaginationQuery,
  asyncHandler(async (req: AuthenticatedRequest, res) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;
    const status = req.query.status as string;
    const accommodationId = req.query.accommodationId as string;

    let filteredReservations = [...reservations];

    // Filtros
    if (status) {
      filteredReservations = filteredReservations.filter(
        (r) => r.status === status,
      );
    }

    if (accommodationId) {
      filteredReservations = filteredReservations.filter(
        (r) => r.accommodationId === accommodationId,
      );
    }

    // Ordenar por fecha de creación
    filteredReservations.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );

    const total = filteredReservations.length;
    const paginatedReservations = filteredReservations.slice(
      skip,
      skip + limit,
    );

    res.json({
      success: true,
      data: {
        reservations: paginatedReservations,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      },
    });
  }),
);

// GET /api/reservations/:id - Obtener reserva específica
router.get(
  "/:id",
  authenticateToken,
  validateIdParam,
  asyncHandler(async (req: AuthenticatedRequest, res) => {
    const { id } = req.params;
    const user = req.user;

    const reservation = reservations.find((r) => r.id === id);
    if (!reservation) {
      throw createError("Reserva no encontrada", 404);
    }

    // Solo el dueño de la reserva o staff/admin pueden verla
    if (user.role === "miembro" && reservation.userId !== user.id) {
      throw createError("No tienes permisos para ver esta reserva", 403);
    }

    res.json({
      success: true,
      data: {
        reservation,
      },
    });
  }),
);

// PUT /api/reservations/:id - Actualizar reserva
router.put(
  "/:id",
  authenticateToken,
  validateIdParam,
  asyncHandler(async (req: AuthenticatedRequest, res) => {
    const { id } = req.params;
    const user = req.user;
    const updates = req.body;

    const reservation = reservations.find((r) => r.id === id);
    if (!reservation) {
      throw createError("Reserva no encontrada", 404);
    }

    // Solo el dueño de la reserva puede modificarla (y solo si está pending)
    if (user.role === "miembro") {
      if (reservation.userId !== user.id) {
        throw createError(
          "No tienes permisos para modificar esta reserva",
          403,
        );
      }
      if (reservation.status !== "pending") {
        throw createError("Solo se pueden modificar reservas pendientes", 400);
      }
    }

    // Campos permitidos para actualizar
    const allowedFields = ["specialRequests"];
    if (user.role === "admin" || user.role === "staff") {
      allowedFields.push("status", "paymentStatus");
    }

    // Aplicar actualizaciones
    let recalculatePrice = false;
    for (const field of allowedFields) {
      if (updates[field] !== undefined) {
        reservation[field] = updates[field];
        reservation.updatedAt = new Date();
      }
    }

    // Si es staff/admin actualizando fechas, recalcular precio
    if (
      (user.role === "admin" || user.role === "staff") &&
      (updates.checkIn || updates.checkOut)
    ) {
      if (updates.checkIn) reservation.checkIn = updates.checkIn;
      if (updates.checkOut) reservation.checkOut = updates.checkOut;
      recalculatePrice = true;
    }

    if (recalculatePrice) {
      const rates = getAccommodationRates(reservation.accommodationId);
      if (rates) {
        const checkInDate = new Date(reservation.checkIn + "T00:00:00");
        const checkOutDate = new Date(reservation.checkOut + "T00:00:00");
        const priceCalculation = calculateStayPrice(
          checkInDate,
          checkOutDate,
          rates,
        );

        reservation.totalPrice = priceCalculation.totalPrice;
        reservation.priceBreakdown = priceCalculation;
      }
    }

    res.json({
      success: true,
      message: "Reserva actualizada exitosamente",
      data: {
        reservation,
      },
    });
  }),
);

// DELETE /api/reservations/:id - Cancelar reserva
router.delete(
  "/:id",
  authenticateToken,
  validateIdParam,
  asyncHandler(async (req: AuthenticatedRequest, res) => {
    const { id } = req.params;
    const user = req.user;

    const reservation = reservations.find((r) => r.id === id);
    if (!reservation) {
      throw createError("Reserva no encontrada", 404);
    }

    // Solo el dueño de la reserva o admin/staff pueden cancelarla
    if (user.role === "miembro" && reservation.userId !== user.id) {
      throw createError("No tienes permisos para cancelar esta reserva", 403);
    }

    // No se puede cancelar si ya está completada
    if (reservation.status === "completed") {
      throw createError("No se puede cancelar una reserva completada", 400);
    }

    if (reservation.status === "cancelled") {
      throw createError("La reserva ya está cancelada", 400);
    }

    // Cancelar reserva
    reservation.status = "cancelled";
    reservation.updatedAt = new Date();

    // En implementación real, manejar reembolsos automáticos
    if (reservation.paymentStatus === "paid") {
      reservation.paymentStatus = "refunded";
    }

    res.json({
      success: true,
      message: "Reserva cancelada exitosamente",
      data: {
        reservation: {
          id: reservation.id,
          status: reservation.status,
          paymentStatus: reservation.paymentStatus,
          updatedAt: reservation.updatedAt,
        },
      },
    });
  }),
);

// GET /api/reservations/stats/summary - Estadísticas de reservas (admin/staff)
router.get(
  "/stats/summary",
  authenticateToken,
  requireRole(["admin", "staff"]),
  asyncHandler(async (req: AuthenticatedRequest, res) => {
    const total = reservations.length;
    const pending = reservations.filter((r) => r.status === "pending").length;
    const confirmed = reservations.filter(
      (r) => r.status === "confirmed",
    ).length;
    const cancelled = reservations.filter(
      (r) => r.status === "cancelled",
    ).length;
    const completed = reservations.filter(
      (r) => r.status === "completed",
    ).length;

    const totalRevenue = reservations
      .filter((r) => r.status === "completed" && r.paymentStatus === "paid")
      .reduce((sum, r) => sum + r.totalPrice, 0);

    const thisMonth = new Date();
    thisMonth.setDate(1);
    thisMonth.setHours(0, 0, 0, 0);

    const monthlyReservations = reservations.filter(
      (r) => new Date(r.createdAt) >= thisMonth,
    ).length;

    const monthlyRevenue = reservations
      .filter(
        (r) =>
          new Date(r.createdAt) >= thisMonth &&
          r.status === "completed" &&
          r.paymentStatus === "paid",
      )
      .reduce((sum, r) => sum + r.totalPrice, 0);

    res.json({
      success: true,
      data: {
        summary: {
          total,
          byStatus: {
            pending,
            confirmed,
            cancelled,
            completed,
          },
          revenue: {
            total: totalRevenue,
            monthly: monthlyRevenue,
          },
          monthly: {
            reservations: monthlyReservations,
          },
        },
      },
    });
  }),
);

export { router as reservationRoutes };
