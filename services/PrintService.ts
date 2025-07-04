import axiosClient from "@/utils/axiosClient";

export const getPrintTemplates = async () => {
    try {
        const temp = await axiosClient.get(`prints/templates`);
        return temp.data.data;
    } catch (e) {
        return {};
    }
}

export const createPrintTemplate = async (item: any) => {
    try {
        const temp = await axiosClient.post(`prints/setting-templates`, item);
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

