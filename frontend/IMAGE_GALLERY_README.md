# 🎨 Furniture Image Gallery - User Interface

මම ඔයාට **D:\final\frontend\src\images** folder එකේ තියන images වලට ලස්සන, modern user interface එකක් හදලා දීලා තියෙනවා!

## ✨ Features

### 1. **ImageGallery Component** (`src/components/ImageGallery.js`)
- 🖼️ Responsive grid layout (1-4 columns based on screen size)
- ✨ Smooth animations with Framer Motion
- 🔍 Hover effects with image zoom
- 💡 Lightbox/modal view for full-size images
- 📱 Mobile-friendly design
- 🎨 Modern gradient overlays

### 2. **ImageGalleryPage** (`src/pages/ImageGalleryPage.js`)
- 🏠 Hero section with gradient background
- 🔘 Category filter buttons (All, Sofas, Chairs)
- 📊 Stats section
- 🎯 Easy navigation between categories
- 🛋️ Currently includes Sofas & Chairs collections

## 🚀 How to Use

### Step 1: Install Dependencies
```bash
cd D:\final\frontend
npm install
```

මේකෙන් `framer-motion` package එක install වේවි (already added to package.json).

### Step 2: Start the Application
```bash
npm start
```

### Step 3: Access the Gallery
Browser එකේ navigate කරන්න:
```
http://localhost:3000/gallery
```

හෝ Navigation bar එකේ **"Gallery"** link එක click කරන්න.

## 📂 File Structure

```
frontend/
├── src/
│   ├── components/
│   │   └── ImageGallery.js          # Reusable gallery component
│   ├── pages/
│   │   └── ImageGalleryPage.js      # Main gallery page
│   ├── images/
│   │   ├── Sofas/                   # Sofa images
│   │   ├── Chairs/                  # Chair images
│   │   ├── Beds/                    # (can be added)
│   │   ├── Tables/                  # (can be added)
│   │   └── ...                      # Other categories
│   └── App.js                       # Updated with gallery route
```

## 🎨 Design Features

1. **Responsive Grid**
   - Mobile (1 column)
   - Tablet (2-3 columns)
   - Desktop (4 columns)

2. **Animations**
   - Fade-in on load
   - Scale on hover
   - Smooth transitions
   - Lightbox modal

3. **User Experience**
   - Click image to view full size
   - Category filtering
   - Smooth scrolling
   - Visual feedback

## 🔧 Customization

### Add More Categories

`ImageGalleryPage.js` file එකේ images import කරන්න:

```javascript
// Import new category images
import bedImg1 from '../images/Beds/image-1.jpg';
import bedImg2 from '../images/Beds/image-2.jpg';

// Add to imageCollections object
beds: {
  name: 'Beds',
  images: [
    { src: bedImg1, alt: 'Bed 1', title: 'King Size Bed', description: 'Luxurious comfort' },
    { src: bedImg2, alt: 'Bed 2', title: 'Queen Bed', description: 'Elegant design' }
  ]
}

// Add to categories array
{ id: 'beds', label: 'Beds', icon: '🛏️' }
```

### Change Styling

Tailwind CSS classes භාවිතා කරලා style කරන්න පුළුවන්:
- Colors: `from-blue-600`, `to-purple-600`
- Spacing: `gap-6`, `py-8`
- Text: `text-4xl`, `font-bold`

## 🎯 Navigation

Gallery page එක accessible වෙනවා:
- Desktop navbar: **Gallery** link
- Mobile menu: **Gallery** option
- Direct URL: `/gallery`

## 🛠️ Technologies Used

- ⚛️ React 18
- 🎭 Framer Motion (animations)
- 🎨 Tailwind CSS (styling)
- 🧭 React Router (navigation)

## 📱 Screenshots

Gallery එකේ තියෙනවා:
1. **Hero Section** - Welcome message with gradient
2. **Category Filters** - Easy switching between furniture types
3. **Image Grid** - Beautiful responsive layout
4. **Hover Effects** - Smooth image zoom and overlay
5. **Lightbox** - Full-screen image viewing
6. **Stats Section** - Collection information

## 🎉 Ready to Use!

Gallery page එක දැන්ම ready! Just:
1. `npm install` කරන්න
2. `npm start` කරන්න
3. `/gallery` visit කරන්න

Enjoy your beautiful furniture gallery! 🎨✨
