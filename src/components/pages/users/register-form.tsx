"use client";
import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { userService } from "@/services/api/users.service";
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
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const mobileRegex = /^[6-9]\d{9}$/;

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

        if (!password) {
            setError("Password is required");
            return;
        }

        setLoading(true);
        setError("");

        try {
            const result = await userService.createUser({
                user_type: userType,
                name,
                email,
                mobile,
                password,
            });

            if (!result.success) {
                // setError(result.message || "Registration failed");
                return;
            }

            await sweetalert.success(result.message || "User created successfully");
            setUserType("");
            setName("");
            setEmail("");
            setMobile("");
            setPassword("");

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
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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

                    <label className="block text-sm font-medium text-slate-700">
                        Mobile
                        <input
                            type="tel"
                            value={mobile}
                            onChange={(event) => setMobile(event.target.value)}
                            className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 outline-none transition focus:border-primary-light"
                            placeholder="Enter your mobile number"
                        />
                    </label>

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
                        disabled={loading}
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
