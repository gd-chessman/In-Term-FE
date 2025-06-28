import axiosClient from "@/utils/axiosClient";


export const login = async (item: any) => {
    try {
        const temp = await axiosClient.post(`admins/login`, item);
        return temp.data;
    } catch (e) {
        throw e;
    }
}

export const getProfile = async () => {
    try {
        const temp = await axiosClient.get(`admins/profile`);
        return temp.data.data;
    } catch (e) {
        return {};
    }
}