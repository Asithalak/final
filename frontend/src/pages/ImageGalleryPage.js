import React, { useState, useEffect } from 'react';
import ImageGallery from '../components/ImageGallery';
import './ImageGalleryPage.css';

// Import Sofas images
import sofaImg1 from '../images/Sofas/image-1.jfif';
import sofaImg2 from '../images/Sofas/image-2.jfif';
import sofaImg3 from '../images/Sofas/image-3.jfif';
import sofaImg4 from '../images/Sofas/image-4.jfif';
import sofaImg5 from '../images/Sofas/image-5.jfif';

// Import Chairs images
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

// Import Tables images
import tableImg1 from '../images/tables/image-1.jfif';
import tableImg2 from '../images/tables/image-2.jfif';
import tableImg3 from '../images/tables/image-3.jfif';
import tableImg4 from '../images/tables/image-4.jfif';
import tableImg5 from '../images/tables/image-5.jfif';
import tableImg6 from '../images/tables/image-6.jfif';
import tableImg7 from '../images/tables/image-7.jfif';
import tableImg8 from '../images/tables/image-8.jfif';
import tableImg9 from '../images/tables/images-9.jfif';
import tableImg10 from '../images/tables/image-10.jfif';

// Import Beds images
import bedImg1 from '../images/Beds/image-1.jpg';
import bedImg2 from '../images/Beds/image-2.jpg';
import bedImg3 from '../images/Beds/image-3.webp';
import bedImg4 from '../images/Beds/image-4.jfif';
import bedImg5 from '../images/Beds/image-5.jfif';
import bedImg6 from '../images/Beds/image-6.jfif';
import bedImg7 from '../images/Beds/image-7.jfif';
import bedImg8 from '../images/Beds/image-8.jfif';
import bedImg10a from '../images/Beds/image-10.avif';
import bedImg10b from '../images/Beds/images-10.jfif';

// Import Cabinets images
import cabinetImg1 from '../images/Cabinets/image-1.jpg';
import cabinetImg2 from '../images/Cabinets/image-2.webp';
import cabinetImg3 from '../images/Cabinets/image-3.avif';
import cabinetImg4 from '../images/Cabinets/image-4.avif';
import cabinetImg5 from '../images/Cabinets/image-5.jpg';
import cabinetImg6 from '../images/Cabinets/image-6.jpg';
import cabinetImg7 from '../images/Cabinets/image-7.webp';
import cabinetImg8 from '../images/Cabinets/image-8.jpg';
import cabinetImg9 from '../images/Cabinets/image-9.jpg';
import cabinetImg10 from '../images/Cabinets/image-10.jpg';

// Import Desks images
import deskImg1 from '../images/Desks/image-1.jfif';
import deskImg2 from '../images/Desks/image-2.jfif';
import deskImg3 from '../images/Desks/image-3.jfif';
import deskImg4 from '../images/Desks/image-4.webp';
import deskImg5 from '../images/Desks/image-5.jfif';
import deskImg6 from '../images/Desks/image-6.jfif';

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
  },
  tables: {
    name: 'Tables',
    images: [
      { src: tableImg1, alt: 'Table 1', title: 'Dining Table', description: 'Family gathering spot' },
      { src: tableImg2, alt: 'Table 2', title: 'Coffee Table', description: 'Living room essential' },
      { src: tableImg3, alt: 'Table 3', title: 'Study Table', description: 'Productive workspace' },
      { src: tableImg4, alt: 'Table 4', title: 'Side Table', description: 'Compact and functional' },
      { src: tableImg5, alt: 'Table 5', title: 'Console Table', description: 'Elegant entryway piece' },
      { src: tableImg6, alt: 'Table 6', title: 'Outdoor Table', description: 'Weather resistant' },
      { src: tableImg7, alt: 'Table 7', title: 'Glass Table', description: 'Modern elegance' },
      { src: tableImg8, alt: 'Table 8', title: 'Wooden Table', description: 'Natural warmth' },
      { src: tableImg9, alt: 'Table 9', title: 'Extendable Table', description: 'Flexible seating' },
      { src: tableImg10, alt: 'Table 10', title: 'Round Table', description: 'Perfect for conversation' }
    ]
  },
  beds: {
    name: 'Beds',
    images: [
      { src: bedImg1, alt: 'Bed 1', title: 'King Size Bed', description: 'Luxurious comfort' },
      { src: bedImg2, alt: 'Bed 2', title: 'Queen Bed', description: 'Perfect for couples' },
      { src: bedImg3, alt: 'Bed 3', title: 'Single Bed', description: 'Cozy and compact' },
      { src: bedImg4, alt: 'Bed 4', title: 'Platform Bed', description: 'Modern minimalist' },
      { src: bedImg5, alt: 'Bed 5', title: 'Canopy Bed', description: 'Romantic elegance' },
      { src: bedImg6, alt: 'Bed 6', title: 'Storage Bed', description: 'Space-saving solution' },
      { src: bedImg7, alt: 'Bed 7', title: 'Upholstered Bed', description: 'Soft and stylish' },
      { src: bedImg8, alt: 'Bed 8', title: 'Wooden Bed', description: 'Classic craftsmanship' },
      { src: bedImg10a, alt: 'Bed 10', title: 'Designer Bed', description: 'Unique aesthetic' },
      { src: bedImg10b, alt: 'Bed 10B', title: 'Luxury Bed', description: 'Ultimate comfort' }
    ]
  },
  cabinets: {
    name: 'Cabinets',
    images: [
      { src: cabinetImg1, alt: 'Cabinet 1', title: 'Kitchen Cabinet', description: 'Organized storage' },
      { src: cabinetImg2, alt: 'Cabinet 2', title: 'Display Cabinet', description: 'Showcase your treasures' },
      { src: cabinetImg3, alt: 'Cabinet 3', title: 'Media Cabinet', description: 'Entertainment center' },
      { src: cabinetImg4, alt: 'Cabinet 4', title: 'Filing Cabinet', description: 'Office essential' },
      { src: cabinetImg5, alt: 'Cabinet 5', title: 'Bathroom Cabinet', description: 'Toiletry storage' },
      { src: cabinetImg6, alt: 'Cabinet 6', title: 'Corner Cabinet', description: 'Space optimizer' },
      { src: cabinetImg7, alt: 'Cabinet 7', title: 'Glass Cabinet', description: 'Elegant display' },
      { src: cabinetImg8, alt: 'Cabinet 8', title: 'Wooden Cabinet', description: 'Traditional charm' },
      { src: cabinetImg9, alt: 'Cabinet 9', title: 'Modern Cabinet', description: 'Sleek design' },
      { src: cabinetImg10, alt: 'Cabinet 10', title: 'Vintage Cabinet', description: 'Timeless appeal' }
    ]
  },
  desks: {
    name: 'Desks',
    images: [
      { src: deskImg1, alt: 'Desk 1', title: 'Office Desk', description: 'Professional workspace' },
      { src: deskImg2, alt: 'Desk 2', title: 'Standing Desk', description: 'Ergonomic health' },
      { src: deskImg3, alt: 'Desk 3', title: 'Computer Desk', description: 'Tech-friendly design' },
      { src: deskImg4, alt: 'Desk 4', title: 'Writing Desk', description: 'Classic elegance' },
      { src: deskImg5, alt: 'Desk 5', title: 'L-Shaped Desk', description: 'Maximize space' },
      { src: deskImg6, alt: 'Desk 6', title: 'Corner Desk', description: 'Compact solution' }
    ]
  }
};

// Combine all images
imageCollections.all.images = [
  ...imageCollections.sofas.images,
  ...imageCollections.chairs.images,
  ...imageCollections.tables.images,
  ...imageCollections.beds.images,
  ...imageCollections.cabinets.images,
  ...imageCollections.desks.images
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
    { id: 'chairs', label: 'Chairs', icon: '🪑' },
    { id: 'tables', label: 'Tables', icon: '🪵' },
    { id: 'beds', label: 'Beds', icon: '🛏️' },
    { id: 'cabinets', label: 'Cabinets', icon: '🗄️' },
    { id: 'desks', label: 'Desks', icon: '💼' }
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
            Explore our stunning collection of premium furniture....
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
              <div className="text-5xl font-bold text-blue-600 mb-2">7</div>
              <div className="text-gray-600 text-lg">Furniture Categories</div>
            </div>
            <div className={`stat-item ${isVisible ? 'visible' : ''}`} style={{ animationDelay: '0.1s' }}>
              <div className="text-5xl font-bold text-purple-600 mb-2">50+</div>
              <div className="text-gray-600 text-lg">Premium Designs</div>
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
