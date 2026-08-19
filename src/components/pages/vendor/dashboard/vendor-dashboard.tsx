"use client";
import Link from "next/link";
import { FiCalendar, FiClock, FiHeart, FiUser, FiCamera, FiHome } from "react-icons/fi";
import { DollarSign, TrendingUp, CreditCard, Users } from 'lucide-react';
import AvailabilityCalendar from "../availability-calendar/availability-calendar";

export default function VendorDashboard() {
    return (
        <section className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-5">
            <div className="md:col-span-6">
                <div className="rounded-xl border border-slate-200 bg-white shadow-sm p-4">
                    <AvailabilityCalendar />
                </div>
            </div>
        </section>
    );
}
