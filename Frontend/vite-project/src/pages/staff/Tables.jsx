import React, { useState, useEffect } from "react";

export default function StaffTables() {
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTables();
  }, []);

  const loadTables = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("https://localhost:7031/api/tables", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        const data = await response.json();
        setTables(data);
      }
    } catch (error) {
      console.error("Error loading tables:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateTableStatus = async (tableId, newStatus) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const response = await fetch(`https://localhost:7031/api/tables/${tableId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        loadTables(); // Reload tables
      }
    } catch (error) {
      console.error("Error updating table:", error);
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "available":
      case "trống":
        return "#10b981";
      case "occupied":
      case "có khách":
        return "#ef4444";
      case "reserved":
      case "đặt trước":
        return "#f59e0b";
      case "cleaning":
      case "đang dọn":
        return "#3b82f6";
      default:
        return "#6b7280";
    }
  };

  const getStatusText = (status) => {
    switch (status?.toLowerCase()) {
      case "available":
        return "Trống";
      case "occupied":
        return "Có khách";
      case "reserved":
        return "Đặt trước";
      case "cleaning":
        return "Đang dọn";
      default:
        return status || "Không rõ";
    }
  };

  if (loading) {
    return (
      <div style={{ padding: "40px", color: "#fff", textAlign: "center" }}>
        <div style={{ fontSize: "18px" }}>Đang tải...</div>
      </div>
    );
  }

  return (
    <div style={{ padding: "30px", minHeight: "100vh" }}>
      {/* Header */}
      <div style={{ marginBottom: "30px" }}>
        <h1 style={{ color: "#f97316", fontSize: "32px", margin: 0, marginBottom: "10px" }}>
          🪑 Quản lý bàn
        </h1>
        <p style={{ color: "rgba(255, 255, 255, 0.6)", margin: 0 }}>
          Theo dõi và quản lý trạng thái các bàn trong nhà hàng
        </p>
      </div>

      {/* Statistics */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "20px",
          marginBottom: "30px",
        }}
      >
        <div
          style={{
            background: "rgba(16, 185, 129, 0.1)",
            padding: "20px",
            borderRadius: "12px",
            border: "1px solid rgba(16, 185, 129, 0.3)",
          }}
        >
          <div style={{ color: "#10b981", fontSize: "32px", fontWeight: "bold" }}>
            {tables.filter((t) => t.status?.toLowerCase() === "available").length}
          </div>
          <div style={{ color: "rgba(255, 255, 255, 0.7)", marginTop: "8px" }}>Bàn trống</div>
        </div>
        <div
          style={{
            background: "rgba(239, 68, 68, 0.1)",
            padding: "20px",
            borderRadius: "12px",
            border: "1px solid rgba(239, 68, 68, 0.3)",
          }}
        >
          <div style={{ color: "#ef4444", fontSize: "32px", fontWeight: "bold" }}>
            {tables.filter((t) => t.status?.toLowerCase() === "occupied").length}
          </div>
          <div style={{ color: "rgba(255, 255, 255, 0.7)", marginTop: "8px" }}>Có khách</div>
        </div>
        <div
          style={{
            background: "rgba(245, 158, 11, 0.1)",
            padding: "20px",
            borderRadius: "12px",
            border: "1px solid rgba(245, 158, 11, 0.3)",
          }}
        >
          <div style={{ color: "#f59e0b", fontSize: "32px", fontWeight: "bold" }}>
            {tables.filter((t) => t.status?.toLowerCase() === "reserved").length}
          </div>
          <div style={{ color: "rgba(255, 255, 255, 0.7)", marginTop: "8px" }}>Đặt trước</div>
        </div>
        <div
          style={{
            background: "rgba(249, 115, 22, 0.1)",
            padding: "20px",
            borderRadius: "12px",
            border: "1px solid rgba(249, 115, 22, 0.3)",
          }}
        >
          <div style={{ color: "#f97316", fontSize: "32px", fontWeight: "bold" }}>{tables.length}</div>
          <div style={{ color: "rgba(255, 255, 255, 0.7)", marginTop: "8px" }}>Tổng bàn</div>
        </div>
      </div>

      {/* Tables Grid */}
      {tables.length === 0 ? (
        <div
          style={{
            background: "rgba(255, 255, 255, 0.03)",
            padding: "40px",
            borderRadius: "12px",
            textAlign: "center",
            color: "rgba(255, 255, 255, 0.6)",
          }}
        >
          <div style={{ fontSize: "48px", marginBottom: "10px" }}>🪑</div>
          <div style={{ fontSize: "18px" }}>Chưa có bàn nào</div>
          <div style={{ fontSize: "14px", marginTop: "8px" }}>
            Hệ thống chưa có dữ liệu bàn. Vui lòng liên hệ quản lý để thêm bàn.
          </div>
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
            gap: "20px",
          }}
        >
          {tables.map((table) => (
            <div
              key={table.id}
              style={{
                background: "rgba(255, 255, 255, 0.03)",
                padding: "20px",
                borderRadius: "12px",
                border: `2px solid ${getStatusColor(table.status)}`,
                transition: "all 0.3s ease",
                cursor: "pointer",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-5px)";
                e.currentTarget.style.background = "rgba(255, 255, 255, 0.06)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.background = "rgba(255, 255, 255, 0.03)";
              }}
            >
              {/* Table Number */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: "15px",
                }}
              >
                <div style={{ fontSize: "24px", fontWeight: "bold", color: "#fff" }}>
                  Bàn {table.tableNumber || table.id}
                </div>
                <div
                  style={{
                    background: `${getStatusColor(table.status)}22`,
                    padding: "4px 12px",
                    borderRadius: "20px",
                    fontSize: "12px",
                    color: getStatusColor(table.status),
                    fontWeight: "600",
                  }}
                >
                  {getStatusText(table.status)}
                </div>
              </div>

              {/* Table Info */}
              <div style={{ color: "rgba(255, 255, 255, 0.6)", fontSize: "14px", marginBottom: "15px" }}>
                <div>Sức chứa: {table.capacity || 4} người</div>
                {table.location && <div>Vị trí: {table.location}</div>}
              </div>

              {/* Action Buttons */}
              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                {table.status?.toLowerCase() === "available" && (
                  <button
                    onClick={() => updateTableStatus(table.id, "Occupied")}
                    style={{
                      flex: 1,
                      padding: "8px 12px",
                      background: "#ef4444",
                      color: "#fff",
                      border: "none",
                      borderRadius: "6px",
                      cursor: "pointer",
                      fontSize: "12px",
                      fontWeight: "600",
                    }}
                  >
                    Có khách
                  </button>
                )}
                {table.status?.toLowerCase() === "occupied" && (
                  <>
                    <button
                      onClick={() => updateTableStatus(table.id, "Cleaning")}
                      style={{
                        flex: 1,
                        padding: "8px 12px",
                        background: "#3b82f6",
                        color: "#fff",
                        border: "none",
                        borderRadius: "6px",
                        cursor: "pointer",
                        fontSize: "12px",
                        fontWeight: "600",
                      }}
                    >
                      Dọn bàn
                    </button>
                  </>
                )}
                {table.status?.toLowerCase() === "cleaning" && (
                  <button
                    onClick={() => updateTableStatus(table.id, "Available")}
                    style={{
                      flex: 1,
                      padding: "8px 12px",
                      background: "#10b981",
                      color: "#fff",
                      border: "none",
                      borderRadius: "6px",
                      cursor: "pointer",
                      fontSize: "12px",
                      fontWeight: "600",
                    }}
                  >
                    Sẵn sàng
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
