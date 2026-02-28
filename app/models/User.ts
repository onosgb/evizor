export interface User {
  id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  role: "DOCTOR" | "ADMIN" | "SUPERADMIN" | "PATIENT";
  isActive: boolean;
  isTwoFAEnabled: boolean;
  phoneNumber: string;
  socialId: string;
  licenseNo: string;
  specialty?: string;
  specialtyId?: string;
  tenantId?: string;
  dob?: string;
  gender?: string;
  profilePictureUrl?: string;
  address?: string;
  healthCardNo?: string;
  weight?: number;
  height?: number;
  profileCompleted?: boolean;
}

export interface ProfessionalProfile {
  specialtyId: string;
  subSpecialty?: string;
  yearsOfExperience: string;
  licenseNumber: string;
  issuingAuthority: string;
  licenseExpiryDate: string;
}

export interface UpdateUser {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  dob: string;
  gender: string;
  address: string;
  specialtyId?: string;
  weight?: number;
  height?: number;
}
