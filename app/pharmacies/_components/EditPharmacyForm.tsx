"use client";
import { useState, useEffect } from "react";
import { Pharmacy, UpdatePharmacyRequest } from "@/app/models/Pharmacy";
import { FormInput } from "@/app/components/ui/FormInput";
import { Button } from "@/app/components/ui/button";

interface EditPharmacyFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: UpdatePharmacyRequest) => Promise<void>;
  pharmacy: Pharmacy | null;
  error?: string | null;
  isSubmitting?: boolean;
}

export default function EditPharmacyForm({
  isOpen,
  onClose,
  onSubmit,
  pharmacy,
  error,
  isSubmitting,
}: EditPharmacyFormProps) {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [licenseNumber, setLicenseNumber] = useState("");
  const [isActive, setIsActive] = useState(true);

  // Adjust state during render when the pharmacy prop changes
  const [prevPharmacyId, setPrevPharmacyId] = useState(pharmacy?.id);
  if (pharmacy?.id !== prevPharmacyId) {
    setPrevPharmacyId(pharmacy?.id);
    if (pharmacy) {
      setName(pharmacy.name);
      setAddress(pharmacy.address);
      setPhoneNumber(pharmacy.phoneNumber);
      setEmail(pharmacy.email);
      setLicenseNumber(pharmacy.licenseNumber);
      setIsActive(pharmacy.isActive ?? true);
    }
  }

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit({ name, address, phoneNumber, email, licenseNumber, isActive });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl dark:bg-navy-700">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-800 dark:text-navy-100">
            Edit Pharmacy
          </h2>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-navy-600"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {error && (
          <div className="mb-4 rounded-lg bg-error/10 p-3 text-sm text-error">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <FormInput
            label="Name"
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <FormInput
            label="Address"
            type="text"
            required
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />

          <div className="grid grid-cols-2 gap-3">
            <FormInput
              label="Phone Number"
              type="tel"
              required
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />

            <FormInput
              label="Email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <FormInput
            label="License Number"
            type="text"
            required
            value={licenseNumber}
            onChange={(e) => setLicenseNumber(e.target.value)}
          />

          <div className="flex items-center gap-3">
            <label className="text-xs font-medium text-slate-600 dark:text-navy-200">
              Status
            </label>
            <button
              type="button"
              onClick={() => setIsActive((v) => !v)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                isActive ? "bg-primary" : "bg-slate-300 dark:bg-navy-500"
              }`}
            >
              <span
                className={`inline-block size-4 transform rounded-full bg-white shadow transition-transform ${
                  isActive ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
            <span className="text-xs text-slate-500 dark:text-navy-300">
              {isActive ? "Active" : "Inactive"}
            </span>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              onClick={onClose}
              variant="outline"
              className="rounded-lg"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              variant="default"
              className="rounded-lg"
            >
              {isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
