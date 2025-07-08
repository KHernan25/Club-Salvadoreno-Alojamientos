# Implementación de Reglas de Negocio - Sistema de Reservas Club Salvadoreño

## Resumen

Este documento describe la implementación completa de las reglas de negocio para el sistema de reservas del Club Salvadoreño, basadas en las políticas oficiales proporcionadas.

## Estructura de la Implementación

### 1. Archivos Principales

- **`src/lib/business-rules.ts`**: Configuración central de todas las reglas de negocio
- **`src/lib/reservation-validation-service.ts`**: Servicio de validación que aplica las reglas
- **`src/components/BusinessRulesInfo.tsx`**: Componente UI para mostrar reglas al usuario
- **`src/components/ReservationValidationFeedback.tsx`**: Componente de retroalimentación de validación
- **`src/server/routes/reservations.ts`**: Endpoints actualizados con validación de reglas

### 2. Tipos de Usuario y Reglas Aplicadas

#### Miembros Regulares

```typescript
{
  maxConsecutiveDays: 7,
  maxReservationsPerMember: 1, // solo una reserva por fin de semana
  checkInTime: "15:00",
  checkOutTime: "12:00",
  paymentTimeLimit: 72,
  modificationNoticePeriod: 72,
  allowedDays: ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"]
}
```

#### Viudas y Visitadores Especiales/Transeúntes

```typescript
{
  maxConsecutiveDays: 7,
  maxReservationsPerMember: 1,
  checkInTime: "15:00",
  checkOutTime: "12:00",
  paymentTimeLimit: 72,
  modificationNoticePeriod: 72,
  allowedDays: ["monday", "tuesday", "wednesday", "thursday", "friday"], // solo entre semana
  weekendReservationAdvanceNotice: 3 // pueden reservar fin de semana con 3 días de anticipación
}
```

#### Directores de JCD

```typescript
{
  maxConsecutiveDays: 3,
  maxReservationsPerMember: 3, // una por cada lugar por mes
  maxReservationsPerMonth: 3,
  maxDaysPerReservation: 3,
  checkInTime: "15:00",
  checkOutTime: "12:00",
  paymentTimeLimit: 72,
  modificationNoticePeriod: 72,
  allowedDays: ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"],
  freeReservationPeriods: ["non_holiday", "non_vacation"],
  exemptFromPayment: false // depende del período
}
```

#### Visitadores Juveniles

- **Restricción total**: No pueden reservar directamente
- Solo el miembro titular (padre/madre) puede reservar

## Reglas de Negocio Implementadas

### 1. Políticas de Reserva

#### Restricciones por Tipo de Usuario

- ✅ **Viudas y visitadores**: Solo entre semana, fines de semana con 3 días de anticipación
- ✅ **Visitadores juveniles**: No pueden reservar directamente
- ✅ **Directores**: Máximo 3 días por reserva, 3 reservas mensuales
- ✅ **Límite general**: Máximo 7 días consecutivos

#### Horarios

- ✅ **Check-in**: 3:00 PM (2:00 PM para suites)
- ✅ **Check-out**: 12:00 MD (1:00 PM para suites)

#### Límites de Reservas

- ✅ **Miembros**: Solo una reserva por fin de semana
- ✅ **Directores**: Una reserva por ubicación por mes
- ✅ **Disponibilidad directores**: Máximo 1 director por ubicación por temporada

### 2. Políticas de Pago

#### Tiempo Límite

- ✅ **72 horas** para completar el pago después de solicitar la reserva
- ✅ **Cancelación automática** si no se paga en el plazo

#### Exenciones para Directores

- ✅ **Exento de pago** excepto en feriados y vacaciones
- ✅ **Validación automática** de períodos exentos

### 3. Políticas de Modificación

#### Traslado de Fecha

- ✅ **72 horas de anticipación** para reprogramar
- ✅ **Casos excepcionales**: Enfermedad, duelo o emergencia comprobada requieren aprobación del Gerente General

#### Transferencias

- ✅ **Prohibidas completamente**: Las reservas no son transferibles entre miembros

### 4. Políticas de Entrega de Llaves

#### Autorización

- ✅ **Solo al Miembro Titular**
- ✅ **Autorización escrita** para esposa, madre o hijos
- ✅ **Validación de familiares autorizados**

### 5. Uso Exclusivo

#### Restricciones

- ✅ **Solo miembro titular y núcleo familiar**
- ✅ **No transferible a terceros**
- ✅ **Validación de uso exclusivo**

## Funcionalidades del Sistema

### 1. Validación en Tiempo Real

```typescript
// Ejemplo de uso del servicio de validación
const validationService = new ReservationValidationService(reservations, users);

const validation = validationService.validateNewReservation(
  userId,
  accommodationId,
  accommodationType,
  checkIn,
  checkOut,
);

if (!validation.valid) {
  // Mostrar errores de reglas de negocio
  console.log(validation.errors);
}
```

### 2. API Endpoints

#### Validación de Nueva Reserva

```
POST /api/reservations
- Incluye validación completa de reglas de negocio
- Retorna información de pago y exenciones
- Proporciona advertencias y errores específicos
```

#### Información de Reglas de Usuario

```
GET /api/reservations/business-rules
- Retorna resumen de reglas aplicables al usuario
- Incluye límites, horarios y restricciones específicas
```

#### Validación de Modificaciones

```
POST /api/reservations/:id/validate-modification
- Valida cambios de fecha con reglas de anticipación
- Maneja casos de emergencia
```

#### Validación de Cancelaciones

```
POST /api/reservations/:id/validate-cancellation
- Verifica períodos de notificación
- Reglas específicas para directores
```

#### Validación de Entrega de Llaves

```
POST /api/reservations/:id/validate-key-handover
- Verifica autorización del receptor
- Valida cartas de autorización
```

### 3. Componentes de UI

#### BusinessRulesInfo

- Modal informativo con todas las reglas del usuario
- Categorización por tipo de usuario
- Información detallada de políticas

#### ReservationValidationFeedback

- Retroalimentación en tiempo real durante reserva
- Alertas diferenciadas por tipo (error, advertencia, info)
- Información de pago y exenciones

### 4. Casos de Uso Específicos

#### Escenario 1: Viuda intentando reservar fin de semana

```typescript
// El sistema valida automáticamente:
// 1. ¿Es fin de semana? → Sí
// 2. ¿Tiene 3+ días de anticipación? → Verificar
// 3. Si no cumple → Error, si cumple → Advertencia de autorización especial
```

#### Escenario 2: Director haciendo segunda reserva del mes

```typescript
// El sistema valida:
// 1. ¿Ya tiene reserva en esta ubicación este mes? → Verificar
// 2. ¿Ha llegado al límite de 3 reservas mensuales? → Verificar
// 3. ¿Es período exento de pago? → Determinar automáticamente
```

#### Escenario 3: Visitador juvenil intentando reservar

```typescript
// El sistema bloquea inmediatamente:
// - Error: "Los visitadores juveniles no pueden reservar directamente"
// - Sugerencia: "Solo el miembro titular (padre/madre) puede reservar"
```

### 5. Integración con Sistema Existente

#### Compatibilidad

- ✅ **Mantiene sistema de precios existente**
- ✅ **Compatible con calendario de disponibilidad**
- ✅ **Integra con autenticación actual**
- ✅ **Preserva flujo de pago existente**

#### Mejoras Añadidas

- ✅ **Validación proactiva antes de reservar**
- ✅ **Información clara de reglas aplicables**
- ✅ **Manejo de casos especiales y emergencias**
- ✅ **Trazabilidad de decisiones de reglas de negocio**

## Configuración y Mantenimiento

### 1. Modificar Reglas

Las reglas se pueden modificar editando el archivo `src/lib/business-rules.ts`:

```typescript
export const businessRulesByUserType = {
  miembro: {
    // Modificar aquí las reglas para miembros
  },
  // ... otros tipos
};
```

### 2. Agregar Nuevos Tipos de Usuario

1. Añadir el tipo en la interfaz `UserType`
2. Definir reglas en `businessRulesByUserType`
3. Actualizar validaciones en el servicio
4. Modificar componentes UI si es necesario

### 3. Períodos Especiales

Los feriados y períodos especiales se configuran en `src/lib/pricing-system.ts`:

```typescript
export const holidays2025: string[] = [
  "2025-01-01", // Año Nuevo
  // ... otros feriados
];
```

## Testing y Validación

### 1. Casos de Prueba Implementados

- ✅ Validación de límites de días consecutivos
- ✅ Restricciones de días de la semana por tipo de usuario
- ✅ Cálculo de anticipación para fines de semana
- ✅ Límites de reservas mensuales para directores
- ✅ Exenciones de pago automáticas
- ✅ Validación de transferencias (siempre prohibidas)

### 2. Escenarios de Error Manejados

- ✅ Usuario inactivo o no encontrado
- ✅ Tipo de usuario no válido
- ✅ Conflictos de fechas con reservas existentes
- ✅ Violaciones de reglas de anticipación
- ✅ Exceso de límites de reservas

## Conclusión

La implementación proporciona un sistema robusto y completo de validación de reglas de negocio que:

1. **Cumple completamente** con todas las políticas especificadas
2. **Proporciona retroalimentación clara** a los usuarios
3. **Maneja casos especiales** y emergencias apropiadamente
4. **Es extensible** para futuras modificaciones de reglas
5. **Mantiene compatibilidad** con el sistema existente
6. **Mejora la experiencia de usuario** con validación proactiva

El sistema está listo para producción y puede manejar todos los escenarios de uso definidos en las reglas de negocio del Club Salvadoreño.
