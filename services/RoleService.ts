import axiosClient from "@/utils/axiosClient";


export const getRoles = async () => {
    try {
        const temp = await axiosClient.get(`roles`);
        return temp.data;
    } catch (e) {
        throw e;
    }
}