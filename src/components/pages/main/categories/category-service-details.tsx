"use client";

import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { FiCheck } from "react-icons/fi";
import { FiArrowUpRight, FiHeart, FiMail, FiMapPin, FiMessageCircle, FiMoreHorizontal, FiPhone, FiPlay, FiShield, } from "react-icons/fi";
import { apiConfig } from "@/environments/api";
import mainRoutes from "@/services/api/main.routes";
import RatingStars from "@/components/common/review/rating-stars";
import RecordNotFoundOverlay from "@/components/common/not-found/record-not-found-overlay";
import { CategoryServiceReview } from "./category-service-review";
import { CategoryServiceOverview } from "./category-service-overview";
import { CategoryServiceGallery } from "./category-service-gallery";
import { CategoryServiceCalendar } from "./category-service-calendar";
import { CategoryServicePackage } from "./category-service-package";
import { Building, CircleAlert, FileText, Info, ListX, Sparkles, UserRound } from "lucide-react";
import { common as commonUtils } from "@/utils/common";
import { helperUtils } from "@/utils/helpers";
import { sweetalert } from "@/utils/sweetalert";
import { authUserId } from "@/utils/auth";
import PopupModal from "@/components/common/popup/popup-modal";

const tabSection = [
    { key: "overview", label: "Overview" },
    { key: "availability", label: "Availability" },
    { key: "photos-videos", label: "Photos & Videos" },
    { key: "packages", label: "Packages" },
    { key: "reviews", label: "Reviews" },
    { key: "offers", label: "Offers" },
];



export function CategoryServiceDetails() {
    const userId = authUserId();
    const BACKEND_BASE_URL = apiConfig.baseUrl;

    const [serviceNotFound, setServiceNotFound] = useState(false);
    const [serviceRecord, setServiceRecord] = useState<any>(null);

    const searchParams = useSearchParams();
    const categoryServiceId = Number(searchParams.get("serviceId"));

    const [showPopup, setShowPopup] = useState(false);
    const [popupTitle, setPopupTitle] = useState("");
    const [popupContent, setPopupContent] = useState("");

    //Main section scroll
    const mainDivRef = useRef<HTMLElement | null>(null);
    const sectionTabRefs = {
        "overview": useRef<HTMLDivElement | null>(null),
        "availability": useRef<HTMLDivElement | null>(null),
        "photos-videos": useRef<HTMLDivElement | null>(null),
        "packages": useRef<HTMLDivElement | null>(null),
        "reviews": useRef<HTMLDivElement | null>(null),
        "offers": useRef<HTMLDivElement | null>(null),
    };
    const [isTabOpen, setIsTabOpen] = useState("overview");

    useEffect(() => {
        const mainDivElement = mainDivRef.current;

        if (!mainDivElement) return;

        const sections = Object.entries(sectionTabRefs)
            .map(([key, ref]) => ({
                key,
                element: ref.current,
            }))
            .filter(
                (item): item is { key: string; element: HTMLDivElement } =>
                    item.element !== null
            );

        if (!sections.length) return;

        const observer = new IntersectionObserver(
            (entries) => {
                const visibleSections = entries
                    .filter((entry) => entry.isIntersecting)
                    .sort(
                        (a, b) =>
                            a.boundingClientRect.top -
                            b.boundingClientRect.top
                    );

                if (visibleSections.length) {
                    const activeSection =
                        visibleSections[0].target.getAttribute("data-section");

                    if (activeSection) {
                        setIsTabOpen(activeSection);
                    }
                }
            },
            {
                root: mainDivElement,
                threshold: 0.1,
                rootMargin: "-5% 0px -70% 0px",
            }
        );

        sections.forEach(({ element }) => observer.observe(element));

        return () => observer.disconnect();
    }, []);

    const getSectionRef = (key: string) => {
        if (key === "availability") {
            return sectionTabRefs.overview.current;
        }

        return sectionTabRefs[key as keyof typeof sectionTabRefs]?.current;
    };

    const handleTabClick = (key: string) => {
        setIsTabOpen(key);

        const main = mainDivRef.current;
        const section = getSectionRef(key);

        if (!main || !section) return;

        const mainRect = main.getBoundingClientRect();
        const sectionRect = section.getBoundingClientRect();

        const targetPosition =
            sectionRect.top - mainRect.top + main.scrollTop;

        main.scrollTo({
            top: Math.max(0, targetPosition),
            behavior: "smooth",
        });
    };
    //Main section scroll

    useEffect(() => {
        if (categoryServiceId) {
            loadCategoryService();
        }
    }, [categoryServiceId]);


    const loadCategoryService = async () => {
        try {
            if (!categoryServiceId) {
                return;
            }
            const result = await mainRoutes.getCategoryService({ category_service_id: categoryServiceId });

            if (!result?.success || !result?.data) {
                setServiceNotFound(true);
                setServiceRecord(null);
                return;
            }

            setServiceNotFound(false);
            setServiceRecord(result.data);
        } catch (caughtError) {
            setServiceNotFound(true);
            setServiceRecord(null);
            console.error("Failed to load category service:", caughtError);
        }
    };

    const addToWishlists = async (categoryServiceId: number, purpose: "create" | "remove") => {
        try {
            if (!userId) {
                sweetalert.toastError("Please log in to your account");
                return;
            }
            const response = await mainRoutes.addToWishlist({
                user_id: userId,
                category_service_id: categoryServiceId,
                purpose,
            });

            if (response?.success) {
                setServiceRecord((prev: any) => ({
                    ...prev,
                    is_wishlisted: purpose === "create",
                }));
                sweetalert.toastSuccess(response?.message);
            }
        } catch (error) {
            console.error("Wishlist Error:", error);
        }
    };

    return (
        <>
            <RecordNotFoundOverlay show={serviceNotFound} blurBackground={true} />

            <main className="mx-auto flex max-w-screen-2xl flex-col px-4 py-2 sm:px-6 lg:px-8">
                <div className="relative mb-2 shrink-0 overflow-hidden rounded-xl bg-white shadow-sm">
                    <div className="relative w-full h-40 md:h-60">
                        <img
                            src={serviceRecord?.service_banner_image ? `${BACKEND_BASE_URL}/${serviceRecord.service_banner_image}` : undefined}
                            alt=""
                            className="h-20 md:h-48 w-full object-cover transition-transform duration-700 ease-out hover:scale-110"
                        />
                        <div className="absolute right-4 top-4 flex gap-2">
                            <button
                                type="button"
                                onClick={() => addToWishlists(serviceRecord.id, serviceRecord?.is_wishlisted ? "remove" : "create")}
                                className={`cursor-pointer rounded-full p-2 text-xs backdrop-blur transition-all duration-200 ${serviceRecord?.is_wishlisted
                                    ? "bg-white text-primary hover:bg-white"
                                    : "bg-white/80 text-gray-700 hover:bg-white hover:text-primary"
                                    }`}

                            >
                                <FiHeart className={`h-4 w-4 transition-all duration-200 ${serviceRecord?.is_wishlisted ? "fill-current" : ""}`} />
                            </button>
                            {/* <button type="button" className="rounded-full bg-white/80 p-2 text-xs text-gray-700 backdrop-blur hover:bg-white" aria-label="Share">
                                <FiArrowUpRight />
                            </button>
                            <button type="button" className="rounded-full bg-white/80 p-2 text-xs text-gray-700 backdrop-blur hover:bg-white" aria-label="More">
                                <FiMoreHorizontal />
                            </button> */}
                        </div>
                    </div>

                    <div className="relative flex flex-col items-start justify-between gap-4 p-6 pt-0 pb-2 md:flex-row md:items-end">
                        <div className="md:flex items-end gap-6 -mt-16 md:-mt-32">
                            <div className="hidden md:flex h-32 w-32 flex-col items-center justify-center rounded-2xl border-4 border-white bg-primary p-3 text-center text-amber-300 shadow-lg sm:h-36 sm:w-36">
                                <span className="mb-1 text-2xl">♛</span>
                                <span className="font-serif text-xl font-bold leading-tight tracking-widest text-white">{serviceRecord?.service_name?.trim().split(/\s+/)[0]}</span>
                                <span className="text-[9px] uppercase tracking-widest text-amber-200">{serviceRecord?.service_name?.trim().split(/\s+/).slice(1).join(" ")}</span>
                            </div>
                            <div className="mb-2">
                                <div className="flex items-center gap-2">
                                    <h1 className="text-2xl font-bold text-gray-900">
                                        {serviceRecord?.service_name}
                                        <span className="inline-flex ml-2 h-4 w-4 items-center justify-center rounded-full bg-blue-500">
                                            <FiCheck className="h-3 w-3 text-white" />
                                        </span>
                                    </h1>
                                    <span className="text-sm text-blue-500"></span>
                                </div>
                                <p className="mt-0.5 text-xs text-gray-500">{serviceRecord?.service_experience} • {serviceRecord?.city?.name}</p>
                                <div className="mt-2 flex items-center gap-2 text-xs">
                                    <span className="font-bold text-gray-800">{serviceRecord?.averageRating?.toFixed(1)}</span>
                                    <div className="flex gap-0.5 text-xs text-amber-400">
                                        <RatingStars rating={serviceRecord?.averageRating} />
                                    </div>
                                    <span className="text-gray-400">({serviceRecord?.totalReviews} Reviews)</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex w-full items-center gap-3 md:w-auto">
                            <button
                                type="button"
                                className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-primary px-5 py-2.5 text-xs font-medium text-primary transition hover:bg-[#FDF2F7] md:flex-none"
                            >
                                <FiHeart /> Follow
                            </button>
                            <button
                                type="button"
                                className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-xs font-medium text-white transition hover:bg-[#80003B] md:flex-none"
                            >
                                <FiMessageCircle /> Message
                            </button>
                        </div>
                    </div>

                    {/* <div className="grid grid-cols-2 divide-x border-t border-gray-200 bg-gray-50/50 text-center md:grid-cols-4">
                        <div className="p-4 border-gray-200">
                            <div className="text-sm font-bold text-gray-800">{serviceRecord?.completed_events}</div>
                            <div className="text-[11px] text-gray-500">Events Completed</div>
                        </div>
                        <div className="p-4 border-gray-200">
                            <div className="text-sm font-bold text-gray-800">{serviceRecord?.averageRating?.toFixed(1)}</div>
                            <div className="text-[11px] text-gray-500">Rating</div>
                        </div>
                        <div className="p-4 border-gray-200">
                            <div className="text-sm font-bold text-gray-800">Good</div>
                            <div className="text-[11px] text-gray-500">Response Rate</div>
                        </div>
                        <div className="p-4 border-gray-200">
                            <div className="text-sm font-bold text-gray-800">Verified</div>
                            <div className="text-[11px] text-gray-500">{serviceRecord?.verification_status?.aadhar ? "Business" : "Pending"}</div>
                        </div>
                    </div> */}

                    <div className="flex shrink-0 gap-6 overflow-x-auto border-t border-gray-200 bg-white px-6 text-[12px] font-semibold text-gray-700">
                        {tabSection.map(({ key, label }) => (
                            <button
                                key={`is-tabsec-${key}`}
                                type="button"
                                className={`relative cursor-pointer whitespace-nowrap py-3.5 transition-colors ${isTabOpen === key
                                    ? "font-semibold text-primary"
                                    : "hover:text-primary"
                                    }`}
                                onClick={() => handleTabClick(key)}
                            >
                                {label}

                                {isTabOpen === key && (
                                    <span className="absolute inset-x-0 bottom-0 h-0.5 rounded-full bg-primary" />
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="grid min-h-0 flex-1 grid-cols-1 gap-6 md:grid-cols-12">
                    <aside className="order-2 md:order-1 md:col-span-3 space-y-1">
                        <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
                            <div className="border-b border-gray-200 pb-3">
                                <h3 className="mb-3 text-sm font-bold text-gray-900">About Us</h3>
                                <p className="text-xs leading-relaxed text-gray-600 text-justify line-clamp-4">
                                    {serviceRecord?.service_description || "No description available."}
                                </p>
                                <button
                                    type="button"
                                    className="mt-1 text-xs font-medium text-primary hover:underline cursor-pointer"
                                    onClick={() => {
                                        setShowPopup(true);
                                        setPopupTitle("About Us");
                                        setPopupContent(serviceRecord?.service_description || "No description available.");
                                    }}
                                >
                                    Read more
                                </button>
                            </div>
                            <div className="flex items-center justify-between pt-3">
                                <div>
                                    <div className="space-y-3 text-xs text-gray-600">
                                        <div className="flex items-center gap-2.5"><FiMapPin className="text-primary" /> {serviceRecord?.locality?.name}, {serviceRecord?.city?.name}</div>
                                        {/* <div className="flex items-center gap-2.5"><FiClock className="text-primary" /> 10:00 AM - 8:00 PM</div> */}
                                        {/* <div className="flex items-center gap-2.5"><FiGlobe className="text-primary" /> www.royaldecorators.com</div> */}
                                        <div className="flex items-center gap-2.5"><FiPhone className="text-primary" /> {serviceRecord?.service_mobile}</div>
                                        <div className="flex items-center gap-2.5"><FiMail className="text-primary" /> {serviceRecord?.service_email}</div>

                                    </div>
                                </div>
                                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#FDF2F7] text-xl text-primary">
                                    <Building />
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center justify-between rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
                            <div>
                                <h4 className="mb-3 text-xs font-bold text-gray-900">Verified & Trusted</h4>
                                <div className="space-y-1.5 text-xs text-gray-600">
                                    {serviceRecord?.verification_status && (
                                        <>
                                            {Object.entries(serviceRecord.verification_status)
                                                .filter(([, status]) => String(status).toLowerCase() === "verified")
                                                .map(([key]) => (
                                                    <div key={`verified-record-${key}`}>
                                                        {key.charAt(0).toUpperCase() + key.slice(1)} Verified
                                                    </div>
                                                ))}
                                        </>
                                    )}
                                    {!serviceRecord?.verification_status && (
                                        <div className="inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-700">
                                            <CircleAlert className="h-3.5 w-3.5" />
                                            Not Verified
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#FDF2F7] text-xl text-primary">
                                <FiShield />
                            </div>
                        </div>

                        <div className="flex items-center justify-between rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
                            <div>
                                <h4 className="mb-3 text-xs font-bold text-gray-900">Highlights</h4>
                                <div className="space-y-1.5 text-xs text-gray-600">
                                    {serviceRecord?.service_highlights && (
                                        serviceRecord.service_highlights.map((item: any) => (
                                            <div key={`highlight-record-${item.id}`}>{item.highlight}</div>
                                        ))
                                    )}

                                    {!serviceRecord?.service_highlights?.length && (
                                        <div className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-600">
                                            <ListX className="h-3.5 w-3.5" />
                                            No Highlights Found
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#FDF2F7] text-xl text-primary">
                                <Sparkles />
                            </div>
                        </div>
                    </aside>
                    <div className="order-1 min-h-0 md:order-2 md:col-span-6">
                        <main ref={mainDivRef} className="h-[calc(100vh-100px)] min-h-0 overflow-y-auto pr-1 scrollbar-hidden">
                            <div ref={sectionTabRefs.overview} data-section="overview" className="scroll-mt-4">
                                <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
                                    <div className="md:col-span-6">
                                        <CategoryServiceCalendar categoryServiceId={categoryServiceId} serviceRecord={serviceRecord} />
                                    </div>
                                    <div className="md:col-span-6">
                                        <div className="flex items-center justify-between rounded-xl border border-gray-100 bg-white p-5 shadow-sm mb-2">
                                            <div>
                                                <h4 className="mb-3 text-xs font-bold text-gray-900">Highlights</h4>
                                                <div className="space-y-1.5 text-xs text-gray-600">
                                                    {serviceRecord?.service_highlights && (
                                                        serviceRecord.service_highlights.map((item: any) => (
                                                            <div key={`highlight-record-${item.id}`}>{item.highlight}</div>
                                                        ))
                                                    )}

                                                    {!serviceRecord?.service_highlights?.length && (
                                                        <div className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-600">
                                                            <ListX className="h-3.5 w-3.5" />
                                                            No Highlights Found
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#FDF2F7] text-xl text-primary">
                                                <Sparkles />
                                            </div>
                                        </div>

                                        <CategoryServicePackage categoryServiceId={categoryServiceId} serviceRecord={serviceRecord} />
                                    </div>
                                </div>
                            </div>

                            <div ref={sectionTabRefs["photos-videos"]} data-section="photos-videos" className="scroll-mt-4 mt-4">
                                <CategoryServiceGallery categoryServiceId={categoryServiceId} serviceRecord={serviceRecord} />
                            </div>

                            <div ref={sectionTabRefs.packages} data-section="packages" className="scroll-mt-4 mt-4">
                                <CategoryServicePackage categoryServiceId={categoryServiceId} serviceRecord={serviceRecord} />
                            </div>
                            <div ref={sectionTabRefs.reviews} data-section="reviews" className="scroll-mt-4 mt-4">
                                <CategoryServiceReview categoryServiceId={categoryServiceId} />
                            </div>
                            <div ref={sectionTabRefs.offers} data-section="offers" className="scroll-mt-4 mt-4"     >{/* Offers component */}</div>
                        </main>
                    </div>

                    <aside className="order-3 md:order-3 md:col-span-3 space-y-6">
                        <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
                            <h3 className="mb-4 text-sm font-bold text-gray-900">Timeline</h3>

                            {/* <div className="mb-6 flex items-center gap-3 rounded-xl border border-gray-200 bg-gray-50 p-2">
                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-bold text-white">R</div>
                                <input type="text" placeholder="Write something..." className="flex-1 bg-transparent text-xs outline-none" />
                                <button type="button" className="px-2 text-xs font-medium text-primary">Post</button>
                            </div> */}

                            <div className="space-y-6">
                                {serviceRecord?.service_timelines && (
                                    serviceRecord.service_timelines.map((item: any) => (
                                        <div key={`timelines-record-${item.id}`}>
                                            <div className="border-b border-gray-200 pb-4">
                                                <div className="mb-2 flex items-center justify-between">
                                                    <div className="flex items-center gap-2">
                                                        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-xs font-bold text-white">{commonUtils.firstLetter(serviceRecord?.service_name)}</div>
                                                        <div>
                                                            <h5 className="text-xs font-bold text-gray-900">{serviceRecord?.service_name ?? ''}</h5>
                                                            <span className="text-[10px] text-gray-400">{commonUtils.timeAgo(item?.updated_at)}</span>
                                                        </div>
                                                    </div>
                                                    {/* <button type="button" className="text-gray-400 hover:text-gray-600" aria-label="Post options">
                                                        <FiMoreHorizontal />
                                                    </button> */}
                                                </div>

                                                <div className="mb-3 text-xs text-gray-700">
                                                    {helperUtils.hashtagContent(item?.timeline_content)}
                                                </div>
                                                {/* <div className="flex items-center gap-4 text-xs text-gray-500">
                                                    <button type="button" className="flex items-center gap-1 hover:text-primary"><FiHeart /> 128</button>
                                                    <button type="button" className="flex items-center gap-1 hover:text-primary"><FiMessageCircle /> 12</button>
                                                </div> */}
                                            </div>
                                        </div>
                                    ))
                                )}

                                {!serviceRecord?.service_timelines?.length && (
                                    <div className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-600">
                                        <ListX className="h-3.5 w-3.5" />
                                        No Timeline Found
                                    </div>
                                )}
                            </div>
                        </div>
                    </aside>
                </div>
            </main>

            <PopupModal
                show={showPopup}
                title={popupTitle}
                onClose={() => setShowPopup(false)}
                width="3xl"
                position="top"
                blurBackground={false}
            >
                {popupContent}
            </PopupModal>
        </>
    );
}
