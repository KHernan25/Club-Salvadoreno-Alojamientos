# Base de Datos Completa - Sistema Club Salvadoreño

## Índice

1. [Sistema de Usuarios](#sistema-de-usuarios)
2. [Sistema de Alojamientos](#sistema-de-alojamientos)
3. [Sistema de Precios y Reservas](#sistema-de-precios-y-reservas)
4. [Sistema de Contacto](#sistema-de-contacto)
5. [Sistema de Autenticación](#sistema-de-autenticación)
6. [Configuraciones y Utilidades](#configuraciones-y-utilidades)

---

## Sistema de Usuarios

### Interfaz User

```typescript
interface User {
  id: string;
  firstName: string;
  lastName: string;
  username: string;
  password: string; // En producción: hasheado
  email: string;
  phone: string;
  fullName: string;
  role: "admin" | "user" | "staff";
  isActive: boolean;
  lastLogin?: Date;
  createdAt: Date;
}
```

### Usuarios Registrados (Base)

#### Administradores

- **admin** / Admin123 / admin@clubsalvadoreno.com
- **gerente** / Gerente2024 / gerente@clubsalvadoreno.com

#### Staff

- **recepcion** / Recepcion123 / recepcion@clubsalvadoreno.com

#### Usuarios Regulares

- **usuario1** / Usuario123 / usuario1@email.com (María José González)
- **carlos.rivera** / Carlos2024 / carlos.rivera@email.com
- **ana.martinez** / Ana123456 / ana.martinez@email.com
- **jperez** / JuanP123 / juan.perez@email.com
- **demo** / demo123 / demo@clubsalvadoreno.com

#### Usuarios Inactivos

- **inactivo** / Inactivo123 / inactivo@email.com (Para testing)

### Interfaz de Nuevo Usuario

```typescript
interface NewUserData {
  firstName: string;
  lastName: string;
  email: string;
  documentType: string;
  documentNumber: string;
  memberCode: string;
  phone: string;
  password: string;
}
```

---

## Sistema de Alojamientos

### El Sunzal

#### Apartamentos (6 unidades)

- **1A**: 2 personas, Vista al mar, $110/$230/$280 (Sem/Fin/Fest)
- **1B**: 2 personas, Vista parcial, $95/$210/$250
- **2A**: 4 personas, Vista al mar premium, $120/$250/$300
- **2B**: 4 personas, Vista jardín, $115/$240/$290
- **3A**: 6 personas, Penthouse, $140/$280/$350
- **3B**: 6 personas, Vista lateral, $135/$270/$340

#### Casas (3 unidades)

- **Casa Surf Paradise**: 6 huéspedes, frente al mar, $200/$350/$400

  - Diseñada para surfistas
  - Almacenamiento para tablas
  - Ducha exterior
  - Acceso directo al break

- **Casa Familiar Deluxe**: 8 huéspedes, amplia, $280/$420/$480

  - Espacios familiares amplios
  - Cocina completamente equipada
  - Jardín privado
  - Área de BBQ

- **Casa Vista Panorámica**: 6 huéspedes, elevada, $240/$380/$450
  - Vista panorámica del océano
  - Terraza de múltiples niveles
  - Jacuzzi exterior
  - Zona de hamacas

#### Suites (16 unidades)

- **Suite Ejecutiva Presidencial**: 2 huéspedes, $650/$850/$750
- **Suite Presidencial Ocean View**: 2 huéspedes, $750/$950/$850
- **Suite Royal Penthouse**: 4 huéspedes, $850/$1150/$950
- **Suite Oceanfront Deluxe**: 2 huéspedes, $550/$750/$650
- **Suite Garden Villa**: 4 huéspedes, $600/$800/$700
- **Suite Beachfront Premium**: 2 huéspedes, $700/$900/$800
- **Suite Tropical Paradise**: 3 huéspedes, $580/$780/$680
- **Suite Infinity**: 2 huéspedes, $620/$820/$720
- **Suite Sunset**: 4 huéspedes, $640/$840/$740
- **Suite Horizon**: 2 huéspedes, $520/$720/$620
- **Suite Serenity**: 3 huéspedes, $560/$760/$660
- **Suite Zen**: 2 huéspedes, $540/$740/$640
- **Suite Paradise**: 4 huéspedes, $660/$860/$760
- **Suite Escape**: 2 huéspedes, $500/$700/$600
- **Suite Sanctuary**: 3 huéspedes, $590/$790/$690
- **Suite Tranquility**: 2 huéspedes, $570/$770/$670

### Corinto

#### Apartamentos (6 unidades)

- **corinto1A**: 2 personas, Vista lago, $100/$210/$260
- **corinto1B**: 2 personas, Vista parcial, $85/$190/$230
- **corinto2A**: 4 personas, Vista lago premium, $110/$230/$280
- **corinto2B**: 4 personas, Vista jardín, $105/$220/$270
- **corinto3A**: 6 personas, Penthouse, $130/$260/$320
- **corinto3B**: 6 personas, Vista lateral, $125/$250/$310

#### Casas (6 unidades)

- **corinto-casa-1 (Casa del Lago)**: 6 huéspedes, $280/$380/$420

  - Vista directa al lago
  - Jardín privado
  - Espacios familiares

- **corinto-casa-2 (Casa Ejecutiva Premium)**: 8 huéspedes, $350/$450/$500

  - Estilo corporativo moderno
  - Sala de reuniones
  - Oficina privada

- **corinto-casa-3 (Casa Rústica Tradicional)**: 4 huéspedes, $220/$320/$370

  - Arquitectura tradicional
  - Materiales locales
  - Ambiente acogedor

- **corinto-casa-4 (Casa Moderna Minimalista)**: 6 huéspedes, $260/$360/$410

  - Diseño contemporáneo
  - Líneas limpias
  - Tecnología integrada

- **corinto-casa-5 (Casa Familiar Grande)**: 10 huéspedes, $300/$400/$450

  - Espacios amplios
  - Múltiples áreas comunes
  - Cocina industrial

- **corinto-casa-6 (Casa Romántica)**: 2 huéspedes, $320/$420/$480
  - Ideal para parejas
  - Jacuzzi privado
  - Decoración elegante

---

## Sistema de Precios y Reservas

### Tipos de Día

```typescript
type DayType = "weekday" | "weekend" | "holiday";
```

- **Weekday**: Lunes a Viernes
- **Weekend**: Sábado y Domingo
- **Holiday**: Días feriados oficiales

### Días Feriados El Salvador 2025-2026

#### 2025

- 01/01 - Año Nuevo
- 28/03 - Jueves Santo
- 29/03 - Viernes Santo
- 30/03 - Sábado Santo
- 01/05 - Día del Trabajo
- 10/05 - Día de la Madre
- 17/06 - Día del Padre
- 06/08 - Día del Salvador del Mundo
- 15/09 - Día de la Independencia
- 02/11 - Día de los Difuntos
- 25/12 - Navidad

#### 2026

- 01/01 - Año Nuevo
- 17/04 - Jueves Santo
- 18/04 - Viernes Santo
- 19/04 - Sábado Santo
- 01/05 - Día del Trabajo
- 10/05 - Día de la Madre
- 17/06 - Día del Padre
- 06/08 - Día del Salvador del Mundo
- 15/09 - Día de la Independencia
- 02/11 - Día de los Difuntos
- 25/12 - Navidad

### Interfaz de Precios

```typescript
interface PricingRates {
  weekday: number;
  weekend: number;
  holiday: number;
}
```

### Cálculo de Precios

```typescript
interface PriceCalculation {
  totalDays: number;
  weekdayDays: number;
  weekendDays: number;
  holidayDays: number;
  weekdayTotal: number;
  weekendTotal: number;
  holidayTotal: number;
  totalPrice: number;
  breakdown: Array<{
    date: Date;
    dayType: "weekday" | "weekend" | "holiday";
    price: number;
  }>;
}
```

### Validaciones de Reserva

- Check-in mínimo: mañana
- Check-out posterior a check-in
- Máximo 7 días consecutivos
- Solo fechas futuras válidas

---

## Sistema de Contacto

### Servicios de Comunicación

#### Email

```typescript
interface EmailParams {
  to: string;
  resetToken: string;
  resetUrl: string;
}
```

#### SMS

```typescript
interface SMSParams {
  phone: string;
  code: string;
}
```

### Validaciones

- **Email**: Formato RFC estándar
- **Teléfono**: Formato salvadoreño (+503 XXXX-XXXX)
- **Token**: Alfanumérico aleatorio
- **Código SMS**: 6 dígitos numéricos

---

## Sistema de Autenticación

### Datos de Registro

```typescript
interface RegistrationData {
  firstName: string;
  lastName: string;
  email: string;
  documentType: string; // "dui" | "passport"
  documentNumber: string;
  memberCode: string;
  phone: string;
  password: string;
  confirmPassword: string;
  acceptTerms: boolean;
}
```

### Validaciones de Contraseña

- Mínimo 8 caracteres
- Al menos 1 minúscula
- Al menos 1 mayúscula
- Al menos 1 número

### Validaciones de Documento

- **DUI**: Formato 12345678-9
- **Pasaporte**: Mínimo 6 caracteres alfanuméricos

---

## Configuraciones y Utilidades

### API Mock

- Desarrollo: APIs simuladas
- Delays de red realistas
- Tasas de fallo configurables
- Logging detallado

### Formatos de Fecha

- **Input**: YYYY-MM-DD
- **Display**: Formato español largo
- **Timezone**: Local del navegador

### Formatos de Precio

- **Moneda**: USD
- **Formato**: $XXX (sin decimales para enteros)
- **Separador**: Coma para miles

### Roles de Usuario

- **admin**: Acceso completo al sistema
- **staff**: Acceso a operaciones diarias
- **user**: Acceso a reservas y perfil

### Estados de Usuario

- **isActive**: true/false
- **lastLogin**: Date opcional
- **createdAt**: Date obligatorio

---

## Estructura de Archivos de Datos

```
src/lib/
├── user-database.ts       # Base de usuarios y autenticación
├── pricing-system.ts      # Precios, fechas y cálculos
├── contact-services.ts    # Email y SMS
├── registration-service.ts # Registro de nuevos usuarios
├── auth-service.ts        # Servicios de autenticación
└── mock-api.ts           # APIs simuladas para desarrollo
```

### Datos Distribuidos

- **Alojamientos**: Definidos en componentes de páginas
- **Traducciones**: src/lib/i18n.ts
- **Validaciones**: Distribuidas por servicio
- **Estados**: React Context y localStorage

---

## Notas de Implementación

### Persistencia

- **Usuarios**: En memoria + localStorage para nuevos
- **Sesiones**: localStorage
- **Preferencias**: localStorage
- **Cache**: En memoria

### Seguridad

- Contraseñas en texto plano (⚠️ Solo desarrollo)
- Tokens de sesión temporales
- Validación lado cliente únicamente
- Sin encriptación de datos

### Escalabilidad

- Estructura preparada para BD real
- Interfaces definidas para APIs
- Separación de responsabilidades
- Mock APIs para desarrollo

### Estado de Desarrollo

✅ Sistema de usuarios completo
✅ Sistema de alojamientos completo  
✅ Sistema de precios funcionando
✅ Sistema de reservas básico
✅ Autenticación con roles
✅ Registro de usuarios
✅ Recuperación de contraseñas
✅ Validaciones completas
⚠️ Solo para desarrollo/demostración

---

Esta estructura de base de datos está diseñada para soportar todas las funcionalidades del sistema Club Salvadoreño, desde la gestión de usuarios hasta las reservas de alojamientos, con un enfoque en la experiencia de usuario y la escalabilidad futura.
