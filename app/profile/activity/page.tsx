"use client";

import DashboardLayout from "../../components/DashboardLayout";
import ActivityLogContent from "../_components/ActivityLogContent";
import { useAuthStore } from "../../stores/authStore";
import { getTheme } from "@/app/lib/roles";
import AuthGuard from "@/app/components/AuthGuard";


export default function ActivityPage() {
  const user = useAuthStore((state) => state.user);
  const theme = getTheme(user);

  return (
    <AuthGuard>
      <DashboardLayout theme={theme}>
        <ActivityLogContent />
      </DashboardLayout>
    </AuthGuard>
  );
}
