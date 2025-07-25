import axiosClient from "@/utils/axiosClient";

export const getBranches = async (params?: {
  query?: string;
  status?: 'active' | 'inactive';
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}) => {
    try {
        const queryParams = new URLSearchParams();
        
        if (params?.query) {
            queryParams.append('search', params.query);
        }
        if (params?.status) {
            queryParams.append('status', params.status);
        }
        if (params?.page) {
            queryParams.append('page', params.page.toString());
        }
        if (params?.limit) {
            queryParams.append('limit', params.limit.toString());
        }
        if (params?.sortBy) {
            queryParams.append('sortBy', params.sortBy);
        }
        if (params?.sortOrder) {
            queryParams.append('sortOrder', params.sortOrder);
        }

        const url = `branches${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
        const temp = await axiosClient.get(url);
        return temp.data.data;
    } catch (e) {
        return [];
    }
}

// Hàm lấy danh sách chi nhánh đang hoạt động
export const getActiveBranches = async () => {
    try {
        const temp = await axiosClient.get(`branches/active`);
        return temp.data.data;
    } catch (e) {
        return [];
    }
}

export const createBranch = async (item: any) => {
    try {
        const temp = await axiosClient.post(`branches`, item);
        return temp.data.data;
    } catch (e) {
        throw e;
    }
}

export const updateBranchStatus = async (id: number, status: 'active' | 'inactive') => {
    try {
        const temp = await axiosClient.patch(`branches/${id}/status`, { status });
        return temp.data.data;
    } catch (e) {
        throw e;
    }
}

export const updateBranch = async (id: number, item: any) => {
    try {
        const temp = await axiosClient.patch(`branches/${id}`, item);
        return temp.data.data;
    } catch (e) {
        throw e;
    }
}

export const deleteBranch = async (id: number) => {
    try {
        const temp = await axiosClient.delete(`branches/${id}`);
        return temp.data.data;
    } catch (e) {
        throw e;
    }
}
