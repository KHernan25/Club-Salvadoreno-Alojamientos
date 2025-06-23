# API del Sistema Club Salvadoreño

## Introducción

Esta API REST proporciona todos los servicios backend necesarios para el sistema de reservas del Club Salvadoreño, incluyendo autenticación, gestión de usuarios, alojamientos, reservas, precios y contacto.

## Configuración

### Instalación

```bash
# Instalar dependencias
npm install

# Copiar variables de entorno
cp .env.example .env

# Configurar variables en .env
```

### Scripts Disponibles

```bash
# Desarrollo - Solo servidor API
npm run server:dev

# Desarrollo - Frontend + API
npm run dev:full

# Producción
npm run server:build
npm run server:start
```

## Base URL

```
Desarrollo: http://localhost:3001/api
Producción: https://your-domain.com/api
```

## Autenticación

La API utiliza JWT (JSON Web Tokens) para autenticación. Incluye el token en el header Authorization:

```
Authorization: Bearer <your-jwt-token>
```

### Roles de Usuario

- **user**: Usuario regular con acceso a reservas y perfil
- **staff**: Personal con acceso a operaciones diarias
- **admin**: Administrador con acceso completo

## Endpoints

### 🔐 Autenticación (`/api/auth`)

#### POST `/auth/login`

Iniciar sesión de usuario.

**Body:**

```json
{
  "username": "admin",
  "password": "Admin123",
  "rememberMe": false
}
```

**Response 200:**

```json
{
  "success": true,
  "message": "Inicio de sesión exitoso",
  "data": {
    "user": {
      "id": "1",
      "firstName": "Administrador",
      "lastName": "Sistema",
      "username": "admin",
      "email": "admin@clubsalvadoreno.com",
      "fullName": "Administrador del Sistema",
      "role": "admin",
      "phone": "+503 2345-6789"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": "24h"
  }
}
```

#### POST `/auth/register`

Registrar nuevo usuario.

**Body:**

```json
{
  "firstName": "Juan",
  "lastName": "Pérez",
  "email": "juan@email.com",
  "documentType": "dui",
  "documentNumber": "12345678-9",
  "memberCode": "MEM001",
  "phone": "+503 7890-1234",
  "password": "Password123",
  "confirmPassword": "Password123",
  "acceptTerms": true
}
```

#### GET `/auth/me`

Obtener información del usuario actual (requiere autenticación).

#### POST `/auth/logout`

Cerrar sesión (requiere autenticación).

#### POST `/auth/refresh`

Renovar token (requiere autenticación).

#### POST `/auth/forgot-password`

Solicitar recuperación de contraseña.

#### POST `/auth/reset-password`

Restablecer contraseña con token.

#### GET `/auth/validate-token`

Validar token actual (requiere autenticación).

---

### 👥 Usuarios (`/api/users`)

#### GET `/users`

Obtener lista de usuarios (solo admin/staff).

**Query Parameters:**

- `page`: Número de página (default: 1)
- `limit`: Elementos por página (default: 10)
- `active`: Filtrar usuarios activos (default: true)
- `role`: Filtrar por rol

**Response 200:**

```json
{
  "success": true,
  "data": {
    "users": [...],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 25,
      "pages": 3
    }
  }
}
```

#### GET `/users/:id`

Obtener usuario específico.

#### PUT `/users/:id`

Actualizar usuario.

#### DELETE `/users/:id`

Desactivar usuario (solo admin).

#### POST `/users/:id/activate`

Reactivar usuario (admin/staff).

#### GET `/users/stats/summary`

Estadísticas de usuarios (solo admin).

---

### 🏨 Alojamientos (`/api/accommodations`)

#### GET `/accommodations`

Obtener todos los alojamientos.

**Query Parameters:**

- `location`: Filtrar por ubicación (el-sunzal, corinto)
- `type`: Filtrar por tipo (apartamento, casa, suite)
- `capacity`: Capacidad mínima de huéspedes
- `page`, `limit`: Paginación

**Response 200:**

```json
{
  "success": true,
  "data": {
    "accommodations": [
      {
        "id": "1A",
        "name": "Apartamento 1A",
        "capacity": 2,
        "location": "el-sunzal",
        "type": "apartamento",
        "view": "Vista al mar",
        "amenities": ["Wi-Fi", "Aire acondicionado", "TV"],
        "description": "Cómodo apartamento con vista al mar",
        "pricing": {
          "weekday": 110,
          "weekend": 230,
          "holiday": 280
        },
        "available": true
      }
    ],
    "pagination": {...}
  }
}
```

#### GET `/accommodations/:id`

Obtener alojamiento específico.

#### GET `/accommodations/location/:location`

Obtener alojamientos por ubicación.

#### GET `/accommodations/search/availability`

Verificar disponibilidad.

**Query Parameters:**

- `checkIn`: Fecha de entrada (YYYY-MM-DD)
- `checkOut`: Fecha de salida (YYYY-MM-DD)
- `guests`: Número de huéspedes
- `location`: Ubicación (opcional)
- `type`: Tipo (opcional)

---

### 📅 Reservas (`/api/reservations`)

#### POST `/reservations`

Crear nueva reserva (requiere autenticación).

**Body:**

```json
{
  "accommodationId": "1A",
  "checkIn": "2024-03-15",
  "checkOut": "2024-03-17",
  "guests": 2,
  "specialRequests": "Llegada tardía"
}
```

**Response 201:**

```json
{
  "success": true,
  "message": "Reserva creada exitosamente",
  "data": {
    "reservation": {
      "id": "uuid-here",
      "accommodationId": "1A",
      "checkIn": "2024-03-15",
      "checkOut": "2024-03-17",
      "guests": 2,
      "status": "pending",
      "totalPrice": 460,
      "priceBreakdown": {...},
      "confirmationCode": "ABC123",
      "paymentStatus": "pending"
    }
  }
}
```

#### GET `/reservations`

Obtener reservas del usuario actual (requiere autenticación).

#### GET `/reservations/all`

Obtener todas las reservas (solo admin/staff).

#### GET `/reservations/:id`

Obtener reserva específica.

#### PUT `/reservations/:id`

Actualizar reserva.

#### DELETE `/reservations/:id`

Cancelar reserva.

#### GET `/reservations/stats/summary`

Estadísticas de reservas (admin/staff).

---

### 💰 Precios (`/api/pricing`)

#### GET `/pricing/rates`

Obtener todas las tarifas.

**Query Parameters:**

- `accommodationId`: ID específico de alojamiento

#### POST `/pricing/calculate`

Calcular precio de estadía.

**Body:**

```json
{
  "accommodationId": "1A",
  "checkIn": "2024-03-15",
  "checkOut": "2024-03-17"
}
```

**Response 200:**

```json
{
  "success": true,
  "data": {
    "accommodationId": "1A",
    "checkIn": "2024-03-15",
    "checkOut": "2024-03-17",
    "rates": {
      "weekday": 110,
      "weekend": 230,
      "holiday": 280
    },
    "calculation": {
      "totalDays": 2,
      "weekdayDays": 1,
      "weekendDays": 1,
      "holidayDays": 0,
      "totalPrice": 340,
      "formattedTotal": "$340",
      "breakdown": [...]
    }
  }
}
```

#### GET `/pricing/day-types`

Obtener información sobre tipos de día.

#### GET `/pricing/accommodation/:id`

Obtener precios para alojamiento específico.

#### GET `/pricing/compare`

Comparar precios entre alojamientos.

#### GET `/pricing/lowest`

Encontrar precios más bajos.

---

### 📧 Contacto (`/api/contact`)

#### POST `/contact/message`

Enviar mensaje de contacto.

**Body:**

```json
{
  "name": "Juan Pérez",
  "email": "juan@email.com",
  "phone": "+503 7890-1234",
  "subject": "Consulta sobre reservas",
  "message": "Quisiera información sobre disponibilidad..."
}
```

#### GET `/contact/messages`

Obtener mensajes de contacto (solo staff/admin).

#### GET `/contact/messages/:id`

Obtener mensaje específico (solo staff/admin).

#### PUT `/contact/messages/:id`

Actualizar estado del mensaje (solo staff/admin).

#### POST `/contact/email-test`

Enviar email de prueba (desarrollo).

#### POST `/contact/sms-test`

Enviar SMS de prueba (desarrollo).

#### GET `/contact/stats`

Estadísticas de mensajes (solo staff/admin).

---

## Códigos de Estado HTTP

- **200**: Éxito
- **201**: Creado exitosamente
- **400**: Datos de entrada inválidos
- **401**: No autenticado
- **403**: Sin permisos
- **404**: Recurso no encontrado
- **409**: Conflicto (ya existe)
- **429**: Demasiadas solicitudes
- **500**: Error interno del servidor

## Rate Limiting

- **General**: 100 requests por 15 minutos por IP
- **Autenticación**: 5 attempts por 15 minutos por IP

## Estructura de Respuesta

### Respuesta Exitosa

```json
{
  "success": true,
  "message": "Operación exitosa",
  "data": {
    // Datos específicos
  }
}
```

### Respuesta de Error

```json
{
  "success": false,
  "error": "Descripción del error"
}
```

## Desarrollo y Testing

### Usuarios de Prueba

| Username  | Password     | Role  | Email                         |
| --------- | ------------ | ----- | ----------------------------- |
| admin     | Admin123     | admin | admin@clubsalvadoreno.com     |
| demo      | demo123      | user  | demo@clubsalvadoreno.com      |
| recepcion | Recepcion123 | staff | recepcion@clubsalvadoreno.com |

### Health Check

```
GET /health
```

Verifica el estado del servidor.

## Próximos Pasos

### Para Producción:

1. **Base de Datos Real**: Migrar de datos en memoria a PostgreSQL/MongoDB
2. **Autenticación Avanzada**: Implementar refresh tokens, 2FA
3. **Servicios Externos**: Integrar email (SendGrid), SMS (Twilio)
4. **Pagos**: Integrar Stripe/PayPal para procesamiento de pagos
5. **Archivos**: Implementar subida de imágenes (AWS S3)
6. **Monitoreo**: Agregar logging avanzado y métricas
7. **Testing**: Implementar tests automatizados
8. **Documentación**: Generar OpenAPI/Swagger docs

### Características Adicionales:

- Sistema de notificaciones push
- Chat en tiempo real
- Reportes y analytics
- API de disponibilidad en tiempo real
- Integración con calendario
- Sistema de reviews y ratings
- Multi-tenancy para diferentes propiedades

## Soporte

Para soporte técnico, contacta al equipo de desarrollo o revisa la documentación del código fuente.
