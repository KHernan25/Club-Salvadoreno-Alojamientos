// Servicio para gestión de bitácora de actividades

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

export interface CreateActivityLogEntry {
  contenido: string;
}

// URL base de la API
const API_BASE_URL = "http://localhost:3001/api/activity-log";

// Helper para obtener el token de autenticación
const getAuthToken = (): string | null => {
  return localStorage.getItem("auth_token");
};

// Helper para headers con autenticación
const getAuthHeaders = (): HeadersInit => {
  const token = getAuthToken();
  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

// Obtener todas las entradas de actividad permitidas para el usuario
export const getActivityLogs = async (): Promise<ActivityLogEntry[]> => {
  try {
    const response = await fetch(API_BASE_URL, {
      method: "GET",
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (data.success) {
      return data.data || [];
    } else {
      throw new Error(data.error || "Error obteniendo bitácora de actividades");
    }
  } catch (error) {
    console.error("Error getting activity logs:", error);
    throw error;
  }
};

// Crear nueva entrada de actividad
export const createActivityLogEntry = async (
  entry: CreateActivityLogEntry,
): Promise<ActivityLogEntry> => {
  try {
    const response = await fetch(API_BASE_URL, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(entry),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (data.success) {
      return data.data;
    } else {
      throw new Error(data.error || "Error creando entrada de actividad");
    }
  } catch (error) {
    console.error("Error creating activity log entry:", error);
    throw error;
  }
};

// Eliminar entrada de actividad (solo SuperAdmin)
export const deleteActivityLogEntry = async (id: string): Promise<void> => {
  try {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.error || "Error eliminando entrada de actividad");
    }
  } catch (error) {
    console.error("Error deleting activity log entry:", error);
    throw error;
  }
};

// Formatear fecha para mostrar en UI
export const formatActivityLogDate = (isoString: string): string => {
  try {
    const date = new Date(isoString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    // Resetear horas para comparación de fechas
    const dateOnly = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
    );
    const todayOnly = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate(),
    );
    const yesterdayOnly = new Date(
      yesterday.getFullYear(),
      yesterday.getMonth(),
      yesterday.getDate(),
    );

    if (dateOnly.getTime() === todayOnly.getTime()) {
      return `Hoy, ${date.toLocaleTimeString("es-ES", {
        hour: "2-digit",
        minute: "2-digit",
      })}`;
    } else if (dateOnly.getTime() === yesterdayOnly.getTime()) {
      return `Ayer, ${date.toLocaleTimeString("es-ES", {
        hour: "2-digit",
        minute: "2-digit",
      })}`;
    } else {
      return date.toLocaleDateString("es-ES", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    }
  } catch (error) {
    console.error("Error formatting activity log date:", error);
    return isoString;
  }
};

// Obtener nombre de rol en español
export const getRoleDisplayName = (role: string): string => {
  const roleNames: { [key: string]: string } = {
    super_admin: "Super Admin",
    atencion_miembro: "Atención al Miembro",
    anfitrion: "Anfitrión",
    monitor: "Monitor",
    mercadeo: "Mercadeo",
    recepcion: "Recepción",
    porteria: "Portería",
    miembro: "Miembro",
    user: "Usuario",
  };

  return roleNames[role] || role;
};

// Validar contenido antes de enviar
export const validateActivityContent = (content: string): string | null => {
  if (!content || content.trim().length === 0) {
    return "El contenido de la actividad es requerido";
  }

  if (content.length > 1000) {
    return "El contenido no puede exceder 1000 caracteres";
  }

  return null;
};
