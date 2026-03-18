"use client";
import { useState, useEffect } from "react";
import { CreateSpecialtyRequest } from "@/app/lib/services/specialty.service";
import { FormInput } from "@/app/components/ui/FormInput";
import { FormTextarea } from "@/app/components/ui/FormTextarea";
import { Button } from "@/app/components/ui/button";
import { X } from "lucide-react";

interface CreateSpecialtyFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateSpecialtyRequest) => Promise<void>;
  error?: string | null;
  isSubmitting?: boolean;
}

const EMPTY_FORM: CreateSpecialtyRequest = { name: "", description: "" };

export default function CreateSpecialtyForm({
  isOpen,
  onClose,
  onSubmit,
  error,
  isSubmitting = false,
}: CreateSpecialtyFormProps) {
  const [formData, setFormData] = useState<CreateSpecialtyRequest>(EMPTY_FORM);

  // Adjust state during render when isOpen changes
  const [prevIsOpen, setPrevIsOpen] = useState(isOpen);
  if (isOpen !== prevIsOpen) {
    setPrevIsOpen(isOpen);
    if (!isOpen) {
      setFormData(EMPTY_FORM);
    }
  }

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
            Add New Specialty
          </h3>
          <button
            onClick={handleCancel}
            className="btn -mr-1.5 size-7 rounded-full p-0 hover:bg-slate-300/20 focus:bg-slate-300/20 active:bg-slate-300/25 dark:hover:bg-navy-300/20 dark:focus:bg-navy-300/20 dark:active:bg-navy-300/25"
          >
            <X className="size-4.5" />
          </button>
        </div>

        {/* Body */}
        <div className="px-4 py-4 sm:px-5 overflow-y-auto flex-1">
          <p className="text-slate-500 dark:text-navy-300 text-sm">
            Fill in the details below to add a new specialty to the system.
          </p>

          {error && (
            <div className="mt-4 bg-error/10 text-error px-4 py-3 rounded-lg text-center text-sm" role="alert">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-4 space-y-4">
            <FormInput
              label="Specialty Name"
              placeholder="e.g. Cardiology"
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />

            <FormTextarea
              label="Description"
              placeholder="Brief description of this specialty..."
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
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
