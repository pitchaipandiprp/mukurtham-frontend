"use client";
import Link from "next/link";
import { FiCalendar, FiClock, FiHeart, FiUser, FiCamera, FiHome } from "react-icons/fi";
import { DollarSign, TrendingUp, CreditCard, Users } from 'lucide-react';

export default function VendorDashboard() {
    return (
        <div className="flex flex-col gap-6">

            {/* Breadcrumbs Header */}
            <div className="mb-6">
                <h1 className="text-2xl font-black text-slate-900 tracking-tight">Dashboard</h1>
                <p className="text-xs text-slate-500 mt-1">
                    Mukurtham Dashboard
                </p>
            </div>

            {/* High-Contrast Gull Style Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {[
                    { label: 'New Sales', val: '1,240', icon: DollarSign, color: 'bg-primary' },
                    { label: 'Conversion Rate', val: '40.5%', icon: TrendingUp, color: 'bg-primary-light' },
                    { label: 'Order Processed', val: '$85,240', icon: CreditCard, color: 'bg-primary' },
                    { label: 'Total Users', val: '24.5K', icon: Users, color: 'bg-secondary-light' },
                ].map((stat, idx) => {
                    const StatIcon = stat.icon;
                    return (
                        <div key={idx} className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm flex items-center justify-between">
                            <div>
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{stat.label}</p>
                                <h3 className="text-xl font-black text-slate-900 mt-1">{stat.val}</h3>
                            </div>
                            <div className={`h-12 w-12 rounded-2xl ${stat.color} text-white flex items-center justify-center shadow-md shadow-primary/20`}>
                                <StatIcon className="w-6 h-6" />
                            </div>
                        </div>
                    );
                })}
            </div>
            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">

                {/* Total Bookings */}
                <div className="group rounded-2xl border border-primary/10 bg-gradient-to-br from-primary/5 via-white to-primary/10 p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/15">

                    <div className="flex items-center justify-between">
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary transition-all duration-300 group-hover:bg-primary group-hover:text-white">
                            <FiCalendar className="h-5 w-5" />
                        </div>

                        <span className="rounded-full bg-green-100 px-2.5 py-1 text-xs font-semibold text-green-600">
                            +12%
                        </span>
                    </div>

                    <p className="mt-4 text-sm font-medium text-gray-500">
                        Total Bookings
                    </p>

                    <h3 className="mt-1 text-2xl font-bold text-primary">
                        12
                    </h3>
                </div>


                {/* Upcoming */}
                <div className="group rounded-2xl border border-purple-100 bg-gradient-to-br from-purple-50 via-white to-purple-100/60 p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-purple-200/50">

                    <div className="flex items-center justify-between">
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-100 text-purple-600 transition-all duration-300 group-hover:bg-purple-600 group-hover:text-white">
                            <FiClock className="h-5 w-5" />
                        </div>
                    </div>

                    <p className="mt-4 text-sm font-medium text-gray-500">
                        Upcoming
                    </p>

                    <h3 className="mt-1 text-2xl font-bold text-purple-700">
                        3
                    </h3>
                </div>


                {/* Wishlist */}
                <div className="group rounded-2xl border border-pink-100 bg-gradient-to-br from-pink-50 via-white to-pink-100/60 p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-pink-200/50">

                    <div className="flex items-center justify-between">
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-pink-100 text-pink-600 transition-all duration-300 group-hover:bg-pink-600 group-hover:text-white">
                            <FiHeart className="h-5 w-5" />
                        </div>
                    </div>

                    <p className="mt-4 text-sm font-medium text-gray-500">
                        Wishlist
                    </p>

                    <h3 className="mt-1 text-2xl font-bold text-pink-700">
                        8
                    </h3>
                </div>


                {/* Profile Completion */}
                <div className="group rounded-2xl border border-emerald-100 bg-gradient-to-br from-emerald-50 via-white to-emerald-100/60 p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-emerald-200/50">

                    <div className="flex items-center justify-between">
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600 transition-all duration-300 group-hover:bg-emerald-600 group-hover:text-white">
                            <FiUser className="h-5 w-5" />
                        </div>
                    </div>

                    <p className="mt-4 text-sm font-medium text-gray-500">
                        Profile Completion
                    </p>

                    <h3 className="mt-1 text-2xl font-bold text-emerald-700">
                        80%
                    </h3>
                </div>

            </div>


            {/* Recent Activity */}
            <div className="grid gap-6 xl:grid-cols-3">

                {/* Recent Bookings */}
                <div className="overflow-hidden rounded-2xl border border-primary/10 bg-white shadow-sm xl:col-span-2">

                    <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
                        <div>
                            <h2 className="font-bold text-gray-800">
                                Recent Bookings
                            </h2>

                            <p className="mt-1 text-xs text-gray-500">
                                Your latest wedding service bookings
                            </p>
                        </div>

                        <Link
                            href="/users/bookings"
                            className="text-xs font-semibold text-primary transition hover:text-primary-dark"
                        >
                            View All
                        </Link>
                    </div>


                    <div className="divide-y divide-gray-100">

                        <div className="flex items-center justify-between gap-4 px-5 py-4 transition hover:bg-primary/5">
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                                    <FiHome className="h-5 w-5" />
                                </div>

                                <div>
                                    <p className="text-sm font-semibold text-gray-800">
                                        Grand Wedding Hall
                                    </p>

                                    <p className="text-xs text-gray-500">
                                        Wedding Hall · 24 May 2025
                                    </p>
                                </div>
                            </div>

                            <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-600">
                                Confirmed
                            </span>
                        </div>


                        <div className="flex items-center justify-between gap-4 px-5 py-4 transition hover:bg-primary/5">
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-pink-100 text-pink-600">
                                    <FiCamera className="h-5 w-5" />
                                </div>

                                <div>
                                    <p className="text-sm font-semibold text-gray-800">
                                        Moments Photography
                                    </p>

                                    <p className="text-xs text-gray-500">
                                        Photography · 28 May 2025
                                    </p>
                                </div>
                            </div>

                            <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-semibold text-yellow-600">
                                Pending
                            </span>
                        </div>

                    </div>
                </div>


                {/* Profile Card */}
                <div className="rounded-2xl border border-primary/10 bg-white p-5 shadow-sm">

                    <div className="flex items-center gap-4">
                        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary-light text-xl font-bold text-white shadow-md">
                            P
                        </div>

                        <div>
                            <h3 className="font-bold text-gray-800">
                                Welcome, Customer
                            </h3>

                            <p className="text-xs text-gray-500">
                                Complete your profile
                            </p>
                        </div>
                    </div>


                    <div className="mt-6">
                        <div className="mb-2 flex justify-between text-xs font-medium">
                            <span className="text-gray-500">
                                Profile Completion
                            </span>

                            <span className="text-primary">
                                80%
                            </span>
                        </div>

                        <div className="h-2 overflow-hidden rounded-full bg-primary/10">
                            <div className="h-full w-[80%] rounded-full bg-gradient-to-r from-primary to-primary-light" />
                        </div>
                    </div>


                    <Link
                        href="/users/profile"
                        className="mt-6 flex w-full items-center justify-center rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-white transition-all duration-300 hover:bg-primary-dark hover:shadow-lg hover:shadow-primary/20"
                    >
                        View Profile
                    </Link>

                </div>

            </div>

        </div>
    );
}
