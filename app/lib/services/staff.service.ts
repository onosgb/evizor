import apiClient from "../api-client";
import { ApiResponse, CreateStaffRequest, Staff } from "../../models";

/**
 * Staff service
 * Handles all staff-related API endpoints
 */
class StaffService {
  /**
   * Create a new staff member
   */
  async createStaff(data: CreateStaffRequest): Promise<ApiResponse<Staff>> {
    const response = await apiClient.post<ApiResponse<Staff>>(
      "/staff/create-staff",
      data
    );
    return response.data;
  }

  /**
   * Get all staff members
   */
  async getAllStaff(): Promise<ApiResponse<Staff[]>> {
    const response = await apiClient.get<ApiResponse<Staff[]>>("/staff/all-staff");
    return response.data;
  }

  /**
   * Get staff member by ID
   */
  async getStaffById(id: string): Promise<ApiResponse<Staff>> {
    const response = await apiClient.get<ApiResponse<Staff>>(`/staff/${id}`);
    return response.data;
  }

  /**
   * Update staff member
   */
  async updateStaff(
    id: string,
    data: Partial<CreateStaffRequest>
  ): Promise<ApiResponse<Staff>> {
    const response = await apiClient.put<ApiResponse<Staff>>(
      `/staff/${id}`,
      data
    );
    return response.data;
  }

  /**
   * Delete staff member
   */
  async deleteStaff(id: string): Promise<ApiResponse<void>> {
    const response = await apiClient.delete<ApiResponse<void>>(`/staff/${id}`);
    return response.data;
  }
}

export const staffService = new StaffService();
