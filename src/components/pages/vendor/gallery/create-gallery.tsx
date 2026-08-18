
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
    gallery_type: string;
    gallery_image: string;
    gallery_video: string;
    status: string;
};




export default function CreateGallery() {
    const searchParams = useSearchParams();
    const galleryId = searchParams.get("id");
    const categoryServiceId = searchParams.get("serviceId");

    const initialForm: GalleryForm = {
        category_service_id: String(categoryServiceId),
        gallery_type: "",
        gallery_image: "",
        gallery_video: "",
        status: "0",
    };

    const router = useRouter();
    const [form, setForm] = useState<GalleryForm>(initialForm);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [galleryImagePreview, setGalleryImagePreview] = useState<string | null>(null);
    const isEditMode = Boolean(galleryId);
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
        if (galleryId) {
            loadGallery();
        }
    }, [galleryId]);


    const getCategoryService = async () => {
        const response = await vendorRoutes.getCategoryService({
            id: categoryServiceId ?? undefined,
        });
        setCategoryServiceData(response?.data ?? null);
    };

    const loadGallery = async () => {
        setError("");

        try {
            if (!galleryId) {
                setError("Invalid gallery ID");
                return;
            }

            const result = await vendorRoutes.getGallery({ id: Number(galleryId) });

            if (!result?.success) {
                return;
            }

            if (!result.data || result.data.length === 0) {
                const swalConfirm = await sweetalert.warning("Something went wrong");
                if (swalConfirm.isConfirmed) {
                    router.push("/panel/gallery-list");
                }
            }

            const galleryData = result.data;
            const BACKEND_BASE_URL = apiConfig.baseUrl;

            setForm({
                category_service_id: galleryData.category_service_id ?? "",
                gallery_type: galleryData.gallery_type ?? "",
                gallery_image: galleryData.gallery_image ?? "",
                gallery_video: galleryData.gallery_video ?? "",
                status: galleryData.status,
            });

            setGalleryImagePreview(galleryData.gallery_image ? `${BACKEND_BASE_URL}/${galleryData.gallery_image}` : null);
        } catch (caughtError) {
            console.error("Failed to load category service:", caughtError);
        } finally {
        }
    };

    const handleGalleryImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0] || null;

        if (!file) {
            return;
        }

        // Validate file type
        if (!file.type.startsWith("image/")) {
            setError("Please select a valid image");
            return;
        }

        // Validate file size - 5MB
        if (file.size > 5 * 1024 * 1024) {
            setError("Banner image must be less than 5MB");
            return;
        }

        setError("");

        setForm((prev: any) => ({
            ...prev,
            gallery_image: file,
        }));

        setGalleryImagePreview(URL.createObjectURL(file));
    };

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setError("");

        if (!form.category_service_id) {
            setError("Category Service is required");
            return;
        }

        if (!form.gallery_type.trim()) {
            setError("Gallery Type is required");
            return;
        }


        setLoading(true);

        //Create a FormData object to send the data as multipart/form-data
        const formData = new FormData();

        formData.append("category_service_id", form.category_service_id);
        formData.append("gallery_type", form.gallery_type);
        // formData.append("gallery_video", form.gallery_video);

        if (form.gallery_image) {
            formData.append(
                "gallery_image",
                form.gallery_image
            );
        }


        formData.append("status", form.status);
        if (isEditMode) {
            formData.append("id", galleryId!);
        }

        try {
            const result = await vendorRoutes.createGallery(formData);

            if (result?.success) {
                await sweetalert.success(result.message);
            }
        } catch (caughtError) {
            console.error("Create gallery failed:", caughtError);
        } finally {
            setLoading(false);
        }
    }

    const updateField = (field: keyof GalleryForm, value: string) => {
        setForm((prev) => ({
            ...prev,
            [field]: value,
        }));
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
                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-5">

                        <div className="md:col-span-4">
                            <label htmlFor="galleryType" className="mb-2 block text-sm font-medium text-gray-700">
                                Gallery Type
                            </label>
                            <select
                                id="galleryType"
                                value={form.gallery_type}
                                onChange={(event) => updateField("gallery_type", event.target.value)}
                                className={inputClass}
                            >
                                <option value="">Select Gallery Type</option>
                                <option value="image">Image</option>
                                <option value="video">Video</option>
                            </select>
                        </div>

                        <div className="md:col-span-2"></div>


                        <div className="md:col-span-4 mb-3">
                            <label htmlFor="galleryImage" className="mb-2 block text-sm font-medium text-gray-700">
                                Gallery Image
                            </label>
                            <div className="flex items-center gap-3">
                                <label
                                    htmlFor="galleryImage"
                                    className={buttonClass}
                                >
                                    Browse
                                </label>

                                <input
                                    id="galleryImage"
                                    type="file"
                                    accept="image/jpeg,image/png,image/webp"
                                    onChange={handleGalleryImageChange}
                                    className="hidden"
                                />

                                <span className="text-sm text-slate-500">
                                    {form.gallery_image ? '' : "No image selected"}
                                </span>
                            </div>
                            {galleryImagePreview && (
                                <div className="mt-5">
                                    <img
                                        src={galleryImagePreview}
                                        alt="Gallery Image Preview"
                                        className="h-15 w-50 rounded-xl object-cover shadow-md"
                                    />
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-5">
                        {error && <div className="md:col-span-12 text-sm text-rose-600">{error}</div>}
                        <div className="md:col-span-12 flex justify-end">
                            <button
                                type="submit"
                                className={buttonClassSubmit}
                                disabled={loading}
                            >
                                {loading ? "Saving..." : "Save"}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}