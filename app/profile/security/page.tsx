"use client";

import DashboardLayout from "../../components/DashboardLayout";
import SecurityContent from "../_components/SecurityContent";
import { useAuthStore } from "../../stores/authStore";
import AuthGuard from "@/app/components/AuthGuard";


export default function SecurityPage() {
  const user = useAuthStore((state) => state.user);
  const theme = user?.role === "ADMIN" ? "admin" : "doctor";

  return (
    <AuthGuard>
      <DashboardLayout theme={theme}>
        <SecurityContent />
      </DashboardLayout>
    </AuthGuard>
  );
}
