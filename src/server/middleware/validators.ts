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

// Validadores para reseñas
export const validateReview = [
  body("accommodationId")
    .trim()
    .notEmpty()
    .withMessage("ID del alojamiento es requerido"),
  body("reservationId")
    .trim()
    .notEmpty()
    .withMessage("ID de la reserva es requerido"),
  body("rating")
    .isInt({ min: 1, max: 5 })
    .withMessage("La calificación debe ser entre 1 y 5"),
  body("title")
    .trim()
    .isLength({ min: 5, max: 100 })
    .withMessage("El título debe tener entre 5 y 100 caracteres"),
  body("comment")
    .trim()
    .isLength({ min: 20, max: 1000 })
    .withMessage("El comentario debe tener entre 20 y 1000 caracteres"),
  body("categories.cleanliness")
    .isInt({ min: 1, max: 5 })
    .withMessage("Calificación de limpieza inválida"),
  body("categories.communication")
    .isInt({ min: 1, max: 5 })
    .withMessage("Calificación de comunicación inválida"),
  body("categories.checkin")
    .isInt({ min: 1, max: 5 })
    .withMessage("Calificación de check-in inválida"),
  body("categories.accuracy")
    .isInt({ min: 1, max: 5 })
    .withMessage("Calificación de precisión inválida"),
  body("categories.location")
    .isInt({ min: 1, max: 5 })
    .withMessage("Calificación de ubicación inválida"),
  body("categories.value")
    .isInt({ min: 1, max: 5 })
    .withMessage("Calificación de valor inválida"),
  handleValidationErrors,
];

// Validadores para logs de actividad
export const validateActivityLog = [
  body("date").isISO8601().withMessage("Fecha inválida"),
  body("type")
    .isIn(["check_in", "check_out", "maintenance", "cleaning", "inspection"])
    .withMessage("Tipo de actividad inválido"),
  body("location")
    .isIn(["el-sunzal", "corinto"])
    .withMessage("Ubicación inválida"),
  body("accommodationId")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("ID de alojamiento inválido"),
  body("description")
    .trim()
    .isLength({ min: 5, max: 200 })
    .withMessage("Descripción debe tener entre 5 y 200 caracteres"),
  body("details")
    .trim()
    .isLength({ min: 10, max: 1000 })
    .withMessage("Detalles deben tener entre 10 y 1000 caracteres"),
  body("priority")
    .isIn(["low", "medium", "high"])
    .withMessage("Prioridad inválida"),
  handleValidationErrors,
];

// Validadores para actualización de usuario
export const validateUserUpdate = [
  body("firstName")
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage("Nombre debe tener entre 2 y 50 caracteres"),
  body("lastName")
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage("Apellido debe tener entre 2 y 50 caracteres"),
  body("email")
    .optional()
    .isEmail()
    .normalizeEmail()
    .withMessage("Correo electrónico inválido"),
  body("phone")
    .optional()
    .matches(/^(\+503\s?)?[0-9]{4}-?[0-9]{4}$/)
    .withMessage("Número de teléfono inválido"),
  body("role")
    .optional()
    .isIn([
      "miembro",
      "recepcion",
      "porteria",
      "monitor",
      "anfitrion",
      "mercadeo",
      "atencion_miembro",
      "super_admin",
    ])
    .withMessage("Rol inválido"),
  body("isActive")
    .optional()
    .isBoolean()
    .withMessage("Estado activo debe ser booleano"),
  handleValidationErrors,
];

// Validadores para archivos subidos
export const validateFileUpload = [
  body("fileType")
    .optional()
    .isIn(["image", "document", "avatar"])
    .withMessage("Tipo de archivo inválido"),
  handleValidationErrors,
];
