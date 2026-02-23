# API Documentation

Base URL: `https://localhost:7031/api`

## Authentication

### POST /auth/login
Login với username và password
```json
{
  "username": "string",
  "password": "string"
}
```

### POST /auth/register
Đăng ký tài khoản mới
```json
{
  "username": "string",
  "password": "string",
  "fullname": "string",
  "role": "customer|Staff|Chef|Manager|Admin"
}
```

## Categories

### GET /categories
Lấy danh sách tất cả categories

### GET /categories/{id}
Lấy thông tin category theo ID

### POST /categories
Tạo category mới
```json
{
  "category_name": "string"
}
```

### PUT /categories/{id}
Cập nhật category
```json
{
  "category_name": "string"
}
```

### DELETE /categories/{id}
Xóa category

## Products

### GET /products
Lấy danh sách tất cả products

### GET /products/{id}
Lấy thông tin product theo ID

### POST /products
Tạo product mới
```json
{
  "product_name": "string",
  "description": "string",
  "base_price": number,
  "category_id": number,
  "image_url": "string"
}
```

### PUT /products/{id}
Cập nhật product
```json
{
  "product_name": "string",
  "description": "string",
  "base_price": number,
  "category_id": number,
  "image_url": "string"
}
```

### DELETE /products/{id}
Xóa product

## Product Variants

### GET /variants/product/{productId}
Lấy danh sách variants của một product

### POST /variants
Tạo variant mới
```json
{
  "product_id": number,
  "variant_name": "string",
  "price": number
}
```

### PUT /variants/{id}
Cập nhật variant
```json
{
  "product_id": number,
  "variant_name": "string",
  "price": number
}
```

### DELETE /variants/{id}
Xóa variant

## Toppings

### GET /toppings
Lấy danh sách tất cả toppings

### GET /toppings/{id}
Lấy thông tin topping theo ID

### POST /toppings
Tạo topping mới
```json
{
  "topping_name": "string",
  "price": number
}
```

### PUT /toppings/{id}
Cập nhật topping
```json
{
  "topping_name": "string",
  "price": number
}
```

### DELETE /toppings/{id}
Xóa topping

## Test

### GET /test/connection
Kiểm tra kết nối API

## Sử dụng trong Frontend

```javascript
import { 
  categoriesApi, 
  productsApi, 
  productVariantsApi,
  toppingsApi 
} from '../api';

// Lấy categories
const categories = await categoriesApi.getAll();

// Tạo product
const newProduct = await productsApi.create({
  product_name: "Phở Bò",
  description: "Phở bò truyền thống",
  base_price: 50000,
  category_id: 1
});

// Lấy variants của product
const variants = await productVariantsApi.getByProduct(productId);

// Test connection
const result = await testApi.connection();
```

## Error Handling

Tất cả API đều trả về error dạng:
```json
{
  "message": "Error message",
  "statusCode": 400
}
```

Axios interceptor đã xử lý:
- 401: Auto logout và redirect về login
- Network error: "Không thể kết nối đến server"
- Other errors: Parse error message từ backend
