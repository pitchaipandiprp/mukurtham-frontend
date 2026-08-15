"use client";

import { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import "@/assets/css/fullcalendar.css";
import { vendorRoutes } from "@/services/api/vendor.routes";
import { common as commonUtils } from "@/utils/common";
import { constants } from "@/utils/constants";
import { sweetalert } from "@/utils/sweetalert";


export default function AvailabilityCalendar() {
    const [loading, setLoading] = useState(false);
    const [serviceDateRecords, setServiceDateRecords] = useState<any[]>([]);
    const [calendarEvents, setCalendarEvents] = useState<any[]>([]);
    const [categoryServiceRecords, setCategoryServiceRecords] = useState<any[]>([]);
    const [categoryServiceId, setCategoryServiceId] = useState<string>("");
    const inputClass = constants.inputClass;


    useEffect(() => {
        loadCategoryServiceRecords();
    }, []);

    useEffect(() => {
        fetchServiceDateRecords();
    }, [categoryServiceId]);

    const loadCategoryServiceRecords = async () => {
        const result = await vendorRoutes.categoryServiceRecords({});
        const resultData = result?.data || [];
        const catServiceId = resultData?.[0]?.id || 0;
        setCategoryServiceRecords(resultData);
        setCategoryServiceId(catServiceId);
    };

    const fetchServiceDateRecords = async () => {
        try {
            setLoading(true);

            const result = await vendorRoutes.serviceDateRecords({
                category_service_id: Number(categoryServiceId),
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
        let isUnavailable = false;

        const isUnavailableFromDateClick = serviceDateRecords.some((item: any) => {
            const serviceDate = item?.service_date ? commonUtils.formatDateTime(item.service_date, "YYYY-MM-DD") : "";
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
        if (currentDateType?.toLowerCase() == "unavailable") {
            createServiceDate(clickedDate, serviceDateId, 'available');
        }
    }
    const availableClickHandler = async (clickedDate: string, serviceDateId?: number, currentDateType?: string) => {
        if (!currentDateType?.trim() || currentDateType?.toLowerCase() == "available") {
            createServiceDate(clickedDate, serviceDateId, 'unavailable');
        }
    }

    const createServiceDate = async (clickedDate: string, serviceDateId?: number, dateType?: string) => {
        const confirmation = await sweetalert.confirm(
            `Are you sure you want to mark this date as ${dateType}?`,
            "Confirmation"
        );
        if (confirmation.isConfirmed) {
            await vendorRoutes.createServiceDate({
                category_service_id: Number(categoryServiceId),
                date_type: commonUtils.capitalizeFirst(dateType || ""),
                service_date: commonUtils.formatDateTime(clickedDate, "YYYY-MM-DD") || null,
                status: 1,
                ...(serviceDateId ? { id: Number(serviceDateId) } : {}),
            });

            await sweetalert.success(`Date marked as ${dateType}.`);
            fetchServiceDateRecords();
        }
    }

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
        <div className="d-block mb-20">
            <div className="mb-6 ml-1 flex items-center justify-between">
                <b className="flex items-center gap-2 text-2xl tracking-tight text-slate-600">Availability Calendar</b>
            </div>
            <section className="space-y-5">
                <div className="rounded-xl border border-slate-200 bg-white shadow-sm p-4">
                    <div className="grid grid-cols-12 md:grid-cols-12 gap-6">
                        <div className="md:col-span-9"></div>
                        <div className="col-span-12 mb-5 md:col-span-3">
                            <select
                                id="categoryServiceId"
                                value={categoryServiceId}
                                onChange={(event) => setCategoryServiceId(event.target.value)}
                                className={inputClass}
                            >
                                <option value="">Select Category Service</option>
                                {categoryServiceRecords.map((item) => (
                                    <option key={`category-service-${item.id}`} value={item.id}>
                                        {item.service_name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div>
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
                </div>
            </section>
        </div>
    );
}