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
  pricing?: {
    weekday: number;
    weekend: number;
    holiday: number;
  };
  available?: boolean;
  view?: string;
}

interface Reservation {
  id: string;
  userId: string;
  accommodationId: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  totalPrice: number;
  status: "pending" | "confirmed" | "cancelled" | "completed";
  createdAt: string;
  updatedAt?: string;
  paymentStatus: "pending" | "paid" | "refunded";
  paymentMethod?: "pay_later" | "payment_link" | "transfer" | "credit" | "card";
  confirmationCode: string;
  specialRequests?: string;
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
    };

    // Add custom headers if provided
    if (options.headers) {
      Object.entries(options.headers).forEach(([key, value]) => {
        if (typeof value === "string") {
          headers[key] = value;
        }
      });
    }

    // Add authorization header if token exists
    const token = getAuthToken();
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(url, {
      headers,
      ...options,
    });

    console.log("📊 Response status:", response.status);

    let data: any = {};

    // Only parse JSON for successful responses with content
    if (response.status !== 204) {
      const contentType = response.headers.get("content-type") || "";

      if (contentType.includes("application/json")) {
        try {
          data = await response.json();
          console.log("✅ Parsed JSON successfully:", data);
        } catch (jsonError) {
          console.error("❌ JSON parse error:", jsonError);
          return {
            success: false,
            error: `Invalid JSON response: ${response.status}`,
          };
        }
      } else {
        console.log("📄 Non-JSON response, using empty data");
      }
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

// Cache API availability status to avoid repeated health checks
let apiAvailabilityCache: { status: boolean; timestamp: number } | null = null;
const API_CACHE_DURATION = 30000; // 30 seconds

// Check if API is available
export const isApiAvailable = async (): Promise<boolean> => {
  // Check cache first
  if (
    apiAvailabilityCache &&
    Date.now() - apiAvailabilityCache.timestamp < API_CACHE_DURATION
  ) {
    console.log(
      "🔍 Using cached API availability:",
      apiAvailabilityCache.status,
    );
    return apiAvailabilityCache.status;
  }

  try {
    console.log("🔍 Checking API health at /health...");
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000); // Reduced to 2 second timeout

    const response = await fetch("/health", {
      method: "GET",
      signal: controller.signal,
    });

    clearTimeout(timeoutId);
    console.log("🔍 Health check response:", response.status, response.ok);

    const isAvailable = response.ok;
    if (isAvailable) {
      const healthData = await response.json();
      console.log("✅ API is available:", healthData);
    } else {
      console.log("❌ API health check failed:", response.status);
    }

    // Cache the result
    apiAvailabilityCache = { status: isAvailable, timestamp: Date.now() };
    return isAvailable;
  } catch (error) {
    console.log("❌ API not available:", error);
    // Cache the failure
    apiAvailabilityCache = { status: false, timestamp: Date.now() };
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
  // Clear stored token
  clearAuthToken();
};

export const apiRegister = async (userData: {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone?: string;
}): Promise<ApiResponse<{ user: User; token: string }>> => {
  return apiRequest("/auth/register", {
    method: "POST",
    body: JSON.stringify(userData),
  });
};

export const apiGetCurrentUser = async (): Promise<ApiResponse<User>> => {
  return apiRequest("/auth/me");
};

export const apiRefreshToken = async (): Promise<
  ApiResponse<{ token: string }>
> => {
  return apiRequest("/auth/refresh", {
    method: "POST",
  });
};

export const apiForgotPassword = async (
  email: string,
): Promise<ApiResponse<{ message: string }>> => {
  return apiRequest("/auth/forgot-password", {
    method: "POST",
    body: JSON.stringify({ email }),
  });
};

export const apiResetPassword = async (
  token: string,
  newPassword: string,
): Promise<ApiResponse<{ message: string }>> => {
  return apiRequest("/auth/reset-password", {
    method: "POST",
    body: JSON.stringify({ token, newPassword }),
  });
};

export const apiValidateToken = async (): Promise<
  ApiResponse<{ valid: boolean; user?: User }>
> => {
  return apiRequest("/auth/validate-token");
};

// User management functions
export const apiGetUsers = async (): Promise<User[]> => {
  try {
    // Check if we have a token before making the request
    const token = getAuthToken();
    if (!token) {
      console.warn("No auth token available for users, using mock data");
      const { registeredUsers } = await import("./user-database");
      return registeredUsers;
    }

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

export const apiGetUserById = async (
  userId: string,
): Promise<ApiResponse<User>> => {
  return apiRequest(`/users/${userId}`);
};

export const apiDeleteUser = async (
  userId: string,
): Promise<ApiResponse<{ message: string }>> => {
  return apiRequest(`/users/${userId}`, {
    method: "DELETE",
  });
};

export const apiGetUserStats = async (): Promise<UserStats> => {
  try {
    const result = await apiRequest<UserStats>("/users/stats/summary");
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
    // Check if we have a token before making the request
    const token = getAuthToken();
    if (!token) {
      console.warn(
        "No auth token available for accommodations, using mock data",
      );
      return getMockAccommodations();
    }

    const result = await apiRequest<{ accommodations: Accommodation[] }>(
      "/accommodations",
    );
    if (result.success && result.data) {
      // Extract accommodations array from the response data structure
      return Array.isArray(result.data)
        ? result.data
        : result.data.accommodations || [];
    }
    throw new Error(result.error || "Failed to fetch accommodations");
  } catch (error) {
    console.warn("API call failed, falling back to mock data:", error);
    return getMockAccommodations();
  }
};

// Helper function for mock accommodations
const getMockAccommodations = (): Accommodation[] => {
  return [
    {
      id: "1A",
      name: "Apartamento 1A",
      type: "apartamento",
      location: "el-sunzal",
      capacity: 2,
      price: 230,
      status: "available",
      amenities: ["Wi-Fi", "Aire acondicionado", "TV"],
      description: "Cómodo apartamento con vista al mar",
      pricing: { weekday: 110, weekend: 230, holiday: 280 },
    },
    {
      id: "2A",
      name: "Apartamento 2A",
      type: "apartamento",
      location: "el-sunzal",
      capacity: 2,
      price: 250,
      status: "available",
      amenities: ["Wi-Fi", "Aire acondicionado", "TV"],
      description: "Apartamento familiar con vista al mar",
      pricing: { weekday: 120, weekend: 250, holiday: 300 },
    },
    {
      id: "suite1",
      name: "Suite 1",
      type: "suite",
      location: "el-sunzal",
      capacity: 2,
      price: 320,
      status: "available",
      amenities: ["Wi-Fi", "Aire acondicionado", "TV Premium", "Minibar"],
      description: "Suite de lujo con servicios premium",
      pricing: { weekday: 180, weekend: 320, holiday: 420 },
    },
    {
      id: "casa1",
      name: "Casa Surf Paradise",
      type: "casa",
      location: "el-sunzal",
      capacity: 6,
      price: 450,
      status: "available",
      amenities: ["Wi-Fi", "Aire acondicionado", "Cocina completa", "Terraza"],
      description: "Casa amplia para familias",
      pricing: { weekday: 250, weekend: 450, holiday: 550 },
    },
    {
      id: "corinto1A",
      name: "Apartamento Corinto 1A",
      type: "apartamento",
      location: "corinto",
      capacity: 2,
      price: 180,
      status: "available",
      amenities: ["Wi-Fi", "Aire acondicionado", "TV"],
      description: "Apartamento con vista al lago",
      pricing: { weekday: 85, weekend: 180, holiday: 220 },
    },
    {
      id: "corinto-casa-1",
      name: "Casa del Lago",
      type: "casa",
      location: "corinto",
      capacity: 6,
      price: 280,
      status: "available",
      amenities: ["Wi-Fi", "Aire acondicionado", "Cocina equipada", "Jardín"],
      description: "Casa con vista directa al lago",
      pricing: { weekday: 140, weekend: 280, holiday: 350 },
    },
  ];
};

export const apiGetAccommodationById = async (
  accommodationId: string,
): Promise<ApiResponse<Accommodation>> => {
  return apiRequest(`/accommodations/${accommodationId}`);
};

export const apiGetAccommodationsByLocation = async (
  location: string,
): Promise<ApiResponse<Accommodation[]>> => {
  return apiRequest(`/accommodations/location/${location}`);
};

export const apiCheckAccommodationAvailability = async (
  accommodationId: string,
  checkIn: string,
  checkOut: string,
): Promise<ApiResponse<{ available: boolean; message?: string }>> => {
  return apiRequest(
    `/accommodations/search/availability?accommodationId=${accommodationId}&checkIn=${checkIn}&checkOut=${checkOut}`,
  );
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
export const apiGetReservations = async (
  isAdmin: boolean = false,
): Promise<Reservation[]> => {
  try {
    // Check if we have a token before making the request
    const token = getAuthToken();
    if (!token) {
      console.warn("No auth token available, using mock data");
      return getMockReservations(isAdmin);
    }

    const endpoint = isAdmin ? "/reservations/all" : "/reservations";
    const result = await apiRequest<any>(endpoint);

    if (result.success && result.data) {
      // Handle different response formats
      if (isAdmin && result.data.reservations) {
        // Admin endpoint returns { data: { reservations: [...], pagination: {...} } }
        return result.data.reservations as Reservation[];
      } else if (Array.isArray(result.data)) {
        // Regular endpoint returns array directly
        return result.data as Reservation[];
      } else if (
        result.data.reservations &&
        Array.isArray(result.data.reservations)
      ) {
        // Fallback for wrapped array format
        return result.data.reservations as Reservation[];
      }
    }
    throw new Error(result.error || "Failed to fetch reservations");
  } catch (error) {
    console.warn("API call failed, falling back to mock data:", error);
    return getMockReservations(isAdmin);
  }
};

// Helper function to get mock reservations
const getMockReservations = (isAdmin: boolean): Reservation[] => {
  const mockReservations = [
    {
      id: "res-001",
      userId: "7",
      accommodationId: "1A",
      checkIn: "2024-06-30",
      checkOut: "2024-07-02",
      guests: 2,
      totalPrice: 460,
      status: "confirmed" as const,
      paymentStatus: "paid" as const,
      confirmationCode: "CRV001",
      createdAt: "2024-06-20T10:00:00Z",
      updatedAt: "2024-06-20T10:00:00Z",
      specialRequests: "Vista al mar, llegada tardía",
    },
    {
      id: "res-002",
      userId: "8",
      accommodationId: "corinto-casa-1",
      checkIn: "2024-07-05",
      checkOut: "2024-07-07",
      guests: 4,
      totalPrice: 560,
      status: "pending" as const,
      paymentStatus: "pending" as const,
      confirmationCode: "AMT002",
      createdAt: "2024-06-21T14:30:00Z",
      updatedAt: "2024-06-21T14:30:00Z",
      specialRequests: "Llegada en la mañana",
    },
    {
      id: "res-003",
      userId: "10",
      accommodationId: "suite1",
      checkIn: "2024-07-10",
      checkOut: "2024-07-12",
      guests: 2,
      totalPrice: 640,
      status: "confirmed" as const,
      paymentStatus: "paid" as const,
      confirmationCode: "DEM003",
      createdAt: "2024-06-22T09:15:00Z",
      updatedAt: "2024-06-22T09:15:00Z",
      specialRequests: "Celebración de aniversario",
    },
    {
      id: "res-004",
      userId: "9",
      accommodationId: "casa1",
      checkIn: "2024-07-15",
      checkOut: "2024-07-18",
      guests: 6,
      totalPrice: 1350,
      status: "cancelled" as const,
      paymentStatus: "refunded" as const,
      confirmationCode: "JPZ004",
      createdAt: "2024-06-23T11:45:00Z",
      updatedAt: "2024-06-25T16:20:00Z",
      specialRequests: "Cancelación por emergencia familiar",
    },
    {
      id: "res-005",
      userId: "7",
      accommodationId: "corinto1A",
      checkIn: "2024-07-20",
      checkOut: "2024-07-22",
      guests: 2,
      totalPrice: 360,
      status: "pending" as const,
      paymentStatus: "pending" as const,
      confirmationCode: "CRV005",
      createdAt: "2024-06-24T08:30:00Z",
      updatedAt: "2024-06-24T08:30:00Z",
      specialRequests: "Cuna para bebé",
    },
  ];

  // If not admin, filter to only show reservations for current user
  if (!isAdmin) {
    // In a real scenario, we'd filter by current user ID
    return mockReservations.slice(0, 1); // Just return one for regular users
  }

  return mockReservations;
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

export const apiGetReservationById = async (
  reservationId: string,
): Promise<ApiResponse<Reservation>> => {
  return apiRequest(`/reservations/${reservationId}`);
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
export const apiGetPricingRates = async (): Promise<ApiResponse<any>> => {
  return apiRequest("/pricing/rates");
};

export const apiCalculatePricing = async (
  accommodationId: string,
  checkIn: string,
  checkOut: string,
  guests?: number,
): Promise<
  ApiResponse<{
    basePrice: number;
    totalPrice: number;
    nights: number;
    breakdown: any[];
    taxes: number;
    fees: number;
  }>
> => {
  return apiRequest("/pricing/calculate", {
    method: "POST",
    body: JSON.stringify({
      accommodationId,
      checkIn,
      checkOut,
      guests,
    }),
  });
};

export const apiGetDayTypes = async (): Promise<ApiResponse<any>> => {
  return apiRequest("/pricing/day-types");
};

export const apiGetAccommodationPricing = async (
  accommodationId: string,
): Promise<ApiResponse<any>> => {
  return apiRequest(`/pricing/accommodation/${accommodationId}`);
};

export const apiComparePricing = async (
  accommodationIds: string[],
  checkIn: string,
  checkOut: string,
): Promise<ApiResponse<any>> => {
  return apiRequest(
    `/pricing/compare?ids=${accommodationIds.join(",")}&checkIn=${checkIn}&checkOut=${checkOut}`,
  );
};

export const apiGetLowestPrices = async (
  location?: string,
  maxPrice?: number,
): Promise<ApiResponse<any>> => {
  const params = new URLSearchParams();
  if (location) params.append("location", location);
  if (maxPrice) params.append("maxPrice", maxPrice.toString());

  return apiRequest(`/pricing/lowest?${params.toString()}`);
};

// Legacy function for backward compatibility
export const apiGetPricing = async (
  accommodationType: string,
  dateRange: string[],
): Promise<any> => {
  const result = await apiCalculatePricing(
    accommodationType,
    dateRange[0],
    dateRange[1],
  );
  return result.data;
};

// Contact functions
export const apiSendContactMessage = async (
  messageData: any,
): Promise<boolean> => {
  const result = await apiRequest("/contact/message", {
    method: "POST",
    body: JSON.stringify(messageData),
  });
  return result.success;
};

export const apiGetContactMessages = async (
  page: number = 1,
  limit: number = 10,
  status?: string,
  department?: string,
  priority?: string,
): Promise<
  ApiResponse<{
    messages: any[];
    pagination: any;
    stats: any;
  }>
> => {
  const params = new URLSearchParams();
  params.append("page", page.toString());
  params.append("limit", limit.toString());
  if (status) params.append("status", status);
  if (department) params.append("department", department);
  if (priority) params.append("priority", priority);

  return apiRequest(`/contact/messages?${params.toString()}`);
};

export const apiGetContactMessageById = async (
  messageId: string,
): Promise<ApiResponse<any>> => {
  return apiRequest(`/contact/messages/${messageId}`);
};

export const apiUpdateContactMessage = async (
  messageId: string,
  updateData: {
    status?: "new" | "read" | "replied" | "closed";
    priority?: "low" | "medium" | "high";
    department?: "general" | "reservations" | "support" | "complaints";
    notes?: string;
  },
): Promise<ApiResponse<{ message: string }>> => {
  return apiRequest(`/contact/messages/${messageId}`, {
    method: "PUT",
    body: JSON.stringify(updateData),
  });
};

export const apiGetContactStats = async (): Promise<ApiResponse<any>> => {
  return apiRequest("/contact/stats");
};

export const apiSendTestEmail = async (
  email: string,
): Promise<ApiResponse<any>> => {
  return apiRequest("/contact/email-test", {
    method: "POST",
    body: JSON.stringify({ email }),
  });
};

export const apiSendTestSMS = async (
  phone: string,
): Promise<ApiResponse<any>> => {
  return apiRequest("/contact/sms-test", {
    method: "POST",
    body: JSON.stringify({ phone }),
  });
};

// Registration Requests functions
export const apiGetRegistrationRequests = async (): Promise<{
  success: boolean;
  requests: RegistrationRequest[];
}> => {
  try {
    const result = await apiRequest<
      RegistrationRequest[] | { requests: RegistrationRequest[] }
    >("/registration-requests");
    let requests: RegistrationRequest[] = [];

    if (result.success && result.data) {
      // Handle different response formats
      if (Array.isArray(result.data)) {
        requests = result.data;
      } else if (result.data.requests && Array.isArray(result.data.requests)) {
        requests = result.data.requests;
      }
    }

    return {
      success: result.success,
      requests,
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

// Notifications API
export const apiGetNotifications = async (): Promise<
  ApiResponse<{
    notifications: any[];
    unreadCount: number;
    total: number;
  }>
> => {
  return apiRequest("/api/notifications");
};

export const apiMarkNotificationAsRead = async (
  notificationId: string,
): Promise<ApiResponse<{ message: string }>> => {
  return apiRequest(`/api/notifications/${notificationId}/read`, {
    method: "PATCH",
  });
};

export const apiMarkAllNotificationsAsRead = async (): Promise<
  ApiResponse<{ message: string }>
> => {
  return apiRequest("/api/notifications/mark-all-read", {
    method: "POST",
  });
};

// Export all API functions for easy import
export const apiService = {
  // Auth
  login: apiLogin,
  logout: apiLogout,
  register: apiRegister,
  getCurrentUser: apiGetCurrentUser,
  refreshToken: apiRefreshToken,
  forgotPassword: apiForgotPassword,
  resetPassword: apiResetPassword,
  validateToken: apiValidateToken,
  isAvailable: isApiAvailable,

  // Users
  getUsers: apiGetUsers,
  getUserById: apiGetUserById,
  activateUser: apiActivateUser,
  deactivateUser: apiDeactivateUser,
  updateUser: apiUpdateUser,
  deleteUser: apiDeleteUser,
  getUserStats: apiGetUserStats,

  // Accommodations
  getAccommodations: apiGetAccommodations,
  getAccommodationById: apiGetAccommodationById,
  getAccommodationsByLocation: apiGetAccommodationsByLocation,
  checkAccommodationAvailability: apiCheckAccommodationAvailability,
  updateAccommodation: apiUpdateAccommodation,

  // Reservations
  getReservations: apiGetReservations,
  getReservationById: apiGetReservationById,
  createReservation: apiCreateReservation,
  updateReservation: apiUpdateReservation,
  cancelReservation: apiCancelReservation,
  getReservationStats: apiGetReservationStats,

  // Pricing
  getPricing: apiGetPricing,
  getPricingRates: apiGetPricingRates,
  calculatePricing: apiCalculatePricing,
  getDayTypes: apiGetDayTypes,
  getAccommodationPricing: apiGetAccommodationPricing,
  comparePricing: apiComparePricing,
  getLowestPrices: apiGetLowestPrices,

  // Contact
  sendContactMessage: apiSendContactMessage,
  getContactMessages: apiGetContactMessages,
  getContactMessageById: apiGetContactMessageById,
  updateContactMessage: apiUpdateContactMessage,
  getContactStats: apiGetContactStats,
  sendTestEmail: apiSendTestEmail,
  sendTestSMS: apiSendTestSMS,

  // Notifications
  getNotifications: apiGetNotifications,
  markNotificationAsRead: apiMarkNotificationAsRead,
  markAllNotificationsAsRead: apiMarkAllNotificationsAsRead,

  // Registration Requests
  getRegistrationRequests: apiGetRegistrationRequests,
  approveRegistrationRequest: apiApproveRegistrationRequest,
  rejectRegistrationRequest: apiRejectRegistrationRequest,
};

// Export interfaces
export type { RegistrationRequest, Accommodation, Reservation, User };

export default apiService;
