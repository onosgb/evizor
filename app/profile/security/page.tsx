"use client";

import DashboardLayout from "../../components/DashboardLayout";
import SecurityContent from "../_components/SecurityContent";
import { useAuthStore } from "../../stores/authStore";
import { getTheme } from "@/app/lib/roles";
import AuthGuard from "@/app/components/AuthGuard";


export default function SecurityPage() {
  const user = useAuthStore((state) => state.user);
  const theme = getTheme(user);

  return (
    <AuthGuard>
      <DashboardLayout theme={theme}>
        <SecurityContent />
      </DashboardLayout>
    </AuthGuard>
  );
}
