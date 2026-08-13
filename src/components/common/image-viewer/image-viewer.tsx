"use client";

import { AnimatePresence, motion } from "framer-motion";
import { FiX } from "react-icons/fi";

interface ImageViewerProps {
    image: string | null;
    onClose: () => void;
}

export default function ImageViewer({
    image,
    onClose,
}: ImageViewerProps) {
    return (
        <AnimatePresence>
            {image && (
                <motion.div
                    className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 p-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
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
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Close */}
                        <button
                            type="button"
                            onClick={onClose}
                            className="absolute -right-3 -top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white text-lg font-bold text-gray-700 shadow-lg hover:bg-gray-100 cursor-pointer"
                        >
                            <FiX />
                        </button>

                        {/* Image */}
                        <img
                            src={image}
                            alt="Preview"
                            className="max-h-[70vh] max-w-[80vw] rounded-lg object-contain"
                        />
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}