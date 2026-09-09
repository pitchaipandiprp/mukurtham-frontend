import { apiService } from "@/services/api/api.service";

//Available Request
const availableRequestList = async (payload: any) => {
    return await apiService.post<any>("/customer/available-request-list", payload);
};

//Payment
const createServiceOrder = async (payload: any) => {
    return await apiService.post<any>("/customer/create-service-order", payload);
};

const verifyPayment = async (payload: any) => {
    return await apiService.post<any>("/customer/verify-payment", payload);
};

//My Orders
const myOrderList = async (payload: any) => {
    return await apiService.post<any>("/customer/my-order-list", payload);
};


export const customerRoutes = {
    availableRequestList,
    createServiceOrder,
    verifyPayment,
    myOrderList,
}