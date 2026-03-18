"use client";
import { useState, useEffect } from "react";
import { Symptom, Tenant } from "@/app/models";
import { CreateSymptomRequest } from "@/app/lib/services/symptom.service";
import { FormInput } from "@/app/components/ui/FormInput";
import { FormSelect } from "@/app/components/ui/FormSelect";
import { FormTextarea } from "@/app/components/ui/FormTextarea";
import { Button } from "@/app/components/ui/button";
import { X, Lock } from "lucide-react";

interface EditSymptomFormProps {
  isOpen: boolean;
  symptom: Symptom | null;
  onClose: () => void;
  onSubmit: (id: string, data: CreateSymptomRequest) => Promise<void>;
  error?: string | null;
  isSubmitting?: boolean;
  tenants: Tenant[];
  isSuperAdmin: boolean;
}

export default function EditSymptomForm({
  isOpen,
  symptom,
  onClose,
  onSubmit,
  error,
  isSubmitting = false,
  tenants,
  isSuperAdmin,
}: EditSymptomFormProps) {
  const [formData, setFormData] = useState<CreateSymptomRequest>({ name: "", description: "", tenantId: "" });

  // Adjust state during render when symptom or isOpen changes
  const [prevSymptomId, setPrevSymptomId] = useState(symptom?.id);
  const [prevIsOpen, setPrevIsOpen] = useState(isOpen);

  if (symptom?.id !== prevSymptomId || isOpen !== prevIsOpen) {
    if (symptom?.id !== prevSymptomId) {
      setPrevSymptomId(symptom?.id);
      if (symptom) {
        setFormData({ name: symptom.name, description: symptom.description ?? "", tenantId: symptom.tenantId });
      }
    }

    if (isOpen !== prevIsOpen) {
      setPrevIsOpen(isOpen);
      if (!isOpen) {
        setFormData({ name: "", description: "", tenantId: "" });
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!symptom) return;
    await onSubmit(symptom.id, formData);
  };

  if (!isOpen || !symptom) return null;

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
            Edit Symptom
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
            Update the details for <span className="font-medium text-slate-700 dark:text-navy-100">{symptom.name}</span>.
          </p>

          {error && (
            <div className="mt-4 bg-error/10 text-error px-4 py-3 rounded-lg text-center text-sm" role="alert">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-4 space-y-4">
            {isSuperAdmin ? (
              <FormSelect
                label="Province"
                value={formData.tenantId}
                onChange={(e) => setFormData({ ...formData, tenantId: e.target.value })}
                required
                options={[
                  { value: "", label: "Select province..." },
                  ...tenants.map((t) => ({ value: t.id, label: t.province })),
                ]}
              />
            ) : (
              <div className="space-y-1.5">
                <span className="text-sm font-medium">Province</span>
                <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 dark:border-navy-500 dark:bg-navy-800">
                  <Lock className="size-4 shrink-0 text-slate-400 dark:text-navy-300" />
                  <span className="text-sm text-slate-600 dark:text-navy-200">
                    {tenants.find((t) => t.id === formData.tenantId)?.province ?? "—"}
                  </span>
                </div>
              </div>
            )}

            <FormInput
              label="Symptom Name"
              placeholder="e.g. Chest Pain"
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />

            <FormTextarea
              label="Description"
              placeholder="Brief description of this symptom..."
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
            />

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
