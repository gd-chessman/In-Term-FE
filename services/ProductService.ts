import axiosClient from "@/utils/axiosClient";


export const getProducts = async () => {
    try {
        const temp = await axiosClient.get(`products`);
        return temp.data.data;
    } catch (e) {
        return [];
    }
}

export const createProduct = async (item: any) => {
    try {
        const temp = await axiosClient.post(`products`, item, { headers : {'Content-Type': 'multipart/form-data',}});
        return temp.data;
    } catch (e) {
        throw e;
    }
}

export const updateProduct = async ( id: any, item: any) => {
    try {
        const temp = await axiosClient.patch(`products/${id}`, item);
        return temp.data;
    } catch (e) {
        throw e;
    }
}

export const deleteProduct = async (id: number) => {
    try {
        const temp = await axiosClient.delete(`products/${id}`);
        return temp.data;
    } catch (e) {
        throw e;
    }
}

export const updateStatus = async ( id: any, item: any) => {
    try {
        const temp = await axiosClient.patch(`products/${id}/status`, item);
        return temp.data;
    } catch (e) {
        throw e;
    }
}

export const deleteProductTags = async (id: number, tagIds: number[]) => {
    try {
        const temp = await axiosClient.delete(`products/${id}/tags`, {
            data: { tagIds }
        });
        return temp.data;
    } catch (e) {
        throw e;
    }
}

export const addProductTags = async (id: number, tagIds: number[]) => {
    try {
        const temp = await axiosClient.post(`products/${id}/tags`, { tagIds });
        return temp.data;
    } catch (e) {
        throw e;
    }
}

export const getProductStatistics = async () =>{
    try {
        const temp = await axiosClient.get(`products/statistics`);
        return temp.data.data;
    } catch (e) {
        return {};
    }
}