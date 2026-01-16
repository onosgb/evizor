import axios, {
  AxiosInstance,
  AxiosError,
  InternalAxiosRequestConfig,
} from "axios";
import { useAuthStore } from "../stores/authStore";
import { ApiError, ApiResponse } from "../models";

// API Base URL - can be overridden with environment variable
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";

// Create axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Extend AxiosRequestConfig to include custom options
declare module "axios" {
  export interface AxiosRequestConfig {
    skipAuth?: boolean;
    skipRefresh?: boolean;
    _retry?: boolean;
  }
}

// Request interceptor - Add auth token to requests
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Skip auth for certain endpoints
    const skipAuth = (config as any).skipAuth === true;

    if (!skipAuth && typeof window !== "undefined") {
      const accessToken = useAuthStore.getState().accessToken;
      if (accessToken && config.headers) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
    }

    // Log request in development
    if (
      typeof window !== "undefined" &&
      process.env.NODE_ENV === "development"
    ) {
      console.log(
        `🌐 API Request: ${config.method?.toUpperCase()} ${config.url}`
      );
      if (!API_BASE_URL) {
        console.error("❌ API_BASE_URL is not set!");
      }
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle token refresh and errors
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig;

    // Handle 401 Unauthorized - try to refresh token
    if (
      error.response?.status === 401 &&
      !originalRequest.skipAuth &&
      !originalRequest.skipRefresh &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
        const refreshToken = useAuthStore.getState().refreshToken;
        if (!refreshToken) {
          throw new Error("No refresh token available");
        }

        // Try to refresh token
        const refreshResponse = await axios.post<ApiResponse<any>>(
          `${API_BASE_URL}/auth/refresh`,
          { refreshToken },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (
          refreshResponse.data.status &&
          refreshResponse.data.data?.accessToken
        ) {
          const newAccessToken = refreshResponse.data.data.accessToken;
          const newRefreshToken =
            refreshResponse.data.data.refreshToken || refreshToken;

          // Update tokens in store
          useAuthStore.getState().setTokens(newAccessToken, newRefreshToken);

          // Retry original request with new token
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return apiClient(originalRequest);
        }
      } catch (refreshError) {
        // Refresh failed, clear tokens and redirect to login
        useAuthStore.getState().logout();
        if (typeof window !== "undefined") {
          window.location.href = "/login";
        }
        return Promise.reject(
          new Error("Session expired. Please login again.")
        );
      }
    }

    // Handle error responses
    if (error.response && error.response.data) {
      const errorResponse = error.response.data as ApiResponse<any>;
      throw ApiError.fromResponse(errorResponse);
    }

    // Handle network errors (no response received)
    const statusCode = error.response?.status ?? 500;
    throw new ApiError(
      error.message || "Request failed",
      statusCode,
      false,
      "Network error"
    );
  }
);

export default apiClient;
