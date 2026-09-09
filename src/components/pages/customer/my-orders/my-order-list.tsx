"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { KeyRound, MapPin, ReceiptText, CreditCard, Wallet, Banknote, CircleDollarSign, IndianRupee, CalendarDays, ShoppingBag, Download, Clock3, Search, } from "lucide-react";
import { useRouter } from "nextjs-toploader/app";
import Loading from "@/components/common/loading/loading"
import { constants } from "@/utils/constants";
import { common as commonUtils } from "@/utils/common";
import { customerRoutes } from "@/services/api/customer.routes";
import { apiConfig } from "@/environments/api";
import { sweetalert } from "@/utils/sweetalert";
import { authUser } from "@/utils/auth";

const PAGE_SIZE = 100;

export default function MyOrderList() {
    const BACKEND_BASE_URL = apiConfig.baseUrl;
    const router = useRouter();
    const userProfile = authUser();

    const [loading, setLoading] = useState(false);
    const [rows, setRows] = useState<any[]>([]);
    const [page, setPage] = useState(1);


    useEffect(() => {
        fetchOrderList();
    }, [page]);


    const fetchOrderList = async () => {
        try {
            setLoading(true);
            const response = await customerRoutes.myOrderList({
                page,
                limit: PAGE_SIZE,
            });
            const responseData = response.data;
            setRows(responseData?.rows ?? []);
        } finally {
            setLoading(false);
        }
    };


    return (
        <>
            <main className="mx-auto max-w-screen-2xl space-y-12 px-4 py-6 sm:px-6 lg:px-8">
                <div className="d-block">
                    <div className="min-h-full rounded-xl border border-primary/10 bg-white px-4 py-4 shadow-sm">

                        <div className="mb-6 ml-1">
                            <div className="flex items-center gap-3">
                                {/* Icon */}
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                                    <ShoppingBag className="h-5 w-5 text-primary" />
                                </div>

                                {/* Title */}
                                <div>
                                    <h1 className="text-xl font-semibold leading-tight text-slate-800">
                                        My Orders
                                    </h1>
                                </div>
                            </div>

                            {/* Accent line */}
                            <div className="mt-5 w-full border border-gray-100" />
                        </div>

                        {loading && (
                            <Loading />
                        )}

                        <div className="grid grid-cols-1 gap-6">
                            {rows?.length > 0 &&
                                rows.map((rowItem: any, index: number) => {
                                    const availabilityRequest = rowItem?.availability_request;
                                    const categoryService = availabilityRequest?.category_service;

                                    const serviceDates = Array.isArray(availabilityRequest?.dates) ? availabilityRequest.dates : [];

                                    const servicePayments = Array.isArray(rowItem?.service_payments) ? rowItem.service_payments : [];

                                    const latestPayment = servicePayments?.[0];

                                    const serviceAmount = Number(availabilityRequest?.service_amount || 0);

                                    const discountAmount = Number(availabilityRequest?.discount_amount || 0);

                                    const taxAmount = Number(availabilityRequest?.tax_amount || 0);

                                    const payableAmount = Number(availabilityRequest?.payable_amount || 0);

                                    return (
                                        <div
                                            key={`my-orders-${rowItem.id ?? index}`}
                                            className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm transition-shadow duration-200 hover:shadow-md"
                                        >

                                            {/* Header */}
                                            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 bg-slate-50 px-4 py-3">
                                                <div className="flex flex-wrap items-center gap-x-5 gap-y-1">
                                                    <div>
                                                        <span className="text-xs text-slate-500">
                                                            Order ID
                                                        </span>

                                                        <p className="text-sm font-bold text-slate-800">
                                                            {rowItem?.order_number || "-"}
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-3">
                                                    <span className="inline-flex items-center gap-1.5 rounded-sm border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                                                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 capitalize" />
                                                        {commonUtils.capitalizeFirst(rowItem?.status) || "Paid"}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Middle */}
                                            <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px]">
                                                {/* Left Side */}
                                                <div className="border-b border-slate-200 p-4 lg:border-b-0 lg:border-r">
                                                    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:gap-8">
                                                        <div className="flex flex-col lg:flex-row lg:items-start gap-4">
                                                            {/* Service Image */}
                                                            <div className="h-28 w-full shrink-0 overflow-hidden rounded-md border border-slate-200 bg-slate-100 sm:h-32 sm:w-40">
                                                                {categoryService?.service_banner_image ? (
                                                                    <img
                                                                        src={`${BACKEND_BASE_URL}/${categoryService.service_banner_image}`}
                                                                        alt={categoryService?.service_name || "Service"}
                                                                        className="h-full w-full object-cover"
                                                                    />
                                                                ) : (
                                                                    <div className="flex h-full w-full items-center justify-center text-xs text-slate-400">
                                                                        No Image
                                                                    </div>
                                                                )}
                                                            </div>

                                                            {/* Service Details */}
                                                            <div className="min-w-0">
                                                                <div>
                                                                    <h3 className="line-clamp-2 text-base font-semibold text-slate-900">
                                                                        {categoryService?.service_name || "Service"}
                                                                    </h3>

                                                                    {categoryService?.service_address && (
                                                                        <div className="mt-2 flex items-start gap-1.5 text-xs text-slate-500">
                                                                            <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-slate-400" />

                                                                            <span className="line-clamp-2">
                                                                                {categoryService.service_address}
                                                                            </span>
                                                                        </div>
                                                                    )}


                                                                </div>
                                                            </div>
                                                        </div>

                                                        {/* Dates */}
                                                        <div>
                                                            {serviceDates.length > 0 && (
                                                                <div className="mt-1">

                                                                    <div className="mb-2 flex items-center gap-1.5">
                                                                        <CalendarDays className="h-4 w-4 text-primary" />

                                                                        <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                                                                            Booking Dates
                                                                        </span>
                                                                    </div>

                                                                    <div className="flex flex-wrap gap-2">
                                                                        {serviceDates.map(
                                                                            (dateItem: any, dateIndex: number) => (
                                                                                <div
                                                                                    key={`request-date-${rowItem.id}-${dateIndex}`}
                                                                                    className="rounded-sm border border-primary/20 bg-[#FDF2F7] px-2.5 py-1.5"
                                                                                >
                                                                                    <span className="text-xs font-semibold text-primary">
                                                                                        {commonUtils.formatDateTime(
                                                                                            dateItem?.service_date,
                                                                                            "MMM DD, YYYY"
                                                                                        )}
                                                                                    </span>
                                                                                </div>
                                                                            )
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Right Side */}
                                                <div className="p-4">
                                                    <div className="mb-3 flex items-center gap-2">
                                                        <ReceiptText className="h-4 w-4 text-primary" />

                                                        <h3 className="text-sm font-semibold text-slate-800">
                                                            Price Details
                                                        </h3>
                                                    </div>

                                                    <div className="space-y-2.5">

                                                        {/* Service Amount */}
                                                        <div className="flex items-center justify-between text-xs">
                                                            <span className="text-slate-500">
                                                                Service Amount
                                                            </span>

                                                            <span className="font-semibold text-slate-700">
                                                                {serviceAmount > 0
                                                                    ? commonUtils.formatAmount(serviceAmount)
                                                                    : "-"}
                                                            </span>
                                                        </div>

                                                        {/* Discount */}
                                                        {discountAmount > 0 && (
                                                            <div className="flex items-center justify-between text-xs">
                                                                <span className="text-slate-500">
                                                                    Discount
                                                                </span>

                                                                <span className="font-semibold text-emerald-600">
                                                                    - {commonUtils.formatAmount(discountAmount)}
                                                                </span>
                                                            </div>
                                                        )}

                                                        {/* Net Amount */}
                                                        <div className="flex items-center justify-between text-xs">
                                                            <span className="text-slate-500">
                                                                Net Amount
                                                            </span>

                                                            <span className="font-semibold text-slate-700">
                                                                {serviceAmount > 0
                                                                    ? commonUtils.formatAmount(
                                                                        serviceAmount - discountAmount
                                                                    )
                                                                    : "-"}
                                                            </span>
                                                        </div>

                                                        {/* Tax */}
                                                        <div className="flex items-center justify-between text-xs">
                                                            <span className="text-slate-500">
                                                                Tax
                                                                {Number(
                                                                    availabilityRequest?.tax_percentage || 0
                                                                ) > 0 && (
                                                                        <span className="ml-1 text-[10px] text-slate-400">
                                                                            ({availabilityRequest.tax_percentage}%)
                                                                        </span>
                                                                    )}
                                                            </span>

                                                            <span className="font-semibold text-slate-700">
                                                                {taxAmount > 0
                                                                    ? commonUtils.formatAmount(taxAmount)
                                                                    : "-"}
                                                            </span>
                                                        </div>

                                                    </div>

                                                    {/* Total */}
                                                    <div className="mt-4 border-t border-slate-200 pt-3">
                                                        <div className="flex items-end justify-between">

                                                            <div>
                                                                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                                                                    Total Paid
                                                                </p>

                                                                <p className="mt-0.5 text-[11px] text-emerald-600">
                                                                    Payment completed
                                                                </p>
                                                            </div>

                                                            <span className="text-lg font-bold text-primary">
                                                                {payableAmount > 0
                                                                    ? commonUtils.formatAmount(payableAmount)
                                                                    : "-"}
                                                            </span>

                                                        </div>
                                                    </div>

                                                </div>
                                            </div>

                                            {/* Bottom */}
                                            <div className="border-t border-slate-200 bg-white px-4 py-3">
                                                <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">

                                                    {/* Payment information */}
                                                    {latestPayment ? (
                                                        <div className="grid grid-cols-2 gap-x-6 gap-y-2 sm:grid-cols-4">

                                                            {/* Payment ID */}
                                                            <div>
                                                                <p className="text-[10px] uppercase tracking-wide text-slate-400">
                                                                    Payment ID
                                                                </p>

                                                                <p className="mt-0.5 max-w-[180px] truncate text-xs font-semibold text-slate-700">
                                                                    {latestPayment?.payment_number || "-"}
                                                                </p>
                                                            </div>

                                                            {/* Payment Method */}
                                                            <div>
                                                                <p className="text-[10px] uppercase tracking-wide text-slate-400">
                                                                    Payment Method
                                                                </p>

                                                                <p className="mt-0.5 text-xs font-semibold capitalize text-slate-700">
                                                                    {latestPayment?.payment_method || "-"}
                                                                </p>
                                                            </div>

                                                            {/* Paid Amount */}
                                                            <div>
                                                                <p className="text-[10px] uppercase tracking-wide text-slate-400">
                                                                    Paid Amount
                                                                </p>

                                                                <p className="mt-0.5 text-xs font-semibold text-slate-700">
                                                                    {latestPayment?.paid_amount
                                                                        ? commonUtils.formatAmount(
                                                                            Number(latestPayment.paid_amount)
                                                                        )
                                                                        : "-"}
                                                                </p>
                                                            </div>

                                                            {/* Paid On */}
                                                            <div>
                                                                <p className="text-[10px] uppercase tracking-wide text-slate-400">
                                                                    Paid On
                                                                </p>

                                                                <p className="mt-0.5 text-xs font-semibold text-slate-700">
                                                                    {latestPayment?.paid_at
                                                                        ? commonUtils.formatDateTime(
                                                                            latestPayment.paid_at,
                                                                            "MMM DD, YYYY"
                                                                        )
                                                                        : "-"}
                                                                </p>
                                                            </div>

                                                        </div>
                                                    ) : (
                                                        <p className="text-xs text-slate-400">
                                                            Payment details not available.
                                                        </p>
                                                    )}

                                                    {/* Invoice */}
                                                    {rowItem?.invoice_file && (
                                                        <a
                                                            href={`${BACKEND_BASE_URL}/${rowItem.invoice_file}`}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            download
                                                            className="inline-flex shrink-0 items-center justify-center rounded-sm bg-primary px-4 py-2 text-xs font-semibold text-white transition hover:bg-[#8f0944]"
                                                        >
                                                            <Download className="mr-1.5 h-3.5 w-3.5" />
                                                            Download Invoice
                                                        </a>
                                                    )}

                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                        </div>

                        {!rows || !rows?.length && (
                            <div className="flex min-h-[420px] items-center justify-center rounded-xl border border-slate-200 bg-white p-8">
                                <div className="w-full max-w-md text-center">

                                    {/* Icon */}
                                    <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-[#FDF2F7]">
                                        <ShoppingBag className="h-10 w-10 text-primary" />
                                    </div>

                                    {/* Title */}
                                    <h2 className="text-xl font-bold text-slate-800">
                                        No Orders Yet
                                    </h2>

                                    {/* Description */}
                                    <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-500">
                                        You haven't placed any orders yet. Explore our services and
                                        start planning your memorable moments with Mukurtham.
                                    </p>

                                    {/* Action */}
                                    <Link
                                        href="/service-search"
                                        className="cursor-pointer mt-6 inline-flex items-center justify-center rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#8f0944]"
                                    >
                                        <Search className="mr-2 h-4 w-4" />
                                        Explore Services
                                    </Link>
                                </div>
                            </div>
                        )}

                    </div>
                </div>
            </main>

        </>
    );
}