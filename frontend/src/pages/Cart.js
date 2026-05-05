import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { API_BASE_URL, ordersAPI } from '../services/api';
import { toast } from 'react-toastify';
import { FaTrash, FaShoppingBag, FaTruck, FaLock } from 'react-icons/fa';

const getImageUrl = (imagePath) => {
  if (!imagePath) return 'https://via.placeholder.com/150';
  if (String(imagePath).startsWith('http')) return imagePath;

  let normalizedPath = String(imagePath).replace(/\\/g, '/');
  const uploadsIndex = normalizedPath.indexOf('uploads/');
  if (uploadsIndex !== -1) {
    normalizedPath = normalizedPath.slice(uploadsIndex);
  }
  if (!normalizedPath.startsWith('/')) {
    normalizedPath = `/${normalizedPath}`;
  }

  return `${API_BASE_URL}${normalizedPath}`;
};

const Cart = () => {
  const { cartItems, removeFromCart, updateQuantity, clearCart, getCartTotal } = useCart();
  const { isAuthenticated, user, isCustomer } = useAuth();
  const navigate = useNavigate();
  
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [deliveryNotes, setDeliveryNotes] = useState('');
  const [processingOrder, setProcessingOrder] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [cardDetails, setCardDetails] = useState({
    cardNumber: '',
    cardHolderName: '',
    expiryDate: '',
    cvv: '',
  });

  // Redirect non-customers
  React.useEffect(() => {
    if (isAuthenticated && !isCustomer) {
      toast.warning('Only customers can access the shopping cart');
      navigate('/');
    }
  }, [isAuthenticated, isCustomer, navigate]);

  const calculateTotals = () => {
    const subtotal = getCartTotal();
    const shipping = subtotal > 100 ? 0 : 9.99;
    const tax = parseFloat((subtotal * 0.08).toFixed(2));
    const total = parseFloat((subtotal + shipping + tax).toFixed(2));
    
    return { subtotal, shipping, tax, total };
  };

  const { subtotal, shipping, tax, total } = calculateTotals();

  const handleCardInputChange = (field, value) => {
    if (field === 'cardNumber') {
      const digits = value.replace(/\D/g, '').slice(0, 16);
      const grouped = digits.replace(/(\d{4})(?=\d)/g, '$1 ');
      setCardDetails((prev) => ({ ...prev, cardNumber: grouped }));
      return;
    }
    if (field === 'expiryDate') {
      const digits = value.replace(/\D/g, '').slice(0, 4);
      const formatted = digits.length > 2 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits;
      setCardDetails((prev) => ({ ...prev, expiryDate: formatted }));
      return;
    }
    if (field === 'cvv') {
      const digits = value.replace(/\D/g, '').slice(0, 4);
      setCardDetails((prev) => ({ ...prev, cvv: digits }));
      return;
    }
    setCardDetails((prev) => ({ ...prev, [field]: value }));
  };

  const validateCardDetails = () => {
    const cardNumberDigits = cardDetails.cardNumber.replace(/\s/g, '');
    if (cardNumberDigits.length < 13 || cardNumberDigits.length > 16) {
      toast.error('Please enter a valid card number');
      return false;
    }
    if (!cardDetails.cardHolderName.trim()) {
      toast.error('Please enter the card holder name');
      return false;
    }
    if (!/^\d{2}\/\d{2}$/.test(cardDetails.expiryDate)) {
      toast.error('Please enter card expiry in MM/YY format');
      return false;
    }
    if (!/^\d{3,4}$/.test(cardDetails.cvv)) {
      toast.error('Please enter a valid CVV');
      return false;
    }
    return true;
  };

  const handleCheckout = async () => {
    if (!isAuthenticated) {
      toast.info('Please login to complete your order');
      navigate('/login');
      return;
    }

    if (!isCustomer) {
      toast.error('Only customers can place orders');
      return;
    }

    if (cartItems.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    if (paymentMethod === 'card' && !validateCardDetails()) {
      return;
    }

    if (!user.address || !user.address.street) {
      toast.error('Please update your delivery address in your profile');
      navigate('/customer/customerdashboard');
      return;
    }

    const resolvedPaymentMethod = paymentMethod;

    setProcessingOrder(true);

    try {
      const orderData = {
        items: cartItems.map(item => ({
          furniture: item._id,
          quantity: item.quantity,
        })),
        deliveryAddress: user.address,
        paymentMethod: resolvedPaymentMethod,
        notes: deliveryNotes,
      };

      const response = await ordersAPI.create(orderData);
      toast.success('Order placed successfully! 🎉');
      clearCart();
      navigate(`/orders/${response.data.order._id}`);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to place order');
      console.error('Order error:', error);
    } finally {
      setProcessingOrder(false);
    }
  };

  const handleClearCart = () => {
    setShowCancelConfirm(false);
    clearCart();
    toast.info('Cart cleared');
  };

  if (!isAuthenticated) {
    return (
      <div className="container-custom py-16 text-center">
        <h2 className="text-2xl font-bold mb-4">Sign In Required</h2>
        <p className="text-gray-600 mb-8">Please log in to view your cart and proceed with checkout</p>
        <button onClick={() => navigate('/login')} className="btn-primary">
          Sign In
        </button>
      </div>
    );
  }

  if (!isCustomer) {
    return (
      <div className="container-custom py-16 text-center">
        <h2 className="text-2xl font-bold mb-4">Access Denied</h2>
        <p className="text-gray-600 mb-8">Only customers can access the shopping cart</p>
        <button onClick={() => navigate('/')} className="btn-primary">
          Go Home
        </button>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="container-custom py-16 text-center">
        <div className="mb-6">
          <FaShoppingBag className="text-6xl text-gray-300 mx-auto" />
        </div>
        <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
        <p className="text-gray-600 mb-8">Browse our collection and add items to your cart</p>
        <button onClick={() => navigate('/gallery')} className="btn-primary">
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="py-8 bg-gray-50 min-h-screen">
      <div className="container-custom">
        <h1 className="text-3xl font-bold mb-2">Shopping Cart</h1>
        <p className="text-gray-600 mb-8">{cartItems.length} item{cartItems.length !== 1 ? 's' : ''} in your cart</p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            {/* Items List */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-xl font-bold mb-4">Items</h2>
              <div className="space-y-4">
                {cartItems.map((item) => {
                  const imageUrl = getImageUrl(item.images?.[0] || item.image);
                  const itemTotal = item.price * item.quantity;

                  return (
                    <div key={item._id} className="border-b pb-4 last:border-b-0 flex gap-4">
                      <img 
                        src={imageUrl} 
                        alt={item.name}
                        className="w-24 h-24 object-cover rounded"
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/150';
                        }}
                      />
                      
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg hover:text-primary-600 cursor-pointer">
                          {item.name}
                        </h3>
                        <p className="text-gray-600 text-sm mb-1">${item.price.toFixed(2)} each</p>
                        
                        <div className="flex items-center justify-between mt-3">
                          <div className="flex items-center space-x-3">
                            <button 
                              onClick={() => updateQuantity(item._id, item.quantity - 1)}
                              className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-3 py-1 rounded text-sm font-semibold transition"
                            >
                              −
                            </button>
                            <span className="font-semibold w-8 text-center">{item.quantity}</span>
                            <button 
                              onClick={() => updateQuantity(item._id, item.quantity + 1)}
                              className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-3 py-1 rounded text-sm font-semibold transition"
                            >
                              +
                            </button>
                          </div>

                          <button 
                            onClick={() => removeFromCart(item._id)}
                            className="text-red-600 hover:text-red-800 hover:bg-red-50 p-2 rounded transition"
                            title="Remove from cart"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </div>

                      <div className="text-right">
                        <p className="text-lg font-bold text-primary-600">
                          ${itemTotal.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Delivery & Notes */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <FaTruck className="text-primary-600" />
                Delivery Details
              </h3>
              
              {user?.address ? (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                  <p className="text-sm text-gray-600 mb-2">Delivery Address:</p>
                  <p className="font-semibold">{user.address.street}</p>
                  <p className="text-gray-600">{user.address.city}, {user.address.state} {user.address.zipCode}</p>
                  <button 
                    onClick={() => navigate('/customer/customerdashboard')}
                    className="text-primary-600 hover:text-primary-700 text-sm mt-2 underline"
                  >
                    Edit Address
                  </button>
                </div>
              ) : (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                  <p className="text-yellow-800 text-sm">
                    ⚠️ Please update your delivery address in your profile before checkout
                  </p>
                  <button 
                    onClick={() => navigate('/customer/customerdashboard')}
                    className="text-primary-600 hover:text-primary-700 text-sm mt-2 underline"
                  >
                    Update Address Now
                  </button>
                </div>
              )}

              <div className="mt-4">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Delivery Notes (Optional)
                </label>
                <textarea
                  value={deliveryNotes}
                  onChange={(e) => setDeliveryNotes(e.target.value)}
                  placeholder="e.g., Please call before delivery, special handling instructions..."
                  className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-600"
                  rows="3"
                />
              </div>
            </div>
          </div>

          {/* Order Summary & Checkout */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-24 space-y-6">
              {/* Price Breakdown */}
              <div>
                <h2 className="text-xl font-bold mb-4">Order Summary</h2>
                
                <div className="space-y-3 pb-4">
                  <div className="flex justify-between text-gray-700">
                    <span>Subtotal</span>
                    <span className="font-semibold">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-700">
                    <span>Tax (8%)</span>
                    <span className="font-semibold">${tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-700">
                    <span>Shipping</span>
                    <span className="font-semibold">
                      {shipping === 0 ? (
                        <span className="text-green-600">FREE</span>
                      ) : (
                        `$${shipping.toFixed(2)}`
                      )}
                    </span>
                  </div>
                  {shipping === 0 && (
                    <p className="text-xs text-green-600">Free shipping on orders over $100!</p>
                  )}
                </div>

                <div className="border-t-2 border-gray-200 pt-3">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-gray-900">Total</span>
                    <span className="text-2xl font-bold text-primary-600">
                      ${total.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="border-t pt-6">
                <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
                  <FaLock className="text-primary-600 text-sm" />
                  Payment Method
                </h3>
                
                <div className="space-y-2">
                  <label className="flex items-center p-3 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-primary-300 hover:bg-primary-50 transition" style={{borderColor: paymentMethod === 'cash' ? '#2563eb' : ''}}>
                    <input 
                      type="radio" 
                      value="cash" 
                      checked={paymentMethod === 'cash'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="mr-3"
                    />
                    <span className="font-medium">Cash on Delivery</span>
                  </label>

                  <label className="flex items-center p-3 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-primary-300 hover:bg-primary-50 transition" style={{borderColor: paymentMethod === 'card' ? '#2563eb' : ''}}>
                    <input 
                      type="radio" 
                      value="card" 
                      checked={paymentMethod === 'card'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="mr-3"
                    />
                    <span className="font-medium">Credit/Debit Card</span>
                  </label>

                  <label className="flex items-center p-3 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-primary-300 hover:bg-primary-50 transition" style={{borderColor: paymentMethod === 'online' ? '#2563eb' : ''}}>
                    <input 
                      type="radio" 
                      value="online" 
                      checked={paymentMethod === 'online'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="mr-3"
                    />
                    <span className="font-medium">Online / Digital Wallet</span>
                  </label>
                </div>

                {paymentMethod === 'card' && (
                  <div className="mt-4 p-4 bg-gray-50 border border-gray-200 rounded-lg space-y-3">
                    <input
                      type="text"
                      value={cardDetails.cardNumber}
                      onChange={(e) => handleCardInputChange('cardNumber', e.target.value)}
                      placeholder="Card Number"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-600"
                    />
                    <input
                      type="text"
                      value={cardDetails.cardHolderName}
                      onChange={(e) => handleCardInputChange('cardHolderName', e.target.value)}
                      placeholder="Card Holder Name"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-600"
                    />
                    <div className="grid grid-cols-2 gap-3">
                      <input
                        type="text"
                        value={cardDetails.expiryDate}
                        onChange={(e) => handleCardInputChange('expiryDate', e.target.value)}
                        placeholder="MM/YY"
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-600"
                      />
                      <input
                        type="password"
                        value={cardDetails.cvv}
                        onChange={(e) => handleCardInputChange('cvv', e.target.value)}
                        placeholder="CVV"
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-600"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Checkout Buttons */}
              <div className="space-y-3 border-t pt-6">
                <button 
                  onClick={handleCheckout} 
                  disabled={processingOrder || !user?.address}
                  className={`w-full py-3 px-4 rounded-lg font-bold text-white transition flex items-center justify-center gap-2 ${
                    processingOrder || !user?.address
                      ? 'bg-gray-400 cursor-not-allowed' 
                      : 'bg-primary-600 hover:bg-primary-700 active:scale-95'
                  }`}
                >
                  {processingOrder ? (
                    <>
                      <span className="animate-spin">⚙️</span>
                      Processing...
                    </>
                  ) : (
                    'Complete Order'
                  )}
                </button>
                
                <button 
                  onClick={() => navigate('/gallery')} 
                  className="w-full py-3 px-4 rounded-lg font-bold text-primary-600 border-2 border-primary-600 hover:bg-primary-50 transition"
                >
                  Continue Shopping
                </button>

                <button 
                  onClick={() => setShowCancelConfirm(true)}
                  className="w-full py-2 px-4 rounded-lg font-semibold text-red-600 hover:bg-red-50 transition text-sm"
                >
                  Clear Cart
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Clear Cart Confirmation Modal */}
        {showCancelConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-sm mx-4 shadow-xl">
              <h3 className="text-lg font-bold mb-2">Clear Cart?</h3>
              <p className="text-gray-600 mb-6">Are you sure you want to remove all items from your cart?</p>
              <div className="flex gap-3">
                <button 
                  onClick={() => setShowCancelConfirm(false)}
                  className="flex-1 py-2 px-4 rounded-lg border-2 border-gray-300 font-semibold hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleClearCart}
                  className="flex-1 py-2 px-4 rounded-lg bg-red-600 text-white font-semibold hover:bg-red-700 transition"
                >
                  Clear
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
