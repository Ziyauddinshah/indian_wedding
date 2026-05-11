// lib/api.ts
// ─────────────────────────────────────────────
//  BARAAT WHEELS — Axios API Client
// ─────────────────────────────────────────────

import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig, AxiosResponse } from 'axios';

// ─────────────────────────────────────────────
//  1. CREATE AXIOS INSTANCE
// ─────────────────────────────────────────────

const api: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
  timeout: 15000,                          // 15 seconds timeout
  withCredentials: true,                   // send cookies (JWT token) automatically
  headers: {
    'Content-Type': 'application/json',
  },
});

// ─────────────────────────────────────────────
//  2. REQUEST INTERCEPTOR
//     Runs before every request is sent
// ─────────────────────────────────────────────

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Token is in HTTP-only cookie → sent automatically via withCredentials: true
    // If you ever need Bearer token from localStorage (fallback):
    // const token = localStorage.getItem('token');
    // if (token) config.headers.Authorization = `Bearer ${token}`;

    // Log requests in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`[API] ${config.method?.toUpperCase()} ${config.url}`, config.data ?? '');
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// ─────────────────────────────────────────────
//  3. RESPONSE INTERCEPTOR
//     Runs after every response is received
// ─────────────────────────────────────────────

api.interceptors.response.use(
  (response: AxiosResponse) => {
    // Unwrap data directly so callers get response.data automatically
    return response;
  },
  async (error: AxiosError) => {
    const status = error.response?.status;
    // 401 Unauthorized → token expired or missing → redirect to login
    if (status === 401) {
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }

    // 403 Forbidden → logged in but wrong role
    if (status === 403) {
      if (typeof window !== 'undefined') {
        window.location.href = '/unauthorized';
      }
    }

    // Log errors in development
    if (process.env.NODE_ENV === 'development') {
      console.error(
        `[API ERROR] ${error.response?.status} ${error.config?.url}`,
        error.response?.data
      );
    }
    return Promise.reject(error);
  }
);
export default api;

// ─────────────────────────────────────────────
//  4. AUTH APIs
// ─────────────────────────────────────────────

type UserType = 'customer' | 'partner' | 'admin'

export interface LoginPayload {
  email: string;
  password: string;
  role: UserType;
  rememberMe: boolean;
  adminCode?: string | undefined; 
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  phone: string;
  role?: 'customer' | 'partner';
}

export interface AuthResponse {
  success: boolean;
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    phone: string;
    role: string;
    avatar: string;
    isActive: boolean;
    isApproved?: boolean;
  };
}

export interface TokenPayload {
  success: boolean;
  valid: boolean;
  user?: AuthResponse['user'];
  id?: string;
  email: string;
  role: 'admin' | 'partner' | 'customer';
  isApproved?: boolean;
  isActive?: boolean;
}

export const authApi = {
  login: (data: LoginPayload) =>
    api.post<AuthResponse>('http://localhost:5000/api/users/login', data),

  register: (data: RegisterPayload) =>
    api.post<AuthResponse>('http://localhost:5000/api/auth/register', data),

  logout: () =>
    api.post('http://localhost:5000/api/auth/logout'),

  getMe: () =>
    api.get<{ user: AuthResponse['user'] }>('http://localhost:5000/api/auth/me'),

  verifyTokenWithAPI: (token: string) =>
    api.get<TokenPayload>('http://localhost:5000/api/users/verify-token', {
      headers: {
        authorization: "Bearer " + token,
      },
    }),
};

// ─────────────────────────────────────────────
//  5. VEHICLE APIs
// ─────────────────────────────────────────────

export interface Vehicle {
  _id: string;
  name: string;
  type: string;
  brand: string;
  model: string;
  year: number;
  pricePerDay: number;
  seats: number;
  fuel: string;
  transmission: 'manual' | 'automatic';
  isAvailable: boolean;
  images: string[];
  owner: string;
}

export interface VehicleFilters {
  type?: string;
  minPrice?: number;
  maxPrice?: number;
  seats?: number;
  fuel?: string;
  transmission?: string;
  available?: boolean;
  page?: number;
  limit?: number;
}

export const vehicleApi = {
  // Get all vehicles (with optional filters)
  getAll: (filters?: VehicleFilters) =>
    api.get<{ vehicles: Vehicle[]; total: number; pages: number }>('/vehicles', {
      params: filters,
    }),

  // Get single vehicle by ID
  getById: (id: string) =>
    api.get<{ vehicle: Vehicle }>(`/vehicles/${id}`),

  // Register new vehicle (with image upload)
  register: (formData: FormData) =>
    api.post<{ vehicle: Vehicle }>('/vehicles/register', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),

  // Update vehicle
  update: (id: string, data: Partial<Vehicle>) =>
    api.put<{ vehicle: Vehicle }>(`/vehicles/${id}`, data),

  // Delete vehicle
  delete: (id: string) =>
    api.delete(`/vehicles/${id}`),

  // Toggle availability
  toggleAvailability: (id: string) =>
    api.patch<{ vehicle: Vehicle }>(`/vehicles/${id}/availability`),

  // Get vehicles owned by logged-in partner
  getMyVehicles: () =>
    api.get<{ vehicles: Vehicle[] }>('/vehicles/my-vehicles'),

  // Upload vehicle images separately
  uploadImages: (id: string, formData: FormData) =>
    api.post(`/vehicles/${id}/images`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
};


// ─────────────────────────────────────────────
//  6. BOOKING APIs
// ─────────────────────────────────────────────

export interface Booking {
  _id: string;
  vehicle: Vehicle | string;
  customer: string;
  startDate: string;
  endDate: string;
  totalDays: number;
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  pickupLocation: string;
  dropoffLocation: string;
  paymentStatus: 'unpaid' | 'paid' | 'refunded';
  createdAt: string;
}

export interface CreateBookingPayload {
  vehicleId: string;
  startDate: string;
  endDate: string;
  pickupLocation: string;
  dropoffLocation: string;
}

export const bookingApi = {
  // Create new booking
  create: (data: CreateBookingPayload) =>
    api.post<{ booking: Booking }>('/bookings', data),

  // Get all bookings (admin)
  getAll: (params?: { status?: string; page?: number; limit?: number }) =>
    api.get<{ bookings: Booking[]; total: number }>('/bookings', { params }),

  // Get bookings for logged-in customer
  getMyBookings: () =>
    api.get<{ bookings: Booking[] }>('/bookings/my-bookings'),

  // Get bookings for logged-in partner's vehicles
  getPartnerBookings: () =>
    api.get<{ bookings: Booking[] }>('/bookings/partner-bookings'),

  // Get single booking
  getById: (id: string) =>
    api.get<{ booking: Booking }>(`/bookings/${id}`),

  // Update booking status (admin/partner)
  updateStatus: (id: string, status: Booking['status']) =>
    api.patch<{ booking: Booking }>(`/bookings/${id}/status`, { status }),

  // Cancel booking
  cancel: (id: string) =>
    api.patch<{ booking: Booking }>(`/bookings/${id}/cancel`),
};


// ─────────────────────────────────────────────
//  7. PARTNER APIs
// ─────────────────────────────────────────────

export interface Partner {
  _id: string;
  name: string;
  email: string;
  phone: string;
  isApproved: boolean;
  documents: string[];
  createdAt: string;
}

export const partnerApi = {
  // Admin: get all partners
  getAll: () =>
    api.get<{ partners: Partner[] }>('/partners'),

  // Admin: approve a partner
  approve: (id: string) =>
    api.patch<{ partner: Partner }>(`/partners/${id}/approve`),

  // Admin: reject a partner
  reject: (id: string) =>
    api.patch<{ partner: Partner }>(`/partners/${id}/reject`),

  // Partner: upload documents
  uploadDocuments: (formData: FormData) =>
    api.post('/partners/documents', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),

  // Get partner profile
  getProfile: () =>
    api.get<{ partner: Partner }>('/partners/me'),
};


// ─────────────────────────────────────────────
//  8. ADMIN APIs
// ─────────────────────────────────────────────

export const adminApi = {
  // Dashboard stats
  getStats: () =>
    api.get<{
      totalUsers: number;
      totalVehicles: number;
      totalBookings: number;
      totalRevenue: number;
      pendingPartners: number;
    }>('/admin/stats'),

  // Get all users
  getUsers: () =>
    api.get<{ users: AuthResponse['user'][] }>('/admin/users'),

  // Delete a user
  deleteUser: (id: string) =>
    api.delete(`/admin/users/${id}`),
};


// ─────────────────────────────────────────────
//  9. FILE UPLOAD HELPER
//     Use this when uploading images/documents
// ─────────────────────────────────────────────

/**
 * Convert a File object to FormData and upload.
 * Shows upload progress via onProgress callback.
 *
 * Example:
 *   await uploadFile('/vehicles/register', files, setProgress);
 */
export async function uploadFile(
  endpoint: string,
  files: File[],
  onProgress?: (percent: number) => void
) {
  const formData = new FormData();
  files.forEach((file) => formData.append('images', file));

  return api.post(endpoint, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress: (event) => {
      if (onProgress && event.total) {
        const percent = Math.round((event.loaded / event.total) * 100);
        onProgress(percent);
      }
    },
  });
}


// ─────────────────────────────────────────────
//  10. ERROR HELPER
//      Use this in catch blocks to get clean error messages
// ─────────────────────────────────────────────

export function getApiError(error: unknown): string {
  if (axios.isAxiosError(error)) {
    // Server sent a message
    const serverMessage = error.response?.data?.message || error.response?.data?.error;
    if (serverMessage) return serverMessage;

    // Network error (no internet, backend down)
    if (error.code === 'ERR_NETWORK') return 'Network error. Please check your connection.';
    if (error.code === 'ECONNABORTED') return 'Request timed out. Please try again.';

    // HTTP status fallback
    const status = error.response?.status;
    if (status === 400) return 'Invalid request. Please check your input.';
    if (status === 401) return 'Session expired. Please login again.';
    if (status === 403) return 'You do not have permission to perform this action.';
    if (status === 404) return 'Resource not found.';
    if (status === 409) return 'Conflict. This record already exists.';
    if (status === 500) return 'Server error. Please try again later.';
  }

  return 'Something went wrong. Please try again.';
}