"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

import {
    FiHome,
    FiCalendar,
    FiHeart,
    FiUser,
    FiSettings,
    FiLogOut,
    FiChevronDown,
    FiList,
    FiClock,
    FiCheckCircle,
    FiMapPin,
    FiStar,
    FiCreditCard,
    FiHelpCircle,
    FiShield,
    FiX
} from "react-icons/fi";

type CustomerLeftMenuProps = {
    isMobileMenuOpen: boolean;
    onCloseMobileMenu: () => void;
};

type MenuItem = {
    label: string;
    href?: string;
    icon: React.ElementType;
    children?: {
        label: string;
        href: string;
        icon: React.ElementType;
    }[];
};

const menuGroups: {
    title: string;
    items: MenuItem[];
}[] = [
        {
            title: "Overview",
            items: [
                {
                    label: "Dashboard",
                    href: "/users/dashboard",
                    icon: FiHome,
                },
            ],
        },
        {
            title: "Account",
            items: [
                {
                    label: "Account",
                    icon: FiSettings,
                    children: [

                        {
                            label: "My Profile",
                            href: "/users/update",
                            icon: FiUser,
                        },
                        {
                            label: "Change Password",
                            href: "/users/change-password",
                            icon: FiList,
                        },
                    ],
                },
                {
                    label: "Wishlist",
                    href: "/users/wishlist",
                    icon: FiHeart,
                },
                {
                    label: "Saved Venues",
                    href: "/users/saved-venues",
                    icon: FiMapPin,
                },
                {
                    label: "Reviews & Ratings",
                    href: "/users/reviews",
                    icon: FiStar,
                },
            ],
        },
        {
            title: "Support",
            items: [
                {
                    label: "Help & Support",
                    href: "/users/support",
                    icon: FiHelpCircle,
                },
                {
                    label: "Privacy & Security",
                    href: "/users/security",
                    icon: FiShield,
                },
            ],
        },
    ];

export default function CustomerLeftMenu({
    isMobileMenuOpen,
    onCloseMobileMenu,
}: CustomerLeftMenuProps) {
    const pathname = usePathname();

    const [openMenus, setOpenMenus] = useState<string[]>([
        "Change Password",
    ]);

    const toggleSubMenu = (label: string) => {
        setOpenMenus((prev) =>
            prev.includes(label)
                ? prev.filter((item) => item !== label)
                : [...prev, label]
        );
    };

    const isActive = (href?: string) => {
        if (!href) {
            return false;
        }

        return pathname === href || pathname.startsWith(`${href}/`);
    };

    const isSubMenuOpen = (label: string) => {
        return openMenus.includes(label);
    };

    const handleMenuClick = () => {
        onCloseMobileMenu();
    };

    return (
        <>
            {/* Desktop Sidebar */}
            <aside className="hidden w-72 shrink-0 lg:block">

                <div className="sticky top-0 flex h-screen flex-col bg-gradient-to-b from-primary-dark via-primary to-primary-light text-white">

                    {/* Logo / Dashboard Header */}
                    <div className="shrink-0 border-b border-white/10 px-5 py-6">

                        <div className="flex items-center gap-3">

                            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/15 shadow-inner ring-1 ring-white/20 backdrop-blur-sm">
                                <FiHeart className="h-5 w-5 fill-white/20" />
                            </div>

                            <div>
                                <h2 className="text-base font-extrabold tracking-wide">
                                    My Dashboard
                                </h2>

                                <p className="mt-0.5 text-[11px] text-white/60">
                                    Your wedding journey
                                </p>
                            </div>

                        </div>

                    </div>

                    {/* Navigation */}
                    <nav className="min-h-0 flex-1 overflow-y-auto px-3 py-5">

                        {menuGroups.map((group) => (
                            <div
                                key={group.title}
                                className="mb-2 last:mb-0"
                            >

                                {/* Group Title */}
                                {/* <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-[0.18em] text-white/40">
                                    {group.title}
                                </p> */}

                                <div className="space-y-1">

                                    {group.items.map((item) => {
                                        const Icon = item.icon;

                                        const active = isActive(item.href);

                                        const hasChildren =
                                            !!item.children?.length;

                                        const subMenuOpen =
                                            isSubMenuOpen(item.label);

                                        return (
                                            <div key={item.label}>

                                                {/* Main Menu */}
                                                {hasChildren ? (
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            toggleSubMenu(
                                                                item.label
                                                            )
                                                        }
                                                        className={`group relative flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-sm font-medium transition-all duration-300 cursor-pointer ${subMenuOpen
                                                            ? "text-white/70 hover:bg-white/10 hover:text-white"
                                                            : "text-white/70 hover:bg-white/10 hover:text-white"
                                                            }`}
                                                    >

                                                        <span className="flex items-center gap-3">

                                                            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/5 transition-all duration-300 group-hover:bg-white/15 group-hover:scale-105">
                                                                <Icon className="h-[18px] w-[18px]" />
                                                            </span>

                                                            <span>
                                                                {item.label}
                                                            </span>

                                                        </span>

                                                        <FiChevronDown
                                                            className={`h-4 w-4 transition-transform duration-300 ${subMenuOpen
                                                                ? "rotate-180"
                                                                : ""
                                                                }`}
                                                        />

                                                    </button>
                                                ) : (
                                                    <Link
                                                        href={item.href!}
                                                        onClick={handleMenuClick}
                                                        className={`group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-300 ${active
                                                            ? "bg-white/5 text-white shadow-lg shadow-black/2"
                                                            : "text-white/70 hover:bg-white/10 hover:text-white"
                                                            }`}
                                                    >

                                                        {/* Active Indicator */}
                                                        {active && (
                                                            <span className="absolute left-0 h-7 w-1 rounded-r-full bg-white" />
                                                        )}

                                                        <span
                                                            className={`flex h-9 w-9 items-center justify-center rounded-lg transition-all duration-300 ${active
                                                                ? "bg-primary/10"
                                                                : "bg-white/5 group-hover:bg-white/15 group-hover:scale-105"
                                                                }`}
                                                        >
                                                            <Icon className="h-[18px] w-[18px]" />
                                                        </span>

                                                        <span>
                                                            {item.label}
                                                        </span>

                                                    </Link>
                                                )}

                                                {/* Sub Menu */}
                                                {hasChildren && (
                                                    <div
                                                        className={`grid transition-all duration-300 ease-in-out ${subMenuOpen
                                                            ? "grid-rows-[1fr] opacity-100"
                                                            : "grid-rows-[0fr] opacity-0"
                                                            }`}
                                                    >

                                                        <div className="overflow-hidden">

                                                            <div className="relative ml-7 mt-1 space-y-1 border-l border-white/10 pl-3">

                                                                {item.children!.map(
                                                                    (subItem) => {
                                                                        const SubIcon =
                                                                            subItem.icon;

                                                                        const subActive =
                                                                            isActive(
                                                                                subItem.href
                                                                            );

                                                                        return (
                                                                            <Link
                                                                                key={
                                                                                    subItem.href
                                                                                }
                                                                                href={
                                                                                    subItem.href
                                                                                }
                                                                                onClick={
                                                                                    handleMenuClick
                                                                                }
                                                                                className={`group flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium transition-all duration-300 ${subActive
                                                                                    ? "bg-white/15 text-white"
                                                                                    : "text-white/50 hover:bg-white/10 hover:text-white"
                                                                                    }`}
                                                                            >

                                                                                <SubIcon
                                                                                    className={`h-3.5 w-3.5 transition-transform duration-300 group-hover:scale-110 ${subActive
                                                                                        ? "text-white"
                                                                                        : "text-white/40"
                                                                                        }`}
                                                                                />

                                                                                <span>
                                                                                    {
                                                                                        subItem.label
                                                                                    }
                                                                                </span>

                                                                            </Link>
                                                                        );
                                                                    }
                                                                )}

                                                            </div>

                                                        </div>

                                                    </div>
                                                )}

                                            </div>
                                        );
                                    })}

                                </div>

                            </div>
                        ))}

                    </nav>

                    {/* Logout */}
                    <div className="shrink-0 border-t border-white/10 bg-primary-dark/30 p-3">
                        <button
                            type="button"
                            className="group flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-white/70 transition-all duration-300 hover:bg-white/10 hover:text-white"
                        >
                            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/5 transition-all duration-300 group-hover:bg-white/15">
                                <FiLogOut className="h-5 w-5" />
                            </span>

                            <span>
                                Logout
                            </span>
                        </button>
                    </div>

                </div>

            </aside>

            {/* Mobile Overlay */}
            <div
                className={`fixed inset-0 z-40 bg-black/40 backdrop-blur-[2px] transition-all duration-300 lg:hidden ${isMobileMenuOpen
                    ? "visible opacity-100"
                    : "invisible opacity-0"
                    }`}
                onClick={onCloseMobileMenu}
            />

            {/* Mobile Sidebar */}
            <aside
                className={`fixed inset-y-0 left-0 z-50 w-72 transform bg-gradient-to-b from-primary-dark via-primary to-primary-light text-white shadow-2xl transition-transform duration-300 ease-out lg:hidden ${isMobileMenuOpen
                    ? "translate-x-0"
                    : "-translate-x-full"
                    }`}
            >

                {/* Mobile Header */}
                <div className="flex h-16 items-center justify-between border-b border-white/10 px-4">

                    <div className="flex items-center gap-3">

                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/15">
                            <FiHeart className="h-4 w-4" />
                        </div>

                        <div>
                            <p className="text-sm font-bold">
                                My Dashboard
                            </p>

                            <p className="text-[10px] text-white/50">
                                Wedding Journey
                            </p>
                        </div>

                    </div>

                    <button
                        type="button"
                        onClick={onCloseMobileMenu}
                        className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10 text-white transition hover:bg-white/20 active:scale-95"
                    >
                        <FiX className="h-5 w-5" />
                    </button>

                </div>

                {/* Mobile Navigation */}
                <div className="h-[calc(100vh-4rem)] overflow-y-auto">

                    <nav className="px-3 py-5">

                        {menuGroups.map((group) => (
                            <div
                                key={group.title}
                                className="mb-2"
                            >

                                {/* <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-[0.18em] text-white/40">
                                    {group.title}
                                </p> */}

                                <div className="space-y-1">

                                    {group.items.map((item) => {
                                        const Icon = item.icon;

                                        const active = isActive(item.href);

                                        const hasChildren =
                                            !!item.children?.length;

                                        const subMenuOpen =
                                            isSubMenuOpen(item.label);

                                        if (hasChildren) {
                                            return (
                                                <div key={item.label}>

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            toggleSubMenu(
                                                                item.label
                                                            )
                                                        }
                                                        className="flex w-full items-center justify-between rounded-xl px-3 py-3 text-sm font-medium text-white/70 transition-all hover:bg-white/10 hover:text-white"
                                                    >

                                                        <span className="flex items-center gap-3">

                                                            <Icon className="h-5 w-5" />

                                                            {item.label}

                                                        </span>

                                                        <FiChevronDown
                                                            className={`transition-transform duration-300 ${subMenuOpen
                                                                ? "rotate-180"
                                                                : ""
                                                                }`}
                                                        />

                                                    </button>

                                                    <div
                                                        className={`grid transition-all duration-300 ${subMenuOpen
                                                            ? "grid-rows-[1fr]"
                                                            : "grid-rows-[0fr]"
                                                            }`}
                                                    >
                                                        <div className="overflow-hidden">

                                                            <div className="ml-5 mt-1 space-y-1 border-l border-white/10 pl-3">

                                                                {item.children!.map(
                                                                    (
                                                                        subItem
                                                                    ) => {
                                                                        const SubIcon =
                                                                            subItem.icon;

                                                                        return (
                                                                            <Link
                                                                                key={
                                                                                    subItem.href
                                                                                }
                                                                                href={
                                                                                    subItem.href
                                                                                }
                                                                                onClick={
                                                                                    handleMenuClick
                                                                                }
                                                                                className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-xs text-white/50 transition hover:bg-white/10 hover:text-white"
                                                                            >
                                                                                <SubIcon className="h-4 w-4" />

                                                                                {
                                                                                    subItem.label
                                                                                }
                                                                            </Link>
                                                                        );
                                                                    }
                                                                )}

                                                            </div>

                                                        </div>
                                                    </div>

                                                </div>
                                            );
                                        }

                                        return (
                                            <Link
                                                key={item.href}
                                                href={item.href!}
                                                onClick={handleMenuClick}
                                                className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-all duration-300 ${active
                                                    ? "bg-white/5 text-white shadow-lg shadow-black/2"
                                                    : "text-white/70 hover:bg-white/10 hover:text-white"
                                                    }`}
                                            >
                                                <Icon className="h-5 w-5" />

                                                {item.label}

                                            </Link>
                                        );
                                    })}

                                </div>

                            </div>
                        ))}

                    </nav>

                    {/* Mobile Logout */}
                    <div className="border-t border-white/10 p-3">

                        <button
                            type="button"
                            className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-white/60 transition hover:bg-white/10 hover:text-white"
                        >
                            <FiLogOut className="h-5 w-5" />
                            Logout
                        </button>

                    </div>

                </div>

            </aside>
        </>
    );
}