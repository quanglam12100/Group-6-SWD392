import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
import "../PageStyles.css";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const login = useAuthStore((state) => state.login);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await login(username, password);
    setLoading(false);

    if (result.success) {
      // Redirect based on role (case-insensitive)
      const userRole = result.user?.role?.toLowerCase();
      
      switch (userRole) {
        case "customer":
          navigate("/customer");
          break;
        case "staff":
          navigate("/staff");
          break;
        case "chef":
        case "kitchen":
          navigate("/kitchen");
          break;
        case "manager":
          navigate("/manager");
          break;
        case "admin":
          navigate("/admin");
          break;
        default:
          navigate("/");
      }
    } else {
      setError(result.error);
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
        maxWidth: "450px",
        width: "100%",
        background: "rgba(255, 255, 255, 0.03)",
        backdropFilter: "blur(10px)",
        border: "1px solid rgba(255, 255, 255, 0.1)",
        borderRadius: "12px",
        padding: "40px"
      }}>
        <h2 style={{ color: "#d4af37", textAlign: "center", marginBottom: "10px" }}>Đăng nhập</h2>
        <p style={{ color: "rgba(255, 255, 255, 0.6)", textAlign: "center", marginBottom: "30px" }}>
          Chào mừng trở lại SmartRestaurant
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

        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: "20px" }}>
            <label className="form-label">Tên đăng nhập</label>
            <input
              type="text"
              className="form-input"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              placeholder="username"
              autoComplete="username"
              disabled={loading}
            />
          </div>

          <div style={{ marginBottom: "20px" }}>
            <label className="form-label">Mật khẩu</label>
            <input
              type="password"
              className="form-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              autoComplete="current-password"
              disabled={loading}
            />
          </div>

          <button 
            type="submit" 
            className="btn-primary" 
            style={{ width: "100%", marginBottom: "15px" }}
            disabled={loading}
          >
            {loading ? "Đang đăng nhập..." : "Đăng nhập"}
          </button>

          <div style={{ textAlign: "center", color: "rgba(255, 255, 255, 0.6)" }}>
            <a href="#" style={{ color: "#d4af37", textDecoration: "none" }}>
              Quên mật khẩu?
            </a>
          </div>

          <div style={{ textAlign: "center", marginTop: "20px", color: "rgba(255, 255, 255, 0.6)" }}>
            Chưa có tài khoản?{" "}
            <button
              type="button"
              onClick={() => navigate("/register")}
              style={{ 
                background: "none", 
                border: "none", 
                color: "#d4af37", 
                cursor: "pointer",
                textDecoration: "underline",
                padding: 0,
                font: "inherit"
              }}
              disabled={loading}
            >
              Đăng ký ngay
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
