import axiosClient from "../axiosClient";

export const postService = {
  getAll: () =>
    axiosClient.get("/posts"),

  getById: (id: number) =>
    axiosClient.get(`/posts/${id}`),
};