import { apiService } from "@/services/api/api.service";


const getCategories = async () => {
    return await apiService.get<any>("/categories", {});
}

const getLocalities = async (query: any) => {
    const params = new URLSearchParams();

    if (query.limit) {
        params.set("limit", String(query.limit));
    }

    if (query.search) {
        params.set("search", query.search);
    }

    if (query.state_id) {
        params.set("state_id", String(query.state_id));
    }

    if (query.city_id) {
        params.set("city_id", String(query.city_id));
    }

    if (query.status !== undefined) {
        params.set("status", String(query.status));
    }

    const queryString = params.toString();
    const endpoint = queryString ? `/localities?${queryString}` : "/localities";

    return await apiService.get<any>(endpoint, {});
}

const commonService = {
    getCategories,
    getLocalities,
};

export default commonService;
