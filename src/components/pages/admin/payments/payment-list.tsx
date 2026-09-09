"use client";

import { useEffect, useMemo, useState } from "react";
import { getCoreRowModel, useReactTable, type ColumnDef } from "@tanstack/react-table";
import { Banknote, Building2, CalendarDays, CheckCircle2, CreditCard, Download, FileText, IndianRupee, Pencil, ReceiptText, Trash2, User, Wallet, XCircle } from "lucide-react";
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
                const serviceName = row.original?.service_order?.availability_request?.category_service?.service_name;
                const vendor = row.original?.service_order?.availability_request?.category_service?.vendor;

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
                {(() => {
                    const payment = selectedRow;
                    const order = payment?.service_order;
                    const request = order?.availability_request;
                    const customer = request?.user;
                    const service = request?.category_service;
                    const vendor = service?.vendor;
                    const dates = request?.dates ?? [];

                    const serviceAmount = Number(request?.service_amount || 0);
                    const discountAmount = Number(request?.discount_amount || 0);
                    const taxAmount = Number(request?.tax_amount || 0);
                    const payableAmount = Number(request?.payable_amount || 0);

                    const netAmount = serviceAmount - discountAmount;


                    return (
                        <div className="space-y-4">

                            {/* Payment Header */}
                            <div className="rounded-xl border border-slate-200 bg-gradient-to-r from-slate-50 to-white p-4">
                                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

                                    <div>
                                        <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                                            Payment Number
                                        </p>

                                        <p className="mt-1 break-all text-sm font-bold text-slate-800">
                                            {payment?.payment_number || "-"}
                                        </p>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        {payment?.paid_at && (
                                            <span className="text-xs text-slate-500">
                                                {commonUtils.formatDateTime(payment.paid_at)}
                                            </span>
                                        )}
                                        <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold uppercase text-emerald-700">
                                            {payment?.status || "-"}
                                        </span>
                                    </div>
                                </div>
                            </div>


                            {/* Customer + Service */}
                            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                                {/* Service */}
                                <div className="rounded-xl border border-slate-200 bg-white p-4">
                                    <div className="mb-3 flex items-center gap-2">
                                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-100 text-purple-600">
                                            <Building2 size={16} />
                                        </div>

                                        <h3 className="text-sm font-bold text-slate-800">
                                            Service Details
                                        </h3>
                                    </div>

                                    <div className="flex gap-3">
                                        {service?.service_banner_image && (
                                            <div className="h-20 w-20 shrink-0 overflow-hidden rounded-lg border border-slate-200">
                                                <img
                                                    src={`${BACKEND_BASE_URL}/${service.service_banner_image}`}
                                                    alt={service?.service_name || "Service"}
                                                    className="h-full w-full object-cover"
                                                />
                                            </div>
                                        )}

                                        <div className="min-w-0">
                                            <p className="text-sm font-bold text-slate-800">
                                                {service?.service_name || "-"}
                                            </p>

                                            <p className="mt-1 text-xs leading-5 text-slate-500">
                                                {service?.service_address || "-"}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="space-y-2.5 flex gap-4 mt-4">

                                        <div>
                                            <p className="text-xs text-slate-400">
                                                Name
                                            </p>
                                            <p className="text-sm font-semibold text-slate-700">
                                                {customer?.name || "-"}
                                            </p>
                                        </div>

                                        <div>
                                            <p className="text-xs text-slate-400">
                                                Email
                                            </p>
                                            <p className="break-all text-sm text-slate-600">
                                                {customer?.email || "-"}
                                            </p>
                                        </div>

                                        <div>
                                            <p className="text-xs text-slate-400">
                                                Mobile
                                            </p>
                                            <p className="text-sm text-slate-600">
                                                {customer?.mobile || "-"}
                                            </p>
                                        </div>

                                    </div>
                                </div>

                                {/* Customer */}
                                <div className="rounded-xl border border-slate-200 bg-white p-4">
                                    <div className="mb-3 flex items-center gap-2">
                                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-100 text-indigo-600">
                                            <User size={16} />
                                        </div>

                                        <h3 className="text-sm font-bold text-slate-800">
                                            Customer Details
                                        </h3>
                                    </div>

                                    <div className="space-y-2.5">

                                        <div>
                                            <p className="text-xs text-slate-400">
                                                Name
                                            </p>
                                            <p className="text-sm font-semibold text-slate-700">
                                                {customer?.name || "-"}
                                            </p>
                                        </div>

                                        <div>
                                            <p className="text-xs text-slate-400">
                                                Email
                                            </p>
                                            <p className="break-all text-sm text-slate-600">
                                                {customer?.email || "-"}
                                            </p>
                                        </div>

                                        <div>
                                            <p className="text-xs text-slate-400">
                                                Mobile
                                            </p>
                                            <p className="text-sm text-slate-600">
                                                {customer?.mobile || "-"}
                                            </p>
                                        </div>

                                    </div>
                                </div>
                            </div>


                            {/* Booking Dates */}
                            <div className="rounded-xl border border-slate-200 bg-white p-4">

                                <div className="mb-3 flex items-center justify-between gap-3">
                                    <div className="flex items-center gap-2">
                                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-100 text-amber-600">
                                            <CalendarDays size={16} />
                                        </div>

                                        <h3 className="text-sm font-bold text-slate-800">
                                            Booking Dates
                                        </h3>
                                    </div>

                                    <span className="text-xs text-slate-400">
                                        {dates.length} {dates.length === 1 ? "day" : "days"}
                                    </span>
                                </div>

                                {dates.length > 0 ? (
                                    <div className="flex flex-wrap gap-2">
                                        {dates.map((item: any) => (
                                            <div
                                                key={`req-dates-${item.id}`}
                                                className="rounded-lg border border-indigo-100 bg-indigo-50 px-3 py-2"
                                            >
                                                <p className="text-xs font-semibold text-indigo-700">
                                                    {commonUtils.formatDateTime(item.service_date)}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-sm text-slate-400">
                                        No booking dates available
                                    </p>
                                )}

                            </div>


                            {/* Payment Details */}
                            <div className="rounded-xl border border-slate-200 bg-white p-4">

                                <div className="mb-3 flex items-center gap-2">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600">
                                        <CreditCard size={16} />
                                    </div>

                                    <h3 className="text-sm font-bold text-slate-800">
                                        Payment Details
                                    </h3>
                                </div>

                                <div className="grid grid-cols-1 gap-x-6 gap-y-3 sm:grid-cols-2">
                                    <div>
                                        <p className="text-xs text-slate-400">
                                            Order Number
                                        </p>

                                        <p className="mt-0.5 break-all text-sm font-semibold text-slate-700">
                                            {order?.order_number || "-"}
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-xs text-slate-400">
                                            Invoice Number
                                        </p>

                                        <p className="mt-0.5 break-all text-sm font-semibold text-slate-700">
                                            {order?.invoice_number || "-"}
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-xs text-slate-400">
                                            Payment Number
                                        </p>

                                        <p className="mt-0.5 break-all text-sm font-semibold text-slate-700">
                                            {payment?.payment_number || "-"}
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-xs text-slate-400">
                                            Payment Method
                                        </p>

                                        <p className="mt-0.5 text-sm font-semibold capitalize text-slate-700">
                                            {payment?.payment_method || "-"}
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-xs text-slate-400">
                                            Razorpay Order ID
                                        </p>

                                        <p className="mt-0.5 break-all text-sm text-slate-600">
                                            {payment?.razorpay_order_id || "-"}
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-xs text-slate-400">
                                            Razorpay Payment ID
                                        </p>

                                        <p className="mt-0.5 break-all text-sm text-slate-600">
                                            {payment?.razorpay_payment_id || "-"}
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-xs text-slate-400">
                                            Paid At
                                        </p>

                                        <p className="mt-0.5 text-sm text-slate-600">
                                            {payment?.paid_at
                                                ? commonUtils.formatDateTime(payment.paid_at)
                                                : "-"}
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-xs text-slate-400">
                                            Payment Status
                                        </p>

                                        <span className="mt-1 inline-flex rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold capitalize text-emerald-700">
                                            {payment?.status || "-"}
                                        </span>
                                    </div>

                                </div>

                                {order?.invoice_file && (
                                    <div className="mt-4 border-t border-slate-100 pt-3">
                                        <a
                                            href={`${BACKEND_BASE_URL}/${order.invoice_file}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-white transition hover:bg-primary-dark"
                                        >
                                            <Download size={15} />
                                            Download Invoice
                                        </a>
                                    </div>
                                )}
                            </div>


                            {/* Amount Details */}
                            <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">

                                <div className="border-b border-slate-200 bg-slate-50 px-4 py-3">
                                    <div className="flex items-center gap-2">
                                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-100 text-purple-600">
                                            <IndianRupee size={16} />
                                        </div>

                                        <h3 className="text-sm font-bold text-slate-800">
                                            Amount Details
                                        </h3>
                                    </div>
                                </div>

                                <div className="divide-y divide-slate-100">

                                    {/* Service Amount */}
                                    <div className="flex items-center justify-between gap-4 px-4 py-3">
                                        <span className="text-sm text-slate-500">
                                            Service Amount
                                        </span>

                                        <span className="text-sm font-semibold text-slate-800">
                                            {serviceAmount > 0
                                                ? commonUtils.formatAmount(serviceAmount)
                                                : "-"}
                                        </span>
                                    </div>


                                    {/* Discount */}
                                    <div className="flex items-center justify-between gap-4 px-4 py-3">
                                        <span className="text-sm text-slate-500">
                                            Discount
                                        </span>

                                        <span className="text-sm font-semibold text-emerald-600">
                                            {discountAmount > 0
                                                ? `- ${commonUtils.formatAmount(discountAmount)}`
                                                : "-"}
                                        </span>
                                    </div>


                                    {/* Net Amount */}
                                    <div className="flex items-center justify-between gap-4 bg-slate-50/50 px-4 py-3">
                                        <span className="text-sm font-medium text-slate-600">
                                            Net Amount
                                        </span>

                                        <span className="text-sm font-bold text-slate-800">
                                            {commonUtils.formatAmount(netAmount)}
                                        </span>
                                    </div>


                                    {/* Tax */}
                                    <div className="flex items-center justify-between gap-4 px-4 py-3">
                                        <span className="text-sm text-slate-500">
                                            Tax ({request?.tax_percentage || 0}%)
                                        </span>

                                        <span className="text-sm font-semibold text-slate-800">
                                            {taxAmount > 0
                                                ? commonUtils.formatAmount(taxAmount)
                                                : "-"}
                                        </span>
                                    </div>

                                </div>


                                {/* Payable */}
                                <div className="border-t border-slate-200 bg-purple-50 px-4 py-4">
                                    <div className="flex items-center justify-between gap-4">

                                        <div>
                                            <p className="text-sm font-bold text-slate-800">
                                                Total Paid
                                            </p>

                                            <p className="mt-0.5 text-xs text-slate-500">
                                                Final amount paid for this order
                                            </p>
                                        </div>

                                        <span className="text-xl font-bold text-purple-700">
                                            {payableAmount > 0
                                                ? commonUtils.formatAmount(payableAmount)
                                                : "-"}
                                        </span>

                                    </div>
                                </div>

                            </div>

                        </div>
                    );
                })()}
            </PopupModal>
        </>
    );
}