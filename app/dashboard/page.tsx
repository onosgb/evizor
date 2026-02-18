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

  // Show loading state while checking auth
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
