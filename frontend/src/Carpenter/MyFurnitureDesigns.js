import React, { useState, useEffect, useMemo } from 'react';
import catalogData from '../data/furniture_catalog.json';

const Dashboard = () => {
  const [designs, setDesigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');

  const carpenterProfile = {
    name: 'Master Carpenter',
    specialization: 'Custom Furniture Design',
    experience: '10+ years',
    image: 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=400'
  };

  const allFurniture = useMemo(() => [
    ...catalogData.chairs,
    ...catalogData.tables,
    ...catalogData.sofas,
    ...catalogData.beds,
    ...catalogData.cabinets,
    ...catalogData.desks,
    ...catalogData.shelves
  ], []);

  useEffect(() => {
    setTimeout(() => {
      setDesigns(allFurniture);
      setLoading(false);
    }, 500);
  }, [allFurniture]);

  const filteredDesigns = designs.filter(design => {
    return activeCategory === 'all' || design.category === activeCategory;
  });

  const categories = [
    { id: 'all', label: 'All', icon: '🪑', count: allFurniture.length, color: 'from-purple-500 to-purple-700' },
    { id: 'chair', label: 'Chairs', icon: '🪑', count: catalogData.chairs.length, color: 'from-blue-500 to-blue-700' },
    { id: 'table', label: 'Tables', icon: '🪵', count: catalogData.tables.length, color: 'from-green-500 to-green-700' },
    { id: 'sofa', label: 'Sofas', icon: '🛋️', count: catalogData.sofas.length, color: 'from-red-500 to-red-700' },
    { id: 'bed', label: 'Beds', icon: '🛏️', count: catalogData.beds.length, color: 'from-indigo-500 to-indigo-700' },
    { id: 'cabinet', label: 'Cabinets', icon: '🗄️', count: catalogData.cabinets.length, color: 'from-yellow-500 to-yellow-700' },
    { id: 'desk', label: 'Desks', icon: '🖥️', count: catalogData.desks.length, color: 'from-teal-500 to-teal-700' },
    { id: 'shelf', label: 'Shelves', icon: '📚', count: catalogData.shelves.length, color: 'from-pink-500 to-pink-700' }
  ];

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen"><p>Loading...</p></div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
      <div className="bg-gradient-to-r from-amber-600 via-orange-600 to-red-600 shadow-2xl py-12">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-5xl font-bold text-white mb-4">🔨 {carpenterProfile.name}</h1>
          <p className="text-xl text-white">{carpenterProfile.specialization}</p>
          <p className="text-white">⭐ {carpenterProfile.experience} | 🎨 {designs.length} Designs</p>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-6">🏷️ Select Category</h2>
        <div className="grid grid-cols-4 md:grid-cols-8 gap-4 mb-8">
          {categories.map(cat => (
            <button key={cat.id} onClick={() => setActiveCategory(cat.id)} className={`p-4 rounded-xl text-white bg-gradient-to-br ${cat.color} ${activeCategory === cat.id ? 'ring-4' : ''}`}>
              <div className="text-3xl">{cat.icon}</div>
              <div className="text-xs font-bold">{cat.label}</div>
            </button>
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filteredDesigns.map(design => (
            <div key={design.id} className="bg-white rounded-2xl shadow-lg p-5">
              <img src={design.images[0]} alt={design.title} className="w-full h-48 object-cover rounded-lg mb-4" />
              <h3 className="text-xl font-bold mb-2">{design.title}</h3>
              <p className="text-gray-600 text-sm mb-4">{design.description}</p>
              <div className="grid grid-cols-2 gap-2 text-sm mb-4">
                <div><strong>Time:</strong> {design.work_duration}</div>
                <div><strong>Price:</strong> ${design.price}</div>
                <div><strong>Material:</strong> {design.wood_material}</div>
                <div><strong>Finish:</strong> {design.paint_code}</div>
              </div>
              <button className="w-full bg-primary-600 text-white py-2 rounded-lg font-bold hover:bg-primary-700 transition">View Details</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
