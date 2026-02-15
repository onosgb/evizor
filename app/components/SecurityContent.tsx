"use client";

import { useState, useEffect } from "react";
import ProfileSidebar from "./ProfileSidebar";
import { useAuthStore } from "../stores/authStore";
import { useSearchParams } from "next/navigation";
import { authService, adminService } from "../lib/services";

interface ActiveSession {
  date: string;
  device: string;
  status: string;
}

export default function SecurityContent() {
  const user = useAuthStore((state) => state.user);
  const searchParams = useSearchParams();
  const userId = searchParams.get("userId");
  const isReadOnly = !!userId;

  const theme = user?.role === "ADMIN" ? "admin" : "doctor";

  const [formData, setFormData] = useState({
    newPassword: "",
    confirmPassword: "",
    twoFactorAuth: false,
  });

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

  // Fetch security settings if userId is present
  useEffect(() => {
    if (userId) {
      const fetchSecuritySettings = async () => {
        try {
          const response = await adminService.getUserSecuritySettings(userId);
          if (response.status && response.data) {
             setFormData(prev => ({
               ...prev,
               ...response.data
             }));
          }
        } catch (error) {
          console.error("Failed to fetch security settings:", error);
        }
      };
      fetchSecuritySettings();
    }
  }, [userId]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSave = () => {
    // TODO: Implement save functionality
    console.log("Saving security settings:", formData);
  };

  const handleCancel = () => {
    // TODO: Reset form to original values
    setFormData({
      newPassword: "",
      confirmPassword: "",
      twoFactorAuth: false,
    });
    console.log("Canceling changes");
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
              {!isReadOnly && (
                <div className="flex justify-center space-x-2">
                  <button
                    onClick={handleCancel}
                    className="btn min-w-28 rounded-full border border-slate-300 font-medium text-slate-700 hover:bg-slate-150 focus:bg-slate-150 active:bg-slate-150/80 dark:border-navy-450 dark:text-navy-100 dark:hover:bg-navy-500 dark:focus:bg-navy-500 dark:active:bg-navy-500/90"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    className={`btn min-w-28 rounded-full font-medium text-white ${
                      theme === "admin"
                        ? "bg-success hover:bg-success-focus focus:bg-success-focus active:bg-success-focus/90 dark:bg-success dark:hover:bg-success-focus dark:focus:bg-success-focus dark:active:bg-success/90"
                        : "bg-primary hover:bg-primary-focus focus:bg-primary-focus active:bg-primary-focus/90 dark:bg-accent dark:hover:bg-accent-focus dark:focus:bg-accent-focus dark:active:bg-accent/90"
                    }`}
                  >
                    Save
                  </button>
                </div>
              )}
            </div>
            <div className="p-4 sm:p-5">
              <div className="p-5">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <label className="block">
                    <span>New Password</span>
                    <span className="relative mt-1.5 flex">
                      <input
                        name="newPassword"
                        value={formData.newPassword}
                        onChange={handleInputChange}
                        disabled={isReadOnly}
                        className={`form-input peer w-full rounded-full border border-slate-300 bg-transparent px-3 py-2 pl-9 placeholder:text-slate-400/70 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:hover:border-navy-400 dark:focus:border-accent ${isReadOnly ? "opacity-60 cursor-not-allowed" : ""}`}
                        placeholder={isReadOnly ? "********" : "Enter new password"}
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
                            d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
                          />
                        </svg>
                      </span>
                    </span>
                  </label>
                  <label className="block">
                    <span>Confirm Password</span>
                    <span className="relative mt-1.5 flex">
                      <input
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        disabled={isReadOnly}
                        className={`form-input peer w-full rounded-full border border-slate-300 bg-transparent px-3 py-2 pl-9 placeholder:text-slate-400/70 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:hover:border-navy-400 dark:focus:border-accent ${isReadOnly ? "opacity-60 cursor-not-allowed" : ""}`}
                        placeholder={isReadOnly ? "********" : "Confirm password"}
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
                            d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
                          />
                        </svg>
                      </span>
                    </span>
                  </label>
                </div>
                <div className="my-7 h-px bg-slate-200 dark:bg-navy-500"></div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-6">
                  <label className="inline-flex items-center space-x-2 justify-between col-span-full sm:col-span-6">
                    <span>Enable 2-Factor Authentication</span>
                    <input
                      name="twoFactorAuth"
                      checked={formData.twoFactorAuth}
                      onChange={handleInputChange}
                      disabled={isReadOnly}
                      className={`${getSwitchClasses()} ${isReadOnly ? "opacity-60 cursor-not-allowed" : ""}`}
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
