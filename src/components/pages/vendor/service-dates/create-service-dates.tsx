"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import DatePicker from "react-datepicker";
import { vendorRoutes } from "@/services/api/vendor.routes";
import { constants } from "@/utils/constants";
import { common as commonUtils } from "@/utils/common";
import { sweetalert } from "@/utils/sweetalert";
import "react-datepicker/dist/react-datepicker.css";

type ServiceDateForm = {
    category_service_id: string;
    date_type: string;
    service_date: string;
    status: string;
};

const initialForm: ServiceDateForm = {
    category_service_id: "",
    date_type: "",
    service_date: "",
    status: "0",
};

export default function CreateServiceDates() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const serviceDateId = searchParams.get("id");
    const [form, setForm] = useState<ServiceDateForm>(initialForm);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [categoryServiceRecords, setCategoryServiceRecords] = useState<any[]>([]);
    const inputClass = constants.inputClass;
    const buttonClass = constants.buttonClass;
    const buttonClassSubmit = constants.buttonClassSubmit;

    useEffect(() => {
        loadCategoryServiceRecords();
    }, []);

    useEffect(() => {
        if (!serviceDateId) {
            return;
        }
        loadServiceDate();
    }, [serviceDateId]);


    const loadCategoryServiceRecords = async () => {
        const result = await vendorRoutes.categoryServiceRecords({});
        setCategoryServiceRecords(result?.data || []);
    };

    const loadServiceDate = async () => {
        try {
            const result = await vendorRoutes.getServiceDate({ id: Number(serviceDateId) });

            if (!result?.success) {
                return;
            }

            if (!result.data || result.data.length === 0) {
                const swalConfirm = await sweetalert.warning("Something went wrong");
                if (swalConfirm.isConfirmed) {
                    router.push("/panel/service-dates-list");
                }
                return;
            }

            setForm({
                category_service_id: String(result?.data.category_service_id ?? ""),
                date_type: result?.data.date_type ?? "",
                service_date: result?.data.service_date ? commonUtils.formatDateTime(result?.data.service_date, "YYYY-MM-DD") : "",
                status: String(result?.data.status ?? 0),
            });
        } catch (caughtError) {
            console.error("Failed to load service date:", caughtError);
        }
    };

    const updateField = (field: keyof ServiceDateForm, value: string) => {
        setForm((previous) => ({ ...previous, [field]: value }));
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setError("");

        if (!form.category_service_id) {
            setError("Category service is required");
            return;
        }

        if (!form.date_type) {
            setError("Type is required");
            return;
        }

        if (!form.service_date) {
            setError("Service date is required");
            return;
        }

        setLoading(true);

        try {
            const result = await vendorRoutes.createServiceDate({
                category_service_id: Number(form.category_service_id),
                date_type: form.date_type.trim() || null,
                service_date: commonUtils.formatDateTime(form.service_date, "YYYY-MM-DD") || null,
                status: Number(form.status),
                ...(serviceDateId ? { id: Number(serviceDateId) } : {}),
            });

            if (result?.success) {
                await sweetalert.success(result.message);
                router.push("/panel/service-dates-list");
            }
        } catch (caughtError) {
            console.error("Save service date failed:", caughtError);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="d-block">
            <div className="mb-6 ml-1 flex items-center justify-between">
                <b className="text-2xl text-slate-600 tracking-tight">
                    {serviceDateId ? "Edit Date" : "Service Date"}
                </b>
                <Link href="/panel/service-dates-list" className={buttonClass}>
                    Date Lists
                </Link>
            </div>

            <div className="min-h-full rounded-xl border border-primary/10 bg-white px-4 py-4 shadow-sm">
                <form onSubmit={handleSubmit}>
                    <div className="mb-5 grid grid-cols-1 gap-4 md:grid-cols-12">
                        <div className="md:col-span-4">
                            <label htmlFor="status" className="mb-2 block text-sm font-medium text-gray-700">
                                Status
                            </label>
                            <select
                                id="status"
                                value={form.status}
                                onChange={(event) => updateField("status", event.target.value)}
                                className={inputClass}
                            >
                                <option value="0">Inactive</option>
                                <option value="1">Active</option>
                            </select>
                        </div>

                        <div className="md:col-span-4">
                            <label htmlFor="categoryServiceId" className="mb-2 block text-sm font-medium text-gray-700">
                                Category Service
                            </label>
                            <select
                                id="categoryServiceId"
                                value={form.category_service_id}
                                onChange={(event) => updateField("category_service_id", event.target.value)}
                                className={inputClass}
                            >
                                <option value="">Select Category Service</option>
                                {categoryServiceRecords.map((item) => (
                                    <option key={`category-service-${item.id}`} value={item.id}>
                                        {item.service_name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="md:col-span-4">
                            <label htmlFor="dateType" className="mb-2 block text-sm font-medium text-gray-700">
                                Type
                            </label>
                            <select
                                id="dateType"
                                value={form.date_type}
                                onChange={(event) => updateField("date_type", event.target.value)}
                                className={inputClass}
                            >
                                <option value="">Select Type</option>
                                <option value="Available">Available</option>
                                <option value="Unavailable">Unavailable</option>
                            </select>
                        </div>

                        <div className="md:col-span-4">
                            <label htmlFor="serviceDate" className="mb-2 block text-sm font-medium text-gray-700">
                                Service Date
                            </label>
                            <DatePicker
                                selected={form.service_date ? new Date(form.service_date) : null}
                                onChange={(date: any) => { updateField("service_date", date); }}
                                minDate={new Date()}
                                dateFormat="yyyy-MM-dd"
                                placeholderText="Select Date"
                                showPopperArrow={false}
                                className={`w-full ${inputClass}`}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-12">
                        {error && <div className="text-sm text-rose-600 md:col-span-12">{error}</div>}
                        <div className="flex justify-end md:col-span-12">
                            <button type="submit" className={buttonClassSubmit} disabled={loading}>
                                {loading ? "Saving..." : "Save"}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}