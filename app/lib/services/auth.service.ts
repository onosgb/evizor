import apiClient from "../api-client";
import {
  LoginResponse,
  ApiResponse,
  UpdateUser,
  User,
  ProfessionalProfile,
} from "../../models";
import { useAuthStore } from "../../stores/authStore";
import { isValidPortalUser } from "../roles";

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
        },
      );
      const {
        accessToken,
        refreshToken: newRefreshToken,
        user,
        profileCompleted,
      } = response.data.data;

      // Check if user has allowed role
      if (!isValidPortalUser(user)) {
        await this.logout();
        throw new Error(
          "Unauthorized: Only Doctors and Admins can access this portal",
        );
      }

      // Only login to store if we have tokens (i.e. not waiting for 2FA)
      if (accessToken && newRefreshToken) {
        useAuthStore
          .getState()
          .login(accessToken, newRefreshToken, user, profileCompleted);
      }

      return response.data;
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  }

  /**
   * Verify 2FA OTP
   */
  async verify2FA(email: string, token: string): Promise<LoginResponse> {
    const response = await apiClient.post<LoginResponse>(
      "/auth/verify-2fa",
      { email, token },
      { skipAuth: true },
    );

    const {
      accessToken,
      refreshToken: newRefreshToken,
      user,
      profileCompleted,
    } = response.data.data;

    // Check if user has allowed role (double check)
    if (!isValidPortalUser(user)) {
      await this.logout();
      throw new Error(
        "Unauthorized: Only Doctors and Admins can access this portal",
      );
    }

    if (accessToken && newRefreshToken) {
      useAuthStore
        .getState()
        .login(accessToken, newRefreshToken, user, profileCompleted);
    }

    return response.data;
  }

  /**
   * Resend 2FA OTP
   */
  async resend2FA(email: string): Promise<void> {
    await apiClient.post("/auth/resend-2fa", { email }, { skipAuth: true });
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
      },
    );
    const {
      accessToken,
      refreshToken: newRefreshToken,
      user,
      profileCompleted,
    } = response.data.data;

    // Check if user has allowed role
    if (!isValidPortalUser(user)) {
      await this.logout();
      throw new Error(
        "Unauthorized: Only Doctors and Admins can access this portal",
      );
    }

    if (accessToken && newRefreshToken) {
      useAuthStore
        .getState()
        .login(accessToken, newRefreshToken, user, profileCompleted);
    }
    // Note: We might want to keep rememberMe preference, but here we just update tokens and user
    return response.data;
  }

  /**
   * Logout user
   */
  async logout(): Promise<void> {
    // 1. Capture token to potentially use for server-side logout
    const accessToken = useAuthStore.getState().accessToken;

    // 2. Clear store IMMEDIATELY to prevent any other requests from refreshing the session
    // This stops the "revival" of the session if a concurrent request fails with 401
    useAuthStore.getState().logout();

    try {
      if (accessToken) {
        // 3. Send logout to server with the captured token
        // We manually set the Authorization header since store is empty
        await apiClient.post(
          "/auth/logout",
          {},
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          },
        );
      }
    } catch (error) {
      // Server-side logout failed, but local session is already cleared so we are good
      console.error("Logout error (server-side):", error);
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
      data,
    );
    return response.data;
  }

  /**
   * Get professional profile
   */
  async getProfessionalProfile(): Promise<ApiResponse<ProfessionalProfile>> {
    const response = await apiClient.get<ApiResponse<ProfessionalProfile>>(
      "/profile/professional",
    );
    return response.data;
  }

  /**
   * Update professional profile
   */
  async updateProfessionalProfile(
    data: ProfessionalProfile,
  ): Promise<ApiResponse<ProfessionalProfile>> {
    const response = await apiClient.put<ApiResponse<ProfessionalProfile>>(
      "/profile/professional",
      data,
    );
    return response.data;
  }

  /**
   * Upload profile picture
   */
  async uploadProfilePicture(
    data: FormData,
  ): Promise<ApiResponse<{ url: string }>> {
    const response = await apiClient.post<ApiResponse<{ url: string }>>(
      "/users/upload-picture",
      data,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );
    return response.data;
  }

  /**
   * Request password reset OTP
   */
  async forgotPassword(email: string): Promise<ApiResponse<void>> {
    const response = await apiClient.post<ApiResponse<void>>(
      "/auth/forgot-password",
      { email },
      { skipAuth: true },
    );
    return response.data;
  }

  /**
   * Reset password with OTP token
   */
  async resetPassword(
    email: string,
    token: string,
    newPassword: string,
  ): Promise<ApiResponse<void>> {
    const response = await apiClient.post<ApiResponse<void>>(
      "/auth/reset-password",
      { email, token, newPassword },
      { skipAuth: true },
    );
    return response.data;
  }

  /**
   * Resend password reset OTP
   */
  async resendPasswordReset(email: string): Promise<ApiResponse<void>> {
    const response = await apiClient.post<ApiResponse<void>>(
      "/auth/resend-password-reset",
      { email },
      { skipAuth: true },
    );
    return response.data;
  }
  /**
   * Change password
   */
  async changePassword(
    oldPassword: string,
    newPassword: string,
  ): Promise<ApiResponse<void>> {
    const response = await apiClient.post<ApiResponse<void>>(
      "/auth/change-password",
      { oldPassword, newPassword },
    );
    return response.data;
  }

  /**
   * Toggle 2FA
   */
  async toggle2FA(enable: boolean): Promise<ApiResponse<void>> {
    const response = await apiClient.put<ApiResponse<void>>(
      "/users/enable-2fa",
      { enabled: enable },
    );
    return response.data;
  }
}

export const authService = new AuthService();
