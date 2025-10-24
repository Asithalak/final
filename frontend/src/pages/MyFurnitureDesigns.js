import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import catalogData from '../data/furniture_catalog.json';
import { toast } from 'react-toastify';

const MyFurnitureDesigns = () => {
  const navigate = useNavigate();
  const [designs, setDesigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest');

  // Combine all furniture from catalog
  const allFurniture = [
    ...catalogData.chairs,
    ...catalogData.tables,
    ...catalogData.sofas,
    ...catalogData.beds,
    ...catalogData.cabinets,
    ...catalogData.desks,
    ...catalogData.shelves
  ];

  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      setDesigns(allFurniture);
      setLoading(false);
    }, 500);
  }, []);

  // Filter designs by category and search
  const filteredDesigns = designs.filter(design => {
    const matchesCategory = activeCategory === 'all' || design.category === activeCategory;
    const matchesSearch = design.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         design.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         design.wood_material.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Sort designs
  const sortedDesigns = [...filteredDesigns].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'name':
        return a.title.localeCompare(b.title);
      case 'duration':
        return parseInt(a.work_duration) - parseInt(b.work_duration);
      default:
        return 0;
    }
  });

  const categories = [
    { id: 'all', label: 'All Designs', count: allFurniture.length },
    { id: 'chair', label: 'Chairs', count: catalogData.chairs.length },
    { id: 'table', label: 'Tables', count: catalogData.tables.length },
    { id: 'sofa', label: 'Sofas', count: catalogData.sofas.length },
    { id: 'bed', label: 'Beds', count: catalogData.beds.length },
    { id: 'cabinet', label: 'Cabinets', count: catalogData.cabinets.length },
    { id: 'desk', label: 'Desks', count: catalogData.desks.length },
    { id: 'shelf', label: 'Shelves', count: catalogData.shelves.length }
  ];

  const handleViewDetails = (design) => {
    navigate(`/category/${design.category}`);
  };

  const handleEdit = (design, e) => {
    e.stopPropagation();
    toast.info(`Edit functionality coming soon for: ${design.title}`);
  };

  const handleDelete = (design, e) => {
    e.stopPropagation();
    toast.warning(`Delete functionality coming soon for: ${design.title}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your furniture designs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl shadow-xl p-8 mb-8 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">My Furniture Designs</h1>
              <p className="text-primary-100 text-lg">
                Browse and manage your complete furniture collection
              </p>
            </div>
            <button
              onClick={() => toast.info('Upload new design coming soon!')}
              className="bg-white text-primary-600 px-6 py-3 rounded-lg font-semibold hover:bg-primary-50 transition-colors shadow-lg"
            >
              <span className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Upload New Design
              </span>
            </button>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow p-4 text-center">
            <p className="text-3xl font-bold text-primary-600">{designs.length}</p>
            <p className="text-gray-600 text-sm">Total Designs</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4 text-center">
            <p className="text-3xl font-bold text-green-600">7</p>
            <p className="text-gray-600 text-sm">Categories</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4 text-center">
            <p className="text-3xl font-bold text-blue-600">
              ${Math.min(...designs.map(d => d.price))} - ${Math.max(...designs.map(d => d.price))}
            </p>
            <p className="text-gray-600 text-sm">Price Range</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4 text-center">
            <p className="text-3xl font-bold text-purple-600">{filteredDesigns.length}</p>
            <p className="text-gray-600 text-sm">Showing</p>
          </div>
        </div>

        {/* Filters & Search */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          {/* Search Bar */}
          <div className="mb-6">
            <div className="relative">
              <input
                type="text"
                placeholder="Search by name, description, or wood material..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
              <svg
                className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap gap-2 mb-6">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  activeCategory === cat.id
                    ? 'bg-primary-600 text-white shadow-lg scale-105'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {cat.label} ({cat.count})
              </button>
            ))}
          </div>

          {/* Sort Options */}
          <div className="flex items-center justify-between">
            <p className="text-gray-600">
              Showing <span className="font-semibold text-gray-900">{filteredDesigns.length}</span> designs
            </p>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="newest">Newest First</option>
              <option value="name">Name (A-Z)</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="duration">Work Duration</option>
            </select>
          </div>
        </div>

        {/* Furniture Grid */}
        {sortedDesigns.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedDesigns.map((design) => (
              <div
                key={design.id}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-2xl transition-all duration-300 cursor-pointer group"
                onClick={() => handleViewDetails(design)}
              >
                {/* Image Section */}
                <div className="relative h-64 bg-gray-100 overflow-hidden">
                  <img
                    src={design.images[0] || '/placeholder-furniture.jpg'}
                    alt={design.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/400x300/e5e7eb/6b7280?text=Furniture+Design';
                    }}
                  />
                  
                  {/* Price Badge */}
                  <div className="absolute top-3 right-3 bg-primary-600 text-white px-4 py-2 rounded-full font-bold shadow-lg">
                    ${design.price}
                  </div>

                  {/* Hover Overlay with Metadata */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                    <div className="flex flex-wrap gap-2 mb-2">
                      <span className="bg-amber-600/90 text-white px-3 py-1 rounded-full text-xs font-medium">
                        {design.wood_material}
                      </span>
                      <span className="bg-blue-600/90 text-white px-3 py-1 rounded-full text-xs font-medium">
                        {design.work_duration}
                      </span>
                      <span className="bg-green-600/90 text-white px-3 py-1 rounded-full text-xs font-medium">
                        {design.paint_code}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-5">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-lg font-bold text-gray-900 line-clamp-1">
                      {design.title}
                    </h3>
                    <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded text-xs font-medium capitalize">
                      {design.category}
                    </span>
                  </div>
                  
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {design.description}
                  </p>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleViewDetails(design);
                      }}
                      className="flex-1 bg-primary-50 text-primary-700 px-4 py-2 rounded-lg font-medium hover:bg-primary-100 transition-colors"
                    >
                      View Details
                    </button>
                    <button
                      onClick={(e) => handleEdit(design, e)}
                      className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                      title="Edit Design"
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button
                      onClick={(e) => handleDelete(design, e)}
                      className="bg-red-50 text-red-600 px-4 py-2 rounded-lg font-medium hover:bg-red-100 transition-colors"
                      title="Delete Design"
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <svg className="w-24 h-24 text-gray-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No designs found</h3>
            <p className="text-gray-600 mb-6">
              Try adjusting your filters or search terms
            </p>
            <button
              onClick={() => {
                setActiveCategory('all');
                setSearchQuery('');
              }}
              className="bg-primary-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-primary-700 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyFurnitureDesigns;
