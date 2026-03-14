import apiClient from "../api-client";
import {
  ApiResponse,
  Appointment,
  AllAppointmentsResponse,
  DoctorAvailability,
  CompleteAppointmentRequest,
  CreatePrescriptionRequest,
} from "../../models";
import type { ProposeAvailabilityRequest } from "../../models/DoctorAvailability";
import { ListQueryParams } from "../../models/QueryParams";
import { buildQueryParams } from "../utils/queryParams";

/**
 * Appointment service
 * Handles all appointment-related API endpoints
 */
class AppointmentService {
 
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

  /**
   * Request a Dyte video auth token for a given appointment.
   * The backend creates/retrieves the meeting and returns a participant auth token.
   */
  async requestVideoToken(appointmentId: string): Promise<{ dyteToken: string; meetingUrl: string; }> {
    const response = await apiClient.post<ApiResponse<{ dyteToken: string; meetingUrl: string; }>>(
      `/appointments/${appointmentId}/start`,
    );
    return response.data.data;
  }

  /**
   * Complete an appointment with notes and prescriptions
   */
  async completeAppointment(appointmentId: string, data: CompleteAppointmentRequest): Promise<ApiResponse<Appointment>> {
    const response = await apiClient.post<ApiResponse<Appointment>>(
      `/appointments/${appointmentId}/complete`,
      data
    );
    return response.data;
  }

  /**
   * Fetch a Dyte auth token for an active appointment (Session Recovery)
   */
  async fetchAppointmentToken(appointmentId: string): Promise<{ dyteToken: string; meetingUrl?: string }> {
    const response = await apiClient.get<ApiResponse<{ dyteToken: string; meetingUrl?: string }>>(
      `/appointments/${appointmentId}/token`,
    );
    return response.data.data;
  }

  /**
   * Add a prescription to a clinical record
   */
  async addPrescription(clinicalRecordId: string, data: CreatePrescriptionRequest): Promise<ApiResponse<any>> {
    const response = await apiClient.post<ApiResponse<any>>(
      `/clinical-records/${clinicalRecordId}/prescriptions`,
      data
    );
    return response.data;
  }

  /**
   * Add an attachment to a clinical record
   */
  async addAttachment(clinicalRecordId: string, file: File, type: string): Promise<ApiResponse<any>> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);

    const response = await apiClient.post<ApiResponse<any>>(
      `/clinical-records/${clinicalRecordId}/attachments`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  }

  /**
   * Cancel an appointment
   * Endpoint: PUT /api/v1/appointments/{id}/cancel
   */
  async cancelAppointment(appointmentId: string): Promise<ApiResponse<any>> {
    const response = await apiClient.put<ApiResponse<any>>(
      `/appointments/${appointmentId}/cancel`
    );
    return response.data;
  }
}

export const appointmentService = new AppointmentService();

