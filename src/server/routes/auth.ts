import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import {
  UserModel,
  RegistrationRequestModel,
  NotificationModel,
} from "../database/models";
import {
  validateLogin,
  validateRegistration,
  validatePasswordReset,
  validatePasswordResetConfirm,
} from "../middleware/validators";
import { authenticateToken, AuthenticatedRequest } from "../middleware/auth";
import { asyncHandler, createError } from "../middleware/errorHandler";
import { config } from "../../lib/config";

const router = Router();

// POST /api/auth/login
router.post(
  "/login",
  asyncHandler(async (req: AuthenticatedRequest, res) => {
    console.log("🔐 Login attempt received:", { username: req.body.username });

    const { username, password, rememberMe } = req.body;

    // Validación básica manual
    if (!username || !password) {
      console.log("❌ Missing username or password");
      throw createError("Usuario y contraseña son requeridos", 400);
    }

    // Validar credenciales usando el modelo de base de datos
    const user = await UserModel.findByCredentials(username.trim(), password);

    if (!user) {
      console.log("❌ Invalid credentials for:", username);
      throw createError("Credenciales incorrectas", 401);
    }

    // Verificar que el usuario esté activo
    if (!user.isActive) {
      console.log("❌ User inactive:", username);
      throw createError("Cuenta desactivada. Contacta al administrador.", 401);
    }

    console.log("✅ Login successful for:", user.fullName);

    // Generar JWT token
    const jwtSecret = config.auth.jwtSecret;
    const tokenExpiry = rememberMe ? "30d" : config.auth.tokenExpiry;

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
    await UserModel.updateLastLogin(user.id);

    // Respuesta simplificada para evitar problemas de parsing
    const response = {
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
        },
        token: token,
      },
    };

    console.log("📤 Sending response:", { success: true, userRole: user.role });
    res.status(200).json(response);
  }),
);

// POST /api/auth/register
router.post(
  "/register",
  validateRegistration,
  asyncHandler(async (req, res) => {
    const {
      firstName,
      lastName,
      email,
      phone,
      documentType,
      documentNumber,
      memberCode,
      password,
      confirmPassword,
      acceptTerms,
    } = req.body;

    // Validaciones básicas
    if (
      !firstName ||
      !lastName ||
      !email ||
      !phone ||
      !documentType ||
      !documentNumber ||
      !memberCode ||
      !password
    ) {
      throw createError("Todos los campos son requeridos", 400);
    }

    if (!acceptTerms) {
      throw createError("Debes aceptar los términos y condiciones", 400);
    }

    if (password !== confirmPassword) {
      throw createError("Las contraseñas no coinciden", 400);
    }

    // Verificar si el email ya existe en usuarios registrados
    const existingUser = await UserModel.findByEmail(email);
    if (existingUser) {
      throw createError("Este correo electrónico ya está registrado", 400);
    }

    // Verificar si ya existe una solicitud pendiente para este email
    const existingRequest = await RegistrationRequestModel.findByEmail(email);
    if (existingRequest && existingRequest.status === "pending") {
      throw createError("Ya tienes una solicitud de registro pendiente", 400);
    }

    // Crear solicitud de registro
    const registrationRequest = await RegistrationRequestModel.create({
      firstName,
      lastName,
      email,
      phone,
      documentType,
      documentNumber,
      memberCode,
      password, // En producción debería estar hasheado
    });

    // Crear notificación para el backoffice
    try {
      await NotificationModel.create({
        type: "user_registration",
        title: "Nueva solicitud de registro",
        message: `Nueva solicitud de registro de ${firstName} ${lastName} (${email}) requiere aprobación`,
        data: {
          registrationRequestId: registrationRequest.id,
          name: `${firstName} ${lastName}`,
          email,
          phone,
          memberCode,
          documentNumber,
        },
        role: "atencion_miembro", // Dirigir a atención al miembro
      });
    } catch (notificationError) {
      console.error(
        "❌ Error sending backoffice notification:",
        notificationError,
      );
      // No fallar el registro si falla la notificación
    }

    res.status(201).json({
      success: true,
      message:
        "Solicitud de registro enviada exitosamente. Tu cuenta estará pendiente de aprobación por parte del administrador. Te notificaremos por correo cuando sea activada.",
      data: {
        requestId: registrationRequest.id,
        status: registrationRequest.status,
        submittedAt: registrationRequest.submittedAt,
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
          isActive: user.isActive,
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
  asyncHandler(async (req, res) => {
    // No requerir autenticación para logout para evitar demoras
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
    const jwtSecret = config.auth.jwtSecret;
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
    const user = await UserModel.findByEmail(email);
    if (!user) {
      // Por seguridad, no revelamos si el email existe o no
      res.json({
        success: true,
        message:
          "Si el correo está registrado, recibirás instrucciones para restablecer tu contraseña",
      });
      return;
    }

    // TODO: Implementar envío de email de recuperación
    // Para el desarrollo, simplemente devolvemos un mensaje
    res.json({
      success: true,
      message:
        "Si el correo está registrado, recibirás instrucciones para restablecer tu contraseña",
    });
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
