import { Metadata } from "next";
import CustomerDashboard from "@/components/pages/customer/dashboard/customer-dashboard";

export const metadata: Metadata = {
    title: "Mukurtham - User Dashboard",
    description: "Mukurtham - User Dashboard",
};

export default function UserDashboardPage() {
    return <CustomerDashboard />;
}
