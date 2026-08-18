"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import DatePicker from "react-datepicker";
import { adminRoutes } from "@/services/api/admin.routes";
import commonRoutes from "@/services/api/common.routes";
import { constants } from "@/utils/constants";
import { common as commonUtils } from "@/utils/common";
import { sweetalert } from "@/utils/sweetalert";
import "react-datepicker/dist/react-datepicker.css";

type ServiceDateForm = {
    category_id: string;
    date_type: string;
    service_date: string;
    status: string;
};

const initialForm: ServiceDateForm = {
    category_id: "",
    date_type: "",
    service_date: "",
    status: "0",
};

export default function CreateServiceDate() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const serviceDateId = searchParams.get("id");
    const [form, setForm] = useState<ServiceDateForm>(initialForm);
    const [categoryList, setCategoryList] = useState<any[]>([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const inputClass = constants.inputClass;
    const buttonClass = constants.buttonClass;
    const buttonClassSubmit = constants.buttonClassSubmit;

    useEffect(() => {
        loadCategoryList();
    }, []);


    useEffect(() => {
        if (!serviceDateId) {
            return;
        }
        loadServiceDate();
    }, [serviceDateId]);

    const loadCategoryList = async () => {
        const result = await commonRoutes.getCategories();
        setCategoryList(result?.data || []);
    };

    const loadServiceDate = async () => {
        try {
            const result = await adminRoutes.getServiceDate({ id: Number(serviceDateId) });

            if (!result?.success) {
                return;
            }

            if (!result.data || result.data.length === 0) {
                const swalConfirm = await sweetalert.warning("Something went wrong");
                if (swalConfirm.isConfirmed) {
                    router.push("/panel/service-date-list");
                }
                return;
            }

            setForm({
                category_id: String(result?.data.category_id ?? ""),
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
            const result = await adminRoutes.createServiceDate({
                category_id: Number(form.category_id),
                date_type: form.date_type.trim() || null,
                service_date: commonUtils.formatDateTime(form.service_date, "YYYY-MM-DD") || null,
                status: Number(form.status),
                ...(serviceDateId ? { id: Number(serviceDateId) } : {}),
            });

            if (result?.success) {
                await sweetalert.success(result.message);
                router.push("/panel/service-date-list");
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
                <span className="text-2xl font-semibold leading-none text-slate-600">
                    {serviceDateId ? "Edit Service Date" : "Service Date"}
                </span>
                <Link href="/panel/service-date-list" className={buttonClass}>
                    Service Date Lists
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

                        {/* <div className="md:col-span-4">
                            <label htmlFor="categoryId" className="mb-2 block text-sm font-medium text-gray-700">
                                Category
                            </label>
                            <select
                                id="categoryId"
                                value={form.category_id}
                                onChange={(event) => updateField("category_id", event.target.value)}
                                className={inputClass}
                            >
                                <option value="">Select Category</option>
                                {categoryList.map((category) => (
                                    <option key={category.id} value={category.id}>
                                        {category.name}
                                    </option>
                                ))}
                            </select>
                        </div> */}

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
                                <option value="Waxing">Waxing Crescent(Valarpirai)</option>
                                <option value="Waning">Waning Crescent(Theipirai)</option>
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