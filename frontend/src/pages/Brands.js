import React from 'react';

const Brands = () => {
  const brands = [
    { name: 'Modern Living', description: 'Contemporary furniture designs', logo: '🏠' },
    { name: 'Classic Wood', description: 'Traditional wooden furniture', logo: '🌳' },
    { name: 'Urban Style', description: 'Modern urban furniture', logo: '🏙️' },
    { name: 'Eco Furniture', description: 'Sustainable and eco-friendly', logo: '🌿' },
    { name: 'Luxury Line', description: 'Premium luxury furniture', logo: '👑' },
    { name: 'Minimalist Co', description: 'Simple and elegant designs', logo: '✨' },
  ];

  return (
    <div className="py-12 bg-gray-50 min-h-screen">
      <div className="container-custom">
        <h1 className="text-4xl font-bold mb-4 text-center">Our Brands</h1>
        <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
          Explore furniture from our curated collection of premium brands, each bringing unique style and quality to your home.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {brands.map((brand, index) => (
            <div key={index} className="card hover:shadow-xl transition-shadow cursor-pointer">
              <div className="p-8 text-center">
                <div className="text-6xl mb-4">{brand.logo}</div>
                <h3 className="text-xl font-bold mb-2">{brand.name}</h3>
                <p className="text-gray-600">{brand.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Brands;
