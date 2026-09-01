"use client";

import Link from "next/link";
import { FormEvent, useEffect, useRef, useState } from "react";
import { useLogin } from "@/hooks/useLogin";

type LoginTab = "otp" | "email";

type LoginFormProps = {
    onSwitchToRegister?: () => void;
    onLoginSuccess?: () => void;
};

export function LoginForm({ onSwitchToRegister, onLoginSuccess }: LoginFormProps) {
    const [activeTab, setActiveTab] = useState<LoginTab>("otp");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [mobile, setMobile] = useState("");
    const [otp, setOtp] = useState("");
    const [otpCursor, setOtpCursor] = useState(0);
    const otpInputRef = useRef<HTMLInputElement>(null);

    const {
        loginWithEmail,
        loginWithOtp,
        sendOtp,
        loading,
        sendingOtp,
        error,
        setError,
        otpSent,
        setOtpSent,
        resendCountdown,
    } = useLogin();

    useEffect(() => {
        if (otpSent) {
            setTimeout(() => {
                otpInputRef.current?.focus();
                setOtpCursor(0);
            }, 0);
        }
    }, [otpSent]);

    async function handleSendOtp() {
        await sendOtp(mobile);
    }

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        if (activeTab === "email") {
            const success = await loginWithEmail(email, password, 'customer');

            if (success) {
                setEmail("");
                setPassword("");
                onLoginSuccess?.();
            }

            return;
        }

        if (!otpSent) {
            return;
        }

        const success = await loginWithOtp(mobile, otp, 'customer');

        if (success) {
            setMobile("");
            setOtp("");
            setOtpSent(false);
            onLoginSuccess?.();
        }
    }

    return (
        <div className="mx-auto flex w-full max-w-md flex-col gap-6 p-0 mt-6 rounded-xl border border-slate-200 bg-slate-50">
            <div className="flex flex-col bg-primary text-white px-6 py-6 rounded-tl-xl rounded-tr-xl">
                <h1 className="mt-2 mb-6 text-center font-semibold text-white">Welcome to Mukurtham</h1>
                <p className="mt-1 text-center text-sm text-white">
                    Sign in to manage bookings, wishlist & wedding plans
                </p>
            </div>

            <div className="flex">
                <button
                    type="button"
                    onClick={() => {
                        setActiveTab("otp");
                        setError("");
                        setOtp("");
                    }}
                    className={`flex-1 px-4 py-2 text-sm font-semibold transition cursor-pointer ${activeTab === "otp"
                        ? "border-b-2 border-primary text-primary"
                        : "border-b-2 border-transparent text-slate-600 hover:text-slate-900"
                        }`}
                >
                    OTP
                </button>
                <button
                    type="button"
                    onClick={() => {
                        setActiveTab("email");
                        setError("");
                        setOtp("");
                        setOtpSent(false);
                    }}
                    className={`flex-1 px-4 py-2 text-sm font-semibold transition cursor-pointer ${activeTab === "email"
                        ? "border-b-2 border-primary text-primary"
                        : "border-b-2 border-transparent text-slate-600 hover:text-slate-900"
                        }`}
                >
                    Email
                </button>
            </div>
            <div className="px-6 py-1">
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    {activeTab === "email" ? (
                        <>
                            <label className="block text-sm font-medium text-slate-700">
                                Email
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(event) => setEmail(event.target.value)}
                                    className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 outline-none transition focus:border-primary-light"
                                    placeholder="you@example.com"
                                />
                            </label>

                            <label className="block text-sm font-medium text-slate-700">
                                Password
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(event) => setPassword(event.target.value)}
                                    className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 outline-none transition focus:border-primary-light"
                                    placeholder="Enter your password"
                                />
                            </label>
                        </>
                    ) : (
                        <>
                            <div className="flex items-end gap-2">
                                <label className="block flex-1 text-sm font-medium text-slate-700">
                                    Mobile Number
                                    <input
                                        type="tel"
                                        value={mobile}
                                        onChange={(event) => setMobile(event.target.value)}
                                        className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 outline-none transition focus:border-primary-light"
                                        placeholder="Enter your mobile number"
                                    />
                                </label>

                                <button
                                    type="button"
                                    onClick={handleSendOtp}
                                    disabled={sendingOtp || !mobile || (otpSent && resendCountdown > 0)}
                                    className="whitespace-nowrap cursor-pointer rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-light disabled:cursor-not-allowed disabled:bg-secondary-light"
                                >
                                    {sendingOtp
                                        ? "Sending..."
                                        : otpSent && resendCountdown > 0
                                            ? `Resend OTP in ${resendCountdown}s`
                                            : otpSent
                                                ? "Resend OTP"
                                                : "Send OTP"}
                                </button>
                            </div>

                            {otpSent ? (
                                <label className="block text-sm font-medium text-slate-700">
                                    OTP

                                    <div className="relative mt-2">
                                        <div className="flex gap-2">
                                            {Array.from({ length: 6 }).map((_, index) => (
                                                <div
                                                    key={index}
                                                    className={`relative flex h-12 w-12 items-center justify-center rounded-xl border text-lg font-semibold transition ${otp[index]
                                                        ? "border-primary bg-primary/5 text-primary"
                                                        : "border-slate-300 bg-white text-slate-400"
                                                        }`}
                                                >
                                                    {otp[index] || ""}

                                                    {/* Cursor */}
                                                    {otpCursor === index && (
                                                        <span className="absolute h-6 w-[2px] animate-pulse bg-primary" />
                                                    )}
                                                </div>
                                            ))}
                                        </div>

                                        <input
                                            ref={otpInputRef}
                                            type="text"
                                            inputMode="numeric"
                                            autoComplete="one-time-code"
                                            maxLength={6}
                                            value={otp}
                                            onChange={(event) => {
                                                const value = event.target.value
                                                    .replace(/\D/g, "")
                                                    .slice(0, 6);

                                                setOtp(value);
                                                setOtpCursor(value.length);
                                            }}
                                            onClick={(event) => {
                                                setOtpCursor(
                                                    event.currentTarget.selectionStart ?? 0
                                                );
                                            }}
                                            onKeyUp={(event) => {
                                                setOtpCursor(
                                                    event.currentTarget.selectionStart ?? 0
                                                );
                                            }}
                                            className="absolute inset-0 h-full w-full cursor-text opacity-0"
                                            aria-label="Enter 6-digit OTP"
                                        />
                                    </div>
                                </label>
                            ) : null}
                        </>
                    )}

                    {error ? <p className="text-sm text-rose-600">{error}</p> : null}

                    <button
                        type="submit"
                        disabled={loading || (activeTab === "otp" && !otpSent)}
                        className="w-full cursor-pointer bg-primary hover:bg-primary-light rounded-xl mb-5 px-4 py-2.5 text-sm font-semibold text-white transition disabled:cursor-not-allowed disabled:bg-secondary-light"
                    >
                        {loading ? "Signing in..." : activeTab === "otp" ? "Verify & Login" : "Sign in"}
                    </button>

                    {onSwitchToRegister ? (
                        <button
                            type="button"
                            onClick={onSwitchToRegister}
                            className="cursor-pointer mb-6 text-center text-sm font-medium text-primary transition hover:text-primary hover:text-primary-dark"
                        >
                            Create an account
                        </button>
                    ) : (
                        <Link href="/register" className="cursor-pointer outline-none focus:outline-none hover:text-primary hover:text-primary-dark hover:font-semibold mb-6 text-center text-sm font-medium text-primary transition">
                            Create an account
                        </Link>
                    )}

                </form>
            </div>
        </div>
    );
}
