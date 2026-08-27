import { apiService } from "@/services/api/api.service";

/////Category Service/////
const createCategoryService = async (formData: FormData) => {
    return await apiService.post<any>("/vendors/create-category-service", formData);
};

const updateCategoryServiceStatus = async (payload: any) => {
    return await apiService.post<any>("/vendors/update-category-service-status", payload);
};

const getCategoryService = async (payload: any) => {
    return await apiService.post<any>("/vendors/get-category-service", payload);
};

const categoryServiceList = async (payload: any) => {
    return await apiService.post<any>("/vendors/category-service-list", payload);
};

const categoryServiceRecords = async (payload: any) => {
    return await apiService.post<any>("/vendors/category-service-records", payload);
};

/////Gallery/////
const createGallery = async (formData: FormData) => {
    return await apiService.post<any>("/vendors/create-gallery", formData);
};

const updateGalleryStatus = async (payload: any) => {
    return await apiService.post<any>("/vendors/update-gallery-status", payload);
};

const getGallery = async (payload: any) => {
    return await apiService.post<any>("/vendors/get-gallery", payload);
};

const galleryList = async (payload: any) => {
    return await apiService.post<any>("/vendors/gallery-list", payload);
};

const galleryRecords = async (payload: any) => {
    return await apiService.post<any>("/vendors/gallery-records", payload);
};

/////Service Review/////
const serviceReviewList = async (payload: any) => {
    return await apiService.post<any>("/vendors/service-review-list", payload);
};
const updateServiceReviewStatus = async (payload: any) => {
    return await apiService.post<any>("/vendors/update-service-review-status", payload);
};


/////Service Date/////
const createServiceDate = async (payload: any) => {
    return await apiService.post<any>("/vendors/create-service-date", payload);
};

const updateServiceDateStatus = async (payload: any) => {
    return await apiService.post<any>("/vendors/update-service-date-status", payload);
};

const getServiceDate = async (payload: any) => {
    return await apiService.post<any>("/vendors/get-service-date", payload);
};

const serviceDateList = async (payload: any) => {
    return await apiService.post<any>("/vendors/service-date-list", payload);
};

const serviceDateForcalendar = async (payload: any) => {
    return await apiService.post<any>("/vendors/service-date-for-calendar", payload);
};

/////Service Certificate/////
const createServiceCertificate = async (formData: FormData) => {
    return await apiService.post<any>("/vendors/create-service-certificate", formData);
};

const getServiceCertificate = async (payload: any) => {
    return await apiService.post<any>("/vendors/get-service-certificate", payload);
};

/////Service Timeline/////
const createTimeline = async (payload: any) => {
    return await apiService.post<any>("/vendors/create-timeline", payload);
};

const updateTimelineStatus = async (payload: any) => {
    return await apiService.post<any>("/vendors/update-timeline-status", payload);
};

const getTimeline = async (payload: any) => {
    return await apiService.post<any>("/vendors/get-timeline", payload);
};

const serviceTimelineList = async (payload: any) => {
    return await apiService.post<any>("/vendors/timeline-list", payload);
};

export const vendorRoutes = {
    createCategoryService,
    getCategoryService,
    categoryServiceList,
    categoryServiceRecords,
    updateCategoryServiceStatus,
    createGallery,
    updateGalleryStatus,
    getGallery,
    galleryList,
    galleryRecords,
    serviceReviewList,
    updateServiceReviewStatus,
    createServiceDate,
    updateServiceDateStatus,
    getServiceDate,
    serviceDateList,
    serviceDateForcalendar,
    createServiceCertificate,
    getServiceCertificate,
    createTimeline,
    updateTimelineStatus,
    getTimeline,
    serviceTimelineList,
};
