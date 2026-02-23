# Cấu Trúc Mới - SmartRestaurant Frontend

## Tổng Quan

Dự án đã được tái cấu trúc hoàn toàn theo kiến trúc hiện đại với:
- **API Layer** với Axios (thay thế fetch)
- **State Management** với Zustand (thay thế Context API)
- **Pages theo vai trò**: auth/, customer/, staff/, kitchen/, admin/
- **Components theo chức năng**: common/, voice/, form/, layout/

## Cấu Trúc Thư Mục

```
src/
├── api/                          # API Layer (Axios)
│   ├── axiosClient.js           # Axios instance với interceptors
│   ├── auth.api.js              # Authentication API
│   ├── accounts.api.js          # Accounts CRUD
│   ├── products.api.js          # Products + Keywords
│   ├── categories.api.js        # Categories CRUD
│   ├── orders.api.js            # Orders + Order Details
│   ├── tables.api.js            # Tables CRUD
│   ├── toppings.api.js          # Toppings CRUD
│   ├── productVariants.api.js  # Product Variants
│   ├── voiceLogs.api.js         # Voice Logs + AI Recognition
│   └── index.js                 # Export tất cả APIs
│
├── store/                        # State Management (Zustand)
│   ├── authStore.js             # Authentication state
│   └── cartStore.js             # Shopping cart state
│
├── pages/
│   ├── auth/                    # Authentication Pages
│   │   ├── Login.jsx           # Đăng nhập (username-based)
│   │   └── Register.jsx        # Đăng ký (với role selection)
│   │
│   ├── customer/                # Customer Pages
│   │   ├── Menu.jsx            # Xem menu, chọn món
│   │   ├── Order.jsx           # Đặt món, chọn bàn
│   │   └── OrderHistory.jsx    # Lịch sử đơn hàng
│   │
│   ├── staff/                   # Staff Pages (Chưa implement)
│   │   ├── TableList.jsx       # Quản lý bàn
│   │   └── CreateOrder.jsx     # Tạo đơn cho khách
│   │
│   ├── kitchen/                 # Kitchen Pages (Chưa implement)
│   │   └── KitchenDashboard.jsx # Dashboard bếp
│   │
│   ├── admin/                   # Admin Pages
│   │   └── Dashboard.jsx       # Admin dashboard với thống kê
│   │
│   ├── Home/                    # Homepage
│   │   └── index.jsx
│   │
│   ├── CategoryPage.jsx        # Old admin pages (cần migrate)
│   ├── ProductPage.jsx
│   ├── ToppingPage.jsx
│   ├── ProductVariantPage.jsx
│   ├── OrderPage.jsx
│   ├── TablePage.jsx
│   ├── AccountPage.jsx
│   └── PageStyles.css
│
├── components/
│   ├── common/                  # Common Components
│   │   ├── Navbar.jsx          # Navigation bar (dynamic menu)
│   │   ├── Footer.jsx
│   │   └── Modal.jsx
│   │
│   └── voice/                   # Voice Components (Chưa implement)
│       ├── VoiceRecorder.jsx   # Ghi âm giọng nói
│       └── VoiceHistory.jsx    # Lịch sử voice logs
│
├── layouts/
│   ├── MainLayout.jsx           # Layout cho public + customer pages
│   └── AdminLayout.jsx          # Layout cho admin pages (có access control)
│
├── utils/
│   ├── constants.js             # USER_ROLES, TABLE_STATUS, etc.
│   └── formatPrice.js           # Format giá tiền
│
├── routes/
│   └── AppRoutes.jsx            # Routing configuration
│
├── hooks/                        # Custom hooks (legacy, chuyển sang store)
│   ├── useAuth.js
│   ├── useCart.js
│   └── useVoiceOrder.js
│
├── contexts/                     # Context API (legacy, chuyển sang store)
│   ├── AuthContext.jsx
│   └── CartContext.jsx
│
├── services/                     # Old fetch-based services (deprecated)
│   ├── api.js
│   ├── authService.js
│   ├── productService.js
│   ├── orderService.js
│   ├── tableService.js
│   ├── toppingService.js
│   └── aiService.js
│
├── App.jsx                       # Root component (khởi tạo auth store)
├── App.css
├── main.jsx
└── index.css
```

## API Layer

### axiosClient.js
- Base configuration cho Axios
- **Request Interceptor**: Tự động thêm Bearer token vào headers
- **Response Interceptor**: 
  - Tự động parse response data
  - Handle 401 (unauthorized) → clear token, redirect to login
  - Handle network errors

### API Files
Mỗi file export một object với CRUD methods:
```javascript
export const productsApi = {
  getAll: () => axiosClient.get("/products"),
  getById: (id) => axiosClient.get(`/products/${id}`),
  create: (data) => axiosClient.post("/products", data),
  update: (id, data) => axiosClient.put(`/products/${id}`, data),
  delete: (id) => axiosClient.delete(`/products/${id}`),
};
```

## State Management

### authStore.js (Zustand)
**State:**
- `user`: User object (account_id, username, fullname, role, etc.)
- `token`: JWT token string
- `loading`: Boolean loading state

**Methods:**
- `initialize()`: Khởi tạo auth state từ localStorage
- `login(username, password)`: Đăng nhập, lưu token
- `register(userData)`: Đăng ký tài khoản
- `logout()`: Đăng xuất, clear token
- `isAdmin()`: Check if user là Admin/Manager/Chef
- `isCustomer()`: Check if user là customer
- `isStaff()`: Check if user là Staff
- `isChef()`: Check if user là Chef
- `updateUser(userData)`: Cập nhật user data

**Usage:**
```javascript
import { useAuthStore } from "../store/authStore";

const user = useAuthStore((state) => state.user);
const login = useAuthStore((state) => state.login);
const isAdmin = useAuthStore((state) => state.isAdmin);
```

### cartStore.js (Zustand với persist)
**State:**
- `items`: Array of cart items (persisted in localStorage)

**Methods:**
- `addToCart(item)`: Thêm món vào giỏ
- `removeFromCart(index)`: Xóa món khỏi giỏ
- `updateQuantity(index, quantity)`: Cập nhật số lượng
- `clearCart()`: Xóa toàn bộ giỏ
- `getTotalPrice()`: Tính tổng tiền
- `getItemCount()`: Đếm tổng số món

**Usage:**
```javascript
import { useCartStore } from "../store/cartStore";

const cart = useCartStore((state) => state.items);
const addToCart = useCartStore((state) => state.addToCart);
const getTotalPrice = useCartStore((state) => state.getTotalPrice);
```

## Pages

### Auth Pages
- **Login.jsx**: Username-based login với validation
- **Register.jsx**: Đăng ký với username validation (alphanumeric + underscore only)

### Customer Pages
- **Menu.jsx**: Hiển thị menu theo categories, chọn variant + toppings, thêm vào giỏ
- **Order.jsx**: Xem giỏ hàng, chọn bàn, submit order
- **OrderHistory.jsx**: Xem lịch sử đơn hàng, chi tiết từng đơn

### Admin Pages
- **Dashboard.jsx**: Thống kê tổng quan (accounts, products, orders, revenue)
- **Old pages** (CategoryPage, ProductPage, etc.): Cần migrate sang admin/

## Routing

### Public Routes
- `/login` - Login page
- `/register` - Register page
- `/` - Homepage
- `/menu` - Menu page (public)

### Protected Routes (Customer)
- `/cart` - Giỏ hàng
- `/customer/order` - Đặt món
- `/customer/order-history` - Lịch sử đơn

### Admin Routes (Admin/Manager/Chef only)
- `/admin` - Dashboard
- `/admin/categories` - Quản lý danh mục
- `/admin/products` - Quản lý sản phẩm
- `/admin/variants` - Quản lý biến thể
- `/admin/toppings` - Quản lý topping
- `/admin/orders` - Quản lý đơn hàng
- `/admin/tables` - Quản lý bàn
- `/admin/accounts` - Quản lý tài khoản

## Authentication Flow

1. User truy cập `/login`
2. Nhập username + password
3. `authStore.login()` gọi `authApi.login()`
4. Backend trả về token → lưu vào localStorage và store
5. `axiosClient` tự động thêm token vào headers cho mọi request
6. Khi token hết hạn (401), interceptor tự động logout và redirect

## Authorization

### Role-Based Access
- **Customer**: Truy cập menu, order, order history
- **Staff**: Quản lý bàn, tạo đơn cho khách
- **Chef**: Xem dashboard bếp, cập nhật trạng thái món
- **Manager/Admin**: Full access admin panel

### AdminLayout Protection
```javascript
if (!token) return <Navigate to="/login" />;
if (!isAdmin()) return <AccessDeniedMessage />;
```

## Migration Plan

### Hoàn Thành ✅
1. ✅ API layer với Axios (10 files)
2. ✅ State management với Zustand (authStore, cartStore)
3. ✅ Auth pages (Login, Register) với store
4. ✅ Customer pages (Menu, Order, OrderHistory)
5. ✅ Cập nhật App.jsx để khởi tạo authStore
6. ✅ Cập nhật AppRoutes với pages mới
7. ✅ Cập nhật Navbar với store
8. ✅ Cập nhật AdminLayout với store

### Cần Làm 🚧
1. 🚧 Migrate old admin pages sang admin/ folder và sử dụng API layer:
   - CategoryPage → admin/Categories.jsx
   - ProductPage → admin/Products.jsx
   - ToppingPage → admin/Toppings.jsx
   - ProductVariantPage → admin/ProductVariants.jsx
   - OrderPage → admin/Orders.jsx
   - TablePage → admin/Tables.jsx
   - AccountPage → admin/Accounts.jsx

2. 🚧 Tạo Staff pages:
   - staff/TableList.jsx
   - staff/CreateOrder.jsx

3. 🚧 Tạo Kitchen page:
   - kitchen/KitchenDashboard.jsx

4. 🚧 Tạo Voice components:
   - components/voice/VoiceRecorder.jsx
   - components/voice/VoiceHistory.jsx

5. 🚧 Cập nhật routes cho staff/kitchen pages
6. 🚧 Xóa legacy code (hooks/, contexts/, services/)

## Development

### Start Backend
```bash
cd SmartRestaurant
dotnet run --launch-profile https
# https://localhost:7031
```

### Start Frontend
```bash
cd Frontend/vite-project
npm run dev
# http://localhost:5173 (hoặc 5174)
```

### Build
```bash
npm run build
npm run preview
```

## Dependencies

### Đã Cài
- axios: ^1.13.4
- zustand: ^5.x (mới cài)
- react-router-dom: ^7.13.0

### Cần Cài (Cho Voice Features)
- react-mic hoặc similar library for audio recording

## Notes

- **Backward compatibility**: Old pages vẫn hoạt động cho đến khi migrate xong
- **Token handling**: Tự động thông qua axios interceptors
- **Error handling**: Centralized trong axiosClient
- **Cart persistence**: Tự động với zustand persist middleware
- **Role validation**: Ở cả route level và layout level
