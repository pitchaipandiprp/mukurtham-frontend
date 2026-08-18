"use client";

import { useEffect, useMemo, useState } from "react";
import { getCoreRowModel, useReactTable, type ColumnDef } from "@tanstack/react-table";
import { CheckCircle2, Pencil, Trash2, XCircle } from "lucide-react";
import Link from "next/link";
import DataTable from "@/components/common/datatable/datatable";
import TablePagination from "@/components/common/datatable/pagination";
import TableSearch from "@/components/common/datatable/searchbox";
import { vendorRoutes } from "@/services/api/vendor.routes";
import { constants } from "@/utils/constants";
import { common as commonUtils } from "@/utils/common";
import { sweetalert } from "@/utils/sweetalert";

const PAGE_SIZE = 10;

export default function ServiceDatesList() {
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

    useEffect(() => {
        const timer = setTimeout(() => {
            setSearchTerm(searchInput);
            setPage(1);
        }, 500);

        return () => clearTimeout(timer);
    }, [searchInput]);


    useEffect(() => {
        fetchServiceDateList();
    }, [page, searchTerm]);


    const fetchServiceDateList = async () => {
        try {
            setLoading(true);
            const response = await vendorRoutes.serviceDateList({
                page,
                limit: PAGE_SIZE,
                search: searchTerm,
            });
            const responseData = response.data;
            setRows(responseData?.rows ?? []);
            setTotalPages(responseData?.totalPages ?? 0);
            setTotalRecords(responseData?.total ?? 0);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (row: any, status: string) => {
        const messages: Record<string, [string, string]> = {
            approve: ["Are you sure you want to approve?", "Approve Confirmation"],
            disapprove: ["Are you sure you want to disapprove?", "Disapprove Confirmation"],
            delete: ["Are you sure you want to delete?", "Delete Confirmation"],
        };
        const [message, title] = messages[status];
        const confirmation = await sweetalert.confirm(message, title);

        if (!confirmation.isConfirmed) {
            return;
        }

        const result = await vendorRoutes.updateServiceDateStatus({ id: row.id, status });
        if (result?.success) {
            await sweetalert.success(result.message);
            fetchServiceDateList();
        }
    };

    const columns = useMemo<ColumnDef<any>[]>(() => [
        {
            accessorKey: "category_service_id",
            header: "Category Service",
            cell: ({ row }) => row.original.category_service?.service_name ?? "-",
        },
        {
            accessorKey: "date_type",
            header: "Date Type",
            cell: ({ row }) => row.original.date_type || "-",
        },
        {
            accessorKey: "service_date",
            header: "Service Date",
            cell: ({ row }) => commonUtils.formatDateTime(row.original.service_date, "MMM DD, YYYY") || "-",
        },
        {
            accessorKey: "status",
            header: "Status",
            cell: ({ row }) => {
                const isActive = Number(row.original.status) === 1;
                return <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${isActive ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"}`}>{isActive ? "Active" : "Inactive"}</span>;
            },
        },
        {
            accessorKey: "action",
            header: "Action",
            cell: ({ row }) => {
                const isApproved = Number(row.original.status) === 1;
                return <>
                    {isApproved ? (
                        <button type="button" onClick={() => handleStatusUpdate(row.original, "disapprove")} title="Disapprove" className={`mr-4 ${buttonClassOrange}`}><XCircle className="h-4 w-4" /></button>
                    ) : (
                        <button type="button" onClick={() => handleStatusUpdate(row.original, "approve")} title="Approve" className={`mr-4 ${buttonClassGreen}`}><CheckCircle2 className="h-4 w-4" /></button>
                    )}
                    <Link href={`/panel/create-service-dates?id=${row.original.id}`} className={`mr-4 inline-flex ${buttonClassBlue}`} title="Edit"><Pencil className="h-4 w-4" /></Link>
                    <button type="button" className={buttonClassRed} title="Delete" onClick={() => handleStatusUpdate(row.original, "delete")}><Trash2 className="h-4 w-4" /></button>
                </>;
            },
        },
    ], []);

    const table = useReactTable({ data: rows, columns, getCoreRowModel: getCoreRowModel() });

    return (
        <div className="d-block mb-20">
            <div className="mb-6 ml-1 flex items-center justify-between">
                <span className="text-2xl font-semibold leading-none text-slate-600">Date Lists</span>
            </div>
            <section className="space-y-5">
                <div className="mb-0 flex items-center justify-between gap-4">
                    <TableSearch value={searchInput} onChange={setSearchInput} placeholder="Search Service Date..." />
                    <Link href="/panel/create-service-dates" className={buttonClass}>Add Date</Link>
                </div>
                <DataTable table={table} loading={loading} emptyMessage="No Records Found" />
                <TablePagination page={page} totalPages={totalPages} totalRecords={totalRecords} loading={loading} onPageChange={setPage} />
            </section>
        </div>
    );
}