"use client";

import DashboardLayout from "./components/DashboardLayout";
import AdminDashboard from "./components/AdminDashboard";
import DoctorDashboard from "./components/DoctorDashboard";

export default function Home() {
  return (
    <DashboardLayout theme="doctor">
      {/* <AdminDashboard /> */}
      <DoctorDashboard />
    </DashboardLayout>
  );
}
