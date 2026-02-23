import axiosClient from "./axiosClient";

export const toppingsApi = {
  getAll: () => {
    return axiosClient.get("/toppings");
  },

  getById: (id) => {
    return axiosClient.get(`/toppings/${id}`);
  },

  create: (data) => {
    return axiosClient.post("/toppings", data);
  },

  update: (id, data) => {
    return axiosClient.put(`/toppings/${id}`, data);
  },

  delete: (id) => {
    return axiosClient.delete(`/toppings/${id}`);
  },
};
