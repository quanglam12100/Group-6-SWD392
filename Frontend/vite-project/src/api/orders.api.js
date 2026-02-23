import axiosClient from "./axiosClient";

export const ordersApi = {
  getAll: () => {
    return axiosClient.get("/orders");
  },

  getById: (id) => {
    return axiosClient.get(`/orders/${id}`);
  },

  getByTable: (tableId) => {
    return axiosClient.get(`/orders?tableId=${tableId}`);
  },

  create: (data) => {
    return axiosClient.post("/orders", data);
  },

  update: (id, data) => {
    return axiosClient.put(`/orders/${id}`, data);
  },

  delete: (id) => {
    return axiosClient.delete(`/orders/${id}`);
  },

  updatePaymentStatus: (id, paymentStatus) => {
    return axiosClient.put(`/orders/${id}/payment-status`, { paymentStatus });
  },

  close: (id) => {
    return axiosClient.put(`/orders/${id}/close`);
  },

  // Order Details
  getDetails: (orderId) => {
    return axiosClient.get(`/orders/${orderId}/details`);
  },

  addDetail: (orderId, data) => {
    return axiosClient.post(`/orders/${orderId}/details`, data);
  },

  updateDetail: (orderId, detailId, data) => {
    return axiosClient.put(`/orders/${orderId}/details/${detailId}`, data);
  },

  updateDetailStatus: (orderId, detailId, status) => {
    return axiosClient.put(`/orders/${orderId}/details/${detailId}/status`, { status });
  },

  deleteDetail: (orderId, detailId) => {
    return axiosClient.delete(`/orders/${orderId}/details/${detailId}`);
  },
};
