import axiosClient from "../axiosClient";


export const couponService = {
  apply: (code: string) =>
    axiosClient.post("/coupons/apply", { code }),
};