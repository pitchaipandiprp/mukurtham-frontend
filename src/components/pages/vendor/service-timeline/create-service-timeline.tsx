"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { vendorRoutes } from "@/services/api/vendor.routes";
import { constants } from "@/utils/constants";
import { sweetalert } from "@/utils/sweetalert";

type ServiceTimelineForm = {
    category_service_id: string;
    timeline_content: string;
    status: string;
};



export default function CreateServiceTimeline() {
    const searchParams = useSearchParams();
    const serviceTimelineId = searchParams.get("id");
    const categoryServiceId = searchParams.get("serviceId");

    const initialForm: ServiceTimelineForm = {
        category_service_id: String(categoryServiceId),
        timeline_content: "",
        status: "1",
    };

    const router = useRouter();
    const [form, setForm] = useState<ServiceTimelineForm>(initialForm);
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
        if (!serviceTimelineId) {
            return;
        }
        getTimeline();
    }, [serviceTimelineId]);


    const getCategoryService = async () => {
        const response = await vendorRoutes.getCategoryService({
            id: categoryServiceId ?? undefined,
        });
        setCategoryServiceData(response?.data ?? null);
    };

    const getTimeline = async () => {
        try {
            const result = await vendorRoutes.getTimeline({ id: Number(serviceTimelineId) });

            if (!result?.success) {
                return;
            }

            if (!result.data || result.data.length === 0) {
                const swalConfirm = await sweetalert.warning("Something went wrong");
                if (swalConfirm.isConfirmed) {
                    router.push("/panel/service-timeline-list");
                }
                return;
            }

            setForm({
                category_service_id: String(result?.data.category_service_id ?? ""),
                timeline_content: result?.data.timeline_content ?? "",
                status: String(result?.data.status ?? 0),
            });
        } catch (caughtError) {
            console.error("Failed to load service timeline:", caughtError);
        }
    };

    const updateField = (field: keyof ServiceTimelineForm, value: string) => {
        setForm((previous) => ({ ...previous, [field]: value }));
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!form.category_service_id) {
            sweetalert.toastError("Category service Id is required");
            return;
        }

        if (!form.timeline_content) {
            sweetalert.toastError("Please enter the timeline");
            return;
        }

        setLoading(true);

        try {
            const result = await vendorRoutes.createTimeline({
                category_service_id: Number(form.category_service_id),
                timeline_content: form.timeline_content.trim() || null,
                status: Number(form.status),
                ...(serviceTimelineId ? { id: Number(serviceTimelineId) } : {}),
            });

            if (result?.success) {
                await sweetalert.success(result.message);
                router.push("/panel/service-timeline-list?serviceId=" + categoryServiceId);
            }
        } catch (caughtError) {
            console.error("Save service timeline failed:", caughtError);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="d-block">
            <div className="mb-6 ml-1 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <span className="text-2xl font-semibold leading-none text-slate-600">
                        Timeline
                    </span>

                    <ChevronRight className="h-5 w-5 shrink-0 text-slate-400 mt-2" />

                    <span className="text-base font-medium leading-none text-slate-500 mt-2">
                        {categoryServiceData?.service_name ?? ""}
                    </span>
                </div>
                <Link href={`/panel/service-timeline-list?serviceId=${categoryServiceId}`} className={buttonClass}> Back</Link>
            </div>

            <div className="min-h-full rounded-xl border border-primary/10 bg-white px-4 py-4 shadow-sm">
                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-5">
                        <div className="md:col-span-12">
                            <label htmlFor="timelineContent" className="mb-2 block text-sm font-medium text-gray-700">
                                Timeline
                            </label>
                            <textarea
                                id="timelineContent"
                                placeholder="Enter service description"
                                rows={2}
                                className={inputClass}
                                value={form.timeline_content}
                                onChange={(event) => updateField("timeline_content", event.target.value)}
                            ></textarea>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-5">
                        <div className="md:col-span-4">
                            <button type="submit" className={`mt-8 ${buttonClassSubmit}`} disabled={loading}>
                                {loading ? "Saving..." : "Save"}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}