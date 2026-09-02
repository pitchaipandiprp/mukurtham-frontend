"use client";

import { FiChevronsDown, FiCalendar, FiChevronDown, FiCrosshair, FiHeart, FiLock, FiMapPin, FiMinus, FiPlus, FiSearch, FiSliders, FiStar, FiUsers, FiWind, FiHome, } from "react-icons/fi";
import { FaBuilding } from "react-icons/fa";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { constants } from "@/utils/constants";
import { common as commonUtils } from "@/utils/common";
import commonRoutes from "@/services/api/common.routes";
import mainRoutes from "@/services/api/main.routes";
import LocalitySelect, { LocalityOption } from "@/components/common/selectbox/locality-select";
import { apiConfig } from "@/environments/api";
import TablePagination from "@/components/common/datatable/pagination";
import RangeSlider from "@/components/common/range-slider/range-slider";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Loading from "@/components/common/loading/loading";
import LocationPicker from "@/components/common/map/openstreetmap/location-picker";
import { sweetalert } from "@/utils/sweetalert";
import { CategoryServiceCompare } from '@/components/pages/main/categories/category-service-compare';
import { GitCompareArrows } from "lucide-react";
import { authUserId } from "@/utils/auth";

const initialSearch = {
    search_text: "",
    category_id: "1",
    state_id: "",
    city_id: "",
    locality_id: "",
    search_date: "",
    min_price_range: "0",
    max_price_range: "500000",
    min_capacity: "0",
    max_capacity: "5000",
    facility_ids: "",
    city_name: "",
    page: 1,
    limit: 3,
};

const capacities = [
    { min: 0, max: 50, label: "0 - 50" },
    { min: 50, max: 100, label: "50 - 100" },
    { min: 100, max: 150, label: "100 - 150" },
    { min: 150, max: 200, label: "150 - 200" },
    { min: 200, max: 250, label: "200 - 250" },
    { min: 250, max: 300, label: "250 - 300" },
    { min: 300, max: 500, label: "300 - 500" },
    { min: 500, max: 1000, label: "500 - 1000" },
    { min: 1000, max: 2000, label: "1000 - 2000" },
    { min: 2000, max: 3000, label: "2000 - 3000" },
    { min: 3000, max: 3000, label: "3000+" },
];


export default function CategoryServiceSearch() {
    const router = useRouter();

    const userId = authUserId();

    const BACKEND_BASE_URL = apiConfig.baseUrl;

    const btnClass = constants.btnClass;
    const buttonClassWhite = constants.buttonClassWhite;
    const buttonClassOrange = constants.buttonClassOrange;

    const [loading, setLoading] = useState(false);
    const [pageNumber, setPageNumber] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [totalRecords, setTotalRecords] = useState(0);

    const [categoryList, setCategoryList] = useState<any[]>([]);
    const [facilityList, setFacilityList] = useState<any[]>([]);

    const [categoryId, setCategoryId] = useState<any>("");
    const [selectedLocality, setSelectedLocality] = useState<LocalityOption | null>(null);
    const [selectedFacilityIds, setSelectedFacilityIds] = useState<number[]>([]);
    const [selectedPriceRange, setSelectedPriceRange] = useState("");
    const [selectedCapacityRange, setSelectedCapacityRange] = useState("");

    const [searchFields, setSearchFields] = useState<any>(initialSearch);
    const [searchServiceData, setSearchServiceData] = useState<any>([]);
    const [searchDate, setSearchDate] = useState<Date | null>(null);

    const [mapLocations, setMapLocations] = useState<any[]>([]);
    const [selectedLatitude, setSelectedLatitude] = useState<number | undefined>(undefined);
    const [selectedLongitude, setSelectedLongitude] = useState<number | undefined>(undefined);

    const searchParams = useSearchParams();
    const searchQuery = searchParams.get("search") ?? "";
    const cityQuery = searchParams.get("city") ?? "";
    const categoryQuery = searchParams.get("category") ?? "";

    const [selectedCompareServices, setSelectedCompareServices] = useState<any[]>([]);
    const [isCompareModalOpen, setIsCompareModalOpen] = useState<boolean>(false);

    useEffect(() => {
        loadCategories();
        loadFacility();
    }, []);

    useEffect(() => {
        fetchServiceData(searchFields);
    }, []);

    useEffect(() => {
        if (!searchQuery && !cityQuery) return;

        setPageNumber(1);
        const updatedFields = {
            ...searchFields,
            search_text: searchQuery,
            city_name: cityQuery,
        };
        setSearchFields(updatedFields);
        fetchServiceData(updatedFields);
    }, [searchQuery, cityQuery]);

    useEffect(() => {
        if (!categoryQuery) return;

        const initializeCategory = async () => {
            const catId = await loadCategories();

            setPageNumber(1);

            const updatedFields = {
                ...searchFields,
                category_id: String(catId),
            };

            setSearchFields(updatedFields);
            fetchServiceData(updatedFields);
        };

        initializeCategory();
    }, [categoryQuery]);


    const loadCategories = async () => {
        const result = await commonRoutes.getCategories();

        const categories = result?.data || [];

        setCategoryList(categories);

        const catId =
            categories.find(
                (cat: any) =>
                    cat.name.toLowerCase() === categoryQuery?.toLowerCase()
            )?.id ?? 1;

        setCategoryId(catId);

        return catId;
    };

    const loadFacility = async () => {
        const result = await commonRoutes.getFacilities({ category_id: categoryId });
        setFacilityList(result?.data || []);
    };

    const fetchServiceData = async (fields: any = searchFields) => {
        try {
            setLoading(true);
            const response = await mainRoutes.categoryServiceSearch(fields);
            const responData = response.data;
            setSearchServiceData(responData.rows || []);
            setTotalPages(responData?.totalPages ?? 0);
            setTotalRecords(responData?.total ?? 0);

            const locations = responData.rows
                .map((item: any) => {
                    const latitude = Number(item.latitude);
                    const longitude = Number(item.longitude);

                    return {
                        id: item.id,
                        name: item.name,
                        latitude,
                        longitude,
                    };
                })
                .filter(
                    (item: any) =>
                        Number.isFinite(item.latitude) &&
                        Number.isFinite(item.longitude) &&
                        item.latitude >= -90 &&
                        item.latitude <= 90 &&
                        item.longitude >= -180 &&
                        item.longitude <= 180
                );

            setMapLocations(locations);

            if (locations.length > 0) {
                setSelectedLatitude(locations[0].latitude);
                setSelectedLongitude(locations[0].longitude);
            } else {
                setSelectedLatitude(undefined);
                setSelectedLongitude(undefined);
            }
        } catch (error) {
            console.error("Search Error:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleCategoryChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const categoryId = event.target.value;

        setCategoryId(Number(categoryId));

        updateFieldsAndSubmit({
            category_id: categoryId,
        });
    };

    const handleLocalityChange = (locality: LocalityOption | null) => {
        setSelectedLocality(locality);

        updateFieldsAndSubmit({
            state_id: String(locality?.stateId ?? ""),
            city_id: String(locality?.cityId ?? ""),
            locality_id: String(locality?.value ?? ""),
        });
    };

    const handlePriceRangeChange = (minValue: number, maxValue: number) => {
        updateFieldsAndSubmit({
            min_price_range: String(minValue),
            max_price_range: String(maxValue),
        });
    };

    const handlePriceChange = (minPrice: any, maxPrice: any) => {
        setSelectedPriceRange(`${minPrice}-${maxPrice}`);

        updateFieldsAndSubmit({
            min_price_range: String(minPrice),
            max_price_range: String(maxPrice),
        });
    };

    const handleCapacityRangeChange = (minValue: number, maxValue: number) => {
        updateFieldsAndSubmit({
            min_capacity: String(minValue),
            max_capacity: String(maxValue),
        });
    };

    const handleCapacityChange = (minCapacity: any, maxCapacity: any) => {
        setSelectedCapacityRange(`${minCapacity}-${maxCapacity}`);

        updateFieldsAndSubmit({
            min_capacity: String(minCapacity),
            max_capacity: String(maxCapacity),
        });
    };

    const handleFacilityChange = (facilityId: number) => {
        setSelectedFacilityIds((prev) => {
            const updatedIds = prev.includes(facilityId)
                ? prev.filter((id) => id !== facilityId)
                : [...prev, facilityId];

            updateFieldsAndSubmit({
                facility_ids: updatedIds.join(","),
            });

            return updatedIds;
        });
    };

    const handleGuestCount = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selected = capacities.find(
            (item) => item.min === Number(event.target.value)
        );

        if (!selected) return;

        updateFieldsAndSubmit({
            min_capacity: String(selected.min),
            max_capacity: String(selected.max),
        });
    };

    const handlePageinationChange = (page: number) => {
        setPageNumber(page);

        fetchServiceData({
            ...searchFields,
            page: String(page),
        });
    };

    const handleSubmit = () => {
        setPageNumber(1);

        fetchServiceData({
            ...searchFields,
            page: "1",
        });
    };

    async function handleReset() {
        setSearchFields(initialSearch);
        setCategoryId(1);
        setSelectedLocality(null);
        setSelectedFacilityIds([]);
        setSelectedPriceRange("");
        setSelectedCapacityRange("");

        fetchServiceData(initialSearch);
        router.push(`/service-search`);
    }

    const updateFieldsAndSubmit = (fields: Partial<any>) => {
        setSearchFields((prev: any) => ({
            ...prev,
            ...fields,
        }));

        setPageNumber(1);

        fetchServiceData({
            ...searchFields,
            ...fields,
            page: "1",
        });
    };

    const handleCompareToggle = (service: any) => {
        setSelectedCompareServices((prev) => {

            const alreadySelected = prev.some(
                (item) => item.id === service.id
            );

            // Remove
            if (alreadySelected) {
                return prev.filter(
                    (item) => item.id !== service.id
                );
            }

            // Maximum 3
            if (prev.length >= 3) {
                sweetalert.error('You can compare a maximum of 3 services at a time.', 'Maximum 3 Services');
                return prev;
            }

            // Add
            return [...prev, service];
        });
    };

    const handleCompare = async () => {
        if (selectedCompareServices.length < 2) {
            sweetalert.error('Please select at least 2 services to compare.');
            return;
        }
        setIsCompareModalOpen(true);
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
                setSearchServiceData((prev: any[]) =>
                    prev.map((item) =>
                        item.id === categoryServiceId ? { ...item, is_wishlisted: purpose === "create", } : item
                    )
                );
                // fetchServiceData(searchFields);
                sweetalert.toastSuccess(response?.message);
            }
        } catch (error) {
            console.error("Wishlist Error:", error);
        }
    };

    return (
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 py-4">
            <div className="hidden md:flex bg-white p-2 rounded-2xl shadow-sm border border-gray-200 items-center justify-between mb-4">
                <div className="flex items-center divide-x divide-gray-200 flex-1">
                    <div className="flex items-center px-4 space-x-2 text-xs font-semibold text-gray-700 w-1/4 cursor-pointer justify-between">
                        <FaBuilding className="w-3.5 h-3.5 text-gray-400" />
                        <select
                            id="categoryId"
                            value={categoryId}
                            onChange={handleCategoryChange}
                            className="w-full bg-transparent py-2 border-none focus:outline-none"
                        >
                            <option value="">All</option>
                            {categoryList.map((item) => (
                                <option key={`category-${item.id}`} value={item.id}>
                                    {item.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="flex items-center px-4 py-2 space-x-2 text-xs font-semibold text-gray-700 w-1/4 cursor-pointer justify-between">
                        <div className="flex items-center space-x-2">
                            <FiCalendar className="w-4 h-4 text-gray-500" />
                            <DatePicker
                                selected={searchDate}
                                onChange={(date: any) => setSearchDate(date)}
                                minDate={new Date()}
                                dateFormat="dd/MM/yyyy"
                                placeholderText="Select Booking Date"
                                showPopperArrow={false}
                                className="w-full outline-none"
                            />
                        </div>
                    </div>

                    <div className="flex items-center px-4 py-2 space-x-2 text-xs font-semibold text-gray-500 w-1/4 cursor-pointer justify-between">
                        <div className="flex items-center space-x-2 w-full">
                            <FiUsers className="w-4 h-4 text-gray-400" />
                            <span className="shrink-0 mr-5">Guest Count</span>

                            <select
                                className="flex-1 border-none outline-none bg-transparent"
                                value={searchFields.min_capacity}
                                onChange={handleGuestCount}
                            >
                                {capacities.map((item: any) => (
                                    <option key={`guest-capacity-min-${item.min}`} value={item.min}>
                                        {item.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                <button onClick={handleSubmit} type="button" className={btnClass}>
                    Search
                </button>
                <button onClick={handleReset} type="button" className={`${buttonClassWhite} ml-5`}>
                    Reset
                </button>
                <button onClick={handleCompare} type="button" className={`${buttonClassOrange} ml-15`}>
                    Compare
                </button>
            </div>

            <div className="md:hidden space-y-3 mb-4">
                <div className="bg-white p-3 rounded-xl border border-gray-200 flex justify-between items-center text-xs font-semibold text-gray-700">
                    <div className="flex items-center space-x-2">
                        <FaBuilding className="w-4 h-4 text-primary" />
                        <select
                            id="categoryId"
                            value={categoryId}
                            onChange={handleCategoryChange}
                            className="w-full bg-transparent border-none focus:outline-none"
                        >
                            <option value="">Select Category</option>
                            {categoryList.map((item) => (
                                <option key={`category-${item.id}`} value={item.id}>
                                    {item.name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="bg-white p-2.5 rounded-xl border border-gray-200 flex items-center space-x-2 text-gray-700 font-medium">
                        <FiCalendar className="w-4 h-4 text-gray-400" />
                        <DatePicker
                            selected={searchDate}
                            onChange={(date: any) => setSearchDate(date)}
                            minDate={new Date()}
                            dateFormat="dd/MM/yyyy"
                            placeholderText="Select Date"
                            showPopperArrow={false}
                            className="w-full outline-none"
                        />
                    </div>
                    <div className="bg-white p-2.5 rounded-xl border border-gray-200 flex items-center justify-between text-gray-400">
                        <div className="flex items-center space-x-2">
                            <FiUsers className="w-4 h-4" />
                            <select
                                className="flex-1 border-none outline-none bg-transparent"
                                value={searchFields.min_capacity}
                                onChange={handleGuestCount}
                            >
                                {capacities.map((item: any) => (
                                    <option key={`guest-capacity-min-${item.min}`} value={item.min}>
                                        {item.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>
                <div className="flex justify-center items-center gap-2">
                    <button onClick={handleSubmit} type="button" className={`${btnClass}`}>Search</button>
                    <button onClick={handleReset} type="button" className={`${buttonClassWhite}`}>Reset</button>
                    <button onClick={handleCompare} type="button" className={`${buttonClassOrange}`}>
                        Compare
                    </button>
                </div>

                {/* <div className="flex justify-between items-center pt-2">
                    <span className="text-xs font-bold text-gray-800">128 Halls in Madurai</span>
                    <div className="flex space-x-2">
                        <button type="button" className="bg-white border border-gray-200 text-xs px-3 py-1.5 rounded-lg flex items-center space-x-1">
                            <FiSliders className="w-3.5 h-3.5" />
                            <span>Filter</span>
                        </button>
                        <button type="button" className="bg-white border border-gray-200 text-xs px-3 py-1.5 rounded-lg flex items-center space-x-1">
                            <FiChevronsDown className="w-3.5 h-3.5" />
                            <span>Sort</span>
                        </button>
                    </div>
                </div> */}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                <aside className="hidden md:block md:col-span-2 bg-white p-5 rounded-2xl border border-gray-200 h-fit space-y-6">
                    <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                        <h2 className="font-bold text-xs uppercase tracking-wider text-gray-800">Filters</h2>
                        <button onClick={handleReset} type="button" className="text-xs text-primary font-semibold hover:text-primary-dark cursor-pointer">Clear All</button>
                    </div>

                    <div className="space-y-3">
                        <label className="text-xs font-bold text-gray-800 block">Location</label>
                        <div className="relative">
                            <LocalitySelect
                                instanceId="main-locality-search"
                                value={selectedLocality}
                                onChange={handleLocalityChange}
                            />
                        </div>
                    </div>

                    <div className="space-y-3 border-t border-gray-100 pt-4">
                        <label className="text-xs font-bold text-gray-800 block">Price Range</label>

                        <RangeSlider
                            min={0}
                            max={500000}
                            minValue={Number(searchFields.min_price_range)}
                            maxValue={Number(searchFields.max_price_range)}
                            step={1000}
                            amountPrefix="₹"
                            onChange={handlePriceRangeChange}
                        />

                        <div className="flex flex-wrap gap-1.5 pt-1">
                            <span
                                onClick={() => handlePriceChange("0", "50000")}
                                className={`cursor-pointer rounded border px-2 py-1 text-[10px] ${selectedPriceRange === "0-50000"
                                    ? "border-pink-600 bg-primary text-white"
                                    : "border-gray-300 bg-gray-100 text-gray-600 hover:bg-pink-50"
                                    }`}
                            >₹0 - ₹50K</span>
                            <span
                                onClick={() => handlePriceChange("50000", "100000")}
                                className={`cursor-pointer rounded border px-2 py-1 text-[10px] ${selectedPriceRange === "50000-100000"
                                    ? "border-pink-600 bg-primary text-white"
                                    : "border-gray-300 bg-gray-100 text-gray-600 hover:bg-pink-50"
                                    }`}
                            >₹50K - ₹1L</span>
                            <span
                                onClick={() => handlePriceChange("100000", "200000")}
                                className={`cursor-pointer rounded border px-2 py-1 text-[10px] ${selectedPriceRange === "100000-200000"
                                    ? "border-pink-600 bg-primary text-white"
                                    : "border-gray-300 bg-gray-100 text-gray-600 hover:bg-pink-50"
                                    }`}
                            >₹1L - ₹2L</span>
                            <span
                                onClick={() => handlePriceChange("200000", "200000")}
                                className={`cursor-pointer rounded border px-2 py-1 text-[10px] ${selectedPriceRange === "200000-200000"
                                    ? "border-pink-600 bg-primary text-white"
                                    : "border-gray-300 bg-gray-100 text-gray-600 hover:bg-pink-50"
                                    }`}
                            >₹2L+</span>
                        </div>
                    </div>

                    <div className="space-y-3 border-t border-gray-100 pt-4">
                        <label className="text-xs font-bold text-gray-800 block">Capacity (Guests)</label>
                        <div className="flex items-center space-x-2">
                            <RangeSlider
                                min={0}
                                max={5000}
                                minValue={Number(searchFields.min_capacity)}
                                maxValue={Number(searchFields.max_capacity)}
                                step={100}
                                onChange={handleCapacityRangeChange}
                            />
                        </div>
                        <div className="flex flex-wrap gap-1.5 pt-1">
                            <span
                                onClick={() => handleCapacityChange("0", "100")}
                                className={`cursor-pointer rounded border px-2 py-1 text-[10px] ${selectedCapacityRange === "0-100"
                                    ? "border-pink-600 bg-primary text-white"
                                    : "border-gray-300 bg-gray-100 text-gray-600 hover:bg-pink-50"
                                    }`}
                            >0 - 100</span>
                            <span
                                onClick={() => handleCapacityChange("100", "300")}
                                className={`cursor-pointer rounded border px-2 py-1 text-[10px] ${selectedCapacityRange === "100-300"
                                    ? "border-pink-600 bg-primary text-white"
                                    : "border-gray-300 bg-gray-100 text-gray-600 hover:bg-pink-50"
                                    }`}
                            >100 - 300</span>
                            <span
                                onClick={() => handleCapacityChange("300", "500")}
                                className={`cursor-pointer rounded border px-2 py-1 text-[10px] ${selectedCapacityRange === "300-500"
                                    ? "border-pink-600 bg-primary text-white"
                                    : "border-gray-300 bg-gray-100 text-gray-600 hover:bg-pink-50"
                                    }`}
                            >300 - 500</span>
                            <span
                                onClick={() => handleCapacityChange("500", "500")}
                                className={`cursor-pointer rounded border px-2 py-1 text-[10px] ${selectedCapacityRange === "500-500"
                                    ? "border-pink-600 bg-primary text-white"
                                    : "border-gray-300 bg-gray-100 text-gray-600 hover:bg-pink-50"
                                    }`}
                            >500+</span>
                        </div>
                    </div>

                    <div className="space-y-2 border-t border-gray-100 pt-4 text-xs font-medium text-gray-600">
                        <label className="text-xs font-bold text-gray-800 block mb-2">Amenities</label>
                        {facilityList.map((amenity) => (
                            <label
                                key={`amenity-${amenity.id}`}
                                className="flex items-center space-x-2 cursor-pointer"
                            >
                                <input
                                    type="checkbox"
                                    value={amenity.id}
                                    checked={selectedFacilityIds.includes(amenity.id)}
                                    onChange={() => handleFacilityChange(amenity.id)}
                                    className="rounded accent-primary"
                                />
                                <span>{amenity.name}</span>
                            </label>
                        ))}
                    </div>

                    <div className="space-y-2 border-t border-gray-100 pt-4">
                        <button onClick={handleSubmit} type="button" className={`${btnClass} w-full text-xs font-bold`}>
                            Apply Filters
                        </button>
                        <button onClick={handleReset} type="button" className={`${buttonClassWhite} w-full text-xs font-bold`}>
                            Reset
                        </button>
                    </div>
                </aside>

                <main className="col-span-1 md:col-span-6 space-y-4">
                    {loading ? (
                        <Loading message="Loading services..." />
                    ) : (
                        <>
                            <div className="hidden md:flex justify-between items-center">
                                <span className="text-sm font-bold text-gray-800">{totalRecords} Records Found</span>
                            </div>

                            {searchServiceData.map((serviceData: any) => (
                                <div key={`service-records-${serviceData.id}`} className="bg-white rounded-2xl p-3 border border-gray-200 flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 relative shadow-sm">
                                    <div className="sm:w-2/5 h-40 sm:h-40 rounded-xl overflow-hidden relative group">
                                        <img
                                            src={serviceData.service_banner_image ? `${BACKEND_BASE_URL}/${serviceData.service_banner_image}` : `${BACKEND_BASE_URL}/storage/uploads/services/sample.jpg`}
                                            className="w-full h-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-110 group-hover:opacity-90"
                                            alt={serviceData.service_name}
                                        />
                                        <span className="absolute top-2 left-2 bg-primary text-white text-[9px] uppercase font-bold px-2 py-0.5 rounded">Popular</span>
                                    </div>
                                    <div className="sm:w-3/5 space-y-2 flex flex-col justify-between">
                                        <div>
                                            <div className="flex justify-between items-start">
                                                <h3 className="font-bold text-sm text-gray-800">{serviceData?.service_name}</h3>
                                                <div className="flex items-center text-xs font-semibold text-amber-600">
                                                    <button
                                                        type="button"
                                                        className={`cursor-pointer mr-2 p-1 transition-colors duration-200 ${serviceData.is_wishlisted ? "text-primary" : "text-gray-400 hover:text-primary"}`}
                                                        onClick={() => addToWishlists(serviceData.id, serviceData.is_wishlisted ? "remove" : "create")}
                                                    >
                                                        <FiHeart className={`w-4 h-4 ${serviceData.is_wishlisted ? "fill-current" : ""}`} />
                                                    </button>
                                                    <FiStar className="w-3.5 h-3.5 fill-amber-500 text-amber-500 mr-1" />
                                                    <span>{serviceData?.averageRating ?? '0'}</span> <span className="text-gray-400 text-[10px] ml-0.5">({serviceData?.totalReviews ?? '0'})</span>
                                                </div>
                                            </div>
                                            <p className="text-[11px] text-gray-500 flex items-center mt-0.5">
                                                <FiMapPin className="w-3 h-3 mr-1 text-primary" /> {serviceData?.locality_name}, {serviceData?.city_name}
                                            </p>

                                            <div className="flex items-center space-x-3 text-[10px] text-gray-600 mt-2 font-medium">
                                                <div><span className="font-bold text-gray-800 block text-xs">{serviceData.capacity}</span> Seating Capacity</div>
                                                <div><span className="font-bold text-gray-800 block text-xs">{serviceData.number_of_rooms}</span> Rooms</div>
                                            </div>

                                            <p className="text-[10px] text-gray-500 mt-2 line-clamp-2">{serviceData.service_description}</p>

                                            <div className="flex flex-wrap gap-1 mt-2 text-[9px] text-gray-500">
                                                {facilityList.slice(0, 5).map((tag) => (
                                                    <span key={`facility-tag-${tag.id}`} className="bg-gray-100 px-1.5 py-0.5 rounded">{tag.name}</span>
                                                ))}
                                                {/* <span className="text-primary font-semibold">More</span> */}
                                            </div>
                                        </div>

                                        <div className="flex justify-between items-center border-t border-gray-100 pt-2">
                                            <div>
                                                <span className="text-[9px] text-gray-400 block">Starting from</span>
                                                <span className="font-bold text-sm text-gray-900">{commonUtils.formatAmount(serviceData.final_amount)}</span>
                                            </div>

                                            <button
                                                type="button"
                                                className={selectedCompareServices.some((item) => item.id === serviceData.id) ? buttonClassOrange : buttonClassWhite}
                                                onClick={() => handleCompareToggle(serviceData)}
                                                title={selectedCompareServices.some((item) => item.id === serviceData.id) ? "Remove from Compare" : "Add to Compare"}
                                            >
                                                <GitCompareArrows className="w-4 h-4" />
                                            </button>

                                            <button type="button" className={btnClass}>
                                                <Link href={`/service-details?serviceId=${serviceData.id}`}>
                                                    View Details
                                                </Link>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}

                            <div>
                                <TablePagination
                                    size={3}
                                    page={pageNumber}
                                    totalPages={totalPages}
                                    totalRecords={totalRecords}
                                    onPageChange={handlePageinationChange}
                                />
                            </div>
                        </>
                    )}
                </main>

                <aside className="col-span-1 md:col-span-4 relative min-h-[500px] md:min-h-full overflow-hidden border border-gray-200">
                    <LocationPicker
                        latitude={selectedLatitude}
                        longitude={selectedLongitude}
                        locations={mapLocations}
                        multipleMarkers={true}
                        onChange={(lat, lng) => {
                            setSelectedLatitude(lat);
                            setSelectedLongitude(lng);
                        }}
                    />
                </aside>
            </div>

            <CategoryServiceCompare isCompareModalOpen={isCompareModalOpen} compareModalClose={() => setIsCompareModalOpen(false)} categoryId={categoryId} categoryServiceIds={[]} selectedCompareServices={selectedCompareServices} />
        </div>
    );
}
