"use client";

import { FiX } from "react-icons/fi";
import { AnimatePresence, motion } from "framer-motion";

interface PopupModalProps {
    show: boolean;
    title?: string;
    children: React.ReactNode;
    onClose: () => void;

    width?: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "5xl" | "6xl" | "7xl";
    position?: "center" | "top";
    blurBackground?: boolean;

    showHeader?: boolean;
    showFooter?: boolean;
    closeButtonText?: string;
    footerContent?: React.ReactNode;
}

export default function PopupModal({
    show,
    title = "",
    children,
    onClose,

    width = "md",
    position = "top",
    blurBackground = false,

    showHeader = true,
    showFooter = true,
    closeButtonText = "Close",
    footerContent,
}: PopupModalProps) {
    const widthClass = {
        sm: "max-w-sm",
        md: "max-w-md",
        lg: "max-w-lg",
        xl: "max-w-xl",
        "2xl": "max-w-2xl",
        "3xl": "max-w-3xl",
        "4xl": "max-w-4xl",
        "5xl": "max-w-5xl",
        "6xl": "max-w-6xl",
        "7xl": "max-w-7xl",
    }[width];

    const positionClass =
        position === "center"
            ? "items-center py-6"
            : "items-start pt-10 pb-6";

    return (
        <AnimatePresence>
            {show && (
                <motion.div
                    className={`fixed inset-0 z-[1000] flex justify-center bg-black/50 ${blurBackground
                        ? "backdrop-blur-sm"
                        : ""
                        } p-4 ${positionClass}`}
                    role="dialog"
                    aria-modal="true"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{
                        duration: 0.2,
                    }}
                >
                    <motion.div
                        className={`relative w-full ${widthClass} max-h-[calc(100vh-4rem)] overflow-y-auto rounded-xl border border-slate-200 bg-slate-50 shadow-2xl`}
                        initial={{
                            opacity: 0,
                            scale: 0.9,
                            y: position === "center" ? 20 : -20,
                        }}
                        animate={{
                            opacity: 1,
                            scale: 1,
                            y: 0,
                        }}
                        exit={{
                            opacity: 0,
                            scale: 0.9,
                            y: position === "center" ? 20 : -20,
                        }}
                        transition={{
                            duration: 0.25,
                            ease: "easeOut",
                        }}
                    >
                        {/* Header */}
                        {showHeader && (
                            <div className="flex items-center justify-between border-b bg-primary px-5 py-4">
                                <h5 className="text-lg font-semibold text-white">
                                    {title}
                                </h5>

                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="cursor-pointer rounded-full bg-primary-dark p-1 text-white transition hover:bg-primary-light"
                                    aria-label="Close"
                                >
                                    <FiX className="h-5 w-5" />
                                </button>
                            </div>
                        )}

                        {/* Body */}
                        <div className="px-5 py-6 text-sm text-gray-600 text-justify">
                            {children}
                        </div>

                        {/* Footer */}
                        {showFooter && (
                            <div className="flex justify-end gap-2 border-t border-gray-200 px-5 py-4">
                                {footerContent || (
                                    <button
                                        type="button"
                                        onClick={onClose}
                                        className="cursor-pointer rounded-md border border-gray-300 px-4 py-2 text-sm text-gray-700 transition hover:bg-gray-100"
                                    >
                                        {closeButtonText}
                                    </button>
                                )}
                            </div>
                        )}
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}