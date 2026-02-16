"use client";

import DashboardLayout from "../../components/DashboardLayout";
import PerformanceContent from "../_components/PerformanceContent";
import { useAuthStore } from "../../stores/authStore";
import AuthGuard from "@/app/components/AuthGuard";


export default function PerformancePage() {
  const user = useAuthStore((state) => state.user);
  const theme = user?.role === "ADMIN" ? "admin" : "doctor";

  return (
    <AuthGuard>
      <DashboardLayout theme={theme}>
        <PerformanceContent />
      </DashboardLayout>
    </AuthGuard>
  );
}
