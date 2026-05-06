import axiosClient from "../axiosClient";


export const couponService = {
  getAll: () => axiosClient.get("/coupons"),
  
  apply: (code: string, subtotal: number) =>
    axiosClient.post("/coupons/apply", { code, subtotal }),
};