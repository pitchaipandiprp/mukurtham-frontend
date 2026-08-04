import { apiService } from "@/services/api/api.service";

const createIndividualService = async (formData: FormData) => {
    return await apiService.post<any>("/vendors/create-individual-service", formData);
};

const getIndividualService = async (payload: any) => {
    return await apiService.post<any>("/vendors/get-individual-service", payload);
};

export const vendorService = {
    createIndividualService,
    getIndividualService,
};
