"use client";
import { useState, useEffect } from "react";
import mainRoutes from "@/services/api/main.routes";



type Props = {
    categoryServiceId: number | null;
    serviceRecord: any | null;
};

export function CategoryServicePackage({
    categoryServiceId,
    serviceRecord,
}: Props) {

    return (
        <>
            <div className="flex flex-col justify-between rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
                <div>
                    <h4 className="mb-4 text-xs font-bold text-gray-900">Packages</h4>
                    <div className="space-y-3">
                        <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 p-3">
                            <div className="text-xs font-semibold text-gray-800">Silver Package</div>
                            <div className="text-right text-xs font-bold text-gray-900">Rs 75,000</div>
                        </div>
                        <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 p-3">
                            <div className="text-xs font-semibold text-gray-800">Gold Package</div>
                            <div className="text-right text-xs font-bold text-gray-900">Rs 1,25,000</div>
                        </div>
                        <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 p-3">
                            <div className="text-xs font-semibold text-gray-800">Platinum Package</div>
                            <div className="text-right text-xs font-bold text-gray-900">Rs 2,25,000</div>
                        </div>
                    </div>
                </div>
                <button type="button" className="mt-4 w-full rounded-lg border border-primary/30 py-1.5 text-xs font-medium text-primary hover:bg-[#FDF2F7]">
                    View All Packages
                </button>
            </div>
        </>
    )
}
