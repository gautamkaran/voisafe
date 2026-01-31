import axios from "axios";

/**
 * API CLIENT FOR VOISAFE BACKEND
 * 
 * Features:
 * - Automatic JWT token attachment
 * - Request/response interceptors
 * - Error handling
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

// Create axios instance
const api = axios.create({
    baseURL: API_URL,
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true, // Send cookies with requests
});

// Request interceptor - Add JWT token
api.interceptors.request.use(
    (config) => {
        // Get token from localStorage
        const token = localStorage.getItem("token");

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor - Handle errors
api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        // Handle 401 Unauthorized - redirect to login
        if (error.response?.status === 401) {
            localStorage.removeItem("token");
            localStorage.removeItem("user");

            // Only redirect if not already on auth pages
            if (typeof window !== "undefined" && !window.location.pathname.startsWith("/login")) {
                window.location.href = "/login";
            }
        }

        return Promise.reject(error);
    }
);

export default api;

// API helper functions

/**
 * Authentication
 */
export const authAPI = {
    login: (email: string, password: string) =>
        api.post("/auth/login", { email, password }),

    register: (data: any) =>
        api.post("/auth/register", data),

    getMe: () =>
        api.get("/auth/me"),
};

/**
 * Complaints
 */
export const complaintAPI = {
    // Student endpoints
    fileComplaint: (data: any) =>
        api.post("/complaints", data),

    getMyComplaints: () =>
        api.get("/complaints/my-complaints"),

    trackComplaint: (trackingId: string) =>
        api.get(`/complaints/track/${trackingId}`),

    // Admin endpoints (if needed)
    getAllComplaints: (params?: any) =>
        api.get("/complaints", { params }),

    getComplaintById: (id: string) =>
        api.get(`/complaints/${id}`),

    updateStatus: (id: string, status: string, comment?: string) =>
        api.put(`/complaints/${id}/status`, { status, comment }),
};
