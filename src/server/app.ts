import express, { Application, Request, Response } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import { authRoutes } from "./routes/auth";
import { userRoutes } from "./routes/users";
import { accommodationRoutes } from "./routes/accommodations";
import { reservationRoutes } from "./routes/reservations";
import { reviewRoutes } from "./routes/reviews";
import { pricingRoutes } from "./routes/pricing";
import { contactRoutes } from "./routes/contact";
import { notificationRoutes } from "./routes/notifications";
import registrationRequestsRouter from "./routes/registration-requests";
import activityLogRouter from "./routes/activity-log";
import { errorHandler } from "./middleware/errorHandler";

// Crear aplicación Express
const app: Application = express();

// Configure trust proxy securely
// Only trust first proxy (common for cloud deployments like Heroku, Railway, etc.)
// This prevents IP spoofing while allowing proper rate limiting
app.set("trust proxy", 1);

// Middleware de seguridad
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // máximo 100 requests por ventana por IP
  message: {
    error: "Demasiadas solicitudes, intenta nuevamente en 15 minutos",
  },
});
app.use("/api/", limiter);

// Rate limiting más estricto para autenticación
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 5, // máximo 5 intentos de login por ventana por IP
  message: {
    error:
      "Demasiados intentos de autenticación, intenta nuevamente en 15 minutos",
  },
});
app.use("/api/auth/", authLimiter);

// CORS
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
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
    environment: process.env.NODE_ENV || "development",
  });
});

// API base endpoint - información de la API
app.get("/api", (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "🏨 Club Salvadoreño API",
    version: "1.0.0",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development",
    endpoints: {
      health: {
        path: "/health",
        method: "GET",
        description: "Health check del servidor",
      },
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
        description: "Gestión de usuarios",
        endpoints: [
          "GET /api/users - Listar usuarios",
          "GET /api/users/:id - Obtener usuario",
          "PUT /api/users/:id - Actualizar usuario",
          "DELETE /api/users/:id - Eliminar usuario",
        ],
      },
      accommodations: {
        path: "/api/accommodations",
        methods: ["GET"],
        description: "Información de alojamientos",
        endpoints: [
          "GET /api/accommodations - Listar alojamientos",
          "GET /api/accommodations/:id - Obtener alojamiento",
          "GET /api/accommodations/location/:location - Alojamientos por ubicación",
        ],
      },
      reservations: {
        path: "/api/reservations",
        methods: ["GET", "POST", "PUT", "DELETE"],
        description: "Gestión de reservas",
        endpoints: [
          "GET /api/reservations - Listar reservas",
          "POST /api/reservations - Crear reserva",
          "GET /api/reservations/:id - Obtener reserva",
          "PUT /api/reservations/:id - Actualizar reserva",
          "DELETE /api/reservations/:id - Cancelar reserva",
        ],
      },
      pricing: {
        path: "/api/pricing",
        methods: ["GET"],
        description: "Sistema de precios",
        endpoints: [
          "GET /api/pricing/calculate - Calcular precios",
          "GET /api/pricing/rates - Obtener tarifas",
        ],
      },
      contact: {
        path: "/api/contact",
        methods: ["POST"],
        description: "Formulario de contacto",
        endpoints: ["POST /api/contact - Enviar mensaje de contacto"],
      },
      notifications: {
        path: "/api/notifications",
        methods: ["GET", "PATCH", "POST"],
        description: "Notificaciones del backoffice",
        endpoints: [
          "GET /api/notifications - Obtener notificaciones",
          "PATCH /api/notifications/:id/read - Marcar como leída",
          "POST /api/notifications/mark-all-read - Marcar todas como leídas",
        ],
      },
      registrationRequests: {
        path: "/api/registration-requests",
        methods: ["GET", "POST"],
        description: "Gestión de solicitudes de registro",
        endpoints: [
          "GET /api/registration-requests - Listar solicitudes",
          "GET /api/registration-requests/:id - Obtener solicitud",
          "POST /api/registration-requests/:id/approve - Aprobar solicitud",
          "POST /api/registration-requests/:id/reject - Rechazar solicitud",
        ],
      },
      activityLog: {
        path: "/api/activity-log",
        methods: ["GET", "POST", "DELETE"],
        description: "Bitácora de actividades diarias",
        endpoints: [
          "GET /api/activity-log - Obtener entradas de actividad",
          "POST /api/activity-log - Crear nueva entrada de actividad",
          "DELETE /api/activity-log/:id - Eliminar entrada (SuperAdmin únicamente)",
        ],
      },
      reviews: {
        path: "/api/reviews",
        methods: ["GET", "POST", "PUT", "DELETE"],
        description: "Sistema de reseñas de huéspedes",
        endpoints: [
          "GET /api/reviews - Listar reseñas con filtros",
          "GET /api/reviews/:id - Obtener reseña específica",
          "POST /api/reviews - Crear nueva reseña",
          "PUT /api/reviews/:id - Actualizar reseña",
          "DELETE /api/reviews/:id - Eliminar reseña",
          "POST /api/reviews/:id/helpful - Marcar reseña como útil",
          "POST /api/reviews/:id/response - Respuesta del anfitrión",
          "PUT /api/reviews/:id/moderate - Moderar reseña (admin)",
          "GET /api/reviews/accommodation/:id/stats - Estadísticas de reseñas",
        ],
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
    },
  });
});

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/accommodations", accommodationRoutes);
app.use("/api/reservations", reservationRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/pricing", pricingRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/registration-requests", registrationRequestsRouter);
app.use("/api/activity-log", activityLogRouter);

// 404 handler
app.use("*", (req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    error: "Endpoint no encontrado",
    path: req.originalUrl,
  });
});

// Error handler
app.use(errorHandler);

export { app };
