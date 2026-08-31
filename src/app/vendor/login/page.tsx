"use client"

import { LoginFormPage } from "@/components/pages/users/login-form-page";
import { useGuestRedirect } from "@/hooks/useGuestRedirect";

export default function VendorLoginPage() {
    useGuestRedirect();
    return <LoginFormPage role="vendor" />;
}
