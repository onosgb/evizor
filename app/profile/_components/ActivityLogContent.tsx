"use client";

import { useState, useEffect } from "react";
import { useAuthStore } from "@/app/stores/authStore";
import ProfileSidebar from "./ProfileSidebar";
import { useSearchParams } from "next/navigation";

interface ActivityLog {
  timestamp: string;
  activity: string;
}

export default function ActivityLogContent() {
  const user = useAuthStore((state) => state.user);
  const searchParams = useSearchParams();
  const userId = searchParams.get("userId");

  if (userId && user && userId !== user.id) {
    return (
      <div className="flex items-center justify-center h-full p-10">
        <div className="text-center">
          <h3 className="text-xl font-medium text-slate-700 dark:text-navy-100">Access Denied</h3>
          <p className="mt-2 text-slate-500 dark:text-navy-200">You do not have permission to view this activity log.</p>
        </div>
      </div>
    );
  }

  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([
    {
      timestamp: "Friday 25 January, 2026 | 10:02 AM",
      activity: "Accepted patient John D.",
    },
    {
      timestamp: "Friday 25 January, 2026 | 10:02 AM",
      activity: "Completed consultation",
    },
    {
      timestamp: "Friday 25 January, 2026 | 10:02 AM",
      activity: "Updated availability",
    },
  ]);


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
                Activity Log
              </h2>
            </div>
            <div className="p-4 sm:p-5">
              <div className="p-5">
                <div className="min-w-full overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr>
                        <th className="whitespace-nowrap rounded-tl-lg bg-slate-200 px-3 py-3 font-semibold uppercase text-slate-800 dark:bg-navy-800 dark:text-navy-100 lg:px-5">
                          TimeStamp
                        </th>
                        <th className="whitespace-nowrap rounded-tr-lg bg-slate-200 px-4 py-3 font-semibold uppercase text-slate-800 dark:bg-navy-800 dark:text-navy-100 lg:px-5">
                          Activity
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {activityLogs.map((log, index) => (
                        <tr
                          key={index}
                          className="border border-transparent border-b-slate-200 dark:border-b-navy-500"
                        >
                          <td className="whitespace-nowrap px-4 py-3 sm:px-5">
                            {log.timestamp}
                          </td>
                          <td className="whitespace-nowrap px-4 py-3 sm:px-5">
                            {log.activity}
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
    </>
  );
}


