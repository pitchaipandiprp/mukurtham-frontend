"use client";

import { useEffect, useState } from "react";
import { useAuthRedirect } from "@/hooks/useAuthRedirect";
import CustomerDashboard from "@/components/pages/customer/customer-dashboard";
import VendorDashboard from "@/components/pages/vendor/vendor-dashboard";
import { authUserRole } from "@/utils/auth";

export default function DashboardPage() {
  useAuthRedirect();

  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    const userRole = authUserRole();
    const normalizedRole = userRole?.trim().toLowerCase() ?? null;
    setRole(normalizedRole);
  }, []);


  if (role === "customer") {
    return <CustomerDashboard />;
  }
  if (role === "vendor") {
    return <VendorDashboard />;
  }
}
