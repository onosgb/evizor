import apiClient from "../api-client";
import { LoginResponse, ApiResponse, UpdateUser, User } from "../../models";
import { useAuthStore } from "../../stores/authStore";

/**
 * Authentication service
 * Handles all authentication-related API endpoints
 */
class AuthService {
  /**
   * Login user with email and password
   */
  async login(email: string, password: string): Promise<LoginResponse> {
    const response = await apiClient.post<LoginResponse>(
      "/auth/login",
      {
        email,
        password,
      },
      {
        skipAuth: true,
      }
    );
    return response.data;
  }

  /**
   * Refresh access token using refresh token
   */
  async refreshToken(refreshToken: string): Promise<LoginResponse> {
    const response = await apiClient.post<LoginResponse>(
      "/auth/refresh",
      { refreshToken },
      {
        skipAuth: true,
      }
    );
    return response.data;
  }

  /**
   * Logout user
   */
  async logout(): Promise<void> {
    try {
      await apiClient.post("/auth/logout");
    } catch (error) {
      // Even if logout fails on server, clear local tokens
      console.error("Logout error:", error);
    } finally {
      // Clear tokens from store
      useAuthStore.getState().logout();
    }
  }

  /**
   * Get current user's profile
   */
  async getMyProfile(): Promise<ApiResponse<User>> {
    const response = await apiClient.get<ApiResponse<User>>("/users/my-profile");
    return response.data;
  }

  /**
   * Update user profile
   */
  async updateProfile(data: UpdateUser): Promise<ApiResponse<User>> {
    const response = await apiClient.put<ApiResponse<User>>(
      "/users/update-profile",
      data
    );
    return response.data;
  }
}

export const authService = new AuthService();
