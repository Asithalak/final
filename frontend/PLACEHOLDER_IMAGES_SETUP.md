# Quick Start with Placeholder Images

If you don't have furniture images yet, use this updated catalog with placeholder images:

## Option 1: Use via.placeholder.com

Update your `furniture_catalog.json` images array for each item:

```json
"images": [
  "https://via.placeholder.com/800x600/8B4513/FFFFFF?text=Front+View",
  "https://via.placeholder.com/800x600/8B4513/FFFFFF?text=Side+View",
  "https://via.placeholder.com/800x600/8B4513/FFFFFF?text=Back+View",
  "https://via.placeholder.com/800x600/8B4513/FFFFFF?text=Detail+Shot",
  "https://via.placeholder.com/800x600/8B4513/FFFFFF?text=Lifestyle"
]
```

## Option 2: Use Unsplash (Real Furniture Images)

Replace image paths with Unsplash URLs:

### For Chairs:
```json
"images": [
  "https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1519947486511-46149fa0a254?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1581539250439-c96689b516dd?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1503602642458-232111445657?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=800&h=600&fit=crop"
]
```

### For Tables:
```json
"images": [
  "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1533090481720-856c6e3c1fdc?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=800&h=600&fit=crop"
]
```

### For Sofas:
```json
"images": [
  "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1540574163026-643ea20ade25?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1550581190-9c1c48d21d6c?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop"
]
```

### For Beds:
```json
"images": [
  "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1505693314120-0d443867891c?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1615873968403-89e068629265?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800&h=600&fit=crop"
]
```

### For Cabinets:
```json
"images": [
  "https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1595428773637-abd54c23055a?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1588854337115-1c67d9247e4d?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1487015307662-6ce6210680f1?w=800&h=600&fit=crop"
]
```

### For Desks:
```json
"images": [
  "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1611269154421-4e27233ac5c7?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1595515106969-1ce29566ff1c?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1632516643720-e7f5d7d6ecc9?w=800&h=600&fit=crop"
]
```

### For Shelves:
```json
"images": [
  "https://images.unsplash.com/photo-1594620302200-9a762244a156?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1565538810643-b5bdb714032a?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1574643156929-51fa098b0394?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1603380353725-f8a4d39cc41e?w=800&h=600&fit=crop"
]
```

## Option 3: Download Free Stock Images

Visit these sites and download furniture images:
- **Unsplash**: https://unsplash.com/s/photos/furniture
- **Pexels**: https://www.pexels.com/search/furniture/
- **Pixabay**: https://pixabay.com/images/search/furniture/

Then:
1. Create folders: `/public/images/furniture/chairs/`, etc.
2. Rename images to match catalog: `chair-001-front.jpg`, etc.
3. Update paths in `furniture_catalog.json`

## Testing the Gallery

After updating images, test with:

```javascript
// Quick test in browser console
import catalogData from './data/furniture_catalog.json';
console.log(catalogData.chairs[0].images);
```

Or add this test component:

```javascript
// src/components/ImageTest.js
import React from 'react';
import catalogData from '../data/furniture_catalog.json';

const ImageTest = () => {
  const testItem = catalogData.chairs[0];
  
  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-4">Image Test</h2>
      <div className="grid grid-cols-5 gap-4">
        {testItem.images.map((img, idx) => (
          <div key={idx}>
            <img src={img} alt={`Test ${idx + 1}`} className="w-full h-32 object-cover rounded" />
            <p className="text-xs mt-1">Image {idx + 1}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImageTest;
```

## Ready to Go! 🚀

Once images are set up, your furniture catalog will be fully functional with:
- ✅ Hover effects with arrow pointer
- ✅ Metadata overlays
- ✅ Lightbox galleries
- ✅ Filtering & sorting
- ✅ Full accessibility

Navigate to `/category/chair` to see it in action!
