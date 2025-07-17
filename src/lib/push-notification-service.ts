interface PushNotificationData {
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  image?: string;
  data?: any;
  actions?: Array<{
    action: string;
    title: string;
    icon?: string;
  }>;
  requireInteraction?: boolean;
  silent?: boolean;
  tag?: string;
  timestamp?: number;
}

export interface NotificationPayload {
  type:
    | "booking_confirmed"
    | "booking_reminder"
    | "payment_reminder"
    | "payment_failed"
    | "booking_cancelled"
    | "booking_modified"
    | "new_message"
    | "host_response";
  userId: string;
  data: {
    reservationId?: string;
    messageId?: string;
    title: string;
    message: string;
    actionUrl?: string;
    priority?: "low" | "medium" | "high";
  };
}

export class PushNotificationService {
  private static instance: PushNotificationService;
  private swRegistration: ServiceWorkerRegistration | null = null;
  private vapidPublicKey: string = process.env.VITE_VAPID_PUBLIC_KEY || "";

  public static getInstance(): PushNotificationService {
    if (!PushNotificationService.instance) {
      PushNotificationService.instance = new PushNotificationService();
    }
    return PushNotificationService.instance;
  }

  private constructor() {
    this.initializeServiceWorker();
  }

  private async initializeServiceWorker(): Promise<void> {
    if ("serviceWorker" in navigator && "PushManager" in window) {
      try {
        this.swRegistration = await navigator.serviceWorker.register(
          "/sw-push-notifications.js",
        );
        console.log("✅ Service Worker registered successfully");
      } catch (error) {
        console.error("❌ Service Worker registration failed:", error);
      }
    } else {
      console.warn("Push notifications are not supported in this browser");
    }
  }

  public async requestPermission(): Promise<NotificationPermission> {
    if (!("Notification" in window)) {
      console.warn("This browser does not support notifications");
      return "denied";
    }

    if (Notification.permission === "default") {
      const permission = await Notification.requestPermission();
      return permission;
    }

    return Notification.permission;
  }

  public async subscribeUser(): Promise<PushSubscription | null> {
    if (!this.swRegistration) {
      console.error("Service Worker not registered");
      return null;
    }

    try {
      const subscription = await this.swRegistration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: this.urlBase64ToUint8Array(this.vapidPublicKey),
      });

      // Send subscription to server
      await this.sendSubscriptionToServer(subscription);
      console.log("✅ User subscribed to push notifications");
      return subscription;
    } catch (error) {
      console.error("❌ Failed to subscribe to push notifications:", error);
      return null;
    }
  }

  public async unsubscribeUser(): Promise<boolean> {
    if (!this.swRegistration) {
      return false;
    }

    try {
      const subscription =
        await this.swRegistration.pushManager.getSubscription();
      if (subscription) {
        await subscription.unsubscribe();
        await this.removeSubscriptionFromServer(subscription);
        console.log("✅ User unsubscribed from push notifications");
        return true;
      }
      return false;
    } catch (error) {
      console.error("❌ Failed to unsubscribe from push notifications:", error);
      return false;
    }
  }

  public async isSubscribed(): Promise<boolean> {
    if (!this.swRegistration) {
      return false;
    }

    try {
      const subscription =
        await this.swRegistration.pushManager.getSubscription();
      return !!subscription;
    } catch (error) {
      console.error("❌ Error checking subscription status:", error);
      return false;
    }
  }

  public async showLocalNotification(
    data: PushNotificationData,
  ): Promise<void> {
    if (!("Notification" in window)) {
      console.warn("This browser does not support notifications");
      return;
    }

    if (Notification.permission !== "granted") {
      console.warn("Notification permission not granted");
      return;
    }

    try {
      const options: NotificationOptions = {
        body: data.body,
        icon: data.icon || "/icons/notification-icon.png",
        badge: data.badge || "/icons/notification-badge.png",

        data: data.data,
        actions: data.actions,
        requireInteraction: data.requireInteraction || false,
        silent: data.silent || false,
        tag: data.tag,
        timestamp: data.timestamp || Date.now(),
      };

      if (this.swRegistration) {
        await this.swRegistration.showNotification(data.title, options);
      } else {
        new Notification(data.title, options);
      }

      console.log("✅ Local notification shown");
    } catch (error) {
      console.error("❌ Error showing local notification:", error);
    }
  }

  public async sendPushNotification(
    payload: NotificationPayload,
  ): Promise<boolean> {
    try {
      const response = await fetch("/api/notifications/push", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(
          `Failed to send push notification: ${response.statusText}`,
        );
      }

      console.log("✅ Push notification sent successfully");
      return true;
    } catch (error) {
      console.error("❌ Error sending push notification:", error);
      return false;
    }
  }

  // Convenience methods for different notification types
  public async notifyBookingConfirmed(
    userId: string,
    reservationId: string,
    accommodationName: string,
  ): Promise<void> {
    await this.showLocalNotification({
      title: "🎉 ¡Reserva Confirmada!",
      body: `Tu reserva en ${accommodationName} ha sido confirmada exitosamente.`,
      icon: "/icons/success-icon.png",
      tag: `booking-confirmed-${reservationId}`,
      data: {
        type: "booking_confirmed",
        reservationId,
        actionUrl: `/my-reservations`,
      },
      actions: [
        {
          action: "view",
          title: "Ver Reserva",
          icon: "/icons/view-icon.png",
        },
      ],
      requireInteraction: true,
    });

    await this.sendPushNotification({
      type: "booking_confirmed",
      userId,
      data: {
        reservationId,
        title: "¡Reserva Confirmada!",
        message: `Tu reserva en ${accommodationName} ha sido confirmada.`,
        actionUrl: `/my-reservations`,
        priority: "high",
      },
    });
  }

  public async notifyPaymentReminder(
    userId: string,
    reservationId: string,
    amount: number,
    dueDate: string,
  ): Promise<void> {
    await this.showLocalNotification({
      title: "💳 Recordatorio de Pago",
      body: `Tienes un pago pendiente de $${amount.toFixed(2)} USD que vence el ${new Date(dueDate).toLocaleDateString("es-ES")}.`,
      icon: "/icons/payment-icon.png",
      tag: `payment-reminder-${reservationId}`,
      data: {
        type: "payment_reminder",
        reservationId,
        actionUrl: `/payment/${reservationId}`,
      },
      actions: [
        {
          action: "pay",
          title: "Pagar Ahora",
          icon: "/icons/pay-icon.png",
        },
        {
          action: "dismiss",
          title: "Recordar Después",
        },
      ],
      requireInteraction: true,
    });

    await this.sendPushNotification({
      type: "payment_reminder",
      userId,
      data: {
        reservationId,
        title: "Recordatorio de Pago",
        message: `Pago pendiente de $${amount.toFixed(2)} USD`,
        actionUrl: `/payment/${reservationId}`,
        priority: "high",
      },
    });
  }

  public async notifyNewMessage(
    userId: string,
    messageId: string,
    senderName: string,
    preview: string,
  ): Promise<void> {
    await this.showLocalNotification({
      title: `💬 Nuevo mensaje de ${senderName}`,
      body: preview.length > 100 ? `${preview.substring(0, 100)}...` : preview,
      icon: "/icons/message-icon.png",
      tag: `new-message-${messageId}`,
      data: {
        type: "new_message",
        messageId,
        actionUrl: `/messages/${messageId}`,
      },
      actions: [
        {
          action: "reply",
          title: "Responder",
          icon: "/icons/reply-icon.png",
        },
        {
          action: "view",
          title: "Ver Mensaje",
        },
      ],
      requireInteraction: true,
    });

    await this.sendPushNotification({
      type: "new_message",
      userId,
      data: {
        messageId,
        title: `Nuevo mensaje de ${senderName}`,
        message: preview,
        actionUrl: `/messages/${messageId}`,
        priority: "medium",
      },
    });
  }

  public async notifyBookingReminder(
    userId: string,
    reservationId: string,
    accommodationName: string,
    checkInDate: string,
  ): Promise<void> {
    await this.showLocalNotification({
      title: "🔔 Recordatorio de Estadía",
      body: `Tu check-in en ${accommodationName} es mañana (${new Date(checkInDate).toLocaleDateString("es-ES")}).`,
      icon: "/icons/reminder-icon.png",
      tag: `booking-reminder-${reservationId}`,
      data: {
        type: "booking_reminder",
        reservationId,
        actionUrl: `/my-reservations`,
      },
      actions: [
        {
          action: "view",
          title: "Ver Detalles",
        },
      ],
      requireInteraction: true,
    });

    await this.sendPushNotification({
      type: "booking_reminder",
      userId,
      data: {
        reservationId,
        title: "Recordatorio de Estadía",
        message: `Tu check-in en ${accommodationName} es mañana`,
        actionUrl: `/my-reservations`,
        priority: "medium",
      },
    });
  }

  private async sendSubscriptionToServer(
    subscription: PushSubscription,
  ): Promise<void> {
    try {
      await fetch("/api/notifications/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          subscription: subscription.toJSON(),
        }),
      });
    } catch (error) {
      console.error("❌ Error sending subscription to server:", error);
    }
  }

  private async removeSubscriptionFromServer(
    subscription: PushSubscription,
  ): Promise<void> {
    try {
      await fetch("/api/notifications/unsubscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          subscription: subscription.toJSON(),
        }),
      });
    } catch (error) {
      console.error("❌ Error removing subscription from server:", error);
    }
  }

  private urlBase64ToUint8Array(base64String: string): Uint8Array {
    const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding)
      .replace(/\-/g, "+")
      .replace(/_/g, "/");

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }
}

// Export singleton instance
export const pushNotificationService = PushNotificationService.getInstance();
