"use client";

import { FaBuilding, FaCamera, FaUtensils, FaPaintBrush, FaSpa, FaCar, FaMusic, FaEnvelopeOpenText, FaEllipsisH } from "react-icons/fa";
import { FiMapPin, FiSearch, FiCheckCircle, FiTag, FiCreditCard } from "react-icons/fi";
import commonService from "@/services/api/common.service";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import * as FaIcons from "react-icons/fa";
import type { IconType } from "react-icons";

export function HomePage() {

    const categoryColors = [
        "bg-rose-100/60 text-rose-600",
        "bg-blue-100/60 text-blue-600",
        "bg-orange-100/60 text-orange-600",
        "bg-pink-100/60 text-pink-600",
        "bg-green-100/60 text-green-600",
        "bg-indigo-100/60 text-indigo-600",
        "bg-emerald-100/60 text-emerald-600",
        "bg-red-100/60 text-red-600",
    ];

    const router = useRouter();

    const [categoryList, setCategoryList] = useState<any[]>([]);
    const [cityList, setCityList] = useState<any[]>([]);

    const [homeSearchInput, setHomeSearchInput] = useState("");
    const [homeSearchCity, setHomeSearchCity] = useState("");

    useEffect(() => {
        loadCategories();
        loadCity();
    }, []);

    async function loadCategories() {
        try {
            const categories = await commonService.getCategories();
            setCategoryList(categories?.data);
        } catch (error) {
            console.error("Failed to load categories:", error);
        }
    }

    const loadCity = async () => {
        const result = await commonService.getCities({ is_popular: 1 });
        setCityList(result?.data || []);
    };

    const handleSearchSubmit = () => {
        navigateToServiceSearch(homeSearchInput, homeSearchCity);
    };

    const navigateToServiceSearch = (search: string, city: string) => {
        const params = new URLSearchParams();

        if (search.trim()) {
            params.set("search", search.trim());
        }

        if (city) {
            params.set("city", city);
        }

        router.push(`/service-search?${params.toString()}`);
    };

    const goToCategorySearch = (category: string) => {
        const params = new URLSearchParams();

        if (category.trim()) {
            params.set("category", category.trim());
        }

        router.push(`/service-search?${params.toString()}`);
    };

    return (
        <main className="mx-auto max-w-screen-2xl space-y-12 px-4 py-6 sm:px-6 lg:px-8">
            {/* Hero Section */}
            <section className="relative flex min-h-[480px] items-center overflow-hidden rounded-3xl bg-gradient-to-r from-pink-100 via-rose-50 to-orange-50 p-6 md:p-12">
                {/* Background Banner Image */}
                <div className="absolute inset-0 z-0">
                    <img
                        src="https://i.pinimg.com/vwebp/1200x/da/d5/91/dad591cf28c51351b3db694666305289.webp"
                        alt="Wedding Stage Decor"
                        className="h-full w-full object-cover object-center opacity-80 md:opacity-100"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-rose-50/100 via-rose-50/30 to-transparent" />
                </div>

                {/* Hero Content */}
                <div className="relative z-10 max-w-xl space-y-6">
                    <h1 className="text-3xl font-extrabold leading-tight text-gray-900 md:text-5xl">
                        Plan Your Dream <br />
                        <span className="text-primary">Wedding</span> with Ease
                    </h1>
                    <p className="text-sm font-medium text-gray-600 md:text-base">
                        Find the best venues, vendors and services for your perfect day
                    </p>

                    {/* Search Bar Component */}
                    <div className="flex flex-col items-center space-y-2 rounded-2xl border border-gray-100 bg-white p-2.5 shadow-lg md:flex-row md:space-x-2 md:space-y-0">
                        <div className="flex w-full items-center border-b border-gray-200 px-3 py-2 md:w-1/3 md:border-b-0 md:border-r">
                            <FiMapPin aria-hidden="true" className="mr-2 h-4 w-4 text-primary" />
                            <select
                                id="header-search-city"
                                value={homeSearchCity}
                                onChange={(e) => setHomeSearchCity(e.target.value)}
                                className="w-full text-sm font-semibold text-gray-700 focus:outline-none"
                            >
                                {cityList.map((city) => (
                                    <option key={city.id} value={city.name}>
                                        {city.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="flex w-full items-center px-3 py-2 md:w-2/3">
                            <FiSearch aria-hidden="true" className="mr-2 h-4 w-4 text-primary" />
                            <input
                                type="text"
                                placeholder="Search for venues, vendors..."
                                className="w-full text-sm text-gray-700 focus:outline-none"
                                value={homeSearchInput}
                                onChange={(e) => setHomeSearchInput(e.target.value)}
                            />
                        </div>
                        <button
                            className="w-full rounded-xl bg-primary px-8 py-3 text-sm font-semibold text-white transition hover:bg-primary-dark md:w-auto cursor-pointer"
                            onClick={handleSearchSubmit}
                        >
                            Search
                        </button>
                    </div>

                    {/* Key Features List */}
                    <div className="flex flex-wrap gap-4 pt-2 text-xs font-semibold text-gray-700">
                        <div className="flex items-center space-x-1.5 rounded-full border border-pink-100 bg-white/80 px-3 py-1.5 backdrop-blur">
                            <FiCheckCircle aria-hidden="true" className="h-4 w-4 text-primary" />
                            <span>Verified Vendors</span>
                        </div>
                        <div className="flex items-center space-x-1.5 rounded-full border border-pink-100 bg-white/80 px-3 py-1.5 backdrop-blur">
                            <FiTag aria-hidden="true" className="h-4 w-4 text-primary" />
                            <span>Best Price Guarantee</span>
                        </div>
                        <div className="flex items-center space-x-1.5 rounded-full border border-pink-100 bg-white/80 px-3 py-1.5 backdrop-blur">
                            <FiCreditCard aria-hidden="true" className="h-4 w-4 text-primary" />
                            <span>Easy Booking & Secure Payment</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Top Categories Section */}
            <section>
                <div className="mb-6 flex items-center justify-between">
                    <h2 className="text-xl font-bold text-gray-900">Top Categories</h2>
                    <a href="#" className="text-sm font-semibold text-primary hover:underline">View all</a>
                </div>

                <div className="grid grid-cols-4 gap-4 text-center md:grid-cols-9">
                    {
                        categoryList.map((category, index) => {
                            const Icon = FaIcons[category.icon as keyof typeof FaIcons] ?? '';
                            const colorClass = categoryColors[index] ?? "bg-gray-100/60 text-gray-600";

                            return (
                                <div
                                    key={`home-category-${category.id}`}
                                    className="group flex cursor-pointer flex-col items-center space-y-2"
                                    onClick={() => goToCategorySearch(category.name)}
                                >
                                    <div className={`flex h-16 w-16 items-center justify-center rounded-2xl transition group-hover:bg-primary group-hover:text-white ${colorClass}`}>
                                        {Icon && (
                                            <Icon
                                                aria-hidden="true"
                                                className="h-7 w-7 rounded-md bg-current/20 p-1.5"
                                            />
                                        )}
                                    </div>
                                    <span className="text-xs font-semibold text-gray-700">{category.name}</span>
                                </div>
                            )
                        })
                    }

                    <div className="group flex cursor-pointer flex-col items-center space-y-2">
                        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-200 text-gray-600 transition group-hover:bg-primary group-hover:text-white">
                            <FaEllipsisH aria-hidden="true" className="h-7 w-7 rounded-md bg-current/20 p-1.5" />
                        </div>
                        <span className="text-xs font-semibold text-gray-700">More</span>
                    </div>
                </div>
            </section>

            {/* Featured Vendors Section */}
            <section>
                <div className="mb-6 flex items-center justify-between">
                    <h2 className="text-xl font-bold text-gray-900">Featured Vendors</h2>
                    <a href="#" className="text-sm font-semibold text-primary hover:underline">View all</a>
                </div>

                <div className="relative grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition hover:shadow-md">
                        <div className="relative h-44 group overflow-hidden">
                            <img
                                src="https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80&w=600"
                                className="w-full h-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-110"
                                alt="Grand Palace"
                            />
                            <span className="absolute left-3 top-3 rounded bg-red-800 px-2 py-0.5 text-[10px] font-bold uppercase text-white">POPULAR</span>
                        </div>
                        <div className="space-y-2 p-4">
                            <div className="flex items-start justify-between">
                                <div>
                                    <h3 className="text-sm font-bold text-gray-800">Grand Palace</h3>
                                    <p className="text-xs text-gray-500">Wedding Hall</p>
                                </div>
                                <div className="flex items-center rounded bg-amber-50 px-1.5 py-0.5 text-xs font-semibold text-amber-700">
                                    <span aria-hidden className="mr-1 inline-block h-3 w-3 rounded-full bg-amber-500/30" />
                                    4.8 <span className="ml-0.5 text-[10px] text-gray-400">(246)</span>
                                </div>
                            </div>
                            <div className="flex items-end justify-between border-t border-gray-50 pt-2">
                                <span className="flex items-center text-xs text-gray-500">
                                    <span aria-hidden className="mr-1 inline-block h-3 w-3 rounded-full bg-gray-300/90" />
                                    Chennai
                                </span>
                                <div className="text-right">
                                    <span className="block text-[10px] text-gray-400">Starting from</span>
                                    <span className="text-sm font-bold text-gray-900">₹1,25,000</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition hover:shadow-md">
                        <div className="relative h-44 group overflow-hidden">
                            <img
                                src="https://images.unsplash.com/photo-1537633552985-df8429e8048b?auto=format&fit=crop&q=80&w=600"
                                className="w-full h-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-110"
                                alt="Photo Story"
                            />
                            <span className="absolute left-3 top-3 rounded bg-primary px-2 py-0.5 text-[10px] font-bold uppercase text-white">TOP RATED</span>
                        </div>
                        <div className="space-y-2 p-4">
                            <div className="flex items-start justify-between">
                                <div>
                                    <h3 className="text-sm font-bold text-gray-800">Photo Story</h3>
                                    <p className="text-xs text-gray-500">Photography</p>
                                </div>
                                <div className="flex items-center rounded bg-amber-50 px-1.5 py-0.5 text-xs font-semibold text-amber-700">
                                    <span aria-hidden className="mr-1 inline-block h-3 w-3 rounded-full bg-amber-500/30" />
                                    4.9 <span className="ml-0.5 text-[10px] text-gray-400">(512)</span>
                                </div>
                            </div>
                            <div className="flex items-end justify-between border-t border-gray-50 pt-2">
                                <span className="flex items-center text-xs text-gray-500">
                                    <span aria-hidden className="mr-1 inline-block h-3 w-3 rounded-full bg-gray-300/90" />
                                    Chennai
                                </span>
                                <div className="text-right">
                                    <span className="block text-[10px] text-gray-400">Starting from</span>
                                    <span className="text-sm font-bold text-gray-900">₹35,000</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition hover:shadow-md">
                        <div className="relative h-44 group overflow-hidden">
                            <img
                                src="https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&q=80&w=600"
                                className="w-full h-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-110"
                                alt="Royal Catering"
                            />
                            <span className="absolute left-3 top-3 rounded bg-red-600 px-2 py-0.5 text-[10px] font-bold uppercase text-white">BEST SELLER</span>
                        </div>
                        <div className="space-y-2 p-4">
                            <div className="flex items-start justify-between">
                                <div>
                                    <h3 className="text-sm font-bold text-gray-800">Royal Catering</h3>
                                    <p className="text-xs text-gray-500">Catering</p>
                                </div>
                                <div className="flex items-center rounded bg-amber-50 px-1.5 py-0.5 text-xs font-semibold text-amber-700">
                                    <span aria-hidden className="mr-1 inline-block h-3 w-3 rounded-full bg-amber-500/30" />
                                    4.7 <span className="ml-0.5 text-[10px] text-gray-400">(312)</span>
                                </div>
                            </div>
                            <div className="flex items-end justify-between border-t border-gray-50 pt-2">
                                <span className="flex items-center text-xs text-gray-500">
                                    <span aria-hidden className="mr-1 inline-block h-3 w-3 rounded-full bg-gray-300/90" />
                                    Chennai
                                </span>
                                <div className="text-right">
                                    <span className="block text-[10px] text-gray-400">Starting from</span>
                                    <span className="text-sm font-bold text-gray-900">₹450 / Plate</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition hover:shadow-md">
                        <div className="relative h-44 group overflow-hidden">
                            <img
                                src="https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&q=80&w=600"
                                className="w-full h-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-110"
                                alt="Dream Decorators"
                            />
                        </div>
                        <div className="space-y-2 p-4">
                            <div className="flex items-start justify-between">
                                <div>
                                    <h3 className="text-sm font-bold text-gray-800">Dream Decorators</h3>
                                    <p className="text-xs text-gray-500">Decoration</p>
                                </div>
                                <div className="flex items-center rounded bg-amber-50 px-1.5 py-0.5 text-xs font-semibold text-amber-700">
                                    <span aria-hidden className="mr-1 inline-block h-3 w-3 rounded-full bg-amber-500/30" />
                                    4.8 <span className="ml-0.5 text-[10px] text-gray-400">(198)</span>
                                </div>
                            </div>
                            <div className="flex items-end justify-between border-t border-gray-50 pt-2">
                                <span className="flex items-center text-xs text-gray-500">
                                    <span aria-hidden className="mr-1 inline-block h-3 w-3 rounded-full bg-gray-300/90" />
                                    Chennai
                                </span>
                                <div className="text-right">
                                    <span className="block text-[10px] text-gray-400">Starting from</span>
                                    <span className="text-sm font-bold text-gray-900">₹75,000</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Banner / Wedding Planner Promo */}
            <section className="relative flex flex-col items-center justify-between overflow-hidden rounded-3xl border border-pink-100 bg-pink-50 p-6 md:flex-row md:p-8">
                <div className="z-10 max-w-lg space-y-4">
                    <h2 className="text-2xl font-extrabold text-pink-900 md:text-3xl">
                        Plan, Organize & Celebrate Your Big Day
                    </h2>
                    <p className="text-xs leading-relaxed text-gray-600 md:text-sm">
                        Use our smart wedding planner to manage tasks, budget, guest list and more.
                    </p>
                </div>
                <div className="z-10 mt-6 md:mt-0">
                    <button className="rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-primary-dark cursor-pointer">
                        Try Wedding Planner
                    </button>
                </div>
            </section>
        </main>
    );
}
