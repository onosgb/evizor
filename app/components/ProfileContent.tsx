"use client";

import { useState, useEffect } from "react";
import { useAuthStore } from "../stores/authStore";
import { useTenantStore } from "../stores/tenantStore";
import { authService, adminService } from "../lib/services";
import ProfileSidebar from "./ProfileSidebar";
import Image from "next/image";

// Helper function to convert date string to yyyy-MM-dd format for date input
const formatDateForInput = (dateString: string | undefined): string => {
  if (!dateString) return "";
  
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "";
    
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    
    return `${year}-${month}-${day}`;
  } catch (error) {
    console.error("Error formatting date:", error);
    return "";
  }
};

import { useSearchParams } from "next/navigation";

export default function ProfileContent() {
  const user = useAuthStore((state) => state.user);
  const { setUser } = useAuthStore();
  const searchParams = useSearchParams();
  const userId = searchParams.get("userId");
  
  // Local state for the user being viewed/edited
  // Initialize with logged-in user if we are not viewing someone else, or if the data is already there
  const [viewedUser, setViewedUser] = useState(user);
  
  const isReadOnly = !!userId; // Readonly if viewing another user
  const theme = user?.role === "ADMIN" ? "admin" : "doctor";
  const getTenantById = useTenantStore((state) => state.getTenantById);
  
  // Get user's tenant/location
  const userTenant = user?.tenantId ? getTenantById(user.tenantId) : null;
  
  const [formData, setFormData] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
    phoneNumber: user?.phoneNumber || "",
    gender: user?.gender || "",
    location: userTenant?.province || "",
    address: user?.address || "",
    dob: formatDateForInput(user?.dob),    
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  
  // Avatar upload states
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [avatarError, setAvatarError] = useState<string | null>(null);

  // Fetch fresh profile data on mount
  useEffect(() => {
    const loadProfile = async () => {
      try {
        if (userId && userId !== user?.id) {
          // Admin viewing another user's profile
          const response = await adminService.getUserProfile(userId);
          if (response.status && response.data) {
             setViewedUser(response.data);
          }
        } else {
          // User viewing their own profile - defaulting to what's in store first
          setViewedUser(user);
          
          // Optionally refresh from API to get latest
          const response = await authService.getMyProfile();
          if (response.status && response.data) {
            setUser(response.data); // Update global store since it's "me"
            setViewedUser(response.data);
          }
        }
      } catch (error) {
        console.error("Failed to fetch profile:", error);
      }
    };
    
    loadProfile();
  }, [setUser, userId, user]);

  // Update form data when viewedUser changes
  useEffect(() => {
    if (viewedUser) {
      setFormData({
        firstName: viewedUser.firstName || "",
        lastName: viewedUser.lastName || "",
        email: viewedUser.email || "",
        phoneNumber: viewedUser.phoneNumber || "",
        gender: viewedUser.gender || "",
        location: userTenant?.province || "",
        address: viewedUser.address || "",
        dob: formatDateForInput(viewedUser.dob),
      });
    }
  }, [viewedUser, userTenant]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    // Exclude email and location from submission (readonly fields)
    const { email, location, ...dataToSubmit } = formData;
    
    setIsSubmitting(true);
    setError(null);
    setSuccessMessage(null);
    
    try {
      const response = await authService.updateProfile(dataToSubmit);
      
      // Update the auth store with the updated user data
      if (response.data) {
        setUser(response.data);
      }
      
      setSuccessMessage("Profile updated successfully!");
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to update profile";
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    // TODO: Reset form to original values
    console.log("Canceling changes");
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = ["image/jpeg", "image/jpg", "image/png"];
    if (!validTypes.includes(file.type)) {
      setAvatarError("Please select a valid image file (JPG, JPEG, or PNG)");
      return;
    }

    // Validate file size (5MB max)
    const maxSize = 5 * 1024 * 1024; // 5MB in bytes
    if (file.size > maxSize) {
      setAvatarError("File size must be less than 5MB");
      return;
    }

    setAvatarError(null);
    
    // Auto-upload after selection
    handleAvatarUpload(file);
  };

  const handleAvatarUpload = async (file: File) => {
    setIsUploadingAvatar(true);
    setAvatarError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await authService.uploadProfilePicture(formData);
      
      // Response returns { url: string }, update user's profilePictureUrl
      if (response.data && response.data.url && viewedUser) {
        const updatedUser = {
          ...viewedUser,
          profilePictureUrl: response.data.url
        };
        setViewedUser(updatedUser);
        
        // If updating my own profile, sync with global store
        if (!isReadOnly && user) {
            setUser({
                ...user,
                profilePictureUrl: response.data.url
            });
        }
      }
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to upload avatar";
      setAvatarError(errorMessage);
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  return (
    <>
      <div className="flex items-center space-x-4 py-5 lg:py-6">
        <h2 className="text-xl font-medium text-slate-800 dark:text-navy-50 lg:text-2xl">
          Profile
        </h2>
      </div>
      <div className="grid grid-cols-12 gap-4 sm:gap-5 lg:gap-6">
        <ProfileSidebar theme={theme} />
        {/* Main Content */}
      <div className="col-span-12 lg:col-span-8">
        <div className="card">
          <div className="flex flex-col items-center space-y-4 border-b border-slate-200 p-4 dark:border-navy-500 sm:flex-row sm:justify-between sm:space-y-0 sm:px-5">
            <h2 className="text-lg font-medium tracking-wide text-slate-700 dark:text-navy-100">
              Personal Information
            </h2>
              {!isReadOnly && (
                <div className="flex justify-center space-x-2 pt-4">
                  <button
                    onClick={handleCancel}
                    className="btn min-w-28 rounded-full border border-slate-300 font-medium text-slate-700 hover:bg-slate-150 focus:bg-slate-150 active:bg-slate-150/80 dark:border-navy-450 dark:text-navy-100 dark:hover:bg-navy-500 dark:focus:bg-navy-500 dark:active:bg-navy-500/90"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={isSubmitting}
                    className={`btn min-w-28 rounded-full font-medium text-white disabled:opacity-50 disabled:cursor-not-allowed ${
                      user?.role === "ADMIN"
                        ? "bg-success hover:bg-success-focus focus:bg-success-focus active:bg-success-focus/90 dark:bg-success dark:hover:bg-success-focus dark:focus:bg-success-focus dark:active:bg-success/90"
                        : "bg-primary hover:bg-primary-focus focus:bg-primary-focus active:bg-primary-focus/90 dark:bg-accent dark:hover:bg-accent-focus dark:focus:bg-accent-focus dark:active:bg-accent/90"
                    }`}
                  >
                    {isSubmitting ? "Saving..." : "Save"}
                  </button>
                </div>
              )}
          </div>
          <div className="p-4 sm:p-5">
            {/* Avatar Section */}
            <div className="flex flex-col">
              <div className="avatar mt-1.5 size-20 relative">
                {isUploadingAvatar ? (
                  <div className="flex items-center justify-center size-20 rounded-lg bg-slate-100 dark:bg-navy-600">
                    <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
                  </div>
                ) : (
                  <Image
                    className="mask is-squircle"
                    src={viewedUser?.profilePictureUrl || "/images/200x200.png"}
                    alt="avatar"
                    width={80}
                    height={80}
                  />
                )}
                {/* Only show edit button if not readonly */}
                {!isReadOnly && (
                  <div className="absolute bottom-0 right-0 flex items-center justify-center rounded-full bg-white dark:bg-navy-700">
                    <label className="btn size-6 rounded-full border border-slate-200 p-0 hover:bg-slate-300/20 focus:bg-slate-300/20 active:bg-slate-300/25 dark:border-navy-500 dark:hover:bg-navy-300/20 dark:focus:bg-navy-300/20 dark:active:bg-navy-300/25 cursor-pointer">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="size-3.5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                      </svg>
                      <input
                        type="file"
                        className="hidden"
                        accept="image/jpeg,image/jpg,image/png"
                        onChange={handleAvatarChange}
                        disabled={isUploadingAvatar}
                      />
                    </label>
                  </div>
                )}
              </div>
              {avatarError && (
                <p className="mt-2 text-xs text-error">{avatarError}</p>
              )}
            </div>

            <div className="my-7 h-px bg-slate-200 dark:bg-navy-500"></div>

            {/* Error and Success Messages */}
            {error && (
              <div className="mb-4 rounded-lg bg-error/10 px-4 py-3 text-error dark:bg-error/20">
                <p className="text-sm font-medium">{error}</p>
              </div>
            )}
            {successMessage && (
              <div className="mb-4 rounded-lg bg-success/10 px-4 py-3 text-success dark:bg-success/20">
                <p className="text-sm font-medium">{successMessage}</p>
              </div>
            )}

            {/* Form Fields */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <label className="block">
                <span>First Name</span>
                <span className="relative mt-1.5 flex">
                  <input
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    readOnly={isReadOnly}
                    className={`form-input peer w-full rounded-full border border-slate-300 bg-transparent px-3 py-2 pl-9 placeholder:text-slate-400/70 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:hover:border-navy-400 dark:focus:border-accent ${isReadOnly ? 'bg-slate-50 dark:bg-navy-900 cursor-not-allowed' : ''}`}
                    placeholder="Enter first name"
                    type="text"
                  />
                  <span className="pointer-events-none absolute flex h-full w-10 items-center justify-center text-slate-400 peer-focus:text-primary dark:text-navy-300 dark:peer-focus:text-accent">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="size-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                      />
                    </svg>
                  </span>
                </span>
              </label>
              <label className="block">
                <span>Last Name</span>
                <span className="relative mt-1.5 flex">
                  <input
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    readOnly={isReadOnly}
                    className={`form-input peer w-full rounded-full border border-slate-300 bg-transparent px-3 py-2 pl-9 placeholder:text-slate-400/70 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:hover:border-navy-400 dark:focus:border-accent ${isReadOnly ? 'bg-slate-50 dark:bg-navy-900 cursor-not-allowed' : ''}`}
                    placeholder="Enter last name"
                    type="text"
                  />
                  <span className="pointer-events-none absolute flex h-full w-10 items-center justify-center text-slate-400 peer-focus:text-primary dark:text-navy-300 dark:peer-focus:text-accent">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="size-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                      />
                    </svg>
                  </span>
                </span>
              </label>
              <label className="block">
                <span>Email Address</span>
                <span className="relative mt-1.5 flex">
                  <input
                    name="email"
                    value={formData.email}
                    disabled={true} // Email is always disabled
                    readOnly={true}
                    className="form-input peer w-full rounded-full border border-slate-300 bg-slate-100 px-3 py-2 pl-9 text-slate-600 dark:border-navy-450 dark:bg-navy-800 dark:text-navy-200 cursor-not-allowed"
                    placeholder="Enter email address"
                    type="email"
                  />
                  <span className="pointer-events-none absolute flex h-full w-10 items-center justify-center text-slate-400 dark:text-navy-300">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="size-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
                      />
                    </svg>
                  </span>
                </span>
              </label>
              <label className="block">
                <span>Phone Number</span>
                <span className="relative mt-1.5 flex">
                  <input
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    readOnly={isReadOnly}
                    className={`form-input peer w-full rounded-full border border-slate-300 bg-transparent px-3 py-2 pl-9 placeholder:text-slate-400/70 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:hover:border-navy-400 dark:focus:border-accent ${isReadOnly ? 'bg-slate-50 dark:bg-navy-900 cursor-not-allowed' : ''}`}
                    placeholder="Enter phone number"
                    type="tel"
                  />
                  <span className="pointer-events-none absolute flex h-full w-10 items-center justify-center text-slate-400 peer-focus:text-primary dark:text-navy-300 dark:peer-focus:text-accent">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="size-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z"
                      />
                    </svg>
                  </span>
                </span>
              </label>
              <label className="block">
                <span>Gender</span>
                <span className="relative mt-1.5 flex">
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    disabled={isReadOnly}
                    className={`form-select w-full rounded-full border border-slate-300 bg-white px-3 py-2 pl-9 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:bg-navy-700 dark:hover:border-navy-400 dark:focus:border-accent ${isReadOnly ? 'bg-slate-50 dark:bg-navy-900 cursor-not-allowed' : ''}`}
                  >
                    <option value="">Select gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                  <span className="pointer-events-none absolute flex h-full w-10 items-center justify-center text-slate-400 dark:text-navy-300">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="size-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                      />
                    </svg>
                  </span>
                </span>
              </label>
              <label className="block">
                <span>Location (Province)</span>
                <span className="relative mt-1.5 flex">
                  <input
                    name="location"
                    value={formData.location}
                    disabled={true} // Location is always disabled for now as per requirement
                    readOnly={true}
                    className="form-input peer w-full rounded-full border border-slate-300 bg-slate-100 px-3 py-2 pl-9 text-slate-600 dark:border-navy-450 dark:bg-navy-800 dark:text-navy-200 cursor-not-allowed"
                    placeholder="No location assigned"
                    type="text"
                  />
                  <span className="pointer-events-none absolute flex h-full w-10 items-center justify-center text-slate-400 dark:text-navy-300">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="size-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
                      />
                    </svg>
                  </span>
                </span>
              </label>
              <label className="block">
                <span>Date of Birth</span>
                <span className="relative mt-1.5 flex">
                  <input
                    name="dob"
                    value={formData.dob}
                    onChange={handleInputChange}
                    readOnly={isReadOnly}
                    max={new Date(new Date().setFullYear(new Date().getFullYear() - 17)).toISOString().split('T')[0]}
                    className={`form-input peer w-full rounded-full border border-slate-300 bg-transparent px-3 py-2 pl-9 placeholder:text-slate-400/70 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:hover:border-navy-400 dark:focus:border-accent ${isReadOnly ? 'bg-slate-50 dark:bg-navy-900 cursor-not-allowed' : ''}`}
                    placeholder="Enter date of birth"
                    type="date"
                  />
                  <span className="pointer-events-none absolute flex h-full w-10 items-center justify-center text-slate-400 peer-focus:text-primary dark:text-navy-300 dark:peer-focus:text-accent">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="size-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                      />
                    </svg>
                  </span>
                </span>
              </label>
              <label className="block w-full">
                <span>Address</span>
                <span className="relative mt-1.5 flex w-full">
                  <input
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    readOnly={isReadOnly}
                    className={`form-input peer w-full rounded-full border border-slate-300 bg-transparent px-3 py-2 pl-9 placeholder:text-slate-400/70 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:hover:border-navy-400 dark:focus:border-accent ${isReadOnly ? 'bg-slate-50 dark:bg-navy-900 cursor-not-allowed' : ''}`}
                    placeholder="Enter address"
                    type="text"
                  />
                  <span className="pointer-events-none absolute flex h-full w-10 items-center justify-center text-slate-400 peer-focus:text-primary dark:text-navy-300 dark:peer-focus:text-accent">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="size-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                      />
                    </svg>
                  </span>
                </span>
              </label>
            </div>
            <div className="my-7 h-px bg-slate-200 dark:bg-navy-500"></div>
          </div>
        </div>
      </div>
      </div>
    </>
  );
}
