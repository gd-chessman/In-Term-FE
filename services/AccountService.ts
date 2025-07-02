import axiosClient from "@/utils/axiosClient";


export const getProfile = async () => {
    try {
        const temp = await axiosClient.get(`accounts/profile`);
        return temp.data;
    } catch (e) {
        throw e;
    }
}