import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { furnitureAPI } from '../services/api';
import { useCart } from '../context/CartContext';
import FurnitureCard from '../components/FurnitureCard';
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
  
  const { addToCart } = useCart();

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
                <option value="">All Categories</option>
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

        {/* Results */}
        <div className="mb-4">
          <p className="text-gray-600">
            Showing {furniture.length} {furniture.length === 1 ? 'item' : 'items'}
          </p>
        </div>

        {/* Furniture Grid */}
        {furniture.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {furniture.map((item) => (
              <FurnitureCard 
                key={item._id} 
                furniture={item} 
                onAddToCart={addToCart}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No furniture found matching your criteria</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Catalogue;
