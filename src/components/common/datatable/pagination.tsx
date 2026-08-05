"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

interface TablePaginationProps {
    page: number;
    totalPages: number;
    totalRecords?: number;
    loading?: boolean;
    onPageChange: (page: number) => void;
}

export default function TablePagination({
    page,
    totalPages,
    totalRecords = 0,
    loading = false,
    onPageChange,
}: TablePaginationProps) {
    if (totalPages <= 1 && totalRecords === 0) {
        return null;
    }

    const canGoPrevious = page > 1;
    const canGoNext = page < totalPages;

    const getPageNumbers = () => {
        const windowSize = 5;

        let start = Math.max(1, page - Math.floor(windowSize / 2));
        let end = Math.min(totalPages, start + windowSize - 1);

        start = Math.max(1, end - windowSize + 1);

        return Array.from(
            { length: end - start + 1 },
            (_, index) => start + index
        );
    };

    const pageNumbers = getPageNumbers();

    return (
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-t rounded-xl border border-slate-200 bg-white px-5 py-4">

            <div className="text-sm text-slate-600">
                <span className="text-slate-400">Page</span> <strong>{page}</strong> <span className="text-slate-400">of</span> <strong>{totalPages}</strong>

                {totalRecords > 0 && (
                    <span className="ml-3">
                        | <span className="text-slate-400">Total Records :</span> <strong>{totalRecords}</strong>
                    </span>
                )}
            </div>

            <div className="flex items-center gap-2">

                <button
                    type="button"
                    disabled={!canGoPrevious || loading}
                    onClick={() => onPageChange(1)}
                    className="rounded-lg border border-slate-300 px-3 py-2 text-sm hover:border-primary hover:text-primary disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
                >
                    First
                </button>

                <button
                    type="button"
                    disabled={!canGoPrevious || loading}
                    onClick={() => onPageChange(page - 1)}
                    className="inline-flex items-center gap-1 rounded-lg border border-slate-300 px-3 py-2 text-sm hover:border-primary hover:text-primary disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
                >
                    <ChevronLeft size={16} />
                    {/* Previous */}
                </button>

                {pageNumbers.map((pageNumber) => (
                    <button
                        key={pageNumber}
                        type="button"
                        disabled={loading}
                        onClick={() => onPageChange(pageNumber)}
                        className={`h-9 min-w-9 rounded-lg border px-3 text-sm font-medium transition cursor-pointer ${pageNumber === page
                            ? "border-primary bg-primary-light text-white"
                            : "border-slate-300 hover:border-primary hover:text-primary"
                            }`}
                    >
                        {pageNumber}
                    </button>
                ))}

                <button
                    type="button"
                    disabled={!canGoNext || loading}
                    onClick={() => onPageChange(page + 1)}
                    className="inline-flex items-center gap-1 rounded-lg border border-slate-300 px-3 py-2 text-sm hover:border-primary hover:text-primary disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
                >
                    {/* Next */}
                    <ChevronRight size={16} />
                </button>

                <button
                    type="button"
                    disabled={!canGoNext || loading}
                    onClick={() => onPageChange(totalPages)}
                    className="rounded-lg border border-slate-300 px-3 py-2 text-sm hover:border-primary hover:text-primary disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
                >
                    Last
                </button>
            </div>
        </div>
    );
}