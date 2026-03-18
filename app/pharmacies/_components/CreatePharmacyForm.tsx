"use client";
import { useState } from "react";
import { CreatePharmacyRequest } from "@/app/models/Pharmacy";
import { Tenant } from "@/app/models";
import { FormInput } from "@/app/components/ui/FormInput";
import { FormSelect } from "@/app/components/ui/FormSelect";
import { Button } from "@/app/components/ui/button";
import { X, Lock } from "lucide-react";

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
  const [form, setForm] = useState<CreatePharmacyRequest>(() => ({
    ...EMPTY,
    tenantId: defaultTenantId ?? "",
  }));

  // Adjust state during render if isOpen changes (avoids extra commit phase)
  const [prevIsOpen, setPrevIsOpen] = useState(isOpen);
  if (isOpen !== prevIsOpen) {
    setPrevIsOpen(isOpen);
    if (isOpen) {
      setForm({ ...EMPTY, tenantId: defaultTenantId ?? "" });
    } else {
      setForm(EMPTY);
    }
  }

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
            <X className="size-4.5" />
          </button>
        </div>

        {/* Body */}
        <div className="px-4 py-4 sm:px-5 overflow-y-auto flex-1">
          <p className="text-slate-500 dark:text-navy-300 text-sm">Fill in the details to register a new pharmacy.</p>

          {error && (
            <div className="mt-4 bg-error/10 text-error px-4 py-3 rounded-lg text-sm" role="alert">{error}</div>
          )}

          <form onSubmit={handleSubmit} className="mt-4 space-y-4">
            {isSuperAdmin ? (
              <FormSelect
                label="Province:"
                value={form.tenantId}
                onChange={set("tenantId")}
                required
              >
                <option value="">Select province...</option>
                {tenants.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.province}
                  </option>
                ))}
              </FormSelect>
            ) : (
              <div className="space-y-1.5">
                <span className="text-sm font-medium">Province:</span>
                <div className="flex h-10 items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 dark:border-navy-500 dark:bg-navy-800">
                  <Lock className="size-4 shrink-0 text-slate-400" />
                  <span className="text-sm text-slate-600 dark:text-navy-200">
                    {tenants.find((t) => t.id === form.tenantId)?.province ?? "—"}
                  </span>
                </div>
              </div>
            )}

            <FormInput
              label="Pharmacy Name:"
              placeholder="e.g. HealthPlus Pharmacy"
              value={form.name}
              onChange={set("name")}
              required
            />

            <FormInput
              label="Address:"
              placeholder="e.g. 123 Main St, Toronto, ON"
              value={form.address}
              onChange={set("address")}
              required
            />

            <div className="grid grid-cols-2 gap-4">
              <FormInput
                label="Phone Number:"
                placeholder="+1-416-555-0100"
                type="tel"
                value={form.phoneNumber}
                onChange={set("phoneNumber")}
                required
              />
              <FormInput
                label="Email:"
                placeholder="contact@pharmacy.com"
                type="email"
                value={form.email}
                onChange={set("email")}
                required
              />
            </div>

            <FormInput
              label="License Number:"
              placeholder="e.g. PH-12345-ON"
              value={form.licenseNumber}
              onChange={set("licenseNumber")}
              required
            />

            <div className="space-x-2 text-right pt-2">
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
                variant="success"
                className="min-w-28 rounded-full"
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
