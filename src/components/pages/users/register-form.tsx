"use client";
import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Check } from "lucide-react";
import { userRoutes } from "@/services/api/users.routes";
import { authRoutes } from "@/services/api/auth.routes";
import { sweetalert } from "@/utils/sweetalert";

type UserType = "customer" | "vendor";

type RegisterFormProps = {
    onSwitchToLogin?: () => void;
    onRegisterSuccess?: () => void;
};

export function RegisterForm({ onSwitchToLogin, onRegisterSuccess }: RegisterFormProps) {
    const router = useRouter();
    const [userType, setUserType] = useState<UserType | "">("");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [mobile, setMobile] = useState("");
    const [password, setPassword] = useState("");
    const [otp, setOtp] = useState("");
    const [otpSent, setOtpSent] = useState(false);
    const [otpVerified, setOtpVerified] = useState(false);
    const [sendingOtp, setSendingOtp] = useState(false);
    const [verifyingOtp, setVerifyingOtp] = useState(false);
    const [resendCountdown, setResendCountdown] = useState(0);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const mobileRegex = /^[6-9]\d{9}$/;

    function handleMobileChange(event: React.ChangeEvent<HTMLInputElement>) {
        const value = event.target.value.replace(/\D/g, "").slice(0, 10);

        setMobile(value);
        setOtpSent(false);
        setOtpVerified(false);
        setOtp("");
    }

    async function handleSendOtp() {
        setError("");

        if (!mobile.trim()) {
            setError("Mobile is required");
            return;
        }

        if (!mobileRegex.test(mobile)) {
            setError("Invalid mobile number");
            return;
        }

        setSendingOtp(true);

        try {
            const result = await authRoutes.sendOtp({
                mobile,
                purpose: "register",
            });

            if (!result.success) {
                setError(result.message || "Unable to send OTP");
                return;
            }

            setOtpSent(true);
            setOtpVerified(false);
            setOtp("");

            setResendCountdown(60);

            const interval = setInterval(() => {
                setResendCountdown((previous) => {
                    if (previous <= 1) {
                        clearInterval(interval);
                        return 0;
                    }

                    return previous - 1;
                });
            }, 1000);

            await sweetalert.success(
                result.message || "OTP sent successfully"
            );

        } catch (caughtError) {
            console.error("Send OTP failed:", caughtError);
        } finally {
            setSendingOtp(false);
        }
    }

    async function handleVerifyOtp() {
        setError("");

        if (!otp.trim()) {
            setError("Please enter the OTP");
            return;
        }

        if (otp.length !== 6) {
            setError("Please enter a valid 6-digit OTP");
            return;
        }

        setVerifyingOtp(true);

        try {
            const result = await authRoutes.verifyOtp({
                mobile: mobile,
                otp: otp,
            });

            if (!result.success) {
                setError(result.message || "Invalid OTP");
                return;
            }

            setOtpVerified(true);

            await sweetalert.success(
                result.message || "Mobile number verified successfully"
            );

        } catch (caughtError) {
            console.error("Verify OTP failed:", caughtError);
        } finally {
            setVerifyingOtp(false);
        }
    }

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        if (!userType) {
            setError("User type is required");
            return;
        }

        if (!name.trim()) {
            setError("Name is required");
            return;
        }

        if (!email.trim()) {
            setError("Email is required");
            return;
        }

        if (!emailRegex.test(email)) {
            setError("Invalid email address");
            return;
        }

        if (!mobile.trim()) {
            setError("Mobile is required");
            return;
        }

        if (!mobileRegex.test(mobile)) {
            setError("Invalid mobile number");
            return;
        }

        if (!otpSent) {
            setError("Please verify your mobile number");
            return;
        }

        if (!otpVerified) {
            setError("Please verify the OTP before registering");
            return;
        }


        if (!password) {
            setError("Password is required");
            return;
        }

        setLoading(true);
        setError("");

        try {
            const result = await userRoutes.createUser({
                user_type: userType,
                name,
                email,
                mobile,
                password,
            });

            if (!result.success) {
                setError(result.message || "Registration failed");
                return;
            }

            await sweetalert.success(result.message || "User created successfully");
            setUserType("");
            setName("");
            setEmail("");
            setMobile("");
            setPassword("");
            setOtp("");
            setOtpSent(false);
            setOtpVerified(false);

            if (onRegisterSuccess) {
                onRegisterSuccess();
                return;
            }

            router.push("/login");
        } catch (caughtError) {
            console.error("Register failed:", caughtError);
            setError(caughtError instanceof Error ? caughtError.message : "Registration failed");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="mx-auto mt-6 flex w-full max-w-md flex-col gap-6 rounded-xl border border-slate-200 bg-slate-50 p-0">
            <div className="flex flex-col bg-primary px-6 py-6 text-white rounded-tl-xl rounded-tr-xl">
                <h1 className="mt-2 mb-2 text-center font-semibold text-white">Create your Mukurtham account</h1>
                <p className="mt-1 text-center text-sm text-white">
                    Register to manage bookings, wishlist & wedding plans
                </p>
            </div>

            <div className="px-6 py-1">
                <form onSubmit={handleSubmit} autoComplete="off" className="flex flex-col gap-4">
                    <fieldset className="rounded-xl border border-slate-300 p-3">
                        <legend className="px-2 text-sm font-medium text-slate-700">User Type</legend>
                        <div className="flex gap-6">
                            <label className="inline-flex items-center gap-2 text-sm text-slate-700">
                                <input
                                    type="radio"
                                    name="user_type"
                                    value="customer"
                                    checked={userType === "customer"}
                                    onChange={(event) => setUserType(event.target.value as UserType)}
                                    className="h-4 w-4 accent-primary"
                                />
                                Customer
                            </label>
                            <label className="inline-flex items-center gap-2 text-sm text-slate-700">
                                <input
                                    type="radio"
                                    name="user_type"
                                    value="vendor"
                                    checked={userType === "vendor"}
                                    onChange={(event) => setUserType(event.target.value as UserType)}
                                    className="h-4 w-4 accent-primary"
                                />
                                Vendor
                            </label>
                        </div>
                    </fieldset>

                    <label className="block text-sm font-medium text-slate-700">
                        Name
                        <input
                            type="text"
                            value={name}
                            onChange={(event) => setName(event.target.value)}
                            className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 outline-none transition focus:border-primary-light"
                            placeholder="Enter your name"
                        />
                    </label>

                    <label className="block text-sm font-medium text-slate-700">
                        Email
                        <input
                            value={email}
                            onChange={(event) => setEmail(event.target.value)}
                            className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 outline-none transition focus:border-primary-light"
                            placeholder="you@example.com"
                        />
                    </label>

                    <div>
                        <label className="mb-1 block text-sm font-medium text-slate-700">
                            Mobile
                        </label>

                        <div className="flex gap-2">
                            <input
                                type="tel"
                                value={mobile}
                                maxLength={10}
                                disabled={otpVerified}
                                onChange={handleMobileChange}
                                className="min-w-0 flex-1 rounded-xl border border-slate-300 px-3 py-2 outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10 disabled:bg-slate-100"
                                placeholder="Enter your mobile number"
                            />

                            <button
                                type="button"
                                onClick={handleSendOtp}
                                disabled={
                                    sendingOtp ||
                                    !mobile ||
                                    otpVerified ||
                                    resendCountdown > 0
                                }
                                className="shrink-0 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary-light disabled:cursor-not-allowed disabled:bg-slate-300"
                            >
                                {sendingOtp ? "Sending..." : otpVerified ? "Verified" : resendCountdown > 0 ? `${resendCountdown}s` : otpSent ? "Resend" : "Send OTP"}
                            </button>
                        </div>
                    </div>

                    {otpSent && !otpVerified ? (
                        <div className="rounded-xl border border-primary/20 bg-primary/5 p-4">

                            <p className="text-sm font-semibold text-slate-700">
                                Verify mobile number
                            </p>

                            <p className="mt-1 text-xs text-slate-500">
                                Enter the 6-digit OTP sent to {mobile}
                            </p>

                            <input
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
                                }}
                                className="mt-3 w-full rounded-xl border border-slate-300 bg-white px-3 py-3 text-center text-lg font-semibold tracking-[0.5em] outline-none focus:border-primary focus:ring-4 focus:ring-primary/10"
                                placeholder="Enter OTP"
                            />

                            <button
                                type="button"
                                onClick={handleVerifyOtp}
                                disabled={verifyingOtp || otp.length !== 6}
                                className="cursor-pointer mt-3 w-full rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-light disabled:cursor-not-allowed disabled:bg-slate-300"
                            >
                                {verifyingOtp ? "Verifying..." : "Verify OTP"}
                            </button>

                        </div>
                    ) : null}

                    {otpVerified ? (
                        <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3">
                            <p className="text-sm font-medium text-emerald-700">
                                <Check className="h-5 w-5 text-emerald-600" /> Mobile number verified successfully
                            </p>
                        </div>
                    ) : null}

                    <label className="block text-sm font-medium text-slate-700">
                        Password
                        <input
                            type="password"
                            value={password}
                            onChange={(event) => setPassword(event.target.value)}
                            className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 outline-none transition focus:border-primary-light"
                            placeholder="Create a password"
                        />
                    </label>

                    {error ? <p className="text-sm text-rose-600">{error}</p> : null}

                    <button
                        type="submit"
                        disabled={loading || !otpVerified}
                        className="mb-6 w-full cursor-pointer rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-light disabled:cursor-not-allowed disabled:bg-secondary-light"
                    >
                        {loading ? "Creating account..." : "Register"}
                    </button>

                    {onSwitchToLogin ? (
                        <button
                            type="button"
                            onClick={onSwitchToLogin}
                            className="cursor-pointer mb-5 text-center text-sm font-medium text-primary transition hover:text-primary hover:text-primary-dark"
                        >
                            Already have an account? Login
                        </button>
                    ) : (
                        <Link href="/login" className="cursor-pointer outline-none focus:outline-none hover:text-primary hover:text-primary-dark hover:font-semibold mb-5 text-center text-sm font-medium text-primary transition">
                            Already have an account? Login
                        </Link>
                    )}
                </form>
            </div>
        </div>
    );
}
