import apiClient from "../api-client";
import { Tenant } from "../../models";
import { ApiResponse } from "../../models/ApiResponse";

export interface UpdateTenantRequest {
  province: string;
  slug: string;
  schemaName: string;
  isActive: boolean;
}

/**
 * Tenant service
 * Handles all tenant-related API endpoints
 */
class TenantService {
  /**
   * Get all tenants
   */
  async getAllTenants(): Promise<Tenant[]> {
    const response = await apiClient.get<ApiResponse<Tenant[]>>(
      "/tenant/all-tenants"
    );
    return response.data.data;
  }

  async createTenant(data: UpdateTenantRequest): Promise<ApiResponse<Tenant>> {
    const response = await apiClient.post<ApiResponse<Tenant>>(`/tenant`, data);
    return response.data;
  }

  /**
   * Update a tenant by ID
   */
  async updateTenant(id: string, data: UpdateTenantRequest): Promise<ApiResponse<Tenant>> {
    const response = await apiClient.put<ApiResponse<Tenant>>(`/tenant/${id}`, data);
    return response.data;
  }

  async toggleTenantStatus(id: string, isActive: boolean): Promise<ApiResponse<Tenant>> {
    const response = await apiClient.patch<ApiResponse<Tenant>>(`/tenant/${id}/status`, { isActive });
    return response.data;
  }
}

export const tenantService = new TenantService();
