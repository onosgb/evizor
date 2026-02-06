"use client";

import { useEffect } from "react";
import { useTenantStore } from "../stores/tenantStore";

export default function TenantProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const fetchTenants = useTenantStore((state) => state.fetchTenants);

  useEffect(() => {
    // Fetch tenants when the app initializes
    fetchTenants();
  }, [fetchTenants]);

  // Don't block rendering - tenants load in the background
  return <>{children}</>;
}
