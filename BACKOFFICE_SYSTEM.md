# Sistema de Backoffice - Club Salvadoreño

## Descripción General

El sistema de backoffice es un panel administrativo completo que permite a los empleados del Club Salvadoreño gestionar todos los aspectos del sistema de reservas, desde la aprobación de usuarios hasta la administración de alojamientos, reservas y calendario.

## Características Principales

### 1. Gestión de Usuarios

- **Aprobación de registros**: Los nuevos usuarios requieren aprobación administrativa
- **Activación/desactivación** de cuentas
- **Gestión de roles**: user, staff, admin
- **Visualización de actividad** y últimos accesos
- **Búsqueda y filtrado** por estado, rol, nombre

### 2. Gestión de Alojamientos

- **Actualización de información**: descripción, capacidad, amenidades
- **Gestión de precios**: por tipo de día (semana, fin de semana, festivo)
- **Subida de imágenes**: múltiples fotos por alojamiento
- **Control de disponibilidad**: activar/desactivar alojamientos
- **Filtrado por ubicación** y tipo

### 3. Gestión de Reservas

- **Creación de reservas** en nombre de usuarios
- **Modificación de reservas** existentes
- **Cancelación y reembolsos**
- **Cambio de estados**: pendiente, confirmada, cancelada, completada
- **Gestión de pagos**: pendiente, pagado, reembolsado
- **Búsqueda por código**, huésped o alojamiento

### 4. Calendario y Bloqueos

- **Vista de calendario** interactiva
- **Bloqueo de fechas** por mantenimiento, eventos o motivos especiales
- **Gestión de disponibilidad** por alojamiento
- **Notas y motivos** para cada bloqueo
- **Filtrado por alojamiento**

### 5. Dashboard Ejecutivo

- **Estadísticas en tiempo real**: usuarios, reservas, ingresos
- **Actividad reciente** del sistema
- **Próximas llegadas** y salidas
- **Notificaciones** de pendientes
- **Acciones rápidas**

## Integración con API

### Autenticación Híbrida

El sistema utiliza una estrategia híbrida de autenticación:

```typescript
// Primero intenta con API real
const apiConnected = await isApiAvailable();
if (apiConnected) {
  const result = await apiLogin(credentials);
  // Procesar respuesta de API
} else {
  // Fallback a datos locales para desarrollo
  const user = isValidUser(username, password);
}
```

### Endpoints Utilizados

- **Autenticación**: `/api/auth/login`, `/api/auth/logout`
- **Usuarios**: `/api/users`, `/api/users/:id/activate`
- **Alojamientos**: `/api/accommodations`, `/api/accommodations/:id`
- **Reservas**: `/api/reservations`, `/api/reservations/:id`
- **Precios**: `/api/pricing/rates`, `/api/pricing/calculate`

## Estructura de Archivos

```
src/
├── lib/
│   ├── api-service.ts           # Integración con API real
│   ├── auth-service.ts          # Autenticación híbrida
│   └── registration-service.ts  # Registro con aprobación
├── components/
│   ├── AdminLayout.tsx          # Layout del backoffice
│   └── AdminProtectedRoute.tsx  # Protección de rutas
├── pages/
│   ├── AdminDashboard.tsx       # Dashboard principal
│   ├── AdminUsers.tsx           # Gestión de usuarios
│   ├── AdminAccommodations.tsx  # Gestión de alojamientos
│   ├── AdminReservations.tsx    # Gestión de reservas
│   └── AdminCalendar.tsx        # Calendario y bloqueos
```

## Sistema de Roles y Permisos

### Roles Disponibles

1. **Admin**: Acceso completo a todas las funciones
2. **Staff**: Acceso a operaciones diarias (sin configuración avanzada)
3. **User**: Solo acceso al sistema público

### Protección de Rutas

```typescript
<AdminProtectedRoute requiredRole="staff">
  <AdminDashboard />
</AdminProtectedRoute>
```

### Navegación por Rol

- **Administradores**: Acceso completo al backoffice
- **Personal**: Acceso limitado (sin gestión de precios ni configuración)
- **Usuarios**: Redirección al dashboard público

## Flujo de Aprobación de Usuarios

### 1. Registro

```typescript
// Usuario se registra
const result = await registerUser(userData);
// Estado inicial: "pending"
```

### 2. Notificación

- El sistema muestra una notificación de registro pendiente
- Los administradores ven el usuario en la lista de pendientes

### 3. Aprobación

```typescript
// Admin aprueba el usuario
await apiActivateUser(userId);
// Estado cambia a: "active"
```

### 4. Notificación al Usuario

- Se puede enviar email de confirmación (pendiente de implementar)
- El usuario puede iniciar sesión normalmente

## Características de Seguridad

### Autenticación

- **JWT Tokens** para API real
- **SessionStorage/LocalStorage** para persistencia
- **Verificación de expiración** automática

### Autorización

- **Verificación de roles** en cada ruta
- **Middleware de permisos** en componentes
- **Redirección automática** para usuarios sin permisos

### Validación

- **Validación de entrada** en todos los formularios
- **Sanitización de datos** antes de envío
- **Manejo de errores** consistente

## Desarrollo y Testing

### Datos Mock

Cuando la API no está disponible, el sistema utiliza datos mock:

```typescript
const getMockUsers = () => [
  { id: "1", name: "Admin", role: "admin", status: "active" },
  { id: "2", name: "User", role: "user", status: "pending" },
];
```

### Estado de Conexión

El sistema muestra el estado de conexión con la API:

```typescript
const [apiConnected, setApiConnected] = useState(false);
// Muestra banner de "modo desarrollo" si no hay conexión
```

## Acceso al Sistema

### URLs del Backoffice

- **Dashboard**: `/admin/dashboard`
- **Usuarios**: `/admin/users`
- **Alojamientos**: `/admin/accommodations`
- **Reservas**: `/admin/reservations`
- **Calendario**: `/admin/calendar`

### Acceso desde Navbar

Los usuarios con rol `admin` o `staff` ven la opción "Panel Administrativo" en el menú de usuario.

### Credenciales de Prueba

```
Admin:
- Usuario: admin
- Contraseña: Admin123

Staff:
- Usuario: recepcion
- Contraseña: Recepcion123
```

## Próximas Mejoras

### Funcionalidades Pendientes

1. **Gestión de precios avanzada** con temporadas
2. **Sistema de notificaciones** push
3. **Reportes y analytics** detallados
4. **Backup y restauración** de datos
5. **Logs de auditoría** completos

### Integraciones Futuras

1. **Email automático** para aprobaciones
2. **SMS notifications** para reservas
3. **Procesamiento de pagos** real
4. **Integración con calendar** externo
5. **Sistema de reviews** y ratings

## Soporte y Mantenimiento

### Monitoreo

- **Health checks** automáticos de API
- **Logs de errores** detallados
- **Métricas de uso** del sistema

### Backup

- **Datos de usuario** en localStorage como respaldo
- **Sincronización automática** cuando la API esté disponible
- **Validación de integridad** de datos

### Actualización

- **Versionado semántico** de cambios
- **Migración de datos** automática
- **Compatibilidad hacia atrás** mantenida

Este sistema de backoffice proporciona una solución completa y robusta para la administración del Club Salvadoreño, con integración real con la API y funcionalidades avanzadas para la gestión diaria del negocio.
