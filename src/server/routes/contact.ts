import { Router } from "express";
import { v4 as uuidv4 } from "uuid";
import {
  sendPasswordResetEmail,
  sendPasswordResetSMS,
  generateResetToken,
  generateSMSCode,
} from "../../lib/contact-services";
import { optionalAuth, AuthenticatedRequest } from "../middleware/auth";
import { validateContact } from "../middleware/validators";
import { asyncHandler, createError } from "../middleware/errorHandler";

const router = Router();

// Simulación de BD de mensajes de contacto en memoria
const contactMessages: any[] = [];

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  status: "new" | "read" | "replied" | "closed";
  userId?: string;
  createdAt: Date;
  updatedAt: Date;
  priority: "low" | "medium" | "high";
  department: "general" | "reservations" | "support" | "complaints";
}

// POST /api/contact/message - Enviar mensaje de contacto
router.post(
  "/message",
  optionalAuth,
  validateContact,
  asyncHandler(async (req: AuthenticatedRequest, res) => {
    const { name, email, phone, subject, message } = req.body;
    const user = req.user;

    // Determinar departamento y prioridad basado en el asunto
    let department: ContactMessage["department"] = "general";
    let priority: ContactMessage["priority"] = "medium";

    const subjectLower = subject.toLowerCase();

    if (subjectLower.includes("reserva") || subjectLower.includes("booking")) {
      department = "reservations";
    } else if (
      subjectLower.includes("problema") ||
      subjectLower.includes("error") ||
      subjectLower.includes("bug")
    ) {
      department = "support";
      priority = "high";
    } else if (
      subjectLower.includes("queja") ||
      subjectLower.includes("complaint") ||
      subjectLower.includes("malo")
    ) {
      department = "complaints";
      priority = "high";
    }

    // Crear mensaje
    const contactMessage: ContactMessage = {
      id: uuidv4(),
      name,
      email,
      phone: phone || "",
      subject,
      message,
      status: "new",
      userId: user?.id,
      createdAt: new Date(),
      updatedAt: new Date(),
      priority,
      department,
    };

    contactMessages.push(contactMessage);

    // En implementación real:
    // 1. Guardar en BD
    // 2. Enviar email de confirmación al usuario
    // 3. Notificar al equipo correspondiente
    // 4. Crear ticket en sistema de soporte

    res.status(201).json({
      success: true,
      message: "Mensaje enviado exitosamente. Te contactaremos pronto.",
      data: {
        messageId: contactMessage.id,
        status: contactMessage.status,
        department: contactMessage.department,
        priority: contactMessage.priority,
        estimatedResponse: "24-48 horas",
      },
    });
  }),
);

// GET /api/contact/messages - Obtener mensajes de contacto (solo staff/admin)
router.get(
  "/messages",
  optionalAuth,
  asyncHandler(async (req: AuthenticatedRequest, res) => {
    const user = req.user;

    // Solo usuarios autenticados con rol staff/admin pueden ver mensajes
    if (!user || (user.role !== "admin" && user.role !== "staff")) {
      throw createError("No tienes permisos para ver los mensajes", 403);
    }

    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const status = req.query.status as string;
    const department = req.query.department as string;
    const priority = req.query.priority as string;

    // Filtrar mensajes
    let filteredMessages = [...contactMessages];

    if (status) {
      filteredMessages = filteredMessages.filter((m) => m.status === status);
    }

    if (department) {
      filteredMessages = filteredMessages.filter(
        (m) => m.department === department,
      );
    }

    if (priority) {
      filteredMessages = filteredMessages.filter(
        (m) => m.priority === priority,
      );
    }

    // Ordenar por prioridad y fecha
    filteredMessages.sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      const priorityDiff =
        priorityOrder[b.priority] - priorityOrder[a.priority];

      if (priorityDiff !== 0) return priorityDiff;

      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    const total = filteredMessages.length;
    const messages = filteredMessages.slice(skip, skip + limit);

    res.json({
      success: true,
      data: {
        messages,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
        stats: {
          total: contactMessages.length,
          new: contactMessages.filter((m) => m.status === "new").length,
          high_priority: contactMessages.filter((m) => m.priority === "high")
            .length,
        },
      },
    });
  }),
);

// GET /api/contact/messages/:id - Obtener mensaje específico
router.get(
  "/messages/:id",
  optionalAuth,
  asyncHandler(async (req: AuthenticatedRequest, res) => {
    const { id } = req.params;
    const user = req.user;

    if (!user || (user.role !== "admin" && user.role !== "staff")) {
      throw createError("No tienes permisos para ver este mensaje", 403);
    }

    const message = contactMessages.find((m) => m.id === id);
    if (!message) {
      throw createError("Mensaje no encontrado", 404);
    }

    // Marcar como leído si estaba nuevo
    if (message.status === "new") {
      message.status = "read";
      message.updatedAt = new Date();
    }

    res.json({
      success: true,
      data: {
        message,
      },
    });
  }),
);

// PUT /api/contact/messages/:id - Actualizar estado del mensaje
router.put(
  "/messages/:id",
  optionalAuth,
  asyncHandler(async (req: AuthenticatedRequest, res) => {
    const { id } = req.params;
    const { status, priority, department, notes } = req.body;
    const user = req.user;

    if (!user || (user.role !== "admin" && user.role !== "staff")) {
      throw createError("No tienes permisos para actualizar este mensaje", 403);
    }

    const message = contactMessages.find((m) => m.id === id);
    if (!message) {
      throw createError("Mensaje no encontrado", 404);
    }

    // Actualizar campos permitidos
    if (status && ["new", "read", "replied", "closed"].includes(status)) {
      message.status = status;
    }

    if (priority && ["low", "medium", "high"].includes(priority)) {
      message.priority = priority;
    }

    if (
      department &&
      ["general", "reservations", "support", "complaints"].includes(department)
    ) {
      message.department = department;
    }

    message.updatedAt = new Date();

    res.json({
      success: true,
      message: "Estado del mensaje actualizado exitosamente",
      data: {
        message: {
          id: message.id,
          status: message.status,
          priority: message.priority,
          department: message.department,
          updatedAt: message.updatedAt,
        },
      },
    });
  }),
);

// POST /api/contact/email-test - Enviar email de prueba (desarrollo)
router.post(
  "/email-test",
  optionalAuth,
  asyncHandler(async (req: AuthenticatedRequest, res) => {
    const { email } = req.body;

    if (!email) {
      throw createError("Email es requerido", 400);
    }

    try {
      const resetToken = generateResetToken();
      const resetUrl = `${req.protocol}://${req.get("host")}/reset-password?token=${resetToken}`;

      const success = await sendPasswordResetEmail({
        to: email,
        resetToken,
        resetUrl,
      });

      res.json({
        success,
        message: success
          ? "Email de prueba enviado exitosamente"
          : "Error al enviar email de prueba",
        data: {
          email,
          resetToken: resetToken.substring(0, 10) + "...", // Mostrar solo parte del token
          resetUrl,
        },
      });
    } catch (error) {
      throw createError("Error al enviar email de prueba", 500);
    }
  }),
);

// POST /api/contact/sms-test - Enviar SMS de prueba (desarrollo)
router.post(
  "/sms-test",
  optionalAuth,
  asyncHandler(async (req: AuthenticatedRequest, res) => {
    const { phone } = req.body;

    if (!phone) {
      throw createError("Número de teléfono es requerido", 400);
    }

    try {
      const code = generateSMSCode();

      const success = await sendPasswordResetSMS({
        phone,
        code,
      });

      res.json({
        success,
        message: success
          ? "SMS de prueba enviado exitosamente"
          : "Error al enviar SMS de prueba",
        data: {
          phone,
          code: code.substring(0, 3) + "***", // Ocultar parte del código
        },
      });
    } catch (error) {
      throw createError("Error al enviar SMS de prueba", 500);
    }
  }),
);

// GET /api/contact/stats - Estadísticas de mensajes de contacto
router.get(
  "/stats",
  optionalAuth,
  asyncHandler(async (req: AuthenticatedRequest, res) => {
    const user = req.user;

    if (!user || (user.role !== "admin" && user.role !== "staff")) {
      throw createError("No tienes permisos para ver las estadísticas", 403);
    }

    const total = contactMessages.length;
    const byStatus = {
      new: contactMessages.filter((m) => m.status === "new").length,
      read: contactMessages.filter((m) => m.status === "read").length,
      replied: contactMessages.filter((m) => m.status === "replied").length,
      closed: contactMessages.filter((m) => m.status === "closed").length,
    };

    const byPriority = {
      low: contactMessages.filter((m) => m.priority === "low").length,
      medium: contactMessages.filter((m) => m.priority === "medium").length,
      high: contactMessages.filter((m) => m.priority === "high").length,
    };

    const byDepartment = {
      general: contactMessages.filter((m) => m.department === "general").length,
      reservations: contactMessages.filter(
        (m) => m.department === "reservations",
      ).length,
      support: contactMessages.filter((m) => m.department === "support").length,
      complaints: contactMessages.filter((m) => m.department === "complaints")
        .length,
    };

    // Mensajes de esta semana
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const thisWeek = contactMessages.filter(
      (m) => new Date(m.createdAt) > weekAgo,
    ).length;

    res.json({
      success: true,
      data: {
        summary: {
          total,
          thisWeek,
          byStatus,
          byPriority,
          byDepartment,
        },
      },
    });
  }),
);

export { router as contactRoutes };
