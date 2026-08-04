
"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { vendorService } from "@/services/vendor/vendor.service";
import commonService from "@/services/common/common.service";
import { sweetalert } from "@/utils/sweetalert";
import LocalitySelect, { LocalityOption } from "@/components/common/locality-select";
import { common } from "@/utils/common";


type IndividualServiceForm = {
    category_id: string;
    state_id: string;
    city_id: string;
    locality_id: string;
    service_name: string;
    service_description: string;
    service_address: string;
    service_banner_image: File | null;
    capacity: string;
    number_of_rooms: string;
    car_parking: string;
    ac_available: string;
    latitude: string;
    longitude: string;
    pricing_type: string;
    amount: string;
    discount: string;
    tax_percentage: string;
    status: string;
};

const initialForm: IndividualServiceForm = {
    category_id: "",
    state_id: "",
    city_id: "",
    locality_id: "",
    service_name: "",
    service_description: "",
    service_address: "",
    service_banner_image: null,
    capacity: "",
    car_parking: "",
    ac_available: "",
    number_of_rooms: "0",
    latitude: "",
    longitude: "",
    pricing_type: "",
    amount: "0",
    discount: "0",
    tax_percentage: "0",
    status: "0",
};


export default function AddIndividualService() {
    const [form, setForm] = useState<IndividualServiceForm>(initialForm);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [selectedLocality, setSelectedLocality] = useState<LocalityOption | null>(null);
    const [categories, setCategories] = useState<any[]>([]);
    const [bannerPreview, setBannerPreview] = useState<string | null>(null);

    useEffect(() => {
        loadCategories();
    }, []);

    const loadCategories = async () => {
        const result = await commonService.getCategories();
        setCategories(result?.data || []);
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

    const updateField = (field: keyof IndividualServiceForm, value: string) => {
        setForm((prev) => ({
            ...prev,
            [field]: value,
        }));
    };


    const handleBannerImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0] || null;

        if (!file) {
            return;
        }

        // Validate file type
        if (!file.type.startsWith("image/")) {
            setError("Please select a valid image");
            return;
        }

        // Validate file size - 5MB
        if (file.size > 5 * 1024 * 1024) {
            setError("Banner image must be less than 5MB");
            return;
        }

        setError("");

        setForm((prev) => ({
            ...prev,
            service_banner_image: file,
        }));

        setBannerPreview(URL.createObjectURL(file));
    };

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setError("");

        if (!form.category_id) {
            setError("Category is required");
            return;
        }

        if (!form.service_name.trim()) {
            setError("Service name is required");
            return;
        }

        if (!form.service_description.trim()) {
            setError("Description is required");
            return;
        }

        if (!form.amount.trim()) {
            setError("Amount is required");
            return;
        }

        if (!form.locality_id || !form.state_id || !form.city_id) {
            setError("Locality is required");
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
        formData.append("car_parking", form.car_parking);
        formData.append("ac_available", form.ac_available);

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

        try {
            const result = await vendorService.createIndividualService(formData);

            if (result?.success) {
                // setForm(initialForm);
                await sweetalert.success(result.message || "Individual service created successfully");
            }
        } catch (caughtError) {
            console.error("Create individual service failed:", caughtError);
        } finally {
            setLoading(false);
        }
    }

    const inputClassName = common.inputClass;
    const buttonClassName = common.buttonClass;

    return (
        <div className="d-block">
            <div className="mb-6">
                <h3 className="text-2xl font-black text-slate-900 tracking-tight">Add Individual Service</h3>
            </div>

            <div className="min-h-full px-4 py-4 rounded-lg border border-primary/10 bg-white shadow-sm">
                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-5">
                        <div className="md:col-span-12">
                            <h2 className="text-lg font-semibold text-primary">
                                Basic Information
                            </h2>
                        </div>

                        <div className="md:col-span-4">
                            <label htmlFor="status" className="mb-2 block text-sm font-medium text-gray-700">
                                Status
                            </label>
                            <select
                                id="status"
                                value={form.status}
                                onChange={(event) => updateField("status", event.target.value)}
                                className={inputClassName}
                            >
                                <option value="">Select status</option>
                                <option value="1">Active</option>
                                <option value="0">Inactive</option>
                            </select>
                        </div>

                        <div className="md:col-span-4">
                            <label htmlFor="serviceName" className="mb-2 block text-sm font-medium text-gray-700">
                                Category
                            </label>
                            <select
                                id="categoryId"
                                value={form.category_id}
                                onChange={(event) => updateField("category_id", event.target.value)}
                                className={inputClassName}
                            >
                                <option value="">Select category</option>
                                {categories.map((item) => (
                                    <option key={item.id} value={item.id}>
                                        {item.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="md:col-span-4">
                            <label htmlFor="serviceName" className="mb-2 block text-sm font-medium text-gray-700">
                                Service Name
                            </label>
                            <input
                                id="serviceName"
                                type="text"
                                placeholder="Enter service name"
                                className={inputClassName}
                                value={form.service_name}
                                onChange={(event) => updateField("service_name", event.target.value)}
                            />
                        </div>


                        <div className="md:col-span-4">
                            <label htmlFor="capacity" className="mb-2 block text-sm font-medium text-gray-700">
                                Capacity
                            </label>
                            <input
                                id="capacity"
                                type="text"
                                placeholder="Enter capacity"
                                className={inputClassName}
                                value={form.capacity}
                                onChange={(event) => updateField("capacity", event.target.value)}
                            />
                        </div>


                        <div className="md:col-span-4">
                            <label htmlFor="numberOfRooms" className="mb-2 block text-sm font-medium text-gray-700">
                                Number of Rooms
                            </label>
                            <input
                                id="numberOfRooms"
                                type="text"
                                placeholder="Enter number of rooms"
                                className={inputClassName}
                                value={form.number_of_rooms}
                                onChange={(event) => updateField("number_of_rooms", event.target.value)}
                            />
                        </div>


                        <div className="md:col-span-4">
                            <label htmlFor="carParking" className="mb-2 block text-sm font-medium text-gray-700">
                                Car Parking
                            </label>
                            <select
                                id="carParking"
                                value={form.car_parking}
                                onChange={(event) => updateField("car_parking", event.target.value)}
                                className={inputClassName}
                            >
                                <option value="">Select car parking</option>
                                <option value="Yes">Yes</option>
                                <option value="No">No</option>
                            </select>
                        </div>

                        <div className="md:col-span-4">
                            <label htmlFor="acAvailable" className="mb-2 block text-sm font-medium text-gray-700">
                                AC Available
                            </label>
                            <select
                                id="acAvailable"
                                value={form.ac_available}
                                onChange={(event) => updateField("ac_available", event.target.value)}
                                className={inputClassName}
                            >
                                <option value="">Select AC availability</option>
                                <option value="Yes">Yes</option>
                                <option value="No">No</option>
                            </select>
                        </div>

                        <div className="md:col-span-12 mt-4">
                            <h2 className="text-lg font-semibold text-primary">
                                Payment Information
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
                                className={inputClassName}
                            >
                                <option value="">Select pricing type</option>
                                <option value="Fixed">Fixed</option>
                                <option value="Per Day">Per Day</option>
                                <option value="Per Hour">Per Hour</option>
                                <option value="Per Person">Per Person</option>
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
                                className={inputClassName}
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
                                className={inputClassName}
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
                                className={inputClassName}
                                value={form.tax_percentage}
                                onChange={(event) => updateField("tax_percentage", event.target.value)}
                            />
                        </div>

                        <div className="md:col-span-12 mt-4">
                            <h2 className="text-lg font-semibold text-primary">
                                Address Information
                            </h2>
                        </div>

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
                                className={inputClassName}
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
                                className={inputClassName}
                                value={form.state_id}
                                onChange={(event) => updateField("state_id", event.target.value)}
                            />
                        </div>

                        <div className="md:col-span-12 mb-3">
                            <label htmlFor="serviceBannerImage" className="mb-2 block text-sm font-medium text-gray-700">
                                Banner Image
                            </label>
                            <div className="flex items-center gap-3">
                                <label
                                    htmlFor="serviceBannerImage"
                                    className="inline-flex h-8 cursor-pointer items-center rounded-xl bg-primary-light px-5 py-2 text-sm font-semibold text-white shadow-md shadow-primary/20 transition-all duration-300 hover:-translate-y-0.5 hover:bg-primary-dark hover:shadow-lg"
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

                        <div className="md:col-span-6">
                            <label htmlFor="serviceAddress" className="mb-2 block text-sm font-medium text-gray-700">
                                Service Address
                            </label>
                            <textarea
                                id="serviceAddress"
                                placeholder="Enter service address"
                                rows={2}
                                className={inputClassName}
                                value={form.service_address}
                                onChange={(event) => updateField("service_address", event.target.value)}
                            ></textarea>
                        </div>

                        <div className="md:col-span-6">
                            <label htmlFor="serviceDescription" className="mb-2 block text-sm font-medium text-gray-700">
                                Service Description
                            </label>
                            <textarea
                                id="serviceDescription"
                                placeholder="Enter service description"
                                rows={2}
                                className={inputClassName}
                                value={form.service_description}
                                onChange={(event) => updateField("service_description", event.target.value)}
                            ></textarea>
                        </div>

                        <div className="md:col-span-12 mt-4">
                            <h2 className="text-lg font-semibold text-primary">
                                Map Location
                            </h2>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-5">
                        {error && <div className="md:col-span-12 text-sm text-rose-600">{error}</div>}
                        <div className="md:col-span-12 flex justify-end">
                            <button
                                type="submit"
                                className={buttonClassName}
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