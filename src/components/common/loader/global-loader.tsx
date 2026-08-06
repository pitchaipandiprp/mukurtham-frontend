"use client";

import { Loader2 } from "lucide-react";
import { useLoadingStore } from "@/store/loading.store";

export default function GlobalLoader() {
    const loading = useLoadingStore((state) => state.loading);

    if (!loading) return null;

    return (
        <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/20 backdrop-blur-sm">
            <div className="flex flex-col items-center gap-3 rounded-xl bg-white/90 px-8 py-6 shadow-2xl">
                <Loader2 className="h-10 w-10 animate-spin text-pink-600" />

                <p className="text-sm font-medium text-slate-700">
                    Please wait...
                </p>
            </div>
        </div>
    );
}