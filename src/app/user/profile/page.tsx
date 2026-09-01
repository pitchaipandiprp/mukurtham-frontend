import { Metadata } from "next";
import { ChangeProfile } from "@/components/pages/customer/profile/change-profile";

export const metadata: Metadata = {
    title: "Mukurtham - User Profile",
    description: "Mukurtham - User Profile",
};

export default function UserProfilePage() {
    return <ChangeProfile />;
}
