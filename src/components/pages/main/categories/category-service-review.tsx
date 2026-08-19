"use client";

import { useEffect, useState } from "react";
import { FiStar } from "react-icons/fi";
import ReviewSection from "@/components/common/review/review-section";
import TablePagination from "@/components/common/datatable/pagination";
import PopupModal from "@/components/common/popup/popup-modal";
import mainRoutes from "@/services/api/main.routes";
import { authUserId } from "@/utils/auth";
import { sweetalert } from "@/utils/sweetalert";
import { constants } from "@/utils/constants";
import { common as commonUtils } from "@/utils/common";

type ReviewForm = {
    category_service_id: string;
    rating: string;
    review_title: string;
    review_description: string;
    status: string;
};

export function CategoryServiceReview({ categoryServiceId }: { categoryServiceId: number | null }) {
    const [reviewLoading, setReviewLoading] = useState(false);
    const [reviewPage, setReviewPage] = useState(1);
    const [totalReviewPages, setTotalReviewPages] = useState(0);
    const [reviews, setReviews] = useState<any[]>([]);
    const [totalReviews, setTotalReviews] = useState(0);
    const [averageRating, setAverageRating] = useState(0);
    const [ratingCounts, setRatingCounts] = useState({ 5: 0, 4: 0, 3: 0, 2: 0, 1: 0, });

    const ratingStars = commonUtils.ratingStars;
    const [showPopup, setShowPopup] = useState(false);
    const [popupTitle, setPopupTitle] = useState("");
    const inputClass = constants.inputClass;
    const buttonClassSubmit = constants.buttonClassSubmit;

    const initialForm: ReviewForm = {
        category_service_id: categoryServiceId ? categoryServiceId.toString() : "",
        rating: "5",
        review_title: "",
        review_description: "",
        status: "1",
    };

    const [form, setForm] = useState<ReviewForm>(initialForm);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [selectedRating, setSelectedRating] = useState("5");

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
            const result = await mainRoutes.serviceReviewList({
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

    const onWriteReview = async () => {
        setShowPopup(true);
        setPopupTitle("Write a Review");
    };

    const ratingChange = (rating: string) => {
        setSelectedRating(rating);
        updateField("rating", rating);
    }

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setError("");

        if (!form.category_service_id) {
            setError("Category Service Id is required");
            return;
        }

        if (!form.rating.trim()) {
            setError("Please provide a rating");
            return;
        }


        setLoading(true);

        try {
            const result = await mainRoutes.createServiceReview(form);
            if (result?.success) {
                await sweetalert.success(result.message);
                setForm(initialForm);
                setSelectedRating("5");
                setShowPopup(false);
                loadReviewList();
            }
        } catch (caughtError) {
            console.error("Create service review failed:", caughtError);
        } finally {
            setLoading(false);
        }
    }

    const updateField = (field: keyof ReviewForm, value: string) => {
        setForm((prev) => ({
            ...prev,
            [field]: value,
        }));
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
                showWriteReview={authUserId() !== null}
                onWriteReview={onWriteReview}
            />

            <TablePagination
                page={reviewPage}
                totalPages={totalReviewPages}
                totalRecords={totalReviews}
                loading={reviewLoading}
                onPageChange={setReviewPage}
            />

            <PopupModal
                show={showPopup}
                title={popupTitle}
                onClose={() => setShowPopup(false)}
                width="3xl"
                position="top"
                blurBackground={false}
                showFooter={false}
            >
                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-5">
                        <div className="md:col-span-12">
                            <div className="flex flex-wrap gap-2">
                                {ratingStars.map((star) => (
                                    <button
                                        key={star}
                                        type="button"
                                        onClick={() => ratingChange(String(star))}
                                        className={`cursor-pointer flex items-center gap-1 rounded-lg border px-3 py-2 text-sm font-medium transition ${Number(selectedRating) === star
                                            ? "border-secondary-light bg-pink-50 text-primary"
                                            : "border-gray-200 bg-white text-gray-600 hover:border-secondary-light hover:bg-pink-50"
                                            }`}
                                    >
                                        <FiStar
                                            size={14}
                                            className={
                                                Number(selectedRating) === star
                                                    ? "fill-secondary-light text-secondary-light"
                                                    : "text-secondary-light"
                                            }
                                        />

                                        {star}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="md:col-span-12">
                            <textarea
                                id="reviewDescription"
                                placeholder="Enter your feedback here..."
                                rows={2}
                                className={inputClass}
                                value={form.review_description}
                                onChange={(event) => updateField("review_description", event.target.value)}
                            ></textarea>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-5">
                        {error && <div className="md:col-span-12 text-sm text-rose-600">{error}</div>}
                        <div className="md:col-span-12 flex justify-end">
                            <button
                                type="submit"
                                className={buttonClassSubmit}
                                disabled={loading}
                            >
                                Post Review
                            </button>
                        </div>
                    </div>
                </form>
            </PopupModal>
        </>
    )
}
