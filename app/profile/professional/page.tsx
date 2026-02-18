"use client";

import DashboardLayout from "../../components/DashboardLayout";
import ProfessionalInformationContent from "../_components/ProfessionalInformationContent";
import { useAuthStore } from "../../stores/authStore";
import { getTheme } from "@/app/lib/roles";
import AuthGuard from "@/app/components/AuthGuard";

export default function ProfessionalInformationPage() {
  const user = useAuthStore((state) => state.user);
  const theme = getTheme(user);

  return (
    <AuthGuard>
      <DashboardLayout theme={theme}>
        <ProfessionalInformationContent />
      </DashboardLayout>
    </AuthGuard>
  );
}
