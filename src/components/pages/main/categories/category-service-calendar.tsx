"use client";
import { useState, useEffect } from "react";
import mainRoutes from "@/services/api/main.routes";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import "@/assets/css/fullcalendar.css";




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
            const result = await mainRoutes.serviceDateRecords({});

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
                        classNames: item?.date_type && item?.date_type.toLowerCase(),
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
        const clickedEvent = calendarEvents.find((event) => event.start === clickedDate);
        alert(`Clicked on date: ${clickedDate}\nEvent: ${clickedEvent ? clickedEvent.title : "No event"}`);
    }

    return (
        <>
            <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
                <h3 className="mb-3 text-sm font-bold text-gray-900">Availability Calendar</h3>

                <FullCalendar
                    plugins={[
                        dayGridPlugin,
                        interactionPlugin,
                    ]}
                    initialView="dayGridMonth"
                    dateClick={handleDateClick}
                    events={calendarEvents}
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
