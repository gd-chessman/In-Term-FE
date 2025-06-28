import { useAuth } from "@/hooks/useAuth";
import axiosClient from "@/utils/axiosClient";


export const login = async (item: any) => {
    try {
        const temp = await axiosClient.post(`admins/login`, item);
        return temp.data;
    } catch (e) {
        throw e;
    }
}

export const logout = async () => {
    try {
        const temp = await axiosClient.post(`admins/logout`);
        useAuth.getState().logout();
        return temp.data;
    } catch (e) {
        throw e;
    }
}

export const getUserMe = async () => {
    try {
        const temp = await axiosClient.get(`admins/me`);
        useAuth.getState().login();
        return temp.data.data;
    } catch (e) {
        try {
            const refresh = await axiosClient.post(`admins/refresh`);
            window.location.reload();
            useAuth.getState().login();
        } catch (e) {
            useAuth.getState().logout();
            return {};
        }
    }
}