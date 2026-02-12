import apiClient from "../api-client";
import { ApiResponse, LiveQueueResponse } from "../../models";

/**
 * Appointment service
 * Handles all appointment-related API endpoints
 */
class AppointmentService {
  /**
   * Get live queue appointments
   */
  async getLiveQueue(): Promise<ApiResponse<LiveQueueResponse>> {
    const response = await apiClient.get<ApiResponse<LiveQueueResponse>>(
      "/appointments"
    );
    return response.data;
  }
}

export const appointmentService = new AppointmentService();
