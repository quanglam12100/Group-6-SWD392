import React, { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Skip API call - backend không có /auth/me endpoint
    // Chỉ check token exists
    if (token) {
      // Token exists, get user from localStorage if available
      const savedUser = localStorage.getItem("user");
      if (savedUser) {
        try {
          setUser(JSON.parse(savedUser));
        } catch (error) {
          console.error("Failed to parse saved user:", error);
        }
      }
    }
    setLoading(false);
  }, [token]);

  // Không dùng loadUserInfo nữa vì API /auth/me không tồn tại
  // const loadUserInfo = async () => { ... }

  const login = async (username, password) => {
    try {
      const response = await fetch("https://localhost:7031/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        const data = await response.json();
        const userToken = data.token || data;
        const userData = {
          username: data.username,
          role: data.role
        };
        
        setToken(userToken);
        setUser(userData);
        localStorage.setItem("token", userToken);
        localStorage.setItem("user", JSON.stringify(userData));
        
        return { success: true };
      } else {
        let errorMessage = "Đăng nhập thất bại";
        try {
          const error = await response.json();
          errorMessage = error.message || error.title || errorMessage;
        } catch {
          const errorText = await response.text();
          if (errorText) errorMessage = errorText;
        }
        return { success: false, message: errorMessage };
      }
    } catch (error) {
      console.error("Login error:", error);
      return { success: false, message: "Lỗi kết nối server. Vui lòng kiểm tra backend đang chạy." };
    }
  };

  const register = async (userData) => {
    try {
      const response = await fetch("https://localhost:7031/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });

      if (response.ok) {
        const data = await response.json();
        return { success: true, data };
      } else {
        let errorMessage = "Đăng ký thất bại";
        try {
          const error = await response.json();
          errorMessage = error.message || error.title || errorMessage;
        } catch {
          const errorText = await response.text();
          if (errorText) errorMessage = errorText;
        }
        return { success: false, message: errorMessage };
      }
    } catch (error) {
      console.error("Register error:", error);
      return { success: false, message: "Lỗi kết nối server. Vui lòng kiểm tra backend đang chạy." };
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
    navigate("/login");
  };

  const isAdmin = () => {
    if (!user || !user.role) return false;
    const adminRoles = ["Admin", "Manager", "Chef"];
    return adminRoles.includes(user.role);
  };

  const isCustomer = () => {
    return user?.role === "customer" || !user?.role;
  };

  const value = {
    user,
    token,
    loading,
    login,
    register,
    logout,
    isAdmin,
    isCustomer,
    isAuthenticated: !!token,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
