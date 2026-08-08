"use client";

import React, { useState } from 'react';
import PanelFooter from '@/components/layout/panel/panel-footer';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthRedirect } from '@/hooks/useAuthRedirect';
import { useAuthUser } from '@/hooks/useAuthUser';
import CustomerLeftMenu from '@/components/layout/panel/customer-left-menu';
import VendorLeftMenu from '@/components/layout/panel/vendor-left-menu';
import AdminLeftMenu from '@/components/layout/panel/admin-left-menu';
import PanelHeader from '@/components/layout/panel/panel-header';
import MobileBottomNav from '@/components/layout/main/mobile-bottom-nav';


export default function PanelLayout({
    children,
}: { children: React.ReactNode }) {
    useAuthRedirect();

    const { userRole } = useAuthUser();

    const [activeMainTab, setActiveMainTab] = useState<string>('dashboard');
    const [activeSubTitle, setActiveSubTitle] = useState('Dashboard');
    const [isSecondaryOpen, setIsSecondaryOpen] = useState(true);
    const [isMobileOpen, setIsMobileOpen] = useState(false);

    const handleMainTabClick = (itemId: string) => {
        if (activeMainTab === itemId) {
            setIsSecondaryOpen(!isSecondaryOpen);
        } else {
            setActiveMainTab(itemId);
            setIsSecondaryOpen(true);
        }
    };

    return (
        <div className="flex h-screen bg-slate-100 font-sans overflow-hidden">

            {/* Mobile Backdrop */}
            <AnimatePresence>
                {isMobileOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsMobileOpen(false)}
                        className="fixed inset-0 bg-primary/80 backdrop-blur-sm z-40 lg:hidden"
                    />
                )}
            </AnimatePresence>

            {/* Left Menu */}
            {userRole === "customer" && (
                <CustomerLeftMenu
                    isMobileOpen={isMobileOpen}
                    setIsMobileOpen={setIsMobileOpen}
                    activeMainTab={activeMainTab}
                    activeSubTitle={activeSubTitle}
                    setActiveSubTitle={setActiveSubTitle}
                    isSecondaryOpen={isSecondaryOpen}
                    setIsSecondaryOpen={setIsSecondaryOpen}
                    handleMainTabClick={handleMainTabClick}
                />
            )}

            {userRole === "vendor" && (
                <VendorLeftMenu
                    isMobileOpen={isMobileOpen}
                    setIsMobileOpen={setIsMobileOpen}
                    activeMainTab={activeMainTab}
                    activeSubTitle={activeSubTitle}
                    setActiveSubTitle={setActiveSubTitle}
                    isSecondaryOpen={isSecondaryOpen}
                    setIsSecondaryOpen={setIsSecondaryOpen}
                    handleMainTabClick={handleMainTabClick}
                />
            )}

            {userRole === "admin" && (
                <AdminLeftMenu
                    isMobileOpen={isMobileOpen}
                    setIsMobileOpen={setIsMobileOpen}
                    activeMainTab={activeMainTab}
                    activeSubTitle={activeSubTitle}
                    setActiveSubTitle={setActiveSubTitle}
                    isSecondaryOpen={isSecondaryOpen}
                    setIsSecondaryOpen={setIsSecondaryOpen}
                    handleMainTabClick={handleMainTabClick}
                />
            )}


            {/* Main Content Dashboard */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

                {/* Header */}
                <PanelHeader
                    setIsMobileOpen={() => setIsMobileOpen(true)}
                    setIsSecondaryOpen={() => setIsSecondaryOpen(!isSecondaryOpen)}
                />

                {/* Dashboard */}
                <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
                    {children}
                </main>

                {/* Footer */}
                <PanelFooter />
                <MobileBottomNav />
            </div>

        </div>
    );
}