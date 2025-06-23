import { Router } from "express";
import {
  registeredUsers,
  findUserById,
  findUserByEmail,
} from "../../lib/user-database";
import {
  authenticateToken,
  requireRole,
  AuthenticatedRequest,
} from "../middleware/auth";
import {
  validateIdParam,
  validatePaginationQuery,
} from "../middleware/validators";
import { asyncHandler, createError } from "../middleware/errorHandler";

const router = Router();

// GET /api/users - Obtener lista de usuarios (solo admin/staff)
router.get(
  "/",
  authenticateToken,
  requireRole(["admin", "staff"]),
  validatePaginationQuery,
  asyncHandler(async (req: AuthenticatedRequest, res) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    // Filtrar usuarios activos por defecto
    const activeOnly = req.query.active !== "false";
    const role = req.query.role as string;

    let filteredUsers = registeredUsers.filter((user) => {
      if (activeOnly && !user.isActive) return false;
      if (role && user.role !== role) return false;
      return true;
    });

    const total = filteredUsers.length;
    const users = filteredUsers.slice(skip, skip + limit).map((user) => ({
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      username: user.username,
      email: user.email,
      fullName: user.fullName,
      role: user.role,
      phone: user.phone,
      isActive: user.isActive,
      lastLogin: user.lastLogin,
      createdAt: user.createdAt,
    }));

    res.json({
      success: true,
      data: {
        users,
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

// GET /api/users/:id - Obtener usuario específico
router.get(
  "/:id",
  authenticateToken,
  validateIdParam,
  asyncHandler(async (req: AuthenticatedRequest, res) => {
    const { id } = req.params;
    const currentUser = req.user;

    // Los usuarios solo pueden ver su propio perfil, staff/admin pueden ver cualquiera
    if (currentUser.role === "user" && currentUser.id !== id) {
      throw createError("No tienes permisos para ver este perfil", 403);
    }

    const user = findUserById(id);
    if (!user) {
      throw createError("Usuario no encontrado", 404);
    }

    res.json({
      success: true,
      data: {
        user: {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          username: user.username,
          email: user.email,
          fullName: user.fullName,
          role: user.role,
          phone: user.phone,
          isActive: user.isActive,
          lastLogin: user.lastLogin,
          createdAt: user.createdAt,
        },
      },
    });
  }),
);

// PUT /api/users/:id - Actualizar usuario
router.put(
  "/:id",
  authenticateToken,
  validateIdParam,
  asyncHandler(async (req: AuthenticatedRequest, res) => {
    const { id } = req.params;
    const currentUser = req.user;
    const updates = req.body;

    // Los usuarios solo pueden actualizar su propio perfil
    if (currentUser.role === "user" && currentUser.id !== id) {
      throw createError("No tienes permisos para actualizar este perfil", 403);
    }

    const user = findUserById(id);
    if (!user) {
      throw createError("Usuario no encontrado", 404);
    }

    // Validar campos permitidos según rol
    const allowedFields = ["firstName", "lastName", "phone"];

    if (currentUser.role === "admin") {
      allowedFields.push("email", "role", "isActive");
    }

    if (currentUser.role === "staff") {
      allowedFields.push("isActive");
    }

    // Filtrar solo campos permitidos
    const filteredUpdates: any = {};
    for (const field of allowedFields) {
      if (updates[field] !== undefined) {
        filteredUpdates[field] = updates[field];
      }
    }

    // Validaciones específicas
    if (filteredUpdates.email) {
      const existingUser = findUserByEmail(filteredUpdates.email);
      if (existingUser && existingUser.id !== id) {
        throw createError("Este correo ya está en uso", 409);
      }
    }

    if (
      filteredUpdates.role &&
      !["user", "staff", "admin"].includes(filteredUpdates.role)
    ) {
      throw createError("Rol inválido", 400);
    }

    // Aplicar actualizaciones (simulado)
    Object.assign(user, filteredUpdates);

    if (filteredUpdates.firstName || filteredUpdates.lastName) {
      user.fullName = `${user.firstName} ${user.lastName}`;
    }

    res.json({
      success: true,
      message: "Usuario actualizado exitosamente",
      data: {
        user: {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          username: user.username,
          email: user.email,
          fullName: user.fullName,
          role: user.role,
          phone: user.phone,
          isActive: user.isActive,
          lastLogin: user.lastLogin,
          createdAt: user.createdAt,
        },
      },
    });
  }),
);

// DELETE /api/users/:id - Desactivar usuario (soft delete)
router.delete(
  "/:id",
  authenticateToken,
  requireRole("admin"),
  validateIdParam,
  asyncHandler(async (req: AuthenticatedRequest, res) => {
    const { id } = req.params;

    const user = findUserById(id);
    if (!user) {
      throw createError("Usuario no encontrado", 404);
    }

    // No permitir desactivar el último admin
    if (user.role === "admin") {
      const activeAdmins = registeredUsers.filter(
        (u) => u.role === "admin" && u.isActive,
      );
      if (activeAdmins.length <= 1) {
        throw createError(
          "No se puede desactivar el último administrador",
          400,
        );
      }
    }

    // Desactivar usuario (soft delete)
    user.isActive = false;

    res.json({
      success: true,
      message: "Usuario desactivado exitosamente",
    });
  }),
);

// POST /api/users/:id/activate - Reactivar usuario
router.post(
  "/:id/activate",
  authenticateToken,
  requireRole(["admin", "staff"]),
  validateIdParam,
  asyncHandler(async (req: AuthenticatedRequest, res) => {
    const { id } = req.params;

    const user = findUserById(id);
    if (!user) {
      throw createError("Usuario no encontrado", 404);
    }

    user.isActive = true;

    res.json({
      success: true,
      message: "Usuario reactivado exitosamente",
      data: {
        user: {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          username: user.username,
          email: user.email,
          fullName: user.fullName,
          role: user.role,
          phone: user.phone,
          isActive: user.isActive,
        },
      },
    });
  }),
);

// GET /api/users/stats/summary - Estadísticas de usuarios (admin only)
router.get(
  "/stats/summary",
  authenticateToken,
  requireRole("admin"),
  asyncHandler(async (req: AuthenticatedRequest, res) => {
    const total = registeredUsers.length;
    const active = registeredUsers.filter((u) => u.isActive).length;
    const inactive = total - active;

    const byRole = {
      admin: registeredUsers.filter((u) => u.role === "admin").length,
      staff: registeredUsers.filter((u) => u.role === "staff").length,
      user: registeredUsers.filter((u) => u.role === "user").length,
    };

    const recentRegistrations = registeredUsers.filter((u) => {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return u.createdAt && u.createdAt > weekAgo;
    }).length;

    res.json({
      success: true,
      data: {
        summary: {
          total,
          active,
          inactive,
          byRole,
          recentRegistrations,
        },
      },
    });
  }),
);

export { router as userRoutes };
