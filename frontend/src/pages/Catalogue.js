import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { furnitureAPI } from '../services/api';
import Loading from '../components/Loading';
import { toast } from 'react-toastify';

const Catalogue = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [furniture, setFurniture] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: searchParams.get('category') || '',
    search: searchParams.get('search') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
  });
  const [activeCategory, setActiveCategory] = useState('all');

  // Categories data
  const categories = [
    { id: 'all', label: 'All', icon: '🏠', color: 'from-blue-500 to-blue-700' },
    { id: 'chair', label: 'Chairs', icon: '🪑', color: 'from-purple-500 to-purple-700' },
    { id: 'table', label: 'Tables', icon: '🪵', color: 'from-green-500 to-green-700' },
    { id: 'sofa', label: 'Sofas', icon: '🛋️', color: 'from-red-500 to-red-700' },
    { id: 'bed', label: 'Beds', icon: '🛏️', color: 'from-yellow-500 to-yellow-700' },
    { id: 'cabinet', label: 'Cabinets', icon: '🗄️', color: 'from-indigo-500 to-indigo-700' },
    { id: 'desk', label: 'Desks', icon: '🖥️', color: 'from-pink-500 to-pink-700' },
    { id: 'shelf', label: 'Shelves', icon: '📚', color: 'from-teal-500 to-teal-700' },
  ];

  // Filter furniture based on active category
  const filteredDesigns = activeCategory === 'all'
    ? furniture
    : furniture.filter(item => item.category === activeCategory);

  useEffect(() => {
    fetchFurniture();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  const fetchFurniture = async () => {
    try {
      setLoading(true);
      const params = {};
      if (filters.category) params.category = filters.category;
      if (filters.search) params.search = filters.search;
      if (filters.minPrice) params.minPrice = filters.minPrice;
      if (filters.maxPrice) params.maxPrice = filters.maxPrice;

      const response = await furnitureAPI.getAll(params);
      setFurniture(response.data);
    } catch (error) {
      toast.error('Failed to fetch furniture');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
    
    // Update URL params
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set(name, value);
    } else {
      newParams.delete(name);
    }
    setSearchParams(newParams);
  };

  const resetFilters = () => {
    setFilters({
      category: '',
      search: '',
      minPrice: '',
      maxPrice: '',
    });
    setSearchParams({});
  };

  if (loading) return <Loading />;

  return (
    <div className="py-8 bg-gray-50 min-h-screen">
      <div className="container-custom">
        <h1 className="text-4xl font-bold mb-8">Furniture Catalogue</h1>

        {/* Filters */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-xl font-semibold mb-4">Filters</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
              <input
                type="text"
                name="search"
                value={filters.search}
                onChange={handleFilterChange}
                placeholder="Search furniture..."
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <select
                name="category"
                value={filters.category}
                onChange={handleFilterChange}
                className="input-field"
              >
                <option value="">Select Category</option>
                <option value="chair">Chair</option>
                <option value="table">Table</option>
                <option value="sofa">Sofa</option>
                <option value="bed">Bed</option>
                <option value="cabinet">Cabinet</option>
                <option value="desk">Desk</option>
                <option value="shelf">Shelf</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Min Price</label>
              <input
                type="number"
                name="minPrice"
                value={filters.minPrice}
                onChange={handleFilterChange}
                placeholder="$0"
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Max Price</label>
              <input
                type="number"
                name="maxPrice"
                value={filters.maxPrice}
                onChange={handleFilterChange}
                placeholder="$10000"
                className="input-field"
              />
            </div>
          </div>
          
          <button onClick={resetFilters} className="btn-secondary mt-4">
            Reset Filters
          </button>
        </div>

        {/* Category Selection & Furniture Display */}
        <div className="max-w-7xl mx-auto px-4 py-8">
          <h2 className="text-2xl font-bold mb-6">🏷️ Select Category</h2>
          <div className="grid grid-cols-4 md:grid-cols-8 gap-4 mb-8">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`p-4 rounded-xl text-white bg-gradient-to-br ${cat.color} ${activeCategory === cat.id ? 'ring-4 ring-white' : ''}`}
              >
                <div className="text-3xl">{cat.icon}</div>
                <div className="text-xs font-bold">{cat.label}</div>
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {filteredDesigns.length > 0 ? (
              filteredDesigns.map(item => (
                <div key={item._id} className="bg-white rounded-2xl shadow-lg p-5">
                  <img
                    src={item.imageUrl || '/images/placeholder.jpg'}
                    alt={item.name}
                    className="w-full h-48 object-cover rounded-lg mb-4"
                  />
                  <h3 className="text-xl font-bold mb-2">{item.name}</h3>
                  <p className="text-gray-600 text-sm mb-4">{item.description}</p>
                  <div className="grid grid-cols-2 gap-2 text-sm mb-4">
                    <div><strong>Category:</strong> {item.category}</div>
                    <div><strong>Price:</strong> ${item.price}</div>
                    {item.material && <div><strong>Material:</strong> {item.material}</div>}
                    {item.stock !== undefined && <div><strong>Stock:</strong> {item.stock}</div>}
                  </div>
                  <button className="w-full bg-primary-600 text-white py-2 rounded-lg font-bold hover:bg-primary-700 transition">
                    View Details
                  </button>
                </div>
              ))
            ) : (
              <div className="col-span-3 text-center py-12">
                <p className="text-gray-500 text-lg">No furniture found in this category</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Catalogue;
