import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { furnitureAPI } from '../services/api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import FurnitureCard from '../components/FurnitureCard';
import Loading from '../components/Loading';
import { toast } from 'react-toastify';
import { FaCouch } from 'react-icons/fa';

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
  const { isAuthenticated } = useAuth();

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

        {/* Results */}
        {/*
        <div className="mb-4">
          <p className="text-gray-600">
            Showing {furniture.length} {furniture.length === 1 ? 'item' : 'items'}
          </p>
        </div>

        {/* Furniture Grid */}
        {/*
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
        )}*/}
        {/* Categories */}
              <section className="py-16 bg-gray-50">
                <div className="container-custom">
                  <h2 className="text-3xl font-bold text-center mb-12">View by Category</h2>
                  
                  {isAuthenticated ? (
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                      {[
                        { name: 'chair', image: '/images/Chairs/image-1.jpg' },
                        { name: 'table', image: '/images/tables/image-1.jfif' },
                        { name: 'sofa', image: '/images/Sofas/image-1.jfif' },
                        { name: 'bed', image: '/images/Beds/image-1.jpg' },
                        { name: 'cabinet', image: '/images/Cabinets/image-1.jpg' },
                        { name: 'desk', image: '/images/Desks/image-1.jfif' },
                        { name: 'shelf', image: '/images/Shelfs/image-1.jpg' },
                      ].map((category) => (
                        <Link
                          key={category.name}
                          to={`/category/${category.name}`}
                          className="card hover:shadow-xl transition-shadow cursor-pointer overflow-hidden"
                        >
                          <div className="h-40 overflow-hidden">
                            <img
                              src={category.image}
                              alt={category.name}
                              className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                            />
                          </div>
                          <div className="p-4 text-center">
                            <h3 className="font-semibold capitalize">{category.name}s</h3>
                          </div>
                        </Link>
                      ))}
                    </div>
                 
                    
                  ) : (
                    <div className="text-center py-12 bg-white rounded-xl shadow-sm">
                      <FaCouch className="text-primary-300 text-6xl mx-auto mb-4" />
                      <p className="text-gray-500 text-lg mb-6">Please register or login to browse our furniture categories</p>
                      <div className="flex justify-center space-x-4">
                        <Link to="/login" className="px-8 py-3 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition">
                          Login
                        </Link>
                        <Link to="/register" className="px-8 py-3 border-2 border-primary-600 text-primary-600 rounded-lg font-semibold hover:bg-primary-50 transition">
                          Register
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              </section>
      </div>
    </div>
  );
};

export default Catalogue;
