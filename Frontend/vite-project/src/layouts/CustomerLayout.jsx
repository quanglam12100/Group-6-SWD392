import { Outlet, Link, useLocation } from "react-router-dom";

const CustomerLayout = () => {
  const location = useLocation();

  const menuItems = [
    { path: "/customer", label: "🏠 Trang chủ", icon: "🏠" },
    { path: "/customer/menu", label: "📖 Thực đơn", icon: "📖" },
    { path: "/customer/order", label: "🛒 Đặt món", icon: "🛒" },
    { path: "/customer/my-orders", label: "📋 Đơn của tôi", icon: "📋" },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh", background: "#f0fdf4" }}>
      {/* Top Navigation Bar */}
      <nav
        style={{
          background: "linear-gradient(90deg, #10b981 0%, #059669 100%)",
          padding: "0 40px",
          boxShadow: "0 4px 20px rgba(16, 185, 129, 0.3)",
          position: "sticky",
          top: 0,
          zIndex: 1000,
        }}
      >
        <div
          style={{
            maxWidth: "1400px",
            margin: "0 auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            height: "80px",
          }}
        >
          {/* Logo */}
          <Link
            to="/customer"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "15px",
              textDecoration: "none",
              color: "white",
            }}
          >
            <div style={{ fontSize: "48px" }}>🍽️</div>
            <div>
              <h1 style={{ margin: 0, fontSize: "28px", fontWeight: "700" }}>
                SmartRestaurant
              </h1>
              <p style={{ margin: 0, fontSize: "13px", opacity: 0.9 }}>
                Nhà hàng thông minh
              </p>
            </div>
          </Link>

          {/* Menu Links */}
          <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                style={{
                  display: "flex",
                  alignItems: "center",
                  padding: "12px 24px",
                  borderRadius: "12px",
                  textDecoration: "none",
                  color: "white",
                  fontSize: "16px",
                  fontWeight: isActive(item.path) ? "700" : "500",
                  background: isActive(item.path)
                    ? "rgba(255,255,255,0.25)"
                    : "transparent",
                  border: isActive(item.path)
                    ? "2px solid rgba(255,255,255,0.4)"
                    : "2px solid transparent",
                  transition: "all 0.3s ease",
                }}
                onMouseEnter={(e) => {
                  if (!isActive(item.path)) {
                    e.currentTarget.style.background = "rgba(255,255,255,0.15)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive(item.path)) {
                    e.currentTarget.style.background = "transparent";
                  }
                }}
              >
                <span style={{ marginRight: "8px", fontSize: "20px" }}>{item.icon}</span>
                {item.label.split(" ").slice(1).join(" ")}
              </Link>
            ))}
          </div>

          {/* Login Button */}
          <Link
            to="/login"
            style={{
              padding: "12px 24px",
              background: "rgba(255,255,255,0.2)",
              border: "2px solid rgba(255,255,255,0.4)",
              borderRadius: "12px",
              color: "white",
              textDecoration: "none",
              fontSize: "15px",
              fontWeight: "600",
              transition: "all 0.3s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(255,255,255,0.3)";
              e.currentTarget.style.borderColor = "rgba(255,255,255,0.6)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(255,255,255,0.2)";
              e.currentTarget.style.borderColor = "rgba(255,255,255,0.4)";
            }}
          >
            🔑 Đăng nhập nhân viên
          </Link>
        </div>
      </nav>

      {/* Main Content */}
      <div style={{ flex: 1 }}>
        <Outlet />
      </div>

      {/* Footer */}
      <footer
        style={{
          background: "#059669",
          color: "white",
          padding: "40px",
          marginTop: "60px",
        }}
      >
        <div
          style={{
            maxWidth: "1400px",
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "40px",
          }}
        >
          <div>
            <h3 style={{ fontSize: "20px", marginBottom: "15px" }}>
              🍽️ SmartRestaurant
            </h3>
            <p style={{ opacity: 0.9, lineHeight: "1.6" }}>
              Hệ thống nhà hàng thông minh, mang đến trải nghiệm ẩm thực tuyệt vời
              với công nghệ hiện đại.
            </p>
          </div>
          <div>
            <h4 style={{ fontSize: "18px", marginBottom: "15px" }}>Liên hệ</h4>
            <p style={{ opacity: 0.9, lineHeight: "1.8", margin: "5px 0" }}>
              📍 123 Đường ABC, Quận 1, TP.HCM
            </p>
            <p style={{ opacity: 0.9, lineHeight: "1.8", margin: "5px 0" }}>
              📞 0123 456 789
            </p>
            <p style={{ opacity: 0.9, lineHeight: "1.8", margin: "5px 0" }}>
              ✉️ info@smartrestaurant.vn
            </p>
          </div>
          <div>
            <h4 style={{ fontSize: "18px", marginBottom: "15px" }}>Giờ mở cửa</h4>
            <p style={{ opacity: 0.9, lineHeight: "1.8", margin: "5px 0" }}>
              🕐 Thứ 2 - Thứ 6: 10:00 - 22:00
            </p>
            <p style={{ opacity: 0.9, lineHeight: "1.8", margin: "5px 0" }}>
              🕐 Thứ 7 - CN: 09:00 - 23:00
            </p>
          </div>
        </div>
        <div
          style={{
            maxWidth: "1400px",
            margin: "30px auto 0",
            paddingTop: "20px",
            borderTop: "1px solid rgba(255,255,255,0.3)",
            textAlign: "center",
            opacity: 0.8,
          }}
        >
          © 2026 SmartRestaurant. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default CustomerLayout;
