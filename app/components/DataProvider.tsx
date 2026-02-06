"use client";

import { useEffect } from "react";
import { useTenantStore } from "../stores/tenantStore";

export default function DataProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const fetchTenants = useTenantStore((state) => state.fetchTenants);

  useEffect(() => {
    // Fetch tenants and other global data when the app initializes
    fetchTenants();
  }, [fetchTenants]);

  // Don't block rendering - data loads in the background
  return <>{children}</>;
}
