# 🚀 Quick Start Guide - Furniture Showroom System

## Prerequisites Checklist
- ✅ Node.js installed (v14+)
- ✅ MongoDB installed and running
- ✅ Terminal/Command Prompt open

## Step-by-Step Setup

### 1️⃣ Start MongoDB
```bash
# Windows (if MongoDB is installed as service)
# It should already be running

# Or start manually
mongod

# Verify MongoDB is running on port 27017
```

### 2️⃣ Start the Backend Server

Open a terminal in the project directory:

```bash
cd d:\final\Backend
npm start
```

**Expected Output:**
```
🚀 Server running on port 5000
✅ MongoDB connected successfully
```

**Backend will be available at:** http://localhost:5000

### 3️⃣ Start the Frontend Application

Open a **NEW** terminal (keep backend running):

```bash
cd d:\final\frontend
npm start
```

**Expected Output:**
```
Compiled successfully!

You can now view furniture-showroom-frontend in the browser.

  Local:            http://localhost:3000
  On Your Network:  http://192.168.x.x:3000
```

Your browser should automatically open to http://localhost:3000

### 4️⃣ Create Admin Account (First Time Only)

Since there's no admin yet, you need to create one manually:

**Option A: Using MongoDB Compass (GUI)**
1. Open MongoDB Compass
2. Connect to `mongodb://localhost:27017`
3. Create database: `furniture_showroom`
4. Create collection: `users`
5. Insert document:
```json
{
  "name": "Admin User",
  "email": "admin@furnihome.com",
  "password": "$2a$10$YourHashedPasswordHere",
  "role": "admin",
  "isApproved": true,
  "createdAt": new Date()
}
```

**Option B: Register normally and manually change role**
1. Go to http://localhost:3000/register
2. Register as a customer
3. Open MongoDB and find your user
4. Change `role` field to `"admin"`

**Option C: Use the register API with admin role** (Easiest)
Open another terminal:
```bash
curl -X POST http://localhost:5000/api/auth/register -H "Content-Type: application/json" -d "{\"name\":\"Admin User\",\"email\":\"admin@furnihome.com\",\"password\":\"admin123\",\"role\":\"admin\"}"
```

Or use Postman/Thunder Client to send POST request to:
- URL: `http://localhost:5000/api/auth/register`
- Body (JSON):
```json
{
  "name": "Admin User",
  "email": "admin@furnihome.com",
  "password": "admin123",
  "role": "admin"
}
```

### 5️⃣ Login and Explore

**Admin Login:**
- Email: admin@furnihome.com
- Password: admin123

**Create Test Accounts:**

**Customer Account:**
1. Go to Register page
2. Fill form with role: "Customer"
3. Login and browse furniture

**Carpenter Account:**
1. Go to Register page
2. Fill form with role: "Carpenter"
3. Add specialization and experience
4. Wait for admin approval (login as admin and approve)

## 🎯 Testing the Application

### As Customer:
1. ✅ Browse catalogue
2. ✅ Add items to cart
3. ✅ Place an order
4. ✅ View order status in Dashboard
5. ✅ Track order

### As Carpenter:
1. ✅ Upload furniture design
2. ✅ List resources for sale
3. ✅ View assigned orders
4. ✅ Wait for admin approval

### As Admin:
1. ✅ Approve carpenter registrations
2. ✅ Approve furniture designs
3. ✅ Approve resource listings
4. ✅ Manage all orders
5. ✅ View system statistics

## 📁 Important Files

**Backend Configuration:**
- `Backend/.env` - Database and JWT settings
- `Backend/server.js` - Main server file

**Frontend Configuration:**
- `frontend/.env` - API URL configuration
- `frontend/src/App.js` - Main app component

## 🐛 Troubleshooting

### Backend won't start
- ✅ Check MongoDB is running
- ✅ Verify `.env` file exists in Backend folder
- ✅ Check port 5000 is not in use

### Frontend won't start
- ✅ Check `.env` file exists in frontend folder
- ✅ Check port 3000 is not in use
- ✅ Verify backend is running first

### Can't login
- ✅ Verify backend is running
- ✅ Check MongoDB connection
- ✅ Check browser console for errors

### Images not showing
- ✅ Verify `Backend/uploads` folder exists
- ✅ Check file upload permissions
- ✅ Ensure backend is serving static files

## 🔧 Common Commands

**Backend:**
```bash
# Start development server
cd Backend
npm run dev

# Start production server
npm start
```

**Frontend:**
```bash
# Start development server
cd frontend
npm start

# Build for production
npm run build
```

## 📊 Default Ports

- Frontend: `http://localhost:3000`
- Backend: `http://localhost:5000`
- MongoDB: `mongodb://localhost:27017`

## 🎨 Features to Test

### Workflow 1: Complete Customer Journey
1. Register as customer
2. Browse catalogue
3. Add items to cart
4. Checkout and place order
5. Track order status
6. Submit review after delivery

### Workflow 2: Carpenter Journey
1. Register as carpenter
2. Admin approves account
3. Upload furniture design
4. Admin approves design
5. Design appears in catalogue
6. List resources for sale

### Workflow 3: Admin Workflow
1. Login as admin
2. Approve pending carpenters
3. Approve pending furniture
4. Approve pending resources
5. Manage orders
6. Update order status

## 💡 Tips

- Keep both terminals (backend & frontend) open while developing
- Use Chrome DevTools for debugging frontend
- Check terminal logs for backend errors
- MongoDB Compass is useful for viewing database data

## 🎉 You're Ready!

Your Online Furniture Showroom System is now running!

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- API Health: http://localhost:5000/api/health

**Happy coding! 🚀**
