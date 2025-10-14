import React from 'react';
import { Link } from 'react-router-dom';

const Offers = () => {
  const offers = [
    {
      title: '20% Off All Sofas',
      description: 'Limited time offer on our premium sofa collection',
      discount: '20%',
      validUntil: '2025-11-30',
      color: 'bg-primary-600'
    },
    {
      title: 'Buy 2 Get 1 Free',
      description: 'On selected chairs and dining tables',
      discount: 'BOGO',
      validUntil: '2025-11-25',
      color: 'bg-green-600'
    },
    {
      title: 'Free Delivery',
      description: 'On orders above $500',
      discount: 'FREE',
      validUntil: '2025-12-15',
      color: 'bg-blue-600'
    },
    {
      title: 'New Customer Discount',
      description: 'Get 15% off on your first order',
      discount: '15%',
      validUntil: 'Ongoing',
      color: 'bg-purple-600'
    },
  ];

  return (
    <div className="py-12 bg-gray-50 min-h-screen">
      <div className="container-custom">
        <h1 className="text-4xl font-bold mb-4 text-center">Special Offers</h1>
        <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
          Don't miss out on our exclusive deals and discounts on premium furniture.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {offers.map((offer, index) => (
            <div key={index} className="card overflow-hidden">
              <div className={`${offer.color} text-white p-6`}>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-2xl font-bold mb-2">{offer.title}</h3>
                    <p className="text-gray-100">{offer.description}</p>
                  </div>
                  <div className="text-4xl font-bold opacity-80">{offer.discount}</div>
                </div>
                <p className="mt-4 text-sm">Valid until: {offer.validUntil}</p>
              </div>
              <div className="p-4 bg-white">
                <Link to="/catalogue" className="btn-primary w-full text-center block">
                  Shop Now
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Newsletter */}
        <div className="bg-white rounded-xl shadow-md p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Subscribe to Our Newsletter</h2>
          <p className="text-gray-600 mb-6">Get exclusive offers and updates directly to your inbox</p>
          <div className="max-w-md mx-auto flex gap-4">
            <input 
              type="email" 
              placeholder="Enter your email"
              className="input-field flex-1"
            />
            <button className="btn-primary">Subscribe</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Offers;
