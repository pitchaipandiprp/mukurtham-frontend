"use client";

import { useRouter } from "next/navigation";
import { authService } from "@/services/api/auth.service";
import { sweetalert } from "@/utils/sweetalert";
import { clearAuthData } from "@/utils/auth";

export function useLogout(redirectTo = "/login") {
    const router = useRouter();

    async function logout() {
        const swalResult = await sweetalert.confirm("Are you sure you want to logout?", "Logout Confirmation");
        if (!swalResult.isConfirmed) {
            return;
        }

        try {
            await authService.logoutUser({});
        } catch (caughtError) {
            console.error("Logout failed:", caughtError);
        } finally {
            clearAuthData();
            window.dispatchEvent(new Event("auth-change"));
            router.replace(redirectTo);
        }
    }

    return {
        logout,
    };
}