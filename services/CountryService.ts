import axiosClient from "@/utils/axiosClient";

export const getCountries = async () => {
    try {
        const temp = await axiosClient.get(`countries`);
        return temp.data.data;
    } catch (e) {
        return [];
    }
}

export const createCountry = async (item: any) => {
    try {
        const temp = await axiosClient.post(`countries`, item);
        return temp.data;
    } catch (e) {
        throw e;
    }
}

export const updateCountry = async (id: number, item: any) => {
    try {
        const temp = await axiosClient.patch(`countries/${id}`, item);
        return temp.data;
    } catch (e) {
        throw e;
    }
}

export const deleteCountry = async (id: number) => {
    try {
        const temp = await axiosClient.delete(`countries/${id}`);
        return temp.data;
    } catch (e) {
        throw e;
    }
}