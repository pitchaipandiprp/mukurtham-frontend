
"use client";

import { useEffect, useState } from "react";
import { vendorService } from "@/services/api/vendor.service";
import { Pencil, Trash2, CheckCircle2, XCircle, } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

import TableSearch from "@/components/common/datatable/searchbox";
import TablePagination from "@/components/common/datatable/pagination";
import { constants } from "@/utils/constants";
import { sweetalert } from "@/utils/sweetalert";
import { common as commonUtils } from "@/utils/common";

import ReviewSection from "@/components/common/review/review-section";
import { FiStar } from "react-icons/fi";

const PAGE_SIZE = 10;
const ratingStars = commonUtils.ratingStars;

export default function ServiceReviewList() {

    const [loading, setLoading] = useState(false);
    const [searchInput, setSearchInput] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedRating, setSelectedRating] = useState("");

    const [rows, setRows] = useState<any[]>([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [totalRecords, setTotalRecords] = useState(0);

    const [reviews, setReviews] = useState<any[]>([]);
    const [totalReviews, setTotalReviews] = useState(0);
    const [averageRating, setAverageRating] = useState(0);
    const [ratingCounts, setRatingCounts] = useState({ 5: 0, 4: 0, 3: 0, 2: 0, 1: 0, });

    const searchParams = useSearchParams();
    const categoryServiceId = searchParams.get("serviceId");

    const inputClass = constants.inputClass;
    const buttonClass = constants.buttonClass;

    useEffect(() => {
        const timer = setTimeout(() => {
            setSearchTerm(searchInput);
            setPage(1);
        }, 500);

        return () => clearTimeout(timer);
    }, [searchInput, selectedRating]);

    useEffect(() => {
        fetchReviewData();
    }, [page, searchTerm, selectedRating]);

    const fetchReviewData = async () => {

        try {
            setLoading(true);

            const response = await vendorService.serviceReviewList({
                page,
                limit: PAGE_SIZE,
                search: searchTerm,
                category_service_id: categoryServiceId,
                rating: selectedRating,
            });

            const responData = response.data;

            setRows(responData?.rows ?? []);
            setTotalPages(responData?.totalPages ?? 0);
            setTotalRecords(responData?.total ?? 0);

            setReviews(responData?.rows || []);
            setTotalReviews(responData?.total || 0);
            setAverageRating(Number(responData?.averageRating || 0));
            setRatingCounts(
                responData?.ratingCounts || {
                    5: 0,
                    4: 0,
                    3: 0,
                    2: 0,
                    1: 0,
                }
            );

        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (row: any, status: string) => {
        let msg = "Are you sure you want to delete?";
        let title = "Delete Confirmation";

        if (status === 'approve') {
            msg = "Are you sure you want to approve?";
            title = "Approve Confirmation";
        } else if (status === 'disapprove') {
            msg = "Are you sure you want to disapprove?";
            title = "Disapprove Confirmation";
        }

        const swalConfirm = await sweetalert.confirm(msg, title);
        if (!swalConfirm.isConfirmed) {
            return;
        }

        try {
            const result = await vendorService.updateServiceReviewStatus({ id: row.id, status });
            if (result?.success) {
                sweetalert.success(result.message);
                fetchReviewData();
            }
        } catch (error) {
            console.error("Delete failed:", error);
        }
    };


    return (
        <div className="d-block mb-20">
            <div className="mb-6 ml-1 flex items-center justify-between">
                <b className="text-2xl text-slate-600 tracking-tight">Reviews & Ratings</b>
            </div>

            <section className="space-y-5">
                <div className="mb-0 flex items-center justify-between">
                    <TableSearch
                        value={searchInput}
                        onChange={setSearchInput}
                        placeholder="Search Review..."
                    />

                    <div className="flex flex-wrap gap-2">
                        {/* All */}
                        <button
                            type="button"
                            onClick={() => setSelectedRating("")}
                            className={`cursor-pointer flex items-center gap-1 rounded-lg border px-3 py-2 text-sm font-medium transition ${selectedRating === ""
                                ? "border-primary bg-primary text-white"
                                : "border-gray-200 bg-white text-gray-600 hover:border-primary hover:text-primary"
                                }`}
                        >
                            All
                        </button>

                        {ratingStars.map((star) => (
                            <button
                                key={star}
                                type="button"
                                onClick={() => setSelectedRating(String(star))}
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

                    <Link href="/panel/category-service-list" className={buttonClass}> Service List</Link>
                </div>


                <ReviewSection
                    reviews={reviews}
                    totalReviews={totalReviews}
                    averageRating={averageRating}
                    ratingCounts={ratingCounts}
                    title="Reviews & Ratings"
                    description="Customer experiences and feedback"
                    showWriteReview={false}
                    showHelpful={false}
                    showTitle={false}
                    showDescription={false}
                    showViewAll={false}
                    onViewAll={() => {
                        // open review modal/page
                    }}
                />

                <TablePagination
                    page={page}
                    totalPages={totalPages}
                    totalRecords={totalRecords}
                    loading={loading}
                    onPageChange={setPage}
                />
            </section>
        </div>

    );
}