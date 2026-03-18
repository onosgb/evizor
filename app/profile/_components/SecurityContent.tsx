"use client";

import { useState } from "react";
import ProfileSidebar from "./ProfileSidebar";
import { useAuthStore } from "@/app/stores/authStore";
import { getTheme } from "@/app/lib/roles";
import { useSearchParams } from "next/navigation";
import { FormInput } from "@/app/components/ui/FormInput";
import { Button } from "@/app/components/ui/button";
import { Lock, Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";

interface ActiveSession {
  date: string;
  device: string;
  status: string;
}

export default function SecurityContent() {
  const user = useAuthStore((state) => state.user);
  const searchParams = useSearchParams();
  const userId = searchParams.get("userId");

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
                <Button
                  onClick={handleCancel}
                  disabled={isLoading}
                  variant="outline"
                  className="min-w-28 rounded-full"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSave}
                  disabled={isLoading}
                  variant={theme === "admin" ? "success" : "default"}
                  className="min-w-28 rounded-full"
                >
                  {isLoading ? "Saving..." : "Save"}
                </Button>
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
                  <FormInput
                    label="Current Password"
                    name="currentPassword"
                    value={formData.currentPassword}
                    onChange={handleInputChange}
                    className="rounded-full"
                    placeholder="Enter current password"
                    type="password"
                    wrapperClassName="sm:col-span-2"
                    leftIcon={<Lock className="size-4" />}
                  />
                  <FormInput
                    label="New Password"
                    name="newPassword"
                    value={formData.newPassword}
                    onChange={handleInputChange}
                    className="rounded-full sm:col-span-2"
                    leftIcon={<Lock className="size-4" />}
                    rightIcon={
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="flex size-full items-center justify-center text-slate-400 hover:text-primary focus:outline-none dark:text-navy-300 dark:hover:text-accent"
                      >
                        {showNewPassword ? (
                          <EyeOff className="size-4" />
                        ) : (
                          <Eye className="size-4" />
                        )}
                      </button>
                    }
                  />
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
