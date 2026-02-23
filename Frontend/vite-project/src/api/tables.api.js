import axiosClient from "./axiosClient";

export const tablesApi = {
  getAll: () => {
    return axiosClient.get("/tables");
  },

  getById: (id) => {
    return axiosClient.get(`/tables/${id}`);
  },

  create: (data) => {
    return axiosClient.post("/tables", data);
  },

  update: (id, data) => {
    return axiosClient.put(`/tables/${id}`, data);
  },

  updateStatus: (id, status) => {
    return axiosClient.put(`/tables/${id}/status`, { status });
  },

  delete: (id) => {
    return axiosClient.delete(`/tables/${id}`);
  },
};
