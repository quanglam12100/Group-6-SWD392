import { useState, useEffect } from "react";
import { productsApi } from "../../api/products.api";
import { categoriesApi } from "../../api/categories.api";
import { productVariantsApi } from "../../api/productVariants.api";
import { toppingsApi } from "../../api/toppings.api";
import { useCartStore } from "../../store/cartStore";
import { formatPrice } from "../../utils/formatPrice";
import "../PageStyles.css";

export default function Menu() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [variants, setVariants] = useState([]);
  const [toppings, setToppings] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [selectedToppings, setSelectedToppings] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const addToCart = useCartStore((state) => state.addToCart);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [productsData, categoriesData, toppingsData] = await Promise.all([
        productsApi.getAll(),
        categoriesApi.getAll(),
        toppingsApi.getAll(),
      ]);

      setProducts(productsData);
      setCategories(categoriesData);
      setToppings(toppingsData);
      setLoading(false);
    } catch (error) {
      console.error("Lỗi khi tải dữ liệu:", error);
      setLoading(false);
    }
  };

  const openProductModal = async (product) => {
    setSelectedProduct(product);
    setQuantity(1);
    setSelectedToppings([]);
    
    try {
      const variantsData = await productVariantsApi.getByProduct(product.product_id);
      setVariants(variantsData);
      setSelectedVariant(variantsData[0] || null);
      setShowModal(true);
    } catch (error) {
      console.error("Lỗi khi tải variants:", error);
      setVariants([]);
      setShowModal(true);
    }
  };

  const handleAddToCart = () => {
    if (!selectedProduct) return;

    const cartItem = {
      product_id: selectedProduct.product_id,
      product_name: selectedProduct.product_name,
      variant_id: selectedVariant?.variant_id,
      variant_name: selectedVariant?.variant_name,
      price: selectedVariant?.price || selectedProduct.base_price,
      quantity: quantity,
      toppings: selectedToppings,
    };

    addToCart(cartItem);
    setShowModal(false);
    alert("Đã thêm vào giỏ hàng!");
  };

  const toggleTopping = (topping) => {
    if (selectedToppings.find((t) => t.topping_id === topping.topping_id)) {
      setSelectedToppings(selectedToppings.filter((t) => t.topping_id !== topping.topping_id));
    } else {
      setSelectedToppings([...selectedToppings, topping]);
    }
  };

  const filteredProducts =
    selectedCategory === "all"
      ? products
      : products.filter((p) => p.category_id === parseInt(selectedCategory));

  const calculateTotal = () => {
    const basePrice = selectedVariant?.price || selectedProduct?.base_price || 0;
    const toppingsPrice = selectedToppings.reduce((sum, t) => sum + (t.price || 0), 0);
    return (basePrice + toppingsPrice) * quantity;
  };

  if (loading) {
    return (
      <div className="page-container">
        <div style={{ textAlign: "center", color: "#d4af37", padding: "50px" }}>
          Đang tải menu...
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <h1 className="page-title">Menu Nhà Hàng</h1>

      {/* Category Filter */}
      <div style={{ marginBottom: 30, display: "flex", gap: 10, flexWrap: "wrap" }}>
        <button
          className={`btn ${selectedCategory === "all" ? "btn-primary" : "btn-secondary"}`}
          onClick={() => setSelectedCategory("all")}
        >
          Tất cả
        </button>
        {categories.map((cat) => (
          <button
            key={cat.category_id}
            className={`btn ${selectedCategory === cat.category_id ? "btn-primary" : "btn-secondary"}`}
            onClick={() => setSelectedCategory(cat.category_id)}
          >
            {cat.category_name}
          </button>
        ))}
      </div>

      {/* Products Grid */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
        gap: 20,
      }}>
        {filteredProducts.map((product) => (
          <div
            key={product.product_id}
            className="card"
            style={{ cursor: "pointer" }}
            onClick={() => openProductModal(product)}
          >
            {product.image_url && (
              <img
                src={product.image_url}
                alt={product.product_name}
                style={{
                  width: "100%",
                  height: 200,
                  objectFit: "cover",
                  borderRadius: "8px 8px 0 0",
                }}
              />
            )}
            <div style={{ padding: 15 }}>
              <h3 style={{ color: "#d4af37", marginBottom: 10 }}>{product.product_name}</h3>
              <p style={{ color: "#ccc", fontSize: 14, marginBottom: 10 }}>
                {product.description}
              </p>
              <p style={{ color: "#4ade80", fontWeight: "bold" }}>
                Từ {formatPrice(product.base_price)}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Product Modal */}
      {showModal && selectedProduct && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0, 0, 0, 0.8)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
            padding: 20,
          }}
          onClick={() => setShowModal(false)}
        >
          <div
            className="card"
            style={{ maxWidth: 600, width: "100%", maxHeight: "90vh", overflow: "auto" }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 style={{ color: "#d4af37", marginBottom: 20 }}>{selectedProduct.product_name}</h2>
            <p style={{ color: "#ccc", marginBottom: 20 }}>{selectedProduct.description}</p>

            {/* Variants */}
            {variants.length > 0 && (
              <div style={{ marginBottom: 20 }}>
                <h3 style={{ color: "#d4af37", marginBottom: 10 }}>Chọn size:</h3>
                {variants.map((variant) => (
                  <button
                    key={variant.variant_id}
                    className={`btn ${
                      selectedVariant?.variant_id === variant.variant_id ? "btn-primary" : "btn-secondary"
                    }`}
                    style={{ marginRight: 10, marginBottom: 10 }}
                    onClick={() => setSelectedVariant(variant)}
                  >
                    {variant.variant_name} - {formatPrice(variant.price)}
                  </button>
                ))}
              </div>
            )}

            {/* Toppings */}
            {toppings.length > 0 && (
              <div style={{ marginBottom: 20 }}>
                <h3 style={{ color: "#d4af37", marginBottom: 10 }}>Topping:</h3>
                {toppings.map((topping) => (
                  <label
                    key={topping.topping_id}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      marginBottom: 10,
                      cursor: "pointer",
                      color: "#fff",
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={selectedToppings.some((t) => t.topping_id === topping.topping_id)}
                      onChange={() => toggleTopping(topping)}
                      style={{ marginRight: 10 }}
                    />
                    {topping.topping_name} (+{formatPrice(topping.price)})
                  </label>
                ))}
              </div>
            )}

            {/* Quantity */}
            <div style={{ marginBottom: 20 }}>
              <h3 style={{ color: "#d4af37", marginBottom: 10 }}>Số lượng:</h3>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <button
                  className="btn btn-secondary"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                >
                  -
                </button>
                <span style={{ fontSize: 18, fontWeight: "bold", minWidth: 40, textAlign: "center" }}>
                  {quantity}
                </span>
                <button className="btn btn-secondary" onClick={() => setQuantity(quantity + 1)}>
                  +
                </button>
              </div>
            </div>

            {/* Total */}
            <div style={{ marginBottom: 20, fontSize: 20, fontWeight: "bold", color: "#4ade80" }}>
              Tổng: {formatPrice(calculateTotal())}
            </div>

            {/* Actions */}
            <div style={{ display: "flex", gap: 10 }}>
              <button className="btn btn-primary" style={{ flex: 1 }} onClick={handleAddToCart}>
                Thêm vào giỏ
              </button>
              <button className="btn btn-secondary" onClick={() => setShowModal(false)}>
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
