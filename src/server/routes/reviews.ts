import { Router } from "express";
import { v4 as uuidv4 } from "uuid";
import {
  authenticateToken,
  requireRole,
  AuthenticatedRequest,
  optionalAuth,
} from "../middleware/auth";
import {
  validateIdParam,
  validatePaginationQuery,
} from "../middleware/validators";
import { asyncHandler, createError } from "../middleware/errorHandler";
import { body, validationResult } from "express-validator";
import {
  moderateReviewContent,
  getReviewModerationStatus,
} from "../../lib/content-moderation";

const router = Router();

// Review data structure
interface Review {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  accommodationId: string;
  reservationId: string;
  rating: number; // 1-5 stars
  title: string;
  comment: string;
  pros: string[];
  cons: string[];
  wouldRecommend: boolean;
  status: "pending" | "approved" | "rejected" | "flagged";
  moderationReason?: string;
  isVerifiedStay: boolean;
  stayDate: string;
  createdAt: Date;
  updatedAt: Date;
  helpfulVotes: number;
  hostResponse?: {
    id: string;
    response: string;
    respondedAt: Date;
    respondedBy: string;
  };
  images?: string[];
}

// Mock review data
const reviews: Review[] = [
  {
    id: "rev-001",
    userId: "7",
    userName: "Carlos Rivera",
    userEmail: "carlos.rivera@email.com",
    accommodationId: "1A",
    reservationId: "res-001",
    rating: 5,
    title: "Excelente experiencia con vista al mar",
    comment:
      "El apartamento superó nuestras expectativas. La vista al mar es espectacular y las instalaciones están en perfectas condiciones. El personal fue muy atento y la ubicación es ideal para disfrutar del surf.",
    pros: [
      "Vista espectacular",
      "Instalaciones impecables",
      "Personal atento",
      "Ubicación perfecta",
    ],
    cons: ["El wifi podría ser más rápido"],
    wouldRecommend: true,
    status: "approved",
    isVerifiedStay: true,
    stayDate: "2024-06-30",
    createdAt: new Date("2024-07-03T10:00:00Z"),
    updatedAt: new Date("2024-07-03T10:00:00Z"),
    helpfulVotes: 12,
    hostResponse: {
      id: "hr-001",
      response:
        "¡Muchas gracias Carlos por tu comentario! Nos alegra saber que disfrutaste tu estadía. Hemos mejorado la conexión WiFi para futuras visitas. ¡Esperamos verte de nuevo pronto!",
      respondedAt: new Date("2024-07-04T09:30:00Z"),
      respondedBy: "Administración Club Salvadoreño",
    },
  },
  {
    id: "rev-002",
    userId: "8",
    userName: "Ana Martinez",
    userEmail: "ana.martinez@email.com",
    accommodationId: "corinto-casa-1",
    reservationId: "res-002",
    rating: 4,
    title: "Perfecta para relajarse junto al lago",
    comment:
      "La casa es muy cómoda y la vista al lago es relajante. Ideal para desconectarse del estrés de la ciudad. La cocina está bien equipada y los dormitorios son amplios.",
    pros: [
      "Vista al lago hermosa",
      "Casa espaciosa",
      "Cocina bien equipada",
      "Muy tranquilo",
    ],
    cons: [
      "Faltaba aire acondicionado en una habitación",
      "Internet intermitente",
    ],
    wouldRecommend: true,
    status: "approved",
    isVerifiedStay: true,
    stayDate: "2024-07-05",
    createdAt: new Date("2024-07-08T14:30:00Z"),
    updatedAt: new Date("2024-07-08T14:30:00Z"),
    helpfulVotes: 8,
  },
  {
    id: "rev-003",
    userId: "10",
    userName: "Diego Morales",
    userEmail: "diego.morales@email.com",
    accommodationId: "suite1",
    reservationId: "res-003",
    rating: 5,
    title: "Suite de lujo perfecta para aniversario",
    comment:
      "Celebramos nuestro aniversario en esta suite y fue perfecto. El jacuzzi, la decoración elegante y el servicio premium hicieron de nuestra estadía algo inolvidable.",
    pros: [
      "Jacuzzi increíble",
      "Decoración elegante",
      "Servicio premium",
      "Muy romántico",
    ],
    cons: [],
    wouldRecommend: true,
    status: "approved",
    isVerifiedStay: true,
    stayDate: "2024-07-10",
    createdAt: new Date("2024-07-13T09:15:00Z"),
    updatedAt: new Date("2024-07-13T09:15:00Z"),
    helpfulVotes: 15,
  },
];

// Validation middleware
const validateReview = [
  body("rating")
    .isInt({ min: 1, max: 5 })
    .withMessage("La calificación debe ser entre 1 y 5 estrellas"),
  body("title")
    .trim()
    .isLength({ min: 5, max: 100 })
    .withMessage("El título debe tener entre 5 y 100 caracteres"),
  body("comment")
    .trim()
    .isLength({ min: 20, max: 1000 })
    .withMessage("El comentario debe tener entre 20 y 1000 caracteres"),
  body("wouldRecommend")
    .isBoolean()
    .withMessage("Debe especificar si recomendaría el alojamiento"),
  body("pros")
    .optional()
    .isArray({ max: 5 })
    .withMessage("Máximo 5 aspectos positivos"),
  body("cons")
    .optional()
    .isArray({ max: 5 })
    .withMessage("Máximo 5 aspectos negativos"),
  body("accommodationId")
    .notEmpty()
    .withMessage("ID del alojamiento es requerido"),
  body("reservationId").notEmpty().withMessage("ID de la reserva es requerido"),
];

const validateHostResponse = [
  body("response")
    .trim()
    .isLength({ min: 10, max: 500 })
    .withMessage("La respuesta debe tener entre 10 y 500 caracteres"),
];

// GET /api/reviews - Get reviews with filters
router.get(
  "/",
  optionalAuth,
  validatePaginationQuery,
  asyncHandler(async (req: AuthenticatedRequest, res) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const accommodationId = req.query.accommodationId as string;
    const rating = req.query.rating
      ? parseInt(req.query.rating as string)
      : undefined;
    const status = (req.query.status as string) || "approved";

    let filteredReviews = reviews.filter((r) => r.status === status);

    // Filter by accommodation
    if (accommodationId) {
      filteredReviews = filteredReviews.filter(
        (r) => r.accommodationId === accommodationId,
      );
    }

    // Filter by rating
    if (rating) {
      filteredReviews = filteredReviews.filter((r) => r.rating === rating);
    }

    // Sort by creation date (newest first)
    filteredReviews.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );

    const total = filteredReviews.length;
    const paginatedReviews = filteredReviews.slice(skip, skip + limit);

    // Calculate review statistics
    const stats = {
      totalReviews: filteredReviews.length,
      averageRating:
        filteredReviews.length > 0
          ? filteredReviews.reduce((sum, r) => sum + r.rating, 0) /
            filteredReviews.length
          : 0,
      ratingDistribution: {
        5: filteredReviews.filter((r) => r.rating === 5).length,
        4: filteredReviews.filter((r) => r.rating === 4).length,
        3: filteredReviews.filter((r) => r.rating === 3).length,
        2: filteredReviews.filter((r) => r.rating === 2).length,
        1: filteredReviews.filter((r) => r.rating === 1).length,
      },
      recommendationRate:
        filteredReviews.length > 0
          ? (filteredReviews.filter((r) => r.wouldRecommend).length /
              filteredReviews.length) *
            100
          : 0,
    };

    res.json({
      success: true,
      data: {
        reviews: paginatedReviews.map((review) => ({
          ...review,
          userEmail: undefined, // Hide email from public view
        })),
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
        stats,
        filters: {
          accommodationId,
          rating,
          status,
        },
      },
    });
  }),
);

// GET /api/reviews/:id - Get specific review
router.get(
  "/:id",
  optionalAuth,
  validateIdParam,
  asyncHandler(async (req: AuthenticatedRequest, res) => {
    const { id } = req.params;

    const review = reviews.find((r) => r.id === id);
    if (!review) {
      throw createError("Reseña no encontrada", 404);
    }

    // Hide email from public view unless it's the author or admin
    const isAuthor = req.user && req.user.id === review.userId;
    const isAdmin =
      req.user && (req.user.role === "admin" || req.user.role === "staff");

    const reviewData = {
      ...review,
      userEmail: isAuthor || isAdmin ? review.userEmail : undefined,
    };

    res.json({
      success: true,
      data: { review: reviewData },
    });
  }),
);

// POST /api/reviews - Create new review
router.post(
  "/",
  authenticateToken,
  validateReview,
  asyncHandler(async (req: AuthenticatedRequest, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Datos de entrada inválidos",
        errors: errors.array(),
      });
    }

    const user = req.user;
    const {
      accommodationId,
      reservationId,
      rating,
      title,
      comment,
      pros = [],
      cons = [],
      wouldRecommend,
    } = req.body;

    // Check if user has a valid completed reservation for this accommodation
    // Note: In real implementation, this would check the reservations database
    const hasValidReservation = true; // Mock validation

    if (!hasValidReservation) {
      throw createError(
        "Solo puedes reseñar alojamientos donde hayas estado",
        403,
      );
    }

    // Check if user already reviewed this accommodation
    const existingReview = reviews.find(
      (r) => r.userId === user.id && r.accommodationId === accommodationId,
    );

    if (existingReview) {
      throw createError("Ya has reseñado este alojamiento", 409);
    }

    // Moderate content before creating review
    const moderationResult = moderateReviewContent({
      title,
      comment,
      pros,
      cons,
    });

    // Determine initial status based on moderation
    let initialStatus: "pending" | "approved" | "rejected" = "pending";
    if (moderationResult.autoApprove && moderationResult.isAppropriate) {
      initialStatus = "approved";
    } else if (
      !moderationResult.isAppropriate ||
      moderationResult.confidence < 0.3
    ) {
      initialStatus = "rejected";
    }

    // If content is rejected, return error with suggestions
    if (initialStatus === "rejected") {
      return res.status(400).json({
        success: false,
        message:
          "Tu reseña no cumple con nuestras políticas de contenido. Por favor, revísala y vuelve a intentar.",
        moderationIssues: moderationResult.issues,
        suggestions: moderationResult.suggestions,
      });
    }

    // Create review
    const review: Review = {
      id: uuidv4(),
      userId: user.id,
      userName: user.name,
      userEmail: user.email,
      accommodationId,
      reservationId,
      rating,
      title,
      comment,
      pros,
      cons,
      wouldRecommend,
      status: initialStatus,
      moderationReason:
        initialStatus === "pending"
          ? "Reseña en revisión para aprobación"
          : undefined,
      isVerifiedStay: true, // Set based on reservation verification
      stayDate: "2024-01-01", // Get from reservation data
      createdAt: new Date(),
      updatedAt: new Date(),
      helpfulVotes: 0,
    };

    reviews.push(review);

    res.status(201).json({
      success: true,
      message: "Reseña creada exitosamente. Será revisada antes de publicarse.",
      data: {
        review: {
          id: review.id,
          accommodationId: review.accommodationId,
          rating: review.rating,
          title: review.title,
          comment: review.comment,
          status: review.status,
          createdAt: review.createdAt,
        },
      },
    });
  }),
);

// PUT /api/reviews/:id - Update review (only by author, within time limit)
router.put(
  "/:id",
  authenticateToken,
  validateIdParam,
  asyncHandler(async (req: AuthenticatedRequest, res) => {
    const { id } = req.params;
    const user = req.user;
    const updates = req.body;

    const review = reviews.find((r) => r.id === id);
    if (!review) {
      throw createError("Reseña no encontrada", 404);
    }

    // Only author can update their review
    if (review.userId !== user.id) {
      throw createError("No tienes permisos para modificar esta reseña", 403);
    }

    // Check if review can still be edited (e.g., within 24 hours)
    const hoursSinceCreation =
      (Date.now() - review.createdAt.getTime()) / (1000 * 60 * 60);
    if (hoursSinceCreation > 24) {
      throw createError("No puedes modificar reseñas después de 24 horas", 400);
    }

    // Only allow certain fields to be updated
    const allowedFields = [
      "rating",
      "title",
      "comment",
      "pros",
      "cons",
      "wouldRecommend",
    ];

    for (const field of allowedFields) {
      if (updates[field] !== undefined) {
        review[field] = updates[field];
      }
    }

    review.status = "pending"; // Reset to pending after edit
    review.updatedAt = new Date();

    res.json({
      success: true,
      message: "Reseña actualizada exitosamente",
      data: { review },
    });
  }),
);

// DELETE /api/reviews/:id - Delete review
router.delete(
  "/:id",
  authenticateToken,
  validateIdParam,
  asyncHandler(async (req: AuthenticatedRequest, res) => {
    const { id } = req.params;
    const user = req.user;

    const reviewIndex = reviews.findIndex((r) => r.id === id);
    if (reviewIndex === -1) {
      throw createError("Reseña no encontrada", 404);
    }

    const review = reviews[reviewIndex];

    // Only author or admin can delete
    if (
      review.userId !== user.id &&
      user.role !== "admin" &&
      user.role !== "staff"
    ) {
      throw createError("No tienes permisos para eliminar esta reseña", 403);
    }

    reviews.splice(reviewIndex, 1);

    res.json({
      success: true,
      message: "Reseña eliminada exitosamente",
    });
  }),
);

// POST /api/reviews/:id/helpful - Mark review as helpful
router.post(
  "/:id/helpful",
  authenticateToken,
  validateIdParam,
  asyncHandler(async (req: AuthenticatedRequest, res) => {
    const { id } = req.params;

    const review = reviews.find((r) => r.id === id);
    if (!review) {
      throw createError("Reseña no encontrada", 404);
    }

    // In real implementation, track which users voted to prevent duplicates
    review.helpfulVotes += 1;

    res.json({
      success: true,
      message: "Voto registrado",
      data: {
        helpfulVotes: review.helpfulVotes,
      },
    });
  }),
);

// POST /api/reviews/:id/response - Host response to review
router.post(
  "/:id/response",
  authenticateToken,
  requireRole(["admin", "staff"]),
  validateHostResponse,
  asyncHandler(async (req: AuthenticatedRequest, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Datos de entrada inválidos",
        errors: errors.array(),
      });
    }

    const { id } = req.params;
    const { response } = req.body;
    const user = req.user;

    const review = reviews.find((r) => r.id === id);
    if (!review) {
      throw createError("Reseña no encontrada", 404);
    }

    if (review.hostResponse) {
      throw createError(
        "Esta reseña ya tiene una respuesta del anfitrión",
        409,
      );
    }

    review.hostResponse = {
      id: uuidv4(),
      response,
      respondedAt: new Date(),
      respondedBy: user.name,
    };

    res.json({
      success: true,
      message: "Respuesta del anfitrión agregada exitosamente",
      data: {
        hostResponse: review.hostResponse,
      },
    });
  }),
);

// PUT /api/reviews/:id/moderate - Moderate review (admin only)
router.put(
  "/:id/moderate",
  authenticateToken,
  requireRole(["admin"]),
  asyncHandler(async (req: AuthenticatedRequest, res) => {
    const { id } = req.params;
    const { status, moderationReason } = req.body;

    if (!["approved", "rejected", "flagged"].includes(status)) {
      throw createError("Estado de moderación inválido", 400);
    }

    const review = reviews.find((r) => r.id === id);
    if (!review) {
      throw createError("Reseña no encontrada", 404);
    }

    review.status = status;
    review.moderationReason = moderationReason;
    review.updatedAt = new Date();

    res.json({
      success: true,
      message: `Reseña ${status === "approved" ? "aprobada" : status === "rejected" ? "rechazada" : "marcada"} exitosamente`,
      data: {
        review: {
          id: review.id,
          status: review.status,
          moderationReason: review.moderationReason,
        },
      },
    });
  }),
);

// GET /api/reviews/accommodation/:accommodationId/stats - Get review stats for accommodation
router.get(
  "/accommodation/:accommodationId/stats",
  optionalAuth,
  asyncHandler(async (req: AuthenticatedRequest, res) => {
    const { accommodationId } = req.params;

    const accommodationReviews = reviews.filter(
      (r) => r.accommodationId === accommodationId && r.status === "approved",
    );

    if (accommodationReviews.length === 0) {
      return res.json({
        success: true,
        data: {
          stats: {
            totalReviews: 0,
            averageRating: 0,
            ratingDistribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
            recommendationRate: 0,
          },
        },
      });
    }

    const stats = {
      totalReviews: accommodationReviews.length,
      averageRating:
        accommodationReviews.reduce((sum, r) => sum + r.rating, 0) /
        accommodationReviews.length,
      ratingDistribution: {
        5: accommodationReviews.filter((r) => r.rating === 5).length,
        4: accommodationReviews.filter((r) => r.rating === 4).length,
        3: accommodationReviews.filter((r) => r.rating === 3).length,
        2: accommodationReviews.filter((r) => r.rating === 2).length,
        1: accommodationReviews.filter((r) => r.rating === 1).length,
      },
      recommendationRate:
        (accommodationReviews.filter((r) => r.wouldRecommend).length /
          accommodationReviews.length) *
        100,
    };

    res.json({
      success: true,
      data: { stats },
    });
  }),
);

export { router as reviewRoutes };
