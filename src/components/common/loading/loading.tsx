"use client";

import { Loader2 } from "lucide-react";

interface LoadingProps {
    message?: string;
}

export default function Loading({
    message = "Loading...",
}: LoadingProps) {
    return (
        <div className="flex items-center justify-center py-12">
            <div className="flex items-center gap-2 text-slate-500">
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>{message}</span>
            </div>
        </div>
    );
}