import apiClient from "../api-client";
import { LoginResponse, ApiResponse, UpdateUser, User, ProfessionalProfile, Qualification } from "../../models";
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
    try {
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
      const { accessToken, refreshToken: newRefreshToken, user, profileCompleted } = response.data.data;

      // Check if user has allowed role
      if (user.role !== "DOCTOR" && user.role !== "ADMIN" && user.role !== "STAFF") {
        // If not allowed, logout (clears state) and throw error
        await this.logout();
        throw new Error("Unauthorized: Only Doctors, Admins and Staff can access this portal");
      }

      useAuthStore.getState().login(accessToken, newRefreshToken, user, profileCompleted);
      return response.data;
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
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
    const { accessToken, refreshToken: newRefreshToken, user, profileCompleted } = response.data.data;

    // Check if user has allowed role
    if (user.role !== "DOCTOR" && user.role !== "ADMIN" && user.role !== "STAFF") {
      await this.logout();
      throw new Error("Unauthorized: Only Doctors, Admins and Staff can access this portal");
    }

    useAuthStore.getState().login(accessToken, newRefreshToken, user, profileCompleted);
    // Note: We might want to keep rememberMe preference, but here we just update tokens and user
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
    const response = await apiClient.get<ApiResponse<User>>("/users/profile");
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

  /**
   * Get professional profile
   */
  async getProfessionalProfile(): Promise<ApiResponse<ProfessionalProfile>> {
    const response = await apiClient.get<ApiResponse<ProfessionalProfile>>(
      "/profile/professional"
    );
    return response.data;
  }

  /**
   * Update professional profile
   */
  async updateProfessionalProfile(
    data: ProfessionalProfile
  ): Promise<ApiResponse<ProfessionalProfile>> {
    const response = await apiClient.put<ApiResponse<ProfessionalProfile>>(
      "/profile/professional",
      data
    );
    return response.data;
  }













  /**
   * Upload profile picture
   */
  async uploadProfilePicture(data: FormData): Promise<ApiResponse<{ url: string }>> {
    const response = await apiClient.post<ApiResponse<{ url: string }>>(
      "/users/upload-picture",
      data,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  }













}

export const authService = new AuthService();
