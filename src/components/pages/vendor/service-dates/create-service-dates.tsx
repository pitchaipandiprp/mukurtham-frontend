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
import { ChevronRight } from "lucide-react";
import { prefixUrl } from "@/utils/constants"

type ServiceDateForm = {
    category_service_id: string;
    date_type: string;
    from_date: string;
    to_date: string;
    status: string;
};



export default function CreateServiceDates() {
    const searchParams = useSearchParams();
    const serviceDateId = searchParams.get("id");
    const categoryServiceId = searchParams.get("serviceId");

    const initialForm: ServiceDateForm = {
        category_service_id: String(categoryServiceId),
        date_type: "Unavailable",
        from_date: "",
        to_date: "",
        status: "1",
    };

    const router = useRouter();
    const [form, setForm] = useState<ServiceDateForm>(initialForm);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const inputClass = constants.inputClass;
    const buttonClass = constants.buttonClass;
    const buttonClassSubmit = constants.buttonClassSubmit;
    const [categoryServiceData, setCategoryServiceData] = useState<any>(null);

    useEffect(() => {
        if (categoryServiceId) {
            getCategoryService();
        }
    }, [categoryServiceId]);

    useEffect(() => {
        if (!serviceDateId) {
            return;
        }
        getServiceDate();
    }, [serviceDateId]);


    const getCategoryService = async () => {
        const response = await vendorRoutes.getCategoryService({
            id: categoryServiceId ?? undefined,
        });
        setCategoryServiceData(response?.data ?? null);
    };

    const getServiceDate = async () => {
        try {
            const result = await vendorRoutes.getServiceDate({ id: Number(serviceDateId) });

            if (!result?.success) {
                return;
            }

            if (!result.data || result.data.length === 0) {
                const swalConfirm = await sweetalert.warning("Something went wrong");
                if (swalConfirm.isConfirmed) {
                    router.push(`${prefixUrl.vendor}/service-dates-list`);
                }
                return;
            }

            setForm({
                category_service_id: String(result?.data.category_service_id ?? ""),
                date_type: result?.data.date_type ?? "",
                from_date: result?.data.from_date ? commonUtils.formatDateTime(result?.data.from_date, "YYYY-MM-DD") : "",
                to_date: result?.data.to_date ? commonUtils.formatDateTime(result?.data.to_date, "YYYY-MM-DD") : "",
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

        if (!form.from_date) {
            setError("Service date is required");
            return;
        }

        if (!form.to_date) {
            setError("To date is required");
            return;
        }

        if (new Date(form.from_date) > new Date(form.to_date)) {
            setError("From date cannot be greater than To date");
            return;
        }

        setLoading(true);

        try {
            const result = await vendorRoutes.createServiceDate({
                category_service_id: Number(form.category_service_id),
                date_type: form.date_type.trim() || null,
                from_date: commonUtils.formatDateTime(form.from_date, "YYYY-MM-DD") || null,
                to_date: commonUtils.formatDateTime(form.to_date, "YYYY-MM-DD") || null,
                status: Number(form.status),
                ...(serviceDateId ? { id: Number(serviceDateId) } : {}),
            });

            if (result?.success) {
                await sweetalert.success(result.message);
                router.push(`${prefixUrl.vendor}/service-dates-list?serviceId=` + categoryServiceId);
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
                <div className="flex items-center gap-2">
                    <span className="text-2xl font-semibold leading-none text-slate-600">
                        Blocked Dates
                    </span>

                    <ChevronRight className="h-5 w-5 shrink-0 text-slate-400 mt-2" />

                    <span className="text-base font-medium leading-none text-slate-500 mt-2">
                        {categoryServiceData?.service_name ?? ""}
                    </span>
                </div>
                <Link href={`${prefixUrl.vendor}/service-dates-list?serviceId=${categoryServiceId}`} className={buttonClass}> Back</Link>
            </div>

            <div className="min-h-full rounded-xl border border-primary/10 bg-white px-4 py-4 shadow-sm">
                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-5">
                        <div className="md:col-span-4">
                            <label htmlFor="fromDate" className="mb-2 block text-sm font-medium text-gray-700">
                                From Date
                            </label>
                            <DatePicker
                                selected={form.from_date ? new Date(form.from_date) : null}
                                onChange={(date: any) => { updateField("from_date", date); }}
                                minDate={new Date()}
                                dateFormat="yyyy-MM-dd"
                                placeholderText="Select Date"
                                showPopperArrow={false}
                                className={`w-full ${inputClass}`}
                            />
                        </div>
                        <div className="md:col-span-4">
                            <label htmlFor="toDate" className="mb-2 block text-sm font-medium text-gray-700">
                                To Date
                            </label>
                            <DatePicker
                                selected={form.to_date ? new Date(form.to_date) : null}
                                onChange={(date: any) => { updateField("to_date", date); }}
                                minDate={new Date()}
                                dateFormat="yyyy-MM-dd"
                                placeholderText="Select Date"
                                showPopperArrow={false}
                                className={`w-full ${inputClass}`}
                            />
                        </div>
                        <div className="md:col-span-4">
                            <button type="submit" className={`mt-8 ${buttonClassSubmit}`} disabled={loading}>
                                {loading ? "Saving..." : "Save"}
                            </button>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-5">
                        {error && <div className="text-sm text-rose-600 md:col-span-12">{error}</div>}
                    </div>
                </form>
            </div>
        </div>
    );
}