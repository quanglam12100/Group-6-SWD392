import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function StaffCreateOrder() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [tables, setTables] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedTable, setSelectedTable] = useState("");
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [customerName, setCustomerName] = useState("");
  const [note, setNote] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const headers = { Authorization: `Bearer ${token}` };

      const [productsRes, categoriesRes, tablesRes] = await Promise.all([
        fetch("https://localhost:7031/api/products", { headers }).catch(() => ({ ok: false })),
        fetch("https://localhost:7031/api/categories", { headers }).catch(() => ({ ok: false })),
        fetch("https://localhost:7031/api/tables", { headers }).catch(() => ({ ok: false })),
      ]);

      if (productsRes.ok) {
        const data = await productsRes.json();
        setProducts(data);
      }

      if (categoriesRes.ok) {
        const data = await categoriesRes.json();
        setCategories(data);
      }

      if (tablesRes.ok) {
        const data = await tablesRes.json();
        setTables(data.filter((t) => t.status?.toLowerCase() === "available"));
      }
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = (product) => {
    const existingItem = cart.find((item) => item.id === product.id);

    if (existingItem) {
      setCart(cart.map((item) => (item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item)));
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      setCart(cart.filter((item) => item.id !== productId));
    } else {
      setCart(cart.map((item) => (item.id === productId ? { ...item, quantity: newQuantity } : item)));
    }
  };

  const calculateTotal = () => {
    return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  };

  const handleSubmitOrder = async () => {
    if (cart.length === 0) {
      alert("Vui lòng chọn ít nhất 1 món");
      return;
    }

    if (!selectedTable) {
      alert("Vui lòng chọn bàn");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const orderData = {
        tableId: parseInt(selectedTable),
        customerName: customerName || "Khách tại chỗ",
        items: cart.map((item) => ({
          productId: item.id,
          quantity: item.quantity,
          price: item.price,
        })),
        totalAmount: calculateTotal(),
        note: note,
        status: "Pending",
      };

      const response = await fetch("https://localhost:7031/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(orderData),
      });

      if (response.ok) {
        alert("Tạo đơn hàng thành công!");
        setCart([]);
        setSelectedTable("");
        setCustomerName("");
        setNote("");
        navigate("/staff/orders");
      } else {
        alert("Không thể tạo đơn hàng. Vui lòng thử lại.");
      }
    } catch (error) {
      console.error("Error creating order:", error);
      alert("Có lỗi xảy ra. Vui lòng thử lại.");
    }
  };

  const filteredProducts =
    selectedCategory === "all"
      ? products
      : products.filter((p) => p.categoryId === parseInt(selectedCategory));

  if (loading) {
    return (
      <div style={{ padding: "40px", color: "#fff", textAlign: "center" }}>
        <div style={{ fontSize: "18px" }}>Đang tải...</div>
      </div>
    );
  }

  return (
    <div style={{ padding: "30px", minHeight: "100vh", display: "flex", gap: "30px" }}>
      {/* Left: Product Selection */}
      <div style={{ flex: 2 }}>
        <h1 style={{ color: "#f97316", fontSize: "32px", margin: 0, marginBottom: "10px" }}>
          ➕ Tạo đơn hàng mới
        </h1>
        <p style={{ color: "rgba(255, 255, 255, 0.6)", margin: 0, marginBottom: "20px" }}>
          Chọn món ăn và tạo đơn cho khách hàng
        </p>

        {/* Category Filter */}
        <div style={{ marginBottom: "20px", display: "flex", gap: "10px", flexWrap: "wrap" }}>
          <button
            onClick={() => setSelectedCategory("all")}
            style={{
              padding: "10px 20px",
              background: selectedCategory === "all" ? "#f97316" : "rgba(255, 255, 255, 0.1)",
              color: "#fff",
              border: "1px solid rgba(249, 115, 22, 0.3)",
              borderRadius: "8px",
              cursor: "pointer",
              fontWeight: "600",
            }}
          >
            Tất cả
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id.toString())}
              style={{
                padding: "10px 20px",
                background: selectedCategory === cat.id.toString() ? "#f97316" : "rgba(255, 255, 255, 0.1)",
                color: "#fff",
                border: "1px solid rgba(249, 115, 22, 0.3)",
                borderRadius: "8px",
                cursor: "pointer",
                fontWeight: "600",
              }}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
            gap: "15px",
          }}
        >
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              onClick={() => addToCart(product)}
              style={{
                background: "rgba(255, 255, 255, 0.03)",
                padding: "15px",
                borderRadius: "12px",
                border: "1px solid rgba(249, 115, 22, 0.2)",
                cursor: "pointer",
                transition: "all 0.3s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-5px)";
                e.currentTarget.style.borderColor = "#f97316";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.borderColor = "rgba(249, 115, 22, 0.2)";
              }}
            >
              <div style={{ fontSize: "40px", textAlign: "center", marginBottom: "10px" }}>🍽️</div>
              <div style={{ color: "#fff", fontWeight: "600", marginBottom: "8px" }}>{product.name}</div>
              <div style={{ color: "#f97316", fontSize: "18px", fontWeight: "bold" }}>
                {product.price?.toLocaleString()}đ
              </div>
            </div>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div
            style={{
              background: "rgba(255, 255, 255, 0.03)",
              padding: "40px",
              borderRadius: "12px",
              textAlign: "center",
              color: "rgba(255, 255, 255, 0.6)",
            }}
          >
            <div style={{ fontSize: "48px", marginBottom: "10px" }}>🍽️</div>
            <div>Không có sản phẩm nào</div>
          </div>
        )}
      </div>

      {/* Right: Cart & Order Info */}
      <div style={{ flex: 1, minWidth: "350px" }}>
        <div
          style={{
            background: "rgba(255, 255, 255, 0.03)",
            padding: "20px",
            borderRadius: "12px",
            border: "1px solid rgba(249, 115, 22, 0.3)",
            position: "sticky",
            top: "20px",
          }}
        >
          <h3 style={{ color: "#f97316", margin: 0, marginBottom: "20px" }}>🛒 Đơn hàng</h3>

          {/* Table Selection */}
          <div style={{ marginBottom: "15px" }}>
            <label style={{ color: "rgba(255, 255, 255, 0.8)", display: "block", marginBottom: "8px" }}>
              Chọn bàn *
            </label>
            <select
              value={selectedTable}
              onChange={(e) => setSelectedTable(e.target.value)}
              style={{
                width: "100%",
                padding: "10px",
                background: "rgba(255, 255, 255, 0.05)",
                border: "1px solid rgba(249, 115, 22, 0.3)",
                borderRadius: "6px",
                color: "#fff",
              }}
            >
              <option value="">-- Chọn bàn --</option>
              {tables.map((table) => (
                <option key={table.id} value={table.id}>
                  Bàn {table.tableNumber || table.id}
                </option>
              ))}
            </select>
          </div>

          {/* Customer Name */}
          <div style={{ marginBottom: "15px" }}>
            <label style={{ color: "rgba(255, 255, 255, 0.8)", display: "block", marginBottom: "8px" }}>
              Tên khách hàng
            </label>
            <input
              type="text"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="Không bắt buộc"
              style={{
                width: "100%",
                padding: "10px",
                background: "rgba(255, 255, 255, 0.05)",
                border: "1px solid rgba(249, 115, 22, 0.3)",
                borderRadius: "6px",
                color: "#fff",
              }}
            />
          </div>

          {/* Cart Items */}
          <div style={{ marginBottom: "15px", maxHeight: "250px", overflowY: "auto" }}>
            {cart.length === 0 ? (
              <div style={{ textAlign: "center", padding: "20px", color: "rgba(255, 255, 255, 0.5)" }}>
                Chưa có món nào
              </div>
            ) : (
              cart.map((item) => (
                <div
                  key={item.id}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "10px 0",
                    borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <div style={{ color: "#fff", fontSize: "14px" }}>{item.name}</div>
                    <div style={{ color: "#f97316", fontSize: "12px" }}>{item.price?.toLocaleString()}đ</div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      style={{
                        width: "24px",
                        height: "24px",
                        background: "rgba(239, 68, 68, 0.2)",
                        border: "1px solid #ef4444",
                        borderRadius: "4px",
                        color: "#ef4444",
                        cursor: "pointer",
                      }}
                    >
                      -
                    </button>
                    <span style={{ color: "#fff", minWidth: "20px", textAlign: "center" }}>{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      style={{
                        width: "24px",
                        height: "24px",
                        background: "rgba(16, 185, 129, 0.2)",
                        border: "1px solid #10b981",
                        borderRadius: "4px",
                        color: "#10b981",
                        cursor: "pointer",
                      }}
                    >
                      +
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Note */}
          <div style={{ marginBottom: "15px" }}>
            <label style={{ color: "rgba(255, 255, 255, 0.8)", display: "block", marginBottom: "8px" }}>
              Ghi chú
            </label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Ghi chú đặc biệt..."
              rows={2}
              style={{
                width: "100%",
                padding: "10px",
                background: "rgba(255, 255, 255, 0.05)",
                border: "1px solid rgba(249, 115, 22, 0.3)",
                borderRadius: "6px",
                color: "#fff",
                resize: "none",
              }}
            />
          </div>

          {/* Total */}
          <div
            style={{
              padding: "15px 0",
              borderTop: "2px solid rgba(249, 115, 22, 0.3)",
              marginBottom: "15px",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
              <span style={{ color: "rgba(255, 255, 255, 0.8)" }}>Tổng món:</span>
              <span style={{ color: "#fff", fontWeight: "600" }}>
                {cart.reduce((sum, item) => sum + item.quantity, 0)}
              </span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: "rgba(255, 255, 255, 0.8)" }}>Tổng tiền:</span>
              <span style={{ color: "#f97316", fontSize: "20px", fontWeight: "bold" }}>
                {calculateTotal().toLocaleString()}đ
              </span>
            </div>
          </div>

          {/* Submit Button */}
          <button
            onClick={handleSubmitOrder}
            disabled={cart.length === 0 || !selectedTable}
            style={{
              width: "100%",
              padding: "12px",
              background: cart.length === 0 || !selectedTable ? "#666" : "#f97316",
              color: "#fff",
              border: "none",
              borderRadius: "8px",
              cursor: cart.length === 0 || !selectedTable ? "not-allowed" : "pointer",
              fontSize: "16px",
              fontWeight: "700",
            }}
          >
            Tạo đơn hàng
          </button>
        </div>
      </div>
    </div>
  );
}
