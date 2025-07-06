import axiosClient from "@/utils/axiosClient";


export const getRoles = async () => {
    try {
        const temp = await axiosClient.get(`roles`);
        return temp.data.data;
    } catch (e) {
        throw e;
    }
}

export const getRoleStatistics = async () => {
    try {
        const temp = await axiosClient.get(`roles/statistics`);
        return temp.data.data;
    } catch (e) {
        throw e;
    }
}