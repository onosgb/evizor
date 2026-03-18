"use client";
import { useState, } from "react";
import { Tenant } from "@/app/models";
import { UpdateTenantRequest } from "@/app/lib/services/tenant.service";
import { FormInput } from "@/app/components/ui/FormInput";
import { Button } from "@/app/components/ui/button";
import { X } from "lucide-react";

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

  // Adjust state during render when tenant or isOpen changes
  const [prevTenantId, setPrevTenantId] = useState(tenant?.id);
  const [prevIsOpen, setPrevIsOpen] = useState(isOpen);

  if (tenant?.id !== prevTenantId || isOpen !== prevIsOpen) {
    if (tenant?.id !== prevTenantId) {
      setPrevTenantId(tenant?.id);
      if (tenant) {
        setFormData({
          province: tenant.province,
          slug: tenant.slug,
          schemaName: tenant.schemaName,
          isActive: tenant.isActive,
        });
      }
    }
    
    if (isOpen !== prevIsOpen) {
      setPrevIsOpen(isOpen);
      if (!isOpen) {
        setFormData({ province: "", slug: "", schemaName: "", isActive: true });
      }
    }
  }

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
            <X className="size-4.5" />
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
            <FormInput
              label="Province Name"
              placeholder="e.g. Gauteng"
              type="text"
              value={formData.province}
              onChange={(e) => setFormData({ ...formData, province: e.target.value })}
              required
            />

            <FormInput
              label="Slug"
              placeholder="e.g. gauteng"
              type="text"
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              required
            />

            <FormInput
              label="Schema Name"
              placeholder="e.g. gauteng_schema"
              type="text"
              value={formData.schemaName}
              onChange={(e) => setFormData({ ...formData, schemaName: e.target.value })}
              required
            />

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
              <Button
                type="button"
                onClick={onClose}
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
                {isSubmitting ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
