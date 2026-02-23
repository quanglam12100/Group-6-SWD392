import { useEffect, useState } from "react";import "./PageStyles.css";
const PRODUCT_API = "https://localhost:7031/api/products";
const CATEGORY_API = "https://localhost:7031/api/categories";

export default function ProductPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [editingId, setEditingId] = useState(null);

  const token = localStorage.getItem("token");

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  const loadProducts = async () => {
    const res = await fetch(PRODUCT_API, { headers });
    const data = await res.json();
    setProducts(data);
  };

  const loadCategories = async () => {
    const res = await fetch(CATEGORY_API, { headers });
    const data = await res.json();
    setCategories(data);
  };

  useEffect(() => {
    loadProducts();
    loadCategories();
  }, []);

  const resetForm = () => {
    setName("");
    setDescription("");
    setImageUrl("");
    setCategoryId("");
    setEditingId(null);
  };

  const createOrUpdate = async () => {
    const body = JSON.stringify({
      name,
      description,
      imageUrl,
      categoryId: Number(categoryId),
    });

    if (editingId) {
      await fetch(`${PRODUCT_API}/${editingId}`, {
        method: "PUT",
        headers,
        body,
      });
    } else {
      await fetch(PRODUCT_API, {
        method: "POST",
        headers,
        body,
      });
    }

    resetForm();
    loadProducts();
  };

  const deleteProduct = async (id) => {
    await fetch(`${PRODUCT_API}/${id}`, {
      method: "DELETE",
      headers,
    });
    loadProducts();
  };

  const editProduct = (p) => {
    setEditingId(p.id);
    setName(p.name);
    setDescription(p.description);
    setImageUrl(p.imageUrl);
    setCategoryId(p.categoryId);
  };

  return (
    <div className="page-container">
      <h2 className="page-title">Quản lý Sản phẩm</h2>

      <div className="form-container">
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Tên sản phẩm</label>
            <input
              className="form-input"
              placeholder="VD: Phở bò, Bún chả..."
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Danh mục</label>
            <select
              className="form-select"
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
            >
              <option value="">-- Chọn danh mục --</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Mô tả</label>
            <textarea
              className="form-textarea"
              placeholder="Mô tả chi tiết về sản phẩm"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Image URL</label>
            <input
              className="form-input"
              placeholder="https://example.com/image.jpg"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
            />
          </div>
        </div>

        <div className="btn-group">
          {editingId ? (
            <>
              <button className="btn btn-warning" onClick={createOrUpdate}>Cập nhật</button>
              <button className="btn btn-secondary" onClick={resetForm}>Hủy</button>
            </>
          ) : (
            <button className="btn btn-success" onClick={createOrUpdate}>Thêm mới</button>
          )}
        </div>
      </div>

      <ul className="product-list">
        {products.map((p) => (
          <li key={p.id} className="product-item">
            {p.imageUrl && (
              <img src={p.imageUrl} alt={p.name} className="product-image" />
            )}
            <div className="product-info">
              <div className="product-name">{p.name}</div>
              <div className="product-desc">{p.description}</div>
              <span className="product-category">
                {categories.find(c => c.id === p.categoryId)?.name || 'Chưa phân loại'}
              </span>
            </div>
            <div className="product-actions">
              <button className="btn btn-warning" style={{ padding: '8px 16px' }} onClick={() => editProduct(p)}>Sửa</button>
              <button className="btn btn-danger" style={{ padding: '8px 16px' }} onClick={() => deleteProduct(p.id)}>Xóa</button>
            </div>
          </li>
        ))}
      </ul>
      {products.length === 0 && (
        <div className="empty-state">
          <div className="empty-state-title">Chưa có sản phẩm nào</div>
        </div>
      )}
    </div>
  );
}
