import apiClient from "../api-client";
import { ApiResponse, ApiArrayResponse } from "../../models/ApiResponse";
import { LabTestType } from "../../models/LabTestType";

export interface CreateLabTestTypeRequest {
  name: string;
  description: string;
  isActive: boolean;
}

class LabTestTypeService {
  async getLabTestTypes(search?: string): Promise<ApiArrayResponse<LabTestType>> {
    const params: Record<string, string> = {};
    if (search) params.search = search;
    const response = await apiClient.get<ApiArrayResponse<LabTestType>>("/lab-test-types", { params });
    return response.data;
  }

  async createLabTestType(data: CreateLabTestTypeRequest): Promise<ApiResponse<LabTestType>> {
    const response = await apiClient.post<ApiResponse<LabTestType>>("/lab-test-types", data);
    return response.data;
  }

  async updateLabTestType(id: string, data: Partial<CreateLabTestTypeRequest>): Promise<ApiResponse<LabTestType>> {
    const response = await apiClient.patch<ApiResponse<LabTestType>>(`/lab-test-types/${id}`, data);
    return response.data;
  }

  async deleteLabTestType(id: string): Promise<ApiResponse<null>> {
    const response = await apiClient.delete<ApiResponse<null>>(`/lab-test-types/${id}`);
    return response.data;
  }
}

export const labTestTypeService = new LabTestTypeService();
