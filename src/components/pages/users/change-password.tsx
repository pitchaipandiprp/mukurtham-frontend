"use client";

import { FormEvent, useState } from "react";
import { userRoutes } from "@/services/api/users.routes";
import { sweetalert } from "@/utils/sweetalert";
import { constants } from "@/utils/constants";

export function ChangePassword() {
    const inputClass = constants.inputClass;
    const buttonClassSubmit = constants.buttonClassSubmit;

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
            const result = await userRoutes.changePassword({
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
        <div className="d-block">
            <div className="mb-6 ml-1 flex items-center justify-between">
                <b className="text-2xl text-slate-600 tracking-tight">Change Password</b>
            </div>

            <div className="min-h-full px-4 py-12 rounded-lg border border-primary/10 bg-white shadow-sm">
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
                                className={inputClass}
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
                                className={inputClass}
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
                                className={inputClass}
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
                            className={buttonClassSubmit}
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
