import axiosClient from "../axiosClient";

export const contactService = {
  send: (data: any) =>
    axiosClient.post("/contact", data),
};