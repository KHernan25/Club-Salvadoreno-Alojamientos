# API Integration - Documentación Completa

Este documento describe todas las conexiones API disponibles entre el frontend y backend del sistema Club Salvadoreño.

## 🔌 Estado de Integración

✅ **COMPLETAMENTE INTEGRADO** - Todos los endpoints del backend están conectados al frontend

## 📚 APIs Disponibles

### 🔐 Autenticación (`/api/auth`)

| Función Frontend    | Endpoint Backend        | Método | Descripción                          |
| ------------------- | ----------------------- | ------ | ------------------------------------ |
| `apiLogin`          | `/auth/login`           | POST   | Iniciar sesión                       |
| `apiRegister`       | `/auth/register`        | POST   | Registrar nuevo usuario              |
| `apiLogout`         | `/auth/logout`          | POST   | Cerrar sesión                        |
| `apiGetCurrentUser` | `/auth/me`              | GET    | Obtener usuario actual               |
| `apiRefreshToken`   | `/auth/refresh`         | POST   | Renovar token de autenticación       |
| `apiForgotPassword` | `/auth/forgot-password` | POST   | Solicitar recuperación de contraseña |
| `apiResetPassword`  | `/auth/reset-password`  | POST   | Restablecer contraseña               |
| `apiValidateToken`  | `/auth/validate-token`  | GET    | Validar token actual                 |

### 👥 Gestión de Usuarios (`/api/users`)

| Función Frontend    | Endpoint Backend        | Método | Descripción                 |
| ------------------- | ----------------------- | ------ | --------------------------- |
| `apiGetUsers`       | `/users`                | GET    | Listar todos los usuarios   |
| `apiGetUserById`    | `/users/:id`            | GET    | Obtener usuario específico  |
| `apiUpdateUser`     | `/users/:id`            | PUT    | Actualizar datos de usuario |
| `apiDeleteUser`     | `/users/:id`            | DELETE | Desactivar usuario          |
| `apiActivateUser`   | `/users/:id/activate`   | POST   | Reactivar usuario           |
| `apiDeactivateUser` | `/users/:id/deactivate` | POST   | Desactivar usuario          |
| `apiGetUserStats`   | `/users/stats/summary`  | GET    | Estadísticas de usuarios    |

### 🏨 Alojamientos (`/api/accommodations`)

| Función Frontend                    | Endpoint Backend                      | Método | Descripción                    |
| ----------------------------------- | ------------------------------------- | ------ | ------------------------------ |
| `apiGetAccommodations`              | `/accommodations`                     | GET    | Listar todos los alojamientos  |
| `apiGetAccommodationById`           | `/accommodations/:id`                 | GET    | Obtener alojamiento específico |
| `apiGetAccommodationsByLocation`    | `/accommodations/location/:location`  | GET    | Alojamientos por ubicación     |
| `apiCheckAccommodationAvailability` | `/accommodations/search/availability` | GET    | Verificar disponibilidad       |
| `apiUpdateAccommodation`            | `/accommodations/:id`                 | PUT    | Actualizar alojamiento         |

### 📅 Reservas (`/api/reservations`)

| Función Frontend         | Endpoint Backend                      | Método | Descripción                     |
| ------------------------ | ------------------------------------- | ------ | ------------------------------- |
| `apiGetReservations`     | `/reservations` & `/reservations/all` | GET    | Listar reservas (usuario/admin) |
| `apiGetReservationById`  | `/reservations/:id`                   | GET    | Obtener reserva específica      |
| `apiCreateReservation`   | `/reservations`                       | POST   | Crear nueva reserva             |
| `apiUpdateReservation`   | `/reservations/:id`                   | PUT    | Actualizar reserva              |
| `apiCancelReservation`   | `/reservations/:id`                   | DELETE | Cancelar reserva                |
| `apiGetReservationStats` | `/reservations/stats/summary`         | GET    | Estadísticas de reservas        |

### 💰 Precios (`/api/pricing`)

| Función Frontend             | Endpoint Backend             | Método | Descripción                         |
| ---------------------------- | ---------------------------- | ------ | ----------------------------------- |
| `apiGetPricingRates`         | `/pricing/rates`             | GET    | Obtener todas las tarifas           |
| `apiCalculatePricing`        | `/pricing/calculate`         | POST   | Calcular precio de estadía          |
| `apiGetDayTypes`             | `/pricing/day-types`         | GET    | Información sobre tipos de día      |
| `apiGetAccommodationPricing` | `/pricing/accommodation/:id` | GET    | Precios de alojamiento específico   |
| `apiComparePricing`          | `/pricing/compare`           | GET    | Comparar precios entre alojamientos |
| `apiGetLowestPrices`         | `/pricing/lowest`            | GET    | Encontrar precios más bajos         |

### 📧 Contacto (`/api/contact`)

| Función Frontend           | Endpoint Backend        | Método | Descripción                   |
| -------------------------- | ----------------------- | ------ | ----------------------------- |
| `apiSendContactMessage`    | `/contact/message`      | POST   | Enviar mensaje de contacto    |
| `apiGetContactMessages`    | `/contact/messages`     | GET    | Listar mensajes (admin/staff) |
| `apiGetContactMessageById` | `/contact/messages/:id` | GET    | Obtener mensaje específico    |
| `apiUpdateContactMessage`  | `/contact/messages/:id` | PUT    | Actualizar estado del mensaje |
| `apiGetContactStats`       | `/contact/stats`        | GET    | Estadísticas de mensajes      |
| `apiSendTestEmail`         | `/contact/email-test`   | POST   | Enviar email de prueba        |
| `apiSendTestSMS`           | `/contact/sms-test`     | POST   | Enviar SMS de prueba          |

### 🔔 Notificaciones (`/api/notifications`)

| Función Frontend                | Endpoint Backend               | Método | Descripción                           |
| ------------------------------- | ------------------------------ | ------ | ------------------------------------- |
| `apiGetNotifications`           | `/notifications`               | GET    | Obtener notificaciones del backoffice |
| `apiMarkNotificationAsRead`     | `/notifications/:id/read`      | PATCH  | Marcar notificación como leída        |
| `apiMarkAllNotificationsAsRead` | `/notifications/mark-all-read` | POST   | Marcar todas como leídas              |

### 📝 Solicitudes de Registro (`/api/registration-requests`)

| Función Frontend                | Endpoint Backend                     | Método | Descripción                    |
| ------------------------------- | ------------------------------------ | ------ | ------------------------------ |
| `apiGetRegistrationRequests`    | `/registration-requests`             | GET    | Listar solicitudes de registro |
| `apiApproveRegistrationRequest` | `/registration-requests/:id/approve` | POST   | Aprobar solicitud              |
| `apiRejectRegistrationRequest`  | `/registration-requests/:id/reject`  | POST   | Rechazar solicitud             |

## 🛠️ Uso del API Service

### Importación

```typescript
// Importar funciones específicas
import { apiLogin, apiGetUsers, apiCreateReservation } from "@/lib/api-service";

// O importar el objeto completo
import { apiService } from "@/lib/api-service";
```

### Ejemplos de Uso

```typescript
// Autenticación
const result = await apiLogin({ username: "user", password: "pass" });

// Obtener usuarios
const users = await apiService.getUsers();

// Crear reserva
const success = await apiService.createReservation({
  accommodationId: "apt-001",
  checkIn: "2024-01-15",
  checkOut: "2024-01-20",
  guests: 2,
});

// Calcular precios
const pricing = await apiService.calculatePricing(
  "apt-001",
  "2024-01-15",
  "2024-01-20",
  2,
);
```

## 🔧 Configuración

### Variables de Entorno

- `API_BASE_URL`: URL base del backend (por defecto: `/api`)
- `FRONTEND_URL`: URL del frontend para CORS

### Autenticación

El sistema utiliza tokens JWT almacenados en localStorage:

```typescript
// Token management
setAuthToken(token); // Guardar token
getAuthToken(); // Obtener token
clearAuthToken(); // Limpiar token
```

## 📈 Manejo de Errores

Todas las funciones API manejan errores de forma consistente:

```typescript
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
```

## 🔒 Seguridad

- Autenticación mediante JWT tokens
- Rate limiting configurado (100 req/15min general, 5 req/15min auth)
- Validación de permisos por rol (admin/staff/user)
- CORS configurado para desarrollo

## 📊 Monitoreo

- Health check disponible en `/health`
- Logging con Morgan
- Manejo de errores centralizado

## 🚀 Próximos Pasos

1. **Testing**: Implementar tests para todas las funciones API
2. **Caching**: Agregar cache para consultas frecuentes
3. **Optimización**: Implementar paginación y filtros avanzados
4. **Webhooks**: Agregar notificaciones en tiempo real
5. **Documentación**: Auto-generar documentación con Swagger
