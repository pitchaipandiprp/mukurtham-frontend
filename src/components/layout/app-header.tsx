"use client";

import { usePathname } from "next/navigation";
import { MainHeader } from "@/components/layout/main/main-header";

export default function AppHeader() {
    const pathname = usePathname();

    const dashboardRoutes = [
        "/users",
        "/vendors",
        "/admin",
    ];

    const isDashboardRoute = dashboardRoutes.some((route) =>
        pathname.startsWith(route)
    );

    return !isDashboardRoute ? <MainHeader /> : null;
}
