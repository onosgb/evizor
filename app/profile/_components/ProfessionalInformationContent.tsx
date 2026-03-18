"use client";

import { useState, useEffect } from "react";
import { useAuthStore } from "@/app/stores/authStore";
import { getTheme, isAdmin } from "@/app/lib/roles";
import { useSpecialtyStore } from "@/app/stores/specialtyStore";
import { useProfessionalProfileStore } from "@/app/stores/professionalProfileStore";
import { useProfileStore } from "@/app/stores/profileStore";
import ProfileSidebar from "./ProfileSidebar";
import { ProfessionalProfile } from "@/app/models";

import { useSearchParams } from "next/navigation";
import ConfirmationModal from "@/app/components/ConfirmationModal";
import { FormInput } from "@/app/components/ui/FormInput";
import { FormSelect } from "@/app/components/ui/FormSelect";
import { Button } from "@/app/components/ui/button";
import { cn } from "@/lib/utils";

export default function ProfessionalInformationContent() {
  const user = useAuthStore((state) => state.user);
  const searchParams = useSearchParams();
  const userId = searchParams.get("userId");
  
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
    approveProfile,
  } = useProfessionalProfileStore();
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const viewedUser = useProfileStore((state) => state.viewedUser);
  const theme = getTheme(user);
  
  const displayUser = viewedUser || user;
  const isProfileCompleted = !!displayUser?.profileCompleted;
  
  const isReadOnly = (!!userId && String(userId) !== String(user?.id)) || isProfileCompleted; // Readonly if viewing another user OR if profile is completed
  const showApproveButton = !!userId && (isAdmin(user)) && displayUser?.profileCompleted && !displayUser?.profileVerified;

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
    if (userId) {
      fetchProfile(userId);
    } else {
      fetchProfile();
    }
  }, [fetchSpecialties, fetchProfile, userId]);

  // Sync form data during render pass when profile loads from the store
  const [prevProfile, setPrevProfile] = useState(profile);
  if (profile !== prevProfile) {
    setPrevProfile(profile);
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
  }

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
   
    if (showApproveButton && userId) {
      // Admin approving profile
      await approveProfile(userId);
    } else {
      // User updating their own profile
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
                {(!isReadOnly || showApproveButton) && (
                  <Button
                    onClick={() => {
                      if(showApproveButton){
                        setShowConfirmationModal(true)
                      }else{
                        handleSave()
                      }
                    }}
                    disabled={isSaving}
                    variant={theme === "admin" ? "success" : "default"}
                    className="min-w-28 rounded-full font-medium transition duration-300"
                  >
                    {showApproveButton ? "Approve" : "Save"}
                  </Button>
                )}
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
                  {showApproveButton ? "Professional information approved successfully!" : "Professional information saved successfully!"}
                </div>
              )}
              {loadingProfile ? (
                <div className="animate-pulse grid grid-cols-1 gap-5 p-5 my-5 sm:grid-cols-2">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="space-y-2">
                      <div className="h-3 w-28 rounded bg-slate-200 dark:bg-navy-500" />
                      <div className="h-9 w-full rounded-full bg-slate-200 dark:bg-navy-500" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4 p-5 my-5 sm:grid-cols-2">
                  <FormSelect
                    label="Specialty"
                    name="specialtyId"
                    value={String(formData.specialtyId || "")}
                    onChange={handleInputChange}
                    disabled={isLoadingSpecialties || isReadOnly}
                    className={cn(
                      "rounded-full",
                      isReadOnly && "bg-slate-50 dark:bg-navy-900 cursor-not-allowed",
                    )}
                  >
                    <option value="">
                      {isLoadingSpecialties ? "Loading specialties..." : "Select Specialty"}
                    </option>
                    {specialties
                      .filter((s) => s.isActive)
                      .map((specialty) => (
                        <option key={specialty.id} value={specialty.id}>
                          {specialty.name}
                        </option>
                      ))}
                  </FormSelect>
                  <FormInput
                    label="Sub-Specialty"
                    name="subSpecialty"
                    value={formData.subSpecialty}
                    onChange={handleInputChange}
                    readOnly={isReadOnly}
                    className={cn(
                      "rounded-full",
                      isReadOnly && "bg-slate-50 dark:bg-navy-900 cursor-not-allowed",
                    )}
                    placeholder="Enter Sub-Specialty"
                    type="text"
                  />
                  <FormInput
                    label="Years of Experience"
                    name="yearsOfExperience"
                    value={formData.yearsOfExperience}
                    onChange={handleInputChange}
                    readOnly={isReadOnly}
                    className={cn(
                      "rounded-full",
                      isReadOnly && "bg-slate-50 dark:bg-navy-900 cursor-not-allowed",
                    )}
                    placeholder="Enter Years of Experience"
                    type="number"
                  />
                  <FormInput
                    label="License Number"
                    name="licenseNumber"
                    value={formData.licenseNumber}
                    onChange={handleInputChange}
                    readOnly={isReadOnly}
                    className={cn(
                      "rounded-full",
                      isReadOnly && "bg-slate-50 dark:bg-navy-900 cursor-not-allowed",
                    )}
                    placeholder="Enter License Number"
                    type="text"
                  />
                  <FormInput
                    label="Issuing Authority"
                    name="issuingAuthority"
                    value={formData.issuingAuthority}
                    onChange={handleInputChange}
                    readOnly={isReadOnly}
                    className={cn(
                      "rounded-full",
                      isReadOnly && "bg-slate-50 dark:bg-navy-900 cursor-not-allowed",
                    )}
                    placeholder="Enter Issuing Authority"
                    type="text"
                  />
                  <FormInput
                    label="License Expiry Date"
                    name="licenseExpiryDate"
                    value={formData.licenseExpiryDate}
                    onChange={handleInputChange}
                    readOnly={isReadOnly}
                    className={cn(
                      "rounded-full",
                      isReadOnly && "bg-slate-50 dark:bg-navy-900 cursor-not-allowed",
                    )}
                    placeholder="Enter License Expiry Date"
                    type="date"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <ConfirmationModal
        isOpen={showConfirmationModal}
        isLoading={isSaving}
        onClose={() => setShowConfirmationModal(false)}
        onConfirm={async () => {
          await handleSave();
          setShowConfirmationModal(false);
        }}
        title="Approve Professional Information"
        message="Are you sure you want to approve this professional information?"
        variant="success"
      />
    </>
  );
}


