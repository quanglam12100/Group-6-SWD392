import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
import { USER_ROLES } from "../../utils/constants";
import "../PageStyles.css";

function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fullname, setFullname] = useState("");
  const [role, setRole] = useState("Staff");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const register = useAuthStore((state) => state.register);

  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setMessage("");

    // Validate username (alphanumeric + underscore only)
    const usernameRegex = /^[a-zA-Z0-9_]+$/;
    if (!usernameRegex.test(username)) {
      setMessage("❌ Username chỉ được chứa chữ cái, số và dấu gạch dưới (_)!");
      return;
    }

    if (username.length < 3) {
      setMessage("❌ Username phải có ít nhất 3 ký tự!");
      return;
    }

    // Validate password match
    if (password !== confirmPassword) {
      setMessage("❌ Mật khẩu xác nhận không khớp!");
      return;
    }

    if (password.length < 6) {
      setMessage("❌ Mật khẩu phải có ít nhất 6 ký tự!");
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
      setMessage("✅ Đăng ký thành công! Đang chuyển sang đăng nhập...");
      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } else {
      setMessage(`❌ ${result.error}`);
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
        maxWidth: 500,
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
            Đăng ký
          </h2>
          <p style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: 14 }}>
            Tạo tài khoản mới để bắt đầu
          </p>
        </div>

        <form onSubmit={handleRegister}>
          <div style={{ marginBottom: 20 }}>
            <label style={{ 
              display: 'block', 
              marginBottom: 8,
              color: '#d4af37',
              fontWeight: 600,
              fontSize: 14
            }}>
              Username
            </label>
            <input
              className="form-input"
              placeholder="Chỉ chữ cái, số và dấu _ (vd: user123)"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              disabled={loading}
            />
            <small style={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: 12, marginTop: 4, display: 'block' }}>
              Chỉ được chứa chữ cái, số và dấu gạch dưới (_)
            </small>
          </div>

          <div style={{ marginBottom: 20 }}>
            <label style={{ 
              display: 'block', 
              marginBottom: 8,
              color: '#d4af37',
              fontWeight: 600,
              fontSize: 14
            }}>
              Họ và tên
            </label>
            <input
              className="form-input"
              placeholder="Nhập họ và tên đầy đủ"
              value={fullname}
              onChange={(e) => setFullname(e.target.value)}
              required
              disabled={loading}
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
              placeholder="Nhập mật khẩu (tối thiểu 6 ký tự)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
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
              Xác nhận mật khẩu
            </label>
            <input
              className="form-input"
              type="password"
              placeholder="Nhập lại mật khẩu"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <div style={{ marginBottom: 25 }}>
            <label style={{ 
              display: 'block', 
              marginBottom: 8,
              color: '#d4af37',
              fontWeight: 600,
              fontSize: 14
            }}>
              Vai trò
            </label>
            <select
              className="form-select"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              disabled={loading}
            >
              <option value={USER_ROLES.STAFF}>Nhân viên</option>
              <option value={USER_ROLES.MANAGER}>Quản lý</option>
              <option value={USER_ROLES.CHEF}>Đầu bếp</option>
              <option value={USER_ROLES.ADMIN}>Quản trị viên</option>
            </select>
          </div>

          <button
            className="btn btn-success"
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
            {loading ? "Đang đăng ký..." : "Đăng ký"}
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
              Đã có tài khoản?{' '}
            </span>
            <button
              type="button"
              onClick={() => navigate('/login')}
              style={{
                background: 'none',
                border: 'none',
                color: '#d4af37',
                fontWeight: 700,
                fontSize: 14,
                cursor: 'pointer',
                textDecoration: 'underline'
              }}
              disabled={loading}
            >
              Đăng nhập ngay
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Register;
