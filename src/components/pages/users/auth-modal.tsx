"use client";

import { useEffect, useState } from "react";
import { LoginForm } from "@/components/pages/users/login-form";
import { RegisterForm } from "@/components/pages/users/register-form";
import { AnimatePresence, motion } from "framer-motion";
import { FiX } from "react-icons/fi";

type AuthView = "login" | "register";

type AuthModalProps = {
    isOpen: boolean;
    onClose: () => void;
    defaultView?: AuthView;
};

export function AuthModal({ isOpen, onClose, defaultView = "login" }: AuthModalProps) {
    const [activeView, setActiveView] = useState<AuthView>(defaultView);

    useEffect(() => {
        if (!isOpen) {
            return;
        }

        setActiveView(defaultView);
    }, [defaultView, isOpen, onClose]);

    if (!isOpen) {
        return null;
    }

    return (
        <AnimatePresence>
            <motion.div
                className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm"
                role="dialog"
                aria-modal="true"
                aria-label="Authentication"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
            >
                <div className="pointer-events-none relative flex min-h-full items-center justify-center px-4 py-6">
                    <motion.div
                        className="pointer-events-auto relative w-full max-w-md max-h-[calc(100vh-2rem)] overflow-y-auto"
                        initial={{
                            opacity: 0,
                            scale: 0.9,
                            y: 20,
                        }}
                        animate={{
                            opacity: 1,
                            scale: 1,
                            y: 0,
                        }}
                        exit={{
                            opacity: 0,
                            scale: 0.9,
                            y: 20,
                        }}
                        transition={{
                            duration: 0.25,
                            ease: "easeOut",
                        }}
                    >
                        {/* Close Button */}
                        <motion.button
                            type="button"
                            onClick={onClose}
                            className="absolute right-2 top-7 z-20 flex h-8 w-8 items-center justify-center rounded-full bg-primary-dark text-xl text-white cursor-pointer hover:bg-primary-light"
                            whileHover={{
                                scale: 1.1,
                            }}
                            whileTap={{
                                scale: 0.9,
                            }}
                            aria-label="Close"
                        >
                            <FiX className="h-5 w-5" />
                        </motion.button>

                        {/* Login / Register */}
                        <AnimatePresence mode="wait">
                            {activeView === "login" ? (
                                <motion.div
                                    key="login"
                                    initial={{
                                        opacity: 0,
                                        x: -30,
                                    }}
                                    animate={{
                                        opacity: 1,
                                        x: 0,
                                    }}
                                    exit={{
                                        opacity: 0,
                                        x: 30,
                                    }}
                                    transition={{
                                        duration: 0.2,
                                    }}
                                >
                                    <LoginForm
                                        onSwitchToRegister={() =>
                                            setActiveView("register")
                                        }
                                        onLoginSuccess={onClose}
                                    />
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="register"
                                    initial={{
                                        opacity: 0,
                                        x: 30,
                                    }}
                                    animate={{
                                        opacity: 1,
                                        x: 0,
                                    }}
                                    exit={{
                                        opacity: 0,
                                        x: -30,
                                    }}
                                    transition={{
                                        duration: 0.2,
                                    }}
                                >
                                    <RegisterForm
                                        onSwitchToLogin={() =>
                                            setActiveView("login")
                                        }
                                        onRegisterSuccess={() =>
                                            setActiveView("login")
                                        }
                                    />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                </div>
            </motion.div>
        </AnimatePresence>
    );
}