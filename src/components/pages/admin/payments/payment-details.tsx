"use client";

import { Building2, CalendarDays, CreditCard, Download, IndianRupee, User, } from "lucide-react";
import { common as commonUtils } from "@/utils/common";
import { apiConfig } from "@/environments/api";


type Props = {
    selectedRow: any | null;
};

export function PaymentDetails({
    selectedRow,
}: Props) {
    const BACKEND_BASE_URL = apiConfig.baseUrl;

    return (
        <>
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
                                            {vendor?.name || "-"}
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-xs text-slate-400">
                                            Email
                                        </p>
                                        <p className="break-all text-sm text-slate-600">
                                            {vendor?.email || "-"}
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-xs text-slate-400">
                                            Mobile
                                        </p>
                                        <p className="text-sm text-slate-600">
                                            {vendor?.mobile || "-"}
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
                                            className="rounded-lg border border-indigo-100 bg-pink-50 px-3 py-2"
                                        >
                                            <p className="text-xs font-semibold text-pink-700">
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



                        <div className="grid grid-cols-1 gap-x-6 gap-y-3 sm:grid-cols-2">

                            {/* Payment Details */}
                            <div className="flex h-full flex-col overflow-hidden rounded-xl border border-slate-200 bg-white">
                                <div className="border-b border-slate-200 bg-slate-50 px-4 py-3">
                                    <div className="flex items-center gap-2">
                                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-100 text-purple-600">
                                            <CreditCard size={16} />
                                        </div>

                                        <h3 className="text-sm font-bold text-slate-800">
                                            Payment Details
                                        </h3>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 gap-x-6 gap-y-3 sm:grid-cols-2 p-4">
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
                                    <div className="flex justify-end mt-auto border-t border-slate-200 bg-purple-50 px-4 py-4">
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
                            <div className="flex h-full flex-col overflow-hidden rounded-xl border border-slate-200 bg-white">

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
                                <div className="mt-auto border-t border-slate-200 bg-purple-50 px-4 py-4">
                                    <div className="flex items-center justify-between gap-4">

                                        <div>
                                            <p className="text-sm font-bold text-slate-800">
                                                Total Paid
                                            </p>

                                            <p className="mt-0.5 text-xs text-slate-500">
                                                Final amount paid for this order
                                            </p>
                                        </div>

                                        <span className="text-xl font-bold text-primary">
                                            {payableAmount > 0 ? commonUtils.formatAmount(payableAmount) : "-"}
                                        </span>

                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            })()}
        </>
    );
}