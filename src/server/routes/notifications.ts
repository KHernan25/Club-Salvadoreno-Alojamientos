import { Router } from "express";
import { authenticateToken, AuthenticatedRequest } from "../middleware/auth";
import { asyncHandler, createError } from "../middleware/errorHandler";
import { NotificationModel } from "../database/models";

const router = Router();

// GET /api/notifications - Obtener notificaciones del backoffice
router.get(
  "/",
  authenticateToken,
  asyncHandler(async (req: AuthenticatedRequest, res) => {
    // Verificar que el usuario tenga permisos para ver notificaciones
    const allowedRoles = [
      "super_admin",
      "atencion_miembro",
      "anfitrion",
      "monitor",
      "mercadeo",
      "recepcion",
      "porteria",
    ];
    if (!allowedRoles.includes(req.user.role)) {
      throw createError("Acceso denegado", 403);
    }

    // Obtener notificaciones por rol del usuario
    const notifications = await NotificationModel.getByRole(req.user.role);
    const unreadCount = await NotificationModel.getUnreadCount();

    res.json({
      success: true,
      data: {
        notifications,
        unreadCount,
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
    // Verificar que el usuario tenga permisos para marcar notificaciones
    const allowedRoles = [
      "super_admin",
      "atencion_miembro",
      "anfitrion",
      "monitor",
      "mercadeo",
      "recepcion",
      "porteria",
    ];
    if (!allowedRoles.includes(req.user.role)) {
      throw createError("Acceso denegado", 403);
    }

    const { id } = req.params;
    const success = await NotificationModel.markAsRead(id);

    if (!success) {
      throw createError("Notificación no encontrada", 404);
    }

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
    // Verificar que el usuario tenga permisos para marcar notificaciones
    const allowedRoles = [
      "super_admin",
      "atencion_miembro",
      "anfitrion",
      "monitor",
      "mercadeo",
      "recepcion",
      "porteria",
    ];
    if (!allowedRoles.includes(req.user.role)) {
      throw createError("Acceso denegado", 403);
    }

    const markedCount = await NotificationModel.markAllAsRead();

    res.json({
      success: true,
      message: `${markedCount} notificaciones marcadas como leídas`,
    });
  }),
);

export { router as notificationRoutes };
