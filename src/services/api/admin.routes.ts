import { apiService } from "@/services/api/api.service";

//Vendor
const vendorList = async (payload: any) => {
    return await apiService.post<any>("/admin/vendor-list", payload);
};
const updateVendorStatus = async (payload: any) => {
    return await apiService.post<any>("/admin/update-vendor-status", payload);
};
const vendorBusinessList = async (payload: any) => {
    return await apiService.post<any>("/admin/vendor-business-list", payload);
};

//Cstomer
const customerList = async (payload: any) => {
    return await apiService.post<any>("/admin/customer-list", payload);
};
const updateCustomerStatus = async (payload: any) => {
    return await apiService.post<any>("/admin/update-customer-status", payload);
};

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


//Category Service
const getCategoryService = async (payload: any) => {
    return await apiService.post<any>("/admin/get-category-service", payload);
};
const getServiceCertificate = async (payload: any) => {
    return await apiService.post<any>("/admin/get-service-certificate", payload);
};
const updateServiceCertificate = async (payload: any) => {
    return await apiService.post<any>("/admin/update-service-certificate", payload);
};


export const adminRoutes = {
    vendorList,
    updateVendorStatus,
    vendorBusinessList,
    customerList,
    updateCustomerStatus,
    createServiceDate,
    updateServiceDateStatus,
    getServiceDate,
    serviceDateList,
    serviceDateRecords,
    getCategoryService,
    getServiceCertificate,
    updateServiceCertificate,
};