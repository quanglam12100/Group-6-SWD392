import axiosClient from "./axiosClient";

export const accountsApi = {
  getAll: () => {
    return axiosClient.get("/accounts");
  },

  getById: (id) => {
    return axiosClient.get(`/accounts/${id}`);
  },

  create: (data) => {
    return axiosClient.post("/accounts", data);
  },

  update: (id, data) => {
    return axiosClient.put(`/accounts/${id}`, data);
  },

  updateStatus: (id, isActive) => {
    return axiosClient.put(`/accounts/${id}/status`, { isActive });
  },

  delete: (id) => {
    return axiosClient.delete(`/accounts/${id}`);
  },
};
