"use client";

import AsyncSelect from "react-select/async";
import type { SingleValue } from "react-select";
import commonService from "@/services/common/common.service";

export interface LocalityOption {
    value: number;
    label: string;
    stateId: number;
    cityId: number;
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
    placeholder = "Search locality...",
    isDisabled = false,
}: LocalitySelectProps) {

    const loadLocalities = async (inputValue: string): Promise<LocalityOption[]> => {

        // if (!inputValue.trim()) {
        //     return [];
        // }

        try {
            const result = await commonService.getLocalities({
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
                label: item.name,
                stateId: item.state_id,
                cityId: item.city_id,
            }));

        } catch (error) {
            console.error("Failed to load localities:", error);
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
                "Searching localities..."
            }
            noOptionsMessage={() =>
                "No locality found"
            }
            styles={{
                control: (
                    base,
                    state
                ) => ({
                    ...base,

                    minHeight: "48px",

                    borderRadius: "8px",

                    borderColor:
                        state.isFocused
                            ? "var(--primary-color)"
                            : "#cbd5e1",

                    backgroundColor:
                        "white",

                    boxShadow:
                        state.isFocused
                            ? "0 0 0 4px rgba(0, 0, 0, 0.05)"
                            : "0 1px 2px rgba(0, 0, 0, 0.05)",

                    transition:
                        "all 300ms ease",

                    "&:hover": {
                        borderColor:
                            "#cbd5e1",
                    },
                }),

                valueContainer: (
                    base
                ) => ({
                    ...base,

                    padding:
                        "6px 16px",
                }),

                input: (
                    base
                ) => ({
                    ...base,

                    margin: 0,

                    padding: 0,

                    fontSize:
                        "0.875rem",

                    color:
                        "#1e293b",
                }),

                placeholder: (
                    base
                ) => ({
                    ...base,

                    color:
                        "#94a3b8",

                    fontSize:
                        "0.875rem",
                }),

                singleValue: (
                    base
                ) => ({
                    ...base,

                    color:
                        "#1e293b",

                    fontSize:
                        "0.875rem",
                }),

                indicatorSeparator: () => ({
                    display: "none",
                }),

                dropdownIndicator: (
                    base
                ) => ({
                    ...base,

                    color:
                        "#94a3b8",

                    "&:hover": {
                        color:
                            "#64748b",
                    },
                }),

                clearIndicator: (
                    base
                ) => ({
                    ...base,

                    color:
                        "#94a3b8",

                    "&:hover": {
                        color:
                            "#ef4444",
                    },
                }),

                menu: (
                    base
                ) => ({
                    ...base,

                    zIndex: 50,

                    borderRadius:
                        "8px",

                    overflow:
                        "hidden",

                    boxShadow:
                        "0 10px 25px rgba(0, 0, 0, 0.1)",
                }),

                option: (
                    base,
                    state
                ) => ({
                    ...base,

                    padding:
                        "10px 16px",

                    fontSize:
                        "0.875rem",

                    cursor:
                        "pointer",

                    backgroundColor:
                        state.isSelected
                            ? "var(--primary-color)"
                            : state.isFocused
                                ? "rgba(0, 0, 0, 0.05)"
                                : "white",

                    color:
                        state.isSelected
                            ? "white"
                            : "#334155",

                    "&:active": {
                        backgroundColor:
                            "var(--primary-color)",
                    },
                }),
            }}
        />
    );
}