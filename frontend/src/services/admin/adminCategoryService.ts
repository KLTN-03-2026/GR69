import axiosClient from "../axiosClient";

export const adminCategoryService = {
  create: (data: FormData) =>
    axiosClient.post("/admin/categories", data),

  update: (id: number, data: FormData) =>
    axiosClient.post(`/admin/categories/${id}?_method=PUT`, data),

  delete: (id: number) =>
    axiosClient.delete(`/admin/categories/${id}`),
};