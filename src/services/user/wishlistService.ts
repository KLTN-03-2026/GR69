import axiosClient from "../axiosClient";


export const wishlistService = {
  getAll: () =>
    axiosClient.get("/wishlist"),

  toggle: (productId: number) =>
    axiosClient.post(`/wishlist/${productId}`),
};