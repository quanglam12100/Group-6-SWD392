import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../Home.css";

export default function StaffDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    tablesAvailable: 0,
    tablesOccupied: 0,
    todayOrders: 0,
    pendingOrders: 0,
    completedOrders: 0,
    todayRevenue: 0
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
      // Simulate loading stats (API not ready yet)
      // In real app, fetch from API
      setStats({
        tablesAvailable: 8,
        tablesOccupied: 4,
        todayOrders: 15,
        pendingOrders: 3,
        completedOrders: 12,
        todayRevenue: 2500000
      });
    } catch (error) {
      console.error("Error loading stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const quickActions = [
    { icon: "🪑", title: "Quản lý bàn", desc: "Xem và quản lý bàn ăn", path: "/staff/tables", color: "#f97316" },
    { icon: "➕", title: "Tạo đơn hàng", desc: "Tạo đơn mới cho khách", path: "/staff/create-order", color: "#10b981" },
    { icon: "📝", title: "Đơn hàng", desc: "Xem danh sách đơn hàng", path: "/staff/orders", color: "#3b82f6" },
    { icon: "🍽️", title: "Thực đơn", desc: "Xem thực đơn nhà hàng", path: "/menu", color: "#8b5cf6" }
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
          <h1 className="dashboard-title" style={{ color: "#f97316", fontSize: "32px", margin: 0 }}>
            🍽️ Staff Dashboard
          </h1>
          <p className="dashboard-subtitle" style={{ color: "rgba(255, 255, 255, 0.6)", margin: "8px 0 0 0" }}>
            Xin chào! Hãy phục vụ khách hàng tốt nhất hôm nay.
          </p>
        </div>
        <div className="dashboard-status" style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          padding: "10px 20px",
          background: "rgba(249, 115, 22, 0.15)",
          borderRadius: "50px",
          border: "1px solid rgba(249, 115, 22, 0.3)"
        }}>
          <span className="status-dot online" style={{
            width: "10px",
            height: "10px",
            borderRadius: "50%",
            background: "#10b981",
            boxShadow: "0 0 10px rgba(16, 185, 129, 0.5)"
          }}></span>
          <span className="status-text" style={{ color: "#10b981", fontWeight: "600" }}>
            Sẵn sàng phục vụ
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
          borderLeft: '4px solid #10b981',
          background: "rgba(255, 255, 255, 0.03)",
          padding: "20px",
          borderRadius: "12px"
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "15px" }}>
            <div style={{ 
              background: 'rgba(16, 185, 129, 0.2)', 
              padding: "10px", 
              borderRadius: "8px",
              fontSize: "24px"
            }}>
              ✅
            </div>
            <div style={{ color: "#10b981" }}>Trống</div>
          </div>
          <div>
            <div style={{ fontSize: "32px", fontWeight: "bold", color: "#fff", marginBottom: "8px" }}>
              {loading ? "..." : stats.tablesAvailable}
            </div>
            <div style={{ color: "rgba(255, 255, 255, 0.6)" }}>Bàn trống</div>
          </div>
        </div>

        <div style={{ 
          borderLeft: '4px solid #ef4444',
          background: "rgba(255, 255, 255, 0.03)",
          padding: "20px",
          borderRadius: "12px"
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "15px" }}>
            <div style={{ 
              background: 'rgba(239, 68, 68, 0.2)', 
              padding: "10px", 
              borderRadius: "8px",
              fontSize: "24px"
            }}>
              🪑
            </div>
            <div style={{ color: "#ef4444" }}>Đang dùng</div>
          </div>
          <div>
            <div style={{ fontSize: "32px", fontWeight: "bold", color: "#fff", marginBottom: "8px" }}>
              {loading ? "..." : stats.tablesOccupied}
            </div>
            <div style={{ color: "rgba(255, 255, 255, 0.6)" }}>Bàn có khách</div>
          </div>
        </div>

        <div style={{ 
          borderLeft: '4px solid #3b82f6',
          background: "rgba(255, 255, 255, 0.03)",
          padding: "20px",
          borderRadius: "12px"
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "15px" }}>
            <div style={{ 
              background: 'rgba(59, 130, 246, 0.2)', 
              padding: "10px", 
              borderRadius: "8px",
              fontSize: "24px"
            }}>
              📝
            </div>
            <div style={{ color: "#3b82f6" }}>Hôm nay</div>
          </div>
          <div>
            <div style={{ fontSize: "32px", fontWeight: "bold", color: "#fff", marginBottom: "8px" }}>
              {loading ? "..." : stats.todayOrders}
            </div>
            <div style={{ color: "rgba(255, 255, 255, 0.6)" }}>Đơn hàng</div>
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
              ⏳
            </div>
            <div style={{ color: "#f59e0b" }}>Đang xử lý</div>
          </div>
          <div>
            <div style={{ fontSize: "32px", fontWeight: "bold", color: "#fff", marginBottom: "8px" }}>
              {loading ? "..." : stats.pendingOrders}
            </div>
            <div style={{ color: "rgba(255, 255, 255, 0.6)" }}>Chờ xử lý</div>
          </div>
        </div>

        <div style={{ 
          borderLeft: '4px solid #10b981',
          background: "rgba(255, 255, 255, 0.03)",
          padding: "20px",
          borderRadius: "12px"
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "15px" }}>
            <div style={{ 
              background: 'rgba(16, 185, 129, 0.2)', 
              padding: "10px", 
              borderRadius: "8px",
              fontSize: "24px"
            }}>
              ✓
            </div>
            <div style={{ color: "#10b981" }}>Hoàn thành</div>
          </div>
          <div>
            <div style={{ fontSize: "32px", fontWeight: "bold", color: "#fff", marginBottom: "8px" }}>
              {loading ? "..." : stats.completedOrders}
            </div>
            <div style={{ color: "rgba(255, 255, 255, 0.6)" }}>Đã hoàn tất</div>
          </div>
        </div>

        <div style={{ 
          borderLeft: '4px solid #f97316',
          background: "rgba(255, 255, 255, 0.03)",
          padding: "20px",
          borderRadius: "12px"
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "15px" }}>
            <div style={{ 
              background: 'rgba(249, 115, 22, 0.2)', 
              padding: "10px", 
              borderRadius: "8px",
              fontSize: "24px"
            }}>
              💰
            </div>
            <div style={{ color: "#f97316" }}>Hôm nay</div>
          </div>
          <div>
            <div style={{ fontSize: "32px", fontWeight: "bold", color: "#fff", marginBottom: "8px" }}>
              {loading ? "..." : `${(stats.todayRevenue / 1000).toFixed(0)}k`}
            </div>
            <div style={{ color: "rgba(255, 255, 255, 0.6)" }}>Doanh thu</div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div style={{ marginBottom: "30px" }}>
        <h2 style={{ color: "#fff", fontSize: "24px", marginBottom: "20px" }}>Công việc hôm nay</h2>
        <div style={{ 
          display: "grid", 
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", 
          gap: "20px" 
        }}>
          {quickActions.map((action, index) => (
            <div 
              key={index}
              onClick={() => navigate(action.path)}
              style={{ 
                borderTop: `3px solid ${action.color}`,
                background: "rgba(255, 255, 255, 0.03)",
                padding: "20px",
                borderRadius: "12px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "15px",
                transition: "all 0.3s ease"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-5px)";
                e.currentTarget.style.background = "rgba(255, 255, 255, 0.06)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.background = "rgba(255, 255, 255, 0.03)";
              }}
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
                <h3 style={{ color: "#fff", margin: 0, marginBottom: "5px" }}>{action.title}</h3>
                <p style={{ color: "rgba(255, 255, 255, 0.6)", margin: 0, fontSize: "14px" }}>{action.desc}</p>
              </div>
              <div style={{ color: action.color, fontSize: "24px" }}>→</div>
            </div>
          ))}
        </div>
      </div>

      {/* Tips & Notes */}
      <div style={{ marginBottom: "30px" }}>
        <h2 style={{ color: "#fff", fontSize: "24px", marginBottom: "20px" }}>Lưu ý trong ca</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
          <div style={{ 
            display: "flex", 
            alignItems: "center", 
            gap: "15px",
            background: "rgba(249, 115, 22, 0.1)",
            padding: "20px",
            borderRadius: "12px",
            border: "1px solid rgba(249, 115, 22, 0.3)"
          }}>
            <div style={{ 
              background: 'rgba(249, 115, 22, 0.2)', 
              color: '#f97316',
              padding: "15px",
              borderRadius: "8px",
              fontSize: "24px"
            }}>
              💡
            </div>
            <div>
              <div style={{ color: "#fff", fontWeight: "600", marginBottom: "5px" }}>
                Luôn chào đón khách hàng thân thiện
              </div>
              <div style={{ color: "rgba(255, 255, 255, 0.6)", fontSize: "14px" }}>
                Nụ cười và thái độ tốt tạo ấn tượng đầu tiên
              </div>
            </div>
          </div>
          <div style={{ 
            display: "flex", 
            alignItems: "center", 
            gap: "15px",
            background: "rgba(59, 130, 246, 0.1)",
            padding: "20px",
            borderRadius: "12px",
            border: "1px solid rgba(59, 130, 246, 0.3)"
          }}>
            <div style={{ 
              background: 'rgba(59, 130, 246, 0.2)', 
              color: '#3b82f6',
              padding: "15px",
              borderRadius: "8px",
              fontSize: "24px"
            }}>
              ✓
            </div>
            <div>
              <div style={{ color: "#fff", fontWeight: "600", marginBottom: "5px" }}>
                Kiểm tra đơn hàng trước khi gửi bếp
              </div>
              <div style={{ color: "rgba(255, 255, 255, 0.6)", fontSize: "14px" }}>
                Đảm bảo chính xác món ăn và số lượng
              </div>
            </div>
          </div>
          <div style={{ 
            display: "flex", 
            alignItems: "center", 
            gap: "15px",
            background: "rgba(16, 185, 129, 0.1)",
            padding: "20px",
            borderRadius: "12px",
            border: "1px solid rgba(16, 185, 129, 0.3)"
          }}>
            <div style={{ 
              background: 'rgba(16, 185, 129, 0.2)', 
              color: '#10b981',
              padding: "15px",
              borderRadius: "8px",
              fontSize: "24px"
            }}>
              🧹
            </div>
            <div>
              <div style={{ color: "#fff", fontWeight: "600", marginBottom: "5px" }}>
                Dọn dẹp bàn kịp thời
              </div>
              <div style={{ color: "rgba(255, 255, 255, 0.6)", fontSize: "14px" }}>
                Bàn sạch sẽ giúp luân chuyển khách nhanh hơn
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
