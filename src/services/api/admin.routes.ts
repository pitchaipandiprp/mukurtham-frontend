import { apiService } from "@/services/api/api.service";

/////Service Date/////
const createServiceDate = async (payload: any) => {
    return await apiService.post<any>("/admin/create-service-date", payload);
};

const updateServiceDateStatus = async (payload: any) => {
    return await apiService.post<any>("/admin/update-service-date-status", payload);
};

const getServiceDate = async (payload: any) => {
    return await apiService.post<any>("/admin/get-service-date", payload);
};

const serviceDateList = async (payload: any) => {
    return await apiService.post<any>("/admin/service-date-list", payload);
};

const serviceDateRecords = async (payload: any) => {
    return await apiService.post<any>("/admin/service-date-records", payload);
};

export const adminService = {
    createServiceDate,
    updateServiceDateStatus,
    getServiceDate,
    serviceDateList,
    serviceDateRecords,
};