import { Outlet, Link, Navigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

const KitchenLayout = () => {
  const { user, token, logout } = useAuthStore();
  const location = useLocation();

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  const userRole = user?.role?.toLowerCase();
  if (userRole !== "chef" && userRole !== "kitchen") {
    // Redirect to appropriate dashboard based on role
    if (userRole === "admin") return <Navigate to="/admin" replace />;
    if (userRole === "manager") return <Navigate to="/manager" replace />;
    if (userRole === "staff") return <Navigate to="/staff" replace />;
    if (userRole === "customer") return <Navigate to="/customer" replace />;
    return <Navigate to="/login" replace />;
  }

  const menuItems = [
    { path: "/kitchen", label: "📊 Dashboard", icon: "📊" },
    { path: "/kitchen/orders", label: "🍳 Đơn hàng", icon: "🍳" },
    { path: "/kitchen/preparing", label: "⏱️ Đang nấu", icon: "⏱️" },
    { path: "/kitchen/ready", label: "✅ Đã xong", icon: "✅" },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div style={{ display: "flex", height: "100vh", background: "#1a1a1a" }}>
      {/* Sidebar */}
      <div
        style={{
          width: "280px",
          background: "linear-gradient(180deg, #dc2626 0%, #991b1b 100%)",
          color: "white",
          display: "flex",
          flexDirection: "column",
          boxShadow: "4px 0 20px rgba(220, 38, 38, 0.3)",
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: "30px 20px",
            borderBottom: "2px solid rgba(255,255,255,0.2)",
            textAlign: "center",
          }}
        >
          <div style={{ fontSize: "48px", marginBottom: "10px" }}>👨‍🍳</div>
          <h2 style={{ margin: "0 0 5px 0", fontSize: "24px", fontWeight: "700" }}>
            Bếp
          </h2>
          <p style={{ margin: 0, opacity: 0.9, fontSize: "14px" }}>
            Kitchen Management
          </p>
        </div>

        {/* User Info */}
        <div
          style={{
            padding: "20px",
            borderBottom: "2px solid rgba(255,255,255,0.2)",
            background: "rgba(0,0,0,0.2)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div
              style={{
                width: "45px",
                height: "45px",
                borderRadius: "50%",
                background: "rgba(255,255,255,0.2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "20px",
                border: "2px solid rgba(255,255,255,0.3)",
              }}
            >
              👨‍🍳
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: "600", fontSize: "15px" }}>
                {user?.username || "Chef"}
              </div>
              <div style={{ fontSize: "12px", opacity: 0.8 }}>
                Đầu bếp
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav style={{ flex: 1, padding: "20px 15px", overflowY: "auto" }}>
          <div style={{ marginBottom: "25px" }}>
            <div
              style={{
                fontSize: "11px",
                fontWeight: "700",
                opacity: 0.7,
                marginBottom: "12px",
                paddingLeft: "10px",
                letterSpacing: "1px",
              }}
            >
              CHỨC NĂNG CHÍNH
            </div>
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                style={{
                  display: "flex",
                  alignItems: "center",
                  padding: "14px 16px",
                  marginBottom: "8px",
                  borderRadius: "12px",
                  textDecoration: "none",
                  color: "white",
                  transition: "all 0.3s ease",
                  background: isActive(item.path)
                    ? "rgba(255,255,255,0.25)"
                    : "transparent",
                  fontWeight: isActive(item.path) ? "600" : "500",
                  border: isActive(item.path)
                    ? "2px solid rgba(255,255,255,0.4)"
                    : "2px solid transparent",
                  fontSize: "15px",
                }}
                onMouseEnter={(e) => {
                  if (!isActive(item.path)) {
                    e.currentTarget.style.background = "rgba(255,255,255,0.15)";
                    e.currentTarget.style.transform = "translateX(5px)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive(item.path)) {
                    e.currentTarget.style.background = "transparent";
                    e.currentTarget.style.transform = "translateX(0)";
                  }
                }}
              >
                <span style={{ marginRight: "12px", fontSize: "20px" }}>
                  {item.icon}
                </span>
                {item.label.split(" ").slice(1).join(" ")}
              </Link>
            ))}
          </div>
        </nav>

        {/* Logout Button */}
        <div style={{ padding: "20px", borderTop: "2px solid rgba(255,255,255,0.2)" }}>
          <button
            onClick={logout}
            style={{
              width: "100%",
              padding: "14px",
              background: "rgba(0,0,0,0.3)",
              border: "2px solid rgba(255,255,255,0.3)",
              borderRadius: "12px",
              color: "white",
              fontSize: "15px",
              fontWeight: "600",
              cursor: "pointer",
              transition: "all 0.3s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(255,255,255,0.2)";
              e.currentTarget.style.borderColor = "rgba(255,255,255,0.5)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(0,0,0,0.3)";
              e.currentTarget.style.borderColor = "rgba(255,255,255,0.3)";
            }}
          >
            🚪 Đăng xuất
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, overflow: "auto" }}>
        <Outlet />
      </div>
    </div>
  );
};

export default KitchenLayout;
