"use client";

import { useState, useEffect } from "react";
import { GitCompareArrows } from "lucide-react";
import { FiChevronsDown, FiCalendar, FiChevronDown, FiCrosshair, FiHeart, FiLock, FiMapPin, FiMinus, FiPlus, FiSearch, FiSliders, FiStar, FiUsers, FiWind, FiHome, } from "react-icons/fi";
import PopupModal from "@/components/common/popup/popup-modal";
import { apiConfig } from "@/environments/api";
import { common as commonUtils } from "@/utils/common";
import commonRoutes from "@/services/api/common.routes";

type Props = {
    isCompareModalOpen: boolean | false;
    compareModalClose: () => void;
    categoryId: number | null;
    categoryServiceIds?: any | null;
    selectedCompareServices: any | null;
};

export function CategoryServiceCompare({
    isCompareModalOpen,
    compareModalClose,
    categoryId,
    categoryServiceIds,
    selectedCompareServices,
}: Props) {

    const [facilityList, setFacilityList] = useState<any[]>([]);
    const BACKEND_BASE_URL = apiConfig.baseUrl;

    useEffect(() => {
        loadFacility();
    }, []);

    const loadFacility = async () => {
        const result = await commonRoutes.getFacilities({ category_id: categoryId });
        setFacilityList(result?.data || []);
    };

    return (

        <PopupModal
            show={isCompareModalOpen}
            title='Compare Services'
            onClose={compareModalClose}
            width="7xl"
            position="top"
            blurBackground={false}
        >
            <div className="w-full">
                {/* Header */}
                <div className="mb-5">
                    <p className="text-sm text-gray-500 flex item-center">
                        <GitCompareArrows className="text-primary" /> Compare your selected services side by side and choose the best one.
                    </p>
                </div>

                <div className="w-full overflow-x-auto rounded-xl border border-gray-200">
                    <table className="w-full min-w-[900px] table-fixed border-collapse">
                        <thead>
                            <tr className="bg-gray-50">
                                {/* Key column */}
                                <th className="w-40 border-b border-r border-gray-200 p-3 text-left">
                                    <span className="text-xs font-bold text-gray-500 uppercase">
                                        Key Details
                                    </span>
                                </th>

                                {/* Services */}
                                {selectedCompareServices.map((service: any) => (
                                    <th
                                        key={`compare-header-${service.id}`}
                                        className="border-b border-r border-gray-200 p-3 align-top last:border-r-0"
                                    >
                                        {/* Banner */}
                                        <div className="relative h-36 overflow-hidden rounded-lg">
                                            <img
                                                src={
                                                    service.service_banner_image
                                                        ? `${BACKEND_BASE_URL}/${service.service_banner_image}`
                                                        : `${BACKEND_BASE_URL}/storage/uploads/services/sample.jpg`
                                                }
                                                alt={service.service_name}
                                                className="w-full h-full object-cover"
                                            />

                                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

                                            <div className="absolute bottom-2 left-2 right-2 text-left">
                                                <h3 className="text-sm font-bold text-white truncate">
                                                    {service.service_name}
                                                </h3>

                                                <p className="text-[10px] text-white/80 flex items-center mt-1">
                                                    <FiMapPin className="w-3 h-3 mr-1 shrink-0" />
                                                    {service.locality_name}, {service.city_name}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Price Details */}
                                        <div className="mt-2 rounded-lg bg-pink-50 border border-pink-100 p-3 text-left">
                                            <span className="text-[9px] text-gray-500 block mb-1">
                                                Pricing
                                            </span>

                                            {/* Base Amount */}
                                            <div className="flex items-center justify-between gap-2 text-xs">
                                                <span className="text-gray-500">
                                                    Base Amount
                                                </span>

                                                <span className="font-semibold text-gray-700">
                                                    {commonUtils.formatAmount(service.amount)}
                                                </span>
                                            </div>

                                            {/* Discount */}
                                            {service.discount > 0 && (
                                                <div className="flex items-center justify-between gap-2 mt-1 text-xs">
                                                    <span className="font-semibold text-green-600">
                                                        {commonUtils.formatAmount(service.discount)} OFF
                                                    </span>
                                                </div>
                                            )}

                                            {/* Tax */}
                                            {service.tax_amount > 0 && (
                                                <div className="flex items-center justify-between gap-2 mt-1 text-xs">
                                                    <span className="text-gray-500">
                                                        Tax ({service.tax_percentage}%)
                                                    </span>

                                                    <span className="font-semibold text-gray-700">
                                                        {commonUtils.formatAmount(service.tax_amount)}
                                                    </span>
                                                </div>
                                            )}

                                            {/* Divider */}
                                            <div className="my-2 border-t border-pink-200" />

                                            {/* Final Amount */}
                                            <div className="flex items-center justify-between gap-2">
                                                <span className="text-[10px] font-semibold text-gray-600">
                                                    Final Amount
                                                </span>

                                                <span className="text-base font-bold text-pink-700">
                                                    {commonUtils.formatAmount(service.final_amount)}
                                                </span>
                                            </div>
                                        </div>
                                    </th>
                                ))}
                            </tr>
                        </thead>

                        <tbody>
                            {/* Rating */}
                            <tr>
                                <td className="border-b border-r border-gray-200 bg-gray-50 p-3 text-xs font-semibold text-gray-600">
                                    Rating
                                </td>

                                {selectedCompareServices.map((service: any) => (
                                    <td
                                        key={`compare-rating-${service.id}`}
                                        className="border-b border-r border-gray-200 p-3 last:border-r-0"
                                    >
                                        <div className="flex items-center gap-1">
                                            <FiStar className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />

                                            <span className="text-xs font-bold text-gray-800">
                                                {service.averageRating ?? 0}
                                            </span>

                                            <span className="text-[10px] text-gray-400">
                                                ({service.totalReviews ?? 0})
                                            </span>
                                        </div>
                                    </td>
                                ))}
                            </tr>

                            {/* Capacity */}
                            <tr>
                                <td className="border-b border-r border-gray-200 bg-gray-50 p-3 text-xs font-semibold text-gray-600">
                                    Capacity
                                </td>

                                {selectedCompareServices.map((service: any) => (
                                    <td
                                        key={`compare-capacity-${service.id}`}
                                        className="border-b border-r border-gray-200 p-3 text-xs font-semibold text-gray-800 last:border-r-0 break-words"
                                    >
                                        {service.capacity || "-"}
                                    </td>
                                ))}
                            </tr>

                            {/* Rooms */}
                            <tr>
                                <td className="border-b border-r border-gray-200 bg-gray-50 p-3 text-xs font-semibold text-gray-600">
                                    Rooms
                                </td>

                                {selectedCompareServices.map((service: any) => (
                                    <td
                                        key={`compare-rooms-${service.id}`}
                                        className="border-b border-r border-gray-200 p-3 text-xs font-semibold text-gray-800 last:border-r-0"
                                    >
                                        {service.number_of_rooms || "-"}
                                    </td>
                                ))}
                            </tr>

                            {/* Experience */}
                            <tr>
                                <td className="border-b border-r border-gray-200 bg-gray-50 p-3 text-xs font-semibold text-gray-600">
                                    Experience
                                </td>

                                {selectedCompareServices.map((service: any) => (
                                    <td
                                        key={`compare-experience-${service.id}`}
                                        className="border-b border-r border-gray-200 p-3 text-xs font-semibold text-gray-800 last:border-r-0 break-words"
                                    >
                                        {service.service_experience || "-"}
                                    </td>
                                ))}
                            </tr>

                            {/* Completed Events */}
                            <tr>
                                <td className="border-b border-r border-gray-200 bg-gray-50 p-3 text-xs font-semibold text-gray-600">
                                    Completed Events
                                </td>

                                {selectedCompareServices.map((service: any) => (
                                    <td
                                        key={`compare-events-${service.id}`}
                                        className="border-b border-r border-gray-200 p-3 text-xs font-semibold text-gray-800 last:border-r-0"
                                    >
                                        {service.completed_events || "0"}
                                    </td>
                                ))}
                            </tr>

                            {/* Location */}
                            <tr>
                                <td className="border-b border-r border-gray-200 bg-gray-50 p-3 text-xs font-semibold text-gray-600">
                                    Location
                                </td>

                                {selectedCompareServices.map((service: any) => (
                                    <td
                                        key={`compare-location-${service.id}`}
                                        className="border-b border-r border-gray-200 p-3 last:border-r-0"
                                    >
                                        <div className="flex items-start gap-1.5 text-xs text-gray-700">
                                            <FiMapPin className="w-3.5 h-3.5 text-pink-700 shrink-0 mt-0.5" />

                                            <span className="break-words">
                                                {service.locality_name || "-"}
                                                {service.city_name &&
                                                    `, ${service.city_name}`}
                                            </span>
                                        </div>
                                    </td>
                                ))}
                            </tr>

                            {/* Facilities */}
                            <tr>
                                <td className="border-b border-r border-gray-200 bg-gray-50 p-3 text-xs font-semibold text-gray-600 align-top">
                                    Facilities
                                </td>

                                {selectedCompareServices.map((service: any) => {
                                    const serviceFacilityIds = service.facility_ids
                                        ? String(service.facility_ids)
                                            .split(",")
                                            .map((id: string) => Number(id.trim()))
                                        : [];

                                    const serviceFacilities = facilityList.filter(
                                        (facility: any) =>
                                            serviceFacilityIds.includes(Number(facility.id))
                                    );

                                    return (
                                        <td
                                            key={`compare-facilities-${service.id}`}
                                            className="border-b border-r border-gray-200 p-3 align-top last:border-r-0"
                                        >
                                            {serviceFacilities.length > 0 ? (
                                                <div className="flex flex-wrap gap-1.5">
                                                    {serviceFacilities.map(
                                                        (facility: any) => (
                                                            <span
                                                                key={`compare-facility-${service.id}-${facility.id}`}
                                                                className="inline-flex rounded-full bg-pink-50 border border-pink-100 px-2 py-1 text-[9px] font-medium text-pink-700 break-words"
                                                            >
                                                                {facility.name}
                                                            </span>
                                                        )
                                                    )}
                                                </div>
                                            ) : (
                                                <span className="text-[10px] text-gray-400">
                                                    No facilities
                                                </span>
                                            )}
                                        </td>
                                    );
                                })}
                            </tr>

                            {/* Highlights */}
                            <tr>
                                <td className="border-r border-gray-200 bg-gray-50 p-3 text-xs font-semibold text-gray-600 align-top">
                                    Highlights
                                </td>

                                {selectedCompareServices.map((service: any) => (
                                    <td
                                        key={`compare-highlights-${service.id}`}
                                        className="border-r border-gray-200 p-3 align-top last:border-r-0"
                                    >
                                        {service.service_highlights?.length > 0 ? (
                                            <div className="space-y-1.5">
                                                {service.service_highlights.map(
                                                    (highlightItem: any) => (
                                                        <div
                                                            key={`compare-highlight-${service.id}-${highlightItem.id}`}
                                                            className="flex items-start gap-1.5 text-[10px] text-gray-600"
                                                        >
                                                            <span className="mt-1 w-2 h-2 rounded-full bg-pink-600 shrink-0" />

                                                            <span className="break-words">
                                                                {highlightItem.highlight}
                                                            </span>
                                                        </div>
                                                    )
                                                )}
                                            </div>
                                        ) : (
                                            <span className="text-[10px] text-gray-400">
                                                No highlights
                                            </span>
                                        )}
                                    </td>
                                ))}
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </PopupModal>


    );
}