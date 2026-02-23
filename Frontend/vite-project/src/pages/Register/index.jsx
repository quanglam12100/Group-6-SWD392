import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { USER_ROLES } from "../../utils/constants";
import "../PageStyles.css";

export default function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fullname, setFullname] = useState("");
  const [role, setRole] = useState(USER_ROLES.STAFF);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Validation
    if (!username.trim()) {
      setError("Vui lòng nhập tên đăng nhập!");
      return;
    }

    // Username validation - only allow alphanumeric and underscore
    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      setError("Tên đăng nhập chỉ được chứa chữ cái, số và dấu gạch dưới (_)!");
      return;
    }

    if (username.length < 3) {
      setError("Tên đăng nhập phải có ít nhất 3 ký tự!");
      return;
    }

    if (password !== confirmPassword) {
      setError("Mật khẩu xác nhận không khớp!");
      return;
    }

    if (password.length < 6) {
      setError("Mật khẩu phải có ít nhất 6 ký tự!");
      return;
    }

    if (!fullname.trim()) {
      setError("Vui lòng nhập họ tên!");
      return;
    }

    setLoading(true);

    const result = await register({
      username,
      password,
      fullname,
      role,
    });

    setLoading(false);

    if (result.success) {
      setSuccess("Đăng ký thành công! Đang chuyển sang đăng nhập...");
      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } else {
      setError(result.message || "Đăng ký thất bại!");
    }
  };

  return (
    <div style={{ 
      minHeight: "100vh", 
      background: "linear-gradient(180deg, #1a1a1a 0%, #2b2b2b 100%)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "20px"
    }}>
      <div style={{
        maxWidth: "500px",
        width: "100%",
        background: "rgba(255, 255, 255, 0.03)",
        backdropFilter: "blur(10px)",
        border: "1px solid rgba(255, 255, 255, 0.1)",
        borderRadius: "12px",
        padding: "40px"
      }}>
        <h2 style={{ color: "#d4af37", textAlign: "center", marginBottom: "10px" }}>
          Đăng ký tài khoản
        </h2>
        <p style={{ color: "rgba(255, 255, 255, 0.6)", textAlign: "center", marginBottom: "30px" }}>
          Tạo tài khoản mới để sử dụng hệ thống
        </p>

        {error && (
          <div style={{
            background: "rgba(239, 68, 68, 0.1)",
            color: "#ef4444",
            padding: "12px",
            borderRadius: "6px",
            marginBottom: "20px",
            border: "1px solid rgba(239, 68, 68, 0.3)"
          }}>
            {error}
          </div>
        )}

        {success && (
          <div style={{
            background: "rgba(74, 222, 128, 0.1)",
            color: "#4ade80",
            padding: "12px",
            borderRadius: "6px",
            marginBottom: "20px",
            border: "1px solid rgba(74, 222, 128, 0.3)"
          }}>
            {success}
          </div>
        )}

        <form onSubmit={handleRegister}>
          <div style={{ marginBottom: "20px" }}>
            <label className="form-label">Tên đăng nhập *</label>
            <input
              type="text"
              className="form-input"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              placeholder="vd: john_doe, staff123"
              autoComplete="username"
              disabled={loading}
            />
            <small style={{ color: "rgba(255, 255, 255, 0.5)", fontSize: "12px" }}>
              Chỉ chữ, số và dấu gạch dưới (_), tối thiểu 3 ký tự
            </small>
          </div>

          <div style={{ marginBottom: "20px" }}>
            <label className="form-label">Họ và tên *</label>
            <input
              type="text"
              className="form-input"
              value={fullname}
              onChange={(e) => setFullname(e.target.value)}
              required
              placeholder="Nguyễn Văn A"
              autoComplete="name"
              disabled={loading}
            />
          </div>

          <div style={{ marginBottom: "20px" }}>
            <label className="form-label">Mật khẩu *</label>
            <input
              type="password"
              className="form-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              autoComplete="new-password"
              disabled={loading}
            />
            <small style={{ color: "rgba(255, 255, 255, 0.5)", fontSize: "12px" }}>
              Ít nhất 6 ký tự
            </small>
          </div>

          <div style={{ marginBottom: "20px" }}>
            <label className="form-label">Xác nhận mật khẩu *</label>
            <input
              type="password"
              className="form-input"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              placeholder="••••••••"
              autoComplete="new-password"
              disabled={loading}
            />
          </div>

          <div style={{ marginBottom: "25px" }}>
            <label className="form-label">Vai trò *</label>
            <select
              className="form-select"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              disabled={loading}
            >
              <option value={USER_ROLES.STAFF}>Nhân viên</option>
              <option value={USER_ROLES.CHEF}>Đầu bếp</option>
              <option value={USER_ROLES.MANAGER}>Quản lý</option>
              <option value={USER_ROLES.ADMIN}>Admin</option>
            </select>
          </div>

          <button 
            type="submit" 
            className="btn-primary" 
            style={{ width: "100%", marginBottom: "15px" }}
            disabled={loading}
          >
            {loading ? "Đang xử lý..." : "Đăng ký"}
          </button>

          <div style={{ textAlign: "center", marginTop: "20px", color: "rgba(255, 255, 255, 0.6)" }}>
            Đã có tài khoản?{" "}
            <button
              type="button"
              onClick={() => navigate("/login")}
              disabled={loading}
              style={{ 
                background: "none", 
                border: "none", 
                color: "#d4af37", 
                cursor: "pointer",
                textDecoration: "underline",
                padding: 0,
                font: "inherit"
              }}
            >
              Đăng nhập ngay
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
