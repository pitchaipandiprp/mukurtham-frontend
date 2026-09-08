"use client";

import { CalendarDays, Clock3, CloudSun, Moon, Sparkles, Sun, } from "lucide-react";
import { common as commonUtils } from "@/utils/common";

interface Props {
    calendarDate: any;
}

export function CategoryServiceCalendarDetails({
    calendarDate
}: Props) {

    if (!calendarDate) {
        return (
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm mb-2">
                <div className="flex min-h-[300px] flex-col items-center justify-center text-center">
                    <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-slate-100">
                        <CalendarDays className="h-7 w-7 text-slate-400" />
                    </div>

                    <h3 className="text-sm font-bold text-slate-800">
                        Select a Date
                    </h3>

                    <p className="mt-1 max-w-xs text-xs text-slate-500">
                        Select a date from the calendar to view
                        Panchang and Muhurtham details.
                    </p>
                </div>
            </div>
        );
    }

    const eventType =
        calendarDate?.event_type?.toLowerCase();

    const piraiType =
        calendarDate?.pirai_type?.toLowerCase();

    const isMuhurtham =
        eventType === "valarpirai_muhurtham" ||
        eventType === "theipirai_muhurtham";

    const isFestival =
        eventType === "festival";

    const isHoliday =
        eventType === "holiday";

    const getEventLabel = () => {
        if (isMuhurtham) {
            return calendarDate.event_name;
        }

        if (isFestival || isHoliday) {
            return calendarDate.event_name;
        }

        if (piraiType === "valarpirai") {
            return "Valarpirai";
        }

        if (piraiType === "theipirai") {
            return "Theipirai";
        }

        return "Regular Day";
    };

    const getEventStyle = () => {
        if (isMuhurtham) {
            return "bg-emerald-50 text-emerald-700 border-emerald-200";
        }

        if (isFestival || isHoliday) {
            return "bg-purple-50 text-purple-700 border-purple-200";
        }

        if (piraiType === "valarpirai") {
            return "bg-amber-50 text-amber-700 border-amber-200";
        }

        if (piraiType === "theipirai") {
            return "bg-slate-100 text-slate-700 border-slate-200";
        }

        return "bg-slate-50 text-slate-600 border-slate-200";
    };

    return (
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm mb-2">

            {/* Header */}
            <div className="border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white p-3">
                <div className="flex items-start justify-between gap-3">
                    <div>
                        <div className="mb-1 flex items-center gap-2 text-xs font-medium text-slate-500">
                            <CalendarDays className="h-3.5 w-3.5" />
                            <h3 className="text-lg font-bold text-slate-900">
                                {commonUtils.formatDateTime(calendarDate.calendar_date, "DD MMMM YYYY")}
                            </h3>
                            {calendarDate.weekday}
                        </div>
                        <div className="mt-3 text-xs text-slate-500">
                            <span className={`mr-3 inline-flex items-center rounded-full border px-3 py-1.5 text-xs font-semibold ${getEventStyle()}`}>
                                {getEventLabel()}
                            </span>
                            {calendarDate.tamil_month}{" "}
                            {calendarDate.tamil_day}
                        </div>
                    </div>
                </div>
            </div>

            {/* Panchang */}
            <div className="p-3">

                <h4 className="mb-2 text-xs font-bold uppercase tracking-wide text-slate-500">
                    Panchang
                </h4>

                <div className="grid grid-cols-2 gap-2">

                    <InfoItem
                        label="Tithi"
                        value={calendarDate.tithi}
                    />

                    <InfoItem
                        label="Paksha"
                        value={calendarDate.paksha}
                    />

                    <InfoItem
                        label="Nakshatra"
                        value={calendarDate.nakshatra}
                    />

                    <InfoItem
                        label="Yoga"
                        value={calendarDate.yoga}
                    />

                    <InfoItem
                        label="Karana"
                        value={calendarDate.karana}
                    />

                    <InfoItem
                        label="Pirai"
                        value={
                            piraiType === "valarpirai"
                                ? "Valarpirai"
                                : piraiType === "theipirai"
                                    ? "Theipirai"
                                    : "-"
                        }
                    />

                </div>

                {/* Tithi Time */}
                {/* {(calendarDate.tithi_start_time || calendarDate.tithi_end_time) && (
                    <div className="mt-5 border-t border-slate-100 pt-4">

                        <div className="mb-3 flex items-center gap-2">
                            <Clock3 className="h-4 w-4 text-slate-400" />

                            <h4 className="text-xs font-bold text-slate-700">
                                Tithi Timing
                            </h4>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <TimeItem label="Start" value={calendarDate.tithi_start_time} />
                            <TimeItem label="End" value={calendarDate.tithi_end_time} />
                        </div>
                    </div>
                )} */}

                {/* Nakshatra Time */}
                {/* {(calendarDate.nakshatra_start_time || calendarDate.nakshatra_end_time) && (
                    <div className="mt-5 border-t border-slate-100 pt-4">
                        <div className="mb-3 flex items-center gap-2">
                            <Moon className="h-4 w-4 text-slate-400" />

                            <h4 className="text-xs font-bold text-slate-700">
                                Nakshatra Timing
                            </h4>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <TimeItem label="Start" value={calendarDate.nakshatra_start_time} />
                            <TimeItem label="End" value={calendarDate.nakshatra_end_time} />
                        </div>
                    </div>
                )} */}

                {/* Sun */}
                {/* <div className="mt-5 border-t border-slate-100 pt-4">

                    <h4 className="mb-3 flex items-center gap-2 text-xs font-bold text-slate-700">
                        <Sun className="h-4 w-4 text-slate-400" />
                        Sun & Moon
                    </h4>

                    <div className="grid grid-cols-2 gap-3">
                        <TimeItem label="Sunrise" value={calendarDate.sunrise} />
                        <TimeItem label="Sunset" value={calendarDate.sunset} />
                        <TimeItem label="Moonrise" value={calendarDate.moonrise} />
                        <TimeItem label="Moonset" value={calendarDate.moonset} />
                    </div>
                </div> */}

                {/* Nalla Neram */}
                <div className="mt-5 border-t border-slate-100 pt-4">

                    <h4 className="mb-3 flex items-center gap-2 text-xs font-bold text-slate-700">
                        <CloudSun className="h-4 w-4 text-slate-400" />
                        Auspicious Time
                    </h4>

                    <div className="space-y-2 text-xs">
                        <RowItem label="Nalla Neram" value={calendarDate.nalla_neram} />
                        <RowItem label="Gowri Nalla Neram" value={calendarDate.gowri_nalla_neram} />
                    </div>
                </div>

                {/* Dosham */}
                <div className="mt-5 border-t border-slate-100 pt-4">
                    <h4 className="mb-3 text-xs font-bold text-slate-700">
                        Other Details
                    </h4>

                    <div className="space-y-2 text-xs">
                        <RowItem label="Rahu Kalam" value={calendarDate.rahu_kalam} />
                        <RowItem label="Yamagandam" value={calendarDate.yamagandam} />
                        <RowItem label="Kuligai" value={calendarDate.kuligai} />
                        <RowItem label="Chandrashtamam" value={calendarDate.chandrashtamam} />
                        <RowItem label="Soolam" value={calendarDate.soolam} />
                        <RowItem label="Pariharam" value={calendarDate.pariharam} />
                    </div>
                </div>

            </div>
        </div>
    );
};

const InfoItem = ({
    label,
    value,
}: {
    label: string;
    value?: string | null;
}) => (
    <div className="rounded-lg border border-slate-100 bg-slate-50 p-1">
        <div className="text-[10px] font-medium uppercase tracking-wide text-slate-400">
            {label}
        </div>

        <div className="mt-1 text-xs font-semibold text-slate-800">
            {value || "-"}
        </div>
    </div>
);

const TimeItem = ({
    label,
    value,
}: {
    label: string;
    value?: string | null;
}) => (
    <div className="rounded-lg bg-slate-50 px-3 py-2">
        <div className="text-[10px] font-medium text-slate-400">
            {label}
        </div>

        <div className="mt-0.5 text-xs font-semibold text-slate-700">
            {value ? commonUtils.formatDateTime(value, "hh:mm A") : "-"}
        </div>
    </div>
);

const RowItem = ({
    label,
    value,
}: {
    label: string;
    value?: string | null;
}) => (
    <div className="flex items-center justify-between gap-3 rounded-lg bg-slate-50 px-3 py-2">
        <span className="text-slate-500">
            {label}
        </span>

        <span className="text-right font-semibold text-slate-700">
            {value || "-"}
        </span>
    </div>
);