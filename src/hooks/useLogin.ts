"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { authService } from "@/services/auth/auth.service";
import { setAuthData } from "@/utils/auth";

export function useLogin(redirectTo = "/users/dashboard") {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [sendingOtp, setSendingOtp] = useState(false);
    const [error, setError] = useState("");
    const [otpSent, setOtpSent] = useState(false);
    const [resendCountdown, setResendCountdown] = useState(0);

    useEffect(() => {
        if (resendCountdown <= 0) {
            return;
        }

        const timer = setInterval(() => {
            setResendCountdown((previous) => {
                if (previous <= 1) {
                    clearInterval(timer);
                    return 0;
                }

                return previous - 1;
            });
        }, 1000);

        return () => {
            clearInterval(timer);
        };
    }, [resendCountdown]);

    async function handleSuccessfulLogin(result: any) {
        if (!result.success) {
            // setError(result.message || "Login failed");
            return false;
        }

        setAuthData(result.data);

        window.dispatchEvent(new Event("auth-change"));

        router.replace(redirectTo);
        return true;
    }

    async function loginWithEmail(email: string, password: string) {
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
            return await handleSuccessfulLogin(result);
        } catch (caughtError) {
            console.error("Email login failed:", caughtError);
            return false;
        } finally {
            setLoading(false);
        }
    }

    async function loginWithOtp(mobile: string, otp: string) {
        if (!mobile) {
            setError("Mobile number is required");
            return false;
        }

        if (!otp) {
            setError("OTP is required");
            return false;
        }

        if (otp.length !== 6) {
            setError("OTP must be 6 digits");
            return false;
        }

        setLoading(true);
        setError("");

        try {
            const result = await authService.otpLoginUser({ mobile, otp });
            return await handleSuccessfulLogin(result);
        } catch (caughtError) {
            console.error("OTP login failed:", caughtError);
            return false;
        } finally {
            setLoading(false);
        }
    }

    async function sendOtp(mobile: string) {
        if (!mobile) {
            setError("Mobile number is required");
            return false;
        }

        if (mobile.length !== 10) {
            setError("Mobile number must be 10 digits");
            return false;
        }

        setSendingOtp(true);
        setError("");

        try {
            const result = await authService.sendOtp({ mobile });

            if (!result.success) {
                // setError(result.message || "Failed to send OTP");
                return false;
            }

            setOtpSent(true);
            setResendCountdown(30);
            return true;
        } catch (caughtError) {
            console.error("Send OTP failed:", caughtError);
            return false;
        } finally {
            setSendingOtp(false);
        }
    }

    return {
        loginWithEmail,
        loginWithOtp,
        sendOtp,
        loading,
        sendingOtp,
        error,
        setError,
        otpSent,
        setOtpSent,
        resendCountdown,
    };
}