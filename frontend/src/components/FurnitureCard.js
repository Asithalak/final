import React from 'react';
import { Link } from 'react-router-dom';
import { FaStar } from 'react-icons/fa';

const FurnitureCard = ({ furniture, onAddToCart }) => {
  const imageUrl = furniture.images?.[0] 
    ? `http://localhost:5000/${furniture.images[0]}` 
    : 'https://via.placeholder.com/300x200?text=No+Image';

  return (
    <div className="card group">
      <div className="relative overflow-hidden h-48">
        <img 
          src={imageUrl} 
          alt={furniture.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/300x200?text=No+Image';
          }}
        />
        {furniture.stockQuantity === 0 && (
          <div className="absolute top-2 right-2 bg-red-600 text-white px-3 py-1 rounded-full text-sm">
            Out of Stock
          </div>
        )}
      </div>
      
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-2 truncate">
          {furniture.name}
        </h3>
        
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {furniture.description}
        </p>
        
        <div className="flex items-center mb-3">
          <div className="flex items-center text-yellow-500">
            <FaStar />
            <span className="ml-1 text-gray-700 text-sm">
              {furniture.rating?.toFixed(1) || '0.0'}
            </span>
          </div>
          <span className="text-gray-500 text-sm ml-2">
            ({furniture.reviews?.length || 0} reviews)
          </span>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-primary-600">
            ${furniture.price}
          </span>
          
          <div className="flex space-x-2">
            <Link 
              to={`/furniture/${furniture._id}`}
              className="btn-outline text-sm px-4 py-1"
            >
              View
            </Link>
            {furniture.stockQuantity > 0 && onAddToCart && (
              <button 
                onClick={() => onAddToCart(furniture)}
                className="btn-primary text-sm px-4 py-1"
              >
                Add to Cart
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FurnitureCard;
