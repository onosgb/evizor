export interface PendingVerification {
  userId: string;
  doctorName: string;
  email: string;
  specialty: Record<string, any>; // Using Record since the example shows an object but structure is not fully defined
  licenseNumber: string;
  profileSubmittedAt: string;
  tenantId: string;
}
