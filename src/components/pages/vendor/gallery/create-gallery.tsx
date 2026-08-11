
"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { sweetalert } from "@/utils/sweetalert";
import { constants } from "@/utils/constants";
import { vendorService } from "@/services/api/vendor.service";
import { apiConfig } from "@/environments/api";

type GalleryForm = {
    category_service_id: string;
    gallery_type: string;
    occasion_type: string;
    gallery_image: string;
    gallery_video: string;
    status: string;
};

const initialForm: GalleryForm = {
    category_service_id: "",
    gallery_type: "",
    occasion_type: "",
    gallery_image: "",
    gallery_video: "",
    status: "0",
};

const occasionTypeLabels = [
    { key: "mandap", label: "Mandap" },
    { key: "wedding", label: "Wedding" },
    { key: "stage-decoration", label: "Stage Decoration" },
    { key: "reception", label: "Reception" },
    { key: "events", label: "Events" },
];

export default function CreateGallery() {
    const router = useRouter();
    const [form, setForm] = useState<GalleryForm>(initialForm);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [categoryServiceRecords, setCategoryServiceRecords] = useState<any[]>([]);
    const [galleryImagePreview, setGalleryImagePreview] = useState<string | null>(null);
    const searchParams = useSearchParams();
    const galleryId = searchParams.get("id");
    const isEditMode = Boolean(galleryId);
    const inputClass = constants.inputClass;
    const buttonClass = constants.buttonClass;
    const buttonClassSubmit = constants.buttonClassSubmit;


    useEffect(() => {
        loadCategoryServiceRecords();
    }, []);


    useEffect(() => {
        if (galleryId) {
            loadGallery();
        }
    }, [galleryId]);


    const loadCategoryServiceRecords = async () => {
        const result = await vendorService.categoryServiceRecords({});
        setCategoryServiceRecords(result?.data || []);
    };

    const updateField = (field: keyof GalleryForm, value: string) => {
        setForm((prev) => ({
            ...prev,
            [field]: value,
        }));
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

    const loadGallery = async () => {
        setError("");

        try {
            if (!galleryId) {
                setError("Invalid gallery ID");
                return;
            }

            const result = await vendorService.getGallery({ id: Number(galleryId) });

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
                occasion_type: galleryData.occasion_type ?? "",
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

        if (!form.occasion_type.trim()) {
            setError("Occasion Type is required");
            return;
        }

        setLoading(true);

        //Create a FormData object to send the data as multipart/form-data
        const formData = new FormData();

        formData.append("category_service_id", form.category_service_id);
        formData.append("gallery_type", form.gallery_type);
        formData.append("occasion_type", form.occasion_type);
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
            const result = await vendorService.createGallery(formData);

            if (result?.success) {
                await sweetalert.success(result.message);
            }
        } catch (caughtError) {
            console.error("Create gallery failed:", caughtError);
        } finally {
            setLoading(false);
        }
    }


    return (
        <div className="d-block">
            <div className="mb-6 ml-1 flex items-center justify-between">
                <b className="text-2xl text-slate-600 tracking-tight">Gallery</b>
                <Link href="/panel/gallery-list" className={buttonClass}> Gallery Lists</Link>
            </div>

            <div className="min-h-full px-4 py-4 rounded-xl border border-primary/10 bg-white shadow-sm">
                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-5">
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
                                <option value="">Select status</option>
                                <option value="1">Active</option>
                                <option value="0">Inactive</option>
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


                        <div className="md:col-span-4">
                            <label htmlFor="occasionType" className="mb-2 block text-sm font-medium text-gray-700">
                                Occasion Type
                            </label>
                            <select
                                id="occasionType"
                                value={form.occasion_type}
                                onChange={(event) => updateField("occasion_type", event.target.value)}
                                className={inputClass}
                            >
                                <option value="">Select Occasion Type</option>

                                {occasionTypeLabels.map(({ key, label }) => (
                                    <option key={`occasion-type-${key}`} value={key}>
                                        {label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="md:col-span-12 mb-3">
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