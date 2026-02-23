import { useState, useEffect } from "react";
import { ordersApi } from "../../api/orders.api";
import { useAuthStore } from "../../store/authStore";
import { formatPrice } from "../../utils/formatPrice";
import "../PageStyles.css";

export default function OrderHistory() {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orderDetails, setOrderDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const data = await ordersApi.getAll();
      // Filter orders by current user if customer
      const userOrders = user?.role === "customer" 
        ? data.filter((o) => o.staff_id === user.account_id)
        : data;
      setOrders(userOrders);
      setLoading(false);
    } catch (error) {
      console.error("Lỗi khi tải lịch sử đơn hàng:", error);
      setLoading(false);
    }
  };

  const viewOrderDetails = async (order) => {
    setSelectedOrder(order);
    try {
      const details = await ordersApi.getDetails(order.order_id);
      setOrderDetails(details);
      setShowModal(true);
    } catch (error) {
      console.error("Lỗi khi tải chi tiết đơn:", error);
      alert("Không thể tải chi tiết đơn hàng");
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Pending":
        return "#fbbf24";
      case "Preparing":
        return "#60a5fa";
      case "Completed":
        return "#4ade80";
      case "Cancelled":
        return "#ef4444";
      default:
        return "#999";
    }
  };

  const getPaymentStatusColor = (status) => {
    switch (status) {
      case "Pending":
        return "#fbbf24";
      case "Paid":
        return "#4ade80";
      case "Cancelled":
        return "#ef4444";
      default:
        return "#999";
    }
  };

  if (loading) {
    return (
      <div className="page-container">
        <div style={{ textAlign: "center", color: "#d4af37", padding: "50px" }}>
          Đang tải...
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <h1 className="page-title">Lịch Sử Đơn Hàng</h1>

      {orders.length === 0 ? (
        <div className="card" style={{ textAlign: "center" }}>
          <p style={{ color: "#ccc" }}>Chưa có đơn hàng nào.</p>
        </div>
      ) : (
        <div style={{ display: "grid", gap: 15 }}>
          {orders.map((order) => (
            <div key={order.order_id} className="card">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start" }}>
                <div style={{ flex: 1 }}>
                  <h3 style={{ color: "#d4af37", marginBottom: 10 }}>
                    Đơn hàng #{order.order_id}
                  </h3>
                  <p style={{ color: "#ccc", marginBottom: 5 }}>
                    Bàn: {order.table_name || `Bàn ${order.table_id}`}
                  </p>
                  <p style={{ color: "#ccc", marginBottom: 5 }}>
                    Thời gian: {new Date(order.created_at).toLocaleString("vi-VN")}
                  </p>
                  <p style={{ color: "#4ade80", fontWeight: "bold", marginTop: 10 }}>
                    Tổng tiền: {formatPrice(order.total_price)}
                  </p>
                </div>

                <div style={{ textAlign: "right" }}>
                  <div
                    style={{
                      display: "inline-block",
                      padding: "5px 15px",
                      borderRadius: 20,
                      background: getPaymentStatusColor(order.payment_status),
                      color: "#000",
                      fontWeight: "bold",
                      fontSize: 12,
                      marginBottom: 10,
                    }}
                  >
                    {order.payment_status === "Pending" && "Chưa thanh toán"}
                    {order.payment_status === "Paid" && "Đã thanh toán"}
                    {order.payment_status === "Cancelled" && "Đã hủy"}
                  </div>
                  
                  {order.payment_method && (
                    <p style={{ color: "#ccc", fontSize: 12, marginBottom: 10 }}>
                      {order.payment_method === "Cash" && "Tiền mặt"}
                      {order.payment_method === "Card" && "Thẻ"}
                      {order.payment_method === "Transfer" && "Chuyển khoản"}
                    </p>
                  )}

                  <button
                    className="btn btn-secondary"
                    style={{ padding: "8px 16px" }}
                    onClick={() => viewOrderDetails(order)}
                  >
                    Xem chi tiết
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Order Details Modal */}
      {showModal && selectedOrder && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0, 0, 0, 0.8)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
            padding: 20,
          }}
          onClick={() => setShowModal(false)}
        >
          <div
            className="card"
            style={{ maxWidth: 700, width: "100%", maxHeight: "90vh", overflow: "auto" }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 style={{ color: "#d4af37", marginBottom: 20 }}>
              Chi tiết đơn hàng #{selectedOrder.order_id}
            </h2>

            <div style={{ marginBottom: 20 }}>
              <p style={{ color: "#ccc", marginBottom: 5 }}>
                <strong>Bàn:</strong> {selectedOrder.table_name || `Bàn ${selectedOrder.table_id}`}
              </p>
              <p style={{ color: "#ccc", marginBottom: 5 }}>
                <strong>Thời gian:</strong> {new Date(selectedOrder.created_at).toLocaleString("vi-VN")}
              </p>
              <p style={{ color: "#ccc", marginBottom: 5 }}>
                <strong>Trạng thái thanh toán:</strong>{" "}
                <span style={{ color: getPaymentStatusColor(selectedOrder.payment_status) }}>
                  {selectedOrder.payment_status === "Pending" && "Chưa thanh toán"}
                  {selectedOrder.payment_status === "Paid" && "Đã thanh toán"}
                  {selectedOrder.payment_status === "Cancelled" && "Đã hủy"}
                </span>
              </p>
              {selectedOrder.payment_method && (
                <p style={{ color: "#ccc", marginBottom: 5 }}>
                  <strong>Phương thức:</strong> {selectedOrder.payment_method}
                </p>
              )}
            </div>

            <h3 style={{ color: "#d4af37", marginBottom: 15 }}>Món đã đặt:</h3>
            
            {orderDetails.length === 0 ? (
              <p style={{ color: "#ccc" }}>Không có chi tiết món.</p>
            ) : (
              <>
                {orderDetails.map((detail) => (
                  <div key={detail.order_detail_id} className="card" style={{ marginBottom: 15, background: "#2b2b2b" }}>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <div>
                        <h4 style={{ color: "#d4af37", marginBottom: 5 }}>
                          {detail.product_name}
                          {detail.variant_name && ` (${detail.variant_name})`}
                        </h4>
                        {detail.topping_names && detail.topping_names.length > 0 && (
                          <p style={{ fontSize: 12, color: "#999", marginBottom: 5 }}>
                            Topping: {detail.topping_names.join(", ")}
                          </p>
                        )}
                        {detail.notes && (
                          <p style={{ fontSize: 12, color: "#999", marginBottom: 5 }}>
                            Ghi chú: {detail.notes}
                          </p>
                        )}
                        <p style={{ color: "#4ade80" }}>
                          {formatPrice(detail.unit_price)} x {detail.quantity}
                        </p>
                      </div>
                      
                      <div style={{ textAlign: "right" }}>
                        <div
                          style={{
                            display: "inline-block",
                            padding: "5px 12px",
                            borderRadius: 15,
                            background: getStatusColor(detail.status),
                            color: "#000",
                            fontWeight: "bold",
                            fontSize: 11,
                            marginBottom: 5,
                          }}
                        >
                          {detail.status === "Pending" && "Chờ"}
                          {detail.status === "Preparing" && "Đang làm"}
                          {detail.status === "Completed" && "Xong"}
                          {detail.status === "Cancelled" && "Hủy"}
                        </div>
                        <p style={{ color: "#4ade80", fontWeight: "bold" }}>
                          {formatPrice(detail.unit_price * detail.quantity)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}

                <div className="card" style={{ background: "#1a1a1a", marginTop: 20 }}>
                  <h3 style={{ color: "#4ade80" }}>
                    Tổng cộng: {formatPrice(selectedOrder.total_price)}
                  </h3>
                </div>
              </>
            )}

            <button
              className="btn btn-secondary"
              style={{ width: "100%", marginTop: 20 }}
              onClick={() => setShowModal(false)}
            >
              Đóng
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
