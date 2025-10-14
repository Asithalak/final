# Online Furniture Showroom System - Backend

## Overview
Backend API for the Online Furniture Showroom System built with Node.js, Express, and MongoDB.

## Tech Stack
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **File Upload**: Multer
- **Password Hashing**: bcryptjs

## Features
- User authentication and authorization (Customer, Carpenter, Admin roles)
- Furniture catalog management
- Order processing and tracking
- Resource (raw materials) marketplace
- Image upload for furniture and resources
- Admin approval workflow for designs and resources
- Review and rating system

## Installation

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables:
Create a `.env` file in the root directory with:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/furniture_showroom
JWT_SECRET=your_secret_key_here
NODE_ENV=development
```

3. Make sure MongoDB is running on your system

4. Start the server:
```bash
# Development mode with auto-restart
npm run dev

# Production mode
npm start
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user profile

### Furniture
- `GET /api/furniture` - Get all approved furniture
- `GET /api/furniture/:id` - Get single furniture item
- `POST /api/furniture` - Upload new furniture design (Carpenter)
- `PUT /api/furniture/:id` - Update furniture (Carpenter)
- `PUT /api/furniture/:id/approve` - Approve furniture (Admin)
- `DELETE /api/furniture/:id` - Delete furniture
- `POST /api/furniture/:id/review` - Add review

### Orders
- `POST /api/orders` - Create new order (Customer)
- `GET /api/orders` - Get orders
- `GET /api/orders/:id` - Get single order
- `PUT /api/orders/:id/status` - Update order status (Admin)
- `PUT /api/orders/:id/payment` - Update payment status (Admin)
- `DELETE /api/orders/:id` - Cancel order

### Resources
- `GET /api/resources` - Get all approved resources
- `GET /api/resources/:id` - Get single resource
- `POST /api/resources` - Upload new resource (Carpenter)
- `PUT /api/resources/:id` - Update resource (Carpenter)
- `PUT /api/resources/:id/approve` - Approve resource (Admin)
- `POST /api/resources/:id/purchase` - Purchase resource (Admin)
- `DELETE /api/resources/:id` - Delete resource

### Users
- `GET /api/users` - Get all users (Admin)
- `GET /api/users/carpenters` - Get approved carpenters
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user profile
- `PUT /api/users/:id/approve` - Approve carpenter (Admin)
- `DELETE /api/users/:id` - Delete user (Admin)

## User Roles

### Customer
- Browse and purchase furniture
- Place orders
- Track order status
- Review furniture items

### Carpenter
- Upload furniture designs
- Upload and sell resources (lumber, materials)
- Manage own listings
- View assigned production orders

### Admin
- Approve furniture designs and resources
- Manage all users, orders, and inventory
- Coordinate between customers and carpenters
- Purchase resources for carpenters
- Handle deliveries

## Database Models

### User
- Authentication credentials
- Role-based access
- Profile information
- Carpenter specialization

### Furniture
- Design details
- Pricing and stock
- Images and materials
- Approval status
- Reviews and ratings

### Order
- Order items and quantities
- Customer and delivery info
- Status tracking
- Payment information
- Carpenter assignment

### Resource
- Material details
- Quantity and pricing
- Seller information
- Approval status

## Security
- Password hashing with bcryptjs
- JWT token authentication
- Role-based authorization middleware
- Input validation
- File upload restrictions

## Project Structure
```
Backend/
├── models/           # Mongoose schemas
├── routes/           # API route handlers
├── middleware/       # Auth and upload middleware
├── uploads/          # Uploaded images storage
├── server.js         # Express app entry point
├── package.json      # Dependencies
└── .env              # Environment variables
```

## Development
Server runs on `http://localhost:5000` by default.

Use tools like Postman or Thunder Client to test API endpoints.

## Author
Furniture Showroom System Team
