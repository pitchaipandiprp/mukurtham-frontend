
"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { userService } from "@/services/users/users.service";
import { getCoreRowModel, useReactTable, type ColumnDef } from "@tanstack/react-table";
import { Pencil, Trash2, Eye, Copy, MoreVertical, } from "lucide-react";
import Link from "next/link";
import DataTable from "@/components/common/datatable/datatable";
import TableSearch from "@/components/common/datatable/searchbox";
import TablePagination from "@/components/common/datatable/pagination";
import { common as commonUtils } from "@/utils/common";
import { sweetalert } from "@/utils/sweetalert";



const PAGE_SIZE = 10;

export default function UserList({
    roleId = 0,
    roleTitle = "User",
}) {

    //Data Table Code Start
    const [rows, setRows] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [searchInput, setSearchInput] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [totalRecords, setTotalRecords] = useState(0);
    const buttonClass = commonUtils.buttonClass;
    const buttonClassBlue = commonUtils.buttonClassBlue;
    const buttonClassRed = commonUtils.buttonClassRed;

    useEffect(() => {
        const timer = setTimeout(() => {
            setSearchTerm(searchInput);
            setPage(1);
        }, 500);

        return () => clearTimeout(timer);
    }, [searchInput]);

    useEffect(() => {
        fetchUserData();
    }, [page, searchTerm]);


    const fetchUserData = async () => {
        try {
            setLoading(true);

            const response = await userService.userList({
                page,
                limit: PAGE_SIZE,
                search: searchTerm,
                role_id: roleId,
            });

            const responData = response.data;

            setRows(responData?.rows ?? []);
            setTotalPages(responData?.totalPages ?? 0);
            setTotalRecords(responData?.total ?? 0);

        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (row: any) => {
        const swalConfirm = await sweetalert.confirm("Are you sure you want to delete?", "Delete Confirmation");
        if (!swalConfirm.isConfirmed) {
            return;
        }

        try {
            const result = await userService.userDelete({ id: row.id });
            if (result?.success) {
                sweetalert.success(result.message);
                fetchUserData();
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
                    return (
                        <>
                            <Link href={`/panel/edit-user?id=${row.original.id}`}>
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
                                onClick={() => handleDelete(row.original)}
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
    //Data Table Code End


    return (
        <div className="d-block">
            <div className="mb-6 ml-1 flex items-center justify-between">
                <b className="text-2xl text-slate-600 tracking-tight">{roleTitle} Lists</b>
            </div>

            <section className="space-y-5">
                <div className="mb-0 flex items-center justify-between">
                    <TableSearch
                        value={searchInput}
                        onChange={setSearchInput}
                        placeholder="Search User..."
                    />
                    <Link href="/panel/add-user" className={buttonClass}> Add {roleTitle} </Link>
                </div>


                <DataTable
                    table={table}
                    loading={loading}
                    emptyMessage="No Users Found"
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