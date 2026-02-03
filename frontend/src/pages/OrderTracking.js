import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { ordersAPI } from '../services/api';
import Loading from '../components/Loading';
import { toast } from 'react-toastify';

const OrderTracking = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

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

  if (loading) return <Loading />;
  if (!order) return <div className="container-custom py-8">Order not found</div>;

  return (
    <div className="py-8 bg-gray-50 min-h-screen">
      <div className="container-custom max-w-4xl">
        <h1 className="text-3xl font-bold mb-8">Order Tracking</h1>

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
              <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(order.status)}`}>
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
            <div className="flex justify-between items-center">
              {['pending', 'confirmed', 'in_production', 'ready', 'out_for_delivery', 'delivered'].map((status, index, arr) => {
                const isActive = arr.indexOf(order.status) >= index;
                const isCurrent = order.status === status;
                
                return (
                  <div key={status} className="flex items-center flex-1">
                    <div className="flex flex-col items-center flex-1">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isActive ? 'bg-primary-600 text-white' : 'bg-gray-300 text-gray-600'} ${isCurrent ? 'ring-4 ring-primary-200' : ''}`}>
                        {index + 1}
                      </div>
                      <p className="text-xs mt-2 text-center capitalize">
                        {status.replace(/_/g, ' ')}
                      </p>
                    </div>
                    {index < arr.length - 1 && (
                      <div className={`h-1 flex-1 ${isActive ? 'bg-primary-600' : 'bg-gray-300'}`}></div>
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
              const imageUrl = item.furniture?.images?.[0] 
                ? `http://localhost:5000/${item.furniture.images[0]}` 
                : 'https://via.placeholder.com/100';

              return (
                <div key={index} className="flex items-center border-b pb-4">
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
                    <p className="text-gray-600 text-sm">Quantity: {item.quantity}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-primary-600">${item.price * item.quantity}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Delivery Address */}
        {order.deliveryAddress && (
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="font-semibold text-xl mb-4">Delivery Address</h3>
            <p>{order.deliveryAddress.street}</p>
            <p>{order.deliveryAddress.city}, {order.deliveryAddress.state} {order.deliveryAddress.zipCode}</p>
            <p>{order.deliveryAddress.country}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderTracking;
