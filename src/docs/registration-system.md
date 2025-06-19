# Sistema de Registro de Usuarios

## Descripción General

El sistema de registro permite que nuevos usuarios se registren en la aplicación y automáticamente puedan iniciar sesión con sus credenciales. Los usuarios registrados se almacenan localmente y se integran completamente con el sistema de autenticación existente.

## Funcionalidades Implementadas

### ✅ **Registro Real de Usuarios**

- Formulario completo de registro con validaciones
- Guardado permanente de usuarios en localStorage
- Integración con sistema de autenticación existente
- Login automático después del registro exitoso

### ✅ **Validaciones Robustas**

- **Email**: Formato RFC válido y verificación de duplicados
- **Contraseña**: Mínimo 8 caracteres, mayúscula, minúscula, número
- **Teléfono**: Formato salvadoreño (+503 1234-5678)
- **Documento**: Validación de DUI (12345678-9) y pasaporte
- **Términos**: Obligatorio aceptar términos y condiciones

### ✅ **Generación Automática de Datos**

- Username generado desde el email (parte antes del @)
- ID único autogenerado
- Rol "user" asignado por defecto
- Fecha de creación automática

## Arquitectura Técnica

### Archivos Principales

#### `src/lib/registration-service.ts`

```typescript
// Servicio principal de registro
export const registerUser = async (
  registrationData: RegistrationData,
): Promise<RegistrationResult>

// Validaciones específicas
export const validateEmail = (email: string): string | null
export const validatePassword = (password: string): string | null
export const validatePhone = (phone: string): string | null
```

#### `src/lib/user-database.ts` (Actualizado)

```typescript
// Nuevas funciones para usuarios registrados
export const registerNewUser = (userData: NewUserData): { success: boolean; user?: User; error?: string }
export const getRegisteredUsers = (): User[]
export const isUsernameAvailable = (username: string): boolean
export const isEmailAvailable = (email: string): boolean
```

#### `src/pages/Register.tsx` (Actualizado)

- Formulario completo con validación en tiempo real
- Estados de carga y error
- Mensaje de éxito con redirección automática
- Verificación de sesión existente

### Flujo de Registro

```
Usuario llena formulario →
Validaciones del frontend →
Verificación de duplicados →
Creación de nuevo usuario →
Guardado en localStorage →
Login automático →
Redirección al dashboard
```

## Almacenamiento de Datos

### LocalStorage Key

```
"club_salvadoreno_registered_users"
```

### Estructura de Datos

```typescript
interface User {
  id: string; // Auto-generado (10, 11, 12...)
  username: string; // Generado desde email
  password: string; // Texto plano (desarrollo)
  email: string; // Email del usuario
  phone: string; // Teléfono formateado
  fullName: string; // "Nombre Apellidos"
  role: "user"; // Siempre "user" para registrados
  isActive: boolean; // Siempre true
  createdAt: Date; // Fecha de registro
}
```

## Validaciones Implementadas

### Email

- ✅ Formato RFC válido
- ✅ No puede estar duplicado
- ✅ Se convierte a lowercase

### Contraseña

- ✅ Mínimo 8 caracteres
- ✅ Al menos una letra minúscula
- ✅ Al menos una letra mayúscula
- ✅ Al menos un número
- ✅ Confirmación de contraseña

### Teléfono

- ✅ Formato: `+503 1234-5678` o `1234-5678`
- ✅ Acepta espacios y guiones opcionales
- ✅ Se formatea automáticamente

### Documento de Identidad

#### DUI Salvadoreño

- ✅ Formato: `12345678-9`
- ✅ 8 dígitos + guión + 1 dígito verificador

#### Pasaporte

- ✅ Mínimo 6 caracteres alfanuméricos

### Términos y Condiciones

- ✅ Obligatorio aceptar para continuar
- ✅ Botón deshabilitado hasta aceptar

## Componente de Desarrollo

### `DevRegisteredUsers`

Componente flotante visible solo en desarrollo que permite:

- **Ver usuarios registrados**: Lista completa con credenciales
- **Refrescar datos**: Actualizar lista después de nuevos registros
- **Limpiar todo**: Eliminar todos los usuarios registrados
- **Credenciales visibles**: Username y password para testing

#### Ubicación

- Botón flotante en esquina inferior derecha
- Solo visible en `process.env.NODE_ENV === "development"`
- Incluido automáticamente en la página de Login

## Integración con Autenticación

### Usuario Registrado → Login

```typescript
// Proceso automático después del registro
const username = email.split("@")[0]; // ej: "juan.perez"
const loginResult = await authenticateUser({
  username,
  password,
  rememberMe: false,
});
```

### Búsqueda de Usuarios

Las funciones de autenticación ahora buscan en:

1. **Usuarios predefinidos** (admin, demo, etc.)
2. **Usuarios registrados** (almacenados en localStorage)

## Casos de Uso

### Registro Exitoso

```
1. Usuario llena formulario
2. Validaciones pasan
3. Email y username únicos
4. Usuario se guarda en localStorage
5. Login automático
6. Redirección a /dashboard
```

### Error de Duplicado

```
1. Usuario intenta registrarse con email existente
2. Sistema detecta duplicado
3. Muestra error: "Este correo electrónico ya está registrado"
4. Usuario puede corregir y reintentar
```

### Error de Validación

```
1. Usuario ingresa contraseña débil
2. Sistema valida formato
3. Muestra error específico: "La contraseña debe contener..."
4. Usuario corrige y reintenta
```

## Testing y Desarrollo

### Credenciales Generadas

Después de registrar un usuario con email `juan.perez@email.com`:

```
Username: juan.perez
Password: [la que ingresó el usuario]
Email: juan.perez@email.com
Role: user
```

### Verificación Manual

```javascript
// En consola del navegador
const users = JSON.parse(
  localStorage.getItem("club_salvadoreno_registered_users"),
);
console.log("Usuarios registrados:", users);
```

### Limpiar Datos de Prueba

```javascript
// Limpiar todos los usuarios registrados
localStorage.removeItem("club_salvadoreno_registered_users");
```

## Seguridad y Producción

### Consideraciones Actuales

- **Contraseñas en texto plano**: Solo para desarrollo
- **Almacenamiento local**: Los datos no persisten entre dispositivos
- **No hay verificación de email**: Registro inmediato

### Para Producción

#### Backend Integration

```typescript
export const registerUser = async (data: RegistrationData) => {
  const response = await fetch("/api/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    return { success: false, error: error.message };
  }

  const { user, token } = await response.json();
  return { success: true, user };
};
```

#### Seguridad Recomendada

- **Hash de contraseñas**: bcrypt o similar
- **Verificación de email**: Envío de código de confirmación
- **Rate limiting**: Prevenir spam de registros
- **Validación server-side**: Duplicar todas las validaciones
- **Tokens JWT**: Para autenticación stateless

### Variables de Entorno

```env
REACT_APP_API_URL=https://api.clubsalvadoreno.com
REACT_APP_REGISTRATION_ENDPOINT=/auth/register
REACT_APP_EMAIL_VERIFICATION=true
```

## Troubleshooting

### Problemas Comunes

#### Usuario no puede registrarse

1. **Verificar validaciones**: ¿Pasan todas las validaciones?
2. **Email duplicado**: ¿Ya existe el email?
3. **Términos**: ¿Está marcado "Aceptar términos"?
4. **Console errors**: Revisar consola del navegador

#### Usuario registrado no puede hacer login

1. **Username correcto**: Usar la parte del email antes del @
2. **Contraseña exacta**: Case-sensitive
3. **LocalStorage**: Verificar que el usuario esté guardado
4. **Función de búsqueda**: Verificar `findUserByUsername`

#### Datos no persisten

1. **LocalStorage lleno**: Verificar espacio disponible
2. **Modo incógnito**: No persiste entre sesiones
3. **Diferentes dominios**: LocalStorage es por dominio

### Debugging

```javascript
// Verificar usuarios registrados
console.log(
  "Registered:",
  localStorage.getItem("club_salvadoreno_registered_users"),
);

// Verificar proceso de registro
console.log("Registration result:", registrationResult);

// Verificar función de búsqueda
import { findUserByUsername } from "./lib/user-database";
console.log("Find user:", findUserByUsername("juan.perez"));
```

## Mejoras Futuras

### Características Planeadas

- **Verificación por email**: Código de confirmación
- **Recuperación de contraseña**: Para usuarios registrados
- **Edición de perfil**: Actualizar datos después del registro
- **Roles dinámicos**: Permitir cambio de roles
- **Importar/Exportar**: Backup de usuarios registrados

### Optimizaciones

- **Compresión**: Comprimir datos en localStorage
- **Limpieza automática**: Eliminar usuarios inactivos
- **Validación async**: Verificaciones server-side
- **Notificaciones**: Emails de bienvenida
