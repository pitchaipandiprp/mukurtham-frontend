"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export function useGuestRedirect(redirectTo = "/users/dashboard") {
    const router = useRouter();
    const [isChecking, setIsChecking] = useState(true);

    useEffect(() => {
        const accessToken = localStorage.getItem("accessToken");
        if (accessToken) {
            router.replace(redirectTo);
        }

        setIsChecking(false);
    }, [router, redirectTo]);

    return isChecking;
}