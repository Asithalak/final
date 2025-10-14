# Online Furniture Showroom System - Frontend

## Overview
React frontend application for the Online Furniture Showroom System, styled with Tailwind CSS.

## Tech Stack
- **Framework**: React 18
- **Styling**: Tailwind CSS
- **Routing**: React Router v6
- **State Management**: React Context API
- **HTTP Client**: Axios
- **Notifications**: React Toastify
- **Icons**: React Icons

## Features

### For Customers
- Browse furniture catalogue with filters
- View detailed furniture information
- Add items to cart
- Place and track orders
- Submit reviews and ratings
- View order history

### For Carpenters
- Upload furniture designs
- List resources for sale
- View assigned production orders
- Manage listings
- Track approval status

### For Admins
- Approve furniture designs and resources
- Approve carpenter accounts
- Manage all orders
- View system statistics
- Coordinate between customers and carpenters

## Installation

1. Install dependencies:
```bash
npm install
```

2. Configure environment:
Create a `.env` file with:
```
REACT_APP_API_URL=http://localhost:5000/api
```

3. Start development server:
```bash
npm start
```

The app will run on `http://localhost:3000`

## Available Scripts

- `npm start` - Run development server
- `npm build` - Build for production
- `npm test` - Run tests
- `npm run eject` - Eject from Create React App

## Pages

### Public Pages
- **Home** (`/`) - Landing page with features and categories
- **Catalogue** (`/catalogue`) - Browse furniture with filters
- **Furniture Detail** (`/furniture/:id`) - Detailed product view
- **Brands** (`/brands`) - Browse furniture brands
- **Offers** (`/offers`) - Special deals and promotions
- **Login** (`/login`) - User authentication
- **Register** (`/register`) - New user registration
- **Cart** (`/cart`) - Shopping cart

### Protected Pages
- **Dashboard** (`/dashboard`) - Role-based dashboard
  - Customer: View orders and profile
  - Carpenter: Manage designs and resources
  - Admin: Approve items and manage system
- **Order Tracking** (`/orders/:id`) - Track order status

## Components

### Layout Components
- `Navbar` - Navigation with cart and user menu
- `Footer` - Site footer with links
- `PrivateRoute` - Protected route wrapper

### Feature Components
- `FurnitureCard` - Product card display
- `Loading` - Loading spinner
- `CustomerDashboard` - Customer dashboard view
- `CarpenterDashboard` - Carpenter dashboard view
- `AdminDashboard` - Admin dashboard view

## Context Providers

### AuthContext
- User authentication state
- Login/logout functions
- Role-based access control

### CartContext
- Shopping cart state
- Add/remove/update items
- Cart calculations

## Styling

Uses Tailwind CSS with custom utility classes:
- `.btn-primary` - Primary button style
- `.btn-secondary` - Secondary button style
- `.btn-outline` - Outlined button style
- `.input-field` - Form input style
- `.card` - Card component style
- `.container-custom` - Container with max-width

## Color Scheme
- Primary: Red (#ef4444 and variations)
- Background: Gray-50
- Text: Gray-900

## Project Structure
```
frontend/
├── public/
│   ├── index.html
│   └── manifest.json
├── src/
│   ├── components/
│   │   ├── dashboard/
│   │   │   ├── AdminDashboard.js
│   │   │   ├── CarpenterDashboard.js
│   │   │   └── CustomerDashboard.js
│   │   ├── Footer.js
│   │   ├── FurnitureCard.js
│   │   ├── Loading.js
│   │   ├── Navbar.js
│   │   └── PrivateRoute.js
│   ├── context/
│   │   ├── AuthContext.js
│   │   └── CartContext.js
│   ├── pages/
│   │   ├── Brands.js
│   │   ├── Cart.js
│   │   ├── Catalogue.js
│   │   ├── Dashboard.js
│   │   ├── FurnitureDetail.js
│   │   ├── Home.js
│   │   ├── Login.js
│   │   ├── Offers.js
│   │   ├── OrderTracking.js
│   │   └── Register.js
│   ├── services/
│   │   └── api.js
│   ├── App.js
│   ├── index.css
│   └── index.js
├── .env
├── package.json
├── tailwind.config.js
└── postcss.config.js
```

## API Integration

All API calls are handled through the `services/api.js` module:
- Automatic JWT token attachment
- Centralized error handling
- Organized by feature (auth, furniture, orders, resources, users)

## Responsive Design

The application is fully responsive:
- Mobile-first approach
- Breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px)
- Hamburger menu for mobile navigation
- Grid layouts adapt to screen size

## Future Enhancements
- Real-time notifications
- Advanced search with filters
- Payment gateway integration
- Live chat support
- Image upload with preview
- Wishlist functionality

## Author
Furniture Showroom System Team
