# Sistema de Recuperación de Contraseña

## Descripción General

El sistema de recuperación de contraseña permite a los usuarios recuperar el acceso a sus cuentas a través de dos métodos:

1. **Correo Electrónico**: Envía un enlace de recuperación al email del usuario
2. **SMS**: Envía un código de verificación al teléfono del usuario

## Flujo de Usuario

### 1. Página de Recuperación (`/forgot-password`)

- El usuario puede elegir entre recibir instrucciones por correo o SMS
- Validación de formato para email y número de teléfono
- Envío real de correos/SMS en producción, simulado en desarrollo

### 2. Página de Nueva Contraseña (`/reset-password`)

- Accesible a través del enlace enviado por correo
- Validación de contraseña segura
- Confirmación de nueva contraseña

### 3. Confirmación de Éxito

- Mensaje de confirmación
- Redirección al login

## Implementación Técnica

### Archivos Principales

#### `src/pages/ForgotPassword.tsx`

- Componente principal de la página de recuperación
- Maneja la selección de método de contacto
- Integra validación y envío de correos/SMS

#### `src/pages/ResetPassword.tsx`

- Página para establecer nueva contraseña
- Validación de token de recuperación
- Validación de contraseña segura

#### `src/lib/contact-services.ts`

- Servicios para envío de correos y SMS
- Funciones de validación y formateo
- Generación de tokens y códigos

#### `src/lib/mock-api.ts`

- APIs simuladas para desarrollo
- Logging detallado para debugging
- Simulación de fallos ocasionales para testing

### Características Técnicas

#### Validaciones Implementadas

- **Email**: Formato RFC válido
- **Teléfono**: Formatos +503 1234-5678 o 1234-5678
- **Contraseña**: Mínimo 8 caracteres, mayúscula, minúscula, número

#### Seguridad

- Tokens únicos para cada solicitud de recuperación
- Códigos SMS de 6 dígitos
- URLs de recuperación con tokens seguros

#### UX/UI Features

- Estados de carga durante envío
- Notificaciones toast para feedback
- Carrusel de imágenes de fondo
- Diseño responsive

## Configuración para Producción

### Variables de Entorno

```env
REACT_APP_API_URL=https://tu-api.com
REACT_APP_EMAIL_SERVICE=sendgrid|ses|mailgun
REACT_APP_SMS_SERVICE=twilio|sns
```

### Endpoints de API Requeridos

#### Envío de Email

```
POST /api/send-reset-email
Content-Type: application/json

{
  "email": "usuario@ejemplo.com",
  "resetToken": "token_unico",
  "resetUrl": "https://app.com/reset-password?token=token_unico"
}
```

#### Envío de SMS

```
POST /api/send-reset-sms
Content-Type: application/json

{
  "phone": "+50312345678",
  "code": "123456"
}
```

#### Reset de Contraseña

```
POST /api/reset-password
Content-Type: application/json

{
  "token": "token_de_recuperacion",
  "password": "nueva_contraseña"
}
```

## Servicios de Terceros Recomendados

### Para Correos

- **SendGrid**: Fácil integración, buena entregabilidad
- **AWS SES**: Costo efectivo, integración con AWS
- **Mailgun**: API simple, buen soporte

### Para SMS

- **Twilio**: Líder del mercado, API robusta
- **AWS SNS**: Integración con AWS, costo efectivo
- **MessageBird**: Buena cobertura internacional

## Testing en Desarrollo

### Modo Desarrollo

- Las APIs mock están habilitadas automáticamente
- Los correos y SMS se loggean en la consola
- Los códigos SMS se muestran en la UI para testing
- Simulación de fallos ocasionales para testing de errores

### Logs de Desarrollo

```javascript
// Email logs
📧 Mock Email Sent:
To: usuario@ejemplo.com
Reset URL: http://localhost:8080/reset-password?token=abc123
Token: abc123

// SMS logs
📱 Mock SMS Sent:
To: +50312345678
Code: 123456
```

## Personalización

### Plantillas de Email

Editar `src/lib/mock-api.ts` para personalizar el contenido:

```javascript
const emailContent = `
  Club Salvadoreño - Recuperación de Contraseña
  
  Hola,
  
  Has solicitado restablecer tu contraseña...
`;
```

### Plantillas de SMS

```javascript
const smsContent = `Club Salvadoreño: Tu código de verificación es ${code}. Expira en 10 minutos.`;
```

### Validaciones Customizadas

Editar `src/lib/contact-services.ts` para ajustar:

- Formatos de teléfono para otros países
- Requisitos de contraseña
- Duración de tokens

## Monitoreo y Analytics

### Métricas Recomendadas

- Tasa de éxito de envío de correos/SMS
- Tiempo de entrega de mensajes
- Tasa de uso de enlaces de recuperación
- Errores de validación más comunes

### Logging para Producción

```javascript
// Agregar logging estructurado
console.log({
  event: "password_reset_requested",
  method: "email|sms",
  timestamp: new Date().toISOString(),
  success: true | false,
});
```

## Mantenimiento

### Rotación de Tokens

- Los tokens deberían expirar en 1-24 horas
- Invalidar tokens usados
- Limpiar tokens expirados regularmente

### Monitoreo de Salud

- Verificar conectividad con servicios de terceros
- Monitorear tasas de entrega
- Alertas en caso de fallos masivos

## Troubleshooting

### Problemas Comunes

#### Correos no llegan

1. Verificar configuración de DNS/SPF/DKIM
2. Revisar reputación del dominio
3. Verificar que no esté en listas negras

#### SMS no llegan

1. Verificar formato de números
2. Confirmar cobertura del proveedor
3. Revisar compliance con regulaciones locales

#### Tokens inválidos

1. Verificar que no hayan expirado
2. Confirmar que no se hayan usado ya
3. Validar formato de URL generada
