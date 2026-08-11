"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { FiCheck, FiCheckCircle, FiX } from "react-icons/fi";
import { constants } from "@/utils/constants";
import mainService from "@/services/api/main.service";
import { apiConfig } from "@/environments/api";
import PopupModal from "@/components/common/popup/popup-modal";

import {
    FiArrowUpRight,
    FiClock,
    FiGlobe,
    FiHeart,
    FiMail,
    FiMapPin,
    FiMessageCircle,
    FiMoreHorizontal,
    FiPhone,
    FiPlay,
    FiShield,
} from "react-icons/fi";

const tabs = [
    { key: "overview", label: "Overview" },
    { key: "photos-videos", label: "Photos & Videos" },
    { key: "availability", label: "Availability" },
    { key: "reviews", label: "Reviews" },
    { key: "timeline", label: "Timeline" },
    { key: "packages", label: "Packages" },
    { key: "offers", label: "Offers" },
];

const galleryImages = [
    "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=300&q=80",
    "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=300&q=80",
    "https://images.unsplash.com/photo-1527529482837-4698179dc6ce?auto=format&fit=crop&w=300&q=80",
    "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&w=300&q=80",
    "https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=300&q=80",
];

const occasionTypeLabels = [
    { key: "mandap", label: "Mandap" },
    { key: "wedding", label: "Wedding" },
    { key: "stage-decoration", label: "Stage Decoration" },
    { key: "reception", label: "Reception" },
    { key: "events", label: "Events" },
];


export function CategoryServiceDetailsPage() {
    const [serviceRecord, setServiceRecord] = useState<any>(null);
    const [showPopup, setShowPopup] = useState(false);
    const [popupTitle, setPopupTitle] = useState("");
    const [popupContent, setPopupContent] = useState("");
    const [isTabOpen, setIsTabOpen] = useState("");
    const [isOccasionTabOpen, setIsOccasionTabOpen] = useState("all");
    const [galleryRecords, setGalleryRecords] = useState<any[]>([]);
    const [galleryFilterRecords, setGalleryFilterRecords] = useState<any[]>([]);

    const router = useRouter();
    const BACKEND_BASE_URL = apiConfig.baseUrl;

    const btnClass = constants.btnClass;
    const buttonClassWhite = constants.buttonClassWhite;

    const searchParams = useSearchParams();
    const categoryServiceId = searchParams.get("id");


    useEffect(() => {
        setIsTabOpen("overview")
    }, []);

    useEffect(() => {
        if (categoryServiceId) {
            loadCategoryService();
            loadGalleryRecords();
        }
    }, [categoryServiceId]);

    const loadCategoryService = async () => {
        try {
            if (!categoryServiceId) {
                return;
            }
            const result = await mainService.getCategoryService({ id: Number(categoryServiceId) });

            if (!result?.success) {
                return;
            }
            setServiceRecord(result.data);
        } catch (caughtError) {
            console.error("Failed to load category service:", caughtError);
        }
    };

    const loadGalleryRecords = async () => {
        try {
            if (!categoryServiceId) {
                return;
            }
            const result = await mainService.galleryRecords({ category_service_id: Number(categoryServiceId) });

            if (!result?.success) {
                return;
            }

            setGalleryRecords(result.data);
            setGalleryFilterRecords(result.data);
        } catch (caughtError) {
            console.error("Failed to load gallery records:", caughtError);
        }
    };

    const occasionTabChange = (key: string) => {
        setIsOccasionTabOpen(key);

        if (key === "all") {
            setGalleryFilterRecords(galleryRecords);
            return;
        }

        const filteredRecords = galleryRecords.filter(
            (image) => image.occasion_type === key
        );

        setGalleryFilterRecords(filteredRecords);
    };

    return (
        <main className="mx-auto max-w-screen-2xl space-y-12 px-4 py-6 sm:px-6 lg:px-8">
            <div className="relative mb-6 overflow-hidden rounded-xl bg-white shadow-sm">
                <div className="relative w-full h-40 md:h-80">
                    <img
                        src={serviceRecord?.service_banner_image ? `${BACKEND_BASE_URL}/${serviceRecord.service_banner_image}` : undefined}
                        alt=""
                        className="h-20 md:h-64 w-full object-cover transition-transform duration-700 ease-out hover:scale-110"
                    />
                    <div className="absolute right-4 top-4 flex gap-2">
                        <button type="button" className="rounded-full bg-white/80 p-2 text-xs text-gray-700 backdrop-blur hover:bg-white" aria-label="Share">
                            <FiArrowUpRight />
                        </button>
                        <button type="button" className="rounded-full bg-white/80 p-2 text-xs text-gray-700 backdrop-blur hover:bg-white" aria-label="Favorite">
                            <FiHeart />
                        </button>
                        <button type="button" className="rounded-full bg-white/80 p-2 text-xs text-gray-700 backdrop-blur hover:bg-white" aria-label="More">
                            <FiMoreHorizontal />
                        </button>
                    </div>
                </div>

                <div className="relative flex flex-col items-start justify-between gap-4 p-6 pt-0 md:flex-row md:items-end">
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
                            <p className="mt-0.5 text-xs text-gray-500">Decoration • 8 Years Experience • {serviceRecord?.city?.name}</p>
                            <div className="mt-2 flex items-center gap-2 text-xs">
                                <span className="font-bold text-gray-800">4.8</span>
                                <div className="flex gap-0.5 text-xs text-amber-400">
                                    <span>★</span>
                                    <span>★</span>
                                    <span>★</span>
                                    <span>★</span>
                                    <span>★</span>
                                </div>
                                <span className="text-gray-400">(256 Reviews)</span>
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

                <div className="grid grid-cols-2 divide-x border-t border-gray-200 bg-gray-50/50 text-center md:grid-cols-4">
                    <div className="p-4 border-gray-200">
                        <div className="text-sm font-bold text-gray-800">500+</div>
                        <div className="text-[11px] text-gray-500">Events Completed</div>
                    </div>
                    <div className="p-4 border-gray-200">
                        <div className="text-sm font-bold text-gray-800">4.8</div>
                        <div className="text-[11px] text-gray-500">Rating</div>
                    </div>
                    <div className="p-4 border-gray-200">
                        <div className="text-sm font-bold text-gray-800">95%</div>
                        <div className="text-[11px] text-gray-500">Response Rate</div>
                    </div>
                    <div className="p-4 border-gray-200">
                        <div className="text-sm font-bold text-gray-800">Verified</div>
                        <div className="text-[11px] text-gray-500">Business</div>
                    </div>
                </div>

                <div className="flex gap-8 overflow-x-auto border-t border-gray-200 px-6 text-xs font-medium text-gray-500">
                    {tabs.map(({ key, label }) => (
                        <button
                            key={`is-tab-${key}`}
                            type="button"
                            className={(isTabOpen === key ? "border-b-2 border-primary font-semibold" : "") + " cursor-pointer whitespace-nowrap py-3.5 hover:text-primary"}
                            onClick={() => setIsTabOpen(key)}
                        >
                            {label}
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                <aside className="md:col-span-3 space-y-6">
                    <div className="flex flex-col justify-between rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                        <div className="space-y-2.5 text-xs text-gray-600">
                            <div className="flex items-center gap-2.5"><FiMapPin className="text-primary" /> {serviceRecord?.locality?.name}, {serviceRecord?.city?.name}</div>
                            {/* <div className="flex items-center gap-2.5"><FiClock className="text-primary" /> 10:00 AM - 8:00 PM</div> */}
                            {/* <div className="flex items-center gap-2.5"><FiGlobe className="text-primary" /> www.royaldecorators.com</div> */}
                            <div className="flex items-center gap-2.5"><FiPhone className="text-primary" /> +91 98765 43210</div>
                            <div className="flex items-center gap-2.5"><FiMail className="text-primary" /> royal.decor@gmail.com</div>
                        </div>
                    </div>

                    <div className="flex items-center justify-between rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
                        <div>
                            <h4 className="mb-3 text-xs font-bold text-gray-900">Verified & Trusted</h4>
                            <div className="space-y-1.5 text-xs text-gray-600">
                                <div>Business Verified</div>
                                <div>GST Verified</div>
                                <div>PAN Verified</div>
                                <div>Bank Verified</div>
                            </div>
                        </div>
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#FDF2F7] text-xl text-primary">
                            <FiShield />
                        </div>
                    </div>

                    <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
                        <h4 className="mb-3 text-xs font-bold text-gray-900">Highlights</h4>
                        <ul className="space-y-2 text-xs text-gray-600">
                            <li>Specialized in Wedding & Reception</li>
                            <li>Customized Theme Decor</li>
                            <li>Own Material & Team</li>
                            <li>On-time Delivery</li>
                            <li>Pan India Service</li>
                            <li>Free Consultation</li>
                        </ul>
                    </div>
                </aside>
                <main className="md:col-span-6 space-y-6">
                    {isTabOpen === "overview" && (
                        <>
                            <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
                                <h3 className="mb-3 text-sm font-bold text-gray-900">About Us</h3>
                                <p className="text-xs leading-relaxed text-gray-600 line-clamp-3">
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
                        </>
                    )}

                    {isTabOpen === "photos-videos" && (
                        <>
                            <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
                                <div className="mb-4 flex items-center justify-between">
                                    <h3 className="text-sm font-bold text-gray-900">Photos</h3>
                                    <button type="button" className="text-xs font-medium text-primary hover:underline">View All</button>
                                </div>
                                <div className="mb-4 flex gap-2 overflow-x-auto text-xs">
                                    <button
                                        type="button"
                                        className={`rounded-full px-3 py-1 cursor-pointer ${isOccasionTabOpen === 'all' ? 'bg-primary text-white' : 'bg-gray-300 text-gray-600'}`}
                                        onClick={() => occasionTabChange('all')}
                                    >
                                        All
                                    </button>
                                    {occasionTypeLabels.map(({ key, label }) => (
                                        <button
                                            key={key}
                                            type="button"
                                            className={`rounded-full px-3 py-1 cursor-pointer ${isOccasionTabOpen === key ? 'bg-primary text-white' : 'bg-gray-300 text-gray-600'}`}
                                            onClick={() => occasionTabChange(key)}
                                        >{label}</button>
                                    ))}
                                </div>
                                <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
                                    {galleryFilterRecords.map((image, index) => (
                                        <img
                                            key={`gallery-image-${index}`}
                                            src={image?.gallery_image ? `${BACKEND_BASE_URL}/${image.gallery_image}` : undefined}
                                            className="h-24 w-full rounded-lg object-cover transition-transform duration-700 ease-out hover:scale-110"
                                            alt="Gallery"
                                        />
                                    ))}
                                </div>
                            </div>
                        </>
                    )}

                    {isTabOpen === "availability" && (
                        <>
                            <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
                                <h3 className="mb-3 text-sm font-bold text-gray-900">Availability Calendar</h3>
                                <div className="mb-4 flex items-center gap-3 text-[10px] text-gray-500">
                                    <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-emerald-500" /> Available</span>
                                    <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-amber-400" /> Partially Booked</span>
                                    <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-primary" /> Booked</span>
                                </div>
                                <div className="grid grid-cols-7 gap-1 text-center text-xs text-gray-500">
                                    {Array.from({ length: 35 }).map((_, i) => (
                                        <span
                                            key={`day-${i}`}
                                            className={i % 9 === 0 ? "py-1 font-semibold text-primary" : "py-1"}
                                        >
                                            {(i % 30) + 1}
                                        </span>
                                    ))}
                                </div>
                                <button type="button" className="mt-4 w-full rounded-lg border border-primary/30 py-1.5 text-xs font-medium text-primary hover:bg-[#FDF2F7]">
                                    View Full Calendar
                                </button>
                            </div>
                        </>
                    )}

                    {isTabOpen === "packages" && (
                        <>
                            <div className="flex flex-col justify-between rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
                                <div>
                                    <h4 className="mb-4 text-xs font-bold text-gray-900">Packages</h4>
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 p-3">
                                            <div className="text-xs font-semibold text-gray-800">Silver Package</div>
                                            <div className="text-right text-xs font-bold text-gray-900">Rs 75,000</div>
                                        </div>
                                        <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 p-3">
                                            <div className="text-xs font-semibold text-gray-800">Gold Package</div>
                                            <div className="text-right text-xs font-bold text-gray-900">Rs 1,25,000</div>
                                        </div>
                                        <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 p-3">
                                            <div className="text-xs font-semibold text-gray-800">Platinum Package</div>
                                            <div className="text-right text-xs font-bold text-gray-900">Rs 2,25,000</div>
                                        </div>
                                    </div>
                                </div>
                                <button type="button" className="mt-4 w-full rounded-lg border border-primary/30 py-1.5 text-xs font-medium text-primary hover:bg-[#FDF2F7]">
                                    View All Packages
                                </button>
                            </div>
                        </>
                    )}
                </main>
                <aside className="md:col-span-3 space-y-6">
                    <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
                        <h3 className="mb-4 text-sm font-bold text-gray-900">Timeline</h3>

                        <div className="mb-6 flex items-center gap-3 rounded-xl border border-gray-200 bg-gray-50 p-2">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-bold text-white">R</div>
                            <input type="text" placeholder="Write something..." className="flex-1 bg-transparent text-xs outline-none" />
                            <button type="button" className="px-2 text-xs font-medium text-primary">Post</button>
                        </div>

                        <div className="space-y-6">
                            <div className="border-b border-gray-200 pb-4">
                                <div className="mb-2 flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-xs font-bold text-white">R</div>
                                        <div>
                                            <h5 className="text-xs font-bold text-gray-900">Royal Decorators</h5>
                                            <span className="text-[10px] text-gray-400">2 days ago</span>
                                        </div>
                                    </div>
                                    <button type="button" className="text-gray-400 hover:text-gray-600" aria-label="Post options">
                                        <FiMoreHorizontal />
                                    </button>
                                </div>

                                <p className="mb-3 text-xs text-gray-700">
                                    A magical evening setup for a royal wedding in Chennai. <br />
                                    <span className="text-primary hover:underline">#RoyalDecorators</span>
                                </p>

                                <div className="mb-3 grid grid-cols-2 gap-1.5 overflow-hidden rounded-lg">
                                    {galleryImages.slice(0, 4).map((image) => (
                                        <img key={`post-${image}`} src={image} alt="Post" className="h-28 w-full object-cover" />
                                    ))}
                                </div>

                                <div className="flex items-center gap-4 text-xs text-gray-500">
                                    <button type="button" className="flex items-center gap-1 hover:text-primary"><FiHeart /> 128</button>
                                    <button type="button" className="flex items-center gap-1 hover:text-primary"><FiMessageCircle /> 12</button>
                                </div>
                            </div>

                            <div>
                                <div className="mb-2 flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-xs font-bold text-white">R</div>
                                        <div>
                                            <h5 className="text-xs font-bold text-gray-900">Royal Decorators</h5>
                                            <span className="text-[10px] text-gray-400">5 days ago</span>
                                        </div>
                                    </div>
                                    <button type="button" className="text-gray-400 hover:text-gray-600" aria-label="Post options">
                                        <FiMoreHorizontal />
                                    </button>
                                </div>

                                <p className="mb-3 text-xs text-gray-700">
                                    When flowers meet creativity, memories are created. <br />
                                    <span className="text-primary hover:underline">#Decoration #WeddingVibes</span>
                                </p>

                                <div className="relative mb-3 overflow-hidden rounded-lg">
                                    <img
                                        src="https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=600&q=80"
                                        alt="Video preview"
                                        className="h-48 w-full object-cover"
                                    />
                                    <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/80 pl-0.5 text-sm text-primary shadow-md">
                                            <FiPlay />
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4 text-xs text-gray-500">
                                    <button type="button" className="flex items-center gap-1 hover:text-primary"><FiHeart /> 96</button>
                                    <button type="button" className="flex items-center gap-1 hover:text-primary"><FiMessageCircle /> 8</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </aside>
            </div>



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
        </main>
    );
}
