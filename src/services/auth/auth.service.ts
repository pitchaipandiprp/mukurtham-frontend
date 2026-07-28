import { apiService } from "@/services/api/api.service";

export type LoginPayload = {
    email: string;
    password: string;
};

const loginUser = async (payload: LoginPayload) => {
    return await apiService.post<any>("/auth/login", payload);
}

const logoutUser = async (payload: any) => {
    return await apiService.post<any>("/auth/logout", payload);
}

export const authService = {
    loginUser,
    logoutUser,
};
