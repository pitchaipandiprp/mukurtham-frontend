"use client";

import Link from "next/link";
import { FiMail, FiMapPin, FiPhone } from "react-icons/fi";
import { FiHome, FiSearch, FiCalendar, FiHeart, FiUser, } from "react-icons/fi";
import { useAuthUser } from "@/hooks/useAuthUser";

export function Footer() {
    const { isAuthenticated } = useAuthUser();

    return (
        <footer className="mt-10 bg-gradient-to-br from-red-600 via-pink-700 to-amber-600 text-white">
            <div className="mx-auto max-w-7xl px-4 py-10">
                <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
                    <div>
                        <div className="mb-3 flex items-center gap-2">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 font-bold text-white">
                                M
                            </div>
                            <span className="font-extrabold tracking-wider">MUKURTHAM</span>
                        </div>
                        <p className="text-sm leading-relaxed text-white/90">
                            Make every wedding moment magical with trusted vendors, creative planning, and joyful celebrations.
                        </p>
                    </div>

                    <div>
                        <h4 className="mb-3 text-sm font-semibold">Quick Links</h4>
                        <ul className="space-y-2 text-sm text-white/90">
                            <li><Link href="/" className="transition hover:text-yellow-200">Home</Link></li>
                            <li><Link href="/new-design" className="transition hover:text-yellow-200">Vendors</Link></li>
                            <li><Link href="/new-design" className="transition hover:text-yellow-200">Venues</Link></li>
                            <li><Link href="/new-design" className="transition hover:text-yellow-200">Planner</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="mb-3 text-sm font-semibold">Services</h4>
                        <ul className="space-y-2 text-sm text-white/90">
                            <li><Link href="/new-design" className="transition hover:text-yellow-200">Wedding Decor</Link></li>
                            <li><Link href="/new-design" className="transition hover:text-yellow-200">Photography</Link></li>
                            <li><Link href="/new-design" className="transition hover:text-yellow-200">Catering</Link></li>
                            <li><Link href="/new-design" className="transition hover:text-yellow-200">Bridal Makeup</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="mb-3 text-sm font-semibold">Contact</h4>
                        <ul className="space-y-2 text-sm text-white/90">
                            <li className="flex items-center gap-2"><FiMapPin /><span>Chennai, Tamil Nadu</span></li>
                            <li className="flex items-center gap-2"><FiPhone /><span>+91 98765 43210</span></li>
                            <li className="flex items-center gap-2"><FiMail /><span>support@mukurtham.com</span></li>
                        </ul>
                    </div>
                </div>

                <div className="mt-8 flex flex-col items-center justify-between gap-3 border-t border-white/20 pt-4 text-xs text-white/85 sm:flex-row">
                    <p>Copyright 2026 Mukurtham. All rights reserved.</p>
                    <div className="flex items-center gap-4">
                        <Link href="/new-design" className="transition hover:text-yellow-200">Privacy Policy</Link>
                        <Link href="/new-design" className="transition hover:text-yellow-200">Terms of Service</Link>
                    </div>
                </div>
            </div>


            <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-gray-200 bg-white shadow-lg md:hidden">
                <div className="mx-auto flex h-16 max-w-md items-center justify-around">
                    <Link href="/" className="flex flex-col items-center gap-1 text-primary cursor-pointer">
                        <FiHome className="h-5 w-5" />
                        <span className="text-[10px] font-medium">Home</span>
                    </Link>
                    <Link href="/category-search" className="flex flex-col items-center gap-1 text-gray-500 cursor-pointer">
                        <FiSearch className="h-5 w-5" />
                        <span className="text-[10px] font-medium">Search</span>
                    </Link>

                    {isAuthenticated && (
                        <>
                            <Link href="/users/bookings" className="flex flex-col items-center gap-1 text-gray-500 cursor-pointer">
                                <FiCalendar className="h-5 w-5" />
                                <span className="text-[10px] font-medium">Bookings</span>
                            </Link>

                            <Link href="/users/wishlist" className="flex flex-col items-center gap-1 text-gray-500 cursor-pointer">
                                <FiHeart className="h-5 w-5" />
                                <span className="text-[10px] font-medium">Wishlist</span>
                            </Link>

                            <Link href="/users/profile" className="flex flex-col items-center gap-1 text-gray-500 cursor-pointer">
                                <FiUser className="h-5 w-5" />
                                <span className="text-[10px] font-medium">Profile</span>
                            </Link>
                        </>
                    )}



                </div>
            </nav>
        </footer>
    );
}
