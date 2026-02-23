import { useState, useEffect } from "react";
import "./PageStyles.css";

const API = "https://localhost:7031/api/orders";

export default function OrderPage() {
  const [orders, setOrders] = useState([]);
  const [orderCode, setOrderCode] = useState("");
  const [tableId, setTableId] = useState("");
  const [customerId, setCustomerId] = useState("");
  const [staffId, setStaffId] = useState("");
  const [totalAmount, setTotalAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("");
  const [editingId, setEditingId] = useState(null);
  const token = localStorage.getItem("token");

  const loadOrders = async () => {
    try {
      const res = await fetch(API, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setOrders(data);
      }
    } catch (err) {
      console.error("Load orders error:", err);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const createOrder = async () => {
    if (!orderCode || !tableId) {
      alert("Vui lòng nhập Order Code và Table ID");
      return;
    }
    await fetch(API, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        orderCode,
        tableId: parseInt(tableId),
        customerId: customerId ? parseInt(customerId) : null,
        staffId: staffId ? parseInt(staffId) : null,
        totalAmount: totalAmount ? parseFloat(totalAmount) : 0,
        paymentMethod: paymentMethod || "Cash",
        paymentStatus: paymentStatus || "Pending",
      }),
    });
    resetForm();
    loadOrders();
  };

  const updateOrder = async () => {
    await fetch(`${API}/${editingId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        id: editingId,
        orderCode,
        tableId: parseInt(tableId),
        customerId: customerId ? parseInt(customerId) : null,
        staffId: staffId ? parseInt(staffId) : null,
        totalAmount: parseFloat(totalAmount),
        paymentMethod,
        paymentStatus,
      }),
    });
    resetForm();
    loadOrders();
  };

  const deleteOrder = async (id) => {
    if (confirm("Xác nhận xóa đơn hàng?")) {
      await fetch(`${API}/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      loadOrders();
    }
  };

  const resetForm = () => {
    setOrderCode("");
    setTableId("");
    setCustomerId("");
    setStaffId("");
    setTotalAmount("");
    setPaymentMethod("");
    setPaymentStatus("");
    setEditingId(null);
  };

  return (
    <div className="page-container">
      <h2 className="page-title">Quản lý Đơn hàng</h2>

      <div className="form-container">
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Mã đơn hàng *</label>
            <input
              className="form-input"
              placeholder="ORDER-001"
              value={orderCode}
              onChange={(e) => setOrderCode(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Table ID *</label>
            <input
              className="form-input"
              type="number"
              placeholder="1"
              value={tableId}
              onChange={(e) => setTableId(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Customer ID</label>
            <input
              className="form-input"
              type="number"
              placeholder="Tùy chọn"
              value={customerId}
              onChange={(e) => setCustomerId(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Staff ID</label>
            <input
              className="form-input"
              type="number"
              placeholder="Tùy chọn"
              value={staffId}
              onChange={(e) => setStaffId(e.target.value)}
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Tổng tiền</label>
            <input
              className="form-input"
              type="number"
              placeholder="0"
              value={totalAmount}
              onChange={(e) => setTotalAmount(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Phương thức thanh toán</label>
            <select
              className="form-select"
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
            >
              <option value="">Chọn...</option>
              <option value="Cash">Tiền mặt</option>
              <option value="Card">Thẻ</option>
              <option value="Transfer">Chuyển khoản</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Trạng thái thanh toán</label>
            <select
              className="form-select"
              value={paymentStatus}
              onChange={(e) => setPaymentStatus(e.target.value)}
            >
              <option value="">Chọn...</option>
              <option value="Pending">Chờ thanh toán</option>
              <option value="Paid">Đã thanh toán</option>
              <option value="Cancelled">Đã hủy</option>
            </select>
          </div>
        </div>

        <div className="btn-group">
          {editingId ? (
            <>
              <button className="btn btn-warning" onClick={updateOrder}>Cập nhật</button>
              <button className="btn btn-secondary" onClick={resetForm}>Hủy</button>
            </>
          ) : (
            <button className="btn btn-success" onClick={createOrder}>Thêm đơn hàng</button>
          )}
        </div>
      </div>

      <table className="data-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Mã đơn</th>
            <th style={{ textAlign: 'center' }}>Table</th>
            <th style={{ textAlign: 'right' }}>Tổng tiền</th>
            <th style={{ textAlign: 'center' }}>Thanh toán</th>
            <th style={{ textAlign: 'center' }}>Trạng thái</th>
            <th style={{ textAlign: 'center' }}>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id}>
              <td>{order.id}</td>
              <td><b>{order.orderCode}</b></td>
              <td style={{ textAlign: 'center' }}>{order.tableId}</td>
              <td style={{ textAlign: 'right', color: '#d4af37', fontWeight: 600 }}>
                {order.totalAmount?.toLocaleString()}đ
              </td>
              <td style={{ textAlign: 'center' }}>{order.paymentMethod}</td>
              <td style={{ textAlign: 'center' }}>
                <span className={`badge ${order.paymentStatus === "Paid" ? "badge-success" : "badge-warning"}`}>
                  {order.paymentStatus}
                </span>
              </td>
              <td style={{ textAlign: 'center' }}>
                <button
                  className="btn btn-warning"
                  style={{ marginRight: 8, padding: '6px 12px' }}
                  onClick={() => {
                    setEditingId(order.id);
                    setOrderCode(order.orderCode);
                    setTableId(order.tableId);
                    setCustomerId(order.customerId || "");
                    setStaffId(order.staffId || "");
                    setTotalAmount(order.totalAmount);
                    setPaymentMethod(order.paymentMethod);
                    setPaymentStatus(order.paymentStatus);
                  }}
                >
                  Sửa
                </button>
                <button
                  className="btn btn-danger"
                  style={{ padding: '6px 12px' }}
                  onClick={() => deleteOrder(order.id)}
                >
                  Xóa
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {orders.length === 0 && (
        <div className="empty-state">
          <div className="empty-state-title">Chưa có đơn hàng nào</div>
        </div>
      )}
    </div>
  );
}
