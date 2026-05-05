import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { furnitureAPI } from '../services/api';

const CATEGORY_OPTIONS = [
  { value: 'all', label: 'All' },
  { value: 'bed', label: 'Bed' },
  { value: 'chair', label: 'Chair' },
  { value: 'desk', label: 'Desk' },
  { value: 'table', label: 'Table' },
  { value: 'sofa', label: 'Sofas' },
  { value: 'cabinet', label: 'Cabinets' },
  { value: 'other', label: 'Others' }
];

const normalizeCategory = (category = '') => {
  const normalized = String(category).trim().toLowerCase();
  if (normalized === 'sofas') return 'sofa';
  if (normalized === 'cabinets') return 'cabinet';
  if (normalized === 'others') return 'other';
  return normalized;
};

const MyFurnitureDesigns = () => {
  const { user } = useAuth();
  const [furnitureItems, setFurnitureItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedItem, setSelectedItem] = useState(null);

  const carpenterProfile = {
    name: user?.name || 'Master Carpenter',
    specialization: user?.specialization || 'Custom Furniture Design',
    experience: user?.experience || '10+ years',
  };

  useEffect(() => {
    loadFurnitureDesigns();
  }, []);

  const loadFurnitureDesigns = async () => {
    try {
      setLoading(true);
      // Fetch carpenter's own furniture designs
      const response = await furnitureAPI.getMyFurniture();
      setFurnitureItems(response.data || []);
      setLoading(false);
    } catch (error) {
      console.error('Error loading furniture designs:', error);
      setLoading(false);
    }
  };

  // Filter designs by category
  const filteredDesigns = activeCategory === 'all' 
    ? furnitureItems 
    : furnitureItems.filter(design => normalizeCategory(design.category) === activeCategory);

  // Helper to get category color
  const getCategoryColor = (category) => {
    const colors = {
      'chair': 'from-blue-500 to-blue-700',
      'table': 'from-green-500 to-green-700',
      'sofa': 'from-red-500 to-red-700',
      'bed': 'from-indigo-500 to-indigo-700',
      'cabinet': 'from-yellow-500 to-yellow-700',
      'desk': 'from-teal-500 to-teal-700',
      'shelf': 'from-pink-500 to-pink-700',
      'other': 'from-purple-500 to-purple-700'
    };
    return colors[category] || colors['other'];
  };

  // Helper to get image URL
  const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    if (imagePath.startsWith('http')) return imagePath;
    let normalizedPath = imagePath.replace(/\\/g, '/');
    if (!normalizedPath.startsWith('/')) {
      normalizedPath = '/' + normalizedPath;
    }
    return `http://localhost:8000${normalizedPath}`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your furniture designs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-600 via-orange-600 to-red-600 shadow-2xl py-12">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-5xl font-bold text-white mb-4">🔨 {carpenterProfile.name}</h1>
          <p className="text-xl text-white">{carpenterProfile.specialization}</p>
          <p className="text-white">⭐ {carpenterProfile.experience} | 🎨 {furnitureItems.length} Designs</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Category Filter */}
        {furnitureItems.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-6 text-gray-900">🏷️ Filter by Category</h2>
            <div className="flex flex-wrap gap-3">
              {CATEGORY_OPTIONS.map(category => {
                const categoryItems = category.value === 'all' 
                  ? furnitureItems 
                  : furnitureItems.filter(item => normalizeCategory(item.category) === category.value);
                const isActive = activeCategory === category.value;
                
                return (
                  <button
                    key={category.value}
                    onClick={() => setActiveCategory(category.value)}
                    className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                      isActive
                        ? `bg-gradient-to-br ${getCategoryColor(category.value)} text-white shadow-lg scale-105`
                        : 'bg-white text-gray-700 border-2 border-gray-200 hover:border-orange-500'
                    }`}
                  >
                    {category.value === 'all' 
                      ? `All (${furnitureItems.length})` 
                      : `${category.label} (${categoryItems.length})`
                    }
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Furniture Designs Grid */}
        {filteredDesigns.length > 0 ? (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredDesigns.map(design => (
                <div 
                  key={design._id} 
                  className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 group cursor-pointer"
                  onClick={() => setSelectedItem(design)}
                >
                  {/* Main Image */}
                  <div className="relative h-64 bg-gray-200 overflow-hidden">
                    {design.images && design.images.length > 0 ? (
                      <>
                        <img
                          src={getImageUrl(design.images[0])}
                          alt={design.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = '';
                            e.target.parentElement.innerHTML = '<div class="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center"><span class="text-6xl opacity-50">📦</span></div>';
                          }}
                        />
                        {design.images.length > 1 && (
                          <div className="absolute top-3 right-3 bg-black/70 text-white px-3 py-1 rounded-full text-sm font-semibold">
                            {design.images.length} images
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                        <span className="text-6xl opacity-50">📦</span>
                      </div>
                    )}
                  </div>

                  {/* Design Info */}
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">{design.name}</h3>
                        <span className={`inline-block px-4 py-1 rounded-full text-sm font-semibold text-white bg-gradient-to-r ${getCategoryColor(design.category)}`}>
                          {design.category ? design.category.charAt(0).toUpperCase() + design.category.slice(1) : 'Other'}
                        </span>
                      </div>
                    </div>

                    {design.description && (
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">{design.description}</p>
                    )}

                    <div className="grid grid-cols-2 gap-3 mb-4">
                      {design.timeRequired && (
                        <div className="bg-blue-50 rounded-lg p-3">
                          <p className="text-xs text-gray-600">⏱️ Time</p>
                          <p className="text-sm font-bold text-blue-700">{design.timeRequired}</p>
                        </div>
                      )}
                      {design.price && (
                        <div className="bg-green-50 rounded-lg p-3">
                          <p className="text-xs text-gray-600">💰 Price</p>
                          <p className="text-sm font-bold text-green-700">Rs.{design.price}</p>
                        </div>
                      )}
                    </div>

                    {design.materials && design.materials.length > 0 && (
                      <div className="mb-4">
                        <p className="text-xs font-semibold text-gray-700 mb-2">📦 Materials:</p>
                        <div className="flex flex-wrap gap-1">
                          {design.materials.slice(0, 3).map((material, idx) => (
                            <span key={idx} className="px-2 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-medium">
                              {material}
                            </span>
                          ))}
                          {design.materials.length > 3 && (
                            <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
                              +{design.materials.length - 3} more
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedItem(design);
                      }}
                      className="w-full bg-gradient-to-r from-orange-600 to-red-600 text-white py-2 rounded-lg font-bold hover:from-orange-700 hover:to-red-700 transition-all"
                    >
                      View All Images & Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <div className="text-6xl mb-4 opacity-50">📦</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No Furniture Designs Yet</h3>
            <p className="text-gray-600 mb-4">You haven't added any furniture designs yet.</p>
            <a 
              href="/carpenter/myresources"
              className="inline-block bg-gradient-to-r from-orange-600 to-red-600 text-white px-6 py-3 rounded-lg font-bold hover:from-orange-700 hover:to-red-700 transition-all"
            >
              Go to My Resources to Add Furniture
            </a>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {selectedItem && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          onClick={() => setSelectedItem(null)}
        >
          <div 
            className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="sticky top-0 bg-gradient-to-r from-orange-600 to-red-600 p-6 flex justify-between items-center rounded-t-2xl">
              <h2 className="text-3xl font-bold text-white">{selectedItem.name}</h2>
              <button
                onClick={() => setSelectedItem(null)}
                className="text-white text-3xl hover:opacity-80 transition-opacity"
              >
                ✕
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-8">
              {/* Image Gallery */}
              {selectedItem.images && selectedItem.images.length > 0 ? (
                <div className="mb-8">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">🖼️ Images ({selectedItem.images.length})</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    {selectedItem.images.slice(0, 5).map((image, idx) => (
                      <div key={idx} className="bg-gray-100 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all">
                        <img
                          src={getImageUrl(image)}
                          alt={`${selectedItem.name} ${idx + 1}`}
                          className="w-full h-40 object-cover hover:scale-105 transition-transform duration-300"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = '';
                            e.target.parentElement.innerHTML = '<div class="w-full h-40 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center"><span class="text-4xl opacity-50">📦</span></div>';
                          }}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="mb-8 bg-gray-100 rounded-lg h-40 flex items-center justify-center">
                  <span className="text-6xl opacity-50">📦</span>
                </div>
              )}

              {/* Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {/* Category */}
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6 border border-blue-200">
                  <p className="text-sm text-gray-600 mb-1">📁 Category</p>
                  <p className="text-2xl font-bold text-blue-700">
                    {selectedItem.category ? selectedItem.category.charAt(0).toUpperCase() + selectedItem.category.slice(1) : 'Other'}
                  </p>
                </div>

                {/* Price */}
                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-6 border border-green-200">
                  <p className="text-sm text-gray-600 mb-1">💰 Price</p>
                  <p className="text-2xl font-bold text-green-700">Rs.{selectedItem.price || 'N/A'}</p>
                </div>

                {/* Time Required */}
                {selectedItem.timeRequired && (
                  <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-6 border border-purple-200">
                    <p className="text-sm text-gray-600 mb-1">⏱️ Time Required</p>
                    <p className="text-2xl font-bold text-purple-700">{selectedItem.timeRequired}</p>
                  </div>
                )}

                {/* Stock Status */}
                <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg p-6 border border-yellow-200">
                  <p className="text-sm text-gray-600 mb-1">📦 Stock Status</p>
                  <p className="text-2xl font-bold text-yellow-700">
                    {selectedItem.stockQuantity > 0 ? 'Available' : 'Custom Order'}
                  </p>
                </div>
              </div>

              {/* Description */}
              {selectedItem.description && (
                <div className="mb-6">
                  <h4 className="text-lg font-bold text-gray-900 mb-3">📝 Description</h4>
                  <p className="text-gray-700 leading-relaxed">{selectedItem.description}</p>
                </div>
              )}

              {/* Materials */}
              {selectedItem.materials && selectedItem.materials.length > 0 && (
                <div className="mb-6">
                  <h4 className="text-lg font-bold text-gray-900 mb-3">🛠️ Required Materials</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedItem.materials.map((material, idx) => (
                      <span key={idx} className="px-4 py-2 bg-amber-100 text-amber-800 rounded-full font-medium border border-amber-300">
                        {material}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Close Button */}
              <button
                onClick={() => setSelectedItem(null)}
                className="w-full bg-gradient-to-r from-orange-600 to-red-600 text-white py-3 rounded-lg font-bold hover:from-orange-700 hover:to-red-700 transition-all text-lg"
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

export default MyFurnitureDesigns;
