import express from "express";
import { body, validationResult } from "express-validator";
import { authenticateToken, AuthenticatedRequest } from "../middleware/auth";
import { asyncHandler, createError } from "../middleware/errorHandler";
import { RegistrationRequestModel } from "../database/models";

const router = express.Router();

// Get all registration requests
router.get(
  "/",
  authenticateToken,
  asyncHandler(async (req: AuthenticatedRequest, res) => {
    // Check if user has permission to view registration requests
    const user = req.user;
    if (!user || !["super_admin", "atencion_miembro"].includes(user.role)) {
      throw createError(
        "No tienes permisos para ver las solicitudes de registro",
        403,
      );
    }

    const requests = await RegistrationRequestModel.getAll();

    res.json({
      success: true,
      data: requests,
    });
  }),
);

// Approve a registration request
router.post(
  "/:id/approve",
  authenticateToken,
  [body("notes").optional().isString().trim()],
  asyncHandler(async (req: AuthenticatedRequest, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw createError("Datos de entrada inválidos", 400);
    }

    const user = req.user;
    if (!user || !["super_admin", "atencion_miembro"].includes(user.role)) {
      throw createError(
        "No tienes permisos para aprobar solicitudes de registro",
        403,
      );
    }

    const requestId = req.params.id;
    const { notes } = req.body;

    // Find the registration request
    const request = await RegistrationRequestModel.findById(requestId);
    if (!request) {
      throw createError("Solicitud de registro no encontrada", 404);
    }

    if (request.status !== "pending") {
      throw createError("Esta solicitud ya ha sido procesada", 400);
    }

    // Update the request status
    const approvedRequest = await RegistrationRequestModel.approve(
      requestId,
      user.id,
      notes,
    );

    // TODO: In a real application, you would:
    // 1. Create the user account in the database
    // 2. Send a welcome email to the user
    // 3. Log the action for audit purposes

    console.log(
      `Registration request ${requestId} approved by ${user.username}`,
    );

    res.json({
      success: true,
      data: approvedRequest,
      message: "Solicitud aprobada exitosamente",
    });
  }),
);

// Reject a registration request
router.post(
  "/:id/reject",
  authenticateToken,
  [
    body("rejectionReason")
      .notEmpty()
      .withMessage("La razón del rechazo es requerida"),
    body("notes").optional().isString().trim(),
  ],
  asyncHandler(async (req: AuthenticatedRequest, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw createError("Datos de entrada inválidos", 400);
    }

    const user = req.user;
    if (!user || !["super_admin", "atencion_miembro"].includes(user.role)) {
      throw createError(
        "No tienes permisos para rechazar solicitudes de registro",
        403,
      );
    }

    const requestId = req.params.id;
    const { rejectionReason, notes } = req.body;

    // Find the registration request
    const request = await RegistrationRequestModel.findById(requestId);
    if (!request) {
      throw createError("Solicitud de registro no encontrada", 404);
    }

    if (request.status !== "pending") {
      throw createError("Esta solicitud ya ha sido procesada", 400);
    }

    // Update the request status
    const rejectedRequest = await RegistrationRequestModel.reject(
      requestId,
      user.id,
      rejectionReason,
      notes,
    );

    // TODO: In a real application, you would:
    // 1. Send a rejection email to the user with the reason
    // 2. Log the action for audit purposes
    // 3. Optionally, clean up any temporary data

    console.log(
      `Registration request ${requestId} rejected by ${user.username}: ${rejectionReason}`,
    );

    res.json({
      success: true,
      data: rejectedRequest,
      message: "Solicitud rechazada exitosamente",
    });
  }),
);

// Get registration request by ID
router.get(
  "/:id",
  authenticateToken,
  asyncHandler(async (req: AuthenticatedRequest, res) => {
    const user = req.user;
    if (!user || !["super_admin", "atencion_miembro"].includes(user.role)) {
      throw createError(
        "No tienes permisos para ver las solicitudes de registro",
        403,
      );
    }

    const requestId = req.params.id;
    const request = await RegistrationRequestModel.findById(requestId);

    if (!request) {
      throw createError("Solicitud de registro no encontrada", 404);
    }

    res.json({
      success: true,
      data: request,
    });
  }),
);

export default router;
