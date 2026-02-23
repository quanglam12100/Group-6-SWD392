# API Documentation - SmartRestaurant

Base URL: `https://localhost:7031/api`

## Authentication

### Login
```
POST /auth/login
Body: { username: string, password: string }
Response: { token: string, user: { id, username, fullname, role, isActive } }
```

### Register
```
POST /auth/register
Body: { username: string, password: string, fullname: string, role: string }
Roles: Staff | Manager | Chef | Admin
```

### Get Current User
```
GET /auth/me
Headers: Authorization: Bearer {token}
Response: { id, username, fullname, role, isActive }
```

## Categories

```
GET    /categories           - Get all categories
POST   /categories           - Create category { name }
GET    /categories/{id}      - Get category by ID
PUT    /categories/{id}      - Update category
DELETE /categories/{id}      - Delete category
```

## Products

```
GET    /products             - Get all products
POST   /products             - Create product
       Body: { categoryId, name, description, imageUrl, isActive }
GET    /products/{id}        - Get product by ID
PUT    /products/{id}        - Update product
DELETE /products/{id}        - Delete product
```

### Product Keywords
```
GET    /products/{id}/keywords       - Get keywords for product
POST   /products/{id}/keywords       - Add keyword { keyword }
```

## Product Variants

```
GET    /variants                     - Get all variants
POST   /variants                     - Create variant
       Body: { productId, sizeName, price }
GET    /variants/{id}                - Get variant by ID
GET    /variants/product/{productId} - Get variants by product ID
PUT    /variants/{id}                - Update variant
DELETE /variants/{id}                - Delete variant
```

## Toppings

```
GET    /toppings             - Get all toppings
POST   /toppings             - Create topping { name, price, isAvailable }
GET    /toppings/{id}        - Get topping by ID
PUT    /toppings/{id}        - Update topping
DELETE /toppings/{id}        - Delete topping
```

## Tables

```
GET    /tables               - Get all tables
POST   /tables               - Create table { name, status }
GET    /tables/{id}          - Get table by ID
PUT    /tables/{id}          - Update table
DELETE /tables/{id}          - Delete table
PUT    /tables/{id}/status   - Update status { status }
```

**Table Status**: Available | Occupied | Reserved

## Orders

```
GET    /orders               - Get all orders
POST   /orders               - Create order
       Body: {
         orderCode: string,
         tableId: number,
         customerId?: number,
         staffId: number,
         totalAmount: number,
         paymentMethod: string,
         paymentStatus: string
       }
GET    /orders/{id}          - Get order by ID
PUT    /orders/{id}          - Update order
DELETE /orders/{id}          - Delete order
PUT    /orders/{id}/close    - Close order (set closedAt)
PUT    /orders/{id}/payment-status - Update payment status
```

**Payment Methods**: Cash | Card | Transfer  
**Payment Status**: Pending | Paid | Cancelled

### Order Details

```
GET    /orders/{orderId}/details           - Get order details
POST   /orders/{orderId}/details           - Add order detail
       Body: {
         productVariantId: number,
         quantity: number,
         voiceNote?: string,
         originalVoiceText?: string,
         confidenceScore?: number,
         toppingIds?: number[]
       }
GET    /orders/{orderId}/details/{id}     - Get detail by ID
PUT    /orders/{orderId}/details/{id}     - Update detail
DELETE /orders/{orderId}/details/{id}     - Delete detail
PUT    /orders/{orderId}/details/{id}/status - Update status { status }
```

**Order Detail Status**: Pending | Preparing | Ready | Served | Cancelled

### Order Detail Toppings

```
GET    /orders/{orderId}/details/{detailId}/toppings - Get toppings for detail
```

## Accounts

```
GET    /accounts             - Get all accounts
PUT    /accounts/{id}        - Update account
PUT    /accounts/{id}/status - Update status { isActive }
```

## Voice Logs

```
GET    /voice-logs           - Get all voice logs
POST   /voice-logs           - Create voice log
       Body: {
         staffId: number,
         audioFileUrl: string,
         detectedText: string,
         correctedProductId?: number
       }
GET    /voice-logs/{id}      - Get voice log by ID
PUT    /voice-logs/{id}      - Update voice log
PUT    /voice-logs/{id}/trained - Mark as trained { isTrained }
DELETE /voice-logs/{id}      - Delete voice log
```

## AI Recognition

```
POST   /ai/recognize         - Voice recognition
       Body: FormData with 'audio' file
       Response: { detectedText, productId, confidence }
```

## Database Schema Mapping

### accounts
- id (PK)
- username (unique)
- password (hashed)
- fullname
- role (Staff | Manager | Chef | Admin)
- created_at
- is_active

### categories
- id (PK)
- name

### products
- id (PK)
- category_id (FK → categories.id)
- name
- description
- image_url
- is_active

### product_variants
- id (PK)
- product_id (FK → products.id)
- size_name
- price

### product_keywords
- id (PK)
- product_id (FK → products.id)
- keyword

### toppings
- id (PK)
- name
- price
- is_available

### tables
- id (PK)
- name
- status (Available | Occupied | Reserved)

### orders
- id (PK)
- order_code
- table_id (FK → tables.id)
- customer_id
- staff_id (FK → accounts.id)
- total_amount
- payment_method (Cash | Card | Transfer)
- payment_status (Pending | Paid | Cancelled)
- created_at
- closed_at

### order_details
- id (PK)
- order_id (FK → orders.id)
- product_variant_id (FK → product_variants.id)
- quantity
- voice_note
- original_voice_text
- confidence_score
- status (Pending | Preparing | Ready | Served | Cancelled)
- ordered_at
- ready_at
- early_at

### order_detail_toppings
- id (PK)
- order_detail_id (FK → order_details.id)
- topping_id (FK → toppings.id)
- price_at_purchase

### voice_logs
- id (PK)
- staff_id (FK → accounts.id)
- audio_file_url
- detected_text
- corrected_product_id (FK → products.id)
- created_at
- is_trained
