import { useState, useEffect } from "react";
import { CreateLabTestTypeRequest } from "@/app/lib/services/lab-test-type.service";
import { LabTestType } from "@/app/models";

interface EditLabTestTypeFormProps {
  isOpen: boolean;
  labTestType: LabTestType | null;
  onClose: () => void;
  onSubmit: (id: string, data: Partial<CreateLabTestTypeRequest>) => Promise<void>;
  error: string | null;
  isSubmitting: boolean;
}

export default function EditLabTestTypeForm({
  isOpen,
  labTestType,
  onClose,
  onSubmit,
  error,
  isSubmitting,
}: EditLabTestTypeFormProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    if (labTestType) {
      setName(labTestType.name);
      setDescription(labTestType.description);
      setIsActive(labTestType.isActive);
    }
  }, [labTestType]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (labTestType) {
      onSubmit(labTestType.id, { name, description, isActive });
    }
  };

  if (!isOpen || !labTestType) return null;

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center px-4" role="dialog">
      <div className="absolute inset-0 bg-slate-900/60" onClick={onClose} />
      <div className="relative w-full max-lg rounded-lg bg-white p-6 shadow-xl dark:bg-navy-700">
        <div className="flex items-center justify-between border-b border-slate-200 pb-4 dark:border-navy-500">
          <h3 className="text-lg font-semibold text-slate-700 dark:text-navy-100">Edit Lab Test Type</h3>
          <button onClick={onClose} className="btn size-7 rounded-full p-0 hover:bg-slate-200 dark:hover:bg-navy-500">
            <svg xmlns="http://www.w3.org/2000/svg" className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {error && (
          <div className="mt-4 rounded-lg bg-error/10 p-3 text-sm text-error">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-navy-100">Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="form-input mt-1.5 w-full rounded-lg border border-slate-300 bg-transparent px-3 py-2 placeholder:text-slate-400/70 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:hover:border-navy-400 dark:focus:border-accent"
              placeholder="e.g. Complete Blood Count"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-navy-100">Description</label>
            <textarea
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="form-textarea mt-1.5 w-full rounded-lg border border-slate-300 bg-transparent px-3 py-2 placeholder:text-slate-400/70 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:hover:border-navy-400 dark:focus:border-accent"
              placeholder="Brief description of the lab test..."
              rows={3}
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="edit_is_active"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className="form-checkbox is-basic size-5 rounded border-slate-400/70 checked:bg-primary checked:border-primary hover:border-primary focus:border-primary dark:border-navy-400"
            />
            <label htmlFor="edit_is_active" className="text-sm font-medium text-slate-700 dark:text-navy-100 cursor-pointer">
              Active
            </label>
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="btn rounded-full border border-slate-300 font-medium text-slate-700 hover:bg-slate-100 dark:border-navy-450 dark:text-navy-100 dark:hover:bg-navy-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn rounded-full bg-primary font-medium text-white hover:bg-primary-focus focus:bg-primary-focus active:bg-primary-focus/90 disabled:opacity-50"
            >
              {isSubmitting ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
