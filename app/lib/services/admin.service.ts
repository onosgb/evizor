import apiClient from "../api-client";
import { ApiResponse } from "@/app/models/ApiResponse";
import { PendingVerification } from "@/app/models/PendingVerification";
import {
  User,
  ProfessionalProfile,
  Qualification,
  Appointment,
  CreateScheduleRequest,
} from "@/app/models";

class AdminService {
  async getPendingVerifications(): Promise<ApiResponse<PendingVerification[]>> {
    const response = await apiClient.get<ApiResponse<PendingVerification[]>>(
      "/profile/admin/pending-verifications",
    );
    return response.data;
  }

  async approveVerification(
    userId: string,
    status: boolean,
    reason: string = "",
  ): Promise<ApiResponse<any>> {
    const payload: any = {
      approved: status,
    };

    if (!status) {
      payload.rejectionReason = reason;
    }

    const response = await apiClient.put<ApiResponse<any>>(
      `/profile/admin/verify-profile/${userId}`,
      payload,
    );
    return response.data;
  }

  /**
   * Get any user's profile by ID (admin only)
   */
  async getUserProfile(userId: string): Promise<ApiResponse<User>> {
    const response = await apiClient.get<ApiResponse<User>>(`/users/${userId}`);
    return response.data;
  }

  /**
   * Get professional profile by user ID (admin only)
   */
  async getProfessionalProfileByUserId(
    userId: string,
  ): Promise<ApiResponse<ProfessionalProfile>> {
    const response = await apiClient.get<ApiResponse<ProfessionalProfile>>(
      `/profile/professional/${userId}`,
    );
    return response.data;
  }

  /**
   * Approve professional profile update (admin only)
   */
  async approveProfessionalProfile(userId: string): Promise<ApiResponse<any>> {
    const response = await apiClient.post<ApiResponse<any>>(
      `/profile/professional/${userId}/approve`,
    );
    return response.data;
  }

  /**
   * Get qualifications by user ID (admin only)
   */
  async getUserQualifications(
    userId: string,
  ): Promise<ApiResponse<Qualification[]>> {
    const response = await apiClient.get<ApiResponse<Qualification[]>>(
      `/profile/qualifications/user/${userId}`,
    );
    return response.data;
  }

  /**
   * Get availability by user ID (admin only)
   */
  async getUserAvailability(userId: string): Promise<ApiResponse<any[]>> {
    const response = await apiClient.get<ApiResponse<any[]>>(
      `/doctor-availability/user/${userId}`,
    );
    return response.data;
  }

  /**
   * Get performance data by user ID (admin only)
   */
  async getUserPerformance(userId: string): Promise<ApiResponse<any[]>> {
    const response = await apiClient.get<ApiResponse<any[]>>(
      `/profile/performance/user/${userId}`,
    );
    return response.data;
  }

  /**
   * Schedule user availability (admin only)
   */
  async scheduleUserAvailability(
    data: CreateScheduleRequest,
  ): Promise<ApiResponse<any>> {
    const response = await apiClient.post<ApiResponse<any>>(
      `/doctor-availability`,
      data,
    );
    return response.data;
  }

  /**
   * Remove user availability schedule (admin only)
   */
  async removeUserAvailabilitySchedule(
    scheduleId: string,
  ): Promise<ApiResponse<any>> {
    const response = await apiClient.delete<ApiResponse<any>>(
      `/doctor-availability/admin/${scheduleId}`,
    );
    return response.data;
  }

  /**
   * Get user consultation preferences by user ID (admin only)
   */
  async getUserConsultationPreferences(
    userId: string,
  ): Promise<ApiResponse<any>> {
    const response = await apiClient.get<ApiResponse<any>>(
      `/profile/consultation-preferences/user/${userId}`,
    );
    return response.data;
  }

  /**
   * Get all appointments
   */
  async getAllAppointments(
    page: number = 1,
    limit: number = 10,
    status: string = "",
  ): Promise<ApiResponse<Appointment[]>> {
    const response = await apiClient.get<ApiResponse<Appointment[]>>(
      "/appointments/all",
      {
        params: {
          page,
          limit,
          status,
        },
      },
    );
    return response.data;
  }
}

export const adminService = new AdminService();
