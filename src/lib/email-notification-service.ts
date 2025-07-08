import { shouldUseMockAPI, mockSendResetEmail } from "./mock-api";

export interface EmailNotificationData {
  to: string;
  templateType:
    | "booking_confirmation"
    | "booking_reminder"
    | "booking_cancelled"
    | "booking_modified"
    | "payment_reminder"
    | "payment_failed";
  data: {
    guestName: string;
    reservationId: string;
    accommodationName: string;
    checkIn: string;
    checkOut: string;
    totalAmount?: number;
    location?: string;
    hostName?: string;
    hostEmail?: string;
    hostPhone?: string;
    paymentDueDate?: string;
    modificationType?: string;
    cancellationReason?: string;
  };
}

export interface EmailTemplate {
  subject: string;
  htmlContent: string;
  textContent: string;
}

export class EmailNotificationService {
  private static instance: EmailNotificationService;

  public static getInstance(): EmailNotificationService {
    if (!EmailNotificationService.instance) {
      EmailNotificationService.instance = new EmailNotificationService();
    }
    return EmailNotificationService.instance;
  }

  private getEmailTemplate(templateType: string, data: any): EmailTemplate {
    const templates = {
      booking_confirmation: {
        subject: `✅ Confirmación de Reserva - ${data.accommodationName}`,
        htmlContent: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #3b82f6, #1d4ed8); color: white; padding: 20px; text-align: center;">
              <h1 style="margin: 0; font-size: 24px;">🏨 Club Salvadoreño</h1>
              <p style="margin: 10px 0 0 0; font-size: 16px;">Tu reserva ha sido confirmada</p>
            </div>
            
            <div style="padding: 30px; background: #f9fafb;">
              <h2 style="color: #1f2937; margin-bottom: 20px;">¡Hola ${data.guestName}!</h2>
              <p style="color: #4b5563; line-height: 1.6;">
                Nos complace confirmar tu reserva en <strong>${data.accommodationName}</strong>. 
                A continuación encontrarás todos los detalles de tu estadía:
              </p>
              
              <div style="background: white; border-radius: 8px; padding: 20px; margin: 20px 0; border-left: 4px solid #3b82f6;">
                <h3 style="color: #1f2937; margin: 0 0 15px 0;">📋 Detalles de la Reserva</h3>
                <table style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="padding: 8px 0; color: #6b7280; font-weight: bold;">Código de Reserva:</td>
                    <td style="padding: 8px 0; color: #1f2937; font-weight: bold;">${data.reservationId}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #6b7280;">Alojamiento:</td>
                    <td style="padding: 8px 0; color: #1f2937;">${data.accommodationName}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #6b7280;">Check-in:</td>
                    <td style="padding: 8px 0; color: #1f2937;">${new Date(data.checkIn).toLocaleDateString("es-ES", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #6b7280;">Check-out:</td>
                    <td style="padding: 8px 0; color: #1f2937;">${new Date(data.checkOut).toLocaleDateString("es-ES", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</td>
                  </tr>
                  ${
                    data.totalAmount
                      ? `
                  <tr>
                    <td style="padding: 8px 0; color: #6b7280;">Total:</td>
                    <td style="padding: 8px 0; color: #1f2937; font-weight: bold;">$${data.totalAmount.toFixed(2)} USD</td>
                  </tr>
                  `
                      : ""
                  }
                  ${
                    data.location
                      ? `
                  <tr>
                    <td style="padding: 8px 0; color: #6b7280;">Ubicación:</td>
                    <td style="padding: 8px 0; color: #1f2937;">${data.location}</td>
                  </tr>
                  `
                      : ""
                  }
                </table>
              </div>

              ${
                data.hostName
                  ? `
              <div style="background: white; border-radius: 8px; padding: 20px; margin: 20px 0; border-left: 4px solid #10b981;">
                <h3 style="color: #1f2937; margin: 0 0 15px 0;">👨‍💼 Información del Anfitrión</h3>
                <p style="color: #1f2937; margin: 5px 0;"><strong>Nombre:</strong> ${data.hostName}</p>
                ${data.hostEmail ? `<p style="color: #1f2937; margin: 5px 0;"><strong>Email:</strong> ${data.hostEmail}</p>` : ""}
                ${data.hostPhone ? `<p style="color: #1f2937; margin: 5px 0;"><strong>Teléfono:</strong> ${data.hostPhone}</p>` : ""}
              </div>
              `
                  : ""
              }

              <div style="background: #fef3c7; border-radius: 8px; padding: 15px; margin: 20px 0;">
                <p style="color: #92400e; margin: 0; font-size: 14px;">
                  💡 <strong>Importante:</strong> Guarda este correo como comprobante de tu reserva. 
                  Podrás contactar a tu anfitrión directamente para cualquier consulta adicional.
                </p>
              </div>

              <div style="text-align: center; margin: 30px 0;">
                <a href="${process.env.FRONTEND_URL || "http://localhost:5173"}/my-reservations" 
                   style="background: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">
                  Ver Mis Reservas
                </a>
              </div>
            </div>
            
            <div style="background: #f3f4f6; padding: 20px; text-align: center; color: #6b7280; font-size: 12px;">
              <p style="margin: 0;">© 2024 Club Salvadoreño. Todos los derechos reservados.</p>
              <p style="margin: 5px 0 0 0;">Si tienes alguna pregunta, contáctanos en info@clubsalvadoreno.com</p>
            </div>
          </div>
        `,
        textContent: `
🏨 Club Salvadoreño - Confirmación de Reserva

¡Hola ${data.guestName}!

Tu reserva ha sido confirmada exitosamente.

DETALLES DE LA RESERVA:
- Código: ${data.reservationId}
- Alojamiento: ${data.accommodationName}
- Check-in: ${new Date(data.checkIn).toLocaleDateString("es-ES")}
- Check-out: ${new Date(data.checkOut).toLocaleDateString("es-ES")}
${data.totalAmount ? `- Total: $${data.totalAmount.toFixed(2)} USD` : ""}
${data.location ? `- Ubicación: ${data.location}` : ""}

${
  data.hostName
    ? `
ANFITRIÓN:
- Nombre: ${data.hostName}
${data.hostEmail ? `- Email: ${data.hostEmail}` : ""}
${data.hostPhone ? `- Teléfono: ${data.hostPhone}` : ""}
`
    : ""
}

Para ver tus reservas visita: ${process.env.FRONTEND_URL || "http://localhost:5173"}/my-reservations

¡Esperamos que disfrutes tu estadía!

Club Salvadoreño
info@clubsalvadoreno.com
        `,
      },

      booking_reminder: {
        subject: `🔔 Recordatorio: Tu estadía en ${data.accommodationName} es mañana`,
        htmlContent: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #f59e0b, #d97706); color: white; padding: 20px; text-align: center;">
              <h1 style="margin: 0; font-size: 24px;">🔔 Recordatorio de Estadía</h1>
              <p style="margin: 10px 0 0 0; font-size: 16px;">Tu check-in es mañana</p>
            </div>
            
            <div style="padding: 30px; background: #f9fafb;">
              <h2 style="color: #1f2937; margin-bottom: 20px;">¡Hola ${data.guestName}!</h2>
              <p style="color: #4b5563; line-height: 1.6;">
                Te recordamos que tu estadía en <strong>${data.accommodationName}</strong> comienza mañana. 
                ¡Esperamos que tengas una experiencia maravillosa!
              </p>
              
              <div style="background: white; border-radius: 8px; padding: 20px; margin: 20px 0; border-left: 4px solid #f59e0b;">
                <h3 style="color: #1f2937; margin: 0 0 15px 0;">📅 Detalles de tu Estadía</h3>
                <table style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="padding: 8px 0; color: #6b7280;">Reserva:</td>
                    <td style="padding: 8px 0; color: #1f2937; font-weight: bold;">${data.reservationId}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #6b7280;">Check-in:</td>
                    <td style="padding: 8px 0; color: #1f2937; font-weight: bold;">${new Date(data.checkIn).toLocaleDateString("es-ES", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #6b7280;">Check-out:</td>
                    <td style="padding: 8px 0; color: #1f2937;">${new Date(data.checkOut).toLocaleDateString("es-ES", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</td>
                  </tr>
                </table>
              </div>

              <div style="background: #dbeafe; border-radius: 8px; padding: 15px; margin: 20px 0;">
                <p style="color: #1e40af; margin: 0; font-size: 14px;">
                  💼 <strong>Recomendaciones:</strong> No olvides llevar una identificación válida y 
                  confirma la hora de check-in con tu anfitrión si es necesario.
                </p>
              </div>
            </div>
          </div>
        `,
        textContent: `
🔔 Recordatorio - Club Salvadoreño

¡Hola ${data.guestName}!

Te recordamos que tu estadía en ${data.accommodationName} comienza mañana.

DETALLES:
- Reserva: ${data.reservationId}
- Check-in: ${new Date(data.checkIn).toLocaleDateString("es-ES")}
- Check-out: ${new Date(data.checkOut).toLocaleDateString("es-ES")}

¡No olvides llevar tu identificación!

Club Salvadoreño
        `,
      },

      payment_reminder: {
        subject: `💳 Recordatorio de Pago - Reserva ${data.reservationId}`,
        htmlContent: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #dc2626, #b91c1c); color: white; padding: 20px; text-align: center;">
              <h1 style="margin: 0; font-size: 24px;">💳 Recordatorio de Pago</h1>
              <p style="margin: 10px 0 0 0; font-size: 16px;">Pago pendiente para tu reserva</p>
            </div>
            
            <div style="padding: 30px; background: #f9fafb;">
              <h2 style="color: #1f2937; margin-bottom: 20px;">¡Hola ${data.guestName}!</h2>
              <p style="color: #4b5563; line-height: 1.6;">
                Tienes un pago pendiente para tu reserva en <strong>${data.accommodationName}</strong>. 
                Para garantizar tu estadía, por favor completa el pago antes de la fecha límite.
              </p>
              
              <div style="background: #fef2f2; border-radius: 8px; padding: 20px; margin: 20px 0; border-left: 4px solid #dc2626;">
                <h3 style="color: #1f2937; margin: 0 0 15px 0;">💰 Información de Pago</h3>
                <table style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="padding: 8px 0; color: #6b7280;">Reserva:</td>
                    <td style="padding: 8px 0; color: #1f2937; font-weight: bold;">${data.reservationId}</td>
                  </tr>
                  ${
                    data.totalAmount
                      ? `
                  <tr>
                    <td style="padding: 8px 0; color: #6b7280;">Monto:</td>
                    <td style="padding: 8px 0; color: #dc2626; font-weight: bold; font-size: 18px;">$${data.totalAmount.toFixed(2)} USD</td>
                  </tr>
                  `
                      : ""
                  }
                  ${
                    data.paymentDueDate
                      ? `
                  <tr>
                    <td style="padding: 8px 0; color: #6b7280;">Fecha límite:</td>
                    <td style="padding: 8px 0; color: #dc2626; font-weight: bold;">${new Date(data.paymentDueDate).toLocaleDateString("es-ES")}</td>
                  </tr>
                  `
                      : ""
                  }
                </table>
              </div>

              <div style="text-align: center; margin: 30px 0;">
                <a href="${process.env.FRONTEND_URL || "http://localhost:5173"}/payment/${data.reservationId}" 
                   style="background: #dc2626; color: white; padding: 15px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 16px;">
                  Pagar Ahora
                </a>
              </div>
            </div>
          </div>
        `,
        textContent: `
💳 Recordatorio de Pago - Club Salvadoreño

¡Hola ${data.guestName}!

Tienes un pago pendiente para tu reserva en ${data.accommodationName}.

DETALLES:
- Reserva: ${data.reservationId}
${data.totalAmount ? `- Monto: $${data.totalAmount.toFixed(2)} USD` : ""}
${data.paymentDueDate ? `- Fecha límite: ${new Date(data.paymentDueDate).toLocaleDateString("es-ES")}` : ""}

Para pagar visita: ${process.env.FRONTEND_URL || "http://localhost:5173"}/payment/${data.reservationId}

Club Salvadoreño
        `,
      },

      booking_cancelled: {
        subject: `❌ Cancelación de Reserva - ${data.accommodationName}`,
        htmlContent: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #6b7280, #4b5563); color: white; padding: 20px; text-align: center;">
              <h1 style="margin: 0; font-size: 24px;">❌ Reserva Cancelada</h1>
              <p style="margin: 10px 0 0 0; font-size: 16px;">Confirmación de cancelación</p>
            </div>
            
            <div style="padding: 30px; background: #f9fafb;">
              <h2 style="color: #1f2937; margin-bottom: 20px;">¡Hola ${data.guestName}!</h2>
              <p style="color: #4b5563; line-height: 1.6;">
                Tu reserva en <strong>${data.accommodationName}</strong> ha sido cancelada exitosamente.
              </p>
              
              <div style="background: white; border-radius: 8px; padding: 20px; margin: 20px 0; border-left: 4px solid #6b7280;">
                <h3 style="color: #1f2937; margin: 0 0 15px 0;">📋 Detalles de la Cancelación</h3>
                <table style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="padding: 8px 0; color: #6b7280;">Reserva:</td>
                    <td style="padding: 8px 0; color: #1f2937; font-weight: bold;">${data.reservationId}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #6b7280;">Fecha original:</td>
                    <td style="padding: 8px 0; color: #1f2937;">${new Date(data.checkIn).toLocaleDateString("es-ES")} - ${new Date(data.checkOut).toLocaleDateString("es-ES")}</td>
                  </tr>
                  ${
                    data.cancellationReason
                      ? `
                  <tr>
                    <td style="padding: 8px 0; color: #6b7280;">Motivo:</td>
                    <td style="padding: 8px 0; color: #1f2937;">${data.cancellationReason}</td>
                  </tr>
                  `
                      : ""
                  }
                </table>
              </div>

              <div style="background: #f3f4f6; border-radius: 8px; padding: 15px; margin: 20px 0;">
                <p style="color: #4b5563; margin: 0; font-size: 14px;">
                  💡 Si realizaste algún pago, el reembolso será procesado según nuestra política de cancelación. 
                  Recibirás un correo adicional con los detalles del reembolso si aplica.
                </p>
              </div>
            </div>
          </div>
        `,
        textContent: `
❌ Reserva Cancelada - Club Salvadoreño

¡Hola ${data.guestName}!

Tu reserva en ${data.accommodationName} ha sido cancelada.

DETALLES:
- Reserva: ${data.reservationId}
- Fecha original: ${new Date(data.checkIn).toLocaleDateString("es-ES")} - ${new Date(data.checkOut).toLocaleDateString("es-ES")}
${data.cancellationReason ? `- Motivo: ${data.cancellationReason}` : ""}

Si tienes preguntas, contáctanos en info@clubsalvadoreno.com

Club Salvadoreño
        `,
      },
    };

    return (
      templates[templateType as keyof typeof templates] ||
      templates.booking_confirmation
    );
  }

  public async sendNotification(
    notificationData: EmailNotificationData,
  ): Promise<boolean> {
    try {
      const template = this.getEmailTemplate(
        notificationData.templateType,
        notificationData.data,
      );

      if (shouldUseMockAPI()) {
        // Use mock service for development
        const result = await mockSendResetEmail({
          email: notificationData.to,
          resetToken: "notification",
          resetUrl: `${process.env.FRONTEND_URL || "http://localhost:5173"}/notifications`,
        });

        console.log(`📧 Mock Email Notification Sent:`);
        console.log(`To: ${notificationData.to}`);
        console.log(`Type: ${notificationData.templateType}`);
        console.log(`Subject: ${template.subject}`);

        return result.success;
      }

      // Real email service integration would go here
      // Example: SendGrid, AWS SES, Mailgun, etc.
      const response = await fetch("/api/send-notification-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          to: notificationData.to,
          subject: template.subject,
          htmlContent: template.htmlContent,
          textContent: template.textContent,
          templateType: notificationData.templateType,
          data: notificationData.data,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to send email: ${response.statusText}`);
      }

      console.log(
        `✅ Email notification sent successfully to ${notificationData.to}`,
      );
      return true;
    } catch (error) {
      console.error("❌ Error sending email notification:", error);
      return false;
    }
  }

  // Convenience methods for different notification types
  public async sendBookingConfirmation(
    data: EmailNotificationData["data"],
  ): Promise<boolean> {
    return this.sendNotification({
      to: data.guestName, // This should be guest email
      templateType: "booking_confirmation",
      data,
    });
  }

  public async sendBookingReminder(
    data: EmailNotificationData["data"],
  ): Promise<boolean> {
    return this.sendNotification({
      to: data.guestName, // This should be guest email
      templateType: "booking_reminder",
      data,
    });
  }

  public async sendPaymentReminder(
    data: EmailNotificationData["data"],
  ): Promise<boolean> {
    return this.sendNotification({
      to: data.guestName, // This should be guest email
      templateType: "payment_reminder",
      data,
    });
  }

  public async sendBookingCancellation(
    data: EmailNotificationData["data"],
  ): Promise<boolean> {
    return this.sendNotification({
      to: data.guestName, // This should be guest email
      templateType: "booking_cancelled",
      data,
    });
  }
}

// Export singleton instance
export const emailNotificationService = EmailNotificationService.getInstance();
