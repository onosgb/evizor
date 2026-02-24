"use client";

import { useState } from "react";
import ProfileSidebar from "./ProfileSidebar";
import { useAuthStore } from "@/app/stores/authStore";
import { getTheme } from "@/app/lib/roles";
import { useSearchParams } from "next/navigation";

interface ActiveSession {
  date: string;
  device: string;
  status: string;
}

export default function SecurityContent() {
  const user = useAuthStore((state) => state.user);
  const searchParams = useSearchParams();
  const userId = searchParams.get("userId");

  if (userId && user && userId !== user.id) {
    return (
      <div className="flex items-center justify-center h-full p-10">
        <div className="text-center">
          <h3 className="text-xl font-medium text-slate-700 dark:text-navy-100">
            Access Denied
          </h3>
          <p className="mt-2 text-slate-500 dark:text-navy-200">
            You do not have permission to view these security settings.
          </p>
        </div>
      </div>
    );
  }

  const theme = getTheme(user);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
  });

  const [twoFactorAuth, setTwoFactorAuth] = useState(
    user?.isTwoFAEnabled || false,
  );
  const [isToggling2FA, setIsToggling2FA] = useState(false);

  const [activeSessions] = useState<ActiveSession[]>([
    {
      date: "Friday 25 January, 2026",
      device: "Chrome (Lagos) – Active",
      status: "Active",
    },
    {
      date: "Friday 25 January, 2026",
      device: "Chrome (Lagos) – Active",
      status: "Active",
    },
    {
      date: "Friday 25 January, 2026",
      device: "Chrome (Lagos) – Active",
      status: "Active",
    },
  ]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    // Clear errors when user types
    if (error) setError(null);
    if (success) setSuccess(null);
  };

  const handleSave = async () => {
    setError(null);
    setSuccess(null);

    // Basic validation
    if (!formData.currentPassword) {
      setError("Current password is required");
      return;
    }
    if (!formData.newPassword) {
      setError("New password is required");
      return;
    }
    if (formData.newPassword.length < 8) {
      setError("New password must be at least 8 characters");
      return;
    }

    setIsLoading(true);

    try {
      // Call API to change password
      const { authService } = await import("@/app/lib/services/auth.service");

      await authService.changePassword(
        formData.currentPassword,
        formData.newPassword,
      );

      setSuccess("Password changed successfully");
      setFormData((prev) => ({
        ...prev,
        currentPassword: "",
        newPassword: "",
      }));
    } catch (err: any) {
      console.error("Change password error:", err);
      setError(
        err.message ||
          "Failed to change password. Please check your current password.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handle2FAToggle = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.checked;

    // 1. Optimistic update
    setTwoFactorAuth(newValue);
    setIsToggling2FA(true);

    // Clear previous messages
    setError(null);
    setSuccess(null);

    try {
      // 2. Call API
      const { authService } = await import("@/app/lib/services/auth.service");
      await authService.toggle2FA(newValue);

      // 3. Update store (if successful)
      const updatedUser = { ...user!, isTwoFAEnabled: newValue };
      useAuthStore
        .getState()
        .login(
          useAuthStore.getState().accessToken!,
          useAuthStore.getState().refreshToken!,
          updatedUser,
          useAuthStore.getState().profileCompleted,
        );

      setSuccess(
        newValue ? "2FA enabled successfully" : "2FA disabled successfully",
      );
    } catch (err: any) {
      // Revert optimistic update on error
      setTwoFactorAuth(!newValue);
      setError(err.message || "Failed to update 2FA settings");
    } finally {
      setIsToggling2FA(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      currentPassword: "",
      newPassword: "",
    });
    // Reset 2FA toggle to current user state
    setTwoFactorAuth(user?.isTwoFAEnabled || false);
    setError(null);
    setSuccess(null);
  };

  // Theme-based switch styling
  const getSwitchClasses = () => {
    return theme === "admin"
      ? "form-switch h-5 w-10 rounded-full bg-slate-300 before:rounded-full before:bg-slate-50 checked:bg-green-600 checked:before:bg-white dark:bg-navy-900 dark:before:bg-navy-300 dark:checked:bg-green-500 dark:checked:before:bg-white"
      : "form-switch h-5 w-10 rounded-full bg-slate-300 before:rounded-full before:bg-slate-50 checked:bg-primary checked:before:bg-white dark:bg-navy-900 dark:before:bg-navy-300 dark:checked:bg-accent dark:checked:before:bg-white";
  };

  return (
    <>
      <div className="flex items-center space-x-4 py-5 lg:py-6">
        <h2 className="text-xl font-medium text-slate-800 dark:text-navy-50 lg:text-2xl">
          Profile
        </h2>
      </div>
      <div className="grid grid-cols-12 gap-4 sm:gap-5 lg:gap-6">
        {/* Sidebar Navigation */}
        <ProfileSidebar />
        {/* Main Content */}
        <div className="col-span-12 lg:col-span-8">
          <div className="card">
            <div className="flex flex-col items-center space-y-4 border-b border-slate-200 p-4 dark:border-navy-500 sm:flex-row sm:justify-between sm:space-y-0 sm:px-5">
              <h2 className="text-lg font-medium tracking-wide text-slate-700 dark:text-navy-100">
                Security Settings
              </h2>

              <div className="flex justify-center space-x-2">
                <button
                  onClick={handleCancel}
                  disabled={isLoading}
                  className="btn min-w-28 rounded-full border border-slate-300 font-medium text-slate-700 hover:bg-slate-150 focus:bg-slate-150 active:bg-slate-150/80 dark:border-navy-450 dark:text-navy-100 dark:hover:bg-navy-500 dark:focus:bg-navy-500 dark:active:bg-navy-500/90 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={isLoading}
                  className={`btn min-w-28 rounded-full font-medium text-white ${
                    theme === "admin"
                      ? "bg-success hover:bg-success-focus focus:bg-success-focus active:bg-success-focus/90 dark:bg-success dark:hover:bg-success-focus dark:focus:bg-success-focus dark:active:bg-success/90"
                      : "bg-primary hover:bg-primary-focus focus:bg-primary-focus active:bg-primary-focus/90 dark:bg-accent dark:hover:bg-accent-focus dark:focus:bg-accent-focus dark:active:bg-accent/90"
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {isLoading ? "Saving..." : "Save"}
                </button>
              </div>
            </div>
            <div className="p-4 sm:p-5">
              <div className="p-5">
                {error && (
                  <div className="mb-4 rounded-lg bg-red-50 p-3 text-red-500 dark:bg-red-900/20">
                    {error}
                  </div>
                )}
                {success && (
                  <div className="mb-4 rounded-lg bg-green-50 p-3 text-green-500 dark:bg-green-900/20">
                    {success}
                  </div>
                )}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <label className="block sm:col-span-2">
                    <span>Current Password</span>
                    <span className="relative mt-1.5 flex">
                      <input
                        name="currentPassword"
                        value={formData.currentPassword}
                        onChange={handleInputChange}
                        className="form-input peer w-full rounded-full border border-slate-300 bg-transparent px-3 py-2 pl-9 placeholder:text-slate-400/70 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:hover:border-navy-400 dark:focus:border-accent"
                        placeholder="Enter current password"
                        type="password"
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
                            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                          />
                        </svg>
                      </span>
                    </span>
                  </label>
                  <label className="block sm:col-span-2">
                    <span>New Password</span>
                    <div className="relative mt-1.5 flex">
                      <input
                        name="newPassword"
                        value={formData.newPassword}
                        onChange={handleInputChange}
                        className="form-input peer w-full rounded-full border border-slate-300 bg-transparent px-3 py-2 pl-9 pr-9 placeholder:text-slate-400/70 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:hover:border-navy-400 dark:focus:border-accent"
                        placeholder="Enter new password"
                        type={showNewPassword ? "text" : "password"}
                      />
                      <span className="pointer-events-none absolute flex h-full w-10 items-center justify-center text-slate-400 peer-focus:text-primary dark:text-navy-300 dark:peer-focus:text-accent left-0">
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
                            d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
                          />
                        </svg>
                      </span>
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-0 flex h-full w-10 items-center justify-center text-slate-400 hover:text-primary focus:outline-none dark:text-navy-300 dark:hover:text-accent"
                      >
                        {showNewPassword ? (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="size-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                            />
                          </svg>
                        ) : (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="size-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                            />
                          </svg>
                        )}
                      </button>
                    </div>
                  </label>
                </div>
                <div className="my-7 h-px bg-slate-200 dark:bg-navy-500"></div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-6">
                  <label className="inline-flex items-center space-x-2 justify-between col-span-full sm:col-span-6">
                    <span>Enable 2-Factor Authentication</span>
                    <input
                      name="twoFactorAuth"
                      checked={twoFactorAuth}
                      onChange={handle2FAToggle}
                      disabled={isToggling2FA}
                      className={getSwitchClasses()}
                      type="checkbox"
                    />
                  </label>
                </div>
                <div className="my-7 h-px bg-slate-200 dark:bg-navy-500"></div>
                <div className="grid grid-cols-1 gap-4">
                  <h4 className="text-base font-medium text-slate-700 dark:text-navy-100">
                    Active Sessions
                  </h4>
                  <div className="min-w-full overflow-x-auto">
                    <table className="w-full text-left">
                      <tbody>
                        {activeSessions.map((session, index) => (
                          <tr
                            key={index}
                            className="border border-transparent border-b-slate-200 dark:border-b-navy-500"
                          >
                            <td className="whitespace-nowrap rounded-l-lg px-4 py-3 sm:px-5">
                              {session.date}
                            </td>
                            <td className="whitespace-nowrap px-4 py-3 sm:px-5">
                              {session.device}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
