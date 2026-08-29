
"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Pencil, Trash2, CheckCircle2, XCircle, Play, ChevronRight, } from "lucide-react";
import { getCoreRowModel, useReactTable, type ColumnDef } from "@tanstack/react-table";
import DataTable from "@/components/common/datatable/datatable";
import TableSearch from "@/components/common/datatable/searchbox";
import TablePagination from "@/components/common/datatable/pagination";
import { vendorRoutes } from "@/services/api/vendor.routes";
import { constants } from "@/utils/constants";
import { sweetalert } from "@/utils/sweetalert";
import { helperUtils } from "@/utils/helpers";
import { apiConfig } from "@/environments/api";



const PAGE_SIZE = 10;


export default function GalleryList() {
    const searchParams = useSearchParams();
    const categoryServiceId = searchParams.get("serviceId");
    const [loading, setLoading] = useState(false);
    const [searchInput, setSearchInput] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [rows, setRows] = useState<any[]>([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [totalRecords, setTotalRecords] = useState(0);
    const buttonClass = constants.buttonClass;
    const buttonClassBlue = constants.buttonClassBlue;
    const buttonClassRed = constants.buttonClassRed;
    const buttonClassGreen = constants.buttonClassGreen;
    const buttonClassOrange = constants.buttonClassOrange;
    const buttonClassWhite = constants.buttonClassWhite;
    const [categoryServiceData, setCategoryServiceData] = useState<any>(null);

    useEffect(() => {
        const timer = setTimeout(() => {
            setSearchTerm(searchInput);
            setPage(1);
        }, 500);

        return () => clearTimeout(timer);
    }, [searchInput]);

    useEffect(() => {
        fetchGalleryList();
    }, [page, searchTerm]);

    useEffect(() => {
        if (categoryServiceId) {
            getCategoryService();
        }
    }, [categoryServiceId]);

    const getCategoryService = async () => {
        const response = await vendorRoutes.getCategoryService({
            id: categoryServiceId ?? undefined,
        });
        setCategoryServiceData(response?.data ?? null);
    };

    const fetchGalleryList = async () => {
        try {
            setLoading(true);
            const response = await vendorRoutes.galleryList({
                page,
                limit: PAGE_SIZE,
                search: searchTerm,
                category_service_id: categoryServiceId ?? undefined,
            });
            const responData = response.data;
            setRows(responData?.rows ?? []);
            setTotalPages(responData?.totalPages ?? 0);
            setTotalRecords(responData?.total ?? 0);
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
            const result = await vendorRoutes.updateGalleryStatus({ id: row.id, status });
            if (result?.success) {
                sweetalert.success(result.message);
                fetchGalleryList();
            }
        } catch (error) {
            console.error("Status update failed:", error);
        }
    };

    const columns = useMemo<ColumnDef<any>[]>(() => {
        return [
            {
                accessorKey: "image_video",
                header: "Image/Video",
                cell: ({ row }) => {
                    const BACKEND_BASE_URL = apiConfig.baseUrl;

                    const isVideo = row.original.gallery_type === "video";

                    const fileUrl = isVideo
                        ? `${BACKEND_BASE_URL}/${row.original.gallery_video}`
                        : `${BACKEND_BASE_URL}/${row.original.gallery_image}`;

                    const thumbnailUrl = isVideo
                        ? `${BACKEND_BASE_URL}/${row.original.gallery_image}`
                        : fileUrl;

                    return (
                        <div className="relative h-25 w-35 overflow-hidden rounded">
                            <img
                                src={thumbnailUrl}
                                alt={isVideo ? "Video thumbnail" : "Gallery"}
                                className="h-full w-full object-cover"
                            />

                            {isVideo && (
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-black/60 text-white">
                                        <Play className="h-5 w-5 fill-current" />
                                    </span>
                                </div>
                            )}
                        </div>
                    );
                },
            },
            {
                accessorKey: "gallery_description",
                header: "Timeline",
                size: 300,
                minSize: 300,
                maxSize: 300,
                cell: ({ row }) => helperUtils.hashtagContent(row?.original?.gallery_description) || '-',
            },
            {
                accessorKey: "status",
                header: "Status",
                cell: ({ row }) => {
                    const isActive = Number(row.original.status) === 1;
                    return (
                        <span
                            className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${isActive
                                ? "bg-emerald-100 text-emerald-700"
                                : "bg-rose-100 text-rose-700"
                                }`}
                        >
                            {isActive ? "Active" : "Inactive"}
                        </span>
                    );
                },
            },

            {
                accessorKey: "action",
                header: "Action",
                cell: ({ row }) => {
                    const isApproved = Number(row.original.status) === 1;
                    return (
                        <>
                            {isApproved ? (
                                <button
                                    type="button"
                                    onClick={() => handleStatusUpdate(row.original, 'disapprove')}
                                    title="Disapprove"
                                    className={`mr-4 ${buttonClassOrange}`}
                                >
                                    <XCircle className="h-4 w-4" />
                                </button>
                            ) : (
                                <button
                                    type="button"
                                    onClick={() => handleStatusUpdate(row.original, 'approve')}
                                    title="Approve"
                                    className={`mr-4 ${buttonClassGreen}`}
                                >
                                    <CheckCircle2 className="h-4 w-4" />
                                </button>
                            )}

                            <Link href={`/panel/create-gallery?serviceId=${categoryServiceId ?? ""}&id=${row.original.id}`}>
                                <button
                                    className={`mr-4 ${buttonClassBlue}`}
                                    title="Edit"
                                >
                                    <Pencil className="h-4 w-4" />
                                </button>
                            </Link>

                            <button
                                className={buttonClassRed}
                                title="Delete"
                                onClick={() => handleStatusUpdate(row.original, 'delete')}
                            >
                                <Trash2 className="h-4 w-4" />
                            </button>
                        </>
                    );
                },
            },
        ];
    }, []);

    const table = useReactTable({
        data: rows,
        columns,
        getCoreRowModel: getCoreRowModel(),
    });


    return (
        <div className="d-block mb-20">
            <div className="mb-6 ml-1 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <span className="text-2xl font-semibold leading-none text-slate-600">
                        Gallery
                    </span>

                    <ChevronRight className="h-5 w-5 shrink-0 text-slate-400 mt-2" />

                    <Link href={`/panel/category-service-list`} className="text-base font-medium leading-none text-primary mt-2"> {categoryServiceData?.service_name ?? ""} </Link>
                </div>
            </div>

            <section className="space-y-5">
                <div className="mb-0 flex items-center justify-between">
                    <TableSearch
                        value={searchInput}
                        onChange={setSearchInput}
                        placeholder="Search..."
                    />
                    <Link href={`/panel/create-gallery?serviceId=${categoryServiceId ?? ""}`} className={buttonClass}> Add Gallery </Link>
                </div>


                <DataTable
                    table={table}
                    loading={loading}
                    emptyMessage="No Records Found"
                    tableClass="table-fixed"
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