import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ordersAPI, usersAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const CustomerDashboard = () => {
  const [userRole, setUserRole] = useState('customer'); // 'customer', 'admin'
  const [activeTab, setActiveTab] = useState('orders'); // 'orders', 'customers'
  const [orders, setOrders] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [showCustomerDetailsModal, setShowCustomerDetailsModal] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [showCarpenterModal, setShowCarpenterModal] = useState(false);
  const [selectedCarpenter, setSelectedCarpenter] = useState(null);
  const [loadingCarpenter, setLoadingCarpenter] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get user role from localStorage
    const storedRole = localStorage.getItem('userRole') || 'customer';
    setUserRole(storedRole);
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    
    try {
      // Fetch orders from API - backend filters by logged-in user
      const response = await ordersAPI.getAll();
      const ordersData = response.data;
      
      // Transform orders data for display
      const transformedOrders = ordersData.map(order => ({
        _id: order._id,
        orderNumber: order.orderNumber || `ORD-${order._id.slice(-6).toUpperCase()}`,
        createdAt: order.createdAt,
        status: order.status,
        paymentStatus: order.paymentStatus,
        paymentMethod: order.paymentMethod,
        deliveryAddress: order.deliveryAddress,
        notes: order.notes,
        assignedCarpenter: order.assignedCarpenter?.name || 'Not Assigned',
        assignedCarpenterId: order.assignedCarpenter?._id || null,
        productionStatus: order.productionStatus,
        deliveryDate: order.deliveryDate,
        items: order.items.map(item => ({
          name: item.furniture?.name || 'Unknown Item',
          quantity: item.quantity,
          image: item.furniture?.images?.[0] || '/images/placeholder.jpg',
          price: item.price
        })),
        totalAmount: order.totalAmount,
        carpenter: order.items[0]?.carpenter?.name || 'Not Assigned',
      }));
      
      setOrders(transformedOrders);
      
      // Mock customers data (for admin)
      const mockCustomers = [
        {
          id: 1,
          name: 'John Smith',
          email: 'john.smith@example.com',
          phone: '+1-555-0201',
          address: '123 Oak Street, Springfield, IL 62701',
          joinedDate: '2025-01-15',
          totalOrders: 5,
          totalSpent: 2500,
          status: 'active',
        },
        {
          id: 2,
          name: 'Emily Davis',
          email: 'emily.davis@example.com',
          phone: '+1-555-0202',
          address: '456 Pine Avenue, Madison, WI 53703',
          joinedDate: '2025-02-20',
          totalOrders: 3,
          totalSpent: 1800,
          status: 'active',
        },
      ];
      
      setCustomers(mockCustomers);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setOrders([]);
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

  const handleViewCarpenterDetails = async (carpenterId) => {
    if (!carpenterId) return;
    
    setLoadingCarpenter(true);
    setShowCarpenterModal(true);
    
    try {
      const response = await usersAPI.getById(carpenterId);
      setSelectedCarpenter(response.data);
    } catch (error) {
      console.error('Error fetching carpenter details:', error);
      setShowCarpenterModal(false);
    } finally {
      setLoadingCarpenter(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-2xl shadow-2xl p-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
                {userRole === 'admin' ? '👨‍💼 Admin Dashboard' : '🛍️ Customer Dashboard'}
              </h1>
              <p className="text-indigo-100 text-lg">
                {userRole === 'admin' 
                  ? 'Manage customers, view carpenter details and monitor all orders' 
                  : 'View your orders, explore carpenter designs and resources'}
              </p>
            </div>
            <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg">
              <p className="text-xs text-indigo-100">Role</p>
              <p className="text-lg font-bold text-white capitalize">{userRole}</p>
            </div>
          </div>
        </div>

        {/* Tabs Navigation */}
        <div className="bg-white rounded-xl shadow-md p-2">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setActiveTab('orders')}
              className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                activeTab === 'orders'
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              📦 My Orders
            </button>
            <Link
              to="/carpenters"
              className="px-6 py-3 rounded-lg font-semibold transition-all bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg hover:from-purple-700 hover:to-pink-700"
            >
              🔨 View Carpenters <span className="text-xs opacity-80">(Public Directory)</span>
            </Link>
            {userRole === 'admin' && (
              <button
                onClick={() => setActiveTab('customers')}
                className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                  activeTab === 'customers'
                    ? 'bg-gradient-to-r from-green-600 to-teal-600 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                👥 Customer Details
              </button>
            )}
          </div>
        </div>

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <>
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-500">
                <h3 className="text-gray-600 text-sm font-medium mb-2">Total Orders</h3>
                <p className="text-3xl font-bold text-blue-600">{orders.length}</p>
              </div>
              <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-purple-500">
                <h3 className="text-gray-600 text-sm font-medium mb-2">Active Orders</h3>
                <p className="text-3xl font-bold text-purple-600">
                  {orders.filter(o => !['delivered', 'cancelled'].includes(o.status)).length}
                </p>
              </div>
              <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-green-500">
                <h3 className="text-gray-600 text-sm font-medium mb-2">Delivered</h3>
                <p className="text-3xl font-bold text-green-600">
                  {orders.filter(o => o.status === 'delivered').length}
                </p>
              </div>
            </div>

            {/* Orders List */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-2xl font-bold mb-6 text-gray-900">📋 My Orders</h2>
              
              {orders.length > 0 ? (
                <div className="space-y-6">
                  {orders.map((order) => (
                    <div key={order._id} className="border-2 border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-all hover:border-blue-300">
                      {/* Order Header */}
                      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-5 border-b-2 border-gray-200">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                          <div>
                            <p className="font-bold text-lg text-gray-900">Order #{order.orderNumber}</p>
                            <p className="text-sm text-gray-600">📅 {new Date(order.createdAt).toLocaleDateString()} at {new Date(order.createdAt).toLocaleTimeString()}</p>
                          </div>
                          <div className="flex gap-3">
                            <span className={`px-4 py-2 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}>
                              {order.status.replace(/_/g, ' ').toUpperCase()}
                            </span>
                            <span className={`px-4 py-2 rounded-full text-xs font-semibold ${
                              order.paymentStatus === 'paid' ? 'bg-green-100 text-green-700' :
                              order.paymentStatus === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                              order.paymentStatus === 'failed' ? 'bg-red-100 text-red-700' :
                              'bg-gray-100 text-gray-700'
                            }`}>
                              💳 {order.paymentStatus.toUpperCase()}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Order Details - Grid Layout */}
                      <div className="p-6">
                        {/* Items Section */}
                        <div className="mb-6 pb-6 border-b-2 border-gray-200">
                          <h3 className="text-lg font-bold text-gray-900 mb-4">📦 Items</h3>
                          <div className="space-y-3">
                            {order.items.map((item, idx) => (
                              <div key={idx} className="flex items-center justify-between bg-gray-50 rounded-lg p-4">
                                <div className="flex items-center gap-4">
                                  <img 
                                    src={item.image} 
                                    alt={item.name}
                                    className="w-16 h-16 rounded-lg object-cover"
                                    onError={(e) => {
                                      e.target.onerror = null;
                                      e.target.src = 'https://via.placeholder.com/64x64?text=No+Image';
                                    }}
                                  />
                                  <div>
                                    <p className="font-semibold text-gray-900">{item.name}</p>
                                    <p className="text-sm text-gray-600">Quantity: <span className="font-bold">{item.quantity}</span></p>
                                  </div>
                                </div>
                                <p className="text-lg font-bold text-green-600">Rs.{item.price * item.quantity}</p>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Order Summary Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 pb-6 border-b-2 border-gray-200">
                          {/* Carpenter & Production */}
                          <div className="space-y-4">
                            <div className="bg-purple-50 rounded-lg p-4 border-2 border-purple-100 cursor-pointer hover:shadow-md hover:border-purple-200 transition-all" onClick={() => order.assignedCarpenterId && handleViewCarpenterDetails(order.assignedCarpenterId)}>
                              <p className="text-xs text-gray-500 font-medium mb-1">ASSIGNED CARPENTER</p>
                              <p className={`text-lg font-bold ${order.assignedCarpenterId ? 'text-purple-600 hover:text-purple-700' : 'text-gray-900'}`}>
                                🔨 {order.assignedCarpenter}
                                {order.assignedCarpenterId && <span className="text-xs ml-2">👁️ Click to view</span>}
                              </p>
                            </div>
                            <div className="bg-blue-50 rounded-lg p-4 border-2 border-blue-100">
                              <p className="text-xs text-gray-500 font-medium mb-1">PRODUCTION STATUS</p>
                              <p className={`text-lg font-bold ${
                                order.productionStatus === 'completed' ? 'text-green-600' :
                                order.productionStatus === 'in_progress' ? 'text-blue-600' :
                                'text-gray-600'
                              }`}>
                                {order.productionStatus ? order.productionStatus.replace(/_/g, ' ').toUpperCase() : 'NOT STARTED'}
                              </p>
                            </div>
                          </div>

                          {/* Delivery & Payment */}
                          <div className="space-y-4">
                            <div className="bg-indigo-50 rounded-lg p-4 border-2 border-indigo-100">
                              <p className="text-xs text-gray-500 font-medium mb-1">PAYMENT METHOD</p>
                              <p className="text-lg font-bold text-gray-900">
                                {order.paymentMethod === 'cash' ? '💵 Cash' :
                                 order.paymentMethod === 'card' ? '💳 Card' :
                                 order.paymentMethod === 'online' ? '🌐 Online' :
                                 order.paymentMethod}
                              </p>
                            </div>
                            {order.deliveryDate && (
                              <div className="bg-green-50 rounded-lg p-4 border-2 border-green-100">
                                <p className="text-xs text-gray-500 font-medium mb-1">ESTIMATED DELIVERY</p>
                                <p className="text-lg font-bold text-green-600">📅 {new Date(order.deliveryDate).toLocaleDateString()}</p>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Delivery Address */}
                        {order.deliveryAddress && (
                          <div className="mb-6 pb-6 border-b-2 border-gray-200">
                            <h3 className="text-lg font-bold text-gray-900 mb-3">📍 Delivery Address</h3>
                            <div className="bg-amber-50 rounded-lg p-4 border-2 border-amber-100">
                              <p className="text-gray-900 font-semibold mb-2">{order.deliveryAddress.street}</p>
                              <p className="text-gray-700 text-sm">
                                {order.deliveryAddress.city}, {order.deliveryAddress.state} {order.deliveryAddress.zipCode}
                              </p>
                              <p className="text-gray-600 text-sm mt-1">{order.deliveryAddress.country}</p>
                            </div>
                          </div>
                        )}

                        {/* Order Notes */}
                        {order.notes && (
                          <div className="mb-6 pb-6 border-b-2 border-gray-200">
                            <h3 className="text-lg font-bold text-gray-900 mb-3">📝 Special Instructions</h3>
                            <div className="bg-gray-50 rounded-lg p-4 border-2 border-gray-200">
                              <p className="text-gray-700">{order.notes}</p>
                            </div>
                          </div>
                        )}

                        {/* Total & Action */}
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                          <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-lg p-5 border-2 border-green-300 flex-1">
                            <p className="text-sm text-gray-600 font-medium mb-1">TOTAL AMOUNT</p>
                            <p className="text-3xl font-bold text-green-600">Rs.{order.totalAmount}</p>
                          </div>
                          <Link 
                            to={`/orders/${order._id}`}
                            className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg whitespace-nowrap"
                          >
                            Track Order →
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">📦</div>
                  <p className="text-gray-500 text-lg mb-4">You haven't placed any orders yet</p>
                  <Link to="/gallery" className="inline-block px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg">
                    Start Shopping
                  </Link>
                </div>
              )}
            </div>
          </>
        )}

        {/* Customers Tab - Admin Only */}
        {activeTab === 'customers' && userRole === 'admin' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-2xl font-bold mb-6 text-gray-900">👥 Customer Details</h2>
              <p className="text-gray-600 mb-4">View all customer information and order history</p>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {customers.map((customer) => (
                  <div key={customer.id} className="border-2 border-gray-200 rounded-xl p-6 hover:shadow-xl transition-all hover:border-green-300">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-teal-500 rounded-full flex items-center justify-center text-white text-xl font-bold">
                        {customer.name.charAt(0)}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-900">{customer.name}</h3>
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mt-1 ${
                          customer.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                        }`}>
                          {customer.status.toUpperCase()}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-2 mb-4">
                      <p className="text-sm text-gray-600">
                        📧 <span className="font-medium">{customer.email}</span>
                      </p>
                      <p className="text-sm text-gray-600">
                        📞 <span className="font-medium">{customer.phone}</span>
                      </p>
                      <p className="text-sm text-gray-600">
                        📍 <span className="font-medium">{customer.address}</span>
                      </p>
                      <p className="text-sm text-gray-600">
                        📅 <span className="font-medium">Joined: {new Date(customer.joinedDate).toLocaleDateString()}</span>
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="bg-blue-50 rounded-lg p-3">
                        <p className="text-xs text-gray-600">Total Orders</p>
                        <p className="text-2xl font-bold text-blue-600">{customer.totalOrders}</p>
                      </div>
                      <div className="bg-green-50 rounded-lg p-3">
                        <p className="text-xs text-gray-600">Total Spent</p>
                        <p className="text-2xl font-bold text-green-600">${customer.totalSpent}</p>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        setSelectedCustomer(customer);
                        setShowCustomerDetailsModal(true);
                      }}
                      className="w-full px-4 py-3 bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-lg font-semibold hover:from-green-700 hover:to-teal-700 transition-all shadow-md"
                    >
                      📋 View Full Details
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

      </div>

      {/* Customer Details Modal - Admin Only */}
      {showCustomerDetailsModal && selectedCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="bg-gradient-to-r from-green-600 to-teal-600 p-6 rounded-t-2xl sticky top-0">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-2xl font-bold text-white">📋 Customer Full Details</h3>
                  <p className="text-green-100 mt-1">{selectedCustomer.name}</p>
                </div>
                <button
                  onClick={() => {
                    setShowCustomerDetailsModal(false);
                    setSelectedCustomer(null);
                  }}
                  className="text-white/80 hover:text-white"
                >
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="space-y-4">
                <div className="bg-gray-50 rounded-xl p-4">
                  <h4 className="font-bold text-gray-900 mb-3">📞 Contact Information</h4>
                  <div className="space-y-2 text-sm text-gray-700">
                    <p><span className="font-semibold">Email:</span> {selectedCustomer.email}</p>
                    <p><span className="font-semibold">Phone:</span> {selectedCustomer.phone}</p>
                    <p><span className="font-semibold">Address:</span> {selectedCustomer.address}</p>
                  </div>
                </div>

                <div className="bg-blue-50 rounded-xl p-4">
                  <h4 className="font-bold text-gray-900 mb-3">📊 Account Statistics</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-gray-600">Joined Date</p>
                      <p className="text-lg font-bold text-blue-600">{new Date(selectedCustomer.joinedDate).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">Status</p>
                      <p className="text-lg font-bold text-green-600">{selectedCustomer.status.toUpperCase()}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">Total Orders</p>
                      <p className="text-lg font-bold text-purple-600">{selectedCustomer.totalOrders}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">Total Spent</p>
                      <p className="text-lg font-bold text-green-600">${selectedCustomer.totalSpent}</p>
                    </div>
                  </div>
                </div>
              </div>

              <button
                onClick={() => {
                  setShowCustomerDetailsModal(false);
                  setSelectedCustomer(null);
                }}
                className="w-full mt-6 px-6 py-3 border-2 border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Carpenter Details Modal */}
      {showCarpenterModal && selectedCarpenter && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="bg-gradient-to-r from-amber-600 to-orange-600 p-6 rounded-t-2xl sticky top-0">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-2xl font-bold text-white">🔨 Carpenter Profile</h3>
                  <p className="text-amber-100 mt-1">{selectedCarpenter.name}</p>
                </div>
                <button
                  onClick={() => {
                    setShowCarpenterModal(false);
                    setSelectedCarpenter(null);
                  }}
                  className="text-white/80 hover:text-white"
                >
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="p-6">
              {loadingCarpenter ? (
                <div className="flex items-center justify-center py-12">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading carpenter details...</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Contact Information */}
                  <div className="bg-amber-50 rounded-xl p-5 border-2 border-amber-100">
                    <h4 className="font-bold text-gray-900 mb-4 text-lg">📞 Contact Information</h4>
                    <div className="space-y-3 text-sm text-gray-700">
                      <div className="flex justify-between items-center">
                        <span className="font-semibold">Name:</span>
                        <span className="text-gray-900">{selectedCarpenter.name}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="font-semibold">Email:</span>
                        <span className="text-gray-900">{selectedCarpenter.email}</span>
                      </div>
                      {selectedCarpenter.phone && (
                        <div className="flex justify-between items-center">
                          <span className="font-semibold">Phone:</span>
                          <span className="text-gray-900">{selectedCarpenter.phone}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Professional Details */}
                  <div className="bg-blue-50 rounded-xl p-5 border-2 border-blue-100">
                    <h4 className="font-bold text-gray-900 mb-4 text-lg">💼 Professional Details</h4>
                    <div className="space-y-3">
                      {selectedCarpenter.specialization && (
                        <div className="flex justify-between items-center">
                          <span className="font-semibold text-gray-700">Specialization:</span>
                          <span className="text-gray-900 bg-blue-100 px-3 py-1 rounded-full text-sm">{selectedCarpenter.specialization}</span>
                        </div>
                      )}
                      {selectedCarpenter.experience !== undefined && (
                        <div className="flex justify-between items-center">
                          <span className="font-semibold text-gray-700">Experience:</span>
                          <span className="text-gray-900">{selectedCarpenter.experience} years</span>
                        </div>
                      )}
                      {selectedCarpenter.rating !== undefined && (
                        <div className="flex justify-between items-center">
                          <span className="font-semibold text-gray-700">Rating:</span>
                          <span className="text-amber-600">⭐ {selectedCarpenter.rating}/5.0</span>
                        </div>
                      )}
                      {selectedCarpenter.completedOrders !== undefined && (
                        <div className="flex justify-between items-center">
                          <span className="font-semibold text-gray-700">Completed Orders:</span>
                          <span className="text-green-600 font-bold">{selectedCarpenter.completedOrders}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Bio/Description */}
                  {selectedCarpenter.bio && (
                    <div className="bg-purple-50 rounded-xl p-5 border-2 border-purple-100">
                      <h4 className="font-bold text-gray-900 mb-3 text-lg">📝 About</h4>
                      <p className="text-gray-700 leading-relaxed">{selectedCarpenter.bio}</p>
                    </div>
                  )}

                  {/* Approval Status */}
                  {selectedCarpenter.isApproved !== undefined && (
                    <div className="bg-green-50 rounded-xl p-5 border-2 border-green-100">
                      <h4 className="font-bold text-gray-900 mb-3 text-lg">✅ Verification Status</h4>
                      <div className="flex items-center gap-2">
                        {selectedCarpenter.isApproved ? (
                          <>
                            <span className="text-2xl">✅</span>
                            <span className="text-green-700 font-semibold">Verified Carpenter</span>
                          </>
                        ) : (
                          <>
                            <span className="text-2xl">⏳</span>
                            <span className="text-amber-700 font-semibold">Pending Verification</span>
                          </>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Additional Info */}
                  {selectedCarpenter.address && (
                    <div className="bg-indigo-50 rounded-xl p-5 border-2 border-indigo-100">
                      <h4 className="font-bold text-gray-900 mb-3 text-lg">📍 Location</h4>
                      <p className="text-gray-700">{selectedCarpenter.address}</p>
                    </div>
                  )}
                </div>
              )}

              <button
                onClick={() => {
                  setShowCarpenterModal(false);
                  setSelectedCarpenter(null);
                }}
                className="w-full mt-6 px-6 py-3 bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-lg font-semibold hover:from-amber-700 hover:to-orange-700 transition-all"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerDashboard;
