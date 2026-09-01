import { Metadata } from "next";
import { CustomerProfile } from "@/components/pages/customer/profile/customer-profile";

export const metadata: Metadata = {
    title: "Mukurtham - User Profile",
    description: "Mukurtham - User Profile",
};

export default function UserProfilePage() {
    return <CustomerProfile />;
}
