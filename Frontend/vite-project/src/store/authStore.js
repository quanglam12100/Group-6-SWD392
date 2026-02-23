import { create } from "zustand";
import { authApi } from "../api/auth.api";

export const useAuthStore = create((set, get) => ({
  user: null,
  token: localStorage.getItem("token") || null,
  loading: true,

  // Initialize auth state
  initialize: async () => {
    const token = localStorage.getItem("token");
    
    if (!token) {
      set({ loading: false });
      return;
    }

    // Try to get user data from localStorage
    const savedUser = localStorage.getItem("user");
    
    if (savedUser) {
      try {
        const user = JSON.parse(savedUser);
        set({ user, token, loading: false });
        return;
      } catch (error) {
        console.error("Failed to parse saved user:", error);
      }
    }

    // API /auth/me không tồn tại, skip việc fetch user data
    // Chỉ dùng token từ localStorage
    set({ user: null, token, loading: false });
  },

  // Login
  login: async (username, password) => {
    try {
      const response = await authApi.login(username, password);
      
      // Backend returns: { token, username, role }
      const token = response.token;
      const userData = {
        username: response.username,
        role: response.role
      };
      
      // Save to localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(userData));
      
      set({ user: userData, token, loading: false });
      
      return { success: true, user: userData };
    } catch (error) {
      return { success: false, error: error.message || "Đăng nhập thất bại" };
    }
  },

  // Register
  register: async (userData) => {
    try {
      const response = await authApi.register(userData);
      return { success: true, data: response };
    } catch (error) {
      return { success: false, error: error.message || "Đăng ký thất bại" };
    }
  },

  // Logout
  logout: () => {
    authApi.logout();
    localStorage.removeItem("user");
    set({ user: null, token: null });
  },

  // Check if admin
  isAdmin: () => {
    const { user } = get();
    if (!user || !user.role) return false;
    const adminRoles = ["Admin", "Manager", "Chef"];
    return adminRoles.includes(user.role);
  },

  // Check if customer
  isCustomer: () => {
    const { user } = get();
    return user?.role === "customer";
  },

  // Check if staff
  isStaff: () => {
    const { user } = get();
    return user?.role === "Staff";
  },

  // Check if chef
  isChef: () => {
    const { user } = get();
    return user?.role === "Chef";
  },

  // Update user data
  updateUser: (userData) => {
    set({ user: userData });
  },
}));
