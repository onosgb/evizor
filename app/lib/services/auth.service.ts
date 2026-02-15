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
   * Get any user's profile by ID (admin only)
   */
  async getUserProfile(userId: string): Promise<ApiResponse<User>> {
    const response = await apiClient.get<ApiResponse<User>>(
      `/users/${userId}`
    );
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
   * Get professional profile by user ID (admin only)
   */
  async getProfessionalProfileByUserId(userId: string): Promise<ApiResponse<ProfessionalProfile>> {
    const response = await apiClient.get<ApiResponse<ProfessionalProfile>>(
      `/profile/professional/${userId}`
    );
    return response.data;
  }

  /**
   * Approve professional profile update (admin only)
   */
  async approveProfessionalProfile(userId: string): Promise<ApiResponse<any>> {
    const response = await apiClient.post<ApiResponse<any>>(
      `/profile/professional/${userId}/approve`
    );
    return response.data;
  }

  /**
   * Upload qualification document
   */
  async uploadQualification(data: FormData): Promise<ApiResponse<any>> {
    const response = await apiClient.post<ApiResponse<any>>(
      "/profile/qualifications/upload",
      data,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  }

  /**
   * Get all qualifications
   */
  async getQualifications(): Promise<ApiResponse<Qualification[]>> {
    const response = await apiClient.get<ApiResponse<Qualification[]>>(
      "/profile/qualifications"
    );
    return response.data;
  }

  /**
   * Get qualifications by user ID (admin only)
   */
  async getUserQualifications(userId: string): Promise<ApiResponse<Qualification[]>> {
    const response = await apiClient.get<ApiResponse<Qualification[]>>(
      `/profile/qualifications/user/${userId}`
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
  /**
   * Get availability by user ID (admin only)
   */
  async getUserAvailability(userId: string): Promise<ApiResponse<any[]>> {
    const response = await apiClient.get<ApiResponse<any[]>>(
      `/profile/availability/user/${userId}`
    );
    return response.data;
  }

  /**
   * Get consultation preferences by user ID (admin only)
   */
  async getUserConsultationPreferences(userId: string): Promise<ApiResponse<any>> {
    const response = await apiClient.get<ApiResponse<any>>(
      `/profile/consultation/user/${userId}`
    );
    return response.data;
  }

  /**
   * Get performance data by user ID (admin only)
   */
  async getUserPerformance(userId: string): Promise<ApiResponse<any[]>> {
    const response = await apiClient.get<ApiResponse<any[]>>(
      `/profile/performance/user/${userId}`
    );
    return response.data;
  }

  /**
   * Get security settings by user ID (admin only)
   */
  async getUserSecuritySettings(userId: string): Promise<ApiResponse<any>> {
    const response = await apiClient.get<ApiResponse<any>>(
      `/profile/security/user/${userId}`
    );
    return response.data;
  }

  /**
   * Get activity log by user ID (admin only)
   */
  async getUserActivityLog(userId: string): Promise<ApiResponse<any[]>> {
    const response = await apiClient.get<ApiResponse<any[]>>(
      `/profile/activity/user/${userId}`
    );
    return response.data;
  }

  /**
   * Schedule user availability (admin only)
   */
  async scheduleUserAvailability(userId: string, data: any): Promise<ApiResponse<any>> {
    const response = await apiClient.post<ApiResponse<any>>(
      `/profile/availability/user/${userId}`,
      data
    );
    return response.data;
  }

  /**
   * Remove user availability schedule (admin only)
   */
  async removeUserAvailabilitySchedule(userId: string, scheduleId: string): Promise<ApiResponse<any>> {
    const response = await apiClient.delete<ApiResponse<any>>(
      `/profile/availability/user/${userId}/${scheduleId}`
    );
    return response.data;
  }
}

export const authService = new AuthService();
