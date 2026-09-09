"use client";

import React from "react";
import { useAuthRedirect } from "@/hooks/useAuthRedirect";

export default function PanelLayout({
    children,
}: {
    children: React.ReactNode;
}) {

    useAuthRedirect();

    return <>{children}</>;
}