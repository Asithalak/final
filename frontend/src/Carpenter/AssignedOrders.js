import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const AssignedOrders = () => {
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState('carpenter'); // 'carpenter', 'admin', 'customer'
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showResourcesModal, setShowResourcesModal] = useState(false);
  const [showDeliveryModal, setShowDeliveryModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState('all'); // 'all', 'pending', 'in-progress', 'completed', 'delivered'

  // Load user role from localStorage
  useEffect(() => {
    const storedRole = localStorage.getItem('userRole') || 'carpenter';
    setUserRole(storedRole);
    loadOrders();
  }, []);

  const loadOrders = () => {
    setLoading(true);

    // Mock orders data - Replace with actual API calls
    const mockOrders = [
      {
        id: 1,
        orderNumber: 'ORD-2025-001',
        customerName: 'John Smith',
        customerEmail: 'john.smith@email.com',
        customerPhone: '+1-555-0101',
        customerAddress: '123 Oak Street, Springfield, IL 62701',
        furnitureName: 'Classic Oak Dining Table',
        category: 'Table',
        woodType: 'Oak Wood',
        requiredDate: '2025-11-15',
        orderDate: '2025-11-01',
        status: 'in-progress',
        price: 850,
        assignedCarpenter: 'Michael Johnson',
        design: 'Traditional rectangular design with carved legs',
        dimensions: '180cm x 90cm x 75cm',
        quantity: 1,
        specialRequirements: 'Dark mahogany finish, protective coating',
        requiredResources: [
          { name: 'Oak Wood', needed: 8, available: 50, unit: 'pieces' },
          { name: 'Mahogany Varnish', needed: 2, available: 20, unit: 'liters' },
          { name: 'Steel Brackets', needed: 12, available: 200, unit: 'pieces' },
        ],
      },
      {
        id: 2,
        orderNumber: 'ORD-2025-002',
        customerName: 'Emily Davis',
        customerEmail: 'emily.davis@email.com',
        customerPhone: '+1-555-0102',
        customerAddress: '456 Pine Avenue, Madison, WI 53703',
        furnitureName: 'Modern Office Chair',
        category: 'Chair',
        woodType: 'Pine Wood',
        requiredDate: '2025-11-10',
        orderDate: '2025-10-28',
        status: 'pending',
        price: 320,
        assignedCarpenter: 'Michael Johnson',
        design: 'Ergonomic design with adjustable height',
        dimensions: '60cm x 60cm x 110cm',
        quantity: 4,
        specialRequirements: 'Swivel base, cushioned seat',
        requiredResources: [
          { name: 'Pine Wood', needed: 12, available: 75, unit: 'pieces' },
          { name: 'Fabric Upholstery', needed: 3, available: 30, unit: 'meters' },
          { name: 'Steel Base', needed: 4, available: 25, unit: 'pieces' },
        ],
      },
      {
        id: 3,
        orderNumber: 'ORD-2025-003',
        customerName: 'Sarah Wilson',
        customerEmail: 'sarah.wilson@email.com',
        customerPhone: '+1-555-0103',
        customerAddress: '789 Maple Drive, Austin, TX 78701',
        furnitureName: 'Luxury Leather Sofa',
        category: 'Sofa',
        woodType: 'Mahogany Wood',
        requiredDate: '2025-11-25',
        orderDate: '2025-11-02',
        status: 'completed',
        price: 1500,
        assignedCarpenter: 'Michael Johnson',
        design: '3-seater contemporary design',
        dimensions: '220cm x 95cm x 85cm',
        quantity: 1,
        specialRequirements: 'Premium Italian leather, reinforced frame',
        requiredResources: [
          { name: 'Mahogany Wood', needed: 6, available: 40, unit: 'pieces' },
          { name: 'Leather Upholstery', needed: 8, available: 30, unit: 'meters' },
          { name: 'Steel Springs', needed: 20, available: 150, unit: 'pieces' },
        ],
      },
      {
        id: 4,
        orderNumber: 'ORD-2025-004',
        customerName: 'Robert Brown',
        customerEmail: 'robert.brown@email.com',
        customerPhone: '+1-555-0104',
        customerAddress: '321 Elm Street, Seattle, WA 98101',
        furnitureName: 'Custom Study Desk',
        category: 'Desk',
        woodType: 'Walnut Wood',
        requiredDate: '2025-11-18',
        orderDate: '2025-10-30',
        status: 'delivered',
        price: 680,
        assignedCarpenter: 'Michael Johnson',
        design: 'L-shaped with storage drawers',
        dimensions: '150cm x 120cm x 75cm',
        quantity: 1,
        specialRequirements: 'Cable management system, soft-close drawers',
        deliveryDate: '2025-11-05',
        deliveryStatus: 'Delivered successfully',
        requiredResources: [
          { name: 'Walnut Wood', needed: 10, available: 35, unit: 'pieces' },
          { name: 'Drawer Slides', needed: 6, available: 50, unit: 'sets' },
          { name: 'Wood Stain', needed: 1, available: 15, unit: 'liters' },
        ],
      },
    ];

    setTimeout(() => {
      setOrders(mockOrders);
      setLoading(false);
    }, 500);
  };

  const handleDeliverOrder = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    
    const updatedOrders = orders.map(order =>
      order.id === selectedOrder.id
        ? {
            ...order,
            status: 'delivered',
            deliveryDate: formData.get('deliveryDate'),
            deliveryStatus: formData.get('deliveryNotes'),
          }
        : order
    );

    setOrders(updatedOrders);
    setShowDeliveryModal(false);
    setSelectedOrder(null);
    toast.success('Order delivered successfully!');
  };

  const handleUpdateStatus = (orderId, newStatus) => {
    if (userRole !== 'carpenter' && userRole !== 'admin') {
      toast.error('You do not have permission to update order status');
      return;
    }

    const updatedOrders = orders.map(order =>
      order.id === orderId ? { ...order, status: newStatus } : order
    );
    setOrders(updatedOrders);
    toast.success(`Order status updated to ${newStatus}`);
  };

  const filteredOrders = orders.filter(order => {
    if (filter === 'all') return true;
    return order.status === filter;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-700 border-yellow-300';
      case 'in-progress':
        return 'bg-blue-100 text-blue-700 border-blue-300';
      case 'completed':
        return 'bg-green-100 text-green-700 border-green-300';
      case 'delivered':
        return 'bg-purple-100 text-purple-700 border-purple-300';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return '⏳';
      case 'in-progress':
        return '🔨';
      case 'completed':
        return '✅';
      case 'delivered':
        return '🚚';
      default:
        return '📦';
    }
  };

  const canDeliver = userRole === 'admin';
  const canViewResources = userRole === 'carpenter' || userRole === 'admin';
  const canUpdateStatus = userRole === 'carpenter' || userRole === 'admin';

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-2xl shadow-2xl p-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
                📋 {userRole === 'customer' ? 'My Orders' : 'Assigned Orders'}
              </h1>
              <p className="text-indigo-100 text-lg">
                {userRole === 'customer' ? 'Track your furniture orders and delivery status' :
                 userRole === 'carpenter' ? 'Manage your assigned furniture projects' :
                 'Monitor all orders and manage deliveries'}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg">
                <p className="text-xs text-indigo-100">Role</p>
                <p className="text-lg font-bold text-white capitalize">{userRole}</p>
              </div>
              <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg">
                <p className="text-xs text-indigo-100">Total Orders</p>
                <p className="text-lg font-bold text-white">{orders.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-md p-4">
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setFilter('all')}
              className={`px-6 py-2 rounded-lg font-semibold transition-all ${
                filter === 'all'
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All Orders ({orders.length})
            </button>
            <button
              onClick={() => setFilter('pending')}
              className={`px-6 py-2 rounded-lg font-semibold transition-all ${
                filter === 'pending'
                  ? 'bg-yellow-500 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              ⏳ Pending ({orders.filter(o => o.status === 'pending').length})
            </button>
            <button
              onClick={() => setFilter('in-progress')}
              className={`px-6 py-2 rounded-lg font-semibold transition-all ${
                filter === 'in-progress'
                  ? 'bg-blue-500 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              🔨 In Progress ({orders.filter(o => o.status === 'in-progress').length})
            </button>
            <button
              onClick={() => setFilter('completed')}
              className={`px-6 py-2 rounded-lg font-semibold transition-all ${
                filter === 'completed'
                  ? 'bg-green-500 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              ✅ Completed ({orders.filter(o => o.status === 'completed').length})
            </button>
            <button
              onClick={() => setFilter('delivered')}
              className={`px-6 py-2 rounded-lg font-semibold transition-all ${
                filter === 'delivered'
                  ? 'bg-purple-500 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              🚚 Delivered ({orders.filter(o => o.status === 'delivered').length})
            </button>
          </div>
        </div>

        {/* Orders List */}
        <div className="space-y-6">
          {filteredOrders.length > 0 ? (
            filteredOrders.map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 border-l-4 border-indigo-500"
              >
                {/* Order Header */}
                <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-6 border-b border-gray-200">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-2xl font-bold text-gray-900">{order.furnitureName}</h3>
                        <span className={`px-4 py-1 rounded-full text-sm font-semibold border-2 ${getStatusColor(order.status)}`}>
                          {getStatusIcon(order.status)} {order.status.replace('-', ' ').toUpperCase()}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                        <span className="font-semibold">📦 {order.orderNumber}</span>
                        <span>📅 Ordered: {new Date(order.orderDate).toLocaleDateString()}</span>
                        <span className="text-red-600 font-semibold">⏰ Required: {new Date(order.requiredDate).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-3xl font-bold text-indigo-600">${order.price}</p>
                      <p className="text-sm text-gray-500">Qty: {order.quantity}</p>
                    </div>
                  </div>
                </div>

                {/* Order Details */}
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    
                    {/* Customer Information (visible to carpenter and admin) */}
                    {(userRole === 'carpenter' || userRole === 'admin') && (
                      <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                        <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                          👤 Customer Information
                        </h4>
                        <div className="space-y-2 text-sm">
                          <p><span className="font-semibold">Name:</span> {order.customerName}</p>
                          <p><span className="font-semibold">Email:</span> {order.customerEmail}</p>
                          <p><span className="font-semibold">Phone:</span> {order.customerPhone}</p>
                          {userRole === 'admin' && (
                            <p><span className="font-semibold">Address:</span> {order.customerAddress}</p>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Furniture Details (visible to all) */}
                    <div className="bg-purple-50 rounded-xl p-4 border border-purple-200">
                      <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                        🪑 Furniture Details
                      </h4>
                      <div className="space-y-2 text-sm">
                        <p><span className="font-semibold">Category:</span> {order.category}</p>
                        <p><span className="font-semibold">Wood Type:</span> {order.woodType}</p>
                        <p><span className="font-semibold">Dimensions:</span> {order.dimensions}</p>
                        <p><span className="font-semibold">Design:</span> {order.design}</p>
                      </div>
                    </div>

                    {/* Special Requirements (visible to all) */}
                    <div className="bg-green-50 rounded-xl p-4 border border-green-200">
                      <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                        📝 Special Requirements
                      </h4>
                      <p className="text-sm text-gray-700">{order.specialRequirements}</p>
                      {(userRole === 'carpenter' || userRole === 'admin') && (
                        <div className="mt-3 pt-3 border-t border-green-200">
                          <p className="text-xs font-semibold text-gray-600">Assigned To:</p>
                          <p className="text-sm font-bold text-green-700">{order.assignedCarpenter}</p>
                        </div>
                      )}
                    </div>

                    {/* Delivery Information (if delivered) */}
                    {order.status === 'delivered' && (
                      <div className="bg-purple-50 rounded-xl p-4 border border-purple-200 md:col-span-2 lg:col-span-3">
                        <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                          🚚 Delivery Information
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          <p><span className="font-semibold">Delivered On:</span> {new Date(order.deliveryDate).toLocaleDateString()}</p>
                          <p><span className="font-semibold">Status:</span> {order.deliveryStatus}</p>
                          {userRole === 'admin' && (
                            <p className="md:col-span-2"><span className="font-semibold">Delivery Address:</span> {order.customerAddress}</p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-3 mt-6 pt-6 border-t border-gray-200">
                    
                    {/* View Resources Button (Carpenter & Admin) */}
                    {canViewResources && (
                      <button
                        onClick={() => {
                          setSelectedOrder(order);
                          setShowResourcesModal(true);
                        }}
                        className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg hover:shadow-xl flex items-center gap-2"
                      >
                        📦 Check Resources
                      </button>
                    )}

                    {/* Update Status Buttons (Carpenter & Admin) */}
                    {canUpdateStatus && order.status === 'pending' && (
                      <button
                        onClick={() => handleUpdateStatus(order.id, 'in-progress')}
                        className="px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl font-semibold hover:from-green-700 hover:to-green-800 transition-all shadow-lg hover:shadow-xl"
                      >
                        ▶️ Start Work
                      </button>
                    )}

                    {canUpdateStatus && order.status === 'in-progress' && (
                      <button
                        onClick={() => handleUpdateStatus(order.id, 'completed')}
                        className="px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-xl font-semibold hover:from-purple-700 hover:to-purple-800 transition-all shadow-lg hover:shadow-xl"
                      >
                        ✅ Mark Complete
                      </button>
                    )}

                    {/* Deliver Button (Admin only) */}
                    {canDeliver && order.status === 'completed' && (
                      <button
                        onClick={() => {
                          setSelectedOrder(order);
                          setShowDeliveryModal(true);
                        }}
                        className="px-6 py-3 bg-gradient-to-r from-pink-600 to-rose-700 text-white rounded-xl font-semibold hover:from-pink-700 hover:to-rose-800 transition-all shadow-lg hover:shadow-xl flex items-center gap-2"
                      >
                        🚚 Deliver Order
                      </button>
                    )}

                    {/* View Details Button */}
                    <button
                      onClick={() => navigate(`/orders/${order.id}`)}
                      className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all"
                    >
                      👁️ View Full Details
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
              <div className="text-6xl mb-4">📭</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">No Orders Found</h3>
              <p className="text-gray-600">
                {filter === 'all'
                  ? 'No orders available at the moment'
                  : `No ${filter.replace('-', ' ')} orders found`}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Resources Modal */}
      {showResourcesModal && selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 rounded-t-2xl">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-2xl font-bold text-white">📦 Required Resources</h3>
                  <p className="text-blue-100 mt-1">{selectedOrder.furnitureName} - {selectedOrder.orderNumber}</p>
                </div>
                <button
                  onClick={() => {
                    setShowResourcesModal(false);
                    setSelectedOrder(null);
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
                {selectedOrder.requiredResources.map((resource, index) => {
                  const isAvailable = resource.available >= resource.needed;
                  const percentage = Math.min((resource.available / resource.needed) * 100, 100);

                  return (
                    <div
                      key={index}
                      className={`border-2 rounded-xl p-4 ${
                        isAvailable
                          ? 'bg-green-50 border-green-300'
                          : 'bg-red-50 border-red-300'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h4 className="text-lg font-bold text-gray-900">{resource.name}</h4>
                          <p className="text-sm text-gray-600">Unit: {resource.unit}</p>
                        </div>
                        <span
                          className={`px-4 py-2 rounded-lg text-sm font-bold ${
                            isAvailable
                              ? 'bg-green-600 text-white'
                              : 'bg-red-600 text-white'
                          }`}
                        >
                          {isAvailable ? '✓ Available' : '✗ Insufficient'}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-4 mb-3">
                        <div className="bg-white rounded-lg p-3">
                          <p className="text-xs text-gray-600">Needed</p>
                          <p className="text-xl font-bold text-gray-900">
                            {resource.needed} {resource.unit}
                          </p>
                        </div>
                        <div className="bg-white rounded-lg p-3">
                          <p className="text-xs text-gray-600">Available</p>
                          <p className="text-xl font-bold text-gray-900">
                            {resource.available} {resource.unit}
                          </p>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div className="bg-gray-200 rounded-full h-3 overflow-hidden">
                        <div
                          className={`h-full transition-all duration-500 ${
                            isAvailable ? 'bg-green-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <p className="text-xs text-gray-600 mt-1 text-right">
                        {percentage.toFixed(0)}% Available
                      </p>

                      {!isAvailable && (
                        <div className="mt-3 bg-red-100 border border-red-300 rounded-lg p-3">
                          <p className="text-sm text-red-700 font-semibold">
                            ⚠️ Shortage: {resource.needed - resource.available} {resource.unit} needed
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex items-center justify-between bg-indigo-50 rounded-lg p-4">
                  <div>
                    <p className="text-sm text-gray-600">Overall Resource Status</p>
                    <p className="text-xl font-bold text-gray-900">
                      {selectedOrder.requiredResources.every(r => r.available >= r.needed)
                        ? '✅ All resources available'
                        : '⚠️ Some resources insufficient'}
                    </p>
                  </div>
                  {!selectedOrder.requiredResources.every(r => r.available >= r.needed) && (
                    <button
                      onClick={() => {
                        toast.info('Order materials feature coming soon!');
                      }}
                      className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-all"
                    >
                      📦 Order Materials
                    </button>
                  )}
                </div>
              </div>

              <button
                onClick={() => {
                  setShowResourcesModal(false);
                  setSelectedOrder(null);
                }}
                className="w-full mt-4 px-6 py-3 border-2 border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delivery Modal (Admin only) */}
      {showDeliveryModal && selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="bg-gradient-to-r from-pink-600 to-rose-600 p-6 rounded-t-2xl">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-2xl font-bold text-white">🚚 Deliver Order</h3>
                  <p className="text-pink-100 mt-1">{selectedOrder.furnitureName} - {selectedOrder.orderNumber}</p>
                </div>
                <button
                  onClick={() => {
                    setShowDeliveryModal(false);
                    setSelectedOrder(null);
                  }}
                  className="text-white/80 hover:text-white"
                >
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <form onSubmit={handleDeliverOrder} className="p-6 space-y-6">
              {/* Customer Delivery Information */}
              <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                <h4 className="font-bold text-gray-900 mb-3">📍 Delivery Location</h4>
                <div className="space-y-2 text-sm">
                  <p><span className="font-semibold">Customer:</span> {selectedOrder.customerName}</p>
                  <p><span className="font-semibold">Phone:</span> {selectedOrder.customerPhone}</p>
                  <p><span className="font-semibold">Address:</span> {selectedOrder.customerAddress}</p>
                </div>
              </div>

              {/* Order Summary */}
              <div className="bg-purple-50 rounded-xl p-4 border border-purple-200">
                <h4 className="font-bold text-gray-900 mb-3">📦 Order Summary</h4>
                <div className="space-y-2 text-sm">
                  <p><span className="font-semibold">Item:</span> {selectedOrder.furnitureName}</p>
                  <p><span className="font-semibold">Quantity:</span> {selectedOrder.quantity}</p>
                  <p><span className="font-semibold">Total Price:</span> ${selectedOrder.price}</p>
                </div>
              </div>

              {/* Delivery Details Form */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Delivery Date</label>
                  <input
                    type="date"
                    name="deliveryDate"
                    required
                    defaultValue={new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Delivery Notes / Status</label>
                  <textarea
                    name="deliveryNotes"
                    required
                    rows="3"
                    placeholder="e.g., Delivered successfully, customer satisfied"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  ></textarea>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-pink-600 to-rose-700 text-white px-6 py-3 rounded-lg font-semibold hover:from-pink-700 hover:to-rose-800 transition-all shadow-lg"
                >
                  ✓ Confirm Delivery
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowDeliveryModal(false);
                    setSelectedOrder(null);
                  }}
                  className="px-6 py-3 border-2 border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AssignedOrders;
