import { Router, Request, Response } from "express";
import { AccommodationModel, type Accommodation } from "../database/models/Accommodation";
import { HolidayModel } from "../database/models/Holiday";
import { getAccommodationRates, calculateReservationPrice } from "../../lib/pricing-system-enhanced";
import { auth } from "../middleware/auth";

const router = Router();

// GET /api/accommodations - Obtener todos los alojamientos
router.get("/", async (req: Request, res: Response) => {
  try {
    const { location, type, capacity, minPrice, maxPrice, seasonType } = req.query;
    
    let accommodations: Accommodation[];

    if (location) {
      accommodations = await AccommodationModel.findByLocation(location as "el-sunzal" | "corinto");
    } else if (type) {
      accommodations = await AccommodationModel.findByType(type as "apartamento" | "casa" | "suite");
    } else if (capacity) {
      accommodations = await AccommodationModel.findByCapacity(parseInt(capacity as string));
    } else if (minPrice && maxPrice) {
      accommodations = await AccommodationModel.findByPriceRange(
        parseFloat(minPrice as string),
        parseFloat(maxPrice as string),
        seasonType as "temporada_baja" | "temporada_alta" | "dias_asueto"
      );
    } else {
      accommodations = await AccommodationModel.findAll();
    }

    res.json({
      success: true,
      data: accommodations,
      count: accommodations.length,
    });
  } catch (error) {
    console.error("Error fetching accommodations:", error);
    res.status(500).json({
      success: false,
      error: "Error interno del servidor",
    });
  }
});

// GET /api/accommodations/featured - Obtener alojamientos destacados
router.get("/featured", async (req: Request, res: Response) => {
  try {
    const accommodations = await AccommodationModel.findFeatured();
    res.json({
      success: true,
      data: accommodations,
      count: accommodations.length,
    });
  } catch (error) {
    console.error("Error fetching featured accommodations:", error);
    res.status(500).json({
      success: false,
      error: "Error interno del servidor",
    });
  }
});

// GET /api/accommodations/stats - Obtener estadísticas de alojamientos
router.get("/stats", async (req: Request, res: Response) => {
  try {
    const stats = await AccommodationModel.getStats();
    res.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    console.error("Error fetching accommodation stats:", error);
    res.status(500).json({
      success: false,
      error: "Error interno del servidor",
    });
  }
});

// GET /api/accommodations/location/:location - Obtener alojamientos por ubicación
router.get("/location/:location", async (req: Request, res: Response) => {
  try {
    const { location } = req.params;
    
    if (location !== "el-sunzal" && location !== "corinto") {
      return res.status(400).json({
        success: false,
        error: "Ubicación no válida. Use 'el-sunzal' o 'corinto'",
      });
    }

    const accommodations = await AccommodationModel.findByLocation(location);
    res.json({
      success: true,
      data: accommodations,
      count: accommodations.length,
    });
  } catch (error) {
    console.error("Error fetching accommodations by location:", error);
    res.status(500).json({
      success: false,
      error: "Error interno del servidor",
    });
  }
});

// GET /api/accommodations/:id - Obtener alojamiento específico
router.get("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const accommodation = await AccommodationModel.findById(id);

    if (!accommodation) {
      return res.status(404).json({
        success: false,
        error: "Alojamiento no encontrado",
      });
    }

    res.json({
      success: true,
      data: accommodation,
    });
  } catch (error) {
    console.error("Error fetching accommodation:", error);
    res.status(500).json({
      success: false,
      error: "Error interno del servidor",
    });
  }
});

// GET /api/accommodations/:id/rates - Obtener tarifas por temporada
router.get("/:id/rates", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const rates = await getAccommodationRates(id);

    if (!rates) {
      return res.status(404).json({
        success: false,
        error: "Alojamiento no encontrado o sin tarifas configuradas",
      });
    }

    res.json({
      success: true,
      data: {
        accommodationId: id,
        rates,
        seasonInfo: {
          temporada_baja: "Lunes a Jueves - Precio base",
          temporada_alta: "Viernes a Domingo - Precio elevado", 
          dias_asueto: "Días feriados - Precio premium",
        },
      },
    });
  } catch (error) {
    console.error("Error fetching accommodation rates:", error);
    res.status(500).json({
      success: false,
      error: "Error interno del servidor",
    });
  }
});

// GET /api/accommodations/:id/price-history - Obtener historial de precios
router.get("/:id/price-history", auth, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const history = await AccommodationModel.getPriceHistory(id);

    res.json({
      success: true,
      data: history,
      count: history.length,
    });
  } catch (error) {
    console.error("Error fetching price history:", error);
    res.status(500).json({
      success: false,
      error: "Error interno del servidor",
    });
  }
});

// POST /api/accommodations/:id/calculate-price - Calcular precio para fechas específicas
router.post("/:id/calculate-price", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { checkIn, checkOut, taxRate } = req.body;

    if (!checkIn || !checkOut) {
      return res.status(400).json({
        success: false,
        error: "Las fechas de check-in y check-out son requeridas",
      });
    }

    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);

    if (checkInDate >= checkOutDate) {
      return res.status(400).json({
        success: false,
        error: "La fecha de check-out debe ser posterior a la fecha de check-in",
      });
    }

    const calculation = await calculateReservationPrice(
      id,
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
        accommodationId: id,
        checkIn: checkInDate.toISOString().split('T')[0],
        checkOut: checkOutDate.toISOString().split('T')[0],
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

// POST /api/accommodations - Crear nuevo alojamiento (Solo admin)
router.post("/", auth, async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    
    if (!user || !["super_admin", "atencion_miembro"].includes(user.role)) {
      return res.status(403).json({
        success: false,
        error: "No tienes permisos para crear alojamientos",
      });
    }

    const accommodationData = req.body;
    
    // Validar datos requeridos
    const requiredFields = [
      "name", "type", "location", "capacity",
      "precioTemporadaBaja", "precioTemporadaAlta", "precioDiasAsueto"
    ];
    
    const missingFields = requiredFields.filter(field => !accommodationData[field]);
    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        error: `Campos requeridos faltantes: ${missingFields.join(", ")}`,
      });
    }

    accommodationData.updatedBy = user.id;
    accommodationData.available = accommodationData.available !== false;
    accommodationData.featured = accommodationData.featured === true;
    accommodationData.amenities = accommodationData.amenities || [];
    accommodationData.images = accommodationData.images || [];
    accommodationData.minNights = accommodationData.minNights || 1;
    accommodationData.maxNights = accommodationData.maxNights || 7;
    accommodationData.checkInTime = accommodationData.checkInTime || "15:00:00";
    accommodationData.checkOutTime = accommodationData.checkOutTime || "11:00:00";

    const accommodation = await AccommodationModel.create(accommodationData);

    res.status(201).json({
      success: true,
      data: accommodation,
      message: "Alojamiento creado exitosamente",
    });
  } catch (error) {
    console.error("Error creating accommodation:", error);
    res.status(500).json({
      success: false,
      error: "Error interno del servidor",
    });
  }
});

// PUT /api/accommodations/:id - Actualizar alojamiento (Solo admin)
router.put("/:id", auth, async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    
    if (!user || !["super_admin", "atencion_miembro"].includes(user.role)) {
      return res.status(403).json({
        success: false,
        error: "No tienes permisos para actualizar alojamientos",
      });
    }

    const { id } = req.params;
    const updates = req.body;

    const accommodation = await AccommodationModel.update(id, updates, user.id);

    if (!accommodation) {
      return res.status(404).json({
        success: false,
        error: "Alojamiento no encontrado",
      });
    }

    res.json({
      success: true,
      data: accommodation,
      message: "Alojamiento actualizado exitosamente",
    });
  } catch (error) {
    console.error("Error updating accommodation:", error);
    res.status(500).json({
      success: false,
      error: "Error interno del servidor",
    });
  }
});

// PUT /api/accommodations/:id/prices - Actualizar precios específicamente
router.put("/:id/prices", auth, async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    
    if (!user || !["super_admin", "atencion_miembro"].includes(user.role)) {
      return res.status(403).json({
        success: false,
        error: "No tienes permisos para actualizar precios",
      });
    }

    const { id } = req.params;
    const { precioTemporadaBaja, precioTemporadaAlta, precioDiasAsueto, reason } = req.body;

    const prices = {};
    if (precioTemporadaBaja !== undefined) prices.precioTemporadaBaja = precioTemporadaBaja;
    if (precioTemporadaAlta !== undefined) prices.precioTemporadaAlta = precioTemporadaAlta;
    if (precioDiasAsueto !== undefined) prices.precioDiasAsueto = precioDiasAsueto;

    if (Object.keys(prices).length === 0) {
      return res.status(400).json({
        success: false,
        error: "No se proporcionaron precios para actualizar",
      });
    }

    const accommodation = await AccommodationModel.updatePrices(
      id,
      prices,
      user.id,
      reason || "Actualización de precios desde API"
    );

    if (!accommodation) {
      return res.status(404).json({
        success: false,
        error: "Alojamiento no encontrado",
      });
    }

    res.json({
      success: true,
      data: accommodation,
      message: "Precios actualizados exitosamente",
    });
  } catch (error) {
    console.error("Error updating prices:", error);
    res.status(500).json({
      success: false,
      error: "Error interno del servidor",
    });
  }
});

// PUT /api/accommodations/:id/availability - Actualizar disponibilidad
router.put("/:id/availability", auth, async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    
    if (!user || !["super_admin", "atencion_miembro", "anfitrion"].includes(user.role)) {
      return res.status(403).json({
        success: false,
        error: "No tienes permisos para actualizar disponibilidad",
      });
    }

    const { id } = req.params;
    const { available } = req.body;

    if (typeof available !== "boolean") {
      return res.status(400).json({
        success: false,
        error: "El campo 'available' debe ser true o false",
      });
    }

    const success = await AccommodationModel.updateAvailability(id, available);

    if (!success) {
      return res.status(404).json({
        success: false,
        error: "Alojamiento no encontrado",
      });
    }

    res.json({
      success: true,
      message: `Alojamiento ${available ? "habilitado" : "deshabilitado"} exitosamente`,
    });
  } catch (error) {
    console.error("Error updating availability:", error);
    res.status(500).json({
      success: false,
      error: "Error interno del servidor",
    });
  }
});

export { router as accommodationRoutesEnhanced };
