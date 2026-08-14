"use client";

import { useEffect, useState } from "react";
import mainService from "@/services/api/main.routes";
import ReviewSection from "@/components/common/review/review-section";
import TablePagination from "@/components/common/datatable/pagination";

export function CategoryServiceReview({ categoryServiceId }: { categoryServiceId: number | null }) {
    const [reviewLoading, setReviewLoading] = useState(false);
    const [reviewPage, setReviewPage] = useState(1);
    const [totalReviewPages, setTotalReviewPages] = useState(0);
    const [reviews, setReviews] = useState<any[]>([]);
    const [totalReviews, setTotalReviews] = useState(0);
    const [averageRating, setAverageRating] = useState(0);
    const [ratingCounts, setRatingCounts] = useState({ 5: 0, 4: 0, 3: 0, 2: 0, 1: 0, });


    useEffect(() => {
        if (categoryServiceId) {
            loadReviewList();
        }
    }, [categoryServiceId, reviewPage]);


    const loadReviewList = async () => {
        try {
            setReviewLoading(true);
            if (!categoryServiceId) {
                return;
            }
            const result = await mainService.serviceReviewList({
                page: reviewPage,
                limit: 5,
                category_service_id: categoryServiceId
            });

            if (!result?.success) {
                return;
            }

            setTotalReviewPages(result.data?.totalPages ?? 0);
            setReviews(result.data?.rows || []);
            setTotalReviews(result.data?.total || 0);
            setAverageRating(Number(result.data?.averageRating || 0));
            setRatingCounts(
                result.data?.ratingCounts || {
                    5: 0,
                    4: 0,
                    3: 0,
                    2: 0,
                    1: 0,
                }
            );

        } catch (caughtError) {
            console.error("Failed to load review records:", caughtError);
        } finally {
            setReviewLoading(false);
        }
    };

    return (
        <>
            <ReviewSection
                reviews={reviews}
                totalReviews={totalReviews}
                averageRating={averageRating}
                ratingCounts={ratingCounts}
                title="Reviews & Ratings"
                description="Customer experiences and feedback"
                showWriteReview={false}
                showHelpful={false}
                showViewAll={false}
                onViewAll={() => {
                    // open review modal/page
                }}
            />

            <TablePagination
                page={reviewPage}
                totalPages={totalReviewPages}
                totalRecords={totalReviews}
                loading={reviewLoading}
                onPageChange={setReviewPage}
            />
        </>
    )
}
