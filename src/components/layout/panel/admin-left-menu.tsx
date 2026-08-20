"use client";

import { useEffect, useState } from "react";
import { ShoppingBag, Settings, LayoutDashboard, CreditCard, ShieldCheck, CalendarDays } from "lucide-react";
import { usePathname } from "next/navigation";
import { useRouter } from "nextjs-toploader/app";
import PanelSidebar, { type SidebarNavItem, } from "@/components/layout/panel/panel-sidebar";

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

interface AdminLeftMenuProps {
    isMobileOpen: boolean;
    setIsMobileOpen: (open: boolean) => void;
}

export default function AdminLeftMenu({
    isMobileOpen,
    setIsMobileOpen,
}: AdminLeftMenuProps) {
    const router = useRouter();
    const pathname = usePathname();
    const [activeMainTab, setActiveMainTab] = useState("dashboard");
    const [activeSubTitle, setActiveSubTitle] = useState("Dashboard");
    const [isSecondaryOpen, setIsSecondaryOpen] = useState(true);

    // Detect current URL
    useEffect(() => {
        const currentMainItem = navItems.find((item) => {

            if (item.href && pathname.startsWith(item.href)) {
                return true;
            }

            return item.subItems?.some((sub) =>
                pathname.startsWith(sub.href)
            );
        });

        if (!currentMainItem) {
            return;
        }

        setActiveMainTab(currentMainItem.id);

        const currentSubItem = currentMainItem.subItems?.find(
            (sub) => pathname.startsWith(sub.href)
        );

        if (currentSubItem) {
            setActiveSubTitle(currentSubItem.title);
            setIsSecondaryOpen(true);
        } else {
            setActiveSubTitle(currentMainItem.title);

            if (!currentMainItem.subItems) {
                setIsSecondaryOpen(false);
            }
        }

    }, [pathname]);

    // Main menu click
    const handleMainTabClick = (itemId: string, href?: string) => {

        if (activeMainTab === itemId) {
            setIsSecondaryOpen((previous) => !previous);
        } else {
            setActiveMainTab(itemId);
            setIsSecondaryOpen(true);

            if (href) {
                router.push(href);
            }
        }
    };

    return (
        <PanelSidebar
            items={navItems}

            isMobileOpen={isMobileOpen}
            setIsMobileOpen={setIsMobileOpen}

            activeMainTab={activeMainTab}
            activeSubTitle={activeSubTitle}

            setActiveSubTitle={setActiveSubTitle}

            isSecondaryOpen={isSecondaryOpen}
            setIsSecondaryOpen={setIsSecondaryOpen}

            handleMainTabClick={handleMainTabClick}
        />
    );
}
