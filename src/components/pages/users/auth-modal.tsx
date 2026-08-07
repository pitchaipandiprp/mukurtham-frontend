"use client";

import { useEffect, useState } from "react";
import { LoginForm } from "@/components/pages/users/login-form";
import { RegisterForm } from "@/components/pages/users/register-form";
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

        /*const previousOverflow = document.body.style.overflow;
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                onClose();
            }
        };

        document.body.style.overflow = "hidden";
        window.addEventListener("keydown", handleKeyDown);

        return () => {
            document.body.style.overflow = previousOverflow;
            window.removeEventListener("keydown", handleKeyDown);
        };*/
    }, [defaultView, isOpen, onClose]);

    if (!isOpen) {
        return null;
    }

    return (
        <div className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm" role="dialog" aria-modal="true" aria-label="Authentication">
            {/* <button
                type="button"
                onClick={onClose}
                aria-label="Close authentication modal"
                className="absolute inset-0"
            /> */}

            <div className="pointer-events-none relative flex min-h-full items-center justify-center px-4 py-6">
                <div className="pointer-events-auto relative w-full max-w-md max-h-[calc(100vh-2rem)] overflow-y-auto">
                    <button
                        type="button"
                        onClick={onClose}
                        // className="absolute cursor-pointer right-1 top-7 z-20 flex h-8 w-8 items-center justify-center rounded-full bg-primary-dark shadow-lg text-white transition hover:bg-secondary-light hover:text-white focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                        // aria-label="Close authentication modal"
                        className="absolute right-2 top-7 z-20 flex h-8 w-8 items-center justify-center text-xl rounded-full bg-primary-dark text-white cursor-pointer hover:bg-primary-light"
                    >
                        <FiX className="w-5 h-5" />
                    </button>

                    {activeView === "login" ? (
                        <LoginForm
                            onSwitchToRegister={() => setActiveView("register")}
                            onLoginSuccess={onClose}
                        />
                    ) : (
                        <RegisterForm
                            onSwitchToLogin={() => setActiveView("login")}
                            onRegisterSuccess={() => setActiveView("login")}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}