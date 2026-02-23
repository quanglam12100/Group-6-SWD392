import React from "react";

export default function Footer() {
  return (
    <footer style={{
      background: "#1a1a1a",
      borderTop: "1px solid rgba(255, 255, 255, 0.1)",
      padding: "30px 20px",
      textAlign: "center",
      color: "rgba(255, 255, 255, 0.6)"
    }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <p style={{ margin: "0 0 10px 0", fontSize: "14px" }}>
          © 2026 SmartRestaurant. All rights reserved.
        </p>
        <p style={{ margin: "0", fontSize: "12px" }}>
          SWD392 Group Project - Restaurant Management System
        </p>
      </div>
    </footer>
  );
}
