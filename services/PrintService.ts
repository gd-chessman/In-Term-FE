import axiosClient from "@/utils/axiosClient";

export const getPrintTemplates = async () => {
    try {
        const temp = await axiosClient.get(`prints/templates`);
        return temp.data.data;
    } catch (e) {
        return [];
    }
}

export const createPrintTemplate = async (item: any) => {
    try {
        const temp = await axiosClient.post(`prints/templates/setting-templates`, item);
        return temp.data;
    } catch (e) {
        throw e;
    }
}

export const updatePrintTemplate = async (countryId: number, item: any) => {
    try {
        const temp = await axiosClient.patch(`prints/templates/country/${countryId}`, item);
        return temp.data;
    } catch (e) {
        throw e;
    }
}

export const deletePrintTemplate = async (countryId: number) => {
    try {
        const temp = await axiosClient.delete(`prints/templates/country/${countryId}`);
        return temp.data;
    } catch (e) {
        throw e;
    }
}

export const getPrintSelects = async () => {
    try {
        const temp = await axiosClient.get(`prints/selects`);
        return temp.data.data;
    } catch (e) {
        return [];
    }
}

export const createPrintSelect = async (item: any) => {
    try {
        const temp = await axiosClient.post(`prints/selects`, item);
        return temp.data;
    } catch (e) {
        throw e;
    }
}

export const updatePrintSelect = async (id: number, item: any) => {
    try {
        const temp = await axiosClient.patch(`prints/selects/${id}`, item);
        return temp.data;
    } catch (e) {
        throw e;
    }
}

export const deletePrintSelect = async (id: number) => {
    try {
        const temp = await axiosClient.delete(`prints/selects/${id}`);
        return temp.data;
    } catch (e) {
        throw e;
    }
}

export const runPrintSelect = async (item: any) => {
    try {
        const temp = await axiosClient.post(`prints/run`, item);
        return temp.data;
    } catch (e) {
        throw e;
    }
}

export const getPrintHistory = async (page: number, limit: number, search: string, from_date: string, to_date: string) => {
    try {
        const temp = await axiosClient.get(`prints/logs?page=${page}&limit=${limit}&search=${search}&from_date=${from_date}&to_date=${to_date}`);
        return temp.data.data;
    } catch (e) {
        return [];
    }
}

export const getPrintStatistics = async () => {
    try {
        const temp = await axiosClient.get(`prints/statistics`);
        return temp.data.data;
    } catch (e) {
        return {};
    }
}


export const updatePrintSelectNum = async (item: any) => {
    try {
        const temp = await axiosClient.post(`prints/nums/initialize`, item);
        return temp.data;
    } catch (e) {
        throw e;
    }
}