"use client";

import Link from "next/link";
import { FiHome, FiCalendar, FiHeart, FiUser, FiMenu } from "react-icons/fi";
import { useAuthUser } from "@/hooks/useAuthUser";
import { usePathname } from "next/navigation";

export default function MobileBottomNav() {
    const pathname = usePathname();

    const { isAuthenticated } = useAuthUser();

    const dashboardRoutes = [
        "/users",
        "/vendors",
        "/admin",
    ];
    const isDashboardRoute = dashboardRoutes.some((route) =>
        pathname.startsWith(route)
    );

    if (!isAuthenticated || isDashboardRoute) {
        return null;
    }

    return (
        <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-gray-200 bg-white shadow-lg md:hidden">
            <div className="mx-auto flex h-16 max-w-md items-center justify-around">
                <Link href="/" className="flex flex-col items-center gap-1 text-primary cursor-pointer">
                    <FiHome className="h-5 w-5" />
                    <span className="text-[10px] font-medium">Home</span>
                </Link>

                <Link href="/users/bookings" className="flex flex-col items-center gap-1 text-gray-500 cursor-pointer">
                    <FiCalendar className="h-5 w-5" />
                    <span className="text-[10px] font-medium">Bookings</span>
                </Link>

                <Link href="/users/wishlist" className="flex flex-col items-center gap-1 text-gray-500 cursor-pointer">
                    <FiHeart className="h-5 w-5" />
                    <span className="text-[10px] font-medium">Wishlist</span>
                </Link>

                <Link href="/users/dashboard" className="flex flex-col items-center gap-1 text-gray-500 cursor-pointer">
                    <FiMenu className="h-5 w-5" />
                    <span className="text-[10px] font-medium">Dashboard</span>
                </Link>
            </div>
        </nav>
    );
}