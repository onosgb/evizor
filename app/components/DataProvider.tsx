"use client";

import { useEffect } from "react";
import { useTenantStore } from "../stores/tenantStore";
import { useAuthStore } from "../stores/authStore";

export default function DataProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const fetchTenants = useTenantStore((state) => state.fetchTenants);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  useEffect(() => {
    // Only fetch data if user is authenticated
    if (isAuthenticated) {
      fetchTenants();
    }
  }, [fetchTenants, isAuthenticated]);

  // Don't block rendering - data loads in the background
  return <>{children}</>;
}
