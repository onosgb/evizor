"use client";
import { useState, useEffect } from "react";
import { CreatePharmacyRequest } from "@/app/models/Pharmacy";
import { Tenant } from "@/app/models";

interface CreatePharmacyFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreatePharmacyRequest) => Promise<void>;
  error?: string | null;
  isSubmitting?: boolean;
  tenants: Tenant[];
  defaultTenantId?: string;
  isSuperAdmin: boolean;
}

const EMPTY: CreatePharmacyRequest = {
  name: "", address: "", phoneNumber: "", email: "", licenseNumber: "", tenantId: "",
};

export default function CreatePharmacyForm({
  isOpen, onClose, onSubmit, error, isSubmitting = false,
  tenants, defaultTenantId, isSuperAdmin,
}: CreatePharmacyFormProps) {
  const [form, setForm] = useState<CreatePharmacyRequest>(EMPTY);

  useEffect(() => {
    if (isOpen) setForm({ ...EMPTY, tenantId: defaultTenantId ?? "" });
    else setForm(EMPTY);
  }, [isOpen, defaultTenantId]);

  const set = (field: keyof CreatePharmacyRequest) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setForm((p) => ({ ...p, [field]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(form);
  };

  const handleCancel = () => { setForm(EMPTY); onClose(); };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-100 flex flex-col items-center justify-center overflow-hidden px-4 py-6 sm:px-5" role="dialog">
      <div className="absolute inset-0 bg-slate-900/60" onClick={handleCancel} />
      <div className="relative w-full max-w-lg rounded-lg bg-white dark:bg-navy-700 flex flex-col" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="flex justify-between rounded-t-lg bg-slate-200 px-4 py-3 dark:bg-navy-800 sm:px-5 shrink-0">
          <h3 className="text-base font-medium text-slate-700 dark:text-navy-100">Add New Pharmacy</h3>
          <button onClick={handleCancel} className="btn -mr-1.5 size-7 rounded-full p-0 hover:bg-slate-300/20 focus:bg-slate-300/20 dark:hover:bg-navy-300/20">
            <svg xmlns="http://www.w3.org/2000/svg" className="size-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="px-4 py-4 sm:px-5 overflow-y-auto flex-1">
          <p className="text-slate-500 dark:text-navy-300 text-sm">Fill in the details to register a new pharmacy.</p>

          {error && (
            <div className="mt-4 bg-error/10 text-error px-4 py-3 rounded-lg text-sm" role="alert">{error}</div>
          )}

          <form onSubmit={handleSubmit} className="mt-4 space-y-4">
            {/* Province */}
            <div className="block">
              <span className="text-sm font-medium">Province:</span>
              {isSuperAdmin ? (
                <select
                  className="form-select mt-1.5 w-full rounded-lg border border-slate-300 bg-transparent px-3 py-2 hover:border-slate-400 focus:border-navy dark:border-navy-450"
                  value={form.tenantId}
                  onChange={set("tenantId")}
                  required
                >
                  <option value="">Select province...</option>
                  {tenants.map((t) => <option key={t.id} value={t.id}>{t.province}</option>)}
                </select>
              ) : (
                <div className="mt-1.5 flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 dark:border-navy-500 dark:bg-navy-800">
                  <svg xmlns="http://www.w3.org/2000/svg" className="size-4 shrink-0 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                  </svg>
                  <span className="text-sm text-slate-600 dark:text-navy-200">
                    {tenants.find((t) => t.id === form.tenantId)?.province ?? "—"}
                  </span>
                </div>
              )}
            </div>

            <label className="block">
              <span className="text-sm font-medium">Pharmacy Name:</span>
              <input className="form-input mt-1.5 w-full rounded-lg border border-slate-300 bg-transparent px-3 py-2 placeholder:text-slate-400/70 hover:border-slate-400 focus:border-navy dark:border-navy-450" placeholder="e.g. HealthPlus Pharmacy" type="text" value={form.name} onChange={set("name")} required />
            </label>

            <label className="block">
              <span className="text-sm font-medium">Address:</span>
              <input className="form-input mt-1.5 w-full rounded-lg border border-slate-300 bg-transparent px-3 py-2 placeholder:text-slate-400/70 hover:border-slate-400 focus:border-navy dark:border-navy-450" placeholder="e.g. 123 Main St, Toronto, ON" type="text" value={form.address} onChange={set("address")} required />
            </label>

            <div className="grid grid-cols-2 gap-4">
              <label className="block">
                <span className="text-sm font-medium">Phone Number:</span>
                <input className="form-input mt-1.5 w-full rounded-lg border border-slate-300 bg-transparent px-3 py-2 placeholder:text-slate-400/70 hover:border-slate-400 focus:border-navy dark:border-navy-450" placeholder="+1-416-555-0100" type="tel" value={form.phoneNumber} onChange={set("phoneNumber")} required />
              </label>
              <label className="block">
                <span className="text-sm font-medium">Email:</span>
                <input className="form-input mt-1.5 w-full rounded-lg border border-slate-300 bg-transparent px-3 py-2 placeholder:text-slate-400/70 hover:border-slate-400 focus:border-navy dark:border-navy-450" placeholder="contact@pharmacy.com" type="email" value={form.email} onChange={set("email")} required />
              </label>
            </div>

            <label className="block">
              <span className="text-sm font-medium">License Number:</span>
              <input className="form-input mt-1.5 w-full rounded-lg border border-slate-300 bg-transparent px-3 py-2 placeholder:text-slate-400/70 hover:border-slate-400 focus:border-navy dark:border-navy-450" placeholder="e.g. PH-12345-ON" type="text" value={form.licenseNumber} onChange={set("licenseNumber")} required />
            </label>

            <div className="space-x-2 text-right pt-2">
              <button type="button" onClick={handleCancel} className="btn min-w-28 rounded-full border border-slate-300 font-medium text-slate-800 hover:bg-slate-150 dark:border-navy-450 dark:text-navy-50 dark:hover:bg-navy-500">
                Cancel
              </button>
              <button type="submit" disabled={isSubmitting} className="btn min-w-28 rounded-full bg-success font-medium text-white disabled:opacity-50 hover:bg-success-focus focus:bg-success-focus">
                {isSubmitting ? "Creating..." : "Create"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
