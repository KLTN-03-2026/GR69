import axiosClient from "../axiosClient";

export const orderService = {
  getAll: () =>
    axiosClient.get("/orders"),

  getById: (id: number) =>
    axiosClient.get(`/orders/${id}`),

  create: (data: any) =>
    axiosClient.post("/orders", data),
  
  cancelOrder: (id: number) =>
    axiosClient.put(`/orders/${id}/cancel`),
};