import axiosClient from "../axiosClient";

export const adminOrderService = {
    getAll: () => axiosClient.get("/admin/orders"),

    getById: (id: number) =>
        axiosClient.get(`/admin/orders/${id}`),

    updateStatus: (id: number, status: string) =>
        axiosClient.put(`/admin/orders/${id}/status`, { status }),
};