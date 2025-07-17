import express, { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import { authenticateToken } from "../middleware/auth";

const router = express.Router();

// Interface para entradas de actividad
export interface ActivityLogEntry {
  id: string;
  usuarioId: string;
  fecha: string; // ISO string
  contenido: string;
  createdAt: string;
  usuario?: {
    firstName: string;
    lastName: string;
    email: string;
    role: string;
  };
}

// Mock storage para las entradas de actividad
let activityLogs: ActivityLogEntry[] = [
  {
    id: "log-1",
    usuarioId: "admin",
    fecha: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    contenido:
      "Revisé las reservas pendientes y confirmé 3 nuevas reservaciones para el fin de semana.",
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    usuario: {
      firstName: "Super",
      lastName: "Admin",
      email: "admin@clubsalvadoreno.com",
      role: "super_admin",
    },
  },
  {
    id: "log-2",
    usuarioId: "recepcion",
    fecha: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    contenido:
      "Atendí consultas de huéspedes y coordiné el check-in de 2 familias en El Sunzal.",
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    usuario: {
      firstName: "María",
      lastName: "Recepción",
      email: "recepcion@clubsalvadoreno.com",
      role: "atencion_miembro",
    },
  },
  {
    id: "log-3",
    usuarioId: "admin",
    fecha: new Date().toISOString(),
    contenido:
      "Configuré las tarifas especiales para temporada alta y actualicé el calendario de disponibilidad.",
    createdAt: new Date().toISOString(),
    usuario: {
      firstName: "Super",
      lastName: "Admin",
      email: "admin@clubsalvadoreno.com",
      role: "super_admin",
    },
  },
];

// GET /api/activity-log - Obtener entradas de actividad
router.get("/", authenticateToken, async (req: Request, res: Response) => {
  try {
    const { user } = req as any;

    // Filtrar según permisos:
    // - SuperAdmin ve todas las entradas
    // - Otros usuarios solo ven sus propias entradas
    let filteredLogs = activityLogs;

    if (user.role !== "super_admin") {
      filteredLogs = activityLogs.filter((log) => log.usuarioId === user.id);
    }

    // Ordenar por fecha descendente (más recientes primero)
    const sortedLogs = filteredLogs.sort(
      (a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime(),
    );

    res.json({
      success: true,
      data: sortedLogs,
      total: sortedLogs.length,
    });
  } catch (error) {
    console.error("Error getting activity logs:", error);
    res.status(500).json({
      success: false,
      error: "Error obteniendo bitácora de actividades",
    });
  }
});

// POST /api/activity-log - Crear nueva entrada de actividad
router.post(
  "/",
  authenticateToken,
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { user } = req as any;
      const { contenido } = req.body;

      // Validar contenido
      if (
        !contenido ||
        typeof contenido !== "string" ||
        contenido.trim().length === 0
      ) {
        return res.status(400).json({
          success: false,
          error: "El contenido de la actividad es requerido",
        });
      }

      if (contenido.length > 1000) {
        return res.status(400).json({
          success: false,
          error: "El contenido no puede exceder 1000 caracteres",
        });
      }

      // Crear nueva entrada
      const newEntry: ActivityLogEntry = {
        id: uuidv4(),
        usuarioId: user.id,
        fecha: new Date().toISOString(),
        contenido: contenido.trim(),
        createdAt: new Date().toISOString(),
        usuario: {
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          role: user.role,
        },
      };

      // Agregar al array
      activityLogs.unshift(newEntry); // Agregar al inicio para mantener orden descendente

      res.status(201).json({
        success: true,
        data: newEntry,
        message: "Entrada de actividad creada exitosamente",
      });
    } catch (error) {
      console.error("Error creating activity log:", error);
      res.status(500).json({
        success: false,
        error: "Error creando entrada de actividad",
      });
    }
  },
);

// DELETE /api/activity-log/:id - Eliminar entrada (solo para SuperAdmin)
router.delete(
  "/:id",
  authenticateToken,
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { user } = req as any;
      const { id } = req.params;

      // Solo SuperAdmin puede eliminar entradas
      if (user.role !== "super_admin") {
        return res.status(403).json({
          success: false,
          error: "No tienes permisos para eliminar entradas de actividad",
        });
      }

      // Buscar y eliminar entrada
      const index = activityLogs.findIndex((log) => log.id === id);
      if (index === -1) {
        return res.status(404).json({
          success: false,
          error: "Entrada de actividad no encontrada",
        });
      }

      activityLogs.splice(index, 1);

      res.json({
        success: true,
        message: "Entrada de actividad eliminada exitosamente",
      });
    } catch (error) {
      console.error("Error deleting activity log:", error);
      res.status(500).json({
        success: false,
        error: "Error eliminando entrada de actividad",
      });
    }
  },
);

export default router;
