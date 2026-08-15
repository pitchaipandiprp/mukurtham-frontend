import { apiService } from "@/services/api/api.service";


const getCategories = async () => {
    return await apiService.post<any>("/categories", {});
}

const getFacilities = async (payload: any) => {
    return await apiService.post<any>("/facilities", payload);
}

const getLocalities = async (payload: any) => {
    return await apiService.post<any>("/localities", payload);
}

const getCities = async (payload: any) => {
    return await apiService.post<any>("/cities", payload);
}

const commonRoutes = {
    getCategories,
    getFacilities,
    getLocalities,
    getCities,
};

export default commonRoutes;
