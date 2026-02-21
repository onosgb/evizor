export interface Symptom {
  id: string;
  name: string;
  description: string;
  tenantId: string;
  tenantName?: string;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}
