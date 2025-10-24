# 📚 Development Guide

## Project Structure Explained

### Backend Architecture

```
Backend/
├── models/              # Database schemas
│   ├── User.js         # User model (Customer, Carpenter, Admin)
│   ├── Furniture.js    # Furniture items
│   ├── Order.js        # Customer orders
│   └── Resource.js     # Raw materials for sale
├── routes/             # API endpoints
│   ├── auth.js         # Authentication routes
│   ├── furniture.js    # Furniture CRUD
│   ├── orders.js       # Order management
│   ├── resources.js    # Resource marketplace
│   └── users.js        # User management
├── middleware/         # Custom middleware
│   ├── auth.js         # JWT authentication
│   └── upload.js       # File upload handling
└── server.js          # Express app setup
```

### Frontend Architecture

```
frontend/src/
├── components/         # Reusable UI components
│   ├── dashboard/     # Role-based dashboards
│   ├── Navbar.js      # Navigation component
│   ├── Footer.js      # Footer component
│   ├── FurnitureCard.js
│   └── PrivateRoute.js
├── context/           # Global state management
│   ├── AuthContext.js # User authentication state
│   └── CartContext.js # Shopping cart state
├── pages/             # Route pages
│   ├── Home.js
│   ├── Catalogue.js
│   ├── Dashboard.js
│   ├── Login.js
│   └── Register.js
├── services/          # API integration
│   └── api.js        # Axios instance & endpoints
└── App.js            # Main app component
```

## 🔐 Authentication Flow

### Registration
1. User fills registration form
2. Frontend sends POST to `/api/auth/register`
3. Backend hashes password with bcrypt
4. User saved to MongoDB
5. JWT token generated and returned
6. Token stored in localStorage
7. User redirected to dashboard

### Login
1. User enters credentials
2. Frontend sends POST to `/api/auth/login`
3. Backend verifies password
4. JWT token generated
5. Token stored in localStorage
6. User data loaded into context

### Protected Routes
1. User tries to access protected route
2. `PrivateRoute` component checks auth status
3. If authenticated → Render component
4. If not → Redirect to login

## 🛒 Shopping Cart Flow

### Add to Cart
```javascript
// In CartContext.js
const addToCart = (furniture, quantity) => {
  // Check if item exists
  // Update quantity or add new item
  // Save to localStorage
  // Show toast notification
}
```

### Checkout
1. User clicks "Checkout" in Cart
2. Check if user is logged in
3. Prepare order data
4. Send POST to `/api/orders`
5. Backend checks stock
6. Create order in database
7. Reduce stock quantity
8. Return order details
9. Clear cart
10. Redirect to order tracking

## 📦 Order Management Flow

### Customer Places Order
```
Customer → Cart → Checkout → Order Created
                              ↓
                         Admin Notified
```

### Admin Processes Order

**If In Stock:**
```
Admin checks stock → Mark as confirmed → Arrange delivery
```

**If Out of Stock:**
```
Admin → Find carpenter → Check resources
         ↓                    ↓
    Assign order         Request materials
         ↓                    ↓
    Carpenter builds     Admin purchases
         ↓                    ↓
    Mark as ready       Deliver to carpenter
         ↓                    ↓
    Arrange delivery    Carpenter builds
```

## 🔧 API Development

### Creating New Endpoint

1. **Create Route Handler** (`Backend/routes/example.js`):
```javascript
const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');

router.get('/', authenticate, async (req, res) => {
  try {
    // Your logic here
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
```

2. **Add to server.js**:
```javascript
const exampleRoutes = require('./routes/example');
app.use('/api/example', exampleRoutes);
```

3. **Create Frontend Service** (`frontend/src/services/api.js`):
```javascript
export const exampleAPI = {
  getData: () => api.get('/example'),
  create: (data) => api.post('/example', data),
};
```

## 🎨 Frontend Component Development

### Creating New Page

1. **Create Component** (`frontend/src/pages/NewPage.js`):
```javascript
import React from 'react';

const NewPage = () => {
  return (
    <div className="container-custom py-8">
      <h1 className="text-3xl font-bold">New Page</h1>
      {/* Your content */}
    </div>
  );
};

export default NewPage;
```

2. **Add Route** (`frontend/src/App.js`):
```javascript
<Route path="/new-page" element={<NewPage />} />
```

3. **Add to Navigation** (`frontend/src/components/Navbar.js`):
```javascript
<Link to="/new-page">New Page</Link>
```

## 🎯 State Management

### Using AuthContext

```javascript
import { useAuth } from '../context/AuthContext';

const MyComponent = () => {
  const { user, login, logout, isAuthenticated } = useAuth();
  
  // Use authentication state
  if (!isAuthenticated) {
    return <LoginPrompt />;
  }
  
  return <div>Welcome {user.name}</div>;
};
```

### Using CartContext

```javascript
import { useCart } from '../context/CartContext';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  
  const handleAdd = () => {
    addToCart(product, 1);
  };
  
  return <button onClick={handleAdd}>Add to Cart</button>;
};
```

## 🎨 Styling Guidelines

### Tailwind CSS Classes

**Buttons:**
```html
<button className="btn-primary">Primary Action</button>
<button className="btn-secondary">Secondary Action</button>
<button className="btn-outline">Outlined</button>
```

**Forms:**
```html
<input className="input-field" type="text" />
```

**Cards:**
```html
<div className="card">
  <div className="p-6">
    {/* Content */}
  </div>
</div>
```

**Containers:**
```html
<div className="container-custom">
  {/* Centered content with max-width */}
</div>
```

## 🐛 Debugging Tips

### Backend Debugging

1. **Check Terminal Logs**
   - All console.log outputs appear here
   - Error stack traces are visible

2. **Use Postman/Thunder Client**
   - Test API endpoints directly
   - View request/response headers

3. **MongoDB Compass**
   - View database contents
   - Run queries manually

### Frontend Debugging

1. **Browser DevTools**
   - Console: View errors and logs
   - Network: Monitor API calls
   - React DevTools: Inspect components

2. **Check Context State**
```javascript
console.log('Auth:', useAuth());
console.log('Cart:', useCart());
```

3. **API Errors**
```javascript
try {
  await api.call();
} catch (error) {
  console.error('API Error:', error.response?.data);
}
```

## 📝 Common Tasks

### Add New Furniture Category

1. **Update Model** (`Backend/models/Furniture.js`):
```javascript
category: {
  enum: ['chair', 'table', 'sofa', 'bed', 'new_category']
}
```

2. **Update Frontend** (`frontend/src/pages/Catalogue.js`):
```javascript
<option value="new_category">New Category</option>
```

### Add New User Role

1. **Update User Model**
2. **Create new middleware check**
3. **Create role-specific dashboard**
4. **Add route protection**

### Add Image Upload

Already implemented! Use:
```javascript
// Frontend
const formData = new FormData();
formData.append('images', file);
await furnitureAPI.create(formData);
```

## 🔒 Security Best Practices

1. **Never commit `.env` files**
2. **Always validate user input**
3. **Use JWT for authentication**
4. **Hash passwords with bcrypt**
5. **Sanitize file uploads**
6. **Implement rate limiting** (future enhancement)

## 🚀 Deployment Checklist

### Backend
- [ ] Set production MongoDB URI
- [ ] Use strong JWT secret
- [ ] Enable CORS for production domain
- [ ] Set NODE_ENV=production
- [ ] Configure file storage (AWS S3 recommended)

### Frontend
- [ ] Update REACT_APP_API_URL to production
- [ ] Run `npm run build`
- [ ] Test production build locally
- [ ] Deploy to hosting (Vercel, Netlify, etc.)

### Database
- [ ] Use MongoDB Atlas for production
- [ ] Set up database backups
- [ ] Create indexes for performance
- [ ] Secure connection string

## 📚 Resources

- [React Docs](https://react.dev)
- [Express.js Guide](https://expressjs.com)
- [MongoDB Manual](https://docs.mongodb.com)
- [Tailwind CSS](https://tailwindcss.com)
- [JWT.io](https://jwt.io)

---

**Happy Coding! 🎉**
