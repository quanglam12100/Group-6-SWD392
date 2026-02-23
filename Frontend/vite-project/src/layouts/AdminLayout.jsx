import React from "react";
import { Outlet, Navigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

export default function AdminLayout() {
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

  // Nếu có user data và role không phải Admin, redirect về trang phù hợp
  if (user && user.role) {
    const role = user.role.toLowerCase(); // Normalize to lowercase for comparison
    if (role !== "admin" && role !== "manager") {
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
  // If no user data but has token, allow access (will be loaded later)

  const isActive = (path) => location.pathname.startsWith(path);

  return (
    <div style={{ minHeight: "100vh", background: "#1a1a1a", display: "flex" }}>
      {/* Admin Sidebar */}
      <div style={{
        width: "280px",
        background: "#2b2b2b",
        borderRight: "1px solid rgba(212, 175, 55, 0.3)",
        padding: "20px",
        overflowY: "auto"
      }}>
        <h2 style={{ color: "#d4af37", marginBottom: "30px" }}>⚡ Admin</h2>
        
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <a
            href="/admin"
            style={{
              color: location.pathname === "/admin" ? "#d4af37" : "#fff",
              textDecoration: "none",
              padding: "12px 16px",
              background: location.pathname === "/admin" ? "rgba(212, 175, 55, 0.1)" : "transparent",
              borderRadius: "6px",
              border: location.pathname === "/admin" ? "1px solid #d4af37" : "1px solid transparent",
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
            href="/admin/categories"
            style={{
              color: isActive("/admin/categories") ? "#d4af37" : "#fff",
              textDecoration: "none",
              padding: "12px 16px",
              background: isActive("/admin/categories") ? "rgba(212, 175, 55, 0.1)" : "transparent",
              borderRadius: "6px",
              border: isActive("/admin/categories") ? "1px solid #d4af37" : "1px solid transparent"
            }}
          >
            🏷️ Danh mục
          </a>
          <a
            href="/admin/products"
            style={{
              color: isActive("/admin/products") ? "#d4af37" : "#fff",
              textDecoration: "none",
              padding: "12px 16px",
              background: isActive("/admin/products") ? "rgba(212, 175, 55, 0.1)" : "transparent",
              borderRadius: "6px",
              border: isActive("/admin/products") ? "1px solid #d4af37" : "1px solid transparent"
            }}
          >
            🍔 Sản phẩm
          </a>
          <a
            href="/admin/variants"
            style={{
              color: isActive("/admin/variants") ? "#d4af37" : "#fff",
              textDecoration: "none",
              padding: "12px 16px",
              background: isActive("/admin/variants") ? "rgba(212, 175, 55, 0.1)" : "transparent",
              borderRadius: "6px",
              border: isActive("/admin/variants") ? "1px solid #d4af37" : "1px solid transparent"
            }}
          >
            📐 Biến thể
          </a>
          <a
            href="/admin/toppings"
            style={{
              color: isActive("/admin/toppings") ? "#d4af37" : "#fff",
              textDecoration: "none",
              padding: "12px 16px",
              background: isActive("/admin/toppings") ? "rgba(212, 175, 55, 0.1)" : "transparent",
              borderRadius: "6px",
              border: isActive("/admin/toppings") ? "1px solid #d4af37" : "1px solid transparent"
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
            href="/admin/orders"
            style={{
              color: isActive("/admin/orders") ? "#d4af37" : "#fff",
              textDecoration: "none",
              padding: "12px 16px",
              background: isActive("/admin/orders") ? "rgba(212, 175, 55, 0.1)" : "transparent",
              borderRadius: "6px",
              border: isActive("/admin/orders") ? "1px solid #d4af37" : "1px solid transparent"
            }}
          >
            📝 Đơn hàng
          </a>
          <a
            href="/admin/tables"
            style={{
              color: isActive("/admin/tables") ? "#d4af37" : "#fff",
              textDecoration: "none",
              padding: "12px 16px",
              background: isActive("/admin/tables") ? "rgba(212, 175, 55, 0.1)" : "transparent",
              borderRadius: "6px",
              border: isActive("/admin/tables") ? "1px solid #d4af37" : "1px solid transparent"
            }}
          >
            🪑 Bàn ăn
          </a>

          <div style={{ 
            color: "#999", 
            fontSize: "12px", 
            marginTop: "20px", 
            marginBottom: "10px",
            textTransform: "uppercase",
            fontWeight: "600"
          }}>
            🔐 Quản trị hệ thống
          </div>

          <a
            href="/admin/accounts"
            style={{
              color: isActive("/admin/accounts") ? "#d4af37" : "#fff",
              textDecoration: "none",
              padding: "12px 16px",
              background: isActive("/admin/accounts") ? "rgba(212, 175, 55, 0.1)" : "transparent",
              borderRadius: "6px",
              border: isActive("/admin/accounts") ? "1px solid #d4af37" : "1px solid transparent"
            }}
          >
            👥 Quản lý tài khoản
          </a>

          <div
            style={{
              color: "#666",
              padding: "12px 16px",
              background: "rgba(212, 175, 55, 0.03)",
              borderRadius: "6px",
              border: "1px solid rgba(212, 175, 55, 0.2)",
              cursor: "not-allowed",
              opacity: 0.6,
              fontSize: "14px"
            }}
            title="Tính năng đang phát triển"
          >
            📊 Báo cáo & Thống kê
          </div>
          <div
            style={{
              color: "#666",
              padding: "12px 16px",
              background: "rgba(212, 175, 55, 0.03)",
              borderRadius: "6px",
              border: "1px solid rgba(212, 175, 55, 0.2)",
              cursor: "not-allowed",
              opacity: 0.6,
              fontSize: "14px"
            }}
            title="Tính năng đang phát triển"
          >
            🔑 Phân quyền
          </div>
          <div
            style={{
              color: "#666",
              padding: "12px 16px",
              background: "rgba(212, 175, 55, 0.03)",
              borderRadius: "6px",
              border: "1px solid rgba(212, 175, 55, 0.2)",
              cursor: "not-allowed",
              opacity: 0.6,
              fontSize: "14px"
            }}
            title="Tính năng đang phát triển"
          >
            ⚙️ Cài đặt hệ thống
          </div>
          <div
            style={{
              color: "#666",
              padding: "12px 16px",
              background: "rgba(212, 175, 55, 0.03)",
              borderRadius: "6px",
              border: "1px solid rgba(212, 175, 55, 0.2)",
              cursor: "not-allowed",
              opacity: 0.6,
              fontSize: "14px"
            }}
            title="Tính năng đang phát triển"
          >
            📜 Nhật ký hoạt động
          </div>
        </div>

        <div style={{ marginTop: "40px" }}>
          <div style={{ 
            color: "#999", 
            fontSize: "14px", 
            marginBottom: "10px",
            padding: "10px",
            background: "rgba(212, 175, 55, 0.05)",
            borderRadius: "6px"
          }}>
            <div>👤 {user?.fullname || user?.username}</div>
            <div style={{ fontSize: "12px", color: "#666", marginTop: "5px" }}>Administrator</div>
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
