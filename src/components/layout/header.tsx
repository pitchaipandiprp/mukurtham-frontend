"use client";

import Link from "next/link";
import { AuthModal } from "@/components/pages/users/auth-modal";
import { useLogout } from "@/hooks/useLogout";
import { authUserId } from "@/utils/auth";
import { useState, useEffect } from "react";

import {
    FiBell,
    FiChevronDown,
    FiHeart,
    FiMapPin,
    FiMessageCircle,
    FiSearch,
} from "react-icons/fi";

const navLinks = [
    { label: "Home", href: "/" },
    { label: "About", href: "/about-us" },
    { label: "Vendors", href: "/dashboard" },
    { label: "Venues", href: "/dashboard" },
    { label: "Categories", href: "/" },
    { label: "Planner", href: "/" },
];

export function Header() {
    const [userId, setUserId] = useState<string | null>(null);
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const { logout } = useLogout();

    useEffect(() => {
        const updateAuth = () => { setUserId(authUserId()); };
        updateAuth();
        window.addEventListener("auth-change", updateAuth);

        return () => {
            window.removeEventListener("auth-change", updateAuth);
        };
    }, []);

    function goToLogin() {
        setIsAuthModalOpen(true);
    }

    return (
        <>
            <header className="sticky top-0 z-50 border-b border-gray-200 bg-white">
                <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4">
                    <div className="flex items-center gap-6">
                        <Link href="/" className="flex items-center gap-2">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                                <span className="text-sm">✿</span>
                            </div>
                            <div>
                                <span className="block text-lg font-extrabold leading-none tracking-wider text-primary">
                                    MUKURTHAM
                                </span>
                                <span className="block text-[9px] uppercase tracking-[0.18em] text-gray-500">
                                    Make Every Moment Magical
                                </span>
                            </div>
                        </Link>

                        <div className="hidden items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3 py-1.5 text-xs text-gray-600 md:flex">
                            <FiMapPin className="text-primary" />
                            <span>Chennai</span>
                            <FiChevronDown className="text-[10px]" />
                        </div>
                    </div>

                    <div className="relative hidden max-w-md flex-1 lg:flex">
                        <input
                            type="text"
                            placeholder="Search vendors, services..."
                            className="w-full rounded-lg border border-gray-200 bg-gray-50 py-1.5 pl-4 pr-10 text-xs focus:border-primary focus:outline-none"
                        />
                        <FiSearch className="absolute right-3 top-2.5 text-xs text-primary" />
                    </div>

                    <nav className="hidden items-center gap-6 text-xs font-medium text-gray-600 xl:flex">
                        {navLinks.map((link) => (
                            <Link key={link.label} href={link.href} className="hover:text-primary">
                                {link.label}
                            </Link>
                        ))}
                    </nav>

                    <div className="flex items-center gap-4 text-gray-600">
                        <button type="button" className="hover:text-primary" aria-label="Wishlist">
                            <FiHeart />
                        </button>
                        <button type="button" className="hover:text-primary" aria-label="Messages">
                            <FiMessageCircle />
                        </button>
                        <button type="button" className="relative hover:text-primary" aria-label="Notifications">
                            <FiBell />
                            <span className="absolute -right-1 -top-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-primary text-[9px] text-white">
                                2
                            </span>
                        </button>
                        {!userId && (
                            <button
                                onClick={goToLogin}
                                type="button"
                                className="rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-white transition hover:bg-primary-light cursor-pointer"
                            >
                                Login
                            </button>
                        )}

                        {userId && (
                            <button
                                onClick={logout}
                                type="button"
                                className="rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-white transition hover:bg-primary-light cursor-pointer"
                            >
                                Logout
                            </button>
                        )}
                    </div>
                </div>
            </header>
            <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} defaultView="login" />
        </>
    );
}
