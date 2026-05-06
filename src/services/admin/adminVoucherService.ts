import axiosClient from "../axiosClient";

export const adminVoucherService = {
    getAll: () => axiosClient.get("/admin/coupons"),

    getById: (id: number) =>
        axiosClient.get(`/admin/coupons/${id}`),

    create: (data: any) =>
        axiosClient.post("/admin/coupons", data),

    update: (id: number, data: any) =>
        axiosClient.put(`/admin/coupons/${id}`, data),

    delete: (id: number) =>
        axiosClient.delete(`/admin/coupons/${id}`),
};