"use client";

import DashboardLayout from "../../components/DashboardLayout";
import QualificationsContent from "../_components/QualificationsContent";
import { useAuthStore } from "../../stores/authStore";
import AuthGuard from "@/app/components/AuthGuard";


export default function QualificationsPage() {
  const user = useAuthStore((state) => state.user);
  const theme = user?.role === "ADMIN" ? "admin" : "doctor";

  return (
    <AuthGuard>
      <DashboardLayout theme={theme}>
        <QualificationsContent />
      </DashboardLayout>
    </AuthGuard>
  );
}
