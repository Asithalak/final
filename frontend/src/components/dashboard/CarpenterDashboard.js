import React, { useState, useEffect } from 'react';
import { furnitureAPI, resourcesAPI, ordersAPI } from '../../services/api';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import catalogData from '../../data/furniture_catalog.json';

const CarpenterDashboard = () => {
  const navigate = useNavigate();
  const [furniture, setFurniture] = useState([]);
  const [resources, setResources] = useState([]);
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState('furniture');
  const [loading, setLoading] = useState(true);
  
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

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
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
      setFurniture(allCatalogFurniture);
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'furniture', label: 'My Furniture Designs', route: '/my-furniture-designs' },
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
     

      {/* Tabs */}
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
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold">My Furniture Designs Preview</h3>
                <div className="flex gap-3">
                  <button 
                    onClick={() => navigate('/my-furniture-designs')}
                    className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium"
                  >
                    View All Designs
                  </button>
                  <button 
                    onClick={() => toast.info('Upload functionality coming soon!')}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                  >
                    Upload New Design
                  </button>
                </div>
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

              {/* Category Summary Cards */}
              {furniture.length > 0 && (
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Designs by Category</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
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
                        className="bg-white rounded-xl p-4 shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer group border border-gray-100"
                      >
                        <div className={`w-12 h-12 bg-gradient-to-br ${category.color} rounded-lg flex items-center justify-center text-2xl mb-3 group-hover:scale-110 transition-transform shadow-lg`}>
                          {category.icon}
                        </div>
                        <p className="text-2xl font-bold text-gray-900 mb-1">{category.count}</p>
                        <p className="text-xs text-gray-600 font-medium">{category.name}</p>
                      </div>
                    ))}
                  </div>
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
    </div>
  );
};

export default CarpenterDashboard;
