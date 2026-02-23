# Hướng Dẫn Migration - SmartRestaurant

## ✅ Đã Hoàn Thành

### 1. API Layer với Axios
Đã tạo 10 file API trong `src/api/`:
- ✅ `axiosClient.js` - Base client với interceptors
- ✅ `auth.api.js` - Login, Register, GetCurrentUser
- ✅ `accounts.api.js` - Accounts CRUD
- ✅ `products.api.js` - Products + Keywords
- ✅ `categories.api.js` - Categories CRUD
- ✅ `orders.api.js` - Orders + Order Details
- ✅ `tables.api.js` - Tables CRUD
- ✅ `toppings.api.js` - Toppings CRUD
- ✅ `productVariants.api.js` - Product Variants
- ✅ `voiceLogs.api.js` - Voice Logs + AI Recognition

**Thay thế:** `services/*` (fetch-based) → `api/*` (axios-based)

### 2. State Management với Zustand
- ✅ `authStore.js` - Authentication state (thay Context API)
- ✅ `cartStore.js` - Shopping cart với persist (thay Context API)

**Thay thế:** `contexts/AuthContext.jsx`, `contexts/CartContext.jsx`

### 3. Auth Pages
- ✅ `pages/auth/Login.jsx` - Sử dụng authStore
- ✅ `pages/auth/Register.jsx` - Sử dụng authStore

**Thay thế:** `pages/Login/index.jsx`, `pages/Register.jsx`

### 4. Customer Pages  
- ✅ `pages/customer/Menu.jsx` - Xem menu, chọn món
- ✅ `pages/customer/Order.jsx` - Đặt món, chọn bàn
- ✅ `pages/customer/OrderHistory.jsx` - Lịch sử đơn hàng

### 5. Core Updates
- ✅ `App.jsx` - Khởi tạo authStore
- ✅ `AppRoutes.jsx` - Routes mới với store
- ✅ `Navbar.jsx` - Sử dụng authStore + cartStore
- ✅ `AdminLayout.jsx` - Sử dụng authStore

---

## 🚧 Cần Migration

### Bước 1: Migrate Admin Pages (Ưu tiên cao)

#### 1.1 Categories Page
**File cũ:** `pages/CategoryPage.jsx`  
**File mới:** `pages/admin/Categories.jsx`

```javascript
// Before (CategoryPage.jsx)
const res = await fetch("https://localhost:7031/api/categories");
const data = await res.json();

// After (admin/Categories.jsx)
import { categoriesApi } from "../../api/categories.api";
const data = await categoriesApi.getAll();
```

**Checklist:**
- [ ] Tạo file mới `pages/admin/Categories.jsx`
- [ ] Import `categoriesApi` thay vì fetch
- [ ] Sử dụng try-catch với categoriesApi methods
- [ ] Loại bỏ token handling thủ công (axios tự động)
- [ ] Test CRUD operations
- [ ] Cập nhật route trong AppRoutes.jsx
- [ ] Xóa file cũ CategoryPage.jsx

#### 1.2 Products Page
**File cũ:** `pages/ProductPage.jsx`  
**File mới:** `pages/admin/Products.jsx`

```javascript
// Before
const token = localStorage.getItem("token");
const res = await fetch(API_URL, {
  headers: { Authorization: `Bearer ${token}` }
});

// After
import { productsApi } from "../../api/products.api";
const data = await productsApi.getAll();
```

**Checklist:**
- [ ] Tạo file mới `pages/admin/Products.jsx`
- [ ] Import `productsApi` và `categoriesApi`
- [ ] Migrate form với category dropdown
- [ ] Migrate image upload
- [ ] Test CRUD + Keywords
- [ ] Cập nhật route
- [ ] Xóa file cũ

#### 1.3 Toppings Page
**File cũ:** `pages/ToppingPage.jsx`  
**File mới:** `pages/admin/Toppings.jsx`

**Checklist:**
- [ ] Tạo file mới với toppingsApi
- [ ] Migrate form fields
- [ ] Test CRUD
- [ ] Cập nhật route
- [ ] Xóa file cũ

#### 1.4 Product Variants Page
**File cũ:** `pages/ProductVariantPage.jsx`  
**File mới:** `pages/admin/ProductVariants.jsx`

**Checklist:**
- [ ] Tạo file mới với productVariantsApi
- [ ] Import productsApi để load product dropdown
- [ ] Migrate form với product selection
- [ ] Test CRUD
- [ ] Cập nhật route
- [ ] Xóa file cũ

#### 1.5 Orders Page
**File cũ:** `pages/OrderPage.jsx`  
**File mới:** `pages/admin/Orders.jsx`

**Checklist:**
- [ ] Tạo file mới với ordersApi
- [ ] Migrate order details modal
- [ ] Implement payment status update
- [ ] Implement order detail status update
- [ ] Test tất cả operations
- [ ] Cập nhật route
- [ ] Xóa file cũ

#### 1.6 Tables Page
**File cũ:** `pages/TablePage.jsx`  
**File mới:** `pages/admin/Tables.jsx`

**Checklist:**
- [ ] Tạo file mới với tablesApi
- [ ] Migrate form với status dropdown
- [ ] Test CRUD + status update
- [ ] Cập nhật route
- [ ] Xóa file cũ

#### 1.7 Accounts Page
**File cũ:** `pages/AccountPage.jsx`  
**File mới:** `pages/admin/Accounts.jsx`

**Checklist:**
- [ ] Tạo file mới với accountsApi
- [ ] Migrate form với role selection
- [ ] Implement status toggle (isActive)
- [ ] Test CRUD
- [ ] Cập nhật route
- [ ] Xóa file cũ

---

### Bước 2: Staff Pages (Mới tạo)

#### 2.1 Table List (Staff)
**File mới:** `pages/staff/TableList.jsx`

**Features:**
- Hiển thị tất cả bàn với status (Available, Occupied, Reserved)
- Filter theo status
- Xem order của bàn
- Cập nhật status bàn
- Quick actions (create order, view order)

**Dependencies:**
- `tablesApi.getAll()`
- `ordersApi.getByTable(tableId)`
- `tablesApi.updateStatus(id, status)`

**Checklist:**
- [ ] Tạo file với grid layout
- [ ] Implement filters
- [ ] Implement status badges
- [ ] Implement quick actions
- [ ] Test với backend
- [ ] Add route trong AppRoutes

#### 2.2 Create Order (Staff)
**File mới:** `pages/staff/CreateOrder.jsx`

**Features:**
- Chọn table
- Search products
- Add items với variants + toppings
- Real-time price calculation
- Submit order

**Dependencies:**
- `tablesApi.getAll()`
- `productsApi.getAll()`
- `productVariantsApi.getByProduct()`
- `toppingsApi.getAll()`
- `ordersApi.create()`
- `ordersApi.addDetail()`

**Checklist:**
- [ ] Tạo file với 2-column layout
- [ ] Implement product search
- [ ] Implement cart management
- [ ] Implement price calculation
- [ ] Test order creation flow
- [ ] Add route

---

### Bước 3: Kitchen Pages (Mới tạo)

#### 3.1 Kitchen Dashboard
**File mới:** `pages/kitchen/KitchenDashboard.jsx`

**Features:**
- Real-time list of orders cần làm
- Group theo bàn
- Hiển thị chi tiết món + topping
- Update trạng thái món (Pending → Preparing → Completed)
- Filter theo status
- Auto-refresh

**Dependencies:**
- `ordersApi.getAll()`
- `ordersApi.getDetails(orderId)`
- `ordersApi.updateDetailStatus(orderId, detailId, status)`

**Checklist:**
- [ ] Tạo file với Kanban-style layout
- [ ] Implement status columns
- [ ] Implement detail cards
- [ ] Implement status update buttons
- [ ] Add auto-refresh (polling hoặc WebSocket)
- [ ] Add sound notification (optional)
- [ ] Test workflow
- [ ] Add route cho Chef role

---

### Bước 4: Voice Components (Mới tạo)

#### 4.1 Voice Recorder
**File mới:** `components/voice/VoiceRecorder.jsx`

**Features:**
- Button ghi âm
- Show recording status
- Stop recording
- Send audio to AI API
- Parse AI response → extract products

**Dependencies:**
- Browser MediaRecorder API
- `voiceLogsApi.recognizeVoice(audioBlob)`
- `productsApi.getAll()` để match keywords

**Checklist:**
- [ ] Cài library: `npm install react-mic` hoặc similar
- [ ] Implement recording UI
- [ ] Handle audio blob
- [ ] Call AI API
- [ ] Parse response
- [ ] Integration test

#### 4.2 Voice History
**File mới:** `components/voice/VoiceHistory.jsx`

**Features:**
- List voice logs
- Show timestamp, staff, recognized text
- Mark as trained
- Delete logs
- Filter by staff

**Dependencies:**
- `voiceLogsApi.getAll()`
- `voiceLogsApi.markAsTrained(id)`
- `voiceLogsApi.delete(id)`

**Checklist:**
- [ ] Tạo file với table layout
- [ ] Implement list với pagination
- [ ] Implement filter
- [ ] Implement actions (train, delete)
- [ ] Test CRUD operations

---

### Bước 5: Cleanup Legacy Code

Sau khi migrate xong tất cả:

#### 5.1 Xóa Old Services
- [ ] `services/api.js`
- [ ] `services/authService.js`
- [ ] `services/productService.js`
- [ ] `services/orderService.js`
- [ ] `services/tableService.js`
- [ ] `services/toppingService.js`
- [ ] `services/aiService.js`

#### 5.2 Xóa Contexts
- [ ] `contexts/AuthContext.jsx`
- [ ] `contexts/CartContext.jsx`

#### 5.3 Xóa Hooks (nếu không dùng)
- [ ] `hooks/useAuth.js`
- [ ] `hooks/useCart.js`
- [ ] `hooks/useVoiceOrder.js`

Hoặc có thể giữ hooks như wrapper cho store:
```javascript
// hooks/useAuth.js
export const useAuth = () => {
  return useAuthStore();
};
```

#### 5.4 Xóa Old Pages
- [ ] `pages/Login/index.jsx`
- [ ] `pages/Register.jsx`
- [ ] `pages/CategoryPage.jsx`
- [ ] `pages/ProductPage.jsx`
- [ ] `pages/ToppingPage.jsx`
- [ ] `pages/ProductVariantPage.jsx`
- [ ] `pages/OrderPage.jsx`
- [ ] `pages/TablePage.jsx`
- [ ] `pages/AccountPage.jsx`

---

## 🎯 Priority Order

### Phase 1: Critical (Tuần 1)
1. ✅ API Layer + Store (DONE)
2. ✅ Auth pages (DONE)
3. ✅ Customer pages (DONE)
4. 🚧 Migrate admin pages (CategoryPage, ProductPage, ToppingPage)

### Phase 2: Important (Tuần 2)
5. 🚧 Migrate remaining admin pages (ProductVariantPage, OrderPage, TablePage, AccountPage)
6. 🚧 Staff pages (TableList, CreateOrder)

### Phase 3: Nice-to-have (Tuần 3)
7. 🚧 Kitchen dashboard
8. 🚧 Voice components
9. 🚧 Cleanup legacy code

---

## 🔧 Migration Template

Khi migrate một page, follow template này:

```javascript
// pages/admin/Example.jsx
import { useState, useEffect } from "react";
import { exampleApi } from "../../api/example.api";
import { useAuthStore } from "../../store/authStore";
import "../PageStyles.css";

export default function ExamplePage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  const [formData, setFormData] = useState({
    name: "",
    // ... other fields
  });
  const [editingId, setEditingId] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const data = await exampleApi.getAll();
      setItems(data);
      setLoading(false);
    } catch (error) {
      console.error("Lỗi:", error);
      setError(error.message || error);
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      if (editingId) {
        await exampleApi.update(editingId, formData);
        alert("Cập nhật thành công!");
      } else {
        await exampleApi.create(formData);
        alert("Thêm mới thành công!");
      }
      
      resetForm();
      fetchItems();
    } catch (error) {
      console.error("Lỗi:", error);
      setError(error.message || error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (item) => {
    setFormData({ ...item });
    setEditingId(item.id);
  };

  const handleDelete = async (id) => {
    if (!confirm("Xác nhận xóa?")) return;

    try {
      await exampleApi.delete(id);
      alert("Xóa thành công!");
      fetchItems();
    } catch (error) {
      console.error("Lỗi:", error);
      alert("Xóa thất bại: " + (error.message || error));
    }
  };

  const resetForm = () => {
    setFormData({ name: "" });
    setEditingId(null);
  };

  if (loading) {
    return (
      <div className="page-container">
        <div style={{ textAlign: "center", color: "#d4af37" }}>
          Đang tải...
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <h1 className="page-title">Quản Lý ...</h1>

      {error && (
        <div className="alert-error">
          {error}
        </div>
      )}

      {/* Form */}
      <div className="card">
        <h2 className="card-title">
          {editingId ? "Cập nhật" : "Thêm mới"}
        </h2>
        <form onSubmit={handleSubmit}>
          {/* Form fields */}
          
          <div style={{ display: "flex", gap: 10 }}>
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={submitting}
            >
              {submitting ? "Đang xử lý..." : editingId ? "Cập nhật" : "Thêm mới"}
            </button>
            {editingId && (
              <button 
                type="button" 
                className="btn btn-secondary" 
                onClick={resetForm}
              >
                Hủy
              </button>
            )}
          </div>
        </form>
      </div>

      {/* List */}
      <div className="card">
        <h2 className="card-title">Danh sách</h2>
        {/* Table or Grid */}
      </div>
    </div>
  );
}
```

---

## 📝 Testing Checklist

Khi migrate xong mỗi page:

- [ ] Form submit thành công
- [ ] Form validation hoạt động
- [ ] List hiển thị đúng data
- [ ] Edit load đúng data vào form
- [ ] Delete hoạt động + confirm
- [ ] Error handling hiển thị message
- [ ] Loading state hiển thị
- [ ] Không console errors
- [ ] Token tự động gửi (check Network tab)
- [ ] 401 redirect về login

---

## 🐛 Common Issues

### Issue 1: Axios interceptor không gửi token
**Cause:** Token chưa có trong localStorage khi khởi tạo  
**Fix:** `useEffect` in App.jsx calls `authStore.initialize()`

### Issue 2: CORS error
**Cause:** Backend CORS settings  
**Fix:** Check `Program.cs` - `builder.Services.AddCors()`

### Issue 3: 401 sau khi login
**Cause:** Token format sai hoặc không lưu  
**Fix:** Check `authStore.login()` - `localStorage.setItem("token", token)`

### Issue 4: Store state không persist
**Cause:** Chưa dùng persist middleware  
**Fix:** Wrap store với `persist()` như cartStore

### Issue 5: Component không re-render khi store thay đổi
**Cause:** Không subscribe đúng store value  
**Fix:** Dùng `useAuthStore((state) => state.value)` thay vì `useAuthStore()`

---

## 📚 Resources

- [Zustand Docs](https://docs.pmnd.rs/zustand/getting-started/introduction)
- [Axios Docs](https://axios-http.com/docs/intro)
- [React Router v7](https://reactrouter.com/en/main)
- API Documentation: `API_DOCS.md`
- New Structure: `NEW_STRUCTURE.md`
