import { api } from "./api";

export const orderService = {
  // Orders
  getAllOrders: async () => {
    return api.get("/orders");
  },

  getOrderById: async (id) => {
    return api.get(`/orders/${id}`);
  },

  getOrdersByTable: async (tableId) => {
    return api.get(`/orders?tableId=${tableId}`);
  },

  createOrder: async (orderData) => {
    // orderData: { orderCode, tableId, customerId, staffId, totalAmount, paymentMethod, paymentStatus }
    return api.post("/orders", orderData);
  },

  updateOrder: async (id, orderData) => {
    return api.put(`/orders/${id}`, orderData);
  },

  deleteOrder: async (id) => {
    return api.delete(`/orders/${id}`);
  },

  updateOrderPaymentStatus: async (id, paymentStatus) => {
    return api.put(`/orders/${id}/payment-status`, { paymentStatus });
  },

  closeOrder: async (id) => {
    return api.put(`/orders/${id}/close`);
  },

  // Order Details
  getOrderDetails: async (orderId) => {
    return api.get(`/orders/${orderId}/details`);
  },

  addOrderDetail: async (orderId, detailData) => {
    // detailData: { productVariantId, quantity, voiceNote, originalVoiceText, confidenceScore, toppingIds }
    return api.post(`/orders/${orderId}/details`, detailData);
  },

  updateOrderDetail: async (orderId, detailId, detailData) => {
    return api.put(`/orders/${orderId}/details/${detailId}`, detailData);
  },

  updateOrderDetailStatus: async (orderId, detailId, status) => {
    return api.put(`/orders/${orderId}/details/${detailId}/status`, { status });
  },

  deleteOrderDetail: async (orderId, detailId) => {
    return api.delete(`/orders/${orderId}/details/${detailId}`);
  },

  // Order Detail Toppings
  getOrderDetailToppings: async (orderId, detailId) => {
    return api.get(`/orders/${orderId}/details/${detailId}/toppings`);
  },
};
