"use client";
import PopupModal from "@/components/common/popup/popup-modal";
import { useState } from "react";

type Props = {
    categoryServiceId: number | null;
    serviceRecord: any | null;
};

export function CategoryServiceOverview({
    categoryServiceId,
    serviceRecord,
}: Props) {

    const [showPopup, setShowPopup] = useState(false);
    const [popupTitle, setPopupTitle] = useState("");
    const [popupContent, setPopupContent] = useState("");

    return (
        <>
            <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
                <h3 className="mb-3 text-sm font-bold text-gray-900">About Us</h3>
                <p className="text-xs leading-relaxed text-gray-600 line-clamp-3">
                    {serviceRecord?.service_description || "No description available."}
                </p>
                <button
                    type="button"
                    className="mt-1 text-xs font-medium text-primary hover:underline cursor-pointer"
                    onClick={() => {
                        setShowPopup(true);
                        setPopupTitle("About Us");
                        setPopupContent(serviceRecord?.service_description || "No description available.");
                    }}
                >
                    Read more
                </button>
            </div>

            <PopupModal
                show={showPopup}
                title={popupTitle}
                onClose={() => setShowPopup(false)}
                width="3xl"
                position="top"
                blurBackground={false}
            >
                {popupContent}
            </PopupModal>
        </>
    )
}
