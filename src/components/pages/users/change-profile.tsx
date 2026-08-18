"use client";

import { FormEvent, useEffect, useState } from "react";
import { userRoutes } from "@/services/api/users.routes";
import { sweetalert } from "@/utils/sweetalert";
import { constants } from "@/utils/constants";

export function ChangeProfile() {
    const inputClass = constants.inputClass;
    const buttonClassSubmit = constants.buttonClassSubmit;

    const [name, setName] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        async function fetchProfile() {
            try {
                const result = await userRoutes.userProfile({});

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
            const result = await userRoutes.userUpdate({
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
                <span className="text-2xl font-semibold leading-none text-slate-600">Profile</span>
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
