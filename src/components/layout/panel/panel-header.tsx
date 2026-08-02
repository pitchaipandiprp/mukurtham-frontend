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


                <Link href="#" onClick={logout} className="p-2 rounded-xl text-slate-500 hover:text-primary hover:bg-primary/10 transition-colors cursor-pointer">
                    <LogOut className="h-5 w-5" />
                </Link>

                {/* <div className="h-8 w-px bg-slate-200" /> */}


                <div className="flex justify-center gap-2 w-20">
                    <div className="text-right hidden sm:block">
                        <p className="text-xs font-bold text-slate-800">{autoProfile?.name ?? ""}</p>
                        {/* <p className="text-[10px] text-slate-400">Super Admin</p> */}
                    </div>
                </div>
            </div>
        </header>

    );
}
