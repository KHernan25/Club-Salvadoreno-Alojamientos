import { dbManager } from "../database/connection";
import { AccommodationModel } from "../database/models/Accommodation";
import { HolidayModel } from "../database/models/Holiday";
import { UserModel } from "../database/models/User";
import bcrypt from "bcryptjs";

interface InitializationResult {
  success: boolean;
  message: string;
  data?: {
    usersCreated: number;
    accommodationsCreated: number;
    holidaysCreated: number;
    tablesInitialized: string[];
  };
  error?: string;
}

export async function initializeCompleteDatabase(): Promise<InitializationResult> {
  try {
    console.log("🚀 Iniciando inicialización completa de la base de datos...");

    // 1. Conectar a la base de datos
    await dbManager.connect();
    console.log("✅ Conexión a base de datos establecida");

    // 2. Inicializar schema (crear tablas)
    await dbManager.initialize();
    console.log("✅ Schema de base de datos inicializado");

    // 3. Crear usuarios administrativos
    const usersCreated = await createAdminUsers();
    console.log(`✅ ${usersCreated} usuarios administrativos creados`);

    // 4. Insertar alojamientos con precios por temporada
    const accommodationsCreated = await createAccommodations();
    console.log(`✅ ${accommodationsCreated} alojamientos creados`);

    // 5. Insertar días feriados
    const holidaysCreated = await createHolidays();
    console.log(`✅ ${holidaysCreated} días feriados creados`);

    console.log("🎉 Inicialización completa exitosa!");

    return {
      success: true,
      message: "Base de datos inicializada exitosamente con datos completos",
      data: {
        usersCreated,
        accommodationsCreated,
        holidaysCreated,
        tablesInitialized: [
          "users", "accommodations", "holidays", "reservations",
          "reviews", "conversations", "messages", "activity_logs",
          "notifications", "system_config"
        ],
      },
    };

  } catch (error) {
    console.error("❌ Error durante la inicialización:", error);
    return {
      success: false,
      message: "Error durante la inicialización de la base de datos",
      error: error instanceof Error ? error.message : "Error desconocido",
    };
  }
}

async function createAdminUsers(): Promise<number> {
  const saltRounds = 12;
  const hashedPassword = await bcrypt.hash("admin123", saltRounds);
  
  const adminUsers = [
    {
      id: "admin-001",
      firstName: "Super",
      lastName: "Administrador",
      username: "admin",
      password: hashedPassword,
      email: "admin@clubsalvadoreno.com",
      phone: "+503-2345-6789",
      role: "super_admin" as const,
      isActive: true,
      status: "approved" as const,
      memberStatus: "activo" as const,
      membershipType: "Fundador" as const,
    },
    {
      id: "user-001",
      firstName: "Gabriel",
      lastName: "Hernández",
      username: "ghernandez",
      password: hashedPassword,
      email: "ghernandez@clubsalvadoreno.com",
      phone: "+503-2345-6790",
      role: "atencion_miembro" as const,
      isActive: true,
      status: "approved" as const,
      memberStatus: "activo" as const,
      membershipType: "Contribuyente" as const,
    },
    {
      id: "user-002",
      firstName: "María",
      lastName: "García",
      username: "mgarcia",
      password: hashedPassword,
      email: "mgarcia@clubsalvadoreno.com",
      phone: "+503-2345-6791",
      role: "anfitrion" as const,
      isActive: true,
      status: "approved" as const,
      memberStatus: "activo" as const,
      membershipType: "Visitador Especial" as const,
    },
    {
      id: "user-003",
      firstName: "Carlos",
      lastName: "Rodríguez",
      username: "crodriguez",
      password: hashedPassword,
      email: "crodriguez@clubsalvadoreno.com",
      phone: "+503-2345-6792",
      role: "miembro" as const,
      isActive: true,
      status: "approved" as const,
      memberStatus: "activo" as const,
      membershipType: "Visitador Juvenil" as const,
    },
  ];

  let created = 0;
  for (const userData of adminUsers) {
    try {
      // Verificar si el usuario ya existe
      const existing = await UserModel.findByEmail(userData.email);
      if (!existing) {
        await UserModel.create(userData);
        created++;
      }
    } catch (error) {
      console.warn(`⚠️ Error creando usuario ${userData.username}:`, error);
    }
  }

  return created;
}

async function createAccommodations(): Promise<number> {
  const accommodations = [
    // APARTAMENTOS EL SUNZAL
    {
      id: "sunzal-apt-1A",
      name: "Apartamento 1A",
      type: "apartamento" as const,
      location: "el-sunzal" as const,
      capacity: 2,
      description: "Apartamento cómodo con vista directa al mar, perfecto para parejas.",
      amenities: ["Wi-Fi", "Aire acondicionado", "TV", "Kitchenette", "Vista al mar"],
      precioTemporadaBaja: 110.00,
      precioTemporadaAlta: 230.00,
      precioDiasAsueto: 280.00,
      images: ["/images/apartamentos/1a-main.jpg", "/images/apartamentos/1a-bedroom.jpg"],
      available: true,
      viewType: "Vista al mar",
      featured: false,
      maxGuests: 2,
      minNights: 1,
      maxNights: 7,
      checkInTime: "15:00:00",
      checkOutTime: "11:00:00",
    },
    {
      id: "sunzal-apt-1B",
      name: "Apartamento 1B",
      type: "apartamento" as const,
      location: "el-sunzal" as const,
      capacity: 2,
      description: "Apartamento acogedor con vista parcial al mar.",
      amenities: ["Wi-Fi", "Aire acondicionado", "TV", "Kitchenette"],
      precioTemporadaBaja: 95.00,
      precioTemporadaAlta: 210.00,
      precioDiasAsueto: 250.00,
      images: ["/images/apartamentos/1b-main.jpg", "/images/apartamentos/1b-living.jpg"],
      available: true,
      viewType: "Vista parcial",
      featured: false,
      maxGuests: 2,
      minNights: 1,
      maxNights: 7,
      checkInTime: "15:00:00",
      checkOutTime: "11:00:00",
    },
    // CASAS EL SUNZAL
    {
      id: "sunzal-casa-surf-paradise",
      name: "Casa Surf Paradise",
      type: "casa" as const,
      location: "el-sunzal" as const,
      capacity: 6,
      description: "Casa diseñada especialmente para surfistas con acceso directo al break.",
      amenities: ["Wi-Fi", "Aire acondicionado", "Cocina completa", "Terraza", "Almacenamiento tablas", "Ducha exterior"],
      precioTemporadaBaja: 200.00,
      precioTemporadaAlta: 350.00,
      precioDiasAsueto: 400.00,
      images: ["/images/casas/surf-paradise-main.jpg", "/images/casas/surf-paradise-exterior.jpg"],
      available: true,
      viewType: "Frente al mar",
      featured: true,
      maxGuests: 6,
      minNights: 1,
      maxNights: 7,
      checkInTime: "15:00:00",
      checkOutTime: "11:00:00",
    },
    // SUITES EL SUNZAL
    {
      id: "sunzal-suite-ejecutiva",
      name: "Suite Ejecutiva Presidencial",
      type: "suite" as const,
      location: "el-sunzal" as const,
      capacity: 2,
      description: "Suite de máximo lujo con servicios premium.",
      amenities: ["Wi-Fi", "Aire acondicionado", "TV Premium", "Minibar", "Room service", "Jacuzzi", "Balcón privado"],
      precioTemporadaBaja: 650.00,
      precioTemporadaAlta: 850.00,
      precioDiasAsueto: 950.00,
      images: ["/images/suites/ejecutiva-main.jpg"],
      available: true,
      viewType: "Premium",
      featured: true,
      maxGuests: 2,
      minNights: 1,
      maxNights: 7,
      checkInTime: "15:00:00",
      checkOutTime: "11:00:00",
    },
    // CASAS CORINTO
    {
      id: "corinto-casa-lago",
      name: "Casa del Lago",
      type: "casa" as const,
      location: "corinto" as const,
      capacity: 6,
      description: "Casa con vista directa al lago y jardín privado.",
      amenities: ["Wi-Fi", "Aire acondicionado", "Cocina completa", "Jardín privado", "Vista lago", "BBQ"],
      precioTemporadaBaja: 280.00,
      precioTemporadaAlta: 380.00,
      precioDiasAsueto: 420.00,
      images: ["/images/corinto/casa-lago-main.jpg"],
      available: true,
      viewType: "Vista lago",
      featured: true,
      maxGuests: 6,
      minNights: 1,
      maxNights: 7,
      checkInTime: "15:00:00",
      checkOutTime: "11:00:00",
    },
  ];

  let created = 0;
  for (const accommodationData of accommodations) {
    try {
      // Verificar si el alojamiento ya existe
      const existing = await AccommodationModel.findById(accommodationData.id);
      if (!existing) {
        await AccommodationModel.create(accommodationData);
        created++;
      }
    } catch (error) {
      console.warn(`⚠️ Error creando alojamiento ${accommodationData.name}:`, error);
    }
  }

  return created;
}

async function createHolidays(): Promise<number> {
  const holidays = [
    // 2025
    { date: new Date("2025-01-01"), name: "Año Nuevo", description: "Celebración del Año Nuevo", seasonType: "dias_asueto" as const, isActive: true },
    { date: new Date("2025-03-28"), name: "Jueves Santo", description: "Semana Santa", seasonType: "dias_asueto" as const, isActive: true },
    { date: new Date("2025-03-29"), name: "Viernes Santo", description: "Semana Santa", seasonType: "dias_asueto" as const, isActive: true },
    { date: new Date("2025-03-30"), name: "Sábado Santo", description: "Semana Santa", seasonType: "dias_asueto" as const, isActive: true },
    { date: new Date("2025-05-01"), name: "Día del Trabajo", description: "Día Internacional del Trabajador", seasonType: "dias_asueto" as const, isActive: true },
    { date: new Date("2025-05-10"), name: "Día de la Madre", description: "Celebración del Día de la Madre", seasonType: "dias_asueto" as const, isActive: true },
    { date: new Date("2025-06-17"), name: "Día del Padre", description: "Celebración del Día del Padre", seasonType: "dias_asueto" as const, isActive: true },
    { date: new Date("2025-08-06"), name: "Día del Salvador del Mundo", description: "Festividades Patronales de San Salvador", seasonType: "dias_asueto" as const, isActive: true },
    { date: new Date("2025-09-15"), name: "Día de la Independencia", description: "Independencia de El Salvador", seasonType: "dias_asueto" as const, isActive: true },
    { date: new Date("2025-11-02"), name: "Día de los Difuntos", description: "Día de los Fieles Difuntos", seasonType: "dias_asueto" as const, isActive: true },
    { date: new Date("2025-12-25"), name: "Navidad", description: "Celebración de la Navidad", seasonType: "dias_asueto" as const, isActive: true },

    // 2026
    { date: new Date("2026-01-01"), name: "Año Nuevo", description: "Celebración del Año Nuevo", seasonType: "dias_asueto" as const, isActive: true },
    { date: new Date("2026-04-17"), name: "Jueves Santo", description: "Semana Santa", seasonType: "dias_asueto" as const, isActive: true },
    { date: new Date("2026-04-18"), name: "Viernes Santo", description: "Semana Santa", seasonType: "dias_asueto" as const, isActive: true },
    { date: new Date("2026-04-19"), name: "Sábado Santo", description: "Semana Santa", seasonType: "dias_asueto" as const, isActive: true },
    { date: new Date("2026-05-01"), name: "Día del Trabajo", description: "Día Internacional del Trabajador", seasonType: "dias_asueto" as const, isActive: true },
    { date: new Date("2026-05-10"), name: "Día de la Madre", description: "Celebración del Día de la Madre", seasonType: "dias_asueto" as const, isActive: true },
    { date: new Date("2026-06-17"), name: "Día del Padre", description: "Celebración del Día del Padre", seasonType: "dias_asueto" as const, isActive: true },
    { date: new Date("2026-08-06"), name: "Día del Salvador del Mundo", description: "Festividades Patronales de San Salvador", seasonType: "dias_asueto" as const, isActive: true },
    { date: new Date("2026-09-15"), name: "Día de la Independencia", description: "Independencia de El Salvador", seasonType: "dias_asueto" as const, isActive: true },
    { date: new Date("2026-11-02"), name: "Día de los Difuntos", description: "Día de los Fieles Difuntos", seasonType: "dias_asueto" as const, isActive: true },
    { date: new Date("2026-12-25"), name: "Navidad", description: "Celebración de la Navidad", seasonType: "dias_asueto" as const, isActive: true },
  ];

  let created = 0;
  for (const holidayData of holidays) {
    try {
      // Verificar si el feriado ya existe
      const existing = await HolidayModel.findByDate(holidayData.date);
      if (!existing) {
        await HolidayModel.create(holidayData);
        created++;
      }
    } catch (error) {
      console.warn(`⚠️ Error creando feriado ${holidayData.name}:`, error);
    }
  }

  return created;
}

// Función para ejecutar desde línea de comandos
if (require.main === module) {
  initializeCompleteDatabase()
    .then((result) => {
      if (result.success) {
        console.log("✅", result.message);
        if (result.data) {
          console.log("📊 Datos creados:", result.data);
        }
        process.exit(0);
      } else {
        console.error("❌", result.message);
        if (result.error) {
          console.error("Error:", result.error);
        }
        process.exit(1);
      }
    })
    .catch((error) => {
      console.error("💥 Error crítico:", error);
      process.exit(1);
    });
}
