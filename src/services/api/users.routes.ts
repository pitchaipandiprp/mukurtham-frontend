import { apiService } from "@/services/api/api.service";


const createUser = async (payload: any) => {
    return await apiService.post<any>("/users/create", payload);
}

const getUser = async (payload: any) => {
    return await apiService.post<any>("/users/get-user", payload);
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

const updateStatus = async (payload: any) => {
    return await apiService.post<any>("/users/update-status", payload);
}

export const userRoutes = {
    createUser,
    getUser,
    changePassword,
    userUpdate,
    userProfile,
    userList,
    updateStatus,
};
