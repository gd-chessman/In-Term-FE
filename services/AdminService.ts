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
        const temp = await axiosClient.get(`admins/profile`);
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

export const getAdmins = async (page: number, limit: number, search: string, level: string, status: string) => {
    try {
        const temp = await axiosClient.get(`admins?page=${page}&limit=${limit}&search=${search}`);
        return temp.data;
    } catch (e) {
        throw e;
    }
}

export const getRoles = async () => {
    try {
        const temp = await axiosClient.get(`roles`);
        return temp.data;
    } catch (e) {
        throw e;
    }
}


export const createAdmin = async (item: any) => {
    try {
        const temp = await axiosClient.post(`admins/create`, item);
        return temp.data;
    } catch (e) {
        throw e;
    }
}