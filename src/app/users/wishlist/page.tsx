"use client";

import { useEffect, useState } from "react";
import { useAuthRedirect } from "@/hooks/useAuthRedirect";
import CustomerDashboard from "@/components/pages/customer/customer-dashboard";

export default function WishlistPage() {
  useAuthRedirect();

  return <CustomerDashboard />;
}
