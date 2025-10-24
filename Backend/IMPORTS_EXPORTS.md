# Backend Imports & Exports Reference

## 📋 Complete Imports and Exports Documentation

This document provides a comprehensive overview of all imports (`const`) and exports (`module.exports`) in the Backend project.

---

## 🟢 **Entry Point**

### **server.js**

**Imports:**
```javascript
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth');
const furnitureRoutes = require('./routes/furniture');
const orderRoutes = require('./routes/orders');
const resourceRoutes = require('./routes/resources');
const userRoutes = require('./routes/users');
```

**Exports:** None (Entry point - starts the server)

**Port:** 8000

---

## 🔵 **Middleware**

### **middleware/auth.js**

**Imports:**
```javascript
const jwt = require('jsonwebtoken');
const User = require('../models/User');
```

**Exports:**
```javascript
exports.authenticate      // JWT authentication middleware
exports.isAdmin          // Admin role check
exports.isCarpenter      // Carpenter role check
exports.isCustomer       // Customer role check
```

---

### **middleware/upload.js**

**Imports:**
```javascript
const multer = require('multer');
const path = require('path');
```

**Exports:**
```javascript
module.exports = upload  // Configured multer instance for file uploads
```

**Configuration:**
- Max file size: 5MB
- Allowed types: jpeg, jpg, png, gif, webp
- Storage: Local disk (uploads/ folder)

---

## 🟡 **Models (Database Schemas)**

### **models/User.js**

**Imports:**
```javascript
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
```

**Exports:**
```javascript
module.exports = mongoose.model('User', userSchema);
```

**Schema Fields:**
- name, email, password, role, phone, address, profileImage
- specialization, experience (for carpenters)
- isApproved, createdAt

**Instance Methods:**
- `comparePassword(candidatePassword)` - Verify password

**Hooks:**
- `pre('save')` - Hash password before saving

---

### **models/Furniture.js**

**Imports:**
```javascript
const mongoose = require('mongoose');
```

**Exports:**
```javascript
module.exports = mongoose.model('Furniture', furnitureSchema);
```

**Schema Fields:**
- name, description, category, price, images, materials
- dimensions (length, width, height, unit)
- stockQuantity, carpenter, brand
- isApproved, status, rating, reviews
- createdAt, updatedAt

**Hooks:**
- `pre('save')` - Update updatedAt timestamp

---

### **models/Order.js**

**Imports:**
```javascript
const mongoose = require('mongoose');
```

**Exports:**
```javascript
module.exports = mongoose.model('Order', orderSchema);
```

**Schema Fields:**
- orderNumber, customer, items, totalAmount
- status, deliveryAddress, paymentStatus, paymentMethod
- notes, assignedCarpenter, productionStatus
- deliveryDate, createdAt, updatedAt

**Hooks:**
- `pre('save')` - Update updatedAt timestamp
- `pre('save')` - Auto-generate order number

---

### **models/Resource.js**

**Imports:**
```javascript
const mongoose = require('mongoose');
```

**Exports:**
```javascript
module.exports = mongoose.model('Resource', resourceSchema);
```

**Schema Fields:**
- name, type, description, quantity, unit
- pricePerUnit, seller, images, specifications
- isApproved, status, createdAt, updatedAt

**Hooks:**
- `pre('save')` - Update timestamp & check stock

---

## 🟣 **Routes (API Endpoints)**

### **routes/auth.js**

**Imports:**
```javascript
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { authenticate } = require('../middleware/auth');
```

**Helper Functions:**
```javascript
const generateToken = (id) => { ... }  // Create JWT token
```

**Routes:**
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user (Protected)

**Exports:**
```javascript
module.exports = router;
```

---

### **routes/furniture.js**

**Imports:**
```javascript
const express = require('express');
const router = express.Router();
const Furniture = require('../models/Furniture');
const { authenticate, isAdmin, isCarpenter } = require('../middleware/auth');
const upload = require('../middleware/upload');
```

**Routes (Active):**
- `GET /api/furniture` - Get all approved furniture (Public)
- `GET /api/furniture/:id` - Get single furniture (Public)
- `POST /api/furniture` - Create furniture (Carpenter + upload images)

**Routes (Commented - Can be activated):**
- `PUT /api/furniture/:id` - Update furniture
- `PUT /api/furniture/:id/approve` - Approve furniture (Admin)
- `DELETE /api/furniture/:id` - Delete furniture
- `POST /api/furniture/:id/review` - Add review

**Exports:**
```javascript
module.exports = router;
```

---

### **routes/orders.js**

**Imports:**
```javascript
const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Furniture = require('../models/Furniture');
const { authenticate, isAdmin } = require('../middleware/auth');
```

**Routes:**
- `POST /api/orders` - Create new order (Customer)
- `GET /api/orders` - Get all orders (Role-based)
- `GET /api/orders/:id` - Get single order
- `PUT /api/orders/:id/status` - Update order status (Admin)
- `PUT /api/orders/:id/payment` - Update payment status (Admin)
- `DELETE /api/orders/:id` - Cancel order

**Exports:**
```javascript
module.exports = router;
```

---

### **routes/resources.js**

**Imports:**
```javascript
const express = require('express');
const router = express.Router();
const Resource = require('../models/Resource');
const { authenticate, isAdmin, isCarpenter } = require('../middleware/auth');
const upload = require('../middleware/upload');
```

**Routes:**
- `GET /api/resources` - Get all approved resources
- `GET /api/resources/:id` - Get single resource
- `POST /api/resources` - Upload new resource (Carpenter)
- `PUT /api/resources/:id` - Update resource (Carpenter)
- `PUT /api/resources/:id/approve` - Approve resource (Admin)
- `POST /api/resources/:id/purchase` - Purchase resource (Admin)
- `DELETE /api/resources/:id` - Delete resource

**Exports:**
```javascript
module.exports = router;
```

---

### **routes/users.js**

**Imports:**
```javascript
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { authenticate, isAdmin } = require('../middleware/auth');
```

**Routes:**
- `GET /api/users` - Get all users (Admin)
- `GET /api/users/carpenters` - Get approved carpenters (Public)
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user profile
- `PUT /api/users/:id/approve` - Approve carpenter (Admin)
- `DELETE /api/users/:id` - Delete user (Admin)

**Exports:**
```javascript
module.exports = router;
```

---

## 📊 **Dependency Flow Chart**

```
server.js (Entry Point)
│
├── External Dependencies
│   ├── express
│   ├── mongoose
│   ├── cors
│   └── dotenv
│
├── Route Imports
│   ├── routes/auth.js
│   │   ├── jwt
│   │   ├── models/User
│   │   └── middleware/auth
│   │
│   ├── routes/furniture.js
│   │   ├── models/Furniture
│   │   ├── middleware/auth
│   │   └── middleware/upload
│   │
│   ├── routes/orders.js
│   │   ├── models/Order
│   │   ├── models/Furniture
│   │   └── middleware/auth
│   │
│   ├── routes/resources.js
│   │   ├── models/Resource
│   │   ├── middleware/auth
│   │   └── middleware/upload
│   │
│   └── routes/users.js
│       ├── models/User
│       └── middleware/auth
│
├── Middleware
│   ├── middleware/auth.js
│   │   ├── jwt
│   │   └── models/User
│   │
│   └── middleware/upload.js
│       ├── multer
│       └── path
│
└── Models
    ├── models/User.js (mongoose, bcryptjs)
    ├── models/Furniture.js (mongoose)
    ├── models/Order.js (mongoose)
    └── models/Resource.js (mongoose)
```

---

## 🎯 **Quick Reference Table**

| Category | File | Imports | Exports | Description |
|----------|------|---------|---------|-------------|
| **Entry** | server.js | 9 | None | Express app & server |
| **Middleware** | auth.js | 2 | 4 functions | JWT & role authentication |
| **Middleware** | upload.js | 2 | 1 object | File upload configuration |
| **Model** | User.js | 2 | 1 model | User schema with auth |
| **Model** | Furniture.js | 1 | 1 model | Furniture catalog schema |
| **Model** | Order.js | 1 | 1 model | Order management schema |
| **Model** | Resource.js | 1 | 1 model | Resource marketplace schema |
| **Route** | auth.js | 5 | 1 router | Authentication endpoints (3) |
| **Route** | furniture.js | 5 | 1 router | Furniture endpoints (3 active) |
| **Route** | orders.js | 4 | 1 router | Order endpoints (6) |
| **Route** | resources.js | 5 | 1 router | Resource endpoints (7) |
| **Route** | users.js | 3 | 1 router | User management endpoints (6) |

---

## ✅ **Code Quality Status**

- ✅ All files use CommonJS syntax (require/module.exports)
- ✅ No syntax errors detected
- ✅ Consistent import/export patterns
- ✅ Proper middleware chain usage
- ✅ RESTful API structure
- ✅ Role-based access control implemented
- ✅ File upload handling configured
- ✅ Error handling in all routes

---

## 📝 **Notes**

1. **Authentication Flow**: All protected routes use `authenticate` middleware first, then role-specific middleware (isAdmin, isCarpenter, isCustomer) if needed.

2. **File Uploads**: Furniture and Resources routes support image uploads using multer middleware.

3. **Database Models**: All models use Mongoose ODM with proper schema validation and hooks.

4. **Error Handling**: Every route includes try-catch blocks for proper error handling.

5. **Commented Routes**: Some routes in furniture.js are commented out but ready to be activated when needed.

---

**Last Updated:** October 15, 2025  
**Backend Status:** ✅ All files error-free and functional
