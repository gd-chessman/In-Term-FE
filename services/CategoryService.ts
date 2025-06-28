import axiosClient from "@/utils/axiosClient";


export const getCategories = async () => {
    try {
        const temp = await axiosClient.get(`categories`);
        return temp.data;
    } catch (e) {
        return [];
    }
}

export const getCategoriesTree = async () => {
    try {
        const temp = await axiosClient.get(`categories/tree`);
        return temp.data.data;
    } catch (e) {
        return [];
    }
}


export const createCategory = async (item: any) => {
    try {
        const temp = await axiosClient.post(`categories`, item);
        return temp.data;
    } catch (e) {
        throw e;
    }
}