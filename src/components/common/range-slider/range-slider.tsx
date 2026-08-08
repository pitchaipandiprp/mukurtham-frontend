"use client";

interface RangeSliderProps {
    min: number;
    max: number;
    minValue: number;
    maxValue: number;
    step?: number;
    onChange: (minValue: number, maxValue: number) => void;
}

export default function RangeSlider({
    min,
    max,
    minValue,
    maxValue,
    step = 1000,
    onChange,
}: RangeSliderProps) {
    const minPercent = ((minValue - min) / (max - min)) * 100;
    const maxPercent = ((maxValue - min) / (max - min)) * 100;

    const handleMinChange = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const value = Number(event.target.value);

        if (value <= maxValue) {
            onChange(value, maxValue);
        }
    };

    const handleMaxChange = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const value = Number(event.target.value);

        if (value >= minValue) {
            onChange(minValue, value);
        }
    };

    return (
        <div className="w-full">
            {/* Values */}
            <div className="mb-3 flex justify-between text-sm text-gray-600">
                <span>
                    ₹{minValue.toLocaleString("en-IN")}
                </span>

                <span>
                    ₹{maxValue.toLocaleString("en-IN")}
                </span>
            </div>

            {/* Slider */}
            <div className="relative h-5">
                {/* Background */}
                <div className="absolute left-0 right-0 top-2 h-1.5 rounded-full bg-gray-200 border border-gray-400" />

                {/* Selected range */}
                <div
                    className="absolute top-2 h-1.5 rounded-full bg-primary"
                    style={{
                        left: `${minPercent}%`,
                        right: `${100 - maxPercent}%`,
                    }}
                />

                {/* Minimum */}
                <input
                    type="range"
                    min={min}
                    max={max}
                    step={step}
                    value={minValue}
                    onChange={handleMinChange}
                    className="range-slider absolute left-0 top-0 w-full outline-none"
                />

                {/* Maximum */}
                <input
                    type="range"
                    min={min}
                    max={max}
                    step={step}
                    value={maxValue}
                    onChange={handleMaxChange}
                    className="range-slider absolute left-0 top-0 w-full outline-none"
                />
            </div>

            {/* Labels */}
            <div className="mt-2 flex justify-between text-xs text-gray-500">
                <span>From</span>
                <span>To</span>
            </div>
        </div>
    );
}