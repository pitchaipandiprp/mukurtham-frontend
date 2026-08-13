
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

const ratingStars = [1, 2, 3, 4, 5];

export const common = {
    formatAmount,
    ratingStars
};
