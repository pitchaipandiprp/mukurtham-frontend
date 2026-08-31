"use client";

import Link from "next/link";
import { AuthModal } from "@/components/pages/users/auth-modal";
import { useLogout } from "@/hooks/useLogout";
import { useEffect, useState } from "react";
import { FiMenu, FiX, FiBell, FiChevronDown, FiHeart, FiMapPin, FiMessageCircle, FiSearch, } from "react-icons/fi";
import { useAuthUser } from "@/hooks/useAuthUser";
import { useRouter, useSearchParams } from "next/navigation";
import { authUser, } from "@/utils/auth";
import commonRoutes from "@/services/api/common.routes";

const navLinks = [
    { label: "Home", href: "/" },
    { label: "About", href: "/about-us" },
    { label: "Venues", href: "/service-search" },
    { label: "Categories", href: "/service-search" },
    { label: "Contact", href: "/contact-us" },];

export function MainHeader() {
    const router = useRouter();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const { isAuthenticated } = useAuthUser();
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const { logout } = useLogout('/');

    const [autoProfile, setAutoProfile] = useState<any>(null);
    const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

    const [cityList, setCityList] = useState<any[]>([]);

    const [headerSearchInput, setHeaderSearchInput] = useState("");
    const [headerSearchCity, setHeaderSearchCity] = useState("");

    const searchParams = useSearchParams();
    const searchQuery = searchParams.get("search") ?? "";
    const cityQuery = searchParams.get("city") ?? "";

    useEffect(() => {
        const profile = authUser();
        setAutoProfile(profile);
    }, []);

    useEffect(() => {
        loadCity();
    }, []);

    useEffect(() => {
        if (!searchQuery && !cityQuery) return;
        setHeaderSearchInput(searchQuery);
        setHeaderSearchCity(cityQuery);
    }, [searchQuery, cityQuery]);

    function goToLogin() {
        setIsAuthModalOpen(true);
    }

    const loadCity = async () => {
        const result = await commonRoutes.getCities({ is_popular: 1 });
        setCityList(result?.data || []);
    };

    const handleSearchSubmit = () => {
        navigateToServiceSearch(headerSearchInput, headerSearchCity);
    };

    const handleCitySearchChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const city = event.target.value;

        setHeaderSearchCity(city);
        navigateToServiceSearch(headerSearchInput, city);
    };

    const navigateToServiceSearch = (search: string, city: string) => {
        const params = new URLSearchParams();

        if (search.trim()) {
            params.set("search", search.trim());
        }

        if (city) {
            params.set("city", city);
        }

        router.push(`/service-search?${params.toString()}`);
    };

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
                            <select
                                id="header-search-city"
                                value={headerSearchCity}
                                onChange={handleCitySearchChange}
                                className="w-full bg-transparent border-none focus:outline-none cursor-pointer text-xs text-gray-600"
                            >
                                <option value="all">All</option>
                                {cityList.map((city) => (
                                    <option key={city.id} value={city.name}>
                                        {city.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Desktop Search */}
                    <div className="relative hidden max-w-md flex-1 lg:flex">
                        <input
                            type="text"
                            id="header-search-input"
                            placeholder="Search vendors, services..."
                            className="w-full rounded-lg border border-gray-200 bg-gray-50 py-1.5 pl-4 pr-10 text-xs focus:bg-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/10 focus:shadow-md transition-all duration-300 ease-in-out"
                            value={headerSearchInput}
                            onChange={(e) => setHeaderSearchInput(e.target.value)}
                        />
                        <button
                            type="button"
                            onClick={handleSearchSubmit}
                            className="absolute right-3 top-2.5 text-primary cursor-pointer hover:text-primary-dark transition-colors duration-200"
                            aria-label="Search"
                        >
                            <FiSearch className="text-xs" />
                        </button>
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
                        {!isAuthenticated && (
                            <button
                                onClick={goToLogin}
                                type="button"
                                className="cursor-pointer rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-white transition hover:bg-primary-light"
                            >
                                Login
                            </button>
                        )}

                        {isAuthenticated && (
                            <>
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

                                <div className="flex justify-center gap-2 w-30 items-center">
                                    <div className="relative">
                                        {/* Profile Button */}
                                        <button onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)} className="cursor-pointer flex items-center gap-2">
                                            {/* Profile Image */}
                                            <img
                                                src="/images/profile.svg"
                                                alt="Profile"
                                                className="h-9 w-9 rounded-full object-cover"
                                            />

                                            {/* Name */}
                                            <span className="max-w-[120px] truncate text-sm font-semibold text-gray-700">
                                                {autoProfile?.name ?? "My Account"}
                                            </span>

                                            {/* Arrow */}
                                            <svg
                                                className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${isProfileMenuOpen ? "rotate-180" : ""
                                                    }`}
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M19 9l-7 7-7-7"
                                                />
                                            </svg>
                                        </button>

                                        {/* Dropdown */}
                                        <div className={`absolute right-0 z-50 mt-2 w-56 origin-top-right overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xl transition-all duration-200 ${isProfileMenuOpen ? "visible scale-100 opacity-100" : "invisible scale-95 opacity-0"}`}>
                                            {/* Profile Header */}
                                            <div className="flex items-center gap-3 border-b border-gray-100 px-4 py-3">
                                                <img src="/images/profile.svg" alt="Profile" className="h-10 w-10 rounded-full object-cover" />

                                                <div className="min-w-0">
                                                    <p className="truncate text-sm font-semibold text-gray-800">
                                                        {autoProfile?.name ?? "My Account"}
                                                    </p>

                                                    <p className="text-xs text-gray-400">
                                                        Welcome back!
                                                    </p>
                                                </div>
                                            </div>

                                            {/* My Profile */}
                                            <div className="flex cursor-pointer items-center gap-3 px-4 py-3 text-sm text-gray-700 transition-colors hover:bg-gray-50">
                                                <svg className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={1.8}
                                                        d="M5.121 17.804A9 9 0 1118.88 17.8M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                                                    />
                                                </svg>

                                                <span className="font-medium">
                                                    My Profile
                                                </span>
                                            </div>

                                            {/* Logout */}
                                            <div onClick={logout} className="flex cursor-pointer items-center gap-3 border-t border-gray-100 px-4 py-3 text-sm text-red-600 transition-colors hover:bg-red-50">
                                                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={1.8}
                                                        d="M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4M10 17l5-5-5-5M15 12H3"
                                                    />
                                                </svg>

                                                <span className="font-medium">
                                                    Logout
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </>
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
                                    {!isAuthenticated ? (
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
