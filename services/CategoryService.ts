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

export const updateCategory = async (id: number, item: any) => {
    try {
        const temp = await axiosClient.patch(`categories/${id}`, item);
        return temp.data;
    } catch (e) {
        throw e;
    }
}

export const deleteCategory = async (id: number) => {
    try {
        const temp = await axiosClient.delete(`categories/${id}`);
        return temp.data;
    } catch (e) {
        throw e;
    }
}