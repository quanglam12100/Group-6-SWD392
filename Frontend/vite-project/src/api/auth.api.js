import axiosClient from "./axiosClient";

export const authApi = {
  login: (username, password) => {
    return axiosClient.post("/auth/login", { username, password });
  },

  register: (userData) => {
    return axiosClient.post("/auth/register", userData);
  },

  getCurrentUser: () => {
    return axiosClient.get("/auth/me");
  },

  logout: () => {
    localStorage.removeItem("token");
  },
};
