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
    date_type: string;
    from_date: string;
    status: string;
};

const initialForm: ServiceDateForm = {
    date_type: "",
    from_date: "",
    status: "1",
};

export default function CreateServiceDate() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const serviceDateId = searchParams.get("id");
    const [form, setForm] = useState<ServiceDateForm>(initialForm);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const inputClass = constants.inputClass;
    const buttonClass = constants.buttonClass;
    const buttonClassSubmit = constants.buttonClassSubmit;


    useEffect(() => {
        if (!serviceDateId) {
            return;
        }
        getServiceDate();
    }, [serviceDateId]);


    const getServiceDate = async () => {
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
                date_type: result?.data.date_type ?? "",
                from_date: result?.data.from_date ? commonUtils.formatDateTime(result?.data.from_date, "YYYY-MM-DD") : "",
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

        if (!form.from_date) {
            setError("Date is required");
            return;
        }

        setLoading(true);

        try {
            const result = await adminRoutes.createServiceDate({
                date_type: form.date_type.trim() || null,
                from_date: commonUtils.formatDateTime(form.from_date, "YYYY-MM-DD") || null,
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
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-5">
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