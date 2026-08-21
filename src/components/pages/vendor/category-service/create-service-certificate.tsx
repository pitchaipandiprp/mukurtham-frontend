
"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { sweetalert } from "@/utils/sweetalert";
import { constants } from "@/utils/constants";
import { vendorRoutes } from "@/services/api/vendor.routes";
import { apiConfig } from "@/environments/api";
import { ChevronRight } from "lucide-react";

type CertificateForm = {
    category_service_id: string;
    aadhar_number: string;
    pan_number: string;
    gst_number: string;
    bank_details: string;
    aadhar_doc: string;
    pan_doc: string;
    gst_doc: string;
    bank_doc: string;
    status: string;
};


export default function CreateServiceCertificate() {
    const searchParams = useSearchParams();
    const categoryServiceId = searchParams.get("serviceId");

    const initialForm: CertificateForm = {
        category_service_id: String(categoryServiceId),
        aadhar_number: "",
        pan_number: "",
        gst_number: "",
        bank_details: "",
        aadhar_doc: "",
        pan_doc: "",
        gst_doc: "",
        bank_doc: "",
        status: "1",
    };

    const router = useRouter();
    const [form, setForm] = useState<CertificateForm>(initialForm);
    const [loading, setLoading] = useState(false);
    const inputClass = constants.inputClass;
    const buttonClass = constants.buttonClass;
    const buttonClassSubmit = constants.buttonClassSubmit;
    const [categoryServiceData, setCategoryServiceData] = useState<any>(null);
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
        if (categoryServiceId) {
            getCategoryService();
            getServiceCertificate();
        }
    }, [categoryServiceId]);



    const getCategoryService = async () => {
        const response = await vendorRoutes.getCategoryService({
            id: categoryServiceId ?? undefined,
        });
        setCategoryServiceData(response?.data ?? null);
    };

    const getServiceCertificate = async () => {

        try {
            if (!categoryServiceId) {
                return;
            }

            const result = await vendorRoutes.getServiceCertificate({ category_service_id: Number(categoryServiceId) });

            if (!result?.success) {
                return;
            }

            const resultData = result.data;

            if (!resultData) {
                return;
            }

            setForm({
                category_service_id: resultData.category_service_id ?? "",
                aadhar_number: resultData.aadhar_number ?? "",
                pan_number: resultData.pan_number ?? "",
                gst_number: resultData.gst_number ?? "",
                bank_details: resultData.bank_details ?? "",
                aadhar_doc: resultData.aadhar_doc ?? "",
                pan_doc: resultData.pan_doc ?? "",
                gst_doc: resultData.gst_doc ?? "",
                bank_doc: resultData.bank_doc ?? "",
                status: resultData.status,
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

    const handleAadharChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        const digits = value.replace(/\D/g, "").slice(0, 12);
        const formatted = digits.replace(/(\d{4})(?=\d)/g, "$1 ");
        updateField("aadhar_number", formatted);
    };
    const handlePanChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value
            .toUpperCase()
            .replace(/[^A-Z0-9]/g, "")
            .slice(0, 10);

        updateField("pan_number", value);
    };
    const handleGstChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value
            .toUpperCase()
            .replace(/[^A-Z0-9]/g, "")
            .slice(0, 15);

        updateField("gst_number", value);
    };

    const handleDocumentChange = (
        event: React.ChangeEvent<HTMLInputElement>,
        documentType: "aadhar" | "pan" | "gst" | "bank"
    ) => {
        const file = event.target.files?.[0];

        if (!file) {
            return;
        }

        const allowedTypes = [
            "image/jpeg",
            "image/jpg",
            "image/png",
            "image/webp",
            "application/pdf",
        ];

        if (!allowedTypes.includes(file.type)) {
            sweetalert.toastError("Please select a valid image or PDF file");
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            sweetalert.toastError("File must be less than 5MB");
            return;
        }

        const previewUrl = URL.createObjectURL(file);

        setForm((prev: any) => ({
            ...prev,
            [`${documentType}_doc`]: file,
        }));

        setDocPreviews((prev) => ({
            ...prev,
            [documentType]: {
                url: previewUrl,
                type: file.type === "application/pdf" ? "pdf" : "image",
            },
        }));
    };

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        if (!form.category_service_id) {
            sweetalert.toastError("Category Service is required");
            return;
        }

        const aadharRegex = /^(?=(?:.*\d){12})[0-9 ]+$/;
        if (!form.aadhar_number.trim()) {
            sweetalert.toastError("Please enter the Aadhaar number");
            return;
        }
        if (!aadharRegex.test(form.aadhar_number.trim())) {
            sweetalert.toastError("Please enter a valid 12-digit Aadhaar number");
            return;
        }
        if (!form.aadhar_doc) {
            sweetalert.toastError("Please upload the Aadhaar document");
            return;
        }

        const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]$/;
        if (form.pan_number.trim() && !panRegex.test(form.pan_number.trim().toUpperCase())) {
            sweetalert.toastError("Please enter a valid PAN number");
            return;
        }

        const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][1-9A-Z]Z[0-9A-Z]$/;
        if (form.gst_number.trim() && !gstRegex.test(form.gst_number.trim().toUpperCase())) {
            sweetalert.toastError("Please enter a valid GST number");
            return;
        }


        setLoading(true);

        //Create a FormData object to send the data as multipart/form-data
        const formData = new FormData();

        formData.append("category_service_id", form.category_service_id);
        formData.append("aadhar_number", form.aadhar_number);
        formData.append("pan_number", form.pan_number);
        formData.append("gst_number", form.gst_number);
        formData.append("bank_details", form.bank_details);

        if (form.aadhar_doc) {
            formData.append("aadhar_doc", form.aadhar_doc);
        }
        if (form.pan_doc) {
            formData.append("pan_doc", form.pan_doc);
        }
        if (form.gst_doc) {
            formData.append("gst_doc", form.gst_doc);
        }
        if (form.bank_doc) {
            formData.append("bank_doc", form.bank_doc);
        }

        formData.append("status", form.status);


        try {
            const result = await vendorRoutes.createServiceCertificate(formData);
            if (result?.success) {
                await sweetalert.success(result.message);
            }
        } catch (caughtError) {
            console.error("Create service certificate failed:", caughtError);
        } finally {
            setLoading(false);
        }
    }

    const updateField = (field: keyof CertificateForm, value: string) => {
        setForm((prev) => ({
            ...prev,
            [field]: value,
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

                    <Link href={`/panel/category-service-list`} className="text-base font-medium leading-none text-primary mt-2"> {categoryServiceData?.service_name ?? ""} </Link>
                </div>
            </div>

            <div className="min-h-full px-4 py-4 rounded-xl border border-primary/10 bg-white shadow-sm">
                <form onSubmit={handleSubmit} autoComplete="off">
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-5">
                        <div className="md:col-span-4 mb-10">
                            <label htmlFor="aadharNumber" className="mb-2 block text-sm font-medium text-gray-700">
                                Aadhar Number
                            </label>
                            <input
                                id="aadharNumber"
                                type="text"
                                placeholder="1234 5678 9012"
                                maxLength={14}
                                className={inputClass}
                                value={form.aadhar_number}
                                onChange={handleAadharChange}
                            />
                        </div>
                        <div className="md:col-span-8 mb-10">
                            <label htmlFor="aadharDoc" className="mb-2 block text-sm font-medium text-gray-700">
                                Aadhar Document
                            </label>
                            <div className="flex items-center gap-3">
                                <label
                                    htmlFor="aadharDoc"
                                    className={buttonClass}
                                >
                                    Browse
                                </label>

                                <input
                                    id="aadharDoc"
                                    type="file"
                                    accept="image/jpeg,image/png,image/jpg,application/pdf"
                                    onChange={(e) => handleDocumentChange(e, "aadhar")}
                                    className="hidden"
                                />

                                <span className="text-sm text-slate-500">
                                    {form.aadhar_doc ? '' : "No image selected"}
                                </span>
                            </div>
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
                        </div>

                        <div className="md:col-span-4 mb-10">
                            <label htmlFor="panNumber" className="mb-2 block text-sm font-medium text-gray-700">
                                PAN
                            </label>
                            <input
                                id="panNumber"
                                type="text"
                                placeholder="ABCDE1234F"
                                maxLength={10}
                                className={inputClass}
                                value={form.pan_number}
                                onChange={handlePanChange}
                            />
                        </div>
                        <div className="md:col-span-8 mb-10">
                            <label htmlFor="panDoc" className="mb-2 block text-sm font-medium text-gray-700">
                                PAN Document
                            </label>
                            <div className="flex items-center gap-3">
                                <label
                                    htmlFor="panDoc"
                                    className={buttonClass}
                                >
                                    Browse
                                </label>

                                <input
                                    id="panDoc"
                                    type="file"
                                    accept="image/jpeg,image/png,image/jpg,application/pdf"
                                    onChange={(e) => handleDocumentChange(e, "pan")}
                                    className="hidden"
                                />

                                <span className="text-sm text-slate-500">
                                    {form.pan_doc ? '' : "No image selected"}
                                </span>
                            </div>
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
                        </div>

                        <div className="md:col-span-4 mb-10">
                            <label htmlFor="gstNumber" className="mb-2 block text-sm font-medium text-gray-700">
                                GST Number
                            </label>
                            <input
                                id="gstNumber"
                                type="text"
                                placeholder="22AAAAA0000A1Z5"
                                className={inputClass}
                                value={form.gst_number}
                                onChange={handleGstChange}
                            />
                        </div>
                        <div className="md:col-span-8 mb-10">
                            <label htmlFor="gstDoc" className="mb-2 block text-sm font-medium text-gray-700">
                                GST Document
                            </label>
                            <div className="flex items-center gap-3">
                                <label
                                    htmlFor="gstDoc"
                                    className={buttonClass}
                                >
                                    Browse
                                </label>

                                <input
                                    id="gstDoc"
                                    type="file"
                                    accept="image/jpeg,image/png,image/jpg,application/pdf"
                                    onChange={(e) => handleDocumentChange(e, "gst")}
                                    className="hidden"
                                />

                                <span className="text-sm text-slate-500">
                                    {form.gst_doc ? '' : "No image selected"}
                                </span>
                            </div>
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
                        </div>

                        <div className="md:col-span-4 mb-10">
                            <label htmlFor="bankDetails" className="mb-2 block text-sm font-medium text-gray-700">
                                Bank Details
                            </label>
                            <input
                                id="bankDetails"
                                type="text"
                                placeholder="Bank Account Details"
                                className={inputClass}
                                value={form.bank_details}
                                onChange={(event) => updateField("bank_details", event.target.value)}
                            />
                        </div>
                        <div className="md:col-span-8 mb-10">
                            <label htmlFor="bankDoc" className="mb-2 block text-sm font-medium text-gray-700">
                                Bank Document
                            </label>
                            <div className="flex items-center gap-3">
                                <label
                                    htmlFor="bankDoc"
                                    className={buttonClass}
                                >
                                    Browse
                                </label>

                                <input
                                    id="bankDoc"
                                    type="file"
                                    accept="image/jpeg,image/png,image/jpg,application/pdf"
                                    onChange={(e) => handleDocumentChange(e, "bank")}
                                    className="hidden"
                                />

                                <span className="text-sm text-slate-500">
                                    {form.bank_doc ? '' : "No image selected"}
                                </span>
                            </div>
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