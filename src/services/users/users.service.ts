import { apiService } from "@/services/api/api.service";



const changePassword = async (payload: any) => {
    return await apiService.post<any>("/users/change-password", payload);
}

export const userService = {
    changePassword,
};
