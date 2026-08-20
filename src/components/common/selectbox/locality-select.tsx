"use client";

import AsyncSelect from "react-select/async";
import type { SingleValue } from "react-select";
import commonRoutes from "@/services/api/common.routes";

export interface LocalityOption {
    value: number;
    label: string;
    stateId: number;
    cityId: number;
    stateName: string;
    cityName: string;

}

interface LocalitySelectProps {
    instanceId?: string;
    value?: LocalityOption | null;
    onChange: (locality: LocalityOption | null) => void;
    stateId?: number | null;
    cityId?: number | null;
    placeholder?: string;
    isDisabled?: boolean;
}

export default function LocalitySelect({
    instanceId,
    value = null,
    onChange,
    stateId = null,
    cityId = null,
    placeholder = "Search Location...",
    isDisabled = false,
}: LocalitySelectProps) {

    const loadLocalities = async (inputValue: string): Promise<LocalityOption[]> => {

        // if (!inputValue.trim()) {
        //     return [];
        // }

        try {
            const result = await commonRoutes.getLocalities({
                search: inputValue,
                limit: 10,
                state_id: stateId ?? undefined,
                city_id: cityId ?? undefined,
                status: 1,
            });

            if (!result || !result.success || !result.data) {
                return [];
            }

            return result.data.map((item: any) => ({
                value: item.id,
                label: item.name + (item.city_name ? `, ${item.city_name}` : "") + (item.state_name ? `, ${item.state_name}` : ""),
                stateId: item.state_id,
                cityId: item.city_id,
                stateName: item.state_name,
                cityName: item.city_name,
            }));

        } catch (error) {
            console.error("Failed to load location:", error);
            return [];
        }
    };

    const handleChange = (selected: SingleValue<LocalityOption>) => {
        onChange(selected);
    };

    return (
        <AsyncSelect<LocalityOption, false>
            instanceId={instanceId}
            cacheOptions
            defaultOptions={true}
            loadOptions={loadLocalities}
            value={value}
            onChange={handleChange}
            placeholder={placeholder}
            isClearable
            isSearchable
            isDisabled={isDisabled}
            loadingMessage={() =>
                "Searching Location..."
            }
            noOptionsMessage={() =>
                "No locality found"
            }
            classNames={{
                control: (state) =>
                    `!w-full !rounded-lg !border !bg-white !text-sm !text-slate-800 !shadow-sm !outline-none !transition-all !duration-300 ${state.isFocused
                        ? "!border-primary !ring-4 !ring-primary/5"
                        : "!border-slate-300 hover:!border-slate-300"
                    }`,

                valueContainer: () =>
                    "!px-4 !py-3",

                input: () =>
                    "!m-0 !p-0 !text-sm !text-slate-800",

                placeholder: () =>
                    "!text-slate-400",

                singleValue: () =>
                    "!text-slate-800",

                indicatorSeparator: () =>
                    "!hidden",

                dropdownIndicator: () =>
                    "!text-slate-400 hover:!text-slate-600 cursor-pointer",

                clearIndicator: () =>
                    "!text-slate-400 hover:!text-pink-500 cursor-pointer",

                menu: () =>
                    "!z-50 !mt-1 !overflow-hidden !rounded-lg !border !border-slate-200 !bg-white !shadow-lg",

                option: (state) =>
                    `!cursor-pointer !px-4 !py-3 !text-sm ${state.isSelected
                        ? "!bg-secondary-light !text-white"
                        : state.isFocused
                            ? "!bg-slate-50 !text-slate-800"
                            : "!bg-white !text-slate-700"
                    }`,
            }}
        />
    );
}