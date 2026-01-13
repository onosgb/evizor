import { useAuthStore } from "../stores/authStore";
import {
  LoginResponse,
  RequestOptions,
  ApiResponse,
  ApiError,
} from "../models";

// API Base URL - can be overridden with environment variable
// Note: In Next.js, environment variables are only available at build time
// For client-side access, they must be prefixed with NEXT_PUBLIC_
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

// Log API URL for debugging (only in development)
if (typeof window !== "undefined") {
  console.log("🔧 API Base URL:", API_BASE_URL);
  console.log(
    "🔧 NEXT_PUBLIC_API_URL:",
    process.env.NEXT_PUBLIC_API_URL || "NOT SET"
  );
  if (!process.env.NEXT_PUBLIC_API_URL) {
    console.warn(
      "⚠️ NEXT_PUBLIC_API_URL not set, using default:",
      API_BASE_URL
    );
  }
}

// Get access token from store
const getAccessToken = (): string | null => {
  if (typeof window === "undefined") return null;
  return useAuthStore.getState().accessToken;
};

// Get refresh token from store
const getRefreshToken = (): string | null => {
  if (typeof window === "undefined") return null;
  return useAuthStore.getState().refreshToken;
};

// Set tokens in store
const setTokens = (accessToken: string, refreshToken: string) => {
  useAuthStore.getState().setTokens(accessToken, refreshToken);
};

// Clear tokens from store
const clearTokens = () => {
  useAuthStore.getState().logout();
};

// Refresh access token
const refreshAccessToken = async (): Promise<string | null> => {
  const refreshToken = getRefreshToken();
  if (!refreshToken) {
    return null;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refreshToken }),
    });

    if (!response.ok) {
      throw new Error("Failed to refresh token");
    }

    const data = await response.json();
    if (data.status && data.data?.accessToken) {
      // Use new refresh token if provided, otherwise keep the old one
      const newRefreshToken = data.data.refreshToken || refreshToken;
      setTokens(data.data.accessToken, newRefreshToken);
      return data.data.accessToken;
    }

    return null;
  } catch (error) {
    console.error("Error refreshing token:", error);
    return null;
  }
};

// Main API request function with token interceptor
export const apiRequest = async <T = any>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> => {
  const { skipAuth = false, skipRefresh = false, ...fetchOptions } = options;

  // Build full URL
  let url: string;
  if (endpoint.startsWith("http")) {
    url = endpoint;
  } else {
    // Ensure endpoint starts with / and API_BASE_URL doesn't end with /
    const cleanEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
    const cleanBaseUrl = API_BASE_URL?.endsWith("/")
      ? API_BASE_URL.slice(0, -1)
      : API_BASE_URL;
    url = `${cleanBaseUrl}${cleanEndpoint}`;
  }

  // Log full URL in development
  if (typeof window !== "undefined" && process.env.NODE_ENV === "development") {
    console.log(`🌐 API Request: ${fetchOptions.method || "GET"} ${url}`);
    if (!API_BASE_URL) {
      console.error("❌ API_BASE_URL is not set!");
    }
  }

  // Prepare headers
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(fetchOptions.headers as Record<string, string>),
  };

  // Add authorization header if not skipping auth
  if (!skipAuth) {
    const accessToken = getAccessToken();
    if (accessToken) {
      headers["Authorization"] = `Bearer ${accessToken}`;
    }
  }

  // Make initial request
  let response = await fetch(url, {
    ...fetchOptions,
    headers,
  });

  // Handle 401 Unauthorized - try to refresh token
  if (response.status === 401 && !skipAuth && !skipRefresh) {
    const newAccessToken = await refreshAccessToken();

    if (newAccessToken) {
      // Retry original request with new token
      headers["Authorization"] = `Bearer ${newAccessToken}`;
      response = await fetch(url, {
        ...fetchOptions,
        headers,
      });
    } else {
      // Refresh failed, clear tokens and redirect to login
      clearTokens();
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
      throw new Error("Session expired. Please login again.");
    }
  }

  // Parse response
  const contentType = response.headers.get("content-type");
  const isJson = contentType?.includes("application/json");

  if (!response.ok) {
    if (isJson) {
      const errorResponse = (await response.json()) as ApiResponse<any>;
      throw ApiError.fromResponse(errorResponse);
    } else {
      // Fallback for non-JSON error responses
      throw new ApiError(
        response.statusText || "Request failed",
        response.status,
        false,
        response.statusText || "Unknown error"
      );
    }
  }

  if (isJson) {
    return response.json() as Promise<T>;
  }
  return response.text() as Promise<T>;
};

// Convenience methods for common HTTP verbs
export const api = {
  get: <T = any>(endpoint: string, options?: RequestOptions) =>
    apiRequest<T>(endpoint, { ...options, method: "GET" }),

  post: <T = any>(endpoint: string, data?: any, options?: RequestOptions) =>
    apiRequest<T>(endpoint, {
      ...options,
      method: "POST",
      body: data ? JSON.stringify(data) : undefined,
    }),

  put: <T = any>(endpoint: string, data?: any, options?: RequestOptions) =>
    apiRequest<T>(endpoint, {
      ...options,
      method: "PUT",
      body: data ? JSON.stringify(data) : undefined,
    }),

  patch: <T = any>(endpoint: string, data?: any, options?: RequestOptions) =>
    apiRequest<T>(endpoint, {
      ...options,
      method: "PATCH",
      body: data ? JSON.stringify(data) : undefined,
    }),

  delete: <T = any>(endpoint: string, options?: RequestOptions) =>
    apiRequest<T>(endpoint, { ...options, method: "DELETE" }),
};

// Auth-specific API methods
export const authApi = {
  login: async (email: string, password: string): Promise<LoginResponse> => {
    return apiRequest<LoginResponse>("/auth/login", {
      method: "POST",
      skipAuth: true,
      body: JSON.stringify({ email, password }),
    });
  },

  refreshToken: async (refreshToken: string): Promise<LoginResponse> => {
    return apiRequest<LoginResponse>("/auth/refresh", {
      method: "POST",
      skipAuth: true,
      body: JSON.stringify({ refreshToken }),
    });
  },

  logout: async (): Promise<void> => {
    try {
      await apiRequest("/auth/logout", {
        method: "POST",
      });
    } catch (error) {
      // Even if logout fails on server, clear local tokens
      console.error("Logout error:", error);
    } finally {
      clearTokens();
    }
  },
};
