import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { productService } from "../../services/productService";
import { orderService } from "../../services/orderService";
import { tableService } from "../../services/tableService";
import { toppingService } from "../../services/toppingService";
import { formatPrice } from "../../utils/formatPrice";
import "./index.css";

export default function Dashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    categories: 0,
    products: 0,
    toppings: 0,
    orders: 0,
    tables: 0,
    revenue: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const [categories, products, toppings, orders, tables] = await Promise.all([
        productService.getAllCategories().catch(() => []),
        productService.getAllProducts().catch(() => []),
        toppingService.getAllToppings().catch(() => []),
        orderService.getAllOrders().catch(() => []),
        tableService.getAllTables().catch(() => []),
      ]);

      const totalRevenue = orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);

      setStats({
        categories: categories.length,
        products: products.length,
        toppings: toppings.length,
        orders: orders.length,
        tables: tables.length,
        revenue: totalRevenue
      });
    } catch (error) {
      console.error("Error loading stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const quickActions = [
    { icon: "🍽️", title: "Danh mục", desc: "Quản lý danh mục", path: "/admin/products", color: "#4ade80" },
    { icon: "🍜", title: "Sản phẩm", desc: "Quản lý sản phẩm", path: "/admin/products", color: "#60a5fa" },
    { icon: "📋", title: "Đơn hàng", desc: "Quản lý đơn hàng", path: "/admin/orders", color: "#f59e0b" },
    { icon: "🪑", title: "Bàn ăn", desc: "Quản lý bàn", path: "/admin/tables", color: "#ec4899" },
    { icon: "🧂", title: "Topping", desc: "Quản lý topping", path: "/admin/products", color: "#8b5cf6" },
    { icon: "👥", title: "Tài khoản", desc: "Quản lý người dùng", path: "/admin/accounts", color: "#06b6d4" }
  ];

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div className="dashboard-welcome">
          <h1 className="dashboard-title">Dashboard</h1>
          <p className="dashboard-subtitle">Chào mừng trở lại! Đây là tổng quan hệ thống của bạn.</p>
        </div>
        <div className="dashboard-status">
          <span className="status-dot online"></span>
          <span className="status-text">Hệ thống hoạt động</span>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card" style={{ borderLeft: '4px solid #4ade80' }}>
          <div className="stat-card-header">
            <div className="stat-card-icon" style={{ background: 'rgba(74, 222, 128, 0.2)' }}>📊</div>
            <div className="stat-card-trend positive">↑ 12%</div>
          </div>
          <div className="stat-card-body">
            <div className="stat-card-value">{loading ? "..." : stats.products}</div>
            <div className="stat-card-label">Sản phẩm</div>
          </div>
        </div>

        <div className="stat-card" style={{ borderLeft: '4px solid #60a5fa' }}>
          <div className="stat-card-header">
            <div className="stat-card-icon" style={{ background: 'rgba(96, 165, 250, 0.2)' }}>🎯</div>
            <div className="stat-card-trend positive">↑ 8%</div>
          </div>
          <div className="stat-card-body">
            <div className="stat-card-value">{loading ? "..." : stats.categories}</div>
            <div className="stat-card-label">Danh mục</div>
          </div>
        </div>

        <div className="stat-card" style={{ borderLeft: '4px solid #f59e0b' }}>
          <div className="stat-card-header">
            <div className="stat-card-icon" style={{ background: 'rgba(245, 158, 11, 0.2)' }}>📋</div>
            <div className="stat-card-trend positive">↑ 23%</div>
          </div>
          <div className="stat-card-body">
            <div className="stat-card-value">{loading ? "..." : stats.orders}</div>
            <div className="stat-card-label">Đơn hàng</div>
          </div>
        </div>

        <div className="stat-card" style={{ borderLeft: '4px solid #d4af37' }}>
          <div className="stat-card-header">
            <div className="stat-card-icon" style={{ background: 'rgba(212, 175, 55, 0.2)' }}>💰</div>
            <div className="stat-card-trend positive">↑ 15%</div>
          </div>
          <div className="stat-card-body">
            <div className="stat-card-value">{loading ? "..." : formatPrice(stats.revenue)}</div>
            <div className="stat-card-label">Doanh thu</div>
          </div>
        </div>
      </div>

      <div className="quick-actions-section">
        <h2 className="section-title">Truy cập nhanh</h2>
        <div className="quick-actions-grid">
          {quickActions.map((action, index) => (
            <div 
              key={index}
              className="quick-action-card"
              onClick={() => navigate(action.path)}
              style={{ borderTop: `3px solid ${action.color}` }}
            >
              <div className="quick-action-icon" style={{ background: `${action.color}22` }}>
                {action.icon}
              </div>
              <div className="quick-action-content">
                <h3 className="quick-action-title">{action.title}</h3>
                <p className="quick-action-desc">{action.desc}</p>
              </div>
              <div className="quick-action-arrow">→</div>
            </div>
          ))}
        </div>
      </div>

      <div className="recent-activity-section">
        <h2 className="section-title">Hoạt động gần đây</h2>
        <div className="activity-list">
          <div className="activity-item">
            <div className="activity-icon" style={{ background: 'rgba(74, 222, 128, 0.2)', color: '#4ade80' }}>✓</div>
            <div className="activity-content">
              <div className="activity-title">Đơn hàng mới được tạo</div>
              <div className="activity-time">5 phút trước</div>
            </div>
          </div>
          <div className="activity-item">
            <div className="activity-icon" style={{ background: 'rgba(96, 165, 250, 0.2)', color: '#60a5fa' }}>+</div>
            <div className="activity-content">
              <div className="activity-title">Thêm sản phẩm mới</div>
              <div className="activity-time">15 phút trước</div>
            </div>
          </div>
          <div className="activity-item">
            <div className="activity-icon" style={{ background: 'rgba(245, 158, 11, 0.2)', color: '#f59e0b' }}>⚠</div>
            <div className="activity-content">
              <div className="activity-title">Cập nhật bàn trạng thái</div>
              <div className="activity-time">30 phút trước</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
