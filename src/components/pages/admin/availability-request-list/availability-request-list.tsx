"use client";

import { useEffect, useMemo, useState } from "react";
import { getCoreRowModel, useReactTable, type ColumnDef } from "@tanstack/react-table";
import { Banknote, CheckCircle2, CreditCard, IndianRupee, Pencil, ReceiptText, Trash2, Wallet, XCircle } from "lucide-react";
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
    service_amount: string;
    discount_amount: string;
    tax_percentage: string;
    notes: string;
};

const initialForm: ConfirmationForm = {
    status: "",
    service_amount: "",
    discount_amount: "0.00",
    tax_percentage: "0.00",
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

    const [showStatusPopup, setShowStatusPopup] = useState(false);
    const [showPaymentPopup, setShowPaymentPopup] = useState(false);
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
        setShowStatusPopup(true);
        setPopupTitle("Confirmation");
    };

    const updateField = (field: keyof ConfirmationForm, value: string) => {
        setForm((previous) => ({ ...previous, [field]: value }));
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setError("");

        const amountRegex = /^\d+(\.\d{1,2})?$/;

        if (form.status === "enabled") {
            if (!form.service_amount.trim()) {
                setError("Please enter the amount");
                return;
            }

            if (!amountRegex.test(form.service_amount.trim())) {
                setError("Please enter a valid amount");
                return;
            }
        }

        if (form.discount_amount) {
            if (!amountRegex.test(form.discount_amount.trim())) {
                setError("Please enter a valid discount amount");
                return;
            }
        }

        if (form.tax_percentage) {
            if (!amountRegex.test(form.tax_percentage.trim())) {
                setError("Please enter a valid tax percentage");
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
                    service_amount: form.service_amount,
                    discount_amount: form.discount_amount,
                    tax_percentage: form.tax_percentage,
                    notes: form.notes
                });
            if (result?.success) {
                setShowStatusPopup(false);
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

    const handlePaymentDetails = async (row: any) => {
        setSelectedRow(row);
        setShowPaymentPopup(true);
        setPopupTitle("Payment Details");
    };


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
            accessorKey: "vendor",
            header: "Vendor",
            cell: ({ row }) => {
                const serviceName = row.original?.category_service?.service_name;
                const vendor = row.original?.category_service?.vendor;

                if (!vendor) {
                    return <span className="text-sm text-slate-400">-</span>;
                }

                return (
                    <div className="min-w-[200px] space-y-1">
                        <div className="text-sm font-semibold text-slate-800">
                            {serviceName || "-"} : {vendor.name || "-"}
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

                    case "paid":
                        label = "Paid";
                        className = "bg-purple-100 text-purple-700";
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
                const item = row.original;
                const isPaid = item?.status === "paid";
                const isApproved = item?.status === "enabled";

                return (
                    <div className="flex items-center whitespace-nowrap">
                        {/* Payment Details */}
                        <button
                            type="button"
                            onClick={() => !isPaid && !isApproved
                                ? undefined
                                : handlePaymentDetails(item)
                            }
                            title="Payment Details"
                            disabled={!isApproved && !isPaid}
                            className={`mr-4 ${constants.buttonClassPurple}`}
                        >
                            <IndianRupee className="h-4 w-4" />
                        </button>

                        {/* Enable / Disable */}
                        {isApproved ? (
                            <button
                                type="button"
                                onClick={() => !isPaid && handleStatusUpdate(item, "disabled")}
                                title="Disable"
                                disabled={isPaid}
                                className={`mr-4 ${constants.buttonClassOrange}`}
                            >
                                <XCircle className="h-4 w-4" />
                            </button>
                        ) : (
                            <button
                                type="button"
                                onClick={() => !isPaid && handleStatusUpdate(item, "enabled")}
                                title="Enable"
                                disabled={isPaid}
                                className={`mr-4 ${constants.buttonClassGreen}`}
                            >
                                <CheckCircle2 className="h-4 w-4" />
                            </button>
                        )}

                        {/* Cancel */}
                        <button
                            type="button"
                            onClick={() => !isPaid && handleStatusUpdate(item, "canceled")}
                            title="Cancel"
                            disabled={isPaid}
                            className={`${constants.buttonClassRed}`}
                        >
                            <Trash2 className="h-4 w-4" />
                        </button>
                    </div>
                );
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
                show={showStatusPopup}
                title={popupTitle}
                onClose={() => setShowStatusPopup(false)}
                width="md"
                position="top"
                blurBackground={false}
                showFooter={false}
            >
                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-5">
                        {form.status === "enabled" && (
                            <>
                                <div className="md:col-span-12">
                                    <label htmlFor="serviceAmount" className="mb-2 block text-sm font-medium text-gray-700">
                                        Amount
                                    </label>
                                    <input
                                        id="serviceAmount"
                                        type="text"
                                        placeholder="Enter the Payable Amount"
                                        className={constants.inputClass}
                                        value={form.service_amount}
                                        onChange={(event) => {
                                            const value = event.target.value;

                                            if (amountInputRegex.test(value)) {
                                                updateField("service_amount", value);
                                            }
                                        }}
                                    />
                                </div>

                                <div className="md:col-span-12">
                                    <label htmlFor="discountAmount" className="mb-2 block text-sm font-medium text-gray-700">
                                        Discount Amount
                                    </label>
                                    <input
                                        id="discountAmount"
                                        type="text"
                                        placeholder="Enter the Discount Amount"
                                        className={constants.inputClass}
                                        value={form.discount_amount}
                                        onChange={(event) => {
                                            const value = event.target.value;

                                            if (amountInputRegex.test(value)) {
                                                updateField("discount_amount", value);
                                            }
                                        }}
                                    />
                                </div>

                                <div className="md:col-span-12">
                                    <label htmlFor="taxPercentage" className="mb-2 block text-sm font-medium text-gray-700">
                                        Tax (%)
                                    </label>
                                    <input
                                        id="taxPercentage"
                                        type="text"
                                        placeholder="Enter the Tax Percentage"
                                        className={constants.inputClass}
                                        value={form.tax_percentage}
                                        onChange={(event) => {
                                            const value = event.target.value;

                                            if (amountInputRegex.test(value)) {
                                                updateField("tax_percentage", value);
                                            }
                                        }}
                                    />
                                </div>
                            </>
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

            <PopupModal
                show={showPaymentPopup}
                title={popupTitle}
                onClose={() => setShowPaymentPopup(false)}
                width="md"
                position="top"
                blurBackground={false}
                showFooter={false}
            >
                <div className="mb-5 overflow-hidden rounded-xl border border-slate-200 bg-white">
                    <div className="divide-y divide-slate-100">
                        {/* Amount */}
                        <div className="flex items-center justify-between gap-4 px-4 py-3">
                            <span className="text-sm text-slate-500">
                                Amount
                            </span>

                            <span className="inline-flex items-center gap-0.5 text-sm font-semibold text-slate-800">
                                {selectedRow?.service_amount && selectedRow?.service_amount > 0 ? commonUtils.formatAmount(selectedRow.service_amount) : "-"}
                            </span>
                        </div>

                        {/* Discount */}
                        <div className="flex items-center justify-between gap-4 px-4 py-3">
                            <span className="text-sm text-slate-500">
                                Discount Amount
                            </span>

                            <span className="inline-flex items-center gap-0.5 text-sm font-semibold text-emerald-600">
                                {selectedRow?.discount_amount && selectedRow.discount_amount > 0 ? (
                                    <>
                                        {commonUtils.formatAmount(selectedRow.discount_amount)}
                                    </>
                                ) : (
                                    "-"
                                )}
                            </span>
                        </div>

                        {/* Net Amount */}
                        <div className="flex items-center justify-between gap-4 bg-slate-50/50 px-4 py-3">
                            <span className="text-sm font-medium text-slate-600">
                                Net Amount
                            </span>

                            <span className="inline-flex items-center gap-0.5 text-sm font-bold text-slate-800">
                                {selectedRow?.service_amount && selectedRow.service_amount > 0
                                    ? (
                                        commonUtils.formatAmount(selectedRow.service_amount - (selectedRow.discount_amount || 0))
                                    )
                                    : "-"}
                            </span>
                        </div>

                        {/* Tax */}
                        <div className="flex items-center justify-between gap-4 px-4 py-3">
                            <span className="text-sm text-slate-500">
                                Tax
                            </span>

                            <span className="text-sm font-semibold text-slate-800">
                                {selectedRow?.tax_percentage && selectedRow.tax_percentage > 0 ? `${selectedRow.tax_percentage}%` : "-"}
                            </span>
                        </div>

                        {/* Tax Amount */}
                        <div className="flex items-center justify-between gap-4 px-4 py-3">
                            <span className="text-sm text-slate-500">
                                Tax Amount
                            </span>

                            <span className="inline-flex items-center gap-0.5 text-sm font-semibold text-slate-800">
                                {selectedRow?.tax_amount && selectedRow.tax_amount > 0 ? (
                                    <>
                                        {commonUtils.formatAmount(selectedRow.tax_amount)}
                                    </>
                                ) : (
                                    "-"
                                )}
                            </span>
                        </div>
                    </div>

                    {/* Payable Amount */}
                    <div className="border-t border-slate-200 bg-indigo-50/60 px-4 py-4">
                        <div className="flex items-center justify-between gap-4">
                            <div>
                                <p className="text-sm font-bold text-slate-800">
                                    Payable Amount
                                </p>
                                <p className="mt-0.5 text-xs text-slate-500">
                                    Final amount to be paid
                                </p>
                            </div>

                            <span className="inline-flex items-center gap-0.5 text-xl font-semibold text-purple-700">
                                {selectedRow?.payable_amount && selectedRow.payable_amount > 0 ? commonUtils.formatAmount(selectedRow.payable_amount) : "-"}
                            </span>
                        </div>
                    </div>
                </div>
            </PopupModal>
        </>
    );
}