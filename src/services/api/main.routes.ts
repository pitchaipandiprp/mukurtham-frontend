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

const createServiceReview = async (payload: any) => {
    return await apiService.post<any>("/create-service-review", payload);
};

const serviceReviewList = async (payload: any) => {
    return await apiService.post<any>("/service-review-list", payload);
};

const serviceReviewRecords = async (payload: any) => {
    return await apiService.post<any>("/service-review-records", payload);
};

const mainService = {
    categoryServiceSearch,
    getCategoryService,
    galleryRecords,
    createServiceReview,
    serviceReviewList,
    serviceReviewRecords,
};

export default mainService;
