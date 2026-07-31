"use client";

import Link from "next/link";
import { FiMenu, FiX, FiHome, FiSearch, FiCalendar, FiHeart, FiUser } from "react-icons/fi";
import { useState } from "react";
import { useAuthUser } from "@/hooks/useAuthUser";
import CustomerLeftMenu from "@/components/layout/user-dashboard/customer-left-menu";

export default function UserDashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const { userRole } = useAuthUser();
    const { isAuthenticated } = useAuthUser();

    return (
        <>
            <div className="min-h-screen bg-primary antialiased">

                {/* Mobile Header */}
                <header className="sticky top-0 z-50 flex h-16 items-center justify-between border-b border-primary/10 bg-white/95 px-4 shadow-sm backdrop-blur lg:hidden">

                    <div>
                        <h1 className="bg-gradient-to-r from-primary to-primary-light bg-clip-text text-lg font-extrabold text-transparent">
                            My Dashboard
                        </h1>

                        <p className="text-[10px] font-medium text-gray-400">
                            Manage your wedding journey
                        </p>
                    </div>
                </header>

                {/* Dashboard Layout */}
                <div className="flex min-h-[calc(100vh-4rem)] lg:min-h-screen">

                    {/* Menu */}
                    {userRole === "customer" && (
                        <CustomerLeftMenu
                            isMobileMenuOpen={isMobileMenuOpen}
                            onCloseMobileMenu={() => setIsMobileMenuOpen(false)}
                        />
                    )}

                    {/* Main Body */}
                    <main className="min-w-0 flex-1 bg-white">
                        <div className="p-0 m-0 min-h-[calc(100vh-4rem)] lg:min-h-screen">
                            {children}
                        </div>
                    </main>

                </div>

            </div>

            <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-gray-200 bg-white shadow-lg md:hidden">
                <div className="mx-auto flex h-16 max-w-md items-center justify-around">
                    <Link href="/" className="flex flex-col items-center gap-1 text-primary cursor-pointer">
                        <FiHome className="h-5 w-5" />
                        <span className="text-[10px] font-medium">Home</span>
                    </Link>

                    {isAuthenticated && (
                        <>
                            <Link href="/users/bookings" className="flex flex-col items-center gap-1 text-gray-500 cursor-pointer">
                                <FiCalendar className="h-5 w-5" />
                                <span className="text-[10px] font-medium">Bookings</span>
                            </Link>

                            <Link href="/users/wishlist" className="flex flex-col items-center gap-1 text-gray-500 cursor-pointer">
                                <FiHeart className="h-5 w-5" />
                                <span className="text-[10px] font-medium">Wishlist</span>
                            </Link>

                            <Link
                                href="#"
                                className="flex flex-col items-center gap-1 text-gray-500 cursor-pointer"
                                onClick={() => setIsMobileMenuOpen((prev) => !prev)}
                            >
                                <FiMenu className="h-5 w-5" />
                                <span className="text-[10px] font-medium">Dashboard</span>
                            </Link>
                        </>
                    )}
                </div>
            </nav>
        </>
    );
}