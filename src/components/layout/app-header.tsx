"use client";

import { usePathname } from "next/navigation";
import { MainHeader } from "@/components/layout/main/main-header";

export default function AppHeader() {
    const pathname = usePathname();

    const dashboardRoutes = [
        "/panel",
        "/admin",
        "/vendor",
        "/customer",
        // "/user",
        "/login",
    ];

    const isDashboardRoute = dashboardRoutes.some((route) =>
        pathname.startsWith(route)
    );

    return !isDashboardRoute ? <MainHeader /> : null;
}
