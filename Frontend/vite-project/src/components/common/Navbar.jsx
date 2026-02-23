import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
import { useCartStore } from "../../store/cartStore";
import "./Navbar.css";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  
  const token = useAuthStore((state) => state.token);
  const isAdmin = useAuthStore((state) => state.isAdmin);
  const logout = useAuthStore((state) => state.logout);
  
  const getItemCount = useCartStore((state) => state.getItemCount);

  const isActive = (path) => location.pathname === path;
  const isAuthenticated = !!token;

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand" onClick={() => navigate("/")}>
          <span className="brand-icon">🍽️</span>
          <span className="brand-name">SmartRestaurant</span>
        </div>

        <div className="navbar-menu">
          <button
            className={`nav-item ${isActive("/") ? "active" : ""}`}
            onClick={() => navigate("/")}
          >
            Trang chủ
          </button>

          <button
            className={`nav-item ${isActive("/menu") ? "active" : ""}`}
            onClick={() => navigate("/menu")}
          >
            Thực đơn
          </button>

          {isAuthenticated && (
            <>
              <button
                className={`nav-item ${isActive("/cart") ? "active" : ""}`}
                onClick={() => navigate("/cart")}
              >
                Giỏ hàng {getItemCount() > 0 && <span className="badge">{getItemCount()}</span>}
              </button>

              <button
                className={`nav-item ${isActive("/customer/order-history") ? "active" : ""}`}
                onClick={() => navigate("/customer/order-history")}
              >
                Lịch sử đơn
              </button>
            </>
          )}

          {isAdmin() && (
            <button
              className={`nav-item ${isActive("/admin") ? "active" : ""}`}
              onClick={() => navigate("/admin")}
            >
              Quản lý
            </button>
          )}
        </div>

        <div className="navbar-actions">
          {isAuthenticated ? (
            <button className="btn-logout" onClick={handleLogout}>
              Đăng xuất
            </button>
          ) : (
            <button className="btn-login" onClick={() => navigate("/login")}>
              Đăng nhập
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
