# Backend API - Club Salvadoreño

Sistema backend completo para la aplicación de reservas del Club Salvadoreño.

## Arquitectura

### Tecnologías Utilizadas

- **Node.js** - Runtime de JavaScript
- **Express.js** - Framework web
- **TypeScript** - Tipado estático
- **JWT** - Autenticación
- **Express Validator** - Validación de datos
- **bcryptjs** - Hash de contraseñas
- **cors** - Configuración de CORS
- **helmet** - Seguridad HTTP
- **morgan** - Logging de requests
- **express-rate-limit** - Rate limiting

### Base de Datos

El sistema utiliza una base de datos en memoria para desarrollo, implementada en `src/lib/database.ts`. Esta puede ser fácilmente reemplazada por una base de datos real (PostgreSQL, MySQL, MongoDB) en producción.

#### Entidades Principales

- **Accommodations** - Alojamientos (apartamentos, casas, suites)
- **Reservations** - Reservas de usuarios
- **Reviews** - Reseñas de huéspedes
- **ActivityLogs** - Bitácora de actividades diarias
- **RegistrationRequests** - Solicitudes de registro
- **Notifications** - Notificaciones del backoffice
- **Users** - Usuarios del sistema (en user-database.ts)

## Estructura de Directorios

```
src/server/
├── middleware/          # Middleware personalizado
│   ├── auth.ts         # Autenticación y autorización
│   ├── errorHandler.ts # Manejo de errores
│   └── validators.ts   # Validaciones de entrada
├── routes/             # Definición de rutas
│   ├── auth.ts        # Autenticación
│   ├── users.ts       # Gestión de usuarios
│   ├── accommodations.ts # Alojamientos
│   ├── reservations.ts   # Reservas
│   ├── reviews.ts        # Reseñas
│   ├── pricing.ts        # Sistema de precios
│   ├── contact.ts        # Formulario de contacto
│   ├── notifications.ts  # Notificaciones
│   ├── registration-requests.ts # Solicitudes de registro
│   └── activity-log.ts   # Bitácora de actividades
├── scripts/            # Scripts de utilidad
│   └── init-database.ts # Inicialización de datos
├── app.ts             # Configuración de la aplicación
└── server.ts          # Punto de entrada del servidor
```

## API Endpoints

### Autenticación (`/api/auth`)

| Método | Endpoint           | Descripción            |
| ------ | ------------------ | ---------------------- |
| POST   | `/login`           | Iniciar sesión         |
| POST   | `/register`        | Registrar usuario      |
| POST   | `/logout`          | Cerrar sesión          |
| POST   | `/refresh`         | Renovar token          |
| GET    | `/me`              | Obtener perfil actual  |
| POST   | `/forgot-password` | Recuperar contraseña   |
| POST   | `/reset-password`  | Restablecer contraseña |
| GET    | `/validate-token`  | Validar token          |

### Usuarios (`/api/users`)

| Método | Endpoint         | Descripción        | Roles               |
| ------ | ---------------- | ------------------ | ------------------- |
| GET    | `/`              | Listar usuarios    | admin, staff        |
| GET    | `/:id`           | Obtener usuario    | admin, staff, owner |
| PUT    | `/:id`           | Actualizar usuario | admin, staff, owner |
| DELETE | `/:id`           | Desactivar usuario | admin               |
| POST   | `/:id/activate`  | Reactivar usuario  | admin, staff        |
| GET    | `/stats/summary` | Estadísticas       | admin               |

### Alojamientos (`/api/accommodations`)

| Método | Endpoint               | Descripción                    |
| ------ | ---------------------- | ------------------------------ |
| GET    | `/`                    | Listar alojamientos            |
| GET    | `/:id`                 | Obtener alojamiento específico |
| GET    | `/location/:location`  | Alojamientos por ubicación     |
| GET    | `/search/availability` | Verificar disponibilidad       |

### Reservas (`/api/reservations`)

| Método | Endpoint                     | Descripción                 | Roles               |
| ------ | ---------------------------- | --------------------------- | ------------------- |
| POST   | `/`                          | Crear reserva               | authenticated       |
| GET    | `/`                          | Listar reservas del usuario | authenticated       |
| GET    | `/all`                       | Listar todas las reservas   | admin, staff        |
| GET    | `/:id`                       | Obtener reserva específica  | admin, staff, owner |
| PUT    | `/:id`                       | Actualizar reserva          | admin, staff, owner |
| DELETE | `/:id`                       | Cancelar reserva            | admin, staff, owner |
| GET    | `/stats/summary`             | Estadísticas                | admin, staff        |
| GET    | `/business-rules`            | Reglas de negocio           | authenticated       |
| POST   | `/:id/validate-modification` | Validar modificación        | authenticated       |
| POST   | `/:id/validate-cancellation` | Validar cancelación         | authenticated       |
| POST   | `/:id/validate-key-handover` | Validar entrega de llaves   | authenticated       |

### Reseñas (`/api/reviews`)

| Método | Endpoint                   | Descripción                  | Roles               |
| ------ | -------------------------- | ---------------------------- | ------------------- |
| GET    | `/`                        | Listar reseñas               | public              |
| GET    | `/:id`                     | Obtener reseña específica    | public              |
| POST   | `/`                        | Crear reseña                 | authenticated       |
| PUT    | `/:id`                     | Actualizar reseña            | owner               |
| DELETE | `/:id`                     | Eliminar reseña              | admin, staff, owner |
| POST   | `/:id/helpful`             | Marcar como útil             | authenticated       |
| POST   | `/:id/response`            | Respuesta del anfitrión      | admin, staff        |
| PUT    | `/:id/moderate`            | Moderar reseña               | admin               |
| GET    | `/accommodation/:id/stats` | Estadísticas por alojamiento | public              |

### Precios (`/api/pricing`)

| Método | Endpoint     | Descripción      |
| ------ | ------------ | ---------------- |
| GET    | `/calculate` | Calcular precios |
| GET    | `/rates`     | Obtener tarifas  |

### Contacto (`/api/contact`)

| Método | Endpoint | Descripción                |
| ------ | -------- | -------------------------- |
| POST   | `/`      | Enviar mensaje de contacto |

### Notificaciones (`/api/notifications`)

| Método | Endpoint         | Descripción              | Roles        |
| ------ | ---------------- | ------------------------ | ------------ |
| GET    | `/`              | Obtener notificaciones   | admin, staff |
| PATCH  | `/:id/read`      | Marcar como leída        | admin, staff |
| POST   | `/mark-all-read` | Marcar todas como leídas | admin, staff |

### Solicitudes de Registro (`/api/registration-requests`)

| Método | Endpoint       | Descripción        | Roles        |
| ------ | -------------- | ------------------ | ------------ |
| GET    | `/`            | Listar solicitudes | admin, staff |
| GET    | `/:id`         | Obtener solicitud  | admin, staff |
| POST   | `/:id/approve` | Aprobar solicitud  | admin, staff |
| POST   | `/:id/reject`  | Rechazar solicitud | admin, staff |

### Bitácora de Actividades (`/api/activity-log`)

| Método | Endpoint | Descripción      | Roles        |
| ------ | -------- | ---------------- | ------------ |
| GET    | `/`      | Obtener entradas | admin, staff |
| POST   | `/`      | Crear entrada    | admin, staff |
| DELETE | `/:id`   | Eliminar entrada | admin        |

## Autenticación y Autorización

### Sistema de Roles

El sistema implementa un sistema jerárquico de roles:

1. **super_admin** - Acceso completo al sistema
2. **atencion_miembro** - Gestión de usuarios y reservas
3. **anfitrion** - Gestión de alojamientos y reservas
4. **monitor** - Visualización de reportes
5. **mercadeo** - Gestión de contenido y marketing
6. **recepcion** - Operaciones diarias
7. **porteria** - Control de acceso
8. **miembro** - Usuario final

### Middleware de Autenticación

- `authenticateToken` - Valida JWT token
- `requireRole` - Verifica roles específicos
- `optionalAuth` - Autenticación opcional

### Tokens JWT

- **Algoritmo**: HS256
- **Expiración**: 24h (1h si no "recordar")
- **Payload**: userId, email, role

## Validaciones

El sistema implementa validaciones exhaustivas usando `express-validator`:

- **Entrada de datos** - Validación de tipos y formatos
- **Reglas de negocio** - Validaciones específicas del dominio
- **Sanitización** - Limpieza de datos de entrada
- **Mensajes de error** - Respuestas descriptivas en español

## Seguridad

### Medidas Implementadas

- **Helmet** - Headers de seguridad HTTP
- **CORS** - Configuración específica de orígenes
- **Rate Limiting** - Límites por IP y endpoint
- **Validación de entrada** - Prevención de inyecciones
- **JWT** - Autenticación stateless
- **Hashing de contraseñas** - bcryptjs
- **Error handling** - No exposición de información sensible

### Rate Limiting

- **General**: 100 requests/15min por IP
- **Autenticación**: 5 requests/15min por IP
- **Headers de confianza**: Configurado para proxies

## Variables de Entorno

Ver `.env.example` para la configuración completa:

```env
# Servidor
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:5173

# JWT
JWT_SECRET=your-super-secret-jwt-key

# Base de datos (producción)
DATABASE_URL=postgresql://...

# Email y SMS
EMAIL_HOST=smtp.gmail.com
SMS_API_KEY=your-api-key

# Almacenamiento
UPLOAD_DIR=./uploads
MAX_FILE_SIZE=10485760
```

## Manejo de Errores

### Estructura de Respuesta de Error

```json
{
  "success": false,
  "error": "Mensaje descriptivo del error",
  "statusCode": 400,
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

### Tipos de Errores

- **400** - Datos de entrada inválidos
- **401** - No autenticado / Token inválido
- **403** - Permisos insuficientes
- **404** - Recurso no encontrado
- **409** - Conflicto (ej. email duplicado)
- **429** - Rate limit excedido
- **500** - Error interno del servidor

## Logging

El sistema implementa logging detallado:

- **Morgan** - Logging de requests HTTP
- **Error logging** - Errores con stack traces
- **Business events** - Eventos importantes del negocio

## Desarrollo

### Instalación

```bash
npm install
```

### Desarrollo

```bash
npm run dev        # Frontend + Backend
npm run server:dev # Solo backend
```

### Producción

```bash
npm run build      # Compilar TypeScript
npm run start      # Iniciar servidor
```

### Testing

```bash
npm test          # Ejecutar tests
```

## Estructura de Datos

### Alojamientos

```typescript
interface Accommodation {
  id: string;
  name: string;
  type: "apartamento" | "casa" | "suite";
  location: "el-sunzal" | "corinto";
  capacity: number;
  description: string;
  amenities: string[];
  pricing: {
    weekday: number;
    weekend: number;
    holiday: number;
  };
  images: string[];
  available: boolean;
  view?: string;
  featured?: boolean;
  lastUpdated: string;
  updatedBy?: string;
}
```

### Reservas

```typescript
interface Reservation {
  id: string;
  userId: string;
  accommodationId: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  totalPrice: number;
  status: "pending" | "confirmed" | "cancelled" | "completed";
  createdAt: string;
  updatedAt: string;
  specialRequests?: string;
  breakdown?: PriceBreakdown;
}
```

### Reseñas

```typescript
interface Review {
  id: string;
  accommodationId: string;
  userId: string;
  reservationId: string;
  rating: number; // 1-5
  title: string;
  comment: string;
  images?: string[];
  categories: {
    cleanliness: number;
    communication: number;
    checkin: number;
    accuracy: number;
    location: number;
    value: number;
  };
  helpfulCount: number;
  reportedCount: number;
  isModerated: boolean;
  moderatorNote?: string;
  hostResponse?: {
    message: string;
    createdAt: string;
  };
  createdAt: string;
  updatedAt: string;
}
```

## Reglas de Negocio

### Reservas

- **Check-in mínimo**: Al día siguiente
- **Duración máxima**: 7 días consecutivos
- **Capacidad**: Validación contra capacidad del alojamiento
- **Disponibilidad**: Verificación de conflictos de fechas

### Sistema de Precios

- **Días laborales**: Lunes a Viernes
- **Fines de semana**: Sábado y Domingo
- **Días festivos**: Fechas especiales configuradas
- **Cálculo automático**: Por tipo de día

### Roles y Permisos

- **Jerarquía**: Los roles superiores heredan permisos inferiores
- **Contexto**: Permisos específicos por módulo
- **Ownership**: Los usuarios pueden gestionar sus propios recursos

## Migración a Producción

### Base de Datos Real

Para migrar a una base de datos real (PostgreSQL recomendado):

1. Instalar dependencias: `pg`, `@types/pg`
2. Configurar conexión en variables de entorno
3. Implementar migrations en `/migrations`
4. Reemplazar `database.ts` con implementación real
5. Mantener la misma interfaz para compatibilidad

### Consideraciones de Seguridad

- Cambiar `JWT_SECRET` por uno seguro
- Configurar HTTPS en producción
- Implementar rate limiting más estricto
- Configurar logs centralizados
- Implementar monitoreo y alertas

### Escalabilidad

- Implementar cache (Redis)
- Configurar load balancer
- Optimizar consultas de base de datos
- Implementar CDN para assets
- Configurar auto-scaling

## API Health Check

El servidor expone un endpoint de health check:

```
GET /health
```

Respuesta:

```json
{
  "status": "OK",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "uptime": 3600,
  "environment": "development"
}
```

Este endpoint puede usarse para:

- Load balancer health checks
- Monitoreo de aplicaciones
- CI/CD pipeline verification

## Documentación de API

Para documentación interactiva de la API, el endpoint `/api` proporciona una descripción completa de todos los endpoints disponibles, métodos HTTP, y ejemplos de uso.

---

## Soporte

Para soporte técnico o preguntas sobre la implementación, revisar:

1. Los comentarios en el código fuente
2. La documentación de endpoints en `/api`
3. Los archivos de ejemplo en `/docs`
4. Los tests unitarios para casos de uso específicos
