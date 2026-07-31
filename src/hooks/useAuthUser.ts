"use client";

import { useEffect, useState } from "react";
import {
    authUserId,
    authUserRole,
    authUser,
} from "@/utils/auth";

export function useAuthUser() {
    const [userId, setUserId] = useState<string | null>(null);
    const [role, setRole] = useState<string | null>(null);
    const [user, setUser] = useState<any | null>(null);

    useEffect(() => {
        const updateAuth = () => {
            setUserId(authUserId());
            setRole(authUserRole() ?? null);
            setUser(authUser() ?? null);
        };

        // Initial authentication state
        updateAuth();

        // Listen for login/logout changes
        window.addEventListener("auth-change", updateAuth);

        return () => {
            window.removeEventListener("auth-change", updateAuth);
        };
    }, []);

    return {
        userId,
        role,
        user,
        isAuthenticated: !!userId,
    };
}