import React, { useState, useEffect, useCallback } from 'react';
import { furnitureAPI, resourcesAPI, ordersAPI, usersAPI } from '../services/api';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import catalogData from '../data/furniture_catalog.json';

const CarpenterDashboard = () => {
  const navigate = useNavigate();
  const [furniture, setFurniture] = useState([]);
  const [resources, setResources] = useState([]);
  const [orders, setOrders] = useState([]);
  const [carpenters, setCarpenters] = useState([]);
  const [activeTab, setActiveTab] = useState('furniture');
  const [loading, setLoading] = useState(true);
  const [selectedCarpenter, setSelectedCarpenter] = useState(null);
  const [showDesignsModal, setShowDesignsModal] = useState(false);
  const [showResourcesModal, setShowResourcesModal] = useState(false);
  
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

  // Fetch all registered carpenters from the database
  useEffect(() => {
    const fetchCarpenters = async () => {
      try {
        const response = await usersAPI.getCarpenters();
        setCarpenters(response.data);
      } catch (error) {
        console.error('Failed to fetch carpenters:', error);
        // Fallback to empty array if API fails
        setCarpenters([]);
      }
    };
    fetchCarpenters();
  }, []);

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

  const tabs = [   
    { id: 'furniture', label: 'My Furniture Designs', route: '/carpenter/myfurnituredesigns' },
    { id: 'resources', label: 'My Resources' , route: '/carpenter/myresources' },
    { id: 'orders', label: 'Assigned Orders' ,route: '/carpenter/assigneorders'},
    { id: 'carpenters', label: 'All Carpenters' },
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
            
              <div className="bg-green-500/20 backdrop-blur-sm px-4 py-2 rounded-lg mt-4 inline-block">
                <button
                  onClick={() => handleTabClick({ id: 'assign-category', label: 'Assign New Category' })}
                  className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition"
                >
                  Assign New Category.
                </button> 
              </div>
            </div>
          )}
        </div>
      </div>
{/* Tabs Section */}
      <div className="bg-white rounded-2xl shadow-md overflow-hidden rounded-lg p-4">
        <div className="flex justify-center space-x-4">
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
         {/* Furniture Categories */}
        {activeTab === 'furniture' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 p-6">
            {assignedCategories.map(catId => {
              const category = categories.find(c => c.id === catId);
              return category ? (
                <div key={category.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 group">
                  <div className="relative h-80 overflow-hidden">
                    <img 
                      src="/images/carpenter-work.jpg" 
                      alt={`${category.name} - Carpenter Work`}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                    />
                  </div>
                </div>
              ) : null;
            })}
          </div>
        )}

        {/* All Carpenters Tab */}
        {activeTab === 'carpenters' && (
          <div className="p-6">
            <div className="bg-gradient-to-r from-purple-100 to-pink-100 border-2 border-purple-300 rounded-xl p-6 mb-6">
              <div className="flex items-start gap-4">
                <div className="text-4xl">👥</div>
                <div>
                  <h3 className="text-lg font-bold text-purple-900 mb-2">All Registered Carpenters</h3>
                  <p className="text-purple-800 text-sm">
                    View all carpenters registered on the platform. Connect with fellow craftsmen and explore their work.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {carpenters.length > 0 ? (
                carpenters.map((carpenter) => (
                  <div key={carpenter._id || carpenter.id} className="bg-white border-2 border-gray-200 rounded-xl p-6 hover:shadow-xl transition-all hover:border-purple-300">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                        {carpenter.name?.charAt(0) || 'C'}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-900">{carpenter.name}</h3>
                        <p className="text-sm text-gray-500 mt-1">🔨 Carpenter</p>
                      </div>
                    </div>
                    
                    {/* Carpenter Details - View Only */}
                    <div className="space-y-2 border-t pt-4">
                      {carpenter.specialization && (
                        <p className="text-sm text-gray-600">
                          🎯 <span className="font-medium">Specialization:</span> {carpenter.specialization}
                        </p>
                      )}
                      {carpenter.experience && (
                        <p className="text-sm text-gray-600">
                          📅 <span className="font-medium">Experience:</span> {carpenter.experience} years
                        </p>
                      )}
                      {carpenter.email && (
                        <p className="text-sm text-gray-600">
                          📧 <span className="font-medium">Email:</span> {carpenter.email}
                        </p>
                      )}
                      {carpenter.phone && (
                        <p className="text-sm text-gray-600">
                          📞 <span className="font-medium">Phone:</span> {carpenter.phone}
                        </p>
                      )}
                    </div>
                    
                    {/* View Designs and Resources Buttons */}
                    <div className="mt-4 pt-3 border-t flex gap-2">
                      <button
                        onClick={() => {
                          setSelectedCarpenter(carpenter);
                          setShowDesignsModal(true);
                        }}
                        className="flex-1 px-3 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg text-sm font-medium hover:from-purple-700 hover:to-pink-700 transition-all"
                      >
                        👁️ View Designs
                      </button>
                      <button
                        onClick={() => {
                          setSelectedCarpenter(carpenter);
                          setShowResourcesModal(true);
                        }}
                        className="flex-1 px-3 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg text-sm font-medium hover:from-blue-700 hover:to-indigo-700 transition-all"
                      >
                        📦 View Resources
                      </button>
                    </div>
                    
                    {/* View Only Badge */}
                    <div className="mt-3 text-center">
                      <span className="inline-block px-3 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                        👁️ View Only - No Edit Permission
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-3 text-center py-12 bg-gray-50 rounded-xl">
                  <div className="text-6xl mb-4">🔨</div>
                  <p className="text-gray-500 text-lg mb-2">No carpenters registered yet</p>
                  <p className="text-gray-400 text-sm">Be the first carpenter to register on the platform!</p>
                </div>
              )}
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
              {selectedCarpenter.designs && selectedCarpenter.designs.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {selectedCarpenter.designs.map((design, index) => (
                    <div key={design._id || index} className="border-2 border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-all">
                      <div className="h-48 bg-gray-200 flex items-center justify-center text-gray-400">
                        🪑 {design.category || 'Furniture'}
                      </div>
                      <div className="p-4">
                        <h4 className="text-lg font-bold text-gray-900 mb-2">{design.name}</h4>
                        <div className="space-y-1 text-sm text-gray-600">
                          <p>📂 Category: <span className="font-semibold">{design.category}</span></p>
                          <p>⏱️ Time: <span className="font-semibold">{design.timeRequired || 'N/A'}</span></p>
                          <p>💰 Price: <span className="text-lg font-bold text-green-600">${design.price}</span></p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-gray-50 rounded-xl">
                  <div className="text-6xl mb-4">🎨</div>
                  <p className="text-gray-500 text-lg">No designs available yet</p>
                </div>
              )}

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
              {selectedCarpenter.resources && selectedCarpenter.resources.length > 0 ? (
                <div className="space-y-4">
                  {selectedCarpenter.resources.map((resource, index) => (
                    <div key={resource._id || index} className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl p-5">
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
              ) : (
                <div className="text-center py-12 bg-gray-50 rounded-xl">
                  <div className="text-6xl mb-4">📦</div>
                  <p className="text-gray-500 text-lg">No resources available yet</p>
                </div>
              )}

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

  );
  
};

export default CarpenterDashboard;
