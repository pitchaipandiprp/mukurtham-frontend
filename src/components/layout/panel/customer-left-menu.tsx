"use client";

import { useEffect, useState } from "react";
import { ShoppingBag, Settings, LayoutDashboard, CreditCard, ShieldCheck } from "lucide-react";
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

interface CustomerLeftMenuProps {
    isMobileOpen: boolean;
    setIsMobileOpen: (open: boolean) => void;
}

export default function CustomerLeftMenu({
    isMobileOpen,
    setIsMobileOpen,
}: CustomerLeftMenuProps) {
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
