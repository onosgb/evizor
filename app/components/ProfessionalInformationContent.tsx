"use client";

import { useState, useEffect } from "react";
import { useAuthStore } from "../stores/authStore";
import { useSpecialtyStore } from "../stores/specialtyStore";
import { useProfessionalProfileStore } from "../stores/professionalProfileStore";
import ProfileSidebar from "./ProfileSidebar";
import { ProfessionalProfile } from "../models";

export default function ProfessionalInformationContent() {
  const user = useAuthStore((state) => state.user);
  const { specialties, fetchSpecialties, isLoading: isLoadingSpecialties } = useSpecialtyStore();
  const {
    profile,
    isLoading: loadingProfile,
    isSaving,
    saveError,
    saveSuccess,
    fetchProfile,
    updateProfile,
    clearMessages,
  } = useProfessionalProfileStore();
  const theme = user?.role === "ADMIN" ? "admin" : "doctor";

  const [formData, setFormData] = useState({
    specialtyId: "",
    subSpecialty: "",
    yearsOfExperience: "",
    licenseNumber: "",
    issuingAuthority: "",
    licenseExpiryDate: "",
  });

  const [originalData, setOriginalData] = useState(formData);

  useEffect(() => {
    fetchSpecialties();
    fetchProfile();
  }, [fetchSpecialties, fetchProfile]);

  // Sync form data when profile loads from the store
  useEffect(() => {
    if (profile) {
      const profileData = {
        specialtyId: profile.specialtyId || "",
        subSpecialty: profile.subSpecialty || "",
        yearsOfExperience: profile.yearsOfExperience || "",
        licenseNumber: profile.licenseNumber || "",
        issuingAuthority: profile.issuingAuthority || "",
        licenseExpiryDate: profile.licenseExpiryDate
          ? new Date(profile.licenseExpiryDate).toISOString().split("T")[0]
          : "",
      };
      setFormData(profileData);
      setOriginalData(profileData);
    }
  }, [profile]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    clearMessages();
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    const payload: ProfessionalProfile = {
      specialtyId: formData.specialtyId,
      subSpecialty: formData.subSpecialty || undefined,
      yearsOfExperience: formData.yearsOfExperience,
      licenseNumber: formData.licenseNumber,
      issuingAuthority: formData.issuingAuthority,
      licenseExpiryDate: formData.licenseExpiryDate,
    };
    const success = await updateProfile(payload);
    if (success) {
      setOriginalData(formData);
    }
  };

  const handleCancel = () => {
    setFormData(originalData);
    clearMessages();
  };

  return (
    <>
      <div className="flex items-center space-x-4 py-5 lg:py-6">
        <h2 className="text-xl font-medium text-slate-800 dark:text-navy-50 lg:text-2xl">
          Profile
        </h2>
      </div>
      <div className="grid grid-cols-12 gap-4 sm:gap-5 lg:gap-6">
        <ProfileSidebar />

        {/* Main Content */}
        <div className="col-span-12 lg:col-span-8">
          <div className="card">
            <div className="flex flex-col items-center space-y-4 border-b border-slate-200 p-4 dark:border-navy-500 sm:flex-row sm:justify-between sm:space-y-0 sm:px-5">
              <h2 className="text-lg font-medium tracking-wide text-slate-700 dark:text-navy-100">
                Professional Information
              </h2>
              <div className="flex justify-center space-x-2">
                <button
                  onClick={handleCancel}
                  className="btn min-w-28 rounded-full border border-slate-300 font-medium text-slate-700 hover:bg-slate-150 focus:bg-slate-150 active:bg-slate-150/80 dark:border-navy-450 dark:text-navy-100 dark:hover:bg-navy-500 dark:focus:bg-navy-500 dark:active:bg-navy-500/90"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className={`btn min-w-28 rounded-full font-medium text-white disabled:opacity-50 disabled:cursor-not-allowed ${
                    theme === "admin"
                      ? "bg-success hover:bg-success-focus focus:bg-success-focus active:bg-success-focus/90 dark:bg-success dark:hover:bg-success-focus dark:focus:bg-success-focus dark:active:bg-success/90"
                      : "bg-primary hover:bg-primary-focus focus:bg-primary-focus active:bg-primary-focus/90 dark:bg-accent dark:hover:bg-accent-focus dark:focus:bg-accent-focus dark:active:bg-accent/90"
                  }`}
                >
                  {isSaving ? "Saving..." : "Save"}
                </button>
              </div>
            </div>
            <div className="p-4 sm:p-5">
              {saveError && (
                <div
                  className="mb-4 bg-error/10 text-error px-4 py-3 rounded-lg text-center"
                  role="alert"
                >
                  {saveError}
                </div>
              )}
              {saveSuccess && (
                <div
                  className="mb-4 bg-success/10 text-success px-4 py-3 rounded-lg text-center"
                  role="alert"
                >
                  Professional information saved successfully!
                </div>
              )}
              {loadingProfile ? (
                <div className="flex items-center justify-center py-10">
                  <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4 p-5 my-5 sm:grid-cols-2">
                  <label className="block">
                    <span>Specialty </span>
                    <span className="relative mt-1.5 flex">
                      <select
                        name="specialtyId"
                        value={formData.specialtyId}
                        onChange={handleInputChange}
                        disabled={isLoadingSpecialties}
                        className="form-select peer w-full rounded-full border border-slate-300 bg-transparent px-3 py-2 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:hover:border-navy-400 dark:focus:border-accent"
                      >
                        <option value="">
                          {isLoadingSpecialties
                            ? "Loading specialties..."
                            : "Select Specialty"}
                        </option>
                        {specialties
                          .filter((s) => s.isActive)
                          .map((specialty) => (
                          <option key={specialty.id} value={specialty.id}>
                            {specialty.name}
                          </option>
                        ))}
                      </select>
                    </span>
                  </label>
                  <label className="block">
                    <span>Sub-Specialty </span>
                    <span className="relative mt-1.5 flex">
                      <input
                        name="subSpecialty"
                        value={formData.subSpecialty}
                        onChange={handleInputChange}
                        className="form-input peer w-full rounded-full border border-slate-300 bg-transparent px-3 py-2 placeholder:text-slate-400/70 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:hover:border-navy-400 dark:focus:border-accent"
                        placeholder="Enter Sub-Specialty"
                        type="text"
                      />
                    </span>
                  </label>
                  <label className="block">
                    <span>Years of Experience</span>
                    <span className="relative mt-1.5 flex">
                      <input
                        name="yearsOfExperience"
                        value={formData.yearsOfExperience}
                        onChange={handleInputChange}
                        className="form-input peer w-full rounded-full border border-slate-300 bg-transparent px-3 py-2 placeholder:text-slate-400/70 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:hover:border-navy-400 dark:focus:border-accent"
                        placeholder="Enter Years of Experience"
                        type="text"
                      />
                    </span>
                  </label>
                  <label className="block">
                    <span>License Number </span>
                    <span className="relative mt-1.5 flex">
                      <input
                        name="licenseNumber"
                        value={formData.licenseNumber}
                        onChange={handleInputChange}
                        className="form-input peer w-full rounded-full border border-slate-300 bg-transparent px-3 py-2 placeholder:text-slate-400/70 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:hover:border-navy-400 dark:focus:border-accent"
                        placeholder="Enter License Number "
                        type="text"
                      />
                    </span>
                  </label>
                  <label className="block">
                    <span>Issuing Authority</span>
                    <span className="relative mt-1.5 flex">
                      <input
                        name="issuingAuthority"
                        value={formData.issuingAuthority}
                        onChange={handleInputChange}
                        className="form-input peer w-full rounded-full border border-slate-300 bg-transparent px-3 py-2 placeholder:text-slate-400/70 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:hover:border-navy-400 dark:focus:border-accent"
                        placeholder="Enter Issuing Authority"
                        type="text"
                      />
                    </span>
                  </label>
                  <label className="block">
                    <span>License Expiry Date</span>
                    <span className="relative mt-1.5 flex">
                      <input
                        name="licenseExpiryDate"
                        value={formData.licenseExpiryDate}
                        onChange={handleInputChange}
                        className="form-input peer w-full rounded-full border border-slate-300 bg-transparent px-3 py-2 placeholder:text-slate-400/70 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:hover:border-navy-400 dark:focus:border-accent"
                        placeholder="Enter License Expiry Date"
                        type="date"
                      />
                    </span>
                  </label>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
