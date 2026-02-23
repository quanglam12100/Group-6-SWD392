import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../pages/PageStyles.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      const res = await fetch("https://localhost:7031/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: email,
          password: password,
        }),
      });

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(errText || "Login failed");
      }

      const data = await res.json();
      console.log("Login response:", data);

      // Lưu token
      localStorage.setItem("token", data.token);

      setMessage("✅ Đăng nhập thành công! Đang chuyển trang...");

      // Chuyển về trang Home sau 1 chút
      setTimeout(() => {
        navigate("/");
      }, 800);
    } catch (err) {
      console.error(err);
      setMessage("❌ Sai tài khoản hoặc mật khẩu!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(180deg, #1a1a1a 0%, #2b2b2b 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 20
    }}>
      <div style={{
        background: 'rgba(255, 255, 255, 0.05)',
        backdropFilter: 'blur(10px)',
        padding: 40,
        borderRadius: 12,
        width: '100%',
        maxWidth: 450,
        border: '1px solid rgba(212, 175, 55, 0.3)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: 30 }}>
          <h2 style={{ 
            color: '#d4af37', 
            fontSize: 32,
            fontWeight: 800,
            marginBottom: 10,
            textTransform: 'uppercase',
            letterSpacing: 2
          }}>
            Đăng nhập
          </h2>
          <p style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: 14 }}>
            Chào mừng đến với SmartRestaurant
          </p>
        </div>

        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: 20 }}>
            <label style={{ 
              display: 'block', 
              marginBottom: 8,
              color: '#d4af37',
              fontWeight: 600,
              fontSize: 14
            }}>
              Email
            </label>
            <input
              className="form-input"
              type="email"
              placeholder="Nhập email của bạn"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div style={{ marginBottom: 20 }}>
            <label style={{ 
              display: 'block', 
              marginBottom: 8,
              color: '#d4af37',
              fontWeight: 600,
              fontSize: 14
            }}>
              Mật khẩu
            </label>
            <input
              className="form-input"
              type="password"
              placeholder="Nhập mật khẩu"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 25
          }}>
            <label style={{ 
              display: 'flex', 
              alignItems: 'center',
              color: 'rgba(255, 255, 255, 0.7)',
              fontSize: 14,
              cursor: 'pointer'
            }}>
              <input 
                type="checkbox" 
                style={{ marginRight: 8 }}
              />
              Ghi nhớ đăng nhập
            </label>
            <a 
              href="#"
              onClick={(e) => {
                e.preventDefault();
                alert('Chức năng quên mật khẩu đang được phát triển!');
              }}
              style={{ 
                color: '#d4af37',
                textDecoration: 'none',
                fontSize: 14,
                fontWeight: 600
              }}
            >
              Quên mật khẩu?
            </a>
          </div>

          <button
            className="btn btn-primary"
            type="submit"
            disabled={loading}
            style={{ 
              width: '100%', 
              padding: 14,
              fontSize: 16,
              fontWeight: 700,
              marginBottom: 20
            }}
          >
            {loading ? "Đang đăng nhập..." : "Đăng nhập"}
          </button>

          {message && (
            <div style={{ 
              padding: 12,
              borderRadius: 6,
              marginBottom: 20,
              background: message.includes('✅') 
                ? 'rgba(74, 222, 128, 0.1)' 
                : 'rgba(239, 68, 68, 0.1)',
              border: `1px solid ${message.includes('✅') ? '#4ade80' : '#ef4444'}`,
              color: message.includes('✅') ? '#4ade80' : '#ef4444',
              textAlign: 'center',
              fontWeight: 600
            }}>
              {message}
            </div>
          )}

          <div style={{
            textAlign: 'center',
            paddingTop: 20,
            borderTop: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
            <span style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: 14 }}>
              Chưa có tài khoản?{' '}
            </span>
            <button
              type="button"
              onClick={() => navigate('/register')}
              style={{
                background: 'none',
                border: 'none',
                color: '#d4af37',
                fontWeight: 700,
                fontSize: 14,
                cursor: 'pointer',
                textDecoration: 'underline'
              }}
            >
              Đăng ký ngay
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
