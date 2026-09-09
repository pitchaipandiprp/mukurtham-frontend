import { Metadata } from "next";
import MyOrderList from "@/components/pages/customer/my-orders/my-order-list";

export const metadata: Metadata = {
    title: "Mukurtham :: User - My Orders",
    description: "Mukurtham :: User - My Orders",
};

export default function MyOrdersPage() {
    return <MyOrderList />;
}