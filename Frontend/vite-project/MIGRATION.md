# Migration Guide - Cấu trúc mới

## ✅ Đã hoàn thành

### 1. Cấu trúc thư mục mới
- ✅ `src/layouts/` - MainLayout & AdminLayout
- ✅ `src/contexts/` - AuthContext & CartContext
- ✅ `src/hooks/` - useAuth, useCart, useVoiceOrder
- ✅ `src/services/` - API layer cho tất cả domains
- ✅ `src/utils/` - formatPrice utilities
- ✅ `src/components/common/` - Navbar, Footer, Modal
- ✅ `src/pages/Home/` - User homepage
- ✅ `src/pages/Login/` - Login page mới
- ✅ `src/pages/Admin/` - Dashboard admin

### 2. Services Layer (API)
```javascript
// ✅ Tất cả services đã tạo:
- api.js              // Base API với auth headers
- authService.js      // Login, register, getCurrentUser
- productService.js   // Products, categories, variants
- toppingService.js   // Toppings CRUD
- orderService.js     // Orders & order details
- tableService.js     // Tables management
- aiService.js        // Voice recognition & logs
```

### 3. Context & Hooks
```javascript
// ✅ Contexts:
<AuthProvider>   // User authentication state
<CartProvider>   // Shopping cart state

// ✅ Hooks:
useAuth()        // { user, login, logout, isAdmin, isAuthenticated }
useCart()        // { cartItems, addToCart, getTotalPrice, clearCart }
useVoiceOrder()  // { isRecording, startRecording, transcript }
```

### 4. Routing
```javascript
// ✅ Nested routes với layouts:
<MainLayout>     // / /menu /cart /order /table
<AdminLayout>    // /admin/* với auth guard

// ✅ Legacy redirects:
/categories → /admin/categories
/products   → /admin/products
// ... (tất cả old routes redirect sang admin)
```

### 5. Components
```javascript
// ✅ Common components:
<Navbar />   // Dynamic menu với cart badge
<Footer />   // Footer component
<Modal />    // Reusable modal
```

## 🎯 Cách sử dụng

### Login với Auth Context
```jsx
import { useAuth } from "../hooks/useAuth";

function Login() {
  const { login } = useAuth();
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await login(email, password);
    if (result.success) navigate("/");
  };
}
```

### Add to Cart
```jsx
import { useCart } from "../hooks/useCart";

function ProductCard({ product }) {
  const { addToCart } = useCart();
  
  const handleAdd = () => {
    addToCart(product, variant, toppings, quantity);
  };
}
```

### Call API từ Service
```jsx
import { productService } from "../services/productService";

const products = await productService.getAllProducts();
const categories = await productService.getAllCategories();
```

## 🔄 Thay đổi chính

### Old way:
```jsx
// Direct fetch trong component
const token = localStorage.getItem("token");
const response = await fetch("https://localhost:7031/api/products", {
  headers: { Authorization: `Bearer ${token}` }
});
```

### New way:
```jsx
// Sử dụng service
import { productService } from "../services/productService";
const products = await productService.getAllProducts();
```

### Old routing:
```jsx
<Route path="/" element={<PrivateRoute><Home /></PrivateRoute>} />
```

### New routing:
```jsx
<Route element={<MainLayout />}>
  <Route path="/" element={<Home />} />
</Route>
```

## 📂 File mapping

| Old | New |
|-----|-----|
| `src/pages/Home.jsx` | `src/pages/Admin/Dashboard.jsx` (admin dashboard) |
| `src/pages/Home.jsx` | `src/pages/Home/index.jsx` (user homepage) |
| `src/pages/Login.jsx` | `src/pages/Login/index.jsx` |
| `src/components/Navbar.jsx` | `src/components/common/Navbar.jsx` |
| Direct API calls | `src/services/*Service.js` |

## 🚀 Dev Server

```bash
cd Frontend/vite-project
npm run dev
```

Server đang chạy tại: **http://localhost:5174/**

## 🎨 UI/UX Changes

### Navbar mới:
- ✅ Dynamic menu based on auth status
- ✅ Cart badge với số lượng items
- ✅ Admin menu chỉ hiện khi user là Admin/Manager
- ✅ Logout button thay vì redirect

### Homepage mới:
- ✅ User homepage: Hero section + Features
- ✅ Admin dashboard: Stats cards + Quick actions + Recent activity
- ✅ Tách riêng 2 homepages

### Authentication:
- ✅ AuthContext quản lý toàn bộ auth state
- ✅ Không cần check localStorage ở mỗi component
- ✅ Protected routes tự động redirect

## 📋 TODO - Pages cần implement

### User Pages (MainLayout):
- [ ] `/menu` - Menu listing với filters
- [ ] `/menu/:id` - Product detail
- [ ] `/cart` - Shopping cart page
- [ ] `/order` - Order history
- [ ] `/table` - Table selection

### Admin Pages (AdminLayout):
- [x] `/admin` - Dashboard (done)
- [x] `/admin/categories` - Old page (kept)
- [x] `/admin/products` - Old page (kept)
- [x] `/admin/toppings` - Old page (kept)
- [x] `/admin/variants` - Old page (kept)
- [x] `/admin/orders` - Old page (kept)
- [x] `/admin/tables` - Old page (kept)
- [x] `/admin/accounts` - Old page (kept)
- [ ] `/admin/voice-logs` - Voice logs management

### Components to create:
- [ ] `components/product/FoodCard.jsx`
- [ ] `components/product/ToppingSelector.jsx`
- [ ] `components/product/CategoryFilter.jsx`
- [ ] `components/order/CartItem.jsx`
- [ ] `components/order/OrderSummary.jsx`
- [ ] `components/ai/VoiceOrder.jsx`
- [ ] `components/ai/VoiceLogItem.jsx`

## 🔧 Troubleshooting

### Lỗi import không tìm thấy:
```javascript
// Check path từ vị trí file
// Nếu trong src/pages/Menu/index.jsx:
import { useAuth } from "../../hooks/useAuth";  // đúng
import { useAuth } from "../hooks/useAuth";     // sai
```

### Lỗi Context is undefined:
```javascript
// Đảm bảo component nằm trong Provider:
<AuthProvider>
  <YourComponent />  // có thể dùng useAuth()
</AuthProvider>
```

### Navbar không hiện:
- Check Layout đang dùng có include Navbar không
- MainLayout có Navbar, AdminLayout có Navbar
- Login page không dùng Layout nên không có Navbar

## 📖 Xem thêm

Chi tiết cấu trúc: `ARCHITECTURE.md`
