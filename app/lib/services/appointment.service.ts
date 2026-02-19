import apiClient from "../api-client";
import { ApiResponse, Appointment, AllAppointmentsResponse, DoctorAvailability } from "../../models";
import type { ProposeAvailabilityRequest } from "../../models/DoctorAvailability";

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
   * Doctor accepts or rejects an assigned availability slot
   * Endpoint: PATCH /doctor-availability/{id}/propose
   */
  async proposeAvailability(
    id: string,
    data: ProposeAvailabilityRequest,
  ): Promise<ApiResponse<DoctorAvailability>> {
    const response = await apiClient.patch<ApiResponse<DoctorAvailability>>(
      `/doctor-availability/${id}/propose`,
      data,
    );
    return response.data;
  }

  /**
   * Get all appointments assigned to the authenticated doctor.
   * Supports server-side pagination and date range filtering.
   */
  async getAssignedCases(params?: {
    page?: number;
    limit?: number;
    from?: string;
    to?: string;
  }): Promise<AllAppointmentsResponse> {
    const response = await apiClient.get<AllAppointmentsResponse>(
      "/appointments",
      { params },
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
