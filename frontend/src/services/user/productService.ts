import axiosClient from "../axiosClient";


export const productService = {
  getAll: () => axiosClient.get("/products"),

  getHome: () => {
    return axiosClient.get("/home");
  },

  getById: (id: number) =>
    axiosClient.get(`/products/${id}`),

  bestSeller: () =>
    axiosClient.get("/products/best-sellers"),

  newProducts: () =>
    axiosClient.get("/products/new"),
};