import apiClient from "../api-client";
import { ApiArrayResponse } from "../../models/ApiResponse";
import { Specialty } from "../../models/Specialty";

class SpecialtyService {
  async getSpecialties(): Promise<ApiArrayResponse<Specialty>> {
    const response = await apiClient.get<ApiArrayResponse<Specialty>>("/specialties");
    return response.data;
  }
}

export const specialtyService = new SpecialtyService();
    