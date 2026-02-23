import { api } from "./api";

export const authService = {
  login: async (username, password) => {
    // Returns: { token, user: { id, username, fullname, role, isActive } }
    return api.post("/auth/login", { username, password });
  },

  register: async (userData) => {
    // userData: { username, password, fullname, role }
    // role: Staff | Manager | Chef | Admin
    return api.post("/auth/register", userData);
  },

  getCurrentUser: async () => {
    return api.get("/auth/me");
  },

  getAllAccounts: async () => {
    return api.get("/accounts");
  },

  updateAccount: async (id, accountData) => {
    return api.put(`/accounts/${id}`, accountData);
  },

  updateAccountStatus: async (id, isActive) => {
    return api.put(`/accounts/${id}/status`, { isActive });
  },

  logout: () => {
    localStorage.removeItem("token");
  },
};
