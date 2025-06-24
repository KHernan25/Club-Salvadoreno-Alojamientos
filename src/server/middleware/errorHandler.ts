import { Request, Response, NextFunction } from "express";

export interface AppError extends Error {
  statusCode?: number;
  status?: string;
  isOperational?: boolean;
}

export const errorHandler = (
  error: AppError,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  let { statusCode = 500, message } = error;

  // Log del error (separate from response)
  console.error("🚨 Error:", {
    error: message,
    stack: error.stack,
    url: req.url,
    method: req.method,
    ip: req.ip,
    userAgent: req.get("User-Agent"),
  });

  // Error de validación
  if (error.name === "ValidationError") {
    statusCode = 400;
    message = "Datos de entrada inválidos";
  }

  // Error de JWT
  if (error.name === "JsonWebTokenError") {
    statusCode = 401;
    message = "Token de autenticación inválido";
  }

  if (error.name === "TokenExpiredError") {
    statusCode = 401;
    message = "Token de autenticación expirado";
  }

  // Error de cast (IDs inválidos)
  if (error.name === "CastError") {
    statusCode = 400;
    message = "ID de recurso inválido";
  }

  // Error de duplicado
  if (error.message.includes("duplicate key")) {
    statusCode = 409;
    message = "El recurso ya existe";
  }

  // Respuesta de error limpia
  const errorResponse = {
    success: false,
    error: message,
    statusCode,
    timestamp: new Date().toISOString(),
  };

  res.status(statusCode).json(errorResponse);
};

export const createError = (
  message: string,
  statusCode: number = 500,
): AppError => {
  const error: AppError = new Error(message);
  error.statusCode = statusCode;
  error.isOperational = true;
  return error;
};

export const asyncHandler = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
