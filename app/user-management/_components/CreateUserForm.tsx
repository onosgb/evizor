"use client";
import { useState } from "react";
import { CreateStaffRequest } from "@/app/models";
import { useTenantStore } from "@/app/stores";
import { useAuthStore } from "@/app/stores/authStore";
import { isSuperAdmin } from "@/app/lib/roles";
import { FormInput } from "@/app/components/ui/FormInput";
import { FormSelect } from "@/app/components/ui/FormSelect";
import { Button } from "@/app/components/ui/button";
import { X } from "lucide-react";

// Helper function to check if status is active
const isActiveStatus = (status: string | null | undefined): boolean => {
  if (!status) return false;
  return status.toUpperCase() === "ACTIVE" || status === "true";
};

interface CreateStaffFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateStaffRequest) => Promise<void>;
  error?: string | null;
  isSubmitting?: boolean;
  theme?: "admin" | "doctor";
}

export default function CreateStaffForm({
  isOpen,
  onClose,
  onSubmit,
  error,
  isSubmitting = false,
  theme = "doctor",
}: CreateStaffFormProps) {
  // Get current user role
  const currentUser = useAuthStore((state) => state.user);
  const currentUserIsSuperAdmin = isSuperAdmin(currentUser);

  // Get tenants from store
  const tenants = useTenantStore((state) => state.tenants);
  const isLoadingTenants = useTenantStore((state) => state.isLoading);
  
  // Theme-based outline switch styling
  const getOutlineSwitchClasses = () => {
    return theme === "admin"
      ? "form-switch is-outline h-5 w-10 rounded-full border border-slate-400/70 bg-transparent before:rounded-full before:bg-slate-300 checked:border-green-600 checked:before:bg-green-600 dark:border-navy-400 dark:before:bg-navy-300 dark:checked:border-green-500 dark:checked:before:bg-green-500"
      : "form-switch is-outline h-5 w-10 rounded-full border border-slate-400/70 bg-transparent before:rounded-full before:bg-slate-300 checked:border-primary checked:before:bg-primary dark:border-navy-400 dark:before:bg-navy-300 dark:checked:border-accent dark:checked:before:bg-accent";
  };
  const [formData, setFormData] = useState<CreateStaffRequest>({
    email: "",
    socialId: "",
    phoneNumber: "",
    fullName: "",
    role: "",
    status: "ACTIVE",
    tenantId: "",
  });

  // Adjust state during render when isOpen changes
  const [prevIsOpen, setPrevIsOpen] = useState(isOpen);
  if (isOpen !== prevIsOpen) {
    setPrevIsOpen(isOpen);
    if (!isOpen) {
      setFormData({
        email: "",
        socialId: "",
        phoneNumber: "",
        fullName: "",
        role: "",
        status: "ACTIVE",
        tenantId: '',
      });
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
    // Form will be reset by useEffect when modal closes
  };

  const handleCancel = () => {
    setFormData({
      email: "",
      socialId: "",
      phoneNumber: "",
      fullName: "",
      role: "",
      status: "ACTIVE",
      tenantId: ''
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-100 flex flex-col items-center justify-center overflow-hidden px-4 py-6 sm:px-5"
      role="dialog"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          handleCancel();
        }
      }}
    >
      <div
        className="absolute inset-0 bg-slate-900/60 transition-opacity duration-300"
        onClick={handleCancel}
      ></div>
      <div
        className="relative w-full max-w-lg max-h-[85vh] origin-top rounded-lg bg-white transition-all duration-300 dark:bg-navy-700 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between rounded-t-lg bg-slate-200 px-4 py-3 dark:bg-navy-800 sm:px-5 shrink-0">
          <h3 className="text-base font-medium text-slate-700 dark:text-navy-100">
            Add New Staff
          </h3>
          <button
            onClick={handleCancel}
            className="btn -mr-1.5 size-7 rounded-full p-0 hover:bg-slate-300/20 focus:bg-slate-300/20 active:bg-slate-300/25 dark:hover:bg-navy-300/20 dark:focus:bg-navy-300/20 dark:active:bg-navy-300/25"
          >
            <X className="size-4.5" />
          </button>
        </div>
        <div className="px-4 py-4 sm:px-5 overflow-y-auto flex-1">
          <p>
            Add a new staff member to the system. Fill in the required
            information below.
          </p>
          {error && (
            <div
              className="mt-4 bg-error/10 text-error px-4 py-3 rounded-lg text-center"
              role="alert"
            >
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="mt-4 space-y-4">
            <FormSelect
              label="Role:"
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              required
            >
              <option value="">Select role</option>
              <option value="DOCTOR">Doctor</option>
              <option value="ADMIN">Admin</option>
            </FormSelect>
            {currentUserIsSuperAdmin && (
              <FormSelect
                label="Location (Province):"
                value={formData.tenantId}
                onChange={(e) => setFormData({ ...formData, tenantId: e.target.value })}
                disabled={isLoadingTenants}
                required
              >
                <option value="">
                  {isLoadingTenants ? "Loading locations..." : "Select location"}
                </option>
                {(tenants || [])
                  .filter((tenant) => tenant.isActive && tenant.id)
                  .map((tenant) => (
                    <option key={tenant.id} value={tenant.id}>
                      {tenant.province}
                    </option>
                  ))}
              </FormSelect>
            )}
            <FormInput
              label="Full Name:"
              placeholder="Enter full name"
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              required
            />
            <FormInput
              label="Email Address:"
              type="email"
              placeholder="email@example.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
            <FormInput
              label="Phone Number:"
              type="tel"
              placeholder="+1 234 567 890"
              value={formData.phoneNumber}
              onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
              required
            />
            <FormInput
              label="Social ID:"
              placeholder="Enter social ID"
              value={formData.socialId}
              onChange={(e) => setFormData({ ...formData, socialId: e.target.value })}
              required
            />
            
            <label className="inline-flex items-center space-x-2">
              <input
                className={getOutlineSwitchClasses()}
                type="checkbox"
                checked={isActiveStatus(formData.status)}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    status: e.target.checked ? "ACTIVE" : "INACTIVE",
                  })
                }
              />
              <span>Active status</span>
            </label>
            <div className="space-x-2 text-right">
              <Button
                type="button"
                onClick={handleCancel}
                variant="outline"
                className="min-w-28 rounded-full"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                variant={theme === "admin" ? "success" : "default"}
                className="min-w-28 rounded-full font-medium"
              >
                {isSubmitting ? "Creating..." : "Create"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}


