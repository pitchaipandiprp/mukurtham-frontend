import { apiService } from "@/services/api/api.service";


const categoryServiceSearch = async (payload: any) => {
    return await apiService.post<any>("/category-service-search", payload);
}

const mainService = {
    categoryServiceSearch,
};

export default mainService;
