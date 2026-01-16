/**
 * Request model for creating a new staff member
 */
export interface CreateStaffRequest {
  specialty: string;
  licenseNo: string;
  email: string;
  socialId: string;
  phoneNumber: string;
  fullName: string;
  role: string;
  status: string;
}

/**
 * Staff member model (response from API)
 */
export interface Staff {
  id: string;
  specialty: string;
  licenseNo: string;
  email: string;
  socialId: string;
  phoneNumber: string;
  fullName: string;
  role: string;
  status: string;
  createdAt?: string;
  updatedAt?: string;
}
