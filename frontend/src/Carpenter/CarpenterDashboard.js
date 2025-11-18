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

  const tabs = [   
    { id: 'furniture', label: 'My Furniture Designs', route: '/carpenter/myfurnituredesigns' },
    { id: 'resources', label: 'My Resources' , route: '/carpenter/myresources' },
    { id: 'orders', label: 'Assigned Orders' ,route: '/carpenter/assigneorders'},
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
                  Assign New Category 
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
       
        </div>

  );
  
};

export default CarpenterDashboard;
