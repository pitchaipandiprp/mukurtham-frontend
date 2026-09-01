"use client"

import { PanelLoginForm } from "@/components/pages/users/panel-login-form";
import { useGuestRedirect } from "@/hooks/useGuestRedirect";

export default function AdminLoginPage() {
    useGuestRedirect();

    return <PanelLoginForm role="admin" />;
}
