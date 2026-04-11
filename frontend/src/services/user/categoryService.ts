import axiosClient from "../axiosClient";

export const categoryService = {
  getAll: () =>
    axiosClient.get("/categories"),

  getBySlug: (slug: string) =>
    axiosClient.get(`/categories/${slug}`),

};