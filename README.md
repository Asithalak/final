# Online Furniture Showroom System

A full-stack web application for an online furniture showroom where customers can browse and purchase furniture, carpenters can upload designs and sell materials, and admins manage the entire ecosystem.

## 🎯 Project Overview

**Frontend**: React + Tailwind CSS  
**Backend**: Node.js + Express  
**Database**: MongoDB

This platform connects three types of users:
- **Customers** - Browse, order, and purchase furniture online
- **Carpenters** - Upload furniture designs, sell raw materials (lumber, etc.)
- **Admins** - Manage customers, carpenters, orders, resources, and deliveries

## ✨ Key Features

### Customer Features
- Browse furniture catalogue with advanced filters
- View detailed product information with images
- Add items to cart and place orders
- Track order status in real-time
- Submit reviews and ratings
- View order history

### Carpenter Features
- Upload furniture designs with images
- List raw materials for sale
- Manage own listings
- View assigned production orders
- Track approval status from admin

### Admin Features
- Approve furniture designs and resource listings
- Approve carpenter registrations
- Manage all users, orders, and inventory
- Coordinate between customers and carpenters
- Handle out-of-stock orders
- Purchase resources for carpenters
- Arrange deliveries

## 🏗️ System Architecture

```
┌─────────────────┐
│  React Frontend │ (Port 3000)
│  + Tailwind CSS │
└────────┬────────┘
         │ REST API
         │
┌────────▼────────┐
│ Express Backend │ (Port 5000)
│    + Node.js    │
└────────┬────────┘
         │ Mongoose ODM
         │
┌────────▼────────┐
│    MongoDB      │
│    Database     │
└─────────────────┘
```

## 📋 Use Cases

### Use Case 1: Customer Orders Furniture
1. Customer browses furniture catalog
2. Customer selects furniture and places order
3. System checks showroom stock
4. If available → Admin arranges delivery
5. If not available → Admin contacts carpenter for production

### Use Case 2: Upload Furniture Design
1. Carpenter uploads design with details
2. Admin reviews and approves design
3. Design is added to showroom catalog
4. Customers can now order the design

### Use Case 3: Handle Out-of-Stock Order
1. Admin identifies carpenter who owns design
2. Admin contacts carpenter
3. Carpenter checks resource availability
4. If resources available → Starts production
5. If not → Carpenter requests resources from admin

### Use Case 4: Upload & Sell Resources
1. Carpenter uploads sellable resources
2. Admin verifies and approves listing
3. Resource becomes available in system
4. Admins/carpenters can purchase resources

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (running locally or connection string)
- npm or yarn

### Installation

#### 1. Clone the repository
```bash
git clone <repository-url>
cd final
```

#### 2. Backend Setup
```bash
cd Backend
npm install

# Configure environment variables
# Edit .env file with your settings:
# PORT=5000
# MONGODB_URI=mongodb://localhost:27017/furniture_showroom
# JWT_SECRET=your_secret_key

# Start backend server
npm run dev
```

#### 3. Frontend Setup
```bash
cd frontend
npm install

# Configure environment variables
# Edit .env file:
# REACT_APP_API_URL=http://localhost:5000/api

# Start frontend
npm start
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## 📁 Project Structure

```
final/
├── Backend/
│   ├── models/              # Mongoose schemas
│   │   ├── User.js
│   │   ├── Furniture.js
│   │   ├── Order.js
│   │   └── Resource.js
│   ├── routes/              # API routes
│   │   ├── auth.js
│   │   ├── furniture.js
│   │   ├── orders.js
│   │   ├── resources.js
│   │   └── users.js
│   ├── middleware/          # Auth & upload middleware
│   ├── uploads/             # Uploaded images
│   ├── server.js            # Express app entry
│   ├── package.json
│   └── .env
│
└── frontend/
    ├── public/
    ├── src/
    │   ├── components/      # React components
    │   │   ├── dashboard/
    │   │   ├── Navbar.js
    │   │   ├── Footer.js
    │   │   └── ...
    │   ├── context/         # React Context
    │   │   ├── AuthContext.js
    │   │   └── CartContext.js
    │   ├── pages/           # Page components
    │   │   ├── Home.js
    │   │   ├── Catalogue.js
    │   │   ├── Dashboard.js
    │   │   └── ...
    │   ├── services/        # API integration
    │   │   └── api.js
    │   ├── App.js
    │   └── index.js
    ├── package.json
    ├── tailwind.config.js
    └── .env
```

## 🔐 Authentication & Authorization

The system uses JWT (JSON Web Tokens) for authentication with role-based access control:

- **Customer Role**: Can browse, order, and review furniture
- **Carpenter Role**: Can upload designs and resources
- **Admin Role**: Full system access and management

## 📊 Database Models

### User
- Authentication credentials
- Role (customer/carpenter/admin)
- Profile information
- Carpenter specialization (for carpenters)

### Furniture
- Name, description, category
- Price, images, materials
- Stock quantity
- Carpenter reference
- Approval status
- Reviews and ratings

### Order
- Order number
- Customer reference
- Order items with quantities
- Delivery address
- Status tracking
- Payment information
- Assigned carpenter

### Resource
- Name, type, description
- Quantity and unit
- Price per unit
- Seller (carpenter) reference
- Approval status

## 🎨 Tech Stack Details

### Backend
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **Multer** - File uploads
- **CORS** - Cross-origin resource sharing

### Frontend
- **React 18** - UI library
- **React Router v6** - Routing
- **Tailwind CSS** - Styling
- **Axios** - HTTP client
- **React Toastify** - Notifications
- **React Icons** - Icon library
- **Context API** - State management

## 🔑 Demo Credentials

After setting up, you can create test accounts or use:

**Admin Account** (create manually in MongoDB):
```javascript
{
  name: "Admin User",
  email: "admin@furnihome.com",
  password: "admin123", // Will be hashed
  role: "admin"
}
```

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get current user

### Furniture
- `GET /api/furniture` - Get all furniture
- `POST /api/furniture` - Create furniture (Carpenter)
- `PUT /api/furniture/:id/approve` - Approve (Admin)

### Orders
- `POST /api/orders` - Create order (Customer)
- `GET /api/orders` - Get orders
- `PUT /api/orders/:id/status` - Update status (Admin)

### Resources
- `GET /api/resources` - Get resources
- `POST /api/resources` - Create resource (Carpenter)
- `POST /api/resources/:id/purchase` - Purchase (Admin)

### Users
- `GET /api/users/carpenters` - Get carpenters
- `PUT /api/users/:id/approve` - Approve carpenter (Admin)

## 🎯 Future Enhancements

- [ ] Payment gateway integration (Stripe, PayPal)
- [ ] Real-time notifications (Socket.io)
- [ ] Advanced analytics dashboard
- [ ] Email notifications
- [ ] Live chat support
- [ ] Wishlist functionality
- [ ] Product recommendations
- [ ] Mobile app (React Native)

## 🤝 Contributing

Contributions are welcome! Please follow these steps:
1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a pull request

## 📝 License

This project is licensed under the ISC License.

## 👥 Authors

Furniture Showroom System Development Team

## 📞 Support

For issues and questions:
- Email: support@furnihome.com
- GitHub Issues: [Create an issue]

---

**Built with ❤️ using React, Node.js, and MongoDB**
