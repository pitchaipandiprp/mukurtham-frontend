"use client";

import { RegisterForm } from "@/components/pages/users/register-form";
import { useGuestRedirect } from "@/hooks/useGuestRedirect";

export default function RegisterPage() {
    useGuestRedirect();
    return <RegisterForm />;
}
