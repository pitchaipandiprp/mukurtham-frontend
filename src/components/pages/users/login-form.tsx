"use client";

import { FormEvent, useState } from "react";
import { useLogin } from "@/hooks/useLogin";

export function LoginForm() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { login, loading, error } = useLogin();

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const success = await login(email, password);

        if (success) {
            setEmail("");
            setPassword("");
        }
    }

    return (
        <div className="mx-auto flex w-full max-w-md flex-col gap-6 px-6 py-12">
            <div>
                <h1 className="mt-2 text-3xl font-semibold text-slate-950">Login</h1>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <label className="block text-sm font-medium text-slate-700">
                    Email
                    <input
                        type="email"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 outline-none transition focus:border-slate-900"
                        placeholder="you@example.com"
                    />
                    {error && !email ? (
                        <p className="text-sm text-rose-600">Email is required</p>
                    ) : null}
                </label>

                <label className="block text-sm font-medium text-slate-700">
                    Password
                    <input
                        type="password"
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 outline-none transition focus:border-slate-900"
                        placeholder="Enter your password"
                    />
                    {error && !password ? (
                        <p className="text-sm text-rose-600">Password is required</p>
                    ) : null}
                </label>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full cursor-pointer bg-primary hover:bg-primary-light rounded-xl px-4 py-2.5 text-sm font-semibold text-white transition disabled:cursor-not-allowed disabled:bg-slate-400"
                >
                    {loading ? "Signing in..." : "Sign in"}
                </button>
            </form>
        </div>
    );
}
