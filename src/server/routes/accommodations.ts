import { Router } from "express";
import { database } from "../../lib/database";
import { optionalAuth, AuthenticatedRequest } from "../middleware/auth";
import { validatePaginationQuery } from "../middleware/validators";
import { asyncHandler, createError } from "../middleware/errorHandler";

const router = Router();

// GET /api/accommodations - Obtener todos los alojamientos
router.get(
  "/",
  optionalAuth,
  validatePaginationQuery,
  asyncHandler(async (req: AuthenticatedRequest, res) => {
    const location = req.query.location as string;
    const type = req.query.type as string;
    const capacity = req.query.capacity
      ? parseInt(req.query.capacity as string)
      : undefined;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const skip = (page - 1) * limit;

    // Obtener todos los alojamientos de la base de datos
    let allAccommodations = database.getAllAccommodations();

    // Aplicar filtros
    if (location) {
      allAccommodations = allAccommodations.filter(
        (acc) => acc.location === location,
      );
    }

    if (type) {
      allAccommodations = allAccommodations.filter((acc) => acc.type === type);
    }

    if (capacity) {
      allAccommodations = allAccommodations.filter(
        (acc) => acc.capacity >= capacity,
      );
    }

    const total = allAccommodations.length;
    const accommodations = allAccommodations.slice(skip, skip + limit);

    res.json({
      success: true,
      data: {
        accommodations,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
        filters: {
          location,
          type,
          capacity,
        },
      },
    });
  }),
);

// GET /api/accommodations/:id - Obtener alojamiento específico
router.get(
  "/:id",
  optionalAuth,
  asyncHandler(async (req: AuthenticatedRequest, res) => {
    const { id } = req.params;

    const accommodation = database.getAccommodationById(id);
    if (!accommodation) {
      throw createError("Alojamiento no encontrado", 404);
    }

    // Obtener reseñas del alojamiento
    const reviews = database.getReviewsByAccommodationId(id);

    res.json({
      success: true,
      data: {
        accommodation: {
          ...accommodation,
          reviews: reviews.map((review) => ({
            id: review.id,
            rating: review.rating,
            title: review.title,
            comment: review.comment,
            categories: review.categories,
            createdAt: review.createdAt,
            helpfulCount: review.helpfulCount,
            hostResponse: review.hostResponse,
          })),
          averageRating:
            reviews.length > 0
              ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
              : 0,
          totalReviews: reviews.length,
        },
      },
    });
  }),
);

// GET /api/accommodations/location/:location - Obtener por ubicación
router.get(
  "/location/:location",
  optionalAuth,
  validatePaginationQuery,
  asyncHandler(async (req: AuthenticatedRequest, res) => {
    const { location } = req.params;
    const type = req.query.type as string;

    if (location !== "el-sunzal" && location !== "corinto") {
      throw createError("Ubicación no encontrada", 404);
    }

    let accommodations = database
      .getAllAccommodations()
      .filter((acc) => acc.location === location);

    if (type) {
      accommodations = accommodations.filter((acc) => acc.type === type);
    }

    res.json({
      success: true,
      data: {
        location,
        type: type || "all",
        accommodations,
        total: accommodations.length,
      },
    });
  }),
);

// GET /api/accommodations/search/availability - Verificar disponibilidad
router.get(
  "/search/availability",
  optionalAuth,
  asyncHandler(async (req: AuthenticatedRequest, res) => {
    const { checkIn, checkOut, guests, location, type } = req.query;

    if (!checkIn || !checkOut) {
      throw createError("Fechas de check-in y check-out son requeridas", 400);
    }

    const guestCount = guests ? parseInt(guests as string) : 1;

    // Obtener todos los alojamientos
    let accommodations = database.getAllAccommodations();

    // Aplicar filtros
    if (location) {
      accommodations = accommodations.filter(
        (acc) => acc.location === location,
      );
    }

    if (type) {
      accommodations = accommodations.filter((acc) => acc.type === type);
    }

    // Filtrar por capacidad
    accommodations = accommodations.filter((acc) => acc.capacity >= guestCount);

    // Verificar disponibilidad contra reservas existentes
    const checkInDate = new Date(checkIn as string);
    const checkOutDate = new Date(checkOut as string);
    const existingReservations = database
      .getAllReservations()
      .filter((res) => res.status === "confirmed" || res.status === "pending");

    const availableAccommodations = accommodations.filter((acc) => {
      // Verificar si hay conflictos de fechas
      const hasConflict = existingReservations.some((res) => {
        if (res.accommodationId !== acc.id) return false;

        const resCheckIn = new Date(res.checkIn);
        const resCheckOut = new Date(res.checkOut);

        return checkInDate < resCheckOut && checkOutDate > resCheckIn;
      });

      return !hasConflict;
    });

    res.json({
      success: true,
      data: {
        searchCriteria: {
          checkIn,
          checkOut,
          guests: guestCount,
          location,
          type,
        },
        availableAccommodations,
        total: availableAccommodations.length,
      },
    });
  }),
);

export { router as accommodationRoutes };
