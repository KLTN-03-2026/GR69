import axiosClient from "../axiosClient";

export const adminProductService = {

    create: (data: FormData) =>
        axiosClient.post("/admin/products", data, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        }),

    update: (id: number, data: any) =>
        axiosClient.put(`/admin/products/${id}`, data),

    updateWithFile: (id: number, data: FormData) =>
        axiosClient.post(`/admin/products/${id}?_method=PUT`, data),

    delete: (id: number) =>
        axiosClient.delete(`/admin/products/${id}`),
};