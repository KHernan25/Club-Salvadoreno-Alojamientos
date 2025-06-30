// Sistema de gestión de precios y fechas para reservaciones

export interface PricingRates {
  weekday: number; // Lunes a Jueves
  weekend: number; // Viernes a Domingo
  holiday: number; // Días feriados/asuetos
}

export interface DateRange {
  checkIn: Date;
  checkOut: Date;
}

export interface PriceCalculation {
  totalDays: number;
  weekdayDays: number;
  weekendDays: number;
  holidayDays: number;
  weekdayTotal: number;
  weekendTotal: number;
  holidayTotal: number;
  totalPrice: number;
  breakdown: Array<{
    date: Date;
    dayType: "weekday" | "weekend" | "holiday";
    price: number;
  }>;
}

// Días feriados de El Salvador 2025-2026
export const holidays2025: string[] = [
  "2025-01-01", // Año Nuevo
  "2025-03-28", // Jueves Santo
  "2025-03-29", // Viernes Santo
  "2025-03-30", // Sábado Santo
  "2025-05-01", // Día del Trabajo
  "2025-05-10", // Día de la Madre
  "2025-06-17", // Día del Padre
  "2025-08-06", // Día del Salvador del Mundo (patronales)
  "2025-09-15", // Día de la Independencia
  "2025-11-02", // Día de los Difuntos
  "2025-12-25", // Navidad
];

export const holidays2026: string[] = [
  "2026-01-01", // Año Nuevo
  "2026-04-17", // Jueves Santo
  "2026-04-18", // Viernes Santo
  "2026-04-19", // Sábado Santo
  "2026-05-01", // Día del Trabajo
  "2026-05-10", // Día de la Madre
  "2026-06-17", // Día del Padre
  "2026-08-06", // Día del Salvador del Mundo
  "2026-09-15", // Día de la Independencia
  "2026-11-02", // Día de los Difuntos
  "2026-12-25", // Navidad
];

const allHolidays = [...holidays2025, ...holidays2026];

// Función para obtener el mínimo día seleccionable (mañana)
export const getMinimumDate = (): string => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return tomorrow.toISOString().split("T")[0];
};

// Función para verificar si una fecha es feriado
export const isHoliday = (date: Date): boolean => {
  const dateString = date.toISOString().split("T")[0];
  return allHolidays.includes(dateString);
};

// Función para determinar el tipo de día
export const getDayType = (date: Date): "weekday" | "weekend" | "holiday" => {
  if (isHoliday(date)) {
    return "holiday";
  }

  const dayOfWeek = date.getDay(); // 0 = Domingo, 6 = Sábado

  // Debug logging
  console.log(
    `getDayType - Date: ${date.toISOString()}, Day of week: ${dayOfWeek}, Date string: ${date.toString()}`,
  );

  // Solo Sábado (6) y Domingo (0) son fin de semana
  if (dayOfWeek === 0 || dayOfWeek === 6) {
    console.log(`Weekend detected for ${date.toISOString()}`);
    return "weekend";
  }

  // Lunes (1) a Viernes (5) son días de semana
  console.log(`Weekday detected for ${date.toISOString()}`);
  return "weekday";
};

// Función para calcular el precio total de una estadía
export const calculateStayPrice = (
  checkIn: Date,
  checkOut: Date,
  rates: PricingRates,
): PriceCalculation => {
  const breakdown: PriceCalculation["breakdown"] = [];

  let weekdayDays = 0;
  let weekendDays = 0;
  let holidayDays = 0;

  let weekdayTotal = 0;
  let weekendTotal = 0;
  let holidayTotal = 0;

  // Iterar sobre cada día de la estadía
  const currentDate = new Date(checkIn);

  while (currentDate < checkOut) {
    const dayType = getDayType(currentDate);
    let price = 0;

    switch (dayType) {
      case "weekday":
        price = rates.weekday;
        weekdayDays++;
        weekdayTotal += price;
        break;
      case "weekend":
        price = rates.weekend;
        weekendDays++;
        weekendTotal += price;
        break;
      case "holiday":
        price = rates.holiday;
        holidayDays++;
        holidayTotal += price;
        break;
    }

    breakdown.push({
      date: new Date(currentDate),
      dayType,
      price,
    });

    currentDate.setDate(currentDate.getDate() + 1);
  }

  const totalDays = weekdayDays + weekendDays + holidayDays;
  const totalPrice = weekdayTotal + weekendTotal + holidayTotal;

  return {
    totalDays,
    weekdayDays,
    weekendDays,
    holidayDays,
    weekdayTotal,
    weekendTotal,
    holidayTotal,
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

// Precios completos para todos los alojamientos
export const accommodationRates: Record<string, PricingRates> = {
  // Apartamentos El Sunzal
  "1A": { weekday: 110, weekend: 230, holiday: 280 },
  "1B": { weekday: 95, weekend: 210, holiday: 250 },
  "2A": { weekday: 120, weekend: 250, holiday: 300 },
  "2B": { weekday: 115, weekend: 240, holiday: 290 },
  "3A": { weekday: 140, weekend: 280, holiday: 350 },
  "3B": { weekday: 135, weekend: 270, holiday: 340 },

  // Casas El Sunzal
  casa1: { weekday: 200, weekend: 350, holiday: 400 },
  casa2: { weekday: 280, weekend: 420, holiday: 480 },
  casa3: { weekday: 240, weekend: 380, holiday: 450 },

  // Suites El Sunzal
  suite1: { weekday: 300, weekend: 450, holiday: 500 },
  suite2: { weekday: 500, weekend: 750, holiday: 850 },
  suite3: { weekday: 800, weekend: 1200, holiday: 1500 },

  // Apartamentos Corinto
  corinto1A: { weekday: 100, weekend: 210, holiday: 260 },
  corinto1B: { weekday: 85, weekend: 190, holiday: 230 },
  corinto2A: { weekday: 110, weekend: 230, holiday: 280 },
  corinto2B: { weekday: 105, weekend: 220, holiday: 270 },
  corinto3A: { weekday: 130, weekend: 260, holiday: 320 },
  corinto3B: { weekday: 125, weekend: 250, holiday: 310 },

  // Casas Corinto
  "corinto-casa-1": { weekday: 280, weekend: 380, holiday: 420 },
  "corinto-casa-2": { weekday: 350, weekend: 450, holiday: 500 },
  "corinto-casa-3": { weekday: 220, weekend: 320, holiday: 370 },
  "corinto-casa-4": { weekday: 260, weekend: 360, holiday: 410 },
  "corinto-casa-5": { weekday: 300, weekend: 400, holiday: 450 },
  "corinto-casa-6": { weekday: 320, weekend: 420, holiday: 480 },
};

// Función para obtener las tarifas de un alojamiento
export const getAccommodationRates = (
  accommodationId: string,
): PricingRates | null => {
  const rates = accommodationRates[accommodationId];

  // Debug logging para El Sunzal
  if (accommodationId && accommodationId.toLowerCase().includes("sunzal")) {
    console.log(
      `🏖️ El Sunzal pricing lookup - ID: ${accommodationId}, Found: ${!!rates}`,
    );
  }

  if (!rates) {
    console.warn(`⚠️ No pricing found for accommodation: ${accommodationId}`);
    console.log(
      "Available accommodation IDs:",
      Object.keys(accommodationRates),
    );
  }

  return rates;
};
