import { useState, useEffect } from "react";
import "./PageStyles.css";

const API = "https://localhost:7031/api/variants";

export default function ProductVariantPage() {
  const [variants, setVariants] = useState([]);
  const [productId, setProductId] = useState("");
  const [sizeName, setSizeName] = useState("");
  const [price, setPrice] = useState("");
  const [editingId, setEditingId] = useState(null);
  const token = localStorage.getItem("token");

  const loadVariants = async () => {
    try {
      if (!productId) {
        alert("Vui lòng nhập Product ID");
        return;
      }
      const res = await fetch(`${API}/product/${productId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setVariants(data);
      }
    } catch (err) {
      console.error("Load variant error:", err);
    }
  };

  const createVariant = async () => {
    if (!productId || !sizeName || !price) {
      alert("Vui lòng nhập đầy đủ thông tin");
      return;
    }
    await fetch(API, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        productId: parseInt(productId),
        sizeName,
        price: parseFloat(price),
      }),
    });
    setSizeName("");
    setPrice("");
    loadVariants();
  };

  const updateVariant = async () => {
    await fetch(`${API}/${editingId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        id: editingId,
        productId: parseInt(productId),
        sizeName,
        price: parseFloat(price),
      }),
    });
    setSizeName("");
    setPrice("");
    setEditingId(null);
    loadVariants();
  };

  const deleteVariant = async (id) => {
    if (confirm("Xác nhận xóa?")) {
      await fetch(`${API}/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      loadVariants();
    }
  };

  return (
    <div className="page-container">
      <h2 className="page-title">Quản lý Biến thể Sản phẩm</h2>

      <div className="form-container">
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Product ID</label>
            <input
              className="form-input"
              type="number"
              placeholder="Nhập Product ID"
              value={productId}
              onChange={(e) => setProductId(e.target.value)}
            />
          </div>
          <div style={{ alignSelf: 'flex-end' }}>
            <button className="btn btn-load" onClick={loadVariants}>
              Tải Variants
            </button>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Size Name</label>
            <input
              className="form-input"
              placeholder="VD: Nhỏ, Vừa, Lớn"
              value={sizeName}
              onChange={(e) => setSizeName(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Giá</label>
            <input
              className="form-input"
              type="number"
              placeholder="Nhập giá"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </div>
        </div>

        <div className="btn-group">
          {editingId ? (
            <>
              <button className="btn btn-warning" onClick={updateVariant}>Cập nhật</button>
              <button className="btn btn-secondary" onClick={() => {
                setEditingId(null);
                setSizeName("");
                setPrice("");
              }}>Hủy</button>
            </>
          ) : (
            <button className="btn btn-success" onClick={createVariant}>Thêm mới</button>
          )}
        </div>
      </div>

      <table className="data-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Product ID</th>
            <th>Size Name</th>
            <th style={{ textAlign: 'right' }}>Giá</th>
            <th style={{ textAlign: 'center' }}>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {variants.map((v) => (
            <tr key={v.id}>
              <td>{v.id}</td>
              <td>{v.productId}</td>
              <td><b>{v.sizeName}</b></td>
              <td style={{ textAlign: 'right', color: '#d4af37', fontWeight: 600 }}>
                {v.price.toLocaleString()}đ
              </td>
              <td style={{ textAlign: 'center' }}>
                <button
                  className="btn btn-warning"
                  style={{ marginRight: 8, padding: '6px 12px' }}
                  onClick={() => {
                    setEditingId(v.id);
                    setSizeName(v.sizeName);
                    setPrice(v.price);
                  }}
                >
                  Sửa
                </button>
                <button
                  className="btn btn-danger"
                  style={{ padding: '6px 12px' }}
                  onClick={() => deleteVariant(v.id)}
                >
                  Xóa
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {variants.length === 0 && (
        <div className="empty-state">
          <div className="empty-state-title">Chưa có biến thể nào</div>
          <div className="empty-state-text">Vui lòng nhập Product ID và tải dữ liệu</div>
        </div>
      )}
    </div>
  );
}
