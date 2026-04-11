import axiosClient from "../axiosClient";

export const reviewService = {
  getByProduct: (id: number) =>
    axiosClient.get(`/products/${id}/reviews`),

  create: (data: any) =>
    axiosClient.post("/reviews", data),
};