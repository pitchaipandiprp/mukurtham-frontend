
"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { sweetalert } from "@/utils/sweetalert";
import { constants } from "@/utils/constants";
import { vendorRoutes } from "@/services/api/vendor.routes";
import { apiConfig } from "@/environments/api";
import { ChevronRight } from "lucide-react";

type GalleryForm = {
    category_service_id: string;
    gallery_file: string;
    status: string;
};




export default function CreateGallery() {
    const searchParams = useSearchParams();
    const galleryId = searchParams.get("id");
    const categoryServiceId = searchParams.get("serviceId");

    const initialForm: GalleryForm = {
        category_service_id: String(categoryServiceId),
        gallery_file: "",
        status: "1",
    };

    const router = useRouter();
    const [form, setForm] = useState<GalleryForm>(initialForm);
    const [loading, setLoading] = useState(false);
    const isEditMode = Boolean(galleryId);
    const buttonClass = constants.buttonClass;
    const [categoryServiceData, setCategoryServiceData] = useState<any>(null);
    const [galleryData, setGalleryData] = useState<any>(null);
    const BACKEND_BASE_URL = apiConfig.baseUrl;

    useEffect(() => {
        if (categoryServiceId) {
            getCategoryService();
        }
    }, [categoryServiceId]);

    useEffect(() => {
        if (galleryId) {
            getGallery();
        }
    }, [galleryId]);


    const getCategoryService = async () => {
        const response = await vendorRoutes.getCategoryService({
            id: categoryServiceId ?? undefined,
        });
        setCategoryServiceData(response?.data ?? null);
    };

    const getGallery = async () => {

        try {
            if (!galleryId) {
                sweetalert.toastError("Invalid gallery ID");
                return;
            }

            const result = await vendorRoutes.getGallery({ id: Number(galleryId) });

            if (!result?.success) {
                return;
            }

            if (!result.data || result.data.length === 0) {
                const swalConfirm = await sweetalert.warning("Something went wrong");
                if (swalConfirm.isConfirmed) {
                    router.push("/panel/gallery-list?serviceId=" + categoryServiceId);
                }
            }

            const resultData = result.data;
            setGalleryData(resultData);

            setForm({
                category_service_id: resultData.category_service_id ?? "",
                gallery_file: resultData.gallery_file ?? "",
                status: resultData.status,
            });

            // setGalleryImagePreview(resultData.gallery_image ? `${BACKEND_BASE_URL}/${resultData.gallery_image}` : null);
        } catch (caughtError) {
            console.error("Failed to load category service:", caughtError);
        } finally {
        }
    };

    const handleGalleryFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];

        if (!file) {
            return;
        }

        if (!file.type.startsWith("image/") && !file.type.startsWith("video/")) {
            sweetalert.toastError("Please select a valid image or video");
            event.target.value = "";
            return;
        }

        setForm((prev: any) => ({
            ...prev,
            gallery_file: file,
        }));

        await handleSubmit(file);
    };

    const handleSubmit = async (file: File) => {
        setLoading(true);

        const formData = new FormData();

        formData.append("category_service_id", String(form.category_service_id));
        formData.append("gallery_file", file);
        formData.append("status", String(form.status));

        if (isEditMode) {
            formData.append("id", String(galleryId));
        }

        try {
            const result = await vendorRoutes.createGallery(formData);

            if (result?.success) {
                await sweetalert.success(result.message);
                router.push("/panel/gallery-list?serviceId=" + categoryServiceId);
            }
        } catch (caughtError) {
            console.error("Create gallery failed:", caughtError);
            sweetalert.toastError("Gallery upload failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="d-block">
            <div className="mb-6 ml-1 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <span className="text-2xl font-semibold leading-none text-slate-600">
                        Gallery
                    </span>

                    <ChevronRight className="h-5 w-5 shrink-0 text-slate-400 mt-2" />

                    <span className="text-base font-medium leading-none text-slate-500 mt-2">
                        {categoryServiceData?.service_name ?? ""}
                    </span>
                </div>
                <Link href={`/panel/gallery-list?serviceId=${categoryServiceId}`} className={buttonClass}> Gallery Lists</Link>
            </div>

            <div className="min-h-full px-4 py-4 rounded-xl border border-primary/10 bg-white shadow-sm">
                <form>
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-5">
                        <div className="md:col-span-12">
                            <label htmlFor="galleryFile" className="mb-2 block text-sm font-medium text-gray-700">
                                Upload Image / Video
                            </label>

                            <div className="flex items-center gap-3">
                                <label
                                    htmlFor="galleryFile"
                                    className={`${buttonClass} ${loading ? "pointer-events-none opacity-50" : ""}`}
                                >
                                    {loading ? "Uploading..." : "Browse"}
                                </label>

                                <input
                                    id="galleryFile"
                                    type="file"
                                    accept="image/jpeg,image/png,image/webp,video/mp4,video/webm,video/quicktime"
                                    onChange={handleGalleryFileChange}
                                    className="hidden"
                                    disabled={loading}
                                />
                            </div>
                        </div>
                        <div className="md:col-span-12">
                            {galleryData?.gallery_type === "image" && galleryData?.gallery_image && (
                                <img
                                    src={`${BACKEND_BASE_URL}/${galleryData.gallery_image}`}
                                    alt="Gallery"
                                    className="h-56 w-56 rounded-lg object-cover"
                                />
                            )}

                            {galleryData?.gallery_type === "video" && galleryData?.gallery_video && (
                                <video
                                    src={`${BACKEND_BASE_URL}/${galleryData.gallery_video}`}
                                    controls
                                    className="h-56 w-56 rounded-lg object-cover"
                                />
                            )}
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}