"use client";

import { FiStar } from "react-icons/fi";
import { common as commonUtils } from "@/utils/common";


interface RatingStarsProps {
    rating: number;
    size?: number;
    className?: string;
}

export default function RatingStars({
    rating,
    size = 14,
    className = "",
}: RatingStarsProps) {
    return (
        <div className={`flex ${className}`}>
            {commonUtils.ratingStars.map((star) => (
                <FiStar
                    key={star}
                    size={size}
                    className={
                        star <= rating
                            ? "fill-current text-primary/80"
                            : "text-gray-300"
                    }
                />
            ))}
        </div>
    );
}