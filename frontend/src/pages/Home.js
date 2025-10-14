import React from 'react';
import { Link } from 'react-router-dom';
import { FaCouch, FaTruck, FaTools, FaShieldAlt } from 'react-icons/fa';

const Home = () => {
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-20">
        <div className="container-custom">
          <div className="max-w-3xl">
            <h1 className="text-5xl font-bold mb-6">
              Transform Your Space with Premium Furniture
            </h1>
            <p className="text-xl mb-8 text-gray-100">
              Discover handcrafted furniture from expert carpenters. Quality designs delivered to your doorstep.
            </p>
            <div className="flex space-x-4">
              <Link to="/catalogue" className="bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition">
                Shop Now
              </Link>
              <Link to="/register" className="border-2 border-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-primary-600 transition">
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-white">
        <div className="container-custom">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose FurniHome?</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaCouch className="text-primary-600 text-3xl" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Premium Quality</h3>
              <p className="text-gray-600">Handcrafted furniture from skilled carpenters</p>
            </div>
            
            <div className="text-center">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaTruck className="text-primary-600 text-3xl" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Fast Delivery</h3>
              <p className="text-gray-600">Quick and secure delivery to your location</p>
            </div>
            
            <div className="text-center">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaTools className="text-primary-600 text-3xl" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Custom Designs</h3>
              <p className="text-gray-600">Order custom furniture made to your specs</p>
            </div>
            
            <div className="text-center">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaShieldAlt className="text-primary-600 text-3xl" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Quality Guarantee</h3>
              <p className="text-gray-600">100% satisfaction with every purchase</p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 bg-gray-50">
        <div className="container-custom">
          <h2 className="text-3xl font-bold text-center mb-12">Shop by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {['chair', 'table', 'sofa', 'bed', 'cabinet', 'desk', 'shelf'].map((category) => (
              <Link 
                key={category}
                to={`/catalogue?category=${category}`}
                className="card hover:shadow-xl transition-shadow cursor-pointer"
              >
                <div className="h-40 bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center">
                  <span className="text-4xl capitalize">{category}</span>
                </div>
                <div className="p-4 text-center">
                  <h3 className="font-semibold capitalize">{category}s</h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary-600 text-white">
        <div className="container-custom text-center">
          <h2 className="text-3xl font-bold mb-4">Are You a Carpenter?</h2>
          <p className="text-xl mb-8">Join our platform and showcase your designs to thousands of customers</p>
          <Link to="/register" className="bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition inline-block">
            Join as Carpenter
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
