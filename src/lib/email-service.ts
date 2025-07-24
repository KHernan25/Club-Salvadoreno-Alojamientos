// Conditional import for server-side only
let nodemailer: any = null;

export interface EmailOptions {
  to: string | string[];
  cc?: string | string[];
  bcc?: string | string[];
  subject: string;
  html?: string;
  text?: string;
  attachments?: {
    filename: string;
    content: Buffer | string;
    contentType?: string;
  }[];
}

export interface PasswordResetEmailData {
  userEmail: string;
  userName: string;
  resetToken: string;
  resetUrl: string;
  expiresIn?: string;
}

export interface NotificationEmailData {
  userEmail: string;
  userName: string;
  type:
    | "booking_confirmation"
    | "booking_reminder"
    | "payment_reminder"
    | "booking_cancelled"
    | "welcome"
    | "account_approved"
    | "account_rejected";
  data?: any;
}

export class EmailService {
  private static instance: EmailService;
  private transporter: any | null = null;
  private isConfigured = false;
  private isTestAccount = false;

  public static getInstance(): EmailService {
    if (!EmailService.instance) {
      EmailService.instance = new EmailService();
    }
    return EmailService.instance;
  }

  private constructor() {
    // Deferred initialization - will be called when first needed
  }

  private async initializeTransporter() {
    // Only initialize if we're on the server side
    if (typeof window !== "undefined") {
      console.log("📧 Email service disabled (client-side)");
      this.isConfigured = false;
      return;
    }

    // Try to load nodemailer
    try {
      const nodemailerModule = await import("nodemailer");
      nodemailer = nodemailerModule.default || nodemailerModule;
    } catch (error) {
      console.warn("nodemailer not available, email service will be disabled");
      this.isConfigured = false;
      return;
    }

    try {
      // Create test account for development if email config is incomplete
      let emailConfig: any;

      if (
        !process.env.EMAIL_HOST ||
        !process.env.EMAIL_USER ||
        !process.env.EMAIL_PASSWORD ||
        process.env.EMAIL_PASSWORD === "your-real-email-password-here" ||
        process.env.EMAIL_PASSWORD === "development-password"
      ) {
        console.log("📧 Creating Ethereal test account for development...");
        const testAccount = await nodemailer.createTestAccount();
        emailConfig = {
          host: testAccount.smtp.host,
          port: testAccount.smtp.port,
          secure: testAccount.smtp.secure,
          auth: {
            user: testAccount.user,
            pass: testAccount.pass,
          },
        };
        console.log("📧 Test account created:", testAccount.user);
      } else {
        emailConfig = {
          host: process.env.EMAIL_HOST,
          port: parseInt(process.env.EMAIL_PORT || "465"),
          secure: process.env.EMAIL_PORT === "465", // true for 465, false for other ports
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD,
          },
          tls: {
            rejectUnauthorized: false, // Para desarrollo con certificados locales
          },
        };
      }

      console.log("🔍 Email Config Debug:", {
        host: emailConfig.host,
        port: emailConfig.port,
        secure: emailConfig.secure,
        user: emailConfig.auth.user,
        passLength: emailConfig.auth.pass?.length || 0,
      });

      // Verificar que tenemos la configuración mínima necesaria
      if (
        !emailConfig.host ||
        !emailConfig.auth.user ||
        !emailConfig.auth.pass
      ) {
        console.warn(
          "⚠️ Email configuration incomplete. Some features may not work.",
        );
        console.warn(
          `Host: ${emailConfig.host}, User: ${emailConfig.auth.user}, Pass: ${emailConfig.auth.pass ? "[SET]" : "[EMPTY]"}`,
        );
        this.isConfigured = false;
        return;
      }

      this.transporter = nodemailer.createTransport(emailConfig);
      this.isConfigured = true;

      console.log("✅ Email service configured successfully");

      // Verificar la conexión
      this.transporter.verify((error, success) => {
        if (error) {
          console.error("❌ Email service verification failed:", error);
          this.isConfigured = false;
        } else {
          console.log("✅ Email server is ready to take messages");
        }
      });
    } catch (error) {
      console.error("❌ Error initializing email service:", error);
      this.isConfigured = false;
    }
  }

  public async isReady(): Promise<boolean> {
    if (!this.isConfigured && !this.transporter) {
      await this.initializeTransporter();
    }
    return this.isConfigured && this.transporter !== null;
  }

  private getPasswordResetTemplate(data: PasswordResetEmailData): {
    subject: string;
    html: string;
    text: string;
  } {
    const expiresIn = data.expiresIn || "1 hora";

    return {
      subject: "🔐 Recuperación de Contraseña - Club Salvadoreño",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f9fafb;">
          <div style="background: linear-gradient(135deg, #3b82f6, #1d4ed8); color: white; padding: 30px; text-align: center;">
            <h1 style="margin: 0; font-size: 28px;">🔐 Recuperación de Contraseña</h1>
            <p style="margin: 15px 0 0 0; font-size: 16px; opacity: 0.9;">Club Salvadoreño</p>
          </div>
          
          <div style="padding: 40px 30px; background: white;">
            <h2 style="color: #1f2937; margin: 0 0 20px 0;">¡Hola ${data.userName}!</h2>
            
            <p style="color: #4b5563; line-height: 1.6; margin-bottom: 25px;">
              Hemos recibido una solicitud para restablecer la contraseña de tu cuenta en Club Salvadoreño. 
              Si no realizaste esta solicitud, puedes ignorar este correo.
            </p>
            
            <div style="background: #f3f4f6; border-radius: 8px; padding: 20px; margin: 25px 0; text-align: center;">
              <p style="color: #1f2937; margin: 0 0 20px 0; font-size: 16px;">
                Para restablecer tu contraseña, haz clic en el siguiente botón:
              </p>
              
              <a href="${data.resetUrl}" 
                 style="display: inline-block; background: #3b82f6; color: white; padding: 15px 30px; 
                        text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px;
                        transition: background-color 0.3s;">
                Restablecer Contraseña
              </a>
            </div>
            
            <div style="background: #fef3c7; border-radius: 8px; padding: 15px; margin: 25px 0; border-left: 4px solid #f59e0b;">
              <p style="color: #92400e; margin: 0; font-size: 14px;">
                ⚠️ <strong>Importante:</strong> Este enlace expirará en ${expiresIn}. 
                Si necesitas más tiempo, solicita un nuevo enlace de recuperación.
              </p>
            </div>
            
            <p style="color: #6b7280; font-size: 14px; line-height: 1.5; margin: 25px 0;">
              Si el botón no funciona, copia y pega el siguiente enlace en tu navegador:<br>
              <a href="${data.resetUrl}" style="color: #3b82f6; word-break: break-all;">${data.resetUrl}</a>
            </p>
            
            <div style="margin: 30px 0; text-align: center;">
              <p style="color: #6b7280; font-size: 13px; margin: 0;">
                ¿Tienes problemas? Contáctanos en 
                <a href="mailto:info@clubsalvadoreno.com" style="color: #3b82f6;">info@clubsalvadoreno.com</a>
              </p>
            </div>
          </div>
          
          <div style="background: #f3f4f6; padding: 20px; text-align: center; color: #6b7280; font-size: 12px;">
            <p style="margin: 0;">© 2024 Club Salvadoreño. Todos los derechos reservados.</p>
            <p style="margin: 10px 0 0 0;">
              Este correo fue enviado desde una dirección de solo envío. Por favor no respondas a este correo.
            </p>
          </div>
        </div>
      `,
      text: `
🔐 Recuperación de Contraseña - Club Salvadoreño

¡Hola ${data.userName}!

Hemos recibido una solicitud para restablecer la contraseña de tu cuenta.

Para restablecer tu contraseña, visita el siguiente enlace:
${data.resetUrl}

⚠️ IMPORTANTE: Este enlace expirará en ${expiresIn}.

Si no realizaste esta solicitud, puedes ignorar este correo.

¿Tienes problemas? Contáctanos en info@clubsalvadoreno.com

---
Club Salvadoreño
© 2024 Todos los derechos reservados.
      `,
    };
  }

  private getNotificationTemplate(data: NotificationEmailData): {
    subject: string;
    html: string;
    text: string;
  } {
    const templates = {
      welcome: {
        subject: "🎉 ¡Bienvenido al Club Salvadoreño!",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #10b981, #059669); color: white; padding: 30px; text-align: center;">
              <h1 style="margin: 0; font-size: 28px;">🎉 ¡Bienvenido!</h1>
              <p style="margin: 15px 0 0 0; font-size: 16px;">Tu cuenta ha sido creada exitosamente</p>
            </div>
            
            <div style="padding: 40px 30px; background: #f9fafb;">
              <h2 style="color: #1f2937; margin: 0 0 20px 0;">¡Hola ${data.userName}!</h2>
              
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
                <a href="${process.env.FRONTEND_URL || "http://localhost:8080"}" 
                   style="background: #10b981; color: white; padding: 15px 30px; text-decoration: none; 
                          border-radius: 8px; font-weight: bold; font-size: 16px;">
                  Ir a Mi Cuenta
                </a>
              </div>
            </div>
          </div>
        `,
        text: `🎉 ¡Bienvenido al Club Salvadoreño!

¡Hola ${data.userName}!

Tu cuenta ha sido creada exitosamente. Ya puedes:
- Explorar alojamientos disponibles
- Hacer reservas 
- Gestionar tu perfil
- Acceder a ofertas exclusivas

Visita: ${process.env.FRONTEND_URL || "http://localhost:8080"}

¡Gracias por ser parte del Club Salvadoreño!`,
      },

      account_approved: {
        subject: "✅ Cuenta Aprobada - Club Salvadore��o",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #10b981, #059669); color: white; padding: 30px; text-align: center;">
              <h1 style="margin: 0; font-size: 28px;">✅ Cuenta Aprobada</h1>
              <p style="margin: 15px 0 0 0; font-size: 16px;">Tu solicitud ha sido aprobada</p>
            </div>
            
            <div style="padding: 40px 30px; background: #f9fafb;">
              <h2 style="color: #1f2937; margin: 0 0 20px 0;">¡Hola ${data.userName}!</h2>
              
              <p style="color: #4b5563; line-height: 1.6; margin-bottom: 25px;">
                ¡Excelentes noticias! Tu solicitud de registro ha sido aprobada por nuestro equipo. 
                Tu cuenta ya está activa y puedes comenzar a usar todos nuestros servicios.
              </p>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="${process.env.FRONTEND_URL || "http://localhost:8080"}" 
                   style="background: #10b981; color: white; padding: 15px 30px; text-decoration: none; 
                          border-radius: 8px; font-weight: bold; font-size: 16px;">
                  Iniciar Sesión
                </a>
              </div>
            </div>
          </div>
        `,
        text: `✅ Cuenta Aprobada - Club Salvadoreño

¡Hola ${data.userName}!

Tu solicitud de registro ha sido aprobada. Tu cuenta está activa.

Inicia sesión en: ${process.env.FRONTEND_URL || "http://localhost:8080"}

¡Bienvenido al Club Salvadoreño!`,
      },

      account_rejected: {
        subject: "❌ Solicitud de Registro - Club Salvadoreño",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #dc2626, #b91c1c); color: white; padding: 30px; text-align: center;">
              <h1 style="margin: 0; font-size: 28px;">Solicitud de Registro</h1>
              <p style="margin: 15px 0 0 0; font-size: 16px;">Información importante sobre tu solicitud</p>
            </div>
            
            <div style="padding: 40px 30px; background: #f9fafb;">
              <h2 style="color: #1f2937; margin: 0 0 20px 0;">Hola ${data.userName},</h2>
              
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
        `,
        text: `Solicitud de Registro - Club Salvadoreño

Hola ${data.userName},

Tu solicitud de registro no pudo ser procesada. 

Para más información, contacta a nuestro equipo:
Email: info@clubsalvadoreno.com

Gracias por tu interés en el Club Salvadoreño.`,
      },
    };

    return templates[data.type] || templates.welcome;
  }

  public async sendEmail(options: EmailOptions): Promise<boolean> {
    if (!(await this.isReady())) {
      console.error(
        "❌ Email service not configured. Check environment variables.",
      );
      console.error("📧 Cannot send email - service not ready:", {
        to: options.to,
        subject: options.subject,
        from:
          process.env.EMAIL_FROM ||
          '"Club Salvadoreño" <no-reply@clubsalvadoreno.com>',
      });
      return false; // Return false when email service is not configured
    }

    try {
      const mailOptions = {
        from:
          process.env.EMAIL_FROM ||
          '"Club Salvadoreño" <no-reply@clubsalvadoreno.com>',
        to: Array.isArray(options.to) ? options.to.join(", ") : options.to,
        cc: options.cc
          ? Array.isArray(options.cc)
            ? options.cc.join(", ")
            : options.cc
          : undefined,
        bcc: options.bcc
          ? Array.isArray(options.bcc)
            ? options.bcc.join(", ")
            : options.bcc
          : undefined,
        subject: options.subject,
        html: options.html,
        text: options.text,
        attachments: options.attachments,
      };

      const info = await this.transporter!.sendMail(mailOptions);

      console.log("✅ Email sent successfully:", {
        messageId: info.messageId,
        to: mailOptions.to,
        subject: mailOptions.subject,
      });

      // If using test account, show preview URL
      if (info.messageId && (emailConfig.host?.includes('ethereal') || mailOptions.from?.includes('ethereal'))) {
        const previewUrl = nodemailer.getTestMessageUrl(info);
        if (previewUrl) {
          console.log("📧 Preview email at:", previewUrl);
        }
      }

      return true;
    } catch (error) {
      console.error("❌ Error sending email:", error);
      return false;
    }
  }

  public async sendPasswordResetEmail(
    data: PasswordResetEmailData,
  ): Promise<boolean> {
    const template = this.getPasswordResetTemplate(data);

    return this.sendEmail({
      to: data.userEmail,
      subject: template.subject,
      html: template.html,
      text: template.text,
    });
  }

  public async sendNotificationEmail(
    data: NotificationEmailData,
  ): Promise<boolean> {
    const template = this.getNotificationTemplate(data);

    return this.sendEmail({
      to: data.userEmail,
      subject: template.subject,
      html: template.html,
      text: template.text,
    });
  }

  public async sendWelcomeEmail(
    userEmail: string,
    userName: string,
  ): Promise<boolean> {
    return this.sendNotificationEmail({
      userEmail,
      userName,
      type: "welcome",
    });
  }

  public async sendAccountApprovedEmail(
    userEmail: string,
    userName: string,
  ): Promise<boolean> {
    return this.sendNotificationEmail({
      userEmail,
      userName,
      type: "account_approved",
    });
  }

  public async sendAccountRejectedEmail(
    userEmail: string,
    userName: string,
  ): Promise<boolean> {
    return this.sendNotificationEmail({
      userEmail,
      userName,
      type: "account_rejected",
    });
  }
}

// Export singleton instance
export const emailService = EmailService.getInstance();
