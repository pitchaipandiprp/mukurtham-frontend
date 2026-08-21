
"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Plus, Trash2 } from "lucide-react";
import { sweetalert } from "@/utils/sweetalert";
import { constants } from "@/utils/constants";
import { vendorRoutes } from "@/services/api/vendor.routes";
import commonRoutes from "@/services/api/common.routes";
import LocalitySelect, { LocalityOption } from "@/components/common/selectbox/locality-select";
import { apiConfig } from "@/environments/api";
import LocationPicker from "@/components/common/map/openstreetmap/location-picker";

type CategoryServiceForm = {
    category_id: string;
    state_id: string;
    city_id: string;
    locality_id: string;
    service_name: string;
    service_mobile: string;
    service_email: string;
    service_experience: string;
    completed_events: string;
    service_description: string;
    service_address: string;
    service_banner_image: File | null;
    capacity: string;
    number_of_rooms: string;
    facility_ids: string;
    latitude: string;
    longitude: string;
    pricing_type: string;
    amount: string;
    discount: string;
    tax_percentage: string;
    status: string;
};

const initialForm: CategoryServiceForm = {
    category_id: "",
    state_id: "",
    city_id: "",
    locality_id: "",
    service_name: "",
    service_mobile: "",
    service_email: "",
    service_experience: "",
    completed_events: "",
    service_description: "",
    service_address: "",
    service_banner_image: null,
    capacity: "0",
    number_of_rooms: "0",
    facility_ids: "",
    latitude: "",
    longitude: "",
    pricing_type: "",
    amount: "0",
    discount: "0",
    tax_percentage: "0",
    status: "1",
};

const categoryFields: Record<string, number[]> = {
    service_name: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    service_mobile: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    service_email: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    service_experience: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    completed_events: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    state_id: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    city_id: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    locality_id: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    service_address: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    service_description: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    amenities: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    payment: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    banner_image: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    highlights: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    capacity: [1],
    number_of_rooms: [1],
    map_location: [1],
};

export default function CreateCategoryService() {
    const router = useRouter();
    const [form, setForm] = useState<CategoryServiceForm>(initialForm);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [selectedLocality, setSelectedLocality] = useState<LocalityOption | null>(null);
    const [categoryList, setCategoryList] = useState<any[]>([]);
    const [bannerPreview, setBannerPreview] = useState<string | null>(null);

    const [facilityList, setFacilityList] = useState<any[]>([]);
    const [selectedFacilityIds, setSelectedFacilityIds] = useState<number[]>([]);
    const [highlights, setHighlights] = useState<string[]>([""]);

    const searchParams = useSearchParams();
    const categoryServiceId = searchParams.get("id");
    const isEditMode = Boolean(categoryServiceId);

    const inputClass = constants.inputClass;
    const buttonClass = constants.buttonClass;
    const buttonClassSubmit = constants.buttonClassSubmit;

    useEffect(() => {
        loadCategories();
        if (categoryServiceId) {
            loadCategoryService();
        }
    }, [categoryServiceId]);

    useEffect(() => {
        loadFacility();
    }, [form.category_id]);

    const loadCategories = async () => {
        const result = await commonRoutes.getCategories();
        setCategoryList(result?.data || []);
    };

    const loadFacility = async () => {
        const result = await commonRoutes.getFacilities({ category_id: form.category_id });
        setFacilityList(result?.data || []);
    };

    const showField = (field: string) => {
        return categoryFields[field]?.includes(Number(form.category_id)) ?? false;
    };

    const loadCategoryService = async () => {
        setError("");

        try {
            if (!categoryServiceId) {
                setError("Invalid service ID");
                return;
            }

            const result = await vendorRoutes.getCategoryService({ id: Number(categoryServiceId) });

            if (!result?.success) {
                return;
            }

            if (!result.data || result.data.length === 0) {
                const swalConfirm = await sweetalert.warning("Something went wrong");
                if (swalConfirm.isConfirmed) {
                    router.push("/panel/category-service-list");
                }
            }

            const serviceData = result.data;
            const BACKEND_BASE_URL = apiConfig.baseUrl;

            setForm({
                category_id: serviceData.category_id ?? "",
                state_id: serviceData.state_id ?? "",
                city_id: serviceData.city_id ?? "",
                locality_id: serviceData.locality_id ?? "",
                service_name: serviceData.service_name ?? "",
                service_mobile: serviceData.service_mobile ?? "",
                service_email: serviceData.service_email ?? "",
                service_experience: serviceData.service_experience ?? "",
                completed_events: serviceData.completed_events ?? "",
                service_description: serviceData.service_description ?? "",
                service_address: serviceData.service_address ?? "",
                service_banner_image: serviceData.service_banner_image ?? "",
                capacity: String(serviceData.capacity ?? ""),
                number_of_rooms: String(serviceData.number_of_rooms ?? 0),
                facility_ids: serviceData.facility_ids ?? "",
                latitude: serviceData.latitude ?? "9.9252",
                longitude: serviceData.longitude ?? "78.1198",
                pricing_type: serviceData.pricing_type ?? "",
                amount: String(serviceData.amount ?? 0),
                discount: String(serviceData.discount ?? 0),
                tax_percentage: String(serviceData.tax_percentage ?? 0),
                status: serviceData.status,
            });

            setSelectedLocality({
                value: Number(serviceData.locality_id),
                label: String(serviceData?.locality?.name + (serviceData?.city?.name ? `, ${serviceData.city.name}` : "") + (serviceData?.state?.name ? `, ${serviceData.state.name}` : "")),
                stateId: Number(serviceData.state_id),
                cityId: Number(serviceData.city_id),
                stateName: String(serviceData?.state?.name),
                cityName: String(serviceData?.city?.name),
            });

            setSelectedFacilityIds(
                serviceData.facility_ids
                    ? serviceData.facility_ids.split(",").map(Number)
                    : []
            );

            setHighlights(
                serviceData.service_highlights?.length > 0
                    ? serviceData.service_highlights.map(
                        (item: any) => item.highlight
                    )
                    : [""]
            );

            setBannerPreview(serviceData.service_banner_image ? `${BACKEND_BASE_URL}/${serviceData.service_banner_image}` : null);

        } catch (caughtError) {
            console.error("Failed to load category service:", caughtError);
        } finally {
        }
    };

    const handleCategoryChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const categoryId = event.target.value;
        const id = Number(categoryId);

        updateField("category_id", categoryId);

        Object.entries(categoryFields).forEach(([field, categories]) => {
            if (!categories.includes(id)) {
                updateField(field as keyof CategoryServiceForm, "");
            }
        });
    };

    const handleLocalityChange = (locality: LocalityOption | null) => {
        setSelectedLocality(locality);

        setForm((prev) => ({
            ...prev,
            locality_id: locality ? String(locality.value) : "",
            state_id: locality ? String(locality.stateId) : "",
            city_id: locality ? String(locality.cityId) : "",
        }));
    };

    const handleFacilityChange = (facilityId: number) => {
        setSelectedFacilityIds((prev) => {
            const updatedFacilityIds = prev.includes(facilityId)
                ? prev.filter((id) => id !== facilityId)
                : [...prev, facilityId];

            updateField("facility_ids", updatedFacilityIds.join(","));

            return updatedFacilityIds;
        });
    };

    const handleBannerImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0] || null;

        if (!file) {
            return;
        }

        // Validate file type
        if (!file.type.startsWith("image/")) {
            sweetalert.toastError("Please select a valid image");
            return;
        }

        // Validate file size - 5MB
        if (file.size > 5 * 1024 * 1024) {
            sweetalert.toastError("Banner image must be less than 5MB");
            return;
        }

        setError("");

        setForm((prev) => ({
            ...prev,
            service_banner_image: file,
        }));

        setBannerPreview(URL.createObjectURL(file));
    };

    //Dynamic Highlight
    const addHighlight = () => {
        setHighlights((prev) => [...prev, ""]);
    };
    const removeHighlight = (index: number) => {
        setHighlights((prev) => {
            const updated = prev.filter((_, i) => i !== index);

            // Always keep at least one row
            return updated.length > 0 ? updated : [""];
        });
    };
    const updateHighlight = (index: number, value: string) => {
        setHighlights((prev) => {
            const updated = [...prev];
            updated[index] = value;
            return updated;
        });
    };
    //Dynamic Highlight

    const updateField = (field: keyof CategoryServiceForm, value: string) => {
        setForm((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setError("");

        const nameRegex = /^[a-zA-Z0-9 ]+$/;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const mobileRegex = /^[0-9+\-\s]+$/;

        if (!form.category_id) {
            sweetalert.toastError("Please select a category");
            return;
        }

        if (!form.service_name.trim()) {
            sweetalert.toastError("Please enter the Business / Service name");
            return;
        }
        if (!nameRegex.test(form.service_name)) {
            sweetalert.toastError("Please enter a valid name. Only letters and numbers are allowed");
            return;
        }

        if (showField("service_mobile")) {
            if (!form.service_mobile.trim()) {
                sweetalert.toastError("Please enter the mobile number");
                return;
            }
            if (!mobileRegex.test(form.service_mobile)) {
                sweetalert.toastError("Please enter a valid mobile number");
                return;
            }
        }

        if (showField("service_email")) {
            if (form.service_email && !emailRegex.test(form.service_email)) {
                sweetalert.toastError("Please enter a valid email address");
                return;
            }
        }

        if (showField("capacity")) {
            if (!form.capacity.trim() || isNaN(Number(form.capacity)) || Number(form.capacity) <= 0) {
                sweetalert.toastError("Please enter the capacity");
                return;
            }
        }

        if (showField("number_of_rooms")) {
            if (isNaN(Number(form.number_of_rooms))) {
                sweetalert.toastError("Please enter the valid number of rooms");
                return;
            }
        }

        if (showField("locality_id")) {
            if (!form.locality_id || !form.state_id || !form.city_id) {
                sweetalert.toastError("Please select a locality");
                return;
            }
        }

        if (showField("service_address")) {
            if (!form.service_address.trim()) {
                sweetalert.toastError("Please enter the address");
                return;
            }
        }

        if (showField("service_description")) {
            if (!form.service_description.trim()) {
                sweetalert.toastError("Please enter the description");
                return;
            }
        }

        if (showField("payment")) {
            if (!form.pricing_type.trim()) {
                sweetalert.toastError("Please select the pricing type");
                return;
            }

            if (!form.amount.trim()) {
                sweetalert.toastError("Please enter the amount");
                return;
            }
            if (isNaN(Number(form.amount)) || Number(form.amount) <= 0) {
                sweetalert.toastError("Please enter a valid amount");
                return;
            }

            if (isNaN(Number(form.discount)) || Number(form.discount) < 0) {
                sweetalert.toastError("Please enter a valid discount");
                return;
            }
            if (isNaN(Number(form.tax_percentage)) || Number(form.tax_percentage) < 0) {
                sweetalert.toastError("Please enter a valid tax percentage");
                return;
            }
        }

        if (showField("banner_image")) {
            if (!form.service_banner_image) {
                sweetalert.toastError("Please upload the banner image");
                return;
            }
        }

        const validHighlights = highlights
            .map((item) => item.trim())
            .filter(Boolean);

        const uniqueHighlights = [
            ...new Set(validHighlights.map((item) => item.toLowerCase())),
        ];

        if (uniqueHighlights.length !== validHighlights.length) {
            sweetalert.toastError("Duplicate highlights are not allowed");
            return;
        }

        setLoading(true);

        //Create a FormData object to send the data as multipart/form-data
        const formData = new FormData();

        formData.append("category_id", form.category_id);
        formData.append("state_id", form.state_id);
        formData.append("city_id", form.city_id);
        formData.append("locality_id", form.locality_id);

        formData.append("service_name", form.service_name);
        formData.append("service_mobile", form.service_mobile);
        formData.append("service_email", form.service_email);
        formData.append("service_experience", form.service_experience);
        formData.append("completed_events", form.completed_events);
        formData.append("service_description", form.service_description);
        formData.append("service_address", form.service_address);

        if (form.service_banner_image) {
            formData.append(
                "service_banner_image",
                form.service_banner_image
            );
        }

        formData.append("capacity", form.capacity);
        formData.append(
            "number_of_rooms",
            form.number_of_rooms
        );
        formData.append("facility_ids", form.facility_ids);

        formData.append("latitude", form.latitude);
        formData.append("longitude", form.longitude);

        formData.append("pricing_type", form.pricing_type);
        formData.append("amount", form.amount);
        formData.append("discount", form.discount);
        formData.append(
            "tax_percentage",
            form.tax_percentage
        );
        formData.append("status", form.status);

        validHighlights.forEach((highlight) => {
            formData.append("highlights[]", highlight);
        });

        if (isEditMode) {
            formData.append("id", categoryServiceId!);
        }

        try {
            const result = await vendorRoutes.createCategoryService(formData);

            if (result?.success) {
                await sweetalert.success(result.message);
                // router.push("/panel/category-service-list");
            }
        } catch (caughtError) {
            console.error("Create category service failed:", caughtError);
        } finally {
            setLoading(false);
        }
    }


    return (
        <div className="d-block">
            <div className="mb-6 ml-1 flex items-center justify-between">
                <span className="text-2xl font-semibold leading-none text-slate-600">Business / Service</span>
                <Link href="/panel/category-service-list" className={buttonClass}> Business Lists</Link>
            </div>

            <div className="min-h-full px-4 py-4 rounded-xl border border-primary/10 bg-white shadow-sm">
                <form onSubmit={handleSubmit} autoComplete="off">
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-5">
                        <div className="md:col-span-12">
                            <h2 className="text-lg font-semibold text-primary">
                                Basic Information
                            </h2>
                        </div>
                        {(!isEditMode) && (
                            <div className="md:col-span-4">
                                <label htmlFor="serviceName" className="mb-2 block text-sm font-medium text-gray-700">
                                    Category
                                </label>
                                <select
                                    id="categoryId"
                                    value={form.category_id}
                                    onChange={(event) => handleCategoryChange(event)}
                                    className={inputClass}
                                >
                                    <option value="">Select Category</option>
                                    {categoryList.map((item) => (
                                        <option key={item.id} value={item.id}>
                                            {item.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}

                        {showField("service_name") && (
                            <div className="md:col-span-4">
                                <label htmlFor="serviceName" className="mb-2 block text-sm font-medium text-gray-700">
                                    Business Name
                                </label>
                                <input
                                    id="serviceName"
                                    type="text"
                                    placeholder="Enter business / service name"
                                    className={inputClass}
                                    value={form.service_name}
                                    onChange={(event) => updateField("service_name", event.target.value)}
                                />
                            </div>
                        )}

                        {showField("service_mobile") && (
                            <div className="md:col-span-4">
                                <label htmlFor="serviceMobile" className="mb-2 block text-sm font-medium text-gray-700">
                                    Mobile Number
                                </label>
                                <input
                                    id="serviceMobile"
                                    type="text"
                                    placeholder="Enter mobile number"
                                    className={inputClass}
                                    value={form.service_mobile}
                                    onChange={(event) => updateField("service_mobile", event.target.value)}
                                />
                            </div>
                        )}

                        {showField("service_email") && (
                            <div className="md:col-span-4">
                                <label htmlFor="serviceEmail" className="mb-2 block text-sm font-medium text-gray-700">
                                    Email
                                </label>
                                <input
                                    id="serviceEmail"
                                    type="text"
                                    placeholder="Enter email"
                                    className={inputClass}
                                    value={form.service_email}
                                    onChange={(event) => updateField("service_email", event.target.value)}
                                />
                            </div>
                        )}


                        {showField("capacity") && (
                            <div className="md:col-span-4">
                                <label htmlFor="capacity" className="mb-2 block text-sm font-medium text-gray-700">
                                    Capacity
                                </label>
                                <input
                                    id="capacity"
                                    type="text"
                                    placeholder="Enter capacity"
                                    className={inputClass}
                                    value={form.capacity}
                                    onChange={(event) => updateField("capacity", event.target.value)}
                                />
                            </div>
                        )}


                        {showField("number_of_rooms") && (
                            <div className="md:col-span-4">
                                <label htmlFor="numberOfRooms" className="mb-2 block text-sm font-medium text-gray-700">
                                    Number of Rooms
                                </label>
                                <input
                                    id="numberOfRooms"
                                    type="text"
                                    placeholder="Enter number of rooms"
                                    className={inputClass}
                                    value={form.number_of_rooms}
                                    onChange={(event) => updateField("number_of_rooms", event.target.value)}
                                />
                            </div>
                        )}

                        {showField("service_experience") && (
                            <div className="md:col-span-4">
                                <label htmlFor="serviceExperience" className="mb-2 block text-sm font-medium text-gray-700">
                                    Service Experience
                                </label>
                                <input
                                    id="serviceExperience"
                                    type="text"
                                    placeholder="Enter service experience"
                                    className={inputClass}
                                    value={form.service_experience}
                                    onChange={(event) => updateField("service_experience", event.target.value)}
                                />
                            </div>
                        )}

                        {showField("completed_events") && (
                            <div className="md:col-span-4">
                                <label htmlFor="completedEvents" className="mb-2 block text-sm font-medium text-gray-700">
                                    Completed Events
                                </label>
                                <input
                                    id="completedEvents"
                                    type="text"
                                    placeholder="Enter completed events"
                                    className={inputClass}
                                    value={form.completed_events}
                                    onChange={(event) => updateField("completed_events", event.target.value)}
                                />
                            </div>
                        )}


                        {showField("locality_id") && (
                            <>
                                <div className="md:col-span-4 mb-4">
                                    <label htmlFor="localityId" className="mb-2 block text-sm font-medium text-gray-700">
                                        Locality
                                    </label>
                                    <LocalitySelect
                                        instanceId="locality-search"
                                        value={selectedLocality}
                                        onChange={handleLocalityChange}
                                    />
                                </div>

                                <div className="md:col-span-4 hidden">
                                    <label htmlFor="cityId" className="mb-2 block text-sm font-medium text-gray-700">
                                        City
                                    </label>
                                    <input
                                        id="cityId"
                                        type="text"
                                        placeholder="Enter city"
                                        className={inputClass}
                                        value={form.city_id}
                                        onChange={(event) => updateField("city_id", event.target.value)}
                                    />
                                </div>

                                <div className="md:col-span-4 hidden">
                                    <label htmlFor="stateId" className="mb-2 block text-sm font-medium text-gray-700">
                                        State
                                    </label>
                                    <input
                                        id="stateId"
                                        type="text"
                                        placeholder="Enter state"
                                        className={inputClass}
                                        value={form.state_id}
                                        onChange={(event) => updateField("state_id", event.target.value)}
                                    />
                                </div>
                            </>
                        )}

                        {showField("service_address") && (
                            <div className="md:col-span-4">
                                <label htmlFor="fullAddress" className="mb-2 block text-sm font-medium text-gray-700">
                                    Address
                                </label>
                                <input
                                    id="fullAddress"
                                    type="text"
                                    placeholder="Enter service address"
                                    className={inputClass}
                                    value={form.service_address}
                                    onChange={(event) => updateField("service_address", event.target.value)}
                                />
                            </div>
                        )}

                        {showField("service_description") && (
                            <div className="md:col-span-12">
                                <label htmlFor="serviceDescription" className="mb-2 block text-sm font-medium text-gray-700">
                                    Description / Overview
                                </label>
                                <textarea
                                    id="serviceDescription"
                                    placeholder="Enter service description"
                                    rows={2}
                                    className={inputClass}
                                    value={form.service_description}
                                    onChange={(event) => updateField("service_description", event.target.value)}
                                ></textarea>
                            </div>
                        )}

                        {showField("amenities") && (
                            <>
                                <div className="md:col-span-12 mt-4">
                                    <h2 className="text-lg font-semibold text-primary">
                                        Amenities
                                    </h2>
                                </div>

                                <div className="md:col-span-12">
                                    <div className="flex flex-wrap gap-5 mb-4">
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
                                </div>
                            </>
                        )}

                        {showField("amenities") && (
                            <>
                                <div className="md:col-span-12 mt-4">
                                    <h2 className="text-lg font-semibold text-primary">
                                        Payment
                                    </h2>
                                </div>

                                <div className="md:col-span-4">
                                    <label htmlFor="pricingType" className="mb-2 block text-sm font-medium text-gray-700">
                                        Pricing Type
                                    </label>
                                    <select
                                        id="pricingType"
                                        value={form.pricing_type}
                                        onChange={(event) => updateField("pricing_type", event.target.value)}
                                        className={inputClass}
                                    >
                                        <option value="">Select pricing type</option>
                                        <option value="Fixed">Fixed</option>
                                        <option value="Per Day">Per Day</option>
                                        <option value="Per Hour">Per Hour</option>
                                    </select>
                                </div>

                                <div className="md:col-span-4">
                                    <label htmlFor="amount" className="mb-2 block text-sm font-medium text-gray-700">
                                        Amount
                                    </label>
                                    <input
                                        id="amount"
                                        type="text"
                                        placeholder="Enter amount"
                                        className={inputClass}
                                        value={form.amount}
                                        onChange={(event) => updateField("amount", event.target.value)}
                                    />
                                </div>

                                <div className="md:col-span-4">
                                    <label htmlFor="discount" className="mb-2 block text-sm font-medium text-gray-700">
                                        Discount
                                    </label>
                                    <input
                                        id="discount"
                                        type="text"
                                        placeholder="Enter discount"
                                        className={inputClass}
                                        value={form.discount}
                                        onChange={(event) => updateField("discount", event.target.value)}
                                    />
                                </div>

                                <div className="md:col-span-4">
                                    <label htmlFor="taxPercentage" className="mb-2 block text-sm font-medium text-gray-700">
                                        Tax Percentage
                                    </label>
                                    <input
                                        id="taxPercentage"
                                        type="text"
                                        placeholder="Enter tax percentage"
                                        className={inputClass}
                                        value={form.tax_percentage}
                                        onChange={(event) => updateField("tax_percentage", event.target.value)}
                                    />
                                </div>
                            </>
                        )}


                        {showField("banner_image") && (
                            <div className="md:col-span-12 mb-3">
                                <h2 className="text-lg font-semibold text-primary">
                                    Banner Image
                                </h2>
                                <div className="flex items-center gap-3">
                                    <label
                                        htmlFor="serviceBannerImage"
                                        className={buttonClass}
                                    >
                                        Browse
                                    </label>

                                    <input
                                        id="serviceBannerImage"
                                        type="file"
                                        accept="image/jpeg,image/png,image/webp"
                                        onChange={handleBannerImageChange}
                                        className="hidden"
                                    />

                                    <span className="text-sm text-slate-500">
                                        {form.service_banner_image ? '' : "No image selected"}
                                    </span>
                                </div>
                                {bannerPreview && (
                                    <div className="mt-5">
                                        <img
                                            src={bannerPreview}
                                            alt="Banner Preview"
                                            className="h-15 w-50 rounded-xl object-cover shadow-md"
                                        />
                                    </div>
                                )}
                            </div>
                        )}

                        {showField("highlights") && (
                            <div className="md:col-span-4 mt-4">
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <h2 className="text-lg font-semibold text-primary">
                                            Highlights
                                        </h2>

                                        <button
                                            type="button"
                                            onClick={addHighlight}
                                            className="inline-flex items-center gap-1 rounded-md bg-primary px-3 py-2 text-xs font-semibold text-white hover:bg-primary/90"
                                        >
                                            <Plus className="h-4 w-4" />
                                        </button>
                                    </div>

                                    {highlights.map((highlight, index) => (
                                        <div key={`dynamic-highlight-${index}`} className="flex items-center gap-2">
                                            <input
                                                type="text"
                                                value={highlight}
                                                onChange={(event) =>
                                                    updateHighlight(index, event.target.value)
                                                }
                                                placeholder={`Enter highlight ${index + 1}`}
                                                className={inputClass}
                                            />

                                            <button
                                                type="button"
                                                onClick={() => removeHighlight(index)}
                                                disabled={highlights.length === 1}
                                                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-red-100 text-red-600 hover:bg-red-200 disabled:cursor-not-allowed disabled:opacity-40"
                                                title="Remove"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </div>
                                    ))}

                                </div>
                            </div>
                        )}
                        <div className="md:col-span-1 mt-4"></div>
                        {showField("map_location") && (
                            <div className="md:col-span-7 mt-4">
                                <h2 className="text-lg font-semibold text-primary">
                                    Map Location
                                </h2>
                                <div className="md:col-span-12 mb-3">
                                    <div className="flex items-center gap-4">
                                        <input
                                            id="serviceLatitude"
                                            type="text"
                                            value={form.latitude}
                                            readOnly
                                            className={inputClass}
                                            onChange={(event) => updateField("latitude", event.target.value)}
                                        />
                                        <input
                                            id="serviceLongitude"
                                            type="text"
                                            value={form.longitude}
                                            readOnly
                                            className={inputClass}
                                            onChange={(event) => updateField("longitude", event.target.value)}
                                        />
                                    </div>
                                </div>
                                <div className="md:col-span-12">
                                    <LocationPicker
                                        latitude={parseFloat(form.latitude)}
                                        longitude={parseFloat(form.longitude)}
                                        onChange={(lat, lng) => {
                                            updateField("latitude", String(lat));
                                            updateField("longitude", String(lng));
                                        }}
                                    />
                                </div>
                            </div>
                        )}

                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-5">
                        {error && <div className="md:col-span-12 text-sm text-rose-600">{error}</div>}
                        {form.category_id && showField("service_name") && (
                            <div className="md:col-span-12 flex justify-end">
                                <button
                                    type="submit"
                                    className={buttonClassSubmit}
                                    disabled={loading}
                                >
                                    {loading ? "Saving..." : "Save"}
                                </button>
                            </div>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
}