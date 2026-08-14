"use client";
import { useState, useEffect } from "react";
import mainService from "@/services/api/main.routes";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import "@/assets/css/fullcalendar.css";


const mukurthamDates = [
    {
        date: "2026-08-15",
        type: "waxing",
        title: "Waxing",
    },
    {
        date: "2026-08-18",
        type: "waning ",
        title: "Waning ",
    },
];

const calendarEvents = mukurthamDates.map((item) => ({
    title: item.title,
    start: item.date,
    allDay: true,
    classNames:
        item.type === "waxing"
            ? ["muhurtham-waxing"]
            : ["muhurtham-waning "],
}));


type Props = {
    categoryServiceId: number | null;
    serviceRecord: any | null;
};

export function CategoryServiceCalendar({
    categoryServiceId,
    serviceRecord,
}: Props) {

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
                    // dateClick={handleDateClick}
                    events={calendarEvents}
                    height="auto"
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
