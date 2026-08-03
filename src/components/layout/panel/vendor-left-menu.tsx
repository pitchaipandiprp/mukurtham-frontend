"use client";
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutDashboard, Users, ShoppingBag, Settings, BarChart3, ShieldCheck, UserPlus, LogOut, Sparkles, Menu, X, Bell, Search, ChevronRight, TrendingUp, CreditCard, DollarSign, LucideIcon } from 'lucide-react';
import { useRouter } from "next/navigation";

interface SubNavItem {
    title: string;
    href: string;
    icon?: LucideIcon;
    badge?: string;
}

interface NavItem {
    id: string;
    title: string;
    icon: LucideIcon;
    subItems?: SubNavItem[];
}

const navItems: NavItem[] = [
    {
        id: 'dashboard',
        title: 'Dashboards',
        icon: LayoutDashboard,
        subItems: [
            { title: 'Dashboard', href: '/users/dashboard' },
            { title: 'Wishlist', href: '/users/wishlist' },
        ],
    },
    {
        id: 'bookings',
        title: 'Bookings',
        icon: ShoppingBag,
        subItems: [
            { title: 'Bookings Details', href: '/users/booking-details' },
            { title: 'Booking History', href: '/users/booking-history' },
        ],
    },
    {
        id: 'services',
        title: 'Services',
        icon: ShoppingBag,
        subItems: [
            { title: 'Service List', href: '/users/service-list' },
            { title: 'Add Individual Service', href: '/users/add-individual-service' },
            { title: 'Package List', href: '/users/package-list' },
            { title: 'Add Package', href: '/users/add-package' },
        ],
    },
    {
        id: 'payments',
        title: 'Payments',
        icon: CreditCard,
        subItems: [
            { title: 'Recent Payments', href: '/users/recent-payments' },
            { title: 'Payment History', href: '/users/payment-history' },
        ],
    },
    {
        id: 'settings',
        title: 'Settings',
        icon: Settings,
        subItems: [
            { title: 'Profile Settings', href: '/users/change-profile' },
            { title: 'Security & Auth', href: '/users/change-password' },
            { title: 'Business Profile', href: '/users/business-profile' },
            { title: 'Verification Documents', href: '/users/upload-verification-documents' },
        ],
    },
    {
        id: 'support',
        title: 'Support',
        icon: ShieldCheck,
        subItems: [
            { title: 'Enquiries', href: '/users/enquiry-list' },
            { title: 'Reviews', href: '/users/review-list' },
            { title: 'Support Tickets', href: '/users/support-ticket-list' },
        ],
    },
];

export interface VendorLeftMenuProps {
    isMobileOpen: boolean;
    setIsMobileOpen: (open: boolean) => void;
    activeMainTab: string;
    activeSubTitle: string;
    setActiveSubTitle: (title: string) => void;
    isSecondaryOpen: boolean;
    setIsSecondaryOpen: (open: boolean) => void;
    handleMainTabClick: (itemId: string) => void;
}


export default function VendorLeftMenu({
    isMobileOpen,
    setIsMobileOpen,
    activeMainTab,
    activeSubTitle,
    setActiveSubTitle,
    isSecondaryOpen,
    setIsSecondaryOpen,
    handleMainTabClick,
}: VendorLeftMenuProps) {
    const router = useRouter();

    const goToPage = (href: string) => {
        router.push(href);
    };

    const selectedMainItem = navItems.find((item) => item.id === activeMainTab);

    return (
        <aside className={`fixed lg:static inset-y-0 left-0 z-50 flex bg-primary text-white transition-transform duration-300 ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
            }`}>
            <div className="w-20 bg-primary border-r border-primary-darker/60 flex flex-col justify-between items-center py-5 shrink-0 z-20">

                {/* Logo Header */}
                <div className="h-10 w-10 rounded-2xl bg-white text-primary flex items-center justify-center shadow-lg shadow-black/20 font-black">
                    <Sparkles className="w-6 h-6 text-primary" />
                </div>

                {/* Icon Navigation Rails */}
                <nav className="space-y-4 my-auto w-full px-2 py-5 h-full">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = activeMainTab === item.id;

                        return (
                            <button
                                key={item.id}
                                onClick={() => handleMainTabClick(item.id)}
                                className={`cursor-pointer w-full py-3 px-1 rounded-2xl flex flex-col items-center justify-center gap-1 transition-all duration-200 group ${isActive
                                    ? 'bg-primary text-white shadow-lg shadow-primary-darker/50 font-semibold'
                                    : 'text-white/70 hover:bg-white/10 hover:text-white'
                                    }`}
                            >
                                <Icon className={`w-5 h-5 transition-transform duration-200 ${isActive ? 'scale-110' : 'group-hover:scale-105'}`} />
                                <span className="text-[10px] tracking-tight">{item.title}</span>
                            </button>
                        );
                    })}
                </nav>

                {/* Profile Quick Toggle */}
                <div className="relative group rounded-lg bg-white transition hover:bg-primary cursor-pointer">
                    <img
                        src="/images/profile.svg"
                        alt="User"
                        className="w-9 h-9 rounded-lg object-cover transition group-hover:brightness-0 group-hover:invert"
                    />
                </div>
            </div>

            {/* Gull Submenu Secondary Sliding Panel */}
            <AnimatePresence initial={false}>
                {isSecondaryOpen && selectedMainItem?.subItems && (
                    <motion.div
                        initial={{ width: 0, opacity: 0 }}
                        animate={{ width: 220, opacity: 1 }}
                        exit={{ width: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: 'easeInOut' }}
                        className="bg-white border-r border-slate-200 text-slate-800 flex flex-col justify-between overflow-hidden z-10"
                    >
                        <div className="p-4">
                            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
                                <h3 className="text-xs font-black uppercase tracking-wider text-primary">
                                    {selectedMainItem.title}
                                </h3>
                                <button
                                    onClick={() => setIsSecondaryOpen(false)}
                                    className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 hidden lg:block cursor-pointer transition-colors"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>

                            {/* Submenu List */}
                            <div className="space-y-1">
                                {selectedMainItem.subItems.map((sub) => {
                                    const SubIcon = sub.icon;
                                    const isActive = activeSubTitle === sub.title;

                                    return (
                                        <button
                                            key={sub.title}
                                            onClick={() => {
                                                setActiveSubTitle(sub.title);
                                                setIsMobileOpen(false);
                                                goToPage(sub.href); // Navigate to the subpage
                                            }}
                                            className={`w-full cursor-pointer flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${isActive
                                                ? 'bg-primary/10 text-primary font-bold'
                                                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
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

                                            {isActive && <ChevronRight className="w-3.5 h-3.5 text-primary" />}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Gull Style Bottom Help Box */}
                        {/* <div className="p-4 m-3 rounded-2xl bg-gradient-to-br from-primary to-primary-dark text-white text-xs">
                            <p className="font-bold mb-1">Gull Features</p>
                            <p className="text-[10px] text-white/80 leading-relaxed mb-3">Multi-sidebar integration with smooth state management.</p>
                            <button className="w-full py-1.5 bg-white text-primary rounded-xl font-bold text-[10px] shadow-sm hover:bg-slate-100 transition-colors">
                                Upgrade Plan
                            </button>
                        </div> */}
                    </motion.div>
                )}
            </AnimatePresence>
        </aside>
    );
}
