import { apiService } from "@/services/api/api.service";

export type LoginPayload = {
    email: string;
    password: string;
    role?: string;
};

export type OtpLoginPayload = {
    mobile: string;
    otp: string;
    role?: string;
};

export type SendOtpPayload = {
    mobile: string;
    purpose?: string;
};

const loginUser = async (payload: LoginPayload) => {
    return await apiService.post<any>("/auth/login", payload);
}

const otpLoginUser = async (payload: OtpLoginPayload) => {
    return await apiService.post<any>("/auth/otp-login", payload);
}

const sendOtp = async (payload: SendOtpPayload) => {
    return await apiService.post<any>("/auth/send-otp", payload);
}

const verifyOtp = async (payload: any) => {
    return await apiService.post<any>("/auth/verify-otp", payload);
}

const logoutUser = async (payload: any) => {
    return await apiService.post<any>("/auth/logout", payload);
}

export const authRoutes = {
    loginUser,
    otpLoginUser,
    sendOtp,
    verifyOtp,
    logoutUser,
};
