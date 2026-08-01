"use client";

import { LogOut, Menu, Search, Bell } from "lucide-react";
interface HeaderProps {
    setIsMobileOpen: () => void;
    setIsSecondaryOpen: () => void;
}

export default function PanelHeader({ setIsMobileOpen, setIsSecondaryOpen }: HeaderProps) {
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
                    className="p-2 rounded-xl text-slate-500 hover:text-primary hover:bg-slate-100 hidden lg:block"
                >
                    <Menu className="w-5 h-5" />
                </button>

                <div className="relative hidden sm:block">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search Gull Dashboard..."
                        className="pl-9 pr-4 py-1.5 text-xs bg-slate-100 rounded-xl outline-none focus:ring-2 focus:ring-primary/20 w-48 md:w-64"
                    />
                </div>
            </div>

            <div className="flex items-center gap-3">
                <button className="p-2 text-slate-500 hover:text-primary rounded-xl hover:bg-slate-100 relative">
                    <Bell className="w-5 h-5" />
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-primary-light" />
                </button>

                <div className="h-8 w-px bg-slate-200 mx-1" />

                <div className="flex items-center gap-2">
                    <div className="text-right hidden sm:block">
                        <p className="text-xs font-bold text-slate-800">John Doe</p>
                        <p className="text-[10px] text-slate-400">Super Admin</p>
                    </div>
                    <button className="p-2 text-slate-400 hover:text-rose-500 rounded-xl hover:bg-rose-50 transition-colors">
                        <LogOut className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </header>

    );
}
