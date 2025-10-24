import React, { useState } from 'react';

/**
 * FurnitureGallery Component
 * Features:
 * - Image carousel with 5 images per item
 * - Hover arrow pointer with metadata overlay
 * - Smooth animations and transitions
 * - Keyboard accessible
 * - Click to open lightbox modal
 */
const FurnitureGallery = ({ item }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxImage, setLightboxImage] = useState(null);

  if (!item || !item.images || item.images.length === 0) {
    return null;
  }

  const handleThumbnailClick = (index) => {
    setCurrentImageIndex(index);
  };

  const handleImageClick = (image) => {
    setLightboxImage(image);
    setLightboxOpen(true);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
    setLightboxImage(null);
  };

  const handleKeyDown = (e, callback) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      callback();
    }
  };

  return (
    <div className="furniture-gallery">
      {/* Main Image Display */}
      <div className="relative mb-4 group">
        <div 
          className="relative w-full h-96 bg-gray-100 rounded-lg overflow-hidden cursor-pointer"
          onClick={() => handleImageClick(item.images[currentImageIndex])}
          onKeyDown={(e) => handleKeyDown(e, () => handleImageClick(item.images[currentImageIndex]))}
          tabIndex={0}
          role="button"
          aria-label={`View ${item.title} - Image ${currentImageIndex + 1} in lightbox`}
        >
          <img
            src={item.images[currentImageIndex]}
            alt={`${item.title} - View ${currentImageIndex + 1}`}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          
          {/* Hover Overlay with Metadata */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 group-focus:opacity-100 transition-opacity duration-300 pointer-events-none">
            <div className="absolute bottom-0 left-0 right-0 p-6 text-white transform translate-y-4 group-hover:translate-y-0 group-focus:translate-y-0 transition-transform duration-300">
              <div className="flex items-start gap-3">
                {/* Arrow Pointer */}
                <div className="text-4xl text-yellow-400 animate-pulse" aria-hidden="true">
                  ➤
                </div>
                
                {/* Metadata */}
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-amber-600/90">
                      {item.wood_material}
                    </span>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-blue-600/90">
                      {item.work_duration}
                    </span>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-green-600/90">
                      ${item.price}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-200">Paint Code:</span>
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-6 h-6 rounded border-2 border-white/50"
                        style={{ backgroundColor: item.paint_code }}
                        aria-label={`Paint color ${item.paint_code}`}
                      ></div>
                      <span className="font-mono text-sm">{item.paint_code}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Click to Expand Hint */}
          <div className="absolute top-4 right-4 bg-black/60 text-white px-3 py-1 rounded-full text-xs opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            Click to expand
          </div>
        </div>
      </div>

      {/* Thumbnail Gallery */}
      <div className="grid grid-cols-5 gap-2">
        {item.images.map((image, index) => (
          <div
            key={index}
            className="relative group/thumb"
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            <button
              onClick={() => handleThumbnailClick(index)}
              onKeyDown={(e) => handleKeyDown(e, () => handleThumbnailClick(index))}
              className={`w-full h-20 rounded-lg overflow-hidden border-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${
                currentImageIndex === index
                  ? 'border-primary-600 shadow-lg scale-105'
                  : 'border-gray-300 hover:border-primary-400 hover:scale-105'
              }`}
              aria-label={`View image ${index + 1} of ${item.title}`}
              aria-pressed={currentImageIndex === index}
            >
              <img
                src={image}
                alt={`${item.title} - Thumbnail ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </button>

            {/* Quick Info Badge on Hover */}
            {hoveredIndex === index && (
              <div className="absolute -top-16 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white px-3 py-2 rounded-lg shadow-xl text-xs whitespace-nowrap z-10 pointer-events-none animate-fadeIn">
                <div className="flex items-center gap-2">
                  <span>{item.wood_material}</span>
                  <span>•</span>
                  <span>{item.work_duration}</span>
                  <span>•</span>
                  <span>${item.price}</span>
                </div>
                {/* Arrow pointing down */}
                <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-gray-900 rotate-45"></div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      {lightboxOpen && (
        <div 
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4 animate-fadeIn"
          onClick={closeLightbox}
          onKeyDown={(e) => {
            if (e.key === 'Escape') closeLightbox();
          }}
          tabIndex={0}
          role="dialog"
          aria-modal="true"
          aria-label="Image lightbox"
        >
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors text-4xl font-light focus:outline-none focus:ring-2 focus:ring-white rounded-full p-2"
            aria-label="Close lightbox"
          >
            ×
          </button>
          
          <div className="relative max-w-5xl max-h-full" onClick={(e) => e.stopPropagation()}>
            <img
              src={lightboxImage}
              alt={`${item.title} - Full size view`}
              className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl"
            />
            
            {/* Navigation Arrows */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                const prevIndex = currentImageIndex === 0 ? item.images.length - 1 : currentImageIndex - 1;
                setCurrentImageIndex(prevIndex);
                setLightboxImage(item.images[prevIndex]);
              }}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white rounded-full p-3 transition-all focus:outline-none focus:ring-2 focus:ring-white"
              aria-label="Previous image"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            
            <button
              onClick={(e) => {
                e.stopPropagation();
                const nextIndex = currentImageIndex === item.images.length - 1 ? 0 : currentImageIndex + 1;
                setCurrentImageIndex(nextIndex);
                setLightboxImage(item.images[nextIndex]);
              }}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white rounded-full p-3 transition-all focus:outline-none focus:ring-2 focus:ring-white"
              aria-label="Next image"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>

            {/* Image Counter */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/60 text-white px-4 py-2 rounded-full text-sm">
              {currentImageIndex + 1} / {item.images.length}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FurnitureGallery;
