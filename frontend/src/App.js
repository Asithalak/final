import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Context
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';

// Pages
import Home from './pages/Home';
import Brands from './pages/Brands';
import Offers from './pages/Offers';
import Login from './pages/Login';
import Register from './pages/Register';
import RegisterUser from './pages/RegisterUser';
import OrderTracking from './pages/OrderTracking';
import Cart from './pages/Cart';
import ImageGalleryPage from './pages/ImageGalleryPage';

// Furniture Category Pages
import CategoryPage from './pages/CategoryPage';
import Chairs from './ViewCategory/Chairs';
import Tables from './ViewCategory/Tables';
import Sofas from './ViewCategory/Sofas';
import Beds from './ViewCategory/Beds';
import Cabinets from './ViewCategory/Cabinets';
import Desks from './ViewCategory/Desks';
import Shelves from './ViewCategory/Shelves';

// Admin Pages
import AdminLogin from './pages/AdminLogin';
import AdminUserManagement from './pages/AdminUserManagement';

//carpenter dashboard
import CarpenterDashboard from './Carpenter/CarpenterDashboard';
import MyFurnitureDesigns from './Carpenter/MyFurnitureDesigns';
import MyResources from './Carpenter/MyResources';
import AssignedOrders from './Carpenter/AssignedOrders';
import AllCarpenters from './Carpenter/AllCarpenters';

//customer dashboard
import CustomerDashboard from './customer/CustomerDashboard';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import PrivateRoute from './components/PrivateRoute';
import CarpenterLayout from './components/CarpenterLayout';
import CustomerLayout from './components/CustomerLayout';
import AdminLayout from './components/AdminLayout';
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
                <Route path="/brands" element={<Brands />} />
                <Route path="/offers" element={<Offers />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/register/:role" element={<RegisterUser />} />
                <Route path="/carpenter/carpenterdashboard" element={<CarpenterDashboard />} />
                <Route 
                  path="/carpenter/myfurnituredesigns" 
                  element={
                    <PrivateRoute>
                      <CarpenterLayout>
                        <MyFurnitureDesigns />
                      </CarpenterLayout>
                    </PrivateRoute>
                  } 
                />
                <Route 
                  path="/carpenter/myresources" 
                  element={
                    <PrivateRoute>
                      <CarpenterLayout>
                        <MyResources />
                      </CarpenterLayout>
                    </PrivateRoute>
                  } 
                />
                <Route 
                  path="/carpenter/assignedorders" 
                  element={
                    <PrivateRoute>
                      <CarpenterLayout>
                        <AssignedOrders />
                      </CarpenterLayout>
                    </PrivateRoute>
                  } 
                />
                <Route path="/carpenters" element={<AllCarpenters />} />
                <Route path="/all-carpenters" element={<AllCarpenters />} />
                <Route 
                  path="/customer/customerdashboard" 
                  element={
                    <PrivateRoute>
                      <CustomerLayout>
                        <CustomerDashboard />
                      </CustomerLayout>
                    </PrivateRoute>
                  } 
                />

                <Route 
                  path="/cart" 
                  element={
                    <PrivateRoute>
                      <CustomerLayout>
                        <Cart />
                      </CustomerLayout>
                    </PrivateRoute>
                  } 
                />
                <Route 
                  path="/gallery" 
                  element={
                    <PrivateRoute>
                      <CustomerLayout>
                        <ImageGalleryPage />
                      </CustomerLayout>
                    </PrivateRoute>
                  } 
                />
                
                {/* Furniture Category Routes - Requires Login */}
                <Route path="/category/chair" element={<PrivateRoute><Chairs /></PrivateRoute>} />
                <Route path="/category/table" element={<PrivateRoute><Tables /></PrivateRoute>} />
                <Route path="/category/sofa" element={<PrivateRoute><Sofas /></PrivateRoute>} />
                <Route path="/category/bed" element={<PrivateRoute><Beds /></PrivateRoute>} />
                <Route path="/category/cabinet" element={<PrivateRoute><Cabinets /></PrivateRoute>} />
                <Route path="/category/desk" element={<PrivateRoute><Desks /></PrivateRoute>} />
                <Route path="/category/shelf" element={<PrivateRoute><Shelves /></PrivateRoute>} />
                <Route path="/category/:category" element={<PrivateRoute><CategoryPage /></PrivateRoute>} />
                
                {/* Admin Routes */}
                <Route path="/admin-login" element={<AdminLogin />} />
                <Route 
                  path="/admin/users" 
                  element={
                    <PrivateRoute>
                      <AdminLayout>
                        <AdminUserManagement />
                      </AdminLayout>
                    </PrivateRoute>
                  } 
                />
                
                {/* Protected Routes */}
                <Route 
                  path="/carpenterdashboard/*" 
                  element={
                    <PrivateRoute>
                      <CarpenterDashboard />
                    </PrivateRoute>
                  } 
                />
                <Route 
                  path="/customer/dashboard/*" 
                  element={
                    <PrivateRoute>
                      <CustomerDashboard />
                    </PrivateRoute>
                  }
                />
                <Route 
                  path="/customerdashboard/*" 
                  element={
                    <PrivateRoute>
                      <CustomerDashboard />
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
