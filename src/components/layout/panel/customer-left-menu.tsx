"use client";

import { CreditCard, LayoutDashboard, Settings, ShieldCheck, ShoppingBag } from "lucide-react";
import PanelSidebar, { type SidebarNavItem } from "@/components/layout/panel/panel-sidebar";

const navItems: SidebarNavItem[] = [
    {
        id: "dashboard",
        title: "Dashboards",
        icon: LayoutDashboard,
        subItems: [
            { title: "Dashboard", href: "/panel/dashboard" },
            { title: "Wishlist", href: "/panel/wishlist" },
        ],
    },
    {
        id: "bookings",
        title: "Bookings",
        icon: ShoppingBag,
        subItems: [
            { title: "Recent Bookings", href: "/panel/bookings" },
            { title: "Booking History", href: "/panel/bookings" },
        ],
    },
    {
        id: "payments",
        title: "Payments",
        icon: CreditCard,
        subItems: [
            { title: "Recent Payments", href: "/panel/payments" },
            { title: "Payment History", href: "/panel/payments" },
        ],
    },
    {
        id: "support",
        title: "Support",
        icon: ShieldCheck,
        subItems: [
            { title: "My Enquiries", href: "/panel/support" },
            { title: "My Reviews", href: "/panel/support" },
            { title: "My Support Tickets", href: "/panel/support" },
        ],
    },
    {
        id: "settings",
        title: "Settings",
        icon: Settings,
        subItems: [
            { title: "Profile Settings", href: "/panel/change-profile" },
            { title: "Security & Auth", href: "/panel/change-password" },
        ],
    },
];

export interface CustomerLeftMenuProps {
    isMobileOpen: boolean;
    setIsMobileOpen: (open: boolean) => void;
    activeMainTab: string;
    activeSubTitle: string;
    setActiveSubTitle: (title: string) => void;
    isSecondaryOpen: boolean;
    setIsSecondaryOpen: (open: boolean) => void;
    handleMainTabClick: (itemId: string) => void;
}

export default function CustomerLeftMenu(props: CustomerLeftMenuProps) {
    return <PanelSidebar {...props} items={navItems} />;
}
