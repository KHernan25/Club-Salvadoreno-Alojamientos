// API Service for backend integration
// Provides functions to interact with the real backend API

import { User } from "./user-database";

const API_BASE_URL = "/api";

// Token management
const TOKEN_KEY = "auth_token";

export const setAuthToken = (token: string): void => {
  localStorage.setItem(TOKEN_KEY, token);
};

export const getAuthToken = (): string | null => {
  return localStorage.getItem(TOKEN_KEY);
};

export const clearAuthToken = (): void => {
  localStorage.removeItem(TOKEN_KEY);
};

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

    // Prepare headers with authentication
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...options.headers,
    };

    // Add authorization header if token exists
    const token = getAuthToken();
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(url, {
      headers,
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
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 1000); // 1 second timeout

    const response = await fetch("/health", {
      method: "GET",
      signal: controller.signal,
    });

    clearTimeout(timeoutId);
    return response.ok;
  } catch (error) {
    console.log("API not available:", error);
    return false;
  }
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

  // Save token if login successful
  if (result.success && result.data?.token) {
    setAuthToken(result.data.token);
  }

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
  try {
    const result = await apiRequest<{ users: User[] }>("/users?limit=1000");
    if (result.success && result.data?.users) {
      return result.data.users;
    }
    throw new Error(result.error || "Failed to fetch users");
  } catch (error) {
    console.warn("API call failed, falling back to mock data:", error);
    const { registeredUsers } = await import("./user-database");
    return registeredUsers;
  }
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
  try {
    const result = await apiRequest<UserStats>("/users/stats");
    if (result.success && result.data) {
      return result.data;
    }
    throw new Error(result.error || "Failed to fetch user stats");
  } catch (error) {
    console.warn("API call failed, falling back to mock data:", error);
    return {
      total: 156,
      active: 142,
      pending: 3,
      newThisMonth: 12,
    };
  }
};

// Accommodation management functions
export const apiGetAccommodations = async (): Promise<Accommodation[]> => {
  try {
    const result = await apiRequest<Accommodation[]>("/accommodations");
    if (result.success && result.data) {
      return result.data;
    }
    throw new Error(result.error || "Failed to fetch accommodations");
  } catch (error) {
    console.warn("API call failed, falling back to mock data:", error);
    return [
      {
        id: "el-sunzal-apt-1",
        name: "Apartamento El Sunzal 1",
        type: "apartment",
        location: "El Sunzal",
        capacity: 4,
        price: 120,
        status: "available",
        amenities: ["wifi", "ac", "parking", "kitchen"],
        description: "Apartamento frente al mar con vista panorámica",
      },
      {
        id: "el-sunzal-casa-1",
        name: "Casa El Sunzal 1",
        type: "house",
        location: "El Sunzal",
        capacity: 8,
        price: 250,
        status: "available",
        amenities: ["wifi", "ac", "parking", "kitchen", "pool"],
        description: "Casa familiar con piscina privada",
      },
      {
        id: "corinto-casa-1",
        name: "Casa Corinto 1",
        type: "house",
        location: "Corinto",
        capacity: 6,
        price: 180,
        status: "available",
        amenities: ["wifi", "ac", "parking", "kitchen"],
        description: "Casa acogedora en zona tranquila",
      },
    ];
  }
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
  try {
    const result = await apiRequest<Reservation[]>("/reservations");
    if (result.success && result.data) {
      return result.data;
    }
    throw new Error(result.error || "Failed to fetch reservations");
  } catch (error) {
    console.warn("API call failed, falling back to mock data:", error);
    return [
      {
        id: "res-001",
        userId: "6",
        accommodationId: "el-sunzal-apt-1",
        checkIn: "2024-07-01",
        checkOut: "2024-07-03",
        guests: 2,
        totalPrice: 240,
        status: "confirmed",
        createdAt: "2024-06-20T10:00:00Z",
        guestName: "María José González",
        accommodationName: "Apartamento El Sunzal 1",
      },
      {
        id: "res-002",
        userId: "7",
        accommodationId: "corinto-casa-1",
        checkIn: "2024-07-05",
        checkOut: "2024-07-07",
        guests: 4,
        totalPrice: 360,
        status: "pending",
        createdAt: "2024-06-21T14:30:00Z",
        guestName: "Carlos Rivera",
        accommodationName: "Casa Corinto 1",
      },
    ];
  }
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
  try {
    const result = await apiRequest<ReservationStats>("/reservations/stats");
    if (result.success && result.data) {
      return result.data;
    }
    throw new Error(result.error || "Failed to fetch reservation stats");
  } catch (error) {
    console.warn("API call failed, falling back to mock data:", error);
    return {
      total: 89,
      confirmed: 67,
      pending: 5,
      cancelled: 17,
      revenueThisMonth: 12450,
    };
  }
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

// Registration Requests functions
export const apiGetRegistrationRequests = async (): Promise<{
  success: boolean;
  requests: RegistrationRequest[];
}> => {
  try {
    const result = await apiRequest("/registration-requests");
    return {
      success: result.success,
      requests: result.data || [],
    };
  } catch (error) {
    console.error("Error fetching registration requests:", error);
    throw error;
  }
};

export const apiApproveRegistrationRequest = async (
  requestId: string,
  notes?: string,
): Promise<boolean> => {
  const result = await apiRequest(
    `/registration-requests/${requestId}/approve`,
    {
      method: "POST",
      body: JSON.stringify({ notes }),
    },
  );
  return result.success;
};

export const apiRejectRegistrationRequest = async (
  requestId: string,
  rejectionReason: string,
  notes?: string,
): Promise<boolean> => {
  const result = await apiRequest(
    `/registration-requests/${requestId}/reject`,
    {
      method: "POST",
      body: JSON.stringify({ rejectionReason, notes }),
    },
  );
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

  // Registration Requests
  getRegistrationRequests: apiGetRegistrationRequests,
  approveRegistrationRequest: apiApproveRegistrationRequest,
  rejectRegistrationRequest: apiRejectRegistrationRequest,
};

// Export interfaces
export type { RegistrationRequest };

export default apiService;
