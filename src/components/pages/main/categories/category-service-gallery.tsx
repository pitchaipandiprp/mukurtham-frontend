"use client";

import { useEffect, useState, useRef } from "react";
import { Play } from "lucide-react";
import MediaViewer from "@/components/common/gallery-viewer/media-viewer";
import mainRoutes from "@/services/api/main.routes";
import { apiConfig } from "@/environments/api";
import { common as commonUtils } from "@/utils/common";
import { helperUtils } from "@/utils/helpers";

type GalleryRecord = {
    id: number;
    gallery_type: "image" | "video";
    gallery_image: string | null;
    gallery_video: string | null;
    gallery_description?: string | null;
    updated_at: any;
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
    const [selectedMedia, setSelectedMedia] = useState<GalleryMedia | null>(null);
    const [timelineExpanded, setTimelineExpanded] = useState<number | null>(null);
    const [timelineHasMore, setTimelineHasMore] = useState<Record<number, boolean>>({});
    const timelineRefs = useRef<Record<number, HTMLDivElement | null>>({});

    useEffect(() => {
        if (categoryServiceId) {
            loadGalleryRecords();
        }
    }, [categoryServiceId]);

    useEffect(() => {
        const result: Record<number, boolean> = {};

        Object.entries(timelineRefs.current).forEach(([id, element]) => {
            if (element) {
                const lineHeight = parseFloat(getComputedStyle(element).lineHeight);
                result[Number(id)] = element.scrollHeight > lineHeight * 2;
            }
        });

        setTimelineHasMore(result);
    }, [galleryRecords]);

    const loadGalleryRecords = async () => {
        try {
            if (!categoryServiceId) {
                return;
            }

            const result = await mainRoutes.galleryRecords({ category_service_id: categoryServiceId, });

            if (!result?.success) {
                return;
            }

            setGalleryRecords(result.data ?? []);
        } catch (error) {
            console.error("Failed to load gallery records:", error);
        }
    };

    const getImageUrl = (image: string | null) => {
        if (!image) {
            return "";
        }
        return `${BACKEND_BASE_URL}/${image}`;
    };

    const getVideoUrl = (video: string | null) => {
        if (!video) {
            return "";
        }
        return `${BACKEND_BASE_URL}/${video}`;
    };

    return (
        <>
            <div className="mx-auto w-full max-w-122122">

                {/* Header */}
                <div className="mb-4 flex items-center">
                    <h2 className="text-lg font-semibold text-gray-800">
                        Gallery
                    </h2>
                </div>

                {/* Instagram Feed */}
                <div className="max-h-[500px] overflow-y-auto space-y-5 pr-2">

                    {!galleryRecords.length && (
                        <div className="flex item-center justify-center text-gray-500 rounded-xl border border-gray-200 bg-white shadow-sm py-5">
                            No Records Found
                        </div>
                    )}

                    {galleryRecords.map(
                        (record) => {
                            const imageUrl = getImageUrl(record.gallery_image);
                            const videoUrl = getVideoUrl(record.gallery_video);

                            // if (!imageUrl) {
                            //     return null;
                            // }

                            return (
                                <div
                                    key={`galery-records-${record.id}`}
                                    className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm"
                                >

                                    {/* Header */}
                                    <div className="flex items-center gap-3 px-4 py-3">
                                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-sm font-semibold text-white">
                                            {serviceRecord?.service_name?.charAt(0)?.toUpperCase() ?? ""}
                                        </div>

                                        <div>
                                            <div className="text-sm font-semibold text-gray-800">
                                                {serviceRecord?.service_name ?? "Gallery"}
                                            </div>
                                            <span className="text-xs text-gray-400">{commonUtils.timeAgo(record?.updated_at)}</span>
                                        </div>

                                    </div>

                                    {/* Media */}
                                    {imageUrl && (
                                        <div
                                            className="relative mx-auto w-full max-w-[450px] cursor-pointer overflow-hidden bg-black"
                                            onClick={() =>
                                                setSelectedMedia({
                                                    type: record.gallery_type,
                                                    image: imageUrl,
                                                    video: videoUrl || undefined,
                                                })
                                            }
                                        >
                                            <img
                                                src={imageUrl}
                                                alt="Gallery"
                                                className="h-[250px] w-full object-cover"
                                            />

                                            {record.gallery_type === "video" && (
                                                <div className="absolute inset-0 flex items-center justify-center">
                                                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-black/60 text-white shadow-xl backdrop-blur-sm">
                                                        <Play
                                                            size={26}
                                                            className="ml-1 fill-current"
                                                        />
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {/* Bottom */}
                                    <div className="px-4 py-3">
                                        {record.gallery_description && (
                                            <>
                                                <div
                                                    ref={(element) => { timelineRefs.current[record.id] = element; }}
                                                    className={`text-xs leading-5 text-gray-500 ${timelineExpanded === record.id ? "" : "line-clamp-2"}`}
                                                >
                                                    {helperUtils.hashtagContent(record.gallery_description)}
                                                </div>

                                                {timelineHasMore[record.id] && (
                                                    <button
                                                        type="button"
                                                        onClick={() => setTimelineExpanded(timelineExpanded === record.id ? null : record.id)}
                                                        className="mt-1 cursor-pointer text-xs font-medium text-primary hover:underline"
                                                    >
                                                        {timelineExpanded === record.id ? "Read less" : "Read more"}
                                                    </button>
                                                )}
                                            </>
                                        )}
                                    </div>
                                </div>
                            );
                        }
                    )}

                </div>

            </div>

            {/* Viewer */}
            <MediaViewer media={selectedMedia} onClose={() => setSelectedMedia(null)} />
        </>
    );
}