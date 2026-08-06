import { apiService } from "@/services/api/api.service";

const createCategoryService = async (formData: FormData) => {
    return await apiService.post<any>("/vendors/create-category-service", formData);
};

const deleteCategoryService = async (payload: any) => {
    return await apiService.post<any>("/vendors/delete-category-service", payload);
};

const getCategoryService = async (payload: any) => {
    return await apiService.post<any>("/vendors/get-category-service", payload);
};

const categoryServiceList = async (payload: any) => {
    return await apiService.post<any>("/vendors/category-service-list", payload);
};

export const vendorService = {
    createCategoryService,
    getCategoryService,
    categoryServiceList,
    deleteCategoryService,
};
