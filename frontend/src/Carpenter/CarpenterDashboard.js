import React, { useState, useEffect, useCallback } from 'react';
import { furnitureAPI, resourcesAPI, ordersAPI } from '../services/api';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import catalogData from '../data/furniture_catalog.json';

const CarpenterDashboard = () => {
  const navigate = useNavigate();
  const [furniture, setFurniture] = useState([]);
  const [resources, setResources] = useState([]);
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState('furniture');
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showAddItemModal, setShowAddItemModal] = useState(false);
  
  // Role-based access control (can be fetched from auth context/API)
  // For now, using localStorage or default to 'carpenter'
  const [userRole, setUserRole] = useState('carpenter'); // 'carpenter', 'customer', 'admin'
  const [assignedCategories, setAssignedCategories] = useState(['chair', 'table']); // Carpenter's assigned categories

  // Load user role from localStorage or API
  useEffect(() => {
    const storedRole = localStorage.getItem('userRole') || 'carpenter';
    const storedCategories = JSON.parse(localStorage.getItem('assignedCategories') || '["chair", "table"]');
    setUserRole(storedRole);
    setAssignedCategories(storedCategories);
  }, []);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      
      // Get all furniture from catalog for display
      const allCatalogFurniture = [
        ...catalogData.chairs,
        ...catalogData.tables,
        ...catalogData.sofas,
        ...catalogData.beds,
        ...catalogData.cabinets,
        ...catalogData.desks,
        ...catalogData.shelves
      ];
      
      // Try to fetch from API, but use catalog data as fallback
      try {
        const [furnitureRes, resourcesRes, ordersRes] = await Promise.all([
          furnitureAPI.getAll(),
          resourcesAPI.getAll(),
          ordersAPI.getAll()
        ]);
        
        setFurniture(furnitureRes.data);
        setResources(resourcesRes.data);
        setOrders(ordersRes.data);
      } catch (apiError) {
        // Use catalog data as fallback
        console.log('Using catalog data as fallback');
        setFurniture(allCatalogFurniture);
      }
    } catch (error) {
      toast.error('Failed to fetch data');
      console.error(error);
      // Still show catalog data even on error
      const allCatalogFurniture = [
        ...catalogData.chairs,
        ...catalogData.tables,
        ...catalogData.sofas,
        ...catalogData.beds,
        ...catalogData.cabinets,
        ...catalogData.desks,
        ...catalogData.shelves
      ];
      setFurniture(allCatalogFurniture);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Categories data with images from catalog
  const categories = [
    { 
      id: 'chair', 
      name: 'Chairs', 
      icon: '🪑', 
      color: 'from-blue-500 to-blue-600',
      items: catalogData.chairs,
      image: catalogData.chairs[0]?.images[0]
    },
    { 
      id: 'table', 
      name: 'Tables', 
      icon: '🪑', 
      color: 'from-green-500 to-green-600',
      items: catalogData.tables,
      image: catalogData.tables[0]?.images[0]
    },
    { 
      id: 'sofa', 
      name: 'Sofas', 
      icon: '🛋️', 
      color: 'from-purple-500 to-purple-600',
      items: catalogData.sofas,
      image: catalogData.sofas[0]?.images[0]
    },
    { 
      id: 'bed', 
      name: 'Beds', 
      icon: '🛏️', 
      color: 'from-pink-500 to-pink-600',
      items: catalogData.beds,
      image: catalogData.beds[0]?.images[0]
    },
    { 
      id: 'cabinet', 
      name: 'Cabinets', 
      icon: '🗄️', 
      color: 'from-yellow-500 to-yellow-600',
      items: catalogData.cabinets,
      image: catalogData.cabinets[0]?.images[0]
    },
    { 
      id: 'desk', 
      name: 'Desks', 
      icon: '🪑', 
      color: 'from-red-500 to-red-600',
      items: catalogData.desks,
      image: catalogData.desks[0]?.images[0]
    },
    { 
      id: 'shelf', 
      name: 'Shelves', 
      icon: '📚', 
      color: 'from-indigo-500 to-indigo-600',
      items: catalogData.shelves,
      image: catalogData.shelves[0]?.images[0]
    }
  ];

  const handleCategorySelect = (category) => {
    if (userRole === 'carpenter') {
      if (assignedCategories.includes(category.id)) {
        setSelectedCategory(category);
        setShowAddItemModal(true);
      } else {
        toast.warning(`You are not assigned to create ${category.name}`);
      }
    } else {
      navigate(`/category/${category.id}`);
    }
  };

  const handleAddItem = () => {
    if (userRole !== 'carpenter') {
      toast.error('Only carpenters can add new items');
      return;
    }
    toast.success('Add item functionality coming soon!');
    setShowAddItemModal(false);
  };

  const isAssigned = (categoryId) => assignedCategories.includes(categoryId);
  const canEdit = userRole === 'carpenter';

  const tabs = [
    { id: 'furniture', label: 'My Furniture Designs' },
    { id: 'resources', label: 'My Resources' },
    { id: 'orders', label: 'Assigned Orders' },
  ];

  const handleTabClick = (tab) => {
    if (tab.route) {
      navigate(tab.route);
    } else {
      setActiveTab(tab.id);
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
    <div className="space-y-6">
      {/* Header Section with Role Info */}
      <div className="bg-gradient-to-r from-primary-600 via-primary-700 to-primary-800 rounded-2xl shadow-2xl overflow-hidden">
        <div className="p-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">
                {userRole === 'carpenter' ? '🔨 Carpenter' : userRole === 'admin' ? '👨‍💼 Admin' : '👤 Customer'} Dashboard
              </h1>
              <p className="text-primary-100 text-lg">
                {userRole === 'carpenter' ? 'Create and manage your furniture designs' : 
                 userRole === 'admin' ? 'View all furniture and manage system' : 
                 'Browse available furniture designs'}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg">
                <p className="text-xs text-primary-100">Role</p>
                <p className="text-lg font-bold text-white capitalize">{userRole}</p>
              </div>
            </div>
          </div>
          

          {/* Assigned Categories for Carpenter */}
          {userRole === 'carpenter' && assignedCategories.length > 0 && (
            <div className="mt-6 pt-6 border-t border-white/20">
              <div className="flex gap-3">
                 
                  {canEdit && (
                    <button 
                      onClick={() => toast.info('Upload functionality coming soon!')}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                    >
                      + Upload New Design
                    </button>
                  )}
                </div>
            </div>
          )}
        </div>
      </div>



      {/* Tabs Section */}
      <div className="bg-white rounded-xl shadow-md">
        <div className="border-b">
          <div className="flex">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => handleTabClick(tab)}
                className={`px-6 py-3 font-medium transition ${
                  activeTab === tab.id
                    ? 'border-b-2 border-primary-600 text-primary-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="p-6">
          {activeTab === 'furniture' && (
            <div>
                {/* Category Summary Cards */}
              <div className="bg-gray-50 p-4 rounded-lg mb-6 shadow-inner flex items-center justify-center">
                   {furniture.length > 0 && (
                <div className="mt-8 pt-6 border-t border-gray-200 w-full">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4 text-center">Designs by Category</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-10 justify-items-center">
                    {[
                      { name: 'Chairs', count: catalogData.chairs.length, icon: '🪑', color: 'from-blue-500 to-blue-600' },
                      { name: 'Tables', count: catalogData.tables.length, icon: '🪑', color: 'from-green-500 to-green-600' },
                      { name: 'Sofas', count: catalogData.sofas.length, icon: '🛋️', color: 'from-purple-500 to-purple-600' },
                      { name: 'Beds', count: catalogData.beds.length, icon: '🛏️', color: 'from-pink-500 to-pink-600' },
                      { name: 'Cabinets', count: catalogData.cabinets.length, icon: '🗄️', color: 'from-yellow-500 to-yellow-600' },
                      { name: 'Desks', count: catalogData.desks.length, icon: '🪑', color: 'from-red-500 to-red-600' },
                      { name: 'Shelves', count: catalogData.shelves.length, icon: '📚', color: 'from-indigo-500 to-indigo-600' }
                    ].map(category => (
                      <div 
                        key={category.name}
                        onClick={() => navigate(`/category/${category.name.toLowerCase().slice(0, -1)}`)}
                        className="bg-white rounded-xl p-4 shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer group border border-gray-100 w-full"
                      >
                        <div className={`w-12 h-12 bg-gradient-to-br ${category.color} rounded-lg flex items-center justify-center text-2xl mb-3 group-hover:scale-110 transition-transform shadow-lg mx-auto`}>
                          {category.icon}
                        </div>
                        <p className="text-2xl font-bold text-gray-900 mb-1 text-center">{category.count}</p>
                        <p className="text-xs text-gray-600 font-medium text-center">{category.name}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
                </div>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold">Recent Furniture Designs</h3>
                
              </div>
              {furniture.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {furniture.slice(0, 20).map(item => (
                    <div 
                      key={item._id || item.id} 
                      className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-2xl transition-all duration-300 cursor-pointer group"
                      onClick={() => navigate(`/category/${item.category}`)}
                    >
                      {/* Furniture Image */}
                      <div className="relative h-56 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
                        <img
                          src={item.images ? item.images[0] : 'https://via.placeholder.com/400x400/8B4513/FFFFFF?text=Furniture'}
                          alt={item.title || item.name}
                          className="w-full h-full object-cover transition-all duration-500 group-hover:scale-110 group-hover:rotate-2"
                          onError={(e) => {
                            e.target.src = 'https://via.placeholder.com/400x400/8B4513/FFFFFF?text=Furniture';
                          }}
                        />
                        {/* Price Badge with Animation */}
                        <div className="absolute top-3 right-3 bg-gradient-to-r from-primary-600 to-primary-700 text-white px-4 py-2 rounded-full text-sm font-bold shadow-xl transform group-hover:scale-110 transition-transform">
                          ${item.price}
                        </div>
                        
                        {/* Category Badge */}
                        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-gray-800 px-3 py-1 rounded-full text-xs font-semibold shadow-md capitalize">
                          {item.category}
                        </div>
                        
                        {/* Hover Overlay with Metadata */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300">
                          <div className="absolute bottom-0 left-0 right-0 p-4 text-white transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                            <div className="flex flex-wrap gap-2 mb-2">
                              {item.wood_material && (
                                <span className="px-3 py-1 bg-amber-500/90 backdrop-blur-sm rounded-full text-xs font-semibold shadow-lg flex items-center gap-1">
                                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M2 6a2 2 0 012-2h12a2 2 0 012 2v2a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14 12a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"/>
                                  </svg>
                                  {item.wood_material}
                                </span>
                              )}
                              {item.work_duration && (
                                <span className="px-3 py-1 bg-blue-500/90 backdrop-blur-sm rounded-full text-xs font-semibold shadow-lg flex items-center gap-1">
                                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd"/>
                                  </svg>
                                  {item.work_duration}
                                </span>
                              )}
                              {item.paint_code && (
                                <span className="px-3 py-1 bg-green-500/90 backdrop-blur-sm rounded-full text-xs font-semibold shadow-lg flex items-center gap-1">
                                  <div className="w-3 h-3 rounded-full border-2 border-white" style={{backgroundColor: item.paint_code}}></div>
                                  {item.paint_code}
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-white/90 line-clamp-2">{item.description}</p>
                          </div>
                        </div>
                      </div>
                      
                      {/* Card Content */}
                      <div className="p-4 bg-gradient-to-b from-white to-gray-50">
                        <h4 className="font-bold text-gray-900 mb-1 line-clamp-1 text-base group-hover:text-primary-600 transition-colors">
                          {item.title || item.name}
                        </h4>
                        
                        {item.description && (
                          <p className="text-gray-600 text-xs mb-3 line-clamp-1">
                            {item.description}
                          </p>
                        )}
                        
                        {/* Status & Actions Row */}
                        <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                          {/* Status Badge */}
                          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                            item.isApproved ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                          }`}>
                            {item.status || (item.isApproved ? '✓ Approved' : '⏱ Pending')}
                          </span>
                          
                          {/* Quick Action Button */}
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/category/${item.category}`);
                            }}
                            className="text-primary-600 hover:text-primary-700 text-xs font-semibold flex items-center gap-1 group/btn"
                          >
                            View
                            <svg className="w-3 h-3 transform group-hover/btn:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                  <svg
                    className="mx-auto h-12 w-12 text-gray-400 mb-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                    />
                  </svg>
                  <p className="text-gray-500 mb-4">No furniture designs uploaded yet</p>
                  <button className="btn-primary">Upload Your First Design</button>
                </div>
              )}

            
           
            </div>
          )}

          {activeTab === 'resources' && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold">My Resources</h3>
                <button className="btn-primary">Add New Resource</button>
              </div>
              {resources.length > 0 ? (
                <div className="space-y-3">
                  {resources.map(resource => (
                    <div key={resource._id} className="border rounded-lg p-4 flex justify-between items-center">
                      <div>
                        <h4 className="font-semibold">{resource.name}</h4>
                        <p className="text-sm text-gray-600">
                          {resource.quantity} {resource.unit} • ${resource.pricePerUnit}/{resource.unit}
                        </p>
                      </div>
                      <span className={`px-2 py-1 rounded text-xs ${
                        resource.isApproved ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {resource.status}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">No resources listed yet</p>
              )}
            </div>
          )}

          {activeTab === 'orders' && (
            <div>
              <h3 className="text-xl font-semibold mb-4">Assigned Orders</h3>
              {orders.length > 0 ? (
                <div className="space-y-3">
                  {orders.map(order => (
                    <div key={order._id} className="border rounded-lg p-4">
                      <p className="font-semibold">Order #{order.orderNumber}</p>
                      <p className="text-sm text-gray-600">Status: {order.status}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">No orders assigned yet</p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Add Item Modal */}
      {showAddItemModal && selectedCategory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className={`bg-gradient-to-r ${selectedCategory.color} p-6 rounded-t-2xl`}>
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center text-3xl">
                      {selectedCategory.icon}
                    </div>
                    <h3 className="text-2xl font-bold text-white">Add New {selectedCategory.name}</h3>
                  </div>
                  <p className="text-white/90">Create a new furniture item in this category</p>
                </div>
                <button
                  onClick={() => setShowAddItemModal(false)}
                  className="text-white/80 hover:text-white transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              <form className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Item Name</label>
                    <input
                      type="text"
                      placeholder="e.g., Modern Oak Chair"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Price ($)</label>
                    <input
                      type="number"
                      placeholder="299.99"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Wood Material</label>
                    <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent">
                      <option>Oak</option>
                      <option>Maple</option>
                      <option>Walnut</option>
                      <option>Cherry</option>
                      <option>Pine</option>
                      <option>Mahogany</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Work Duration</label>
                    <input
                      type="text"
                      placeholder="e.g., 3-4 days"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Paint Code</label>
                    <input
                      type="text"
                      placeholder="#8B4513"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Dimensions</label>
                    <input
                      type="text"
                      placeholder='24" x 20" x 36"'
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
                  <textarea
                    rows={4}
                    placeholder="Describe the furniture item..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Upload Images</label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-primary-500 transition-colors cursor-pointer">
                    <svg className="w-12 h-12 text-gray-400 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    <p className="text-gray-600 font-medium">Click to upload or drag and drop</p>
                    <p className="text-gray-400 text-sm mt-1">PNG, JPG or WEBP (max. 5 images)</p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={handleAddItem}
                    className="flex-1 bg-gradient-to-r from-primary-600 to-primary-700 text-white px-6 py-3 rounded-lg font-semibold hover:from-primary-700 hover:to-primary-800 transition-all shadow-lg hover:shadow-xl"
                  >
                    ✓ Add Item
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddItemModal(false)}
                    className="px-6 py-3 border-2 border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>

              {/* Existing Items Preview */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <h4 className="font-semibold text-gray-900 mb-4">Existing {selectedCategory.name} ({selectedCategory.items.length})</h4>
                <div className="grid grid-cols-3 gap-3 max-h-48 overflow-y-auto">
                  {selectedCategory.items.slice(0, 6).map((item, idx) => (
                    <div key={idx} className="relative group">
                      <img
                        src={item.images[0]}
                        alt={item.title}
                        className="w-full h-24 object-cover rounded-lg"
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/200x200/8B4513/FFFFFF?text=Item';
                        }}
                      />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                        <p className="text-white text-xs font-medium px-2 text-center">{item.title}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CarpenterDashboard;
