import { Router } from "express";
import { emailService } from "../../lib/email-service";
import { smsService } from "../../lib/sms-service";
import { authenticateToken, AuthenticatedRequest } from "../middleware/auth";
import { asyncHandler, createError } from "../middleware/errorHandler";
import { body, validationResult } from "express-validator";

const router = Router();

// Validation middleware for email notifications
const validateEmailNotification = [
  body("to").isEmail().withMessage("Email destinatario válido requerido"),
  body("subject").notEmpty().withMessage("Asunto requerido"),
  body("htmlContent").notEmpty().withMessage("Contenido HTML requerido"),
  body("textContent").notEmpty().withMessage("Contenido texto requerido"),
];

const validateSMSNotification = [
  body("phone").notEmpty().withMessage("Número de teléfono requerido"),
  body("message").notEmpty().withMessage("Mensaje requerido"),
];

// POST /api/email-notifications/send-notification-email
router.post(
  "/send-notification-email",
  validateEmailNotification,
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw createError("Datos de entrada inválidos", 400);
    }

    const { to, subject, htmlContent, textContent, templateType, data } =
      req.body;

    try {
      const success = await emailService.sendEmail({
        to,
        subject,
        html: htmlContent,
        text: textContent,
      });

      if (success) {
        console.log(`✅ Notification email sent to: ${to}`);
        res.json({
          success: true,
          message: "Email de notificación enviado exitosamente",
        });
      } else {
        throw createError("Error al enviar el email de notificación", 500);
      }
    } catch (error) {
      console.error("❌ Error sending notification email:", error);
      throw createError("Error al enviar el email de notificación", 500);
    }
  }),
);

// POST /api/email-notifications/send-password-reset
router.post(
  "/send-password-reset",
  [
    body("userEmail").isEmail().withMessage("Email válido requerido"),
    body("userName").notEmpty().withMessage("Nombre de usuario requerido"),
    body("resetToken").notEmpty().withMessage("Token de reseteo requerido"),
    body("resetUrl").isURL().withMessage("URL de reseteo válida requerida"),
  ],
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw createError("Datos de entrada inválidos", 400);
    }

    const { userEmail, userName, resetToken, resetUrl, expiresIn } = req.body;

    try {
      const success = await emailService.sendPasswordResetEmail({
        userEmail,
        userName,
        resetToken,
        resetUrl,
        expiresIn: expiresIn || "1 hora",
      });

      if (success) {
        console.log(`✅ Password reset email sent to: ${userEmail}`);
        res.json({
          success: true,
          message: "Email de recuperación enviado exitosamente",
        });
      } else {
        throw createError("Error al enviar el email de recuperación", 500);
      }
    } catch (error) {
      console.error("❌ Error sending password reset email:", error);
      throw createError("Error al enviar el email de recuperación", 500);
    }
  }),
);

// POST /api/email-notifications/send-welcome-email
router.post(
  "/send-welcome-email",
  [
    body("userEmail").isEmail().withMessage("Email válido requerido"),
    body("userName").notEmpty().withMessage("Nombre de usuario requerido"),
  ],
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw createError("Datos de entrada inválidos", 400);
    }

    const { userEmail, userName } = req.body;

    try {
      const success = await emailService.sendWelcomeEmail(userEmail, userName);

      if (success) {
        console.log(`✅ Welcome email sent to: ${userEmail}`);
        res.json({
          success: true,
          message: "Email de bienvenida enviado exitosamente",
        });
      } else {
        throw createError("Error al enviar el email de bienvenida", 500);
      }
    } catch (error) {
      console.error("❌ Error sending welcome email:", error);
      throw createError("Error al enviar el email de bienvenida", 500);
    }
  }),
);

// POST /api/email-notifications/send-account-approved
router.post(
  "/send-account-approved",
  [
    body("userEmail").isEmail().withMessage("Email válido requerido"),
    body("userName").notEmpty().withMessage("Nombre de usuario requerido"),
  ],
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw createError("Datos de entrada inválidos", 400);
    }

    const { userEmail, userName } = req.body;

    try {
      const success = await emailService.sendAccountApprovedEmail(
        userEmail,
        userName,
      );

      if (success) {
        console.log(`✅ Account approved email sent to: ${userEmail}`);
        res.json({
          success: true,
          message: "Email de aprobación de cuenta enviado exitosamente",
        });
      } else {
        throw createError("Error al enviar el email de aprobación", 500);
      }
    } catch (error) {
      console.error("❌ Error sending account approved email:", error);
      throw createError("Error al enviar el email de aprobación", 500);
    }
  }),
);

// POST /api/email-notifications/send-sms
router.post(
  "/send-sms",
  validateSMSNotification,
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw createError("Datos de entrada inválidos", 400);
    }

    const { phone, message } = req.body;

    try {
      const success = await smsService.sendSMS({
        to: phone,
        message,
      });

      if (success) {
        console.log(`✅ SMS sent to: ${phone}`);
        res.json({
          success: true,
          message: "SMS enviado exitosamente",
        });
      } else {
        throw createError("Error al enviar el SMS", 500);
      }
    } catch (error) {
      console.error("❌ Error sending SMS:", error);
      throw createError("Error al enviar el SMS", 500);
    }
  }),
);

// POST /api/email-notifications/send-sms-reset
router.post(
  "/send-sms-reset",
  [
    body("phone").notEmpty().withMessage("Número de teléfono requerido"),
    body("userName").notEmpty().withMessage("Nombre de usuario requerido"),
    body("resetCode").notEmpty().withMessage("Código de reseteo requerido"),
  ],
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw createError("Datos de entrada inválidos", 400);
    }

    const { phone, userName, resetCode, expiresIn } = req.body;

    try {
      const success = await smsService.sendPasswordResetSMS({
        phone,
        userName,
        resetCode,
        expiresIn: expiresIn || "30 minutos",
      });

      if (success) {
        console.log(`✅ Password reset SMS sent to: ${phone}`);
        res.json({
          success: true,
          message: "SMS de recuperación enviado exitosamente",
        });
      } else {
        throw createError("Error al enviar el SMS de recuperación", 500);
      }
    } catch (error) {
      console.error("❌ Error sending password reset SMS:", error);
      throw createError("Error al enviar el SMS de recuperación", 500);
    }
  }),
);

// GET /api/email-notifications/test-config
router.get(
  "/test-config",
  asyncHandler(async (req, res) => {
    res.json({
      success: true,
      data: {
        emailService: {
          configured: await emailService.isReady(),
          provider: "Nodemailer",
        },
        smsService: {
          configured: smsService.isReady(),
          provider: "Twilio",
        },
      },
    });
  }),
);

export { router as emailNotificationRoutes };
