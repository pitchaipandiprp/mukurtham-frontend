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
    }, [defaultView, isOpen, onClose]);

    if (!isOpen) {
        return null;
    }

    return (
        <div className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm animate-fade-in" role="dialog" aria-modal="true" aria-label="Authentication">
            <div className="pointer-events-none relative flex min-h-full items-center justify-center px-4 py-6">
                <div className="pointer-events-auto relative w-full max-w-md max-h-[calc(100vh-2rem)] overflow-y-auto">
                    <button
                        type="button"
                        onClick={onClose}
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