import { apiService } from "@/services/api/api.service";

//Available Request
const availableRequestList = async (payload: any) => {
    return await apiService.post<any>("/customer/available-request-list", payload);
};
export const customerRoutes = {
    availableRequestList
}