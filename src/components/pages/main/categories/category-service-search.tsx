"use client";

import { FiChevronsDown, FiCalendar, FiChevronDown, FiCrosshair, FiHeart, FiLock, FiMapPin, FiMinus, FiPlus, FiSearch, FiSliders, FiStar, FiUsers, FiWind, } from "react-icons/fi";
import { FaBuilding } from "react-icons/fa";

const locationOptions = ["All Madurai", "Anna Nagar", "KK Nagar", "Alagar Kovil Road", "Tirupparankundram"];

const amenityOptions = [
    { label: "AC Hall", checked: true },
    { label: "Parking", checked: true },
    { label: "Rooms Available", checked: false },
    { label: "Dining Area", checked: false },
    { label: "Lift", checked: false },
    { label: "Power Backup", checked: false },
    { label: "Valet Parking", checked: false },
    { label: "Lawn", checked: false },
];

const venues = [
    {
        name: "Grand Palace",
        rating: "4.6",
        reviews: "256",
        location: "KK Nagar, Madurai",
        capacity: "500 - 1000",
        rooms: "75",
        price: "₹1,25,000",
        image: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80&w=600",
        description: "A premium wedding hall with elegant interiors and amenities.",
        tags: ["AC Hall", "Parking", "Dining", "Power Backup"],
        extraTags: "+3 more",
        featured: true,
    },
    {
        name: "Meenakshi Mahal",
        rating: "4.4",
        reviews: "189",
        location: "Alagar Kovil Road, Madurai",
        capacity: "300 - 750",
        rooms: "45",
        price: "₹85,000",
        image: "https://images.unsplash.com/photo-1544078751-58fee2d8a03b?auto=format&fit=crop&q=80&w=600",
        description: "Spacious and beautifully designed hall for grand celebrations.",
        tags: ["AC Hall", "Parking", "Rooms", "Dining"],
        extraTags: "+2 more",
        featured: false,
    },
    {
        name: "Sri Murugan Mahal",
        rating: "4.3",
        reviews: "142",
        location: "Tirupparankundram, Madurai",
        capacity: "200 - 500",
        rooms: "25",
        price: "₹65,000",
        image: "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&q=80&w=600",
        description: "Perfect for intimate weddings and traditional ceremonies.",
        tags: ["AC Hall", "Parking", "Dining", "Power Backup"],
        extraTags: "+2 more",
        featured: false,
    },
];

export default function CategoryServiceSearch() {
    return (
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 py-4">
            <div className="hidden md:flex bg-white p-2 rounded-2xl shadow-sm border border-gray-200 items-center justify-between mb-4">
                <div className="flex items-center divide-x divide-gray-200 flex-1">
                    <div className="flex items-center px-4 py-2 space-x-2 text-xs font-semibold text-gray-700 w-1/4 cursor-pointer justify-between">
                        <div className="flex items-center space-x-2">
                            <FaBuilding className="w-4 h-4 text-gray-500" />
                            <span>Wedding Halls</span>
                        </div>
                        <FiChevronDown className="w-4 h-4 text-gray-400" />
                    </div>

                    <div className="flex items-center px-4 py-2 space-x-2 text-xs font-semibold text-gray-700 w-1/4 cursor-pointer justify-between">
                        <div className="flex items-center space-x-2">
                            <FiCalendar className="w-4 h-4 text-gray-500" />
                            <span>24 May 2025</span>
                        </div>
                        <FiLock className="w-3.5 h-3.5 text-gray-400" />
                    </div>

                    <div className="flex items-center px-4 py-2 space-x-2 text-xs font-semibold text-gray-500 w-1/4 cursor-pointer justify-between">
                        <div className="flex items-center space-x-2">
                            <FiUsers className="w-4 h-4 text-gray-400" />
                            <span>Guest Count</span>
                        </div>
                        <FiChevronDown className="w-4 h-4 text-gray-400" />
                    </div>
                </div>

                <button type="button" className="bg-pink-700 hover:bg-pink-800 text-white px-8 py-2.5 rounded-xl text-xs font-semibold transition">
                    Search
                </button>
            </div>

            <div className="text-xs text-gray-500 mb-4 hidden md:flex items-center space-x-2">
                <a href="#" className="hover:underline">Home</a>
                <span>&gt;</span>
                <a href="#" className="hover:underline">Wedding Halls</a>
                <span>&gt;</span>
                <span className="text-gray-800 font-medium">Madurai</span>
            </div>

            <div className="md:hidden space-y-3 mb-4">
                <div className="bg-white p-3 rounded-xl border border-gray-200 flex justify-between items-center text-xs font-semibold text-gray-700">
                    <div className="flex items-center space-x-2">
                        <FaBuilding className="w-4 h-4 text-pink-700" />
                        <span>Wedding Halls</span>
                    </div>
                    <FiChevronDown className="w-4 h-4 text-gray-400" />
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="bg-white p-2.5 rounded-xl border border-gray-200 flex items-center space-x-2 text-gray-700 font-medium">
                        <FiCalendar className="w-4 h-4 text-gray-400" />
                        <span>24 May 2025</span>
                    </div>
                    <div className="bg-white p-2.5 rounded-xl border border-gray-200 flex items-center justify-between text-gray-400">
                        <div className="flex items-center space-x-2">
                            <FiUsers className="w-4 h-4" />
                            <span>Guest Count</span>
                        </div>
                        <FiChevronDown className="w-3.5 h-3.5" />
                    </div>
                </div>
                <button type="button" className="w-full bg-pink-700 text-white py-2.5 rounded-xl font-semibold text-xs">Search</button>

                <div className="flex justify-between items-center pt-2">
                    <span className="text-xs font-bold text-gray-800">128 Halls in Madurai</span>
                    <div className="flex space-x-2">
                        <button type="button" className="bg-white border border-gray-200 text-xs px-3 py-1.5 rounded-lg flex items-center space-x-1">
                            <FiSliders className="w-3.5 h-3.5" />
                            <span>Filter</span>
                        </button>
                        <button type="button" className="bg-white border border-gray-200 text-xs px-3 py-1.5 rounded-lg flex items-center space-x-1">
                            <FiChevronsDown className="w-3.5 h-3.5" />
                            <span>Sort</span>
                        </button>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                <aside className="hidden md:block md:col-span-3 bg-white p-5 rounded-2xl border border-gray-200 h-fit space-y-6">
                    <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                        <h2 className="font-bold text-xs uppercase tracking-wider text-gray-800">Filters</h2>
                        <button type="button" className="text-xs text-pink-700 font-semibold hover:underline">Clear All</button>
                    </div>

                    <div className="space-y-3">
                        <label className="text-xs font-bold text-gray-800 block">Location</label>
                        <div className="relative">
                            <FiSearch className="w-3.5 h-3.5 absolute left-3 top-2.5 text-gray-400" />
                            <input type="text" defaultValue="Madurai, Tamil Nadu" className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-8 pr-3 py-1.5 text-xs text-gray-700 focus:outline-none" />
                        </div>
                        <div className="space-y-2 text-xs font-medium text-gray-600">
                            {locationOptions.map((location, index) => (
                                <label
                                    key={location}
                                    className={`flex items-center space-x-2 cursor-pointer ${index === 0 ? "text-pink-700 font-semibold" : ""}`}
                                >
                                    <input type="radio" name="loc" defaultChecked={index === 0} className="accent-pink-700" />
                                    <span>{location}</span>
                                </label>
                            ))}
                            <button type="button" className="text-pink-700 text-xs font-bold hover:underline block">+ View More</button>
                        </div>
                    </div>

                    <div className="space-y-3 border-t border-gray-100 pt-4">
                        <label className="text-xs font-bold text-gray-800 block">Price Range</label>
                        <input type="range" className="w-full accent-pink-700" min="0" max="500000" />
                        <div className="flex justify-between text-[10px] text-gray-500 font-semibold">
                            <span>₹0</span>
                            <span>₹5,00,000+</span>
                        </div>
                        <div className="flex flex-wrap gap-1.5 pt-1">
                            <span className="px-2 py-1 bg-gray-100 border rounded text-[10px] text-gray-600">₹0 - ₹50K</span>
                            <span className="px-2 py-1 bg-gray-100 border rounded text-[10px] text-gray-600">₹50K - ₹1L</span>
                            <span className="px-2 py-1 bg-gray-100 border rounded text-[10px] text-gray-600">₹1L - ₹2L</span>
                            <span className="px-2 py-1 bg-gray-100 border rounded text-[10px] text-gray-600">₹2L+</span>
                        </div>
                    </div>

                    <div className="space-y-3 border-t border-gray-100 pt-4">
                        <label className="text-xs font-bold text-gray-800 block">Capacity (Guests)</label>
                        <div className="flex items-center space-x-2">
                            <select className="w-1/2 text-xs border border-gray-200 rounded-lg p-1.5 text-gray-500" defaultValue="Min">
                                <option>Min</option>
                            </select>
                            <select className="w-1/2 text-xs border border-gray-200 rounded-lg p-1.5 text-gray-500" defaultValue="Max">
                                <option>Max</option>
                            </select>
                        </div>
                        <div className="flex flex-wrap gap-1.5 pt-1">
                            <span className="px-2 py-1 bg-gray-100 border rounded text-[10px] text-gray-600">0 - 100</span>
                            <span className="px-2 py-1 bg-gray-100 border rounded text-[10px] text-gray-600">100 - 300</span>
                            <span className="px-2 py-1 bg-gray-100 border rounded text-[10px] text-gray-600">300 - 500</span>
                            <span className="px-2 py-1 bg-gray-100 border rounded text-[10px] text-gray-600">500+</span>
                        </div>
                    </div>

                    <div className="space-y-2 border-t border-gray-100 pt-4 text-xs font-medium text-gray-600">
                        <label className="text-xs font-bold text-gray-800 block mb-2">Amenities</label>
                        {amenityOptions.map((amenity) => (
                            <label key={amenity.label} className="flex items-center space-x-2 cursor-pointer">
                                <input type="checkbox" defaultChecked={amenity.checked} className="accent-pink-700 rounded" />
                                <span>{amenity.label}</span>
                            </label>
                        ))}
                        <button type="button" className="text-pink-700 text-xs font-bold hover:underline block pt-1">+ View More</button>
                    </div>

                    <div className="space-y-2 border-t border-gray-100 pt-4">
                        <button type="button" className="w-full bg-pink-700 text-white font-semibold py-2 rounded-xl text-xs hover:bg-pink-800 transition">
                            Apply Filters
                        </button>
                        <button type="button" className="w-full bg-white border border-gray-200 text-gray-700 font-semibold py-2 rounded-xl text-xs hover:bg-gray-50 transition">
                            Reset
                        </button>
                    </div>
                </aside>

                <main className="col-span-1 md:col-span-5 space-y-4">
                    <div className="hidden md:flex justify-between items-center">
                        <span className="text-sm font-bold text-gray-800">128 Wedding Halls found in Madurai</span>
                        <div className="flex items-center space-x-1 text-xs">
                            <span className="text-gray-500">Sort by:</span>
                            <select className="font-bold text-gray-800 bg-transparent border-none focus:outline-none" defaultValue="Popular">
                                <option>Popular</option>
                            </select>
                        </div>
                    </div>

                    {venues.map((venue) => (
                        <div key={venue.name} className="bg-white rounded-2xl p-3 border border-gray-200 flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 relative shadow-sm">
                            <div className="sm:w-2/5 h-40 sm:h-auto rounded-xl overflow-hidden relative">
                                <img src={venue.image} className="w-full h-full object-cover" alt={venue.name} />
                                {venue.featured ? (
                                    <span className="absolute top-2 left-2 bg-pink-700 text-white text-[9px] uppercase font-bold px-2 py-0.5 rounded">Popular</span>
                                ) : null}
                            </div>
                            <div className="sm:w-3/5 space-y-2 flex flex-col justify-between">
                                <div>
                                    <div className="flex justify-between items-start">
                                        <h3 className="font-bold text-sm text-gray-800">{venue.name}</h3>
                                        <div className="flex items-center text-xs font-semibold text-amber-600">
                                            <FiStar className="w-3.5 h-3.5 fill-amber-500 text-amber-500 mr-1" />
                                            <span>{venue.rating}</span> <span className="text-gray-400 text-[10px] ml-0.5">({venue.reviews})</span>
                                        </div>
                                    </div>
                                    <p className="text-[11px] text-gray-500 flex items-center mt-0.5">
                                        <FiMapPin className="w-3 h-3 mr-1 text-pink-700" /> {venue.location}
                                    </p>

                                    <div className="flex items-center space-x-3 text-[10px] text-gray-600 mt-2 font-medium">
                                        <div><span className="font-bold text-gray-800 block text-xs">{venue.capacity}</span> Seating Capacity</div>
                                        <div><span className="font-bold text-gray-800 block text-xs">{venue.rooms}</span> Rooms</div>
                                        <div className="flex items-center text-gray-500"><FiWind className="w-3 h-3 mr-1" /> AC Hall</div>
                                    </div>

                                    <p className="text-[10px] text-gray-500 mt-2 line-clamp-2">{venue.description}</p>

                                    <div className="flex flex-wrap gap-1 mt-2 text-[9px] text-gray-500">
                                        {venue.tags.map((tag) => (
                                            <span key={tag} className="bg-gray-100 px-1.5 py-0.5 rounded">{tag}</span>
                                        ))}
                                        <span className="text-pink-700 font-semibold">{venue.extraTags}</span>
                                    </div>
                                </div>

                                <div className="flex justify-between items-center border-t border-gray-100 pt-2">
                                    <div>
                                        <span className="text-[9px] text-gray-400 block">Starting from</span>
                                        <span className="font-bold text-sm text-gray-900">{venue.price}</span>
                                    </div>
                                    <button type="button" className="bg-pink-700 text-white text-xs px-3 py-1.5 rounded-lg font-semibold hover:bg-pink-800">
                                        View Details
                                    </button>
                                </div>
                            </div>
                            <button type="button" className="absolute top-2 right-2 p-1 text-gray-400 hover:text-pink-700">
                                <FiHeart className="w-4 h-4" />
                            </button>
                        </div>
                    ))}
                </main>

                <aside className="col-span-1 md:col-span-4 relative min-h-[500px] md:min-h-full rounded-2xl overflow-hidden border border-gray-200">
                    <div className="absolute inset-0 bg-blue-50">
                        <img src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=1000" className="w-full h-full object-cover opacity-60" alt="Madurai Map" />
                    </div>

                    <div className="absolute top-4 left-4 z-10 bg-white px-3 py-1.5 rounded-full shadow-md text-xs font-semibold text-gray-700 flex items-center space-x-2">
                        <input type="checkbox" defaultChecked className="accent-pink-700 rounded" />
                        <span>Search as I move the map</span>
                    </div>

                    <div className="absolute top-1/4 left-1/3 bg-pink-700 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg border-2 border-white cursor-pointer hover:scale-110 transition">
                        ₹1.25L
                    </div>

                    <div className="absolute top-1/5 right-1/4 bg-white text-gray-800 text-xs font-bold px-2 py-1 rounded-full shadow-lg border border-gray-300 cursor-pointer hover:scale-110 transition">
                        ₹90K
                    </div>

                    <div className="absolute bottom-1/3 left-1/4 bg-white text-gray-800 text-xs font-bold px-2 py-1 rounded-full shadow-lg border border-gray-300 cursor-pointer hover:scale-110 transition">
                        ₹65K
                    </div>

                    <div className="absolute bottom-1/4 right-1/3 bg-white text-gray-800 text-xs font-bold px-2 py-1 rounded-full shadow-lg border border-gray-300 cursor-pointer hover:scale-110 transition">
                        ₹1.75L
                    </div>

                    <div className="absolute bottom-6 right-4 z-10 flex flex-col space-y-2">
                        <div className="bg-white rounded-lg shadow-md border border-gray-200 divide-y divide-gray-100 flex flex-col">
                            <button type="button" className="p-2 text-gray-600 hover:text-pink-700"><FiPlus className="w-4 h-4" /></button>
                            <button type="button" className="p-2 text-gray-600 hover:text-pink-700"><FiMinus className="w-4 h-4" /></button>
                        </div>
                        <button type="button" className="bg-white p-2 rounded-lg shadow-md border border-gray-200 text-gray-600 hover:text-pink-700">
                            <FiCrosshair className="w-4 h-4" />
                        </button>
                    </div>
                </aside>
            </div>
        </div>
    );
}
