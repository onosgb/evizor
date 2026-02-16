import apiClient from "../api-client";
import { ApiResponse, Qualification } from "../../models";

/**
 * Qualification service
 * Handles all qualification-related API endpoints
 */
class QualificationService {
  /**
   * Upload qualification document
   */
  async uploadQualification(data: FormData): Promise<ApiResponse<any>> {
    const response = await apiClient.post<ApiResponse<any>>(
      "/profile/qualifications/upload",
      data,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  }

  /**
   * Get all qualifications
   */
  async getQualifications(): Promise<ApiResponse<Qualification[]>> {
    const response = await apiClient.get<ApiResponse<Qualification[]>>(
      "/profile/qualifications"
    );
    return response.data;
  }

  /**
   * Delete qualification
   */
  async deleteQualification(id: number): Promise<ApiResponse<any>> {
    const response = await apiClient.delete<ApiResponse<any>>(
      `/profile/qualifications/${id}`
    );
    return response.data;
  }
}

export const qualificationService = new QualificationService();
