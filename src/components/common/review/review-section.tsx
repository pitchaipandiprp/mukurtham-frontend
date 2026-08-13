"use client";

import { constants } from "@/utils/constants";
import { FiStar, FiUser, FiThumbsUp, } from "react-icons/fi";
import RatingStars from "./rating-stars";

export interface Review {
    id: number;
    rating: number;
    review_title?: string | null;
    review_description?: string | null;
    created_at?: string | null;

    user?: {
        id?: number;
        name?: string | null;
    };
}

export interface RatingCounts {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
}

interface ReviewSectionProps {
    reviews: Review[];
    totalReviews: number;
    averageRating: number;
    ratingCounts: RatingCounts;

    title?: string;
    description?: string;

    showWriteReview?: boolean;
    showHelpful?: boolean;
    showViewAll?: boolean;

    onWriteReview?: () => void;
    onViewAll?: () => void;
}

const buttonClassWhite = constants.buttonClassWhite;

export default function ReviewSection({
    reviews,
    totalReviews,
    averageRating,
    ratingCounts,

    title = "Customer Reviews",
    description = "What our customers say about this service",

    showWriteReview = true,
    showHelpful = true,
    showViewAll = true,

    onWriteReview,
    onViewAll,
}: ReviewSectionProps) {
    return (
        <section className="space-y-6">

            {/* Header */}
            <div className="flex items-center justify-between gap-4">

                <div>
                    <h2 className="text-xl font-bold text-gray-900">
                        {title}
                    </h2>

                    {description && (
                        <p className="mt-1 text-sm text-gray-500">
                            {description}
                        </p>
                    )}
                </div>

                {showWriteReview && (
                    <button
                        type="button"
                        onClick={onWriteReview}
                        className="cursor-pointer rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary-dark"
                    >
                        Write a Review
                    </button>
                )}
            </div>

            {/* Rating Summary */}
            <div className="grid gap-6 rounded-xl border border-gray-200 bg-white p-6 md:grid-cols-3">

                {/* Average Rating */}
                <div className="flex flex-col items-center justify-center border-b pb-5 md:border-b-0 md:border-r md:pb-0">

                    <div className="text-4xl font-bold text-gray-900">
                        {averageRating.toFixed(1)}
                    </div>

                    <div className="mt-2 flex text-primary">
                        <RatingStars rating={averageRating} />
                    </div>

                    <p className="mt-2 text-sm text-gray-500">
                        Based on {totalReviews} reviews
                    </p>
                </div>

                {/* Rating Breakdown */}
                <div className="space-y-2 md:col-span-2">
                    {[5, 4, 3, 2, 1].map((rating) => {

                        const count =
                            ratingCounts[
                            rating as keyof RatingCounts
                            ] ?? 0;

                        const percentage =
                            totalReviews > 0
                                ? (count / totalReviews) * 100
                                : 0;

                        return (
                            <div
                                key={rating}
                                className="flex items-center gap-3 text-sm"
                            >
                                <span className="w-10 text-gray-600 flex items-center gap-1">
                                    {rating} <FiStar className="h-3 w-4 fill-pink-100 text-primary" />
                                </span>

                                <div className="h-2 flex-1 overflow-hidden rounded-full bg-gray-200">
                                    <div
                                        className="h-full rounded-full bg-primary transition-all duration-700"
                                        style={{
                                            width: `${percentage}%`,
                                        }}
                                    />
                                </div>

                                <span className="w-8 text-right text-gray-500">
                                    {count}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Reviews */}
            <div className="space-y-4">

                {reviews.length > 0 ? (
                    reviews.map((review) => (
                        <article
                            key={review.id}
                            className="rounded-xl border border-gray-200 bg-white p-5 transition hover:shadow-md"
                        >
                            {/* User */}
                            <div className="flex items-start justify-between gap-4">

                                <div className="flex gap-3">

                                    {/* Avatar */}
                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                                        <FiUser />
                                    </div>

                                    <div>

                                        <h3 className="font-semibold text-gray-900">
                                            {review.user?.name ||
                                                "Customer"}
                                        </h3>

                                        {/* Rating + Date */}
                                        <div className="mt-1 flex flex-wrap items-center gap-2">

                                            <div className="flex text-primary">
                                                <RatingStars rating={review.rating} />
                                            </div>

                                            {review.created_at && (
                                                <span className="text-xs text-gray-400">
                                                    {review.created_at}
                                                </span>
                                            )}

                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Review Content */}
                            <div className="mt-4">

                                {review.review_title && (
                                    <h4 className="font-semibold text-gray-800">
                                        {review.review_title}
                                    </h4>
                                )}

                                {review.review_description && (
                                    <p className="mt-2 text-sm leading-6 text-gray-600">
                                        {review.review_description}
                                    </p>
                                )}

                            </div>

                            {/* Helpful */}
                            {showHelpful && (
                                <div className="mt-4 border-t border-gray-100 pt-3">

                                    <button
                                        type="button"
                                        className="flex cursor-pointer items-center gap-2 text-xs text-gray-500 transition hover:text-primary"
                                    >
                                        <FiThumbsUp size={14} />
                                        Helpful
                                    </button>

                                </div>
                            )}
                        </article>
                    ))
                ) : (
                    <div className="rounded-xl border border-dashed border-gray-300 bg-white px-6 py-10 text-center">
                        <FiStar className="mx-auto text-gray-300" size={32} />

                        <h3 className="mt-3 font-semibold text-gray-700">
                            No reviews yet
                        </h3>

                        <p className="mt-1 text-sm text-gray-500">
                            Be the first customer to write a review.
                        </p>
                    </div>
                )}

            </div>

            {/* View All */}
            {showViewAll && reviews.length > 0 && (
                <div className="flex justify-center">

                    <button
                        type="button"
                        onClick={onViewAll}
                        className={buttonClassWhite}
                    >
                        View All Reviews
                    </button>

                </div>
            )}

        </section>
    );
}