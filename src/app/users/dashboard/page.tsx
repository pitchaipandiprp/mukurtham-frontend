"use client";

import CustomerDashboard from "@/components/pages/customer/customer-dashboard";
import VendorDashboard from "@/components/pages/vendor/vendor-dashboard";
import AdminDashboard from "@/components/pages/admin/admin-dashboard";
import { useAuthUser } from "@/hooks/useAuthUser";

export default function DashboardPage() {

  const { userRole } = useAuthUser();

  if (userRole === "customer") {
    return <CustomerDashboard />;
  }
  else if (userRole === "vendor") {
    return <VendorDashboard />;
  }
  else if (userRole === "admin") {
    return <AdminDashboard />;
  }
}
