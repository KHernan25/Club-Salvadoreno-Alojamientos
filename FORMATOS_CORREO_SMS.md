# 📧📱 Formatos de Correo y SMS por Escenario - Club Salvadoreño

Este documento describe todos los formatos de correo electrónico y SMS implementados en el sistema de notificaciones del Club Salvadoreño, organizados por categoría y escenario.

---

## 📋 Índice de Escenarios

### 👤 **Cuenta de Usuario**
1. [Correo de Bienvenida](#1-correo-de-bienvenida)
2. [Cuenta Aprobada](#2-cuenta-aprobada)
3. [Cuenta Rechazada](#3-cuenta-rechazada)
4. [Recuperación de Contraseña](#4-recuperación-de-contraseña)

### 🏨 **Reservas y Alojamientos**
5. [Confirmación de Reserva](#5-confirmación-de-reserva)
6. [Recordatorio de Check-in](#6-recordatorio-de-check-in)
7. [Cancelación de Reserva](#7-cancelación-de-reserva)
8. [Modificación de Reserva](#8-modificación-de-reserva)

### 💳 **Pagos**
9. [Recordatorio de Pago](#9-recordatorio-de-pago)
10. [Confirmación de Pago](#10-confirmación-de-pago)
11. [Fallo en el Pago](#11-fallo-en-el-pago)

### 🔧 **Sistema y Mantenimiento**
12. [Notificaciones del Sistema](#12-notificaciones-del-sistema)
13. [Mantenimiento Programado](#13-mantenimiento-programado)
14. [Notificaciones de Emergencia](#14-notificaciones-de-emergencia)

---

## 👤 CUENTA DE USUARIO

### 1. Correo de Bienvenida

**🎯 Escenario:** Cuando un usuario crea su cuenta exitosamente.

#### 📧 **Email Format**

**Asunto:** `🎉 ¡Bienvenido al Club Salvadoreño!`

**HTML Template:**
```html
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
  <div style="background: linear-gradient(135deg, #10b981, #059669); color: white; padding: 30px; text-align: center;">
    <h1 style="margin: 0; font-size: 28px;">🎉 ¡Bienvenido!</h1>
    <p style="margin: 15px 0 0 0; font-size: 16px;">Tu cuenta ha sido creada exitosamente</p>
  </div>
  
  <div style="padding: 40px 30px; background: #f9fafb;">
    <h2 style="color: #1f2937; margin: 0 0 20px 0;">¡Hola {userName}!</h2>
    
    <p style="color: #4b5563; line-height: 1.6; margin-bottom: 25px;">
      ¡Te damos la más cordial bienvenida al Club Salvadoreño! Tu cuenta ha sido creada exitosamente 
      y ya puedes comenzar a disfrutar de todos nuestros servicios y alojamientos.
    </p>
    
    <div style="background: white; border-radius: 8px; padding: 20px; margin: 25px 0; border-left: 4px solid #10b981;">
      <h3 style="color: #1f2937; margin: 0 0 15px 0;">🏨 ¿Qué puedes hacer ahora?</h3>
      <ul style="color: #4b5563; line-height: 1.8; margin: 0; padding-left: 20px;">
        <li>Explorar nuestros alojamientos disponibles</li>
        <li>Hacer reservas en nuestras propiedades</li>
        <li>Gestionar tu perfil y preferencias</li>
        <li>Acceder a ofertas exclusivas para miembros</li>
      </ul>
    </div>
    
    <div style="text-align: center; margin: 30px 0;">
      <a href="{frontendUrl}" 
         style="background: #10b981; color: white; padding: 15px 30px; text-decoration: none; 
                border-radius: 8px; font-weight: bold; font-size: 16px;">
        Ir a Mi Cuenta
      </a>
    </div>
  </div>
</div>
```

**Texto Plano:**
```
🎉 ¡Bienvenido al Club Salvadoreño!

¡Hola {userName}!

Tu cuenta ha sido creada exitosamente. Ya puedes:
- Explorar alojamientos disponibles
- Hacer reservas 
- Gestionar tu perfil
- Acceder a ofertas exclusivas

Visita: {frontendUrl}

¡Gracias por ser parte del Club Salvadoreño!
```

#### 📱 **SMS Format**
```
🎉 ¡Bienvenido al Club Salvadoreño!

Hola {userName}, tu cuenta ha sido creada exitosamente.

Ya puedes acceder a todos nuestros servicios y alojamientos.

¡Gracias por ser parte de nuestro club!
```

---

### 2. Cuenta Aprobada

**🎯 Escenario:** Cuando un administrador aprueba la solicitud de registro de un usuario.

#### 📧 **Email Format**

**Asunto:** `✅ Cuenta Aprobada - Club Salvadoreño`

**HTML Template:**
```html
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
  <div style="background: linear-gradient(135deg, #10b981, #059669); color: white; padding: 30px; text-align: center;">
    <h1 style="margin: 0; font-size: 28px;">✅ Cuenta Aprobada</h1>
    <p style="margin: 15px 0 0 0; font-size: 16px;">Tu solicitud ha sido aprobada</p>
  </div>
  
  <div style="padding: 40px 30px; background: #f9fafb;">
    <h2 style="color: #1f2937; margin: 0 0 20px 0;">¡Hola {userName}!</h2>
    
    <p style="color: #4b5563; line-height: 1.6; margin-bottom: 25px;">
      ¡Excelentes noticias! Tu solicitud de registro ha sido aprobada por nuestro equipo. 
      Tu cuenta ya está activa y puedes comenzar a usar todos nuestros servicios.
    </p>
    
    <div style="text-align: center; margin: 30px 0;">
      <a href="{frontendUrl}" 
         style="background: #10b981; color: white; padding: 15px 30px; text-decoration: none; 
                border-radius: 8px; font-weight: bold; font-size: 16px;">
        Iniciar Sesión
      </a>
    </div>
  </div>
</div>
```

**Texto Plano:**
```
✅ Cuenta Aprobada - Club Salvadoreño

¡Hola {userName}!

Tu solicitud de registro ha sido aprobada. Tu cuenta está activa.

Inicia sesión en: {frontendUrl}

¡Bienvenido al Club Salvadoreño!
```

#### 📱 **SMS Format**
```
✅ Cuenta Aprobada - Club Salvadoreño

Hola {userName}!

Tu solicitud de registro ha sido aprobada. Tu cuenta está activa.

¡Bienvenido al Club Salvadoreño!
```

---

### 3. Cuenta Rechazada

**🎯 Escenario:** Cuando un administrador rechaza la solicitud de registro de un usuario.

#### 📧 **Email Format**

**Asunto:** `❌ Solicitud de Registro - Club Salvadoreño`

**HTML Template:**
```html
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
  <div style="background: linear-gradient(135deg, #dc2626, #b91c1c); color: white; padding: 30px; text-align: center;">
    <h1 style="margin: 0; font-size: 28px;">Solicitud de Registro</h1>
    <p style="margin: 15px 0 0 0; font-size: 16px;">Información importante sobre tu solicitud</p>
  </div>
  
  <div style="padding: 40px 30px; background: #f9fafb;">
    <h2 style="color: #1f2937; margin: 0 0 20px 0;">Hola {userName},</h2>
    
    <p style="color: #4b5563; line-height: 1.6; margin-bottom: 25px;">
      Lamentamos informarte que tu solicitud de registro no pudo ser procesada en este momento. 
      Esto puede deberse a información incompleta o que no cumple con nuestros requisitos de membresía.
    </p>
    
    <div style="background: #fef2f2; border-radius: 8px; padding: 20px; margin: 25px 0; border-left: 4px solid #dc2626;">
      <p style="color: #7f1d1d; margin: 0; font-size: 14px;">
        💡 <strong>¿Qué puedes hacer?</strong><br>
        Contacta a nuestro equipo de atención al cliente para obtener más información 
        sobre los requisitos o para aclarar cualquier duda.
      </p>
    </div>
    
    <div style="text-align: center; margin: 30px 0;">
      <a href="mailto:info@clubsalvadoreno.com" 
         style="background: #dc2626; color: white; padding: 15px 30px; text-decoration: none; 
                border-radius: 8px; font-weight: bold; font-size: 16px;">
        Contactar Soporte
      </a>
    </div>
  </div>
</div>
```

**Texto Plano:**
```
Solicitud de Registro - Club Salvadoreño

Hola {userName},

Tu solicitud de registro no pudo ser procesada. 

Para más información, contacta a nuestro equipo:
Email: info@clubsalvadoreno.com

Gracias por tu interés en el Club Salvadoreño.
```

#### 📱 **SMS Format**
**Nota:** Los SMS generalmente NO se envían para rechazos, solo emails.

---

### 4. Recuperación de Contraseña

**🎯 Escenario:** Cuando un usuario solicita recuperar su contraseña.

#### 📧 **Email Format**

**Asunto:** `🔐 Recuperación de Contraseña - Club Salvadoreño`

**HTML Template:**
```html
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f9fafb;">
  <div style="background: linear-gradient(135deg, #3b82f6, #1d4ed8); color: white; padding: 30px; text-align: center;">
    <h1 style="margin: 0; font-size: 28px;">🔐 Recuperación de Contraseña</h1>
    <p style="margin: 15px 0 0 0; font-size: 16px; opacity: 0.9;">Club Salvadoreño</p>
  </div>
  
  <div style="padding: 40px 30px; background: white;">
    <h2 style="color: #1f2937; margin: 0 0 20px 0;">¡Hola {userName}!</h2>
    
    <p style="color: #4b5563; line-height: 1.6; margin-bottom: 25px;">
      Hemos recibido una solicitud para restablecer la contraseña de tu cuenta en Club Salvadoreño. 
      Si no realizaste esta solicitud, puedes ignorar este correo.
    </p>
    
    <div style="background: #f3f4f6; border-radius: 8px; padding: 20px; margin: 25px 0; text-align: center;">
      <p style="color: #1f2937; margin: 0 0 20px 0; font-size: 16px;">
        Para restablecer tu contraseña, haz clic en el siguiente botón:
      </p>
      
      <a href="{resetUrl}" 
         style="display: inline-block; background: #3b82f6; color: white; padding: 15px 30px; 
                text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px;">
        Restablecer Contraseña
      </a>
    </div>
    
    <div style="background: #fef3c7; border-radius: 8px; padding: 15px; margin: 25px 0; border-left: 4px solid #f59e0b;">
      <p style="color: #92400e; margin: 0; font-size: 14px;">
        ⚠️ <strong>Importante:</strong> Este enlace expirará en {expiresIn}. 
        Si necesitas más tiempo, solicita un nuevo enlace de recuperación.
      </p>
    </div>
    
    <p style="color: #6b7280; font-size: 14px; line-height: 1.5; margin: 25px 0;">
      Si el botón no funciona, copia y pega el siguiente enlace en tu navegador:<br>
      <a href="{resetUrl}" style="color: #3b82f6; word-break: break-all;">{resetUrl}</a>
    </p>
  </div>
</div>
```

**Texto Plano:**
```
🔐 Recuperación de Contraseña - Club Salvadoreño

¡Hola {userName}!

Hemos recibido una solicitud para restablecer la contraseña de tu cuenta.

Para restablecer tu contraseña, visita el siguiente enlace:
{resetUrl}

⚠️ IMPORTANTE: Este enlace expirará en {expiresIn}.

Si no realizaste esta solicitud, puedes ignorar este correo.

¿Tienes problemas? Contáctanos en info@clubsalvadoreno.com

---
Club Salvadoreño
© 2024 Todos los derechos reservados.
```

#### 📱 **SMS Format**
```
🔐 Club Salvadoreño

Hola {userName}!

Tu código de recuperación de contraseña es: {resetCode}

⏰ Expira en {expiresIn}

Si no solicitaste este código, ignora este mensaje.

Saludos,
Club Salvadoreño
```

---

## 🏨 RESERVAS Y ALOJAMIENTOS

### 5. Confirmación de Reserva

**🎯 Escenario:** Cuando se confirma una nueva reserva de alojamiento.

#### 📧 **Email Format**

**Asunto:** `🏨 Reserva Confirmada - {accommodationName}`

**HTML Template:**
```html
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
  <div style="background: linear-gradient(135deg, #10b981, #059669); color: white; padding: 30px; text-align: center;">
    <h1 style="margin: 0; font-size: 28px;">🏨 Reserva Confirmada</h1>
    <p style="margin: 15px 0 0 0; font-size: 16px;">Tu estadía está asegurada</p>
  </div>
  
  <div style="padding: 40px 30px; background: #f9fafb;">
    <h2 style="color: #1f2937; margin: 0 0 20px 0;">¡Hola {userName}!</h2>
    
    <p style="color: #4b5563; line-height: 1.6; margin-bottom: 25px;">
      ¡Excelentes noticias! Tu reserva ha sido confirmada exitosamente. 
      Aquí tienes todos los detalles de tu estadía:
    </p>
    
    <div style="background: white; border-radius: 8px; padding: 20px; margin: 25px 0; border-left: 4px solid #10b981;">
      <h3 style="color: #1f2937; margin: 0 0 15px 0;">📋 Detalles de la Reserva</h3>
      <ul style="color: #4b5563; line-height: 1.8; margin: 0; padding-left: 20px;">
        <li><strong>Alojamiento:</strong> {accommodationName}</li>
        <li><strong>Ubicación:</strong> {accommodationLocation}</li>
        <li><strong>Check-in:</strong> {checkIn}</li>
        <li><strong>Check-out:</strong> {checkOut}</li>
        <li><strong>Huéspedes:</strong> {guestCount}</li>
        <li><strong>Total:</strong> ${totalAmount} USD</li>
      </ul>
      {specialRequests && `<p style="margin-top: 15px;"><strong>Solicitudes especiales:</strong> {specialRequests}</p>`}
    </div>
    
    <div style="background: #e0f2fe; border-radius: 8px; padding: 15px; margin: 25px 0; border-left: 4px solid #0284c7;">
      <p style="color: #0c4a6e; margin: 0; font-size: 14px;">
        ���� <strong>Recordatorio:</strong> Presenta tu identificación al momento del check-in. 
        Si tienes alguna pregunta, no dudes en contactarnos.
      </p>
    </div>
  </div>
</div>
```

#### 📱 **SMS Format**
```
🏨 Reserva Confirmada

Hola {userName}!

Tu reserva ha sido confirmada:

📅 Check-in: {checkIn}
📅 Check-out: {checkOut}
🏠 Alojamiento: {accommodationName}

¡Esperamos tu visita!
```

---

### 6. Recordatorio de Check-in

**🎯 Escenario:** Recordatorio enviado 1 día antes del check-in.

#### 📧 **Email Format**

**Asunto:** `🔔 Recordatorio: Tu estadía comienza mañana - {accommodationName}`

#### 📱 **SMS Format**
```
🔔 Recordatorio

Hola {userName}!

Tu estadía en {accommodationName} comienza mañana.

📅 Check-in: {checkIn}

¡No olvides tu identificación!
```

---

### 7. Cancelación de Reserva

**🎯 Escenario:** Cuando se cancela una reserva existente.

#### 📧 **Email Format**

**Asunto:** `❌ Reserva Cancelada - {accommodationName}`

#### 📱 **SMS Format**
```
❌ Reserva Cancelada

Hola {userName}!

Tu reserva en {accommodationName} ha sido cancelada.

Si tienes preguntas, contáctanos.

Club Salvadoreño
```

---

### 8. Modificación de Reserva

**🎯 Escenario:** Cuando se modifica una reserva existente.

#### 📧 **Email Format**

**Asunto:** `🔄 Modificación de Reserva - {accommodationName}`

**HTML Template:**
```html
<h2>Hola {userName}!</h2>
<p>Tu reserva en <strong>{accommodationName}</strong> ha sido modificada.</p>
<p><strong>Tipo de modificación:</strong> {modificationType}</p>
<p><strong>Nuevas fechas:</strong> {checkIn} - {checkOut}</p>
<p>Si tienes preguntas, contáctanos.</p>
<p>Saludos,<br>Club Salvadoreño</p>
```

---

## 💳 PAGOS

### 9. Recordatorio de Pago

**🎯 Escenario:** Recordatorio de pago pendiente para una reserva.

#### 📱 **SMS Format**
```
💳 Recordatorio de Pago

Hola {userName}!

Tienes un pago pendiente para tu reserva.

💰 Monto: ${amount}
📅 Vence: {dueDate}

Completa tu pago para garantizar tu estadía.
```

---

### 10. Confirmación de Pago

**🎯 Escenario:** Cuando se confirma un pago exitoso.

#### 📧 **Email Format**

**Asunto:** `✅ Pago Confirmado - {accommodationName}`

**HTML Template:**
```html
<h2>¡Hola {userName}!</h2>
<p>Hemos confirmado tu pago de <strong>${amount} USD</strong> para tu reserva en <strong>{accommodationName}</strong>.</p>
<p><strong>ID de Reserva:</strong> {bookingId}</p>
<p>Tu reserva está completamente confirmada. ¡Esperamos tu visita!</p>
<p>Saludos,<br>Club Salvadoreño</p>
```

#### 📱 **SMS Format**
```
✅ Club Salvadoreño

Pago confirmado: ${amount} USD
Reserva: {accommodationName}

¡Tu reserva está confirmada!
```

---

### 11. Fallo en el Pago

**🎯 Escenario:** Cuando falla el procesamiento de un pago.

#### 📧 **Email Format**

**Asunto:** `❌ Problema con el Pago - {accommodationName}`

**HTML Template:**
```html
<h2>Hola {userName},</h2>
<p>Ha ocurrido un problema con el procesamiento de tu pago de <strong>${amount} USD</strong> para tu reserva en <strong>{accommodationName}</strong>.</p>
{reason && `<p><strong>Motivo:</strong> {reason}</p>`}
<p>Por favor, intenta realizar el pago nuevamente o contacta nuestro equipo de soporte.</p>
<p>ID de Reserva: {bookingId}</p>
<p>Saludos,<br>Club Salvadoreño</p>
```

---

## 🔧 SISTEMA Y MANTENIMIENTO

### 12. Notificaciones del Sistema

**🎯 Escenario:** Notificaciones generales del sistema (actualizaciones, avisos, etc.).

#### 📧 **Email Format**

**Asunto:** `🔔 {title} - Club Salvadoreño`

**HTML Template:**
```html
<h2>Hola {userName},</h2>
<p>{message}</p>
{actionUrl && `<p><a href="{actionUrl}" style="background: #3b82f6; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px;">Ver Detalles</a></p>`}
<p>Saludos,<br>Club Salvadoreño</p>
```

#### 📱 **SMS Format**
```
🔔 Club Salvadoreño

{title}

{message}
```

**Nota:** Los SMS solo se envían para notificaciones de alta prioridad.

---

### 13. Mantenimiento Programado

**🎯 Escenario:** Aviso de mantenimiento que puede afectar servicios.

#### 📧 **Email Format**

**Asunto:** `🔧 Mantenimiento Programado - Club Salvadoreño`

**HTML Template:**
```html
<h2>Hola {userName},</h2>
<p>Te informamos sobre un mantenimiento programado que podría afectar algunos servicios:</p>
<ul>
  <li><strong>Fecha:</strong> {maintenanceDate}</li>
  <li><strong>Duración estimada:</strong> {estimatedDuration}</li>
  <li><strong>Servicios afectados:</strong> {affectedServices}</li>
</ul>
<p>Pedimos disculpas por cualquier inconveniente que esto pueda causar.</p>
<p>Saludos,<br>Club Salvadoreño</p>
```

---

### 14. Notificaciones de Emergencia

**🎯 Escenario:** Comunicaciones urgentes de emergencia.

#### 📧 **Email Format**

**Asunto:** `🚨 EMERGENCIA - {emergencyType}`

**HTML Template:**
```html
<div style="border: 3px solid #dc2626; padding: 20px; background: #fef2f2;">
  <h2 style="color: #dc2626;">🚨 NOTIFICACIÓN DE EMERGENCIA</h2>
  <h3>{emergencyType}</h3>
  <p><strong>Estimado/a {userName},</strong></p>
  <p>{instructions}</p>
  <p><strong>Contacto de emergencia:</strong> {contactInfo}</p>
  <p>Club Salvadoreño</p>
</div>
```

#### 📱 **SMS Format**
```
🚨 EMERGENCIA Club Salvadoreño

{emergencyType}

{instructions}

Contacto: {contactInfo}
```

**Nota:** Las notificaciones de emergencia se envían por TODOS los canales disponibles, independientemente de las preferencias del usuario.

---

## 🛠️ Variables y Personalización

### Variables Comunes Disponibles

- `{userName}` - Nombre del usuario
- `{userEmail}` - Email del usuario  
- `{frontendUrl}` - URL del frontend
- `{accommodationName}` - Nombre del alojamiento
- `{accommodationLocation}` - Ubicación del alojamiento
- `{checkIn}` - Fecha de check-in
- `{checkOut}` - Fecha de check-out
- `{totalAmount}` - Monto total
- `{guestCount}` - Número de huéspedes
- `{bookingId}` - ID de la reserva
- `{resetUrl}` - URL de recuperación de contraseña
- `{resetCode}` - Código de recuperación (SMS)
- `{expiresIn}` - Tiempo de expiración

### Colores del Sistema

- **Primario Verde:** `#10b981` (Confirmaciones, bienvenidas)
- **Azul Sistema:** `#3b82f6` (Información, enlaces)
- **Rojo Alertas:** `#dc2626` (Errores, emergencias)
- **Amarillo Advertencias:** `#f59e0b` (Advertencias)
- **Gris Texto:** `#4b5563` (Texto secundario)

### Configuración SMTP y SMS

- **Email:** Configurado con Nodemailer
- **SMS:** Configurado con Twilio
- **Formato números:** +503 para El Salvador
- **Límite SMS:** 160 caracteres recomendado

---

## ✅ Estado de Implementación

| Escenario | Email | SMS | Estado |
|-----------|-------|-----|--------|
| Bienvenida | ✅ | ✅ | Implementado |
| Cuenta Aprobada | ✅ | ✅ | Implementado |
| Cuenta Rechazada | ✅ | ❌ | Implementado |
| Recuperación Contraseña | ✅ | ✅ | Implementado |
| Confirmación Reserva | ✅ | ✅ | Implementado |
| Recordatorio Check-in | ✅ | ✅ | Implementado |
| Cancelación Reserva | ✅ | ✅ | Implementado |
| Modificación Reserva | ✅ | ❌ | Implementado |
| Recordatorio Pago | ✅ | ✅ | Implementado |
| Confirmación Pago | ✅ | ✅ | Implementado |
| Fallo Pago | ✅ | ❌ | Implementado |
| Notificaciones Sistema | ✅ | ✅* | Implementado |
| Mantenimiento | ✅ | ❌ | Implementado |
| Emergencias | ✅ | ✅ | Implementado |

_*Solo para alta prioridad_

---

**📅 Última actualización:** Diciembre 2024  
**📧 Contacto:** info@clubsalvadoreno.com  
**🔧 Versión del sistema:** v2.0
