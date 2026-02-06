import apiClient from "../api-client";
import { ApiResponse, Tenant } from "../../models";

/**
 * Tenant service
 * Handles all tenant-related API endpoints
 */
class TenantService {
  /**
   * Get all tenants
   */
  async getAllTenants(): Promise<Tenant[]> {
    const response = await apiClient.get<Tenant[]>(
      "/tenant/all-tenants"
    );
    return response.data;
  }
}

export const tenantService = new TenantService();
