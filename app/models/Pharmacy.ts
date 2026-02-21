export interface Pharmacy {
  id: string;
  name: string;
  address: string;
  phoneNumber: string;
  email: string;
  licenseNumber: string;
  tenantId: string;
  tenantName?: string;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreatePharmacyRequest {
  name: string;
  address: string;
  phoneNumber: string;
  email: string;
  licenseNumber: string;
  tenantId: string;
}

export interface UpdatePharmacyRequest {
  name: string;
  address: string;
  phoneNumber: string;
  email: string;
  licenseNumber: string;
  isActive: boolean;
}
