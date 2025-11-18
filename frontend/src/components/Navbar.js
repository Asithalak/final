import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaShoppingCart, FaUser, FaBars, FaTimes } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout, isAuthenticated } = useAuth();
  const { getCartCount } = useCart();

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="container-custom">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold text-primary-600">
            FurniHome
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-700 hover:text-primary-600 transition">
              Home
            </Link>
            <Link to="/catalogue" className="text-gray-700 hover:text-primary-600 transition">
              Catalogue
            </Link>
            <Link to="/brands" className="text-gray-700 hover:text-primary-600 transition">
              Brands
            </Link>
            <Link to="/offers" className="text-gray-700 hover:text-primary-600 transition">
              Offers
            </Link>
            <Link to="/admin-login" className="text-gray-700 hover:text-primary-600 transition">
              Admin
            </Link>
          </div>

          {/* Icons */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/cart" className="relative text-gray-700 hover:text-primary-600 transition">
              <FaShoppingCart size={24} />
              {getCartCount() > 0 && (
                <span className="absolute -top-2 -right-2 bg-primary-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {getCartCount()}
                </span>
              )}
            </Link>
            
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <Link 
                  to={user?.role === 'carpenter' ? '/carpenterdashboard' : user?.role === 'admin' ? '/admin/users' : '/customerdashboard'}
                  className="text-gray-700 hover:text-primary-600 transition flex items-center space-x-2"
                >
                  <FaUser size={20} />
                  <span>{user?.name}</span>
                </Link>
                <button onClick={logout} className="btn-secondary text-sm">
                  Logout
                </button>
              </div>
            ) : (
              <Link to="/login" className="btn-primary">
                Login
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button onClick={toggleMenu} className="md:hidden text-gray-700">
            {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden pb-4">
            <Link 
              to="/" 
              className="block py-2 text-gray-700 hover:text-primary-600"
              onClick={toggleMenu}
            >
              Home
            </Link>
            <Link 
              to="/catalogue" 
              className="block py-2 text-gray-700 hover:text-primary-600"
              onClick={toggleMenu}
            >
              Catalogue
            </Link>
            <Link 
              to="/brands" 
              className="block py-2 text-gray-700 hover:text-primary-600"
              onClick={toggleMenu}
            >
              Brands
            </Link>
            <Link 
              to="/offers" 
              className="block py-2 text-gray-700 hover:text-primary-600"
              onClick={toggleMenu}
            >
              Offers
            </Link>
            <Link 
              to="/admin-login" 
              className="block py-2 text-gray-700 hover:text-primary-600"
              onClick={toggleMenu}
            >
              Admin
            </Link>
            <Link 
              to="/cart" 
              className="block py-2 text-gray-700 hover:text-primary-600"
              onClick={toggleMenu}
            >
              Cart ({getCartCount()})
            </Link>
            {isAuthenticated ? (
              <>
                <Link 
                  to={user?.role === 'carpenter' ? '/carpenterdashboard' : user?.role === 'admin' ? '/admin/users' : '/customerdashboard'}
                  className="block py-2 text-gray-700 hover:text-primary-600"
                  onClick={toggleMenu}
                >
                  Dashboard ({user?.name})
                </Link>
                <button 
                  onClick={() => { logout(); toggleMenu(); }} 
                  className="block py-2 text-gray-700 hover:text-primary-600"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link 
                to="/login" 
                className="block py-2 text-primary-600 font-semibold"
                onClick={toggleMenu}
              >
                Login
              </Link>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
