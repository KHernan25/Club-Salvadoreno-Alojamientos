// Servicio de registro de nuevos usuarios

import {
  registerNewUser,
  NewUserData,
  isUsernameAvailable,
  isEmailAvailable,
} from "./user-database";
import { authenticateUser } from "./auth-service";

export interface RegistrationData {
  firstName: string;
  lastName: string;
  email: string;
  documentType: string;
  documentNumber: string;
  memberCode: string;
  phone: string;
  password: string;
  confirmPassword: string;
  acceptTerms: boolean;
}

export interface RegistrationResult {
  success: boolean;
  user?: any;
  error?: string;
}

// Validaciones de campo
export const validateEmail = (email: string): string | null => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return "Por favor ingresa un correo electrónico válido";
  }
  return null;
};

export const validatePassword = (password: string): string | null => {
  if (password.length < 8) {
    return "La contraseña debe tener al menos 8 caracteres";
  }
  if (!/(?=.*[a-z])/.test(password)) {
    return "La contraseña debe contener al menos una letra minúscula";
  }
  if (!/(?=.*[A-Z])/.test(password)) {
    return "La contraseña debe contener al menos una letra mayúscula";
  }
  if (!/(?=.*\d)/.test(password)) {
    return "La contraseña debe contener al menos un número";
  }
  return null;
};

export const validatePhone = (phone: string): string | null => {
  // Formato salvadoreño: +503 1234-5678 o 1234-5678
  const phoneRegex = /^(\+503\s?)?[0-9]{4}-?[0-9]{4}$/;
  if (!phoneRegex.test(phone.replace(/\s/g, ""))) {
    return "Por favor ingresa un número de teléfono válido (formato: +503 1234-5678)";
  }
  return null;
};

export const validateDocumentNumber = (
  documentNumber: string,
  documentType: string,
): string | null => {
  if (documentType === "dui") {
    // DUI salvadoreño: 12345678-9
    const duiRegex = /^\d{8}-\d$/;
    if (!duiRegex.test(documentNumber)) {
      return "Por favor ingresa un DUI válido (formato: 12345678-9)";
    }
  } else if (documentType === "passport") {
    // Pasaporte: Al menos 6 caracteres alfanuméricos
    if (documentNumber.length < 6) {
      return "El número de pasaporte debe tener al menos 6 caracteres";
    }
  }
  return null;
};

// Función principal de registro
export const registerUser = async (
  registrationData: RegistrationData,
): Promise<RegistrationResult> => {
  // Simular delay de red
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const {
    firstName,
    lastName,
    email,
    documentType,
    documentNumber,
    memberCode,
    phone,
    password,
    confirmPassword,
    acceptTerms,
  } = registrationData;

  // Validaciones básicas
  if (!firstName.trim() || !lastName.trim()) {
    return {
      success: false,
      error: "Por favor completa tu nombre y apellidos",
    };
  }

  if (!email.trim()) {
    return { success: false, error: "Por favor ingresa tu correo electrónico" };
  }

  if (!documentType) {
    return {
      success: false,
      error: "Por favor selecciona el tipo de documento",
    };
  }

  if (!documentNumber.trim()) {
    return {
      success: false,
      error: "Por favor ingresa tu número de documento",
    };
  }

  if (!phone.trim()) {
    return { success: false, error: "Por favor ingresa tu número de teléfono" };
  }

  if (!password) {
    return { success: false, error: "Por favor ingresa una contraseña" };
  }

  if (!acceptTerms) {
    return {
      success: false,
      error: "Debes aceptar los términos y condiciones",
    };
  }

  // Validaciones específicas
  const emailError = validateEmail(email);
  if (emailError) {
    return { success: false, error: emailError };
  }

  const passwordError = validatePassword(password);
  if (passwordError) {
    return { success: false, error: passwordError };
  }

  const phoneError = validatePhone(phone);
  if (phoneError) {
    return { success: false, error: phoneError };
  }

  const documentError = validateDocumentNumber(documentNumber, documentType);
  if (documentError) {
    return { success: false, error: documentError };
  }

  if (password !== confirmPassword) {
    return { success: false, error: "Las contraseñas no coinciden" };
  }

  // Verificar disponibilidad
  if (!isEmailAvailable(email)) {
    return {
      success: false,
      error: "Este correo electrónico ya está registrado",
    };
  }

  // Formatear datos para registro
  const newUserData: NewUserData = {
    firstName: firstName.trim(),
    lastName: lastName.trim(),
    email: email.trim().toLowerCase(),
    documentType,
    documentNumber: documentNumber.trim(),
    memberCode: memberCode.trim(),
    phone: phone.trim(),
    password,
  };

  // Registrar usuario
  const registrationResult = registerNewUser(newUserData);

  if (!registrationResult.success) {
    return {
      success: false,
      error: registrationResult.error || "Error al registrar usuario",
    };
  }

  // Registro exitoso - devolver información para redirección al login
  // IMPORTANTE: El usuario queda en estado "pending" hasta ser aprobado por un administrador
  return {
    success: true,
    user: registrationResult.user,
    message:
      "Registro exitoso. Tu cuenta está pendiente de aprobación por parte del administrador. Te notificaremos por correo cuando sea activada.",
  };
};

// Función helper para generar username desde email
export const generateUsernameFromEmail = (email: string): string => {
  return email.split("@")[0].toLowerCase();
};

// Función para verificar si los términos están aceptados
export const validateTermsAcceptance = (accepted: boolean): string | null => {
  if (!accepted) {
    return "Debes aceptar los términos y condiciones para continuar";
  }
  return null;
};
