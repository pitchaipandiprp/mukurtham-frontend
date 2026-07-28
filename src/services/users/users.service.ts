import { apiService } from "@/services/api/api.service";


const createUser = async (payload: any) => {
    return await apiService.post<any>("/users/create", payload);
}



const changePassword = async (payload: any) => {
    return await apiService.post<any>("/users/change-password", payload);
}

export const userService = {
    createUser,
    changePassword,
};
