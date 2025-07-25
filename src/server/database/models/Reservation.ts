import { getDatabase } from "../connection";
import { v4 as uuidv4 } from "uuid";

export interface Reservation {
  id: string;
  userId: string;
  accommodationId: string;
  checkInDate: Date;
  checkOutDate: Date;
  guests: number;
  
  // CÁLCULO DETALLADO POR TEMPORADA
  totalNights: number;
  nightsTemporadaBaja: number;
  nightsTemporadaAlta: number;
  nightsDiasAsueto: number;
  
  subtotalTemporadaBaja: number;
  subtotalTemporadaAlta: number;
  subtotalDiasAsueto: number;
  
  totalBeforeTaxes: number;
  taxes: number;
  totalAmount: number;
  
  status: "pending" | "confirmed" | "cancelled" | "completed" | "checked_in" | "checked_out";
  specialRequests?: string;
  cancellationReason?: string;
  cancelledAt?: Date;
  confirmedAt?: Date;
  
  checkInActual?: Date;
  checkOutActual?: Date;
  
  createdAt: Date;
  updatedAt: Date;
}

export interface ReservationDailyBreakdown {
  id: number;
  reservationId: string;
  dateStay: Date;
  dayOfWeek: "lunes" | "martes" | "miercoles" | "jueves" | "viernes" | "sabado" | "domingo";
  seasonType: "temporada_baja" | "temporada_alta" | "dias_asueto";
  priceApplied: number;
  isHoliday: boolean;
  holidayName?: string;
}

export class ReservationModel {
  static async findAll(): Promise<Reservation[]> {
    const db = await getDatabase();
    const reservations = await db.all(
      "SELECT * FROM reservations ORDER BY created_at DESC"
    );
    return reservations.map((res) => this.mapDbToReservation(res));
  }

  static async findById(id: string): Promise<Reservation | null> {
    const db = await getDatabase();
    const reservation = await db.get(
      "SELECT * FROM reservations WHERE id = ?",
      [id]
    );
    return reservation ? this.mapDbToReservation(reservation) : null;
  }

  static async findByUserId(userId: string): Promise<Reservation[]> {
    const db = await getDatabase();
    const reservations = await db.all(
      "SELECT * FROM reservations WHERE user_id = ? ORDER BY created_at DESC",
      [userId]
    );
    return reservations.map((res) => this.mapDbToReservation(res));
  }

  static async findByAccommodationId(accommodationId: string): Promise<Reservation[]> {
    const db = await getDatabase();
    const reservations = await db.all(
      "SELECT * FROM reservations WHERE accommodation_id = ? ORDER BY check_in_date DESC",
      [accommodationId]
    );
    return reservations.map((res) => this.mapDbToReservation(res));
  }

  static async findByStatus(status: Reservation["status"]): Promise<Reservation[]> {
    const db = await getDatabase();
    const reservations = await db.all(
      "SELECT * FROM reservations WHERE status = ? ORDER BY created_at DESC",
      [status]
    );
    return reservations.map((res) => this.mapDbToReservation(res));
  }

  static async findByDateRange(startDate: Date, endDate: Date): Promise<Reservation[]> {
    const db = await getDatabase();
    const reservations = await db.all(
      `SELECT * FROM reservations 
       WHERE (check_in_date <= ? AND check_out_date >= ?) 
       OR (check_in_date >= ? AND check_in_date <= ?)
       ORDER BY check_in_date ASC`,
      [endDate.toISOString().split('T')[0], startDate.toISOString().split('T')[0], 
       startDate.toISOString().split('T')[0], endDate.toISOString().split('T')[0]]
    );
    return reservations.map((res) => this.mapDbToReservation(res));
  }

  static async create(reservationData: Omit<Reservation, "id" | "createdAt" | "updatedAt">): Promise<Reservation> {
    const db = await getDatabase();
    const id = uuidv4();
    const now = new Date().toISOString();

    await db.run(
      `INSERT INTO reservations (
        id, user_id, accommodation_id, check_in_date, check_out_date, guests,
        total_nights, nights_temporada_baja, nights_temporada_alta, nights_dias_asueto,
        subtotal_temporada_baja, subtotal_temporada_alta, subtotal_dias_asueto,
        total_before_taxes, taxes, total_amount, status, special_requests,
        created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        reservationData.userId,
        reservationData.accommodationId,
        reservationData.checkInDate.toISOString().split('T')[0],
        reservationData.checkOutDate.toISOString().split('T')[0],
        reservationData.guests,
        reservationData.totalNights,
        reservationData.nightsTemporadaBaja,
        reservationData.nightsTemporadaAlta,
        reservationData.nightsDiasAsueto,
        reservationData.subtotalTemporadaBaja,
        reservationData.subtotalTemporadaAlta,
        reservationData.subtotalDiasAsueto,
        reservationData.totalBeforeTaxes,
        reservationData.taxes,
        reservationData.totalAmount,
        reservationData.status,
        reservationData.specialRequests || null,
        now,
        now,
      ]
    );

    const created = await this.findById(id);
    if (!created) {
      throw new Error("Failed to create reservation");
    }

    return created;
  }

  static async update(
    id: string,
    updates: Partial<Reservation>
  ): Promise<Reservation | null> {
    const db = await getDatabase();

    const setClause = [];
    const values = [];

    const allowedFields = [
      "check_in_date", "check_out_date", "guests", "total_nights",
      "nights_temporada_baja", "nights_temporada_alta", "nights_dias_asueto",
      "subtotal_temporada_baja", "subtotal_temporada_alta", "subtotal_dias_asueto",
      "total_before_taxes", "taxes", "total_amount", "status", "special_requests",
      "cancellation_reason", "cancelled_at", "confirmed_at", 
      "check_in_actual", "check_out_actual"
    ];

    Object.entries(updates).forEach(([key, value]) => {
      const dbKey = this.camelToSnake(key);
      if (allowedFields.includes(dbKey)) {
        setClause.push(`${dbKey} = ?`);
        if (key.includes("Date") || key.includes("At")) {
          values.push(value ? (value as Date).toISOString() : null);
        } else {
          values.push(value);
        }
      }
    });

    if (setClause.length === 0) {
      return this.findById(id);
    }

    setClause.push("updated_at = CURRENT_TIMESTAMP");
    values.push(id);

    await db.run(
      `UPDATE reservations SET ${setClause.join(", ")} WHERE id = ?`,
      values
    );

    return this.findById(id);
  }

  static async updateStatus(
    id: string, 
    status: Reservation["status"],
    reason?: string
  ): Promise<Reservation | null> {
    const updates: Partial<Reservation> = { status };
    
    if (status === "confirmed") {
      updates.confirmedAt = new Date();
    } else if (status === "cancelled") {
      updates.cancelledAt = new Date();
      if (reason) {
        updates.cancellationReason = reason;
      }
    } else if (status === "checked_in") {
      updates.checkInActual = new Date();
    } else if (status === "checked_out") {
      updates.checkOutActual = new Date();
    }

    return this.update(id, updates);
  }

  static async getDailyBreakdown(reservationId: string): Promise<ReservationDailyBreakdown[]> {
    const db = await getDatabase();
    const breakdown = await db.all(
      "SELECT * FROM reservation_daily_breakdown WHERE reservation_id = ? ORDER BY date_stay ASC",
      [reservationId]
    );
    return breakdown.map((b) => this.mapDbToDailyBreakdown(b));
  }

  static async createDailyBreakdown(breakdowns: Omit<ReservationDailyBreakdown, "id">[]): Promise<void> {
    const db = await getDatabase();
    
    for (const breakdown of breakdowns) {
      await db.run(
        `INSERT INTO reservation_daily_breakdown (
          reservation_id, date_stay, day_of_week, season_type, 
          price_applied, is_holiday, holiday_name
        ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          breakdown.reservationId,
          breakdown.dateStay.toISOString().split('T')[0],
          breakdown.dayOfWeek,
          breakdown.seasonType,
          breakdown.priceApplied,
          breakdown.isHoliday ? 1 : 0,
          breakdown.holidayName || null,
        ]
      );
    }
  }

  static async getReservationStats(startDate?: Date, endDate?: Date): Promise<{
    total: number;
    byStatus: Record<string, number>;
    revenue: {
      total: number;
      temporadaBaja: number;
      temporadaAlta: number;
      diasAsueto: number;
    };
    averageStay: number;
    occupancyRate: number;
  }> {
    const db = await getDatabase();
    
    let dateFilter = "";
    const params: any[] = [];
    
    if (startDate && endDate) {
      dateFilter = "WHERE check_in_date >= ? AND check_out_date <= ?";
      params.push(startDate.toISOString().split('T')[0], endDate.toISOString().split('T')[0]);
    }

    const [totalResult] = await db.all(`SELECT COUNT(*) as total FROM reservations ${dateFilter}`, params);
    
    const statusStats = await db.all(`SELECT status, COUNT(*) as count FROM reservations ${dateFilter} GROUP BY status`, params);
    
    const [revenueResult] = await db.all(`
      SELECT 
        SUM(total_amount) as total,
        SUM(subtotal_temporada_baja) as temporada_baja,
        SUM(subtotal_temporada_alta) as temporada_alta,
        SUM(subtotal_dias_asueto) as dias_asueto,
        AVG(total_nights) as average_stay
      FROM reservations 
      ${dateFilter} AND status IN ('confirmed', 'completed', 'checked_in', 'checked_out')
    `, params);

    const byStatus: Record<string, number> = {};
    statusStats.forEach((stat: any) => {
      byStatus[stat.status] = stat.count;
    });

    return {
      total: totalResult.total,
      byStatus,
      revenue: {
        total: revenueResult.total || 0,
        temporadaBaja: revenueResult.temporada_baja || 0,
        temporadaAlta: revenueResult.temporada_alta || 0,
        diasAsueto: revenueResult.dias_asueto || 0,
      },
      averageStay: revenueResult.average_stay || 0,
      occupancyRate: 0, // TODO: Calculate based on accommodation availability
    };
  }

  static async checkAvailability(
    accommodationId: string,
    checkIn: Date,
    checkOut: Date,
    excludeReservationId?: string
  ): Promise<boolean> {
    const db = await getDatabase();
    
    let query = `
      SELECT COUNT(*) as conflicts 
      FROM reservations 
      WHERE accommodation_id = ? 
      AND status IN ('confirmed', 'checked_in')
      AND (
        (check_in_date <= ? AND check_out_date > ?) OR
        (check_in_date < ? AND check_out_date >= ?) OR
        (check_in_date >= ? AND check_out_date <= ?)
      )
    `;
    
    const params = [
      accommodationId,
      checkOut.toISOString().split('T')[0],
      checkIn.toISOString().split('T')[0],
      checkOut.toISOString().split('T')[0],
      checkIn.toISOString().split('T')[0],
      checkIn.toISOString().split('T')[0],
      checkOut.toISOString().split('T')[0],
    ];

    if (excludeReservationId) {
      query += " AND id != ?";
      params.push(excludeReservationId);
    }

    const [result] = await db.all(query, params);
    return result.conflicts === 0;
  }

  private static mapDbToReservation(dbReservation: any): Reservation {
    return {
      id: dbReservation.id,
      userId: dbReservation.user_id,
      accommodationId: dbReservation.accommodation_id,
      checkInDate: new Date(dbReservation.check_in_date),
      checkOutDate: new Date(dbReservation.check_out_date),
      guests: dbReservation.guests,
      totalNights: dbReservation.total_nights,
      nightsTemporadaBaja: dbReservation.nights_temporada_baja || 0,
      nightsTemporadaAlta: dbReservation.nights_temporada_alta || 0,
      nightsDiasAsueto: dbReservation.nights_dias_asueto || 0,
      subtotalTemporadaBaja: parseFloat(dbReservation.subtotal_temporada_baja || 0),
      subtotalTemporadaAlta: parseFloat(dbReservation.subtotal_temporada_alta || 0),
      subtotalDiasAsueto: parseFloat(dbReservation.subtotal_dias_asueto || 0),
      totalBeforeTaxes: parseFloat(dbReservation.total_before_taxes),
      taxes: parseFloat(dbReservation.taxes || 0),
      totalAmount: parseFloat(dbReservation.total_amount),
      status: dbReservation.status,
      specialRequests: dbReservation.special_requests,
      cancellationReason: dbReservation.cancellation_reason,
      cancelledAt: dbReservation.cancelled_at ? new Date(dbReservation.cancelled_at) : undefined,
      confirmedAt: dbReservation.confirmed_at ? new Date(dbReservation.confirmed_at) : undefined,
      checkInActual: dbReservation.check_in_actual ? new Date(dbReservation.check_in_actual) : undefined,
      checkOutActual: dbReservation.check_out_actual ? new Date(dbReservation.check_out_actual) : undefined,
      createdAt: new Date(dbReservation.created_at),
      updatedAt: new Date(dbReservation.updated_at),
    };
  }

  private static mapDbToDailyBreakdown(dbBreakdown: any): ReservationDailyBreakdown {
    return {
      id: dbBreakdown.id,
      reservationId: dbBreakdown.reservation_id,
      dateStay: new Date(dbBreakdown.date_stay),
      dayOfWeek: dbBreakdown.day_of_week,
      seasonType: dbBreakdown.season_type,
      priceApplied: parseFloat(dbBreakdown.price_applied),
      isHoliday: Boolean(dbBreakdown.is_holiday),
      holidayName: dbBreakdown.holiday_name,
    };
  }

  private static camelToSnake(str: string): string {
    return str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
  }
}
