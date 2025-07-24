import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import {
  UserModel,
  RegistrationRequestModel,
  NotificationModel,
  PasswordResetTokenModel,
} from "../database/models";
import { emailService } from "../../lib/email-service";
import { smsService } from "../../lib/sms-service";
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

    // Encriptar contraseña antes de guardar
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Crear solicitud de registro
    const registrationRequest = await RegistrationRequestModel.create({
      firstName,
      lastName,
      email,
      phone,
      documentType,
      documentNumber,
      memberCode,
      password: hashedPassword, // Contraseña encriptada
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
  asyncHandler(async (req, res) => {
    const { email, phone, method } = req.body;

    console.log("🔐 Password reset request:", { email, phone, method });

    // Validate method
    if (!method || !["email", "sms"].includes(method)) {
      throw createError("Método de recuperación inválido", 400);
    }

    // Find user by email or phone
    let user;
    if (method === "email") {
      if (!email) {
        throw createError(
          "Email es requerido para recuperación por correo",
          400,
        );
      }
      user = await UserModel.findByEmail(email);
    } else {
      if (!phone) {
        throw createError(
          "Teléfono es requerido para recuperación por SMS",
          400,
        );
      }
      // Find user by phone - you might need to add this method to UserModel
      user = await UserModel.findByEmail(email); // Temporarily using email lookup
    }

    if (!user) {
      // Por seguridad, no revelamos si el email/teléfono existe o no
      res.json({
        success: true,
        message:
          method === "email"
            ? "Si el correo está registrado, recibirás instrucciones para restablecer tu contraseña"
            : "Si el teléfono está registrado, recibirás un código de verificación",
      });
      return;
    }

    try {
      // Invalidate any existing tokens for this user
      await PasswordResetTokenModel.invalidateUserTokens(user.id);

      if (method === "email") {
        // Create password reset token
        const resetToken = await PasswordResetTokenModel.create({
          userId: user.id,
          email: user.email,
          expiresIn: 60, // 60 minutes
        });

        // Generate reset URL
        const resetUrl = `${process.env.FRONTEND_URL || "http://localhost:8080"}/reset-password?token=${resetToken.token}`;

        // Send email
        const emailSent = await emailService.sendPasswordResetEmail({
          userEmail: user.email,
          userName: user.fullName,
          resetToken: resetToken.token,
          resetUrl,
          expiresIn: "1 hora",
        });

        if (!emailSent) {
          console.error("❌ Failed to send password reset email");
          // Don't reveal the failure to the user for security
        }

        console.log("✅ Password reset email sent to:", user.email);
      } else {
        // SMS method
        const resetCode = smsService.generateVerificationCode();

        // Create password reset token with the code
        const resetToken = await PasswordResetTokenModel.create({
          userId: user.id,
          email: user.email, // Store email for reference
          expiresIn: 30, // 30 minutes for SMS codes
        });

        // Store the SMS code temporarily (in a real implementation, you might want a separate table)
        // For now, we'll use the token field to store the code

        // Send SMS
        const smsSent = await smsService.sendPasswordResetSMS({
          phone: phone,
          userName: user.fullName,
          resetCode,
          expiresIn: "30 minutos",
        });

        if (!smsSent) {
          console.error("❌ Failed to send password reset SMS");
          // Don't reveal the failure to the user for security
        }

        console.log("✅ Password reset SMS sent to:", phone);
      }

      res.json({
        success: true,
        message:
          method === "email"
            ? "Si el correo está registrado, recibirás instrucciones para restablecer tu contraseña"
            : "Si el teléfono está registrado, recibirás un código de verificación",
      });
    } catch (error) {
      console.error("❌ Error in password reset process:", error);
      res.json({
        success: true,
        message:
          method === "email"
            ? "Si el correo está registrado, recibirás instrucciones para restablecer tu contraseña"
            : "Si el teléfono está registrado, recibirás un código de verificación",
      });
    }
  }),
);

// POST /api/auth/reset-password
router.post(
  "/reset-password",
  validatePasswordResetConfirm,
  asyncHandler(async (req, res) => {
    const { token, password, code } = req.body;

    console.log("🔐 Password reset confirmation:", {
      hasToken: !!token,
      hasCode: !!code,
    });

    if (!password || password.length < 6) {
      throw createError(
        "La nueva contraseña debe tener al menos 6 caracteres",
        400,
      );
    }

    let resetToken;

    if (token) {
      // Email-based reset with token
      if (!token || token.length < 10) {
        throw createError("Token de recuperación inválido o expirado", 400);
      }

      // Validate token
      const isValid = await PasswordResetTokenModel.isValidToken(token);
      if (!isValid) {
        throw createError("Token de recuperación inválido o expirado", 400);
      }

      resetToken = await PasswordResetTokenModel.findByToken(token);
      if (!resetToken) {
        throw createError("Token de recuperación inválido", 400);
      }
    } else if (code) {
      // SMS-based reset with code
      // In a full implementation, you'd verify the code differently
      throw createError(
        "Verificación por código SMS no implementada completamente",
        400,
      );
    } else {
      throw createError("Token o código de verificación requerido", 400);
    }

    try {
      // Find user
      const user = await UserModel.findByEmail(resetToken.email);
      if (!user) {
        throw createError("Usuario no encontrado", 400);
      }

      // Hash new password
      const hashedPassword = await bcrypt.hash(password, 12);

      // Update user password
      await UserModel.updatePassword(user.id, hashedPassword);

      // Mark token as used
      await PasswordResetTokenModel.markAsUsed(resetToken.token);

      // Invalidate all other tokens for this user
      await PasswordResetTokenModel.invalidateUserTokens(user.id);

      console.log("✅ Password reset successful for user:", user.email);

      res.json({
        success: true,
        message: "Contraseña restablecida exitosamente",
      });
    } catch (error) {
      console.error("❌ Error resetting password:", error);
      throw createError("Error al restablecer la contraseña", 500);
    }
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
