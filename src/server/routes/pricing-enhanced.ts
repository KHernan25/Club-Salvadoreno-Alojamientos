import { Router, Request, Response } from "express";
import { HolidayModel } from "../database/models/Holiday";
import { AccommodationModel } from "../database/models/Accommodation";
import {
  calculateReservationPrice,
  getAccommodationRates,
  validateReservationDates,
  getDayType,
  getPricingStatistics,
  SEASON_INFO,
  checkAvailability,
} from "../../lib/pricing-system-enhanced";
import { auth } from "../middleware/auth";

const router = Router();

// GET /api/pricing/seasons - Obtener información de temporadas
router.get("/seasons", async (req: Request, res: Response) => {
  try {
    res.json({
      success: true,
      data: {
        seasons: SEASON_INFO,
        description: "Sistema de precios por temporada del Club Salvadoreño",
        rules: {
          temporada_baja: "Lunes a Jueves (días de semana)",
          temporada_alta: "Viernes a Domingo (fines de semana)",
          dias_asueto: "Días feriados oficiales de El Salvador",
        },
      },
    });
  } catch (error) {
    console.error("Error fetching season info:", error);
    res.status(500).json({
      success: false,
      error: "Error interno del servidor",
    });
  }
});

// GET /api/pricing/holidays - Obtener días feriados
router.get("/holidays", async (req: Request, res: Response) => {
  try {
    const { year, startDate, endDate } = req.query;
    
    let holidays;
    
    if (year) {
      holidays = await HolidayModel.findByYear(parseInt(year as string));
    } else if (startDate && endDate) {
      holidays = await HolidayModel.findByDateRange(
        new Date(startDate as string),
        new Date(endDate as string)
      );
    } else {
      holidays = await HolidayModel.findAll();
    }

    res.json({
      success: true,
      data: holidays,
      count: holidays.length,
    });
  } catch (error) {
    console.error("Error fetching holidays:", error);
    res.status(500).json({
      success: false,
      error: "Error interno del servidor",
    });
  }
});

// GET /api/pricing/holidays/upcoming - Obtener próximos feriados
router.get("/holidays/upcoming", async (req: Request, res: Response) => {
  try {
    const { days } = req.query;
    const daysAhead = days ? parseInt(days as string) : 30;
    
    const holidays = await HolidayModel.getUpcomingHolidays(daysAhead);

    res.json({
      success: true,
      data: holidays,
      count: holidays.length,
      daysAhead,
    });
  } catch (error) {
    console.error("Error fetching upcoming holidays:", error);
    res.status(500).json({
      success: false,
      error: "Error interno del servidor",
    });
  }
});

// POST /api/pricing/calculate - Calcular precio de estadía
router.post("/calculate", async (req: Request, res: Response) => {
  try {
    const { accommodationId, checkIn, checkOut, taxRate } = req.body;

    // Validar datos requeridos
    if (!accommodationId || !checkIn || !checkOut) {
      return res.status(400).json({
        success: false,
        error: "accommodationId, checkIn y checkOut son requeridos",
      });
    }

    // Validar fechas
    const dateValidation = validateReservationDates(checkIn, checkOut);
    if (!dateValidation.valid) {
      return res.status(400).json({
        success: false,
        error: dateValidation.error,
      });
    }

    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);

    // Verificar disponibilidad
    const isAvailable = await checkAvailability(accommodationId, checkInDate, checkOutDate);
    if (!isAvailable) {
      return res.status(400).json({
        success: false,
        error: "El alojamiento no está disponible para las fechas seleccionadas",
      });
    }

    // Calcular precio
    const calculation = await calculateReservationPrice(
      accommodationId,
      checkInDate,
      checkOutDate,
      taxRate || 0.13
    );

    if (!calculation) {
      return res.status(404).json({
        success: false,
        error: "Alojamiento no encontrado o error en el cálculo",
      });
    }

    res.json({
      success: true,
      data: {
        accommodationId,
        checkIn,
        checkOut,
        available: true,
        calculation,
      },
    });
  } catch (error) {
    console.error("Error calculating price:", error);
    res.status(500).json({
      success: false,
      error: "Error interno del servidor",
    });
  }
});

// GET /api/pricing/rates/:accommodationId - Obtener tarifas de un alojamiento
router.get("/rates/:accommodationId", async (req: Request, res: Response) => {
  try {
    const { accommodationId } = req.params;
    
    const rates = await getAccommodationRates(accommodationId);
    
    if (!rates) {
      return res.status(404).json({
        success: false,
        error: "Alojamiento no encontrado",
      });
    }

    // Obtener información del alojamiento
    const accommodation = await AccommodationModel.findById(accommodationId);

    res.json({
      success: true,
      data: {
        accommodationId,
        accommodationName: accommodation?.name,
        rates,
        currency: "USD",
        seasonInfo: SEASON_INFO,
      },
    });
  } catch (error) {
    console.error("Error fetching rates:", error);
    res.status(500).json({
      success: false,
      error: "Error interno del servidor",
    });
  }
});

// POST /api/pricing/check-availability - Verificar disponibilidad
router.post("/check-availability", async (req: Request, res: Response) => {
  try {
    const { accommodationId, checkIn, checkOut } = req.body;

    if (!accommodationId || !checkIn || !checkOut) {
      return res.status(400).json({
        success: false,
        error: "accommodationId, checkIn y checkOut son requeridos",
      });
    }

    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);

    const isAvailable = await checkAvailability(accommodationId, checkInDate, checkOutDate);

    res.json({
      success: true,
      data: {
        accommodationId,
        checkIn,
        checkOut,
        available: isAvailable,
      },
    });
  } catch (error) {
    console.error("Error checking availability:", error);
    res.status(500).json({
      success: false,
      error: "Error interno del servidor",
    });
  }
});

// GET /api/pricing/day-type/:date - Obtener tipo de día
router.get("/day-type/:date", async (req: Request, res: Response) => {
  try {
    const { date } = req.params;
    const targetDate = new Date(date);

    if (isNaN(targetDate.getTime())) {
      return res.status(400).json({
        success: false,
        error: "Fecha no válida. Use formato YYYY-MM-DD",
      });
    }

    const dayType = await getDayType(targetDate);
    const holiday = await HolidayModel.findByDate(targetDate);

    res.json({
      success: true,
      data: {
        date: date,
        dayType,
        seasonInfo: SEASON_INFO[dayType],
        isHoliday: holiday !== null,
        holidayInfo: holiday,
      },
    });
  } catch (error) {
    console.error("Error getting day type:", error);
    res.status(500).json({
      success: false,
      error: "Error interno del servidor",
    });
  }
});

// GET /api/pricing/statistics/:accommodationId - Obtener estadísticas de precios
router.get("/statistics/:accommodationId", auth, async (req: Request, res: Response) => {
  try {
    const { accommodationId } = req.params;
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      return res.status(400).json({
        success: false,
        error: "startDate y endDate son requeridos",
      });
    }

    const statistics = await getPricingStatistics(
      accommodationId,
      new Date(startDate as string),
      new Date(endDate as string)
    );

    if (!statistics) {
      return res.status(404).json({
        success: false,
        error: "Alojamiento no encontrado",
      });
    }

    res.json({
      success: true,
      data: {
        accommodationId,
        period: {
          startDate,
          endDate,
        },
        statistics,
      },
    });
  } catch (error) {
    console.error("Error getting pricing statistics:", error);
    res.status(500).json({
      success: false,
      error: "Error interno del servidor",
    });
  }
});

// POST /api/pricing/holidays - Crear nuevo feriado (Solo admin)
router.post("/holidays", auth, async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    
    if (!user || user.role !== "super_admin") {
      return res.status(403).json({
        success: false,
        error: "Solo los super administradores pueden crear feriados",
      });
    }

    const { date, name, description, seasonType } = req.body;

    if (!date || !name) {
      return res.status(400).json({
        success: false,
        error: "date y name son campos requeridos",
      });
    }

    const holidayData = {
      date: new Date(date),
      name,
      description: description || "",
      year: new Date(date).getFullYear(),
      seasonType: seasonType || "dias_asueto",
      isActive: true,
    };

    const holiday = await HolidayModel.create(holidayData);

    res.status(201).json({
      success: true,
      data: holiday,
      message: "Feriado creado exitosamente",
    });
  } catch (error) {
    console.error("Error creating holiday:", error);
    res.status(500).json({
      success: false,
      error: "Error interno del servidor",
    });
  }
});

// PUT /api/pricing/holidays/:id - Actualizar feriado (Solo admin)
router.put("/holidays/:id", auth, async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    
    if (!user || user.role !== "super_admin") {
      return res.status(403).json({
        success: false,
        error: "Solo los super administradores pueden actualizar feriados",
      });
    }

    const { id } = req.params;
    const updates = req.body;

    const holiday = await HolidayModel.update(parseInt(id), updates);

    if (!holiday) {
      return res.status(404).json({
        success: false,
        error: "Feriado no encontrado",
      });
    }

    res.json({
      success: true,
      data: holiday,
      message: "Feriado actualizado exitosamente",
    });
  } catch (error) {
    console.error("Error updating holiday:", error);
    res.status(500).json({
      success: false,
      error: "Error interno del servidor",
    });
  }
});

// DELETE /api/pricing/holidays/:id - Eliminar feriado (Solo admin)
router.delete("/holidays/:id", auth, async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    
    if (!user || user.role !== "super_admin") {
      return res.status(403).json({
        success: false,
        error: "Solo los super administradores pueden eliminar feriados",
      });
    }

    const { id } = req.params;
    const success = await HolidayModel.delete(parseInt(id));

    if (!success) {
      return res.status(404).json({
        success: false,
        error: "Feriado no encontrado",
      });
    }

    res.json({
      success: true,
      message: "Feriado eliminado exitosamente",
    });
  } catch (error) {
    console.error("Error deleting holiday:", error);
    res.status(500).json({
      success: false,
      error: "Error interno del servidor",
    });
  }
});

export { router as pricingRoutesEnhanced };
