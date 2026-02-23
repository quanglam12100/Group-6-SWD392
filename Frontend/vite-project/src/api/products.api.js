import axiosClient from "./axiosClient";

export const productsApi = {
  getAll: () => {
    return axiosClient.get("/products");
  },

  getById: (id) => {
    return axiosClient.get(`/products/${id}`);
  },

  create: (data) => {
    return axiosClient.post("/products", data);
  },

  update: (id, data) => {
    return axiosClient.put(`/products/${id}`, data);
  },

  delete: (id) => {
    return axiosClient.delete(`/products/${id}`);
  },

  // Keywords
  getKeywords: (productId) => {
    return axiosClient.get(`/products/${productId}/keywords`);
  },

  addKeyword: (productId, keyword) => {
    return axiosClient.post(`/products/${productId}/keywords`, { keyword });
  },
};
