"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export function useGuestRedirect(redirectTo = "/dashboard") {
    const router = useRouter();
    const [isChecking, setIsChecking] = useState(true);

    useEffect(() => {
        const accessToken = localStorage.getItem("accessToken");
        if (accessToken) {
            router.push(redirectTo);
        }

        setIsChecking(false);
    }, [router]);

    return isChecking;
}