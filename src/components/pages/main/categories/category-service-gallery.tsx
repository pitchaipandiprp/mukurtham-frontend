"use client";
import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import ImageViewer from "@/components/common/image-viewer/image-viewer";
import PhotoViewer from "@/components/common/image-viewer/photo-viewer";
import mainService from "@/services/api/main.routes";
import { apiConfig } from "@/environments/api";

const occasionTypeLabels = [
    { key: "mandap", label: "Mandap" },
    { key: "wedding", label: "Wedding" },
    { key: "stage-decoration", label: "Stage Decoration" },
    { key: "reception", label: "Reception" },
    { key: "events", label: "Events" },
];

type Props = {
    categoryServiceId: number | null;
    serviceRecord: any | null;
};

export function CategoryServiceGallery({
    categoryServiceId,
    serviceRecord,
}: Props) {
    const BACKEND_BASE_URL = apiConfig.baseUrl;
    const [galleryRecords, setGalleryRecords] = useState<any[]>([]);
    const [isOccasionTabOpen, setIsOccasionTabOpen] = useState("all");
    const [galleryFilterRecords, setGalleryFilterRecords] = useState<any[]>([]);
    const [selectedGalleryImage, setSelectedGalleryImage] = useState<string | null>(null);
    const [allGalleryImages, setAllGalleryImages] = useState<string[]>([]);
    const [showPhotoViewer, setShowPhotoViewer] = useState(false);

    useEffect(() => {
        if (categoryServiceId) {
            loadGalleryRecords();
        }
    }, [categoryServiceId]);

    const loadGalleryRecords = async () => {
        try {
            if (!categoryServiceId) {
                return;
            }
            const result = await mainService.galleryRecords({ category_service_id: categoryServiceId });

            if (!result?.success) {
                return;
            }

            setGalleryRecords(result.data);
            setGalleryFilterRecords(result.data);

            const allGalleryImages = result.data
                .filter((image: any) => image?.gallery_image)
                .map(
                    (image: any) =>
                        `${BACKEND_BASE_URL}/${image.gallery_image}`
                );
            setAllGalleryImages(allGalleryImages);

        } catch (caughtError) {
            console.error("Failed to load gallery records:", caughtError);
        }
    };


    const occasionTabChange = (key: string) => {
        setIsOccasionTabOpen(key);

        if (key === "all") {
            setGalleryFilterRecords(galleryRecords);
            return;
        }

        const filteredRecords = galleryRecords.filter(
            (image) => image.occasion_type === key
        );

        setGalleryFilterRecords(filteredRecords);
    };

    return (
        <>
            <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
                <div className="mb-4 flex items-center justify-between">
                    <h3 className="text-sm font-bold text-gray-900">Photos</h3>
                    <button
                        type="button"
                        className="text-xs font-medium text-primary hover:underline cursor-pointer"
                        onClick={() => setShowPhotoViewer(true)}
                    >View All</button>
                </div>
                <div className="mb-4 flex gap-2 overflow-x-auto text-xs">
                    <button
                        type="button"
                        className={`rounded-full px-3 py-1 cursor-pointer ${isOccasionTabOpen === 'all' ? 'bg-primary text-white' : 'bg-gray-300 text-gray-600'}`}
                        onClick={() => occasionTabChange('all')}
                    >
                        All
                    </button>
                    {occasionTypeLabels.map(({ key, label }) => (
                        <button
                            key={key}
                            type="button"
                            className={`rounded-full px-3 py-1 cursor-pointer ${isOccasionTabOpen === key ? 'bg-primary text-white' : 'bg-gray-300 text-gray-600'}`}
                            onClick={() => occasionTabChange(key)}
                        >{label}</button>
                    ))}
                </div>
                <AnimatePresence mode="wait">
                    <motion.div
                        key={isOccasionTabOpen}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -15 }}
                        transition={{ duration: 0.3 }}
                        className="grid grid-cols-2 gap-3 sm:grid-cols-5"
                    >
                        {galleryFilterRecords.map((image, index) => (
                            <motion.img
                                key={`gallery-image-${image.id ?? index}`}
                                src={
                                    image?.gallery_image
                                        ? `${BACKEND_BASE_URL}/${image.gallery_image}`
                                        : undefined
                                }
                                alt="Gallery"
                                className="h-24 w-full rounded-lg object-cover cursor-pointer"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{
                                    duration: 0.25,
                                    delay: index * 0.05,
                                }}
                                whileHover={{ scale: 1.05 }}
                                onClick={() => {
                                    if (image?.gallery_image) {
                                        setSelectedGalleryImage(
                                            `${BACKEND_BASE_URL}/${image.gallery_image}`
                                        );
                                    }
                                }}
                            />
                        ))}
                    </motion.div>
                </AnimatePresence>

                <ImageViewer
                    image={selectedGalleryImage}
                    onClose={() => setSelectedGalleryImage(null)}
                />

                {showPhotoViewer && (
                    <PhotoViewer
                        images={allGalleryImages}
                        initialIndex={0}
                        onClose={() => setShowPhotoViewer(false)}
                    />
                )}
            </div>
        </>
    )
}
