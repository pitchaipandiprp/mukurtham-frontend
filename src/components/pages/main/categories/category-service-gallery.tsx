"use client";

import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FiPlay } from "react-icons/fi";

import MediaViewer from "@/components/common/gallery-viewer/media-viewer";
import MediaGalleryViewer from "@/components/common/gallery-viewer/media-gallery-viewer";
import mainRoutes from "@/services/api/main.routes";
import { apiConfig } from "@/environments/api";

type GalleryRecord = {
    id: number;
    gallery_type: "image" | "video";
    gallery_image: string | null;
    gallery_video: string | null;
};

type GalleryMedia = {
    type: "image" | "video";
    image: string;
    video?: string;
};

type Props = {
    categoryServiceId: number | null;
    serviceRecord: any | null;
};

export function CategoryServiceGallery({
    categoryServiceId,
    serviceRecord,
}: Props) {
    const BACKEND_BASE_URL = apiConfig.baseUrl;

    const [galleryRecords, setGalleryRecords] = useState<GalleryRecord[]>([]);
    const [isGalleryTypeTabOpen, setIsGalleryTypeTabOpen] = useState("all");
    const [galleryFilterRecords, setGalleryFilterRecords] = useState<GalleryRecord[]>([]);

    const [selectedGallery, setSelectedGallery] =
        useState<GalleryMedia | null>(null);

    const [allGalleryMedia, setAllGalleryMedia] =
        useState<GalleryMedia[]>([]);

    const [showMediaGalleryViewer, setShowMediaGalleryViewer] = useState(false);

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

            const result = await mainRoutes.galleryRecords({
                category_service_id: categoryServiceId,
            });

            if (!result?.success) {
                return;
            }

            const records: GalleryRecord[] = result.data ?? [];

            setGalleryRecords(records);
            setGalleryFilterRecords(records);

            /*
             * Prepare image + video data for viewer
             */
            const mediaRecords: GalleryMedia[] = records
                .filter((record) => record.gallery_image)
                .map((record) => ({
                    type: record.gallery_type,
                    image: `${BACKEND_BASE_URL}/${record.gallery_image}`,
                    video: record.gallery_video
                        ? `${BACKEND_BASE_URL}/${record.gallery_video}`
                        : undefined,
                }));

            setAllGalleryMedia(mediaRecords);

        } catch (caughtError) {
            console.error(
                "Failed to load gallery records:",
                caughtError
            );
        }
    };

    const galleryTypeChange = (type: string) => {
        setIsGalleryTypeTabOpen(type);

        if (type === "all") {
            setGalleryFilterRecords(galleryRecords);
            return;
        }

        const filteredRecords = galleryRecords.filter(
            (record) => record.gallery_type === type
        );

        setGalleryFilterRecords(filteredRecords);
    };

    const getImageUrl = (record: GalleryRecord) => {
        if (!record.gallery_image) {
            return undefined;
        }

        return `${BACKEND_BASE_URL}/${record.gallery_image}`;
    };

    const getVideoUrl = (record: GalleryRecord) => {
        if (!record.gallery_video) {
            return undefined;
        }

        return `${BACKEND_BASE_URL}/${record.gallery_video}`;
    };

    return (
        <>
            <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">

                {/* Tabs */}
                <div className="mb-4 flex items-center justify-between">

                    <div className="flex items-center">

                        <button
                            type="button"
                            className={`cursor-pointer rounded px-3 py-1 mr-2 text-[11px] ${isGalleryTypeTabOpen === "all"
                                ? "bg-primary text-white"
                                : "bg-gray-300 text-gray-600 hover:bg-pink-50"
                                }`}
                            onClick={() =>
                                galleryTypeChange("all")
                            }
                        >
                            All
                        </button>

                        <button
                            type="button"
                            className={`cursor-pointer rounded px-3 py-1 mr-2 text-[11px] ${isGalleryTypeTabOpen === "image"
                                ? "bg-primary text-white"
                                : "bg-gray-300 text-gray-600 hover:bg-pink-50"
                                }`}
                            onClick={() =>
                                galleryTypeChange("image")
                            }
                        >
                            Photo
                        </button>

                        <button
                            type="button"
                            className={`cursor-pointer rounded px-3 py-1 mr-2 text-[11px] ${isGalleryTypeTabOpen === "video"
                                ? "bg-primary text-white"
                                : "bg-gray-300 text-gray-600 hover:bg-pink-50"
                                }`}
                            onClick={() =>
                                galleryTypeChange("video")
                            }
                        >
                            Video
                        </button>

                    </div>

                    <button
                        type="button"
                        className="cursor-pointer text-xs font-medium text-primary hover:underline"
                        onClick={() =>
                            setShowMediaGalleryViewer(true)
                        }
                    >
                        View All
                    </button>

                </div>

                {/* Gallery */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={isGalleryTypeTabOpen}
                        initial={{
                            opacity: 0,
                            y: 15,
                        }}
                        animate={{
                            opacity: 1,
                            y: 0,
                        }}
                        exit={{
                            opacity: 0,
                            y: -15,
                        }}
                        transition={{
                            duration: 0.3,
                        }}
                        className="grid grid-cols-2 gap-3 sm:grid-cols-5"
                    >

                        {galleryFilterRecords.map(
                            (record, index) => {

                                const imageUrl =
                                    getImageUrl(record);

                                const videoUrl =
                                    getVideoUrl(record);

                                if (!imageUrl) {
                                    return null;
                                }

                                return (
                                    <motion.div
                                        key={`gallery-${record.id ?? index}`}
                                        className="relative h-24 w-full cursor-pointer overflow-hidden rounded-lg"
                                        initial={{
                                            opacity: 0,
                                            scale: 0.9,
                                        }}
                                        animate={{
                                            opacity: 1,
                                            scale: 1,
                                        }}
                                        transition={{
                                            duration: 0.25,
                                            delay: index * 0.05,
                                        }}
                                        whileHover={{
                                            scale: 1.05,
                                        }}
                                        onClick={() => {
                                            setSelectedGallery({
                                                type: record.gallery_type,
                                                image: imageUrl,
                                                video: videoUrl,
                                            });
                                        }}
                                    >

                                        {/* Thumbnail */}
                                        <img
                                            src={imageUrl}
                                            alt={
                                                record.gallery_type ===
                                                    "video"
                                                    ? "Video thumbnail"
                                                    : "Gallery"
                                            }
                                            className="h-full w-full object-cover"
                                        />

                                        {/* Video Play Icon */}
                                        {record.gallery_type ===
                                            "video" && (
                                                <div className="absolute inset-0 flex items-center justify-center">
                                                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-black/60 text-white shadow-lg">
                                                        <FiPlay
                                                            size={20}
                                                            className="ml-0.5 fill-current"
                                                        />
                                                    </span>
                                                </div>
                                            )}

                                    </motion.div>
                                );
                            }
                        )}

                    </motion.div>
                </AnimatePresence>

                {/* Single Image / Video Viewer */}
                <MediaViewer
                    media={selectedGallery}
                    onClose={() =>
                        setSelectedGallery(null)
                    }
                />

                {/* View All */}
                {showMediaGalleryViewer && (
                    <MediaGalleryViewer
                        media={allGalleryMedia}
                        initialIndex={0}
                        onClose={() =>
                            setShowMediaGalleryViewer(false)
                        }
                    />
                )}

            </div>
        </>
    );
}