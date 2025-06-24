import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { registerUser } from "../../lib/registration-service";
import {
  findUserByEmail,
  findUserById,
  findUserByUsername,
  updateLastLogin,
  isValidUser,
} from "../../lib/user-database";
import {
  sendPasswordResetEmail,
  generateResetToken,
  generateResetUrl,
} from "../../lib/contact-services";
import {
  validateLogin,
  validateRegistration,
  validatePasswordReset,
  validatePasswordResetConfirm,
} from "../middleware/validators";
import { authenticateToken, AuthenticatedRequest } from "../middleware/auth";
import { asyncHandler, createError } from "../middleware/errorHandler";

const router = Router();

// POST /api/auth/login
router.post(
  "/login",
  validateLogin,
  asyncHandler(async (req: AuthenticatedRequest, res) => {
    const { username, password, rememberMe } = req.body;

    // Validar credenciales usando la función del backend
    const user = isValidUser(username.trim(), password);

    if (!user) {
      throw createError("Credenciales incorrectas", 401);
    }

    // Verificar que el usuario esté activo
    if (!user.isActive) {
      throw createError("Cuenta desactivada. Contacta al administrador.", 401);
    }

    // Generar JWT token
    const jwtSecret = process.env.JWT_SECRET || "your-secret-key";
    const tokenExpiry = rememberMe ? "30d" : "24h";

    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        role: user.role,
      },
      jwtSecret,
      { expiresIn: tokenExpiry },
    );

    // Actualizar último login
    updateLastLogin(user.id);

    res.json({
      success: true,
      message: "Inicio de sesión exitoso",
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
          lastLogin: user.lastLogin,
        },
        token,
        expiresIn: tokenExpiry,
      },
    });
  }),
);

// POST /api/auth/register
router.post(
  "/register",
  validateRegistration,
  asyncHandler(async (req, res) => {
    const registrationData = req.body;

    // Usar el servicio de registro existente
    const result = await registerUser(registrationData);

    if (!result.success) {
      throw createError(result.error || "Error en el registro", 400);
    }

    res.status(201).json({
      success: true,
      message: "Usuario registrado exitosamente",
      data: {
        user: {
          id: result.user!.id,
          firstName: result.user!.firstName,
          lastName: result.user!.lastName,
          username: result.user!.username,
          email: result.user!.email,
          fullName: result.user!.fullName,
          role: result.user!.role,
          phone: result.user!.phone,
        },
      },
    });
  }),
);

// GET /api/auth/me
router.get(
  "/me",
  authenticateToken,
  asyncHandler(async (req: AuthenticatedRequest, res) => {
    const user = req.user;

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
          lastLogin: user.lastLogin,
          createdAt: user.createdAt,
        },
      },
    });
  }),
);

// POST /api/auth/logout
router.post(
  "/logout",
  authenticateToken,
  asyncHandler(async (req: AuthenticatedRequest, res) => {
    // En una implementación real, aquí invalidarías el token en una blacklist
    // Por ahora, simplemente enviamos confirmación

    res.json({
      success: true,
      message: "Sesión cerrada exitosamente",
    });
  }),
);

// POST /api/auth/refresh
router.post(
  "/refresh",
  authenticateToken,
  asyncHandler(async (req: AuthenticatedRequest, res) => {
    const user = req.user;

    // Generar nuevo token
    const jwtSecret = process.env.JWT_SECRET || "your-secret-key";
    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        role: user.role,
      },
      jwtSecret,
      { expiresIn: "24h" },
    );

    res.json({
      success: true,
      message: "Token renovado exitosamente",
      data: {
        token,
        expiresIn: "24h",
      },
    });
  }),
);

// POST /api/auth/forgot-password
router.post(
  "/forgot-password",
  validatePasswordReset,
  asyncHandler(async (req, res) => {
    const { email } = req.body;

    // Verificar que el usuario existe
    const user = findUserByEmail(email);
    if (!user) {
      // Por seguridad, no revelamos si el email existe o no
      res.json({
        success: true,
        message:
          "Si el correo está registrado, recibirás instrucciones para restablecer tu contraseña",
      });
      return;
    }

    // Generar token de recuperación
    const resetToken = generateResetToken();
    const resetUrl = generateResetUrl(resetToken);

    // En una implementación real, guardarías el token en la BD con expiración
    // Por ahora, simulamos el envío

    try {
      await sendPasswordResetEmail({
        to: email,
        resetToken,
        resetUrl,
      });

      res.json({
        success: true,
        message:
          "Si el correo está registrado, recibirás instrucciones para restablecer tu contraseña",
      });
    } catch (error) {
      throw createError("Error al enviar correo de recuperación", 500);
    }
  }),
);

// POST /api/auth/reset-password
router.post(
  "/reset-password",
  validatePasswordResetConfirm,
  asyncHandler(async (req, res) => {
    const { token, password } = req.body;

    // En una implementación real, validarías el token contra la BD
    // Por ahora, simulamos la validación

    if (!token || token.length < 10) {
      throw createError("Token de recuperación inválido o expirado", 400);
    }

    // Simular actualización de contraseña
    // En implementación real, harías:
    // 1. Validar token en BD
    // 2. Verificar que no ha expirado
    // 3. Hash de la nueva contraseña
    // 4. Actualizar usuario en BD
    // 5. Invalidar token

    res.json({
      success: true,
      message: "Contraseña restablecida exitosamente",
    });
  }),
);

// GET /api/auth/validate-token
router.get(
  "/validate-token",
  authenticateToken,
  asyncHandler(async (req: AuthenticatedRequest, res) => {
    res.json({
      success: true,
      message: "Token válido",
      data: {
        valid: true,
        user: {
          id: req.user.id,
          email: req.user.email,
          role: req.user.role,
        },
      },
    });
  }),
);

export { router as authRoutes };
