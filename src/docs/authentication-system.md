# Sistema de Autenticación

## Descripción General

El sistema de autenticación implementa validación real de usuarios registrados, con gestión de sesiones y control de acceso basado en roles.

## Características Implementadas

### ✅ **Autenticación Real**

- Validación de credenciales contra base de datos de usuarios
- Mensajes de error específicos (usuario no encontrado, contraseña incorrecta, cuenta desactivada)
- Estados de carga durante autenticación
- Prevención de acceso no autorizado

### ✅ **Gestión de Sesiones**

- Sesiones almacenadas en sessionStorage
- Opción "Recordarme" con localStorage
- Verificación automática de sesión al recargar
- Limpieza de sesión al logout

### ✅ **Control de Acceso**

- Rutas protegidas requieren autenticación
- Redirección automática si no está autenticado
- Prevención de acceso a login si ya está autenticado

## Usuarios Disponibles

### Administradores

```
Usuario: admin
Contraseña: Admin123
Rol: admin

Usuario: gerente
Contraseña: Gerente2024
Rol: admin
```

### Personal (Staff)

```
Usuario: recepcion
Contraseña: Recepcion123
Rol: staff
```

### Usuarios Regulares

```
Usuario: demo
Contraseña: demo123
Rol: user

Usuario: usuario1
Contraseña: Usuario123
Rol: user

Usuario: carlos.rivera
Contraseña: Carlos2024
Rol: user

Usuario: ana.martinez
Contraseña: Ana123456
Rol: user

Usuario: jperez
Contraseña: JuanP123
Rol: user
```

### Usuario de Prueba (Inactivo)

```
Usuario: inactivo
Contraseña: Inactivo123
Estado: Desactivado (no puede iniciar sesión)
```

## Arquitectura Técnica

### Archivos Principales

#### `src/lib/user-database.ts`

- Base de datos de usuarios registrados
- Funciones helper para búsqueda y validación
- Gestión de roles y estados de usuario

#### `src/lib/auth-service.ts`

- Servicio principal de autenticación
- Gestión de sesiones y localStorage
- Verificación de permisos por rol
- Funciones de login/logout

#### `src/pages/Login.tsx`

- Interfaz de inicio de sesión
- Validación en tiempo real
- Estados de carga y error
- Helper de credenciales para desarrollo

#### `src/components/RouteGuard.tsx`

- Protección de rutas
- Redirección automática
- Verificación de autenticación

## Estados de Autenticación

### Sin Autenticar

- Solo puede acceder a rutas públicas: `/`, `/login`, `/register`, `/forgot-password`, `/reset-password`
- Intento de acceso a rutas protegidas redirige al login

### Autenticado

- Acceso a todas las rutas de la aplicación
- Información del usuario visible en la navbar
- Opción de logout disponible

### Roles de Usuario

#### Admin

- Acceso completo al sistema
- Badge "Admin" visible en la navbar
- Permisos nivel 3 en jerarquía

#### Staff

- Acceso a funciones de personal
- Permisos nivel 2 en jerarquía

#### User

- Acceso a funciones básicas
- Permisos nivel 1 en jerarquía

## Flujo de Autenticación

### 1. Login

```
Usuario ingresa credenciales →
Validación en auth-service →
Verificación en user-database →
Creación de sesión →
Redirección al dashboard
```

### 2. Verificación de Sesión

```
Carga de página →
RouteGuard verifica autenticación →
Si no está autenticado y ruta protegida →
Redirección al login
```

### 3. Logout

```
Usuario hace clic en "Cerrar Sesión" →
Limpieza de sessionStorage y localStorage →
Redirección al login
```

## Validaciones Implementadas

### Credenciales

- ✅ Usuario y contraseña no vacíos
- ✅ Usuario existe en base de datos
- ✅ Contraseña correcta
- ✅ Cuenta activa

### Sesión

- ✅ Verificación de sesión válida
- ✅ Manejo de expiración (preparado para implementar)
- ✅ Limpieza automática de sesiones inválidas

## Seguridad

### Almacenamiento

- **sessionStorage**: Sesión actual (se borra al cerrar navegador)
- **localStorage**: Solo si "Recordarme" está activado
- **Datos sensibles**: No se almacenan passwords en cliente

### Validaciones

- Verificación server-side simulada con delay
- Mensajes de error que no revelan información sensible
- Prevención de acceso directo a rutas protegidas

## Desarrollo y Testing

### Helper de Credenciales

En modo desarrollo, la página de login muestra un helper expandible con credenciales válidas para facilitar las pruebas.

### Logging

```javascript
// Login exitoso
console.log("User authenticated:", user.username, user.role);

// Error de autenticación
console.log("Authentication failed:", errorMessage);
```

### Estados de Testing

- Usuarios activos e inactivos
- Diferentes roles para probar permisos
- Credenciales fáciles de recordar

## Personalización

### Agregar Nuevos Usuarios

Editar `src/lib/user-database.ts`:

```typescript
{
  id: "10",
  username: "nuevo.usuario",
  password: "Password123",
  email: "nuevo@email.com",
  phone: "+503 1234-5678",
  fullName: "Nuevo Usuario",
  role: "user",
  isActive: true,
  createdAt: new Date(),
}
```

### Modificar Validaciones

Editar funciones en `src/lib/auth-service.ts`:

```typescript
// Ejemplo: Agregar validación de tiempo de expiración
export const isSessionValid = (): boolean => {
  const session = getCurrentSession();
  if (!session) return false;

  const now = new Date();
  const loginTime = new Date(session.loginTime);
  const hoursElapsed = (now.getTime() - loginTime.getTime()) / (1000 * 60 * 60);

  // Expirar después de 8 horas
  return hoursElapsed < 8;
};
```

### Personalizar Mensajes

Los mensajes de error y éxito se pueden personalizar en `authenticateUser()` en `auth-service.ts`.

## Migración a Producción

### Backend Integration

Para usar con una API real, reemplazar la validación local:

```typescript
export const authenticateUser = async (
  credentials: LoginCredentials,
): Promise<AuthResult> => {
  const response = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
  });

  if (!response.ok) {
    return { success: false, error: "Credenciales inválidas" };
  }

  const { user, token } = await response.json();

  // Almacenar token JWT
  localStorage.setItem("auth_token", token);

  return { success: true, user };
};
```

### Variables de Entorno

```env
REACT_APP_API_URL=https://api.clubsalvadoreno.com
REACT_APP_AUTH_ENDPOINT=/auth/login
REACT_APP_SESSION_TIMEOUT=28800000  # 8 horas en ms
```

## Troubleshooting

### Problemas Comunes

#### Usuario no puede iniciar sesión

1. Verificar que las credenciales sean exactas (case-sensitive)
2. Verificar que la cuenta esté activa (`isActive: true`)
3. Revisar console para mensajes de error

#### Sesión se pierde al recargar

1. Verificar que sessionStorage esté habilitado
2. Si usó "Recordarme", verificar localStorage
3. Comprobar que no haya errores en RouteGuard

#### Redirección infinita

1. Verificar que las rutas públicas estén correctamente definidas
2. Comprobar que la validación de autenticación no tenga errores
3. Revisar console para loops en useEffect

### Debugging

```javascript
// En consola del navegador
// Verificar sesión actual
console.log(JSON.parse(sessionStorage.getItem("club_salvadoreno_session")));

// Verificar remember me
console.log(JSON.parse(localStorage.getItem("club_salvadoreno_remember")));

// Limpiar sesión manualmente
sessionStorage.clear();
localStorage.clear();
```
