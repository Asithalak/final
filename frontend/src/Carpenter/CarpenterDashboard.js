import React, { useState, useEffect, useCallback } from 'react';
import { furnitureAPI, resourcesAPI, ordersAPI, usersAPI } from '../services/api';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import catalogData from '../data/furniture_catalog.json';
import carpenterToolsImage from '../images/homepages/carpenter-work.jpg';

const CarpenterDashboard = () => {
  const navigate = useNavigate();
  // eslint-disable-next-line no-unused-vars
  const [furniture, setFurniture] = useState([]);
  // eslint-disable-next-line no-unused-vars
  const [resources, setResources] = useState([]);
  // eslint-disable-next-line no-unused-vars
  const [orders, setOrders] = useState([]);
  const [carpenters, setCarpenters] = useState([]);
  const [activeTab, setActiveTab] = useState('furniture');
  const [loading, setLoading] = useState(true);
  const [selectedCarpenter, setSelectedCarpenter] = useState(null);
  const [showDesignsModal, setShowDesignsModal] = useState(false);
  const [showResourcesModal, setShowResourcesModal] = useState(false);
  const [carpenterDesigns, setCarpenterDesigns] = useState([]);
  const [carpenterResources, setCarpenterResources] = useState([]);
  const [loadingDesigns, setLoadingDesigns] = useState(false);
  const [loadingResources, setLoadingResources] = useState(false);
  
  // Get authenticated user from context
  const { user } = useAuth();

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

  // Current carpenter data
  const [currentCarpenterData, setCurrentCarpenterData] = useState(null);
  const [currentCarpenterFurniture, setCurrentCarpenterFurniture] = useState([]);
  const [currentCarpenterResources, setCurrentCarpenterResources] = useState([]);
  const [loadingCurrentData, setLoadingCurrentData] = useState(false);

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
        const carpentersList = response.data || [];
        console.log('👥 All Registered Carpenters:', carpentersList.length);
        carpentersList.forEach((c, i) => {
          console.log(`  Carpenter ${i + 1}:`, {
            id: c._id,
            name: c.name,
            email: c.email,
            phone: c.phone,
            specialization: c.specialization,
            experience: c.experience
          });
        });
        setCarpenters(carpentersList);
      } catch (error) {
        console.error('Failed to fetch carpenters:', error);
        // Fallback to empty array if API fails
        setCarpenters([]);
      }
    };
    fetchCarpenters();
  }, []);

  // Fetch current user's carpenter data
  useEffect(() => {
    const fetchCurrentCarpenterData = async () => {
      try {
        setLoadingCurrentData(true);
        
        // Use user from context if available
        if (user) {
          setCurrentCarpenterData(user);
          
          // Fetch current carpenter's furniture
          try {
            const furnitureRes = await furnitureAPI.getMyFurniture();
            setCurrentCarpenterFurniture(furnitureRes.data || []);
          } catch (error) {
            console.log('Could not fetch furniture:', error);
            setCurrentCarpenterFurniture([]);
          }
          
          // Fetch current carpenter's resources
          try {
            const resourcesRes = await resourcesAPI.getMyResources();
            setCurrentCarpenterResources(resourcesRes.data || []);
          } catch (error) {
            console.log('Could not fetch resources:', error);
            setCurrentCarpenterResources([]);
          }
        } else {
          // Fallback: try to fetch from API
          try {
            const meResponse = await usersAPI.getMe();
            const currentUser = meResponse.data;
            setCurrentCarpenterData(currentUser);
            
            const furnitureRes = await furnitureAPI.getMyFurniture();
            setCurrentCarpenterFurniture(furnitureRes.data || []);
            
            const resourcesRes = await resourcesAPI.getMyResources();
            setCurrentCarpenterResources(resourcesRes.data || []);
          } catch (error) {
            console.log('Could not fetch current carpenter data:', error);
          }
        }
      } finally {
        setLoadingCurrentData(false);
      }
    };
    
    if (userRole === 'carpenter') {
      fetchCurrentCarpenterData();
    }
  }, [userRole, user]);

  // Fetch carpenter's designs when View Designs is clicked
  const handleViewDesigns = async (carpenter) => {
    setSelectedCarpenter(carpenter);
    setShowDesignsModal(true);
    setLoadingDesigns(true);
    console.log('📋 Viewing designs for carpenter:', carpenter.name, 'ID:', carpenter._id);
    try {
      // Fetch furniture/designs created by this carpenter using dedicated endpoint
      const response = await furnitureAPI.getByCarpenter(carpenter._id);
      const designs = response.data || [];
      console.log('🎨 Carpenter Designs Data:', designs);
      designs.forEach((design, index) => {
        console.log(`  Design ${index + 1}:`, {
          name: design.name,
          category: design.category,
          price: design.price,
          description: design.description,
          id: design._id
        });
      });
      setCarpenterDesigns(designs);
    } catch (error) {
      console.error('Failed to fetch carpenter designs:', error);
      setCarpenterDesigns([]);
    } finally {
      setLoadingDesigns(false);
    }
  };

  // Fetch carpenter's resources when View Resources is clicked
  const handleViewResources = async (carpenter) => {
    setSelectedCarpenter(carpenter);
    setShowResourcesModal(true);
    setLoadingResources(true);
    console.log('📦 Viewing resources for carpenter:', carpenter.name, 'ID:', carpenter._id);
    try {
      // Fetch resources added by this carpenter using dedicated endpoint
      const response = await resourcesAPI.getByCarpenter(carpenter._id);
      const resources = response.data || [];
      console.log('📦 Carpenter Resources Data:', resources);
      resources.forEach((resource, index) => {
        console.log(`  Resource ${index + 1}:`, {
          name: resource.name,
          category: resource.category,
          quantity: resource.quantity,
          unit: resource.unit,
          price: resource.pricePerUnit || resource.price,
          id: resource._id
        });
      });
      setCarpenterResources(resources);
    } catch (error) {
      console.error('Failed to fetch carpenter resources:', error);
      setCarpenterResources([]);
    } finally {
      setLoadingResources(false);
    }
  };

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
    //{ id: 'carpenters', label: 'All Carpenters' }
     ,
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
    <div className="min-h-screen relative">
     
    {/* Content Container */}
      <div className="relative z-10 space-y-6 p-6">
      {/* Header Section with Role Info */}
      <div className="bg-gradient-to-r from-primary-600 via-primary-700 to-primary-800 rounded-2xl shadow-2xl overflow-hidden relative">
        {/* Background Image */}
        <div className="absolute inset-0 opacity-20">
          <img 
            src={carpenterToolsImage} 
            alt="Carpenter Tools" 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="p-8 relative z-10">
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
{/* Dashboard Content - Three Sections */}
      <div className="space-y-8">
        
        {/* SECTION 1: Carpenter Details */}
        {userRole === 'carpenter' && (
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-200 rounded-2xl overflow-hidden shadow-lg">
            <div className="bg-gradient-to-r from-amber-600 to-orange-600 p-6">
              <div className="flex items-center gap-3">
                <div className="text-4xl">🔨</div>
                <h2 className="text-2xl font-bold text-white">Carpenter Profile</h2>
              </div>
            </div>
            <div className="p-8">
              {loadingCurrentData ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600 mx-auto"></div>
                  <p className="mt-3 text-gray-600">Loading profile...</p>
                </div>
              ) : currentCarpenterData ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Left: Profile Info */}
                  <div className="space-y-4">
                    <div className="bg-white rounded-xl p-4 shadow-sm">
                      <p className="text-xs text-gray-500 font-medium mb-1">NAME</p>
                      <p className="text-2xl font-bold text-gray-900">{currentCarpenterData.name || 'Not Set'}</p>
                    </div>
                    
                    {currentCarpenterData.specialization && (
                      <div className="bg-white rounded-xl p-4 shadow-sm">
                        <p className="text-xs text-gray-500 font-medium mb-1">SPECIALIZATION</p>
                        <p className="text-lg font-semibold text-amber-700">🎯 {currentCarpenterData.specialization}</p>
                      </div>
                    )}
                    
                    {currentCarpenterData.experience !== undefined && (
                      <div className="bg-white rounded-xl p-4 shadow-sm">
                        <p className="text-xs text-gray-500 font-medium mb-1">EXPERIENCE</p>
                        <p className="text-lg font-semibold text-amber-700">⭐ {currentCarpenterData.experience} years</p>
                      </div>
                    )}
                  </div>
                  
                  {/* Right: Contact & Status */}
                  <div className="space-y-4">
                    {currentCarpenterData.email && (
                      <div className="bg-white rounded-xl p-4 shadow-sm">
                        <p className="text-xs text-gray-500 font-medium mb-1">EMAIL</p>
                        <p className="text-sm text-gray-700">📧 {currentCarpenterData.email}</p>
                      </div>
                    )}
                    
                    {currentCarpenterData.phone && (
                      <div className="bg-white rounded-xl p-4 shadow-sm">
                        <p className="text-xs text-gray-500 font-medium mb-1">PHONE</p>
                        <p className="text-sm text-gray-700">📞 {currentCarpenterData.phone}</p>
                      </div>
                    )}
                    
                    <div className="bg-white rounded-xl p-4 shadow-sm">
                      <p className="text-xs text-gray-500 font-medium mb-1">STATUS</p>
                      <div className="flex items-center gap-2">
                        <span className={`w-3 h-3 rounded-full ${currentCarpenterData.isApproved ? 'bg-green-500' : 'bg-yellow-500'}`}></span>
                        <p className="text-sm font-semibold text-gray-700">{currentCarpenterData.isApproved ? '✓ Approved' : '⏳ Pending Approval'}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-600">
                  <p>Could not load carpenter profile</p>
                </div>
              )}
            </div>
          </div>
        )}
        
        {/* SECTION 2: Available Materials & Resources */}
        {userRole === 'carpenter' && (
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-2xl overflow-hidden shadow-lg">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6">
              <div className="flex items-center gap-3">
                <div className="text-4xl">📦</div>
                <div>
                  <h2 className="text-2xl font-bold text-white">Available Materials & Resources</h2>
                  <p className="text-blue-100 text-sm mt-1">Inventory of raw materials you have in stock</p>
                </div>
              </div>
            </div>
            <div className="p-8">
              {loadingCurrentData ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="mt-3 text-gray-600">Loading resources...</p>
                </div>
              ) : currentCarpenterResources && currentCarpenterResources.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {currentCarpenterResources.map((resource, index) => (
                    <div key={resource._id || index} className="bg-white rounded-xl border-2 border-blue-100 p-6 hover:shadow-lg transition-all">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-lg font-bold text-gray-900">{resource.name}</h3>
                          <span className="inline-block mt-2 px-3 py-1 bg-indigo-100 text-indigo-700 text-xs font-bold rounded-full capitalize">
                            📂 {resource.type || 'Material'}
                          </span>
                        </div>
                        <span className={`px-3 py-1 rounded-lg text-xs font-bold ${resource.quantity > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                          {resource.quantity > 0 ? '✓ In Stock' : '✗ Out'}
                        </span>
                      </div>
                      
                      {resource.description && (
                        <p className="text-sm text-gray-600 mb-4 line-clamp-2">{resource.description}</p>
                      )}
                      
                      <div className="space-y-3 bg-gray-50 rounded-lg p-4 mb-4">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">📦 Quantity</span>
                          <span className="font-bold text-gray-900">{resource.quantity} {resource.unit}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">💵 Unit Price</span>
                          <span className="font-bold text-green-600">Rs.{resource.pricePerUnit || 0}</span>
                        </div>
                        <div className="border-t pt-3 flex justify-between items-center">
                          <span className="text-sm font-medium text-gray-700">💰 Total Value</span>
                          <span className="text-lg font-bold text-indigo-600">Rs.{(resource.quantity || 0) * (resource.pricePerUnit || 0)}</span>
                        </div>
                      </div>
                      
                      {resource.status && (
                        <div className="flex justify-between items-center pt-3 border-t">
                          <span className="text-xs text-gray-500">Status:</span>
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            resource.status === 'approved' ? 'bg-green-100 text-green-700' :
                            resource.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-gray-100 text-gray-700'
                          }`}>
                            {resource.status}
                          </span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 bg-white rounded-xl">
                  <div className="text-6xl mb-4">📦</div>
                  <p className="text-gray-600 text-lg font-medium">No resources added yet</p>
                  <p className="text-gray-500 text-sm mt-2">Start adding materials to your inventory</p>
                  <button 
                    onClick={() => navigate('/carpenter/myresources')}
                    className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition"
                  >
                    Add Resources
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
        
        {/* SECTION 3: Furniture Items */}
        {userRole === 'carpenter' && (
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200 rounded-2xl overflow-hidden shadow-lg">
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6">
              <div className="flex items-center gap-3">
                <div className="text-4xl">🪑</div>
                <div>
                  <h2 className="text-2xl font-bold text-white">My Furniture Designs</h2>
                  <p className="text-purple-100 text-sm mt-1">Furniture items you have created and listed</p>
                </div>
              </div>
            </div>
            <div className="p-8">
              {loadingCurrentData ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
                  <p className="mt-3 text-gray-600">Loading furniture...</p>
                </div>
              ) : currentCarpenterFurniture && currentCarpenterFurniture.length > 10 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {currentCarpenterFurniture.map((furniture, index) => (
                    <div key={furniture._id || index} className="bg-white rounded-xl border-2 border-purple-100 overflow-hidden hover:shadow-lg transition-all">
                      {/* Image Section */}
                      <div className="relative h-48 bg-gray-200 flex items-center justify-center overflow-hidden">
                        {furniture.images && furniture.images.length > 10 ? (
                          <img 
                            src={furniture.images[10].startsWith('http') ? furniture.images[10] : `http://localhost:5000${furniture.images[10]}`} 
                            alt={furniture.name} 
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.src = '🪑';
                              e.target.className = 'text-6xl';
                            }}
                          />
                        ) : (
                          <span className="text-6xl">🪑</span>
                        )}
                        {/* Category Badge */}
                        <span className="absolute top-3 left-3 px-3 py-1 bg-purple-600 text-white text-xs font-bold rounded-full uppercase">
                          {furniture.category}
                        </span>
                        {/* Stock Badge */}
                        <span className={`absolute top-3 right-3 px-2 py-1 rounded-lg text-xs font-bold ${
                          furniture.stockQuantity > 0 ? 'bg-green-500 text-white' : 'bg-orange-500 text-white'
                        }`}>
                          {furniture.stockQuantity > 0 ? `${furniture.stockQuantity} Stock` : 'Custom'}
                        </span>
                      </div>
                      
                      {/* Content Section */}
                      <div className="p-5">
                        <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">{furniture.name}</h3>
                        
                        {furniture.description && (
                          <p className="text-sm text-gray-600 mb-4 line-clamp-2">{furniture.description}</p>
                        )}
                        
                        <div className="space-y-2 bg-gray-50 rounded-lg p-3 mb-4">
                          <div className="flex justify-between items-center text-sm">
                            <span className="text-gray-600">💰 Price</span>
                            <span className="font-bold text-green-600">Rs.{furniture.price}</span>
                          </div>
                          
                          {furniture.materials && furniture.materials.length > 0 && (
                            <div className="flex justify-between items-start text-sm">
                              <span className="text-gray-600">🪵 Materials</span>
                              <span className="text-right text-gray-700 max-w-xs">{furniture.materials.join(', ')}</span>
                            </div>
                          )}
                          
                          {furniture.timeRequired && (
                            <div className="flex justify-between items-center text-sm">
                              <span className="text-gray-600">⏱️ Time</span>
                              <span className="text-gray-700">{furniture.timeRequired}</span>
                            </div>
                          )}
                          
                          {furniture.dimensions && (furniture.dimensions.length || furniture.dimensions.width || furniture.dimensions.height) && (
                            <div className="flex justify-between items-center text-sm border-t pt-2">
                              <span className="text-gray-600">📏 Dimensions</span>
                              <span className="text-gray-700">
                                {furniture.dimensions.length || 0}×{furniture.dimensions.width || 0}×{furniture.dimensions.height || 0} {furniture.dimensions.unit || 'cm'}
                              </span>
                            </div>
                          )}
                        </div>
                        
                        {furniture.status && (
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-500">Status:</span>
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              furniture.status === 'approved' ? 'bg-green-100 text-green-700' :
                              furniture.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                              'bg-gray-100 text-gray-700'
                            }`}>
                              {furniture.status}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 bg-white rounded-xl">
                  <div className="text-6xl mb-4">🪑</div>
                  <p className="text-gray-600 text-lg font-medium">No furniture designs yet</p>
                  <p className="text-gray-500 text-sm mt-2">Start creating your furniture designs</p>
                  <button 
                    onClick={() => navigate('/carpenter/myfurnituredesigns')}
                    className="mt-4 px-6 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition"
                  >
                    Add Furniture Design
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Tabs Section - For other roles or alternative view */}
      <div className="bg-white rounded-2xl shadow-md overflow-hidden rounded-lg p-4 mt-8">
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
        <div className="p-6">
            

        </div>
          
        {/* {activeTab === 'furniture' && (
          
          <div className="">
            {assignedCategories.map(catId => {
              const category = categories.find(c => c.id === catId);
              return category ? (
                <div key={category.id} className="">
                 
                    <img 
                      src={carpenterToolsImage} 
                      alt={`${category.name} - Carpenter Work`}
                      className="" 
                    />
                   
                  
                 
                </div>
              ) : null;
            })}
          </div>
        )}*/}


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
                        onClick={() => handleViewDesigns(carpenter)}
                        className="flex-1 px-3 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg text-sm font-medium hover:from-purple-700 hover:to-pink-700 transition-all"
                      >
                        👁️ View Designs
                      </button>
                      <button
                        onClick={() => handleViewResources(carpenter)}
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
              {loadingDesigns ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
                  <p className="mt-4 text-gray-600">Loading designs...</p>
                </div>
              ) : carpenterDesigns.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {carpenterDesigns.map((design, index) => {
                    // Log each design data for verification
                    console.log(`🎨 Design ${index + 1} Input Data:`, {
                      name: design.name,
                      category: design.category,
                      description: design.description,
                      price: design.price,
                      materials: design.materials,
                      timeRequired: design.timeRequired,
                      stockQuantity: design.stockQuantity,
                      brand: design.brand,
                      dimensions: design.dimensions,
                      images: design.images
                    });
                    
                    return (
                      <div key={design._id || index} className="border-2 border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-all">
                        <div className="h-48 bg-gray-200 flex items-center justify-center text-gray-400 overflow-hidden relative">
                          {design.images && design.images.length > 0 ? (
                            <img 
                              src={design.images[0].startsWith('http') ? design.images[0] : `http://localhost:8000${design.images[0].startsWith('/') ? '' : '/'}${design.images[0].replace(/\\/g, '/')}`} 
                              alt={design.name} 
                              className="w-full h-full object-cover" 
                            />
                          ) : (
                            <span className="text-4xl">🪑</span>
                          )}
                          {/* Category Badge on Image */}
                          {design.category && (
                            <span className="absolute top-2 left-2 px-3 py-1 bg-purple-600 text-white text-xs font-bold rounded-full uppercase">
                              {design.category}
                            </span>
                          )}
                          {/* Status Badge */}
                          <span className={`absolute top-2 right-2 px-2 py-1 text-xs font-bold rounded-full ${design.stockQuantity > 0 ? 'bg-green-500 text-white' : 'bg-orange-500 text-white'}`}>
                            {design.stockQuantity > 0 ? 'Available' : 'Custom Order'}
                          </span>
                        </div>
                        <div className="p-4">
                          <h4 className="text-lg font-bold text-gray-900 mb-3">{design.name}</h4>
                          
                          {/* All Input Data Display */}
                          <div className="space-y-2 text-sm text-gray-600">
                            <p className="flex items-center gap-2">
                              📂 <span className="font-medium">Category:</span> 
                              <span className="px-2 py-0.5 bg-purple-100 text-purple-700 rounded-full capitalize">{design.category || 'N/A'}</span>
                            </p>
                            
                            <p className="flex items-start gap-2">
                              📝 <span className="font-medium">Description:</span> 
                              <span className="text-gray-700">{design.description || 'N/A'}</span>
                            </p>
                            
                            <p className="flex items-center gap-2">
                              💰 <span className="font-medium">Price:</span> 
                              <span className="text-xl font-bold text-green-600">Rs.{design.price}</span>
                            </p>
                            
                            {design.materials && design.materials.length > 0 && (
                              <p className="flex items-start gap-2">
                                🪵 <span className="font-medium">Materials:</span> 
                                <span className="text-gray-700">{Array.isArray(design.materials) ? design.materials.join(', ') : design.materials}</span>
                              </p>
                            )}
                            
                            {design.timeRequired && (
                              <p className="flex items-center gap-2">
                                ⏱️ <span className="font-medium">Time Required:</span> 
                                <span className="text-gray-700">{design.timeRequired}</span>
                              </p>
                            )}
                            
                            {design.dimensions && (design.dimensions.length || design.dimensions.width || design.dimensions.height) && (
                              <p className="flex items-center gap-2">
                                📏 <span className="font-medium">Dimensions:</span> 
                                <span className="text-gray-700">
                                  {design.dimensions.length || 0} x {design.dimensions.width || 0} x {design.dimensions.height || 0} {design.dimensions.unit || 'cm'}
                                </span>
                              </p>
                            )}
                            
                            {design.brand && (
                              <p className="flex items-center gap-2">
                                🏷️ <span className="font-medium">Brand:</span> 
                                <span className="text-gray-700">{design.brand}</span>
                              </p>
                            )}
                            
                            <p className="flex items-center gap-2">
                              📦 <span className="font-medium">Stock:</span> 
                              <span className={`font-bold ${design.stockQuantity > 0 ? 'text-green-600' : 'text-orange-600'}`}>
                                {design.stockQuantity > 0 ? `${design.stockQuantity} in stock` : 'Custom Order'}
                              </span>
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-12 bg-gray-50 rounded-xl">
                  <div className="text-6xl mb-4">🎨</div>
                  <p className="text-gray-500 text-lg">No designs available yet</p>
                  <p className="text-gray-400 text-sm mt-2">This carpenter hasn't added any furniture designs</p>
                </div>
              )}

              <button
                onClick={() => {
                  setShowDesignsModal(false);
                  setSelectedCarpenter(null);
                  setCarpenterDesigns([]);
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
            {/*
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
                    setCarpenterResources([]);
                  }}
                  className="text-white/80 hover:text-white"
                >
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>*/}

            <div className="p-6">
              {loadingResources ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="mt-4 text-gray-600">Loading resources...</p>
                </div>
              ) : carpenterResources.length > 0 ? (
                <div className="space-y-4">
                  {carpenterResources.map((resource, index) => {
                    // Log each resource data for verification
                    console.log(`📦 Resource ${index + 1} Input Data:`, {
                      name: resource.name,
                      type: resource.type,
                      description: resource.description,
                      quantity: resource.quantity,
                      unit: resource.unit,
                      pricePerUnit: resource.pricePerUnit,
                      supplierName: resource.supplierName,
                      status: resource.status
                    });
                    
                    return (
                      <div key={resource._id || index} className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl p-5">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h4 className="text-xl font-bold text-gray-900">{resource.name}</h4>
                            {/* Type/Category Badge */}
                            {resource.type && (
                              <span className="inline-block mt-1 px-3 py-1 bg-indigo-600 text-white text-xs font-bold rounded-full uppercase">
                                📂 {resource.type}
                              </span>
                            )}
                          </div>
                          <span className={`px-3 py-1 rounded-lg text-sm font-semibold ${resource.quantity > 0 ? 'bg-green-600 text-white' : 'bg-red-600 text-white'}`}>
                            {resource.quantity > 0 ? '✓ In Stock' : '✗ Out of Stock'}
                          </span>
                        </div>
                        
                        {/* Description */}
                        {resource.description && (
                          <p className="text-gray-600 text-sm mb-4 bg-white/50 p-2 rounded-lg">
                            📝 {resource.description}
                          </p>
                        )}
                        
                        {/* Supplier Info */}
                        {resource.supplierName && (
                          <p className="text-sm text-gray-600 mb-3">
                            🏪 <span className="font-medium">Supplier:</span> {resource.supplierName}
                          </p>
                        )}
                        
                        {/* Data Grid - All Input Fields */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                          <div className="bg-white rounded-lg p-3 shadow-sm">
                            <p className="text-xs text-gray-500">📦 Quantity</p>
                            <p className="text-lg font-bold text-gray-900">{resource.quantity}</p>
                          </div>
                          <div className="bg-white rounded-lg p-3 shadow-sm">
                            <p className="text-xs text-gray-500">📏 Unit</p>
                            <p className="text-lg font-bold text-gray-900 capitalize">{resource.unit}</p>
                          </div>
                          <div className="bg-white rounded-lg p-3 shadow-sm">
                            <p className="text-xs text-gray-500">💵 Price/Unit</p>
                            <p className="text-lg font-bold text-green-600">Rs.{resource.pricePerUnit || resource.price}</p>
                          </div>
                          <div className="bg-white rounded-lg p-3 shadow-sm">
                            <p className="text-xs text-gray-500">💰 Total Value</p>
                            <p className="text-lg font-bold text-indigo-600">Rs.{resource.quantity * (resource.pricePerUnit || resource.price)}</p>
                          </div>
                        </div>
                        
                        {/* Status Badge */}
                        <div className="mt-3 pt-3 border-t border-blue-200">
                          <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                            resource.status === 'approved' ? 'bg-green-100 text-green-700' :
                            resource.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-gray-100 text-gray-700'
                          }`}>
                            Status: {resource.status || 'N/A'}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-12 bg-gray-50 rounded-xl">
                  <div className="text-6xl mb-4">📦</div>
                  <p className="text-gray-500 text-lg">No resources available yet</p>
                  <p className="text-gray-400 text-sm mt-2">This carpenter hasn't added any resources</p>
                </div>
              )}

              <button
                onClick={() => {
                  setShowResourcesModal(false);
                  setSelectedCarpenter(null);
                  setCarpenterResources([]);
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
    </div>
  );
  
};

export default CarpenterDashboard;
