"use client";

import DashboardLayout from "../../components/DashboardLayout";
import AvailabilityContent from "../_components/AvailabilityContent";
import { useAuthStore } from "../../stores/authStore";
import { getTheme } from "@/app/lib/roles";
import AuthGuard from "@/app/components/AuthGuard";


export default function AvailabilityPage() {
  const user = useAuthStore((state) => state.user);
  const theme = getTheme(user);

  return (
    <AuthGuard>
      <DashboardLayout theme={theme}>
        <AvailabilityContent />
      </DashboardLayout>
    </AuthGuard>
  );
}
