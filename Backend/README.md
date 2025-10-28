# 🏠 Furniture Showroom System - Backend API

> RESTful API for managing furniture catalog, orders, and user interactions

---

## 📋 Overview

Backend server for the Furniture Showroom System built with Node.js, Express, and MongoDB Atlas. Provides secure authentication, role-based access control, and comprehensive furniture management capabilities.

**Live Server:** `http://localhost:8000`  
**Database:** MongoDB Atlas (Cloud)  
**Total Endpoints:** 25 active routes

---

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
Create `.env` file in root directory:
```env
PORT=8000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/furniture_showroom?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_key_here
NODE_ENV=development
```

### 3. Create Admin User
```bash
node create-admin.js
```
Default credentials: `admin@furniture.com` / `admin123`

### 4. Test Database Connection
```bash
node test-connection.js
```

### 5. Start Server
```bash
# Development mode (auto-restart on file save)
npm run dev

# Production mode
npm start
```

**Expected Output:**
```
[nodemon] 3.1.10
[nodemon] watching: server.js routes/ models/ middleware/ .env
🚀 Server running on port 8000
✅ MongoDB connected successfully
```

**✨ Development Mode Features:**
- Auto-restarts when you save any file
- Watches: `server.js`, `routes/`, `models/`, `middleware/`, `.env`
- Ignores: `node_modules/`, `uploads/`, `*.md` files
- Just save your files and see changes immediately!

---

## 🔧 Tech Stack

| Technology | Purpose |
|------------|---------|
| **Node.js** | Runtime environment |
| **Express.js** | Web framework |
| **MongoDB Atlas** | Cloud database |
| **Mongoose** | MongoDB ODM |
| **JWT** | Authentication tokens |
| **bcryptjs** | Password hashing |
| **Multer** | File uploads |
| **CORS** | Cross-origin requests |

---

## 📁 Project Structure

```
Backend/
├── middleware/
│   ├── auth.js              # JWT authentication & role checks
│   └── upload.js            # File upload configuration
├── models/
│   ├── User.js              # User schema with bcrypt
│   ├── Furniture.js         # Furniture catalog schema
│   ├── Order.js             # Order management schema
│   └── Resource.js          # Resource marketplace schema
├── routes/
│   ├── auth.js              # Authentication endpoints (3)
│   ├── furniture.js         # Furniture endpoints (3)
│   ├── orders.js            # Order endpoints (6)
│   ├── resources.js         # Resource endpoints (7)
│   └── users.js             # User management endpoints (7)
├── uploads/                 # Image storage directory
├── .env                     # Environment variables
├── .gitignore              # Git ignore rules
├── create-admin.js         # Admin user setup script
├── package.json            # Dependencies
├── README.md               # This file
├── server.js               # Express app entry point
└── test-connection.js      # Database connection tester
```

---

## 🔐 User Roles & Permissions

### 👤 Customer
- Browse furniture catalog
- Place and track orders
- Review purchased items
- Manage profile

### 🔨 Carpenter
- Upload furniture designs
- List resources for sale
- View assigned orders
- Manage inventory

### 👨‍💼 Admin
- Approve furniture & resources
- Manage all users
- Oversee orders & deliveries
- Access all endpoints

---

## 📡 API Endpoints

### 🔑 Authentication (`/api/auth`)
```
POST   /register        Register new user
POST   /login          User login
GET    /me             Get current user (Protected)
```

### 🪑 Furniture (`/api/furniture`)
```
GET    /               Get all approved furniture (Public)
GET    /:id            Get single furniture (Public)
POST   /               Create furniture (Carpenter + Images)
```

### 📦 Orders (`/api/orders`)
```
POST   /               Create order (Customer)
GET    /               Get orders (Role-based)
GET    /:id            Get single order
PUT    /:id/status     Update status (Admin)
PUT    /:id/payment    Update payment (Admin)
DELETE /:id            Cancel order
```

### 🛠️ Resources (`/api/resources`)
```
GET    /               Get all resources
GET    /:id            Get single resource
POST   /               Upload resource (Carpenter + Images)
PUT    /:id            Update resource (Carpenter)
PUT    /:id/approve    Approve resource (Admin)
POST   /:id/purchase   Purchase resource (Admin)
DELETE /:id            Delete resource
```

### 👥 Users (`/api/users`)
```
GET    /               Get all users (Admin)
GET    /stats          Get user statistics (Admin)
GET    /carpenters     Get approved carpenters (Public)
GET    /:id            Get user by ID
PUT    /:id            Update user profile
PUT    /:id/approve    Approve carpenter (Admin)
DELETE /:id            Delete user (Admin)
```

---

## 🧪 Testing the API

### Health Check
```bash
GET http://localhost:8000/api/health
```
**Response:** `{"status": "OK", "message": "Furniture Showroom API is running"}`

### Register User
```bash
POST http://localhost:8000/api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "customer",
  "phone": "0771234567"
}
```

### Login
```bash
POST http://localhost:8000/api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```
**Save the token from response for protected routes!**

### Protected Endpoint Example
```bash
GET http://localhost:8000/api/auth/me
Authorization: Bearer <your_token_here>
```

---

## 🔒 Security Features

✅ **Password Hashing:** bcrypt with salt rounds  
✅ **JWT Authentication:** 30-day token expiry  
✅ **Role-Based Access:** 3 user roles with permissions  
✅ **Input Validation:** Mongoose schema validation  
✅ **File Upload Security:** Type & size restrictions (5MB max)  
✅ **CORS Enabled:** Cross-origin request handling  

---

## 💾 Database Models

### User Schema
```javascript
{
  name: String (required),
  email: String (required, unique),
  password: String (required, hashed),
  role: Enum['customer', 'carpenter', 'admin'],
  phone: String,
  address: Object,
  specialization: String (carpenter),
  experience: Number (carpenter),
  isApproved: Boolean,
  createdAt: Date
}
```

### Furniture Schema
```javascript
{
  name: String (required),
  description: String,
  category: Enum['chair', 'table', 'sofa', 'bed', ...],
  price: Number (required),
  images: [String],
  materials: [String],
  dimensions: {length, width, height, unit},
  stockQuantity: Number,
  carpenter: ObjectId (ref: User),
  isApproved: Boolean,
  rating: Number,
  reviews: [{user, rating, comment, date}]
}
```

### Order Schema
```javascript
{
  orderNumber: String (auto-generated),
  customer: ObjectId (ref: User),
  items: [{furniture, quantity, price}],
  totalAmount: Number,
  status: Enum['pending', 'confirmed', 'delivered', ...],
  deliveryAddress: Object,
  paymentStatus: Enum['pending', 'paid', 'failed'],
  assignedCarpenter: ObjectId,
  createdAt: Date
}
```

### Resource Schema
```javascript
{
  name: String (required),
  type: Enum['wood', 'metal', 'fabric', ...],
  quantity: Number,
  unit: Enum['piece', 'kg', 'meter', ...],
  pricePerUnit: Number,
  seller: ObjectId (ref: User),
  images: [String],
  isApproved: Boolean,
  status: Enum['available', 'sold_out']
}
```

---

## 🛠️ Utility Scripts

### Create Admin User
```bash
node create-admin.js
```
Creates admin account: `admin@furniture.com` / `admin123`

### Test Database Connection
```bash
node test-connection.js
```
Verifies MongoDB Atlas connection with detailed diagnostics.

---

## ⚡ Common Commands

```bash
# Install dependencies
npm install

# Start development server (auto-restart)
npm run dev

# Start production server
npm start

# Create admin user
node create-admin.js

# Test database connection
node test-connection.js

# Check MongoDB Atlas status
# Go to: https://cloud.mongodb.com/
```

---

## 🐛 Troubleshooting

### Issue: Cannot connect to MongoDB
**Solution:**
1. Go to https://cloud.mongodb.com/
2. Click "Network Access" → "+ ADD IP ADDRESS"
3. Click "ADD CURRENT IP ADDRESS" or "ALLOW ACCESS FROM ANYWHERE"
4. Wait 1-2 minutes, then restart server

### Issue: "Invalid token" error
**Solution:** Token expired. Login again to get new token.

### Issue: "Access denied. Admin only"
**Solution:** This endpoint requires admin role. Use admin credentials.

### Issue: Cluster paused
**Solution:** Go to MongoDB Atlas → Database → Click "Resume" on your cluster.

---

## 📊 Environment Variables

```env
# Server Configuration
PORT=8000                              # Server port
NODE_ENV=development                   # Environment mode

# Database
MONGODB_URI=mongodb+srv://...          # MongoDB Atlas connection string

# Security
JWT_SECRET=your_secret_key             # JWT signing key (change in production!)

# File Upload (Optional)
MAX_FILE_SIZE=5242880                  # 5MB in bytes
```

---

## 🚀 Deployment Checklist

Before deploying to production:

- [ ] Change `JWT_SECRET` to strong random string
- [ ] Update MongoDB connection string
- [ ] Set `NODE_ENV=production`
- [ ] Configure proper CORS origins
- [ ] Enable HTTPS/SSL
- [ ] Add rate limiting
- [ ] Set up logging service
- [ ] Configure cloud storage for images
- [ ] Whitelist only server IPs in MongoDB Atlas
- [ ] Enable MongoDB Atlas backup
- [ ] Set up monitoring (e.g., PM2, New Relic)

---

## 📝 API Response Format

### Success Response
```json
{
  "message": "Operation successful",
  "data": { ... }
}
```

### Error Response
```json
{
  "message": "Error description",
  "error": "Detailed error message (development only)"
}
```

### HTTP Status Codes
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Server Error

---

## 👨‍💻 Development Tips

### Testing with Postman
1. Create "Furniture Showroom" collection
2. Add environment variable: `{{baseUrl}}` = `http://localhost:8000`
3. Add environment variable: `{{token}}` = your JWT token
4. Use `{{baseUrl}}/api/...` in requests
5. Add `Authorization: Bearer {{token}}` header for protected routes

### File Upload Format
Use `form-data` in Postman:
- Key: `images` (type: File)
- Select up to 5 images for furniture, 3 for resources

---

## 📞 Support

**Issues?** Check `test-connection.js` output for diagnostics.

**Database Issues?** Visit https://cloud.mongodb.com/ → Network Access

**API Documentation?** All endpoints documented above

---

## ✅ Status

**Backend:** ✅ Production Ready  
**Database:** ✅ MongoDB Atlas Connected  
**API Endpoints:** ✅ 25 Routes Active  
**Security:** ✅ JWT + Role-Based Access  
**File Upload:** ✅ Multer Configured  

---

**Version:** 1.0.0  
**Last Updated:** October 2025  
**License:** MIT  
**Author:** Furniture Showroom Team
