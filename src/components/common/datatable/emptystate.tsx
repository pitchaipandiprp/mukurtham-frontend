"use client";

import { Inbox } from "lucide-react";

interface EmptyStateProps {
    title?: string;
    description?: string;
}

export default function EmptyState({
    title = "No Records Found",
    description = "There is no data available to display.",
}: EmptyStateProps) {
    return (
        <div className="flex flex-col items-center justify-center py-12 text-center">
            <Inbox className="mb-4 h-12 w-12 text-slate-300" />

            <h3 className="text-lg font-semibold text-slate-700">
                {title}
            </h3>

            <p className="mt-2 text-sm text-slate-500">
                {description}
            </p>
        </div>
    );
}