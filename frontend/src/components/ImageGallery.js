import React, { useState, useEffect } from 'react';
import './ImageGallery.css';

const ImageGallery = ({ images, category }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Category Title */}
      <h2 className={`text-4xl font-bold text-center mb-12 text-gray-800 fade-in-up ${isVisible ? 'visible' : ''}`}>
        {category} Collection
      </h2>

      {/* Gallery Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {images.map((image, index) => (
          <div
            key={index}
            className={`gallery-item relative group cursor-pointer overflow-hidden rounded-xl shadow-lg bg-gray-100 ${isVisible ? 'visible' : ''}`}
            style={{ animationDelay: `${index * 0.1}s` }}
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
            onClick={() => setSelectedImage(image)}
          >
            {/* Image Container */}
            <div className="aspect-square overflow-hidden">
              <img
                src={image.src}
                alt={image.alt || `${category} ${index + 1}`}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
            </div>

            {/* Hover Overlay */}
            <div className={`overlay absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent flex items-end p-4 transition-opacity duration-300 ${hoveredIndex === index ? 'opacity-100' : 'opacity-0'}`}>
              <div className="text-white">
                <p className="font-semibold text-lg">{image.title || `Item ${index + 1}`}</p>
                {image.description && (
                  <p className="text-sm opacity-90">{image.description}</p>
                )}
              </div>
            </div>

            {/* View Icon */}
            <div className={`absolute top-4 right-4 bg-white rounded-full p-2 shadow-lg transition-all duration-300 ${hoveredIndex === index ? 'scale-100 opacity-100' : 'scale-0 opacity-0'}`}>
              <svg className="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div
          className="lightbox-modal fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setSelectedImage(null)}
        >
          <div
            className="lightbox-content relative max-w-6xl max-h-[90vh] animate-zoom-in"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={selectedImage.src}
              alt={selectedImage.alt}
              className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl"
            />
            
            {/* Close Button */}
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 transition-all hover:scale-110"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Image Info */}
            {selectedImage.title && (
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 rounded-b-lg">
                <h3 className="text-white text-2xl font-bold">{selectedImage.title}</h3>
                {selectedImage.description && (
                  <p className="text-white/90 mt-2">{selectedImage.description}</p>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageGallery;
