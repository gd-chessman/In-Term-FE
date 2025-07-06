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
        const params = new URLSearchParams();
        
        if (page) params.append('page', page.toString());
        if (limit) params.append('limit', limit.toString());
        if (search) params.append('search', search);
        if (level && level !== 'all') params.append('level', level);
        if (status && status !== 'all') params.append('status', status);
        
        const temp = await axiosClient.get(`admins?${params.toString()}`);
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


export const getStatistics = async () => {
    try {
        const temp = await axiosClient.get(`admins/statistics`);
        return temp.data.data;
    } catch (e) {
        throw e;
    }
}


export const updateStatus = async (id: string, status: string) => {
    try {
        const temp = await axiosClient.patch(`admins/${id}/status`, { admin_status: status });
        return temp.data;
    } catch (e) {
        throw e;
    }
}   

export const updateLevel = async (id: string, level: string) => {
    try {
        const temp = await axiosClient.patch(`admins/${id}/level`, { admin_level: level });
        return temp.data;
    } catch (e) {
        throw e;
    }
}

export const getAllAdminLogs = async (page: number, limit: number) => {
    try {
        const params = new URLSearchParams();
        if (page) params.append('page', page.toString());
        if (limit) params.append('limit', limit.toString());
        const temp = await axiosClient.get(`admins/logs?${params.toString()}`);
        return temp.data;
    } catch (e) {
        throw e;
    }
}

export const getAdminLogStatistics = async () => {
    try {
        const temp = await axiosClient.get(`admins/logs/statistics`);
        return temp.data.data;
    } catch (e) {
        throw e;
    }
}