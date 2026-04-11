import axiosClient from "../axiosClient";

export const adminDashboardService = {

  getCustomers: () =>
    axiosClient.get("/admin/customers"),

  dashboard: () =>
    axiosClient.get("/admin/dashboard"),
};