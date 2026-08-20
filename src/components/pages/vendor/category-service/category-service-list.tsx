
"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { getCoreRowModel, useReactTable, type ColumnDef } from "@tanstack/react-table";
import { Pencil, Trash2, CheckCircle2, XCircle, List, Grid3X3, } from "lucide-react";
import { FiCalendar, FiImage } from "react-icons/fi";
import Link from "next/link";
import DataTable from "@/components/common/datatable/datatable";
import TableSearch from "@/components/common/datatable/searchbox";
import TablePagination from "@/components/common/datatable/pagination";
import { constants } from "@/utils/constants";
import { common as commonUtils } from "@/utils/common";
import { sweetalert } from "@/utils/sweetalert";
import { apiConfig } from "@/environments/api";
import { vendorRoutes } from "@/services/api/vendor.routes";



const PAGE_SIZE = 10;

export default function CategoryServiceList() {

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

    const [viewMode, setViewMode] = useState<"table" | "grid">("grid");
    const BACKEND_BASE_URL = apiConfig.baseUrl;


    useEffect(() => {
        const timer = setTimeout(() => {
            setSearchTerm(searchInput);
            setPage(1);
        }, 500);

        return () => clearTimeout(timer);
    }, [searchInput]);

    useEffect(() => {
        fetchServiceData();
    }, [page, searchTerm]);

    const fetchServiceData = async () => {

        try {
            setLoading(true);

            const response = await vendorRoutes.categoryServiceList({
                page,
                limit: PAGE_SIZE,
                search: searchTerm,
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
            const result = await vendorRoutes.updateCategoryServiceStatus({ id: row.id, status });
            if (result?.success) {
                sweetalert.success(result.message);
                fetchServiceData();
            }
        } catch (error) {
            console.error("Delete failed:", error);
        }
    };

    const columns = useMemo<ColumnDef<any>[]>(() => {
        return [
            {
                accessorKey: "service_name",
                header: "Service Name",
                cell: ({ getValue }) => getValue<any>() ?? "-",
            },
            {
                accessorKey: "category_id",
                header: "Category",
                cell: ({ row }) => row.original.category?.name ?? "-",
            },
            {
                id: "locality",
                header: "Locality",
                cell: ({ row }) => (row.original.locality?.name && row.original.city?.name && row.original.state?.name) ? row.original.locality?.name + ", " + row.original.city?.name + ", " + row.original.state?.name : "-",
            },
            {
                accessorKey: "capacity",
                header: "Capacity",
                cell: ({ row }) => row.original.capacity ?? "-",
            },
            {
                accessorKey: "final_amount",
                header: "Final Amount",
                cell: ({ row }) => commonUtils.formatAmount(row.original.final_amount),
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

                            <Link href={`/panel/create-category-service?id=${row.original.id}`}>
                                <button
                                    className={`mr-4 ${buttonClassBlue}`}
                                    title="Edit"
                                >
                                    <Pencil className="h-4 w-4" />
                                </button>
                            </Link>

                            <button
                                className={`mr-4 ${buttonClassBlue}`}
                                title="Gallery"
                            >
                                <Link href={`/panel/service-dates-list?serviceId=${row.original.id}`}>
                                    <FiCalendar className="h-4 w-4" />
                                </Link>
                            </button>

                            <button
                                className={`mr-4 ${buttonClassBlue}`}
                                title="Gallery"
                            >
                                <Link href={`/panel/gallery-list?serviceId=${row.original.id}`}>
                                    <FiImage className="h-4 w-4" />
                                </Link>
                            </button>

                            {/* <button
                                className={`mr-4 ${buttonClassBlue}`}
                                title="Reviews"
                            >
                                <Link href={`/panel/service-review-list?serviceId=${row.original.id}`}>
                                    <FiStar className="h-4 w-4" />
                                </Link>
                            </button> */}

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
                <span className="text-2xl font-semibold leading-none text-slate-600">Business List</span>
            </div>

            <section className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                    <div className="md:col-span-9">
                        <TableSearch
                            value={searchInput}
                            onChange={setSearchInput}
                            placeholder="Search..."
                        />
                    </div>
                    <div className="md:col-span-3">
                        <div className="flex gap-4 items-center justify-end">
                            <button
                                type="button"
                                onClick={() => setViewMode("table")}
                                className={`cursor-pointer rounded-lg px-3 py-2 ${viewMode === "table"
                                    ? "bg-primary-light text-white"
                                    : "bg-gray-200 text-gray-600"
                                    }`}
                            >
                                <List className="h-4 w-4" />
                            </button>
                            <button
                                type="button"
                                onClick={() => setViewMode("grid")}
                                className={`cursor-pointer rounded-lg px-3 py-2 ${viewMode === "grid"
                                    ? "bg-primary-light text-white"
                                    : "bg-gray-200 text-gray-600"
                                    }`}
                            >
                                <Grid3X3 className="h-4 w-4" />
                            </button>
                            <Link href="/panel/create-category-service" className={buttonClass}> Add Business </Link>
                        </div>
                    </div>
                </div>

                {viewMode === "table" && (
                    <DataTable
                        table={table}
                        loading={loading}
                        emptyMessage="No Services Found"
                    />
                )}

                {viewMode === "grid" && (
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {rows.map((item: any) => {
                            const isActive = Number(item.status) === 1;

                            return (
                                <div key={`service-grid-row-${item.id}`} className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition hover:shadow-md">
                                    <div className="relative group h-48 w-full overflow-hidden bg-gray-100">
                                        <img
                                            src={item.service_banner_image ? `${BACKEND_BASE_URL}/${item.service_banner_image}` : undefined}
                                            alt={item.service_name ?? "Service"}
                                            className="w-full h-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-110 group-hover:opacity-90"
                                        />

                                        <span
                                            className={`absolute right-3 top-3 inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${isActive
                                                ? "bg-emerald-100 text-emerald-700"
                                                : "bg-rose-100 text-rose-700"
                                                }`}
                                        >
                                            {isActive ? "Active" : "Inactive"}
                                        </span>
                                    </div>

                                    {/* Content */}
                                    <div className="p-4">

                                        <h3 className="truncate text-lg font-semibold text-slate-700">
                                            {item.service_name ?? "-"}
                                        </h3>

                                        <p className="mt-1 text-sm text-gray-500">
                                            {item.category?.name ?? "-"}
                                        </p>

                                        <p className="mt-2 text-sm text-gray-600">
                                            {item.locality?.name &&
                                                item.city?.name &&
                                                item.state?.name
                                                ? `${item.locality.name}, ${item.city.name}, ${item.state.name}`
                                                : "-"}
                                        </p>

                                        <div className="mt-3 flex items-center justify-between">
                                            <span className="text-sm text-gray-500">
                                                Capacity
                                            </span>

                                            <span className="font-medium text-slate-700">
                                                {item.capacity ?? "-"}
                                            </span>
                                        </div>

                                        <div className="mt-2 flex items-center justify-between">
                                            <span className="text-sm text-gray-500">
                                                Final Amount
                                            </span>

                                            <span className="font-semibold text-primary">
                                                {commonUtils.formatAmount(
                                                    item.final_amount
                                                )}
                                            </span>
                                        </div>

                                        {/* Actions */}
                                        <div className="mt-4 flex items-center border-t border-gray-100 pt-3">

                                            {isActive ? (
                                                <button
                                                    type="button"
                                                    onClick={() => handleStatusUpdate(item, "disapprove")}
                                                    title="Disapprove"
                                                    className={`mr-3 ${buttonClassOrange}`}>
                                                    <XCircle className="h-4 w-4" />
                                                </button>
                                            ) : (
                                                <button
                                                    type="button"
                                                    onClick={() => handleStatusUpdate(item, "approve")}
                                                    title="Approve"
                                                    className={`mr-3 ${buttonClassGreen}`}
                                                >
                                                    <CheckCircle2 className="h-4 w-4" />
                                                </button>
                                            )}

                                            <Link href={`/panel/create-category-service?id=${item.id}`}>
                                                <button type="button" className={`mr-3 ${buttonClassBlue}`} title="Edit">                                                     <Pencil className="h-4 w-4" />                                                 </button>
                                            </Link>

                                            <Link href={`/panel/service-dates-list?serviceId=${item.id}`}>
                                                <button type="button" className={`mr-3 ${buttonClassBlue}`} title="Service Dates">
                                                    <FiCalendar className="h-4 w-4" />
                                                </button>
                                            </Link>

                                            <Link href={`/panel/gallery-list?serviceId=${item.id}`}>
                                                <button type="button" className={`mr-3 ${buttonClassBlue}`} title="Gallery">
                                                    <FiImage className="h-4 w-4" />
                                                </button>
                                            </Link>

                                            <button
                                                type="button"
                                                className={buttonClassRed}
                                                title="Delete"
                                                onClick={() => handleStatusUpdate(item, "delete")}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

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