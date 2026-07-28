"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { authService } from "@/services/auth/auth.service";
import { setAuthData } from "@/utils/auth";

export function useLogin(redirectTo = "/dashboard") {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    async function login(email: string, password: string) {
        if (!email) {
            setError("Email is required");
            return false;
        }

        if (!password) {
            setError("Password is required");
            return false;
        }

        setLoading(true);
        setError("");

        try {
            const result = await authService.loginUser({ email, password });
            if (!result.success) {
                setError(result.message || "Login failed");
                return false;
            }

            setAuthData(result.data);

            window.dispatchEvent(new Event("auth-change"));

            router.replace(redirectTo);
            return true;

        } catch (caughtError) {
            console.error("Login failed:", caughtError);
            setError(caughtError instanceof Error ? caughtError.message : "Invalid email or password");
            return false;
        } finally {
            setLoading(false);
        }
    }

    return {
        login,
        loading,
        error,
        setError,
    };
}