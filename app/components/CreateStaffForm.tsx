"use client";
import { useState, useEffect } from "react";
import { CreateStaffRequest } from "../models";
import { useTenantStore } from "../stores";

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

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      setFormData({
        email: "",
        socialId: "",
        phoneNumber: "",
        fullName: "",
        role: "",
        status: "ACTIVE",
        tenantId: ''
      });
    }
  }, [isOpen]);

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
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="size-4.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              ></path>
            </svg>
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
            <label className="block">
              <span>Role:</span>
              <select
                className="form-select mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 hover:border-slate-400 focus:border-navy dark:border-navy-450 dark:bg-navy-700 dark:hover:border-navy-400 dark:focus:border-accent"
                value={formData.role}
                onChange={(e) =>
                  setFormData({ ...formData, role: e.target.value })
                }
                required
              >
                <option value="">Select role</option>
                <option value="DOCTOR">Doctor</option>
                <option value="ADMIN">Admin</option>
              </select>
            </label>
            <label className="block">
              <span>Location (Province):</span>
              <select
                className="form-select mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 hover:border-slate-400 focus:border-navy dark:border-navy-450 dark:bg-navy-700 dark:hover:border-navy-400 dark:focus:border-accent"
                value={formData.tenantId}
                onChange={(e) =>
                  setFormData({ ...formData, tenantId: e.target.value })
                }
                required
                disabled={isLoadingTenants}
              >
                <option value="">
                  {isLoadingTenants ? "Loading locations..." : "Select location"}
                </option>
                {(tenants || [])
                  .filter((tenant) => tenant.isActive)
                  .map((tenant) => (
                    <option key={tenant.id} value={tenant.id}>
                      {tenant.province}
                    </option>
                  ))}
              </select>
            </label>
            <label className="block">
              <span>Full Name:</span>
              <input
                className="form-input mt-1.5 w-full rounded-lg border border-slate-300 bg-transparent px-3 py-2 placeholder:text-slate-400/70 hover:border-slate-400 focus:border-navy dark:border-navy-450 dark:hover:border-navy-400 dark:focus:border-success"
                placeholder="Enter full name"
                type="text"
                value={formData.fullName}
                onChange={(e) =>
                  setFormData({ ...formData, fullName: e.target.value })
                }
                required
              />
            </label>
            <label className="block">
              <span>Email Address:</span>
              <input
                className="form-input mt-1.5 w-full rounded-lg border border-slate-300 bg-transparent px-3 py-2 placeholder:text-slate-400/70 hover:border-slate-400 focus:border-navy dark:border-navy-450 dark:hover:border-navy-400 dark:focus:border-success"
                placeholder="email@example.com"
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                required
              />
            </label>
            <label className="block">
              <span>Phone Number:</span>
              <input
                className="form-input mt-1.5 w-full rounded-lg border border-slate-300 bg-transparent px-3 py-2 placeholder:text-slate-400/70 hover:border-slate-400 focus:border-navy dark:border-navy-450 dark:hover:border-navy-400 dark:focus:border-success"
                placeholder="+1 234 567 890"
                type="tel"
                value={formData.phoneNumber}
                onChange={(e) =>
                  setFormData({ ...formData, phoneNumber: e.target.value })
                }
                required
              />
            </label>
            <label className="block">
              <span>Social ID:</span>
              <input
                className="form-input mt-1.5 w-full rounded-lg border border-slate-300 bg-transparent px-3 py-2 placeholder:text-slate-400/70 hover:border-slate-400 focus:border-navy dark:border-navy-450 dark:hover:border-navy-400 dark:focus:border-success"
                placeholder="Enter social ID"
                type="text"
                value={formData.socialId}
                onChange={(e) =>
                  setFormData({ ...formData, socialId: e.target.value })
                }
                required
              />
            </label>
            
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
              <button
                type="button"
                onClick={handleCancel}
                className="btn min-w-28 rounded-full border border-slate-300 font-medium text-slate-800 hover:bg-slate-150 focus:bg-slate-150 active:bg-slate-150/80 dark:border-navy-450 dark:text-navy-50 dark:hover:bg-navy-500 dark:focus:bg-navy-500 dark:active:bg-navy-500/90"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`btn min-w-28 rounded-full font-medium text-white disabled:opacity-50 disabled:cursor-not-allowed ${
                  theme === "admin"
                    ? "bg-success hover:bg-success-focus focus:bg-success-focus active:bg-success-focus/90 dark:bg-success dark:hover:bg-success-focus dark:focus:bg-success-focus dark:active:bg-success/90"
                    : "bg-primary hover:bg-primary-focus focus:bg-primary-focus active:bg-primary-focus/90 dark:bg-accent dark:hover:bg-accent-focus dark:focus:bg-accent-focus dark:active:bg-accent/90"
                }`}
              >
                {isSubmitting ? "Creating..." : "Create"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
