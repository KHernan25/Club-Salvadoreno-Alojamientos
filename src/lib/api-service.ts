// API Service for backend integration
// Provides functions to interact with the real backend API

import { User } from "./user-database";

const API_BASE_URL = "/api";

// Response interfaces
interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

interface LoginRequest {
  username: string;
  password: string;
  rememberMe?: boolean;
}

interface AuthResponse {
  success: boolean;
  user?: User;
  token?: string;
  error?: string;
}

interface UserStats {
  total: number;
  active: number;
  pending: number;
  newThisMonth: number;
}

interface ReservationStats {
  total: number;
  confirmed: number;
  pending: number;
  cancelled: number;
  revenueThisMonth: number;
}

interface Accommodation {
  id: string;
  name: string;
  type: string;
  location: string;
  capacity: number;
  price: number;
  status: string;
  amenities: string[];
  images?: string[];
  description?: string;
}

interface Reservation {
  id: string;
  userId: string;
  accommodationId: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  totalPrice: number;
  status: string;
  createdAt: string;
  guestName?: string;
  accommodationName?: string;
}

// Helper function to make API requests
const apiRequest = async <T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<ApiResponse<T>> => {
  try {
    const url = `${API_BASE_URL}${endpoint}`;
    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    });

    // Try to parse JSON, but handle malformed responses
    let data: any;
    const text = await response.text();
    console.log("📥 Raw response text:", text);
    console.log("📊 Response status:", response.status);
    console.log(
      "📋 Response headers:",
      Object.fromEntries(response.headers.entries()),
    );

    try {
      data = text ? JSON.parse(text) : {};
      console.log("✅ Parsed JSON successfully:", data);
    } catch (parseError) {
      console.error("❌ Failed to parse response as JSON:", parseError);
      console.log("📄 Raw text that failed to parse:", text);
      return {
        success: false,
        error: `Invalid response format: ${response.status}`,
      };
    }

    if (!response.ok) {
      return {
        success: false,
        error: data.message || data.error || `HTTP ${response.status}`,
      };
    }

    return {
      success: true,
      data: data.data || data,
    };
  } catch (error) {
    console.error("API Request Error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Network error",
    };
  }
};

// Check if API is available
export const isApiAvailable = async (): Promise<boolean> => {
  // Temporalmente devolver false para usar solo datos mock
  // TODO: Restaurar una vez que el proxy esté funcionando
  return false;

  /*
  try {
    const response = await fetch("/health", {
      method: "GET",
      timeout: 5000,
    } as RequestInit);
    return response.ok;
  } catch (error) {
    console.log("API not available:", error);
    return false;
  }
  */
};

// Authentication functions
export const apiLogin = async (
  credentials: LoginRequest,
): Promise<AuthResponse> => {
  const result = await apiRequest<{ user: User; token: string }>(
    "/auth/login",
    {
      method: "POST",
      body: JSON.stringify(credentials),
    },
  );

  return {
    success: result.success,
    user: result.data?.user,
    token: result.data?.token,
    error: result.error,
  };
};

export const apiLogout = async (): Promise<void> => {
  await apiRequest("/auth/logout", {
    method: "POST",
  });
};

// User management functions
export const apiGetUsers = async (): Promise<User[]> => {
  // Devolver datos mock temporalmente - importar usuarios reales
  const { registeredUsers } = await import("./user-database");
  return registeredUsers;

  /* API call - restaurar cuando el proxy funcione
  const result = await apiRequest<User[]>("/users");
  return result.data || [];
  */
};

export const apiActivateUser = async (userId: string): Promise<boolean> => {
  const result = await apiRequest(`/users/${userId}/activate`, {
    method: "PATCH",
  });
  return result.success;
};

export const apiDeactivateUser = async (userId: string): Promise<boolean> => {
  const result = await apiRequest(`/users/${userId}/deactivate`, {
    method: "PATCH",
  });
  return result.success;
};

export const apiUpdateUser = async (
  userId: string,
  userData: Partial<User>,
): Promise<boolean> => {
  const result = await apiRequest(`/users/${userId}`, {
    method: "PUT",
    body: JSON.stringify(userData),
  });
  return result.success;
};

export const apiGetUserStats = async (): Promise<UserStats> => {
  // Devolver datos mock temporalmente
  return {
    total: 156,
    active: 142,
    pending: 3,
    newThisMonth: 12,
  };

  /* API call - restaurar cuando el proxy funcione
  const result = await apiRequest<UserStats>("/users/stats");
  return (
    result.data || {
      total: 0,
      active: 0,
      pending: 0,
      newThisMonth: 0,
    }
  );
  */
};

// Accommodation management functions
export const apiGetAccommodations = async (): Promise<Accommodation[]> => {
  const result = await apiRequest<Accommodation[]>("/accommodations");
  return result.data || [];
};

export const apiUpdateAccommodation = async (
  accommodationId: string,
  accommodationData: Partial<Accommodation>,
): Promise<boolean> => {
  const result = await apiRequest(`/accommodations/${accommodationId}`, {
    method: "PUT",
    body: JSON.stringify(accommodationData),
  });
  return result.success;
};

// Reservation management functions
export const apiGetReservations = async (): Promise<Reservation[]> => {
  const result = await apiRequest<Reservation[]>("/reservations");
  return result.data || [];
};

export const apiCreateReservation = async (
  reservationData: Partial<Reservation>,
): Promise<boolean> => {
  const result = await apiRequest("/reservations", {
    method: "POST",
    body: JSON.stringify(reservationData),
  });
  return result.success;
};

export const apiUpdateReservation = async (
  reservationId: string,
  reservationData: Partial<Reservation>,
): Promise<boolean> => {
  const result = await apiRequest(`/reservations/${reservationId}`, {
    method: "PUT",
    body: JSON.stringify(reservationData),
  });
  return result.success;
};

export const apiCancelReservation = async (
  reservationId: string,
): Promise<boolean> => {
  const result = await apiRequest(`/reservations/${reservationId}/cancel`, {
    method: "PATCH",
  });
  return result.success;
};

export const apiGetReservationStats = async (): Promise<ReservationStats> => {
  // Devolver datos mock temporalmente
  return {
    total: 89,
    confirmed: 67,
    pending: 5,
    cancelled: 17,
    revenueThisMonth: 12450,
  };

  /* API call - restaurar cuando el proxy funcione
  const result = await apiRequest<ReservationStats>("/reservations/stats");
  return (
    result.data || {
      total: 0,
      confirmed: 0,
      pending: 0,
      cancelled: 0,
      revenueThisMonth: 0,
    }
  );
  */
};

// Pricing functions
export const apiGetPricing = async (
  accommodationType: string,
  dateRange: string[],
): Promise<any> => {
  const result = await apiRequest(`/pricing/calculate`, {
    method: "POST",
    body: JSON.stringify({
      accommodationType,
      dates: dateRange,
    }),
  });
  return result.data;
};

// Contact functions
export const apiSendContactMessage = async (
  messageData: any,
): Promise<boolean> => {
  const result = await apiRequest("/contact", {
    method: "POST",
    body: JSON.stringify(messageData),
  });
  return result.success;
};

// Export all API functions for easy import
export const apiService = {
  // Auth
  login: apiLogin,
  logout: apiLogout,
  isAvailable: isApiAvailable,

  // Users
  getUsers: apiGetUsers,
  activateUser: apiActivateUser,
  deactivateUser: apiDeactivateUser,
  updateUser: apiUpdateUser,
  getUserStats: apiGetUserStats,

  // Accommodations
  getAccommodations: apiGetAccommodations,
  updateAccommodation: apiUpdateAccommodation,

  // Reservations
  getReservations: apiGetReservations,
  createReservation: apiCreateReservation,
  updateReservation: apiUpdateReservation,
  cancelReservation: apiCancelReservation,
  getReservationStats: apiGetReservationStats,

  // Pricing
  getPricing: apiGetPricing,

  // Contact
  sendContactMessage: apiSendContactMessage,
};

export default apiService;
