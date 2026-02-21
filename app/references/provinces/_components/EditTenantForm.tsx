"use client";
import { useState, useEffect } from "react";
import { Tenant } from "@/app/models";
import { UpdateTenantRequest } from "@/app/lib/services/tenant.service";

interface EditTenantFormProps {
  isOpen: boolean;
  tenant: Tenant | null;
  onClose: () => void;
  onSubmit: (id: string, data: UpdateTenantRequest) => Promise<void>;
  error?: string | null;
  isSubmitting?: boolean;
}

export default function EditTenantForm({
  isOpen,
  tenant,
  onClose,
  onSubmit,
  error,
  isSubmitting = false,
}: EditTenantFormProps) {
  const [formData, setFormData] = useState<UpdateTenantRequest>({
    province: "",
    slug: "",
    schemaName: "",
    isActive: true,
  });

  useEffect(() => {
    if (tenant) {
      setFormData({
        province: tenant.province,
        slug: tenant.slug,
        schemaName: tenant.schemaName,
        isActive: tenant.isActive,
      });
    }
  }, [tenant]);

  useEffect(() => {
    if (!isOpen) {
      setFormData({ province: "", slug: "", schemaName: "", isActive: true });
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tenant) return;
    await onSubmit(tenant.id, formData);
  };

  if (!isOpen || !tenant) return null;

  return (
    <div
      className="fixed inset-0 z-100 flex flex-col items-center justify-center overflow-hidden px-4 py-6 sm:px-5"
      role="dialog"
    >
      <div
        className="absolute inset-0 bg-slate-900/60 transition-opacity duration-300"
        onClick={onClose}
      />
      <div
        className="relative w-full max-w-lg origin-top rounded-lg bg-white transition-all duration-300 dark:bg-navy-700 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between rounded-t-lg bg-slate-200 px-4 py-3 dark:bg-navy-800 sm:px-5 shrink-0">
          <h3 className="text-base font-medium text-slate-700 dark:text-navy-100">
            Edit Province / Tenant
          </h3>
          <button
            onClick={onClose}
            className="btn -mr-1.5 size-7 rounded-full p-0 hover:bg-slate-300/20 focus:bg-slate-300/20 active:bg-slate-300/25 dark:hover:bg-navy-300/20 dark:focus:bg-navy-300/20 dark:active:bg-navy-300/25"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="size-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="px-4 py-4 sm:px-5 overflow-y-auto flex-1">
          <p className="text-slate-500 dark:text-navy-300 text-sm">
            Editing <span className="font-medium text-slate-700 dark:text-navy-100">{tenant.province}</span>.
          </p>

          {error && (
            <div className="mt-4 bg-error/10 text-error px-4 py-3 rounded-lg text-center text-sm" role="alert">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-4 space-y-4">
            <label className="block">
              <span className="text-sm font-medium">Province Name:</span>
              <input
                className="form-input mt-1.5 w-full rounded-lg border border-slate-300 bg-transparent px-3 py-2 placeholder:text-slate-400/70 hover:border-slate-400 focus:border-navy dark:border-navy-450 dark:hover:border-navy-400 dark:focus:border-success"
                placeholder="e.g. Gauteng"
                type="text"
                value={formData.province}
                onChange={(e) => setFormData({ ...formData, province: e.target.value })}
                required
              />
            </label>

            <label className="block">
              <span className="text-sm font-medium">Slug:</span>
              <input
                className="form-input mt-1.5 w-full rounded-lg border border-slate-300 bg-transparent px-3 py-2 placeholder:text-slate-400/70 hover:border-slate-400 focus:border-navy dark:border-navy-450 dark:hover:border-navy-400 dark:focus:border-success"
                placeholder="e.g. gauteng"
                type="text"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                required
              />
            </label>

            <label className="block">
              <span className="text-sm font-medium">Schema Name:</span>
              <input
                className="form-input mt-1.5 w-full rounded-lg border border-slate-300 bg-transparent px-3 py-2 placeholder:text-slate-400/70 hover:border-slate-400 focus:border-navy dark:border-navy-450 dark:hover:border-navy-400 dark:focus:border-success"
                placeholder="e.g. gauteng_schema"
                type="text"
                value={formData.schemaName}
                onChange={(e) => setFormData({ ...formData, schemaName: e.target.value })}
                required
              />
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                className="form-checkbox is-outline size-5 rounded border-slate-400/70 checked:border-success checked:bg-success dark:border-navy-400"
                checked={formData.isActive}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
              />
              <span className="text-sm font-medium">Active</span>
            </label>

            <div className="space-x-2 text-right pt-2">
              <button
                type="button"
                onClick={onClose}
                className="btn min-w-28 rounded-full border border-slate-300 font-medium text-slate-800 hover:bg-slate-150 focus:bg-slate-150 active:bg-slate-150/80 dark:border-navy-450 dark:text-navy-50 dark:hover:bg-navy-500 dark:focus:bg-navy-500 dark:active:bg-navy-500/90"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn min-w-28 rounded-full bg-success font-medium text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-success-focus focus:bg-success-focus active:bg-success-focus/90"
              >
                {isSubmitting ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
