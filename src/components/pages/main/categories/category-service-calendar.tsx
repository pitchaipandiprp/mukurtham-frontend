"use client";
import { useState, useEffect } from "react";
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
    const [serviceDateRecords, setServiceDateRecords] = useState<any[]>([]);
    const [calendarEvents, setCalendarEvents] = useState<any[]>([]);

    useEffect(() => {
        fetchServiceDateRecords()
    }, []);

    const fetchServiceDateRecords = async () => {
        try {
            setLoading(true);
            const result = await mainRoutes.serviceDateRecords({
                category_service_id: categoryServiceId,
            });

            if (!result?.success) {
                return;
            }

            const resultData = result.data || [];
            setServiceDateRecords(resultData);

            if (resultData && resultData.length > 0) {

                const eventsData = resultData
                    .filter(
                        (item: any) =>
                            item?.date_type?.toLowerCase() !== "available"
                    )
                    .map((item: any) => ({
                        title: item?.date_type,
                        start: item?.service_date,
                        allDay: true,
                        classNames: [
                            item?.date_type?.toLowerCase()
                        ],
                        extendedProps: {
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

    const handleDateClick = (arg: any) => {
        const clickedDate = arg.dateStr;

        const isUnavailable = serviceDateRecords.some((item: any) => {
            const serviceDate = item?.service_date ? commonUtils.formatDateTime(item.service_date, "YYYY-MM-DD") : "";
            return (serviceDate === clickedDate && item?.date_type?.toLowerCase() === "unavailable");
        });

        if (isUnavailable) {
            return;
        }

        const clickedEvent = calendarEvents.find((event: any) => {
            const eventDate = event?.start ? commonUtils.formatDateTime(event.start, "YYYY-MM-DD") : "";
            return eventDate === clickedDate;
        });

        alert(`Clicked on date: ${clickedDate}\nEvent: ${clickedEvent ? clickedEvent.title : "No event"}`);
    }

    const handleEventClick = (info: any) => {
        const clickedDate = info.event.startStr;
        const dateType = info.event.extendedProps?.date_type?.toLowerCase();
        if (dateType === "unavailable") {
            return;
        }

        alert(
            `Clicked on date: ${clickedDate}\nEvent: ${info.event.title}`
        );
    };

    const handleDayCellClassNames = (arg: any) => {
        const date = commonUtils.formatDateTime(arg.date, "YYYY-MM-DD");

        const dateRecords = serviceDateRecords.filter((item: any) => {
            const serviceDate = item?.service_date ? commonUtils.formatDateTime(item.service_date, "YYYY-MM-DD") : "";
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

        if (dateTypes.includes("waxing")) {
            return ["calendar-waxing"];
        }

        if (dateTypes.includes("waning")) {
            return ["calendar-waning"];
        }

        // Ignore available
        return [];
    };

    return (
        <>
            <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
                <div className="mb-10 flex items-center justify-between">
                    <h3 className="mb-3 text-sm font-bold text-gray-900">Availability Calendar</h3>
                    <div className="flex items-center gap-2">
                        <span className="cursor-pointer inline-flex rounded-full px-2.5 py-1 text-xs font-semibold bg-pink-500 text-white">
                            Waxing Crescent
                        </span>
                        <span className="cursor-pointer inline-flex rounded-full px-2.5 py-1 text-xs font-semibold bg-yellow-500 text-white">
                            Waning Crescent
                        </span>
                        <span className="cursor-pointer inline-flex rounded-full px-2.5 py-1 text-xs font-semibold bg-gray-300 text-white">
                            Unavailable
                        </span>
                    </div>
                </div>

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
                        start: new Date(),
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
        </>
    )
}
