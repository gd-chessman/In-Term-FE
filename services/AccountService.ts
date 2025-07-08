import axiosClient from "@/utils/axiosClient";


export const getProfile = async () => {
    try {
        const temp = await axiosClient.get(`accounts/profile`);
        return temp.data;
    } catch (e) {
        throw e;
    }
}


export const updateProfile = async (data: any) => {
    try {
        const temp = await axiosClient.patch(`accounts/profile`, data);
        return temp.data;
    } catch (e) {
        throw e;
    }
}


export const updateAvatar = async (data: any) => {
    try {
        const temp = await axiosClient.patch(`accounts/avatar`, data, { headers : {'Content-Type': 'multipart/form-data',}});
        return temp.data;
    } catch (e) {
        throw e;
    }
}

export const updatePassword = async (data: any) => {
    try {
        const temp = await axiosClient.patch(`accounts/change-password`, data);
        return temp.data;
    } catch (e) {
        throw e;
    }
}


export const forgotPassword = async (data: any) => {
    try {
        const temp = await axiosClient.post(`accounts/forgot-password`, data);
        return temp.data;
    } catch (e) {
        throw e;
    }
}


export const verifyResetCode = async (data: any) => {
    try {
        const temp = await axiosClient.post(`accounts/verify-reset-code`, data);
        return temp.data;
    } catch (e) {
        throw e;
    }
}

export const resetPassword = async (data: any) => {
    try {
        const temp = await axiosClient.post(`accounts/reset-password`, data);
        return temp.data;
    } catch (e) {
        throw e;
    }
}
