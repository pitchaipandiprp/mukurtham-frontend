"use client";

import { CalendarDays, CreditCard, LayoutDashboard, Settings, ShieldCheck } from "lucide-react";
import PanelSidebar, { type SidebarNavItem } from "@/components/layout/panel/panel-sidebar";

const navItems: SidebarNavItem[] = [
    {
        id: "dashboard",
        title: "Dashboards",
        icon: LayoutDashboard,
        subItems: [
            { title: "Dashboard", href: "/panel/dashboard" },
            { title: "Vendors", href: "/panel/vendor-list" },
            { title: "Customer", href: "/panel/customer-list" },
        ],
    },
    {
        id: "payments",
        title: "Payments",
        icon: CreditCard,
        subItems: [{ title: "Payment History", href: "/panel/payment-history" }],
    },
    {
        id: "service-date",
        title: "Service",
        icon: CalendarDays,
        subItems: [
            { title: "Service Date List", href: "/panel/service-date-list" },
            { title: "Add Service Date", href: "/panel/create-service-date" },
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
    {
        id: "support",
        title: "Support",
        icon: ShieldCheck,
        subItems: [
            { title: "Enquiries", href: "/panel/enquiry-list" },
            { title: "Reviews", href: "/panel/review-list" },
            { title: "Support Tickets", href: "/panel/support-ticket-list" },
        ],
    },
];

export interface AdminLeftMenuProps {
    isMobileOpen: boolean;
    setIsMobileOpen: (open: boolean) => void;
    activeMainTab: string;
    activeSubTitle: string;
    setActiveSubTitle: (title: string) => void;
    isSecondaryOpen: boolean;
    setIsSecondaryOpen: (open: boolean) => void;
    handleMainTabClick: (itemId: string) => void;
}

export default function AdminLeftMenu(props: AdminLeftMenuProps) {
    return <PanelSidebar {...props} items={navItems} />;
}
