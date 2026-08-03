
"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { vendorService } from "@/services/vendor/vendor.service";
import commonService from "@/services/common/common.service";
import { sweetalert } from "@/utils/sweetalert";
import LocalitySelect, { LocalityOption } from "@/components/common/locality-select";


type IndividualServiceForm = {
    category_id: string;
    state_id: string;
    city_id: string;
    locality_id: string;
    service_name: string;
    service_description: string;
    service_address: string;
    service_image: string;
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
    service_image: "",
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

        try {
            const result = await vendorService.createIndividualService({
                category_id: Number(form.category_id),
                state_id: Number(form.state_id),
                city_id: Number(form.city_id),
                locality_id: Number(form.locality_id),
                service_name: form.service_name,
                service_description: form.service_description,
                service_address: form.service_address,
                service_image: form.service_image,
                capacity: form.capacity,
                number_of_rooms: Number(form.number_of_rooms || 0),
                car_parking: form.car_parking,
                ac_available: form.ac_available,
                latitude: form.latitude,
                longitude: form.longitude,
                pricing_type: form.pricing_type,
                amount: Number(form.amount || 0),
                discount: Number(form.discount || 0),
                tax_percentage: Number(form.tax_percentage || 0),
                status: Number(form.status || 1),
            });

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

    const inputClassName = "w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-800 placeholder:text-slate-400 focus:border-primary focus:ring-4 focus:ring-primary/5 shadow-sm outline-none transition-all duration-300 hover:border-slate-300";

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

                        <div className="md:col-span-4">
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

                        <div className="md:col-span-4">
                            <label htmlFor="serviceAddress" className="mb-2 block text-sm font-medium text-gray-700">
                                Service Address
                            </label>
                            <textarea
                                id="serviceAddress"
                                placeholder="Enter service address"
                                rows={1}
                                className={inputClassName}
                                value={form.service_address}
                                onChange={(event) => updateField("service_address", event.target.value)}
                            ></textarea>
                        </div>

                        <div className="md:col-span-12">
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
                                className="rounded-lg bg-primary px-6 py-2 text-sm font-semibold text-white shadow-sm transition-all duration-300 hover:shadow-md hover:shadow-primary/20 hover:bg-primary-dark disabled:bg-secondary-light cursor-pointer"
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