// Configuración centralizada del sistema
// Maneja todas las variables de entorno de forma segura

interface Config {
  // Servidor
  server: {
    port: number;
    nodeEnv: string;
    frontendUrl: string;
  };

  // Base de datos
  database: {
    url: string;
    type: "memory" | "postgres" | "mysql";
    host?: string;
    port?: number;
    name?: string;
    user?: string;
    password?: string;
  };

  // Autenticación
  auth: {
    jwtSecret: string;
    tokenExpiry: string;
    refreshTokenExpiry: string;
  };

  // Email
  email: {
    host: string;
    port: number;
    user: string;
    password: string;
    from: string;
  };

  // SMS
  sms: {
    apiKey: string;
    apiUrl: string;
  };

  // Archivos
  files: {
    uploadDir: string;
    maxFileSize: number;
    allowedImageTypes: string[];
  };

  // Rate Limiting
  rateLimit: {
    windowMs: number;
    maxRequests: number;
    authMaxRequests: number;
  };

  // Logging
  logging: {
    level: string;
    file?: string;
  };

  // Notificaciones Push
  vapid: {
    publicKey: string;
    privateKey: string;
    email: string;
  };

  // Monitoreo
  monitoring: {
    enabled: boolean;
    sentryDsn?: string;
  };

  // Cache
  cache: {
    redisUrl: string;
    ttl: number;
  };

  // Backups
  backup: {
    enabled: boolean;
    interval: number;
    retentionDays: number;
  };
}

// Función helper para obtener variables de entorno con valores por defecto
const getEnvVar = (key: string, defaultValue?: string): string => {
  const value = process.env[key];
  if (value === undefined && defaultValue === undefined) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value || defaultValue || "";
};

const getEnvNumber = (key: string, defaultValue: number): number => {
  const value = process.env[key];
  if (value === undefined) return defaultValue;
  const parsed = parseInt(value, 10);
  if (isNaN(parsed)) {
    throw new Error(
      `Environment variable ${key} must be a number, got: ${value}`,
    );
  }
  return parsed;
};

const getEnvBoolean = (key: string, defaultValue: boolean): boolean => {
  const value = process.env[key];
  if (value === undefined) return defaultValue;
  return value.toLowerCase() === "true";
};

// Configuración del sistema
export const config: Config = {
  server: {
    port: getEnvNumber("PORT", 3001),
    nodeEnv: getEnvVar("NODE_ENV", "development"),
    frontendUrl: getEnvVar("FRONTEND_URL", "http://localhost:8080"),
  },

  database: {
    url: getEnvVar("DATABASE_URL", "memory://"),
    type: getEnvVar("DB_TYPE", "memory") as "memory" | "postgres" | "mysql",
    host: process.env.DB_HOST,
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : undefined,
    name: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
  },

  auth: {
    jwtSecret: getEnvVar(
      "JWT_SECRET",
      "club-salvadoreno-super-secret-jwt-key-development-only",
    ),
    tokenExpiry: getEnvVar("JWT_EXPIRES_IN", "24h"),
    refreshTokenExpiry: getEnvVar("JWT_REFRESH_EXPIRES_IN", "7d"),
  },

  email: {
    host: getEnvVar("EMAIL_HOST", "smtp.gmail.com"),
    port: getEnvNumber("EMAIL_PORT", 587),
    user: getEnvVar("EMAIL_USER", "noreply@clubsalvadoreno.com"),
    password: getEnvVar("EMAIL_PASSWORD", "development-password"),
    from: getEnvVar(
      "EMAIL_FROM",
      "Club Salvadoreño <noreply@clubsalvadoreno.com>",
    ),
  },

  sms: {
    apiKey: getEnvVar("SMS_API_KEY", "development-sms-key"),
    apiUrl: getEnvVar("SMS_API_URL", "https://api.sms-provider.com/v1/send"),
  },

  files: {
    uploadDir: getEnvVar("UPLOAD_DIR", "./uploads"),
    maxFileSize: getEnvNumber("MAX_FILE_SIZE", 10485760), // 10MB
    allowedImageTypes: getEnvVar(
      "ALLOWED_IMAGE_TYPES",
      "jpg,jpeg,png,webp",
    ).split(","),
  },

  rateLimit: {
    windowMs: getEnvNumber("RATE_LIMIT_WINDOW_MS", 900000), // 15 minutos
    maxRequests: getEnvNumber("RATE_LIMIT_MAX_REQUESTS", 100),
    authMaxRequests: getEnvNumber("AUTH_RATE_LIMIT_MAX_REQUESTS", 5),
  },

  logging: {
    level: getEnvVar("LOG_LEVEL", "info"),
    file: process.env.LOG_FILE,
  },

  vapid: {
    publicKey: getEnvVar("VAPID_PUBLIC_KEY", "development-vapid-public-key"),
    privateKey: getEnvVar("VAPID_PRIVATE_KEY", "development-vapid-private-key"),
    email: getEnvVar("VAPID_EMAIL", "admin@clubsalvadoreno.com"),
  },

  monitoring: {
    enabled: getEnvBoolean("MONITORING_ENABLED", false),
    sentryDsn: process.env.SENTRY_DSN,
  },

  cache: {
    redisUrl: getEnvVar("REDIS_URL", "memory://"),
    ttl: getEnvNumber("CACHE_TTL", 3600),
  },

  backup: {
    enabled: getEnvBoolean("BACKUP_ENABLED", false),
    interval: getEnvNumber("BACKUP_INTERVAL", 86400000), // 24 horas
    retentionDays: getEnvNumber("BACKUP_RETENTION_DAYS", 30),
  },
};

// Validaciones de configuración en desarrollo
if (config.server.nodeEnv === "development") {
  console.log("🔧 Configuración de desarrollo cargada");
  console.log(
    `📊 Servidor: ${config.server.frontendUrl} → Puerto ${config.server.port}`,
  );
  console.log(
    `💾 Base de datos: ${config.database.type} (${config.database.url})`,
  );
  console.log(`🔐 JWT Secret: ${config.auth.jwtSecret.substring(0, 20)}...`);
  console.log(
    `📧 Email: ${config.email.user} via ${config.email.host}:${config.email.port}`,
  );
  console.log(`📱 SMS: ${config.sms.apiUrl}`);
  console.log(
    `📁 Archivos: ${config.files.uploadDir} (max: ${config.files.maxFileSize / 1024 / 1024}MB)`,
  );
  console.log(
    `⏱️ Rate limit: ${config.rateLimit.maxRequests} requests/${config.rateLimit.windowMs / 1000}s`,
  );
  console.log(
    `📋 Logging: ${config.logging.level}${config.logging.file ? ` → ${config.logging.file}` : ""}`,
  );
  console.log(`🔔 VAPID: ${config.vapid.email}`);
  console.log(`📊 Monitoring: ${config.monitoring.enabled ? "✅" : "❌"}`);
  console.log(`💾 Cache: ${config.cache.redisUrl} (TTL: ${config.cache.ttl}s)`);
  console.log(`💾 Backup: ${config.backup.enabled ? "✅" : "❌"}`);
}

// Validaciones críticas para producción
if (config.server.nodeEnv === "production") {
  const requiredForProduction = [
    "JWT_SECRET",
    "DATABASE_URL",
    "EMAIL_PASSWORD",
    "SMS_API_KEY",
  ];

  const missing = requiredForProduction.filter((key) => !process.env[key]);

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables for production: ${missing.join(", ")}`,
    );
  }

  // Validar que el JWT secret no sea el de desarrollo
  if (config.auth.jwtSecret.includes("development")) {
    throw new Error("JWT_SECRET must be changed for production");
  }

  console.log("🚀 Configuración de producción validada");
}

export default config;
