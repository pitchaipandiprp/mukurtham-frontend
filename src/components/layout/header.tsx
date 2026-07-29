"use client";

import Link from "next/link";
import { AuthModal } from "@/components/pages/users/auth-modal";
import { useLogout } from "@/hooks/useLogout";
import { authUserId } from "@/utils/auth";
import { useState, useEffect } from "react";
import { FiMenu, FiX, FiBell, FiChevronDown, FiHeart, FiMapPin, FiMessageCircle, FiSearch, } from "react-icons/fi";

const navLinks = [
    { label: "Home", href: "/" },
    { label: "About", href: "/about-us" },
    { label: "Vendors", href: "/dashboard" },
    { label: "Venues", href: "/category-search" },
    { label: "Categories", href: "/category-search" },
    { label: "Contact", href: "/contact-us" },];

export function Header() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
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
                <div className="mx-auto flex h-16 max-w-screen-2xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-10">

                    {/* Logo + Location */}
                    <div className="flex items-center gap-10">
                        <Link href="/" className="flex items-center">
                            <img
                                src="/images/logo.jpg"
                                alt="Mukurtham Logo"
                                className="h-12 w-auto object-contain"
                            />
                        </Link>

                        <div className="hidden items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3 py-1.5 text-xs text-gray-600 md:flex">
                            <FiMapPin className="text-primary" />
                            <span>Chennai</span>
                            <FiChevronDown className="text-[10px]" />
                        </div>
                    </div>

                    {/* Desktop Search */}
                    <div className="relative hidden max-w-md flex-1 lg:flex">
                        <input
                            type="text"
                            placeholder="Search vendors, services..."
                            className="w-full rounded-lg border border-gray-200 bg-gray-50 py-1.5 pl-4 pr-10 text-xs focus:bg-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/10 focus:shadow-md transition-all duration-300 ease-in-out"
                        />
                        <FiSearch className="absolute right-3 top-2.5 text-xs text-primary" />
                    </div>

                    {/* Desktop Navigation */}
                    <nav className="hidden items-center gap-6 text-xs font-medium text-gray-600 xl:flex">
                        {navLinks.map((link) => (
                            <Link
                                key={link.label}
                                href={link.href}
                                className="hover:text-primary"
                            >
                                {link.label}
                            </Link>
                        ))}
                    </nav>

                    {/* Desktop Actions */}
                    <div className="hidden items-center gap-4 text-gray-600 md:flex">
                        <button
                            type="button"
                            className="hover:text-primary"
                            aria-label="Wishlist"
                        >
                            <FiHeart />
                        </button>

                        <button
                            type="button"
                            className="hover:text-primary"
                            aria-label="Messages"
                        >
                            <FiMessageCircle />
                        </button>

                        <button
                            type="button"
                            className="relative hover:text-primary"
                            aria-label="Notifications"
                        >
                            <FiBell />

                            <span className="absolute -right-1 -top-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-primary text-[9px] text-white">
                                2
                            </span>
                        </button>

                        {!userId && (
                            <button
                                onClick={goToLogin}
                                type="button"
                                className="cursor-pointer rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-white transition hover:bg-primary-light"
                            >
                                Login
                            </button>
                        )}

                        {userId && (
                            <button
                                onClick={logout}
                                type="button"
                                className="cursor-pointer rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-white transition hover:bg-primary-light"
                            >
                                Logout
                            </button>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        type="button"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="flex cursor-pointer items-center justify-center rounded-lg p-2 text-gray-600 hover:bg-gray-100 hover:text-primary md:hidden"
                        aria-label="Toggle mobile menu"
                        aria-expanded={isMobileMenuOpen}
                    >
                        {isMobileMenuOpen ? (
                            <FiX className="h-6 w-6" />
                        ) : (
                            <FiMenu className="h-6 w-6" />
                        )}
                    </button>
                </div>

                {/* Mobile Menu */}
                {isMobileMenuOpen && (
                    <div className="fixed inset-0 z-[70] md:hidden">
                        {/* Overlay - 10% visible area */}
                        <button
                            type="button"
                            aria-label="Close mobile menu"
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="absolute inset-0 w-full bg-black/40"
                        />

                        {/* Drawer - 90% width */}
                        <div className="absolute right-0 top-0 flex h-full w-[90%] max-w-sm flex-col bg-white shadow-2xl">

                            {/* Drawer Header */}
                            <div className="relative flex h-16 shrink-0 items-center justify-center border-b border-gray-200 px-4">
                                <Link href="/" className="flex items-center">
                                    <img
                                        src="/images/logo-m.jpg"
                                        alt="Mukurtham Logo"
                                        className="h-12 w-auto object-contain"
                                    />
                                </Link>

                                <button
                                    type="button"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="absolute right-4 cursor-pointer rounded-lg p-2 text-gray-600 hover:bg-gray-100 hover:text-primary"
                                    aria-label="Close mobile menu"
                                >
                                    <FiX className="h-6 w-6" />
                                </button>
                            </div>

                            {/* Scrollable Content */}
                            <div className="flex-1 overflow-y-auto px-4 py-4">

                                {/* Search */}
                                <div className="relative mb-4">
                                    <input
                                        type="text"
                                        placeholder="Search vendors, services..."
                                        className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2.5 pl-4 pr-10 text-sm focus:border-primary focus:outline-none"
                                    />

                                    <FiSearch className="absolute right-3 top-3 text-primary" />
                                </div>

                                {/* Location */}
                                <div className="mb-4 flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3 py-3 text-sm text-gray-600">
                                    <FiMapPin className="text-primary" />
                                    <span>Chennai</span>
                                    <FiChevronDown className="ml-auto text-xs" />
                                </div>

                                {/* Navigation */}
                                <nav className="flex flex-col gap-1">
                                    {navLinks.map((link) => (
                                        <Link
                                            key={link.label}
                                            href={link.href}
                                            onClick={() => setIsMobileMenuOpen(false)}
                                            className="rounded-lg px-3 py-3 text-sm font-medium text-gray-600 transition hover:bg-gray-50 hover:text-primary"
                                        >
                                            {link.label}
                                        </Link>
                                    ))}
                                </nav>

                                {/* Actions */}
                                <div className="mt-4 border-t border-gray-200 pt-4">
                                    <div className="flex flex-col gap-3">
                                        <button
                                            type="button"
                                            className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm text-gray-600 hover:bg-gray-50 hover:text-primary"
                                        >
                                            <FiHeart />
                                            Wishlist
                                        </button>

                                        <button
                                            type="button"
                                            className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm text-gray-600 hover:bg-gray-50 hover:text-primary"
                                        >
                                            <FiMessageCircle />
                                            Messages
                                        </button>

                                        <button
                                            type="button"
                                            className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm text-gray-600 hover:bg-gray-50 hover:text-primary"
                                        >
                                            <FiBell />
                                            Notifications
                                        </button>
                                    </div>
                                </div>

                                {/* Login / Logout */}
                                <div className="mt-4 border-t border-gray-200 pt-4">
                                    {!userId ? (
                                        <button
                                            onClick={() => {
                                                setIsMobileMenuOpen(false);
                                                goToLogin();
                                            }}
                                            type="button"
                                            className="w-full cursor-pointer rounded-lg bg-primary px-4 py-3 text-sm font-medium text-white hover:bg-primary-light"
                                        >
                                            Login
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() => {
                                                setIsMobileMenuOpen(false);
                                                logout();
                                            }}
                                            type="button"
                                            className="w-full cursor-pointer rounded-lg bg-primary px-4 py-3 text-sm font-medium text-white hover:bg-primary-light"
                                        >
                                            Logout
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </header>
            <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} defaultView="login" />
        </>
    );
}
