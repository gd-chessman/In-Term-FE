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

export const createPrintSelect = async (item: any) => {
    try {
        const temp = await axiosClient.post(`prints/selects`, item);
        return temp.data;
    } catch (e) {
        throw e;
    }
}