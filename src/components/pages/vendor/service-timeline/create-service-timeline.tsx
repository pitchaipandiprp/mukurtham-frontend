"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ChevronRight, X } from "lucide-react";
import { vendorRoutes } from "@/services/api/vendor.routes";
import { constants } from "@/utils/constants";
import { sweetalert } from "@/utils/sweetalert";
import { prefixUrl } from "@/utils/constants"
import { apiConfig } from "@/environments/api";

type ServiceTimelineForm = {
    category_service_id: string;
    timeline_content: string;
    status: string;
};



export default function CreateServiceTimeline() {
    const BACKEND_BASE_URL = apiConfig.baseUrl;

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

    const [uploadMedia, setUploadMedia] = useState<File[]>([]);
    const [existingMedia, setExistingMedia] = useState<any[]>([]);
    const [deletedGalleryIds, setDeletedGalleryIds] = useState<number[]>([]);

    const removeNewMedia = (index: number) => {
        setUploadMedia((previous) =>
            previous.filter((_, itemIndex) => itemIndex !== index)
        );
    };

    const removeExistingMedia = (id: number) => {
        setExistingMedia((previous) =>
            previous.filter((item) => item.id !== id)
        );

        setDeletedGalleryIds((previous) => [
            ...previous,
            id,
        ]);
    };


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
                    router.push(`${prefixUrl.vendor}/service-timeline-list`);
                }
                return;
            }

            setForm({
                category_service_id: String(result?.data.category_service_id ?? ""),
                timeline_content: result?.data.timeline_content ?? "",
                status: String(result?.data.status ?? 0),
            });

            setExistingMedia(result.data.service_timeline_gallery ?? []);
        } catch (caughtError) {
            console.error("Failed to load service timeline:", caughtError);
        }
    };

    const handleMediaChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(event.target.files || []);

        if (!files.length) {
            return;
        }

        const totalFiles = existingMedia.length + files.length;

        if (totalFiles > 4) {
            sweetalert.toastError("You can have maximum 4 files");
            event.target.value = "";
            return;
        }

        const invalidFile = files.find((file) => {
            const isImage = file.type.startsWith("image/");
            const isVideo = file.type.startsWith("video/");

            return !isImage && !isVideo;
        });

        if (invalidFile) {
            sweetalert.toastError("Only image and video files are allowed");
            event.target.value = "";
            return;
        }

        setUploadMedia((previous) => [
            ...previous,
            ...files,
        ]);

        // Allow selecting the same file again
        event.target.value = "";
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

        if (!form.timeline_content.trim()) {
            sweetalert.toastError("Please enter the timeline");
            return;
        }

        setLoading(true);

        try {
            const formData = new FormData();
            formData.append("category_service_id", form.category_service_id);
            formData.append("timeline_content", form.timeline_content.trim());
            formData.append("status", form.status);

            if (serviceTimelineId) {
                formData.append("id", serviceTimelineId);
            }

            //Remove Existing Gallery
            if (deletedGalleryIds.length > 0) {
                formData.append("delete_gallery_ids", JSON.stringify(deletedGalleryIds));
            }

            // Add new images/videos
            uploadMedia.forEach((file) => {
                formData.append("timeline_media", file);
            });


            const result = await vendorRoutes.createTimeline(formData);

            if (result?.success) {
                await sweetalert.success(result.message);
                router.push(`${prefixUrl.vendor}/service-timeline-list?serviceId=` + categoryServiceId);
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
                <Link href={`${prefixUrl.vendor}/service-timeline-list?serviceId=${categoryServiceId}`} className={buttonClass}> Back</Link>
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

                        <div className="md:col-span-12">
                            <label htmlFor="uploadMedia" className="mb-2 block text-sm font-medium text-gray-700">
                                Upload Image / Video
                            </label>

                            <div className="flex items-center gap-3">
                                <label htmlFor="uploadMedia" className={`${buttonClass} ${loading ? "pointer-events-none opacity-50" : ""}`}                                 >
                                    {loading ? "Uploading..." : "Browse"}
                                </label>

                                <input
                                    id="uploadMedia"
                                    type="file"
                                    multiple
                                    accept="image/jpeg,image/png,image/webp,video/mp4,video/webm,video/quicktime"
                                    onChange={handleMediaChange}
                                    className="hidden"
                                    disabled={loading}
                                />

                                <p className="mt-1 text-xs text-gray-500">
                                    Maximum 4 files. Images and videos are allowed.
                                </p>
                            </div>

                            {/* Existing + New Media Preview */}
                            {(existingMedia.length > 0 || uploadMedia.length > 0) && (
                                <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">

                                    {/* Existing Media */}
                                    {existingMedia.map((media) => {
                                        const mediaUrl = media.gallery_type === "video" ? `${BACKEND_BASE_URL}/${media.gallery_video}` : `${BACKEND_BASE_URL}/${media.gallery_image}`;
                                        const isVideo = media.gallery_type === "video";

                                        return (
                                            <div key={`timeline-existing-${media.id}`} className="group relative overflow-hidden rounded-lg border border-gray-200 bg-gray-50">
                                                {isVideo ? (
                                                    <video src={mediaUrl} controls className="h-32 w-full object-cover" />
                                                ) : (
                                                    <img src={mediaUrl} alt="Timeline" className="h-32 w-full object-cover" />
                                                )}

                                                {/* Existing label */}
                                                <span className="absolute left-2 top-2 rounded bg-black/60 px-2 py-0.5 text-[10px] font-medium text-white">
                                                    Existing
                                                </span>

                                                {/* Remove */}
                                                <button
                                                    type="button"
                                                    onClick={() => removeExistingMedia(media.id)}
                                                    className="cursor-pointer absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-red-500 text-white opacity-0 shadow transition group-hover:opacity-100 hover:bg-red-600"
                                                >
                                                    <X className="h-4 w-4" />
                                                </button>
                                            </div>
                                        );
                                    })}

                                    {/* Newly Selected Media */}
                                    {uploadMedia.map((file, index) => {
                                        const previewUrl =
                                            URL.createObjectURL(file);

                                        const isVideo =
                                            file.type.startsWith("video/");

                                        return (
                                            <div
                                                key={`timeline-new-${index}`}
                                                className="group relative overflow-hidden rounded-lg border border-primary/20 bg-gray-50"
                                            >
                                                {isVideo ? (
                                                    <video src={previewUrl} controls className="h-32 w-full object-cover" />
                                                ) : (
                                                    <img src={previewUrl} alt={file.name} className="h-32 w-full object-cover" />
                                                )}

                                                {/* New label */}
                                                <span className="absolute left-2 top-2 rounded bg-primary px-2 py-0.5 text-[10px] font-medium text-white">
                                                    New
                                                </span>

                                                {/* Remove */}
                                                <button
                                                    type="button"
                                                    onClick={() => removeNewMedia(index)}
                                                    className="cursor-pointer absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-red-500 text-white opacity-0 shadow transition group-hover:opacity-100 hover:bg-red-600"
                                                >
                                                    <X className="h-4 w-4" />
                                                </button>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
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