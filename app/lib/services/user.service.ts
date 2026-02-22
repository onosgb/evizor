import apiClient from "../api-client";
import { ApiResponse, CreateStaffRequest, Staff } from "../../models";
import { ListQueryParams } from "../../models/QueryParams";

/**
 * User service (previously Staff service)
 * Handles all user-related API endpoints (using /staff prefix as per backend)
 */
class UserService {
  /**
   * Create a new user
   */
  async createUser(data: CreateStaffRequest): Promise<ApiResponse<Staff>> {
    const response = await apiClient.post<ApiResponse<Staff>>(
      "/staff/create-staff",
      data
    );
    return response.data;
  }

  /**
   * Get all users (server-side pagination + filtering)
   */
  async getAllUsers(params: ListQueryParams): Promise<ApiResponse<Staff[]>> {
    const query: Record<string, string | number> = {
      page: params.page ?? 1,
      limit: params.limit ?? 10,
    };
    if (params.search)   query.search   = params.search;
    if (params.tenantId) query.tenantId = params.tenantId;
    if (params.status)   query.status   = params.status;
    if (params.role)     query.role     = params.role;

    const response = await apiClient.get<ApiResponse<Staff[]>>(
      "/staff/all-staff",
      { params: query }
    );
    return response.data;
  }

  /**
   * Get user by ID
   */
  async getUserById(id: string): Promise<ApiResponse<Staff>> {
    const response = await apiClient.get<ApiResponse<Staff>>(`/staff/${id}`);
    return response.data;
  }

  /**
   * Update user
   */
  async updateUser(
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
   * Delete user
   */
  async deleteUser(id: string): Promise<ApiResponse<void>> {
    const response = await apiClient.delete<ApiResponse<void>>(`/staff/${id}`);
    return response.data;
  }

  /**
   * Toggle user status
   */
  async toggleUserStatus(
    userId: string,
    status: string
  ): Promise<ApiResponse<Staff>> {
    const response = await apiClient.put<ApiResponse<Staff>>(
      "/staff/toggle-staff-status",
      {
        userId,
        status,
      }
    );
    return response.data;
  }
}

export const userService = new UserService();
