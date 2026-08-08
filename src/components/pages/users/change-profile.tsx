"use client";

import { FormEvent, useEffect, useState } from "react";
import { userService } from "@/services/api/users.service";
import { sweetalert } from "@/utils/sweetalert";
import { common as commonUtils } from "@/utils/common";

export function ChangeProfile() {
    const inputClass = commonUtils.inputClass;
    const buttonClass = commonUtils.buttonClass;
    const buttonClassSubmit = commonUtils.buttonClassSubmit;

    const [name, setName] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        async function fetchProfile() {
            try {
                const result = await userService.userProfile({});

                if (result.success) {
                    setName(result.data?.name ?? "");
                }
            } catch (caughtError) {
                console.error("Failed to fetch profile:", caughtError);
            }
        }
        fetchProfile();
    }, []);



    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        if (!name) {
            setError("Name is required");
            return;
        }

        setLoading(true);
        setError("");

        try {
            const result = await userService.userUpdate({
                name,
            });
            if (result.success) {
                await sweetalert.success(result.message);
            }
        } catch (caughtError) {
            console.error("Profile update failed:", caughtError);
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
                            <label htmlFor="name" className="mb-2 block text-sm font-medium text-gray-700">
                                Name
                            </label>
                            <input
                                id="name"
                                type="text"
                                placeholder="Enter your name"
                                className={inputClass}
                                value={name}
                                onChange={(event) => setName(event.target.value)}
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
                            Update Profile
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
