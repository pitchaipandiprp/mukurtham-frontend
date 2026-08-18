"use client";

import { CreditCard, LayoutDashboard, Settings, ShieldCheck, ShoppingBag } from "lucide-react";
import PanelSidebar, { type SidebarNavItem } from "@/components/layout/panel/panel-sidebar";

const navItems: SidebarNavItem[] = [
    {
        id: "dashboard",
        title: "Dashboards",
        icon: LayoutDashboard,
        href: "/panel/dashboard",
    },
    {
        id: "business",
        title: "Business",
        icon: ShoppingBag,
        subItems: [
            { title: "Business List", href: "/panel/category-service-list" },
            { title: "Add Business", href: "/panel/create-category-service" },
        ],
    },
    {
        id: "settings",
        title: "Settings",
        icon: Settings,
        subItems: [
            { title: "Profile Settings", href: "/panel/change-profile" },
            { title: "Security & Auth", href: "/panel/change-password" },
            { title: "Business Profile", href: "/panel/business-profile" },
            { title: "Verification Documents", href: "/panel/upload-verification-documents" },
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

export default function VendorLeftMenu(props: VendorLeftMenuProps) {
    return <PanelSidebar {...props} items={navItems} />;
}
