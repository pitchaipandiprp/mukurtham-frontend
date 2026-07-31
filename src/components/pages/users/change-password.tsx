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
        <div className="space-y-5 min-h-screen bg-[#fff8fb]">
            <div className="text-xl font-bold text-primary pt-4 pl-5">
                Change Password
            </div>
            <div className="m-5 p-4 rounded-lg border border-primary/10 bg-white shadow-sm">
                <div className="max-w-xl justify-center mx-auto">
                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                        <div className="mb-5">
                            <label htmlFor="currentPassword" className="mb-2 block text-sm font-medium text-gray-700">
                                Current Password
                            </label>
                            <input
                                id="currentPassword"
                                type="password"
                                placeholder="Enter your current password"
                                className="w-full rounded-lg border border-gray-400 px-4 py-3 text-sm text-gray-800 focus:bg-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/10 focus:shadow-md transition-all duration-300 ease-in-out"
                                value={currentPassword}
                                onChange={(event) => setCurrentPassword(event.target.value)}
                            />
                        </div>

                        <div className="mb-5">
                            <label htmlFor="newPassword" className="mb-2 block text-sm font-medium text-gray-700">
                                New Password
                            </label>
                            <input
                                id="newPassword"
                                type="password"
                                placeholder="Enter your new password"
                                className="w-full rounded-lg border border-gray-400 px-4 py-3 text-sm text-gray-800 focus:bg-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/10 focus:shadow-md transition-all duration-300 ease-in-out"
                                value={newPassword}
                                onChange={(event) => setNewPassword(event.target.value)}
                            />
                        </div>

                        <div className="mb-5">
                            <label htmlFor="confirmPassword" className="mb-2 block text-sm font-medium text-gray-700">
                                Confirm Password
                            </label>
                            <input
                                id="confirmPassword"
                                type="password"
                                placeholder="Confirm your new password"
                                className="w-full rounded-lg border border-gray-400 px-4 py-3 text-sm text-gray-800 focus:bg-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/10 focus:shadow-md transition-all duration-300 ease-in-out"
                                value={confirmPassword}
                                onChange={(event) => setConfirmPassword(event.target.value)}
                            />
                        </div>

                        {error && (
                            <div className="text-sm text-rose-600">
                                {error}
                            </div>
                        )}
                        <button
                            type="submit"
                            className="rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-white shadow-sm transition-all duration-300 hover:shadow-md hover:shadow-primary/20 hover:bg-primary-dark disabled:bg-secondary-light cursor-pointer"
                            disabled={loading}
                        >
                            Change Password
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
