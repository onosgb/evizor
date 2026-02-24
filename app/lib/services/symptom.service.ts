import apiClient from "../api-client";
import { ApiResponse, ApiArrayResponse } from "../../models/ApiResponse";
import { Symptom } from "../../models/Symptom";

export interface CreateSymptomRequest {
  name: string;
  description: string;
  tenantId: string;
}

class SymptomService {
  async getSymptoms(tenantId?: string, search?: string): Promise<ApiArrayResponse<Symptom>> {
    const params: Record<string, string> = {};
    if (tenantId) params.tenantId = tenantId;
    if (search) params.search = search;
    const response = await apiClient.get<ApiArrayResponse<Symptom>>("/symptoms", { params });
    return response.data;
  }

  async createSymptom(data: CreateSymptomRequest): Promise<ApiResponse<Symptom>> {
    const response = await apiClient.post<ApiResponse<Symptom>>("/symptoms", data);
    return response.data;
  }

  async updateSymptom(id: string, data: CreateSymptomRequest): Promise<ApiResponse<Symptom>> {
    const response = await apiClient.put<ApiResponse<Symptom>>(`/symptoms/${id}`, data);
    return response.data;
  }

  async deleteSymptom(id: string): Promise<ApiResponse<null>> {
    const response = await apiClient.delete<ApiResponse<null>>(`/symptoms/${id}`);
    return response.data;
  }
}

export const symptomService = new SymptomService();
