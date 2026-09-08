"use client";

import { useEffect, useMemo, useState } from "react";
import { getCoreRowModel, useReactTable, type ColumnDef } from "@tanstack/react-table";
import { CheckCircle2, Pencil, Trash2, XCircle } from "lucide-react";
import Link from "next/link";
import DataTable from "@/components/common/datatable/datatable";
import TablePagination from "@/components/common/datatable/pagination";
import TableSearch from "@/components/common/datatable/searchbox";
import PopupModal from "@/components/common/popup/popup-modal";
import { adminRoutes } from "@/services/api/admin.routes";
import { constants } from "@/utils/constants";
import { common as commonUtils } from "@/utils/common";
import { sweetalert } from "@/utils/sweetalert";
import { prefixUrl } from "@/utils/constants"

const PAGE_SIZE = 10;
const amountInputRegex = /^\d*(\.\d{0,2})?$/;

type ConfirmationForm = {
    status: string;
    final_amount: string;
    notes: string;
};

const initialForm: ConfirmationForm = {
    status: "",
    final_amount: "",
    notes: "",
};


export default function AvailabilityRequestList() {
    const [loading, setLoading] = useState(false);
    const [searchInput, setSearchInput] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [rows, setRows] = useState<any[]>([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [totalRecords, setTotalRecords] = useState(0);

    const [showPopup, setShowPopup] = useState(false);
    const [popupTitle, setPopupTitle] = useState("");
    const [selectedRow, setSelectedRow] = useState<any>(null);
    const [form, setForm] = useState<ConfirmationForm>(initialForm);
    const [error, setError] = useState("");

    useEffect(() => {
        const timer = setTimeout(() => {
            setSearchTerm(searchInput);
            setPage(1);
        }, 500);

        return () => clearTimeout(timer);
    }, [searchInput]);


    useEffect(() => {
        fetchAvailabilityRequestList();
    }, [page, searchTerm]);


    const fetchAvailabilityRequestList = async () => {
        try {
            setLoading(true);
            const response = await adminRoutes.availabilityRequestList({
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
            enabled: ["Are you sure you want to enable?", "Enable Confirmation"],
            disabled: ["Are you sure you want to disable?", "Disable Confirmation"],
            canceled: ["Are you sure you want to cancel?", "Cancel Confirmation"],
        };
        const [message, title] = messages[status];
        const confirmation = await sweetalert.confirm(message, title);

        if (!confirmation.isConfirmed) {
            return;
        }
        updateField("status", status);
        setSelectedRow(row);
        setShowPopup(true);
        setPopupTitle("Confirmation");
    };

    const updateField = (field: keyof ConfirmationForm, value: string) => {
        setForm((previous) => ({ ...previous, [field]: value }));
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setError("");

        if (form.status === "enabled") {
            if (!form.final_amount.trim()) {
                setError("Please enter the payable amount");
                return;
            }

            const amountRegex = /^\d+(\.\d{1,2})?$/;
            if (!amountRegex.test(form.final_amount.trim())) {
                setError("Please enter a valid payable amount");
                return;
            }
        }

        if (!form.notes.trim()) {
            setError("Please enter the reason");
            return;
        }

        try {
            const result = await adminRoutes.updateAvailabilityRequestStatus(
                {
                    id: selectedRow.id,
                    status: form.status,
                    final_amount: form.final_amount,
                    notes: form.notes
                });
            if (result?.success) {
                setShowPopup(false);
                setForm(initialForm);
                fetchAvailabilityRequestList();
                await sweetalert.success(result.message);
            }
        } catch (caughtError) {
            console.error("Update status failed:", caughtError);
        } finally {
            setLoading(false);
        }
    }

    const columns = useMemo<ColumnDef<any>[]>(() => [
        {
            accessorKey: "customer",
            header: "Customer",
            cell: ({ row }) => {
                const customer = row.original?.user;

                if (!customer) {
                    return <span className="text-sm text-slate-400">-</span>;
                }

                return (
                    <div className="min-w-[180px] space-y-1">
                        <div className="text-sm font-semibold text-slate-800">
                            {customer.name || "-"}
                        </div>

                        <div className="text-xs text-slate-500">
                            {customer.mobile || "-"}
                        </div>

                        <div className="truncate text-xs text-slate-400">
                            {customer.email || "-"}
                        </div>
                    </div>
                );
            },
        },
        {
            accessorKey: "category_service",
            header: "Service",
            cell: ({ row }) => {
                return row.original?.category_service?.service_name;
            },
        },
        {
            accessorKey: "vendor",
            header: "Vendor",
            cell: ({ row }) => {
                const vendor = row.original?.category_service?.vendor;

                if (!vendor) {
                    return <span className="text-sm text-slate-400">-</span>;
                }

                return (
                    <div className="min-w-[200px] space-y-1">
                        <div className="text-sm font-semibold text-slate-800">
                            {vendor.name || "-"}
                        </div>

                        <div className="text-xs text-slate-500">
                            {vendor.mobile || "-"}
                        </div>

                        <div className="truncate text-xs text-slate-400">
                            {vendor.email || "-"}
                        </div>
                    </div>
                );
            },
        },

        {
            accessorKey: "Dates",
            header: "Requested Date",
            cell: ({ row }) => {
                const dates = row.original?.dates || [];
                return (
                    <div className="text-sm text-slate-700">
                        {
                            dates.length > 0 ? dates.map((item: any) =>
                                commonUtils.formatDateTime(item.service_date, "MMM DD, YYYY")
                            ).join(", ") : "-"
                        }
                    </div>
                );
            },
        },

        {
            accessorKey: "notes",
            header: "Reason",
            cell: ({ row }) => {
                const notes = row.original?.notes;
                return notes || "-";
            },
        },

        {
            accessorKey: "updated_by",
            header: "Updated By",
            cell: ({ row }) => {
                const updatedUser = row.original?.updated_user;
                return updatedUser?.name || "-";
            },
        },

        {
            accessorKey: "updated_at",
            header: "Updated Date",
            cell: ({ row }) => {
                const updatedDate = row.original?.updated_at;
                return updatedDate ? commonUtils.formatDateTime(updatedDate, "MMM DD, YYYY") : "-";
            },
        },


        {
            accessorKey: "status",
            header: "Status",
            cell: ({ row }) => {
                const status = row.original?.status;

                let label = "-";
                let className = "bg-slate-100 text-slate-600";

                switch (status) {
                    case "pending":
                        label = "Pending";
                        className = "bg-amber-100 text-amber-700";
                        break;

                    case "enabled":
                        label = "Enabled";
                        className = "bg-emerald-100 text-emerald-700";
                        break;

                    case "disabled":
                        label = "Disabled";
                        className = "bg-slate-100 text-slate-600";
                        break;

                    case "canceled":
                        label = "Canceled";
                        className = "bg-rose-100 text-rose-700";
                        break;
                }

                return (
                    <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${className}`}>
                        {label}
                    </span>
                );
            },
        },


        {
            accessorKey: "action",
            header: "Action",
            size: 130,
            minSize: 130,
            cell: ({ row }) => {
                const isApproved = row.original?.status == 'enabled';
                return <>
                    <div className="flex items-center whitespace-nowrap">
                        {isApproved ? (
                            <button type="button" onClick={() => handleStatusUpdate(row.original, "disabled")} title="Disable" className={`mr-4 ${constants.buttonClassOrange}`}><XCircle className="h-4 w-4" /></button>
                        ) : (
                            <button type="button" onClick={() => handleStatusUpdate(row.original, "enabled")} title="Enable" className={`mr-4 ${constants.buttonClassGreen}`}><CheckCircle2 className="h-4 w-4" /></button>
                        )}
                        <button type="button" className={constants.buttonClassRed} title="Cancel" onClick={() => handleStatusUpdate(row.original, "canceled")}><Trash2 className="h-4 w-4" /></button>
                    </div>
                </>;
            },
        },
    ], []);

    const table = useReactTable({ data: rows, columns, getCoreRowModel: getCoreRowModel() });

    return (
        <>
            <div className="d-block mb-20">
                <div className="mb-6 ml-1 flex items-center justify-between">
                    <span className="text-2xl font-semibold leading-none text-slate-600">Availability Request List</span>
                </div>
                <section className="space-y-5">
                    <div className="mb-0 flex items-center justify-between gap-4">
                        <TableSearch value={searchInput} onChange={setSearchInput} placeholder="Search..." />
                    </div>
                    <DataTable table={table} loading={loading} emptyMessage="No Records Found" />
                    <TablePagination page={page} totalPages={totalPages} totalRecords={totalRecords} loading={loading} onPageChange={setPage} />
                </section>
            </div>

            <PopupModal
                show={showPopup}
                title={popupTitle}
                onClose={() => setShowPopup(false)}
                width="sm"
                position="top"
                blurBackground={false}
                showFooter={false}
            >
                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-5">
                        {form.status === "enabled" && (
                            <div className="md:col-span-12">
                                <label htmlFor="finalAmount" className="mb-2 block text-sm font-medium text-gray-700">
                                    Amount
                                </label>
                                <input
                                    id="finalAmount"
                                    type="text"
                                    placeholder="Enter the Payable Amount"
                                    className={constants.inputClass}
                                    value={form.final_amount}
                                    onChange={(event) => {
                                        const value = event.target.value;

                                        if (amountInputRegex.test(value)) {
                                            updateField("final_amount", value);
                                        }
                                    }}
                                />
                            </div>
                        )}

                        <div className="md:col-span-12">
                            <label htmlFor="notes" className="mb-2 block text-sm font-medium text-gray-700">
                                Reason
                            </label>
                            <textarea
                                id="notes"
                                placeholder="Enter the Reason"
                                className={constants.inputClass}
                                value={form.notes}
                                onChange={(event) => updateField("notes", event.target.value)}
                            ></textarea>
                        </div>

                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-5">
                        {error && (
                            <div className="text-sm text-rose-600 md:col-span-12">
                                {error}
                            </div>
                        )}

                        <div className="md:col-span-12 flex justify-end">
                            <button
                                type="submit"
                                className={constants.buttonClassSubmit}
                                disabled={loading}
                            >
                                {loading ? "Saving..." : "Save"}
                            </button>
                        </div>
                    </div>
                </form>
            </PopupModal>
        </>
    );
}