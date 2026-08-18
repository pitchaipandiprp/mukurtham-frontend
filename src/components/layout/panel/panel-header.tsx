"use client";

import { LogOut, Menu, Search, Bell, Home } from "lucide-react";
import Link from "next/link";
import { useLogout } from "@/hooks/useLogout";
import { authUser, } from "@/utils/auth";
import { useEffect, useState } from "react";


interface HeaderProps {
    setIsMobileOpen: () => void;
    setIsSecondaryOpen: () => void;
}

export default function PanelHeader({ setIsMobileOpen, setIsSecondaryOpen }: HeaderProps) {

    const { logout } = useLogout();
    const [autoProfile, setAutoProfile] = useState<any>(null);
    const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

    useEffect(() => {
        const profile = authUser();
        setAutoProfile(profile);
    }, []);

    return (
        <header className="h-16 bg-white border-b border-slate-200 px-4 sm:px-6 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
                <button
                    onClick={setIsMobileOpen}
                    className="p-2 rounded-xl text-primary hover:bg-primary/10 lg:hidden"
                >
                    <Menu className="w-6 h-6" />
                </button>

                <button
                    onClick={setIsSecondaryOpen}
                    className="p-2 rounded-xl text-slate-500 hover:text-primary hover:bg-slate-100 hidden lg:block cursor-pointer transition-colors"
                >
                    <Menu className="w-5 h-5" />
                </button>

                <div className="relative hidden sm:block">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search Vendors, Services..."
                        className="pl-9 pr-4 py-1.5 text-xs bg-slate-100 rounded-xl w-48 md:w-64 border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/10 focus:shadow-md transition-all duration-300 ease-in-out"
                    />
                </div>
            </div>

            <div className="flex items-center gap-3">
                <button className="p-2 rounded-xl text-slate-500 hover:text-primary hover:bg-primary/10 transition-colors cursor-pointer relative">
                    <Bell className="w-5 h-5" />
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-primary-light" />
                </button>


                <Link href="/" className="p-2 rounded-xl text-slate-500 hover:text-primary hover:bg-primary/10 transition-colors cursor-pointer">
                    <Home className="h-5 w-5" />
                </Link>



                <div className="h-8 w-px bg-slate-200" />


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
            </div>
        </header>

    );
}
