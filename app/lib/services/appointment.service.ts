import apiClient from "../api-client";
import { ApiResponse, Appointment, DoctorAvailability } from "../../models";

/**
 * Appointment service
 * Handles all appointment-related API endpoints
 */
class AppointmentService {
  /**
   * Get live queue appointments
   */
  async getLiveQueue(): Promise<ApiResponse<Appointment[]>> {
    const response = await apiClient.get<ApiResponse<Appointment[]>>(
      "/appointments/queue",
    );
    return response.data;
  }
  /**
   * Get patient appointment history
   */
  async getPatientHistory(
    patientId: string,
  ): Promise<ApiResponse<Appointment[]>> {
    const response = await apiClient.get<ApiResponse<Appointment[]>>(
      `/appointments/patient/${patientId}/history`,
    );
    return response.data;
  }

  /**
   * Get the authenticated doctor's availabilities
   */
  async getMyAvailabilities(): Promise<ApiResponse<DoctorAvailability[]>> {
    const response = await apiClient.get<ApiResponse<DoctorAvailability[]>>(
      "/doctor-availability/my-availabilities",
    );
    return response.data;
  }

  /**
   * Get single appointment by ID
   */
  async getAppointmentById(appointmentId: string): Promise<Appointment> {
    const response = await apiClient.get<ApiResponse<Appointment>>(
      `/appointments/${appointmentId}`,
    );
    return response.data.data;
  }
}

export const appointmentService = new AppointmentService();
