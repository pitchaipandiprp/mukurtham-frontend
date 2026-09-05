"use client";

import { useEffect, useState, useRef } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import "@/assets/css/compact-fullcalendar.css";
import mainRoutes from "@/services/api/main.routes";
import { common as commonUtils } from "@/utils/common";
import { sweetalert } from "@/utils/sweetalert";
import { constants } from "@/utils/constants";



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
    const [requestedDates, setRequestedDates] = useState<string[]>([]);
    const calendarRef = useRef<FullCalendar>(null);
    const [selectedDates, setSelectedDates] = useState<string[]>([]);


    // Foucus on the today date when clicking the title of the calendar
    useEffect(() => {
        const title = document.querySelector(".fc-toolbar-title");

        if (!title) return;

        title.classList.add("cursor-pointer");

        const handleTitleClick = () => {
            calendarRef.current?.getApi().today();
        };

        title.addEventListener("click", handleTitleClick);

        return () => {
            title.removeEventListener("click", handleTitleClick);
        };
    }, []);


    // Update the selected date highlight when selectedDates changes
    useEffect(() => {
        const cells = document.querySelectorAll(".fc-daygrid-day");

        cells.forEach((cell) => {
            const date = cell.getAttribute("data-date");

            if (!date) return;

            const number = cell.querySelector(".fc-daygrid-day-number");

            if (!number) return;

            number.classList.toggle("calendar-selected-number", selectedDates.includes(date));
        });
    }, [selectedDates]);


    useEffect(() => {
        setSelectedDates([]);

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

            const resultData = result.data || {};
            const serviceDates = resultData.service_dates || [];

            let requestedDates = resultData.requested_dates || [];
            requestedDates = requestedDates.map((item: any) =>
                commonUtils.formatDateTime(item.service_date, "YYYY-MM-DD")
            );

            setServiceDates(serviceDates);
            setRequestedDates(requestedDates);

        } catch (caughtError) {
            console.error("Failed to load review records:", caughtError);
        } finally {
            setLoading(false);
        }
    };


    const getDateRecords = (date: string) => {
        return serviceDates.filter((item: any) => {
            const serviceDate = item?.from_date ? commonUtils.formatDateTime(item.from_date, "YYYY-MM-DD") : "";
            return serviceDate === date;
        });
    };

    const getDateTypes = (date: string) => {
        return getDateRecords(date).map((item: any) => item?.date_type?.toLowerCase()).filter(Boolean);
    };

    const isRequestedDate = (date: string) => {
        return requestedDates.includes(date);
    };

    /*Remove the default behavior of Ctrl+click (or Cmd+click) on FullCalendar cells, 
    which selects multiple dates. We want to handle this ourselves.
    Remove the outline / blur effect when click ctrl+click*/
    const handleCalendarMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
        const isMultiSelect = event.ctrlKey || event.metaKey;

        if (!isMultiSelect) {
            return;
        }

        const target = event.target as HTMLElement;
        const dayCell = target.closest(".fc-daygrid-day[data-date]") as HTMLElement | null;

        if (!dayCell) {
            return;
        }

        // Prevent Firefox from focusing the FullCalendar cell
        event.preventDefault();
    };

    const handleCalendarClick = async (event: React.MouseEvent<HTMLDivElement>) => {
        const target = event.target as HTMLElement;
        const dayCell = target.closest(".fc-daygrid-day[data-date]") as HTMLElement | null;

        if (!dayCell) {
            return;
        }

        const clickedDate = dayCell.dataset.date;

        if (!clickedDate) {
            return;
        }

        const today = commonUtils.formatDateTime(new Date(), "YYYY-MM-DD");

        // Past date
        if (clickedDate < today) {
            sweetalert.toastError("Please select a current or future date.");
            return;
        }

        const dateTypes = getDateTypes(clickedDate);

        // Booked / unavailable cannot be selected
        if (dateTypes.includes("unavailable")) {
            sweetalert.toastError("This date is not available for selection.");
            return;
        }

        if (isRequestedDate(clickedDate)) {
            sweetalert.toastError("You have already submitted a request for this service on this date.");
            return;
        }

        const isMultiSelect = event.ctrlKey || event.metaKey;
        console.log("Clicked:", clickedDate);
        console.log("Ctrl:", event.ctrlKey);
        console.log("Meta:", event.metaKey);
        console.log("Multi:", isMultiSelect);

        if (isMultiSelect) {
            // Important: don't let Ctrl+click do anything else
            event.preventDefault();

            setSelectedDates((prev) => {
                if (prev.includes(clickedDate)) {
                    // Remove date
                    return prev.filter(
                        (date) => date !== clickedDate
                    );
                }

                // Add date
                return [...prev, clickedDate];
            });

            return;
        }

        // Normal click = single selection
        setSelectedDates([clickedDate]);
    };

    const handleDayCellClassNames = (arg: any) => {
        const date = commonUtils.formatDateTime(arg.date, "YYYY-MM-DD");

        const classes: string[] = [];

        if (selectedDates.includes(date)) {
            classes.push("calendar-selected");
        }

        const dateRecords = getDateRecords(date);

        /*if (dateRecords.length === 0) {
            return classes;
        }*/

        const dateTypes = dateRecords.map((item: any) => item?.date_type?.toLowerCase()).filter(Boolean);

        /* Highest priority */
        if (isRequestedDate(date)) {
            classes.push("calendar-requested");
        } else if (dateTypes.includes("unavailable")) {
            classes.push("calendar-unavailable");
        } else if (dateTypes.includes("holiday")) {
            classes.push("calendar-holiday");
        } else if (dateTypes.includes("waxing")) {
            classes.push("calendar-waxing");
        } else if (dateTypes.includes("waning")) {
            classes.push("calendar-waning");
        }

        return classes;
    };

    const checkAvailability = async () => {
        if (!selectedDates.length || selectedDates.length === 0) {
            sweetalert.toastError("Please select at least one date to check availability.");
            return;
        }

        try {
            const result = await mainRoutes.availabilityRequest({
                category_service_id: Number(categoryServiceId),
                service_dates: selectedDates
            });

            if (!result?.success) {
                return;
            }

            await sweetalert.success(result.message || "Availability request saved successfully.");

        } catch (caughtError) {
            console.error("Failed to save availability request:", caughtError);
        }
    }

    return (
        <>
            <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
                <div className="mb-3">
                    <div className="flex w-full flex-col gap-3">
                        {/* Title - Top */}
                        <h3 className="text-center text-lg font-bold text-gray-900">
                            Availability Calendar
                        </h3>

                        {/* Legend - Bottom */}
                        <div className="flex flex-wrap items-center justify-center gap-3">
                            {/* <div className="flex items-center gap-1 py-1.5">
                                <span className="h-2.5 w-2.5 rounded-full bg-green-500" />
                                <span className="text-[10px] font-semibold text-green-700">
                                    Waxing
                                </span>
                            </div>

                            <div className="flex items-center gap-1 py-1.5">
                                <span className="h-2.5 w-2.5 rounded-full bg-blue-500" />
                                <span className="text-[10px] font-semibold text-blue-700">
                                    Waning
                                </span>
                            </div> */}

                            <div className="flex items-center gap-1 py-1.5">
                                <span className="h-2.5 w-2.5 rounded-full bg-red-500" />
                                <span className="text-[10px] font-semibold text-red-700">
                                    Booked
                                </span>
                            </div>

                            <div className="flex items-center gap-1 py-1.5">
                                <span className="h-2.5 w-2.5 rounded-full bg-gray-400" />
                                <span className="text-[10px] font-semibold text-gray-600">
                                    Unavailable
                                </span>
                            </div>

                            <div className="flex items-center gap-1 py-1.5">
                                <span className="h-2.5 w-2.5 rounded-full bg-purple-400" />
                                <span className="text-[10px] font-semibold text-purple-600">
                                    Holiday
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <div>
                    <div className="calendar-container" onMouseDownCapture={handleCalendarMouseDown} onClickCapture={handleCalendarClick}>
                        <FullCalendar
                            ref={calendarRef}
                            plugins={[
                                dayGridPlugin,
                                interactionPlugin,
                            ]}
                            initialView="dayGridMonth"
                            dayCellClassNames={handleDayCellClassNames}
                            height="auto"
                            headerToolbar={{
                                left: "prev",
                                center: "title",
                                right: "next",
                            }}
                            buttonText={{
                                prev: "",
                                next: "",
                            }}
                        />
                    </div>
                    <button
                        onClick={checkAvailability}
                        className={`${constants.buttonClassWhite} mt-3 w-full text-center`}
                    >
                        Check Availability
                    </button>
                </div>
            </div>
        </>
    )
}
