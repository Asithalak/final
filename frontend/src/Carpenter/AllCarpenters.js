import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { usersAPI, furnitureAPI, resourcesAPI } from '../services/api';
import { toast } from 'react-toastify';

const AllCarpenters = () => {
  const [carpenters, setCarpenters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCarpenter, setSelectedCarpenter] = useState(null);
  const [showDesignsModal, setShowDesignsModal] = useState(false);
  const [showResourcesModal, setShowResourcesModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSpecialization, setFilterSpecialization] = useState('all');
  const [carpenterDesigns, setCarpenterDesigns] = useState([]);
  const [carpenterResources, setCarpenterResources] = useState([]);
  const [loadingDesigns, setLoadingDesigns] = useState(false);
  const [loadingResources, setLoadingResources] = useState(false);

  useEffect(() => {
    loadCarpenters();
  }, []);

  const loadCarpenters = async () => {
    setLoading(true);
    try {
      // Fetch carpenters from API
      const response = await usersAPI.getCarpenters();
      if (response.data && response.data.length > 0) {
        // Map API data - designs and resources will be fetched when viewing
        const apiCarpenters = response.data.map((carpenter) => ({
          id: carpenter._id,
          _id: carpenter._id,
          name: carpenter.name || 'Unknown Carpenter',
          email: carpenter.email || 'N/A',
          phone: carpenter.phone || 'N/A',
          specialization: carpenter.specialization || 'General Furniture',
          experience: carpenter.experience || 2,
          rating: carpenter.rating || 4.5,
          completedOrders: carpenter.completedOrders || 0,
          bio: carpenter.bio || 'Skilled carpenter with expertise in quality furniture crafting.',
        }));
        setCarpenters(apiCarpenters);
      } else {
        setCarpenters([]);
        toast.info('No carpenters registered yet');
      }
    } catch (error) {
      console.error('Error loading carpenters:', error);
      toast.error('Failed to load carpenters');
      setCarpenters([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch designs for a specific carpenter from database
  const fetchCarpenterDesigns = async (carpenterId) => {
    setLoadingDesigns(true);
    setCarpenterDesigns([]);
    try {
      const response = await furnitureAPI.getByCarpenter(carpenterId);
      setCarpenterDesigns(response.data || []);
    } catch (error) {
      console.error('Error fetching carpenter designs:', error);
      setCarpenterDesigns([]);
    } finally {
      setLoadingDesigns(false);
    }
  };

  // Fetch resources for a specific carpenter from database
  const fetchCarpenterResources = async (carpenterId) => {
    setLoadingResources(true);
    setCarpenterResources([]);
    try {
      const response = await resourcesAPI.getByCarpenter(carpenterId);
      setCarpenterResources(response.data || []);
    } catch (error) {
      console.error('Error fetching carpenter resources:', error);
      setCarpenterResources([]);
    } finally {
      setLoadingResources(false);
    }
  };

  // Handle view designs button click
  const handleViewDesigns = (carpenter) => {
    setSelectedCarpenter(carpenter);
    setShowDesignsModal(true);
    fetchCarpenterDesigns(carpenter._id || carpenter.id);
  };

  // Handle view resources button click
  const handleViewResources = (carpenter) => {
    setSelectedCarpenter(carpenter);
    setShowResourcesModal(true);
    fetchCarpenterResources(carpenter._id || carpenter.id);
  };

  // Get unique specializations for filter
  const specializations = ['all', ...new Set(carpenters.map(c => c.specialization))];

  // Filter carpenters based on search and specialization
  const filteredCarpenters = carpenters.filter(carpenter => {
    const matchesSearch = carpenter.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          carpenter.specialization.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterSpecialization === 'all' || carpenter.specialization === filterSpecialization;
    return matchesSearch && matchesFilter;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 text-lg">Loading carpenters...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-red-500 rounded-2xl shadow-2xl p-8 mb-8">
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <h1 className="text-4xl md:text-5xl font-bold text-white">
                🔨 Our Expert Carpenters
              </h1>
              <span className="px-4 py-2 bg-white/20 text-white text-sm font-semibold rounded-full backdrop-blur-sm">
                👁️ Public Directory
              </span>
            </div>
            <p className="text-purple-100 text-lg max-w-2xl mx-auto">
              Discover skilled craftsmen ready to bring your furniture dreams to life. 
              Browse profiles, view designs, and find the perfect carpenter for your project.
            </p>
            <p className="text-purple-200 text-sm mt-3">
              ℹ️ This is a view-only directory. Carpenters manage their own designs and resources from their dashboard.
            </p>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6 text-center border-t-4 border-purple-500">
            <p className="text-3xl font-bold text-purple-600">{carpenters.length}</p>
            <p className="text-gray-600 text-sm">Total Carpenters</p>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6 text-center border-t-4 border-green-500">
            <p className="text-3xl font-bold text-green-600">
              {carpenters.reduce((sum, c) => sum + c.completedOrders, 0)}+
            </p>
            <p className="text-gray-600 text-sm">Orders Completed</p>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6 text-center border-t-4 border-yellow-500">
            <p className="text-3xl font-bold text-yellow-600">
              {(carpenters.reduce((sum, c) => sum + parseFloat(c.rating), 0) / carpenters.length).toFixed(1)}
            </p>
            <p className="text-gray-600 text-sm">Avg Rating</p>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6 text-center border-t-4 border-blue-500">
            <p className="text-3xl font-bold text-blue-600">
              {carpenters.reduce((sum, c) => sum + c.experience, 0)}+
            </p>
            <p className="text-gray-600 text-sm">Years Experience</p>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">🔍</span>
                <input
                  type="text"
                  placeholder="Search by name or specialization..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none transition-colors"
                />
              </div>
            </div>
            <div className="md:w-64">
              <select
                value={filterSpecialization}
                onChange={(e) => setFilterSpecialization(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none transition-colors bg-white"
              >
                {specializations.map(spec => (
                  <option key={spec} value={spec}>
                    {spec === 'all' ? '🏷️ All Specializations' : spec}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Carpenters Grid */}
        {filteredCarpenters.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCarpenters.map((carpenter) => (
              <div key={carpenter.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                {/* Card Header */}
                <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white text-3xl font-bold border-4 border-white/30">
                      {carpenter.name.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-white">{carpenter.name}</h3>
                      <p className="text-purple-100 text-sm">🔨 {carpenter.specialization}</p>
                      <div className="flex items-center gap-1 mt-1">
                        <span className="text-yellow-300">⭐</span>
                        <span className="text-white font-semibold">{carpenter.rating}</span>
                        <span className="text-purple-200 text-sm">({carpenter.completedOrders} orders)</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-6">
                  {/* Bio */}
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {carpenter.bio}
                  </p>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-3 gap-3 mb-4">
                    <div className="bg-purple-50 rounded-lg p-3 text-center">
                      <p className="text-xs text-gray-500">Experience</p>
                      <p className="text-lg font-bold text-purple-600">{carpenter.experience} yrs</p>
                    </div>
                    <div className="bg-green-50 rounded-lg p-3 text-center">
                      <p className="text-xs text-gray-500">Completed</p>
                      <p className="text-lg font-bold text-green-600">{carpenter.completedOrders}</p>
                    </div>
                    <div className="bg-blue-50 rounded-lg p-3 text-center">
                      <p className="text-xs text-gray-500">Rating</p>
                      <p className="text-lg font-bold text-blue-600">⭐ {carpenter.rating}</p>
                    </div>
                  </div>

                  {/* Contact Info */}
                  <div className="space-y-2 text-sm text-gray-600 mb-4 bg-gray-50 rounded-lg p-3">
                    <p className="flex items-center gap-2">
                      <span>📧</span>
                      <span className="truncate">{carpenter.email}</span>
                    </p>
                    <p className="flex items-center gap-2">
                      <span>📞</span>
                      <span>{carpenter.phone}</span>
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleViewDesigns(carpenter)}
                      className="flex-1 px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all text-sm shadow-md hover:shadow-lg"
                    >
                      🎨 View Designs
                    </button>
                    <button
                      onClick={() => handleViewResources(carpenter)}
                      className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all text-sm shadow-md hover:shadow-lg"
                    >
                      📦 Resources
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-md p-12 text-center">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No Carpenters Found</h3>
            <p className="text-gray-500 mb-4">Try adjusting your search or filter criteria</p>
            <button
              onClick={() => {
                setSearchTerm('');
                setFilterSpecialization('all');
              }}
              className="px-6 py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        )}

        {/* Back to Home */}
        <div className="mt-8 text-center">
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-8 py-3 bg-white text-gray-700 rounded-lg font-semibold hover:bg-gray-100 transition-colors shadow-md"
          >
            ← Back to Home
          </Link>
        </div>
      </div>

      {/* Designs Modal */}
      {showDesignsModal && selectedCarpenter && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6 rounded-t-2xl sticky top-0 z-10">
              <div className="flex justify-between items-center">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="text-2xl font-bold text-white">🎨 {selectedCarpenter.name}'s Designs</h3>
                    <span className="px-3 py-1 bg-white/20 text-white text-xs font-semibold rounded-full">👁️ View Only</span>
                  </div>
                  <p className="text-purple-100">{carpenterDesigns.length} furniture designs from database</p>
                </div>
                <button
                  onClick={() => {
                    setShowDesignsModal(false);
                    setSelectedCarpenter(null);
                    setCarpenterDesigns([]);
                  }}
                  className="text-white/80 hover:text-white bg-white/20 rounded-full p-2"
                >
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="p-6">
              {loadingDesigns ? (
                <div className="flex items-center justify-center py-12">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-purple-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading designs...</p>
                  </div>
                </div>
              ) : carpenterDesigns.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {carpenterDesigns.map((design) => (
                    <div key={design._id || design.id} className="border-2 border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-all hover:border-purple-300">
                      {design.images && design.images.length > 0 ? (
                        <img 
                          src={design.images[0]} 
                          alt={design.title || design.name} 
                          className="h-48 w-full object-cover"
                        />
                      ) : (
                        <div className="h-48 bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center text-6xl">
                          {design.category === 'chair' && '🪑'}
                          {design.category === 'table' && '🍽️'}
                          {design.category === 'sofa' && '🛋️'}
                          {design.category === 'bed' && '🛏️'}
                          {design.category === 'cabinet' && '🗄️'}
                          {design.category === 'desk' && '🖥️'}
                          {design.category === 'shelf' && '📚'}
                          {!['chair', 'table', 'sofa', 'bed', 'cabinet', 'desk', 'shelf'].includes(design.category) && '🪵'}
                        </div>
                      )}
                      <div className="p-4">
                        <h4 className="text-lg font-bold text-gray-900 mb-2">{design.title || design.name}</h4>
                        <div className="space-y-2 text-sm text-gray-600">
                          <p className="flex items-center gap-2">
                            <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded-full text-xs font-semibold capitalize">
                              {design.category}
                            </span>
                          </p>
                          {design.work_duration && <p>⏱️ Time: <span className="font-semibold">{design.work_duration}</span></p>}
                          {design.wood_material && <p>🪵 Material: <span className="font-semibold">{design.wood_material}</span></p>}
                          <p className="text-xl font-bold text-green-600">💰 ${design.price}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">🎨</div>
                  <p className="text-gray-500 text-lg">No designs added yet</p>
                  <p className="text-gray-400 text-sm mt-2">This carpenter hasn't added any furniture designs to the database</p>
                </div>
              )}

              <button
                onClick={() => {
                  setShowDesignsModal(false);
                  setSelectedCarpenter(null);
                  setCarpenterDesigns([]);
                }}
                className="w-full mt-6 px-6 py-3 border-2 border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Resources Modal */}
      {showResourcesModal && selectedCarpenter && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 rounded-t-2xl sticky top-0 z-10">
              <div className="flex justify-between items-center">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="text-2xl font-bold text-white">📦 {selectedCarpenter.name}'s Resources</h3>
                    <span className="px-3 py-1 bg-white/20 text-white text-xs font-semibold rounded-full">👁️ View Only</span>
                  </div>
                  <p className="text-blue-100">{carpenterResources.length} resources from database</p>
                </div>
                <button
                  onClick={() => {
                    setShowResourcesModal(false);
                    setSelectedCarpenter(null);
                    setCarpenterResources([]);
                  }}
                  className="text-white/80 hover:text-white bg-white/20 rounded-full p-2"
                >
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="p-6">
              {loadingResources ? (
                <div className="flex items-center justify-center py-12">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading resources...</p>
                  </div>
                </div>
              ) : carpenterResources.length > 0 ? (
                <div className="space-y-4">
                  {carpenterResources.map((resource) => (
                    <div key={resource._id || resource.id} className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl p-5 hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h4 className="text-xl font-bold text-gray-900">{resource.name}</h4>
                          {resource.type && (
                            <span className="text-sm text-blue-600 capitalize">{resource.type}</span>
                          )}
                        </div>
                        <span className={`px-3 py-1 rounded-lg text-sm font-semibold ${
                          resource.quantity > 0 
                            ? 'bg-green-500 text-white' 
                            : 'bg-red-500 text-white'
                        }`}>
                          {resource.quantity > 0 ? '✓ In Stock' : '✗ Out of Stock'}
                        </span>
                      </div>
                      <div className="grid grid-cols-3 gap-4">
                        <div className="bg-white rounded-lg p-3 text-center shadow-sm">
                          <p className="text-xs text-gray-500">Quantity</p>
                          <p className="text-lg font-bold text-gray-900">{resource.quantity} {resource.unit}</p>
                        </div>
                        <div className="bg-white rounded-lg p-3 text-center shadow-sm">
                          <p className="text-xs text-gray-500">Price/Unit</p>
                          <p className="text-lg font-bold text-green-600">${resource.pricePerUnit}</p>
                        </div>
                        <div className="bg-white rounded-lg p-3 text-center shadow-sm">
                          <p className="text-xs text-gray-500">Total Value</p>
                          <p className="text-lg font-bold text-indigo-600">${(resource.quantity * resource.pricePerUnit).toFixed(2)}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">📦</div>
                  <p className="text-gray-500 text-lg">No resources added yet</p>
                  <p className="text-gray-400 text-sm mt-2">This carpenter hasn't added any resources to the database</p>
                </div>
              )}

              <button
                onClick={() => {
                  setShowResourcesModal(false);
                  setSelectedCarpenter(null);
                  setCarpenterResources([]);
                }}
                className="w-full mt-6 px-6 py-3 border-2 border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
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

export default AllCarpenters;
