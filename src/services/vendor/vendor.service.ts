import { apiService } from "@/services/api/api.service";

const createIndividualService = async (formData: FormData) => {
    return await apiService.post<any>("/vendors/create-individual-service", formData);
};

export const vendorService = {
    createIndividualService,
};
