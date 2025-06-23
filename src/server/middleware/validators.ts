import { body, param, query, validationResult } from "express-validator";
import { Request, Response, NextFunction } from "express";
import { createError } from "./errorHandler";

// Middleware para manejar resultados de validación
export const handleValidationErrors = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map((error) => error.msg);
    throw createError(errorMessages.join(", "), 400);
  }
  next();
};

// Validadores de autenticación
export const validateLogin = [
  body("username")
    .trim()
    .notEmpty()
    .withMessage("Usuario o correo es requerido"),
  body("password").notEmpty().withMessage("Contraseña es requerida"),
  handleValidationErrors,
];

export const validateRegistration = [
  body("firstName")
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage("Nombre debe tener entre 2 y 50 caracteres"),
  body("lastName")
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage("Apellido debe tener entre 2 y 50 caracteres"),
  body("email")
    .isEmail()
    .normalizeEmail()
    .withMessage("Correo electrónico inválido"),
  body("documentType")
    .isIn(["dui", "passport"])
    .withMessage("Tipo de documento debe ser DUI o pasaporte"),
  body("documentNumber")
    .trim()
    .notEmpty()
    .withMessage("Número de documento es requerido"),
  body("phone")
    .matches(/^(\+503\s?)?[0-9]{4}-?[0-9]{4}$/)
    .withMessage("Número de teléfono inválido (formato: +503 1234-5678)"),
  body("password")
    .isLength({ min: 8 })
    .withMessage("Contraseña debe tener al menos 8 caracteres")
    .matches(/(?=.*[a-z])/)
    .withMessage("Contraseña debe contener al menos una letra minúscula")
    .matches(/(?=.*[A-Z])/)
    .withMessage("Contraseña debe contener al menos una letra mayúscula")
    .matches(/(?=.*\d)/)
    .withMessage("Contraseña debe contener al menos un número"),
  body("confirmPassword").custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error("Las contraseñas no coinciden");
    }
    return true;
  }),
  body("acceptTerms")
    .equals("true")
    .withMessage("Debes aceptar los términos y condiciones"),
  handleValidationErrors,
];

// Validadores de reservas
export const validateReservation = [
  body("accommodationId")
    .trim()
    .notEmpty()
    .withMessage("ID de alojamiento es requerido"),
  body("checkIn")
    .isISO8601()
    .withMessage("Fecha de entrada inválida")
    .custom((value) => {
      const checkInDate = new Date(value);
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0);

      if (checkInDate < tomorrow) {
        throw new Error("La fecha de entrada debe ser al menos mañana");
      }
      return true;
    }),
  body("checkOut")
    .isISO8601()
    .withMessage("Fecha de salida inválida")
    .custom((value, { req }) => {
      const checkOutDate = new Date(value);
      const checkInDate = new Date(req.body.checkIn);

      if (checkOutDate <= checkInDate) {
        throw new Error(
          "La fecha de salida debe ser posterior a la fecha de entrada",
        );
      }

      const diffTime = checkOutDate.getTime() - checkInDate.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays > 7) {
        throw new Error("La estadía no puede exceder 7 días consecutivos");
      }

      return true;
    }),
  body("guests")
    .isInt({ min: 1, max: 20 })
    .withMessage("Número de huéspedes debe estar entre 1 y 20"),
  body("specialRequests")
    .optional()
    .isLength({ max: 500 })
    .withMessage("Solicitudes especiales no pueden exceder 500 caracteres"),
  handleValidationErrors,
];

// Validadores de contacto
export const validateContact = [
  body("name")
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage("Nombre debe tener entre 2 y 100 caracteres"),
  body("email")
    .isEmail()
    .normalizeEmail()
    .withMessage("Correo electrónico inválido"),
  body("phone")
    .optional()
    .matches(/^(\+503\s?)?[0-9]{4}-?[0-9]{4}$/)
    .withMessage("Número de teléfono inválido"),
  body("subject")
    .trim()
    .isLength({ min: 5, max: 200 })
    .withMessage("Asunto debe tener entre 5 y 200 caracteres"),
  body("message")
    .trim()
    .isLength({ min: 10, max: 1000 })
    .withMessage("Mensaje debe tener entre 10 y 1000 caracteres"),
  handleValidationErrors,
];

// Validadores de recuperación de contraseña
export const validatePasswordReset = [
  body("email")
    .isEmail()
    .normalizeEmail()
    .withMessage("Correo electrónico inválido"),
  handleValidationErrors,
];

export const validatePasswordResetConfirm = [
  body("token")
    .trim()
    .notEmpty()
    .withMessage("Token de recuperación es requerido"),
  body("password")
    .isLength({ min: 8 })
    .withMessage("Contraseña debe tener al menos 8 caracteres")
    .matches(/(?=.*[a-z])/)
    .withMessage("Contraseña debe contener al menos una letra minúscula")
    .matches(/(?=.*[A-Z])/)
    .withMessage("Contraseña debe contener al menos una letra mayúscula")
    .matches(/(?=.*\d)/)
    .withMessage("Contraseña debe contener al menos un número"),
  body("confirmPassword").custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error("Las contraseñas no coinciden");
    }
    return true;
  }),
  handleValidationErrors,
];

// Validadores de parámetros de URL
export const validateIdParam = [
  param("id").trim().notEmpty().withMessage("ID es requerido"),
  handleValidationErrors,
];

// Validadores de query parameters
export const validatePaginationQuery = [
  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Página debe ser un número entero mayor a 0"),
  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("Límite debe ser un número entre 1 y 100"),
  handleValidationErrors,
];

export const validateDateRangeQuery = [
  query("startDate")
    .optional()
    .isISO8601()
    .withMessage("Fecha de inicio inválida"),
  query("endDate")
    .optional()
    .isISO8601()
    .withMessage("Fecha de fin inválida")
    .custom((value, { req }) => {
      if (value && req.query.startDate) {
        const endDate = new Date(value);
        const startDate = new Date(req.query.startDate as string);
        if (endDate <= startDate) {
          throw new Error("Fecha de fin debe ser posterior a fecha de inicio");
        }
      }
      return true;
    }),
  handleValidationErrors,
];
