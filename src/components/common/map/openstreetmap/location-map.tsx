"use client";

import {
    MapContainer,
    TileLayer,
    Marker,
    useMap,
    useMapEvents,
    Circle,
    Popup,
} from "react-leaflet";

import L from "leaflet";
import "leaflet/dist/leaflet.css";

import {
    useEffect,
    useRef,
    useState,
} from "react";

import {
    Search,
    MapPin,
} from "lucide-react";

interface MapLocation {
    id: number | string;
    name?: string;
    latitude: number;
    longitude: number;
}

interface LocationMapProps {
    latitude: number;
    longitude: number;

    /*
     * Existing locations
     */
    locations?: MapLocation[];

    /*
     * true  = show multiple markers
     * false = single marker picker
     */
    multipleMarkers?: boolean;

    /*
     * Radius around selected location
     * Example: 5000 = 5 KM
     */
    radius?: number;

    onChange: (
        latitude: number,
        longitude: number
    ) => void;
}

interface SearchResult {
    lat: string;
    lon: string;
    display_name: string;
}

/*
 * Red marker
 */
const redMarker = new L.Icon({
    iconUrl:
        "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",

    shadowUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",

    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
});

/*
 * Move map to selected location
 */
function MapController({
    latitude,
    longitude,
}: {
    latitude: number;
    longitude: number;
}) {
    const map = useMap();

    useEffect(() => {
        map.setView(
            [latitude, longitude],
            15
        );
    }, [
        latitude,
        longitude,
        map,
    ]);

    return null;
}

/*
 * Multiple existing markers
 */
function MultipleMarkers({
    locations,
    onSelect,
}: {
    locations: MapLocation[];
    onSelect: (
        latitude: number,
        longitude: number
    ) => void;
}) {
    return (
        <>
            {locations.map((location) => (
                <Marker
                    key={location.id}
                    position={[
                        location.latitude,
                        location.longitude,
                    ]}
                    icon={redMarker}
                    eventHandlers={{
                        click: () => {
                            onSelect(
                                location.latitude,
                                location.longitude
                            );
                        },
                    }}
                >
                    {location.name && (
                        <Popup>
                            <div className="text-sm font-medium">
                                {location.name}
                            </div>

                            <div className="text-xs text-gray-500 mt-1">
                                {location.latitude.toFixed(
                                    6
                                )}
                                ,{" "}
                                {location.longitude.toFixed(
                                    6
                                )}
                            </div>
                        </Popup>
                    )}
                </Marker>
            ))}
        </>
    );
}

/*
 * Selected / draggable marker
 */
function LocationMarker({
    latitude,
    longitude,
    onChange,
}: {
    latitude: number;
    longitude: number;
    onChange: (
        latitude: number,
        longitude: number
    ) => void;
}) {
    const markerRef =
        useRef<L.Marker | null>(null);

    useMapEvents({
        click(event) {
            const {
                lat,
                lng,
            } = event.latlng;

            onChange(lat, lng);
        },
    });

    return (
        <Marker
            ref={markerRef}
            position={[
                latitude,
                longitude,
            ]}
            icon={redMarker}
            draggable={true}
            eventHandlers={{
                dragend: () => {
                    const marker =
                        markerRef.current;

                    if (!marker) return;

                    const position =
                        marker.getLatLng();

                    onChange(
                        position.lat,
                        position.lng
                    );
                },
            }}
        />
    );
}

/*
 * Search box
 */
function LocationSearch({
    onSelect,
}: {
    onSelect: (
        latitude: number,
        longitude: number
    ) => void;
}) {
    const searchRef =
        useRef<HTMLDivElement>(null);

    const [search, setSearch] =
        useState("");

    const [results, setResults] =
        useState<SearchResult[]>([]);

    const [loading, setLoading] =
        useState(false);

    const [error, setError] =
        useState("");

    /*
     * Prevent search box clicks
     * from reaching Leaflet map
     */
    useEffect(() => {
        if (!searchRef.current) return;

        L.DomEvent.disableClickPropagation(
            searchRef.current
        );

        L.DomEvent.disableScrollPropagation(
            searchRef.current
        );
    }, []);

    const handleSearch = async () => {
        if (!search.trim()) return;

        try {
            setLoading(true);
            setError("");
            setResults([]);

            const query = `${search}, Tamil Nadu, India`;

            const url =
                `https://nominatim.openstreetmap.org/search` +
                `?format=json` +
                `&addressdetails=1` +
                `&limit=5` +
                `&countrycodes=in` +
                `&q=${encodeURIComponent(query)}`;

            const response =
                await fetch(url);

            if (!response.ok) {
                throw new Error(
                    "Location search failed"
                );
            }

            const data: SearchResult[] =
                await response.json();

            if (!data.length) {
                setError(
                    "Location not found."
                );

                return;
            }

            setResults(data);
        } catch (error) {
            console.error(
                "Location search error:",
                error
            );

            setError(
                "Unable to search location."
            );
        } finally {
            setLoading(false);
        }
    };

    const selectLocation = (
        item: SearchResult
    ) => {
        const latitude =
            Number(item.lat);

        const longitude =
            Number(item.lon);

        setSearch(
            item.display_name
        );

        setResults([]);
        setError("");

        onSelect(
            latitude,
            longitude
        );
    };

    return (
        <div
            ref={searchRef}
            className="absolute top-0 right-0 w-full md:w-[400px] z-[100]"
        >
            <div className="relative">
                {/* Search input */}
                <div className="flex items-center bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
                    <Search
                        size={20}
                        className="ml-4 text-gray-400 shrink-0"
                    />

                    <input
                        type="text"
                        value={search}
                        onChange={(e) =>
                            setSearch(
                                e.target.value
                            )
                        }
                        onKeyDown={(e) => {
                            if (
                                e.key ===
                                "Enter"
                            ) {
                                handleSearch();
                            }
                        }}
                        placeholder="Search location..."
                        className="flex-1 px-3 py-3 text-sm outline-none min-w-0"
                    />

                    <button
                        type="button"
                        onClick={
                            handleSearch
                        }
                        disabled={loading}
                        className="px-4 py-3 bg-primary text-white text-sm font-medium hover:bg-primary-dark disabled:opacity-50 shrink-0 cursor-pointer"
                    >
                        {loading
                            ? "Searching..."
                            : "Search"}
                    </button>
                </div>

                {/* Error */}
                {error && (
                    <div className="mt-2 bg-white rounded-lg shadow-lg border border-red-200 px-4 py-3 text-sm text-red-600">
                        {error}
                    </div>
                )}

                {/* Results */}
                {results.length >
                    0 && (
                        <div className="absolute left-0 right-0 mt-2 bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden">
                            {results.map(
                                (
                                    item,
                                    index
                                ) => (
                                    <button
                                        key={`${item.lat}-${item.lon}-${index}`}
                                        type="button"
                                        onClick={() =>
                                            selectLocation(
                                                item
                                            )
                                        }
                                        className="w-full flex items-start gap-3 px-4 py-3 text-left hover:bg-gray-50 border-b last:border-b-0"
                                    >
                                        <MapPin
                                            size={
                                                18
                                            }
                                            className="mt-1 text-red-500 shrink-0"
                                        />

                                        <span className="text-sm text-gray-700">
                                            {
                                                item.display_name
                                            }
                                        </span>
                                    </button>
                                )
                            )}
                        </div>
                    )}
            </div>
        </div>
    );
}

/*
 * Main Location Map
 */
export default function LocationMap({
    latitude:
    initialLatitude,
    longitude:
    initialLongitude,

    locations = [],

    multipleMarkers = false,

    radius = 0,

    onChange,
}: LocationMapProps) {
    const [
        latitude,
        setLatitude,
    ] = useState(
        initialLatitude
    );

    const [
        longitude,
        setLongitude,
    ] = useState(
        initialLongitude
    );

    const handleLocationChange = (
        lat: number,
        lng: number
    ) => {
        setLatitude(lat);
        setLongitude(lng);

        onChange(lat, lng);
    };

    return (
        <div className="relative h-[400px] w-full rounded-lg overflow-hidden">
            <MapContainer
                center={[
                    latitude,
                    longitude,
                ]}
                zoom={13}
                scrollWheelZoom={true}
                className="h-full w-full"
            >
                <TileLayer
                    attribution="&copy; OpenStreetMap contributors"
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {/* Search */}
                <LocationSearch
                    onSelect={
                        handleLocationChange
                    }
                />

                {/* Move map */}
                <MapController
                    latitude={latitude}
                    longitude={longitude}
                />

                {/* Existing locations */}
                {multipleMarkers &&
                    locations.length >
                    0 && (
                        <MultipleMarkers
                            locations={
                                locations
                            }
                            onSelect={
                                handleLocationChange
                            }
                        />
                    )}

                {/* Selected location */}
                <LocationMarker
                    latitude={latitude}
                    longitude={longitude}
                    onChange={
                        handleLocationChange
                    }
                />

                {/* Radius */}
                {radius > 0 && (
                    <Circle
                        center={[
                            latitude,
                            longitude,
                        ]}
                        radius={radius}
                    />
                )}
            </MapContainer>
        </div>
    );
}