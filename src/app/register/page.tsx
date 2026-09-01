"use client";

import { RegisterForm } from "@/components/pages/user/register-form";
import { useGuestRedirect } from "@/hooks/useGuestRedirect";

export default function RegisterPage() {
    useGuestRedirect();
    return <RegisterForm />;
}
