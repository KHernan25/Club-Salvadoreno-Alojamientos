// Mock API implementation for development and testing
// This file provides fallback functionality when real API endpoints are not available

interface EmailRequest {
  email: string;
  resetToken: string;
  resetUrl: string;
}

interface SMSRequest {
  phone: string;
  code: string;
}

// Mock email sending function
export const mockSendResetEmail = async (
  params: EmailRequest,
): Promise<{ success: boolean; message?: string }> => {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 1500));

  // Simulate random failures for testing (10% failure rate)
  const shouldFail = Math.random() < 0.1;

  if (shouldFail) {
    return {
      success: false,
      message: "Failed to send email - mock failure",
    };
  }

  // Log email details for development
  console.log("📧 Mock Email Sent:");
  console.log("To:", params.email);
  console.log("Reset URL:", params.resetUrl);
  console.log("Token:", params.resetToken);

  // In a real app, this would contain the actual email content
  const emailContent = `
    Club Salvadoreño - Recuperación de Contraseña
    
    Hola,
    
    Has solicitado restablecer tu contraseña. Haz clic en el siguiente enlace para continuar:
    
    ${params.resetUrl}
    
    Este enlace expira en 1 hora.
    
    Si no solicitaste este cambio, puedes ignorar este mensaje.
    
    Saludos,
    Equipo de Club Salvadoreño
  `;

  console.log("Email Content:\n", emailContent);

  return {
    success: true,
    message: "Email sent successfully",
  };
};

// Mock SMS sending function
export const mockSendResetSMS = async (
  params: SMSRequest,
): Promise<{ success: boolean; message?: string }> => {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 1200));

  // Simulate random failures for testing (5% failure rate)
  const shouldFail = Math.random() < 0.05;

  if (shouldFail) {
    return {
      success: false,
      message: "Failed to send SMS - mock failure",
    };
  }

  // Log SMS details for development
  console.log("📱 Mock SMS Sent:");
  console.log("To:", params.phone);
  console.log("Code:", params.code);

  // In a real app, this would be the actual SMS content
  const smsContent = `Club Salvadoreño: Tu código de verificación es ${params.code}. Este código expira en 10 minutos.`;

  console.log("SMS Content:", smsContent);

  return {
    success: true,
    message: "SMS sent successfully",
  };
};

// Utility to check if we should use mock APIs
export const shouldUseMockAPI = (): boolean => {
  try {
    // Check if FORCE_REAL_API environment variable is set
    if (
      typeof process !== "undefined" &&
      process.env?.FORCE_REAL_API === "true"
    ) {
      console.log("🔄 Using REAL API (FORCE_REAL_API=true)");
      return false;
    }

    // Check if database is configured and available
    if (typeof process !== "undefined" && process.env) {
      const hasDatabase =
        (process.env.DB_TYPE === "mysql" || process.env.DB_TYPE === "sqlite") &&
        process.env.DATABASE_URL;
      const hasRealEmail =
        process.env.EMAIL_PASSWORD &&
        process.env.EMAIL_PASSWORD !== "REEMPLAZAR_CON_CONTRASEÑA_REAL" &&
        process.env.EMAIL_PASSWORD !== "development-password" &&
        process.env.EMAIL_PASSWORD !== "your-real-email-password-here";

      if (hasDatabase && hasRealEmail) {
        console.log(
          `🔄 Using REAL API (${process.env.DB_TYPE} + Email configured)`,
        );
        return false;
      }

      if (hasDatabase) {
        console.log(
          `🔄 Using REAL API for database, MOCK for email (${process.env.DB_TYPE} configured, email not configured)`,
        );
        return false; // We can still use real database operations
      }
    }

    // Client-side fallback
    if (typeof window !== "undefined") {
      // In production build, try to use real API
      if (import.meta.env?.PROD === true) {
        console.log("🔄 Using REAL API (production build)");
        return false;
      }
    }

    // Fallback to mock API if database not configured
    console.log("🔄 Using MOCK API (no database/email configured)");
    return true;
  } catch (error) {
    // If any error occurs, default to mock API for safety
    console.warn("Error determining API mode, defaulting to mock:", error);
    return true;
  }
};
