// Conditional imports for server-side only
let emailService: any = null;
let smsService: any = null;

if (typeof window === 'undefined') {
  try {
    const emailServiceModule = require('./email-service');
    emailService = emailServiceModule.emailService;
    const smsServiceModule = require('./sms-service');
    smsService = smsServiceModule.smsService;
  } catch (error) {
    console.warn('Email/SMS services not available');
  }
}

export interface NotificationPreferences {
  email: boolean;
  sms: boolean;
  push: boolean;
}

export interface MemberNotificationData {
  userId: string;
  userEmail: string;
  userPhone?: string;
  userName: string;
  preferences?: NotificationPreferences;
}

export interface BookingNotificationData extends MemberNotificationData {
  bookingId: string;
  accommodationName: string;
  accommodationLocation: string;
  checkIn: string;
  checkOut: string;
  totalAmount?: number;
  guestCount?: number;
  specialRequests?: string;
}

export interface PaymentNotificationData extends MemberNotificationData {
  bookingId: string;
  amount: number;
  dueDate: string;
  accommodationName: string;
  paymentMethod?: string;
}

export interface SystemNotificationData extends MemberNotificationData {
  title: string;
  message: string;
  actionUrl?: string;
  priority: "low" | "medium" | "high";
}

export class NotificationManager {
  private static instance: NotificationManager;

  public static getInstance(): NotificationManager {
    if (!NotificationManager.instance) {
      NotificationManager.instance = new NotificationManager();
    }
    return NotificationManager.instance;
  }

  private constructor() {}

  private getDefaultPreferences(): NotificationPreferences {
    return {
      email: true,
      sms: false,
      push: false,
    };
  }

  // ==================================================
  // MEMBER ACCOUNT NOTIFICATIONS
  // ==================================================

  public async sendWelcomeNotifications(
    data: MemberNotificationData,
  ): Promise<void> {
    const preferences = data.preferences || this.getDefaultPreferences();

    console.log("📧 Sending welcome notifications to:", data.userName);

    try {
      // Email notification
      if (preferences.email && emailService && typeof window === 'undefined') {
        await emailService.sendWelcomeEmail(data.userEmail, data.userName);
      }

      // SMS notification
      if (preferences.sms && data.userPhone && smsService && typeof window === 'undefined') {
        await smsService.sendWelcomeSMS(data.userPhone, data.userName);
      }

      console.log("✅ Welcome notifications sent successfully");
    } catch (error) {
      console.error("❌ Error sending welcome notifications:", error);
    }
  }

  public async sendAccountApprovedNotifications(
    data: MemberNotificationData,
  ): Promise<void> {
    const preferences = data.preferences || this.getDefaultPreferences();

    console.log("📧 Sending account approved notifications to:", data.userName);

    try {
      // Email notification
      if (preferences.email && emailService && typeof window === 'undefined') {
        await emailService.sendAccountApprovedEmail(
          data.userEmail,
          data.userName,
        );
      }

      // SMS notification
      if (preferences.sms && data.userPhone && smsService && typeof window === 'undefined') {
        await smsService.sendAccountApprovedSMS(data.userPhone, data.userName);
      }

      console.log("✅ Account approved notifications sent successfully");
    } catch (error) {
      console.error("❌ Error sending account approved notifications:", error);
    }
  }

  public async sendAccountRejectedNotifications(
    data: MemberNotificationData & { reason?: string },
  ): Promise<void> {
    const preferences = data.preferences || this.getDefaultPreferences();

    console.log("📧 Sending account rejected notifications to:", data.userName);

    try {
      // Email notification
      if (preferences.email && emailService && typeof window === 'undefined') {
        await emailService.sendAccountRejectedEmail(
          data.userEmail,
          data.userName,
        );
      }

      // SMS is usually not sent for rejections unless specifically requested
      console.log("✅ Account rejected notifications sent successfully");
    } catch (error) {
      console.error("❌ Error sending account rejected notifications:", error);
    }
  }

  // ==================================================
  // BOOKING NOTIFICATIONS
  // ==================================================

  public async sendBookingConfirmationNotifications(
    data: BookingNotificationData,
  ): Promise<void> {
    const preferences = data.preferences || this.getDefaultPreferences();

    console.log(
      "📧 Sending booking confirmation notifications to:",
      data.userName,
    );

    try {
      // Email notification
      if (preferences.email && emailService && typeof window === 'undefined') {
        await emailService.sendNotificationEmail({
          userEmail: data.userEmail,
          userName: data.userName,
          type: "booking_confirmation",
          data: {
            accommodationName: data.accommodationName,
            accommodationLocation: data.accommodationLocation,
            checkIn: data.checkIn,
            checkOut: data.checkOut,
            totalAmount: data.totalAmount,
            guestCount: data.guestCount,
            specialRequests: data.specialRequests,
          },
        });
      }

      // SMS notification
      if (preferences.sms && data.userPhone && smsService && typeof window === 'undefined') {
        await smsService.sendBookingConfirmationSMS(
          data.userPhone,
          data.userName,
          {
            accommodationName: data.accommodationName,
            checkIn: data.checkIn,
            checkOut: data.checkOut,
          },
        );
      }

      console.log("✅ Booking confirmation notifications sent successfully");
    } catch (error) {
      console.error(
        "❌ Error sending booking confirmation notifications:",
        error,
      );
    }
  }

  public async sendBookingReminderNotifications(
    data: BookingNotificationData,
  ): Promise<void> {
    const preferences = data.preferences || this.getDefaultPreferences();

    console.log("📧 Sending booking reminder notifications to:", data.userName);

    try {
      // Email notification
      if (preferences.email && emailService && typeof window === 'undefined') {
        await emailService.sendNotificationEmail({
          userEmail: data.userEmail,
          userName: data.userName,
          type: "booking_reminder",
          data: {
            accommodationName: data.accommodationName,
            checkIn: data.checkIn,
          },
        });
      }

      // SMS notification
      if (preferences.sms && data.userPhone && smsService && typeof window === 'undefined') {
        await smsService.sendBookingReminderSMS(data.userPhone, data.userName, {
          accommodationName: data.accommodationName,
          checkIn: data.checkIn,
        });
      }

      console.log("✅ Booking reminder notifications sent successfully");
    } catch (error) {
      console.error("❌ Error sending booking reminder notifications:", error);
    }
  }

  public async sendBookingCancellationNotifications(
    data: BookingNotificationData & { reason?: string },
  ): Promise<void> {
    const preferences = data.preferences || this.getDefaultPreferences();

    console.log(
      "📧 Sending booking cancellation notifications to:",
      data.userName,
    );

    try {
      // Email notification
      if (preferences.email && emailService && typeof window === 'undefined') {
        await emailService.sendNotificationEmail({
          userEmail: data.userEmail,
          userName: data.userName,
          type: "booking_cancelled",
          data: {
            accommodationName: data.accommodationName,
            checkIn: data.checkIn,
            checkOut: data.checkOut,
            reason: data.reason,
          },
        });
      }

      // SMS notification
      if (preferences.sms && data.userPhone && smsService && typeof window === 'undefined') {
        await smsService.sendNotificationSMS({
          phone: data.userPhone,
          userName: data.userName,
          type: "booking_cancelled",
          data: {
            accommodationName: data.accommodationName,
          },
        });
      }

      console.log("✅ Booking cancellation notifications sent successfully");
    } catch (error) {
      console.error(
        "❌ Error sending booking cancellation notifications:",
        error,
      );
    }
  }

  public async sendBookingModificationNotifications(
    data: BookingNotificationData & { modificationType: string },
  ): Promise<void> {
    const preferences = data.preferences || this.getDefaultPreferences();

    console.log(
      "📧 Sending booking modification notifications to:",
      data.userName,
    );

    try {
      // Email notification
      if (preferences.email && emailService && typeof window === 'undefined') {
        await emailService.sendEmail({
          to: data.userEmail,
          subject: `🔄 Modificación de Reserva - ${data.accommodationName}`,
          html: `
            <h2>Hola ${data.userName}!</h2>
            <p>Tu reserva en <strong>${data.accommodationName}</strong> ha sido modificada.</p>
            <p><strong>Tipo de modificación:</strong> ${data.modificationType}</p>
            <p><strong>Nuevas fechas:</strong> ${data.checkIn} - ${data.checkOut}</p>
            <p>Si tienes preguntas, contáctanos.</p>
            <p>Saludos,<br>Club Salvadoreño</p>
          `,
          text: `Hola ${data.userName}! Tu reserva en ${data.accommodationName} ha sido modificada. Tipo: ${data.modificationType}. Nuevas fechas: ${data.checkIn} - ${data.checkOut}.`,
        });
      }

      console.log("✅ Booking modification notifications sent successfully");
    } catch (error) {
      console.error(
        "❌ Error sending booking modification notifications:",
        error,
      );
    }
  }

  // ==================================================
  // PAYMENT NOTIFICATIONS
  // ==================================================

  public async sendPaymentReminderNotifications(
    data: PaymentNotificationData,
  ): Promise<void> {
    const preferences = data.preferences || this.getDefaultPreferences();

    console.log("📧 Sending payment reminder notifications to:", data.userName);

    try {
      // Email notification
      if (preferences.email && emailService && typeof window === 'undefined') {
        await emailService.sendNotificationEmail({
          userEmail: data.userEmail,
          userName: data.userName,
          type: "payment_reminder",
          data: {
            amount: data.amount,
            dueDate: data.dueDate,
            accommodationName: data.accommodationName,
            bookingId: data.bookingId,
          },
        });
      }

      // SMS notification
      if (preferences.sms && data.userPhone && smsService && typeof window === 'undefined') {
        await smsService.sendPaymentReminderSMS(data.userPhone, data.userName, {
          amount: data.amount,
          dueDate: data.dueDate,
        });
      }

      console.log("✅ Payment reminder notifications sent successfully");
    } catch (error) {
      console.error("❌ Error sending payment reminder notifications:", error);
    }
  }

  public async sendPaymentConfirmationNotifications(
    data: PaymentNotificationData,
  ): Promise<void> {
    const preferences = data.preferences || this.getDefaultPreferences();

    console.log(
      "📧 Sending payment confirmation notifications to:",
      data.userName,
    );

    try {
      // Email notification
      if (preferences.email && emailService && typeof window === 'undefined') {
        await emailService.sendEmail({
          to: data.userEmail,
          subject: `✅ Pago Confirmado - ${data.accommodationName}`,
          html: `
            <h2>¡Hola ${data.userName}!</h2>
            <p>Hemos confirmado tu pago de <strong>$${data.amount.toFixed(2)} USD</strong> para tu reserva en <strong>${data.accommodationName}</strong>.</p>
            <p><strong>ID de Reserva:</strong> ${data.bookingId}</p>
            <p>Tu reserva está completamente confirmada. ¡Esperamos tu visita!</p>
            <p>Saludos,<br>Club Salvadoreño</p>
          `,
          text: `¡Hola ${data.userName}! Pago confirmado: $${data.amount.toFixed(2)} USD para ${data.accommodationName}. Reserva: ${data.bookingId}. ¡Esperamos tu visita!`,
        });
      }

      // SMS notification
      if (preferences.sms && data.userPhone && smsService && typeof window === 'undefined') {
        await smsService.sendSMS({
          to: data.userPhone,
          message: `✅ Club Salvadoreño\n\nPago confirmado: $${data.amount.toFixed(2)} USD\nReserva: ${data.accommodationName}\n\n¡Tu reserva está confirmada!`,
        });
      }

      console.log("✅ Payment confirmation notifications sent successfully");
    } catch (error) {
      console.error(
        "❌ Error sending payment confirmation notifications:",
        error,
      );
    }
  }

  public async sendPaymentFailedNotifications(
    data: PaymentNotificationData & { reason?: string },
  ): Promise<void> {
    const preferences = data.preferences || this.getDefaultPreferences();

    console.log("📧 Sending payment failed notifications to:", data.userName);

    try {
      // Email notification
      if (preferences.email && emailService && typeof window === 'undefined') {
        await emailService.sendEmail({
          to: data.userEmail,
          subject: `❌ Problema con el Pago - ${data.accommodationName}`,
          html: `
            <h2>Hola ${data.userName},</h2>
            <p>Ha ocurrido un problema con el procesamiento de tu pago de <strong>$${data.amount.toFixed(2)} USD</strong> para tu reserva en <strong>${data.accommodationName}</strong>.</p>
            ${data.reason ? `<p><strong>Motivo:</strong> ${data.reason}</p>` : ""}
            <p>Por favor, intenta realizar el pago nuevamente o contacta nuestro equipo de soporte.</p>
            <p>ID de Reserva: ${data.bookingId}</p>
            <p>Saludos,<br>Club Salvadoreño</p>
          `,
          text: `Hola ${data.userName}, problema con tu pago de $${data.amount.toFixed(2)} USD para ${data.accommodationName}. ${data.reason ? "Motivo: " + data.reason : ""} Por favor intenta nuevamente.`,
        });
      }

      console.log("✅ Payment failed notifications sent successfully");
    } catch (error) {
      console.error("❌ Error sending payment failed notifications:", error);
    }
  }

  // ==================================================
  // SYSTEM NOTIFICATIONS
  // ==================================================

  public async sendSystemNotifications(
    data: SystemNotificationData,
  ): Promise<void> {
    const preferences = data.preferences || this.getDefaultPreferences();

    console.log("📧 Sending system notifications to:", data.userName);

    try {
      // Email notification
      if (preferences.email && emailService && typeof window === 'undefined') {
        await emailService.sendEmail({
          to: data.userEmail,
          subject: `🔔 ${data.title} - Club Salvadoreño`,
          html: `
            <h2>Hola ${data.userName},</h2>
            <p>${data.message}</p>
            ${data.actionUrl ? `<p><a href="${data.actionUrl}" style="background: #3b82f6; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px;">Ver Detalles</a></p>` : ""}
            <p>Saludos,<br>Club Salvadoreño</p>
          `,
          text: `Hola ${data.userName}, ${data.message} ${data.actionUrl ? "Ver: " + data.actionUrl : ""}`,
        });
      }

      // High priority system notifications also go via SMS
      if ((preferences.sms && data.userPhone) || data.priority === "high") {
        await smsService.sendSMS({
          to: data.userPhone || "",
          message: `🔔 Club Salvadoreño\n\n${data.title}\n\n${data.message}`,
        });
      }

      console.log("✅ System notifications sent successfully");
    } catch (error) {
      console.error("❌ Error sending system notifications:", error);
    }
  }

  // ==================================================
  // MAINTENANCE & UTILITY NOTIFICATIONS
  // ==================================================

  public async sendMaintenanceNotifications(
    data: MemberNotificationData & {
      maintenanceDate: string;
      affectedServices: string[];
      estimatedDuration: string;
    },
  ): Promise<void> {
    const preferences = data.preferences || this.getDefaultPreferences();

    console.log("📧 Sending maintenance notifications to:", data.userName);

    try {
      if (preferences.email && emailService && typeof window === 'undefined') {
        await emailService.sendEmail({
          to: data.userEmail,
          subject: `🔧 Mantenimiento Programado - Club Salvadoreño`,
          html: `
            <h2>Hola ${data.userName},</h2>
            <p>Te informamos sobre un mantenimiento programado que podría afectar algunos servicios:</p>
            <ul>
              <li><strong>Fecha:</strong> ${data.maintenanceDate}</li>
              <li><strong>Duración estimada:</strong> ${data.estimatedDuration}</li>
              <li><strong>Servicios afectados:</strong> ${data.affectedServices.join(", ")}</li>
            </ul>
            <p>Pedimos disculpas por cualquier inconveniente que esto pueda causar.</p>
            <p>Saludos,<br>Club Salvadoreño</p>
          `,
          text: `Mantenimiento programado - Club Salvadoreño. Fecha: ${data.maintenanceDate}. Duración: ${data.estimatedDuration}. Servicios: ${data.affectedServices.join(", ")}.`,
        });
      }

      console.log("✅ Maintenance notifications sent successfully");
    } catch (error) {
      console.error("❌ Error sending maintenance notifications:", error);
    }
  }

  public async sendEmergencyNotifications(
    data: MemberNotificationData & {
      emergencyType: string;
      instructions: string;
      contactInfo: string;
    },
  ): Promise<void> {
    console.log("🚨 Sending emergency notifications to:", data.userName);

    try {
      // Emergency notifications are sent via all channels regardless of preferences

      // Email
      if (emailService && typeof window === 'undefined') {
        await emailService.sendEmail({
          to: data.userEmail,
          subject: `🚨 EMERGENCIA - ${data.emergencyType}`,
          html: `
            <div style="border: 3px solid #dc2626; padding: 20px; background: #fef2f2;">
              <h2 style="color: #dc2626;">🚨 NOTIFICACIÓN DE EMERGENCIA</h2>
              <h3>${data.emergencyType}</h3>
              <p><strong>Estimado/a ${data.userName},</strong></p>
              <p>${data.instructions}</p>
              <p><strong>Contacto de emergencia:</strong> ${data.contactInfo}</p>
              <p>Club Salvadoreño</p>
            </div>
          `,
          text: `🚨 EMERGENCIA - ${data.emergencyType}. ${data.instructions} Contacto: ${data.contactInfo}`,
        });
      }

      // SMS
      if (data.userPhone && smsService && typeof window === 'undefined') {
        await smsService.sendSMS({
          to: data.userPhone,
          message: `🚨 EMERGENCIA Club Salvadoreño\n\n${data.emergencyType}\n\n${data.instructions}\n\nContacto: ${data.contactInfo}`,
        });
      }

      console.log("✅ Emergency notifications sent successfully");
    } catch (error) {
      console.error("❌ Error sending emergency notifications:", error);
    }
  }
}

// Export singleton instance
export const notificationManager = NotificationManager.getInstance();
