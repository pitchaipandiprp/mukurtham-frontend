"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Sparkles, X, type LucideIcon } from "lucide-react";
import { useRouter } from "nextjs-toploader/app";

export interface SidebarSubNavItem {
    title: string;
    href: string;
    icon?: LucideIcon;
    badge?: string;
}

export interface SidebarNavItem {
    id: string;
    title: string;
    icon: LucideIcon;
    href?: string;
    subItems?: SidebarSubNavItem[];
}

export interface PanelSidebarProps {
    items: SidebarNavItem[];
    isMobileOpen: boolean;
    setIsMobileOpen: (open: boolean) => void;
    activeMainTab: string;
    activeSubTitle: string;
    setActiveSubTitle: (title: string) => void;
    isSecondaryOpen: boolean;
    setIsSecondaryOpen: (open: boolean) => void;
    handleMainTabClick: (itemId: string, href?: string) => void;
}

export default function PanelSidebar({
    items,
    isMobileOpen,
    setIsMobileOpen,
    activeMainTab,
    activeSubTitle,
    setActiveSubTitle,
    isSecondaryOpen,
    setIsSecondaryOpen,
    handleMainTabClick,
}: PanelSidebarProps) {
    const router = useRouter();
    const selectedMainItem = items.find((item) => item.id === activeMainTab);

    const goToPage = (href: string) => {
        router.push(href);
    };

    return (
        <aside
            className={`fixed lg:static inset-y-0 left-0 z-50 flex bg-primary text-white transition-transform duration-300 ${isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
                }`}
        >
            <div className="w-20 bg-primary border-r border-primary-darker/60 flex flex-col justify-between items-center py-5 shrink-0 z-20">
                {/* <div className="h-10 w-10 rounded-2xl bg-white text-primary flex items-center justify-center shadow-lg shadow-black/20 font-black">
                    <Sparkles className="w-6 h-6 text-primary" />
                </div> */}

                <div className="h-12 w-12 bg-white rounded-lg">
                    <img src="/images/logo-sm.jpg" className="rounded-lg" />
                </div>


                <nav className="space-y-4 my-auto w-full px-2 py-5 h-full">
                    {items.map((item) => {
                        const Icon = item.icon;
                        const isActive = activeMainTab === item.id;

                        return (
                            <button
                                key={item.id}
                                type="button"
                                onClick={() => handleMainTabClick(item.id, item.href)}
                                className={`cursor-pointer w-full py-3 px-1 rounded-2xl flex flex-col items-center justify-center gap-1 transition-all duration-200 group ${isActive
                                    ? "bg-primary text-white shadow-lg shadow-primary-darker/50 font-semibold"
                                    : "text-white/70 hover:bg-white/10 hover:text-white"
                                    }`}
                            >
                                <Icon
                                    className={`w-5 h-5 transition-transform duration-200 ${isActive ? "scale-110" : "group-hover:scale-105"
                                        }`}
                                />
                                <span className="text-[10px] tracking-tight">{item.title}</span>
                            </button>
                        );
                    })}
                </nav>

                {/* <div className="relative group rounded-lg bg-white transition hover:bg-primary cursor-pointer">
                    <img
                        src="/images/profile.svg"
                        alt="User"
                        className="w-9 h-9 rounded-lg object-cover transition group-hover:brightness-0 group-hover:invert"
                    />
                </div> */}
            </div>

            <AnimatePresence initial={false}>
                {isSecondaryOpen && selectedMainItem?.subItems && (
                    <motion.div
                        initial={{ width: 0, opacity: 0 }}
                        animate={{ width: 220, opacity: 1 }}
                        exit={{ width: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: "easeInOut" }}
                        className="bg-white border-r border-slate-200 text-slate-800 flex flex-col justify-between overflow-hidden z-10"
                    >
                        <div className="p-0">
                            <div className="flex items-center justify-between p-4 mb-4 border-b border-slate-100">
                                <h3 className="text-xs font-black uppercase tracking-wider text-primary">
                                    {selectedMainItem.title}
                                </h3>
                                <button
                                    type="button"
                                    onClick={() => setIsSecondaryOpen(false)}
                                    className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 hidden lg:block cursor-pointer transition-colors"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>

                            <div className="space-y-1">
                                {selectedMainItem.subItems.map((sub) => {
                                    const SubIcon = sub.icon;
                                    const isActive = activeSubTitle === sub.title;

                                    return (
                                        <button
                                            key={sub.title}
                                            type="button"
                                            onClick={() => {
                                                setActiveSubTitle(sub.title);
                                                setIsMobileOpen(false);
                                                goToPage(sub.href);
                                            }}
                                            className={`w-full cursor-pointer flex items-center justify-between m-0 px-3 py-3 text-xs font-semibold transition-all border-b border-b-slate-200 ${isActive
                                                ? "bg-primary/10 text-primary font-bold"
                                                : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                                                }`}
                                        >
                                            <div className="flex items-center gap-2.5">
                                                {SubIcon && <SubIcon className="w-4 h-4" />}
                                                <span>{sub.title}</span>
                                            </div>

                                            {sub.badge && (
                                                <span className="px-2 py-0.5 text-[9px] font-extrabold bg-primary text-white rounded-full">
                                                    {sub.badge}
                                                </span>
                                            )}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </aside>
    );
}
