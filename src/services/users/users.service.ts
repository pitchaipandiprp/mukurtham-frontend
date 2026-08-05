import { apiService } from "@/services/api/api.service";


const createUser = async (payload: any) => {
    return await apiService.post<any>("/users/create", payload);
}



const changePassword = async (payload: any) => {
    return await apiService.post<any>("/users/change-password", payload);
}

const userUpdate = async (payload: any) => {
    return await apiService.post<any>("/users/update", payload);
}

const userProfile = async (payload: any) => {
    return await apiService.post<any>("/users/profile", payload);
}

const userList = async (payload: any) => {
    return await apiService.post<any>("/users/user-list", payload);
}

const userDelete = async (payload: any) => {
    return await apiService.post<any>("/users/delete", payload);
}

export const userService = {
    createUser,
    changePassword,
    userUpdate,
    userProfile,
    userList,
    userDelete,
};
