import apiClient from "../api-client";
import { ApiResponse } from "@/app/models/ApiResponse";
import { PendingVerification } from "@/app/models/PendingVerification";
import { User, ProfessionalProfile, Qualification } from "@/app/models";

class AdminService {
  async getPendingVerifications(): Promise<ApiResponse<PendingVerification[]>> {
    const response = await apiClient.get<ApiResponse<PendingVerification[]>>(
      "/profile/admin/pending-verifications"
    );
    return response.data;
  }

  async approveVerification(userId: string): Promise<ApiResponse<any>> {
    const response = await apiClient.post<ApiResponse<any>>(
      `/profile/admin/verify-profile/${userId}`,
      {
        approved: true,
        rejectionReason: null,
      }
    );
    return response.data;
  }

  async rejectVerification(userId: string, rejectionReason: string): Promise<ApiResponse<any>> {
    const response = await apiClient.post<ApiResponse<any>>(
      `/profile/admin/verify-profile/${userId}`,
      {
        approved: false,
        rejectionReason,
      }
    );
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
   * Get qualifications by user ID (admin only)
   */
  async getUserQualifications(userId: string): Promise<ApiResponse<Qualification[]>> {
    const response = await apiClient.get<ApiResponse<Qualification[]>>(
      `/profile/qualifications/user/${userId}`
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

export const adminService = new AdminService();
