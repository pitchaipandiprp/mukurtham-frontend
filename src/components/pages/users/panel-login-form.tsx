"use client";

import Link from "next/link";
import { FormEvent, useEffect, useRef, useState } from "react";
import { useLogin } from "@/hooks/useLogin";

type LoginTab = "otp" | "email";

type LoginFormProps = {
    role: "admin" | "vendor" | "customer";
    onSwitchToRegister?: () => void;
    onLoginSuccess?: () => void;
};

export function PanelLoginForm({ role, onSwitchToRegister, onLoginSuccess }: LoginFormProps) {
    const [activeTab, setActiveTab] = useState<LoginTab>("otp");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [mobile, setMobile] = useState("");
    const [otp, setOtp] = useState("");
    const [otpCursor, setOtpCursor] = useState(0);
    const otpInputRef = useRef<HTMLInputElement>(null);

    let redirectTo = '/panel/dashboard';
    if (role === 'customer') {
        redirectTo = '/user/dashboard';
    }

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
    } = useLogin(redirectTo);

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
            const success = await loginWithEmail(email, password, role);

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

        const success = await loginWithOtp(mobile, otp, role);

        if (success) {
            setMobile("");
            setOtp("");
            setOtpSent(false);
            onLoginSuccess?.();
        }
    }

    return (
        <div className="min-h-screen bg-slate-100 px-4 py-8 sm:px-6 lg:px-8">
            <div className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-5xl items-center justify-center">

                <div className="grid w-full overflow-hidden rounded-3xl bg-white shadow-2xl shadow-slate-200/60 lg:grid-cols-2">

                    {/* Left-Branding */}
                    <div className="relative hidden overflow-hidden bg-primary p-10 lg:flex lg:flex-col lg:justify-between">

                        {/* Decorative circles */}
                        <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-white/10" />
                        <div className="absolute -bottom-32 -left-20 h-80 w-80 rounded-full bg-white/10" />

                        <div className="relative z-10">
                            <div className="mb-3 flex w-full justify-center">
                                <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-2xl bg-white shadow-lg">
                                    <img
                                        src="/images/logo-sm.png"
                                        alt="Mukurtham"
                                        className="h-full w-full object-contain"
                                    />
                                </div>
                            </div>

                            <p className="mb-15 text-center text-sm font-medium uppercase tracking-[0.25em] text-white/70">
                                Mukurtham {role.toUpperCase()}
                            </p>

                            <h1 className="max-w-sm text-4xl font-bold leading-tight text-white">
                                Manage your
                                <span className="block text-white/80">
                                    wedding platform
                                </span>
                            </h1>

                            <p className="mt-5 max-w-sm text-sm leading-6 text-white/70">
                                Manage services, vendors, bookings, galleries
                                and everything that makes every celebration memorable.
                            </p>
                        </div>

                        <div className="relative z-10">
                            <div className="mb-5 h-px w-full bg-white/15" />

                            <p className="text-xs text-white/60">
                                Making Memorable Moments
                            </p>
                        </div>
                    </div>


                    {/* Right-Login */}
                    <div className="flex items-center justify-center p-6 sm:p-10 lg:p-12">

                        <div className="w-full max-w-md">

                            {/* Mobile Logo */}
                            <div className="mb-8 flex items-center gap-3 lg:hidden">
                                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-lg font-bold text-white shadow-lg shadow-primary/20">
                                    <img
                                        src="/images/logo-sm.png"
                                        alt="Mukurtham"
                                        className="h-full w-full object-contain rounded-xl"
                                    />
                                </div>

                                <div>
                                    <h1 className="text-lg font-bold text-slate-800">
                                        Mukurtham
                                    </h1>
                                    <p className="text-xs text-slate-400">
                                        Admin Panel
                                    </p>
                                </div>
                            </div>


                            {/* Heading */}
                            <div className="mb-8">
                                <p className="mb-2 text-sm font-medium text-primary">
                                    Welcome back
                                </p>

                                <h2 className="text-3xl font-bold tracking-tight text-slate-800">
                                    Sign in to your account
                                </h2>

                                <p className="mt-2 text-sm leading-6 text-slate-500">
                                    Access your admin dashboard and manage Mukurtham.
                                </p>
                            </div>


                            {/* Login Tabs */}
                            <div className="mb-7 rounded-xl bg-slate-100 p-1">
                                <div className="grid grid-cols-2 gap-1">

                                    <button
                                        type="button"
                                        onClick={() => {
                                            setActiveTab("otp");
                                            setError("");
                                            setOtp("");
                                        }}
                                        className={`cursor-pointer rounded-lg px-4 py-2.5 text-sm font-semibold transition-all ${activeTab === "otp"
                                            ? "bg-white text-primary shadow-sm"
                                            : "text-slate-500 hover:text-slate-700"
                                            } `}
                                    >
                                        Mobile OTP
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => {
                                            setActiveTab("email");
                                            setError("");
                                            setOtp("");
                                            setOtpSent(false);
                                        }}
                                        className={`cursor-pointer rounded-lg px-4 py-2.5 text-sm font-semibold transition-all ${activeTab === "email"
                                            ? "bg-white text-primary shadow-sm"
                                            : "text-slate-500 hover:text-slate-700"
                                            } `}
                                    >
                                        Email
                                    </button>

                                </div>
                            </div>


                            {/* Form */}
                            <form onSubmit={handleSubmit} className="flex flex-col gap-4">

                                {activeTab === "email" ? (
                                    <>
                                        {/* Email */}
                                        <label className="block">
                                            <span className="mb-2 block text-sm font-medium text-slate-700">
                                                Email address
                                            </span>

                                            <input
                                                type="email"
                                                value={email}
                                                onChange={(event) => setEmail(event.target.value)}
                                                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10"
                                                placeholder="Enter your email"
                                            />
                                        </label>


                                        {/* Password */}
                                        <label className="block">
                                            <span className="mb-2 block text-sm font-medium text-slate-700">
                                                Password
                                            </span>

                                            <input
                                                type="password"
                                                value={password}
                                                onChange={(event) => setPassword(event.target.value)}
                                                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10"
                                                placeholder="Enter your password"
                                            />
                                        </label>
                                    </>
                                ) : (
                                    <>
                                        {/* Mobile */}
                                        <div>
                                            <label className="mb-2 block text-sm font-medium text-slate-700">
                                                Mobile number
                                            </label>

                                            <div className="md:flex gap-2">
                                                <input
                                                    type="tel"
                                                    value={mobile}
                                                    onChange={(event) => setMobile(event.target.value)}
                                                    className="min-w-0 flex-1 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10"
                                                    placeholder="Enter mobile number"
                                                />

                                                <button
                                                    type="button"
                                                    onClick={handleSendOtp}
                                                    disabled={sendingOtp || !mobile || (otpSent && resendCountdown > 0)}
                                                    className="cursor-pointer rounded-xl bg-primary mt-3 md:mt-0  px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-light disabled:cursor-not-allowed disabled:bg-slate-300"
                                                >
                                                    {sendingOtp ? "Sending..." : otpSent && resendCountdown > 0 ? `${resendCountdown} s` : otpSent ? "Resend" : "Send OTP"}
                                                </button>
                                            </div>
                                        </div>


                                        {/* OTP Verification */}
                                        {otpSent ? (
                                            <div className="mt-2">
                                                <div className="mb-3 flex items-center justify-between">
                                                    <div>
                                                        <p className="text-sm font-semibold text-slate-700">
                                                            Verification code
                                                        </p>
                                                        <p className="mt-1 text-xs text-slate-400">
                                                            Enter the 6-digit code sent to your mobile
                                                        </p>
                                                    </div>

                                                    <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                                                        OTP
                                                    </span>
                                                </div>

                                                <div
                                                    className="relative cursor-text"
                                                    onClick={() => otpInputRef.current?.focus()}
                                                >
                                                    {/* OTP Boxes */}
                                                    <div className="flex gap-2 sm:gap-3">
                                                        {Array.from({ length: 6 }).map((_, index) => {
                                                            const isActive = otpCursor === index;
                                                            const hasValue = Boolean(otp[index]);

                                                            return (
                                                                <div
                                                                    key={index}
                                                                    className={`
                                                                            flex h-12 flex-1 items-center justify-center
                                                                            rounded-xl border-2 text-lg font-bold
                                                                            transition-all duration-200
                                                                            sm:h-14
                                                                            ${hasValue
                                                                            ? "border-primary bg-primary/5 text-primary shadow-sm"
                                                                            : isActive
                                                                                ? "border-primary bg-white text-primary shadow-md ring-4 ring-primary/10"
                                                                                : "border-slate-200 bg-slate-50 text-slate-400"
                                                                        }
                                                                    `}
                                                                >
                                                                    {otp[index] || (
                                                                        isActive && (
                                                                            <span className="h-5 w-0.5 animate-pulse bg-primary" />
                                                                        )
                                                                    )}
                                                                </div>
                                                            );
                                                        })}
                                                    </div>

                                                    {/* Real Input */}
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
                                                        onFocus={() => {
                                                            setOtpCursor(otp.length);
                                                        }}
                                                        onClick={(event) => {
                                                            setOtpCursor(
                                                                event.currentTarget.selectionStart ?? otp.length
                                                            );
                                                        }}
                                                        onKeyUp={(event) => {
                                                            setOtpCursor(
                                                                event.currentTarget.selectionStart ?? otp.length
                                                            );
                                                        }}
                                                        className="absolute inset-0 h-full w-full cursor-text opacity-0"
                                                        aria-label="Enter 6-digit OTP"
                                                    />
                                                </div>

                                                {/* Resend */}
                                                <div className="mt-4 flex items-center justify-between">
                                                    <p className="text-xs text-slate-400">
                                                        Didn't receive the code?
                                                    </p>

                                                    <button
                                                        type="button"
                                                        onClick={handleSendOtp}
                                                        disabled={sendingOtp || resendCountdown > 0}
                                                        className="cursor-pointer text-xs font-semibold text-primary transition hover:text-primary-light disabled:cursor-not-allowed disabled:text-slate-300"
                                                    >
                                                        {sendingOtp ? "Sending..." : resendCountdown > 0 ? `Resend in ${resendCountdown}s` : "Resend OTP"}
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 px-4 py-4">
                                                <p className="text-xs leading-5 text-slate-500">
                                                    Enter your mobile number and click{" "}
                                                    <span className="font-semibold text-slate-700">
                                                        Send OTP
                                                    </span>{" "}
                                                    to receive your verification code.
                                                </p>
                                            </div>
                                        )}
                                    </>
                                )}


                                {/* Error */}
                                {error ? (
                                    <div className="rounded-xl border border-rose-100 bg-rose-50 px-4 py-3">
                                        <p className="text-sm text-rose-600">
                                            {error}
                                        </p>
                                    </div>
                                ) : null}


                                {/* Submit */}
                                <button
                                    type="submit"
                                    disabled={loading || (activeTab === "otp" && !otpSent)}
                                    className="cursor-pointer mt-2 w-full rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-primary/20 transition hover:bg-primary-light hover:shadow-primary/30 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:shadow-none"
                                >
                                    {loading ? "Signing in..." : activeTab === "otp" ? "Verify & Login" : "Sign in"}
                                </button>


                                {/* Register */}
                                {onSwitchToRegister ? (
                                    <button
                                        type="button"
                                        onClick={onSwitchToRegister}
                                        className="text-center text-sm font-medium text-primary transition hover:underline"
                                    >
                                        Create an account
                                    </button>
                                ) : (
                                    <Link
                                        href="/register"
                                        className="text-center text-sm font-medium text-primary transition hover:underline"
                                    >
                                        Create an account
                                    </Link>
                                )}

                            </form>


                            {/* Footer */}
                            <p className="mt-8 text-center text-xs text-slate-400">
                                &copy; {new Date().getFullYear()} Mukurtham. All rights reserved.
                            </p>

                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
