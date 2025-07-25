// Sistema de gestión de precios y fechas para reservaciones - Versión Mejorada
// Integrado con base de datos MySQL y sistema de temporadas

import { HolidayModel } from "../server/database/models/Holiday";
import { AccommodationModel } from "../server/database/models/Accommodation";

export interface PricingRates {
  temporadaBaja: number; // Lunes a Jueves
  temporadaAlta: number; // Viernes a Domingo
  diasAsueto: number; // Días feriados/asuetos
}

export interface DateRange {
  checkIn: Date;
  checkOut: Date;
}

export interface PriceCalculation {
  totalDays: number;
  nightsTemporadaBaja: number;
  nightsTemporadaAlta: number;
  nightsDiasAsueto: number;
  subtotalTemporadaBaja: number;
  subtotalTemporadaAlta: number;
  subtotalDiasAsueto: number;
  totalBeforeTaxes: number;
  taxes: number;
  totalPrice: number;
  breakdown: Array<{
    date: Date;
    dayType: "temporada_baja" | "temporada_alta" | "dias_asueto";
    price: number;
    isHoliday: boolean;
    holidayName?: string;
  }>;
}

export interface SeasonTypeInfo {
  type: "temporada_baja" | "temporada_alta" | "dias_asueto";
  name: string;
  description: string;
  multiplier: number;
}

// Configuración de temporadas
export const SEASON_INFO: Record<string, SeasonTypeInfo> = {
  temporada_baja: {
    type: "temporada_baja",
    name: "Temporada Baja",
    description: "Lunes a Jueves - Precios regulares",
    multiplier: 1.0,
  },
  temporada_alta: {
    type: "temporada_alta", 
    name: "Temporada Alta",
    description: "Viernes a Domingo - Precios elevados",
    multiplier: 1.8,
  },
  dias_asueto: {
    type: "dias_asueto",
    name: "Días de Asueto",
    description: "Días feriados y fechas especiales",
    multiplier: 2.2,
  },
};

// Función para obtener el mínimo día seleccionable (mañana)
export const getMinimumDate = (): string => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return tomorrow.toISOString().split("T")[0];
};

// Función mejorada para determinar el tipo de día usando la base de datos
export const getDayType = async (date: Date): Promise<"temporada_baja" | "temporada_alta" | "dias_asueto"> => {
  try {
    // Verificar primero si es día feriado en la base de datos
    const holiday = await HolidayModel.findByDate(date);
    if (holiday && holiday.isActive) {
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
  } catch (error) {
    console.warn("Error checking holiday status, falling back to day-of-week logic:", error);
    
    // Fallback a lógica simple por día de semana
    const dayOfWeek = date.getDay();
    if (dayOfWeek === 0 || dayOfWeek === 5 || dayOfWeek === 6) {
      return "temporada_alta";
    }
    return "temporada_baja";
  }
};

// Función mejorada para calcular el precio total de una estadía
export const calculateStayPrice = async (
  checkIn: Date,
  checkOut: Date,
  rates: PricingRates,
  taxRate: number = 0.13 // IVA de El Salvador
): Promise<PriceCalculation> => {
  const breakdown: PriceCalculation["breakdown"] = [];

  let nightsTemporadaBaja = 0;
  let nightsTemporadaAlta = 0;
  let nightsDiasAsueto = 0;

  let subtotalTemporadaBaja = 0;
  let subtotalTemporadaAlta = 0;
  let subtotalDiasAsueto = 0;

  // Obtener feriados en el rango de fechas para optimizar consultas
  const holidays = await HolidayModel.findByDateRange(checkIn, checkOut);
  const holidayMap = new Map();
  holidays.forEach(holiday => {
    if (holiday.isActive) {
      holidayMap.set(holiday.date.toISOString().split('T')[0], holiday);
    }
  });

  // Iterar sobre cada día de la estadía (excluyendo el día de checkout)
  const currentDate = new Date(checkIn);
  while (currentDate < checkOut) {
    const dateString = currentDate.toISOString().split('T')[0];
    const holiday = holidayMap.get(dateString);
    
    let dayType: "temporada_baja" | "temporada_alta" | "dias_asueto";
    let price = 0;
    let isHoliday = false;
    let holidayName: string | undefined;

    if (holiday) {
      // Es día feriado
      dayType = holiday.seasonType;
      isHoliday = true;
      holidayName = holiday.name;
      price = rates.diasAsueto;
      nightsDiasAsueto++;
      subtotalDiasAsueto += price;
    } else {
      // Determinar por día de la semana
      const dayOfWeek = currentDate.getDay();
      
      if (dayOfWeek === 0 || dayOfWeek === 5 || dayOfWeek === 6) {
        // Fin de semana
        dayType = "temporada_alta";
        price = rates.temporadaAlta;
        nightsTemporadaAlta++;
        subtotalTemporadaAlta += price;
      } else {
        // Día de semana
        dayType = "temporada_baja";
        price = rates.temporadaBaja;
        nightsTemporadaBaja++;
        subtotalTemporadaBaja += price;
      }
    }

    breakdown.push({
      date: new Date(currentDate),
      dayType,
      price,
      isHoliday,
      holidayName,
    });

    currentDate.setDate(currentDate.getDate() + 1);
  }

  const totalDays = nightsTemporadaBaja + nightsTemporadaAlta + nightsDiasAsueto;
  const totalBeforeTaxes = subtotalTemporadaBaja + subtotalTemporadaAlta + subtotalDiasAsueto;
  const taxes = totalBeforeTaxes * taxRate;
  const totalPrice = totalBeforeTaxes + taxes;

  return {
    totalDays,
    nightsTemporadaBaja,
    nightsTemporadaAlta,
    nightsDiasAsueto,
    subtotalTemporadaBaja,
    subtotalTemporadaAlta,
    subtotalDiasAsueto,
    totalBeforeTaxes,
    taxes,
    totalPrice,
    breakdown,
  };
};

// Función para validar fechas de reserva
export const validateReservationDates = (
  checkIn: string,
  checkOut: string,
): { valid: boolean; error?: string } => {
  // Create dates in local timezone to avoid timezone shift issues
  const checkInParts = checkIn.split("-");
  const checkOutParts = checkOut.split("-");

  const checkInDate = new Date(
    parseInt(checkInParts[0]),
    parseInt(checkInParts[1]) - 1,
    parseInt(checkInParts[2]),
  );

  const checkOutDate = new Date(
    parseInt(checkOutParts[0]),
    parseInt(checkOutParts[1]) - 1,
    parseInt(checkOutParts[2]),
  );

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);

  // Verificar que check-in sea al menos mañana
  if (checkInDate < tomorrow) {
    return {
      valid: false,
      error: "La fecha de entrada debe ser al menos mañana",
    };
  }

  // Verificar que check-out sea después de check-in
  if (checkOutDate <= checkInDate) {
    return {
      valid: false,
      error: "La fecha de salida debe ser posterior a la fecha de entrada",
    };
  }

  // Verificar que la estadía no sea más de 7 días
  const diffTime = checkOutDate.getTime() - checkInDate.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays > 7) {
    return {
      valid: false,
      error: "La estadía no puede exceder 7 días consecutivos",
    };
  }

  return { valid: true };
};

// Función para obtener las tarifas de un alojamiento desde la base de datos
export const getAccommodationRates = async (
  accommodationId: string,
): Promise<PricingRates | null> => {
  try {
    const accommodation = await AccommodationModel.findById(accommodationId);
    
    if (!accommodation) {
      console.warn(`⚠️ No accommodation found with ID: ${accommodationId}`);
      return null;
    }

    return {
      temporadaBaja: accommodation.precioTemporadaBaja,
      temporadaAlta: accommodation.precioTemporadaAlta,
      diasAsueto: accommodation.precioDiasAsueto,
    };
  } catch (error) {
    console.error(`❌ Error fetching accommodation rates for ${accommodationId}:`, error);
    return null;
  }
};

// Función para calcular precio de reserva completa
export const calculateReservationPrice = async (
  accommodationId: string,
  checkIn: Date,
  checkOut: Date,
  taxRate: number = 0.13
): Promise<PriceCalculation | null> => {
  const rates = await getAccommodationRates(accommodationId);
  
  if (!rates) {
    return null;
  }

  return calculateStayPrice(checkIn, checkOut, rates, taxRate);
};

// Función para formatear fechas en español
export const formatDateSpanish = (date: Date): string => {
  const options: Intl.DateTimeFormatOptions = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };

  return date.toLocaleDateString("es-ES", options);
};

// Función para formatear precios en dólares
export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
};

// Función para generar el próximo día disponible de check-out
export const getNextAvailableCheckOut = (checkIn: string): string => {
  const checkInDate = new Date(checkIn);
  const checkOutDate = new Date(checkInDate);
  checkOutDate.setDate(checkOutDate.getDate() + 1);
  return checkOutDate.toISOString().split("T")[0];
};

// Función para obtener información detallada de una temporada
export const getSeasonInfo = (seasonType: "temporada_baja" | "temporada_alta" | "dias_asueto"): SeasonTypeInfo => {
  return SEASON_INFO[seasonType];
};

// Función para obtener estadísticas de precios por temporada
export const getPricingStatistics = async (
  accommodationId: string,
  startDate: Date,
  endDate: Date
): Promise<{
  seasonBreakdown: Record<string, { nights: number; revenue: number; averagePrice: number }>;
  totalRevenue: number;
  totalNights: number;
  averagePricePerNight: number;
} | null> => {
  const rates = await getAccommodationRates(accommodationId);
  if (!rates) {
    return null;
  }

  const calculation = await calculateStayPrice(startDate, endDate, rates);
  
  return {
    seasonBreakdown: {
      temporada_baja: {
        nights: calculation.nightsTemporadaBaja,
        revenue: calculation.subtotalTemporadaBaja,
        averagePrice: calculation.nightsTemporadaBaja > 0 ? calculation.subtotalTemporadaBaja / calculation.nightsTemporadaBaja : 0,
      },
      temporada_alta: {
        nights: calculation.nightsTemporadaAlta,
        revenue: calculation.subtotalTemporadaAlta,
        averagePrice: calculation.nightsTemporadaAlta > 0 ? calculation.subtotalTemporadaAlta / calculation.nightsTemporadaAlta : 0,
      },
      dias_asueto: {
        nights: calculation.nightsDiasAsueto,
        revenue: calculation.subtotalDiasAsueto,
        averagePrice: calculation.nightsDiasAsueto > 0 ? calculation.subtotalDiasAsueto / calculation.nightsDiasAsueto : 0,
      },
    },
    totalRevenue: calculation.totalBeforeTaxes,
    totalNights: calculation.totalDays,
    averagePricePerNight: calculation.totalDays > 0 ? calculation.totalBeforeTaxes / calculation.totalDays : 0,
  };
};

// Función para verificar disponibilidad de fechas
export const checkAvailability = async (
  accommodationId: string,
  checkIn: Date,
  checkOut: Date
): Promise<boolean> => {
  try {
    const { ReservationModel } = await import("../server/database/models/Reservation");
    return await ReservationModel.checkAvailability(accommodationId, checkIn, checkOut);
  } catch (error) {
    console.error("Error checking availability:", error);
    return false;
  }
};

// Exportar funciones legacy para compatibilidad hacia atrás
export const accommodationRates = {
  // Esta función ahora es deprecated, usar getAccommodationRates en su lugar
  deprecated_getAccommodationRates: async (accommodationId: string) => {
    console.warn("⚠️ Using deprecated accommodationRates. Use getAccommodationRates() instead.");
    return getAccommodationRates(accommodationId);
  }
};
