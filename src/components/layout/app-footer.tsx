"use client";

import { usePathname } from "next/navigation";
import { MainFooter } from "@/components/layout/main/main-footer";

export default function AppFooter() {
    const pathname = usePathname();

    const dashboardRoutes = [
        "/panel",
        "/admin",
        "/vendor",
        "/customer",
        "/users",
        "/login",
    ];

    const isDashboardRoute = dashboardRoutes.some((route) =>
        pathname.startsWith(route)
    );

    return !isDashboardRoute ? <MainFooter /> : null;
}
