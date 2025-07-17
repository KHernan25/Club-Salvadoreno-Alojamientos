import { Router } from "express";
import { database } from "../../lib/database";
import { optionalAuth, AuthenticatedRequest } from "../middleware/auth";
import { validatePaginationQuery } from "../middleware/validators";
import { asyncHandler, createError } from "../middleware/errorHandler";

const router = Router();

// Datos completos de alojamientos
const accommodationsData = {
  "el-sunzal": {
    apartamentos: [
      {
        id: "1A",
        name: "Apartamento 1A",
        capacity: 2,
        location: "el-sunzal",
        type: "apartamento",
        view: "Vista al mar",
        amenities: ["Wi-Fi", "Aire acondicionado", "TV", "Kitchenette"],
        description:
          "Cómodo apartamento con vista directa al mar, perfecto para parejas.",
      },
      {
        id: "1B",
        name: "Apartamento 1B",
        capacity: 2,
        location: "el-sunzal",
        type: "apartamento",
        view: "Vista parcial",
        amenities: ["Wi-Fi", "Aire acondicionado", "TV", "Kitchenette"],
        description: "Apartamento acogedor con vista parcial al mar.",
      },
      {
        id: "2A",
        name: "Apartamento 2A",
        capacity: 4,
        location: "el-sunzal",
        type: "apartamento",
        view: "Vista al mar premium",
        amenities: [
          "Wi-Fi",
          "Aire acondicionado",
          "TV",
          "Cocina completa",
          "Balcón",
        ],
        description:
          "Espacioso apartamento para familias con vista premium al mar.",
      },
      {
        id: "2B",
        name: "Apartamento 2B",
        capacity: 4,
        location: "el-sunzal",
        type: "apartamento",
        view: "Vista jardín",
        amenities: ["Wi-Fi", "Aire acondicionado", "TV", "Cocina completa"],
        description: "Apartamento familiar con vista al jardín tropical.",
      },
      {
        id: "3A",
        name: "Apartamento 3A",
        capacity: 6,
        location: "el-sunzal",
        type: "apartamento",
        view: "Penthouse",
        amenities: [
          "Wi-Fi",
          "Aire acondicionado",
          "TV",
          "Cocina gourmet",
          "Terraza",
          "Jacuzzi",
        ],
        description:
          "Penthouse de lujo con todas las comodidades para grupos grandes.",
      },
      {
        id: "3B",
        name: "Apartamento 3B",
        capacity: 6,
        location: "el-sunzal",
        type: "apartamento",
        view: "Vista lateral",
        amenities: [
          "Wi-Fi",
          "Aire acondicionado",
          "TV",
          "Cocina completa",
          "Terraza",
        ],
        description: "Amplio apartamento con vista lateral al mar.",
      },
    ],
    casas: [
      {
        id: "casa1",
        name: "Casa Surf Paradise",
        capacity: 6,
        location: "el-sunzal",
        type: "casa",
        view: "Frente al mar",
        amenities: [
          "Wi-Fi",
          "Aire acondicionado",
          "Cocina completa",
          "Terraza",
          "Almacenamiento para tablas",
          "Ducha exterior",
        ],
        description:
          "Casa diseñada especialmente para surfistas con acceso directo al break.",
      },
      {
        id: "casa2",
        name: "Casa Familiar Deluxe",
        capacity: 8,
        location: "el-sunzal",
        type: "casa",
        view: "Amplia vista",
        amenities: [
          "Wi-Fi",
          "Aire acondicionado",
          "Cocina gourmet",
          "Jardín privado",
          "BBQ",
          "Sala de juegos",
        ],
        description:
          "Casa amplia y familiar con todas las comodidades para grupos grandes.",
      },
      {
        id: "casa3",
        name: "Casa Vista Panorámica",
        capacity: 6,
        location: "el-sunzal",
        type: "casa",
        view: "Panorámica elevada",
        amenities: [
          "Wi-Fi",
          "Aire acondicionado",
          "Cocina completa",
          "Jacuzzi exterior",
          "Terraza multinivel",
          "Hamacas",
        ],
        description:
          "Casa elevada con vista panorámica espectacular del océano.",
      },
    ],
    suites: Array.from({ length: 16 }, (_, i) => ({
      id: `suite${i + 1}`,
      name: `Suite ${i + 1}`,
      capacity: 2 + Math.floor(i / 4),
      location: "el-sunzal",
      type: "suite",
      view: "Premium",
      amenities: [
        "Wi-Fi",
        "Aire acondicionado",
        "TV Premium",
        "Minibar",
        "Room service",
        "Jacuzzi",
      ],
      description: `Suite de lujo número ${i + 1} con servicios premium incluidos.`,
    })),
  },
  corinto: {
    apartamentos: [
      {
        id: "corinto1A",
        name: "Apartamento Corinto 1A",
        capacity: 2,
        location: "corinto",
        type: "apartamento",
        view: "Vista lago",
        amenities: ["Wi-Fi", "Aire acondicionado", "TV", "Kitchenette"],
        description: "Apartamento con hermosa vista al lago.",
      },
      {
        id: "corinto1B",
        name: "Apartamento Corinto 1B",
        capacity: 2,
        location: "corinto",
        type: "apartamento",
        view: "Vista parcial",
        amenities: ["Wi-Fi", "Aire acondicionado", "TV", "Kitchenette"],
        description: "Acogedor apartamento en Corinto.",
      },
      {
        id: "corinto2A",
        name: "Apartamento Corinto 2A",
        capacity: 4,
        location: "corinto",
        type: "apartamento",
        view: "Vista lago premium",
        amenities: [
          "Wi-Fi",
          "Aire acondicionado",
          "TV",
          "Cocina completa",
          "Balcón",
        ],
        description: "Apartamento familiar con vista premium al lago.",
      },
      {
        id: "corinto2B",
        name: "Apartamento Corinto 2B",
        capacity: 4,
        location: "corinto",
        type: "apartamento",
        view: "Vista jardín",
        amenities: ["Wi-Fi", "Aire acondicionado", "TV", "Cocina completa"],
        description: "Apartamento con vista al jardín tropical.",
      },
      {
        id: "corinto3A",
        name: "Apartamento Corinto 3A",
        capacity: 6,
        location: "corinto",
        type: "apartamento",
        view: "Penthouse",
        amenities: [
          "Wi-Fi",
          "Aire acondicionado",
          "TV",
          "Cocina gourmet",
          "Terraza",
        ],
        description: "Penthouse en Corinto con vista espectacular.",
      },
      {
        id: "corinto3B",
        name: "Apartamento Corinto 3B",
        capacity: 6,
        location: "corinto",
        type: "apartamento",
        view: "Vista lateral",
        amenities: [
          "Wi-Fi",
          "Aire acondicionado",
          "TV",
          "Cocina completa",
          "Terraza",
        ],
        description: "Amplio apartamento en Corinto.",
      },
    ],
    casas: [
      {
        id: "corinto-casa-1",
        name: "Casa del Lago",
        capacity: 6,
        location: "corinto",
        type: "casa",
        view: "Vista directa al lago",
        amenities: [
          "Wi-Fi",
          "Aire acondicionado",
          "Cocina completa",
          "Jardín privado",
          "Terraza",
        ],
        description: "Casa con vista directa al lago y jardín privado.",
      },
      {
        id: "corinto-casa-2",
        name: "Casa Ejecutiva Premium",
        capacity: 8,
        location: "corinto",
        type: "casa",
        view: "Estilo corporativo",
        amenities: [
          "Wi-Fi",
          "Aire acondicionado",
          "Cocina gourmet",
          "Sala de reuniones",
          "Oficina",
        ],
        description: "Casa estilo ejecutivo con espacios para trabajo.",
      },
      {
        id: "corinto-casa-3",
        name: "Casa Rústica Tradicional",
        capacity: 4,
        location: "corinto",
        type: "casa",
        view: "Arquitectura tradicional",
        amenities: [
          "Wi-Fi",
          "Aire acondicionado",
          "Cocina completa",
          "Chimenea",
          "Jardín",
        ],
        description: "Casa con arquitectura tradicional y ambiente acogedor.",
      },
      {
        id: "corinto-casa-4",
        name: "Casa Moderna Minimalista",
        capacity: 6,
        location: "corinto",
        type: "casa",
        view: "Diseño contemporáneo",
        amenities: [
          "Wi-Fi",
          "Aire acondicionado",
          "Cocina moderna",
          "Smart Home",
          "Terraza",
        ],
        description: "Casa de diseño minimalista con tecnología integrada.",
      },
      {
        id: "corinto-casa-5",
        name: "Casa Familiar Grande",
        capacity: 10,
        location: "corinto",
        type: "casa",
        view: "Espacios amplios",
        amenities: [
          "Wi-Fi",
          "Aire acondicionado",
          "Cocina industrial",
          "Múltiples salas",
          "Jardín grande",
        ],
        description:
          "Casa amplia ideal para grupos grandes y reuniones familiares.",
      },
      {
        id: "corinto-casa-6",
        name: "Casa Romántica",
        capacity: 2,
        location: "corinto",
        type: "casa",
        view: "Ideal parejas",
        amenities: [
          "Wi-Fi",
          "Aire acondicionado",
          "Cocina gourmet",
          "Jacuzzi privado",
          "Decoración elegante",
        ],
        description:
          "Casa íntima y elegante perfecta para escapadas románticas.",
      },
    ],
  },
};

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

    if (!accommodationsData[location as keyof typeof accommodationsData]) {
      throw createError("Ubicación no encontrada", 404);
    }

    const locationData =
      accommodationsData[location as keyof typeof accommodationsData];
    let accommodations: any[] = [];

    if (type && locationData[type as keyof typeof locationData]) {
      accommodations = locationData[type as keyof typeof locationData] as any[];
    } else {
      // Obtener todos los tipos para la ubicación
      Object.entries(locationData).forEach(([typ, accs]) => {
        accommodations.push(...(accs as any[]));
      });
    }

    // Agregar precios
    accommodations = accommodations.map((acc) => ({
      ...acc,
      pricing: getAccommodationRates(acc.id),
      available: true,
    }));

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

    // En implementación real, verificar disponibilidad en BD
    // Por ahora, simular disponibilidad

    let availableAccommodations: any[] = [];

    Object.entries(accommodationsData).forEach(([loc, types]) => {
      if (location && loc !== location) return;

      Object.entries(types).forEach(([typ, accommodations]) => {
        if (type && typ !== type) return;

        accommodations.forEach((acc: any) => {
          if (acc.capacity >= guestCount) {
            const rates = getAccommodationRates(acc.id);
            availableAccommodations.push({
              ...acc,
              pricing: rates,
              available: true,
            });
          }
        });
      });
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
