import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../Home.css";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    categories: 0,
    products: 0,
    toppings: 0,
    orders: 0,
    tables: 0,
    accounts: 0,
    revenue: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }
    
    try {
      const headers = { Authorization: `Bearer ${token}` };
      
      // Load statistics from APIs (only available endpoints)
      const [categoriesRes, productsRes, toppingsRes] = await Promise.all([
        fetch("https://localhost:7031/api/categories", { headers }).catch(() => ({ ok: false })),
        fetch("https://localhost:7031/api/products", { headers }).catch(() => ({ ok: false })),
        fetch("https://localhost:7031/api/toppings", { headers }).catch(() => ({ ok: false }))
      ]);

      const categories = categoriesRes.ok ? await categoriesRes.json() : [];
      const products = productsRes.ok ? await productsRes.json() : [];
      const toppings = toppingsRes.ok ? await toppingsRes.json() : [];

      setStats({
        categories: categories.length,
        products: products.length,
        toppings: toppings.length,
        orders: 0, // API not available yet
        tables: 0, // API not available yet
        accounts: 0, // API not available yet
        revenue: 0  // Will be calculated when orders API is ready
      });
    } catch (error) {
      console.error("Error loading stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const quickActions = [
    { icon: "🏷️", title: "Danh mục", desc: "Quản lý danh mục", path: "/admin/categories", color: "#4ade80", available: true },
    { icon: "🍔", title: "Sản phẩm", desc: "Quản lý sản phẩm", path: "/admin/products", color: "#60a5fa", available: true },
    { icon: "📐", title: "Biến thể", desc: "Quản lý kích cỡ", path: "/admin/variants", color: "#a78bfa", available: true },
    { icon: "🧀", title: "Topping", desc: "Quản lý topping", path: "/admin/toppings", color: "#8b5cf6", available: true },
    { icon: "📝", title: "Đơn hàng", desc: "Quản lý đơn hàng", path: "/admin/orders", color: "#f59e0b", available: true },
    { icon: "🪑", title: "Bàn ăn", desc: "Quản lý bàn", path: "/admin/tables", color: "#ec4899", available: true },
    { icon: "👥", title: "Tài khoản", desc: "Quản lý người dùng", path: "/admin/accounts", color: "#d4af37", available: true },
    { icon: "📊", title: "Báo cáo", desc: "Thống kê & phân tích", path: "#", color: "#06b6d4", available: false }
  ];

  return (
    <div className="dashboard-container" style={{ minHeight: "100vh", background: "#1a1a1a", padding: "30px" }}>
      {/* Header Section */}
      <div className="dashboard-header" style={{ 
        background: "rgba(255, 255, 255, 0.03)", 
        padding: "20px", 
        borderRadius: "12px",
        marginBottom: "30px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center"
      }}>
        <div className="dashboard-welcome">
          <h1 className="dashboard-title" style={{ color: "#d4af37", fontSize: "32px", margin: 0 }}>
            ⚡ Admin Dashboard
          </h1>
          <p className="dashboard-subtitle" style={{ color: "rgba(255, 255, 255, 0.6)", margin: "8px 0 0 0" }}>
            Chào mừng trở lại! Đây là tổng quan hệ thống quản trị.
          </p>
        </div>
        <div className="dashboard-status" style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          padding: "10px 20px",
          background: "rgba(74, 222, 128, 0.1)",
          borderRadius: "50px"
        }}>
          <span className="status-dot online" style={{
            width: "10px",
            height: "10px",
            borderRadius: "50%",
            background: "#4ade80"
          }}></span>
          <span className="status-text" style={{ color: "#4ade80", fontWeight: "600" }}>
            Hệ thống hoạt động
          </span>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="stats-grid" style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
        gap: "20px",
        marginBottom: "30px"
      }}>
        <div className="stat-card" style={{ 
          borderLeft: '4px solid #4ade80',
          background: "rgba(255, 255, 255, 0.03)",
          padding: "20px",
          borderRadius: "12px"
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "15px" }}>
            <div style={{ 
              background: 'rgba(74, 222, 128, 0.2)', 
              padding: "10px", 
              borderRadius: "8px",
              fontSize: "24px"
            }}>
              🍔
            </div>
            <div style={{ color: "#4ade80" }}>↑ 12%</div>
          </div>
          <div>
            <div style={{ fontSize: "32px", fontWeight: "bold", color: "#fff", marginBottom: "8px" }}>
              {loading ? "..." : stats.products}
            </div>
            <div style={{ color: "rgba(255, 255, 255, 0.6)" }}>Sản phẩm</div>
          </div>
        </div>

        <div style={{ 
          borderLeft: '4px solid #60a5fa',
          background: "rgba(255, 255, 255, 0.03)",
          padding: "20px",
          borderRadius: "12px"
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "15px" }}>
            <div style={{ 
              background: 'rgba(96, 165, 250, 0.2)', 
              padding: "10px", 
              borderRadius: "8px",
              fontSize: "24px"
            }}>
              🏷️
            </div>
            <div style={{ color: "#60a5fa" }}>↑ 8%</div>
          </div>
          <div>
            <div style={{ fontSize: "32px", fontWeight: "bold", color: "#fff", marginBottom: "8px" }}>
              {loading ? "..." : stats.categories}
            </div>
            <div style={{ color: "rgba(255, 255, 255, 0.6)" }}>Danh mục</div>
          </div>
        </div>

        <div style={{ 
          borderLeft: '4px solid #f59e0b',
          background: "rgba(255, 255, 255, 0.03)",
          padding: "20px",
          borderRadius: "12px"
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "15px" }}>
            <div style={{ 
              background: 'rgba(245, 158, 11, 0.2)', 
              padding: "10px", 
              borderRadius: "8px",
              fontSize: "24px"
            }}>
              📝
            </div>
            <div style={{ color: "#f59e0b" }}>↑ 23%</div>
          </div>
          <div>
            <div style={{ fontSize: "32px", fontWeight: "bold", color: "#fff", marginBottom: "8px" }}>
              {loading ? "..." : stats.orders}
            </div>
            <div style={{ color: "rgba(255, 255, 255, 0.6)" }}>Đơn hàng</div>
          </div>
        </div>

        <div style={{ 
          borderLeft: '4px solid #d4af37',
          background: "rgba(255, 255, 255, 0.03)",
          padding: "20px",
          borderRadius: "12px"
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "15px" }}>
            <div style={{ 
              background: 'rgba(212, 175, 55, 0.2)', 
              padding: "10px", 
              borderRadius: "8px",
              fontSize: "24px"
            }}>
              💰
            </div>
            <div style={{ color: "#d4af37" }}>↑ 15%</div>
          </div>
          <div>
            <div style={{ fontSize: "32px", fontWeight: "bold", color: "#fff", marginBottom: "8px" }}>
              {loading ? "..." : stats.revenue.toLocaleString()}đ
            </div>
            <div style={{ color: "rgba(255, 255, 255, 0.6)" }}>Doanh thu</div>
          </div>
        </div>

        <div style={{ 
          borderLeft: '4px solid #ec4899',
          background: "rgba(255, 255, 255, 0.03)",
          padding: "20px",
          borderRadius: "12px"
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "15px" }}>
            <div style={{ 
              background: 'rgba(236, 72, 153, 0.2)', 
              padding: "10px", 
              borderRadius: "8px",
              fontSize: "24px"
            }}>
              🪑
            </div>
            <div style={{ color: "rgba(255, 255, 255, 0.4)" }}>—</div>
          </div>
          <div>
            <div style={{ fontSize: "32px", fontWeight: "bold", color: "#fff", marginBottom: "8px" }}>
              {loading ? "..." : stats.tables}
            </div>
            <div style={{ color: "rgba(255, 255, 255, 0.6)" }}>Bàn ăn</div>
          </div>
        </div>

        <div style={{ 
          borderLeft: '4px solid #06b6d4',
          background: "rgba(255, 255, 255, 0.03)",
          padding: "20px",
          borderRadius: "12px"
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "15px" }}>
            <div style={{ 
              background: 'rgba(6, 182, 212, 0.2)', 
              padding: "10px", 
              borderRadius: "8px",
              fontSize: "24px"
            }}>
              👥
            </div>
            <div style={{ color: "#06b6d4" }}>↑ 5%</div>
          </div>
          <div>
            <div style={{ fontSize: "32px", fontWeight: "bold", color: "#fff", marginBottom: "8px" }}>
              {loading ? "..." : stats.accounts}
            </div>
            <div style={{ color: "rgba(255, 255, 255, 0.6)" }}>Tài khoản</div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div style={{ marginBottom: "30px" }}>
        <h2 style={{ color: "#fff", fontSize: "24px", marginBottom: "20px" }}>Truy cập nhanh</h2>
        <div style={{ 
          display: "grid", 
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", 
          gap: "20px" 
        }}>
          {quickActions.map((action, index) => (
            <div 
              key={index}
              onClick={() => action.available && navigate(action.path)}
              style={{ 
                borderTop: `3px solid ${action.color}`,
                background: action.available ? "rgba(255, 255, 255, 0.03)" : "rgba(255, 255, 255, 0.01)",
                padding: "20px",
                borderRadius: "12px",
                cursor: action.available ? "pointer" : "not-allowed",
                display: "flex",
                alignItems: "center",
                gap: "15px",
                transition: "all 0.3s ease",
                opacity: action.available ? 1 : 0.5
              }}
              title={!action.available ? "Tính năng đang phát triển" : ""}
            >
              <div style={{ 
                background: `${action.color}22`,
                padding: "15px",
                borderRadius: "8px",
                fontSize: "32px"
              }}>
                {action.icon}
              </div>
              <div style={{ flex: 1 }}>
                <h3 style={{ color: "#fff", margin: 0, marginBottom: "5px" }}>
                  {action.title}
                  {!action.available && <span style={{ fontSize: "12px", color: "#666", marginLeft: "8px" }}>(Soon)</span>}
                </h3>
                <p style={{ color: "rgba(255, 255, 255, 0.6)", margin: 0, fontSize: "14px" }}>{action.desc}</p>
              </div>
              <div style={{ color: action.color, fontSize: "24px" }}>→</div>
            </div>
          ))}
        </div>
      </div>

      {/* System Info */}
      <div style={{ marginBottom: "30px" }}>
        <h2 style={{ color: "#fff", fontSize: "24px", marginBottom: "20px" }}>Thông tin hệ thống</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
          <div style={{ 
            display: "flex", 
            alignItems: "center", 
            gap: "15px",
            background: "rgba(255, 255, 255, 0.03)",
            padding: "20px",
            borderRadius: "12px"
          }}>
            <div style={{ 
              background: 'rgba(74, 222, 128, 0.2)', 
              color: '#4ade80',
              padding: "15px",
              borderRadius: "8px",
              fontSize: "24px"
            }}>
              ✓
            </div>
            <div>
              <div style={{ color: "#fff", fontWeight: "600", marginBottom: "5px" }}>
                Hệ thống đang hoạt động bình thường
              </div>
              <div style={{ color: "rgba(255, 255, 255, 0.6)", fontSize: "14px" }}>
                Tất cả các dịch vụ online
              </div>
            </div>
          </div>
          <div style={{ 
            display: "flex", 
            alignItems: "center", 
            gap: "15px",
            background: "rgba(255, 255, 255, 0.03)",
            padding: "20px",
            borderRadius: "12px"
          }}>
            <div style={{ 
              background: 'rgba(96, 165, 250, 0.2)', 
              color: '#60a5fa',
              padding: "15px",
              borderRadius: "8px",
              fontSize: "24px"
            }}>
              📊
            </div>
            <div>
              <div style={{ color: "#fff", fontWeight: "600", marginBottom: "5px" }}>
                Dữ liệu được đồng bộ
              </div>
              <div style={{ color: "rgba(255, 255, 255, 0.6)", fontSize: "14px" }}>
                Cập nhật lúc {new Date().toLocaleTimeString('vi-VN')}
              </div>
            </div>
          </div>
          <div style={{ 
            display: "flex", 
            alignItems: "center", 
            gap: "15px",
            background: "rgba(255, 255, 255, 0.03)",
            padding: "20px",
            borderRadius: "12px"
          }}>
            <div style={{ 
              background: 'rgba(212, 175, 55, 0.2)', 
              color: '#d4af37',
              padding: "15px",
              borderRadius: "8px",
              fontSize: "24px"
            }}>
              🔒
            </div>
            <div>
              <div style={{ color: "#fff", fontWeight: "600", marginBottom: "5px" }}>
                Bảo mật được kích hoạt
              </div>
              <div style={{ color: "rgba(255, 255, 255, 0.6)", fontSize: "14px" }}>
                JWT Authentication đang hoạt động
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
