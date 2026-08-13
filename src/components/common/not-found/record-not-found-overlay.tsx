"use client";

interface RecordNotFoundOverlayProps {
    show: boolean;
    title?: string;
    message?: string;
    top?: string;
    blurBackground?: boolean;
}

export default function RecordNotFoundOverlay({
    show,
    title = "Records Not Available",
    message = "The requested records could not be found.",
    top = "top-16",
    blurBackground = true,
}: RecordNotFoundOverlayProps) {

    if (!show) {
        return null;
    }

    return (
        <div
            className={`fixed inset-0 ${top} z-[9999] flex items-center justify-center bg-black/50 ${blurBackground ? "backdrop-blur-sm" : ""}`}
            role="alert"
        >
            <div className="rounded-xl bg-white/10 px-8 py-6 text-center shadow-2xl backdrop-blur-md">
                <h2 className="text-xl font-bold text-white">
                    {title}
                </h2>

                <p className="mt-2 text-sm text-white">
                    {message}
                </p>
            </div>
        </div>
    );
}