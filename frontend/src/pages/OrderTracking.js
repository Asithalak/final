import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { API_BASE_URL, ordersAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import Loading from '../components/Loading';
import { toast } from 'react-toastify';
import { FaTrash, FaCheck, FaClock } from 'react-icons/fa';

const getImageUrl = (imagePath) => {
  if (!imagePath) return 'https://via.placeholder.com/100';
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

const OrderTracking = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isCustomer } = useAuth();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

  useEffect(() => {
    fetchOrder();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchOrder = async () => {
    try {
      setLoading(true);
      const response = await ordersAPI.getById(id);
      setOrder(response.data);
    } catch (error) {
      toast.error('Failed to fetch order details');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async () => {
    setShowCancelConfirm(false);
    setCancelling(true);

    try {
      await ordersAPI.cancel(id);
      toast.success('Order cancelled successfully');
      await fetchOrder();
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to cancel order';
      toast.error(errorMessage);
      console.error('Cancel error:', error);
    } finally {
      setCancelling(false);
    }
  };

  const canCancelOrder = () => {
    return order && order.status === 'pending' && isCustomer;
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-blue-100 text-blue-800',
      in_production: 'bg-purple-100 text-purple-800',
      ready: 'bg-green-100 text-green-800',
      out_for_delivery: 'bg-indigo-100 text-indigo-800',
      delivered: 'bg-green-600 text-white',
      cancelled: 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusIcon = (status) => {
    const icons = {
      pending: <FaClock className="inline mr-1" />,
      delivered: <FaCheck className="inline mr-1" />,
      cancelled: <FaTrash className="inline mr-1" />,
    };
    return icons[status] || null;
  };

  if (loading) return <Loading />;
  if (!order) return <div className="container-custom py-8 text-center">
    <h2 className="text-2xl font-bold mb-4">Order not found</h2>
    <button onClick={() => navigate('/gallery')} className="btn-primary">
      Back to Shopping
    </button>
  </div>;

  const itemSubtotal = order.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const finalTotal = order.totalAmount;

  return (
    <div className="py-8 bg-gray-50 min-h-screen">
      <div className="container-custom max-w-4xl">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-3xl font-bold">Order Tracking</h1>
          {canCancelOrder() && (
            <button
              onClick={() => setShowCancelConfirm(true)}
              disabled={cancelling}
              className="bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg font-semibold flex items-center gap-2 transition"
            >
              <FaTrash />
              Cancel Order
            </button>
          )}
        </div>

        {/* Order Info */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <p className="text-gray-600 text-sm">Order Number</p>
              <p className="font-bold text-lg">{order.orderNumber}</p>
            </div>
            <div>
              <p className="text-gray-600 text-sm">Order Date</p>
              <p className="font-semibold">{new Date(order.createdAt).toLocaleDateString()}</p>
            </div>
            <div>
              <p className="text-gray-600 text-sm">Status</p>
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(order.status)}`}>
                {getStatusIcon(order.status)}
                {order.status.replace(/_/g, ' ').toUpperCase()}
              </span>
            </div>
            <div>
              <p className="text-gray-600 text-sm">Total Amount</p>
              <p className="font-bold text-xl text-primary-600">${order.totalAmount}</p>
            </div>
          </div>

          {/* Progress Tracker */}
          <div className="mt-8">
            <h3 className="font-semibold mb-4">Order Progress</h3>
            <div className="flex justify-between items-center overflow-x-auto pb-4">
              {['pending', 'confirmed', 'in_production', 'ready', 'out_for_delivery', 'delivered'].map((status, index, arr) => {
                const isActive = arr.indexOf(order.status) >= index && order.status !== 'cancelled';
                const isCurrent = order.status === status;
                
                return (
                  <div key={status} className="flex items-center flex-1 min-w-max md:min-w-0">
                    <div className="flex flex-col items-center flex-1">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${isActive ? 'bg-primary-600 text-white' : 'bg-gray-300 text-gray-600'} ${isCurrent ? 'ring-4 ring-primary-200' : ''}`}>
                        {index + 1}
                      </div>
                      <p className="text-xs mt-2 text-center capitalize whitespace-nowrap">
                        {status.replace(/_/g, ' ')}
                      </p>
                    </div>
                    {index < arr.length - 1 && (
                      <div className={`h-1 flex-1 min-w-8 md:min-w-0 ${isActive ? 'bg-primary-600' : 'bg-gray-300'}`}></div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Order Items */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <h3 className="font-semibold text-xl mb-4">Order Items</h3>
          <div className="space-y-4">
            {order.items.map((item, index) => {
              const imageUrl = getImageUrl(item.furniture?.images?.[0]);

              return (
                <div key={index} className="flex items-center border-b pb-4 last:border-b-0">
                  <img 
                    src={imageUrl} 
                    alt={item.furniture?.name}
                    className="w-20 h-20 object-cover rounded"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/100';
                    }}
                  />
                  <div className="ml-4 flex-1">
                    <h4 className="font-semibold">{item.furniture?.name}</h4>
                    <p className="text-gray-600 text-sm">
                      Quantity: {item.quantity} × ${item.price} = <span className="font-semibold text-primary-600">${(item.price * item.quantity).toFixed(2)}</span>
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Order Summary */}
          <div className="mt-6 pt-6 border-t">
            <div className="space-y-2">
              <div className="flex justify-between text-gray-700">
                <span>Items Subtotal</span>
                <span>${itemSubtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold text-lg">
                <span>Final Total</span>
                <span className="text-primary-600">${Number(finalTotal).toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Delivery Address */}
        {order.deliveryAddress && (
          <div className="bg-white rounded-xl shadow-md p-6 mb-6">
            <h3 className="font-semibold text-xl mb-4">Delivery Address</h3>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="font-semibold">{order.deliveryAddress.street}</p>
              <p className="text-gray-600">{order.deliveryAddress.city}, {order.deliveryAddress.state} {order.deliveryAddress.zipCode}</p>
              <p className="text-gray-600">{order.deliveryAddress.country}</p>
            </div>
          </div>
        )}

        {/* Order Notes */}
        {order.notes && (
          <div className="bg-white rounded-xl shadow-md p-6 mb-6">
            <h3 className="font-semibold text-xl mb-2">Delivery Notes</h3>
            <p className="text-gray-600">{order.notes}</p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-4">
          <button 
            onClick={() => navigate('/gallery')}
            className="flex-1 bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg font-bold transition"
          >
            Continue Shopping
          </button>
          <button 
            onClick={() => navigate('/customer/customerdashboard')}
            className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-3 rounded-lg font-bold transition"
          >
            Back to Dashboard
          </button>
        </div>

        {/* Cancel Confirmation Modal */}
        {showCancelConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-sm mx-4 shadow-xl">
              <h3 className="text-lg font-bold mb-2">Cancel Order?</h3>
              <p className="text-gray-600 mb-2">Order #{order.orderNumber}</p>
              <p className="text-gray-600 mb-6">
                Are you sure you want to cancel this order? This action cannot be undone, but you may place a new order at any time.
              </p>
              <div className="flex gap-3">
                <button 
                  onClick={() => setShowCancelConfirm(false)}
                  className="flex-1 py-2 px-4 rounded-lg border-2 border-gray-300 font-semibold hover:bg-gray-50 transition"
                >
                  Keep Order
                </button>
                <button 
                  onClick={handleCancelOrder}
                  disabled={cancelling}
                  className="flex-1 py-2 px-4 rounded-lg bg-red-600 text-white font-semibold hover:bg-red-700 disabled:bg-gray-400 transition flex items-center justify-center gap-2"
                >
                  {cancelling ? (
                    <>
                      <span className="animate-spin">⚙️</span>
                      Cancelling...
                    </>
                  ) : (
                    'Cancel Order'
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderTracking;
