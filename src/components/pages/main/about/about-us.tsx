"use client";
import { Heart, ShieldCheck, Sparkles, Users, CalendarCheck, ArrowRight, CheckCircle2, } from "lucide-react"; import Link from "next/link";

export default function AboutUs() {
    return (
        <main className="min-h-screen bg-white">
            {/* =========================================================
                INTRODUCTION
            ========================================================= */}
            <section className="bg-white py-16 sm:py-20 lg:py-24">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

                    <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">

                        {/* Left */}
                        <div>
                            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-primary">
                                About Mukurtham
                            </p>

                            <h2 className="text-3xl font-bold leading-tight text-slate-800 sm:text-4xl">
                                Everything you need to plan
                                <span className="block text-primary">
                                    a beautiful celebration.
                                </span>
                            </h2>

                            <p className="mt-6 leading-7 text-slate-500">
                                Planning a wedding or special event can involve
                                countless decisions, phone calls and searches.
                                Mukurtham was created to simplify that journey.
                            </p>

                            <p className="mt-4 leading-7 text-slate-500">
                                Our platform connects customers with venues and
                                event service providers, making it easier to
                                discover, compare and choose the right services
                                for every celebration.
                            </p>

                            <div className="mt-8 grid gap-4 sm:grid-cols-2">

                                <div className="flex items-start gap-3">
                                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                                    <div>
                                        <p className="font-semibold text-slate-700">
                                            Trusted Services
                                        </p>
                                        <p className="mt-1 text-sm text-slate-500">
                                            Discover reliable event professionals.
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                                    <div>
                                        <p className="font-semibold text-slate-700">
                                            Easy Discovery
                                        </p>
                                        <p className="mt-1 text-sm text-slate-500">
                                            Find the right services in one place.
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                                    <div>
                                        <p className="font-semibold text-slate-700">
                                            Better Choices
                                        </p>
                                        <p className="mt-1 text-sm text-slate-500">
                                            Compare options before deciding.
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                                    <div>
                                        <p className="font-semibold text-slate-700">
                                            Memorable Events
                                        </p>
                                        <p className="mt-1 text-sm text-slate-500">
                                            Focus on moments that matter.
                                        </p>
                                    </div>
                                </div>

                            </div>
                        </div>


                        {/* Right - Visual Card */}
                        <div className="relative">

                            <div className="absolute -right-5 -top-5 h-24 w-24 rounded-full bg-primary/10" />
                            <div className="absolute -bottom-6 -left-6 h-32 w-32 rounded-full bg-primary/5" />

                            <div className="relative overflow-hidden rounded-3xl bg-slate-50 p-6 shadow-xl shadow-slate-200/60 sm:p-8">

                                <div className="grid grid-cols-2 gap-4">

                                    <div className="rounded-2xl bg-white p-6 shadow-sm">
                                        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                                            <Heart className="h-6 w-6 text-primary" />
                                        </div>

                                        <p className="text-2xl font-bold text-slate-800">
                                            Moments
                                        </p>

                                        <p className="mt-1 text-sm text-slate-500">
                                            That last forever
                                        </p>
                                    </div>

                                    <div className="rounded-2xl bg-primary p-6 shadow-lg shadow-primary/20">
                                        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-white/15">
                                            <Users className="h-6 w-6 text-white" />
                                        </div>

                                        <p className="text-2xl font-bold text-white">
                                            People
                                        </p>

                                        <p className="mt-1 text-sm text-white/70">
                                            Behind every celebration
                                        </p>
                                    </div>

                                    <div className="rounded-2xl bg-primary p-6 shadow-lg shadow-primary/20">
                                        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-white/15">
                                            <CalendarCheck className="h-6 w-6 text-white" />
                                        </div>

                                        <p className="text-2xl font-bold text-white">
                                            Events
                                        </p>

                                        <p className="mt-1 text-sm text-white/70">
                                            Planned with confidence
                                        </p>
                                    </div>

                                    <div className="rounded-2xl bg-white p-6 shadow-sm">
                                        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                                            <ShieldCheck className="h-6 w-6 text-primary" />
                                        </div>

                                        <p className="text-2xl font-bold text-slate-800">
                                            Trust
                                        </p>

                                        <p className="mt-1 text-sm text-slate-500">
                                            At every step
                                        </p>
                                    </div>

                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </section>


            {/* =========================================================
                OUR VISION / MISSION
            ========================================================= */}
            <section className="bg-slate-50 py-16 sm:py-20 lg:py-24">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

                    <div className="mx-auto max-w-2xl text-center">
                        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
                            What Drives Us
                        </p>

                        <h2 className="mt-3 text-3xl font-bold text-slate-800 sm:text-4xl">
                            Our mission & vision
                        </h2>

                        <p className="mt-4 leading-7 text-slate-500">
                            We believe planning an important celebration should
                            be exciting, not overwhelming.
                        </p>
                    </div>


                    <div className="mt-12 grid gap-6 md:grid-cols-2">

                        {/* Mission */}
                        <div className="group rounded-3xl bg-white p-8 shadow-sm transition hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-200/60 sm:p-10">

                            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
                                <Heart className="h-7 w-7 text-primary" />
                            </div>

                            <h3 className="mt-6 text-2xl font-bold text-slate-800">
                                Our Mission
                            </h3>

                            <p className="mt-4 leading-7 text-slate-500">
                                To simplify event planning by connecting people
                                with the right venues and service providers
                                through a convenient, transparent and
                                user-friendly platform.
                            </p>

                        </div>


                        {/* Vision */}
                        <div className="group rounded-3xl bg-primary p-8 shadow-xl shadow-primary/20 transition hover:-translate-y-1 sm:p-10">

                            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15">
                                <Sparkles className="h-7 w-7 text-white" />
                            </div>

                            <h3 className="mt-6 text-2xl font-bold text-white">
                                Our Vision
                            </h3>

                            <p className="mt-4 leading-7 text-white/75">
                                To become a trusted destination for discovering
                                and planning celebrations, helping people create
                                meaningful memories with less stress and more
                                confidence.
                            </p>

                        </div>

                    </div>

                </div>
            </section>


            {/* =========================================================
                SERVICES
            ========================================================= */}
            <section className="bg-white py-16 sm:py-20 lg:py-24">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

                    <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">

                        <div>
                            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
                                What We Offer
                            </p>

                            <h2 className="mt-3 text-3xl font-bold text-slate-800 sm:text-4xl">
                                Plan every detail in one place
                            </h2>
                        </div>

                        <p className="max-w-md text-sm leading-6 text-slate-500">
                            From the venue to the final detail, Mukurtham helps
                            you discover services for your special occasion.
                        </p>

                    </div>


                    <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">

                        {[
                            {
                                icon: "🏛️",
                                title: "Wedding Venues",
                                description:
                                    "Discover wedding halls and convention centers for your special day.",
                            },
                            {
                                icon: "📸",
                                title: "Photography",
                                description:
                                    "Find photographers and videographers to capture every memorable moment.",
                            },
                            {
                                icon: "🍽️",
                                title: "Catering",
                                description:
                                    "Explore catering services and create a delicious experience for your guests.",
                            },
                            {
                                icon: "✨",
                                title: "Event Services",
                                description:
                                    "Discover makeup, decoration, music, entertainment and more.",
                            },
                        ].map((service) => (
                            <div
                                key={service.title}
                                className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-primary/20 hover:shadow-lg"
                            >
                                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-50 text-2xl">
                                    {service.icon}
                                </div>

                                <h3 className="mt-5 font-bold text-slate-800">
                                    {service.title}
                                </h3>

                                <p className="mt-2 text-sm leading-6 text-slate-500">
                                    {service.description}
                                </p>
                            </div>
                        ))}

                    </div>

                </div>
            </section>


            {/* =========================================================
                WHY MUKURTHAM
            ========================================================= */}
            <section className="bg-slate-50 py-16 sm:py-20 lg:py-24">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

                    <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">

                        <div>
                            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
                                Why Mukurtham
                            </p>

                            <h2 className="mt-3 text-3xl font-bold leading-tight text-slate-800 sm:text-4xl">
                                Designed around
                                <span className="block text-primary">
                                    your celebration.
                                </span>
                            </h2>

                            <p className="mt-5 leading-7 text-slate-500">
                                Whether you are planning a wedding, engagement,
                                birthday, reception or another special occasion,
                                Mukurtham helps you spend less time searching
                                and more time enjoying the journey.
                            </p>
                        </div>


                        <div className="space-y-4">

                            {[
                                "Discover multiple event services from one platform",
                                "Explore venues and service providers with useful details",
                                "Make informed decisions based on your requirements",
                                "Save time during your event planning journey",
                                "Build your celebration with trusted professionals",
                            ].map((item, index) => (
                                <div
                                    key={item}
                                    className="flex items-center gap-4 rounded-2xl bg-white p-4 shadow-sm"
                                >
                                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                                        {index + 1}
                                    </div>

                                    <p className="text-sm font-medium text-slate-700">
                                        {item}
                                    </p>
                                </div>
                            ))}

                        </div>

                    </div>

                </div>
            </section>
        </main>
    );
}
