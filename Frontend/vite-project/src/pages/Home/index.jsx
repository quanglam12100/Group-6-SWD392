import React from "react";
import { useNavigate } from "react-router-dom";
import "./index.css";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="home-page">
      <div className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">SmartRestaurant</h1>
          <p className="hero-subtitle">Hệ thống đặt món thông minh với AI</p>
          <div className="hero-actions">
            <button className="btn-primary" onClick={() => navigate("/menu")}>
              Xem thực đơn
            </button>
            <button className="btn-secondary" onClick={() => navigate("/table")}>
              Chọn bàn
            </button>
          </div>
        </div>
      </div>

      <div className="features-section">
        <h2 className="section-title">Tính năng nổi bật</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">🎤</div>
            <h3>Đặt món bằng giọng nói</h3>
            <p>Sử dụng AI để nhận diện và đặt món nhanh chóng</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🍽️</div>
            <h3>Thực đơn đa dạng</h3>
            <p>Hàng trăm món ăn với nhiều tùy chọn</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">⚡</div>
            <h3>Phục vụ nhanh chóng</h3>
            <p>Đặt món trực tiếp, không cần chờ đợi</p>
          </div>
        </div>
      </div>
    </div>
  );
}
