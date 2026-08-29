"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
    FiX,
    FiChevronLeft,
    FiChevronRight,
} from "react-icons/fi";

interface GalleryMedia {
    type: "image" | "video";
    image: string;
    video?: string;
}

interface MediaGalleryViewerProps {
    media: GalleryMedia[];
    initialIndex?: number;
    onClose: () => void;
}

export default function MediaGalleryViewer({
    media,
    initialIndex = 0,
    onClose,
}: MediaGalleryViewerProps) {
    const [currentIndex, setCurrentIndex] =
        useState(initialIndex);

    const totalMedia = media.length;

    useEffect(() => {
        setCurrentIndex(initialIndex);
    }, [initialIndex]);

    const handlePrevious = () => {
        setCurrentIndex((prev) =>
            prev === 0
                ? totalMedia - 1
                : prev - 1
        );
    };

    const handleNext = () => {
        setCurrentIndex((prev) =>
            prev === totalMedia - 1
                ? 0
                : prev + 1
        );
    };

    useEffect(() => {
        const handleKeyDown = (
            event: KeyboardEvent
        ) => {
            if (event.key === "Escape") {
                onClose();
            }

            if (event.key === "ArrowLeft") {
                handlePrevious();
            }

            if (event.key === "ArrowRight") {
                handleNext();
            }
        };

        window.addEventListener(
            "keydown",
            handleKeyDown
        );

        return () => {
            window.removeEventListener(
                "keydown",
                handleKeyDown
            );
        };
    }, [onClose, totalMedia]);

    if (!media.length) {
        return null;
    }

    const currentMedia = media[currentIndex];

    return (
        <AnimatePresence>
            <motion.div
                className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 p-4"
                initial={{
                    opacity: 0,
                }}
                animate={{
                    opacity: 1,
                }}
                exit={{
                    opacity: 0,
                }}
                onClick={onClose}
            >

                {/* Viewer */}
                <motion.div
                    className="relative flex max-h-[90vh] max-w-[90vw] items-center justify-center rounded-xl bg-white p-2 shadow-2xl"
                    initial={{
                        opacity: 0,
                        scale: 0.7,
                    }}
                    animate={{
                        opacity: 1,
                        scale: 1,
                    }}
                    exit={{
                        opacity: 0,
                        scale: 0.7,
                    }}
                    transition={{
                        duration: 0.25,
                        ease: "easeOut",
                    }}
                    onClick={(event) =>
                        event.stopPropagation()
                    }
                >

                    {/* Close */}
                    <button
                        type="button"
                        onClick={onClose}
                        className="absolute -right-3 -top-3 z-30 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-white text-gray-700 shadow-lg transition hover:bg-gray-100"
                        aria-label="Close"
                    >
                        <FiX size={20} />
                    </button>

                    {/* Previous */}
                    {totalMedia > 1 && (
                        <button
                            type="button"
                            onClick={handlePrevious}
                            className="absolute left-3 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-black/50 text-white shadow-lg transition hover:bg-black/70"
                            aria-label="Previous"
                        >
                            <FiChevronLeft size={24} />
                        </button>
                    )}

                    {/* Media */}
                    <AnimatePresence
                        mode="wait"
                    >
                        <motion.div
                            key={currentIndex}
                            className="flex items-center justify-center"
                            initial={{
                                opacity: 0,
                                scale: 0.9,
                            }}
                            animate={{
                                opacity: 1,
                                scale: 1,
                            }}
                            exit={{
                                opacity: 0,
                                scale: 0.9,
                            }}
                            transition={{
                                duration: 0.2,
                            }}
                        >

                            {/* Image */}
                            {currentMedia.type ===
                                "image" && (
                                    <img
                                        src={
                                            currentMedia.image
                                        }
                                        alt={`Photo ${currentIndex + 1
                                            }`}
                                        className="max-h-[85vh] max-w-[85vw] rounded-lg object-contain"
                                    />
                                )}

                            {/* Video */}
                            {currentMedia.type ===
                                "video" &&
                                currentMedia.video && (
                                    <video
                                        key={
                                            currentMedia.video
                                        }
                                        src={
                                            currentMedia.video
                                        }
                                        poster={
                                            currentMedia.image
                                        }
                                        controls
                                        autoPlay
                                        playsInline
                                        className="max-h-[85vh] max-w-[85vw] rounded-lg object-contain"
                                    />
                                )}

                        </motion.div>
                    </AnimatePresence>

                    {/* Next */}
                    {totalMedia > 1 && (
                        <button
                            type="button"
                            onClick={handleNext}
                            className="absolute right-3 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-black/50 text-white shadow-lg transition hover:bg-black/70"
                            aria-label="Next"
                        >
                            <FiChevronRight size={24} />
                        </button>
                    )}

                    {/* Counter */}
                    {totalMedia > 1 && (
                        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-black/60 px-4 py-1.5 text-sm font-medium text-white">
                            {currentIndex + 1} /{" "}
                            {totalMedia}
                        </div>
                    )}

                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}