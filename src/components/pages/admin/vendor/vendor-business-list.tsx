
"use client";

import { useEffect, useMemo, useState } from "react";
import { getCoreRowModel, useReactTable, type ColumnDef } from "@tanstack/react-table";
import { List, Grid3X3, ChevronRight, } from "lucide-react";
import { FiFileText } from "react-icons/fi";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import DataTable from "@/components/common/datatable/datatable";
import TableSearch from "@/components/common/datatable/searchbox";
import TablePagination from "@/components/common/datatable/pagination";
import { constants } from "@/utils/constants";
import { common as commonUtils } from "@/utils/common";
import { apiConfig } from "@/environments/api";
import { adminRoutes } from "@/services/api/admin.routes";
import { userRoutes } from "@/services/api/users.routes";



const PAGE_SIZE = 10;

export default function VendorBusinessList() {

    const [loading, setLoading] = useState(false);
    const [searchInput, setSearchInput] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [rows, setRows] = useState<any[]>([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [totalRecords, setTotalRecords] = useState(0);
    const [vendorProfileData, setVendorProfileData] = useState<any>(null);
    const buttonClassBlue = constants.buttonClassBlue;

    const [viewMode, setViewMode] = useState<"table" | "grid">("grid");
    const BACKEND_BASE_URL = apiConfig.baseUrl;

    const searchParams = useSearchParams();
    const vendorId = searchParams.get("vendorId");

    useEffect(() => {
        const timer = setTimeout(() => {
            setSearchTerm(searchInput);
            setPage(1);
        }, 500);

        return () => clearTimeout(timer);
    }, [searchInput]);


    useEffect(() => {
        if (vendorId) {
            getVendorProfile();
        }
    }, [vendorId]);

    useEffect(() => {
        fetchServiceData();
    }, [page, searchTerm]);


    const getVendorProfile = async () => {
        const response = await userRoutes.getUser({
            vendor_id: vendorId ?? undefined,
        });
        setVendorProfileData(response?.data ?? null);
    };

    const fetchServiceData = async () => {

        try {
            setLoading(true);

            const response = await adminRoutes.vendorBusinessList({
                page,
                limit: PAGE_SIZE,
                search: searchTerm,
                vendor_id: vendorId,
            });

            const responData = response.data;

            setRows(responData?.rows ?? []);
            setTotalPages(responData?.totalPages ?? 0);
            setTotalRecords(responData?.total ?? 0);

        } finally {
            setLoading(false);
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
                    return (
                        <>
                            <button
                                className={`mr-4 ${buttonClassBlue}`}
                                title="Service Certificate Upload"
                            >
                                <Link href={`/panel/service-certificates?serviceId=${row.original.id}`}>
                                    <FiFileText className="h-4 w-4" />
                                </Link>
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
            <section className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                    <div className="md:col-span-3">
                        <div className="mb-6 ml-1 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <span className="text-2xl font-semibold leading-none text-slate-600">
                                    Business List
                                </span>

                                <ChevronRight className="h-5 w-5 shrink-0 text-slate-400 mt-2" />

                                <Link href={`/panel/vendor-list`} className="text-base font-medium leading-none text-primary mt-2"> {vendorProfileData?.name} </Link>
                            </div>
                        </div>
                    </div>
                    <div className="md:col-span-6"></div>
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
                                        <div className="mt-4 border-t border-gray-200 pt-3">
                                            <Link href={`/panel/update-service-certificates?vendorId=${vendorId}&serviceId=${item.id}`}>
                                                <button type="button" className={`mr-3 mb-3 ${buttonClassBlue}`} title="Service Certificate Upload">
                                                    <FiFileText className="h-4 w-4" />
                                                </button>
                                            </Link>
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