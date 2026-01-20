"use client";

import { useState } from "react";
import ProfileSidebar from "./ProfileSidebar";
import { useAuthStore } from "../stores/authStore";

interface ConsultationPreferences {
  acceptOnDemandVisits: boolean;
  acceptScheduledVisits: boolean;
  followUpOnly: boolean;
  preferredTypeGeneral: boolean;
  preferredTypeSpecialist: boolean;
}

export default function ConsultationContent() {
  const user = useAuthStore((state) => state.user);
  const theme = user?.role === "ADMIN" ? "admin" : "doctor";
  
  // Theme-based switch styling
  const getSwitchClasses = () => {
    return theme === "admin"
      ? "form-switch h-5 w-10 rounded-full bg-slate-300 before:rounded-full before:bg-slate-50 checked:bg-green-600 checked:before:bg-white dark:bg-navy-900 dark:before:bg-navy-300 dark:checked:bg-green-500 dark:checked:before:bg-white"
      : "form-switch h-5 w-10 rounded-full bg-slate-300 before:rounded-full before:bg-slate-50 checked:bg-primary checked:before:bg-white dark:bg-navy-900 dark:before:bg-navy-300 dark:checked:bg-accent dark:checked:before:bg-white";
  };
  const [preferences, setPreferences] = useState<ConsultationPreferences>({
    acceptOnDemandVisits: true,
    acceptScheduledVisits: true,
    followUpOnly: false,
    preferredTypeGeneral: true,
    preferredTypeSpecialist: false,
  });

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
                <table className="w-full text-left">
                  <tbody>
                    <tr className="border border-transparent border-b-slate-200 dark:border-b-navy-500">
                      <td className="whitespace-nowrap px-4 py-3 sm:px-5">
                        Accept On-Demand Visits
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 sm:px-5">
                        <label className="inline-flex items-center">
                          <input
                            checked={preferences.acceptOnDemandVisits}
                            onChange={() => handleToggle("acceptOnDemandVisits")}
                            className={getSwitchClasses()}
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
                            checked={preferences.acceptScheduledVisits}
                            onChange={() => handleToggle("acceptScheduledVisits")}
                            className={getSwitchClasses()}
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
                            checked={preferences.followUpOnly}
                            onChange={() => handleToggle("followUpOnly")}
                            className={getSwitchClasses()}
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
                            checked={preferences.preferredTypeGeneral}
                            onChange={() => handleToggle("preferredTypeGeneral")}
                            className={getSwitchClasses()}
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
                            checked={preferences.preferredTypeSpecialist}
                            onChange={() => handleToggle("preferredTypeSpecialist")}
                            className={getSwitchClasses()}
                            type="checkbox"
                          />
                        </label>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
