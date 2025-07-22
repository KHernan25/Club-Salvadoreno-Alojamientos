# 📧 Sistema de Notificaciones - Guía de Configuración

Este documento describe cómo configurar completamente el sistema de notificaciones del Club Salvadoreño, incluyendo emails, SMS y todas las funcionalidades implementadas.

## 🚀 Configuración Inicial

### 1. Variables de Entorno

Actualiza tu archivo `.env` con las siguientes configuraciones:

```bash
# ==============================================
# CONFIGURACIÓN DE EMAIL (NODEMAILER)
# ==============================================

# Configuración del servidor de correo
EMAIL_HOST=mail.clubsalvadoreno.com
EMAIL_PORT=465
EMAIL_USER=tu_usuario@clubsalvadoreno.com
EMAIL_PASSWORD=tu_contraseña_secura
EMAIL_FROM="Club Salvadoreño <noreply@clubsalvadoreno.com>"

# ==============================================
# CONFIGURACIÓN DE SMS (TWILIO)
# ==============================================

# Configuración de Twilio para SMS
TWILIO_ACCOUNT_SID=tu_account_sid_de_twilio
TWILIO_AUTH_TOKEN=tu_auth_token_de_twilio
TWILIO_PHONE_NUMBER=+1234567890

# ==============================================
# CONFIGURACIÓN DE FRONTEND
# ==============================================

# URL del frontend para enlaces en emails
FRONTEND_URL=http://localhost:8080

# ==============================================
# CONFIGURACIÓN DE BASE DE DATOS
# ==============================================

# El sistema creará automáticamente las tablas necesarias:
# - password_reset_tokens
# - notification_preferences
```

### 2. Instalación de Dependencias

Asegúrate de que las siguientes dependencias están instaladas:

```bash
npm install nodemailer twilio
npm install --save-dev @types/nodemailer
```

## 📧 Configuración de Email

### Proveedores de Email Compatibles

El sistema utiliza Nodemailer y es compatible con:

- **SMTP del servidor actual** (configurado)
- **Gmail SMTP**
- **Outlook/Hotmail**
- **SendGrid**
- **Mailgun**
- **Amazon SES**

### Ejemplo para Gmail (desarrollo):

```bash
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=tu_email@gmail.com
EMAIL_PASSWORD=tu_app_password
EMAIL_FROM="Club Salvadoreño <tu_email@gmail.com>"
```

### Ejemplo para SendGrid:

```bash
EMAIL_HOST=smtp.sendgrid.net
EMAIL_PORT=587
EMAIL_USER=apikey
EMAIL_PASSWORD=tu_sendgrid_api_key
EMAIL_FROM="Club Salvadoreño <noreply@clubsalvadoreno.com>"
```

## 📱 Configuración de SMS (Twilio)

### 1. Crear Cuenta en Twilio

1. Ve a [twilio.com](https://www.twilio.com)
2. Crea una cuenta
3. Obtén tu Account SID y Auth Token
4. Compra un número de teléfono para envío de SMS

### 2. Configurar Variables

```bash
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_PHONE_NUMBER=+15551234567
```

### 3. Verificación de Números (Desarrollo)

En modo desarrollo, Twilio requiere verificar números de destino. Para producción, esto no es necesario.

## 🛠️ Funcionalidades Implementadas

### 1. Recuperación de Contraseña

- ✅ Email con enlace de recuperación
- ✅ SMS con código de verificación
- ✅ Tokens seguros con expiración
- ✅ Validación de tokens

### 2. Notificaciones de Cuenta

- ✅ Email de bienvenida
- ✅ Notificación de aprobación de cuenta
- ✅ Notificación de rechazo de cuenta

### 3. Notificaciones de Reservas

- ✅ Confirmación de reserva
- ✅ Recordatorio de check-in
- ✅ Cancelación de reserva
- ✅ Modificación de reserva

### 4. Notificaciones de Pagos

- ✅ Recordatorio de pago
- ✅ Confirmación de pago
- ✅ Fallo en el pago

### 5. Notificaciones del Sistema

- ✅ Mantenimiento programado
- ✅ Emergencias
- ✅ Actualizaciones del sistema

### 6. Preferencias de Usuario

- ✅ Configuración por canal (email, SMS, push)
- ✅ Configuración por categoría
- ✅ Preferencias por defecto
- ✅ Gestión desde el panel de usuario

## 🎯 Uso del Sistema

### 1. Envío de Notificaciones

```typescript
import { notificationManager } from '@/lib/notification-manager';

// Enviar notificación de bienvenida
await notificationManager.sendWelcomeNotifications({
  userId: 'user-123',
  userEmail: 'usuario@email.com',
  userPhone: '+50312345678',
  userName: 'Juan Pérez',
  preferences: {
    email: true,
    sms: true,
    push: false
  }
});

// Enviar confirmación de reserva
await notificationManager.sendBookingConfirmationNotifications({
  userId: 'user-123',
  userEmail: 'usuario@email.com',
  userName: 'Juan Pérez',
  bookingId: 'booking-456',
  accommodationName: 'Casa El Sunzal',
  accommodationLocation: 'El Sunzal',
  checkIn: '2024-12-25',
  checkOut: '2024-12-30',
  totalAmount: 150.00
});
```

### 2. Gestión de Preferencias

```typescript
import { notificationPreferencesService } from '@/lib/notification-preferences-service';

// Obtener preferencias del usuario
const preferences = await notificationPreferencesService.getUserPreferences('user-123');

// Actualizar preferencias
await notificationPreferencesService.updateUserPreferences('user-123', {
  email: true,
  sms: false,
  bookingReminders: true,
  marketingEmails: false
});
```

### 3. API Endpoints

#### Envío de Emails:
- `POST /api/email-notifications/send-password-reset`
- `POST /api/email-notifications/send-welcome-email`
- `POST /api/email-notifications/send-account-approved`

#### Envío de SMS:
- `POST /api/email-notifications/send-sms`
- `POST /api/email-notifications/send-sms-reset`

#### Configuración:
- `GET /api/email-notifications/test-config`

## 🔧 Personalización

### 1. Templates de Email

Los templates están en `src/lib/email-service.ts` y pueden personalizarse:

- Colores y estilos
- Logos e imágenes
- Contenido y mensajes
- Estructura HTML

### 2. Templates de SMS

Los templates están en `src/lib/sms-service.ts`:

- Longitud máxima: 160 caracteres
- Emojis compatibles
- Formato de texto simple

### 3. Agregar Nuevas Notificaciones

1. Añadir método en `NotificationManager`
2. Crear templates en `EmailService` y `SMSService`
3. Configurar preferencias en `NotificationPreferencesService`
4. Agregar endpoint API si es necesario

## 🧪 Testing

### 1. Verificar Configuración

```bash
curl http://localhost:3001/api/email-notifications/test-config
```

### 2. Test de Email

```bash
curl -X POST http://localhost:3001/api/email-notifications/send-welcome-email \
  -H "Content-Type: application/json" \
  -d '{"userEmail": "test@email.com", "userName": "Usuario Test"}'
```

### 3. Test de SMS

```bash
curl -X POST http://localhost:3001/api/email-notifications/send-sms \
  -H "Content-Type: application/json" \
  -d '{"phone": "+50312345678", "message": "Test message"}'
```

## 🚨 Troubleshooting

### Email no se envía:

1. Verificar variables de entorno
2. Comprobar credenciales SMTP
3. Revisar logs del servidor
4. Verificar puertos de firewall

### SMS no se envía:

1. Verificar configuración de Twilio
2. Comprobar saldo de la cuenta
3. Verificar formato del número de teléfono
4. Revisar logs de Twilio

### Base de datos:

```sql
-- Verificar que las tablas existen
.tables

-- Verificar estructura
.schema password_reset_tokens
.schema notification_preferences
```

## 🔒 Seguridad

### 1. Protección de Credenciales

- Nunca subir credenciales al repositorio
- Usar variables de entorno
- Rotar tokens periódicamente

### 2. Rate Limiting

El sistema incluye rate limiting para prevenir abuso:

- 5 intentos de reset por 15 minutos
- 100 requests generales por 15 minutos

### 3. Validación de Tokens

- Tokens expiran automáticamente
- Se invalidan después del uso
- Generación criptográficamente segura

## 📊 Monitoreo

### 1. Logs

Todos los envíos se registran en los logs:

```
✅ Email sent successfully: {...}
✅ SMS sent successfully: {...}
❌ Error sending email: {...}
```

### 2. Estadísticas

```typescript
const stats = await notificationPreferencesService.getNotificationStats();
console.log('Users with email enabled:', stats.emailEnabled);
```

## 🚀 Próximos Pasos

1. **Push Notifications**: Implementar notificaciones web push
2. **Templates Avanzados**: Editor visual de templates
3. **A/B Testing**: Probar diferentes versiones de mensajes
4. **Analytics**: Métricas de apertura y clics
5. **Internationalization**: Soporte para múltiples idiomas

---

## 📞 Soporte

Si tienes problemas con la configuración:

1. Revisa los logs del servidor
2. Verifica las variables de entorno
3. Consulta la documentación de Twilio/Nodemailer
4. Contacta al equipo de desarrollo

¡El sistema está listo para enviar notificaciones a todos los miembros del Club Salvadoreño! 🎉
