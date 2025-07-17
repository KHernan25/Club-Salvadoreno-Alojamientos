// Servicio de gestión de reservas para check-in y check-out

export interface Reservation {
  id: string;
  reservationCode: string;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  accommodationType: string;
  accommodationName: string;
  location: "El Sunzal" | "Corinto";
  checkInDate: Date;
  checkOutDate: Date;
  numberOfGuests: number;
  totalAmount: number;
  status: "confirmed" | "checked_in" | "checked_out" | "cancelled";
  specialRequests?: string;
  createdAt: Date;
  checkInDetails?: CheckInDetails;
  checkOutDetails?: CheckOutDetails;
}

export interface CheckInDetails {
  checkedInAt: Date;
  checkedInBy: string;
  actualArrivalTime: Date;
  guestsPresent: number;
  documentsVerified: boolean;
  keyProvided: boolean;
  notes?: string;
}

export interface CheckOutDetails {
  checkedOutAt: Date;
  checkedOutBy: string;
  actualDepartureTime: Date;
  roomCondition: "excellent" | "good" | "fair" | "poor";
  damagesReported: boolean;
  damageDescription?: string;
  cleaningRequired: boolean;
  keyReturned: boolean;
  additionalCharges?: number;
  guestComments?: string;
  hostComments?: string;
}

class ReservationService {
  private static instance: ReservationService;
  private reservations: Reservation[] = [];

  private constructor() {
    this.initializeMockData();
  }

  public static getInstance(): ReservationService {
    if (!ReservationService.instance) {
      ReservationService.instance = new ReservationService();
    }
    return ReservationService.instance;
  }

  // Inicializar datos de prueba
  private initializeMockData(): void {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const nextWeek = new Date(today);
    nextWeek.setDate(nextWeek.getDate() + 7);

    const mockReservations: Reservation[] = [
      {
        id: "res_1",
        reservationCode: "CS2024001",
        guestName: "Ana Patricia López",
        guestEmail: "ana.lopez@email.com",
        guestPhone: "+503 7234-5678",
        accommodationType: "Apartamento",
        accommodationName: "Apartamento Vista Mar",
        location: "El Sunzal",
        checkInDate: today,
        checkOutDate: new Date(today.getTime() + 2 * 24 * 60 * 60 * 1000),
        numberOfGuests: 4,
        totalAmount: 250.0,
        status: "confirmed",
        specialRequests: "Cuna para bebé, llegada tardía aprox. 8 PM",
        createdAt: new Date(today.getTime() - 5 * 24 * 60 * 60 * 1000),
      },
      {
        id: "res_2",
        reservationCode: "CS2024002",
        guestName: "Roberto Martínez",
        guestEmail: "roberto.martinez@email.com",
        guestPhone: "+503 7890-1234",
        accommodationType: "Casa",
        accommodationName: "Casa Familiar Corinto",
        location: "Corinto",
        checkInDate: today,
        checkOutDate: new Date(today.getTime() + 3 * 24 * 60 * 60 * 1000),
        numberOfGuests: 6,
        totalAmount: 450.0,
        status: "confirmed",
        specialRequests: "Acceso a campo de golf",
        createdAt: new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000),
      },
      {
        id: "res_3",
        reservationCode: "CS2024003",
        guestName: "María Fernanda Sánchez",
        guestEmail: "mf.sanchez@email.com",
        guestPhone: "+503 6543-2109",
        accommodationType: "Suite",
        accommodationName: "Suite Presidencial",
        location: "El Sunzal",
        checkInDate: tomorrow,
        checkOutDate: new Date(tomorrow.getTime() + 1 * 24 * 60 * 60 * 1000),
        numberOfGuests: 2,
        totalAmount: 180.0,
        status: "confirmed",
        createdAt: new Date(today.getTime() - 3 * 24 * 60 * 60 * 1000),
      },
      {
        id: "res_4",
        reservationCode: "CS2024004",
        guestName: "Carlos Hernández",
        guestEmail: "carlos.hernandez@email.com",
        guestPhone: "+503 7654-3210",
        accommodationType: "Apartamento",
        accommodationName: "Apartamento Estándar",
        location: "El Sunzal",
        checkInDate: new Date(today.getTime() - 1 * 24 * 60 * 60 * 1000),
        checkOutDate: today,
        numberOfGuests: 3,
        totalAmount: 200.0,
        status: "checked_in",
        createdAt: new Date(today.getTime() - 10 * 24 * 60 * 60 * 1000),
        checkInDetails: {
          checkedInAt: new Date(today.getTime() - 1 * 24 * 60 * 60 * 1000),
          checkedInBy: "Carlos Rodríguez",
          actualArrivalTime: new Date(
            today.getTime() - 1 * 24 * 60 * 60 * 1000,
          ),
          guestsPresent: 3,
          documentsVerified: true,
          keyProvided: true,
          notes: "Check-in sin problemas, huéspedes muy amables",
        },
      },
    ];

    this.reservations = mockReservations;
  }

  // Buscar reserva por código
  public async findByReservationCode(
    code: string,
  ): Promise<Reservation | null> {
    await new Promise((resolve) => setTimeout(resolve, 500)); // Simular búsqueda

    const reservation = this.reservations.find(
      (r) => r.reservationCode.toLowerCase() === code.toLowerCase(),
    );

    if (reservation) {
      console.log("✅ Reservation found:", {
        code: reservation.reservationCode,
        guest: reservation.guestName,
        status: reservation.status,
      });
    } else {
      console.log("❌ Reservation not found:", code);
    }

    return reservation || null;
  }

  // Realizar check-in
  public async performCheckIn(
    reservationId: string,
    checkInDetails: Omit<CheckInDetails, "checkedInAt">,
  ): Promise<boolean> {
    const reservation = this.reservations.find((r) => r.id === reservationId);

    if (!reservation) {
      throw new Error("Reserva no encontrada");
    }

    if (reservation.status !== "confirmed") {
      throw new Error(
        `No se puede hacer check-in. Estado actual: ${reservation.status}`,
      );
    }

    reservation.status = "checked_in";
    reservation.checkInDetails = {
      ...checkInDetails,
      checkedInAt: new Date(),
    };

    console.log("✅ Check-in completed:", {
      code: reservation.reservationCode,
      guest: reservation.guestName,
      time: reservation.checkInDetails.checkedInAt,
    });

    return true;
  }

  // Realizar check-out
  public async performCheckOut(
    reservationId: string,
    checkOutDetails: Omit<CheckOutDetails, "checkedOutAt">,
  ): Promise<boolean> {
    const reservation = this.reservations.find((r) => r.id === reservationId);

    if (!reservation) {
      throw new Error("Reserva no encontrada");
    }

    if (reservation.status !== "checked_in") {
      throw new Error(
        `No se puede hacer check-out. Estado actual: ${reservation.status}`,
      );
    }

    reservation.status = "checked_out";
    reservation.checkOutDetails = {
      ...checkOutDetails,
      checkedOutAt: new Date(),
    };

    console.log("✅ Check-out completed:", {
      code: reservation.reservationCode,
      guest: reservation.guestName,
      time: reservation.checkOutDetails.checkedOutAt,
    });

    return true;
  }

  // Obtener reservas para check-in hoy
  public getTodayCheckIns(): Reservation[] {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    return this.reservations
      .filter(
        (r) =>
          r.status === "confirmed" &&
          r.checkInDate >= today &&
          r.checkInDate < tomorrow,
      )
      .sort((a, b) => a.checkInDate.getTime() - b.checkInDate.getTime());
  }

  // Obtener reservas para check-out hoy
  public getTodayCheckOuts(): Reservation[] {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    return this.reservations
      .filter(
        (r) =>
          r.status === "checked_in" &&
          r.checkOutDate >= today &&
          r.checkOutDate < tomorrow,
      )
      .sort((a, b) => a.checkOutDate.getTime() - b.checkOutDate.getTime());
  }

  // Obtener todas las reservas activas
  public getActiveReservations(): Reservation[] {
    return this.reservations
      .filter((r) => r.status === "checked_in")
      .sort((a, b) => b.checkInDate.getTime() - a.checkInDate.getTime());
  }

  // Obtener todas las reservas
  public getAllReservations(): Reservation[] {
    return [...this.reservations].sort((a, b) => {
      // Ordenar por fecha de check-in descendente (más recientes primero)
      return b.checkInDate.getTime() - a.checkInDate.getTime();
    });
  }

  // Obtener estadísticas de reservas
  public getReservationStats(): {
    todayCheckIns: number;
    todayCheckOuts: number;
    activeReservations: number;
    totalRevenue: number;
  } {
    const todayCheckIns = this.getTodayCheckIns();
    const todayCheckOuts = this.getTodayCheckOuts();
    const activeReservations = this.getActiveReservations();

    const totalRevenue = activeReservations.reduce(
      (sum, r) => sum + r.totalAmount,
      0,
    );

    return {
      todayCheckIns: todayCheckIns.length,
      todayCheckOuts: todayCheckOuts.length,
      activeReservations: activeReservations.length,
      totalRevenue,
    };
  }

  // Obtener historial de reservas
  public getReservationHistory(limit: number = 50): Reservation[] {
    return this.reservations
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, limit);
  }

  // Generar ID único
  private generateId(): string {
    return `res_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

// Export singleton instance
export const reservationService = ReservationService.getInstance();
