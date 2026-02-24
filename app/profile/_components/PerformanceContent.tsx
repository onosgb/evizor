"use client";

import { useState, useEffect } from "react";
import { useAuthStore } from "@/app/stores/authStore";
import ProfileSidebar from "./ProfileSidebar";
import { useSearchParams } from "next/navigation";
import { adminService } from "@/app/lib/services";

interface PerformanceData {
  date: string;
  consultationsToday: number;
  avgConsultationTime: string;
  patientRating: string;
  completionRate: string;
}

export default function PerformanceContent() {
  const user = useAuthStore((state) => state.user);
  const searchParams = useSearchParams();
  const userId = searchParams.get("userId");

  const [isLoadingPerformance, setIsLoadingPerformance] = useState(!!userId);
  const [performanceData, setPerformanceData] = useState<PerformanceData[]>([
    {
      date: "Mon, 12 May",
      consultationsToday: 15,
      avgConsultationTime: "12 mins",
      patientRating: "â˜…â˜…â˜…â˜…â˜† (4.6)",
      completionRate: "98%",
    },
    {
      date: "Tue, 13 May",
      consultationsToday: 18,
      avgConsultationTime: "14 mins",
      patientRating: "â˜…â˜…â˜…â˜…â˜… (4.8)",
      completionRate: "100%",
    },
    {
      date: "Wed, 14 May",
      consultationsToday: 12,
      avgConsultationTime: "11 mins",
      patientRating: "â˜…â˜…â˜…â˜…â˜† (4.5)",
      completionRate: "95%",
    },
    {
      date: "Thu, 15 May",
      consultationsToday: 20,
      avgConsultationTime: "13 mins",
      patientRating: "â˜…â˜…â˜…â˜…â˜… (4.9)",
      completionRate: "100%",
    },
    {
      date: "Fri, 16 May",
      consultationsToday: 16,
      avgConsultationTime: "12 mins",
      patientRating: "â˜…â˜…â˜…â˜…â˜† (4.7)",
      completionRate: "98%",
    },
    {
      date: "Sat, 17 May",
      consultationsToday: 10,
      avgConsultationTime: "15 mins",
      patientRating: "â˜…â˜…â˜…â˜…â˜† (4.6)",
      completionRate: "90%",
    },
  ]);

  useEffect(() => {
    if (userId) {
      const fetchPerformance = async () => {
        setIsLoadingPerformance(true);
        try {
          const response = await adminService.getUserPerformance(userId);
          if (response.status && response.data) {
            // setPerformanceData(response.data);
          }
        } catch (error) {
          console.error("Failed to fetch performance data:", error);
        } finally {
          setIsLoadingPerformance(false);
        }
      };
      fetchPerformance();
    }
  }, [userId]);

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
                Performance Snapshot
              </h2>
            </div>
            <div className="p-4 sm:p-5">
              <div className="min-w-full overflow-x-auto">
                <table className="is-hoverable w-full text-left">
                  <thead>
                    <tr>
                      <th className="whitespace-nowrap rounded-tl-lg bg-slate-200 px-4 py-3 font-semibold uppercase text-slate-800 dark:bg-navy-800 dark:text-navy-100 lg:px-5">
                        Date
                      </th>
                      <th className="whitespace-nowrap bg-slate-200 px-4 py-3 font-semibold uppercase text-slate-800 dark:bg-navy-800 dark:text-navy-100 lg:px-5">
                        Consultations Today
                      </th>
                      <th className="whitespace-nowrap bg-slate-200 px-4 py-3 font-semibold uppercase text-slate-800 dark:bg-navy-800 dark:text-navy-100 lg:px-5">
                        Avg Consultation Time
                      </th>
                      <th className="whitespace-nowrap bg-slate-200 px-4 py-3 font-semibold uppercase text-slate-800 dark:bg-navy-800 dark:text-navy-100 lg:px-5">
                        Patient Rating
                      </th>
                      <th className="whitespace-nowrap rounded-tr-lg bg-slate-200 px-4 py-3 font-semibold uppercase text-slate-800 dark:bg-navy-800 dark:text-navy-100 lg:px-5">
                        Completion Rate
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {isLoadingPerformance
                      ? Array.from({ length: 6 }).map((_, i) => (
                          <tr
                            key={i}
                            className="border-y border-transparent border-b-slate-200 dark:border-b-navy-500 animate-pulse"
                          >
                            <td className="px-4 py-3 sm:px-5">
                              <div className="h-4 w-24 rounded bg-slate-200 dark:bg-navy-500" />
                            </td>
                            <td className="px-4 py-3 sm:px-5">
                              <div className="h-4 w-8 rounded bg-slate-200 dark:bg-navy-500" />
                            </td>
                            <td className="px-4 py-3 sm:px-5">
                              <div className="h-4 w-16 rounded bg-slate-200 dark:bg-navy-500" />
                            </td>
                            <td className="px-4 py-3 sm:px-5">
                              <div className="h-4 w-28 rounded bg-slate-200 dark:bg-navy-500" />
                            </td>
                            <td className="px-4 py-3 sm:px-5">
                              <div className="h-4 w-10 rounded bg-slate-200 dark:bg-navy-500" />
                            </td>
                          </tr>
                        ))
                      : performanceData.map((data, index) => (
                          <tr
                            key={index}
                            className="border-y border-transparent border-b-slate-200 dark:border-b-navy-500"
                          >
                            <td className="whitespace-nowrap px-4 py-3 sm:px-5">
                              {data.date}
                            </td>
                            <td className="whitespace-nowrap px-4 py-3 sm:px-5">
                              {data.consultationsToday}
                            </td>
                            <td className="whitespace-nowrap px-4 py-3 sm:px-5">
                              {data.avgConsultationTime}
                            </td>
                            <td className="whitespace-nowrap px-4 py-3 font-medium text-slate-600 dark:text-navy-100 sm:px-5">
                              {data.patientRating}
                            </td>
                            <td className="whitespace-nowrap px-4 py-3 sm:px-5">
                              {data.completionRate}
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
    </>
  );
}
