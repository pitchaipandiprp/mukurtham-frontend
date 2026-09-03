"use client";
import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import MediaViewer from "@/components/common/gallery-viewer/media-viewer";
import MediaGalleryViewer from "@/components/common/gallery-viewer/media-gallery-viewer";
import mainRoutes from "@/services/api/main.routes";
import { apiConfig } from "@/environments/api";
import { Play } from "lucide-react";

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
    const [galleryRecords, setGalleryRecords] = useState<any[]>([]);
    const [isGalleryTypeTabOpen, setIsGalleryTypeTabOpen] = useState("all");
    const [galleryFilterRecords, setGalleryFilterRecords] = useState<any[]>([]);
    const [selectedGalleryMedia, setSelectedGalleryMedia] = useState<GalleryMedia | null>(null);
    const [allGalleryMedia, setAllGalleryMedia] = useState<GalleryMedia[]>([]);
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

            const records = result.data || [];

            setGalleryRecords(records);
            setGalleryFilterRecords(records);

            const media = records
                .filter((record: any) => record?.gallery_image || record?.gallery_video)
                .map((record: any) => {
                    const imageUrl = record?.gallery_image ? `${BACKEND_BASE_URL}/${record.gallery_image}` : "";
                    const videoUrl = record?.gallery_video ? `${BACKEND_BASE_URL}/${record.gallery_video}` : undefined;

                    return {
                        type: record.gallery_type === "video" ? ("video" as const) : ("image" as const),
                        // Thumbnail / poster
                        image: imageUrl,
                        // Actual video
                        video: videoUrl,
                    };
                });

            setAllGalleryMedia(media);
        } catch (caughtError) {
            console.error("Failed to load gallery records:", caughtError);
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

    const getMediaData = (record: any) => {
        if (!record?.gallery_image && !record?.gallery_video) {
            return null;
        }

        const imageUrl = record?.gallery_image ? `${BACKEND_BASE_URL}/${record.gallery_image}` : "";
        const videoUrl = record?.gallery_video ? `${BACKEND_BASE_URL}/${record.gallery_video}` : undefined;

        return {
            type: record.gallery_type === "video" ? ("video" as const) : ("image" as const),
            // Thumbnail / poster image
            image: imageUrl,
            // Actual video URL
            video: videoUrl,
        };
    };

    return (
        <>
            <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
                {/* Header */}
                <div className="mb-4 flex items-center justify-between">
                    <div className="flex items-center">
                        {/* All */}
                        <button
                            type="button"
                            className={`mr-2 cursor-pointer rounded-full px-3 py-1 text-[11px] ${isGalleryTypeTabOpen === "all"
                                ? "bg-primary text-white"
                                : "bg-gray-300 text-gray-600 hover:bg-pink-50"
                                }`}
                            onClick={() => galleryTypeChange("all")}
                        >
                            All
                        </button>

                        {/* Photo */}
                        <button
                            type="button"
                            className={`mr-2 cursor-pointer rounded-full px-3 py-1 text-[11px] ${isGalleryTypeTabOpen === "image"
                                ? "bg-primary text-white"
                                : "bg-gray-300 text-gray-600 hover:bg-pink-50"
                                }`}
                            onClick={() => galleryTypeChange("image")}
                        >
                            Photo
                        </button>

                        {/* Video */}
                        <button
                            type="button"
                            className={`mr-2 cursor-pointer rounded-full px-3 py-1 text-[11px] ${isGalleryTypeTabOpen === "video"
                                ? "bg-primary text-white"
                                : "bg-gray-300 text-gray-600 hover:bg-pink-50"
                                }`}
                            onClick={() => galleryTypeChange("video")}
                        >
                            Video
                        </button>
                    </div>

                    {/* View All */}
                    <button
                        type="button"
                        className="cursor-pointer rounded-full px-3 py-1 text-[11px] bg-white border border-primary text-primary"
                        onClick={() => setShowMediaGalleryViewer(true)}
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
                                const media = getMediaData(record);

                                if (!media) {
                                    return null;
                                }

                                return (
                                    <motion.div
                                        key={`gallery-media-${record.id ?? index}`}
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
                                            delay:
                                                index * 0.05,
                                        }}
                                        whileHover={{
                                            scale: 1.05,
                                        }}
                                        onClick={() =>
                                            setSelectedGalleryMedia(
                                                media
                                            )
                                        }
                                    >
                                        {/* Image */}
                                        <img
                                            src={media.image}
                                            alt="Gallery"
                                            className="h-full w-full object-cover"
                                        />

                                        {/* Video Play Indicator */}
                                        {media.type ===
                                            "video" && (
                                                <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                                                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-black/60 text-white shadow-lg">
                                                        <Play
                                                            size={26}
                                                            className="ml-1 fill-current"
                                                        />
                                                    </div>
                                                </div>
                                            )}
                                    </motion.div>
                                );
                            }
                        )}
                    </motion.div>
                </AnimatePresence>

                {/* Single Media Viewer */}
                <MediaViewer
                    media={selectedGalleryMedia}
                    onClose={() => setSelectedGalleryMedia(null)}
                />

                {/* View All Media Gallery Viewer */}
                {showMediaGalleryViewer && (
                    <MediaGalleryViewer
                        media={allGalleryMedia}
                        initialIndex={0}
                        onClose={() => setShowMediaGalleryViewer(false)}
                    />
                )}
            </div>
        </>
    );
}