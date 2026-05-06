import React from 'react';
import { useNavigate } from 'react-router-dom';
import catalogData from '../data/furniture_catalog.json';

const Chairs = () => {
  const navigate = useNavigate();
  const chairs = catalogData.chairs || [];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Chairs</h1>
          <p className="text-gray-600">
            Discover our handcrafted chair collection - from ergonomic office chairs to elegant dining pieces
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {chairs.map(chair => (
            <div
              key={chair.id}
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow cursor-pointer"
              onClick={() => navigate(`/category/chair/${chair.id}`)}
            >
              <div className="relative h-64 overflow-hidden group">
                <img
                  src={chair.images[0]}
                  alt={chair.title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute top-4 right-4 bg-primary-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                  ${chair.price}
                </div>
              </div>
              
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {chair.title}
                </h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {chair.description}
                </p>
                
                <div className="flex flex-wrap gap-2">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800">
                    {chair.wood_material}
                  </span>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
                    {chair.work_duration}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Chairs;
