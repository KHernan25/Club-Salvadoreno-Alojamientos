import twilio from "twilio";

export interface SMSOptions {
  to: string;
  message: string;
  from?: string;
}

export interface PasswordResetSMSData {
  phone: string;
  userName: string;
  resetCode: string;
  expiresIn?: string;
}

export interface NotificationSMSData {
  phone: string;
  userName: string;
  type:
    | "booking_confirmation"
    | "booking_reminder"
    | "payment_reminder"
    | "booking_cancelled"
    | "welcome"
    | "account_approved";
  data?: any;
}

export class SMSService {
  private static instance: SMSService;
  private client: twilio.Twilio | null = null;
  private isConfigured = false;
  private defaultFrom: string;

  public static getInstance(): SMSService {
    if (!SMSService.instance) {
      SMSService.instance = new SMSService();
    }
    return SMSService.instance;
  }

  private constructor() {
    this.defaultFrom = "+15551234567"; // Default Twilio number
    this.initializeTwilio();
  }

  private initializeTwilio() {
    try {
      const accountSid = process.env.TWILIO_ACCOUNT_SID;
      const authToken = process.env.TWILIO_AUTH_TOKEN;
      this.defaultFrom = process.env.TWILIO_PHONE_NUMBER || this.defaultFrom;

      // For development, use mock service if Twilio not configured
      if (!accountSid || !authToken) {
        console.warn(
          "⚠️ Twilio not configured. SMS features will use mock service.",
        );
        this.isConfigured = false;
        return;
      }

      this.client = twilio(accountSid, authToken);
      this.isConfigured = true;

      console.log("✅ Twilio SMS service configured successfully");
    } catch (error) {
      console.error("❌ Error initializing Twilio:", error);
      this.isConfigured = false;
    }
  }

  public isReady(): boolean {
    return this.isConfigured && this.client !== null;
  }

  private formatPhoneNumber(phone: string): string {
    // Remove all non-numeric characters except +
    let cleaned = phone.replace(/[^\d+]/g, "");

    // If it doesn't start with +, add +503 for El Salvador
    if (!cleaned.startsWith("+")) {
      if (cleaned.length === 8) {
        cleaned = "+503" + cleaned;
      } else if (cleaned.length === 11 && cleaned.startsWith("503")) {
        cleaned = "+" + cleaned;
      } else {
        cleaned = "+503" + cleaned;
      }
    }

    return cleaned;
  }

  private getPasswordResetTemplate(data: PasswordResetSMSData): string {
    const expiresIn = data.expiresIn || "30 minutos";

    return `🔐 Club Salvadoreño\n\nHola ${data.userName}!\n\nTu código de recuperación de contraseña es: ${data.resetCode}\n\n⏰ Expira en ${expiresIn}\n\nSi no solicitaste este código, ignora este mensaje.\n\nSaludos,\nClub Salvadoreño`;
  }

  private getNotificationTemplate(data: NotificationSMSData): string {
    const templates = {
      welcome: `🎉 ¡Bienvenido al Club Salvadoreño!\n\nHola ${data.userName}, tu cuenta ha sido creada exitosamente.\n\nYa puedes acceder a todos nuestros servicios y alojamientos.\n\n¡Gracias por ser parte de nuestro club!`,

      account_approved: `✅ Cuenta Aprobada - Club Salvadoreño\n\nHola ${data.userName}!\n\nTu solicitud de registro ha sido aprobada. Tu cuenta está activa.\n\n¡Bienvenido al Club Salvadoreño!`,

      booking_confirmation: `🏨 Reserva Confirmada\n\nHola ${data.userName}!\n\nTu reserva ha sido confirmada:\n\n📅 Check-in: ${data.data?.checkIn}\n📅 Check-out: ${data.data?.checkOut}\n🏠 Alojamiento: ${data.data?.accommodationName}\n\n¡Esperamos tu visita!`,

      booking_reminder: `🔔 Recordatorio\n\nHola ${data.userName}!\n\nTu estadía en ${data.data?.accommodationName} comienza mañana.\n\n📅 Check-in: ${data.data?.checkIn}\n\n¡No olvides tu identificación!`,

      payment_reminder: `💳 Recordatorio de Pago\n\nHola ${data.userName}!\n\nTienes un pago pendiente para tu reserva.\n\n💰 Monto: $${data.data?.amount}\n📅 Vence: ${data.data?.dueDate}\n\nCompleta tu pago para garantizar tu estadía.`,

      booking_cancelled: `❌ Reserva Cancelada\n\nHola ${data.userName}!\n\nTu reserva en ${data.data?.accommodationName} ha sido cancelada.\n\nSi tienes preguntas, contáctanos.\n\nClub Salvadoreño`,
    };

    return templates[data.type] || templates.welcome;
  }

  public async sendSMS(options: SMSOptions): Promise<boolean> {
    const formattedPhone = this.formatPhoneNumber(options.to);

    // Use mock service if Twilio not configured
    if (!this.isReady()) {
      console.log("📱 Mock SMS sent:");
      console.log(`To: ${formattedPhone}`);
      console.log(`Message: ${options.message}`);
      console.log("---");
      return true;
    }

    try {
      const message = await this.client!.messages.create({
        body: options.message,
        from: options.from || this.defaultFrom,
        to: formattedPhone,
      });

      console.log("✅ SMS sent successfully:", {
        sid: message.sid,
        to: formattedPhone,
        status: message.status,
      });

      return true;
    } catch (error) {
      console.error("❌ Error sending SMS:", error);
      return false;
    }
  }

  public async sendPasswordResetSMS(
    data: PasswordResetSMSData,
  ): Promise<boolean> {
    const message = this.getPasswordResetTemplate(data);

    return this.sendSMS({
      to: data.phone,
      message,
    });
  }

  public async sendNotificationSMS(
    data: NotificationSMSData,
  ): Promise<boolean> {
    const message = this.getNotificationTemplate(data);

    return this.sendSMS({
      to: data.phone,
      message,
    });
  }

  public async sendWelcomeSMS(
    phone: string,
    userName: string,
  ): Promise<boolean> {
    return this.sendNotificationSMS({
      phone,
      userName,
      type: "welcome",
    });
  }

  public async sendAccountApprovedSMS(
    phone: string,
    userName: string,
  ): Promise<boolean> {
    return this.sendNotificationSMS({
      phone,
      userName,
      type: "account_approved",
    });
  }

  public async sendBookingConfirmationSMS(
    phone: string,
    userName: string,
    bookingData: any,
  ): Promise<boolean> {
    return this.sendNotificationSMS({
      phone,
      userName,
      type: "booking_confirmation",
      data: bookingData,
    });
  }

  public async sendBookingReminderSMS(
    phone: string,
    userName: string,
    bookingData: any,
  ): Promise<boolean> {
    return this.sendNotificationSMS({
      phone,
      userName,
      type: "booking_reminder",
      data: bookingData,
    });
  }

  public async sendPaymentReminderSMS(
    phone: string,
    userName: string,
    paymentData: any,
  ): Promise<boolean> {
    return this.sendNotificationSMS({
      phone,
      userName,
      type: "payment_reminder",
      data: paymentData,
    });
  }

  // Utility method to validate phone numbers
  public validatePhoneNumber(phone: string): boolean {
    const formatted = this.formatPhoneNumber(phone);
    // Basic validation for El Salvador phone numbers
    const phoneRegex = /^\+503[0-9]{8}$/;
    return phoneRegex.test(formatted);
  }

  // Generate a random 6-digit code
  public generateVerificationCode(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  // Check if a phone number is from El Salvador
  public isElSalvadorNumber(phone: string): boolean {
    const formatted = this.formatPhoneNumber(phone);
    return formatted.startsWith("+503");
  }
}

// Export singleton instance
export const smsService = SMSService.getInstance();
