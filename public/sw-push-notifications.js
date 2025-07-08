// Service Worker for Push Notifications - Club Salvadoreño

const CACHE_NAME = "push-notifications-v1";

// Install event
self.addEventListener("install", (event) => {
  console.log("📱 Push notification service worker installed");
  self.skipWaiting();
});

// Activate event
self.addEventListener("activate", (event) => {
  console.log("📱 Push notification service worker activated");
  event.waitUntil(self.clients.claim());
});

// Push event listener
self.addEventListener("push", (event) => {
  console.log("📱 Push message received:", event);

  let data = {};
  let options = {
    body: "Nueva notificación disponible",
    icon: "/icons/notification-icon.png",
    badge: "/icons/notification-badge.png",
    vibrate: [200, 100, 200],
    data: {},
    actions: [],
    requireInteraction: false,
    timestamp: Date.now(),
  };

  if (event.data) {
    try {
      data = event.data.json();
      console.log("📱 Push data:", data);

      // Customize notification based on type
      switch (data.type) {
        case "booking_confirmed":
          options = {
            ...options,
            body: data.data.message || "Tu reserva ha sido confirmada",
            icon: "/icons/success-icon.png",
            tag: `booking-${data.data.reservationId}`,
            requireInteraction: true,
            actions: [
              {
                action: "view",
                title: "Ver Reserva",
                icon: "/icons/view-icon.png",
              },
            ],
            data: {
              type: data.type,
              url: data.data.actionUrl || "/my-reservations",
              reservationId: data.data.reservationId,
            },
          };
          break;

        case "payment_reminder":
          options = {
            ...options,
            body: data.data.message || "Tienes un pago pendiente",
            icon: "/icons/payment-icon.png",
            tag: `payment-${data.data.reservationId}`,
            requireInteraction: true,
            vibrate: [300, 100, 300],
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
            data: {
              type: data.type,
              url: data.data.actionUrl || `/payment/${data.data.reservationId}`,
              reservationId: data.data.reservationId,
            },
          };
          break;

        case "new_message":
          options = {
            ...options,
            body: data.data.message || "Tienes un nuevo mensaje",
            icon: "/icons/message-icon.png",
            tag: `message-${data.data.messageId}`,
            requireInteraction: true,
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
            data: {
              type: data.type,
              url: data.data.actionUrl || `/messages/${data.data.messageId}`,
              messageId: data.data.messageId,
            },
          };
          break;

        case "booking_reminder":
          options = {
            ...options,
            body: data.data.message || "Recordatorio de tu estadía",
            icon: "/icons/reminder-icon.png",
            tag: `reminder-${data.data.reservationId}`,
            requireInteraction: true,
            actions: [
              {
                action: "view",
                title: "Ver Detalles",
              },
            ],
            data: {
              type: data.type,
              url: data.data.actionUrl || "/my-reservations",
              reservationId: data.data.reservationId,
            },
          };
          break;

        case "payment_failed":
          options = {
            ...options,
            body: data.data.message || "Error en el procesamiento del pago",
            icon: "/icons/error-icon.png",
            tag: `payment-failed-${data.data.reservationId}`,
            requireInteraction: true,
            vibrate: [500, 200, 500],
            actions: [
              {
                action: "retry",
                title: "Reintentar Pago",
                icon: "/icons/retry-icon.png",
              },
            ],
            data: {
              type: data.type,
              url: data.data.actionUrl || `/payment/${data.data.reservationId}`,
              reservationId: data.data.reservationId,
            },
          };
          break;

        case "booking_cancelled":
          options = {
            ...options,
            body: data.data.message || "Tu reserva ha sido cancelada",
            icon: "/icons/cancel-icon.png",
            tag: `cancelled-${data.data.reservationId}`,
            requireInteraction: true,
            actions: [
              {
                action: "view",
                title: "Ver Detalles",
              },
            ],
            data: {
              type: data.type,
              url: data.data.actionUrl || "/my-reservations",
              reservationId: data.data.reservationId,
            },
          };
          break;

        case "host_response":
          options = {
            ...options,
            body: data.data.message || "El anfitrión ha respondido tu mensaje",
            icon: "/icons/host-icon.png",
            tag: `host-response-${data.data.messageId}`,
            requireInteraction: true,
            actions: [
              {
                action: "view",
                title: "Ver Respuesta",
              },
            ],
            data: {
              type: data.type,
              url: data.data.actionUrl || `/messages/${data.data.messageId}`,
              messageId: data.data.messageId,
            },
          };
          break;

        default:
          options.body = data.data?.message || data.data?.title || options.body;
          options.data = {
            type: data.type || "general",
            url: data.data?.actionUrl || "/",
          };
      }
    } catch (error) {
      console.error("❌ Error parsing push data:", error);
    }
  }

  const title = data.data?.title || "Club Salvadoreño";

  event.waitUntil(self.registration.showNotification(title, options));
});

// Notification click event listener
self.addEventListener("notificationclick", (event) => {
  console.log("📱 Notification clicked:", event);

  event.notification.close();

  const data = event.notification.data || {};
  const action = event.action;
  let url = data.url || "/";

  // Handle different actions
  switch (action) {
    case "view":
      // Default action - open the specified URL
      break;
    case "pay":
      // Open payment page
      url = data.url || "/payment";
      break;
    case "reply":
      // Open message reply
      url = data.url || "/messages";
      break;
    case "retry":
      // Retry payment
      url = data.url || "/payment";
      break;
    case "dismiss":
      // Just close the notification
      return;
    default:
      // Default click action
      break;
  }

  // Ensure URL is absolute
  if (!url.startsWith("http")) {
    url = self.location.origin + (url.startsWith("/") ? url : "/" + url);
  }

  event.waitUntil(
    clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((clientList) => {
        // Check if there's already a window/tab open with the target URL
        for (const client of clientList) {
          if (client.url === url && "focus" in client) {
            return client.focus();
          }
        }

        // If no existing window/tab, open a new one
        if (clients.openWindow) {
          return clients.openWindow(url);
        }
      }),
  );
});

// Notification close event listener
self.addEventListener("notificationclose", (event) => {
  console.log("📱 Notification closed:", event);

  // Track notification dismissal analytics if needed
  // This can be useful for measuring engagement
});

// Background sync for failed notifications
self.addEventListener("sync", (event) => {
  if (event.tag === "retry-failed-notifications") {
    event.waitUntil(retryFailedNotifications());
  }
});

async function retryFailedNotifications() {
  try {
    // Implement retry logic for failed notifications
    console.log("📱 Retrying failed notifications...");

    // This would typically involve:
    // 1. Getting failed notifications from IndexedDB
    // 2. Retrying the notification display
    // 3. Updating the status in storage
  } catch (error) {
    console.error("❌ Error retrying failed notifications:", error);
  }
}

// Message event listener for communication with main thread
self.addEventListener("message", (event) => {
  console.log("📱 Service worker received message:", event.data);

  if (event.data && event.data.type) {
    switch (event.data.type) {
      case "SKIP_WAITING":
        self.skipWaiting();
        break;
      case "GET_VERSION":
        event.ports[0].postMessage({ version: CACHE_NAME });
        break;
      default:
        console.log("📱 Unknown message type:", event.data.type);
    }
  }
});

// Error event listener
self.addEventListener("error", (event) => {
  console.error("❌ Service worker error:", event.error);
});

// Unhandled promise rejection listener
self.addEventListener("unhandledrejection", (event) => {
  console.error("❌ Service worker unhandled promise rejection:", event.reason);
  event.preventDefault();
});
