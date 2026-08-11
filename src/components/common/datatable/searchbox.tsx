"use client";

import { Search } from "lucide-react";
import { constants } from "@/utils/constants";

interface TableSearchProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    className?: string;
}

export default function TableSearch({
    value,
    onChange,
    placeholder = "Search...",
    className = "",
}: TableSearchProps) {


    const inputClassSearch = constants.inputClassSearch;

    return (
        <div className={`relative w-full max-w-sm mb-2 ${className}`}>
            <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
                type="text"
                value={value}
                placeholder={placeholder}
                onChange={(e) => onChange(e.target.value)}
                className={inputClassSearch}
            />
        </div>
    );
}