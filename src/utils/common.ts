
const ratingStars = [1, 2, 3, 4, 5];

const formatAmount = (amount: number | null) => {
    if (amount === null || Number.isNaN(amount)) {
        return "-";
    }
    return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0,
    }).format(amount);
};

export const formatDateTime = (
    date?: string | Date | null,
    format: string = "DD MMM YYYY"
): string => {
    if (!date) return "";

    const dateObj = new Date(date);

    if (isNaN(dateObj.getTime())) {
        return "";
    }

    const day = String(dateObj.getDate()).padStart(2, "0");
    const month = String(dateObj.getMonth() + 1).padStart(2, "0");
    const year = dateObj.getFullYear();

    const hours24 = dateObj.getHours();
    const hours12 = hours24 % 12 || 12;

    const hours = String(hours12).padStart(2, "0");
    const minutes = String(dateObj.getMinutes()).padStart(2, "0");

    const monthNames = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
    ];

    const monthShort = monthNames[dateObj.getMonth()];

    const monthLongNames = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
    ];

    const monthLong = monthLongNames[dateObj.getMonth()];

    const ampm = hours24 >= 12 ? "PM" : "AM";

    const replacements: Record<string, string> = {
        YYYY: String(year),
        YY: String(year).slice(-2),

        MM: month,
        M: String(dateObj.getMonth() + 1),

        DD: day,
        D: String(dateObj.getDate()),

        MMM: monthShort,
        MMMM: monthLong,

        hh: hours,
        h: String(hours12),

        HH: String(hours24).padStart(2, "0"),
        H: String(hours24),

        mm: minutes,

        A: ampm,
        a: ampm.toLowerCase(),
    };

    return format.replace(
        /YYYY|MMMM|MMM|MM|M|DD|D|HH|H|hh|h|mm|A|a|YY/g,
        (token) => replacements[token] ?? token
    );
};

export const common = {
    ratingStars,
    formatAmount,
    formatDateTime,
};
