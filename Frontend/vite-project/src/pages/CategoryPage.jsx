import { useEffect, useState } from "react";
import "./PageStyles.css";

const API = "https://localhost:7031/api/categories";

export default function CategoryPage() {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [editingId, setEditingId] = useState(null);

  const token = localStorage.getItem("token");

  const loadData = async () => {
    const res = await fetch(API, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setCategories(data);
  };

  useEffect(() => {
    loadData();
  }, []);

  const createCategory = async () => {
    await fetch(API, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name }),
    });
    setName("");
    loadData();
  };

  const updateCategory = async () => {
    await fetch(`${API}/${editingId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ id: editingId, name }),
    });
    setName("");
    setEditingId(null);
    loadData();
  };

  const deleteCategory = async (id) => {
    await fetch(`${API}/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    loadData();
  };

  return (
    <div className="page-container">
      <h2 className="page-title">Quản lý danh mục</h2>

      <div className="form-container">
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Tên danh mục</label>
            <input
              className="form-input"
              placeholder="Nhập tên danh mục"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
        </div>

        <div className="btn-group">
          {editingId ? (
            <>
              <button className="btn btn-warning" onClick={updateCategory}>Cập nhật</button>
              <button className="btn btn-secondary" onClick={() => { setEditingId(null); setName(""); }}>Hủy</button>
            </>
          ) : (
            <button className="btn btn-success" onClick={createCategory}>Thêm mới</button>
          )}
        </div>
      </div>

      <table className="data-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Tên danh mục</th>
            <th style={{ textAlign: 'center' }}>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((c) => (
            <tr key={c.id}>
              <td>{c.id}</td>
              <td><b>{c.name}</b></td>
              <td style={{ textAlign: 'center' }}>
                <button className="btn btn-warning" style={{ marginRight: 8, padding: '6px 12px' }} onClick={() => { setEditingId(c.id); setName(c.name); }}>Sửa</button>
                <button className="btn btn-danger" style={{ padding: '6px 12px' }} onClick={() => deleteCategory(c.id)}>Xóa</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {categories.length === 0 && (
        <div className="empty-state">
          <div className="empty-state-title">Chưa có danh mục nào</div>
        </div>
      )}
    </div>
  );
}
