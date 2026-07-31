import { apiService } from "@/services/api/api.service";


const getCategories = async () => {
    return await apiService.get<any>("/categories", {});
}



const commonService = {
    getCategories,
};

export default commonService;
