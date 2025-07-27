import axiosClient from "@/utils/axiosClient";


export const getProducts = async (params: { page?: number; limit?: number; search?: string; product_name?: string; product_code?: string; product_description?: string; category_id?: number; product_status?: string; min_price?: number; max_price?: number; tag_id?: number; tag_ids?: number[]; branch_ids?: number[]; sort_by?: string; sort_order?: 'asc' | 'desc';
} = {}) => {
    try {
        const { page = 1, limit = 10, search, product_name, product_code, category_id, product_description, product_status, min_price, max_price, tag_id, tag_ids, branch_ids, sort_by, sort_order } = params;
        const queryParams = new URLSearchParams();
     
        // Pagination
        queryParams.append('page', page.toString());
        queryParams.append('limit', limit.toString());
        
        // Search and filters
        if (search) queryParams.append('search', search);
        if (product_name) queryParams.append('product_name', product_name);
        if (product_code) queryParams.append('product_code', product_code);
        if (product_description) queryParams.append('product_description', product_description);
        if (category_id) queryParams.append('category_id', category_id.toString());
        if (product_status) queryParams.append('product_status', product_status);
        if (min_price) queryParams.append('min_price', min_price.toString());
        if (max_price) queryParams.append('max_price', max_price.toString());
        if (tag_id) queryParams.append('tag_id', tag_id.toString());
        if (tag_ids && tag_ids.length > 0) queryParams.append('tag_ids', tag_ids.join(','));
        if (branch_ids && branch_ids.length > 0) queryParams.append('branch_ids', branch_ids.join(','));
        if (sort_by) queryParams.append('sort_by', sort_by);
        if (sort_order) queryParams.append('sort_order', sort_order);

        const temp = await axiosClient.get(`products?${queryParams.toString()}`);
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
        const temp = await axiosClient.patch(`products/${id}`, item, { headers : {'Content-Type': 'multipart/form-data',}});
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
