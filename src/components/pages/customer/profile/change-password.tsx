"use client";

import { FormEvent, useState } from "react";
import { userRoutes } from "@/services/api/users.routes";
import { sweetalert } from "@/utils/sweetalert";
import { constants } from "@/utils/constants";
import { KeyRound, UserRound } from "lucide-react";

export function ChangePassword() {
    const inputClass = constants.inputClass;
    const buttonClassSubmit = constants.buttonClassSubmit;

    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        if (!currentPassword) {
            sweetalert.toastError("Current password is required");
            return;
        }

        if (!newPassword) {
            sweetalert.toastError("New password is required");
            return;
        }

        if (!confirmPassword) {
            sweetalert.toastError("Please confirm your password");
            return;
        }

        if (newPassword !== confirmPassword) {
            sweetalert.toastError("New password and confirm password do not match");
            return;
        }

        setLoading(true);

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
                sweetalert.toastSuccess(result.message);
            }
        } catch (caughtError) {
            console.error("Change password failed:", caughtError);
        } finally {
            setLoading(false);
        }
    }

    return (
        <main className="mx-auto max-w-screen-2xl space-y-12 px-4 py-6 sm:px-6 lg:px-8">
            <div className="d-block">
                <div className="min-h-full rounded-xl border border-primary/10 bg-white px-4 py-4 shadow-sm">

                    <div className="mb-6 ml-1">
                        <div className="flex items-center gap-3">
                            {/* Icon */}
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                                <KeyRound className="h-5 w-5 text-primary" />
                            </div>

                            {/* Title */}
                            <div>
                                <h1 className="text-xl font-semibold leading-tight text-slate-800">
                                    Change Password
                                </h1>
                            </div>
                        </div>

                        {/* Accent line */}
                        <div className="mt-5 w-full border border-primary/25" />
                    </div>

                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-y-5 mb-5">
                            <div className="md:col-start-5 md:col-span-4 mb-3">
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

                            <div className="md:col-start-5 md:col-span-4 mb-3">
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

                            <div className="md:col-start-5 md:col-span-4 mb-3">
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
                        </div>



                        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-5">
                            <div className="md:col-start-5 md:col-span-4">
                                <button type="submit" className={`${buttonClassSubmit}`} disabled={loading}>
                                    {loading ? "Saving..." : "Save"}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </main>
    );
}
