import { Link } from "react-router-dom";

const CustomerDashboard = () => {
  const features = [
    {
      icon: "📖",
      title: "Xem thực đơn",
      description: "Khám phá các món ăn ngon với hình ảnh và giá cả chi tiết",
      link: "/customer/menu",
      color: "#f59e0b",
    },
    {
      icon: "🛒",
      title: "Đặt món",
      description: "Dễ dàng chọn món và đặt đơn hàng trực tuyến",
      link: "/customer/order",
      color: "#10b981",
    },
    {
      icon: "📋",
      title: "Theo dõi đơn hàng",
      description: "Kiểm tra trạng thái đơn hàng của bạn realtime",
      link: "/customer/my-orders",
      color: "#3b82f6",
    },
  ];

  const popularDishes = [
    {
      name: "Phở bò đặc biệt",
      price: "65,000đ",
      image: "🍜",
      rating: "⭐⭐⭐⭐⭐",
    },
    {
      name: "Cơm tấm sườn nướng",
      price: "55,000đ",
      image: "🍚",
      rating: "⭐⭐⭐⭐⭐",
    },
    {
      name: "Bún chả Hà Nội",
      price: "50,000đ",
      image: "🍲",
      rating: "⭐⭐⭐⭐",
    },
    {
      name: "Gỏi cuốn tôm thịt",
      price: "35,000đ",
      image: "🥗",
      rating: "⭐⭐⭐⭐⭐",
    },
  ];

  return (
    <div style={{ background: "#f0fdf4" }}>
      {/* Hero Section */}
      <div
        style={{
          background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
          padding: "80px 40px",
          textAlign: "center",
          color: "white",
        }}
      >
        <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
          <div style={{ fontSize: "80px", marginBottom: "20px" }}>🍽️</div>
          <h1
            style={{
              fontSize: "56px",
              fontWeight: "700",
              marginBottom: "20px",
              textShadow: "2px 2px 4px rgba(0,0,0,0.2)",
            }}
          >
            Chào mừng đến SmartRestaurant
          </h1>
          <p
            style={{
              fontSize: "24px",
              marginBottom: "40px",
              opacity: 0.95,
              maxWidth: "800px",
              margin: "0 auto 40px",
              lineHeight: "1.6",
            }}
          >
            Trải nghiệm ẩm thực Việt Nam đặc sắc với hệ thống đặt món thông minh
          </p>
          <Link
            to="/customer/menu"
            style={{
              display: "inline-block",
              padding: "18px 48px",
              background: "white",
              color: "#10b981",
              textDecoration: "none",
              borderRadius: "16px",
              fontSize: "20px",
              fontWeight: "700",
              transition: "all 0.3s ease",
              border: "3px solid white",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-5px)";
              e.currentTarget.style.boxShadow = "0 15px 40px rgba(0,0,0,0.3)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            📖 Xem thực đơn ngay
          </Link>
        </div>
      </div>

      {/* Features Section */}
      <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "80px 40px" }}>
        <h2
          style={{
            fontSize: "42px",
            fontWeight: "700",
            textAlign: "center",
            marginBottom: "60px",
            color: "#059669",
          }}
        >
          ✨ Tính năng nổi bật
        </h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: "30px",
            marginBottom: "80px",
          }}
        >
          {features.map((feature, index) => (
            <Link
              key={index}
              to={feature.link}
              style={{
                background: "white",
                padding: "40px",
                borderRadius: "20px",
                textAlign: "center",
                textDecoration: "none",
                color: "#1a1a1a",
                border: `3px solid ${feature.color}`,
                transition: "all 0.3s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-10px)";
                e.currentTarget.style.boxShadow = `0 20px 60px ${feature.color}40`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              <div
                style={{
                  fontSize: "80px",
                  marginBottom: "20px",
                }}
              >
                {feature.icon}
              </div>
              <h3
                style={{
                  fontSize: "28px",
                  fontWeight: "700",
                  marginBottom: "15px",
                  color: feature.color,
                }}
              >
                {feature.title}
              </h3>
              <p
                style={{
                  fontSize: "16px",
                  color: "#666",
                  lineHeight: "1.6",
                }}
              >
                {feature.description}
              </p>
            </Link>
          ))}
        </div>

        {/* Popular Dishes */}
        <h2
          style={{
            fontSize: "42px",
            fontWeight: "700",
            textAlign: "center",
            marginBottom: "60px",
            color: "#059669",
          }}
        >
          🔥 Món ăn phổ biến
        </h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "30px",
            marginBottom: "80px",
          }}
        >
          {popularDishes.map((dish, index) => (
            <div
              key={index}
              style={{
                background: "white",
                borderRadius: "20px",
                overflow: "hidden",
                border: "3px solid #10b981",
                transition: "all 0.3s ease",
                cursor: "pointer",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "scale(1.05)";
                e.currentTarget.style.boxShadow = "0 15px 40px rgba(16, 185, 129, 0.3)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              <div
                style={{
                  background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                  padding: "60px",
                  textAlign: "center",
                  fontSize: "100px",
                }}
              >
                {dish.image}
              </div>
              <div style={{ padding: "25px" }}>
                <h3
                  style={{
                    fontSize: "22px",
                    fontWeight: "700",
                    marginBottom: "10px",
                    color: "#1a1a1a",
                  }}
                >
                  {dish.name}
                </h3>
                <div
                  style={{
                    fontSize: "16px",
                    marginBottom: "10px",
                  }}
                >
                  {dish.rating}
                </div>
                <div
                  style={{
                    fontSize: "24px",
                    fontWeight: "700",
                    color: "#10b981",
                  }}
                >
                  {dish.price}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div
          style={{
            background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
            padding: "60px 40px",
            borderRadius: "24px",
            textAlign: "center",
            color: "white",
          }}
        >
          <h2
            style={{
              fontSize: "38px",
              fontWeight: "700",
              marginBottom: "20px",
            }}
          >
            🎉 Sẵn sàng đặt món?
          </h2>
          <p
            style={{
              fontSize: "20px",
              marginBottom: "30px",
              opacity: 0.95,
            }}
          >
            Bắt đầu đặt món ngay hôm nay và thưởng thức bữa ăn tuyệt vời!
          </p>
          <Link
            to="/customer/order"
            style={{
              display: "inline-block",
              padding: "16px 40px",
              background: "white",
              color: "#10b981",
              textDecoration: "none",
              borderRadius: "14px",
              fontSize: "18px",
              fontWeight: "700",
              transition: "all 0.3s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "scale(1.1)";
              e.currentTarget.style.boxShadow = "0 10px 30px rgba(0,0,0,0.3)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "scale(1)";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            🛒 Đặt món ngay
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CustomerDashboard;
