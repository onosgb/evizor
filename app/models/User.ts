export interface User {
  id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  role: string;
  isActive: boolean;
  isTwoFAEnabled:boolean;
  phoneNumber: string;
  socialId: string;
  licenseNo: string;
  specialty?: string;
  tenantId?: string;
  dob?: string;
  gender?: string;
  profilePhotoUrl?: string;
  address?: string;
}

export interface UpdateUser {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  dob: string;
  gender: string;
  profilePhotoUrl?: string;
  address: string;
}