import apiClient from "../api-client";
import { ApiResponse, PaginatedResponse } from "../../models/ApiResponse";
import { Pharmacy, CreatePharmacyRequest, UpdatePharmacyRequest } from "../../models/Pharmacy";
import { ListQueryParams } from "../../models/QueryParams";
import { buildQueryParams } from "../utils/queryParams";

class PharmacyService {
  async getPharmacies(params?: ListQueryParams): Promise<PaginatedResponse<Pharmacy>> {
    const response = await apiClient.get<PaginatedResponse<Pharmacy>>("/pharmacies", { params: buildQueryParams(params) });
    return response.data;
  }

  async createPharmacy(data: CreatePharmacyRequest): Promise<ApiResponse<Pharmacy>> {
    const response = await apiClient.post<ApiResponse<Pharmacy>>("/pharmacies", data);
    return response.data;
  }

  async updatePharmacy(id: string, data: UpdatePharmacyRequest): Promise<ApiResponse<Pharmacy>> {
    const response = await apiClient.put<ApiResponse<Pharmacy>>(`/pharmacies/${id}`, data);
    return response.data;
  }

  async deletePharmacy(id: string): Promise<ApiResponse<null>> {
    const response = await apiClient.delete<ApiResponse<null>>(`/pharmacies/${id}`);
    return response.data;
  }
}

export const pharmacyService = new PharmacyService();
