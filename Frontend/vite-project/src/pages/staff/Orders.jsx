import React, { useState, useEffect } from "react";

export default function StaffOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("https://localhost:7031/api/orders", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        const data = await response.json();
        setOrders(data);
      }
    } catch (error) {
      console.error("Error loading orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const response = await fetch(`https://localhost:7031/api/orders/${orderId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        loadOrders(); // Reload orders
      }
    } catch (error) {
      console.error("Error updating order:", error);
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
      case "chờ xử lý":
        return "#f59e0b";
      case "preparing":
      case "đang chuẩn bị":
        return "#3b82f6";
      case "ready":
      case "sẵn sàng":
        return "#10b981";
      case "served":
      case "đã phục vụ":
        return "#8b5cf6";
      case "completed":
      case "hoàn thành":
        return "#10b981";
      case "cancelled":
      case "đã hủy":
        return "#ef4444";
      default:
        return "#6b7280";
    }
  };

  const getStatusText = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return "Chờ xử lý";
      case "preparing":
        return "Đang chuẩn bị";
      case "ready":
        return "Sẵn sàng";
      case "served":
        return "Đã phục vụ";
      case "completed":
        return "Hoàn thành";
      case "cancelled":
        return "Đã hủy";
      default:
        return status || "Không rõ";
    }
  };

  const filteredOrders =
    filter === "all"
      ? orders
      : orders.filter((o) => o.status?.toLowerCase() === filter.toLowerCase());

  if (loading) {
    return (
      <div style={{ padding: "40px", color: "#fff", textAlign: "center" }}>
        <div style={{ fontSize: "18px" }}>Đang tải...</div>
      </div>
    );
  }

  return (
    <div style={{ padding: "30px", minHeight: "100vh" }}>
      {/* Header */}
      <div style={{ marginBottom: "30px" }}>
        <h1 style={{ color: "#f97316", fontSize: "32px", margin: 0, marginBottom: "10px" }}>
          📝 Quản lý đơn hàng
        </h1>
        <p style={{ color: "rgba(255, 255, 255, 0.6)", margin: 0 }}>
          Theo dõi và xử lý đơn hàng của khách hàng
        </p>
      </div>

      {/* Statistics */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
          gap: "15px",
          marginBottom: "30px",
        }}
      >
        <div
          style={{
            background: "rgba(245, 158, 11, 0.1)",
            padding: "15px",
            borderRadius: "12px",
            border: "1px solid rgba(245, 158, 11, 0.3)",
          }}
        >
          <div style={{ color: "#f59e0b", fontSize: "24px", fontWeight: "bold" }}>
            {orders.filter((o) => o.status?.toLowerCase() === "pending").length}
          </div>
          <div style={{ color: "rgba(255, 255, 255, 0.7)", marginTop: "5px", fontSize: "14px" }}>
            Chờ xử lý
          </div>
        </div>
        <div
          style={{
            background: "rgba(59, 130, 246, 0.1)",
            padding: "15px",
            borderRadius: "12px",
            border: "1px solid rgba(59, 130, 246, 0.3)",
          }}
        >
          <div style={{ color: "#3b82f6", fontSize: "24px", fontWeight: "bold" }}>
            {orders.filter((o) => o.status?.toLowerCase() === "preparing").length}
          </div>
          <div style={{ color: "rgba(255, 255, 255, 0.7)", marginTop: "5px", fontSize: "14px" }}>
            Đang chuẩn bị
          </div>
        </div>
        <div
          style={{
            background: "rgba(16, 185, 129, 0.1)",
            padding: "15px",
            borderRadius: "12px",
            border: "1px solid rgba(16, 185, 129, 0.3)",
          }}
        >
          <div style={{ color: "#10b981", fontSize: "24px", fontWeight: "bold" }}>
            {orders.filter((o) => o.status?.toLowerCase() === "ready").length}
          </div>
          <div style={{ color: "rgba(255, 255, 255, 0.7)", marginTop: "5px", fontSize: "14px" }}>
            Sẵn sàng
          </div>
        </div>
        <div
          style={{
            background: "rgba(139, 92, 246, 0.1)",
            padding: "15px",
            borderRadius: "12px",
            border: "1px solid rgba(139, 92, 246, 0.3)",
          }}
        >
          <div style={{ color: "#8b5cf6", fontSize: "24px", fontWeight: "bold" }}>
            {orders.filter((o) => o.status?.toLowerCase() === "served").length}
          </div>
          <div style={{ color: "rgba(255, 255, 255, 0.7)", marginTop: "5px", fontSize: "14px" }}>
            Đã phục vụ
          </div>
        </div>
        <div
          style={{
            background: "rgba(249, 115, 22, 0.1)",
            padding: "15px",
            borderRadius: "12px",
            border: "1px solid rgba(249, 115, 22, 0.3)",
          }}
        >
          <div style={{ color: "#f97316", fontSize: "24px", fontWeight: "bold" }}>{orders.length}</div>
          <div style={{ color: "rgba(255, 255, 255, 0.7)", marginTop: "5px", fontSize: "14px" }}>
            Tổng đơn
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div style={{ marginBottom: "20px", display: "flex", gap: "10px", flexWrap: "wrap" }}>
        <button
          onClick={() => setFilter("all")}
          style={{
            padding: "10px 20px",
            background: filter === "all" ? "#f97316" : "rgba(255, 255, 255, 0.1)",
            color: "#fff",
            border: "1px solid rgba(249, 115, 22, 0.3)",
            borderRadius: "8px",
            cursor: "pointer",
            fontWeight: "600",
          }}
        >
          Tất cả ({orders.length})
        </button>
        <button
          onClick={() => setFilter("pending")}
          style={{
            padding: "10px 20px",
            background: filter === "pending" ? "#f97316" : "rgba(255, 255, 255, 0.1)",
            color: "#fff",
            border: "1px solid rgba(249, 115, 22, 0.3)",
            borderRadius: "8px",
            cursor: "pointer",
            fontWeight: "600",
          }}
        >
          Chờ xử lý
        </button>
        <button
          onClick={() => setFilter("preparing")}
          style={{
            padding: "10px 20px",
            background: filter === "preparing" ? "#f97316" : "rgba(255, 255, 255, 0.1)",
            color: "#fff",
            border: "1px solid rgba(249, 115, 22, 0.3)",
            borderRadius: "8px",
            cursor: "pointer",
            fontWeight: "600",
          }}
        >
          Đang chuẩn bị
        </button>
        <button
          onClick={() => setFilter("ready")}
          style={{
            padding: "10px 20px",
            background: filter === "ready" ? "#f97316" : "rgba(255, 255, 255, 0.1)",
            color: "#fff",
            border: "1px solid rgba(249, 115, 22, 0.3)",
            borderRadius: "8px",
            cursor: "pointer",
            fontWeight: "600",
          }}
        >
          Sẵn sàng
        </button>
      </div>

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <div
          style={{
            background: "rgba(255, 255, 255, 0.03)",
            padding: "40px",
            borderRadius: "12px",
            textAlign: "center",
            color: "rgba(255, 255, 255, 0.6)",
          }}
        >
          <div style={{ fontSize: "48px", marginBottom: "10px" }}>📝</div>
          <div style={{ fontSize: "18px" }}>Chưa có đơn hàng nào</div>
          <div style={{ fontSize: "14px", marginTop: "8px" }}>
            {filter === "all" ? "Tạo đơn hàng mới cho khách hàng" : `Không có đơn ${getStatusText(filter)}`}
          </div>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
          {filteredOrders.map((order) => (
            <div
              key={order.id}
              style={{
                background: "rgba(255, 255, 255, 0.03)",
                padding: "20px",
                borderRadius: "12px",
                border: `1px solid ${getStatusColor(order.status)}`,
              }}
            >
              {/* Order Header */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "15px",
                  flexWrap: "wrap",
                  gap: "10px",
                }}
              >
                <div>
                  <div style={{ color: "#fff", fontSize: "18px", fontWeight: "bold" }}>
                    Đơn #{order.id} - Bàn {order.tableNumber || order.tableId}
                  </div>
                  <div style={{ color: "rgba(255, 255, 255, 0.6)", fontSize: "14px", marginTop: "5px" }}>
                    {order.customerName || "Khách tại chỗ"} •{" "}
                    {new Date(order.createdAt || Date.now()).toLocaleString("vi-VN")}
                  </div>
                </div>
                <div
                  style={{
                    background: `${getStatusColor(order.status)}22`,
                    padding: "8px 16px",
                    borderRadius: "20px",
                    fontSize: "14px",
                    color: getStatusColor(order.status),
                    fontWeight: "600",
                  }}
                >
                  {getStatusText(order.status)}
                </div>
              </div>

              {/* Order Items */}
              {order.items && order.items.length > 0 && (
                <div
                  style={{
                    background: "rgba(255, 255, 255, 0.02)",
                    padding: "15px",
                    borderRadius: "8px",
                    marginBottom: "15px",
                  }}
                >
                  {order.items.map((item, idx) => (
                    <div
                      key={idx}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        padding: "8px 0",
                        borderBottom:
                          idx < order.items.length - 1 ? "1px solid rgba(255, 255, 255, 0.05)" : "none",
                      }}
                    >
                      <div style={{ color: "rgba(255, 255, 255, 0.8)" }}>
                        {item.productName || `Món ${item.productId}`} x{item.quantity}
                      </div>
                      <div style={{ color: "#f97316" }}>{(item.price * item.quantity).toLocaleString()}đ</div>
                    </div>
                  ))}
                </div>
              )}

              {/* Order Footer */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: "15px",
                }}
              >
                <div>
                  <div style={{ color: "rgba(255, 255, 255, 0.6)", fontSize: "14px" }}>Tổng tiền</div>
                  <div style={{ color: "#f97316", fontSize: "24px", fontWeight: "bold" }}>
                    {order.totalAmount?.toLocaleString() || 0}đ
                  </div>
                </div>

                {/* Action Buttons */}
                <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                  {order.status?.toLowerCase() === "pending" && (
                    <button
                      onClick={() => updateOrderStatus(order.id, "Preparing")}
                      style={{
                        padding: "10px 20px",
                        background: "#3b82f6",
                        color: "#fff",
                        border: "none",
                        borderRadius: "8px",
                        cursor: "pointer",
                        fontWeight: "600",
                      }}
                    >
                      Chuyển bếp
                    </button>
                  )}
                  {order.status?.toLowerCase() === "ready" && (
                    <button
                      onClick={() => updateOrderStatus(order.id, "Served")}
                      style={{
                        padding: "10px 20px",
                        background: "#8b5cf6",
                        color: "#fff",
                        border: "none",
                        borderRadius: "8px",
                        cursor: "pointer",
                        fontWeight: "600",
                      }}
                    >
                      Đã phục vụ
                    </button>
                  )}
                  {order.status?.toLowerCase() === "served" && (
                    <button
                      onClick={() => updateOrderStatus(order.id, "Completed")}
                      style={{
                        padding: "10px 20px",
                        background: "#10b981",
                        color: "#fff",
                        border: "none",
                        borderRadius: "8px",
                        cursor: "pointer",
                        fontWeight: "600",
                      }}
                    >
                      Hoàn thành
                    </button>
                  )}
                  {(order.status?.toLowerCase() === "pending" || order.status?.toLowerCase() === "preparing") && (
                    <button
                      onClick={() => {
                        if (confirm("Bạn có chắc muốn hủy đơn hàng này?")) {
                          updateOrderStatus(order.id, "Cancelled");
                        }
                      }}
                      style={{
                        padding: "10px 20px",
                        background: "#ef4444",
                        color: "#fff",
                        border: "none",
                        borderRadius: "8px",
                        cursor: "pointer",
                        fontWeight: "600",
                      }}
                    >
                      Hủy đơn
                    </button>
                  )}
                </div>
              </div>

              {/* Note */}
              {order.note && (
                <div
                  style={{
                    marginTop: "15px",
                    padding: "10px",
                    background: "rgba(249, 115, 22, 0.1)",
                    borderRadius: "6px",
                    borderLeft: "3px solid #f97316",
                  }}
                >
                  <div style={{ color: "rgba(255, 255, 255, 0.6)", fontSize: "12px", marginBottom: "5px" }}>
                    Ghi chú:
                  </div>
                  <div style={{ color: "#fff" }}>{order.note}</div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
