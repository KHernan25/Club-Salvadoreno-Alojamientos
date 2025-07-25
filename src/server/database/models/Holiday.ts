import { getDatabase } from "../connection";

export interface Holiday {
  id: number;
  date: Date;
  name: string;
  description?: string;
  year: number;
  seasonType: "temporada_baja" | "temporada_alta" | "dias_asueto";
  isActive: boolean;
}

export class HolidayModel {
  static async findAll(): Promise<Holiday[]> {
    const db = await getDatabase();
    const holidays = await db.all(
      "SELECT * FROM holidays WHERE is_active = 1 ORDER BY date ASC"
    );
    return holidays.map((holiday) => this.mapDbToHoliday(holiday));
  }

  static async findByYear(year: number): Promise<Holiday[]> {
    const db = await getDatabase();
    const holidays = await db.all(
      "SELECT * FROM holidays WHERE year = ? AND is_active = 1 ORDER BY date ASC",
      [year]
    );
    return holidays.map((holiday) => this.mapDbToHoliday(holiday));
  }

  static async findByDateRange(startDate: Date, endDate: Date): Promise<Holiday[]> {
    const db = await getDatabase();
    const holidays = await db.all(
      "SELECT * FROM holidays WHERE date >= ? AND date <= ? AND is_active = 1 ORDER BY date ASC",
      [startDate.toISOString().split('T')[0], endDate.toISOString().split('T')[0]]
    );
    return holidays.map((holiday) => this.mapDbToHoliday(holiday));
  }

  static async findByDate(date: Date): Promise<Holiday | null> {
    const db = await getDatabase();
    const holiday = await db.get(
      "SELECT * FROM holidays WHERE date = ? AND is_active = 1",
      [date.toISOString().split('T')[0]]
    );
    return holiday ? this.mapDbToHoliday(holiday) : null;
  }

  static async isHoliday(date: Date): Promise<boolean> {
    const holiday = await this.findByDate(date);
    return holiday !== null;
  }

  static async getSeasonType(date: Date): Promise<"temporada_baja" | "temporada_alta" | "dias_asueto"> {
    // Primero verificar si es día feriado
    const holiday = await this.findByDate(date);
    if (holiday) {
      return holiday.seasonType;
    }

    // Si no es feriado, determinar por día de la semana
    const dayOfWeek = date.getDay(); // 0 = Domingo, 6 = Sábado
    
    // Viernes (5), Sábado (6) y Domingo (0) son temporada alta
    if (dayOfWeek === 0 || dayOfWeek === 5 || dayOfWeek === 6) {
      return "temporada_alta";
    }
    
    // Lunes (1) a Jueves (4) son temporada baja
    return "temporada_baja";
  }

  static async create(holidayData: Omit<Holiday, "id">): Promise<Holiday> {
    const db = await getDatabase();
    
    const result = await db.run(
      `INSERT INTO holidays (date, name, description, season_type, is_active) 
       VALUES (?, ?, ?, ?, ?)`,
      [
        holidayData.date.toISOString().split('T')[0],
        holidayData.name,
        holidayData.description || null,
        holidayData.seasonType,
        holidayData.isActive ? 1 : 0,
      ]
    );

    const created = await db.get(
      "SELECT * FROM holidays WHERE id = ?",
      [result.lastID]
    );

    if (!created) {
      throw new Error("Failed to create holiday");
    }

    return this.mapDbToHoliday(created);
  }

  static async update(id: number, updates: Partial<Holiday>): Promise<Holiday | null> {
    const db = await getDatabase();

    const setClause = [];
    const values = [];

    const allowedFields = ["name", "description", "season_type", "is_active"];

    Object.entries(updates).forEach(([key, value]) => {
      const dbKey = this.camelToSnake(key);
      if (allowedFields.includes(dbKey)) {
        setClause.push(`${dbKey} = ?`);
        if (key === "isActive") {
          values.push(value ? 1 : 0);
        } else {
          values.push(value);
        }
      }
    });

    if (setClause.length === 0) {
      return this.findById(id);
    }

    values.push(id);

    await db.run(
      `UPDATE holidays SET ${setClause.join(", ")} WHERE id = ?`,
      values
    );

    return this.findById(id);
  }

  static async findById(id: number): Promise<Holiday | null> {
    const db = await getDatabase();
    const holiday = await db.get("SELECT * FROM holidays WHERE id = ?", [id]);
    return holiday ? this.mapDbToHoliday(holiday) : null;
  }

  static async delete(id: number): Promise<boolean> {
    const db = await getDatabase();
    const result = await db.run("DELETE FROM holidays WHERE id = ?", [id]);
    return result.changes > 0;
  }

  static async toggleActive(id: number): Promise<Holiday | null> {
    const current = await this.findById(id);
    if (!current) {
      return null;
    }

    return this.update(id, { isActive: !current.isActive });
  }

  static async getUpcomingHolidays(daysAhead: number = 30): Promise<Holiday[]> {
    const today = new Date();
    const futureDate = new Date();
    futureDate.setDate(today.getDate() + daysAhead);

    return this.findByDateRange(today, futureDate);
  }

  static async getHolidaysBetweenDates(startDate: Date, endDate: Date): Promise<Holiday[]> {
    return this.findByDateRange(startDate, endDate);
  }

  static async countHolidayNights(checkIn: Date, checkOut: Date): Promise<number> {
    const holidays = await this.findByDateRange(checkIn, checkOut);
    
    // Contar solo las noches que caen en días feriados
    // (las noches se cuentan desde check-in hasta check-out - 1 día)
    let count = 0;
    const currentDate = new Date(checkIn);
    
    while (currentDate < checkOut) {
      const isHolidayNight = holidays.some(holiday => 
        holiday.date.toISOString().split('T')[0] === currentDate.toISOString().split('T')[0]
      );
      
      if (isHolidayNight) {
        count++;
      }
      
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    return count;
  }

  private static mapDbToHoliday(dbHoliday: any): Holiday {
    return {
      id: dbHoliday.id,
      date: new Date(dbHoliday.date),
      name: dbHoliday.name,
      description: dbHoliday.description,
      year: dbHoliday.year,
      seasonType: dbHoliday.season_type,
      isActive: Boolean(dbHoliday.is_active),
    };
  }

  private static camelToSnake(str: string): string {
    return str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
  }
}
