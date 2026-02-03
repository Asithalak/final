import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import FurnitureGallery from '../components/FurnitureGallery';
import catalogData from '../data/furniture_catalog.json';

/**
 * CategoryPage Component
 * Dynamic page for displaying furniture by category
 * Features: Filtering, Sorting, Search, Responsive Grid
 */
const CategoryPage = () => {
  const { category } = useParams();
  // eslint-disable-next-line no-unused-vars
  const navigate = useNavigate();
  
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  
  // Filter states
  const [filters, setFilters] = useState({
    woodMaterial: 'all',
    maxDuration: 'all',
    priceRange: 'all',
    searchQuery: ''
  });
  
  // Sort state
  const [sortBy, setSortBy] = useState('default');

  // Load items when category changes
  useEffect(() => {
    loadCategoryItems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category]);

  // Apply filters and sorting when they change
  useEffect(() => {
    applyFiltersAndSort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items, filters, sortBy]);

  const loadCategoryItems = () => {
    const categoryKey = category ? `${category}s` : 'chairs'; // chairs, tables, etc.
    const categoryItems = catalogData[categoryKey] || [];
    setItems(categoryItems);
    
    // Auto-select first item
    if (categoryItems.length > 0) {
      setSelectedItem(categoryItems[0]);
    }
  };

  const applyFiltersAndSort = () => {
    let result = [...items];

    // Apply wood material filter
    if (filters.woodMaterial !== 'all') {
      result = result.filter(item => item.wood_material === filters.woodMaterial);
    }

    // Apply duration filter
    if (filters.maxDuration !== 'all') {
      const maxDays = parseInt(filters.maxDuration);
      result = result.filter(item => {
        const days = parseInt(item.work_duration.split(' ')[0]);
        return days <= maxDays;
      });
    }

    // Apply price range filter
    if (filters.priceRange !== 'all') {
      const [min, max] = filters.priceRange.split('-').map(Number);
      result = result.filter(item => {
        if (max) {
          return item.price >= min && item.price <= max;
        }
        return item.price >= min; // For 1000+ range
      });
    }

    // Apply search query
    if (filters.searchQuery.trim()) {
      const query = filters.searchQuery.toLowerCase();
      result = result.filter(item =>
        item.title.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query) ||
        item.wood_material.toLowerCase().includes(query)
      );
    }

    // Apply sorting
    switch (sortBy) {
      case 'price-low':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'duration-short':
        result.sort((a, b) => {
          const daysA = parseInt(a.work_duration.split(' ')[0]);
          const daysB = parseInt(b.work_duration.split(' ')[0]);
          return daysA - daysB;
        });
        break;
      case 'duration-long':
        result.sort((a, b) => {
          const daysA = parseInt(a.work_duration.split(' ')[0]);
          const daysB = parseInt(b.work_duration.split(' ')[0]);
          return daysB - daysA;
        });
        break;
      case 'name-az':
        result.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'name-za':
        result.sort((a, b) => b.title.localeCompare(a.title));
        break;
      default:
        // default order from JSON
        break;
    }

    setFilteredItems(result);
  };

  const handleFilterChange = (filterName, value) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: value
    }));
  };

  const resetFilters = () => {
    setFilters({
      woodMaterial: 'all',
      maxDuration: 'all',
      priceRange: 'all',
      searchQuery: ''
    });
    setSortBy('default');
  };

  // Get unique wood materials for filter dropdown
  const woodMaterials = [...new Set(items.map(item => item.wood_material))];

  const categoryTitle = category ? category.charAt(0).toUpperCase() + category.slice(1) + 's' : 'Chairs';

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">{categoryTitle}</h1>
          <p className="text-gray-600">
            Explore our collection of handcrafted {categoryTitle.toLowerCase()}
          </p>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-4">
            {/* Search */}
            <div className="lg:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search
              </label>
              <input
                type="text"
                placeholder="Search by name, material..."
                value={filters.searchQuery}
                onChange={(e) => handleFilterChange('searchQuery', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            {/* Wood Material Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Wood Material
              </label>
              <select
                value={filters.woodMaterial}
                onChange={(e) => handleFilterChange('woodMaterial', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="all">All Materials</option>
                {woodMaterials.map(material => (
                  <option key={material} value={material}>{material}</option>
                ))}
              </select>
            </div>

            {/* Duration Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Work Duration
              </label>
              <select
                value={filters.maxDuration}
                onChange={(e) => handleFilterChange('maxDuration', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="all">Any Duration</option>
                <option value="5">Up to 5 days</option>
                <option value="10">Up to 10 days</option>
                <option value="15">Up to 15 days</option>
                <option value="20">Up to 20 days</option>
              </select>
            </div>

            {/* Price Range Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price Range
              </label>
              <select
                value={filters.priceRange}
                onChange={(e) => handleFilterChange('priceRange', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="all">Any Price</option>
                <option value="0-200">$0 - $200</option>
                <option value="200-500">$200 - $500</option>
                <option value="500-800">$500 - $800</option>
                <option value="800-1000">$800 - $1,000</option>
                <option value="1000">$1,000+</option>
              </select>
            </div>
          </div>

          {/* Sort and Reset */}
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sort By
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="default">Default Order</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="duration-short">Duration: Shortest First</option>
                <option value="duration-long">Duration: Longest First</option>
                <option value="name-az">Name: A-Z</option>
                <option value="name-za">Name: Z-A</option>
              </select>
            </div>

            <div className="flex items-end gap-2">
              <button
                onClick={resetFilters}
                className="px-6 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg transition-colors"
              >
                Reset Filters
              </button>
              <div className="text-sm text-gray-600 py-2">
                Showing {filteredItems.length} of {items.length} items
              </div>
            </div>
          </div>
        </div>

        {/* Items Grid */}
        {filteredItems.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map(item => (
              <div
                key={item.id}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow cursor-pointer"
                onClick={() => setSelectedItem(item)}
              >
                <div className="relative h-64 overflow-hidden group">
                  <img
                    src={item.images[0]}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors"></div>
                </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {item.description}
                  </p>
                  
                  {/* Quick Info Badges */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800">
                      {item.wood_material}
                    </span>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
                      {item.work_duration}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-primary-600">
                      ${item.price}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedItem(item);
                      }}
                      className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors text-sm font-medium"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
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
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No items found</h3>
            <p className="text-gray-600 mb-4">
              Try adjusting your filters or search query
            </p>
            <button
              onClick={resetFilters}
              className="px-6 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors"
            >
              Clear All Filters
            </button>
          </div>
        )}

        {/* Item Detail Modal */}
        {selectedItem && (
          <div
            className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 animate-fadeIn"
            onClick={() => setSelectedItem(null)}
          >
            <div
              className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="sticky top-0 bg-white border-b z-10 px-6 py-4 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">{selectedItem.title}</h2>
                <button
                  onClick={() => setSelectedItem(null)}
                  className="text-gray-400 hover:text-gray-600 transition-colors text-3xl font-light"
                  aria-label="Close details"
                >
                  ×
                </button>
              </div>

              <div className="p-6">
                {/* Gallery */}
                <FurnitureGallery item={selectedItem} />

                {/* Details */}
                <div className="mt-6 space-y-4">
                  <p className="text-gray-700 text-lg">{selectedItem.description}</p>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="text-sm text-gray-600 mb-1">Wood Material</div>
                      <div className="font-semibold text-gray-900">{selectedItem.wood_material}</div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="text-sm text-gray-600 mb-1">Work Duration</div>
                      <div className="font-semibold text-gray-900">{selectedItem.work_duration}</div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="text-sm text-gray-600 mb-1">Price</div>
                      <div className="font-semibold text-green-600 text-xl">${selectedItem.price}</div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="text-sm text-gray-600 mb-1">Paint Code</div>
                      <div className="flex items-center gap-2">
                        <div
                          className="w-8 h-8 rounded border border-gray-300"
                          style={{ backgroundColor: selectedItem.paint_code }}
                        ></div>
                        <span className="font-mono text-sm">{selectedItem.paint_code}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-4 pt-4">
                    <button className="flex-1 px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors font-semibold">
                      Add to Cart
                    </button>
                    <button className="px-6 py-3 border-2 border-primary-600 text-primary-600 hover:bg-primary-50 rounded-lg transition-colors font-semibold">
                      Contact Carpenter
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryPage;
