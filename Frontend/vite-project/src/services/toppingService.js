import { api } from "./api";

export const toppingService = {
  getAllToppings: async () => {
    return api.get("/toppings");
  },

  getToppingById: async (id) => {
    return api.get(`/toppings/${id}`);
  },

  getAvailableToppings: async () => {
    const toppings = await api.get("/toppings");
    return toppings.filter(t => t.isAvailable);
  },

  createTopping: async (toppingData) => {
    return api.post("/toppings", toppingData);
  },

  updateTopping: async (id, toppingData) => {
    return api.put(`/toppings/${id}`, toppingData);
  },

  deleteTopping: async (id) => {
    return api.delete(`/toppings/${id}`);
  },
};
