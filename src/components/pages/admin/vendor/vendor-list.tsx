
"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { adminRoutes } from "@/services/api/admin.routes";
import { getCoreRowModel, useReactTable, type ColumnDef } from "@tanstack/react-table";
import { Pencil, Trash2, CheckCircle2, XCircle, Eye, Copy, MoreVertical, List, Building, } from "lucide-react";
import Link from "next/link";
import DataTable from "@/components/common/datatable/datatable";
import TableSearch from "@/components/common/datatable/searchbox";
import TablePagination from "@/components/common/datatable/pagination";
import { constants } from "@/utils/constants";
import { sweetalert } from "@/utils/sweetalert";



const PAGE_SIZE = 10;

export default function VendorList() {

    const [rows, setRows] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [searchInput, setSearchInput] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
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
        fetchVendorData();
    }, [page, searchTerm]);


    const fetchVendorData = async () => {
        try {
            setLoading(true);

            const response = await adminRoutes.vendorList({
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
            const result = await adminRoutes.updateVendorStatus({ id: row.id, status });
            if (result?.success) {
                sweetalert.success('Updated successfully');
                fetchVendorData();
            }
        } catch (error) {
            console.error("Delete failed:", error);
        }
    };

    const columns = useMemo<ColumnDef<any>[]>(() => {
        return [
            {
                accessorKey: "name",
                header: "Name",
                cell: ({ getValue }) => getValue<any>() ?? "-",
            },
            {
                accessorKey: "email",
                header: "Email ID",
                cell: ({ getValue }) => getValue<any>() ?? "-",
            },
            {
                id: "mobile",
                header: "Mobile",
                cell: ({ row }) => row.original.mobile ?? "-",
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
                            <Link href={`/panel/vendor-business-list?vendorId=${row.original.id}`}>
                                <button
                                    className={`mr-4 ${buttonClassBlue}`}
                                    title="Vendor Business List"
                                >
                                    <Building className="h-4 w-4" />
                                </button>
                            </Link>

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
                                    <CheckCircle2 className="h-5 w-5" />
                                </button>
                            )}

                            <Link href={`/panel/create-vendor?id=${row.original.id}`}>
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
                <span className="text-2xl font-semibold leading-none text-slate-600">Vendor Lists</span>
            </div>

            <section className="space-y-5">
                <div className="mb-0 flex items-center justify-between">
                    <TableSearch
                        value={searchInput}
                        onChange={setSearchInput}
                        placeholder="Search..."
                    />
                    {/* <Link href="/panel/create-vendor" className={buttonClass}> Add Vendor </Link> */}
                </div>


                <DataTable
                    table={table}
                    loading={loading}
                    emptyMessage="No Records Found"
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