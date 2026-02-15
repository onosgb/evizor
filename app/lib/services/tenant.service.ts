import apiClient from "../api-client";
import { Tenant } from "../../models";
import { ApiResponse } from "../../models/ApiResponse";

/**
 * Tenant service
 * Handles all tenant-related API endpoints
 */
class TenantService {
  /**
   * Get all tenants
   * Response: { "message": "string", "statusCode": number, "data": [...] }
   */
  async getAllTenants(): Promise<Tenant[]> {
    const response = await apiClient.get<ApiResponse<Tenant[]>>(
      "/tenant/all-tenants"
    );
    return response.data.data;
  }
}

export const tenantService = new TenantService();
