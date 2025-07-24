// Email and SMS service utilities for password recovery
import {
  mockSendResetEmail,
  mockSendResetSMS,
  shouldUseMockAPI,
} from "./mock-api";
// Conditional import for email service
let emailService: any = null;
if (typeof window === "undefined") {
  try {
    const emailServiceModule = await import("./email-service");
    emailService = emailServiceModule.emailService;
  } catch (error) {
    console.warn("Email service not available");
  }
}

interface EmailParams {
  to: string;
  resetToken: string;
  resetUrl: string;
  userName?: string;
  expiresIn?: string;
}

interface SMSParams {
  phone: string;
  code: string;
}

export interface BackofficeNotification {
  type: string;
  userId?: string;
  userData?: any;
  timestamp: string;
  message: string;
}

// Email service
export const sendPasswordResetEmail = async (
  params: EmailParams,
): Promise<boolean> => {
  try {
    // Always try real email service first if available
    if (emailService && typeof window === "undefined") {
      try {
        const realEmailSent = await emailService.sendPasswordResetEmail({
          userEmail: params.to,
          userName: params.userName || "Usuario",
          resetToken: params.resetToken,
          resetUrl: params.resetUrl,
          expiresIn: params.expiresIn || "1 hora",
        });

        if (realEmailSent) {
          console.log("✅ Email real enviado exitosamente a:", params.to);
          return true;
        }
      } catch (emailError) {
        console.warn(
          "⚠️ Error con email real, intentando fallback:",
          emailError,
        );
      }
    }

    // Use mock API only as fallback
    if (shouldUseMockAPI()) {
      console.log("�� Usando email mock como fallback");
      const result = await mockSendResetEmail({
        email: params.to,
        resetToken: params.resetToken,
        resetUrl: params.resetUrl,
      });
      return result.success;
    }

    // Call the backend API for password reset email
    const response = await fetch(
      "/api/email-notifications/send-password-reset",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userEmail: params.to,
          userName: "Usuario", // In a real implementation, you'd pass the actual name
          resetToken: params.resetToken,
          resetUrl: params.resetUrl,
          expiresIn: "1 hora",
        }),
      },
    );

    if (!response.ok) {
      throw new Error("Failed to send email");
    }

    const result = await response.json();
    return result.success;
  } catch (error) {
    console.error("Error sending password reset email:", error);
    return false;
  }
};

// SMS service
export const sendPasswordResetSMS = async (
  params: SMSParams,
): Promise<boolean> => {
  try {
    // Use mock API in development or when real API is not configured
    if (shouldUseMockAPI()) {
      const result = await mockSendResetSMS({
        phone: params.phone,
        code: params.code,
      });
      return result.success;
    }

    // Call the backend API for password reset SMS
    const response = await fetch("/api/email-notifications/send-sms-reset", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        phone: params.phone,
        userName: "Usuario", // In a real implementation, you'd pass the actual name
        resetCode: params.code,
        expiresIn: "30 minutos",
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to send SMS");
    }

    const result = await response.json();
    return result.success;
  } catch (error) {
    console.error("Error sending password reset SMS:", error);
    return false;
  }
};

// Utility functions
export const generateResetToken = (): string => {
  return (
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15)
  );
};

export const generateSMSCode = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export const generateResetUrl = (token: string): string => {
  const baseUrl = window.location.origin;
  return `${baseUrl}/reset-password?token=${token}`;
};

// Función para enviar notificaciones al backoffice
export const sendBackofficeNotification = async (
  notification: BackofficeNotification,
): Promise<boolean> => {
  try {
    console.log("📧 Sending backoffice notification:", notification);

    // Aquí se integraría con el sistema real de notificaciones
    // Puede ser email, webhook, base de datos, etc.

    // Guardar la notificación en el sistema (simulado)
    const backofficeNotifications = getBackofficeNotifications();
    backofficeNotifications.unshift({
      id: Date.now().toString(),
      ...notification,
      read: false,
      priority:
        notification.type === "new_user_registration" ? "high" : "medium",
    });

    // En implementación real, aquí se enviaría email al administrador
    /*
    await sendEmail({
      to: process.env.ADMIN_EMAIL || "admin@clubsalvadoreno.com",
      subject: `Nueva notificación: ${notification.type}`,
      html: `
        <h2>Nueva Notificación del Sistema</h2>
        <p><strong>Tipo:</strong> ${notification.type}</p>
        <p><strong>Mensaje:</strong> ${notification.message}</p>
        <p><strong>Fecha:</strong> ${notification.timestamp}</p>
        ${notification.userData ? `<p><strong>Datos:</strong> ${JSON.stringify(notification.userData, null, 2)}</p>` : ""}
      `,
    });
    */

    console.log("✅ Backoffice notification sent successfully");
    return true;
  } catch (error) {
    console.error("❌ Error sending backoffice notification:", error);
    return false;
  }
};

// Función para obtener notificaciones del backoffice (mock)
let backofficeNotifications: any[] = [
  {
    id: "sample-1",
    type: "contact",
    message: "Nuevo mensaje de contacto recibido de Juan Pérez",
    timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(), // 5 minutos atrás
    read: false,
    priority: "medium",
    userData: { email: "juan.perez@email.com" },
  },
  {
    id: "sample-2",
    type: "reservation",
    message: "Nueva reserva creada para Casa Premium en Comalapa",
    timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(), // 15 minutos atrás
    read: false,
    priority: "high",
    userData: { accommodationId: "comalapa-casa-1" },
  },
  {
    id: "sample-3",
    type: "user",
    message: "Nuevo usuario registrado: Mar��a García",
    timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(), // 1 hora atrás
    read: true,
    priority: "medium",
    userData: { email: "maria.garcia@email.com" },
  },
  {
    id: "sample-4",
    type: "system",
    message: "Actualización de precios completada para temporada alta",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 horas atrás
    read: true,
    priority: "low",
  },
];

export const getBackofficeNotifications = () => {
  return backofficeNotifications;
};

export const markNotificationAsRead = (notificationId: string) => {
  const notification = backofficeNotifications.find(
    (n) => n.id === notificationId,
  );
  if (notification) {
    notification.read = true;
  }
};

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePhone = (phone: string): boolean => {
  // Accept formats: +503 1234-5678, 1234-5678, +50312345678, 12345678
  const phoneRegex = /^(\+503\s?)?[0-9]{4}-?[0-9]{4}$/;
  return phoneRegex.test(phone.replace(/\s/g, ""));
};

export const formatPhoneNumber = (phone: string): string => {
  // Remove all non-numeric characters except +
  const cleaned = phone.replace(/[^\d+]/g, "");

  // If doesn't start with +503, add it
  if (!cleaned.startsWith("+503")) {
    return "+503" + cleaned;
  }

  return cleaned;
};
