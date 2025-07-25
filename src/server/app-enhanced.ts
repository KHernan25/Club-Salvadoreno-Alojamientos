import express, { Application, Request, Response } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";

// Rutas existentes
import { authRoutes } from "./routes/auth";
import { userRoutes } from "./routes/users";
import { reservationRoutes } from "./routes/reservations";
import { reviewRoutes } from "./routes/reviews";
import { contactRoutes } from "./routes/contact";
import { notificationRoutes } from "./routes/notifications";
import { emailNotificationRoutes } from "./routes/email-notifications";
import registrationRequestsRouter from "./routes/registration-requests";
import activityLogRouter from "./routes/activity-log";

// Nuevas rutas mejoradas
import { accommodationRoutesEnhanced } from "./routes/accommodations-enhanced";
import { pricingRoutesEnhanced } from "./routes/pricing-enhanced";

import { errorHandler } from "./middleware/errorHandler";
import { config } from "../lib/config";

// Crear aplicación Express
const app: Application = express();

// Configure trust proxy securely
app.set("trust proxy", 1);

// Middleware de seguridad
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.maxRequests,
  message: {
    error: "Demasiadas solicitudes, intenta nuevamente en 15 minutos",
  },
});
app.use("/api/", limiter);

// Rate limiting más estricto para autenticación
const authLimiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.authMaxRequests,
  message: {
    error: "Demasiados intentos de autenticación, intenta nuevamente en 15 minutos",
  },
});
app.use("/api/auth/", authLimiter);

// CORS
app.use(
  cors({
    origin: config.server.frontendUrl,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

// Logging
app.use(morgan("combined"));

// Body parsing
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Health check
app.get("/health", (req: Request, res: Response) => {
  res.status(200).json({
    status: "OK",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: config.server.nodeEnv,
    database: config.database.type,
    version: "2.0.0-enhanced",
  });
});

// API base endpoint - información de la API mejorada
app.get("/api", (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "🏨 Club Salvadoreño API - Sistema Completo",
    version: "2.0.0",
    timestamp: new Date().toISOString(),
    environment: config.server.nodeEnv,
    database: {
      type: config.database.type,
      host: config.database.host || "localhost",
    },
    features: [
      "✅ Sistema de precios por temporada (Baja/Alta/Asueto)",
      "✅ Gestión completa de alojamientos",
      "✅ Sistema de reservas con cálculo automático",
      "✅ Calendario de días feriados de El Salvador",
      "✅ Sistema de reseñas y calificaciones",
      "✅ Mensajería huésped-anfitrión",
      "✅ Control de acceso y portería",
      "✅ Facturación de acompañantes",
      "✅ Sistema de notificaciones",
      "✅ Logs de actividad administrativa",
      "✅ Gestión de usuarios con múltiples roles",
    ],
    endpoints: {
      auth: {
        path: "/api/auth",
        methods: ["POST"],
        description: "Autenticación de usuarios",
        endpoints: [
          "POST /api/auth/login - Iniciar sesión",
          "POST /api/auth/register - Registrar usuario",
          "POST /api/auth/logout - Cerrar sesión",
          "POST /api/auth/refresh - Renovar token",
        ],
      },
      users: {
        path: "/api/users",
        methods: ["GET", "POST", "PUT", "DELETE"],
        description: "Gestión de usuarios con roles",
      },
      accommodations: {
        path: "/api/accommodations",
        methods: ["GET", "POST", "PUT"],
        description: "Gestión de alojamientos con precios por temporada",
        endpoints: [
          "GET /api/accommodations - Listar alojamientos",
          "GET /api/accommodations/featured - Alojamientos destacados",
          "GET /api/accommodations/stats - Estadísticas",
          "GET /api/accommodations/location/:location - Por ubicación",
          "GET /api/accommodations/:id - Obtener alojamiento",
          "GET /api/accommodations/:id/rates - Tarifas por temporada",
          "GET /api/accommodations/:id/price-history - Historial de precios",
          "POST /api/accommodations/:id/calculate-price - Calcular precio",
          "PUT /api/accommodations/:id/prices - Actualizar precios",
          "PUT /api/accommodations/:id/availability - Cambiar disponibilidad",
        ],
      },
      pricing: {
        path: "/api/pricing",
        methods: ["GET", "POST"],
        description: "Sistema de precios por temporada",
        endpoints: [
          "GET /api/pricing/seasons - Información de temporadas",
          "GET /api/pricing/holidays - Días feriados",
          "GET /api/pricing/holidays/upcoming - Próximos feriados",
          "POST /api/pricing/calculate - Calcular precio de estadía",
          "GET /api/pricing/rates/:id - Tarifas de alojamiento",
          "POST /api/pricing/check-availability - Verificar disponibilidad",
          "GET /api/pricing/day-type/:date - Tipo de día",
          "GET /api/pricing/statistics/:id - Estadísticas de precios",
        ],
      },
      reservations: {
        path: "/api/reservations",
        methods: ["GET", "POST", "PUT", "DELETE"],
        description: "Gestión de reservas con cálculo automático por temporada",
      },
      reviews: {
        path: "/api/reviews",
        methods: ["GET", "POST", "PUT", "DELETE"],
        description: "Sistema de reseñas de huéspedes",
      },
      contact: {
        path: "/api/contact",
        methods: ["POST"],
        description: "Formulario de contacto",
      },
      notifications: {
        path: "/api/notifications",
        methods: ["GET", "PATCH", "POST"],
        description: "Notificaciones del backoffice",
      },
      emailNotifications: {
        path: "/api/email-notifications",
        methods: ["POST", "GET"],
        description: "Envío de emails y SMS",
      },
      registrationRequests: {
        path: "/api/registration-requests",
        methods: ["GET", "POST"],
        description: "Gestión de solicitudes de registro",
      },
      activityLog: {
        path: "/api/activity-log",
        methods: ["GET", "POST", "DELETE"],
        description: "Bitácora de actividades diarias",
      },
    },
    seasonSystem: {
      temporadaBaja: {
        name: "Temporada Baja",
        days: "Lunes a Jueves",
        description: "Precios regulares para días de semana",
      },
      temporadaAlta: {
        name: "Temporada Alta", 
        days: "Viernes a Domingo",
        description: "Precios elevados para fines de semana",
      },
      diasAsueto: {
        name: "Días de Asueto",
        days: "Feriados oficiales",
        description: "Precios premium para días feriados",
      },
    },
    rateLimit: {
      general: "100 requests por 15 minutos",
      auth: "5 requests por 15 minutos",
    },
    docs: {
      authentication: "Usar Bearer token en header Authorization",
      contentType: "application/json",
      cors: "Habilitado para desarrollo",
      database: "MySQL con soporte para SQLite en desarrollo",
    },
  });
});

// API routes - usando rutas mejoradas donde esté disponible
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/accommodations", accommodationRoutesEnhanced); // Ruta mejorada
app.use("/api/pricing", pricingRoutesEnhanced); // Ruta mejorada
app.use("/api/reservations", reservationRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/email-notifications", emailNotificationRoutes);
app.use("/api/registration-requests", registrationRequestsRouter);
app.use("/api/activity-log", activityLogRouter);

// Endpoint especial para inicializar la base de datos
app.post("/api/system/init-database", async (req: Request, res: Response) => {
  try {
    const { initializeCompleteDatabase } = await import("./scripts/init-database-complete");
    const result = await initializeCompleteDatabase();
    
    if (result.success) {
      res.status(200).json(result);
    } else {
      res.status(500).json(result);
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al inicializar la base de datos",
      error: error instanceof Error ? error.message : "Error desconocido",
    });
  }
});

// Endpoint para verificar estado de la base de datos
app.get("/api/system/database-status", async (req: Request, res: Response) => {
  try {
    const { dbManager } = await import("./database/connection");
    const db = await dbManager.connect();
    
    // Verificar algunas tablas clave
    const tables = await db.all(`
      SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'
      UNION
      SELECT table_name as name FROM information_schema.tables 
      WHERE table_schema = DATABASE() AND table_type = 'BASE TABLE'
    `);
    
    res.json({
      success: true,
      database: {
        type: config.database.type,
        connected: true,
        tables: tables.length,
        tableNames: tables.map((t: any) => t.name || t.table_name),
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      database: {
        type: config.database.type,
        connected: false,
        error: error instanceof Error ? error.message : "Error de conexión",
      },
    });
  }
});

// 404 handler
app.use("*", (req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    error: "Endpoint no encontrado",
    path: req.originalUrl,
    availableEndpoints: "/api para ver documentación completa",
  });
});

// Error handler
app.use(errorHandler);

export { app as enhancedApp };
export default app;
