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
                                            className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                                        >
                                            {/* Order Header */}
                                            <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-5 py-3">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-sm font-semibold text-slate-700">
                                                        Order
                                                    </span>

                                                    <span className="text-sm font-bold text-indigo-600">
                                                        {rowItem?.order_number || "-"}
                                                    </span>
                                                </div>

                                                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                                                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                                                    Paid
                                                </span>
                                            </div>

                                            {/* 3 Columns */}
                                            <div className="grid grid-cols-1 divide-y divide-slate-200 lg:grid-cols-3 lg:divide-x lg:divide-y-0">

                                                {/* LEFT - SERVICE DETAILS */}
                                                <div className="p-3">
                                                    <div className="overflow-hidden rounded-xl">
                                                        <img
                                                            src={
                                                                categoryService?.service_banner_image
                                                                    ? `${BACKEND_BASE_URL}/${categoryService.service_banner_image}`
                                                                    : undefined
                                                            }
                                                            alt=""
                                                            className="h-28 w-full object-cover transition-transform duration-500 hover:scale-105"
                                                        />
                                                    </div>

                                                    <div className="mt-3">
                                                        <h3 className="text-lg font-bold text-slate-900">
                                                            {categoryService?.service_name || "Service"}
                                                        </h3>

                                                        {categoryService?.service_address && (
                                                            <div className="mt-2 flex items-start gap-2 text-sm text-slate-500">
                                                                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />

                                                                <span>
                                                                    {categoryService.service_address}
                                                                </span>
                                                            </div>
                                                        )}

                                                        {rowItem?.created_at && (
                                                            <div className="mt-2 flex items-center gap-2 text-xs text-slate-400">
                                                                <Clock3 className="h-3.5 w-3.5" />

                                                                <span>
                                                                    Ordered on{" "}
                                                                    {commonUtils.formatDateTime(
                                                                        rowItem.created_at,
                                                                        "MMM DD, YYYY"
                                                                    )}
                                                                </span>
                                                            </div>
                                                        )}
                                                    </div>

                                                    {/* Booking Dates */}
                                                    {serviceDates.length > 0 && (
                                                        <div className="mt-3 rounded-xl border border-primary/15 bg-primary/5 p-4">
                                                            <div className="mb-3 flex items-center gap-2">
                                                                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                                                                    <CalendarDays className="h-4 w-4 text-primary" />
                                                                </div>

                                                                <div>
                                                                    <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                                                                        Booking Dates
                                                                    </p>

                                                                    {/* <p className="text-sm font-semibold text-slate-800">
                                                                        Service Schedule
                                                                    </p> */}
                                                                </div>
                                                            </div>

                                                            <div className="flex flex-wrap gap-2">
                                                                {serviceDates.map((dateItem: any, dateIndex: number) => (
                                                                    <div
                                                                        key={`request-date-${rowItem.id}-${dateIndex}`}
                                                                        className="rounded-lg border border-primary/15 bg-white px-3 py-2"
                                                                    >
                                                                        <p className="text-xs font-semibold text-primary">
                                                                            {commonUtils.formatDateTime(
                                                                                dateItem?.service_date,
                                                                                "MMM DD, YYYY"
                                                                            )}
                                                                        </p>
                                                                    </div>
                                                                )
                                                                )}
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>

                                                {/* CENTER - PAYMENT SUMMARY */}
                                                <div className="p-3">
                                                    <div className="mb-3 flex items-center gap-2">
                                                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-50">
                                                            <ReceiptText className="h-5 w-5 text-indigo-600" />
                                                        </div>

                                                        <div>
                                                            {/* <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                                                                Payment
                                                            </p> */}

                                                            <h3 className="text-sm font-bold text-slate-800">
                                                                Payment Summary
                                                            </h3>
                                                        </div>
                                                    </div>

                                                    <div className="overflow-hidden rounded-xl border border-slate-200">
                                                        <div className="divide-y divide-slate-100">

                                                            {/* Service Amount */}
                                                            <div className="flex items-center justify-between px-4 py-3">
                                                                <span className="text-sm text-slate-500">
                                                                    Service Amount
                                                                </span>

                                                                <span className="text-sm font-semibold text-slate-800">
                                                                    {serviceAmount > 0
                                                                        ? commonUtils.formatAmount(
                                                                            serviceAmount
                                                                        )
                                                                        : "-"}
                                                                </span>
                                                            </div>

                                                            {/* Discount */}
                                                            {discountAmount > 0 && (
                                                                <div className="flex items-center justify-between px-4 py-3">
                                                                    <span className="text-sm text-slate-500">
                                                                        Discount
                                                                    </span>

                                                                    <span className="text-sm font-semibold text-emerald-600">
                                                                        -
                                                                        {commonUtils.formatAmount(
                                                                            discountAmount
                                                                        )}
                                                                    </span>
                                                                </div>
                                                            )}

                                                            {/* Net Amount */}
                                                            <div className="flex items-center justify-between bg-slate-50/70 px-4 py-3">
                                                                <span className="text-sm font-medium text-slate-600">
                                                                    Net Amount
                                                                </span>

                                                                <span className="text-sm font-bold text-slate-800">
                                                                    {serviceAmount > 0
                                                                        ? commonUtils.formatAmount(
                                                                            serviceAmount -
                                                                            discountAmount
                                                                        )
                                                                        : "-"}
                                                                </span>
                                                            </div>

                                                            {/* Tax */}
                                                            <div className="flex items-center justify-between px-4 py-3">
                                                                <span className="text-sm text-slate-500">
                                                                    Tax
                                                                    {Number(
                                                                        availabilityRequest?.tax_percentage ||
                                                                        0
                                                                    ) > 0 && (
                                                                            <span className="ml-1 text-xs text-slate-400">
                                                                                (
                                                                                {
                                                                                    availabilityRequest.tax_percentage
                                                                                }
                                                                                %)
                                                                            </span>
                                                                        )}
                                                                </span>

                                                                <span className="text-sm font-semibold text-slate-800">
                                                                    {taxAmount > 0
                                                                        ? commonUtils.formatAmount(
                                                                            taxAmount
                                                                        )
                                                                        : "-"}
                                                                </span>
                                                            </div>
                                                        </div>

                                                        {/* Total */}
                                                        <div className="border-t border-indigo-100 bg-indigo-50 px-4 py-5">
                                                            <div className="flex items-center justify-between">
                                                                <div>
                                                                    <p className="text-xs font-semibold uppercase tracking-wide text-indigo-500">
                                                                        Total Paid
                                                                    </p>

                                                                    <p className="mt-1 text-xs text-slate-500">
                                                                        Payment completed
                                                                    </p>
                                                                </div>

                                                                <span className="text-2xl font-bold text-indigo-700">
                                                                    {payableAmount > 0
                                                                        ? commonUtils.formatAmount(
                                                                            payableAmount
                                                                        )
                                                                        : "-"}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* RIGHT - PAYMENT DETAILS */}
                                                <div className="flex flex-col p-3">
                                                    <div className="mb-3 flex items-center gap-2">
                                                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-50">
                                                            <ReceiptText className="h-5 w-5 text-emerald-600" />
                                                        </div>

                                                        <div>
                                                            {/* <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                                                                Transaction
                                                            </p> */}

                                                            <h3 className="text-sm font-bold text-slate-800">
                                                                Transaction Details
                                                            </h3>
                                                        </div>
                                                    </div>

                                                    {latestPayment ? (
                                                        <div className="rounded-xl border border-slate-200 bg-slate-50">
                                                            <div className="divide-y divide-slate-200">
                                                                {/* Payment ID */}
                                                                <div className="flex items-center justify-between px-4 py-3">
                                                                    <span className="text-sm text-slate-500">
                                                                        Payment ID
                                                                    </span>

                                                                    <span className="text-sm font-semibold text-slate-800">
                                                                        {latestPayment?.payment_number || "-"}
                                                                    </span>
                                                                </div>

                                                                {/* Payment Method */}
                                                                <div className="flex items-center justify-between px-4 py-3">
                                                                    <span className="text-sm text-slate-500">
                                                                        Payment Method
                                                                    </span>

                                                                    <span className="text-sm font-semibold text-slate-800 capitalize">
                                                                        {latestPayment?.payment_method || "-"}
                                                                    </span>
                                                                </div>

                                                                {/* Paid Amount */}
                                                                <div className="flex items-center justify-between px-4 py-3">
                                                                    <span className="text-sm text-slate-500">
                                                                        Paid Amount
                                                                    </span>

                                                                    <span className="text-sm font-semibold text-slate-800 capitalize">
                                                                        {latestPayment?.paid_amount ? commonUtils.formatAmount(Number(latestPayment.paid_amount)) : "-"}
                                                                    </span>
                                                                </div>

                                                                {/* Paid On */}
                                                                <div className="flex items-center justify-between px-4 py-3">
                                                                    <span className="text-sm text-slate-500">
                                                                        Paid On
                                                                    </span>

                                                                    <span className="text-sm font-semibold text-slate-800 capitalize">
                                                                        {latestPayment?.paid_at ? commonUtils.formatDateTime(latestPayment.paid_at, "MMM DD, YYYY") : "-"}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <div className="rounded-xl border border-slate-200 bg-slate-50 p-5 text-center text-sm text-slate-400">
                                                            Payment details not available.
                                                        </div>
                                                    )}

                                                    {/* Invoice Button */}
                                                    <div className="mt-auto">
                                                        <a
                                                            href={`${BACKEND_BASE_URL}/${rowItem.invoice_file}`}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            download
                                                        >
                                                            <button
                                                                type="button"
                                                                className={`w-full ${constants.buttonClassDarkGreen}`}
                                                            >
                                                                <Download className="mr-2 inline-block h-4 w-4" />
                                                                Download Invoice
                                                            </button>
                                                        </a>
                                                    </div>
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
                                        <ShoppingBag className="h-10 w-10 text-[#AA0C51]" />
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
                                        className="cursor-pointer mt-6 inline-flex items-center justify-center rounded-lg bg-[#AA0C51] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#8f0944]"
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