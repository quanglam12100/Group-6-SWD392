import { useState, useEffect } from "react";
import "./PageStyles.css";

const API = "https://localhost:7031/api/accounts";

export default function AccountPage() {
  const [accounts, setAccounts] = useState([]);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [fullname, setFullname] = useState("");
  const [role, setRole] = useState("Staff");
  const [isActive, setIsActive] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const token = localStorage.getItem("token");

  const loadAccounts = async () => {
    try {
      const res = await fetch(API, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setAccounts(data);
      }
    } catch (err) {
      console.error("Load accounts error:", err);
    }
  };

  useEffect(() => {
    loadAccounts();
  }, []);

  const createAccount = async () => {
    if (!username || !password || !fullname) {
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
        username,
        password,
        fullname,
        role,
        isActive,
      }),
    });
    resetForm();
    loadAccounts();
  };

  const updateAccount = async () => {
    const body = {
      id: editingId,
      username,
      fullname,
      role,
      isActive,
    };
    // Only include password if it's been changed
    if (password) {
      body.password = password;
    }

    await fetch(`${API}/${editingId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });
    resetForm();
    loadAccounts();
  };

  const deleteAccount = async (id) => {
    if (confirm("Xác nhận xóa tài khoản?")) {
      await fetch(`${API}/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      loadAccounts();
    }
  };

  const resetForm = () => {
    setUsername("");
    setPassword("");
    setFullname("");
    setRole("Staff");
    setIsActive(true);
    setEditingId(null);
  };

  return (
    <div className="page-container">
      <h2 className="page-title">Quản lý Tài khoản</h2>

      <div className="form-container">
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Username *</label>
            <input
              className="form-input"
              placeholder="Tên đăng nhập"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={editingId !== null}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Password {editingId && "(để trống nếu không đổi)"}</label>
            <input
              className="form-input"
              type="password"
              placeholder={editingId ? "Nhập để thay đổi" : "Mật khẩu"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group" style={{ gridColumn: '1 / 3' }}>
            <label className="form-label">Họ tên *</label>
            <input
              className="form-input"
              placeholder="Họ và tên đầy đủ"
              value={fullname}
              onChange={(e) => setFullname(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Vai trò</label>
            <select
              className="form-select"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="Admin">Admin</option>
              <option value="Manager">Manager</option>
              <option value="Staff">Staff</option>
              <option value="Chef">Chef</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Trạng thái</label>
            <select
              className="form-select"
              value={isActive}
              onChange={(e) => setIsActive(e.target.value === "true")}
            >
              <option value="true">Hoạt động</option>
              <option value="false">Khóa</option>
            </select>
          </div>
        </div>

        <div className="btn-group">
          {editingId ? (
            <>
              <button className="btn btn-warning" onClick={updateAccount}>Cập nhật</button>
              <button className="btn btn-secondary" onClick={resetForm}>Hủy</button>
            </>
          ) : (
            <button className="btn btn-success" onClick={createAccount}>Thêm tài khoản</button>
          )}
        </div>
      </div>

      <table className="data-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Username</th>
            <th>Họ tên</th>
            <th style={{ textAlign: 'center' }}>Vai trò</th>
            <th style={{ textAlign: 'center' }}>Trạng thái</th>
            <th style={{ textAlign: 'center' }}>Ngày tạo</th>
            <th style={{ textAlign: 'center' }}>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {accounts.map((acc) => (
            <tr key={acc.id}>
              <td>{acc.id}</td>
              <td><b>{acc.username}</b></td>
              <td>{acc.fullname}</td>
              <td style={{ textAlign: 'center' }}>
                <span className={`badge ${
                  acc.role === "Admin"
                    ? "badge-danger"
                    : acc.role === "Manager"
                    ? "badge-warning"
                    : "badge-success"
                }`}>
                  {acc.role}
                </span>
              </td>
              <td style={{ textAlign: 'center' }}>
                <span className={`badge ${acc.isActive ? "badge-success" : "badge-secondary"}`}>
                  {acc.isActive ? "Hoạt động" : "Khóa"}
                </span>
              </td>
              <td style={{ textAlign: 'center', fontSize: 13 }}>
                {acc.createdAt ? new Date(acc.createdAt).toLocaleDateString("vi-VN") : "-"}
              </td>
              <td style={{ textAlign: 'center' }}>
                <button
                  className="btn btn-warning"
                  style={{ marginRight: 8, padding: '6px 12px' }}
                  onClick={() => {
                    setEditingId(acc.id);
                    setUsername(acc.username);
                    setPassword("");
                    setFullname(acc.fullname);
                    setRole(acc.role);
                    setIsActive(acc.isActive);
                  }}
                >
                  Sửa
                </button>
                <button
                  className="btn btn-danger"
                  style={{ padding: '6px 12px' }}
                  onClick={() => deleteAccount(acc.id)}
                >
                  Xóa
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {accounts.length === 0 && (
        <div className="empty-state">
          <div className="empty-state-title">Chưa có tài khoản nào</div>
        </div>
      )}
    </div>
  );
}
