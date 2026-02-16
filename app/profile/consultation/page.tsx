"use client";

import DashboardLayout from "../../components/DashboardLayout";
import ConsultationContent from "../_components/ConsultationContent";
import { useAuthStore } from "../../stores/authStore";
import AuthGuard from "@/app/components/AuthGuard";


export default function ConsultationPage() {
  const user = useAuthStore((state) => state.user);
  const theme = user?.role === "ADMIN" ? "admin" : "doctor";

  return (
    <AuthGuard>
      <DashboardLayout theme={theme}>
        <ConsultationContent />
      </DashboardLayout>
    </AuthGuard>
  );
}
