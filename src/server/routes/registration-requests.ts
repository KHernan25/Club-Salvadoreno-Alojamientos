import express from "express";
import { body, validationResult } from "express-validator";
import { authenticateToken, AuthenticatedRequest } from "../middleware/auth";

const router = express.Router();

// Type definitions for registration requests
interface RegistrationRequest {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  documentType: string;
  documentNumber: string;
  memberCode: string;
  status: "pending" | "approved" | "rejected";
  requestedAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
  rejectionReason?: string;
  notes?: string;
}

// Mock data for registration requests
// In a real application, this would come from a database
const registrationRequests = [
  {
    id: "req-001",
    firstName: "María",
    lastName: "González",
    email: "maria.gonzalez@email.com",
    phone: "+503 7234-5678",
    documentType: "dui",
    documentNumber: "12345678-9",
    memberCode: "MEM001",
    status: "pending",
    requestedAt: "2024-01-15T10:30:00Z",
  },
  {
    id: "req-002",
    firstName: "Carlos",
    lastName: "Rodríguez",
    email: "carlos.rodriguez@email.com",
    phone: "+503 7234-5679",
    documentType: "passport",
    documentNumber: "AB123456",
    memberCode: "MEM002",
    status: "pending",
    requestedAt: "2024-01-14T15:20:00Z",
  },
  {
    id: "req-003",
    firstName: "Ana",
    lastName: "Martínez",
    email: "ana.martinez@email.com",
    phone: "+503 7234-5680",
    documentType: "dui",
    documentNumber: "98765432-1",
    memberCode: "MEM003",
    status: "approved",
    requestedAt: "2024-01-13T09:15:00Z",
    reviewedAt: "2024-01-13T11:30:00Z",
    reviewedBy: "admin",
  },
  {
    id: "req-004",
    firstName: "Roberto",
    lastName: "Flores",
    email: "roberto.flores@email.com",
    phone: "+503 7234-5681",
    documentType: "dui",
    documentNumber: "11223344-5",
    memberCode: "MEM004",
    status: "rejected",
    requestedAt: "2024-01-12T14:30:00Z",
    reviewedAt: "2024-01-12T16:45:00Z",
    reviewedBy: "admin",
    rejectionReason: "Información del documento incompleta",
  },
];

// Get all registration requests
router.get("/", authenticateToken, (req, res) => {
  try {
    // Check if user has permission to view registration requests
    const user = req.user;
    if (!user || !["super_admin", "atencion_miembro"].includes(user.role)) {
      return res.status(403).json({
        success: false,
        error: "No tienes permisos para ver las solicitudes de registro",
      });
    }

    res.json({
      success: true,
      data: registrationRequests,
    });
  } catch (error) {
    console.error("Error fetching registration requests:", error);
    res.status(500).json({
      success: false,
      error: "Error interno del servidor",
    });
  }
});

// Approve a registration request
router.post(
  "/:id/approve",
  authenticateToken,
  [body("notes").optional().isString().trim()],
  (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          error: "Datos de entrada inválidos",
          details: errors.array(),
        });
      }

      const user = req.user;
      if (!user || !["super_admin", "atencion_miembro"].includes(user.role)) {
        return res.status(403).json({
          success: false,
          error: "No tienes permisos para aprobar solicitudes de registro",
        });
      }

      const requestId = req.params.id;
      const { notes } = req.body;

      // Find the registration request
      const requestIndex = registrationRequests.findIndex(
        (r) => r.id === requestId,
      );

      if (requestIndex === -1) {
        return res.status(404).json({
          success: false,
          error: "Solicitud de registro no encontrada",
        });
      }

      const request = registrationRequests[requestIndex];

      if (request.status !== "pending") {
        return res.status(400).json({
          success: false,
          error: "Esta solicitud ya ha sido procesada",
        });
      }

      // Update the request status
      registrationRequests[requestIndex] = {
        ...request,
        status: "approved",
        reviewedAt: new Date().toISOString(),
        reviewedBy: user.username,
        notes: notes || undefined,
      };

      // In a real application, you would:
      // 1. Create the user account in the database
      // 2. Send a welcome email to the user
      // 3. Log the action for audit purposes

      console.log(
        `Registration request ${requestId} approved by ${user.username}`,
      );

      res.json({
        success: true,
        data: registrationRequests[requestIndex],
        message: "Solicitud aprobada exitosamente",
      });
    } catch (error) {
      console.error("Error approving registration request:", error);
      res.status(500).json({
        success: false,
        error: "Error interno del servidor",
      });
    }
  },
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
  (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          error: "Datos de entrada inválidos",
          details: errors.array(),
        });
      }

      const user = req.user;
      if (!user || !["super_admin", "atencion_miembro"].includes(user.role)) {
        return res.status(403).json({
          success: false,
          error: "No tienes permisos para rechazar solicitudes de registro",
        });
      }

      const requestId = req.params.id;
      const { rejectionReason, notes } = req.body;

      // Find the registration request
      const requestIndex = registrationRequests.findIndex(
        (r) => r.id === requestId,
      );

      if (requestIndex === -1) {
        return res.status(404).json({
          success: false,
          error: "Solicitud de registro no encontrada",
        });
      }

      const request = registrationRequests[requestIndex];

      if (request.status !== "pending") {
        return res.status(400).json({
          success: false,
          error: "Esta solicitud ya ha sido procesada",
        });
      }

      // Update the request status
      registrationRequests[requestIndex] = {
        ...request,
        status: "rejected",
        reviewedAt: new Date().toISOString(),
        reviewedBy: user.username,
        rejectionReason,
        notes: notes || undefined,
      };

      // In a real application, you would:
      // 1. Send a rejection email to the user with the reason
      // 2. Log the action for audit purposes
      // 3. Optionally, clean up any temporary data

      console.log(
        `Registration request ${requestId} rejected by ${user.username}: ${rejectionReason}`,
      );

      res.json({
        success: true,
        data: registrationRequests[requestIndex],
        message: "Solicitud rechazada exitosamente",
      });
    } catch (error) {
      console.error("Error rejecting registration request:", error);
      res.status(500).json({
        success: false,
        error: "Error interno del servidor",
      });
    }
  },
);

// Get registration request by ID
router.get("/:id", authenticateToken, (req, res) => {
  try {
    const user = req.user;
    if (!user || !["super_admin", "atencion_miembro"].includes(user.role)) {
      return res.status(403).json({
        success: false,
        error: "No tienes permisos para ver las solicitudes de registro",
      });
    }

    const requestId = req.params.id;
    const request = registrationRequests.find((r) => r.id === requestId);

    if (!request) {
      return res.status(404).json({
        success: false,
        error: "Solicitud de registro no encontrada",
      });
    }

    res.json({
      success: true,
      data: request,
    });
  } catch (error) {
    console.error("Error fetching registration request:", error);
    res.status(500).json({
      success: false,
      error: "Error interno del servidor",
    });
  }
});

export default router;
