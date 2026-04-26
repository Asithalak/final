import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { furnitureAPI } from '../services/api';
import './ShoppingGallery.css';

const ShoppingGallery = () => {
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedItem, setSelectedItem] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [priceFilter, setPriceFilter] = useState({ min: 0, max: 50000 });
  const [sortBy, setSortBy] = useState('latest');
  const { addToCart } = useCart();

  useEffect(() => {
    loadFurniture();
  }, []);

  useEffect(() => {
    filterAndSortItems();
  }, [items, activeCategory, searchTerm, priceFilter, sortBy]);

  const loadFurniture = async () => {
    try {
      setLoading(true);
      const response = await furnitureAPI.getAll();
      const furnitureList = response.data || [];
      
      setItems(furnitureList);
      
      // Extract unique categories
      const uniqueCategories = [...new Set(furnitureList.map(item => item.category))].filter(Boolean);
      setCategories(['all', ...uniqueCategories]);
      
      setLoading(false);
    } catch (error) {
      console.error('Error loading furniture:', error);
      setLoading(false);
    }
  };

  const filterAndSortItems = () => {
    let filtered = items;

    // Filter by category
    if (activeCategory !== 'all') {
      filtered = filtered.filter(item => item.category === activeCategory);
    }

    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(item =>
        item.name.toLowerCase().includes(term) ||
        (item.description && item.description.toLowerCase().includes(term))
      );
    }

    // Filter by price
    filtered = filtered.filter(item =>
      item.price >= priceFilter.min && item.price <= priceFilter.max
    );

    // Sort
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'name':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'latest':
      default:
        filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    setFilteredItems(filtered);
  };

  const handleAddToCart = (item, quantity = 1) => {
    addToCart({
      _id: item._id,
      name: item.name,
      price: item.price,
      image: item.images?.[0] || '/images/placeholder.jpg',
      description: item.description,
      category: item.category,
    }, quantity);
  };

  const renderItemCard = (item) => (
    <div key={item._id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all hover:-translate-y-1">
      {/* Image Container */}
      <div className="relative h-48 overflow-hidden bg-gray-200">
        <img
          src={item.images?.[0] || '/images/placeholder.jpg'}
          alt={item.name}
          className="w-full h-full object-cover hover:scale-110 transition-transform duration-300 cursor-pointer"
          onClick={() => setSelectedItem(item)}
          onError={(e) => {
            e.target.src = '/images/placeholder.jpg';
          }}
        />
        <div className="absolute top-3 right-3 bg-white rounded-full px-3 py-1 text-xs font-bold text-blue-600">
          {item.category}
        </div>
      </div>

      {/* Item Info */}
      <div className="p-4">
        <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-1 cursor-pointer hover:text-blue-600" onClick={() => setSelectedItem(item)}>
          {item.name}
        </h3>
        {item.description && (
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
            {item.description}
          </p>
        )}
        
        {/* Rating if available */}
        {item.averageRating && (
          <div className="flex items-center mb-3">
            <div className="flex text-yellow-400">
              {'⭐'.repeat(Math.floor(item.averageRating))}
            </div>
            <span className="text-xs text-gray-600 ml-2">({item.reviews?.length || 0})</span>
          </div>
        )}

        {/* Price and Actions */}
        <div className="border-t pt-3">
          <div className="flex justify-between items-center mb-3">
            <div>
              <p className="text-2xl font-bold text-blue-600">Rs.{item.price}</p>
              {item.originalPrice && item.originalPrice > item.price && (
                <p className="text-sm text-gray-500 line-through">Rs.{item.originalPrice}</p>
              )}
            </div>
            {item.availableQuantity ? (
              <span className="text-xs font-semibold bg-green-100 text-green-700 px-2 py-1 rounded">
                {item.availableQuantity} in stock
              </span>
            ) : (
              <span className="text-xs font-semibold bg-red-100 text-red-700 px-2 py-1 rounded">
                Out of stock
              </span>
            )}
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setSelectedItem(item)}
              className="flex-1 px-3 py-2 border-2 border-blue-600 text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-all text-sm"
            >
              👁️ View Details
            </button>
            <button
              onClick={() => handleAddToCart(item)}
              disabled={!item.availableQuantity}
              className={`flex-1 px-3 py-2 rounded-lg font-semibold transition-all text-sm ${
                item.availableQuantity
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              🛒 Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-5xl font-bold mb-4">🛍️ Shopping Gallery</h1>
          <p className="text-xl text-blue-100">Discover our exclusive collection of premium furniture</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Search and Filters Bar */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Search */}
            <div className="lg:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">🔍 Search</label>
              <input
                type="text"
                placeholder="Search furniture..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-600 focus:outline-none"
              />
            </div>

            {/* Sort */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">📊 Sort By</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-600 focus:outline-none"
              >
                <option value="latest">Latest</option>
                <option value="name">Name (A-Z)</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>

            {/* Price Filter */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">💰 Max Price: Rs.{priceFilter.max}</label>
              <input
                type="range"
                min="0"
                max="50000"
                step="1000"
                value={priceFilter.max}
                onChange={(e) => setPriceFilter({ ...priceFilter, max: parseInt(e.target.value) })}
                className="w-full"
              />
            </div>
          </div>
        </div>

        {/* Category Filter */}
        <div className="mb-8 pb-4 border-b-2">
          <div className="flex flex-wrap gap-3">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-6 py-3 rounded-full font-semibold transition-all ${
                  activeCategory === category
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'bg-white text-gray-700 border-2 border-gray-300 hover:border-blue-600'
                }`}
              >
                {category === 'all' ? '🏠 All' : category.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {/* Results Counter */}
        <div className="mb-6">
          <p className="text-gray-600 font-semibold">
            Showing {filteredItems.length} item{filteredItems.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Items Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="text-4xl mb-4">⏳</div>
            <p className="text-gray-600">Loading furniture...</p>
          </div>
        ) : filteredItems.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-12">
            {filteredItems.map(item => renderItemCard(item))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-xl">
            <div className="text-6xl mb-4">🔍</div>
            <p className="text-gray-600 text-lg">No furniture items found matching your criteria</p>
            <button
              onClick={() => {
                setSearchTerm('');
                setActiveCategory('all');
                setPriceFilter({ min: 0, max: 50000 });
              }}
              className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>

      {/* Item Detail Modal */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-indigo-600 p-6 rounded-t-2xl flex justify-between items-center">
              <h2 className="text-2xl font-bold text-white">{selectedItem.name}</h2>
              <button
                onClick={() => setSelectedItem(null)}
                className="text-white/80 hover:text-white text-2xl"
              >
                ✕
              </button>
            </div>

            <div className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                {/* Images */}
                <div>
                  <div className="bg-gray-200 rounded-xl overflow-hidden mb-4">
                    <img
                      src={selectedItem.images?.[0] || '/images/placeholder.jpg'}
                      alt={selectedItem.name}
                      className="w-full h-96 object-cover"
                      onError={(e) => {
                        e.target.src = '/images/placeholder.jpg';
                      }}
                    />
                  </div>
                  {selectedItem.images && selectedItem.images.length > 1 && (
                    <div className="grid grid-cols-4 gap-2">
                      {selectedItem.images.map((img, idx) => (
                        <img
                          key={idx}
                          src={img}
                          alt={`${selectedItem.name} ${idx + 1}`}
                          className="w-full h-20 object-cover rounded-lg cursor-pointer hover:opacity-80"
                          onError={(e) => {
                            e.target.src = '/images/placeholder.jpg';
                          }}
                        />
                      ))}
                    </div>
                  )}
                </div>

                {/* Details */}
                <div className="space-y-6">
                  {/* Category and Rating */}
                  <div className="flex items-center justify-between">
                    <span className="px-4 py-2 bg-blue-100 text-blue-700 rounded-full font-semibold text-sm">
                      {selectedItem.category}
                    </span>
                    {selectedItem.averageRating && (
                      <div className="flex items-center">
                        <span className="text-yellow-400">⭐ {selectedItem.averageRating.toFixed(1)}</span>
                        <span className="text-gray-600 ml-2">({selectedItem.reviews?.length || 0} reviews)</span>
                      </div>
                    )}
                  </div>

                  {/* Description */}
                  <div>
                    <h3 className="font-bold text-gray-900 mb-2">Description</h3>
                    <p className="text-gray-700 leading-relaxed">
                      {selectedItem.description || 'No description available'}
                    </p>
                  </div>

                  {/* Specifications */}
                  {selectedItem.specifications && Object.keys(selectedItem.specifications).length > 0 && (
                    <div>
                      <h3 className="font-bold text-gray-900 mb-3">Specifications</h3>
                      <div className="space-y-2">
                        {Object.entries(selectedItem.specifications).map(([key, value]) => (
                          <div key={key} className="flex justify-between text-sm">
                            <span className="text-gray-600 font-medium capitalize">{key}:</span>
                            <span className="text-gray-900">{value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Materials */}
                  {selectedItem.materials && selectedItem.materials.length > 0 && (
                    <div>
                      <h3 className="font-bold text-gray-900 mb-2">Materials</h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedItem.materials.map((material, idx) => (
                          <span key={idx} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                            {material}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Carpenter Info */}
                  {selectedItem.carpenter && (
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-600 mb-1">Crafted by</p>
                      <p className="font-bold text-gray-900">{selectedItem.carpenter.name || 'Unknown Carpenter'}</p>
                    </div>
                  )}

                  {/* Pricing and Stock */}
                  <div className="border-t-2 pt-6 space-y-4">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Price</p>
                      <div className="flex items-baseline gap-3">
                        <p className="text-4xl font-bold text-blue-600">Rs.{selectedItem.price}</p>
                        {selectedItem.originalPrice && selectedItem.originalPrice > selectedItem.price && (
                          <p className="text-lg text-gray-500 line-through">Rs.{selectedItem.originalPrice}</p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className={`px-4 py-2 rounded-full font-bold ${
                        selectedItem.availableQuantity
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-700'
                      }`}>
                        {selectedItem.availableQuantity ? `${selectedItem.availableQuantity} in stock` : 'Out of stock'}
                      </span>
                    </div>

                    {/* Add to Cart Button */}
                    <button
                      onClick={() => {
                        handleAddToCart(selectedItem);
                        setSelectedItem(null);
                      }}
                      disabled={!selectedItem.availableQuantity}
                      className={`w-full py-3 rounded-lg font-bold text-white transition-all text-lg ${
                        selectedItem.availableQuantity
                          ? 'bg-blue-600 hover:bg-blue-700'
                          : 'bg-gray-400 cursor-not-allowed'
                      }`}
                    >
                      {selectedItem.availableQuantity ? '🛒 Add to Cart' : '❌ Out of Stock'}
                    </button>
                  </div>
                </div>
              </div>

              {/* Additional Info */}
              {selectedItem.customizationAvailable && (
                <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
                  <p className="text-blue-900 font-semibold">✨ Customization Available</p>
                  <p className="text-blue-700 text-sm">You can customize this item to your preferences</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShoppingGallery;
