import { emailNotificationService } from "./email-notification-service";
import { pushNotificationService } from "./push-notification-service";
import { sendBackofficeNotification } from "./contact-services";

export interface AlertData {
  id: string;
  type:
    | "reservation_cancelled"
    | "reservation_modified"
    | "payment_failed"
    | "payment_overdue"
    | "payment_successful"
    | "booking_confirmed"
    | "check_in_reminder"
    | "check_out_reminder"
    | "host_unavailable"
    | "system_maintenance";
  severity: "low" | "medium" | "high" | "critical";
  userId: string;
  userEmail: string;
  userName: string;
  userRole: "guest" | "host" | "admin";
  title: string;
  message: string;
  timestamp: string;
  data: {
    reservationId?: string;
    accommodationId?: string;
    accommodationName?: string;
    paymentId?: string;
    amount?: number;
    currency?: string;
    dueDate?: string;
    checkInDate?: string;
    checkOutDate?: string;
    originalDates?: {
      checkIn: string;
      checkOut: string;
    };
    newDates?: {
      checkIn: string;
      checkOut: string;
    };
    reason?: string;
    actions?: Array<{
      label: string;
      url: string;
      type: "primary" | "secondary";
    }>;
  };
  channels: Array<"email" | "push" | "sms" | "in_app">;
  read: boolean;
  actionTaken?: boolean;
  retryCount: number;
  maxRetries: number;
}

export interface AlertPreferences {
  userId: string;
  emailNotifications: boolean;
  pushNotifications: boolean;
  smsNotifications: boolean;
  categories: {
    reservations: boolean;
    payments: boolean;
    reminders: boolean;
    marketing: boolean;
  };
  urgencyLevels: {
    low: boolean;
    medium: boolean;
    high: boolean;
    critical: boolean;
  };
}

class AlertService {
  private static instance: AlertService;
  private alerts: AlertData[] = [];
  private preferences: Map<string, AlertPreferences> = new Map();
  private retryQueue: AlertData[] = [];

  public static getInstance(): AlertService {
    if (!AlertService.instance) {
      AlertService.instance = new AlertService();
    }
    return AlertService.instance;
  }

  private constructor() {
    this.initializeMockPreferences();
    this.startRetryProcessor();
  }

  private initializeMockPreferences(): void {
    // Mock user preferences
    const mockPreferences: AlertPreferences = {
      userId: "user-123",
      emailNotifications: true,
      pushNotifications: true,
      smsNotifications: false,
      categories: {
        reservations: true,
        payments: true,
        reminders: true,
        marketing: false,
      },
      urgencyLevels: {
        low: true,
        medium: true,
        high: true,
        critical: true,
      },
    };
    this.preferences.set("user-123", mockPreferences);
  }

  private startRetryProcessor(): void {
    setInterval(() => {
      this.processRetryQueue();
    }, 30000); // Process retry queue every 30 seconds
  }

  public async createAlert(
    alertData: Omit<AlertData, "id" | "timestamp" | "read" | "retryCount">,
  ): Promise<AlertData> {
    const alert: AlertData = {
      ...alertData,
      id: `alert-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
      read: false,
      retryCount: 0,
    };

    // Check user preferences
    const userPrefs = this.preferences.get(alert.userId);
    if (!userPrefs || !this.shouldSendAlert(alert, userPrefs)) {
      console.log(`⏭️ Alert skipped due to user preferences: ${alert.id}`);
      return alert;
    }

    // Add to alerts list
    this.alerts.unshift(alert);

    // Send alert through appropriate channels
    await this.sendAlert(alert);

    // Send to backoffice for high/critical alerts
    if (alert.severity === "high" || alert.severity === "critical") {
      await this.notifyBackoffice(alert);
    }

    console.log(`✅ Alert created and sent: ${alert.id}`);
    return alert;
  }

  private shouldSendAlert(
    alert: AlertData,
    preferences: AlertPreferences,
  ): boolean {
    // Check urgency level preferences
    if (!preferences.urgencyLevels[alert.severity]) {
      return false;
    }

    // Check category preferences
    const categoryMap = {
      reservation_cancelled: "reservations",
      reservation_modified: "reservations",
      booking_confirmed: "reservations",
      payment_failed: "payments",
      payment_overdue: "payments",
      payment_successful: "payments",
      check_in_reminder: "reminders",
      check_out_reminder: "reminders",
      host_unavailable: "reservations",
      system_maintenance: "reservations",
    };

    const category = categoryMap[
      alert.type
    ] as keyof typeof preferences.categories;
    return preferences.categories[category] || alert.severity === "critical";
  }

  private async sendAlert(alert: AlertData): Promise<void> {
    const promises: Promise<boolean>[] = [];

    // Email notifications
    if (alert.channels.includes("email")) {
      promises.push(this.sendEmailAlert(alert));
    }

    // Push notifications
    if (alert.channels.includes("push")) {
      promises.push(this.sendPushAlert(alert));
    }

    // In-app notifications are handled by the notification system
    if (alert.channels.includes("in_app")) {
      promises.push(this.sendInAppAlert(alert));
    }

    try {
      const results = await Promise.allSettled(promises);
      const failures = results.filter(
        (result) =>
          result.status === "rejected" ||
          (result.status === "fulfilled" && !result.value),
      );

      if (failures.length > 0 && alert.retryCount < alert.maxRetries) {
        this.addToRetryQueue(alert);
      }
    } catch (error) {
      console.error(`❌ Error sending alert ${alert.id}:`, error);
      if (alert.retryCount < alert.maxRetries) {
        this.addToRetryQueue(alert);
      }
    }
  }

  private async sendEmailAlert(alert: AlertData): Promise<boolean> {
    try {
      const emailData = this.prepareEmailData(alert);
      return await emailNotificationService.sendNotification({
        to: alert.userEmail,
        templateType: this.getEmailTemplate(alert.type),
        data: emailData,
      });
    } catch (error) {
      console.error(`❌ Error sending email alert:`, error);
      return false;
    }
  }

  private async sendPushAlert(alert: AlertData): Promise<boolean> {
    try {
      await pushNotificationService.sendPushNotification({
        type: this.mapToPushType(alert.type),
        userId: alert.userId,
        data: {
          reservationId: alert.data.reservationId,
          title: alert.title,
          message: alert.message,
          actionUrl: alert.data.actions?.[0]?.url || "/my-reservations",
          priority: alert.severity === "critical" ? "high" : alert.severity,
        },
      });
      return true;
    } catch (error) {
      console.error(`❌ Error sending push alert:`, error);
      return false;
    }
  }

  private async sendInAppAlert(alert: AlertData): Promise<boolean> {
    try {
      // This would integrate with your existing notification system
      await sendBackofficeNotification({
        type: alert.type,
        message: `${alert.userName}: ${alert.message}`,
        timestamp: alert.timestamp,
        priority: alert.severity,
        userData: {
          userId: alert.userId,
          email: alert.userEmail,
          reservationId: alert.data.reservationId,
        },
      });
      return true;
    } catch (error) {
      console.error(`❌ Error sending in-app alert:`, error);
      return false;
    }
  }

  private prepareEmailData(alert: AlertData): any {
    return {
      guestName: alert.userName,
      reservationId: alert.data.reservationId || "",
      accommodationName: alert.data.accommodationName || "",
      checkIn: alert.data.checkInDate || alert.data.newDates?.checkIn || "",
      checkOut: alert.data.checkOutDate || alert.data.newDates?.checkOut || "",
      totalAmount: alert.data.amount,
      paymentDueDate: alert.data.dueDate,
      cancellationReason: alert.data.reason,
      modificationType: alert.type,
    };
  }

  private getEmailTemplate(alertType: AlertData["type"]): any {
    const templateMap = {
      reservation_cancelled: "booking_cancelled",
      reservation_modified: "booking_modified",
      payment_failed: "payment_failed",
      payment_overdue: "payment_reminder",
      payment_successful: "booking_confirmation",
      booking_confirmed: "booking_confirmation",
      check_in_reminder: "booking_reminder",
      check_out_reminder: "booking_reminder",
      host_unavailable: "booking_cancelled",
      system_maintenance: "booking_reminder",
    };
    return templateMap[alertType] || "booking_confirmation";
  }

  private mapToPushType(alertType: AlertData["type"]): any {
    const pushTypeMap = {
      reservation_cancelled: "booking_cancelled",
      reservation_modified: "booking_modified",
      payment_failed: "payment_failed",
      payment_overdue: "payment_reminder",
      payment_successful: "booking_confirmed",
      booking_confirmed: "booking_confirmed",
      check_in_reminder: "booking_reminder",
      check_out_reminder: "booking_reminder",
      host_unavailable: "booking_cancelled",
      system_maintenance: "booking_reminder",
    };
    return pushTypeMap[alertType] || "booking_confirmed";
  }

  private async notifyBackoffice(alert: AlertData): Promise<void> {
    try {
      await sendBackofficeNotification({
        type: `critical_alert_${alert.type}`,
        message: `ALERTA CRÍTICA: ${alert.title} - Usuario: ${alert.userName}`,
        timestamp: alert.timestamp,
        priority: "high",
        userData: {
          alertId: alert.id,
          userId: alert.userId,
          email: alert.userEmail,
          ...alert.data,
        },
      });
    } catch (error) {
      console.error(`❌ Error notifying backoffice:`, error);
    }
  }

  private addToRetryQueue(alert: AlertData): void {
    alert.retryCount++;
    if (alert.retryCount <= alert.maxRetries) {
      this.retryQueue.push(alert);
      console.log(
        `⏳ Alert ${alert.id} added to retry queue (attempt ${alert.retryCount}/${alert.maxRetries})`,
      );
    }
  }

  private async processRetryQueue(): Promise<void> {
    if (this.retryQueue.length === 0) return;

    console.log(`🔄 Processing retry queue (${this.retryQueue.length} alerts)`);

    const alertsToRetry = this.retryQueue.splice(0, 5); // Process max 5 at a time

    for (const alert of alertsToRetry) {
      try {
        await this.sendAlert(alert);
      } catch (error) {
        console.error(`❌ Retry failed for alert ${alert.id}:`, error);
      }
    }
  }

  // Convenience methods for specific alert types
  public async alertReservationCancelled(
    userId: string,
    userEmail: string,
    userName: string,
    reservationId: string,
    accommodationName: string,
    reason?: string,
  ): Promise<AlertData> {
    return this.createAlert({
      type: "reservation_cancelled",
      severity: "high",
      userId,
      userEmail,
      userName,
      userRole: "guest",
      title: "Reserva Cancelada",
      message: `Tu reserva en ${accommodationName} ha sido cancelada.`,
      data: {
        reservationId,
        accommodationName,
        reason,
        actions: [
          {
            label: "Ver Detalles",
            url: `/my-reservations`,
            type: "primary",
          },
          {
            label: "Nueva Búsqueda",
            url: "/accommodations",
            type: "secondary",
          },
        ],
      },
      channels: ["email", "push", "in_app"],
      maxRetries: 3,
    });
  }

  public async alertPaymentFailed(
    userId: string,
    userEmail: string,
    userName: string,
    reservationId: string,
    amount: number,
    reason?: string,
  ): Promise<AlertData> {
    return this.createAlert({
      type: "payment_failed",
      severity: "critical",
      userId,
      userEmail,
      userName,
      userRole: "guest",
      title: "Pago Fallido",
      message: `El pago de $${amount.toFixed(2)} USD para tu reserva ${reservationId} no pudo ser procesado.`,
      data: {
        reservationId,
        amount,
        currency: "USD",
        reason,
        actions: [
          {
            label: "Reintentar Pago",
            url: `/payment/${reservationId}`,
            type: "primary",
          },
          {
            label: "Contactar Soporte",
            url: "/contact",
            type: "secondary",
          },
        ],
      },
      channels: ["email", "push", "in_app"],
      maxRetries: 5,
    });
  }

  public async alertPaymentOverdue(
    userId: string,
    userEmail: string,
    userName: string,
    reservationId: string,
    amount: number,
    dueDate: string,
  ): Promise<AlertData> {
    return this.createAlert({
      type: "payment_overdue",
      severity: "high",
      userId,
      userEmail,
      userName,
      userRole: "guest",
      title: "Pago Vencido",
      message: `Tu pago de $${amount.toFixed(2)} USD venció el ${new Date(dueDate).toLocaleDateString("es-ES")}. Realiza el pago para confirmar tu reserva.`,
      data: {
        reservationId,
        amount,
        currency: "USD",
        dueDate,
        actions: [
          {
            label: "Pagar Ahora",
            url: `/payment/${reservationId}`,
            type: "primary",
          },
        ],
      },
      channels: ["email", "push", "in_app"],
      maxRetries: 3,
    });
  }

  public async alertReservationModified(
    userId: string,
    userEmail: string,
    userName: string,
    reservationId: string,
    accommodationName: string,
    originalDates: { checkIn: string; checkOut: string },
    newDates: { checkIn: string; checkOut: string },
    reason?: string,
  ): Promise<AlertData> {
    return this.createAlert({
      type: "reservation_modified",
      severity: "medium",
      userId,
      userEmail,
      userName,
      userRole: "guest",
      title: "Reserva Modificada",
      message: `Tu reserva en ${accommodationName} ha sido modificada.`,
      data: {
        reservationId,
        accommodationName,
        originalDates,
        newDates,
        reason,
        actions: [
          {
            label: "Ver Cambios",
            url: `/my-reservations`,
            type: "primary",
          },
        ],
      },
      channels: ["email", "push", "in_app"],
      maxRetries: 2,
    });
  }

  public async alertCheckInReminder(
    userId: string,
    userEmail: string,
    userName: string,
    reservationId: string,
    accommodationName: string,
    checkInDate: string,
  ): Promise<AlertData> {
    return this.createAlert({
      type: "check_in_reminder",
      severity: "medium",
      userId,
      userEmail,
      userName,
      userRole: "guest",
      title: "Recordatorio de Check-in",
      message: `Tu check-in en ${accommodationName} es mañana.`,
      data: {
        reservationId,
        accommodationName,
        checkInDate,
        actions: [
          {
            label: "Ver Detalles",
            url: `/my-reservations`,
            type: "primary",
          },
        ],
      },
      channels: ["email", "push", "in_app"],
      maxRetries: 2,
    });
  }

  // Alert management
  public async getAlerts(
    userId: string,
    limit: number = 50,
  ): Promise<AlertData[]> {
    return this.alerts
      .filter((alert) => alert.userId === userId)
      .slice(0, limit);
  }

  public async markAlertAsRead(alertId: string): Promise<boolean> {
    const alert = this.alerts.find((a) => a.id === alertId);
    if (alert) {
      alert.read = true;
      return true;
    }
    return false;
  }

  public async getUnreadAlertsCount(userId: string): Promise<number> {
    return this.alerts.filter((alert) => alert.userId === userId && !alert.read)
      .length;
  }

  // Preferences management
  public getUserPreferences(userId: string): AlertPreferences | null {
    return this.preferences.get(userId) || null;
  }

  public updateUserPreferences(
    userId: string,
    preferences: Partial<AlertPreferences>,
  ): void {
    const current = this.preferences.get(userId) || {
      userId,
      emailNotifications: true,
      pushNotifications: true,
      smsNotifications: false,
      categories: {
        reservations: true,
        payments: true,
        reminders: true,
        marketing: false,
      },
      urgencyLevels: {
        low: true,
        medium: true,
        high: true,
        critical: true,
      },
    };

    this.preferences.set(userId, { ...current, ...preferences });
    console.log(`✅ Alert preferences updated for user ${userId}`);
  }
}

// Export singleton instance
export const alertService = AlertService.getInstance();
