// Servicio de base de datos en memoria para desarrollo
// En producción esto se reemplazaría con una BD real

import { v4 as uuidv4 } from "uuid";

// Interfaces principales
export interface Accommodation {
  id: string;
  name: string;
  type: "apartamento" | "casa" | "suite";
  location: "el-sunzal" | "corinto";
  capacity: number;
  description: string;
  amenities: string[];
  pricing: {
    weekday: number;
    weekend: number;
    holiday: number;
  };
  images: string[];
  available: boolean;
  view?: string;
  featured?: boolean;
  lastUpdated: string;
  updatedBy?: string;
}

export interface Reservation {
  id: string;
  userId: string;
  accommodationId: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  totalPrice: number;
  status: "pending" | "confirmed" | "cancelled" | "completed";
  createdAt: string;
  updatedAt: string;
  specialRequests?: string;
  breakdown?: {
    weekdayDays: number;
    weekendDays: number;
    holidayDays: number;
    weekdayTotal: number;
    weekendTotal: number;
    holidayTotal: number;
  };
}

export interface Review {
  id: string;
  accommodationId: string;
  userId: string;
  reservationId: string;
  rating: number; // 1-5
  title: string;
  comment: string;
  images?: string[];
  categories: {
    cleanliness: number;
    communication: number;
    checkin: number;
    accuracy: number;
    location: number;
    value: number;
  };
  helpfulCount: number;
  reportedCount: number;
  isModerated: boolean;
  moderatorNote?: string;
  hostResponse?: {
    message: string;
    createdAt: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface ActivityLog {
  id: string;
  date: string;
  type: "check_in" | "check_out" | "maintenance" | "cleaning" | "inspection";
  location: "el-sunzal" | "corinto";
  accommodationId?: string;
  description: string;
  details: string;
  userId: string;
  status: "pending" | "in_progress" | "completed";
  priority: "low" | "medium" | "high";
  createdAt: string;
  updatedAt: string;
}

export interface RegistrationRequest {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  documentType: "dui" | "passport";
  documentNumber: string;
  memberCode: string;
  password: string;
  status: "pending" | "approved" | "rejected";
  submittedAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
  rejectionReason?: string;
}

export interface Notification {
  id: string;
  type: "reservation" | "user_registration" | "system" | "review";
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  data?: any;
}

// Base de datos en memoria
class InMemoryDatabase {
  private accommodations: Map<string, Accommodation> = new Map();
  private reservations: Map<string, Reservation> = new Map();
  private reviews: Map<string, Review> = new Map();
  private activityLogs: Map<string, ActivityLog> = new Map();
  private registrationRequests: Map<string, RegistrationRequest> = new Map();
  private notifications: Map<string, Notification> = new Map();

  constructor() {
    this.initializeData();
  }

  private initializeData() {
    // Inicializar alojamientos
    this.initializeAccommodations();
    this.initializeReservations();
    this.initializeReviews();
    this.initializeActivityLogs();
    this.initializeNotifications();
  }

  private initializeAccommodations() {
    const accommodations: Accommodation[] = [
      // El Sunzal - Apartamentos
      {
        id: "1A",
        name: "Apartamento 1A",
        type: "apartamento",
        location: "el-sunzal",
        capacity: 2,
        description:
          "Cómodo apartamento con vista directa al mar, perfecto para parejas. Ubicado en el primer piso con fácil acceso y todas las comodidades necesarias.",
        amenities: [
          "Wi-Fi",
          "Aire acondicionado",
          "TV",
          "Kitchenette",
          "Vista al mar",
        ],
        pricing: { weekday: 110, weekend: 230, holiday: 280 },
        images: [
          "/api/images/apartamentos/1a-main.jpg",
          "/api/images/apartamentos/1a-bedroom.jpg",
        ],
        available: true,
        view: "Vista al mar",
        lastUpdated: new Date().toISOString(),
      },
      {
        id: "1B",
        name: "Apartamento 1B",
        type: "apartamento",
        location: "el-sunzal",
        capacity: 2,
        description:
          "Apartamento acogedor con vista parcial al mar. Ideal para una estancia romántica con todas las comodidades modernas.",
        amenities: ["Wi-Fi", "Aire acondicionado", "TV", "Kitchenette"],
        pricing: { weekday: 95, weekend: 210, holiday: 260 },
        images: [
          "/api/images/apartamentos/1b-main.jpg",
          "/api/images/apartamentos/1b-living.jpg",
        ],
        available: true,
        view: "Vista parcial",
        lastUpdated: new Date().toISOString(),
      },
      {
        id: "2A",
        name: "Apartamento 2A",
        type: "apartamento",
        location: "el-sunzal",
        capacity: 4,
        description:
          "Espacioso apartamento para familias con vista premium al mar. Segundo piso con balcón privado y cocina completa.",
        amenities: [
          "Wi-Fi",
          "Aire acondicionado",
          "TV",
          "Cocina completa",
          "Balcón",
        ],
        pricing: { weekday: 120, weekend: 250, holiday: 300 },
        images: [
          "/api/images/apartamentos/2a-main.jpg",
          "/api/images/apartamentos/2a-balcony.jpg",
        ],
        available: true,
        view: "Vista al mar premium",
        lastUpdated: new Date().toISOString(),
      },

      // El Sunzal - Casas
      {
        id: "casa-surf-paradise",
        name: "Casa Surf Paradise",
        type: "casa",
        location: "el-sunzal",
        capacity: 6,
        description:
          "Casa diseñada especialmente para surfistas con acceso directo al break. Incluye almacenamiento para tablas y ducha exterior.",
        amenities: [
          "Wi-Fi",
          "Aire acondicionado",
          "Cocina completa",
          "Terraza",
          "Almacenamiento para tablas",
          "Ducha exterior",
        ],
        pricing: { weekday: 250, weekend: 450, holiday: 550 },
        images: [
          "/api/images/casas/surf-paradise-main.jpg",
          "/api/images/casas/surf-paradise-exterior.jpg",
        ],
        available: true,
        view: "Frente al mar",
        featured: true,
        lastUpdated: new Date().toISOString(),
      },
      {
        id: "casa-familiar-deluxe",
        name: "Casa Familiar Deluxe",
        type: "casa",
        location: "el-sunzal",
        capacity: 8,
        description:
          "Casa amplia y familiar con todas las comodidades para grupos grandes. Jardín privado, BBQ y sala de juegos incluidos.",
        amenities: [
          "Wi-Fi",
          "Aire acondicionado",
          "Cocina gourmet",
          "Jardín privado",
          "BBQ",
          "Sala de juegos",
        ],
        pricing: { weekday: 300, weekend: 550, holiday: 650 },
        images: [
          "/api/images/casas/familiar-deluxe-main.jpg",
          "/api/images/casas/familiar-deluxe-garden.jpg",
        ],
        available: true,
        view: "Amplia vista",
        lastUpdated: new Date().toISOString(),
      },

      // Suites premium
      ...Array.from({ length: 8 }, (_, i) => ({
        id: `suite-${i + 1}`,
        name: `Suite Premium ${i + 1}`,
        type: "suite" as const,
        location: "el-sunzal" as const,
        capacity: 2 + (i % 3),
        description: `Suite de lujo número ${i + 1} con servicios premium incluidos. Diseño elegante con vista panorámica al océano Pacífico.`,
        amenities: [
          "Wi-Fi",
          "Aire acondicionado",
          "TV Premium",
          "Minibar",
          "Room service",
          "Jacuzzi",
          "Balcón privado",
        ],
        pricing: {
          weekday: 180 + i * 10,
          weekend: 320 + i * 15,
          holiday: 420 + i * 20,
        },
        images: [
          `/api/images/suites/suite-${i + 1}-main.jpg`,
          `/api/images/suites/suite-${i + 1}-view.jpg`,
        ],
        available: true,
        view: "Premium",
        featured: i < 2,
        lastUpdated: new Date().toISOString(),
      })),

      // Corinto - Casas
      ...Array.from({ length: 6 }, (_, i) => ({
        id: `corinto-casa-${i + 1}`,
        name: `Casa Corinto ${i + 1}`,
        type: "casa" as const,
        location: "corinto" as const,
        capacity: 4 + Math.floor(i / 2),
        description: `Casa moderna ${i + 1} en Corinto con vista al lago. Ambiente tranquilo y relajante perfecto para desconectarse de la rutina.`,
        amenities: [
          "Wi-Fi",
          "Aire acondicionado",
          "TV",
          "Cocina equipada",
          "Terraza",
          "Jardín",
          "BBQ",
        ],
        pricing: {
          weekday: 140 + i * 15,
          weekend: 280 + i * 25,
          holiday: 350 + i * 30,
        },
        images: [
          `/api/images/corinto/casa-${i + 1}-main.jpg`,
          `/api/images/corinto/casa-${i + 1}-lake.jpg`,
        ],
        available: i !== 3, // Casa 4 no disponible
        view: "Vista lago",
        featured: i === 0,
        lastUpdated: new Date().toISOString(),
      })),
    ];

    accommodations.forEach((acc) => this.accommodations.set(acc.id, acc));
  }

  private initializeReservations() {
    const reservations: Reservation[] = [
      {
        id: uuidv4(),
        userId: "6",
        accommodationId: "1A",
        checkIn: "2024-01-15",
        checkOut: "2024-01-17",
        guests: 2,
        totalPrice: 460,
        status: "completed",
        createdAt: "2024-01-10T10:00:00Z",
        updatedAt: "2024-01-17T12:00:00Z",
        breakdown: {
          weekdayDays: 1,
          weekendDays: 1,
          holidayDays: 0,
          weekdayTotal: 110,
          weekendTotal: 230,
          holidayTotal: 0,
        },
      },
      {
        id: uuidv4(),
        userId: "7",
        accommodationId: "casa-surf-paradise",
        checkIn: "2024-02-01",
        checkOut: "2024-02-03",
        guests: 4,
        totalPrice: 900,
        status: "confirmed",
        createdAt: "2024-01-25T14:00:00Z",
        updatedAt: "2024-01-25T14:00:00Z",
        specialRequests: "Llegada temprana solicitada",
      },
    ];

    reservations.forEach((res) => this.reservations.set(res.id, res));
  }

  private initializeReviews() {
    const reviews: Review[] = [
      {
        id: uuidv4(),
        accommodationId: "1A",
        userId: "6",
        reservationId: Array.from(this.reservations.keys())[0],
        rating: 5,
        title: "Excelente estadía con vista al mar",
        comment:
          "El apartamento superó nuestras expectativas. La vista al mar es espectacular y las instalaciones están impecables.",
        categories: {
          cleanliness: 5,
          communication: 5,
          checkin: 5,
          accuracy: 5,
          location: 5,
          value: 4,
        },
        helpfulCount: 3,
        reportedCount: 0,
        isModerated: false,
        createdAt: "2024-01-18T10:00:00Z",
        updatedAt: "2024-01-18T10:00:00Z",
      },
    ];

    reviews.forEach((review) => this.reviews.set(review.id, review));
  }

  private initializeActivityLogs() {
    const logs: ActivityLog[] = [
      {
        id: uuidv4(),
        date: new Date().toISOString().split("T")[0],
        type: "cleaning",
        location: "el-sunzal",
        accommodationId: "1A",
        description: "Limpieza profunda apartamento 1A",
        details:
          "Limpieza completa después de huéspedes. Todo en perfecto estado.",
        userId: "11",
        status: "completed",
        priority: "medium",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];

    logs.forEach((log) => this.activityLogs.set(log.id, log));
  }

  private initializeNotifications() {
    const notifications: Notification[] = [
      {
        id: uuidv4(),
        type: "reservation",
        title: "Nueva reserva recibida",
        message: "Nueva reserva para Casa Surf Paradise del 1-3 de febrero",
        isRead: false,
        createdAt: new Date().toISOString(),
      },
    ];

    notifications.forEach((notif) => this.notifications.set(notif.id, notif));
  }

  // Métodos para Accommodations
  getAllAccommodations(): Accommodation[] {
    return Array.from(this.accommodations.values());
  }

  getAccommodationById(id: string): Accommodation | null {
    return this.accommodations.get(id) || null;
  }

  updateAccommodation(id: string, updates: Partial<Accommodation>): boolean {
    const accommodation = this.accommodations.get(id);
    if (!accommodation) return false;

    const updated = {
      ...accommodation,
      ...updates,
      lastUpdated: new Date().toISOString(),
    };
    this.accommodations.set(id, updated);
    return true;
  }

  // Métodos para Reservations
  getAllReservations(): Reservation[] {
    return Array.from(this.reservations.values());
  }

  getReservationById(id: string): Reservation | null {
    return this.reservations.get(id) || null;
  }

  getReservationsByUserId(userId: string): Reservation[] {
    return Array.from(this.reservations.values()).filter(
      (r) => r.userId === userId,
    );
  }

  getReservationsByAccommodationId(accommodationId: string): Reservation[] {
    return Array.from(this.reservations.values()).filter(
      (r) => r.accommodationId === accommodationId,
    );
  }

  createReservation(
    reservation: Omit<Reservation, "id" | "createdAt" | "updatedAt">,
  ): string {
    const id = uuidv4();
    const now = new Date().toISOString();
    const newReservation: Reservation = {
      ...reservation,
      id,
      createdAt: now,
      updatedAt: now,
    };
    this.reservations.set(id, newReservation);
    return id;
  }

  updateReservation(id: string, updates: Partial<Reservation>): boolean {
    const reservation = this.reservations.get(id);
    if (!reservation) return false;

    const updated = {
      ...reservation,
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    this.reservations.set(id, updated);
    return true;
  }

  deleteReservation(id: string): boolean {
    return this.reservations.delete(id);
  }

  // Métodos para Reviews
  getAllReviews(): Review[] {
    return Array.from(this.reviews.values());
  }

  getReviewById(id: string): Review | null {
    return this.reviews.get(id) || null;
  }

  getReviewsByAccommodationId(accommodationId: string): Review[] {
    return Array.from(this.reviews.values()).filter(
      (r) => r.accommodationId === accommodationId,
    );
  }

  createReview(
    review: Omit<
      Review,
      | "id"
      | "createdAt"
      | "updatedAt"
      | "helpfulCount"
      | "reportedCount"
      | "isModerated"
    >,
  ): string {
    const id = uuidv4();
    const now = new Date().toISOString();
    const newReview: Review = {
      ...review,
      id,
      helpfulCount: 0,
      reportedCount: 0,
      isModerated: false,
      createdAt: now,
      updatedAt: now,
    };
    this.reviews.set(id, newReview);
    return id;
  }

  updateReview(id: string, updates: Partial<Review>): boolean {
    const review = this.reviews.get(id);
    if (!review) return false;

    const updated = {
      ...review,
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    this.reviews.set(id, updated);
    return true;
  }

  // Métodos para Activity Logs
  getAllActivityLogs(): ActivityLog[] {
    return Array.from(this.activityLogs.values()).sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
  }

  getActivityLogById(id: string): ActivityLog | null {
    return this.activityLogs.get(id) || null;
  }

  createActivityLog(
    log: Omit<ActivityLog, "id" | "createdAt" | "updatedAt">,
  ): string {
    const id = uuidv4();
    const now = new Date().toISOString();
    const newLog: ActivityLog = {
      ...log,
      id,
      createdAt: now,
      updatedAt: now,
    };
    this.activityLogs.set(id, newLog);
    return id;
  }

  updateActivityLog(id: string, updates: Partial<ActivityLog>): boolean {
    const log = this.activityLogs.get(id);
    if (!log) return false;

    const updated = {
      ...log,
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    this.activityLogs.set(id, updated);
    return true;
  }

  deleteActivityLog(id: string): boolean {
    return this.activityLogs.delete(id);
  }

  // Métodos para Registration Requests
  getAllRegistrationRequests(): RegistrationRequest[] {
    return Array.from(this.registrationRequests.values()).sort(
      (a, b) =>
        new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime(),
    );
  }

  getRegistrationRequestById(id: string): RegistrationRequest | null {
    return this.registrationRequests.get(id) || null;
  }

  createRegistrationRequest(
    request: Omit<RegistrationRequest, "id" | "status" | "submittedAt">,
  ): string {
    const id = uuidv4();
    const newRequest: RegistrationRequest = {
      ...request,
      id,
      status: "pending",
      submittedAt: new Date().toISOString(),
    };
    this.registrationRequests.set(id, newRequest);
    return id;
  }

  updateRegistrationRequest(
    id: string,
    updates: Partial<RegistrationRequest>,
  ): boolean {
    const request = this.registrationRequests.get(id);
    if (!request) return false;

    const updated = { ...request, ...updates };
    if (updates.status && updates.status !== "pending") {
      updated.reviewedAt = new Date().toISOString();
    }
    this.registrationRequests.set(id, updated);
    return true;
  }

  // Métodos para Notifications
  getAllNotifications(): Notification[] {
    return Array.from(this.notifications.values()).sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
  }

  getNotificationById(id: string): Notification | null {
    return this.notifications.get(id) || null;
  }

  createNotification(
    notification: Omit<Notification, "id" | "createdAt" | "isRead">,
  ): string {
    const id = uuidv4();
    const newNotification: Notification = {
      ...notification,
      id,
      isRead: false,
      createdAt: new Date().toISOString(),
    };
    this.notifications.set(id, newNotification);
    return id;
  }

  markNotificationAsRead(id: string): boolean {
    const notification = this.notifications.get(id);
    if (!notification) return false;

    notification.isRead = true;
    this.notifications.set(id, notification);
    return true;
  }

  markAllNotificationsAsRead(): boolean {
    this.notifications.forEach((notification) => {
      notification.isRead = true;
    });
    return true;
  }

  getUnreadNotificationsCount(): number {
    return Array.from(this.notifications.values()).filter((n) => !n.isRead)
      .length;
  }
}

// Instancia singleton
export const database = new InMemoryDatabase();
