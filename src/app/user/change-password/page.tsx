import { Metadata } from "next";
import { ChangePassword } from "@/components/pages/customer/profile/change-password";

export const metadata: Metadata = {
    title: "Mukurtham - User Change Password",
    description: "Mukurtham - User Change Password",
};

export default function UserChangePasswordPage() {
    return <ChangePassword />;
}
