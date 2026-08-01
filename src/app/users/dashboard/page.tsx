"use client";

import CustomerDashboard from "@/components/pages/customer/customer-dashboard";
import VendorDashboard from "@/components/pages/vendor/vendor-dashboard";
import { useAuthUser } from "@/hooks/useAuthUser";

export default function DashboardPage() {

  const { userRole } = useAuthUser();

  if (userRole === "customer") {
    return <CustomerDashboard />;
  }
  if (userRole === "vendor") {
    return <VendorDashboard />;
  }
}
