import { getDatabase } from "../connection";
import { v4 as uuidv4 } from "uuid";

export interface Accommodation {
  id: string;
  name: string;
  type: "apartamento" | "casa" | "suite";
  location: "el-sunzal" | "corinto";
  capacity: number;
  description?: string;
  amenities: string[];
  
  // PRECIOS POR TEMPORADA
  precioTemporadaBaja: number;
  precioTemporadaAlta: number;
  precioDiasAsueto: number;
  
  images: string[];
  available: boolean;
  viewType?: string;
  featured: boolean;
  maxGuests?: number;
  minNights: number;
  maxNights: number;
  checkInTime: string;
  checkOutTime: string;
  
  lastUpdated: Date;
  updatedBy?: string;
  createdAt: Date;
}

export interface AccommodationPriceHistory {
  id: number;
  accommodationId: string;
  precioTemporadaBajaOld?: number;
  precioTemporadaAltaOld?: number;
  precioDiasAsuetoOld?: number;
  precioTemporadaBajaNew?: number;
  precioTemporadaAltaNew?: number;
  precioDiasAsuetoNew?: number;
  changedBy?: string;
  changeReason?: string;
  changedAt: Date;
}

export class AccommodationModel {
  static async findAll(): Promise<Accommodation[]> {
    const db = await getDatabase();
    const accommodations = await db.all(
      "SELECT * FROM accommodations WHERE available = 1 ORDER BY featured DESC, name ASC"
    );
    return accommodations.map((acc) => this.mapDbToAccommodation(acc));
  }

  static async findById(id: string): Promise<Accommodation | null> {
    const db = await getDatabase();
    const accommodation = await db.get(
      "SELECT * FROM accommodations WHERE id = ?",
      [id]
    );
    return accommodation ? this.mapDbToAccommodation(accommodation) : null;
  }

  static async findByLocation(location: "el-sunzal" | "corinto"): Promise<Accommodation[]> {
    const db = await getDatabase();
    const accommodations = await db.all(
      "SELECT * FROM accommodations WHERE location = ? AND available = 1 ORDER BY featured DESC, name ASC",
      [location]
    );
    return accommodations.map((acc) => this.mapDbToAccommodation(acc));
  }

  static async findByType(type: "apartamento" | "casa" | "suite"): Promise<Accommodation[]> {
    const db = await getDatabase();
    const accommodations = await db.all(
      "SELECT * FROM accommodations WHERE type = ? AND available = 1 ORDER BY featured DESC, name ASC",
      [type]
    );
    return accommodations.map((acc) => this.mapDbToAccommodation(acc));
  }

  static async findFeatured(): Promise<Accommodation[]> {
    const db = await getDatabase();
    const accommodations = await db.all(
      "SELECT * FROM accommodations WHERE featured = 1 AND available = 1 ORDER BY name ASC"
    );
    return accommodations.map((acc) => this.mapDbToAccommodation(acc));
  }

  static async findByCapacity(minCapacity: number): Promise<Accommodation[]> {
    const db = await getDatabase();
    const accommodations = await db.all(
      "SELECT * FROM accommodations WHERE capacity >= ? AND available = 1 ORDER BY capacity ASC, featured DESC",
      [minCapacity]
    );
    return accommodations.map((acc) => this.mapDbToAccommodation(acc));
  }

  static async findByPriceRange(
    minPrice: number, 
    maxPrice: number, 
    seasonType: "temporada_baja" | "temporada_alta" | "dias_asueto" = "temporada_baja"
  ): Promise<Accommodation[]> {
    const db = await getDatabase();
    let priceColumn = "precio_temporada_baja";
    
    if (seasonType === "temporada_alta") {
      priceColumn = "precio_temporada_alta";
    } else if (seasonType === "dias_asueto") {
      priceColumn = "precio_dias_asueto";
    }

    const accommodations = await db.all(
      `SELECT * FROM accommodations WHERE ${priceColumn} BETWEEN ? AND ? AND available = 1 ORDER BY ${priceColumn} ASC`,
      [minPrice, maxPrice]
    );
    return accommodations.map((acc) => this.mapDbToAccommodation(acc));
  }

  static async create(accommodationData: Omit<Accommodation, "id" | "createdAt" | "lastUpdated">): Promise<Accommodation> {
    const db = await getDatabase();
    const id = uuidv4();
    const now = new Date().toISOString();

    await db.run(
      `INSERT INTO accommodations (
        id, name, type, location, capacity, description, amenities,
        precio_temporada_baja, precio_temporada_alta, precio_dias_asueto,
        images, available, view_type, featured, max_guests, min_nights, max_nights,
        check_in_time, check_out_time, updated_by, created_at, last_updated
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        accommodationData.name,
        accommodationData.type,
        accommodationData.location,
        accommodationData.capacity,
        accommodationData.description || null,
        JSON.stringify(accommodationData.amenities),
        accommodationData.precioTemporadaBaja,
        accommodationData.precioTemporadaAlta,
        accommodationData.precioDiasAsueto,
        JSON.stringify(accommodationData.images),
        accommodationData.available ? 1 : 0,
        accommodationData.viewType || null,
        accommodationData.featured ? 1 : 0,
        accommodationData.maxGuests || null,
        accommodationData.minNights,
        accommodationData.maxNights,
        accommodationData.checkInTime,
        accommodationData.checkOutTime,
        accommodationData.updatedBy || null,
        now,
        now,
      ]
    );

    const created = await this.findById(id);
    if (!created) {
      throw new Error("Failed to create accommodation");
    }

    return created;
  }

  static async update(
    id: string,
    updates: Partial<Accommodation>,
    updatedBy?: string
  ): Promise<Accommodation | null> {
    const db = await getDatabase();
    const current = await this.findById(id);
    if (!current) {
      return null;
    }

    const setClause = [];
    const values = [];

    const allowedFields = [
      "name", "type", "location", "capacity", "description", "amenities",
      "precio_temporada_baja", "precio_temporada_alta", "precio_dias_asueto",
      "images", "available", "view_type", "featured", "max_guests", 
      "min_nights", "max_nights", "check_in_time", "check_out_time"
    ];

    Object.entries(updates).forEach(([key, value]) => {
      const dbKey = this.camelToSnake(key);
      if (allowedFields.includes(dbKey)) {
        setClause.push(`${dbKey} = ?`);
        if (key === "amenities" || key === "images") {
          values.push(JSON.stringify(value));
        } else if (key === "available" || key === "featured") {
          values.push(value ? 1 : 0);
        } else {
          values.push(value);
        }
      }
    });

    if (setClause.length === 0) {
      return current;
    }

    if (updatedBy) {
      setClause.push("updated_by = ?");
      values.push(updatedBy);
    }

    setClause.push("last_updated = CURRENT_TIMESTAMP");
    values.push(id);

    await db.run(
      `UPDATE accommodations SET ${setClause.join(", ")} WHERE id = ?`,
      values
    );

    // Si se actualizaron precios, crear historial
    if (
      updates.precioTemporadaBaja !== undefined ||
      updates.precioTemporadaAlta !== undefined ||
      updates.precioDiasAsueto !== undefined
    ) {
      await this.createPriceHistory(id, current, updates, updatedBy);
    }

    return this.findById(id);
  }

  static async updateAvailability(id: string, available: boolean): Promise<boolean> {
    const db = await getDatabase();
    const result = await db.run(
      "UPDATE accommodations SET available = ?, last_updated = CURRENT_TIMESTAMP WHERE id = ?",
      [available ? 1 : 0, id]
    );
    return result.changes > 0;
  }

  static async updatePrices(
    id: string,
    prices: {
      precioTemporadaBaja?: number;
      precioTemporadaAlta?: number;
      precioDiasAsueto?: number;
    },
    updatedBy?: string,
    reason?: string
  ): Promise<Accommodation | null> {
    const current = await this.findById(id);
    if (!current) {
      return null;
    }

    const updates: Partial<Accommodation> = {};
    if (prices.precioTemporadaBaja !== undefined) {
      updates.precioTemporadaBaja = prices.precioTemporadaBaja;
    }
    if (prices.precioTemporadaAlta !== undefined) {
      updates.precioTemporadaAlta = prices.precioTemporadaAlta;
    }
    if (prices.precioDiasAsueto !== undefined) {
      updates.precioDiasAsueto = prices.precioDiasAsueto;
    }

    const updated = await this.update(id, updates, updatedBy);
    
    if (updated) {
      await this.createPriceHistory(id, current, updates, updatedBy, reason);
    }

    return updated;
  }

  static async getPriceHistory(accommodationId: string): Promise<AccommodationPriceHistory[]> {
    const db = await getDatabase();
    const history = await db.all(
      "SELECT * FROM accommodation_price_history WHERE accommodation_id = ? ORDER BY changed_at DESC",
      [accommodationId]
    );
    return history.map((h) => this.mapDbToPriceHistory(h));
  }

  static async getStats(): Promise<{
    total: number;
    byLocation: Record<string, number>;
    byType: Record<string, number>;
    featured: number;
    available: number;
  }> {
    const db = await getDatabase();
    
    const [totalResult] = await db.all("SELECT COUNT(*) as total FROM accommodations");
    const [availableResult] = await db.all("SELECT COUNT(*) as available FROM accommodations WHERE available = 1");
    const [featuredResult] = await db.all("SELECT COUNT(*) as featured FROM accommodations WHERE featured = 1");
    
    const locationStats = await db.all("SELECT location, COUNT(*) as count FROM accommodations GROUP BY location");
    const typeStats = await db.all("SELECT type, COUNT(*) as count FROM accommodations GROUP BY type");

    const byLocation: Record<string, number> = {};
    locationStats.forEach((stat: any) => {
      byLocation[stat.location] = stat.count;
    });

    const byType: Record<string, number> = {};
    typeStats.forEach((stat: any) => {
      byType[stat.type] = stat.count;
    });

    return {
      total: totalResult.total,
      byLocation,
      byType,
      featured: featuredResult.featured,
      available: availableResult.available,
    };
  }

  private static async createPriceHistory(
    accommodationId: string,
    oldData: Accommodation,
    newData: Partial<Accommodation>,
    changedBy?: string,
    reason?: string
  ): Promise<void> {
    const db = await getDatabase();
    await db.run(
      `INSERT INTO accommodation_price_history (
        accommodation_id, precio_temporada_baja_old, precio_temporada_alta_old, precio_dias_asueto_old,
        precio_temporada_baja_new, precio_temporada_alta_new, precio_dias_asueto_new,
        changed_by, change_reason
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        accommodationId,
        oldData.precioTemporadaBaja,
        oldData.precioTemporadaAlta,
        oldData.precioDiasAsueto,
        newData.precioTemporadaBaja ?? oldData.precioTemporadaBaja,
        newData.precioTemporadaAlta ?? oldData.precioTemporadaAlta,
        newData.precioDiasAsueto ?? oldData.precioDiasAsueto,
        changedBy || null,
        reason || "Actualización de precios",
      ]
    );
  }

  private static mapDbToAccommodation(dbAccommodation: any): Accommodation {
    return {
      id: dbAccommodation.id,
      name: dbAccommodation.name,
      type: dbAccommodation.type,
      location: dbAccommodation.location,
      capacity: dbAccommodation.capacity,
      description: dbAccommodation.description,
      amenities: dbAccommodation.amenities ? JSON.parse(dbAccommodation.amenities) : [],
      precioTemporadaBaja: parseFloat(dbAccommodation.precio_temporada_baja),
      precioTemporadaAlta: parseFloat(dbAccommodation.precio_temporada_alta),
      precioDiasAsueto: parseFloat(dbAccommodation.precio_dias_asueto),
      images: dbAccommodation.images ? JSON.parse(dbAccommodation.images) : [],
      available: Boolean(dbAccommodation.available),
      viewType: dbAccommodation.view_type,
      featured: Boolean(dbAccommodation.featured),
      maxGuests: dbAccommodation.max_guests,
      minNights: dbAccommodation.min_nights || 1,
      maxNights: dbAccommodation.max_nights || 7,
      checkInTime: dbAccommodation.check_in_time || "15:00:00",
      checkOutTime: dbAccommodation.check_out_time || "11:00:00",
      lastUpdated: new Date(dbAccommodation.last_updated),
      updatedBy: dbAccommodation.updated_by,
      createdAt: new Date(dbAccommodation.created_at),
    };
  }

  private static mapDbToPriceHistory(dbHistory: any): AccommodationPriceHistory {
    return {
      id: dbHistory.id,
      accommodationId: dbHistory.accommodation_id,
      precioTemporadaBajaOld: dbHistory.precio_temporada_baja_old ? parseFloat(dbHistory.precio_temporada_baja_old) : undefined,
      precioTemporadaAltaOld: dbHistory.precio_temporada_alta_old ? parseFloat(dbHistory.precio_temporada_alta_old) : undefined,
      precioDiasAsuetoOld: dbHistory.precio_dias_asueto_old ? parseFloat(dbHistory.precio_dias_asueto_old) : undefined,
      precioTemporadaBajaNew: dbHistory.precio_temporada_baja_new ? parseFloat(dbHistory.precio_temporada_baja_new) : undefined,
      precioTemporadaAltaNew: dbHistory.precio_temporada_alta_new ? parseFloat(dbHistory.precio_temporada_alta_new) : undefined,
      precioDiasAsuetoNew: dbHistory.precio_dias_asueto_new ? parseFloat(dbHistory.precio_dias_asueto_new) : undefined,
      changedBy: dbHistory.changed_by,
      changeReason: dbHistory.change_reason,
      changedAt: new Date(dbHistory.changed_at),
    };
  }

  private static camelToSnake(str: string): string {
    return str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
  }
}
