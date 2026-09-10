"use client";

import { useEffect, useMemo, useState } from "react";
import { getCoreRowModel, useReactTable, type ColumnDef } from "@tanstack/react-table";
import { Building2, CalendarDays, CreditCard, Download, IndianRupee, User } from "lucide-react";
import DataTable from "@/components/common/datatable/datatable";
import TablePagination from "@/components/common/datatable/pagination";
import TableSearch from "@/components/common/datatable/searchbox";
import PopupModal from "@/components/common/popup/popup-modal";
import { PaymentDetails } from "./payment-details";
import { adminRoutes } from "@/services/api/admin.routes";
import { constants } from "@/utils/constants";
import { common as commonUtils } from "@/utils/common";
import { apiConfig } from "@/environments/api";

const PAGE_SIZE = 10;


export default function PaymentList() {
    const BACKEND_BASE_URL = apiConfig.baseUrl;

    const [loading, setLoading] = useState(false);
    const [searchInput, setSearchInput] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [rows, setRows] = useState<any[]>([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [totalRecords, setTotalRecords] = useState(0);
    const [showPaymentPopup, setShowPaymentPopup] = useState(false);
    const [popupTitle, setPopupTitle] = useState("");
    const [selectedRow, setSelectedRow] = useState<any>(null);

    useEffect(() => {
        const timer = setTimeout(() => {
            setSearchTerm(searchInput);
            setPage(1);
        }, 500);

        return () => clearTimeout(timer);
    }, [searchInput]);


    useEffect(() => {
        fetchPaymentList();
    }, [page, searchTerm]);


    const fetchPaymentList = async () => {
        try {
            setLoading(true);
            const response = await adminRoutes.paymentList({
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
                const customer = row.original?.service_order?.availability_request?.user;

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
                const services = row.original?.service_order?.availability_request?.category_service;
                const vendor = row.original?.service_order?.availability_request?.category_service?.vendor;

                if (!vendor) {
                    return <span className="text-sm text-slate-400">-</span>;
                }

                return (
                    <div className="min-w-[200px] space-y-1">
                        <div className="text-sm font-semibold text-slate-800">
                            {services?.service_name || "-"} : {vendor.name || "-"}
                        </div>

                        <div className="text-xs text-slate-500">
                            {services?.service_mobile || "-"}
                        </div>

                        <div className="truncate text-xs text-slate-400">
                            {services?.service_email || "-"}
                        </div>
                    </div>
                );
            },
        },
        // {
        //     accessorKey: "order_number",
        //     header: "Order Id",
        //     cell: ({ row }) => { return row.original?.service_order?.order_number },
        // },
        {
            accessorKey: "invoice_number",
            header: "Invoice",
            cell: ({ row }) => {
                return (
                    <a
                        href={`${BACKEND_BASE_URL}/${row.original?.service_order?.invoice_file}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        download
                        className="text-primary"
                    >
                        {row.original?.service_order?.invoice_number}
                    </a>
                )
            },
        },
        {
            accessorKey: "payment_number",
            header: "Payment Id",
            cell: ({ row }) => { return row.original?.payment_number },
        },
        // {
        //     accessorKey: "payment_method",
        //     header: "Method",
        //     cell: ({ row }) => {
        //         return (
        //             <span className="capitalize">{row.original?.payment_method}</span>
        //         )
        //     },
        // },
        {
            accessorKey: "paid_amount",
            header: "Amount",
            cell: ({ row }) => { return commonUtils.formatAmount(row.original?.paid_amount) },
        },
        {
            accessorKey: "paid_at",
            header: "Date",
            cell: ({ row }) => { return commonUtils.formatDateTime(row.original?.paid_at) },
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
                return (
                    <div className="flex items-center whitespace-nowrap">
                        <button
                            type="button"
                            onClick={() => !handlePaymentDetails(item)}
                            title="Payment Details"
                            className={`mr-4 ${constants.buttonClassPurple}`}
                        >
                            <IndianRupee className="h-4 w-4" />
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
                    <span className="text-2xl font-semibold leading-none text-slate-600">Payment History</span>
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
                show={showPaymentPopup}
                title={popupTitle}
                onClose={() => setShowPaymentPopup(false)}
                width="7xl"
                position="top"
                blurBackground={false}
                showFooter={false}
            >
                <PaymentDetails selectedRow={selectedRow} />
            </PopupModal>
        </>
    );
}