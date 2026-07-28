"use client"

import { LoginForm } from "@/components/pages/users/login-form";
import { useGuestRedirect } from "@/hooks/useGuestRedirect";

export default function LoginPage() {
    useGuestRedirect();
    return <LoginForm />;
}
