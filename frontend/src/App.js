import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Context
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';

// Pages
import Home from './pages/Home';
import Catalogue from './pages/Catalogue';
import FurnitureDetail from './pages/FurnitureDetail';
import Brands from './pages/Brands';
import Offers from './pages/Offers';
import Login from './pages/Login';
import Register from './pages/Register';
import OrderTracking from './pages/OrderTracking';
import Cart from './pages/Cart';

// Furniture Category Pages
import CategoryPage from './pages/CategoryPage';
import Chairs from './pages/Chairs';
import Tables from './pages/Tables';
import Sofas from './pages/Sofas';
import Beds from './pages/Beds';
import Cabinets from './pages/Cabinets';
import Desks from './pages/Desks';
import Shelves from './pages/Shelves';

// Admin Pages
import AdminLogin from './pages/AdminLogin';
import AdminUserManagement from './pages/AdminUserManagement';

//carpenter dashboard
import CarpenterDashboard from './Carpenter/CarpenterDashboard';
import Dashboard from './Carpenter/Dashboard';
import MyResources from './Carpenter/MyResources';
import AssignedOrders from './Carpenter/AssignedOrders';
// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import PrivateRoute from './components/PrivateRoute'; 
function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-grow">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/catalogue" element={<Catalogue />} />
                <Route path="/furniture/:id" element={<FurnitureDetail />} />
                <Route path="/brands" element={<Brands />} />
                <Route path="/offers" element={<Offers />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/CarpenterDashboard" element={<CarpenterDashboard />} />
                <Route path="/Dashboard" element={<Dashboard />} />
                <Route path="/carpenter/dashboard" element={<Dashboard />} />
                <Route path="/carpenter/myresources" element={<MyResources />} />
                <Route path="/carpenter/assignedorders" element={<AssignedOrders />} />
                <Route path="/cart" element={<Cart />} />
                
                {/* Furniture Category Routes */}
                <Route path="/category/chair" element={<Chairs />} />
                <Route path="/category/table" element={<Tables />} />
                <Route path="/category/sofa" element={<Sofas />} />
                <Route path="/category/bed" element={<Beds />} />
                <Route path="/category/cabinet" element={<Cabinets />} />
                <Route path="/category/desk" element={<Desks />} />
                <Route path="/category/shelf" element={<Shelves />} />
                <Route path="/category/:category" element={<CategoryPage />} />
                
                {/* Admin Routes */}
                <Route path="/admin-login" element={<AdminLogin />} />
                <Route 
                  path="/admin/users" 
                  element={
                    <PrivateRoute>
                      <AdminUserManagement />
                    </PrivateRoute>
                  } 
                />
                
                {/* Protected Routes */}
                <Route 
                  path="/carpenter/carpenterdashboard/*" 
                  element={
                    <PrivateRoute>
                      <CarpenterDashboard />
                    </PrivateRoute>
                  } 
                />
                <Route 
                  path="/orders/:id" 
                  element={
                    <PrivateRoute>
                      <OrderTracking />
                    </PrivateRoute>
                  } 
                />
              </Routes>
            </main>
            <Footer />
            <ToastContainer position="top-right" autoClose={3000} />
          </div>
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
