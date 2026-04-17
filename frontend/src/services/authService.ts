import axiosClient from "./axiosClient";

export const authService = {
  login: (data: { email: string; password: string }) =>
    axiosClient.post("/login", data),

  register: (data: any) =>
    axiosClient.post("/register", data),

  getUser: () =>
    axiosClient.get("/user"),

  logout: () =>
    axiosClient.post("/logout"),

  forgotPassword: (email: string) =>
    axiosClient.post("/forgot-password", { email }),

  resetPassword: (data: {
    token: string;
    email: string;
    password: string;
    password_confirmation: string;
  }) =>
    axiosClient.post("/reset-password", data),
};