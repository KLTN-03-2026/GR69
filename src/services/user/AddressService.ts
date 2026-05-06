import axiosClient from "../axiosClient";

export const addressService = {

    getAll() {
        return axiosClient.get("/addresses");
    },

    getById(id: number) {
        return axiosClient.get(`/addresses/${id}`);
    },
    create(data: {
        name: string;
        phone: string;
        address: string;
        is_default?: boolean;
    }) {
        return axiosClient.post("/addresses", data);
    },

    update(id: number, data: {
        name?: string;
        phone?: string;
        address?: string;
    }) {
        return axiosClient.put(`/addresses/${id}`, data);
    },

    delete(id: number) {
        return axiosClient.delete(`/addresses/${id}`);
    },

    setDefault(id: number) {
        return axiosClient.put(`/addresses/${id}/default`);
    }
};