import { useState, useEffect } from "react";
import { tablesApi } from "../../api/tables.api";
import { ordersApi } from "../../api/orders.api";
import { useCartStore } from "../../store/cartStore";
import { useAuthStore } from "../../store/authStore";
import { useNavigate } from "react-router-dom";
import { formatPrice } from "../../utils/formatPrice";
import { TABLE_STATUS } from "../../utils/constants";
import "../PageStyles.css";

export default function Order() {
  const [tables, setTables] = useState([]);
  const [selectedTable, setSelectedTable] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  const cart = useCartStore((state) => state.items);
  const getTotalPrice = useCartStore((state) => state.getTotalPrice);
  const clearCart = useCartStore((state) => state.clearCart);
  const removeFromCart = useCartStore((state) => state.removeFromCart);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  
  const user = useAuthStore((state) => state.user);
  const navigate = useNavigate();

  useEffect(() => {
    fetchTables();
  }, []);

  const fetchTables = async () => {
    try {
      const data = await tablesApi.getAll();
      setTables(data.filter((t) => t.status === TABLE_STATUS.AVAILABLE));
      setLoading(false);
    } catch (error) {
      console.error("Lỗi khi tải danh sách bàn:", error);
      setLoading(false);
    }
  };

  const handleSubmitOrder = async () => {
    if (!selectedTable) {
      alert("Vui lòng chọn bàn!");
      return;
    }

    if (cart.length === 0) {
      alert("Giỏ hàng trống!");
      return;
    }

    setSubmitting(true);

    try {
      // Create order
      const orderData = {
        table_id: selectedTable.table_id,
        staff_id: user?.account_id,
        total_price: getTotalPrice(),
        payment_status: "Pending",
        payment_method: null,
      };

      const order = await ordersApi.create(orderData);

      // Add order details
      for (const item of cart) {
        const detailData = {
          product_id: item.product_id,
          variant_id: item.variant_id,
          quantity: item.quantity,
          unit_price: item.price,
          topping_ids: item.toppings?.map((t) => t.topping_id) || [],
          status: "Pending",
          notes: "",
        };

        await ordersApi.addDetail(order.order_id, detailData);
      }

      // Update table status
      await tablesApi.updateStatus(selectedTable.table_id, TABLE_STATUS.OCCUPIED);

      alert("Đặt món thành công!");
      clearCart();
      navigate("/customer/order-history");
    } catch (error) {
      console.error("Lỗi khi đặt món:", error);
      alert("Đặt món thất bại: " + (error.message || error));
    } finally {
      setSubmitting(false);
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
      <h1 className="page-title">Đặt Món</h1>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 30 }}>
        {/* Cart */}
        <div>
          <h2 style={{ color: "#d4af37", marginBottom: 20 }}>Giỏ hàng</h2>
          
          {cart.length === 0 ? (
            <p style={{ color: "#ccc" }}>Giỏ hàng trống. Vui lòng chọn món từ menu.</p>
          ) : (
            <>
              {cart.map((item, index) => (
                <div key={index} className="card" style={{ marginBottom: 15 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start" }}>
                    <div style={{ flex: 1 }}>
                      <h4 style={{ color: "#d4af37", marginBottom: 5 }}>
                        {item.product_name}
                        {item.variant_name && ` (${item.variant_name})`}
                      </h4>
                      {item.toppings && item.toppings.length > 0 && (
                        <p style={{ fontSize: 12, color: "#999", marginBottom: 5 }}>
                          Topping: {item.toppings.map((t) => t.topping_name).join(", ")}
                        </p>
                      )}
                      <p style={{ color: "#4ade80", fontWeight: "bold" }}>
                        {formatPrice(item.price)} x {item.quantity}
                      </p>
                    </div>
                    
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <button
                        className="btn btn-secondary"
                        style={{ padding: "5px 10px" }}
                        onClick={() => updateQuantity(index, item.quantity - 1)}
                      >
                        -
                      </button>
                      <span>{item.quantity}</span>
                      <button
                        className="btn btn-secondary"
                        style={{ padding: "5px 10px" }}
                        onClick={() => updateQuantity(index, item.quantity + 1)}
                      >
                        +
                      </button>
                      <button
                        className="btn btn-danger"
                        style={{ padding: "5px 10px" }}
                        onClick={() => removeFromCart(index)}
                      >
                        Xóa
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              <div className="card" style={{ background: "#2b2b2b" }}>
                <h3 style={{ color: "#4ade80" }}>
                  Tổng cộng: {formatPrice(getTotalPrice())}
                </h3>
              </div>
            </>
          )}
        </div>

        {/* Table Selection */}
        <div>
          <h2 style={{ color: "#d4af37", marginBottom: 20 }}>Chọn bàn</h2>
          
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 15 }}>
            {tables.map((table) => (
              <div
                key={table.table_id}
                className={`card ${selectedTable?.table_id === table.table_id ? "selected" : ""}`}
                style={{
                  cursor: "pointer",
                  border: selectedTable?.table_id === table.table_id ? "2px solid #d4af37" : undefined,
                  textAlign: "center",
                }}
                onClick={() => setSelectedTable(table)}
              >
                <h3 style={{ color: "#d4af37" }}>{table.table_name}</h3>
                <p style={{ color: "#ccc", fontSize: 14 }}>
                  {table.capacity} người
                </p>
              </div>
            ))}
          </div>

          {tables.length === 0 && (
            <p style={{ color: "#ccc" }}>Không có bàn trống.</p>
          )}

          <button
            className="btn btn-primary"
            style={{ width: "100%", marginTop: 30 }}
            onClick={handleSubmitOrder}
            disabled={submitting || cart.length === 0 || !selectedTable}
          >
            {submitting ? "Đang xử lý..." : "Xác nhận đặt món"}
          </button>
        </div>
      </div>
    </div>
  );
}
