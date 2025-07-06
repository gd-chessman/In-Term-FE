import axiosClient from "@/utils/axiosClient";


export const getTags = async () => {
    try {
        const temp = await axiosClient.get(`tags`);
        return temp.data.data;
    } catch (e) {
        return [];
    }
}

export const createTag = async (item: any) => {
    try {
        const temp = await axiosClient.post(`tags`, item);
        return temp.data;
    } catch (e) {
        throw e;
    }
}

export const updateTag = async (id: number, item: any) => {
    try {
        const temp = await axiosClient.patch(`tags/${id}`, item);
        return temp.data;
    } catch (e) {
        throw e;
    }
}

export const deleteTag = async (id: number) => {
    try {
        const temp = await axiosClient.delete(`tags/${id}`);
        return temp.data;
    } catch (e) {
        throw e;
    }
}

export const getTagStatistics = async () => {
    try {
        const temp = await axiosClient.get(`tags/statistics`);
        return temp.data.data;
    } catch (e) {
        throw e;
    }
}