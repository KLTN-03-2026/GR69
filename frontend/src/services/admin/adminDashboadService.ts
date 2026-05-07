import axiosClient from "../axiosClient";

export const adminDashboardService = {

  getCustomers: () =>
    axiosClient.get("/admin/customers"),

  dashboard(params?: any) {
    return axiosClient.get("/admin/dashboard", { params });
  }
};