"use client";

import DashboardLayout from "../../components/DashboardLayout";
import ConsultationContent from "../_components/ConsultationContent";
import { useAuthStore } from "../../stores/authStore";
import { getTheme } from "@/app/lib/roles";
import AuthGuard from "@/app/components/AuthGuard";


export default function ConsultationPage() {
  const user = useAuthStore((state) => state.user);
  const theme = getTheme(user);

  return (
    <AuthGuard>
      <DashboardLayout theme={theme}>
        <ConsultationContent />
      </DashboardLayout>
    </AuthGuard>
  );
}
