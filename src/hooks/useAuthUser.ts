"use client";

import { useEffect, useState } from "react";
import {
    authUserId,
    authUserRole,
    authUser,
} from "@/utils/auth";

export function useAuthUser() {
    const [userId, setUserId] = useState<string | null>(null);
    const [userRole, setUserRole] = useState<string | null>(null);
    const [userProfile, setUserProfile] = useState<any | null>(null);

    useEffect(() => {
        const updateAuth = () => {
            const id = authUserId();
            const role = authUserRole();
            const profile = authUser();

            setUserId(id);
            setUserRole(role?.toLowerCase() ?? null);
            setUserProfile(profile ?? null);
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
        userRole,
        userProfile,
        isAuthenticated: !!userId,
    };
}