import { useState, useEffect } from "react";

const KitchenDashboard = () => {
  const [stats, setStats] = useState({
    pending: 0,
    preparing: 0,
    ready: 0,
    completed: 0,
  });

  const [recentOrders, setRecentOrders] = useState([]);

  useEffect(() => {
    loadKitchenData();
  }, []);

  const loadKitchenData = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("https://localhost:7031/api/orders", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const orders = await response.json();
        
        // Calculate stats
        const pending = orders.filter(o => o.status === "Pending").length;
        const preparing = orders.filter(o => o.status === "Preparing").length;
        const ready = orders.filter(o => o.status === "Ready").length;
        const completed = orders.filter(o => o.status === "Completed").length;

        setStats({ pending, preparing, ready, completed });

        // Get recent preparing orders
        const preparingOrders = orders
          .filter(o => o.status === "Preparing" || o.status === "Pending")
          .slice(0, 5);
        setRecentOrders(preparingOrders);
      }
    } catch (error) {
      console.error("Error loading kitchen data:", error);
    }
  };

  const statCards = [
    {
      title: "Chờ làm",
      value: stats.pending,
      icon: "⏳",
      color: "#f59e0b",
      bgColor: "rgba(245, 158, 11, 0.1)",
    },
    {
      title: "Đang nấu",
      value: stats.preparing,
      icon: "🍳",
      color: "#ef4444",
      bgColor: "rgba(239, 68, 68, 0.1)",
    },
    {
      title: "Đã xong",
      value: stats.ready,
      icon: "✅",
      color: "#10b981",
      bgColor: "rgba(16, 185, 129, 0.1)",
    },
    {
      title: "Hoàn thành",
      value: stats.completed,
      icon: "📦",
      color: "#6366f1",
      bgColor: "rgba(99, 102, 241, 0.1)",
    },
  ];

  const getPriorityColor = (orderNumber) => {
    // Earlier orders have higher priority
    if (orderNumber <= 3) return "#ef4444"; // Red - high priority
    if (orderNumber <= 5) return "#f59e0b"; // Orange - medium
    return "#10b981"; // Green - normal
  };

  return (
    <div style={{ padding: "40px", background: "#1a1a1a", minHeight: "100vh" }}>
      {/* Header */}
      <div style={{ marginBottom: "40px" }}>
        <h1
          style={{
            fontSize: "36px",
            fontWeight: "700",
            color: "white",
            marginBottom: "10px",
            display: "flex",
            alignItems: "center",
            gap: "15px",
          }}
        >
          <span style={{ fontSize: "42px" }}>👨‍🍳</span>
          Bếp Dashboard
        </h1>
        <p style={{ color: "#999", fontSize: "16px", margin: 0 }}>
          Quản lý đơn hàng từ nhà bếp
        </p>
      </div>

      {/* Stats Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          gap: "25px",
          marginBottom: "40px",
        }}
      >
        {statCards.map((card, index) => (
          <div
            key={index}
            style={{
              background: card.bgColor,
              padding: "30px",
              borderRadius: "16px",
              border: `2px solid ${card.color}40`,
              transition: "all 0.3s ease",
              cursor: "pointer",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-5px)";
              e.currentTarget.style.boxShadow = `0 10px 30px ${card.color}40`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            <div
              style={{
                fontSize: "40px",
                marginBottom: "15px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <span>{card.icon}</span>
              <span
                style={{
                  fontSize: "42px",
                  fontWeight: "700",
                  color: card.color,
                }}
              >
                {card.value}
              </span>
            </div>
            <div style={{ fontSize: "18px", color: "white", fontWeight: "600" }}>
              {card.title}
            </div>
          </div>
        ))}
      </div>

      {/* Recent Orders */}
      <div
        style={{
          background: "#2a2a2a",
          padding: "30px",
          borderRadius: "16px",
          border: "2px solid #dc2626",
          marginBottom: "30px",
        }}
      >
        <h2
          style={{
            fontSize: "24px",
            fontWeight: "700",
            color: "white",
            marginBottom: "25px",
            display: "flex",
            alignItems: "center",
            gap: "12px",
          }}
        >
          <span style={{ fontSize: "28px" }}>🔥</span>
          Đơn hàng cần làm
        </h2>

        {recentOrders.length === 0 ? (
          <div style={{ textAlign: "center", padding: "40px", color: "#666" }}>
            <div style={{ fontSize: "48px", marginBottom: "15px" }}>✨</div>
            <p style={{ fontSize: "16px" }}>Không có đơn hàng nào đang chờ</p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
            {recentOrders.map((order, index) => (
              <div
                key={order.id}
                style={{
                  background: "#1a1a1a",
                  padding: "20px",
                  borderRadius: "12px",
                  border: `2px solid ${getPriorityColor(index + 1)}`,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
                  <div
                    style={{
                      width: "50px",
                      height: "50px",
                      borderRadius: "50%",
                      background: getPriorityColor(index + 1),
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "24px",
                      fontWeight: "700",
                      color: "white",
                    }}
                  >
                    #{index + 1}
                  </div>
                  <div>
                    <div style={{ color: "white", fontSize: "16px", fontWeight: "600" }}>
                      Đơn hàng #{order.id}
                    </div>
                    <div style={{ color: "#999", fontSize: "14px", marginTop: "5px" }}>
                      Bàn: {order.tableId} • {order.customerName || "Khách"}
                    </div>
                  </div>
                </div>
                <div>
                  <span
                    style={{
                      padding: "8px 16px",
                      borderRadius: "8px",
                      fontSize: "14px",
                      fontWeight: "600",
                      background:
                        order.status === "Pending"
                          ? "rgba(245, 158, 11, 0.2)"
                          : "rgba(239, 68, 68, 0.2)",
                      color: order.status === "Pending" ? "#f59e0b" : "#ef4444",
                      border: `2px solid ${
                        order.status === "Pending" ? "#f59e0b" : "#ef4444"
                      }`,
                    }}
                  >
                    {order.status === "Pending" ? "Chờ làm" : "Đang nấu"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick Tips */}
      <div
        style={{
          background: "linear-gradient(135deg, #dc2626 0%, #991b1b 100%)",
          padding: "25px",
          borderRadius: "16px",
          border: "2px solid rgba(255,255,255,0.2)",
        }}
      >
        <h3
          style={{
            fontSize: "20px",
            fontWeight: "700",
            color: "white",
            marginBottom: "15px",
            display: "flex",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <span style={{ fontSize: "24px" }}>💡</span>
          Lưu ý quan trọng
        </h3>
        <ul style={{ color: "rgba(255,255,255,0.9)", fontSize: "15px", lineHeight: "2" }}>
          <li>🔴 Ưu tiên làm đơn hàng có số thứ tự thấp trước</li>
          <li>⏱️ Cập nhật trạng thái đơn hàng ngay khi bắt đầu và hoàn thành</li>
          <li>✅ Kiểm tra kỹ món ăn trước khi đánh dấu "Đã xong"</li>
          <li>📝 Thông báo cho nhân viên phục vụ khi có món ready</li>
        </ul>
      </div>
    </div>
  );
};

export default KitchenDashboard;
