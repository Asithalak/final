# API Endpoints Documentation

## 🚀 Furniture Showroom API - Complete Endpoint Reference

**Base URL:** `http://localhost:8000`

---

## 🔐 **Authentication Endpoints**

### 1. Register User
- **Endpoint:** `POST /api/auth/register`
- **Access:** Public
- **Description:** Register a new user (Customer, Carpenter, or Admin)

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "customer",
  "phone": "0771234567",
  "address": "123 Main St, Colombo",
  "specialization": "Custom Furniture",
  "experience": 5
}
```

**Response:**
```json
{
  "_id": "...",
  "name": "John Doe",
  "email": "john@example.com",
  "role": "customer",
  "isApproved": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

### 2. Login User
- **Endpoint:** `POST /api/auth/login`
- **Access:** Public
- **Description:** Authenticate user and get JWT token

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "_id": "...",
  "name": "John Doe",
  "email": "john@example.com",
  "role": "customer",
  "isApproved": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

### 3. Get Current User
- **Endpoint:** `GET /api/auth/me`
- **Access:** Private (Requires JWT token)
- **Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "_id": "...",
  "name": "John Doe",
  "email": "john@example.com",
  "role": "customer",
  "phone": "0771234567",
  "address": {...}
}
```

---

## 🪑 **Furniture Endpoints**

### 1. Get All Furniture
- **Endpoint:** `GET /api/furniture`
- **Access:** Public
- **Query Parameters:**
  - `category` - Filter by category
  - `search` - Search in name/description
  - `minPrice` - Minimum price
  - `maxPrice` - Maximum price

**Example:** `GET /api/furniture?category=chair&minPrice=5000&maxPrice=20000`

**Response:**
```json
[
  {
    "_id": "...",
    "name": "Wooden Chair",
    "description": "...",
    "category": "chair",
    "price": 15000,
    "images": ["uploads/..."],
    "materials": ["Teak Wood"],
    "dimensions": {...},
    "carpenter": {
      "_id": "...",
      "name": "Mike Carpenter",
      "email": "mike@example.com"
    },
    "rating": 4.5
  }
]
```

---

### 2. Get Single Furniture
- **Endpoint:** `GET /api/furniture/:id`
- **Access:** Public

**Response:**
```json
{
  "_id": "...",
  "name": "Wooden Chair",
  "description": "High-quality wooden chair",
  "category": "chair",
  "price": 15000,
  "images": ["uploads/chair-123.jpg"],
  "materials": ["Teak Wood", "Varnish"],
  "dimensions": {
    "length": 45,
    "width": 50,
    "height": 90,
    "unit": "cm"
  },
  "stockQuantity": 10,
  "carpenter": {
    "_id": "...",
    "name": "Mike Carpenter",
    "specialization": "Custom Furniture"
  },
  "reviews": [...]
}
```

---

### 3. Create Furniture
- **Endpoint:** `POST /api/furniture`
- **Access:** Private (Carpenter only)
- **Headers:** `Authorization: Bearer <token>`
- **Content-Type:** `multipart/form-data`

**Form Data:**
```
name: "Wooden Chair"
description: "High-quality wooden chair"
category: "chair"
price: 15000
materials: ["Teak Wood", "Varnish"]  // JSON string
dimensions: {"length": 45, "width": 50, "height": 90, "unit": "cm"}  // JSON string
stockQuantity: 10
brand: "Custom Crafts"
images: [File, File, File]  // Max 5 images
```

**Response:**
```json
{
  "message": "Furniture design uploaded successfully. Pending admin approval.",
  "furniture": {...}
}
```

---

## 📦 **Order Endpoints**

### 1. Create Order
- **Endpoint:** `POST /api/orders`
- **Access:** Private (Customer)
- **Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "items": [
    {
      "furniture": "furniture_id_here",
      "quantity": 2
    }
  ],
  "deliveryAddress": {
    "street": "123 Main St",
    "city": "Colombo",
    "state": "Western",
    "zipCode": "10400",
    "country": "Sri Lanka"
  },
  "paymentMethod": "cash",
  "notes": "Please deliver before 5 PM"
}
```

**Response:**
```json
{
  "message": "Order placed successfully",
  "order": {
    "_id": "...",
    "orderNumber": "ORD1697123456789",
    "customer": "...",
    "items": [...],
    "totalAmount": 30000,
    "status": "pending"
  }
}
```

---

### 2. Get All Orders
- **Endpoint:** `GET /api/orders`
- **Access:** Private (Role-based)
  - Customer: See own orders
  - Carpenter: See orders containing their furniture
  - Admin: See all orders
- **Headers:** `Authorization: Bearer <token>`

---

### 3. Get Single Order
- **Endpoint:** `GET /api/orders/:id`
- **Access:** Private (Authorized users only)
- **Headers:** `Authorization: Bearer <token>`

---

### 4. Update Order Status
- **Endpoint:** `PUT /api/orders/:id/status`
- **Access:** Private (Admin only)
- **Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "status": "in_production",
  "assignedCarpenter": "carpenter_id",
  "productionStatus": "in_progress"
}
```

---

### 5. Update Payment Status
- **Endpoint:** `PUT /api/orders/:id/payment`
- **Access:** Private (Admin only)
- **Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "paymentStatus": "paid"
}
```

---

### 6. Cancel Order
- **Endpoint:** `DELETE /api/orders/:id`
- **Access:** Private (Customer - own orders, Admin)
- **Headers:** `Authorization: Bearer <token>`

---

## 🛠️ **Resource Endpoints**

### 1. Get All Resources
- **Endpoint:** `GET /api/resources`
- **Access:** Private
- **Headers:** `Authorization: Bearer <token>`
- **Query Parameters:**
  - `type` - Filter by resource type
  - `search` - Search in name/description

---

### 2. Get Single Resource
- **Endpoint:** `GET /api/resources/:id`
- **Access:** Private
- **Headers:** `Authorization: Bearer <token>`

---

### 3. Upload Resource
- **Endpoint:** `POST /api/resources`
- **Access:** Private (Carpenter only)
- **Headers:** `Authorization: Bearer <token>`
- **Content-Type:** `multipart/form-data`

**Form Data:**
```
name: "Teak Wood"
type: "wood"
description: "High-quality teak wood"
quantity: 100
unit: "piece"
pricePerUnit: 5000
specifications: {"grade": "A+", "origin": "Sri Lanka"}  // JSON string
images: [File, File, File]  // Max 3 images
```

---

### 4. Update Resource
- **Endpoint:** `PUT /api/resources/:id`
- **Access:** Private (Carpenter - own resources)
- **Headers:** `Authorization: Bearer <token>`

---

### 5. Approve Resource
- **Endpoint:** `PUT /api/resources/:id/approve`
- **Access:** Private (Admin only)
- **Headers:** `Authorization: Bearer <token>`

---

### 6. Purchase Resource
- **Endpoint:** `POST /api/resources/:id/purchase`
- **Access:** Private (Admin only)
- **Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "quantity": 10,
  "recipientCarpenter": "carpenter_id"
}
```

---

### 7. Delete Resource
- **Endpoint:** `DELETE /api/resources/:id`
- **Access:** Private (Admin or Carpenter - own resources)
- **Headers:** `Authorization: Bearer <token>`

---

## 👥 **User Management Endpoints**

### 1. Get All Users
- **Endpoint:** `GET /api/users`
- **Access:** Private (Admin only)
- **Headers:** `Authorization: Bearer <token>`
- **Query Parameters:**
  - `role` - Filter by role (customer, carpenter, admin)

---

### 2. Get All Carpenters
- **Endpoint:** `GET /api/users/carpenters`
- **Access:** Public

**Response:**
```json
[
  {
    "_id": "...",
    "name": "Mike Carpenter",
    "email": "mike@example.com",
    "specialization": "Custom Furniture",
    "experience": 5,
    "isApproved": true
  }
]
```

---

### 3. Get User by ID
- **Endpoint:** `GET /api/users/:id`
- **Access:** Private
- **Headers:** `Authorization: Bearer <token>`

---

### 4. Update User Profile
- **Endpoint:** `PUT /api/users/:id`
- **Access:** Private (Own profile or Admin)
- **Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "name": "Updated Name",
  "phone": "0771234567",
  "address": "New Address",
  "specialization": "Updated Specialization",
  "experience": 7
}
```

---

### 5. Approve Carpenter
- **Endpoint:** `PUT /api/users/:id/approve`
- **Access:** Private (Admin only)
- **Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "message": "Carpenter approved successfully",
  "user": {...}
}
```

---

### 6. Delete User
- **Endpoint:** `DELETE /api/users/:id`
- **Access:** Private (Admin only)
- **Headers:** `Authorization: Bearer <token>`

---

## 🏥 **Health Check**

### Health Check
- **Endpoint:** `GET /api/health`
- **Access:** Public

**Response:**
```json
{
  "status": "OK",
  "message": "Furniture Showroom API is running"
}
```

---

## 📋 **Status Enums**

### Order Status
- `pending`
- `confirmed`
- `in_production`
- `ready`
- `out_for_delivery`
- `delivered`
- `cancelled`

### Payment Status
- `pending`
- `paid`
- `failed`
- `refunded`

### Furniture Categories
- `chair`
- `table`
- `sofa`
- `bed`
- `cabinet`
- `desk`
- `shelf`
- `other`

### Resource Types
- `lumber`
- `wood`
- `metal`
- `fabric`
- `glass`
- `hardware`
- `paint`
- `other`

### Resource Units
- `piece`
- `kg`
- `meter`
- `sqft`
- `liter`
- `box`

---

## 🔑 **Authentication Header Format**

For all protected endpoints, include the JWT token in the Authorization header:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## ⚠️ **Error Responses**

All endpoints return appropriate HTTP status codes and error messages:

**400 Bad Request:**
```json
{
  "message": "User already exists"
}
```

**401 Unauthorized:**
```json
{
  "message": "Invalid token"
}
```

**403 Forbidden:**
```json
{
  "message": "Access denied. Admin only."
}
```

**404 Not Found:**
```json
{
  "message": "Furniture not found"
}
```

**500 Server Error:**
```json
{
  "message": "Server error",
  "error": "Error details here"
}
```

---

**API Version:** 1.0  
**Last Updated:** October 15, 2025  
**Server Status:** ✅ Running on port 8000
