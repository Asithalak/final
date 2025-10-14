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
import Dashboard from './pages/Dashboard';
import OrderTracking from './pages/OrderTracking';
import Cart from './pages/Cart';

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
                <Route path="/cart" element={<Cart />} />
                
                {/* Protected Routes */}
                <Route 
                  path="/dashboard/*" 
                  element={
                    <PrivateRoute>
                      <Dashboard />
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
