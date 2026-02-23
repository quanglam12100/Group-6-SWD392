import axiosClient from "./axiosClient";

export const productVariantsApi = {
  getAll: () => {
    return axiosClient.get("/variants");
  },

  getById: (id) => {
    return axiosClient.get(`/variants/${id}`);
  },

  getByProduct: (productId) => {
    return axiosClient.get(`/variants/product/${productId}`);
  },

  create: (data) => {
    return axiosClient.post("/variants", data);
  },

  update: (id, data) => {
    return axiosClient.put(`/variants/${id}`, data);
  },

  delete: (id) => {
    return axiosClient.delete(`/variants/${id}`);
  },
};
