import { Router } from "express";
import { authenticateToken, AuthenticatedRequest } from "../middleware/auth";
import { asyncHandler, createError } from "../middleware/errorHandler";
import {
  getBackofficeNotifications,
  markNotificationAsRead,
} from "../../lib/contact-services";

const router = Router();

// GET /api/notifications - Obtener notificaciones del backoffice
router.get(
  "/",
  authenticateToken,
  asyncHandler(async (req: AuthenticatedRequest, res) => {
    // Verificar que el usuario sea administrador
    if (req.user.role !== "admin") {
      throw createError("Acceso denegado", 403);
    }

    const notifications = getBackofficeNotifications();

    res.json({
      success: true,
      data: {
        notifications,
        unreadCount: notifications.filter((n) => !n.read).length,
        total: notifications.length,
      },
    });
  }),
);

// PATCH /api/notifications/:id/read - Marcar notificación como leída
router.patch(
  "/:id/read",
  authenticateToken,
  asyncHandler(async (req: AuthenticatedRequest, res) => {
    // Verificar que el usuario sea administrador
    if (req.user.role !== "admin") {
      throw createError("Acceso denegado", 403);
    }

    const { id } = req.params;
    markNotificationAsRead(id);

    res.json({
      success: true,
      message: "Notificación marcada como leída",
    });
  }),
);

// POST /api/notifications/mark-all-read - Marcar todas como leídas
router.post(
  "/mark-all-read",
  authenticateToken,
  asyncHandler(async (req: AuthenticatedRequest, res) => {
    // Verificar que el usuario sea administrador
    if (req.user.role !== "admin") {
      throw createError("Acceso denegado", 403);
    }

    const notifications = getBackofficeNotifications();
    notifications.forEach((n) => (n.read = true));

    res.json({
      success: true,
      message: "Todas las notificaciones marcadas como leídas",
    });
  }),
);

export { router as notificationRoutes };
