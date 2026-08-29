"use client";

import { AnimatePresence, motion } from "framer-motion";
import { FiX } from "react-icons/fi";

interface GalleryMedia {
    type: "image" | "video";
    image: string;
    video?: string;
}

interface MediaViewerProps {
    media: GalleryMedia | null;
    onClose: () => void;
}

export default function MediaViewer({
    media,
    onClose,
}: MediaViewerProps) {
    return (
        <AnimatePresence>
            {media && (
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

                    <motion.div
                        className="relative rounded-xl bg-white p-2 shadow-2xl"
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
                        }}
                        onClick={(event) =>
                            event.stopPropagation()
                        }
                    >

                        {/* Close */}
                        <button
                            type="button"
                            onClick={onClose}
                            className="absolute -right-3 -top-3 z-10 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-white text-lg font-bold text-gray-700 shadow-lg hover:bg-gray-100"
                        >
                            <FiX />
                        </button>

                        {/* Image */}
                        {media.type === "image" && (
                            <img
                                src={media.image}
                                alt="Preview"
                                className="max-h-[80vh] max-w-[85vw] rounded-lg object-contain"
                            />
                        )}

                        {/* Video */}
                        {media.type === "video" &&
                            media.video && (
                                <video
                                    src={media.video}
                                    controls
                                    autoPlay
                                    playsInline
                                    className="max-h-[80vh] max-w-[85vw] rounded-lg object-contain"
                                />
                            )}

                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}