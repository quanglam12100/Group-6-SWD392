import { useEffect, useState } from "react";
import "./PageStyles.css";

const API = "https://localhost:7031/api/toppings";

export default function ToppingPage() {
  const [toppings, setToppings] = useState([]);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [isAvailable, setIsAvailable] = useState(true);
  const [editingId, setEditingId] = useState(null);

  const token = localStorage.getItem("token");

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  const loadData = async () => {
    const res = await fetch(API, { headers });
    const data = await res.json();
    setToppings(data);
  };

  useEffect(() => {
    loadData();
  }, []);

  const resetForm = () => {
    setName("");
    setPrice("");
    setIsAvailable(true);
    setEditingId(null);
  };

  const createOrUpdate = async () => {
    const body = JSON.stringify({
      name,
      price: Number(price),
      isAvailable,
    });

    if (editingId) {
      await fetch(`${API}/${editingId}`, {
        method: "PUT",
        headers,
        body,
      });
    } else {
      await fetch(API, {
        method: "POST",
        headers,
        body,
      });
    }

    resetForm();
    loadData();
  };

  const deleteTopping = async (id) => {
    await fetch(`${API}/${id}`, {
      method: "DELETE",
      headers,
    });
    loadData();
  };

  const editTopping = (t) => {
    setEditingId(t.id);
    setName(t.name);
    setPrice(t.price);
    setIsAvailable(t.isAvailable);
  };

  return (
    <div className="page-container">
      <h2 className="page-title">Quản lý Topping</h2>

      <div className="form-container">
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Tên topping</label>
            <input
              className="form-input"
              placeholder="VD: Trân châu, Thạch..."
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Giá</label>
            <input
              className="form-input"
              type="number"
              placeholder="0"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </div>
        </div>

        <div className="form-row">
          <label style={{ display: 'flex', alignItems: 'center', color: '#fff' }}>
            <input
              className="form-checkbox"
              type="checkbox"
              checked={isAvailable}
              onChange={(e) => setIsAvailable(e.target.checked)}
            />
            Còn hàng
          </label>
        </div>

        <div className="btn-group">
          {editingId ? (
            <>
              <button className="btn btn-warning" onClick={createOrUpdate}>Cập nhật</button>
              <button className="btn btn-secondary" onClick={resetForm}>Hủy</button>
            </>
          ) : (
            <button className="btn btn-success" onClick={createOrUpdate}>Thêm mới</button>
          )}
        </div>
      </div>

      <table className="data-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Tên topping</th>
            <th style={{ textAlign: 'right' }}>Giá</th>
            <th style={{ textAlign: 'center' }}>Trạng thái</th>
            <th style={{ textAlign: 'center' }}>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {toppings.map((t) => (
            <tr key={t.id}>
              <td>{t.id}</td>
              <td><b>{t.name}</b></td>
              <td style={{ textAlign: 'right', color: '#d4af37', fontWeight: 600 }}>
                {t.price?.toLocaleString()}đ
              </td>
              <td style={{ textAlign: 'center' }}>
                <span className={`badge ${t.isAvailable ? 'badge-success' : 'badge-danger'}`}>
                  {t.isAvailable ? 'Còn hàng' : 'Hết hàng'}
                </span>
              </td>
              <td style={{ textAlign: 'center' }}>
                <button className="btn btn-warning" style={{ marginRight: 8, padding: '6px 12px' }} onClick={() => editTopping(t)}>Sửa</button>
                <button className="btn btn-danger" style={{ padding: '6px 12px' }} onClick={() => deleteTopping(t.id)}>Xóa</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {toppings.length === 0 && (
        <div className="empty-state">
          <div className="empty-state-title">Chưa có topping nào</div>
        </div>
      )}
    </div>
  );
}
