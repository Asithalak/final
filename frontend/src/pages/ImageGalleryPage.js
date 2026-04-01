import React, { useState, useEffect } from 'react';
import ImageGallery from '../components/ImageGallery';
import './ImageGalleryPage.css';

// Import images
import sofaImg1 from '../images/Sofas/image-1.jfif';
import sofaImg2 from '../images/Sofas/image-2.jfif';
import sofaImg3 from '../images/Sofas/image-3.jfif';
import sofaImg4 from '../images/Sofas/image-4.jfif';
import sofaImg5 from '../images/Sofas/image-5.jfif';

import chairImg1 from '../images/Chairs/image-1.jpg';
import chairImg2 from '../images/Chairs/image-2.webp';
import chairImg3 from '../images/Chairs/image-3.jfif';
import chairImg4 from '../images/Chairs/image-4.jpg';
import chairImg5 from '../images/Chairs/image-5.jpg';
import chairImg6 from '../images/Chairs/image-6.jfif';
import chairImg7 from '../images/Chairs/image-7.webp';
import chairImg8 from '../images/Chairs/image-8.avif';
import chairImg9 from '../images/Chairs/image-9.jpg';
import chairImg10 from '../images/Chairs/image-10.webp';

// Define all image collections
const imageCollections = {
  all: {
    name: 'All Furniture',
    images: []
  },
  sofas: {
    name: 'Sofas',
    images: [
      { src: sofaImg1, alt: 'Sofa 1', title: 'Modern Sofa', description: 'Comfortable and stylish' },
      { src: sofaImg2, alt: 'Sofa 2', title: 'Classic Sofa', description: 'Elegant design' },
      { src: sofaImg3, alt: 'Sofa 3', title: 'L-Shape Sofa', description: 'Perfect for living room' },
      { src: sofaImg4, alt: 'Sofa 4', title: 'Luxury Sofa', description: 'Premium quality' },
      { src: sofaImg5, alt: 'Sofa 5', title: 'Contemporary Sofa', description: 'Modern aesthetics' }
    ]
  },
  chairs: {
    name: 'Chairs',
    images: [
      { src: chairImg1, alt: 'Chair 1', title: 'Office Chair', description: 'Ergonomic design' },
      { src: chairImg2, alt: 'Chair 2', title: 'Dining Chair', description: 'Comfortable seating' },
      { src: chairImg3, alt: 'Chair 3', title: 'Accent Chair', description: 'Statement piece' },
      { src: chairImg4, alt: 'Chair 4', title: 'Lounge Chair', description: 'Relaxation at its best' },
      { src: chairImg5, alt: 'Chair 5', title: 'Modern Chair', description: 'Contemporary style' },
      { src: chairImg6, alt: 'Chair 6', title: 'Classic Chair', description: 'Timeless design' },
      { src: chairImg7, alt: 'Chair 7', title: 'Wooden Chair', description: 'Natural beauty' },
      { src: chairImg8, alt: 'Chair 8', title: 'Designer Chair', description: 'Unique aesthetics' },
      { src: chairImg9, alt: 'Chair 9', title: 'Comfort Chair', description: 'Plush seating' },
      { src: chairImg10, alt: 'Chair 10', title: 'Stylish Chair', description: 'Fashion forward' }
    ]
  }
};

// Combine all images
imageCollections.all.images = [
  ...imageCollections.sofas.images,
  ...imageCollections.chairs.images
];

const ImageGalleryPage = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const categories = [
    { id: 'all', label: 'All Furniture', icon: '🏠' },
    { id: 'sofas', label: 'Sofas', icon: '🛋️' },
    { id: 'chairs', label: 'Chairs', icon: '🪑' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Hero Section */}
      <div className="hero-section bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className={`text-5xl font-bold text-center mb-4 hero-title ${isVisible ? 'visible' : ''}`}>
            Furniture Gallery
          </h1>
          <p className={`text-xl text-center text-white/90 hero-subtitle ${isVisible ? 'visible' : ''}`}>
            Explore our stunning collection of premium furniture
          </p>
        </div>
      </div>

      {/* Category Filter */}
      <div className="sticky top-0 bg-white shadow-md z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-wrap justify-center gap-4">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`category-btn px-6 py-3 rounded-full font-semibold transition-all ${
                  activeCategory === category.id
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg active'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                <span className="mr-2">{category.icon}</span>
                {category.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Gallery Content */}
      <ImageGallery
        images={imageCollections[activeCategory].images}
        category={imageCollections[activeCategory].name}
      />

      {/* Stats Section */}
      <div className="bg-white py-16 mt-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className={`stat-item ${isVisible ? 'visible' : ''}`} style={{ animationDelay: '0s' }}>
              <div className="text-5xl font-bold text-blue-600 mb-2">15+</div>
              <div className="text-gray-600 text-lg">Premium Collections</div>
            </div>
            <div className={`stat-item ${isVisible ? 'visible' : ''}`} style={{ animationDelay: '0.1s' }}>
              <div className="text-5xl font-bold text-purple-600 mb-2">500+</div>
              <div className="text-gray-600 text-lg">Furniture Designs</div>
            </div>
            <div className={`stat-item ${isVisible ? 'visible' : ''}`} style={{ animationDelay: '0.2s' }}>
              <div className="text-5xl font-bold text-indigo-600 mb-2">100%</div>
              <div className="text-gray-600 text-lg">Quality Guaranteed</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageGalleryPage;
