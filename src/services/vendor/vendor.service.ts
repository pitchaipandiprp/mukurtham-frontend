import { apiService } from "@/services/api/api.service";

const createIndividualService = async (payload: any) => {
    return await apiService.post<any>("/vendors/create-individual-service", payload);
};

export const vendorService = {
    createIndividualService,
};
