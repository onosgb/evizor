"use client";
import { useState, useEffect } from "react";
import { CreateSymptomRequest } from "@/app/lib/services/symptom.service";
import { Tenant } from "@/app/models";

interface CreateSymptomFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateSymptomRequest) => Promise<void>;
  error?: string | null;
  isSubmitting?: boolean;
  tenants: Tenant[];
  defaultTenantId?: string;
  isSuperAdmin: boolean;
}

const EMPTY_FORM: CreateSymptomRequest = { name: "", description: "", tenantId: "" };

export default function CreateSymptomForm({
  isOpen,
  onClose,
  onSubmit,
  error,
  isSubmitting = false,
  tenants,
  defaultTenantId,
  isSuperAdmin,
}: CreateSymptomFormProps) {
  const [formData, setFormData] = useState<CreateSymptomRequest>(EMPTY_FORM);

  useEffect(() => {
    if (isOpen) {
      setFormData({ name: "", description: "", tenantId: defaultTenantId ?? "" });
    } else {
      setFormData(EMPTY_FORM);
    }
  }, [isOpen, defaultTenantId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  const handleCancel = () => {
    setFormData(EMPTY_FORM);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-100 flex flex-col items-center justify-center overflow-hidden px-4 py-6 sm:px-5"
      role="dialog"
    >
      <div
        className="absolute inset-0 bg-slate-900/60 transition-opacity duration-300"
        onClick={handleCancel}
      />
      <div
        className="relative w-full max-w-lg origin-top rounded-lg bg-white transition-all duration-300 dark:bg-navy-700 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between rounded-t-lg bg-slate-200 px-4 py-3 dark:bg-navy-800 sm:px-5 shrink-0">
          <h3 className="text-base font-medium text-slate-700 dark:text-navy-100">
            Add New Symptom
          </h3>
          <button
            onClick={handleCancel}
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
            Fill in the details below to add a new symptom.
          </p>

          {error && (
            <div className="mt-4 bg-error/10 text-error px-4 py-3 rounded-lg text-center text-sm" role="alert">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-4 space-y-4">
            <div className="block">
              <span className="text-sm font-medium">Province:</span>
              {isSuperAdmin ? (
                <select
                  className="form-select mt-1.5 w-full rounded-lg border border-slate-300 bg-transparent px-3 py-2 hover:border-slate-400 focus:border-navy dark:border-navy-450 dark:hover:border-navy-400 dark:focus:border-success"
                  value={formData.tenantId}
                  onChange={(e) => setFormData({ ...formData, tenantId: e.target.value })}
                  required
                >
                  <option value="">Select province...</option>
                  {tenants.map((t) => (
                    <option key={t.id} value={t.id}>{t.province}</option>
                  ))}
                </select>
              ) : (
                <div className="mt-1.5 flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 dark:border-navy-500 dark:bg-navy-800">
                  <svg xmlns="http://www.w3.org/2000/svg" className="size-4 shrink-0 text-slate-400 dark:text-navy-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                  </svg>
                  <span className="text-sm text-slate-600 dark:text-navy-200">
                    {tenants.find((t) => t.id === formData.tenantId)?.province ?? "—"}
                  </span>
                </div>
              )}
            </div>

            <label className="block">
              <span className="text-sm font-medium">Symptom Name:</span>
              <input
                className="form-input mt-1.5 w-full rounded-lg border border-slate-300 bg-transparent px-3 py-2 placeholder:text-slate-400/70 hover:border-slate-400 focus:border-navy dark:border-navy-450 dark:hover:border-navy-400 dark:focus:border-success"
                placeholder="e.g. Chest Pain"
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </label>

            <label className="block">
              <span className="text-sm font-medium">Description:</span>
              <textarea
                className="form-textarea mt-1.5 w-full rounded-lg border border-slate-300 bg-transparent px-3 py-2 placeholder:text-slate-400/70 hover:border-slate-400 focus:border-navy dark:border-navy-450 dark:hover:border-navy-400 dark:focus:border-success resize-none"
                placeholder="Brief description of this symptom..."
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
              />
            </label>

            <div className="space-x-2 text-right pt-2">
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
                className="btn min-w-28 rounded-full bg-success font-medium text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-success-focus focus:bg-success-focus active:bg-success-focus/90 dark:bg-success dark:hover:bg-success-focus dark:focus:bg-success-focus dark:active:bg-success/90"
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
