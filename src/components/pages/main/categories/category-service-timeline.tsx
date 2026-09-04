"use client";
import { useState, useEffect } from "react";
import { ListX, Play } from "lucide-react";
import { FiHeart, FiMessageCircle, FiMoreHorizontal } from "react-icons/fi";

import MediaGalleryViewer from "@/components/common/gallery-viewer/media-gallery-viewer";
import TablePagination from "@/components/common/datatable/pagination";
import { common as commonUtils } from "@/utils/common";
import { helperUtils } from "@/utils/helpers";
import mainRoutes from "@/services/api/main.routes";
import { apiConfig } from "@/environments/api";

type GalleryMedia = {
    type: "image" | "video";
    image: string;
    video?: string;
};

type Props = {
    categoryServiceId: number | null;
    serviceRecord: any | null;
};

export function CategoryServiceTimeline({
    categoryServiceId,
    serviceRecord,
}: Props) {

    const BACKEND_BASE_URL = apiConfig.baseUrl;
    const [timelineList, setTimelineList] = useState<any[]>([]);

    const [selectedGallery, setSelectedGallery] = useState<any[]>([]);
    const [selectedGalleryIndex, setSelectedGalleryIndex] = useState(0);
    const [isGalleryOpen, setIsGalleryOpen] = useState(false);

    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [totalRecords, setTotalRecords] = useState(0);


    useEffect(() => {
        if (categoryServiceId) {
            serviceTimelineList();
        }
    }, [page, categoryServiceId]);

    const serviceTimelineList = async () => {
        try {
            if (!categoryServiceId) {
                return;
            }

            const result = await mainRoutes.serviceTimelineList({
                category_service_id: categoryServiceId,
                page,
                limit: 2,
            });

            if (!result?.success) {
                return;
            }

            const responData = result.data;

            setTotalPages(responData?.totalPages ?? 0);
            setTotalRecords(responData?.total ?? 0);
            setTimelineList(responData?.rows ?? []);
        } catch (caughtError) {
            console.error("Failed to load timeline list:", caughtError);
        }
    };

    const getTimelineGalleryMedia = (gallery: any[]): GalleryMedia[] => {
        return gallery
            .filter(
                (item) =>
                    item?.gallery_image || item?.gallery_video
            )
            .map((item) => {
                const imageUrl = item?.gallery_image ? `${BACKEND_BASE_URL}/${item.gallery_image.replace(/^\/+/, "")}` : "";
                const videoUrl = item?.gallery_video ? `${BACKEND_BASE_URL}/${item.gallery_video.replace(/^\/+/, "")}` : undefined;

                return {
                    type: item.gallery_type === "video" ? "video" : "image",
                    image: imageUrl,
                    video: videoUrl,
                };
            });
    };

    const handleTimelineGalleryClick = (timelineGallery: any[], index: number) => {
        const media = getTimelineGalleryMedia(timelineGallery);
        setSelectedGallery(media);
        setSelectedGalleryIndex(index);
        setIsGalleryOpen(true);
    };

    return (
        <>
            <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
                <h3 className="mb-4 text-sm font-bold text-gray-900">Timeline</h3>

                <div className="mb-6 flex items-center gap-3 rounded-xl border border-gray-200 bg-gray-50 p-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-bold text-white">R</div>
                    <input type="text" placeholder="Write something..." className="flex-1 bg-transparent text-xs outline-none" />
                    <button type="button" className="px-2 text-xs font-medium text-primary">Post</button>
                </div>

                <div className="space-y-6">
                    {timelineList && (
                        timelineList.map((item: any) => {
                            const timelineGallery = Array.isArray(item?.service_timeline_gallery) ? item.service_timeline_gallery : [];
                            return (
                                <div key={`timelines-record-${item.id}`}>
                                    <div className="border-b border-gray-200 pb-4">
                                        <div className="mb-2 flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-xs font-bold text-white">
                                                    {commonUtils.firstLetter(serviceRecord?.service_name)}
                                                </div>

                                                <div>
                                                    <h5 className="text-xs font-bold text-gray-900">
                                                        {serviceRecord?.service_name ?? ''}
                                                    </h5>

                                                    <span className="text-[10px] text-gray-400">
                                                        {commonUtils.timeAgo(item?.updated_at)}
                                                    </span>
                                                </div>
                                            </div>

                                            <button
                                                type="button"
                                                className="text-gray-400 hover:text-gray-600"
                                                aria-label="Post options"
                                            >
                                                <FiMoreHorizontal />
                                            </button>
                                        </div>

                                        <div className="mb-3 text-xs text-gray-700">
                                            {helperUtils.hashtagContent(item?.timeline_content)}
                                        </div>

                                        {/* Timeline Gallery */}
                                        {timelineGallery.length > 0 && (
                                            <div className={`mb-3 grid grid-cols-1 gap-2 ${timelineGallery.length > 1 ? "md:grid-cols-2" : "md:grid-cols-1"}`} >
                                                {timelineGallery.map(
                                                    (gallery: any, index: number) => {
                                                        const imageUrl = gallery?.gallery_image ? `${BACKEND_BASE_URL}/${gallery.gallery_image.replace(/^\/+/, "")}` : "";

                                                        return (
                                                            <button
                                                                key={`timeline-gallery-${gallery.id}`}
                                                                type="button"
                                                                onClick={() => handleTimelineGalleryClick(timelineGallery, index)}
                                                                className="group relative aspect-video overflow-hidden rounded-lg bg-gray-100"
                                                            >
                                                                {imageUrl && (
                                                                    <img
                                                                        src={imageUrl}
                                                                        alt="Timeline gallery"
                                                                        className="cursor-pointer h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                                                    />
                                                                )}

                                                                {gallery.gallery_type === "video" && (
                                                                    <div className="cursor-pointer absolute inset-0 flex items-center justify-center bg-black/20">
                                                                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-black/60 text-white shadow-lg">
                                                                            <Play
                                                                                size={26}
                                                                                className="ml-1 fill-current"
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                )}
                                                            </button>
                                                        )
                                                    }
                                                )}
                                            </div>
                                        )}

                                        {/* <div className="flex items-center gap-4 text-xs text-gray-500">
                                            <button
                                                type="button"
                                                className="flex items-center gap-1 hover:text-primary"
                                            >
                                                <FiHeart /> 128
                                            </button>

                                            <button
                                                type="button"
                                                className="flex items-center gap-1 hover:text-primary"
                                            >
                                                <FiMessageCircle /> 12
                                            </button>
                                        </div> */}
                                    </div>
                                </div>
                            );
                        })
                    )}

                    {!timelineList?.length && (
                        <div className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-600">
                            <ListX className="h-3.5 w-3.5" />
                            No Timeline Found
                        </div>
                    )}

                    {/* <TablePagination
                        page={page}
                        totalPages={totalPages}
                        totalRecords={totalRecords}
                        onPageChange={setPage}
                        showPageInfo={false}
                        showBorder={false}
                        size={2}
                    /> */}
                </div>
            </div>

            {isGalleryOpen && (
                <MediaGalleryViewer
                    media={selectedGallery}
                    initialIndex={selectedGalleryIndex}
                    onClose={() => setIsGalleryOpen(false)}
                />
            )}
        </>
    );
}