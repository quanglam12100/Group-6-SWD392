# SmartRestaurant Frontend - Kiến trúc mới

## 📁 Cấu trúc thư mục

```
src/
├─ main.jsx                      # Entry point với Providers
├─ App.jsx                       # Root App component
│
├─ routes/
│   └─ AppRoutes.jsx            # Routing configuration
│
├─ layouts/
│   ├─ MainLayout.jsx           # Layout cho user (có Navbar + Footer)
│   └─ AdminLayout.jsx          # Layout cho admin (có Navbar, kiểm tra auth)
│
├─ pages/
│   ├─ Home/                    # Trang chủ user
│   │   ├─ index.jsx
│   │   └─ index.css
│   │
│   ├─ Menu/                    # products, categories, variants, toppings
│   │   └─ index.jsx
│   │
│   ├─ Cart/                    # order_details
│   │   └─ index.jsx
│   │
│   ├─ Order/                   # orders
│   │   └─ index.jsx
│   │
│   ├─ Table/                   # tables
│   │   └─ index.jsx
│   │
│   ├─ Login/                   # accounts
│   │   └─ index.jsx
│   │
│   └─ Admin/                   # Admin pages
│       ├─ Dashboard.jsx        # Dashboard admin
│       ├─ (Old pages kept temporarily)
│       └─ VoiceLogs.jsx        # voice_logs (to be created)
│
├─ components/
│   ├─ common/
│   │   ├─ Navbar.jsx          # Navigation với cart badge
│   │   ├─ Footer.jsx          # Footer component
│   │   └─ Modal.jsx           # Modal reusable
│   │
│   ├─ product/                 # Product domain components
│   │   ├─ FoodCard.jsx
│   │   ├─ ToppingSelector.jsx
│   │   └─ CategoryFilter.jsx
│   │
│   ├─ order/                   # Order domain components
│   │   ├─ CartItem.jsx
│   │   └─ OrderSummary.jsx
│   │
│   └─ ai/                      # AI domain components
│       ├─ VoiceOrder.jsx       # Gửi voice lên AI
│       └─ VoiceLogItem.jsx     # Hiển thị voice_logs
│
├─ services/                    # API services layer
│   ├─ api.js                   # Base API với auth headers
│   ├─ authService.js           # accounts
│   ├─ productService.js        # products, categories, variants
│   ├─ orderService.js          # orders, order_details
│   ├─ tableService.js          # tables
│   ├─ toppingService.js        # toppings
│   └─ aiService.js             # voice_logs, AI recognition
│
├─ hooks/                       # Custom hooks
│   ├─ useAuth.js               # Auth hook
│   ├─ useCart.js               # Cart hook
│   └─ useVoiceOrder.js         # Voice order hook
│
├─ contexts/                    # Context providers
│   ├─ AuthContext.jsx          # Authentication state
│   └─ CartContext.jsx          # Cart state
│
└─ utils/
    └─ formatPrice.js           # Price formatting utilities
```

## 🚀 Features đã implement

### ✅ Context & State Management
- **AuthContext**: Quản lý authentication, user info, login/logout
- **CartContext**: Quản lý giỏ hàng, tính toán tổng tiền, localStorage persistence

### ✅ Custom Hooks
- **useAuth()**: Access auth context (user, login, logout, isAdmin)
- **useCart()**: Access cart context (addToCart, removeFromCart, getTotalPrice)
- **useVoiceOrder()**: Voice recording & AI recognition

### ✅ Services Layer
- Tất cả API calls được tổ chức theo domain
- Centralized auth headers trong `api.js`
- Type-safe service methods

### ✅ Layouts
- **MainLayout**: Cho user pages (/, /menu, /cart, etc.)
- **AdminLayout**: Cho admin pages với auth guard

### ✅ Components
- **Navbar**: Dynamic menu với cart badge, login/logout
- **Footer**: Simple footer component
- **Modal**: Reusable modal component

## 📍 Routes

### Public Routes
- `/` - Homepage
- `/login` - Login page
- `/menu` - Menu listing (coming soon)
- `/table` - Table selection (coming soon)

### Protected Routes (cần login)
- `/cart` - Shopping cart
- `/order` - Order history

### Admin Routes (cần login + admin role)
- `/admin` - Dashboard với stats
- `/admin/categories` - Quản lý danh mục
- `/admin/products` - Quản lý sản phẩm
- `/admin/variants` - Quản lý variants
- `/admin/toppings` - Quản lý toppings
- `/admin/orders` - Quản lý đơn hàng
- `/admin/tables` - Quản lý bàn
- `/admin/accounts` - Quản lý tài khoản

### Legacy Redirects
- Old routes (`/categories`, `/products`, etc.) redirect to `/admin/*`

## 🔧 Usage Examples

### Using Auth Hook
```jsx
import { useAuth } from "../hooks/useAuth";

function MyComponent() {
  const { user, isAuthenticated, login, logout, isAdmin } = useAuth();
  
  const handleLogin = async () => {
    const result = await login(email, password);
    if (result.success) {
      // Navigate to dashboard
    }
  };
}
```

### Using Cart Hook
```jsx
import { useCart } from "../hooks/useCart";

function ProductCard({ product }) {
  const { addToCart, getTotalItems } = useCart();
  
  const handleAddToCart = () => {
    addToCart(product, variant, toppings, quantity);
  };
}
```

### Using Services
```jsx
import { productService } from "../services/productService";

const products = await productService.getAllProducts();
const product = await productService.getProductById(id);
await productService.createProduct(data);
```

## 🎨 Styling
- Dark theme với gradient backgrounds
- Glass morphism effects với backdrop-filter
- Responsive design
- Consistent color scheme:
  - Primary: `#d4af37` (gold)
  - Background: `#1a1a1a` → `#2b2b2b`
  - Text: `#ffffff` / `rgba(255, 255, 255, 0.6)`

## 🔐 Authentication Flow
1. User login → JWT token stored in localStorage
2. AuthContext loads user info
3. Protected routes check `isAuthenticated`
4. AdminLayout checks admin role
5. Logout clears token and redirects to login

## 📦 Next Steps
- [ ] Implement Menu page with product listing
- [ ] Implement Cart page with order details
- [ ] Implement Table selection page
- [ ] Create product domain components (FoodCard, ToppingSelector, etc.)
- [ ] Create order domain components (CartItem, OrderSummary)
- [ ] Implement AI voice order components
- [ ] Create VoiceLogs admin page
- [ ] Add more admin management pages

## 🛠️ Development
```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build
```

## 📝 Notes
- Old admin pages (CategoryPage, ProductPage, etc.) được giữ lại tạm thời
- Legacy routes redirect sang `/admin/*`
- Navbar tự động ẩn khi user chưa login
- Cart badge hiển thị số lượng items
