import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { ordersAPI } from '../services/api';
import { toast } from 'react-toastify';
import { FaTrash } from 'react-icons/fa';

const Cart = () => {
  const { cartItems, removeFromCart, updateQuantity, clearCart, getCartTotal } = useCart();
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  const handleCheckout = async () => {
    if (!isAuthenticated) {
      toast.info('Please login to complete your order');
      navigate('/login');
      return;
    }

    if (cartItems.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    try {
      const orderData = {
        items: cartItems.map(item => ({
          furniture: item._id,
          quantity: item.quantity,
        })),
        deliveryAddress: user.address || {},
        paymentMethod: 'cash',
      };

      const response = await ordersAPI.create(orderData);
      toast.success('Order placed successfully!');
      clearCart();
      navigate(`/orders/${response.data.order._id}`);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to place order');
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="container-custom py-16 text-center">
        <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
        <p className="text-gray-600 mb-8">Browse our catalogue and add items to your cart</p>
        <button onClick={() => navigate('/catalogue')} className="btn-primary">
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="py-8 bg-gray-50 min-h-screen">
      <div className="container-custom">
        <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => {
              const imageUrl = item.images?.[0] 
                ? `http://localhost:5000/${item.images[0]}` 
                : 'https://via.placeholder.com/150';

              return (
                <div key={item._id} className="bg-white p-4 rounded-lg shadow-md flex">
                  <img 
                    src={imageUrl} 
                    alt={item.name}
                    className="w-24 h-24 object-cover rounded"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/150';
                    }}
                  />
                  
                  <div className="ml-4 flex-1">
                    <h3 className="font-semibold text-lg">{item.name}</h3>
                    <p className="text-gray-600 text-sm mb-2">${item.price} each</p>
                    
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <button 
                          onClick={() => updateQuantity(item._id, item.quantity - 1)}
                          className="btn-secondary px-3 py-1 text-sm"
                        >
                          -
                        </button>
                        <span className="font-semibold">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item._id, item.quantity + 1)}
                          className="btn-secondary px-3 py-1 text-sm"
                        >
                          +
                        </button>
                      </div>

                      <button 
                        onClick={() => removeFromCart(item._id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="text-xl font-bold text-primary-600">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-lg shadow-md sticky top-24">
              <h2 className="text-xl font-bold mb-4">Order Summary</h2>
              
              <div className="space-y-2 mb-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-semibold">${getCartTotal().toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-semibold">Calculated at checkout</span>
                </div>
                <div className="border-t pt-2 flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span className="text-primary-600">${getCartTotal().toFixed(2)}</span>
                </div>
              </div>

              <button onClick={handleCheckout} className="btn-primary w-full mb-3">
                Proceed to Checkout
              </button>
              
              <button onClick={() => navigate('/catalogue')} className="btn-outline w-full">
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
