"use client";

import { useEffect, useMemo, useState } from "react";
import { KeyRound, MapPin, ReceiptText, CreditCard, Wallet, Banknote, CircleDollarSign, IndianRupee, CalendarDays, } from "lucide-react";
import Loading from "@/components/common/loading/loading"
import { constants } from "@/utils/constants";
import { common as commonUtils } from "@/utils/common";
import { customerRoutes } from "@/services/api/customer.routes";
import { apiConfig } from "@/environments/api";
import { sweetalert } from "@/utils/sweetalert";
import { authUser } from "@/utils/auth";

import Script from "next/script";

const PAGE_SIZE = 100;

export default function AvailableRequestList() {
    const BACKEND_BASE_URL = apiConfig.baseUrl;

    const userProfile = authUser();

    const [loading, setLoading] = useState(false);
    const [rows, setRows] = useState<any[]>([]);
    const [page, setPage] = useState(1);


    useEffect(() => {
        fetchAvailableRequestList();
    }, [page]);


    const fetchAvailableRequestList = async () => {
        try {
            setLoading(true);
            const response = await customerRoutes.availableRequestList({
                page,
                limit: PAGE_SIZE,
            });
            const responseData = response.data;
            setRows(responseData?.rows ?? []);
        } finally {
            setLoading(false);
        }
    };

    const handlePayment = async (rowItem: any) => {
        try {
            const payableAmount = Number(rowItem?.payable_amount || 0);

            if (payableAmount <= 0) {
                await sweetalert.error('Payment amount is not available.');
                return;
            }
            if (!(window as any).Razorpay) {
                await sweetalert.error("Payment gateway is still loading. Please try again.");
                return;
            }

            const response = await customerRoutes.createServiceOrder({
                availability_request_id: rowItem.id,
            });
            const responseData = response?.data || {};
            const responseServiceOrder = responseData?.service_order;
            const responseRazorpayOrder = responseData?.razorpay_order;
            const razorpayKeyId = responseData?.key_id;

            if (!responseServiceOrder || !responseRazorpayOrder || !razorpayKeyId) {
                await sweetalert.error(response.message);
                return;
            }

            const options = {
                key: razorpayKeyId,
                amount: responseRazorpayOrder.amount,
                currency: responseRazorpayOrder.currency,
                order_id: responseRazorpayOrder.id,
                name: "Mukurtham",
                description: rowItem?.category_service?.service_name || "Service Payment",

                handler: async function (paymentResponse: any) {
                    await verifyPayment(paymentResponse, responseServiceOrder);
                },

                prefill: {
                    name: userProfile?.name || "",
                    email: userProfile?.email || "",
                    contact: userProfile?.mobile || "",
                },

                theme: {
                    color: "#AA0C51",
                },

                modal: {
                    ondismiss: function () {
                        console.log("Razorpay checkout closed");
                        sweetalert.warning("Payment was cancelled.");
                    },
                },
            };

            const Razorpay = (window as any).Razorpay;
            const razorpay = new Razorpay(options);

            razorpay.open();
        } catch (error: any) {
            console.error("Payment initialization error:", error);
            await sweetalert.error(error?.message || "Unable to initiate payment.");
        }
    }

    const verifyPayment = async (paymentResponse: any, orders: any) => {
        try {
            const response = await customerRoutes.verifyPayment({
                service_order_id: orders.id,
                razorpay_order_id: paymentResponse.razorpay_order_id,
                razorpay_payment_id: paymentResponse.razorpay_payment_id,
                razorpay_signature: paymentResponse.razorpay_signature,
            });

            if (response?.success && response?.data?.verified) {
                await sweetalert.success(response.message || 'Your payment has been completed successfully.');

                // Refresh list after successful payment
                await fetchAvailableRequestList();
                return;
            } else {
                await sweetalert.error('Payment Failed', response?.message || 'Your payment has failed.');
            }
        } catch (error) {
            console.error("Payment verification error:", error);
            await sweetalert.error('Payment Error', 'Unable to verify the payment.');
        }
    }

    return (
        <>
            <main className="mx-auto max-w-screen-2xl space-y-12 px-4 py-6 sm:px-6 lg:px-8">
                <div className="d-block">
                    {/* <div className="mb-6 ml-1">
                    <h1 className="text-xl font-semibold leading-tight text-slate-800">
                        Check Availability Requests
                    </h1>
                </div> */}
                    <div className="min-h-full rounded-xl border border-primary/10 bg-white px-4 py-4 shadow-sm">
                        {loading && (
                            <Loading />
                        )}

                        <div className="mb-6 ml-1">
                            <div className="flex items-center gap-3">
                                {/* Icon */}
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                                    <Wallet className="h-5 w-5 text-primary" />
                                </div>

                                {/* Title */}
                                <div>
                                    <h1 className="text-xl font-semibold leading-tight text-slate-800">
                                        Check Availability Requests
                                    </h1>
                                </div>
                            </div>

                            {/* Accent line */}
                            <div className="mt-5 w-full border border-gray-100" />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-5">
                            {rows && rows.length > 0 && (
                                rows.map((rowItem, index) => (
                                    <div key={`available-request-${rowItem.id ?? index}`} className="md:col-span-3">
                                        <div className="rounded-xl border border-gray-200 shadow-md">

                                            {/* <div className="group overflow-hidden rounded-t-xl">
                                            <img
                                                src={rowItem?.category_service?.service_banner_image ? `${BACKEND_BASE_URL}/${rowItem.category_service.service_banner_image}` : undefined}
                                                alt={rowItem?.category_service?.service_name || ""}
                                                className="h-28 w-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-110 group-hover:opacity-90"
                                            />
                                        </div> */}

                                            {/* Service Details */}
                                            <div className="p-4">
                                                <h3 className="truncate text-base font-bold text-slate-900 sm:text-lg">
                                                    {rowItem?.category_service?.service_name}
                                                </h3>

                                                <div className="mt-1 flex items-center gap-1.5 text-sm text-slate-500">
                                                    <MapPin className="h-4 w-4 shrink-0" />
                                                    <span className="truncate">
                                                        {rowItem?.category_service?.service_address}
                                                    </span>
                                                </div>
                                            </div>



                                            {/* Requested Dates */}
                                            {Array.isArray(rowItem?.dates) && rowItem.dates.length > 0 && (
                                                <div className="border-t border-slate-200 bg-white px-4 py-3">
                                                    <div className="mb-2 flex items-center gap-2">
                                                        <CalendarDays className="h-4 w-4 text-primary" />

                                                        <h4 className="text-sm font-semibold text-slate-800">
                                                            Requested Dates
                                                        </h4>
                                                    </div>

                                                    <div className="flex flex-wrap gap-2">
                                                        {rowItem.dates.map((dateItem: any, dateIndex: number) => (
                                                            <div
                                                                key={`request-date-${rowItem.id}-${dateIndex}`}
                                                                className="rounded-lg border border-primary/20 bg-primary/5 px-2 py-1"
                                                            >
                                                                <p className="text-sm font-semibold text-primary">
                                                                    {commonUtils.formatDateTime(dateItem?.service_date, "MMM DD, YYYY")}
                                                                </p>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            {/* Payment Details */}
                                            <div className="mt-5 border border-slate-200 bg-white">
                                                <div className="border-b border-slate-100 bg-slate-50 px-4 py-3">
                                                    <div className="flex items-center gap-2">
                                                        <ReceiptText className="h-4 w-4 text-indigo-600" />
                                                        <h3 className="text-sm font-semibold text-slate-800">
                                                            Payment Details
                                                        </h3>
                                                    </div>
                                                </div>

                                                <div className="divide-y divide-slate-100">
                                                    {/* Amount */}
                                                    <div className="flex items-center justify-between gap-4 px-4 py-3">
                                                        <span className="text-sm text-slate-500">
                                                            Amount
                                                        </span>

                                                        <span className="inline-flex items-center gap-0.5 text-sm font-semibold text-slate-800">
                                                            {rowItem?.service_amount && rowItem?.service_amount > 0 ? commonUtils.formatAmount(rowItem.service_amount) : "-"}
                                                        </span>
                                                    </div>

                                                    {/* Discount */}
                                                    <div className="flex items-center justify-between gap-4 px-4 py-3">
                                                        <span className="text-sm text-slate-500">
                                                            Discount Amount
                                                        </span>

                                                        <span className="inline-flex items-center gap-0.5 text-sm font-semibold text-emerald-600">
                                                            {rowItem?.discount_amount && rowItem.discount_amount > 0 ? (
                                                                <>
                                                                    {commonUtils.formatAmount(rowItem.discount_amount)}
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
                                                            {rowItem?.service_amount && rowItem.service_amount > 0
                                                                ? (
                                                                    commonUtils.formatAmount(rowItem.service_amount - (rowItem.discount_amount || 0))
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
                                                            {rowItem?.tax_percentage && rowItem.tax_percentage > 0 ? `${rowItem.tax_percentage}%` : "-"}
                                                        </span>
                                                    </div>

                                                    {/* Tax Amount */}
                                                    <div className="flex items-center justify-between gap-4 px-4 py-3">
                                                        <span className="text-sm text-slate-500">
                                                            Tax Amount
                                                        </span>

                                                        <span className="inline-flex items-center gap-0.5 text-sm font-semibold text-slate-800">
                                                            {rowItem?.tax_amount && rowItem.tax_amount > 0 ? (
                                                                <>
                                                                    {commonUtils.formatAmount(rowItem.tax_amount)}
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
                                                            {rowItem?.payable_amount && rowItem.payable_amount > 0 ? commonUtils.formatAmount(rowItem.payable_amount) : "-"}
                                                        </span>
                                                    </div>
                                                </div>

                                                <div>
                                                    {rowItem?.status == 'enabled' ? (
                                                        <button
                                                            className={`w-full mt-5 ${constants.buttonClass}`}
                                                            onClick={() => handlePayment(rowItem)}
                                                        >
                                                            <IndianRupee className="mr-1 inline-block h-4 w-4" />
                                                            Pay Now
                                                        </button>
                                                    ) : (
                                                        <button className={`w-full mt-5 ${constants.buttonClassGray}`}>Waiting for Confirm</button>
                                                    )
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                    </div>
                </div>
            </main>

            <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="afterInteractive" />
        </>
    );
}