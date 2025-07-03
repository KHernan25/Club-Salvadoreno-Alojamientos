import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { findUserById } from "../../lib/user-database";
import { createError } from "./errorHandler";

export interface AuthenticatedRequest extends Request {
  user?: any;
}

export const authenticateToken = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1]; // Bearer TOKEN

    if (!token) {
      throw createError("Token de acceso requerido", 401);
    }

    const jwtSecret = process.env.JWT_SECRET || "your-secret-key";
    const decoded = jwt.verify(token, jwtSecret) as any;

    // Verificar que el usuario aún existe y está activo
    const user = findUserById(decoded.userId);
    if (!user) {
      throw createError("Usuario no encontrado", 401);
    }

    if (!user.isActive) {
      throw createError("Cuenta desactivada", 401);
    }

    // Agregar usuario a la request
    req.user = user;
    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return next(createError("Token inválido", 401));
    }
    if (error instanceof jwt.TokenExpiredError) {
      return next(createError("Token expirado", 401));
    }
    next(error);
  }
};

export const requireRole = (roles: string | string[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(createError("Usuario no autenticado", 401));
    }

    const userRole = req.user.role;
    const allowedRoles = Array.isArray(roles) ? roles : [roles];

    // Jerarquía de roles actualizada
    const roleHierarchy: { [key: string]: number } = {
      super_admin: 5,
      atencion_miembro: 4,
      anfitrion: 3,
      monitor: 2,
      mercadeo: 2,
      user: 1,
      // Alias para compatibilidad
      admin: 5,
      staff: 4,
    };

    const userLevel = roleHierarchy[userRole] || 0;
    const requiredLevel = Math.max(
      ...allowedRoles.map((role) => roleHierarchy[role] || 0),
    );

    if (userLevel < requiredLevel) {
      return next(createError("Permisos insuficientes", 403));
    }

    next();
  };
};

export const optionalAuth = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1];

    if (token) {
      const jwtSecret = process.env.JWT_SECRET || "your-secret-key";
      const decoded = jwt.verify(token, jwtSecret) as any;
      const user = findUserById(decoded.userId);

      if (user && user.isActive) {
        req.user = user;
      }
    }

    next();
  } catch (error) {
    // En auth opcional, simplemente continuar sin autenticación
    next();
  }
};
