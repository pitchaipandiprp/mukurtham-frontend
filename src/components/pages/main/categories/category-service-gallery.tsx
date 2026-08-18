"use client";
import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import ImageViewer from "@/components/common/image-viewer/image-viewer";
import PhotoViewer from "@/components/common/image-viewer/photo-viewer";
import mainRoutes from "@/services/api/main.routes";
import { apiConfig } from "@/environments/api";


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
            const result = await mainRoutes.galleryRecords({ category_service_id: categoryServiceId });

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
