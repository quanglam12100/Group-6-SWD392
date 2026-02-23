import { useState, useEffect } from "react";
import "./PageStyles.css";

const API = "https://localhost:7031/api/tables";

export default function TablePage() {
  const [tables, setTables] = useState([]);
  const [name, setName] = useState("");
  const [status, setStatus] = useState("Available");
  const [editingId, setEditingId] = useState(null);
  const token = localStorage.getItem("token");

  const loadTables = async () => {
    try {
      const res = await fetch(API, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setTables(data);
      }
    } catch (err) {
      console.error("Load tables error:", err);
    }
  };

  useEffect(() => {
    loadTables();
  }, []);

  const createTable = async () => {
    if (!name) {
      alert("Vui lòng nhập tên bàn");
      return;
    }
    await fetch(API, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name, status }),
    });
    setName("");
    setStatus("Available");
    loadTables();
  };

  const updateTable = async () => {
    await fetch(`${API}/${editingId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ id: editingId, name, status }),
    });
    setName("");
    setStatus("Available");
    setEditingId(null);
    loadTables();
  };

  const deleteTable = async (id) => {
    if (confirm("Xác nhận xóa bàn?")) {
      await fetch(`${API}/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      loadTables();
    }
  };

  return (
    <div className="page-container">
      <h2 className="page-title">Quản lý Bàn ăn</h2>

      <div className="form-container">
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Tên bàn</label>
            <input
              className="form-input"
              placeholder="VD: Bàn 1, Bàn VIP..."
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Trạng thái</label>
            <select
              className="form-select"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="Available">Trống</option>
              <option value="Occupied">Đang sử dụng</option>
              <option value="Reserved">Đã đặt</option>
            </select>
          </div>
        </div>

        <div className="btn-group">
          {editingId ? (
            <>
              <button className="btn btn-warning" onClick={updateTable}>Cập nhật</button>
              <button className="btn btn-secondary" onClick={() => {
                setEditingId(null);
                setName("");
                setStatus("Available");
              }}>Hủy</button>
            </>
          ) : (
            <button className="btn btn-success" onClick={createTable}>Thêm bàn</button>
          )}
        </div>
      </div>

      <div className="card-grid">
        {tables.map((table) => (
          <div
            key={table.id}
            className={`card ${
              table.status === "Available"
                ? "border-success"
                : table.status === "Occupied"
                ? "border-danger"
                : "border-warning"
            }`}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 15 }}>
              <h3 className="card-title">{table.name}</h3>
              <span className={`badge ${
                table.status === "Available"
                  ? "badge-success"
                  : table.status === "Occupied"
                  ? "badge-danger"
                  : "badge-warning"
              }`}>
                {table.status === "Available"
                  ? "Trống"
                  : table.status === "Occupied"
                  ? "Đang dùng"
                  : "Đã đặt"}
              </span>
            </div>
            <div className="btn-group">
              <button
                className="btn btn-warning"
                style={{ flex: 1, padding: '8px' }}
                onClick={() => {
                  setEditingId(table.id);
                  setName(table.name);
                  setStatus(table.status);
                }}
              >
                Sửa
              </button>
              <button
                className="btn btn-danger"
                style={{ flex: 1, padding: '8px' }}
                onClick={() => deleteTable(table.id)}
              >
                Xóa
              </button>
            </div>
          </div>
        ))}
      </div>
      {tables.length === 0 && (
        <div className="empty-state">
          <div className="empty-state-title">Chưa có bàn nào</div>
        </div>
      )}
    </div>
  );
}
