import { apiService } from "@/services/api/api.service";


const categoryServiceSearch = async (payload: any) => {
    return await apiService.post<any>("/category-service-search", payload);
}

const getCategoryService = async (payload: any) => {
    return await apiService.post<any>("/get-category-service", payload);
};

const galleryRecords = async (payload: any) => {
    return await apiService.post<any>("/gallery-records", payload);
};

const serviceReviewRecords = async (payload: any) => {
    return await apiService.post<any>("/service-review-records", payload);
};

const mainService = {
    categoryServiceSearch,
    getCategoryService,
    galleryRecords,
    serviceReviewRecords,
};

export default mainService;
