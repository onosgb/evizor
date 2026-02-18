"use client";

import DashboardLayout from "../components/DashboardLayout";
import AdminDashboard from "./_components/AdminDashboard";
import DoctorDashboard from "./_components/DoctorDashboard";
import { useAuthStore } from "../stores/authStore";
import { getTheme } from "@/app/lib/roles";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DashboardPage() {
  const router = useRouter();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isLoading = useAuthStore((state) => state.isLoading);
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex bg-slate-50 dark:bg-navy-900 animate-pulse">
        {/* Sidebar skeleton */}
        <div className="hidden lg:flex w-64 shrink-0 flex-col bg-white dark:bg-navy-750 border-r border-slate-200 dark:border-navy-700 p-4 space-y-4">
          <div className="h-8 w-32 rounded bg-slate-200 dark:bg-navy-500" />
          <div className="mt-6 space-y-2">
            {Array.from({ length: 7 }).map((_, i) => (
              <div key={i} className="h-9 w-full rounded-lg bg-slate-200 dark:bg-navy-500" />
            ))}
          </div>
        </div>
        {/* Main area skeleton */}
        <div className="flex flex-1 flex-col overflow-hidden">
          {/* Header */}
          <div className="flex h-16 items-center justify-between border-b border-slate-200 dark:border-navy-700 bg-white dark:bg-navy-750 px-6">
            <div className="h-5 w-40 rounded bg-slate-200 dark:bg-navy-500" />
            <div className="flex items-center space-x-3">
              <div className="size-8 rounded-full bg-slate-200 dark:bg-navy-500" />
              <div className="size-8 rounded-full bg-slate-200 dark:bg-navy-500" />
              <div className="size-9 rounded-full bg-slate-200 dark:bg-navy-500" />
            </div>
          </div>
          {/* Content */}
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="card p-5 space-y-3">
                  <div className="h-3 w-20 rounded bg-slate-200 dark:bg-navy-500" />
                  <div className="h-8 w-16 rounded bg-slate-200 dark:bg-navy-500" />
                </div>
              ))}
            </div>
            <div className="card p-5 space-y-3">
              <div className="h-4 w-32 rounded bg-slate-200 dark:bg-navy-500" />
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-10 w-full rounded bg-slate-200 dark:bg-navy-500" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Don't render if not authenticated (will redirect)
  if (!isAuthenticated) {
    return null;
  }

  // Determine theme based on user role
  const theme = getTheme(user);

  return (
    <DashboardLayout theme={theme}>
      {theme === "admin" ? <AdminDashboard user={user} /> : <DoctorDashboard user={user} />}
    </DashboardLayout>
  );
}
