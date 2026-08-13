"use client";

import { FiStar } from "react-icons/fi";

interface RatingStarsProps {
    rating: number;
    size?: number;
    className?: string;
}

export default function RatingStars({
    rating,
    size = 16,
    className = "",
}: RatingStarsProps) {
    return (
        <div className={`flex items-center ${className}`}>
            {Array.from({ length: 5 }, (_, index) => {
                const star = index + 1;

                const isFull = rating >= star;
                const isHalf =
                    rating >= star - 0.5 && rating < star;

                return (
                    <div
                        key={star}
                        className="relative"
                        style={{
                            width: size,
                            height: size,
                        }}
                    >
                        {/* Empty Star */}
                        <FiStar
                            size={size}
                            className="absolute left-0 top-0 text-gray-300"
                        />

                        {/* Full / Half Star */}
                        {isFull && (
                            <FiStar
                                size={size}
                                className="absolute left-0 top-0 fill-current text-primary/80"
                            />
                        )}

                        {isHalf && (
                            <div
                                className="absolute left-0 top-0 overflow-hidden"
                                style={{
                                    width: `${size / 2}px`,
                                }}
                            >
                                <FiStar
                                    size={size}
                                    className="fill-current text-primary/80"
                                />
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
}