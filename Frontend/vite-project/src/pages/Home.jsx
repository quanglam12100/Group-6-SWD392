import React, { useEffect } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

export default function Home() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const token = useAuthStore((state) => state.token);
  const loading = useAuthStore((state) => state.loading);
  const initialize = useAuthStore((state) => state.initialize);

  useEffect(() => {
    initialize();
  }, [initialize]);

  // Show loading while checking auth
  if (loading) {
    return (
      <div style={{
        minHeight: "100vh",
        background: "#1a1a1a",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#d4af37"
      }}>
        Đang tải...
      </div>
    );
  }

  // If has token, redirect to admin (fallback if user data not available)
  if (token) {
    // Try to redirect based on user role if available
    if (user && user.role) {
      const userRole = user.role.toLowerCase();
      switch (userRole) {
        case "admin":
          return <Navigate to="/admin" replace />;
        case "manager":
          return <Navigate to="/manager" replace />;
        case "staff":
          return <Navigate to="/staff" replace />;
        case "chef":
        case "kitchen":
          return <Navigate to="/kitchen" replace />;
        case "customer":
          return <Navigate to="/customer" replace />;
        default:
          break;
      }
    }
    // Fallback: if has token but no user data, assume admin
    return <Navigate to="/admin" replace />;
  }

  // Public landing page
  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(180deg, #1a1a1a 0%, #2b2b2b 100%)",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "20px",
      color: "#fff"
    }}>
      <div style={{ textAlign: "center", maxWidth: "800px" }}>
        <h1 style={{ 
          fontSize: "3rem", 
          color: "#d4af37", 
          marginBottom: "20px",
          fontWeight: "bold"
        }}>
          ⭐ SmartRestaurant
        </h1>
        <p style={{ 
          fontSize: "1.2rem", 
          color: "rgba(255, 255, 255, 0.7)",
          marginBottom: "40px"
        }}>
          Hệ thống quản lý nhà hàng thông minh
        </p>
        <div style={{ display: "flex", gap: "20px", justifyContent: "center" }}>
          <button
            onClick={() => navigate("/login")}
            style={{
              background: "#d4af37",
              color: "#1a1a1a",
              border: "none",
              padding: "15px 40px",
              borderRadius: "8px",
              fontSize: "1rem",
              fontWeight: "600",
              cursor: "pointer"
            }}
          >
            Đăng nhập
          </button>
          <button
            onClick={() => navigate("/menu")}
            style={{
              background: "transparent",
              color: "#d4af37",
              border: "2px solid #d4af37",
              padding: "15px 40px",
              borderRadius: "8px",
              fontSize: "1rem",
              fontWeight: "600",
              cursor: "pointer"
            }}
          >
            Xem thực đơn
          </button>
        </div>
      </div>
    </div>
  );
}
