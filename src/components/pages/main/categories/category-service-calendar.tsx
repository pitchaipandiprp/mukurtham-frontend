"use client";

import { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import "@/assets/css/fullcalendar.css";
import mainRoutes from "@/services/api/main.routes";
import { common as commonUtils } from "@/utils/common";



type Props = {
    categoryServiceId: number | null;
    serviceRecord: any | null;
};

export function CategoryServiceCalendar({
    categoryServiceId,
    serviceRecord,
}: Props) {

    const [loading, setLoading] = useState(false);
    const [serviceDates, setServiceDates] = useState<any[]>([]);
    const [calendarEvents, setCalendarEvents] = useState<any[]>([]);

    useEffect(() => {
        if (categoryServiceId) {
            fetchServiceDateForcalendar();
        }
    }, [categoryServiceId]);

    const fetchServiceDateForcalendar = async () => {
        try {
            setLoading(true);

            const result = await mainRoutes.serviceDateForcalendar({
                category_service_id: Number(categoryServiceId),
            });

            if (!result?.success) {
                return;
            }

            const resultData = result.data || [];
            setServiceDates(resultData);

            if (resultData && resultData.length > 0) {

                const eventsData = resultData
                    .filter(
                        (item: any) =>
                            item?.date_type?.toLowerCase() !== "available"
                    )
                    .map((item: any) => ({
                        title: item?.event_name || item?.date_type,
                        start: item?.from_date,
                        allDay: true,
                        classNames: [
                            item?.date_type?.toLowerCase()
                        ],
                        extendedProps: {
                            service_date_id: item?.id,
                            date_type: item?.date_type?.toLowerCase(),
                        },
                    }));

                setCalendarEvents(eventsData);
            }

        } catch (caughtError) {
            console.error("Failed to load review records:", caughtError);
        } finally {
            setLoading(false);
        }
    };

    const handleDateClick = async (arg: any) => {
        await handleServiceDateClick(arg.dateStr);
    }

    const handleEventClick = async (info: any) => {
        const event = info.event;

        await handleServiceDateClick(
            event.startStr,
            event.extendedProps?.service_date_id,
            event.extendedProps?.date_type
        );
    };

    const handleServiceDateClick = async (clickedDate: string, serviceDateId?: number, currentDateType?: string) => {
        if (!clickedDate) {
            return;
        }

        //Only Future Date is clickable, Past Date is not clickable
        if (new Date(clickedDate) < new Date(commonUtils.formatDateTime(new Date(), "YYYY-MM-DD"))) {
            return;
        }

        let isUnavailable = false;

        const isUnavailableFromDateClick = serviceDates.some((item: any) => {
            const serviceDate = item?.from_date ? commonUtils.formatDateTime(item.from_date, "YYYY-MM-DD") : "";
            return (serviceDate === clickedDate && item?.date_type?.toLowerCase() === "unavailable");
        });

        if (isUnavailableFromDateClick || currentDateType?.toLowerCase() === "unavailable") {
            isUnavailable = true;
        }

        if (isUnavailable) {
            unavailableClickHandler(clickedDate, serviceDateId, currentDateType);
        } else {
            availableClickHandler(clickedDate, serviceDateId, currentDateType);
        }
    };

    const unavailableClickHandler = async (clickedDate: string, serviceDateId?: number, currentDateType?: string) => {

    }
    const availableClickHandler = async (clickedDate: string, serviceDateId?: number, currentDateType?: string) => {

    }

    const handleDayCellClassNames = (arg: any) => {
        const date = commonUtils.formatDateTime(arg.date, "YYYY-MM-DD");

        const dateRecords = serviceDates.filter((item: any) => {
            const serviceDate = item?.from_date ? commonUtils.formatDateTime(item.from_date, "YYYY-MM-DD") : "";
            return serviceDate === date;
        });

        if (dateRecords.length === 0) {
            return [];
        }

        const dateTypes = dateRecords.map((item: any) => item?.date_type?.toLowerCase()).filter(Boolean);

        // Highest priority
        if (dateTypes.includes("unavailable")) {
            return ["calendar-unavailable"];
        }

        // if (dateTypes.includes("waxing")) {
        //     return ["calendar-waxing"];
        // }

        // if (dateTypes.includes("waning")) {
        //     return ["calendar-waning"];
        // }

        // Ignore available
        return [];
    };

    return (
        <>
            <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
                <div className="mb-10">
                    <div className="px-5 py-5">
                        <div className="mb-4 flex items-center justify-center gap-2">
                            <div className="h-1 w-8 rounded-full bg-primary/30" />
                            <h3 className="text-lg font-bold text-gray-900">
                                Availability Calendar
                            </h3>
                            <div className="h-1 w-8 rounded-full bg-primary/30" />
                        </div>

                        <div className="flex flex-wrap items-center justify-center gap-3 border-t border-gray-100 pt-4">
                            <div className="flex items-center gap-2 rounded-lg border border-green-100 bg-green-50 px-3 py-1.5">
                                <span className="h-2.5 w-2.5 rounded-lg bg-green-500" />
                                <span className="text-xs font-semibold text-green-700">
                                    Waxing Crescent
                                </span>
                            </div>

                            <div className="flex items-center gap-2 rounded-lg border border-blue-100 bg-blue-50 px-3 py-1.5">
                                <span className="h-2.5 w-2.5 rounded-lg bg-blue-500" />
                                <span className="text-xs font-semibold text-blue-700">
                                    Waning Crescent
                                </span>
                            </div>

                            <div className="flex items-center gap-2 rounded-lg border border-red-100 bg-red-50 px-3 py-1.5">
                                <span className="h-2.5 w-2.5 rounded-lg bg-red-500" />
                                <span className="text-xs font-semibold text-red-700">
                                    Booked
                                </span>
                            </div>

                            <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3 py-1.5">
                                <span className="h-2.5 w-2.5 rounded-lg bg-gray-400" />
                                <span className="text-xs font-semibold text-gray-600">
                                    Unavailable
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="calendar-container">
                    <FullCalendar
                        plugins={[
                            dayGridPlugin,
                            interactionPlugin,
                        ]}
                        initialView="dayGridMonth"
                        dateClick={handleDateClick}
                        eventClick={handleEventClick}
                        events={calendarEvents}
                        dayCellClassNames={handleDayCellClassNames}
                        height="auto"
                        validRange={{
                            // start: new Date(),
                        }}
                        headerToolbar={{
                            left: "prev,next today",
                            center: "title",
                            right: "",
                        }}
                        buttonText={{
                            today: "Today",
                        }}
                    />
                </div>
            </div>
        </>
    )
}
