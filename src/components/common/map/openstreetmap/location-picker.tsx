"use client";

import dynamic from "next/dynamic";

const LocationMap = dynamic(
    () => import("./location-map"),
    {
        ssr: false,
        loading: () => (
            <div className="h-[400px] w-full rounded-lg bg-gray-100 flex items-center justify-center">
                Loading map...
            </div>
        ),
    }
);

export interface MapLocation {
    id: number | string;
    name?: string;
    latitude: number;
    longitude: number;
}

interface LocationPickerProps {
    latitude?: number;
    longitude?: number;

    locations?: MapLocation[];

    multipleMarkers?: boolean;

    radius?: number;

    onChange: (
        latitude: number,
        longitude: number
    ) => void;
}

export default function LocationPicker({
    latitude = 9.9252,
    longitude = 78.1198,
    locations = [],
    multipleMarkers = false,
    radius = 0,
    onChange,
}: LocationPickerProps) {
    const safeLatitude =
        Number.isFinite(Number(latitude))
            ? Number(latitude)
            : 9.9252;

    const safeLongitude =
        Number.isFinite(Number(longitude))
            ? Number(longitude)
            : 78.1198;
    return (
        <LocationMap
            latitude={safeLatitude}
            longitude={safeLongitude}
            locations={locations}
            multipleMarkers={multipleMarkers}
            radius={radius}
            onChange={onChange}
        />
    );
}