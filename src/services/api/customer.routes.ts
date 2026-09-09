import { apiService } from "@/services/api/api.service";

//Available Request
const availableRequestList = async (payload: any) => {
    return await apiService.post<any>("/customer/available-request-list", payload);
};

const createServiceOrder = async (payload: any) => {
    return await apiService.post<any>("/customer/create-service-order", payload);
};


const verifyPayment = async (payload: any) => {
    return await apiService.post<any>("/customer/verify-payment", payload);
};

export const customerRoutes = {
    availableRequestList,
    createServiceOrder,
    verifyPayment,
}