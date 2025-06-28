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

export const updateProduct = async (item: any) => {
    try {
        const temp = await axiosClient.put(`products/${item.product_id}`, item);
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