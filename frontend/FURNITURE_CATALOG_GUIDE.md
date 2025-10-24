# Furniture Catalog System - Implementation Guide

## 📋 Overview

This furniture catalog system features:
- **7 furniture categories**: Chairs, Tables, Sofas, Beds, Cabinets, Desks, Shelves
- **5 items per category** with detailed metadata
- **5 images per item** with hover effects and lightbox
- **Advanced filtering & sorting** capabilities
- **Full accessibility** support (ARIA labels, keyboard navigation, alt text)
- **Responsive design** with Tailwind CSS

---

## 📁 Files Created

### 1. Data File
- **`/public/data/furniture_catalog.json`**
  - 35 furniture items (7 categories × 5 items)
  - Each item includes: id, title, description, price, wood_material, work_duration, paint_code, images array

### 2. Components
- **`/src/components/FurnitureGallery.js`**
  - Image carousel with 5 images
  - Hover arrow pointer (➤) with metadata overlay
  - Lightbox modal for full-size viewing
  - Thumbnail navigation
  - Keyboard accessible

### 3. Pages
- **`/src/pages/CategoryPage.js`** - Master category page with filters
- **`/src/pages/Chairs.js`** - Chair category page
- **`/src/pages/Tables.js`** - Table category page
- **`/src/pages/Sofas.js`** - Sofa category page
- **`/src/pages/Beds.js`** - Bed category page
- **`/src/pages/Cabinets.js`** - Cabinet category page
- **`/src/pages/Desks.js`** - Desk category page
- **`/src/pages/Shelves.js`** - Shelf category page

---

## 🚀 Setup Instructions

### Step 1: Import in App.js

Add these imports:
```javascript
import CategoryPage from './pages/CategoryPage';
import Chairs from './pages/Chairs';
import Tables from './pages/Tables';
import Sofas from './pages/Sofas';
import Beds from './pages/Beds';
import Cabinets from './pages/Cabinets';
import Desks from './pages/Desks';
import Shelves from './pages/Shelves';
```

### Step 2: Add Routes

Add these routes in your router:
```javascript
<Route path="/category/chair" element={<Chairs />} />
<Route path="/category/table" element={<Tables />} />
<Route path="/category/sofa" element={<Sofas />} />
<Route path="/category/bed" element={<Beds />} />
<Route path="/category/cabinet" element={<Cabinets />} />
<Route path="/category/desk" element={<Desks />} />
<Route path="/category/shelf" element={<Shelves />} />
<Route path="/category/:category" element={<CategoryPage />} />
```

### Step 3: Create Image Directories

Create these folders in `/public/images/furniture/`:
```
/public/images/furniture/
  ├── chairs/
  ├── tables/
  ├── sofas/
  ├── beds/
  ├── cabinets/
  ├── desks/
  └── shelves/
```

### Step 4: Add Placeholder Images

For each item, add 5 images following the naming convention:
```
chair-001-front.jpg
chair-001-side.jpg
chair-001-back.jpg
chair-001-detail.jpg
chair-001-lifestyle.jpg
```

Or use placeholder service temporarily:
```javascript
// In furniture_catalog.json, update image paths:
"images": [
  "https://via.placeholder.com/800x600/8B4513/FFFFFF?text=Front+View",
  "https://via.placeholder.com/800x600/8B4513/FFFFFF?text=Side+View",
  "https://via.placeholder.com/800x600/8B4513/FFFFFF?text=Back+View",
  "https://via.placeholder.com/800x600/8B4513/FFFFFF?text=Detail",
  "https://via.placeholder.com/800x600/8B4513/FFFFFF?text=Lifestyle"
]
```

---

## 🎨 Features Breakdown

### 1. Image Gallery Hover Effect

When hovering over the main image:
- **Arrow pointer** (➤) animates in with pulse effect
- **Metadata overlay** slides up from bottom
- **Gradient backdrop** for readability
- Shows: Wood material, work duration, price, paint code

### 2. Metadata Display

Each item shows:
- **Wood Material**: Oak, Walnut, Teak, Mahogany, etc.
- **Work Duration**: Production time (e.g., "5 days", "12 days")
- **Price**: USD pricing
- **Paint Code**: Hex color code with preview swatch

### 3. Filtering System

Filter by:
- **Search**: Title, description, or material
- **Wood Material**: Dropdown with all available materials
- **Work Duration**: Up to 5, 10, 15, or 20 days
- **Price Range**: $0-200, $200-500, $500-800, $800-1000, $1000+

### 4. Sorting Options

Sort by:
- Price (Low to High / High to Low)
- Duration (Shortest / Longest First)
- Name (A-Z / Z-A)
- Default order

### 5. Accessibility Features

✅ **Alt text** for all images (title + image number)
✅ **Keyboard navigation** (Tab, Enter, Space, Escape)
✅ **ARIA labels** for screen readers
✅ **Focus states** show same overlay as hover
✅ **Role attributes** for semantic HTML
✅ **Keyboard shortcuts**:
   - `Tab` - Navigate between thumbnails
   - `Enter/Space` - Select thumbnail or open lightbox
   - `Escape` - Close lightbox
   - `Arrow keys` - Navigate in lightbox (can be added)

---

## 💡 Usage Examples

### Using FurnitureGallery Component

```javascript
import FurnitureGallery from '../components/FurnitureGallery';
import catalogData from '../data/furniture_catalog.json';

function MyPage() {
  const item = catalogData.chairs[0];
  
  return (
    <div>
      <h1>{item.title}</h1>
      <FurnitureGallery item={item} />
    </div>
  );
}
```

### Loading Category Data

```javascript
import catalogData from '../data/furniture_catalog.json';

// Get all chairs
const chairs = catalogData.chairs;

// Get all tables
const tables = catalogData.tables;

// Filter by price
const affordableChairs = catalogData.chairs.filter(item => item.price < 200);

// Filter by material
const oakFurniture = catalogData.chairs.filter(item => item.wood_material === 'Oak');
```

### Custom Filtering

```javascript
const [filtered, setFiltered] = useState([]);

// Filter by multiple criteria
const applyFilters = () => {
  let result = catalogData.chairs;
  
  // Price range
  result = result.filter(item => item.price >= 100 && item.price <= 500);
  
  // Material
  result = result.filter(item => item.wood_material === 'Oak');
  
  // Duration
  result = result.filter(item => {
    const days = parseInt(item.work_duration.split(' ')[0]);
    return days <= 10;
  });
  
  setFiltered(result);
};
```

---

## 🎯 Quick Customization

### Change Arrow Icon

In `FurnitureGallery.js`, replace the arrow:
```javascript
// Current: Text arrow
<div className="text-4xl text-yellow-400 animate-pulse">➤</div>

// SVG arrow alternative:
<svg className="w-10 h-10 text-yellow-400 animate-pulse" viewBox="0 0 24 24" fill="currentColor">
  <path d="M5 12h14m-7-7l7 7-7 7"/>
</svg>
```

### Customize Color Scheme

Update Tailwind colors in `tailwind.config.js`:
```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9ff',
          600: '#2563eb',  // Change this
          700: '#1d4ed8',  // And this
        }
      }
    }
  }
}
```

### Add More Metadata Fields

In `furniture_catalog.json`, add new fields:
```json
{
  "id": "chair-001",
  "title": "Modern Ergonomic Chair",
  // ... existing fields ...
  "dimensions": "24\" W × 26\" D × 36\" H",
  "weight": "15 lbs",
  "warranty": "5 years",
  "inStock": true
}
```

Then display in `FurnitureGallery.js`:
```javascript
<div className="bg-gray-50 rounded-lg p-4">
  <div className="text-sm text-gray-600 mb-1">Dimensions</div>
  <div className="font-semibold text-gray-900">{item.dimensions}</div>
</div>
```

---

## 📊 Export Features

### CSV Export Function

```javascript
const exportToCSV = (category) => {
  const items = catalogData[category];
  const headers = ['ID', 'Title', 'Price', 'Material', 'Duration', 'Paint Code'];
  
  const csvContent = [
    headers.join(','),
    ...items.map(item => [
      item.id,
      `"${item.title}"`,
      item.price,
      item.wood_material,
      item.work_duration,
      item.paint_code
    ].join(','))
  ].join('\n');
  
  const blob = new Blob([csvContent], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${category}_catalog.csv`;
  link.click();
};
```

### JSON Export Function

```javascript
const exportToJSON = (category) => {
  const items = catalogData[category];
  const json = JSON.stringify(items, null, 2);
  
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${category}_catalog.json`;
  link.click();
};
```

---

## 🔧 Troubleshooting

### Images Not Loading

1. Check image paths in `furniture_catalog.json`
2. Verify images exist in `/public/images/furniture/`
3. Check browser console for 404 errors
4. Use placeholder URLs for testing

### Filter Not Working

1. Check filter state updates in `CategoryPage.js`
2. Verify data structure matches expected format
3. Console.log filtered results to debug

### Hover Effect Not Showing

1. Ensure parent element has `group` class
2. Check Tailwind CSS is properly configured
3. Verify `group-hover:` prefix in child elements

---

## 📱 Responsive Behavior

- **Mobile (< 768px)**: 1 column grid, stacked filters
- **Tablet (768px - 1024px)**: 2 column grid, 2-column filters
- **Desktop (> 1024px)**: 3 column grid, 5-column filters

---

## ⚡ Performance Tips

1. **Lazy load images**: Use `loading="lazy"` attribute
2. **Image optimization**: Compress images before upload
3. **Virtual scrolling**: For large catalogs (100+ items)
4. **Memoization**: Use `React.memo()` for FurnitureGallery
5. **Code splitting**: Lazy load category pages

---

## 🎨 UI/UX Enhancements

### Add to CategoryPage.js:

```javascript
// Breadcrumb navigation
<nav className="text-sm mb-4">
  <a href="/">Home</a> / <a href="/catalogue">Catalogue</a> / <span>Chairs</span>
</nav>

// Quick view button
<button className="quick-view-btn">Quick View</button>

// Wishlist toggle
<button className="wishlist-btn">
  <HeartIcon className={isFavorite ? 'text-red-500' : 'text-gray-400'} />
</button>

// Share button
<button className="share-btn">Share</button>
```

---

## 🚀 Next Steps

1. ✅ Add routes to App.js
2. ✅ Create image directories
3. ✅ Upload furniture images
4. ⏳ Test all categories
5. ⏳ Customize colors/styling
6. ⏳ Add admin export feature
7. ⏳ Implement cart functionality
8. ⏳ Add review system

---

## 📞 Support

For issues or questions:
- Check browser console for errors
- Verify all imports are correct
- Ensure Tailwind CSS is configured
- Test with placeholder images first

---

**Created by:** GitHub Copilot  
**Date:** October 24, 2025  
**Version:** 1.0.0
