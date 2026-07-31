"use client";

import { useEffect, useState } from "react";
import { useAuthRedirect } from "@/hooks/useAuthRedirect";
import CustomerDashboard from "@/components/pages/customer/customer-dashboard";
import VendorDashboard from "@/components/pages/vendor/vendor-dashboard";
import { useAuthUser } from "@/hooks/useAuthUser";

export default function DashboardPage() {
  useAuthRedirect();

  const { userRole } = useAuthUser();

  if (userRole === "customer") {
    return <CustomerDashboard />;
  }
  if (userRole === "vendor") {
    return <VendorDashboard />;
  }
}
