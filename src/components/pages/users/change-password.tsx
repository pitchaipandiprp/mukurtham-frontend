"use client";

import { FormEvent, useState } from "react";
import { userService } from "@/services/users/users.service";
import { sweetalert } from "@/utils/sweetalert";

export function ChangePassword() {
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        if (!currentPassword) {
            setError("Current password is required");
            return;
        }

        if (!newPassword) {
            setError("New password is required");
            return;
        }

        if (!confirmPassword) {
            setError("Please confirm your password");
            return;
        }

        if (newPassword !== confirmPassword) {
            setError("New password and confirm password do not match");
            return;
        }

        setLoading(true);
        setError("");

        try {
            const result = await userService.changePassword({
                current_password: currentPassword,
                new_password: newPassword,
                confirm_password: confirmPassword,
            });
            if (result.success) {
                setCurrentPassword("");
                setNewPassword("");
                setConfirmPassword("");
                await sweetalert.success(result.message);
            }
        } catch (caughtError) {
            console.error("Change password failed:", caughtError);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="mx-auto flex w-full max-w-md flex-col gap-6 px-6 py-12">
            <div>
                <h1 className="mt-2 text-3xl font-semibold text-slate-950">Change Password</h1>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <label className="block text-sm font-medium text-slate-700">
                    Current Password
                    <input
                        type="password"
                        value={currentPassword}
                        onChange={(event) => setCurrentPassword(event.target.value)}
                        className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 outline-none transition focus:border-slate-900"
                        placeholder="Current Password"
                    />
                </label>
                <label className="block text-sm font-medium text-slate-700">
                    New Password
                    <input
                        type="password"
                        value={newPassword}
                        onChange={(event) => setNewPassword(event.target.value)}
                        className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 outline-none transition focus:border-slate-900"
                        placeholder="New password"
                    />
                </label>
                <label className="block text-sm font-medium text-slate-700">
                    Confirm Password
                    <input
                        type="password"
                        value={confirmPassword}
                        onChange={(event) => setConfirmPassword(event.target.value)}
                        className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 outline-none transition focus:border-slate-900"
                        placeholder="Confirm password"
                    />
                </label>

                {error && (
                    <p className="text-sm text-rose-600">
                        {error}
                    </p>
                )}

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full cursor-pointer rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:bg-slate-400"
                >
                    Change Password
                </button>
            </form>
        </div>
    );
}
