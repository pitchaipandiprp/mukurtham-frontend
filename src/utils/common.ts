
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

export const common = {
    formatAmount
};
