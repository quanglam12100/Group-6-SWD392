import React from "react";
import { Outlet, Navigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

export default function ManagerLayout() {
  const token = useAuthStore((state) => state.token);
  const user = useAuthStore((state) => state.user);
  const loading = useAuthStore((state) => state.loading);
  const logout = useAuthStore((state) => state.logout);
  const location = useLocation();

  if (loading) {
    return (
      <div style={{ 
        display: "flex", 
        justifyContent: "center", 
        alignItems: "center", 
        minHeight: "100vh",
        background: "#1a1a1a",
        color: "#fff"
      }}>
        <div>Đang tải...</div>
      </div>
    );
  }

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Chỉ cho phép Manager và Admin truy cập
  if (user && user.role) {
    const role = user.role.toLowerCase();
    if (role !== "manager" && role !== "admin") {
      switch (role) {
        case "customer":
          return <Navigate to="/customer" replace />;
        case "staff":
          return <Navigate to="/staff" replace />;
        case "chef":
        case "kitchen":
          return <Navigate to="/kitchen" replace />;
        default:
          return <Navigate to="/" replace />;
      }
    }
  }
  // If no user data but has token, allow access

  const isActive = (path) => location.pathname.startsWith(path);

  return (
    <div style={{ minHeight: "100vh", background: "#1a1a1a", display: "flex" }}>
      {/* Manager Sidebar */}
      <div style={{
        width: "280px",
        background: "#2b2b2b",
        borderRight: "1px solid rgba(59, 130, 246, 0.3)",
        padding: "20px",
        overflowY: "auto"
      }}>
        <h2 style={{ color: "#3b82f6", marginBottom: "30px" }}>👨‍💼 Manager</h2>
        
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <a
            href="/manager"
            style={{
              color: location.pathname === "/manager" ? "#3b82f6" : "#fff",
              textDecoration: "none",
              padding: "12px 16px",
              background: location.pathname === "/manager" ? "rgba(59, 130, 246, 0.15)" : "transparent",
              borderRadius: "6px",
              border: location.pathname === "/manager" ? "1px solid #3b82f6" : "1px solid transparent",
              fontWeight: "600"
            }}
          >
            📊 Dashboard
          </a>

          <div style={{ 
            color: "#999", 
            fontSize: "12px", 
            marginTop: "20px", 
            marginBottom: "10px",
            textTransform: "uppercase",
            fontWeight: "600"
          }}>
            Quản lý sản phẩm
          </div>
          
          <a
            href="/manager/categories"
            style={{
              color: isActive("/manager/categories") ? "#3b82f6" : "#fff",
              textDecoration: "none",
              padding: "12px 16px",
              background: isActive("/manager/categories") ? "rgba(59, 130, 246, 0.15)" : "transparent",
              borderRadius: "6px",
              border: isActive("/manager/categories") ? "1px solid #3b82f6" : "1px solid transparent"
            }}
          >
            🏷️ Danh mục
          </a>
          <a
            href="/manager/products"
            style={{
              color: isActive("/manager/products") ? "#3b82f6" : "#fff",
              textDecoration: "none",
              padding: "12px 16px",
              background: isActive("/manager/products") ? "rgba(59, 130, 246, 0.15)" : "transparent",
              borderRadius: "6px",
              border: isActive("/manager/products") ? "1px solid #3b82f6" : "1px solid transparent"
            }}
          >
            🍔 Sản phẩm
          </a>
          <a
            href="/manager/variants"
            style={{
              color: isActive("/manager/variants") ? "#3b82f6" : "#fff",
              textDecoration: "none",
              padding: "12px 16px",
              background: isActive("/manager/variants") ? "rgba(59, 130, 246, 0.15)" : "transparent",
              borderRadius: "6px",
              border: isActive("/manager/variants") ? "1px solid #3b82f6" : "1px solid transparent"
            }}
          >
            📐 Biến thể
          </a>
          <a
            href="/manager/toppings"
            style={{
              color: isActive("/manager/toppings") ? "#3b82f6" : "#fff",
              textDecoration: "none",
              padding: "12px 16px",
              background: isActive("/manager/toppings") ? "rgba(59, 130, 246, 0.15)" : "transparent",
              borderRadius: "6px",
              border: isActive("/manager/toppings") ? "1px solid #3b82f6" : "1px solid transparent"
            }}
          >
            🧀 Topping
          </a>

          <div style={{ 
            color: "#999", 
            fontSize: "12px", 
            marginTop: "20px", 
            marginBottom: "10px",
            textTransform: "uppercase",
            fontWeight: "600"
          }}>
            Vận hành
          </div>

          <a
            href="/manager/orders"
            style={{
              color: isActive("/manager/orders") ? "#3b82f6" : "#fff",
              textDecoration: "none",
              padding: "12px 16px",
              background: isActive("/manager/orders") ? "rgba(59, 130, 246, 0.15)" : "transparent",
              borderRadius: "6px",
              border: isActive("/manager/orders") ? "1px solid #3b82f6" : "1px solid transparent"
            }}
          >
            📝 Đơn hàng
          </a>
          <a
            href="/manager/tables"
            style={{
              color: isActive("/manager/tables") ? "#3b82f6" : "#fff",
              textDecoration: "none",
              padding: "12px 16px",
              background: isActive("/manager/tables") ? "rgba(59, 130, 246, 0.15)" : "transparent",
              borderRadius: "6px",
              border: isActive("/manager/tables") ? "1px solid #3b82f6" : "1px solid transparent"
            }}
          >
            🪑 Bàn ăn
          </a>
        </div>

        <div style={{ marginTop: "40px" }}>
          <div style={{ 
            color: "#999", 
            fontSize: "14px", 
            marginBottom: "10px",
            padding: "10px",
            background: "rgba(59, 130, 246, 0.08)",
            borderRadius: "6px"
          }}>
            <div>👤 {user?.fullname || user?.username}</div>
            <div style={{ fontSize: "12px", color: "#666", marginTop: "5px" }}>Manager</div>
          </div>
          <button
            onClick={() => {
              logout();
              window.location.href = "/login";
            }}
            style={{
              width: "100%",
              background: "#ef4444",
              color: "#fff",
              border: "none",
              padding: "10px",
              borderRadius: "6px",
              cursor: "pointer",
              fontWeight: "600"
            }}
          >
            Đăng xuất
          </button>
        </div>
      </div>

      <main style={{ flex: 1, padding: "20px", overflowY: "auto" }}>
        <Outlet />
      </main>
    </div>
  );
}
