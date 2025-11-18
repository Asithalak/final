import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const CustomerDashboard = () => {
  const [userRole, setUserRole] = useState('customer'); // 'customer', 'admin'
  const [activeTab, setActiveTab] = useState('orders'); // 'orders', 'carpenters', 'customers'
  const [orders, setOrders] = useState([]);
  const [carpenters, setCarpenters] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [selectedCarpenter, setSelectedCarpenter] = useState(null);
  const [showDesignsModal, setShowDesignsModal] = useState(false);
  const [showResourcesModal, setShowResourcesModal] = useState(false);
  const [showCustomerDetailsModal, setShowCustomerDetailsModal] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get user role from localStorage
    const storedRole = localStorage.getItem('userRole') || 'customer';
    setUserRole(storedRole);
    loadData();
  }, []);

  const loadData = () => {
    setLoading(true);
    
    // Get user role for filtering
    const storedRole = localStorage.getItem('userRole') || 'customer';
    
    // Mock orders data
    const mockOrders = [
      {
        _id: '1',
        orderNumber: 'ORD-2025-001',
        createdAt: '2025-11-01',
        status: 'in_production',
        items: [{ name: 'Oak Chair', quantity: 2 }],
        totalAmount: 500,
        carpenter: 'Michael Johnson',
      },
      {
        _id: '2',
        orderNumber: 'ORD-2025-002',
        createdAt: '2025-11-05',
        status: 'delivered',
        items: [{ name: 'Dining Table', quantity: 1 }],
        totalAmount: 850,
        carpenter: 'Sarah Williams',
      },
    ];

    // Mock carpenters data
    const mockCarpenters = [
      {
        id: 1,
        name: 'Michael Johnson',
        email: 'michael.j@example.com',
        phone: '+1-555-0101',
        specialization: 'Modern Furniture',
        experience: 10,
        rating: 4.8,
        completedOrders: 156,
        designs: [
          { id: 1, name: 'Classic Oak Chair', category: 'Chair', price: 250, timeRequired: '3-4 days', image: '/images/furniture/chairs/chair1.jpg' },
          { id: 2, name: 'Modern Dining Table', category: 'Table', price: 850, timeRequired: '5-7 days', image: '/images/furniture/tables/table1.jpg' },
        ],
        resources: [
          { id: 1, name: 'Oak Wood', quantity: 50, unit: 'pieces', pricePerUnit: 25 },
          { id: 2, name: 'Steel Hinges', quantity: 200, unit: 'pieces', pricePerUnit: 3 },
        ],
      },
      {
        id: 2,
        name: 'Sarah Williams',
        email: 'sarah.w@example.com',
        phone: '+1-555-0102',
        specialization: 'Classic Designs',
        experience: 8,
        rating: 4.9,
        completedOrders: 142,
        designs: [
          { id: 3, name: 'Vintage Sofa', category: 'Sofa', price: 1200, timeRequired: '7-10 days', image: '/images/furniture/sofas/sofa1.jpg' },
          { id: 4, name: 'Study Desk', category: 'Desk', price: 450, timeRequired: '4-5 days', image: '/images/furniture/desks/desk1.jpg' },
        ],
        resources: [
          { id: 3, name: 'Leather Upholstery', quantity: 30, unit: 'meters', pricePerUnit: 60 },
          { id: 4, name: 'Mahogany Varnish', quantity: 20, unit: 'liters', pricePerUnit: 45 },
        ],
      },
    ];

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

    setTimeout(() => {
      setOrders(mockOrders);
      
      // Filter carpenters based on user role
      if (storedRole === 'customer') {
        // For customers: Only show carpenters assigned to their orders
        const carpenterNamesInOrders = [...new Set(mockOrders.map(order => order.carpenter))];
        const filteredCarpenters = mockCarpenters.filter(carpenter => 
          carpenterNamesInOrders.includes(carpenter.name)
        );
        setCarpenters(filteredCarpenters);
      } else {
        // For admin: Show all carpenters
        setCarpenters(mockCarpenters);
      }
      
      setCustomers(mockCustomers);
      setLoading(false);
    }, 500);
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
            <button
              onClick={() => setActiveTab('carpenters')}
              className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                activeTab === 'carpenters'
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              🔨 View Carpenters
            </button>
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
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div key={order._id} className="border-2 border-gray-200 rounded-xl p-5 hover:shadow-lg transition-all hover:border-blue-300">
                      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <p className="font-bold text-lg text-gray-900">Order #{order.orderNumber}</p>
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}>
                              {order.status.replace(/_/g, ' ').toUpperCase()}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mb-1">
                            📅 {new Date(order.createdAt).toLocaleDateString()}
                          </p>
                          <p className="text-sm text-gray-600">
                            🔨 Carpenter: <span className="font-semibold text-gray-900">{order.carpenter}</span>
                          </p>
                          <p className="text-sm text-gray-600 mt-2">
                            {order.items.length} item(s) • <span className="text-lg font-bold text-green-600">${order.totalAmount}</span>
                          </p>
                        </div>
                        <Link 
                          to={`/orders/${order._id}`}
                          className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg"
                        >
                          Track Order →
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">📦</div>
                  <p className="text-gray-500 text-lg mb-4">You haven't placed any orders yet</p>
                  <Link to="/catalogue" className="inline-block px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg">
                    Start Shopping
                  </Link>
                </div>
              )}
            </div>
          </>
        )}

        {/* Carpenters Tab - View Only */}
        {activeTab === 'carpenters' && (
          <div className="space-y-6">
            {/* Info Banner for Customers */}
            {userRole === 'customer' && (
              <div className="bg-gradient-to-r from-purple-100 to-pink-100 border-2 border-purple-300 rounded-xl p-6">
                <div className="flex items-start gap-4">
                  <div className="text-4xl">ℹ️</div>
                  <div>
                    <h3 className="text-lg font-bold text-purple-900 mb-2">Viewing Your Assigned Carpenters</h3>
                    <p className="text-purple-800 text-sm">
                      You can only view carpenters who are currently assigned to your orders. 
                      To see more carpenters, place additional orders from our furniture catalog.
                    </p>
                  </div>
                </div>
              </div>
            )}
            
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-2xl font-bold mb-6 text-gray-900">
                🔨 {userRole === 'admin' ? 'All Carpenters' : 'Your Assigned Carpenters'}
              </h2>
              <p className="text-gray-600 mb-4">
                {userRole === 'admin' 
                  ? 'Browse all carpenter profiles, view their designs and available resources (View only)' 
                  : 'View details of carpenters working on your orders - designs and resources (View only)'}
              </p>
              
              {carpenters.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {carpenters.map((carpenter) => (
                  <div key={carpenter.id} className="border-2 border-gray-200 rounded-xl p-6 hover:shadow-xl transition-all hover:border-purple-300">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                        {carpenter.name.charAt(0)}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-900">{carpenter.name}</h3>
                        <p className="text-sm text-gray-600">{carpenter.specialization}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-yellow-500 font-bold">⭐ {carpenter.rating}</span>
                          <span className="text-gray-500 text-sm">• {carpenter.completedOrders} orders</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2 mb-4">
                      <p className="text-sm text-gray-600">
                        📧 <span className="font-medium">{carpenter.email}</span>
                      </p>
                      <p className="text-sm text-gray-600">
                        📞 <span className="font-medium">{carpenter.phone}</span>
                      </p>
                      <p className="text-sm text-gray-600">
                        🎓 <span className="font-medium">{carpenter.experience} years experience</span>
                      </p>
                    </div>

                    <div className="flex gap-3">
                      <button
                        onClick={() => {
                          setSelectedCarpenter(carpenter);
                          setShowDesignsModal(true);
                        }}
                        className="flex-1 px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all shadow-md"
                      >
                        👁️ View Designs
                      </button>
                      <button
                        onClick={() => {
                          setSelectedCarpenter(carpenter);
                          setShowResourcesModal(true);
                        }}
                        className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md"
                      >
                        📦 View Resources
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              ) : (
                <div className="text-center py-12 bg-gray-50 rounded-xl">
                  <div className="text-6xl mb-4">🔨</div>
                  <p className="text-gray-500 text-lg mb-2">No carpenters assigned yet</p>
                  <p className="text-gray-400 text-sm mb-4">Place an order to see carpenters assigned to your work</p>
                  <Link to="/catalogue" className="inline-block px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg">
                    Browse Furniture
                  </Link>
                </div>
              )}
            </div>
          </div>
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

      {/* Carpenter Designs Modal - View Only */}
      {showDesignsModal && selectedCarpenter && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6 rounded-t-2xl sticky top-0">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-2xl font-bold text-white">🎨 {selectedCarpenter.name}'s Designs</h3>
                  <p className="text-purple-100 mt-1">View only - No editing allowed</p>
                </div>
                <button
                  onClick={() => {
                    setShowDesignsModal(false);
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {selectedCarpenter.designs.map((design) => (
                  <div key={design.id} className="border-2 border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-all">
                    <div className="h-48 bg-gray-200 flex items-center justify-center text-gray-400">
                      🪑 {design.category}
                    </div>
                    <div className="p-4">
                      <h4 className="text-lg font-bold text-gray-900 mb-2">{design.name}</h4>
                      <div className="space-y-1 text-sm text-gray-600">
                        <p>📂 Category: <span className="font-semibold">{design.category}</span></p>
                        <p>⏱️ Time: <span className="font-semibold">{design.timeRequired}</span></p>
                        <p>💰 Price: <span className="text-lg font-bold text-green-600">${design.price}</span></p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={() => {
                  setShowDesignsModal(false);
                  setSelectedCarpenter(null);
                }}
                className="w-full mt-6 px-6 py-3 border-2 border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Carpenter Resources Modal - View Only */}
      {showResourcesModal && selectedCarpenter && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 rounded-t-2xl sticky top-0">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-2xl font-bold text-white">📦 {selectedCarpenter.name}'s Resources</h3>
                  <p className="text-blue-100 mt-1">View only - No editing allowed</p>
                </div>
                <button
                  onClick={() => {
                    setShowResourcesModal(false);
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
              <div className="space-y-4">
                {selectedCarpenter.resources.map((resource) => (
                  <div key={resource.id} className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl p-5">
                    <div className="flex justify-between items-start mb-3">
                      <h4 className="text-xl font-bold text-gray-900">{resource.name}</h4>
                      <span className="px-3 py-1 bg-blue-600 text-white rounded-lg text-sm font-semibold">
                        In Stock
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="bg-white rounded-lg p-3">
                        <p className="text-xs text-gray-600">Quantity</p>
                        <p className="text-lg font-bold text-gray-900">{resource.quantity} {resource.unit}</p>
                      </div>
                      <div className="bg-white rounded-lg p-3">
                        <p className="text-xs text-gray-600">Price/Unit</p>
                        <p className="text-lg font-bold text-green-600">${resource.pricePerUnit}</p>
                      </div>
                      <div className="bg-white rounded-lg p-3">
                        <p className="text-xs text-gray-600">Total Value</p>
                        <p className="text-lg font-bold text-indigo-600">${resource.quantity * resource.pricePerUnit}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={() => {
                  setShowResourcesModal(false);
                  setSelectedCarpenter(null);
                }}
                className="w-full mt-6 px-6 py-3 border-2 border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

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
    </div>
  );
};

export default CustomerDashboard;
