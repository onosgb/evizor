import apiClient from "../api-client";
import { ApiResponse, ApiArrayResponse } from "../../models/ApiResponse";
import { Specialty } from "../../models/Specialty";

export interface CreateSpecialtyRequest {
  name: string;
  description: string;
}

class SpecialtyService {
  async getSpecialties(): Promise<ApiArrayResponse<Specialty>> {
    const response = await apiClient.get<ApiArrayResponse<Specialty>>("/specialties");
    return response.data;
  }

  async createSpecialty(data: CreateSpecialtyRequest): Promise<ApiResponse<Specialty>> {
    const response = await apiClient.post<ApiResponse<Specialty>>("/specialties", data);
    return response.data;
  }

  async updateSpecialty(id: string, data: CreateSpecialtyRequest): Promise<ApiResponse<Specialty>> {
    const response = await apiClient.put<ApiResponse<Specialty>>(`/specialties/${id}`, data);
    return response.data;
  }

  async deleteSpecialty(id: string): Promise<ApiResponse<null>> {
    const response = await apiClient.delete<ApiResponse<null>>(`/specialties/${id}`);
    return response.data;
  }
}

export const specialtyService = new SpecialtyService();
