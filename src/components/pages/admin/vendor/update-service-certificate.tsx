
"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { sweetalert } from "@/utils/sweetalert";
import { constants } from "@/utils/constants";
import { adminRoutes } from "@/services/api/admin.routes";
import { apiConfig } from "@/environments/api";
import { ChevronRight } from "lucide-react";
import { userRoutes } from "@/services/api/users.routes";

type CertificateForm = {
    category_service_id: string;
    verification: {
        aadhar: "verified" | "pending";
        pan: "verified" | "pending";
        gst: "verified" | "pending";
        bank: "verified" | "pending";
    };
};


export default function UpdateServiceCertificate() {
    const searchParams = useSearchParams();
    const vendorId = searchParams.get("vendorId");
    const categoryServiceId = searchParams.get("serviceId");

    const initialForm: CertificateForm = {
        category_service_id: String(categoryServiceId),
        verification: {
            aadhar: "pending",
            pan: "pending",
            gst: "pending",
            bank: "pending",
        },
    };

    const [form, setForm] = useState<CertificateForm>(initialForm);
    const [loading, setLoading] = useState(false);
    const buttonClassSubmit = constants.buttonClassSubmit;
    const [vendorProfileData, setVendorProfileData] = useState<any>(null);
    const [categoryServiceData, setCategoryServiceData] = useState<any>(null);
    const [certificateData, setCertificateData] = useState<any>(null);
    const BACKEND_BASE_URL = apiConfig.baseUrl;

    const [docPreviews, setDocPreviews] = useState<{
        aadhar: { url: string; type: "image" | "pdf" } | null;
        pan: { url: string; type: "image" | "pdf" } | null;
        gst: { url: string; type: "image" | "pdf" } | null;
        bank: { url: string; type: "image" | "pdf" } | null;
    }>({
        aadhar: null,
        pan: null,
        gst: null,
        bank: null,
    });

    useEffect(() => {
        if (vendorId) {
            getVendorProfile();
        }
    }, [vendorId]);

    useEffect(() => {
        if (categoryServiceId) {
            getCategoryService();
            getServiceCertificate();
        }
    }, [categoryServiceId]);



    const getVendorProfile = async () => {
        const response = await userRoutes.getUser({
            vendor_id: vendorId ?? undefined,
        });
        setVendorProfileData(response?.data ?? null);
    };

    const getCategoryService = async () => {
        const response = await adminRoutes.getCategoryService({
            id: categoryServiceId ?? undefined,
        });
        setCategoryServiceData(response?.data ?? null);
    };

    const getServiceCertificate = async () => {

        try {
            if (!categoryServiceId) {
                return;
            }

            const result = await adminRoutes.getServiceCertificate({ category_service_id: Number(categoryServiceId) });

            if (!result?.success) {
                return;
            }

            const resultData = result.data;

            if (!resultData) {
                return;
            }

            setCertificateData(resultData);

            setForm({
                category_service_id: resultData.category_service_id ?? "",
                verification: resultData.verification ?? "",
            });

            //Image or Pdf Previews
            setDocPreviews({
                aadhar: resultData.aadhar_doc
                    ? {
                        url: `${BACKEND_BASE_URL}/${resultData.aadhar_doc}`,
                        type: resultData.aadhar_doc.toLowerCase().endsWith(".pdf")
                            ? "pdf"
                            : "image",
                    }
                    : null,

                pan: resultData.pan_doc
                    ? {
                        url: `${BACKEND_BASE_URL}/${resultData.pan_doc}`,
                        type: resultData.pan_doc.toLowerCase().endsWith(".pdf")
                            ? "pdf"
                            : "image",
                    }
                    : null,

                gst: resultData.gst_doc
                    ? {
                        url: `${BACKEND_BASE_URL}/${resultData.gst_doc}`,
                        type: resultData.gst_doc.toLowerCase().endsWith(".pdf")
                            ? "pdf"
                            : "image",
                    }
                    : null,

                bank: resultData.bank_doc
                    ? {
                        url: `${BACKEND_BASE_URL}/${resultData.bank_doc}`,
                        type: resultData.bank_doc.toLowerCase().endsWith(".pdf")
                            ? "pdf"
                            : "image",
                    }
                    : null,
            });

            console.log("Service Certificate Data:", resultData);

        } catch (caughtError) {
            console.error("Failed to load service certificate:", caughtError);
        } finally {
        }
    };



    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        if (!form.category_service_id) {
            sweetalert.toastError("Category Service Id is required");
            return;
        }

        setLoading(true);
        try {
            const result = await adminRoutes.updateServiceCertificate(form);
            if (result?.success) {
                await sweetalert.success(result.message);
            }
        } catch (caughtError) {
            console.error("Update service certificate failed:", caughtError);
        } finally {
            setLoading(false);
        }
    }

    const updateVerification = (
        field: keyof CertificateForm["verification"],
        checked: boolean
    ) => {
        setForm((prev) => ({
            ...prev,
            verification: {
                ...prev.verification,
                [field]: checked ? "verified" : "pending",
            },
        }));
    };

    return (
        <div className="d-block">
            <div className="mb-6 ml-1 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <span className="text-2xl font-semibold leading-none text-slate-600">
                        Certificates
                    </span>

                    <ChevronRight className="h-5 w-5 shrink-0 text-slate-400 mt-2" />
                    <Link href={`/panel/vendor-list`} className="text-base font-medium leading-none text-primary mt-2"> {vendorProfileData?.name ?? ""} </Link>
                    <ChevronRight className="h-5 w-5 shrink-0 text-slate-400 mt-2" />
                    <Link href={`/panel/vendor-business-list?vendorId=${vendorId}`} className="text-base font-medium leading-none text-primary mt-2"> {categoryServiceData?.service_name ?? ""} </Link>
                </div>
            </div>

            <div className="min-h-full px-4 py-4 rounded-xl border border-primary/10 bg-white shadow-sm">
                <form onSubmit={handleSubmit} autoComplete="off">
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-5">
                        <div className="md:col-span-4 mb-10">
                            <label htmlFor="aadharNumber" className="mb-2 block text-sm font-medium text-gray-700">
                                Aadhar Number
                            </label>
                            <span className="mb-2 text-sm font-bold text-gray-700">{certificateData?.aadhar_number ?? ''}</span>
                        </div>
                        <div className="md:col-span-4 mb-10">
                            <label htmlFor="aadharDoc" className="mb-2 block text-sm font-medium text-gray-700">
                                Aadhar Document
                            </label>
                            {docPreviews.aadhar && (
                                <div className="mt-4">
                                    {docPreviews.aadhar.type === "image" ? (
                                        <Link href={docPreviews.aadhar.url} target="_blank" rel="noopener noreferrer">
                                            <img src={docPreviews.aadhar.url} alt="Aadhar Document" className="h-32 w-52 rounded-xl object-cover shadow-md" />
                                        </Link>
                                    ) : (
                                        <a href={docPreviews.aadhar.url} target="_blank" rel="noopener noreferrer" className="text-sm font-semibold text-primary hover:underline"                                         >                                             View Aadhar PDF                                         </a>
                                    )}
                                </div>
                            )}
                            {!docPreviews.aadhar && (
                                <div className="mt-4 text-sm text-slate-400">
                                    No Aadhar document uploaded
                                </div>
                            )}
                        </div>
                        <div className="md:col-span-3 mb-10">
                            <div className="flex">
                                <label
                                    key={`aadhar-verified-1`}
                                    className="flex items-center space-x-2 cursor-pointer"
                                >
                                    <input
                                        type="checkbox"
                                        className="rounded accent-primary cursor-pointer h-5 w-5"
                                        checked={form.verification.aadhar === "verified"}
                                        onChange={(e) =>
                                            updateVerification("aadhar", e.target.checked)
                                        }
                                    />
                                    {form.verification.aadhar === 'verified' ? (
                                        <span className="text-sm font-medium text-green-700">
                                            Verified
                                        </span>
                                    ) : (
                                        <span className="text-sm font-medium text-red-700">
                                            Not Verified
                                        </span>
                                    )}
                                </label>
                            </div>
                        </div>


                        <div className="md:col-span-4 mb-10">
                            <label htmlFor="panNumber" className="mb-2 block text-sm font-medium text-gray-700">
                                PAN
                            </label>
                            <span className="mb-2 text-sm font-bold text-gray-700">{certificateData?.pan_number ?? ''}</span>
                        </div>
                        <div className="md:col-span-4 mb-10">
                            <label htmlFor="panDoc" className="mb-2 block text-sm font-medium text-gray-700">
                                PAN Document
                            </label>
                            {docPreviews.pan && (
                                <div className="mt-4">
                                    {docPreviews.pan.type === "image" ? (
                                        <Link href={docPreviews.pan.url} target="_blank" rel="noopener noreferrer">
                                            <img src={docPreviews.pan.url} alt="PAN Document" className="h-32 w-52 rounded-xl object-cover shadow-md" />
                                        </Link>
                                    ) : (
                                        <a href={docPreviews.pan.url} target="_blank" rel="noopener noreferrer" className="text-sm font-semibold text-primary hover:underline"                                         >                                             View PAN PDF                                         </a>
                                    )}
                                </div>
                            )}
                            {!docPreviews.pan && (
                                <div className="mt-4 text-sm text-slate-400">
                                    No PAN document uploaded
                                </div>
                            )}
                        </div>
                        <div className="md:col-span-3 mb-10">
                            <div className="flex">
                                <label
                                    key={`pan-verified-1`}
                                    className="flex items-center space-x-2 cursor-pointer"
                                >
                                    <input
                                        type="checkbox"
                                        className="rounded accent-primary cursor-pointer h-5 w-5"
                                        checked={form.verification.pan === "verified"}
                                        onChange={(e) =>
                                            updateVerification("pan", e.target.checked)
                                        }
                                    />
                                    {form.verification.pan === 'verified' ? (
                                        <span className="text-sm font-medium text-green-700">
                                            Verified
                                        </span>
                                    ) : (
                                        <span className="text-sm font-medium text-red-700">
                                            Not Verified
                                        </span>
                                    )}
                                </label>
                            </div>
                        </div>

                        <div className="md:col-span-4 mb-10">
                            <label htmlFor="gstNumber" className="mb-2 block text-sm font-medium text-gray-700">
                                GST Number
                            </label>
                            <span className="mb-2 text-sm font-bold text-gray-700">{certificateData?.gst_number ?? ''}</span>
                        </div>
                        <div className="md:col-span-4 mb-10">
                            <label htmlFor="gstDoc" className="mb-2 block text-sm font-medium text-gray-700">
                                GST Document
                            </label>
                            {docPreviews.gst && (
                                <div className="mt-4">
                                    {docPreviews.gst.type === "image" ? (
                                        <Link href={docPreviews.gst.url} target="_blank" rel="noopener noreferrer">
                                            <img src={docPreviews.gst.url} alt="GST Document" className="h-32 w-52 rounded-xl object-cover shadow-md" />
                                        </Link>
                                    ) : (
                                        <a href={docPreviews.gst.url} target="_blank" rel="noopener noreferrer" className="text-sm font-semibold text-primary hover:underline"                                         >                                             View GST PDF                                         </a>
                                    )}
                                </div>
                            )}
                            {!docPreviews.gst && (
                                <div className="mt-4 text-sm text-slate-400">
                                    No GST document uploaded
                                </div>
                            )}
                        </div>
                        <div className="md:col-span-3 mb-10">
                            <div className="flex">
                                <label
                                    key={`gst-verified-1`}
                                    className="flex items-center space-x-2 cursor-pointer"
                                >
                                    <input
                                        type="checkbox"
                                        className="rounded accent-primary cursor-pointer h-5 w-5"
                                        checked={form.verification.gst === "verified"}
                                        onChange={(e) =>
                                            updateVerification("gst", e.target.checked)
                                        }
                                    />
                                    {form.verification.gst === 'verified' ? (
                                        <span className="text-sm font-medium text-green-700">
                                            Verified
                                        </span>
                                    ) : (
                                        <span className="text-sm font-medium text-red-700">
                                            Not Verified
                                        </span>
                                    )}
                                </label>
                            </div>
                        </div>

                        <div className="md:col-span-4 mb-10">
                            <label htmlFor="bankDetails" className="mb-2 block text-sm font-medium text-gray-700">
                                Bank Details
                            </label>
                            <span className="mb-2 text-sm font-bold text-gray-700">{certificateData?.bank_details ?? ''}</span>
                        </div>
                        <div className="md:col-span-4 mb-10">
                            <label htmlFor="bankDoc" className="mb-2 block text-sm font-medium text-gray-700">
                                Bank Document
                            </label>
                            {docPreviews.bank && (
                                <div className="mt-4">
                                    {docPreviews.bank.type === "image" ? (
                                        <Link href={docPreviews.bank.url} target="_blank" rel="noopener noreferrer">
                                            <img src={docPreviews.bank.url} alt="Bank Document" className="h-32 w-52 rounded-xl object-cover shadow-md" />
                                        </Link>
                                    ) : (
                                        <a href={docPreviews.bank.url} target="_blank" rel="noopener noreferrer" className="text-sm font-semibold text-primary hover:underline"                                         >                                             View Bank PDF                                         </a>
                                    )}
                                </div>
                            )}
                            {!docPreviews.bank && (
                                <div className="mt-4 text-sm text-slate-400">
                                    No Bank document uploaded
                                </div>
                            )}
                        </div>
                        <div className="md:col-span-3 mb-10">
                            <div className="flex">
                                <label
                                    key={`bank-verified-1`}
                                    className="flex items-center space-x-2 cursor-pointer"
                                >
                                    <input
                                        type="checkbox"
                                        className="rounded accent-primary cursor-pointer h-5 w-5"
                                        checked={form.verification.bank === "verified"}
                                        onChange={(e) =>
                                            updateVerification("bank", e.target.checked)
                                        }
                                    />
                                    {form.verification.bank === 'verified' ? (
                                        <span className="text-sm font-medium text-green-700">
                                            Verified
                                        </span>
                                    ) : (
                                        <span className="text-sm font-medium text-red-700">
                                            Not Verified
                                        </span>
                                    )}
                                </label>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-5">
                        <div className="md:col-span-12 flex justify-end">
                            <button
                                type="submit"
                                className={buttonClassSubmit}
                                disabled={loading}
                            >
                                {loading ? "Saving..." : "Save"}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}