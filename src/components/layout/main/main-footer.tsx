"use client";

import Link from "next/link";
import { FiMail, FiMapPin, FiPhone } from "react-icons/fi";

export function MainFooter() {

    return (
        <footer className="relative mt-5 overflow-hidden bg-primary text-white">
            <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/10" />
            <div className="absolute -bottom-32 -left-20 h-80 w-80 rounded-full bg-white/10" />

            <div className="relative z-10 mx-auto max-w-7xl px-4 py-10">
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
                            <li><Link href="/about-us" className="transition hover:text-yellow-200">About</Link></li>
                            <li><Link href="/service-search" className="transition hover:text-yellow-200">Venues</Link></li>
                            <li><Link href="/service-search" className="transition hover:text-yellow-200">Categories</Link></li>
                            <li><Link href="/contact-us" className="transition hover:text-yellow-200">Contact</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="mb-3 text-sm font-semibold">Services</h4>
                        <ul className="space-y-2 text-sm text-white/90">
                            <li><Link href="/service-search?search=Wedding" className="transition hover:text-yellow-200">Wedding Decor</Link></li>
                            <li><Link href="/service-search?search=Photography" className="transition hover:text-yellow-200">Photography</Link></li>
                            <li><Link href="/service-search?search=Catering" className="transition hover:text-yellow-200">Catering</Link></li>
                            <li><Link href="/service-search?search=Decoration" className="transition hover:text-yellow-200">Bridal Makeup</Link></li>
                            <li><Link href="/register" className="transition rounded bg-white text-primary px-1 py-1">Become a Vendor</Link></li>
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
        </footer>
    );
}
