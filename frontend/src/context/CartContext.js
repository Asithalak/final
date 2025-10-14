import React, { createContext, useState, useContext, useEffect } from 'react';
import { toast } from 'react-toastify';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    // Load cart from localStorage
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    }
  }, []);

  useEffect(() => {
    // Save cart to localStorage
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (furniture, quantity = 1) => {
    const existingItem = cartItems.find(item => item._id === furniture._id);
    
    if (existingItem) {
      setCartItems(cartItems.map(item =>
        item._id === furniture._id
          ? { ...item, quantity: item.quantity + quantity }
          : item
      ));
      toast.success('Item quantity updated in cart');
    } else {
      setCartItems([...cartItems, { ...furniture, quantity }]);
      toast.success('Item added to cart');
    }
  };

  const removeFromCart = (furnitureId) => {
    setCartItems(cartItems.filter(item => item._id !== furnitureId));
    toast.info('Item removed from cart');
  };

  const updateQuantity = (furnitureId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(furnitureId);
      return;
    }
    
    setCartItems(cartItems.map(item =>
      item._id === furnitureId ? { ...item, quantity } : item
    ));
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem('cart');
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getCartCount = () => {
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  };

  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getCartCount,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
