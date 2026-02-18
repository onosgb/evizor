"use client";

import { useState, useEffect } from "react";
import ProfileSidebar from "./ProfileSidebar";
import { useAuthStore } from "@/app/stores/authStore";
import { getTheme, isAdmin, isDoctor } from "@/app/lib/roles";
import { useSearchParams } from "next/navigation";
import { authService, adminService } from "@/app/lib/services";

interface ConsultationPreferences {
  acceptOnDemandVisits: boolean;
  acceptScheduledVisits: boolean;
  followUpOnly: boolean;
  preferredTypeGeneral: boolean;
  preferredTypeSpecialist: boolean;
}

export default function ConsultationContent() {
  const user = useAuthStore((state) => state.user);
  const searchParams = useSearchParams();
  const userId = searchParams.get("userId");
  const isReadOnly = !!userId;
  
  const theme = getTheme(user);
  
  // Theme-based switch styling
  const getSwitchClasses = () => {
    return theme === "admin"
      ? "form-switch h-5 w-10 rounded-full bg-slate-300 before:rounded-full before:bg-slate-50 checked:bg-green-600 checked:before:bg-white dark:bg-navy-900 dark:before:bg-navy-300 dark:checked:bg-green-500 dark:checked:before:bg-white"
      : "form-switch h-5 w-10 rounded-full bg-slate-300 before:rounded-full before:bg-slate-50 checked:bg-primary checked:before:bg-white dark:bg-navy-900 dark:before:bg-navy-300 dark:checked:bg-accent dark:checked:before:bg-white";
  };
  const [isLoadingPreferences, setIsLoadingPreferences] = useState(!!(userId));
  const [preferences, setPreferences] = useState<ConsultationPreferences>({
    acceptOnDemandVisits: true,
    acceptScheduledVisits: true,
    followUpOnly: false,
    preferredTypeGeneral: true,
    preferredTypeSpecialist: false,
  });

  useEffect(() => {
    if (userId) {
      const fetchPreferences = async () => {
        setIsLoadingPreferences(true);
        try {
          const response = await adminService.getUserConsultationPreferences(userId);
          if (response.status && response.data) {
            setPreferences(response.data);
          }
        } catch (error) {
          console.error("Failed to fetch consultation preferences:", error);
        } finally {
          setIsLoadingPreferences(false);
        }
      };
      fetchPreferences();
    }
  }, [userId]);

  const handleToggle = (key: keyof ConsultationPreferences) => {
    setPreferences((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleSave = () => {
    // TODO: Implement save functionality
    console.log("Saving consultation preferences:", preferences);
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
                Consultation Preferences
              </h2>
            </div>
            <div className="p-4 sm:p-5">
              <div className="is-scrollbar-hidden min-w-full overflow-x-auto p-5">
                {isLoadingPreferences ? (
                  <div className="animate-pulse space-y-2">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <div key={i} className="flex items-center justify-between border-b border-slate-200 px-4 py-3 dark:border-navy-500">
                        <div className={`h-4 rounded bg-slate-200 dark:bg-navy-500 ${i % 2 === 0 ? "w-52" : "w-40"}`} />
                        <div className="h-5 w-10 rounded-full bg-slate-200 dark:bg-navy-500" />
                      </div>
                    ))}
                  </div>
                ) : (
                <table className="w-full text-left">
                  <tbody>
                    <tr className="border border-transparent border-b-slate-200 dark:border-b-navy-500">
                      <td className="whitespace-nowrap px-4 py-3 sm:px-5">
                        Accept On-Demand Visits
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 sm:px-5">
                        <label className="inline-flex items-center">
                          <input
                            disabled={isReadOnly}
                            checked={preferences.acceptOnDemandVisits}
                            onChange={() => !isReadOnly && handleToggle("acceptOnDemandVisits")}
                            className={`${getSwitchClasses()} ${isReadOnly ? "opacity-60 cursor-not-allowed" : ""}`}
                            type="checkbox"
                          />
                        </label>
                      </td>
                    </tr>
                    <tr className="border border-transparent border-b-slate-200 dark:border-b-navy-500">
                      <td className="whitespace-nowrap px-4 py-3 sm:px-5">
                        Accept Scheduled Visits
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 sm:px-5">
                        <label className="inline-flex items-center">
                          <input
                            disabled={isReadOnly}
                            checked={preferences.acceptScheduledVisits}
                            onChange={() => !isReadOnly && handleToggle("acceptScheduledVisits")}
                            className={`${getSwitchClasses()} ${isReadOnly ? "opacity-60 cursor-not-allowed" : ""}`}
                            type="checkbox"
                          />
                        </label>
                      </td>
                    </tr>
                    <tr className="border border-transparent border-b-slate-200 dark:border-b-navy-500">
                      <td className="whitespace-nowrap px-4 py-3 sm:px-5">
                        Follow-up Only
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 sm:px-5">
                        <label className="inline-flex items-center">
                          <input
                            disabled={isReadOnly}
                            checked={preferences.followUpOnly}
                            onChange={() => !isReadOnly && handleToggle("followUpOnly")}
                            className={`${getSwitchClasses()} ${isReadOnly ? "opacity-60 cursor-not-allowed" : ""}`}
                            type="checkbox"
                          />
                        </label>
                      </td>
                    </tr>
                    <tr className="border border-transparent border-b-slate-200 dark:border-b-navy-500">
                      <td className="whitespace-nowrap px-4 py-3 sm:px-5">
                        Preferred Consultation Type: General
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 sm:px-5">
                        <label className="inline-flex items-center">
                          <input
                            disabled={isReadOnly}
                            checked={preferences.preferredTypeGeneral}
                            onChange={() => !isReadOnly && handleToggle("preferredTypeGeneral")}
                            className={`${getSwitchClasses()} ${isReadOnly ? "opacity-60 cursor-not-allowed" : ""}`}
                            type="checkbox"
                          />
                        </label>
                      </td>
                    </tr>
                    <tr className="border border-transparent border-b-slate-200 dark:border-b-navy-500">
                      <td className="whitespace-nowrap px-4 py-3 sm:px-5">
                        Preferred Consultation Type: Specialist
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 sm:px-5">
                        <label className="inline-flex items-center">
                          <input
                            disabled={isReadOnly}
                            checked={preferences.preferredTypeSpecialist}
                            onChange={() => !isReadOnly && handleToggle("preferredTypeSpecialist")}
                            className={`${getSwitchClasses()} ${isReadOnly ? "opacity-60 cursor-not-allowed" : ""}`}
                            type="checkbox"
                          />
                        </label>
                      </td>
                    </tr>
                  </tbody>
                </table>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}


