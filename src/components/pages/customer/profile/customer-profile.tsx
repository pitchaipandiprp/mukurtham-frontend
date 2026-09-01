"use client";

import { FormEvent, useEffect, useState } from "react";
import { userRoutes } from "@/services/api/users.routes";
import { sweetalert } from "@/utils/sweetalert";
import { constants } from "@/utils/constants";
import { UserRound } from "lucide-react";

type UserForm = {
    name: string;
    email: string;
    mobile: string;
    status: string;
};

export function CustomerProfile() {
    const inputClass = constants.inputClass;
    const buttonClassSubmit = constants.buttonClassSubmit;
    const [loading, setLoading] = useState(false);

    const initialForm: UserForm = {
        name: "",
        email: "",
        mobile: "",
        status: "",
    };
    const [form, setForm] = useState<UserForm>(initialForm);


    useEffect(() => {
        fetchProfile();
    }, []);

    async function fetchProfile() {
        try {
            const result = await userRoutes.userProfile({});

            if (!result?.success) {
                return;
            }

            setForm({
                name: String(result?.data.name ?? ""),
                email: String(result?.data.email ?? ""),
                mobile: String(result?.data.mobile ?? ""),
                status: String(result?.data.status ?? ""),
            });

        } catch (caughtError) {
            console.error("Failed to fetch profile:", caughtError);
        }
    }

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        if (!form.name) {
            sweetalert.toastError("Name is required");
            return;
        }

        setLoading(true);

        try {
            const result = await userRoutes.userUpdate({
                name: form.name,
            });
            if (result.success) {
                await sweetalert.toastSuccess(result.message);
            }
        } catch (caughtError) {
            console.error("Profile update failed:", caughtError);
        } finally {
            setLoading(false);
        }
    }

    const updateField = (field: keyof UserForm, value: string) => {
        setForm((previous) => ({ ...previous, [field]: value }));
    };

    return (
        <main className="mx-auto max-w-screen-2xl space-y-12 px-4 py-6 sm:px-6 lg:px-8">
            <div className="d-block">
                <div className="min-h-full rounded-xl border border-primary/10 bg-white px-4 py-4 shadow-sm">

                    <div className="mb-6 ml-1">
                        <div className="flex items-center gap-3">
                            {/* Icon */}
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                                <UserRound className="h-5 w-5 text-primary" />
                            </div>

                            {/* Title */}
                            <div>
                                <h1 className="text-xl font-semibold leading-tight text-slate-800">
                                    My Profile
                                </h1>

                                <p className="mt-1 text-sm text-slate-400">
                                    Manage your personal information
                                </p>
                            </div>
                        </div>

                        {/* Accent line */}
                        <div className="mt-5 w-full border border-primary/25" />
                    </div>


                    <div className="grid grid-cols-1 md:grid-cols-12 gap-y-5 mb-5">
                        <div className="md:col-start-5 md:col-span-4">
                            <div className="flex items-center justify-between px-5 py-5 bg-white border border-gray-100 rounded-xl shadow-sm">

                                {/* Welcome Text */}
                                <div className="flex items-center gap-3">
                                    <div className="flex items-center justify-center w-9 h-9 rounded-full bg-primary/10">
                                        <span className="text-primary font-semibold text-sm">
                                            {form.name?.charAt(0)?.toUpperCase()}
                                        </span>
                                    </div>

                                    <div className="flex flex-col">
                                        <span className="text-xs text-gray-400">
                                            Welcome
                                        </span>

                                        <span className="text-sm font-semibold text-gray-800">
                                            {form.name}
                                        </span>
                                    </div>
                                </div>

                                {/* Status */}
                                <div
                                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${form.status === "1"
                                        ? "bg-green-50 text-green-600"
                                        : "bg-red-50 text-red-600"
                                        }`}
                                >
                                    <span
                                        className={`w-2 h-2 rounded-full ${form.status === "1"
                                            ? "bg-green-500"
                                            : "bg-red-500"
                                            }`}
                                    />

                                    {form.status === "1" ? "Active" : "Inactive"}
                                </div>
                            </div>
                        </div>
                    </div>
                    <form onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-y-5 mb-5">
                            <div className="md:col-start-5 md:col-span-4 mb-3">
                                <label htmlFor="fullName" className="mb-2 block text-sm font-medium text-gray-700">
                                    Name
                                </label>
                                <input
                                    id="fullName"
                                    type="text"
                                    placeholder="Enter your full name"
                                    className={inputClass}
                                    value={form.name}
                                    onChange={(event) => updateField("name", event.target.value)}
                                />
                            </div>
                            <div className="md:col-start-5 md:col-span-4 mb-3">
                                <label htmlFor="emailId" className="mb-2 block text-sm font-medium text-gray-700">
                                    Email
                                </label>
                                <input
                                    id="emailId"
                                    type="text"
                                    placeholder="Enter your full name"
                                    className={inputClass}
                                    value={form.email}
                                    disabled
                                />
                            </div>
                            <div className="md:col-start-5 md:col-span-4 mb-3">
                                <label htmlFor="mobileNo" className="mb-2 block text-sm font-medium text-gray-700">
                                    Mobile
                                </label>
                                <input
                                    id="mobileNo"
                                    type="text"
                                    placeholder="Enter your full name"
                                    className={inputClass}
                                    value={form.mobile}
                                    disabled
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
