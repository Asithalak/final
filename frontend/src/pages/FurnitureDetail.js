import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { furnitureAPI } from '../services/api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import Loading from '../components/Loading';
import { toast } from 'react-toastify';
import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';

const FurnitureDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [furniture, setFurniture] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [review, setReview] = useState({ rating: 5, comment: '' });
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    fetchFurniture();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchFurniture = async () => {
    try {
      setLoading(true);
      const response = await furnitureAPI.getById(id);
      setFurniture(response.data);
    } catch (error) {
      toast.error('Failed to fetch furniture details');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    addToCart(furniture, quantity);
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.error('Please login to submit a review');
      navigate('/login');
      return;
    }

    try {
      await furnitureAPI.addReview(id, review);
      toast.success('Review submitted successfully');
      setReview({ rating: 5, comment: '' });
      fetchFurniture(); // Refresh to show new review
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit review');
    }
  };

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= rating) {
        stars.push(<FaStar key={i} className="text-yellow-500" />);
      } else if (i - 0.5 <= rating) {
        stars.push(<FaStarHalfAlt key={i} className="text-yellow-500" />);
      } else {
        stars.push(<FaRegStar key={i} className="text-yellow-500" />);
      }
    }
    return stars;
  };

  if (loading) return <Loading />;
  if (!furniture) return <div className="container-custom py-8">Furniture not found</div>;

  const imageUrl = furniture.images?.[0] 
    ? `http://localhost:5000/${furniture.images[0]}` 
    : 'https://via.placeholder.com/600x400?text=No+Image';

  return (
    <div className="py-8 bg-gray-50 min-h-screen">
      <div className="container-custom">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 bg-white p-8 rounded-xl shadow-md">
          {/* Image */}
          <div>
            <img 
              src={imageUrl} 
              alt={furniture.name}
              className="w-full h-96 object-cover rounded-lg"
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/600x400?text=No+Image';
              }}
            />
          </div>

          {/* Details */}
          <div>
            <h1 className="text-3xl font-bold mb-4">{furniture.name}</h1>
            
            <div className="flex items-center mb-4">
              <div className="flex">
                {renderStars(furniture.rating || 0)}
              </div>
              <span className="ml-2 text-gray-600">
                ({furniture.reviews?.length || 0} reviews)
              </span>
            </div>

            <p className="text-gray-700 mb-6">{furniture.description}</p>

            <div className="mb-6">
              <span className="text-4xl font-bold text-primary-600">${furniture.price}</span>
            </div>

            <div className="mb-6">
              <p className="text-sm text-gray-600 mb-2">
                <strong>Category:</strong> {furniture.category}
              </p>
              <p className="text-sm text-gray-600 mb-2">
                <strong>Stock:</strong> {furniture.stockQuantity > 0 ? `${furniture.stockQuantity} available` : 'Out of stock'}
              </p>
              {furniture.brand && (
                <p className="text-sm text-gray-600 mb-2">
                  <strong>Brand:</strong> {furniture.brand}
                </p>
              )}
              <p className="text-sm text-gray-600">
                <strong>Materials:</strong> {furniture.materials?.join(', ')}
              </p>
            </div>

            {furniture.stockQuantity > 0 && (
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
                <div className="flex items-center space-x-4">
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="btn-secondary px-4 py-2"
                  >
                    -
                  </button>
                  <span className="text-xl font-semibold">{quantity}</span>
                  <button 
                    onClick={() => setQuantity(Math.min(furniture.stockQuantity, quantity + 1))}
                    className="btn-secondary px-4 py-2"
                  >
                    +
                  </button>
                </div>
              </div>
            )}

            <div className="flex space-x-4">
              {furniture.stockQuantity > 0 ? (
                <button onClick={handleAddToCart} className="btn-primary flex-1">
                  Add to Cart
                </button>
              ) : (
                <button disabled className="btn-secondary flex-1 opacity-50 cursor-not-allowed">
                  Out of Stock
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mt-8 bg-white p-8 rounded-xl shadow-md">
          <h2 className="text-2xl font-bold mb-6">Customer Reviews</h2>

          {/* Review Form */}
          {isAuthenticated && (
            <form onSubmit={handleSubmitReview} className="mb-8 border-b pb-6">
              <h3 className="text-lg font-semibold mb-4">Write a Review</h3>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
                <select
                  value={review.rating}
                  onChange={(e) => setReview({ ...review, rating: Number(e.target.value) })}
                  className="input-field"
                >
                  <option value={5}>5 - Excellent</option>
                  <option value={4}>4 - Good</option>
                  <option value={3}>3 - Average</option>
                  <option value={2}>2 - Poor</option>
                  <option value={1}>1 - Terrible</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Comment</label>
                <textarea
                  value={review.comment}
                  onChange={(e) => setReview({ ...review, comment: e.target.value })}
                  className="input-field"
                  rows="4"
                  required
                />
              </div>
              <button type="submit" className="btn-primary">Submit Review</button>
            </form>
          )}

          {/* Reviews List */}
          <div className="space-y-4">
            {furniture.reviews && furniture.reviews.length > 0 ? (
              furniture.reviews.map((r, index) => (
                <div key={index} className="border-b pb-4">
                  <div className="flex items-center mb-2">
                    <div className="flex">
                      {renderStars(r.rating)}
                    </div>
                    <span className="ml-2 font-medium">{r.user?.name || 'Anonymous'}</span>
                    <span className="ml-auto text-sm text-gray-500">
                      {new Date(r.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-gray-700">{r.comment}</p>
                </div>
              ))
            ) : (
              <p className="text-gray-500">No reviews yet. Be the first to review!</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FurnitureDetail;
