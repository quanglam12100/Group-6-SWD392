import React from "react";
import { Outlet, Navigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

export default function StaffLayout() {
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

  // Chỉ cho phép Staff truy cập
  if (user && user.role) {
    const role = user.role.toLowerCase();
    if (role !== "staff") {
      switch (role) {
        case "customer":
          return <Navigate to="/customer" replace />;
        case "chef":
        case "kitchen":
          return <Navigate to="/kitchen" replace />;
        case "manager":
          return <Navigate to="/manager" replace />;
        case "admin":
          return <Navigate to="/admin" replace />;
        default:
          return <Navigate to="/" replace />;
      }
    }
  }
  // If no user data but has token, allow access

  const isActive = (path) => location.pathname.startsWith(path);

  return (
    <div style={{ minHeight: "100vh", background: "#1a1a1a", display: "flex" }}>
      {/* Staff Sidebar */}
      <div style={{
        width: "280px",
        background: "#2b2b2b",
        borderRight: "1px solid rgba(249, 115, 22, 0.3)",
        padding: "20px",
        overflowY: "auto"
      }}>
        <h2 style={{ color: "#f97316", marginBottom: "30px" }}>🍽️ Nhân Viên</h2>
        
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <a
            href="/staff"
            style={{
              color: location.pathname === "/staff" ? "#f97316" : "#fff",
              textDecoration: "none",
              padding: "12px 16px",
              background: location.pathname === "/staff" ? "rgba(249, 115, 22, 0.15)" : "transparent",
              borderRadius: "6px",
              border: location.pathname === "/staff" ? "1px solid #f97316" : "1px solid transparent",
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
            Công việc chính
          </div>

          <a
            href="/staff/tables"
            style={{
              color: isActive("/staff/tables") ? "#f97316" : "#fff",
              textDecoration: "none",
              padding: "12px 16px",
              background: isActive("/staff/tables") ? "rgba(249, 115, 22, 0.15)" : "transparent",
              borderRadius: "6px",
              border: isActive("/staff/tables") ? "1px solid #f97316" : "1px solid transparent"
            }}
          >
            🪑 Quản lý bàn
          </a>
          <a
            href="/staff/create-order"
            style={{
              color: isActive("/staff/create-order") ? "#f97316" : "#fff",
              textDecoration: "none",
              padding: "12px 16px",
              background: isActive("/staff/create-order") ? "rgba(249, 115, 22, 0.15)" : "transparent",
              borderRadius: "6px",
              border: isActive("/staff/create-order") ? "1px solid #f97316" : "1px solid transparent"
            }}
          >
            ➕ Tạo đơn hàng
          </a>
          <a
            href="/staff/orders"
            style={{
              color: isActive("/staff/orders") ? "#f97316" : "#fff",
              textDecoration: "none",
              padding: "12px 16px",
              background: isActive("/staff/orders") ? "rgba(249, 115, 22, 0.15)" : "transparent",
              borderRadius: "6px",
              border: isActive("/staff/orders") ? "1px solid #f97316" : "1px solid transparent"
            }}
          >
            📝 Đơn hàng
          </a>
        </div>

        <div style={{ marginTop: "40px" }}>
          <div style={{ 
            color: "#999", 
            fontSize: "14px", 
            marginBottom: "10px",
            padding: "10px",
            background: "rgba(249, 115, 22, 0.08)",
            borderRadius: "6px"
          }}>
            <div>👤 {user?.fullname || user?.username}</div>
            <div style={{ fontSize: "12px", color: "#666", marginTop: "5px" }}>Nhân viên phục vụ</div>
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
