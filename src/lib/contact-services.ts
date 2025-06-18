// Email and SMS service utilities for password recovery
import {
  mockSendResetEmail,
  mockSendResetSMS,
  shouldUseMockAPI,
} from "./mock-api";

interface EmailParams {
  to: string;
  resetToken: string;
  resetUrl: string;
}

interface SMSParams {
  phone: string;
  code: string;
}

// Email service
export const sendPasswordResetEmail = async (
  params: EmailParams,
): Promise<boolean> => {
  try {
    // Use mock API in development or when real API is not configured
    if (shouldUseMockAPI()) {
      const result = await mockSendResetEmail({
        email: params.to,
        resetToken: params.resetToken,
        resetUrl: params.resetUrl,
      });
      return result.success;
    }

    // In a real implementation, you would call your email service here
    // For example: SendGrid, AWS SES, Mailgun, or your backend API
    const response = await fetch("/api/send-reset-email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: params.to,
        resetToken: params.resetToken,
        resetUrl: params.resetUrl,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to send email");
    }

    const result = await response.json();
    return result.success;
  } catch (error) {
    console.error("Error sending password reset email:", error);
    return false;
  }
};

// SMS service
export const sendPasswordResetSMS = async (
  params: SMSParams,
): Promise<boolean> => {
  try {
    // In a real implementation, you would call your SMS service here
    // For example: Twilio, AWS SNS, or your backend API

    const response = await fetch("/api/send-reset-sms", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        phone: params.phone,
        code: params.code,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to send SMS");
    }

    const result = await response.json();
    return result.success;
  } catch (error) {
    console.error("Error sending password reset SMS:", error);

    // Fallback: Log the SMS details for development/testing
    console.log("SMS would be sent to:", params.phone);
    console.log("Reset Code:", params.code);

    // For development, always return true to test the flow
    if (process.env.NODE_ENV === "development") {
      return true;
    }

    return false;
  }
};

// Utility functions
export const generateResetToken = (): string => {
  return (
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15)
  );
};

export const generateSMSCode = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export const generateResetUrl = (token: string): string => {
  const baseUrl = window.location.origin;
  return `${baseUrl}/reset-password?token=${token}`;
};

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePhone = (phone: string): boolean => {
  // Accept formats: +503 1234-5678, 1234-5678, +50312345678, 12345678
  const phoneRegex = /^(\+503\s?)?[0-9]{4}-?[0-9]{4}$/;
  return phoneRegex.test(phone.replace(/\s/g, ""));
};

export const formatPhoneNumber = (phone: string): string => {
  // Remove all non-numeric characters except +
  const cleaned = phone.replace(/[^\d+]/g, "");

  // If doesn't start with +503, add it
  if (!cleaned.startsWith("+503")) {
    return "+503" + cleaned;
  }

  return cleaned;
};
