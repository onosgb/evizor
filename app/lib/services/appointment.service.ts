import apiClient from "../api-client";
import {
  ApiResponse,
  Appointment,
  AllAppointmentsResponse,
  DoctorAvailability,
} from "../../models";
import type { ProposeAvailabilityRequest } from "../../models/DoctorAvailability";
import { ListQueryParams } from "../../models/QueryParams";
import { buildQueryParams } from "../utils/queryParams";

/**
 * Appointment service
 * Handles all appointment-related API endpoints
 */
class AppointmentService {
  async acceptAppointment(appointmentId: string) {
    const response = await apiClient.put<ApiResponse<Appointment>>(
      `/appointments/${appointmentId}/accept`,
    );
    return response.data;
  }
  /**
   * Get all appointments
   */
  async getAllAppointments(
    queryParams: ListQueryParams,
  ): Promise<ApiResponse<Appointment[]>> {
    const response = await apiClient.get<ApiResponse<Appointment[]>>(
      "/appointments/all",
      { params: buildQueryParams(queryParams) },
    );
    return response.data;
  }

  async setClinicalAlert(appointmentId: string) {
    const response = await apiClient.put<ApiResponse<Appointment>>(
      `/appointments/${appointmentId}/clinical-alert`,
    );
    return response.data;
  }

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
    const response = await apiClient.put<ApiResponse<DoctorAvailability>>(
      `/doctor-availability/${id}/propose`,
      data,
    );
    return response.data;
  }

  /**
   * Get all appointments assigned to the authenticated doctor.
   * Supports server-side pagination and date range filtering.
   */
  async getAssignedCases(params?: ListQueryParams): Promise<AllAppointmentsResponse> {
    const response = await apiClient.get<AllAppointmentsResponse>(
      "/appointments",
      { params: buildQueryParams(params) },
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
