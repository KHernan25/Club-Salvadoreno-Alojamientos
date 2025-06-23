import { Router } from "express";
import {
  accommodationRates,
  getAccommodationRates,
  calculateStayPrice,
  validateReservationDates,
  getDayType,
  formatPrice,
  getMinimumDate,
  holidays2025,
  holidays2026,
} from "../../lib/pricing-system";
import { optionalAuth, AuthenticatedRequest } from "../middleware/auth";
import { asyncHandler, createError } from "../middleware/errorHandler";

const router = Router();

// GET /api/pricing/rates - Obtener todas las tarifas
router.get(
  "/rates",
  optionalAuth,
  asyncHandler(async (req: AuthenticatedRequest, res) => {
    const accommodationId = req.query.accommodationId as string;

    if (accommodationId) {
      const rates = getAccommodationRates(accommodationId);
      if (!rates) {
        throw createError("Alojamiento no encontrado", 404);
      }

      res.json({
        success: true,
        data: {
          accommodationId,
          rates,
        },
      });
    } else {
      res.json({
        success: true,
        data: {
          rates: accommodationRates,
        },
      });
    }
  }),
);

// POST /api/pricing/calculate - Calcular precio de estadía
router.post(
  "/calculate",
  optionalAuth,
  asyncHandler(async (req: AuthenticatedRequest, res) => {
    const { accommodationId, checkIn, checkOut } = req.body;

    if (!accommodationId || !checkIn || !checkOut) {
      throw createError(
        "accommodationId, checkIn y checkOut son requeridos",
        400,
      );
    }

    // Validar fechas
    const dateValidation = validateReservationDates(checkIn, checkOut);
    if (!dateValidation.valid) {
      throw createError(dateValidation.error!, 400);
    }

    // Obtener tarifas del alojamiento
    const rates = getAccommodationRates(accommodationId);
    if (!rates) {
      throw createError("Alojamiento no encontrado", 404);
    }

    // Calcular precio
    const checkInDate = new Date(checkIn + "T00:00:00");
    const checkOutDate = new Date(checkOut + "T00:00:00");
    const calculation = calculateStayPrice(checkInDate, checkOutDate, rates);

    res.json({
      success: true,
      data: {
        accommodationId,
        checkIn,
        checkOut,
        rates,
        calculation: {
          ...calculation,
          formattedTotal: formatPrice(calculation.totalPrice),
          breakdown: calculation.breakdown.map((day) => ({
            ...day,
            formattedPrice: formatPrice(day.price),
            date: day.date.toISOString().split("T")[0],
          })),
        },
      },
    });
  }),
);

// GET /api/pricing/day-types - Obtener información sobre tipos de día
router.get(
  "/day-types",
  optionalAuth,
  asyncHandler(async (req: AuthenticatedRequest, res) => {
    const { startDate, endDate } = req.query;

    let dateRange: { date: string; dayType: string; isHoliday: boolean }[] = [];

    if (startDate && endDate) {
      const start = new Date((startDate as string) + "T00:00:00");
      const end = new Date((endDate as string) + "T00:00:00");

      if (end <= start) {
        throw createError("endDate debe ser posterior a startDate", 400);
      }

      const current = new Date(start);
      while (current < end) {
        const dayType = getDayType(current);
        dateRange.push({
          date: current.toISOString().split("T")[0],
          dayType,
          isHoliday: dayType === "holiday",
        });
        current.setDate(current.getDate() + 1);
      }
    }

    res.json({
      success: true,
      data: {
        dayTypes: {
          weekday: "Lunes a Viernes",
          weekend: "Sábado y Domingo",
          holiday: "Días feriados oficiales",
        },
        holidays: {
          2025: holidays2025,
          2026: holidays2026,
        },
        minimumDate: getMinimumDate(),
        ...(dateRange.length > 0 && { dateRange }),
      },
    });
  }),
);

// GET /api/pricing/accommodation/:id - Obtener información de precios para un alojamiento específico
router.get(
  "/accommodation/:id",
  optionalAuth,
  asyncHandler(async (req: AuthenticatedRequest, res) => {
    const { id } = req.params;
    const { month, year } = req.query;

    const rates = getAccommodationRates(id);
    if (!rates) {
      throw createError("Alojamiento no encontrado", 404);
    }

    let calendar: any[] = [];

    // Si se solicita un mes específico, generar calendario
    if (month && year) {
      const monthNum = parseInt(month as string);
      const yearNum = parseInt(year as string);

      if (monthNum < 1 || monthNum > 12) {
        throw createError("Mes debe estar entre 1 y 12", 400);
      }

      const startDate = new Date(yearNum, monthNum - 1, 1);
      const endDate = new Date(yearNum, monthNum, 0);

      const current = new Date(startDate);
      while (current <= endDate) {
        const dayType = getDayType(current);
        const price = rates[dayType as keyof typeof rates];

        calendar.push({
          date: current.toISOString().split("T")[0],
          dayType,
          price,
          formattedPrice: formatPrice(price),
          available: true, // En implementación real, verificar disponibilidad
        });

        current.setDate(current.getDate() + 1);
      }
    }

    res.json({
      success: true,
      data: {
        accommodationId: id,
        rates: {
          ...rates,
          weekdayFormatted: formatPrice(rates.weekday),
          weekendFormatted: formatPrice(rates.weekend),
          holidayFormatted: formatPrice(rates.holiday),
        },
        ...(calendar.length > 0 && { calendar }),
      },
    });
  }),
);

// GET /api/pricing/compare - Comparar precios entre alojamientos
router.get(
  "/compare",
  optionalAuth,
  asyncHandler(async (req: AuthenticatedRequest, res) => {
    const { accommodationIds, checkIn, checkOut } = req.query;

    if (!accommodationIds) {
      throw createError("accommodationIds es requerido", 400);
    }

    const ids = (accommodationIds as string).split(",");

    if (ids.length > 10) {
      throw createError("Máximo 10 alojamientos para comparar", 400);
    }

    const comparisons: any[] = [];

    for (const id of ids) {
      const rates = getAccommodationRates(id.trim());

      if (!rates) {
        comparisons.push({
          accommodationId: id.trim(),
          error: "Alojamiento no encontrado",
        });
        continue;
      }

      let calculation = null;

      // Si se proporcionan fechas, calcular precio total
      if (checkIn && checkOut) {
        const dateValidation = validateReservationDates(
          checkIn as string,
          checkOut as string,
        );
        if (dateValidation.valid) {
          const checkInDate = new Date((checkIn as string) + "T00:00:00");
          const checkOutDate = new Date((checkOut as string) + "T00:00:00");
          calculation = calculateStayPrice(checkInDate, checkOutDate, rates);
        }
      }

      comparisons.push({
        accommodationId: id.trim(),
        rates: {
          ...rates,
          weekdayFormatted: formatPrice(rates.weekday),
          weekendFormatted: formatPrice(rates.weekend),
          holidayFormatted: formatPrice(rates.holiday),
        },
        ...(calculation && {
          calculation: {
            ...calculation,
            formattedTotal: formatPrice(calculation.totalPrice),
          },
        }),
      });
    }

    res.json({
      success: true,
      data: {
        comparisons,
        ...(checkIn &&
          checkOut && {
            searchDates: { checkIn, checkOut },
          }),
      },
    });
  }),
);

// GET /api/pricing/lowest - Encontrar los precios más bajos
router.get(
  "/lowest",
  optionalAuth,
  asyncHandler(async (req: AuthenticatedRequest, res) => {
    const { location, type, capacity } = req.query;

    // Filtrar alojamientos según criterios
    let filteredRates = Object.entries(accommodationRates);

    // En implementación real, filtrarías por ubicación, tipo y capacidad
    // consultando la BD de alojamientos

    // Encontrar los precios más bajos por categoría
    const lowest = {
      weekday: { price: Infinity, accommodationId: "", formattedPrice: "" },
      weekend: { price: Infinity, accommodationId: "", formattedPrice: "" },
      holiday: { price: Infinity, accommodationId: "", formattedPrice: "" },
    };

    filteredRates.forEach(([id, rates]) => {
      if (rates.weekday < lowest.weekday.price) {
        lowest.weekday = {
          price: rates.weekday,
          accommodationId: id,
          formattedPrice: formatPrice(rates.weekday),
        };
      }

      if (rates.weekend < lowest.weekend.price) {
        lowest.weekend = {
          price: rates.weekend,
          accommodationId: id,
          formattedPrice: formatPrice(rates.weekend),
        };
      }

      if (rates.holiday < lowest.holiday.price) {
        lowest.holiday = {
          price: rates.holiday,
          accommodationId: id,
          formattedPrice: formatPrice(rates.holiday),
        };
      }
    });

    res.json({
      success: true,
      data: {
        filters: { location, type, capacity },
        lowestPrices: lowest,
        totalAccommodations: filteredRates.length,
      },
    });
  }),
);

export { router as pricingRoutes };
