"use client";

import DashboardLayout from "../../components/DashboardLayout";
import ActivityLogContent from "../../components/ActivityLogContent";
import { useAuthStore } from "../../stores/authStore";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ActivityPage() {
  const router = useRouter();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isLoading = useAuthStore((state) => state.isLoading);
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-navy-900">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
          <p className="mt-4 text-slate-600 dark:text-navy-300">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  const theme = user?.role === "ADMIN" ? "admin" : "doctor";

  return (
    <DashboardLayout theme={theme}>
      <ActivityLogContent />
    </DashboardLayout>
  );
}
